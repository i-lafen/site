# React


## 前言

最近学习 `React@18+` ，记录一些学习笔记，由官网和网络文章整理而来

通过此文，了解 `React` 的基本概念，以及 `React` 的 `hooks` 用法

- `useState`
- `useEffect`
- `useMemo`
- `useCallback`


## React 概念理解


`React` 是一个用于构建用户界面的 `JavaScript` 库，当 `state` 或 `props` 发生变化时， `React` 会重新更新界面


### 组件状态

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


### 组件传值

`React` 组件传值与 `Vue` 类似，包括父子间、兄弟间、非父子间传值

- 父传子
  ```jsx
  <!-- 子组件中 props 就是函数组件的参数 -->
  const MyComponent = (props) => {
    return <button>count: {props.count}</button>
  }

  <!-- 父组件 -->
  const MyApp = () => {
    return <MyComponent count={1} />
  }
  ```
- 子传父
  ```jsx
  <!-- 子组件 接收 props 来子组件数据传出去 -->
  const MyComponent = ({ onUpdateTxt }) => {
    const msg = 'hello'
    return <button onClick={onUpdateTxt(msg)}>子传父</button>
  }

  <!-- 父组件 通过 props 传入更新函数 onUpdateTxt -->
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



### 获取 dom

使用 `ref` 定义，使用 `useRef` 获取 `dom` 元素

```jsx
const MyComponent = () => {
  const ref = useRef(null)
  const handleClick = () => {
    // dom 从 ref.current 中获取
    console.log(ref.current)
  }
  return (
    <input ref={ref} value='hello' />
    <button onClick={handleClick}>获取dom</button>
  )
}
```


### 列表渲染

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


### 表单输入

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


### useMemo

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


### useCallback

`useCallback` 是 `useMemo` 的特殊版本，用于缓存函数，而不是缓存值

```jsx
const MyApp = ({ id }) => {
  const handleSubmit = useCallback(() => {
    console.log('submit')
  }, [id])
  return <MyComponent onSubmit={handleSubmit}>点击</MyComponent>
}
```

`useCallback` 的作用和上面的 `useMemo` 缓存函数的作用一致，少一层函数嵌套


### useEffect

`useEffect` 是 `React` 提供的用于处理副作用的函数，可以传入依赖项来表示监听依赖变化，则执行副作用函数，类似于 `vue` 的 `watch`

```jsx
const MyComponent = ({ id }) => {
  useEffect(() => {
    console.log('effect：', id)
  }, [id])
}
```

如果不传入依赖项，则组件初次渲染、每次重新渲染都会执行副作用函数，它模拟了 `React` 原来的 `componentDidMount` 和 `componentDidUpdate` 两个生命周期

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

`useEffect` 返回一个函数，用于清理副作用，类似 `vue` 的 `beforeDestroy` 生命周期。它的执行时机是在组件销毁前，或者副作用函数执行前



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

- 上面组件中 `a` 是 `useEffect` 的依赖项，在组件每次渲染时候，都会把 `a` 与上一次的值进行比较
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
- 而 `SubPage` 作为子组件，也会重新渲染

但我们知道，子组件中什么都没有变，我们并不想要子组件重新渲染，而是想将其缓存起来

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


#### useMemo 和 useCallback 正确用处

就像 `React` 官网文档说的

- `useMemo` 最主要的作用，就是在每次的渲染时能够缓存计算的结果
- `useCallback` 则是允许你在多次渲染中缓存函数


只有在耗时计算的时候，才需要推荐使用 `useMemo`


## References

- [React useMemo](https://react.docschina.org/reference/react/useMemo)
- [React useCallback](https://react.docschina.org/reference/react/useCallback)
- [Post](https://juejin.cn/post/7251802404877893689)

