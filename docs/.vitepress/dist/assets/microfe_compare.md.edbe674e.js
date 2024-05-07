import{_ as e,o,c as a,Q as i}from"./chunks/framework.a638f038.js";const q=JSON.parse('{"title":"微前端框架对比","description":"","frontmatter":{},"headers":[],"relativePath":"microfe/compare.md","filePath":"microfe/compare.md"}'),c={name:"microfe/compare.md"},d=i('<h1 id="微前端框架对比" tabindex="-1">微前端框架对比 <a class="header-anchor" href="#微前端框架对比" aria-label="Permalink to &quot;微前端框架对比&quot;">​</a></h1><p>目前较为成熟且活跃度较高的微前端框架主要有 <code>qiankuan</code> 、 <code>micro-app</code> 、 <code>EMP</code> 、 <code>wujie</code></p><h2 id="qiankun" tabindex="-1">qiankun <a class="header-anchor" href="#qiankun" aria-label="Permalink to &quot;qiankun&quot;">​</a></h2><p>基于 <code>single-spa</code></p><ul><li>方案成熟且活跃度高</li><li>适配成本较高，工程化、生命周期、静态资源路径、路由等都要做适配改造工作</li><li>无法支持 <code>vite</code> 等 <code>esmodule</code> 脚本运行（需要配合 <code>vite-plugin-qiankun</code> 包支持，无法开箱即用）</li></ul><h2 id="micro-app" tabindex="-1">micro-app <a class="header-anchor" href="#micro-app" aria-label="Permalink to &quot;micro-app&quot;">​</a></h2><p>基于 <code>webcomponent</code> + <code>qiankun sandbox</code> 的微前端方案</p><h3 id="特点" tabindex="-1">特点 <a class="header-anchor" href="#特点" aria-label="Permalink to &quot;特点&quot;">​</a></h3><ul><li>使用 <code>webcomponent</code> 加载子应用相比 <code>single-spa</code> 这种注册监听方案更加优雅</li><li>复用 <code>qiankun</code> 沙箱机制更加可靠</li><li>组件式 <code>api</code> 更符合使用习惯，支持子应用保活</li><li>降低子应用改在成本，提供静态资源预加载能力</li></ul><h3 id="不足" tabindex="-1">不足 <a class="header-anchor" href="#不足" aria-label="Permalink to &quot;不足&quot;">​</a></h3><ul><li>低版本支持 <code>vite</code> 运行，但必须使用 <code>plugin</code> 改造子应用，且 <code>js</code> 代码没办法做沙箱隔离</li><li><code>1.x</code> 版本需要使用虚拟路由解决路由和 <code>js</code> 沙箱问题</li></ul><h2 id="emp" tabindex="-1">EMP <a class="header-anchor" href="#emp" aria-label="Permalink to &quot;EMP&quot;">​</a></h2><p><code>webpack5 module federation</code> 或 <code>vite-plugin-federation</code></p><h3 id="特点-1" tabindex="-1">特点 <a class="header-anchor" href="#特点-1" aria-label="Permalink to &quot;特点&quot;">​</a></h3><ul><li>模块联邦可以保证子应用依赖解耦</li><li>应用间去中心化的调用、共享模块，共享模块可以是任意颗粒度</li><li>模块远程 <code>ts</code> 支持</li></ul><h3 id="不足-1" tabindex="-1">不足 <a class="header-anchor" href="#不足-1" aria-label="Permalink to &quot;不足&quot;">​</a></h3><ul><li>没有有效的 <code>css</code> 沙箱、 <code>js</code> 沙箱，共享模块依赖约定隔离</li><li>主、子应用路由可能发生冲突</li></ul><h2 id="wujie" tabindex="-1">wujie <a class="header-anchor" href="#wujie" aria-label="Permalink to &quot;wujie&quot;">​</a></h2><p>基于 <code>webcomponent</code> 容器 + <code>iframe</code> 沙箱</p><h2 id="特点-2" tabindex="-1">特点 <a class="header-anchor" href="#特点-2" aria-label="Permalink to &quot;特点&quot;">​</a></h2><ul><li>主应用、子应用使用成本低，组件式使用，支持子应用嵌套</li><li>支持保活模式、单例模式、重建模式，支持多应用加载，并保持子应用路由同步的能力</li><li>加载速度快，通过 <code>requestIdleCallback</code> 支持子应用预加载</li><li>运行速度快， <code>js</code> 运行在 <code>iframe</code> 中，无需采用 <code>with</code> 方式运行 <code>js</code></li><li>实现 <code>css</code> 沙箱、 <code>js</code> 沙箱的原生隔离</li><li><code>window.parent</code> 通信、 <code>props</code> 数据注入、 <code>EventBus</code> 通信</li></ul><h3 id="不足-2" tabindex="-1">不足 <a class="header-anchor" href="#不足-2" aria-label="Permalink to &quot;不足&quot;">​</a></h3><ul><li>目前社区活跃度没有 <code>qiankun</code> 、 <code>micro-app</code> 高，后续应该会改善</li><li>可能会导致内存使用较高</li></ul>',23),l=[d];function r(t,n,s,h,u,p){return o(),a("div",null,l)}const b=e(c,[["render",r]]);export{q as __pageData,b as default};