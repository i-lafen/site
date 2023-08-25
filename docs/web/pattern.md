# 设计模式

## SOLID 五大设计原则

前端 `js` 主要为弱类型语言，主要体现在 `SO`

- S - **单一职责原则**
  - 一个程序只做好一件事
  - 拆分复杂代码
- O - **开放封闭原则**
  - 对扩展开放，对修改封闭
  - 增加需求事，扩展新代码，而非修改已有代码
- L - 里氏置换原则
- I - 接口独立原则
  - 保持接口的单一独立，类似单一职责，这里只关注接口
- D - 依赖倒置原则
  - 面向接口编程，依赖抽象而不依赖具体


## 23 种设计模式

- 创建型
  - **工厂模式**
  - **单例模式**
  - **原型模式**
- 组合型
  - **适配器模式**
  - **装饰器模式**
  - **代理模式**
  - 外观模式
  - 桥接模式
  - 组合模式
  - 享元模式
- 行为型
  - **策略模式**
  - 模板方法模式
  - **观察者模式**
  - **迭代器模式**
  - 职责链模式
  - 命令模式
  - 备忘录模式
  - **状态模式**
  - 访问者模式
  - 中介者模式
  - 解释器模式


### 工厂模式

不直接使用 `new` 新建对象，而是通过工厂函数创建，应用例如 `React.createElement`

```js
// 产品
class Product {
  name
  constructor(name) {
    this.name = name
  }
  getName() {
    return this.name
  }
}
// 工厂
class Creator {
  create(name) {
    return new Product(name)
  }
}

// 使用 不直接 new 新建产品，而是通过 Creator 来创建
const creator = new Creator()
const p1 = creator.create('测试1')
const p2 = creator.create('测试2')
console.log(p1.getName())
console.log(p2.getName())
```


### 单例模式

一个类只能有一个实例，例如 `vuex` 中的 `store`

```js
class SingleObject {
  login() {
    console.log('login...')
  }
}
// 静态方法 挂载到类对象下
SingleObject.getInstance = (function() {
  let instance = null
  return function() {
    if (instance === null) {
      instance = new SingleObject()
    }
    return instance
  }
})()

const s1 = SingleObject.getInstance()
const s2 = SingleObject.getInstance()
console.log('s1 === s2 : ', s1 === s2)
```


### 适配器模式

感觉 `axios` 中根据环境判断使用浏览器的 `xhr` 还是 `nodejs` 中的 `http` 来发起请求，更像是适配器，对不一样的环境提供不一样的内部实现，但对外接口一致。


### 装饰器模式

为对象添加新功能，扩展功能，但不改变其原有的结构和功能，例如 `es7` 中的装饰器 用来装饰类、方法

```js
@testDec
class Demo {
  @readonly
  name() {}
}

function testDec(target) {
  target.isDec = true
}

console.log(Demo.isDec) // true

// 或者传参
function testDec2(bool) {
  return function(target) {
    target.isDec = bool
  }
}
// 传参
@testDec(false)
class Demo2 {}
console.log(Demo2.isDec) // true
```

再比如 `vue2` 中对 数组操作方法的处理，出于性能的考虑， `vue2` 中并没有对数组的每一项进行响应式处理，而是对数组的 `__proto__` 做了一层处理，使数组的操作方法能够进行依赖收集，当然不支持 `__proto__` 的时候会将方法直接挂载到 数组 对象上，简写如下

```js
// 数组原型
const oldArrayProto = Array.prototype
// 新建一个【对象】，原型指向【数组原型对象】
const newArrayProto = Object.create(oldArrayProto)
// 数组操作方法
const methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice']
// 遍历赋值
methods.forEach(method => {
  // 给【对象】添加数组同名方法，在内部调用数组原型上的方法
  newArrayProto[method] = function(...args) {
    // 内部使用数组原始的方法
    const result = oldArrayProto[method].call(this, ...args)
    console.log('==在此可以对新增的属性进行劫持==')
    return result
  }
})

// 数组
const arr = [1, 2]
// vue2 中数组经过响应式转换，会将 __proto__ 属性指向 对象 newArrayProto ，即
arr.__proto__ = newArrayProto

arr.push(3)

// // 由于 __proto__ 是非标准属性，对于可能不支持该属性的环境，vue2 则直接将操作方法直接挂载到 数组 对象本身上，即
// methods.forEach(method => {
//   // 给【数组】添加同名方法，在内部调用数组原型上的方法
//   arr[method] = function(...args) {
//     const result = oldArrayProto[method].call(this, ...args)
//     console.log('==直接挂载到数组对象上的方法, 在此可以对新增的属性进行劫持==')
//     return result
//   }
// })
```


### 代理模式

不直接访问对象，而是访问对象的代理，代理提供了与原对象一样的能力。例如 `es6` 中的 `proxy，js` 原生支持的用于创建一个对象的代理， `vue3` 的响应式原理正是基于此 `api` 实现

```js
// 原对象
const obj = {
  name: 'lafen',
}
// 代理
const agent = new Proxy(obj, {
  get(target, key, receiver) {
    const val = Reflect.get(target, key, receiver)
    console.log('代理get: ', val)
    return val
  },
  set(target, key, value, receiver) {
    const val = Reflect.set(target, key, value, receiver)
    console.log('代理set: ', val)
    return val
  }
})

// 不直接访问 obj ，而是访问 agent，依次访问试试
agent.name
agent.name = '999'
agent.name
obj.name
```


### 观察者模式

常见的 发布 & 订阅 模式，一对多，如 `nodejs` 中的 `event`

```js
const EventEmitter = require('events').EventEmitter

const emitter = new EventEmitter()
// 监听 some 事件
emitter.on('some', info => {
  console.log('--some 1--', info)
})
emitter.on('some', info => {
  console.log('--some 2--', info)
})
// 触发
emitter.emit('some', 888)
```

`js` 实现一个事件中心

```js
class Event {
  constructor() {
    // 事件容器，key为事件名，value为订阅者数组
    this.handlers = {}
  }
  // 订阅
  on(eventName, handler) {
    // 新事件
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = []
    }
    // 存入
    this.handlers[eventName].push(handler)
  }
  // 触发
  emit(eventName, ...args) {
    // 不存在
    if (!this.handlers[eventName]) {
      console.warn(`${eventName} 事件未注册`)
      return
    }
    this.handlers[eventName].forEach(handler => {
      handler(...args)
    })
  }
  // 移除，可传入指定移除的函数
  off(eventName, handler) {
    // 无效事件
    if (!this.handlers[eventName]) {
      console.warn(`移除失败，${eventName} 事件未注册`)
      return
    }
    // 直接移除事件名
    if (!handler) {
      delete this.handlers[eventName]
    } else {
      const idx = this.handlers[eventName].findIndex(fn => fn === handler)
      if (idx === undefined) {
        console.warn(`移除函数失败`)
        return
      }
      // 移除
      this.handlers[eventName].splice(idx, 1)
      // 空则直接移除事件
      if (this.handlers[eventName].length === 0) {
        delete this.handlers[eventName]
      }
    }
  }
}

const event = new Event()
event.on('some', (info) => { console.log(1, info) })
event.on('some', (info) => { console.log(2, info) })
event.emit('some', '--some emit--')
```


### 迭代器模式

`es6` 中的迭代器即 `[Symbol.iterator]` ，凡是实现了 **迭代器** 的对象，都可以使用 `for...of` 来进行遍历，例如 `Array` `Set` `Map` `NodeList。`

其中 `Generator` 函数返回的结果，也实现了 `Iterator` 接口，即也可以使用 `for...of` 来遍历
