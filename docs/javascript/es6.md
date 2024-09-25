# ES6


## ES6 基础概念

- `let` 、 `const`
- 模板字符串
- 解构赋值
- 扩展运算符
- 箭头函数
- `class`
- `Set` 、 `Map`
- `Promise`
- `Proxy` 、 `Reflect`
- `Symbol`
- `import`
- `Generator` 、 `async` 、 `await`
- `Iterator` 和 `for...of`


### 变量声明 let 、 const

在 `ES6` 之前，通常使用 `var` 来声明变量，但是 `var` 声明变量存在诸多问题

- 只有 全局作用域 和 函数作用域
- 存在变量提升问题

详细可见 [JS 变量提升](./hoisting.md)


而 `ES6` 引入了 `let` 和 `const` 来声明变量，来避免上述问题

- `let` 通常用于声明变量
- `const` 用于声明常量
- 不会有变量提升问题，都是块级作用域
- 在声明变量之前的地方，存在暂时性死区，获取变量会报错


### 模板字符串

模板字符串使用反引号 `` 来包裹，支持字符串拼接，支持表达式，甚至调用函数

```js
const name = 'lafen'
const getAge = () => 18
const str = `my name is ${name}, i am ${getAge()}`

// 甚至用来调用函数
getAge``
```


### 解构赋值

按照一定的模式，从对象和数组中提取值，简化赋值过程

- 对象解构
- 数组解构
- 字符串解构


```js
// 解构对象
const obj = { x: 1, y: 2 }
const { x, y } = obj

// 解构数组
const arr = [1, 2]
const [a, b] = arr

// 解构字符串
const str = 'hello'
const [c, d] = str
```


### 扩展运算符

扩展运算符 `...` 用来将一个数组或者字符串拆分成单个元素，也可以做剩余参数

```js
const name = 'lafen'
// 展开字符串成数组
const arr = [...name]
const obj = {
  name,
  age: 18,
}
// 展开对象
const params = {
  ...obj,
}
// 剩余参数
const getArgs = (...args) => args
```




### 箭头函数

`ES6` 箭头函数的提出是为了消除函数的**二义性**。

早期 `js` 设计简单，普通函数即作为函数调用，也作为类使用，但这就容易导致混乱，虽然可以通过函数名首字母大写来约定是类，但总有不规范书写或随意混用的情况

所以 `ES6` 中做了新的规范，函数使用箭头函数声明

- 无 `this`
- 无 `arguments`
- 无 原型链
- 不可 `new`
- 可以省略 `return`

```js
const double = a => a * 2
```


### class

类用 `class` 声明

- `constructor` 构造函数，可用来初始化实例属性
- 属性描述符
  - `public` 默认值，可访问
  - `protected` 受保护属性，可被子类访问
  - `private` 私有属性，只在当前类中使用，可以用 `#` 简写
  - `static` 静态属性、静态块，直接通过类访问
- 取值函数 `get` 、存值函数 `set` 可以拦截该属性的读写操作
- `new.target` 获取当前类
- `extends` 继承



### Set 、 Map

#### Set

`Set` 实例类似数组，但成员值都是唯一的

- `size`
- `add()`
- `delete()`
- `has()`
- `keys()`
- `values()`
- `forEach()`
- `entries()`
- `union()` 并集
- `intersection()` 交集
- `difference()` 差集，返回第一个集合存在但第二个集合不存在的元素
- `symmetricDifference()` 对称差集，返回两个集合所有独一无二的元素，即去除重复成员
- `isSubsetOf()` 判断是否为子集
- `isSupersetOf()` 判断是否为超集
- `isDisjointFrom()` 判断两个集合是否不相交，即无共同成员


#### WeakSet

`WeakSet` 与 `Set` 类似，但成员只能是 对象 和 `Symbol` 值，并且键是弱引用，元素可能随着垃圾回收被回收，所以元素不可遍历，不可获取 `size`



#### Map

`js` 的对象，本质上是键值对的集合，即 `hash` 结构，但只能用字符串做 `key` ，而 `Map` 可以用各种类型的数据做 `key`



#### WeakMap

`WeakMap` 与 `Map` 类似，但键只能是 对象 和 `Symbol` 值，并且键是弱引用，不会导致内存泄漏，所以键不可遍历，不可获取 `size`


#### WeakRef

`WeakRef` 对象用于直接创建目标对象的弱引用，垃圾回收机制不会计入这个引用，不会影响目标对象的垃圾回收（但是创建弱引用当次事件循环不会被垃圾回收）

- `deref()` 判断原始对象是否被垃圾回收



### Promise

异步编程必备

[JS 事件循环](../browser/eventloop.md)


- `then()`
- `catch()`
- `finally()`
- `Promise.all()`
- `Promise.race()`
- `Promise.allSettled()`
- `Promise.any()`
- `Promise.resolve()`
- `Promise.reject()`
- `Promise.try()`
- `Promise.withResolvers()`


注意区别以下

- `Promise.all()` 所有的状态都成功才返回成功，否则失败
- `Promise.race()` 哪个状态先变就取哪个，无论成功或失败
- `Promise.allSettled()` 所有状态都变了才返回一个数组，无论成功或失败
- `Promise.any()` 只要有一个状态成功就返回成功，所有状态失败了就返回失败
- `Promise.try(cb)` 尝试使用异步方式执行回调函数 `cb` ，否则为同步调用，取决于 `cb` 是否为异步函数
- `Promise.withResolvers()` 获取 `Promise` 的 `resolve` 、 `reject` 方法 和 `promise` 实例，方便异地操作



### Proxy 、 Reflect

两个是非常强大的内置对象，通常一起使用来提供更方便的对象操作和控制

#### Proxy

`Proxy` 是一个构造函数，用于创建一个对象的**代理**，从而可以对对象进行自定义操作，例如属性查找、赋值、枚举等

```js
const target = {}
const handler = {
  get(target, prop, receiver) {
    console.log('get: ', prop)
    return Reflect.get(target, prop, receiver)
  },
  set(target, prop, value, receiver) {
    console.log('set: ', prop, '=', value)
    return Reflect.set(target, prop, value, receiver)
  }
}

const proxy = new Proxy(target, handler)
proxy.foo = 123 // set: foo=123
console.log(proxy.foo) // get: foo 然后再输出 123
```

以上例子即 `Proxy` 拦截 `target` 的 `get` 和 `set` 操作


#### Reflect

`Reflect` 是一个内置的静态对象，它提供拦截 `js` 操作的方法。这些方法与 `Proxy` 的 `handler` 方法一一对应

`Reflect` 主要目的是提供一个标准化的方法拦截 `js` 操作，以便开发者进行对象的**元编程**操作

```js
const obj = { foo: 123 }
console.log(Reflect.get(obj, 'foo')) // 123
Reflect.set(obj, 'foo', 456)
console.log(obj.foo) // 456
```



### Symbol


`ES6` 新的数据类型，表示独一无二的值，传入的参数为当前 `Symbol` 的描述，可以不传

- `Symbol` 可以作为对象唯一 `key`
- `Symbol` 作为 `key` 时不可遍历，但可以通过 `Object.getOwnPropertySymbols()` 获取，另外 `Reflect.ownKeys()` 也可以获取到 `Symbol` 类型的 `key`
- `Symbol.describe()` 获取 `Symbol` 的描述
- `Symbol.for()` 获取 `Symbol` ，传入相同的参数，返回相同的 `Symbol` ，无此 `Symbol` 时会创建新的 `Symbol` ，注意返回值是全局的，无论在 `iframe` 中还是 `service worker` 中都是同一个 `Symbol`
- `Symbol.keyFor()` 获取 `Symbol` 类型值的 `key`




### import

`ES6` 模块化规范，即 `import` 和 `export` 模块导入、导出语法

- `export` 只能导出三种类型：变量、函数、类
- `export` 只能出现在模块顶层作用域
- `export` 导出的变量就是本来的名字，但是也可以使用 `as` 来重命名
- `export default` 导出一个默认变量，只能有一个默认
- `import` 导入的变量都是只读的
- `import` 时可以使用 `as` 做符号绑定
- `import` 是静态编译的，编译阶段就执行，不可使用表达式和变量这些运行阶段才能得到的语法结构，同样是模块顶层使用
- `export` 和 `import` 可以结合一起使用，相当于转发一下，当前模块并没有导入


此外还可以使用 `import()` 来动态加载模块，返回一个 `Promise` 对象，因此可以做到 按需加载、条件加载、动态模块路径 等功能


`import` 还可以暴露一些模块内部元信息

- `import.meta` 获取当前模块的元信息，在模块内部使用
  - `import.meta.url` 获取当前模块的路径 URL
  - `import.meta.scriptElement` 获取加载当前模块的 `script` 标签，相当于 `document.currentScript`




### Generator 生成器的了解


`Generator` （生成器）是一种特殊的函数，它可以暂停执行并在需要时恢复执行。由 `ES6` 引入，使用 `function*` 定义

- 暂停和恢复执行：在函数体内部，使用 `yield` 关键字暂停，并产生一个值，然后使用 `next()` 恢复执行，并将新的值传递给 `yield` 表达式
- 迭代器和可迭代对象： `Generator` 函数返回一个迭代器对象，可直接使用 `for...of` 来遍历生成的值
- 惰性求值
- 状态保存

```js
function* generatorFunction() {
  yield 'Hello';
  yield 'World';
  return 'Ending';
}
const generator = generatorFunction(); // 返回可迭代对象
console.log(generator.next().value); // 输出: Hello
console.log(generator.next().value); // 输出: World
console.log(generator.next().value); // 输出: Ending
console.log(generator.next().done);  // 输出: true，表示迭代器已完成
```

`Generator` 函数适合用于处理 异步编程 和 迭代。但目前通常都使用 `async/await` 来做异步编程更直观




### Iterator 和 for...of

`JS` 中原来表示集合的有 `Array` 和 `Object` ，但是现在加了 `Set` 和 `Map` ，所以需要一种统一的接口机制来遍历处理不同的集合结构，即 遍历器 `Iterator`


`Iterator` 提供统一的访问机制 `for...of` ，任何数据结构只要部署 `Symbol.iterator` 接口，就可以被 `for...of` 循环遍历

- `Array`
- `Map`
- `Set`
- `String`
- `TypedArray`
- 函数 `arguments` 对象
- `NodeList` 对象

以上数据结构原生即具有 `Symbol.iterator` 接口，在 解构赋值、扩展运算符 当中，会默认调用 `Symbol.iterator` 方法


注意 `Object` 没有 `Symbol.iterator` 接口，但可以通过 `Object.keys()` 后再遍历，或 使用 `for...in` 遍历，但 `for...in` 遍历时，会遍历原型上的自定义属性



## Reference

[ES6 入门教程](https://es6.ruanyifeng.com/)

