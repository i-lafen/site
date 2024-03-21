# 前端监控



## 背景

项目演进时功能复杂且不易不易在测试阶段及时发现潜在问题，导致线上崩溃时无法及时做出响应导致影响客户体验，遂需要一套完整的前端错误监控系统来触发报警。

`sentry` 虽然功能很全面但价格也不便宜，故了解其中核心原理以便自研之需很有必要。


## 功能

### 异常监控

- 资源加载错误
  
  使用 `addEventListener` 来监听 `error` 事件

- js 运行错误

  使用 `window.onerror` 来定义 `js` 异常

- promise 错误

  使用 `addEventListener` 来监听 `unhandledrejection` 事件，捕获未捕获的 `promise.reject` 异常

- ajax、fetch 的异常

  使用 `addEventListener` 来监听 `error` 或 `abort` 事件，或者重写 `xhr` 的 `open` 和 `send` 方法

- vue 错误

  使用 `Vue.config.errorHandler` 来捕获框架抛出的异常


### 用户行为监控

- PV （页面浏览量） - 前端访问即算一次
- UV （用户访问量） - 后端计算用户访问数
- 页面停留时长 - 在 `load` 和 `beforeunload` 里计算
- 页面访问深度 - 监听 `scroll` 事件获取滚动高度
- 用户点击 - 监听点击事件
- 页面跳转 - 监听 `popstate` 、 `hashchange` 方法
- 路由变化 - 在 `router.beforeEach` 中监听


### 性能数据监控

- FP(first-paint)，从页面加载开始到第一个像素绘制到屏幕上的时间
- FCP(first-contentful-paint)，从页面加载开始到页面内容的任何部分在屏幕上完成渲染的时间
- LCP(largest-contentful-paint)，从页面加载开始到最大文本块或图像元素在屏幕上完成渲染的时间
- CLS(layout-shift)，从页面加载开始和其生命周期状态变为隐藏期间发生的所有意外布局偏移的累积分数


这四个性能指标都需要通过 [PerformanceObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceObserver) 对象来获取数据


### 数据上报

#### 上报方式

- `sendBeacon`
- `xhr`
- `image`


#### 上报时机

- `requestIdleCallback/setTimeout` 延时上报
- `beforeunload` 中上报
- 缓存池满则上报


## 总结

暂未整理完...
