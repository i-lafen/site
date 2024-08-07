# Vue

## diff 过程简单理解

- 每次 `vnode` 都是执行同级比对，不会跨级比较
- 快速判断，`isSameVnodeType` 函数会判断两个节点是否相同，主要判断 `type` 、 `key` 是否相同
- 使用 `isSameVnodeType` 函数**从头到尾**快速判断进行更新，直到遇到不同节点
- 使用 `isSameVnodeType` 函数**从尾到头**快速判断进行更新，直到遇到不同节点
- 新、旧节点之间多余节点的对比更新，进行新增或删除
- 乱序节点，使用最长递增子序列进行查找，涉及新增、删除、移动、打补丁等节点操作

> `vue3` 对 `diff` 过程的优化在于，添加了区分静态类型 `vnode`，如果是 静态类型 的 `vnode`，则跳过更新，直接修改旧 `vnode` 引用 指向新的 `vnode`。



## vue 中的事件触发器 vei （vue event invoke）

`addEventListener` 和 `removeEventListener` 事件的频繁注册、销毁必定会消耗大量内存时间，故 `vue` 中使用 `vei` 来做事件的注册销毁，简单来说就是动态修改事件回调函数，即 `invoke.value` ， 简易示例如下代码

```js
// invoke，实际执行的是 invoke.value ，修改事件代码只需重新赋值 invoke.value 即可
var invoke = () => {
  invoke.value()
}

// 事件挂载
invoke.value = () => {
  console.log('事件1执行')
}

// 注册一次 click 事件即可
el.addEventListener('click', invoke)

// 事件重新挂载，而不用重新 removeEventListener 后再 addEventListener
invoke.value = () => {
  console.log('事件2执行')
}
```



## vue3 中 ref、toRef、toRefs 区别 

[官网文档](https://cn.vuejs.org/api/reactivity-utilities.html)

- `ref` 用于定义 简单值类型 的 具有响应式 的数据。也常用于定义数组类型。
- `toRef` 用于对 `reactive` 类型数据 的 某个属性 新创建一个 `ref`
- `toRefs` 用于对 `reactive` 类型数据 所有属性 创建 `ref`，返回一个普通对象



## watch 和 watchEffect 区别

- `watch` 需要指定监听某个值，传入 `ref` 或 函数（函数应返回要监听的属性）或数组
- `watchEffect` 则不用指定监听值，立即执行传入的一个函数，会自动收集要监听的数据，在数据改变时自动执行；初始化时会执行一次，收集需要监听的数据



## vue3 升级特性

- `createApp`
- `emits` 属性
- 生命周期
- 移除 `.sync`，改为 `v-model`
- 移除 `filter`
- 移除 `$on`、`$off`、`$once` 实例方法
- 异步加载组件， 由 `import` 增加 `defineAsyncComponent`
- 多事件， 可同时绑定多个事件，逗号连接
- 新增 `v-memo` 指令优化数据渲染
- `Composition API`
  - `reactive`
  - `ref`
  - `readonly`
  - `watch`、`watchEffect`
  - `setup`
  - 生命周期钩子函数，`setup` 代替创建钩子，命名 `on` + 钩子函数名
- `Teleport`
- `Suspense`
- `Fragment`



## Proxy 实现响应式的性能提升

- `Proxy` 初始化时只监听了浅层属性，只有使用到深层属性才进行监听；而 `Object.defineProperty` 初始化时递归将属性转为响应式
- 可监听 新增/删除 属性
- 可监听数组变化

`Proxy` 能规避 `Object.defineProperty` 的问题，但无法兼容 `ie`，无法 `polyfill`



## vue3 比 vue2 快

[模板编译](https://template-explorer.vuejs.org/)

- `Proxy` 响应式
  - 响应式数据的惰性监听，只监听初始渲染的可见部分的数据，惰性监听
- `PatchFlag` 标记
  - 编译模板时，**标记动态节点**，并区分 `text`、`props` 等
  - `diff` 算法优化 区分静态节点，以及不同类型的动态节点，`diff` 过程中**跳过静态节点的比对**
- `hoistStatic` 静态提升
  - 将静态节点的定义，**提升静态节点**到父作用域，缓存起来
  - 多个相邻的静态节点，会被**合并静态节点**，并提升到父作用域缓存起来
  - 空间换时间的优化策略
- `cacheHandler` 事件缓存
  - 缓存事件，事件函数一般不会变
  - 支持多事件，使用逗号隔开
- `SSR` 优化
  - 静态节点直接输出，**绕过 vdom**
- `tree-shaking`
  - 根据 `ES6` 的 (`import` `exports`)，`ES6 module` 为静态导入，故能在编译阶段就能知道哪些模块使用了
  - 另外说一下 `CommonJs` 是支持动态导入（`js`执行时导入），但是动态导入就没法在编译阶段做 `tree-shaking`
- `typescript` 更好的支持



## nextTick 在 vue2 和 vue3 中的实现区别

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



## 为何使用 Proxy 代替 Object.defineProperty

- `Object.defineProperty` 检测不到对象属性的添加和删除；`Proxy` 能监听整个对象多达 `13` 种操作。
- `Object.defineProperty` 无法监听数组；`Proxy` 可以。
- `Object.defineProperty` 需要对每个属性进行递归监听；`Proxy` 可以惰性监听。



## vite 为何启动快

- 开发环境 使用 `es6 module` 特性 与 `esbuild` 等，无需打包，非常快
- 生产环境 使用 `rollup` ， 配合 `esbuild` 进行编译、压缩等操作

由此 `vite` 的缺点也很明显，就是开发环境、生产环境不统一 导致的某些问题较难排查。且目前生态不及 `webpack` ， 但这些问题都随着更新而抹平




## 单页应用首屏加载速度慢可能原因

### 可能原因
- 网络延迟
- 资源文件体积大小
- 脚本执行时间过长

### 解决方法
- 减小入口文件体积
  - 路由懒加载，已函数形式加载路由
  - `Tree-shaking` 去除未使用的代码
- 静态资源本地缓存
  - 采用 `http` 缓存，后端返回资源设置 `Expire` 、 `Cache-control`、`Last-Modified`、`Etag` 等
  - 前端合理利用 `localStorage`
- `ui` 框架按需加载、 框架资源使用 `CDN`
- 图片压缩、懒加载
- 开启 `GZip` 压缩


## 组件和插件区别
- 编写形式
  - 组件编写：`.vue` 文件或 `.jsx`、`.tsx` 文件
  - 插件编写：包含 `install` 方法的**对象**
- 注册方式
  - 组件 `Vue.component()`
  - 插件 `Vue.use()`
- 使用场景
  - 组件用来构成 `App` 业务模块
  - 插件用来增强 `Vue` 功能
