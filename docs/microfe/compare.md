# 微前端框架对比

目前较为成熟且活跃度较高的微前端框架主要有 `qiankuan` 、 `micro-app` 、 `EMP` 、 `wujie`



## qiankun

基于 `single-spa`

- 方案成熟且活跃度高
- 适配成本较高，工程化、生命周期、静态资源路径、路由等都要做适配改造工作
- 无法支持 `vite` 等 `esmodule` 脚本运行（需要配合 `vite-plugin-qiankun` 包支持，无法开箱即用）



## micro-app

基于 `webcomponent` + `qiankun sandbox` 的微前端方案

### 特点

- 使用 `webcomponent` 加载子应用相比 `single-spa` 这种注册监听方案更加优雅
- 复用 `qiankun` 沙箱机制更加可靠
- 组件式 `api` 更符合使用习惯，支持子应用保活
- 降低子应用改在成本，提供静态资源预加载能力

### 不足

- 低版本支持 `vite` 运行，但必须使用 `plugin` 改造子应用，且 `js` 代码没办法做沙箱隔离
- `1.x` 版本需要使用虚拟路由解决路由和 `js` 沙箱问题



## EMP

`webpack5 module federation` 或 `vite-plugin-federation`

### 特点

- 模块联邦可以保证子应用依赖解耦
- 应用间去中心化的调用、共享模块，共享模块可以是任意颗粒度
- 模块远程 `ts` 支持

### 不足

- 没有有效的 `css` 沙箱、 `js` 沙箱，共享模块依赖约定隔离
- 主、子应用路由可能发生冲突



## wujie

基于 `webcomponent` 容器 + `iframe` 沙箱

## 特点

- 主应用、子应用使用成本低，组件式使用，支持子应用嵌套
- 支持保活模式、单例模式、重建模式，支持多应用加载，并保持子应用路由同步的能力
- 加载速度快，通过 `requestIdleCallback` 支持子应用预加载
- 运行速度快， `js` 运行在 `iframe` 中，无需采用 `with` 方式运行 `js`
- 实现 `css` 沙箱、 `js` 沙箱的原生隔离
- `window.parent` 通信、 `props` 数据注入、 `EventBus` 通信

### 不足

- 目前社区活跃度没有 `qiankun` 、 `micro-app` 高，后续应该会改善
- 可能会导致内存使用较高