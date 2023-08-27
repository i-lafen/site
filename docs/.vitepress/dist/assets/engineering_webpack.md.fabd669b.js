import{_ as e,o,c,Q as l}from"./chunks/framework.d544cf0e.js";const k=JSON.parse('{"title":"Webpack","description":"","frontmatter":{},"headers":[],"relativePath":"engineering/webpack.md","filePath":"engineering/webpack.md","lastUpdated":1692961506000}'),d={name:"engineering/webpack.md"},a=l('<h1 id="webpack" tabindex="-1">Webpack <a class="header-anchor" href="#webpack" aria-label="Permalink to &quot;Webpack&quot;">​</a></h1><h3 id="前端代码为什么要构建和打包" tabindex="-1">前端代码为什么要构建和打包 <a class="header-anchor" href="#前端代码为什么要构建和打包" aria-label="Permalink to &quot;前端代码为什么要构建和打包&quot;">​</a></h3><ul><li>体积更小（<code>Tree-Shaking</code>、压缩、合并），加载更快</li><li>编译高级语言或语法（<code>TS</code>、<code>ES6+</code>、模块化、<code>SCSS</code>）</li><li>兼容性和错误检查（<code>polyfil</code>、<code>postcss</code>、<code>eslint</code>）</li><li>统一、高效的开发环境</li><li>统一的构建流程和产出标准</li><li>集成公司构建规范（提测、上线等）</li></ul><h3 id="webpack-构建流程" tabindex="-1">webpack 构建流程 <a class="header-anchor" href="#webpack-构建流程" aria-label="Permalink to &quot;webpack 构建流程&quot;">​</a></h3><p><code>webpack</code> 可以看做一条生产线， 通过 <code>tapable</code> 来组织打包流程，期间会广播事件，插件可以监听事件钩子，来改变打包的结果。大致步骤如下：</p><ul><li>初始化阶段：从配置文件和 <code>shell</code> 语句中读取与合并参数</li><li>编译构建流程：从 <code>entry</code> 出发，分析模块间的依赖关系，针对每个 <code>module</code> 串行调用相对应的 <code>loader</code> 去编译文件内容，再找到 <code>module</code> 所依赖的 <code>module</code>，递归的进行编译处理</li><li>输出：对编译后的 <code>module</code> 组合成 <code>chunk</code>，把 <code>chunk</code> 转换成 文件，输出到 目标出口</li></ul><h3 id="webpack-优化前端性能手段" tabindex="-1">webpack 优化前端性能手段 <a class="header-anchor" href="#webpack-优化前端性能手段" aria-label="Permalink to &quot;webpack 优化前端性能手段&quot;">​</a></h3><ul><li><code>JS</code> 代码压缩</li><li><code>CSS</code> 代码压缩</li><li><code>Html</code> 文件代码压缩</li><li>文件大小压缩</li><li>图片压缩</li><li><code>Tree Shaking</code></li><li>代码分离</li><li>内联 <code>chunk</code></li></ul><h3 id="module、chunk、bundle-分别指什么-区别是什么" tabindex="-1">module、chunk、bundle 分别指什么，区别是什么 <a class="header-anchor" href="#module、chunk、bundle-分别指什么-区别是什么" aria-label="Permalink to &quot;module、chunk、bundle 分别指什么，区别是什么&quot;">​</a></h3><ul><li><code>module</code> 即各个源文件，<code>webpack</code> 中一切皆模块</li><li><code>chunk</code> 多模块合成的，在 <code>webpack</code> 中流转的也称为 <code>chunk</code>，如 <code>entry</code>、<code>import</code>、<code>splitChunk</code> 处理的文件可以称为 <code>chunk</code></li><li><code>bundle</code> 最终输出的文件</li></ul><h3 id="loader-和-plugin-的区别" tabindex="-1">loader 和 plugin 的区别 <a class="header-anchor" href="#loader-和-plugin-的区别" aria-label="Permalink to &quot;loader 和 plugin 的区别&quot;">​</a></h3><ul><li><code>loader</code> 模块转换器 <ul><li>在 <code>webpack</code> 解析模块时，会根据模块类型，调用不同的 <code>loader</code> 对模块进行处理</li></ul></li><li><code>plugin</code> 扩展插件 <ul><li>插件订阅了 <code>webpack</code> 打包过程中的各种钩子，在钩子触发时执行相应的插件函数，即发布订阅模式</li></ul></li></ul><h3 id="webpack-如何实现懒加载" tabindex="-1">webpack 如何实现懒加载 <a class="header-anchor" href="#webpack-如何实现懒加载" aria-label="Permalink to &quot;webpack 如何实现懒加载&quot;">​</a></h3><ul><li><code>import()</code> ，返回一个 <code>promise</code></li><li><code>vue</code>、<code>react</code> 中也是基于 <code>import</code> 来做懒加载</li><li><code>vue-router</code> 异步加载路由</li><li>早期 <code>webpack</code> 通过动态生成 <code>script</code> 标签来实现懒加载</li></ul><h3 id="webpack热模块更新总结" tabindex="-1">webpack热模块更新总结 <a class="header-anchor" href="#webpack热模块更新总结" aria-label="Permalink to &quot;webpack热模块更新总结&quot;">​</a></h3><ul><li>通过 <code>webpack-dev-server</code> 创建两个服务器：提供静态资源的服务（<code>express</code>）和 <code>Socket</code> 服务</li><li><code>express server</code> 负责直接提供静态资源的服务（打包后的资源直接被浏览器请求和解析）</li><li><code>socket server</code> 是一个 <code>websocket</code> 的长连接，双方可以通信</li><li>当 <code>socket server</code> 监听到对应的模块发生变化时，会生成两个文件<code>.json</code>（manifest文件）和<code>.js</code>文件（update chunk）</li><li>通过长连接，<code>socket server</code> 可以直接将这两个文件主动发送给客户端（浏览器）</li><li>浏览器拿到两个新的文件后，通过<code>HMR runtime</code>机制，加载这两个文件，并且针对修改的模块进行更新</li></ul><h3 id="webpack-proxy-工作原理" tabindex="-1">webpack proxy 工作原理 <a class="header-anchor" href="#webpack-proxy-工作原理" aria-label="Permalink to &quot;webpack proxy 工作原理&quot;">​</a></h3><ul><li>通过设置<code>webpack proxy</code>实现代理请求后，相当于浏览器与服务端中添加一个代理者</li><li>当本地发送请求的时候，代理服务器响应该请求，并将请求转发到目标服务器，目标服务器响应数据后再将数据返回给代理服务器，最终再由代理服务器将数据响应给本地</li><li>在代理服务器传递数据给本地浏览器的过程中，两者同源，并不存在跨域行为，这时候浏览器就能正常接收数据</li><li><strong>注意</strong>：服务器与服务器之间请求数据并不会存在跨域行为，跨域行为是浏览器安全策略限制</li></ul><h2 id="webpack-常见性能优化" tabindex="-1">webpack 常见性能优化 <a class="header-anchor" href="#webpack-常见性能优化" aria-label="Permalink to &quot;webpack 常见性能优化&quot;">​</a></h2><h3 id="babel-runtime-和-babel-polyfill-的区别" tabindex="-1">babel-runtime 和 babel-polyfill 的区别 <a class="header-anchor" href="#babel-runtime-和-babel-polyfill-的区别" aria-label="Permalink to &quot;babel-runtime 和 babel-polyfill 的区别&quot;">​</a></h3><ul><li><code>core-js</code> 和 <code>regenerator</code> 的集合 即 <code>babel-polyfill</code>；<code>Babel 7.4</code> 后推荐直接使用这两个库 <ul><li><code>core-js</code> 是集成了 <code>es6</code> 的 <code>polyfill</code></li><li><code>regenerator</code> 是支持 <code>generator</code> 语法的 <code>polyfill</code></li></ul></li><li><code>babel-runtime</code> 不会污染全局环境变量</li></ul><h3 id="es6-module-和-commonjs" tabindex="-1">ES6 Module 和 Commonjs <a class="header-anchor" href="#es6-module-和-commonjs" aria-label="Permalink to &quot;ES6 Module 和 Commonjs&quot;">​</a></h3><ul><li><code>ES6 Module</code> 静态引入，编译时引入</li><li><code>Commonjs</code> 动态引入，执行时引入 只有 <code>ES6 Module</code> 才能静态分析，实现 <code>Tree-Shaking</code></li></ul><h3 id="webpack-多入口" tabindex="-1">webpack 多入口 <a class="header-anchor" href="#webpack-多入口" aria-label="Permalink to &quot;webpack 多入口&quot;">​</a></h3><ul><li>配置 <code>entry</code> 为对象；output 配置输出多个文件名； <code>plugins</code> 需要生成多个 <code>html</code> 文件，并设置 <code>chunk</code> 配置加载哪个文件名。</li></ul><h3 id="webpack-抽离-css-文件" tabindex="-1">webpack 抽离 css 文件 <a class="header-anchor" href="#webpack-抽离-css-文件" aria-label="Permalink to &quot;webpack 抽离 css 文件&quot;">​</a></h3><ul><li>在 <code>loader</code> 中通过 <code>MiniCssExtractPlugin.loader</code> 进行抽离 <code>css</code>，在 <code>plugins</code> 中配置生成 <code>css</code> 文件名</li></ul><h3 id="webpack-抽离公共代码" tabindex="-1">webpack 抽离公共代码 <a class="header-anchor" href="#webpack-抽离公共代码" aria-label="Permalink to &quot;webpack 抽离公共代码&quot;">​</a></h3><ul><li><code>splitChunks</code> 配置，抽离时需根据文件大小、引用次数设置</li></ul><h3 id="webpack-懒加载" tabindex="-1">webpack 懒加载 <a class="header-anchor" href="#webpack-懒加载" aria-label="Permalink to &quot;webpack 懒加载&quot;">​</a></h3><ul><li>通过 <code>js</code> 的 <code>import</code> 来加载文件，返回一个 <code>promise</code></li></ul><h3 id="webpack-处理-vue" tabindex="-1">webpack 处理 vue <a class="header-anchor" href="#webpack-处理-vue" aria-label="Permalink to &quot;webpack 处理 vue&quot;">​</a></h3><ul><li>可以使用 <code>babel</code> 处理，设置 <code>preset</code>；或者 <code>vue-loader</code></li></ul><h3 id="webpack-性能优化" tabindex="-1">webpack 性能优化 <a class="header-anchor" href="#webpack-性能优化" aria-label="Permalink to &quot;webpack 性能优化&quot;">​</a></h3><h4 id="优化打包构建速度-开发体验和效率" tabindex="-1">优化打包构建速度 - 开发体验和效率 <a class="header-anchor" href="#优化打包构建速度-开发体验和效率" aria-label="Permalink to &quot;优化打包构建速度 - 开发体验和效率&quot;">​</a></h4><ul><li>优化 <code>babel-loader</code><ul><li><code>exclude</code> 排除不编译文件</li><li><code>use</code> 中添加 <code>?cacheDirectory</code> 开启缓存</li></ul></li><li><code>IgnorePlugin</code><ul><li>避免引入无用模块</li></ul></li><li><code>noParse</code><ul><li>避免重复打包，例如引入 <code>vue.min.js</code> 已经打包过的文件，跳过打包</li></ul></li><li>自动刷新 <ul><li>开发环境下设置 <code>devServer</code>，<code>watch</code> 会默认开启监听文件变化刷新浏览器，但页面刷新会导致数据状态丢失</li></ul></li><li>热更新 - 开发环境 <ul><li>引入 <code>HotModuleReplacementPlugin</code> <code>插件，devServe</code> 中设置 <code>hot: true</code></li></ul></li><li><code>DllPlugin</code><ul><li>动态链接库插件，常见的 <code>vue</code>、<code>react</code> 较稳定，同一版本只需构建一次，不用每次都构建</li><li><code>webpack</code> 内置 <code>DllPlugin</code> 支持</li><li><code>DllPlugin</code> 打包出 <code>dll</code> 文件</li><li><code>DllReferencePlugin</code> 使用 <code>dll</code> 文件</li></ul></li></ul><h4 id="优化产出代码-产品性能" tabindex="-1">优化产出代码 - 产品性能 <a class="header-anchor" href="#优化产出代码-产品性能" aria-label="Permalink to &quot;优化产出代码 - 产品性能&quot;">​</a></h4><p>目的</p><ul><li>减小体积</li><li>合理分包，不重复加载</li><li>速度更快，内存更小</li></ul><p>产出</p><ul><li>小图片 <code>base64</code> 编码，例如 <code>&lt; 10kb</code></li><li><code>bundle</code> 加 <code>hash</code></li><li>懒加载</li><li>提取公共代码</li><li><code>IgnorePlugin</code></li><li>使用 <code>CDN</code> 加速，生产打包时配置 <code>externals</code>，并在 <code>html</code> 中引入 <code>cdn</code> 地址</li><li>代码压缩</li><li><code>Scope Hosting</code></li><li><code>Tree-shaking</code></li></ul>',41),i=[a];function r(u,t,n,b,h,s){return o(),c("div",null,i)}const m=e(d,[["render",r]]);export{k as __pageData,m as default};
