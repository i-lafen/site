# Webpack


### 前端代码为什么要构建和打包
- 体积更小（`Tree-Shaking`、压缩、合并），加载更快
- 编译高级语言或语法（`TS`、`ES6+`、模块化、`SCSS`）
- 兼容性和错误检查（`polyfil`、`postcss`、`eslint`）
- 统一、高效的开发环境
- 统一的构建流程和产出标准
- 集成公司构建规范（提测、上线等）



### webpack 构建流程
`webpack` 可以看做一条生产线， 通过 `tapable` 来组织打包流程，期间会广播事件，插件可以监听事件钩子，来改变打包的结果。大致步骤如下：
- 初始化阶段：从配置文件和 `shell` 语句中读取与合并参数
- 编译构建流程：从 `entry` 出发，分析模块间的依赖关系，针对每个 `module` 串行调用相对应的 `loader` 去编译文件内容，再找到 `module` 所依赖的 `module`，递归的进行编译处理
- 输出：对编译后的 `module` 组合成 `chunk`，把 `chunk` 转换成 文件，输出到 目标出口



### webpack 优化前端性能手段
- `JS` 代码压缩
- `CSS` 代码压缩
- `Html` 文件代码压缩
- 文件大小压缩
- 图片压缩
- `Tree Shaking`
- 代码分离
- 内联 `chunk`


### module、chunk、bundle 分别指什么，区别是什么
- `module` 即各个源文件，`webpack` 中一切皆模块
- `chunk` 多模块合成的，在 `webpack` 中流转的也称为 `chunk`，如 `entry`、`import`、`splitChunk` 处理的文件可以称为 `chunk`
- `bundle` 最终输出的文件


### loader 和 plugin 的区别
- `loader` 模块转换器
  - 在 `webpack` 解析模块时，会根据模块类型，调用不同的 `loader` 对模块进行处理
- `plugin` 扩展插件
  - 插件订阅了 `webpack` 打包过程中的各种钩子，在钩子触发时执行相应的插件函数，即发布订阅模式


### webpack 如何实现懒加载
- `import()` ，返回一个 `promise`
- `vue`、`react` 中也是基于 `import` 来做懒加载
- `vue-router` 异步加载路由
- 早期 `webpack` 通过动态生成 `script` 标签来实现懒加载



### webpack热模块更新总结
- 通过 `webpack-dev-server` 创建两个服务器：提供静态资源的服务（`express`）和 `Socket` 服务
- `express server` 负责直接提供静态资源的服务（打包后的资源直接被浏览器请求和解析）
- `socket server` 是一个 `websocket` 的长连接，双方可以通信
- 当 `socket server` 监听到对应的模块发生变化时，会生成两个文件`.json`（manifest文件）和`.js`文件（update chunk）
- 通过长连接，`socket server` 可以直接将这两个文件主动发送给客户端（浏览器）
- 浏览器拿到两个新的文件后，通过`HMR runtime`机制，加载这两个文件，并且针对修改的模块进行更新



### webpack proxy 工作原理
- 通过设置`webpack proxy`实现代理请求后，相当于浏览器与服务端中添加一个代理者
- 当本地发送请求的时候，代理服务器响应该请求，并将请求转发到目标服务器，目标服务器响应数据后再将数据返回给代理服务器，最终再由代理服务器将数据响应给本地
- 在代理服务器传递数据给本地浏览器的过程中，两者同源，并不存在跨域行为，这时候浏览器就能正常接收数据
- **注意**：服务器与服务器之间请求数据并不会存在跨域行为，跨域行为是浏览器安全策略限制


## webpack 常见性能优化

### babel-runtime 和 babel-polyfill 的区别
- `core-js` 和 `regenerator` 的集合 即 `babel-polyfill`；`Babel 7.4` 后推荐直接使用这两个库
  - `core-js` 是集成了 `es6` 的 `polyfill`
  - `regenerator` 是支持 `generator` 语法的 `polyfill`
- `babel-runtime` 不会污染全局环境变量


### ES6 Module 和 Commonjs
- `ES6 Module` 静态引入，编译时引入
- `Commonjs` 动态引入，执行时引入
只有 `ES6 Module` 才能静态分析，实现 `Tree-Shaking`




### webpack 多入口
- 配置 `entry` 为对象；output 配置输出多个文件名； `plugins` 需要生成多个 `html` 文件，并设置 `chunk` 配置加载哪个文件名。


### webpack 抽离 css 文件
- 在 `loader` 中通过 `MiniCssExtractPlugin.loader` 进行抽离 `css`，在 `plugins` 中配置生成 `css` 文件名


### webpack 抽离公共代码
- `splitChunks` 配置，抽离时需根据文件大小、引用次数设置


### webpack 懒加载
- 通过 `js` 的 `import` 来加载文件，返回一个 `promise`


### webpack 处理 vue
- 可以使用 `babel` 处理，设置 `preset`；或者 `vue-loader`


### webpack 性能优化
#### 优化打包构建速度 - 开发体验和效率
- 优化 `babel-loader`
  - `exclude` 排除不编译文件
  - `use` 中添加 `?cacheDirectory` 开启缓存
- `IgnorePlugin`
  - 避免引入无用模块
- `noParse`
  - 避免重复打包，例如引入 `vue.min.js` 已经打包过的文件，跳过打包
- 自动刷新
  - 开发环境下设置 `devServer`，`watch` 会默认开启监听文件变化刷新浏览器，但页面刷新会导致数据状态丢失
- 热更新 - 开发环境
  - 引入 `HotModuleReplacementPlugin` `插件，devServe` 中设置 `hot: true`
- `DllPlugin`
  - 动态链接库插件，常见的 `vue`、`react` 较稳定，同一版本只需构建一次，不用每次都构建
  - `webpack` 内置 `DllPlugin` 支持
  - `DllPlugin` 打包出 `dll` 文件
  - `DllReferencePlugin` 使用 `dll` 文件


#### 优化产出代码 - 产品性能
目的
- 减小体积
- 合理分包，不重复加载
- 速度更快，内存更小

产出
- 小图片 `base64` 编码，例如 `< 10kb`
- `bundle` 加 `hash`
- 懒加载
- 提取公共代码
- `IgnorePlugin`
- 使用 `CDN` 加速，生产打包时配置 `externals`，并在 `html` 中引入 `cdn` 地址
- 代码压缩
- `Scope Hosting`
- `Tree-shaking`
