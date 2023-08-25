# WuJie 无界微前端框架

基于 `webcomponent` 容器 + `iframe` 沙箱 ，能够完善多种场景需求，对于不支持 `webcomponent` 和 `proxy` 的环境，也提供了 `iframe` + `Object.defineProperty` 的降级方案。

- 样式分隔
- 运行性能
- 子应用预加载
- 子应用通信
- 子应用保活
- 子应用内嵌
- 多应用激活
- 生命周期
- 插件系统
- 支持 `vite`
- 支持降级兼容 `ie9`


### 运行模式

- 保活模式
- 单例模式
- 重建模式

## 特点

### 首屏加载快

无界 不仅能做到静态资源的预加载，还能做到子应用的预加载。由于预加载过多资源文件会导致占用主线程，所以采用 `requestidlecallback` 在空闲时加载子应用。


### 运行速度快

子应用的 `js` 运行在 `iframe` 中， `iframe` 是一个天然的沙箱，无需采用 `with` 的方式来实现沙箱，故运行速度与原生相当。


### css 沙箱

无界的子应用的 `dom` 放在 `webcomponent` + `shadowdom` 的容器中，除了可继承的 `css` 属性外，实现了子应用之间的 `css` 原生分离。


### js 沙箱

无界的 `js` 运行在 `iframe` 中，实现了应用之间的 `window`、`document`、`location`、`history` 的完全解耦和分离。


### js 沙箱 和 css 沙箱连接

无界采用 `proxy` + `Object.defineproperty` 的方式将 `js-iframe` 中对 `dom` 的操作劫持代理到 `webcomponent shadowRoot` 容器中。


### 通信

- `window.parent` 直接通信

  子应用 `js` 在和主应用同域的 `iframe` 内运行，所以 `window.parent` 可以直接拿到主应用的 `window` 对象来进行通信

- `props` 数据注入

  主应用可以向子应用注入 `props` 对象，里面可以注入数据和方法供子应用调用

- 去中心化 `EventBus` 通信
  
  内置的 `EventBus` 去中心化通信方案可以让应用之间方便的直接通信


### 生命周期

- beforeLoad
- beforeMount
- afterMount
- beforeUnmount
- afterUnmount
- activated（保活模式）
- deactivated（保活模式）


### 降级处理

采用另一个的 `iframe` 替换 `webcomponent` ，用 `Object.defineProperty` 替换 `proxy` 来做代理的方案


## Sources

- [Docs](https://wujie-micro.github.io/doc/guide/start.html)
- [Github](https://github.com/Tencent/wujie)
- [Demo](https://wujie-micro.github.io/demo-main-vue/home)
