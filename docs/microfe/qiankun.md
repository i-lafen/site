# Qiankun


## 开始

众所周知众多微前端方案优缺点并存，选型过程中尽量扬长避短，选择合适的才能事半功倍

而 `qiankun` 凭借社区繁荣而被大多数公司设为首选

### 主要优点
- 解耦，子项目独立开发
- 技术栈无关
- 并行开发
- 独立部署

### 主要挑战
- 性能问题，不同框架子应用的加载运行可能导致性能问题
- 一致性，主要是 `ui` 设计、操作体验等方面
- 状态共享，微前端应用之间共享状态比较复杂，需要使用特殊的工具或模式
- 复杂性，本身所带来的问题也导致了一些复杂，比如静态资源的处理
- 安全性，跨域风险


## qiankun 常见问题

### 1、qiankun 工作原理

- 基于 `single-spa`
- 应用加载： `qiankun` 通过动态创建 `script` 标签方式加载子应用的入口文件，加载完毕会执行子应用暴露出来的生命周期函数
- 生命周期： 子应用需要暴露 `bootstrap` 、 `mount` 、 `unmount` 三个生命周期
- 沙箱隔离： `qiankun` 通过 `Proxy` 对象创建一个 `js` 沙箱，用于隔离子应用的全局变量，防止子应用之间的全局变量污染
- 样式隔离： `qiankun` 通过动态添加移除 `style` 标签的方式实现样式隔离，子应用启动时加载，卸载时移除
- 通信机制： 提供全局通信机制，允许子应用之间进行通信


### 2、qiankun 中如何处理子应用的静态资源加载问题

#### 1、使用公共路径

所有的静态资源加上前缀，使用绝对路径。但不是优解，折腾

#### 2、劫持标签插入函数（优解）

- 对 `html` 中已有的 `img/audio/video` 等标签， `qiankun` 支持重写 `getTemplate` 函数，可以将入口文件 `index.html` 中的静态资源路径替换掉
- 对于动态插入 `img/audio/video` 等标签，劫持 `appendChild` 、 `innerHTML` 、 `insertBefore` 等事件，将资源的相对路径替换成绝对路径

例如处理模板时，代码示例如下
```js
// 微前端启动
start({
  getTemplate(tpl, ...rest) {
    // 应该使用正则匹配，这里只是示例
    return tpl.replace('<img src="./img/1.png" />', '<img src="http://example/img/1.png" />')
  }
})
```

对于动态插入的标签，劫持函数，注入前缀
```js
beforeMount: app => {
  if (app.name === 'appName') {
    $.prototype.html = function(value) {
      const str = value.replace('<img src="./img/1.png" />', '<img src="http://example/img/1.png" />')
      this.[0].innerHTML = str
    }
  }
}
```

#### 3、给 jq 项目加上打包工具

不折腾

#### 4、使用 iframe 嵌入老项目

emmm...


### 3、简述 qiankun 的 start 函数的作用和参数

- **prefetch** ： 预加载模式
  - `true` ，默认值，主应用 `start` 之后即开始预加载所有子应用的静态资源
  - `false`
  - `'all'` ， 无论子应用是否激活，主应用 `start` 之后即开始预加载所有子应用的静态资源
  - `'popstate'` ， 只有路由切换时才会去预加载对应子应用的静态资源
- **sandbox** ： 沙箱模式
  - `true` ， 默认值
  - `false`
  - `{ strictStyleIsolation: true }` 启用严格的样式隔离模式，即子应用的样式会被完全隔离，不会影响其他子应用和主应用
- **singular** ： 是否为单例模式
  - `true` ，默认值，即一次只有一个子应用处于激活状态
  - `false` ，可同时激活多个子应用
- **fetch** ： 自定义的 `fetch` 方法，用于加载子应用的静态资源


### 4、js 沙箱不能解决的 js 污染问题

`qiankun` 的 `js` 沙箱主要时通过代理 `window` 对象来实现的，但给 `body` 标签添加点击事件时， `js` 沙箱并不能消除它的影响。

此时我们应自觉避免直接操作 `window` 和 `document` 对象，必须操作时应当及时清理掉这些全局事件和全局变量，例如代码如下

```js
// 某个应用的处理点击事件
function handleClick() {}

export async function mount(props) {
  // 挂载应用时注册
  window.addEventListener('click', handleClick)
}
export async function unmount() {
  // 卸载应用时移除
  window.removeEventListener('click', handleClick);
}
```


### 5、qiankun 如何实现 keep-alive 的需求

`qiankun` 在子应用卸载时会将环境还原到子应用加载前的状态，以防止子应用对全局的污染，这种设计理念和 `keep-alive` 的需求是相悖的。

#### 在生命周期函数中保存数据

想要在 `qiankun` 中实现 `keep-alive` 也只能弯道实现，例如在子应用的生命周期中保存和恢复子应用的状态，但也仅限是数据而已，并不能保留子应用的 `dom` 状态

```js
// 示例代码
var savedState

export async function mount(props) {
  // 恢复子应用的状态
  if (savedState) {
    restoreState(savedState);
  }
}

export async function unmount() {
  // 保存子应用的状态
  savedState = saveState();
}

function saveState() {
  // 保存子应用的状态
  // 这个函数的实现取决于你的应用
}

function restoreState(state) {
  // 恢复子应用的状态
  // 这个函数的实现取决于你的应用
}
```

#### 手动 loadMicroApp + display: none 子应用

手动加载子应用，不直接卸载，直接隐藏 `dom`


### 6、qiankun 和 iframe 优劣选择

两者都是很成熟的微前端解决方案， `qiankun` 功能强大，应对复杂场景更灵活， `iframe` 使用简单，无兼容问题

基于不同的使用场景选择，对于现代项目，都是使用 `vue` 、 `react` 等框架开发，那 `qiankun` 可能是更好的选择，虽然需要一些接入改造成本，但它拥有更好的用户体验和开发效率。

如果是传统 `jquery` 项目则优先考虑 `iframe` 为佳，但需考虑通信问题、性能问题


### 7、qiankun 多个子应用调试问题

对于如何同时启动多个子应用，可以考虑使用 `npm-run-all` 这个工具来串行或并行来执行你的脚本。

下载 `npm-run-all`

```shell
npm install --save-dev npm-run-all
```

`package.json` 添加脚本

```json
{
  "scripts": {
    "start:app1": "npm start --prefix ./app1",
    "start:app2": "npm start --prefix ./app2",
    "start:all": "npm-run-all start:app1 start:app2"
  }
}
```


### 8、qiankun如何实现 css 隔离，优缺点是什么，还有其他方案吗

`qiankun` 主要使用 `shadow dom` 来实现 `css` 隔离

1. `shadow dom` 可以创建一个封闭的 `dom` 结构，这个 `dom` 对外部隔离，包括 `css` ， `qiankun` 在挂载子应用时，会将子应用的 `html` 元素挂载到 `shadow dom` 上，从而实现 `css` 隔离

```js
// qiankun使用Shadow DOM挂载子应用
const container = document.getElementById('container')
const shadowRoot = container.attachShadow({ mode: 'open' })
shadowRoot.innerHTML = '<div id="subapp-container"></div>'
```

`shadow dom` 隔离方案可能会有兼容性问题。

2. `css module` 样式隔离
3.  `BEM` 命名规范隔离


### 9、qiankun 项目间通信

- **Actions 通信**， `qiankun` 官方提供的通信方式
  - `setGlobalState` 设置 `globalState`
  - 通过 `onGlobalStateChange` 和 `offGlobalStateChange` 注册和取消观察全局变量从而实现通信
- **自己实现一套通信机制**
  - 使用原生的 `CustomEvent` 或类似的第三方库来派发和监听自定义事件
  - 定义一个全局变量和 `on` 、 `emit` 方法

```js
// 示例代码
window.globalEvent = {
  events: {},
  emit(event, data) {
    if (!this.events[event]) {
      return;
    }
    this.events[event].forEach(callback => callback(data));
  },
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  },
};
```


### 10、子项路由目的 hash 和 history 如何处理

`qiankun` 推荐使用 `history` 模式，子应用之间的跳转也是通过主应用的 `router` 对象或原生的 `history` 对象进行。

- 主应用使用 `history` 模式，子应用可使用 `hash` 和 `history` 模式，可使用 `router` 对象跳转
- 主应用使用 `hash` 模式，子应用跳转就需要借助原生的 `history` 对象了


### 11、qiankun 中应用之间如何复用依赖， npm 包除外

- 公共依赖指定为外部依赖，打包时配置 `externals` 选项
- 统一的 `cdn` 文件，加载时先从缓存中获取
- 子应用资源设置 `script` 标签的 `ignore` 属性，主应用加载时会忽略，子应用独立运行时会正常加载


### 12、qiankun 的资源加载机制（import-html-entry）

`import-html-entry` 是 `qiankun` 框架中用于加载子应用的 `html` 入口文件的工具函数，可以方便的将子应用的 `html` 入口作为模块加载。它实现了以下功能
- 加载 `html` 入口文件： `import-html-entry` 会通过创建一个 `link` 标签来加载子应用的 `html` 入口文件，确保子应用的资源得到正确加载
- 解析 `html` 入口文件： 解析入口文件内容，提取出子应用的 `js` 和 `css` 资源的 `url`
- 动态加载 `js` 和 `css` 资源： 动态创建 `script` 和 `link` ，按照正确顺序加载子应用资源
- 创建沙箱环境： 在加载子应用的 `js` 资源时，创建一个沙箱环境，用于隔离 `js`
- 返回子应用的入口模块： `import-html-entry` 返回一个函数，可以在主应用中调用以加载和启动子应用



### 13、几种微前端框架的优缺点

#### qiankun

- 优点
  - 降低应用改造成本，通过 `html entry` 方式引入子应用
  - 提供完备的 `js` 、 `css` 沙箱方案
  - 支持静态资源预加载
  - 社区活跃度高
- 缺点
  - 适配成本较高，包括工程化、生命周期、静态资源路径补全、路由等方面的适配
  - 无法同时激活多个子应用，不支持子应用保活
  - 不支持 `vite` 等 `esmodule` 脚本呢运行，需要配合插件


#### micro-app

- 优点
  - 使用 `webcomponent` 加载子应用
  - 复用大量验证过的 `qiankun` 沙箱机制，提高框架可靠性
  - 支持子应用保活
  - 降低子应用改造成本，提供静态资源预加载能力
- 缺点
  - 多应用激活后也无法保持各个子应用的路由状态，刷新后丢失
  - `css` 沙箱无法完全隔离，需配合命名规范
  - 支持 `vite` 运行，但必须使用 `plugin` 改在子应用，且 `js` 无法做沙箱隔离
  - 对于不支持 `webcomponent` 的浏览器未做降级处理


#### EMP 和 vite-plugin-federation

- 优点
  - `webpack` 模块联邦所有子应用依赖解耦
  - 支持应用间去中心化调用、共享模块
  - 共享模块可以是任意颗粒度，可以是应用、页面、组件、函数、变量
  - 支持模块远程 `ts` 支持
- 缺点
  - 无有效的 `js` 和 `css` 沙箱
  - 无子应用保活、多应用激活方案


#### wujie

- 优点
  - 基于 `webcomponent` 容器和 `iframe` 沙箱，充分解决了适配成本、样式隔离、运行性能、应用通信、保活、多活、 `vite` 支持、状态共享等问题
  - 对于不支持 `proxy` 和 `webcomponent` 的浏览器，提供 `Object.defineProperty` 和 `iframe` 的降级方案
- 缺点
  - 多活应用性能问题
  - `iframe` 通信问题