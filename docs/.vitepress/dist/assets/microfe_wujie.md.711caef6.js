import{_ as e,o,c as a,Q as c}from"./chunks/framework.281e52d7.js";const f=JSON.parse('{"title":"WuJie 无界微前端框架","description":"","frontmatter":{},"headers":[],"relativePath":"microfe/wujie.md","filePath":"microfe/wujie.md"}'),i={name:"microfe/wujie.md"},d=c('<h1 id="wujie-无界微前端框架" tabindex="-1">WuJie 无界微前端框架 <a class="header-anchor" href="#wujie-无界微前端框架" aria-label="Permalink to &quot;WuJie 无界微前端框架&quot;">​</a></h1><p>基于 <code>webcomponent</code> 容器 + <code>iframe</code> 沙箱 ，能够完善多种场景需求，对于不支持 <code>webcomponent</code> 和 <code>proxy</code> 的环境，也提供了 <code>iframe</code> + <code>Object.defineProperty</code> 的降级方案。</p><ul><li>样式分隔</li><li>运行性能</li><li>子应用预加载</li><li>子应用通信</li><li>子应用保活</li><li>子应用内嵌</li><li>多应用激活</li><li>生命周期</li><li>插件系统</li><li>支持 <code>vite</code></li><li>支持降级兼容 <code>ie9</code></li></ul><h3 id="运行模式" tabindex="-1">运行模式 <a class="header-anchor" href="#运行模式" aria-label="Permalink to &quot;运行模式&quot;">​</a></h3><ul><li>保活模式</li><li>单例模式</li><li>重建模式</li></ul><h2 id="特点" tabindex="-1">特点 <a class="header-anchor" href="#特点" aria-label="Permalink to &quot;特点&quot;">​</a></h2><h3 id="首屏加载快" tabindex="-1">首屏加载快 <a class="header-anchor" href="#首屏加载快" aria-label="Permalink to &quot;首屏加载快&quot;">​</a></h3><p>无界 不仅能做到静态资源的预加载，还能做到子应用的预加载。由于预加载过多资源文件会导致占用主线程，所以采用 <code>requestidlecallback</code> 在空闲时加载子应用。</p><h3 id="运行速度快" tabindex="-1">运行速度快 <a class="header-anchor" href="#运行速度快" aria-label="Permalink to &quot;运行速度快&quot;">​</a></h3><p>子应用的 <code>js</code> 运行在 <code>iframe</code> 中， <code>iframe</code> 是一个天然的沙箱，无需采用 <code>with</code> 的方式来实现沙箱，故运行速度与原生相当。</p><h3 id="css-沙箱" tabindex="-1">css 沙箱 <a class="header-anchor" href="#css-沙箱" aria-label="Permalink to &quot;css 沙箱&quot;">​</a></h3><p>无界的子应用的 <code>dom</code> 放在 <code>webcomponent</code> + <code>shadowdom</code> 的容器中，除了可继承的 <code>css</code> 属性外，实现了子应用之间的 <code>css</code> 原生分离。</p><h3 id="js-沙箱" tabindex="-1">js 沙箱 <a class="header-anchor" href="#js-沙箱" aria-label="Permalink to &quot;js 沙箱&quot;">​</a></h3><p>无界的 <code>js</code> 运行在 <code>iframe</code> 中，实现了应用之间的 <code>window</code>、<code>document</code>、<code>location</code>、<code>history</code> 的完全解耦和分离。</p><h3 id="js-沙箱-和-css-沙箱连接" tabindex="-1">js 沙箱 和 css 沙箱连接 <a class="header-anchor" href="#js-沙箱-和-css-沙箱连接" aria-label="Permalink to &quot;js 沙箱 和 css 沙箱连接&quot;">​</a></h3><p>无界采用 <code>proxy</code> + <code>Object.defineproperty</code> 的方式将 <code>js-iframe</code> 中对 <code>dom</code> 的操作劫持代理到 <code>webcomponent shadowRoot</code> 容器中。</p><h3 id="通信" tabindex="-1">通信 <a class="header-anchor" href="#通信" aria-label="Permalink to &quot;通信&quot;">​</a></h3><ul><li><p><code>window.parent</code> 直接通信</p><p>子应用 <code>js</code> 在和主应用同域的 <code>iframe</code> 内运行，所以 <code>window.parent</code> 可以直接拿到主应用的 <code>window</code> 对象来进行通信</p></li><li><p><code>props</code> 数据注入</p><p>主应用可以向子应用注入 <code>props</code> 对象，里面可以注入数据和方法供子应用调用</p></li><li><p>去中心化 <code>EventBus</code> 通信</p><p>内置的 <code>EventBus</code> 去中心化通信方案可以让应用之间方便的直接通信</p></li></ul><h3 id="生命周期" tabindex="-1">生命周期 <a class="header-anchor" href="#生命周期" aria-label="Permalink to &quot;生命周期&quot;">​</a></h3><ul><li>beforeLoad</li><li>beforeMount</li><li>afterMount</li><li>beforeUnmount</li><li>afterUnmount</li><li>activated（保活模式）</li><li>deactivated（保活模式）</li></ul><h3 id="降级处理" tabindex="-1">降级处理 <a class="header-anchor" href="#降级处理" aria-label="Permalink to &quot;降级处理&quot;">​</a></h3><p>采用另一个的 <code>iframe</code> 替换 <code>webcomponent</code> ，用 <code>Object.defineProperty</code> 替换 <code>proxy</code> 来做代理的方案</p><h2 id="sources" tabindex="-1">Sources <a class="header-anchor" href="#sources" aria-label="Permalink to &quot;Sources&quot;">​</a></h2><ul><li><a href="https://wujie-micro.github.io/doc/guide/start.html" target="_blank" rel="noreferrer">Docs</a></li><li><a href="https://github.com/Tencent/wujie" target="_blank" rel="noreferrer">Github</a></li><li><a href="https://wujie-micro.github.io/demo-main-vue/home" target="_blank" rel="noreferrer">Demo</a></li></ul>',24),r=[d];function l(t,s,n,h,u,p){return o(),a("div",null,r)}const b=e(i,[["render",l]]);export{f as __pageData,b as default};