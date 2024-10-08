# React


## 前言

最近学习 `React@18+` ，记录一些学习笔记，由官网和网络文章整理而来

通过此文，了解 `React` 的基本概念，以及 `React` 的 `hooks` 用法

- `useState`
- `useEffect`
- `useMemo`
- `useCallback`
- `useRef`
- `forwardRef`
- `useImpreativeHandle`
- `useReducer`


## React 概念理解


`React` 是一个用于构建用户界面的 `JavaScript` 库，当 `state` 或 `props` 发生变化时， `React` 会重新更新界面


### useState 组件状态

如果想要改变组件状态，需要使用 `useState` 来定义状态变量和修改状态的函数

- 修改变量只能使用返回的 `setCount` 函数，而不能直接修改变量
- 事件绑定使用 `onClick` 绑定， `{}` 表示传入变量

```jsx
const MyComponent = () => {
  const [count, setCount] = useState(0)
  const handleClick = () => {
    setCount(count + 1)
  }
  return (
    <button onClick={handleClick}>
      count: {count}
    </button>
  )
}
```

#### useState 是异步还是同步

`React@17` 和 `React@18` 当中略有些差别， `React@18` 中引入了批量异步处理，可以认为是 **异步**

而 `React@17` 当中就比较混乱，可以认为 **既是异步也是同步的**， 以下以 `React@17` 为例


##### React@17 中 useState 的异步场景


在 `setCount` 之后，立即获取 `count` 的值，会发现 `count` 的值还是之前的并没有立即改变，因为获取的仍是当前组件的一份快照，无论连续设置多少次仍是原来的值，并且会合并更新

```jsx
// 多次设置 获取的 count 仍是当前快照，并且最后会合并更新，即只更新一次
const handleClick = () => {
  setCount(count + 1) // 0 + 1
  setCount(count + 1) // 0 + 1
  setCount(count + 1) // 0 + 1
  console.log(count) // 0
}
```

如果想要获取最新值，可以传入函数来获取最新值，表示根据前一个值来计算

```jsx
// 传入函数，可拿到最新值 表示根据前一个值来计算
const handleClick = () => {
  setCount(prevCount => prevCount + 1)
  console.log(count) // 1
  setCount(prevCount => prevCount + 1)
  console.log(count) // 2
}
```


##### React@17 中 useState 的同步场景


此时你可以认为说 `setState` 是异步，但是这样的说法并不完全正确，因为 `setState` 在 `setTimeout` 、 `dom` 事件、 `React` 声明周期当中却是同步的

```jsx
// setTimeout
const handleClick = () => {
  setTimeout(() => {
    setCount(count + 1)
    console.log(count) // 1
  }, 0)
}

// dom 事件
document.body.addEventListener('click', () => {
  setCount(count + 1)
  console.log(count) // 1
})

// React 生命周期 - 类组件， React 需要根据最新的 state 来更新组件
shoulComponetUpdate(nextProps, nextState) {
  console.log(nextProps.count) // 1
  return true // 默认返回true
}

// 函数组件的生命周期则用 useEffect 来代替
useEffect(() => {
  console.log(count) // 1
})
```

###### React@17的 transaction 事务机制

这是因为 `React@17` 的 `setState` 当中存在 `batchUpdate` 机制，要看获取值时候是否在这个机制当中，即 `transaction` 事务机制

```js
transaction.initialize = () => {
  isBatchingUpdate = true
  console.log('initialize')
}
transaction.close = () => {
  isBatchingUpdates = false
  console.log('close')
}

const setStateFunc = () => {
  console.log('count')
}

transaction.perform(setStateFunc)
// initialize
// count
// close
```

即 `React@17` 在 `setState` 之前，会设置 `isBatchingUpdates = true` ， 在 `setState` 之后再置为 `false`

而 `setTimeout` 注册回调 和 `dom` 事件注册回调都是异步任务，所以 `isBatchingUpdates` 已经置为了 `false` ，类似以下伪代码

```js
// 伪代码
isBatchingUpdates = true // 标志当前处于批量更新状态

setTimeout(() => {
  // 异步，标志早已重置
  setCount(count + 1)
  console.log(count) // 1
}, 0)

isBatchingUpdates = false // 结束标志
```

所以说 `setState` **本质上是同步** 代码，但是 `React@17` 中刻意将其设计成 **异步** 的样子，即延迟到同一任务队列的最后执行，所以造成了我们通常将其理解成 **异步**

在传入函数回调、 在 `setTimeout` 或 `dom` 事件回调中更改都可以看成是能够同步获取最新值

> 当然以上代码是基于 `React@17` 的，弯弯绕绕的很


##### React@18 中 useState 是异步

而 `React@18` 当中引入了自动批处理功能，就是异步更新了（ `Auto Batch` ），所有的 `setState` 都是异步批量执行了，就不存在之前的问题了

当然其异步并非借助 `js` 当中的 异步 `api` ， 而是 `react@18` 中自己设计的异步调度


###### flushSync 获取最新数据

`React@18` 将 `setState` 视为 请求 而不是立即更新的命令， `React@18` 将异步批量更新他们。

但在极少数情况下，你可能需要强制同步应用特定的 `state` 更新，此时就可以使用 `flushSync`

```js
import { flushSync } from 'react-dom'

// 这里相当于一次批处理， flushSync 回调执行完后会立马执行一次 render 函数
flushSync(() => {
  this.setState({ count: 2 })
})
console.log(this.state.count) // 2
```



### 组件传值

`React` 组件传值与 `Vue` 类似，包括父子间、兄弟间、非父子间传值

- 父传子
  ```jsx
  // 子组件中 props 就是函数组件的参数
  const MyComponent = (props) => {
    return <button>count: {props.count}</button>
  }

  // 父组件
  const MyApp = () => {
    return <MyComponent count={1} />
  }
  ```
- 子传父
  ```jsx
  // 子组件 接收 props 来子组件数据传出去
  const MyComponent = ({ onUpdateTxt }) => {
    const msg = 'hello'
    return <button onClick={onUpdateTxt(msg)}>子传父</button>
  }

  // 父组件 通过 props 传入更新函数 onUpdateTxt
  const MyApp = () => {
    const [txt, setTxt] = useState('')
    return (
      <h2>{txt}</h2>
      <MyComponent onUpdateTxt={t => setTxt(t)} />
    )
  }
  ```
- 兄弟组件传值
  - 通常将状态提升到共同父组件中，通过 `props` 传递
- 祖传孙
  - 使用 `context` 实现
- 全局传值
  - `redux`




### map 列表渲染

列表中渲染，需要使用 `key` 来标识

```jsx
const MyMyComponent = () => {
  const list = ['useState', 'useEffect', 'useMemo', 'useCallback']
  return (
    <ul>
      {
        list.map(item => <li key={item}>{item}</li>)
      }
    </ul>
  )
}
```


### 条件渲染

```jsx
// if 判断
const MyComponent = () => {
  const flag = true
  if (flag) return <span>hello</span>
  return <span>world</span>
}

// 三目运算符判断
const MyComponent = () => {
  const flag = true
  return flag ? <span>hello</span> : null
}

// 条件与
const MyComponent = () => {
  const flag = true
  return flag && <span>hello</span>
}
```


### 表单输入绑定

`React` 中没有双向数据绑定，需要自己手动处理

```jsx
const MyComponent = () => {
  const [value, setValue] = useState('')
  return (
    <>
      <h3>--表单输入</h3>
      <Input
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <span>value: {value}</span>
    </>
  )
}
```


### useMemo 缓存计算结果

```js
const cachedValue = useMemo(calculateValue, dependencies)
```

`useMemo` 由 `React` 提供，它主要提供以下能力

- 跳过耗时的重新计算
- 跳过组件的重新渲染
- 根据其他依赖变化执行
- 缓存一个函数


#### 跳过耗时的重新计算

```jsx
const MyComponent = ({ count }) => {
  const cachedCount = useMemo(() => longTimeCalc(count), [count])
  // ...
}
```

- 初次渲染时， `useMemo` 返回计算完后的结果
- 后续重新渲染时，如果依赖项没有变化， `useMemo` 将直接返回缓存的结果，不会重新计算


#### 跳过组件的重新渲染

`useMemo` 可以返回任意类型，包括 `jsx` ，这样就能缓存组件，在重新渲染时，直接返回缓存的组件

```jsx
const MyComponent = ({ count }) => {
  const child = useMemo(() => <span>{count}</span>, [count])
  return (
    <div>{child}</div>
  )
}
```


#### 根据其他依赖变化执行

类似于 `vue` 的 `computed` 计算属性，根据依赖变化，重新计算值

```jsx
const MyComponent = ({ count }) => {
  // count 变化时，doubleCount 重新计算
  const doubleCount = useMemo(() => count * 2, [count])
  return <span>{doubleCount}</span>
}
```


#### 缓存一个函数

当把函数作为 `props` 传入子组件时，也可以使用 `useMemo` 来缓存函数，避免子组件每次都重新创建函数

```jsx
const MyApp = ({ id }) => {
  const handleSubmit = () => {
    console.log('submit', id)
  }
  return <MyComponent onSubmit={handleSubmit}>点击</MyComponent>
}
```

就如上例所示， `MyApp` 每次重新渲染时，都会重新创建 `handleSubmit` 函数，导致子组件每次都会重新渲染，使用 `useMemo` 生成缓存函数，避免每次都重新创建函数

```jsx
const MyApp = ({ id }) => {
  const handleSubmit = useMemo(() => {
    // 返回函数
    return () => {
      console.log('submit')
    }
  }, [id])
  return <MyComponent onSubmit={handleSubmit}>点击</MyComponent>
}
```


### useCallback 缓存函数

`useCallback` 是 `useMemo` 的特殊版本，用于缓存函数，而不是缓存值

```jsx
const MyApp = ({ id }) => {
  const handleSubmit = useCallback(() => {
    console.log('submit')
  }, [id])
  return <MyComponent onSubmit={handleSubmit}>点击</MyComponent>
}
```

`useCallback` 的作用和上面的 `useMemo` 缓存函数的作用一致，就是少一层函数嵌套


### useEffect 副作用函数

`useEffect` 是 `React` 提供的用于处理副作用的函数，可以传入依赖项来表示依赖变化，则执行副作用函数，类似于 `vue` 的 `watch`

```jsx
const MyComponent = ({ id }) => {
  useEffect(() => {
    console.log('effect：', id)
  }, [id])
}
```

如果不传入依赖项，则组件**初次挂载**、**重新渲染**后都会执行副作用函数，它模拟了 `React` 原来的 `componentDidMount` 和 `componentDidUpdate` 两个生命周期

如果传入 `[]` 空数组，则在组件**挂载**后执行副作用函数，它模拟了 `React` 原来的 `componentDidMount` 生命周期

但是 `useEffect` 的执行是异步的，且在组件 `dom` 渲染完毕之后才执行，这样可以避免组件 `dom` 渲染完毕之前执行副作用函数，导致 `dom` 渲染异常


```jsx
useEffect(() => {
  console.log('effect')
  return () => {
    // 执行时机：组件销毁前，或副作用函数执行前
    console.log('cleanup')
  }
})
```

`useEffect` 返回一个函数，用于清理副作用，类似 `vue` 的 `beforeDestroy` 生命周期。它的执行时机是在组件销毁前，或者副作用函数执行前，可以在此清理一些定时器、解绑事件等


除此之外， `useEffect` 还需要注意

- `useEffect` 内部不能修改 `state` ， 否则会出现死循环
- `useEffect` 的依赖项如果是 **复杂对象**，则可能会出现死循环，此时需要使用 `useMemo` 缓存此对象


### 正确使用 useMemo 和 useCallback

前面我们已经知道 `useMemo` 和 `useCallback` 都是缓存。但是实际上 `useMemo` 和 `useCallback` 在大多数情况下都不需要使用，因为错误的使用不仅不会起优化作用，还可能会拖慢你的应用


#### 为什么需要 useMemo 和 useCallback

我们通常说 `useMemo` 用于缓存计算结果，而 `useCallback` 用于缓存函数

- 两者都是起缓存作用
- 两者都只在重新渲染过程中才起作用


尝试以下例子，看看组件在更新时候，副作用函数是否会重复执行

```jsx
const MyComponent = () => {
  const a = { foo: 1 }
  useEffect(() => {
    // a 将会在每次重新渲染时被比较
    console.log('effect')
  }, [a])
  
  // 以下做一些可以触发组件重新渲染的操作
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

- 上面组件中 `a` 是 `useEffect` 的依赖项，在组件每次渲染时候，都会把 `a` 与上一次的值进行比较，即用 `Object.is` 判断
- 由于 `a` 是一个组件中声明的复杂对象，每次重新渲染时， `a` 都会被重新创建，因此 `a` 每次都不相等，导致 `useEffect` 每次都会执行


为了避免以上结果，我们可以使用 `useMemo` 来缓存 `a` 的值，如下

```jsx
const MyComponent = () => {
  // useMemo 缓存 a
  const a = useMemo(() => ({ foo: 1 }), [])
  useEffect(() => {
    // 这次只有 a 的值真的改变了才会触发
    console.log('effect')
  }, [a])
  
  // 以下做一些可以触发组件重新渲染的操作
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

使用 `useMemo` 缓存 `a` 之后，重新渲染时，就不会重复创建新的 `a` 导致副作用重新触发，而是在 `a` 真的改变之后才会触发副作用函数


`useCallback` 也是同样的道理，只不过它用于缓存函数

```jsx
const MyComponent = () => {
  // useCallback 缓存 一个函数 fetchData
  const fetchData = useCallback(() => {
    console.log('fetach data')
  }, [])
  useEffect(() => {
    // 只有 fetchData 的值真的改变了才会触发
    console.log('effect')
  }, [fetch])
  
  // 以下做一些可以触发组件重新渲染的操作
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

总之， `useMemo` 和 `useCallback` 都只在重新渲染时起作用，在初次渲染时不仅无用，甚至有害，它会让 `React` 做很多额外的比较


#### 组件重新渲染的原因

- 当 `state` 或 `props` 发生变化时，组件就会重新渲染自己
- 而组件的父组件重新渲染，也会导致子组件重新渲染


尝试以下例子

```jsx
const SubPage = () => <span>子组件</span>

const Page = () => {
  const [count, setCount] = useState(0)
  return (
    <>
      <button onClick={() => setCount(count + 1)}>re-render</button>
      <SubPage />
    </>
  )
}
```

- 上面例子中 `count` 变化会导致 `Page` 会重新渲染
- 而 `SubPage` 作为子组件，也会重新渲染，即使子组件并没有 `props`

但我们知道，子组件中什么都没有变，我们并不想要子组件重新渲染，而是想将其缓存起来，跳过无用的重新渲染

此时 `useMemo` 就可以缓存。而相对于组件来说， `React.memo` 更适合做缓存组件，这样 `React` 在重新渲染子组件之前会检查一下 `props` 是否改变了

```jsx
const SubPage = () => <span>子组件</span>
// 缓存子组件
const SubPageMemo = React.memo(SubPage)

// 使用缓存的子组件
const Page = () => {
  const [count, setCount] = useState(0)
  return (
    <>
      <button onClick={() => setCount(count + 1)}>re-render</button>
      <SubPageMemo />
    </>
  )
}
```

总之，只有在组件被缓存的场景中， `props` 是否被缓存才是值得关注的

即要跳过子组件的重新渲染，需要先缓存子组件，然后缓存子组件所有的 `props`


再尝试以下例子，子组件有一个 `onClick` 的 `prop` ，它接收一个函数，缓存、不缓存这个函数都没有区别，因为缺少 `React.memo` 来缓存子组件，在父组件重新渲染时，子组件也会重新渲染

```jsx
const SubPage = () => <span>子组件</span>

const Page = () => {
  const [count, setCount] = useState(0)
  // 1、不缓存函数
  const onClick = () => console.log('click')
  // 2、使用 useCallback 缓存
  // const onClick = useCallback(() => console.log('click'))
  return (
    <>
      <button onClick={() => setCount(count + 1)}>re-render</button>
      {/* 不管 onClick 是否缓存，SubPage 都会重新渲染 */}
      <SubPage onClick={onClick} />
    </>
  )
}
```

再试下以下例子，缓存了子组件，但是没有缓存 `onClick` 函数，此时 `onClick` 函数每次都会重新创建，从而导致子组件也会重新渲染

```jsx
const SubPage = () => <span>子组件</span>
const SubPageMemo = React.memo(SubPage)

const Page = () => {
  const [count, setCount] = useState(0)
  const onClick = () => console.log('click')
  // 因为 onClick 没有缓存， SubPageMemo 每次都会重新渲染
  return <SubPageMemo onClick={onClick} />
}
```

以上例子大致流程就是

- `React` 会在他的 `Children` 中发现 `SubPageMemo` 子组件，意识到子组件被 `React.memo` 缓存了，于是打断重渲染链条
- 然后 `React` 会先检查这个子组件的 `props` 是否有变化
- 发现 `onClick` 并未被缓存， `props` 的比较结果就是 `false`
- `SubPageMemo` 就会重新渲染自己


既然如此，再加上 `useCallback` 来缓存 `onClick` 函数

```jsx
const SubPage = () => <span>子组件</span>
const SubPageMemo = React.memo(SubPage)

const Page = () => {
  const [count, setCount] = useState(0)
  const onClick = useCallback(() => console.log('click'), [])
  // 使用 useCallback 缓存了， SubPageMemo 不会重新渲染了
  return <SubPageMemo onClick={onClick} />
}
```

现在，子组件才真的不会跟着父组件重新渲染了，只有它的 `props` 变化时候才会重新渲染


再尝试以下例子，如果给上面例子再增加一个非缓存的值，那子组件的缓存是否还有效呢

```jsx
const Page = () => {
  const [count, setCount] = useState(0)
  const onClick = useCallback(() => console.log('click'), [])
  // 因为 value 这个 prop 没有被缓存，所以 SubPageMemo 会重新渲染
  return <SubPageMemo onClick={onClick} value={[1, 2]} />
}
```


所以，很明显能得出一个结论就是，当组件的每一个 `props` 都缓存，且组件本身也缓存时，才会跳过该子组件的重新渲染


因此，如果组件中有一个 `prop` 没有缓存，或者组件本身没有缓存，想要使用 `useMemo` 、 `useCallback` 企图来缓存组件，就完全没有必要了


大部分情况下，这都将得不偿失，因为要改动的太多，使用混乱


#### useMemo 和 useCallback 正确用法

就像 `React` 官网文档说的

- `useMemo` 最主要的作用，就是在每次的渲染时能够缓存计算的结果
- `useCallback` 则是允许你在多次渲染中缓存函数

```jsx
const MyComponent = ({ count }) => {
  const cachedCount = useMemo(() => longTimeCalc(count), [count])
  // ...
}
```


只有在耗时计算的时候，才需要推荐使用 `useMemo` ， 其余的都不要提前优化！


最后，还需要注意的是，以上说的子组件重新渲染，实际还需要经过 `diff` 过程判断是否需要渲染到页面上


### useRef 获取 dom

`useRef` 用于声明不用参与组件渲染的变量，当然可以用来存放 `dom`

使用 `ref` 定义，使用 `useRef` 获取 `dom` 元素

```jsx
const MyComponent = () => {
  const domRef = useRef(null)
  const handleClick = () => {
    // dom 从 domRef.current 中获取
    domRef.current?.focus()
  }
  return (
    <input ref={domRef} value='hello' />
    <button onClick={handleClick}>获取dom聚焦</button>
  )
}
```

`ref` 的主要作用就是定义 `dom` 元素，但是 `ref` 最大的问题就是，它不能作用在函数组件上，在父组件需要获取子组件的 `dom` 的场景下，就需要 `forwardRef`


### forwardRef 获取子组件的 dom

使用 `forwardRef` 改造下

```jsx
// 函数子组件
const InputWrap = (_props, ref) => {
  return <input ref={ref} value='hello' />
}
// 子组件使用 forwardRef 包裹后，就能直接使用 ref 了
const InputWrapForwardRef = forwardRef(InputWrap)

// 父组件
const App = () => {
  const domRef = useRef()
  const handleClick = () => {
    domRef.current?.focus()
  }
  return (
    <>
      <InputWrapForwardRef ref={domRef} />
      <button onClick={handleClick}>focus</button>
    </>
  )
}
```

- `ref` 是不能作为函数组件的 `props` 的，所以需使用 `forwardRef` 包裹一下函数组件
- `forwardRef` 包裹的子组件第二个参数是 `ref` ，就可以绑定到子组件的 `dom` 上


以上 `forwardRef` 显然不是一个优雅的解决办法， `useImpreativeHandle` 指令式 `API` 更合适


### useImperativeHandle 转发组件的 ref

子组件使用 `useImperativeHandle` 做下改造，此时子组件传入 `ref` 就按 `props` 处理

```jsx
// 函数子组件 - props 传入
const InputWrap = ({ domRef }) => {
  const inputRef = useRef()
  // 将父组件的 domRef.current 绑定到子组件的 inputRef.current
  useImperativeHandle(domRef, () => inputRef.current, [])
  return <input ref={inputRef} value='hello' />
}

// 父组件 - 改成 props 传入 domRef
const App = () => {
  const domRef = useRef()
  const handleClick = () => {
    domRef.current?.focus()
  }
  return (
    <>
      <InputWrap domRef={domRef} />
      <button onClick={handleClick}>focus</button>
    </>
  )
}
```

- 子组件改成了 `props` 传入 `domRef` ，并在子组件内部声明 `dom` 的 `inputRef`
- 子组件内使用 `useImpressiveHandle` 将传入的 `domRef` 与 `inputRef` 进行绑定，当然也可以仅绑定 `inputRef.current.focus` 方法，在返回的对象中定义 `focus` 方法即可


以上就是 `React` 中获取 `dom` 的方法，处理下来真的是不好理解


当然 `useRef` 的本意是声明不需要参与组件渲染的变量的，例如

```jsx
const App = () => {
  const timerRef = useRef(null)
  timerRef.current = setTimeout(() => console.log('useRef'), 1000)
}
```


### useReducer 单组件状态管理

- `useReducer` 是 `useState` 的代替方案，用于 `state` 复杂变化
- `useReducer` 是单个组件状态管理，组件通讯还需要 `props`
- `redux` 是全局的状态管理，多组件共享数据

```jsx
// 定义初始值以及操作
const initialState = { count: 0 }
const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    default:
      return state
  }
}

const App = () => {
  // 组件中使用
  const [state, dispatch] = useReducer(reducer, initialState)
  return <div>
    <span>{state.count}</span>
    <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
  </div>
}
```


### Hooks 使用规则

- `hooks` 只能在函数组件当中使用
- `hooks` 不能在循环、条件判断或者嵌套函数中调用
- `hooks` 严重依赖调用顺序


### 自定义 Hook

通常我们都需要自定义 `hooks` 来复用组件逻辑， `hooks` 的变量作用域明确，不会产生组件嵌套

```js
// useMousePosition.js
import { useState, useEffect } from 'react'
const useMousePosition = () => {
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  useEffect(() => {
    const handleMouseMove = (e) => {
      setX(e.clientX)
      setY(e.clientY)
    }
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return [x, y]
}
export default useMousePosition


// 任意组件中引入使用，例如 App.jsx
import useMousePosition from './useMousePosition'
const App = () => {
  const [x, y] = useMousePosition()
  return <p>鼠标位置：({x}, {y})</p>
}
```


### 高阶组件

- `HOC`
  - 组件层级嵌套过多，不易渲染，不易调试
  - `HOC` 会劫持 `props` ，必须严格规范，容易出现疏漏
- `Render Props`
  - 学习成本高，不易理解
  - 只能传递纯函数，而默认情况下纯函数功能有限

高阶组件主要用来复用组件逻辑，但在函数组件当中，还是推荐使用 自定义 `hooks` 来复用逻辑



## Finally

`React` 的 `hooks` 真是不好理解，光是 `useMemo` 、 `useCallback` 、 `useEffect` 、 `useImpreativeHandle` 都得很清楚他们的使用场景、优化思路才好正确使用


还得是那句，不要做提前优化



## References

- [React useMemo](https://react.docschina.org/reference/react/useMemo)
- [React useCallback](https://react.docschina.org/reference/react/useCallback)
- [Post](https://juejin.cn/post/7251802404877893689)
- [Post](https://juejin.cn/post/7291186330911326266)

