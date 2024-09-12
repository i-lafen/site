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



## 开发中常见的设计模式

### 装饰器模式

在某些场景下，我们希望对网页的网络请求进行拦截，以便获取到请求的入参出参，就会用到 **装饰器模式** ，这与 `vue2` 中对数组方法的拦截类似

以下示例为，浏览器插件开发当中，拦截请求的入参出参以生成 `ts` 类型文档

```js
// 过滤目标 url
const isTargetUrl = (url) => url.startsWith('/api/interface/') && url.includes('yapi')

const httpInterceptor = () => {
  // 先拿到原型链上的方法
  const XHR = XMLHttpRequest.prototype
  const send = XHR.send
  const open = XHR.open
  // 包装 open 方法，保存 请求 url 和 method
  XHR.open = function(method, url) {
    this._method = method
    this._url = url
    // 在包装方法中调用原始方法
    return open.apply(this, arguments)
  }
  // 包装 send 方法
  XHR.send = function() {
    this.addEventListener('load', function() {
      // 过滤是否是接口文档
      if (isTargetUrl(this._url)) {
        if (this.responseType !== 'blob' && this.responseText) {
          const res = JSON.parse(this.responseText)
          const data = {
            key: 'chrome_plugin_yapi_to_ts',
            res,
            url: this._url,
            method: this._method,
          }
          // 将数据发送出去给 background
          window.postMessage(data, '*')
          console.log('--【httpInterceptor】--', data)
        }
      }
    })
    // 在包装方法中调用原始方法
    send.apply(this, arguments)
  }
}

httpInterceptor()
```

以上即一个使用 装饰器模式 实现的 `xhr` 的拦截器，可以根据需要修改过滤目标 `url` 和组装你想要的 请求参数和数据

可以复制到任意浏览器控制台中执行，当网页发起请求时，控制台便能获取到请求的入参出参


### 策略模式

**策略模式** 适合多种条件执行不同逻辑的场景，在进行页面跳转时，通常会根据不同权限或角色跳转不同路由，此时就可以使用 策略模式

```js
// 伪代码，你封装的获取 token 的 hooks
const { token } = useToken()

const pathHandler = (to, from, next) => {
  // 未登录，去登录页
  const hasToken = !!token
  // 无匹配路由，直接去 404
  const noMatchRouter = to.matchd.length === 0

  // 定义策略，可以根据不同业务判断进行增加和排序
  const validators = [
    { rule: !hasToken, meta: { path: '/login', query: { redirect: to.path }, replace: true }},
    { rule: hasToken, meta: { path: to.path, query: to.query, params: to.params, replace: true }},
    { rule: noMatchRouter, meta: { path: '/redirect/404', replace: true }},
  ]

  // 命中策略，跳转路由
  const found = validators.find(item => item.rule)
  found && found.meta
    ? next(found.meta)
    : next()
}

// 在路由守卫当中判断
router.beforeEach((to, from, next) => {
  pathHandler(to, from, next)
})
```

以上代码即使用 策略模式 实现路由跳转的策略，实际可能判断逻辑更复杂，例如包括 登录、权限、角色判断等 策略，这里只是做演示


### 发布订阅模式

在 某些场景下，我们希望实现一个 **发布订阅模式** 来实现通信功能，例如微前端的父子应用间互相通信的场景，以下是一个简单的实现

```js
class Event {
  constructor() {
    // 类型 { eventName: [callback1, callback2] }
    this.events = {}
  }
  // 订阅
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(callback)
  }
  // 发布
  emit(eventName, ...args) {
    this.events[eventName]?.forEach(callback => callback(...args))
  }
  // 移除
  off(eventName, callback) {
    // 只传入事件名，则删除该事件的所有回调
    if (!callback) {
      Reflect.deleteProperty(this.events, eventName)
      return
    }
    // 找到回调并移除
    const index = this.events[eventName]?.findIndex(item => item === callback)
    if (index > -1) {
      this.events[eventName]?.splice(index, 1)
    }
  }
}

// 测试
const event = new Event()
event.on('thing', (info) => { console.log(3, info) })
event.on('some', (info) => { console.log(2, info) })
event.on('some', (info) => { console.log(1, info) }) // 订阅两个
event.emit('some', '--some emit--')
event.emit('thing', '--thing emit--') // 发布
event.off('some') // 取消订阅
console.log(event)
```

以上即 发布订阅模式 实现的简易通信功能


### 单例模式

**单例模式** 即确保一个类只有一个实例，并提供一个访问它的全局访问点，尝试对上面的 发布订阅模式 代码进行改造，使其变成 **单例模式**

```ts
type Callback = (...args: any[]) => void

class Event {
  // 唯一实例，私有变量
  private static instance: Event | null = null
  private events: Record<string, Callback[]> = {}
  // 私有构造函数，防止外部 new 实例化 ，【注意】这里 构造函数私有化是在 ts 中才有
  private constructor() {
    // 构造函数体
  }
  // 公共静态方法，获取唯一实例
  static getInstance(): Event {
    if (!this.instance) {
      Event.instance = new Event() // 类内部 new 可以，外部 new 则 ts 会报错
    }
    return Event.instance
  }
  // 其他代码一致...
}

const event1 = Event.getInstance()
const event2 = Event.getInstance()
console.log(event1 === event2) // true
```

这样就可以保证 `Event` 类只有一个实例，且只能通过静态方法获取该实例

当然，上面代码中的构造函数私有化，是 `ts` 环境中的写法，其实 `js` 中尚未支持构造函数私有化，但是可以通过其他方法来实现

```js
class Event {
  constructor() {
    // 存在实例了，则直接抛错，这就只能 new 一次了
    if (Event.instance) {
      throw new Error('Use Event.getInstance() instead of new Event()')
    }
    // 构造函数内容，并将实例赋值给静态实例
    Event.instance = this
  }
  // 静态实例
  static instance = null
  // 获取单例
  static getInstance() {
    if (!Event.instance) {
      new Event() // 这里实际创建了一次实例
    }
    return Event.instance
  }
  // code...
}

const instance1 = Event.getInstance()
const instance2 = Event.getInstance()
console.log(instance1 === instance2) // true
const instance3 = new Event() // Uncaught Error: Use Event.getInstance() instead of new Event()
```

