# Interview


## JS 相关

### 作用域

变量的可访问范围，即 作用域 控制着变量的 可见性 和 生命周期，代码位置 （ 静态 的 词法作用域 ） 决定了变量的 可见性 与 生命周期


### Promise.then 的第二个参数和 catch 的区别

两者都是处理 `reject` 情况的，推荐使用 `catch` 

- 使用 `then` 第二个参数时候，异常情况会在此被处理掉，不会往下链条传递
- `catch` 可以兜住整个 `promise` 链条上的异常情况，推荐使用



### webworker

`webworker` 是可以新建一个后台线程去执行耗时 `js` 任务，避免耗时任务阻塞主线程

- **独立线程** ， 避免阻塞主线程风险
- **沙箱环境** ， `webworker` 代码运行在一个受限沙箱中，不能访问 `dom` ，全局变量等资源，保证数据安全稳定
- **事件通信** ， 通过 `postMessage` 和 `message` 事件来与主线程通信



### JS 值传递

`JS` 中没有引用传递，只有**值传递**，也就是函数参数传递过程，变量是拷贝的，拷贝完后两者内存地址指向并不一致，重新赋值并不影响另一个变量（注意是重新赋值，不是修改变量的某一个属性字段）。

`ES6` 中， `import` 的**具名导入**却是指向同一个内存地址的，修改导入的变量时，其他引入的该变量也随之改变，这也叫**符号绑定**，但不是函数参数的引用传递。



### 箭头函数的意义（箭头函数与普通函数的本质区别）

`ES6` 箭头函数的提出是为了消除函数的**二义性**。

早期 `js` 设计简单，普通函数即作为函数调用，也作为类使用，但这就容易导致混乱，虽然可以通过函数名首字母大写来约定是类，但总有不规范书写或随意混用的情况。

所以 `ES6` 中做了新的规范，函数使用箭头函数声明，类则用 `class` 声明。


### Generator 生成器的了解

`Generator` （生成器）是一种特殊的函数，它可以暂停执行并在需要时恢复执行。由 `ES6` 引入，使用 `function*` 定义。

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

`Generator` 函数适合用于处理 异步编程 和 迭代。但目前通常都使用 `async/await` 来做异步编程更直观。



### ES6 中的 Proxy 和 Reflect 的理解

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


### js 实现高精度计时器

主要问题在于 `setTimeout` 和 `setInterval` 并不能做到很精确的计时器。这两个 `api` 在时间到了时候只是将回调函数注册到异步队列等待执行，一旦遇到耗时任务则可能会导致延迟执行。另外窗口非活跃状态（切换或隐藏窗口）下，浏览器也会减少 `js` 执行以节省资源。

但也可以使用 `Date` 来计算前后任务之间的时间差来减少误差。

```js
function highPrecisionTimer(callback, interval) {
  let startTime = Date.now();
  function loop() {
    let currentTime = Date.now();
    let elapsedTime = currentTime - startTime;
    if (elapsedTime >= interval) {
      startTime += interval; // 更新下一次的起始时间
      callback(); // 执行回调
    }
    requestAnimationFrame(loop); // 继续循环
  }
  requestAnimationFrame(loop);
}

// 使用示例
highPrecisionTimer(() => {
  console.log('每秒执行一次');
}, 1000);
```

当然这也并不是精准的计时器，大量的计算同样可能会导致页面卡顿阻塞，因此需要做一些取舍。同样也可以在 `webworker` 当中做计时，但是在与主线程通信过程中同样会因耗时而导致误差。


### Promise.withResolvers() 简介

通常在 `Promise` 中使用 `resolve` 和 `reject` 来控制 `Promise` 的状态，但是如果需要延迟 `resolve` 时就可以将其赋值到外面

```js
let _resolve, _reject
const p = new Promise((resolve, reject) => {
  // 将 resolve 和 reject 赋值到外面，在外面得到结果后再调用
  _resolve = resolve
  _reject = reject
})

p.then(res => console.log('resolve：', res))

// 获取到数据后再 resolve
setTimeout(() => _resolve('获取到的数据'), 1000)
```

但是如果每次都要定义外部变量来接收 `resolve` 和 `reject` 显得不那么优雅，那么就可以使用 `Promise.withResolvers()`，就没有必要定义外部变量了

```js
const { promise, resolve, reject } = Promise.withResolvers()

promise.then(res => console.log('resolve：', res))

setTimeout(() => resolve('获取到的数据'), 1000)
```


### 开发中常见的设计模式

- 装饰器模式
  - 浏览器插件中拦截 `http` 请求入参出参
- 策略模式
  - 路由跳转时根据不同权限等策略跳转不同路由
- 发布订阅模式
  - 微前端父子应用中数据通信 `EventBus`
- 单例模式
  - 数据通信 `EventBus` 保证获取到的是唯一实例



### ts 中 type 和 interface 区别

- `type`
  - 表示**类型别名**，用于给类型起一个新名字
  - 可通过交叉类型 `&` 来模拟扩展
  - 适合定义复杂类型，支持 联合类型 `|` 、交叉类型 `&` 、字面量类型 等类型操作
- `interface`
  - 表示对象的形状
  - 可被 `extends` 扩展，支持 **同名合并**
  - 适合定义 复杂多层次 的对象形状


### 如何理解 ts 泛型

**ts 泛型** 的核心思想是 **参数化类型**，即类型本身也是参数

这允许在创建 **函数**、**接口** 或 **类** 的时候不指定具体的类型，而是在使用时才指定

可以将其类比为函数的参数，是一个占位符，可能更好理解一点





## 网络相关



### http 常见状态码

- `1xx` - 信息性状态码
  - `101 Switching Protocols` 切换协议，如 切换到 `websocket`
- `2xx` - 成功状态码
  - `200 OK` 请求成功
- `3xx` - 重定向状态码
  - `301 Moved Permanently` 永久重定向
  - `302 Found` 临时重定向
  - `304 Not Modified` 资源未修改，协商缓存
- `4xx` - 客户端错误状态码
  - `400 Bad Request` 请求错误
  - `401 Unauthorized` 未授权，权限失效
  - `403 Forbidden` 禁止访问
  - `404 Not Found` 资源不存在
  - `405 Method Not Allowed` 请求方法不允许
- `5xx` - 服务器错误状态码
  - `500 Internal Server Error` 服务器内部错误
  - `502 Bad Gateway` 网关错误，无效响应
  - `503 Service Unavailable` 服务不可用
  - `504 Gateway Timeout` 网关超时




### http 各个版本特点

- `http0.9`
  - 只有 `get` 请求 `html` 文件
- `http1.0`
  - 引入请求头、响应头
  - 新增状态码
  - 缓存机制 `expires`
  - 文件压缩
  - 但是 频繁连接断开耗时很高
- `http1.1`
  - 默认开启持久连接 `Connection: keep-alive` ，支持 `6` 个连接
  - 但是 有 对头阻塞、 `tcp` 慢启动、带宽竞争 问题
- `http2`
  - 多路复用功能，基于二进制分帧层，支持标记、解析、排序资源
  - 支持请求优先级
  - 服务器推送
  - 头部压缩
  - 但是 同样有 `tcp` 对头阻塞、 `tcl` 连接耗时、网络设备协议僵化
- `http3`
  - `quic` 协议，基于 `udp` ，提供数据包重传、拥塞控制，实现多路复用，基于 `udp` 实现快速握手连接
  - 但是 网络设备协议僵化


### http 缓存

- `http` 强缓存
  - `expires`
  - `cache-control`
- `http` 协商缓存
  - `last-modified`
  - `etag`


### url 输入到页面显示过程

- 输入 `url`
- 浏览器进程组装协议，构成完整 `url`
- 浏览器进程通过进程间通信（ `ipc` ）发送 `url` 给网络进程
- 网络进程进行**强缓存**判断，命中则直接返回资源即 `304` 状态码
- 否则发起 `http` 请求
  - `dns` **解析**，获取 `ip` 、 端口
  - 利用 `ip` 和端口，三次握手建立 `tcp` 连接，发送请求
- 服务器响应
  - 检查是否命中**协商缓存**，是则返回 `304` 状态码，否则返回资源
- 浏览器处理响应
  - 解析 `html` 生成 `dom` 树
  - 根据 `css` 生成 `css` 样式表
  - `dom` 树和 `css` 样式表构建 `render` 树
  - 计算成 布局树 ，进行分层，生成分层树，生成绘制列表进行渲染 


### https 是如何保证安全的

`https` 是一种基于 `tls/ssl` 协议的安全传输协议，它可以通过加密和认证等措施来保护数据传输过程中的安全性和隐私性。

- 加密传输 ： 使用 对称加密 来传输数据， 非对称加密 来传输公钥，保证 公钥 和 数据安全
- 身份认证 ： 使用 `ca` 证书对客户端和服务器进行认证，防止伪装攻击
- 完整性校验 ： 使用消息摘要算法对传输的数据进行校验，防止传输过程中被篡改
- 防止重放攻击 ： 使用时间戳和随机数等技术对请求和响应标记，防止重放攻击


### http 中的 keep-alive 的理解

- `http/1.0` 中默认是 **短连接** 模式
  - `tcp` 在每次请求时都会新建一个链接，完成后立即断开链接， 这会导致 `tcp` 频繁握手挥手动作非常耗时
  - 可以通过显式在请求头中配置 `Connection: keep-alive` 来开启长连接，传入  `close` 则关闭长连接。
- `http/1.1` 中默认是 **长连接** 模式
  - 一次 `tcp` 连接，多次传输 `http` 请求，即可避免频繁连接断开所带来的耗时。


### websocket 链接

`websocket` 是一种基于 `tcp` 协议的双向通信协议。

- 利用 `http` 建立连接，首先建立握手过程，与普通 `http` 请求类似，但包含了一些特殊头部字段与状态码 `101` ，例如 `Upgrade: Websocket` 和 `Connection: Upgrade`
- 建立 `tcp` 连接
- 双向通信
- 断开连接，任意一方发送特殊的控制帧（ `Close Frame` ）


### DNS 查询

`DNS` 查询是 域名的 `IP` 地址查询过程，其中会依次经过 **递归查询**、**迭代查询**，如客户端发起一个 `DNS` 查询流程

1. 本地 浏览器 首先查询是否有该 域名 的缓存，有则返回
2. 查询 操作系统 中是否缓存该域名
3. 查询 本地 `host` 是否缓存该域名
4. 请求 本地 `DNS` 服务器，看是否缓存了该域名
5. 如果还找不到，本地 `DNS` 服务器则请求 **根域名服务器**。例如 想要查找 `www.baidu.com` 的 `IP` 地址，根域名服务器 会返回 `.com` 这个 顶级域名服务器 的 `IP` 地址，让 本地 `DNS` 服务器去这里找
6. 本地 `DNS` 服务器向 **顶级域名服务器** 发起查询 `www.baidu.com` 的 `IP` 地址 请求，返回该域名地址的 **权威服务器** 地址
7. 本地 `DNS` 服务器 向 **权威服务器** 发起查询 `www.baidu.com` 的 `IP` 地址 请求，返回该域名的 `IP` 地址
8. 本地 `DNS` 服务器将 查到的 `IP` 地址返回给客户端
9. 缓存 该 `IP` 地址


> 其中 第 `1 - 4` 为 递归查询 ， `5 - 7` 为 迭代查询

![dns](./images/dns.png)



域名的层级关系类似于一个树状结构

- 根 `DNS` 服务器（ `.` ）
- 顶级域名服务器（ `.com` ）
- 权威 `DNS` 服务器（ `server.com` ）


#### DNS 劫持

了解 `DNS` 的查询过程，基本上也能理解 `DNS` 是如何劫持的了，它是一种网络攻击手段，利用对域名系统（ `DNS` ）进行篡改来劫持用户的网络流量导致用户无法正确访问目标网站或被重定向到恶意网站。

`DNS` 劫持的目标一般是本地主机、本地网络设备或 `ISP` 级别进行篡改，例如将 `a.com` 域名的 `IP` 解析到 `b.com` 域名的 `IP` 地址，可能会导致用户个人信息泄露等安全风险。

故为防范 `DNS` 劫持，需要一定的预防手段
- 使用可靠的第三方 `DNS` 解析服务
- 定期检查本地网络设备或路由器的配置，防止被篡改
- 使用 `HTTPS` 协议保证通信安全与完整，防止中间人攻击
- 安装更新放病毒软件，及时发现阻止恶意篡改软件



### CDN 基本原理

内容分发网络，在用户访问相对集中的网络设置一些 缓存服务器 存放相对稳定的资源，当用户访问相应的资源时，由最近的 缓存服务器 （ `CDN` ） 代替 源站点 响应并返回资源。

但是 `CDN` 服务也容易成为黑客恶意攻击的对象， `DDos` 攻击会造成网站资源无法正常请求，从而导致无法正常使用网站，还会消耗大量的 `CDN` 服务流量，所以选择靠谱的能提醒、防范攻击的 `CDN` 服务供应商尤为重要。





## 框架相关

### vite 开发打包快的原因总结

`vite` 的打包速度快主要得益于以下几点，当然说的是开发环境中以及热更新

- 支持 `tree-shaking` ， 开发时按需打包
- 源码 `no-bundle` ， 给 `dev server` 做一次编译，减少开发编译开销
- `node_modules` 依赖包预构建，转换 `es module` ，合并小文件
- 合理利用缓存，源码做协商缓存，依赖包做强缓存
- `esbuild` 承担开发环境的 依赖预构建，正式环境的 `ts` 转译 和 压缩 工作
- `esbuild` 底层 `go` 语言实现与多线程运行，比 `node` 环境运行的 `webpack` 快得多



### 组件和插件区别

- 编写形式
  - 组件编写：`.vue` 文件或 `.jsx`、`.tsx` 文件
  - 插件编写：包含 `install` 方法的**对象**
- 注册方式
  - 组件 `Vue.component()`
  - 插件 `Vue.use()`
- 使用场景
  - 组件用来构成 `App` 业务模块
  - 插件用来增强 `Vue` 功能


### vite 插件开发

- `vite` 插件导出是一个函数，可带入参，在使用插件时传入即可
- 函数要 `return` 一个对象
- 返回的对象要有 `name` 属性
- 返回的对象中使用合适的钩子即可

例如开发一个自动记录上次构建时间的 `vite` 插件，该插件每次构建都会将构建时间以注释方式插入到 `index.html` 中的 `body` 标签下，方便开发者在查看页面元素时可以知道上次构建时间，当然也可以插入一些其他的信息

```js
const injectBuildTime = () => {
  return {
    name: 'inject-build-time',
    transformIndexHtml(html) {
      const now = new Date().toLocaleString()
      return html.replace(
        '<body>',
        `<body><!-- Last Build Time ${now} -->`
      )
    }
  }
}

// vite.config.js
export default defineConfig({
  plugins: [vue(), injectBuildTime()], // 使用插件
})
```


### 虚拟 dom

描述 `dom` 结构的 `js` 对象，相比于真实 `dom` ，更加轻便，对于需要频繁更新的 `dom` 结构，使用 虚拟 `dom` 更能体现其快速更新能力。

- 避免操作真实 `dom`
- 跨平台适配
- 框架设计所需，页面更新最小颗粒度为组件，但可能只需要更新组件中的某个文字，而不需要组件全更新，虚拟 `dom` 就能避免大量的无用更新


### vue 中 v-for 时 key 在组件中的作用

`diff` 过程中，唯一的 `key` 能够有助于 `vue` 去判断同级的两个新旧节点是否相同节点，以便快速进行匹配判断节点是移动、创建、还是删除，从而减少不必要的重新渲染。


### vue 中 keep-alive 理解

`vue` 的内置组件，能够保留组件切换时的数据状态，并采用 `LRU` 缓存策略。

但是 `keep-alive` 并没有提供清理缓存组件的办法，只能通过动态更新 `include` 的方式来失效想要清理缓存的组件。



### nextTick 在 vue2 和 vue3 中的实现区别

- `vue2` 中为了兼容性，使用了几个异步 `api` 来实现
  - `Promise`
  - `MutationObserver`
  - `setImmediate`
  - `setTimeout`
- `vue3` 中则不考虑兼容性，直接使用了 `Promise` 来实现
  ```ts
  export function nextTick(fn?: () => void): Promise<void> {
    return fn ? p.then(fn) : p
  }
  ```


### qiankun 的 3 种 js 隔离方案

`qiankun` 中提供 `3` 种 `js` 沙箱方案

- `SnapshotSanbox` 快照沙箱 - 单例模式
  - 子应用 `mount` 时，保存一份主应用的快照，下次卸载时还原
  - 子应用 `unmount` 时，保存一份子应用的快照，下次挂载时还原
- `LegacySanbox` 兼容沙箱 - 单例模式
  - 使用 `Proxy` 监听，在子应用 新增和修改 `window.xx` 时直接记录 `diff` ，将其用于环境恢复
  - **解决快照沙箱的性能问题**，快照沙箱每次 `diff` 都是全量的，而兼容沙箱不用，所以快照沙箱性能更好
- `ProxySandbox` 代理沙箱
  - 为每个子应用分配一个 `fakeWindow` ，当子应用操作 `window` 时，其实是在 `fakeWindow` 上操作，这样就能实现多应用激活了
  - 子应用在 修改 和 获取 全局属性时，原生属性从全局 `window` 上操作，不是原生属性则优先从 `fakeWindow` 上操作。即 `window.xx` 实际上为 `window.proxy.xx`


### qiankun 的 2 种 css 隔离方案

`qiankun` 主要使用 `shadow dom` 和 `scoped css` 来实现 `css` 隔离

- `shadow dom`

  可以创建一个封闭的 `dom` 结构，这个 `dom` 对外部隔离，包括 `css` ， `qiankun` 在挂载子应用时，会将子应用的 `html` 元素挂载到 `shadow dom` 上，从而实现 `css` 隔离。`shadow dom` 隔离方案可能会有兼容性问题。

```js
// qiankun使用Shadow DOM挂载子应用
const container = document.getElementById('container')
const shadowRoot = container.attachShadow({ mode: 'open' })
shadowRoot.innerHTML = '<div id="subapp-container"></div>'
```

- `scoped css`

  对 `style` 元素的 `css` 文本进行处理，在原有选择器上添加属性选择器




### 小程序的双线程架构

双线程 是指小程序运行时开启两个线程运行的，分别是 **渲染线程** 和 **逻辑线程** 。

- 渲染线程 ， 负责渲染界面，包括解析 `wxml` 、 `wxss` 、样式计算、布局排版 和 绘制视图 等操作
- 逻辑线程 ， 处理业务逻辑、数据，包括调用 小程序 `api` 、 事件回调、请求网络，与客户端通信 等操作

通过双线程协同，能够实现小程序的高性能和流畅体验，并且不支持直接操作 `dom` 。

逻辑线程通过 `setData()` 方式通知渲染线程更新，渲染线程通过 `bindtap` 等事件方式调用逻辑线程。



### JsBridge 基本原理

`Native` 与 `Web` 之间通信的桥梁。

- `Native` 向 `Web` 发送消息
  - `Native` 端直接调用挂载在 `window` 上的全局方法，并可拿到返回值
- `Web` 向 `Native` 发送消息
  - 拦截式 - `Native` 拦截 `Web` 发出的约定格式的 `URL` 请求，参数从 `URL` 上获取
  - 注入式 - `Native` 通过 `Webview` 向 `window` 注入方法， `JS` 能够直接调用 `Native` 的代码逻辑，优先使用





## 浏览器相关

### 移动端 1px 问题

- 伪元素 + `border: 1px` +  `transform: scale(0.5)` （**优解**）
- 直接 `0.5px` ，安卓不支持
- `border-image` ，设置渐变，半边透明
- `border-shadow` ， 模拟边框，但有阴影、模糊， `safari` 不支持 `0.5px` 的 `box-shadow`



### 资源提示符

- `script` 标签上（异步获取资源）
  - `async` 异步获取资源，获取到资源就立即执行，此时的 `dom` 解析可能未完成
  - `defer` 异步获取资源，获取完后会等待 `dom` 解析完毕后再执行
- `link` 标签上（提前获取资源）
  - `preload` 提示浏览器预加载资源，加载完并不运行，还是需要使用 `link` 标签去使用，优先级较高，一般用于加载本页 `js` 、 `css` 资源
  - `prefetch` 提示浏览器预加载资源，加载完并不运行，还是需要使用 `link` 标签去使用，优先级较低，一般用于加载非本页 `js` 、 `css` 资源



### 浏览器指纹

在用户未登录的情况下，利用浏览器版本、环境信息，电脑系统版本、环境信息，网络信息等生成一个唯一标识，用于标记用户以统计或推送推荐和广告等。

- 通常情况下自己可以使用 `canvas` 来生成浏览器指纹，它基于不同浏览器在渲染 `canvas` 元素时的像素渲染细微差异来生成一个独特的标识符。
- 也可以使用 `fingerprintjs` 库来生成浏览器指纹。

以下是利用 `canvas` 生成浏览器指纹的示例代码
```js
// 获取 hashCode 简易方法
const hashCode = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0 // 将 hash 转换为 32 位整数
  }
  return hash
}

// 通过 canvas 生成浏览器指纹
const getCanvasFingerprint = () => {
  // 创建 canvas 元素
  const canvas = document.createElement('canvas')
  canvas.width = 200
  canvas.height = 200

  // 获取 canvas 上下文
  const ctx = canvas.getContext('2d')

  // 设置绘图样式
  ctx.fillStyle = 'rgb(128, 0, 0)'
  ctx.fillRect(10, 10, 100, 100) // 绘制一个红色矩形

  ctx.fillStyle = 'rgb(0, 128, 0)'
  ctx.fillRect(50, 50, 100, 100) // 绘制一个绿色矩形

  ctx.strokeStyle = 'rgb(0, 0, 128)'
  ctx.lineWidth = 5
  ctx.strokeRect(30, 30, 80, 80) // 绘制一个蓝色边框的矩形

  ctx.font = '20px Arial'
  ctx.fillStyle = 'rgb(0, 0, 0)'
  ctx.fillText('Hello!', 60, 110) // 在图形上绘制文本

  // 转换为 DataURL，这将是一个包含图像数据的 base64 字符串
  const dataURL = canvas.toDataURL()

  // 对 dataURL 进行 hash 处理，以生成更短且一致的浏览器指纹
  const hash = hashCode(dataURL)
  return hash
}
```


### 浏览器跨标签页通信方式

#### 需求

实现浏览器跨标签通信，以实现数据同步、共享等需求，例如打开新标签页

#### 方案

常见的跨标签页通信有以下 `7` 种

- `localStorage` 或 `sessionStorage`
- `BroadcastChannel`
- `Shared Worker`
- `Service Worker`
- `window.postMessage`
- `IndexedDB`
- `WebSocket`

#### 特点

- `localStorage` 能做到不同标签页操作的是同一份数据，能实时同步更新数据，监听 `storage` 事件可以更新到页面
- `sessionStorage` 只在打开新标签页时（ `window.open` ）复制一份数据给新标签页，任一标签页数据修改并不会同步给其他标签页，这是因为 `sessionStorage` 的作用范围和生命周期只限于当前会话窗口
- `BroadcastChannel` 是浏览器的消息通信机制，可以实时通过广播通信
- `webWorker` 是独立的后台线程，也可以在其中实现数据通信共享
- `window.postMessage` 可以给指定的标签窗口发送消息
- `IndexedDB` 是浏览器提供的本地数据库
- `WebSocket` 需要服务端支持，但能实现不同浏览器间的数据同步，在线文档类的需求中常见使用

#### 某种特殊实际场景

在实际项目中，有些实时性的系统数据并不想保存在 `localStorage` 中永久保存，而是希望保存在随窗口消失的 `sessionStorage` 中，以便能够每次打开系统时都能重新请求保存

但系统中总有在另一个标签页中打开链接的需求，虽然此时 `sessionStorage` 中的数据会复制一份到新标签页，但是也希望能够像 `localStorage` 一样能够实现同步

意思就是，既需要 `localStorage` 的同步更新，又需要 `sessionStorage` 的随窗口消失的特性

##### 实现思路

由 `Tab A` 打开 `Tab B` ，同步 系统通用 或 用户基本信息 等数据

- 系统全局监听 `storage` 事件
- `Tab B` 中判断 `sessionStorage` 中没有储存的数据 `info` ，则设置一下 `localStorage.setItem('getSessionStorage', Date.now())`
- `Tab A` 中的 `storage` 事件会触发，则在 `storage` 事件回调中将 `info` 设置到 `localStorage` 中
- `Tab A` 设置 `localStorage` ，便会触发 `Tab B` 中的 `storage` 事件，则可以在 `storage` 事件回调中将 `event.newValue` 设置到 `sessionStorage` 中
- 最后删除 `localStorage` 中的信息


##### 注意
- `storage` 事件只会监听其他标签页的 `localStorage` 变化，当前标签的 `localStorage` 变化则不会
- 实际开发中，一般获取 `info` 数据需要在进入系统之前，但是 `storage` 事件触发是异步的，会导致还未监听 `storage` 就进入了系统，所以需要使用 `Promise` 来进行包装

```js
// 大致代码，但还需要根据实际情况在合适的地方移除 事件监听器
async function checkSession() {
  return new Promise(resolve => {
    if (!sessionStorage.userInfo || !Object.keys(JSON.parse(sessionStorage.userInfo)).length) {
      // 如果sessionStorage中没有userInfo或者userInfo是空的，设置localStorage中的一个时间戳
      localStorage.setItem('getSessionStorage', `${Date.now()}`)
    } else {
      // 如果sessionStorage中有userInfo，则直接resolve
      resolve()
    }
    window.addEventListener('storage', function(event) {
      if (event.key === 'getSessionStorage') {
        // 如果其他标签页或窗口设置了getSessionStorage，将sessionStorage中的userInfo存储到localStorage
        localStorage.setItem('userInfo', sessionStorage.getItem('userInfo'))
        // 然后移除localStorage中的getSessionStorage，表示该事件已处理
        localStorage.removeItem('userInfo')
      } else if (event.key === 'userInfo' && event.newValue) {
        // 如果其他标签页或窗口更新了userInfo，将其更新到当前标签页的sessionStorage中
        sessionStorage.setItem('userInfo', event.newValue)
        // 解析新值后，resolve这个Promise
        resolve()
      }
    })
  })
}
function checkLogin() {
  console.log('login')
}
async function main() {
  await checkSession(); // 等待checkSession执行完成
  checkLogin(); // 执行登录检查或其他操作
}
main()
```




## 优化相关

### 常见的性能优化相关问题

性能优化大致可以按以下方向进行

- 文件资源大小优化
- 网络缓存优化
- 脚本执行优化

#### 代码、性能问题

- 数据埋点上报
- 控制台 `network` 、 `performance` 工具分析
- `webpack-bundle-analyzer` 插件打包产物分析


#### http 相关

- 强缓存、协商缓存
- `gzip` 压缩


#### 图片相关

- 图片压缩，小图 `base64` （一般 `< 10kb` 转 `base64`）
- 图片懒加载、预加载
- 字体图标、 `svg`


#### webpack 相关

- 多进程打包
- 缓存 `ast`
- 使用 `cdn`


#### 代码优化

- 耗时计算使用 `web worker`



### 单页应用首屏加载速度慢可能原因

#### 可能原因

- 网络延迟
- 资源文件体积大小
- 脚本执行时间过长

#### 解决方法

- 减小入口文件体积
  - 路由懒加载，已函数形式加载路由
  - `Tree-shaking` 去除未使用的代码
- 静态资源本地缓存
  - 采用 `http` 缓存，后端返回资源设置 `Expire` 、 `Cache-Control`、`Last-Modified`、`Etag` 等
  - 前端合理利用 `localStorage`
- 减少脚本运行时间
  - 耗时脚本使用 `webworker` 开启其他线程运行
  - 使用异步方式运行
- `ui` 框架按需加载、 框架资源使用 `CDN`
- 图片压缩、懒加载
- 开启 `GZip` 压缩


### 前端埋点方案

- `new Image()` 方式上传，无跨域问题，不挂载页面不影响页面，采用 `1` 像素的 `gif` 图体积较小
- `navigator.sendBeacon(url, data)` 方法上传一些统计和诊断数据，不受页面卸载影响，不影响下一个页面的载入，可优先使用此方法来做埋点上传， `new Image()` 做兜底


