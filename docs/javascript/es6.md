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



## Reference

[ES6 入门教程](https://es6.ruanyifeng.com/)

