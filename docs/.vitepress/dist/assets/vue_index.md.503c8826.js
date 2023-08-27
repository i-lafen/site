import{_ as e,o,c,Q as d}from"./chunks/framework.d544cf0e.js";const v=JSON.parse('{"title":"Vue","description":"","frontmatter":{},"headers":[],"relativePath":"vue/index.md","filePath":"vue/index.md","lastUpdated":1692961506000}'),l={name:"vue/index.md"},i=d('<h1 id="vue" tabindex="-1">Vue <a class="header-anchor" href="#vue" aria-label="Permalink to &quot;Vue&quot;">​</a></h1><h2 id="diff-过程简单理解" tabindex="-1">diff 过程简单理解 <a class="header-anchor" href="#diff-过程简单理解" aria-label="Permalink to &quot;diff 过程简单理解&quot;">​</a></h2><ul><li>每次 <code>vnode</code> 都是执行同级比对，不会跨级比较</li><li><code>简单对比，sameVnode</code> 函数会判断两个节点是否相同，主要判断 <code>key</code>、<code>tagName</code>、<code>id</code>、<code>class</code> 是否相同</li><li>设置新旧 <code>vnode</code> 首尾指针</li><li>新旧 头尾 指针比较，向中间靠拢</li><li>进行索引添加/位移 直到新或旧节点遍历完毕</li><li>剩余部分批量处理 添加/删除</li></ul><blockquote><p><code>vue3</code> 对 <code>diff</code> 过程的优化在于，添加了区分静态类型 <code>vnode</code>，如果是 静态类型 的 <code>vnode</code>，则跳过更新，直接修改旧 <code>vnode</code> 引用 指向新的 <code>vnode</code>。</p></blockquote><h2 id="vue3-中-ref、toref、torefs-区别" tabindex="-1">vue3 中 ref、toRef、toRefs 区别 <a class="header-anchor" href="#vue3-中-ref、toref、torefs-区别" aria-label="Permalink to &quot;vue3 中 ref、toRef、toRefs 区别&quot;">​</a></h2><ul><li><code>ref</code> 用于定义 简单值类型 的 具有响应式 的数据。也常用于定义数组类型。</li><li><code>toRef</code> 用于对 <code>reactive</code> 类型数据 的 某个属性 新创建一个 <code>ref</code></li><li><code>toRefs</code> 用于对 <code>reactive</code> 类型数据 所有属性 创建 <code>ref</code>，返回一个普通对象</li></ul><h2 id="watch-和-watcheffect-区别" tabindex="-1">watch 和 watchEffect 区别 <a class="header-anchor" href="#watch-和-watcheffect-区别" aria-label="Permalink to &quot;watch 和 watchEffect 区别&quot;">​</a></h2><ul><li><code>watch</code> 需要指定监听某个值，传入 <code>ref</code> 或 函数（函数应返回要监听的属性）或数组</li><li><code>watchEffect</code> 则不用指定监听值，立即执行传入的一个函数，会自动收集要监听的数据，在数据改变时自动执行；初始化时会执行一次，收集需要监听的数据</li></ul><h2 id="vue3-升级特性" tabindex="-1">vue3 升级特性 <a class="header-anchor" href="#vue3-升级特性" aria-label="Permalink to &quot;vue3 升级特性&quot;">​</a></h2><ul><li><code>createApp</code></li><li><code>emits</code> 属性</li><li>生命周期</li><li>移除 <code>.sync</code>，改为 <code>v-model</code></li><li>移除 <code>filter</code></li><li>移除 <code>$on</code>、<code>$off</code>、<code>$once</code> 实例方法</li><li>异步加载组件， 由 <code>import</code> 增加 <code>defineAsyncComponent</code></li><li>多事件， 可同时绑定多个事件，逗号连接</li><li><code>Composition API</code><ul><li><code>reactive</code></li><li><code>ref</code></li><li><code>readonly</code></li><li><code>watch</code>、<code>watchEffect</code></li><li><code>setup</code></li><li>生命周期钩子函数，<code>setup</code> 代替创建钩子，命名 <code>on</code> + 钩子函数名</li></ul></li><li><code>Teleport</code></li><li><code>Suspense</code></li><li><code>Fragment</code></li></ul><h2 id="proxy-实现响应式的性能提升" tabindex="-1">Proxy 实现响应式的性能提升 <a class="header-anchor" href="#proxy-实现响应式的性能提升" aria-label="Permalink to &quot;Proxy 实现响应式的性能提升&quot;">​</a></h2><ul><li><code>Proxy</code> 初始化时只监听了浅层属性，只有使用到深层属性才进行监听；而 <code>Object.defineProperty</code> 初始化时递归将属性转为响应式</li><li>可监听 新增/删除 属性</li><li>可监听数组变化</li></ul><p><code>Proxy</code> 能规避 <code>Object.defineProperty</code> 的问题，但无法兼容 <code>ie</code>，无法 <code>polyfill</code></p><h2 id="vue3-比-vue2-快" tabindex="-1">vue3 比 vue2 快 <a class="header-anchor" href="#vue3-比-vue2-快" aria-label="Permalink to &quot;vue3 比 vue2 快&quot;">​</a></h2><ul><li><code>Proxy</code> 响应式 <ul><li>响应式数据的惰性监听，只监听初始渲染的可见部分的数据，惰性监听</li></ul></li><li><code>PatchFlag</code> 标记 <ul><li>编译模板时，<strong>标记动态节点</strong>，并区分 <code>text</code>、<code>props</code> 等</li><li><code>diff</code> 算法优化 区分静态节点，以及不同类型的动态节点，<code>diff</code> 过程中<strong>跳过静态节点的比对</strong></li></ul></li><li><code>hoistStatic</code> 静态提升 <ul><li>将静态节点的定义，<strong>提升静态节点</strong>到父作用域，缓存起来</li><li>多个相邻的静态节点，会被<strong>合并静态节点</strong>，并提升到父作用域缓存起来</li><li>空间换时间的优化策略</li></ul></li><li><code>cacheHandler</code> 事件缓存 <ul><li>缓存事件，事件函数一般不会变</li><li>支持多事件，使用逗号隔开</li></ul></li><li><code>SSR</code> 优化 <ul><li>静态节点直接输出，<strong>绕过 vdom</strong></li></ul></li><li><code>tree-shaking</code><ul><li>根据 <code>ES6</code> 的 (<code>import</code> <code>exports</code>)，<code>ES6 module</code> 为静态导入，故能在编译阶段就能知道哪些模块使用了</li><li>另外说一下 <code>CommonJs</code> 是支持动态导入（<code>js</code>执行时导入），但是动态导入就没法在编译阶段做 <code>tree-shaking</code></li></ul></li><li><code>typescript</code> 更好的支持</li></ul><h2 id="为何使用-proxy-代替-object-defineproperty" tabindex="-1">为何使用 Proxy 代替 Object.defineProperty <a class="header-anchor" href="#为何使用-proxy-代替-object-defineproperty" aria-label="Permalink to &quot;为何使用 Proxy 代替 Object.defineProperty&quot;">​</a></h2><ul><li><code>Object.defineProperty</code> 检测不到对象属性的添加和删除；<code>Proxy</code> 能监听整个对象多达 <code>13</code> 种操作。</li><li><code>Object.defineProperty</code> 无法监听数组；<code>Proxy</code> 可以。</li><li><code>Object.defineProperty</code> 需要对每个属性进行递归监听；<code>Proxy</code> 可以惰性监听。</li></ul><h2 id="vite-为何启动快" tabindex="-1">vite 为何启动快 <a class="header-anchor" href="#vite-为何启动快" aria-label="Permalink to &quot;vite 为何启动快&quot;">​</a></h2><ul><li>开发环境 使用 <code>es6 module</code>，无需打包，非常快</li><li>生产环境 使用 <code>rollup</code>，实际并不会快很多</li></ul><p>由此 <code>vite</code> 的缺点也很明显，就是开发环境、生产环境不统一 导致的某些问题较难排查。且目前生态不及 <code>webpack</code></p><h2 id="单页应用首屏加载速度慢可能原因" tabindex="-1">单页应用首屏加载速度慢可能原因 <a class="header-anchor" href="#单页应用首屏加载速度慢可能原因" aria-label="Permalink to &quot;单页应用首屏加载速度慢可能原因&quot;">​</a></h2><h3 id="可能原因" tabindex="-1">可能原因 <a class="header-anchor" href="#可能原因" aria-label="Permalink to &quot;可能原因&quot;">​</a></h3><ul><li>网络延迟</li><li>资源文件体积大小</li><li>脚本执行时间过长</li></ul><h3 id="解决方法" tabindex="-1">解决方法 <a class="header-anchor" href="#解决方法" aria-label="Permalink to &quot;解决方法&quot;">​</a></h3><ul><li>减小入口文件体积 <ul><li>路由懒加载，已函数形式加载路由</li><li><code>Tree-shaking</code> 去除未使用的代码</li></ul></li><li>静态资源本地缓存 <ul><li>采用 <code>http</code> 缓存，后端返回资源设置 <code>Expire</code> 、 <code>Cache-control</code>、<code>Last-Modified</code>、<code>Etag</code> 等</li><li>前端合理利用 <code>localStorage</code></li></ul></li><li><code>ui</code> 框架按需加载、 框架资源使用 <code>CDN</code></li><li>图片压缩、懒加载</li><li>开启 <code>GZip</code> 压缩</li></ul><h2 id="组件和插件区别" tabindex="-1">组件和插件区别 <a class="header-anchor" href="#组件和插件区别" aria-label="Permalink to &quot;组件和插件区别&quot;">​</a></h2><ul><li>编写形式 <ul><li>组件编写：<code>.vue</code> 文件或 <code>.jsx</code>、<code>.tsx</code> 文件</li><li>插件编写：包含 <code>install</code> 方法的<strong>对象</strong></li></ul></li><li>注册方式 <ul><li>组件 <code>Vue.component()</code></li><li>插件 <code>Vue.use()</code></li></ul></li><li>使用场景 <ul><li>组件用来构成 <code>App</code> 业务模块</li><li>插件用来增强 <code>Vue</code> 功能</li></ul></li></ul>',27),a=[i];function t(r,u,n,h,s,f){return o(),c("div",null,a)}const x=e(l,[["render",t]]);export{v as __pageData,x as default};
