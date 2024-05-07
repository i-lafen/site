import{_ as e,o as d,c as o,Q as c}from"./chunks/framework.25bfaa42.js";const i="/assets/render.90295992.png",_=JSON.parse('{"title":"H5C3","description":"","frontmatter":{},"headers":[],"relativePath":"css/index.md","filePath":"css/index.md"}'),t={name:"css/index.md"},a=c('<h1 id="h5c3" tabindex="-1">H5C3 <a class="header-anchor" href="#h5c3" aria-label="Permalink to &quot;H5C3&quot;">​</a></h1><ul><li><code>flex</code> 布局</li><li><code>grid</code> 布局</li><li><code>css</code> 作用域 <code>css module</code> 、 <code>scoped</code></li><li><code>css</code> 原子化 <code>tailwind css</code> 、 <code>windi css</code></li><li>移动端适配方案</li><li>分层与合成：为什么 <code>css</code> 动画比 <code>js</code> 高效</li></ul><h2 id="常见问题" tabindex="-1">常见问题 <a class="header-anchor" href="#常见问题" aria-label="Permalink to &quot;常见问题&quot;">​</a></h2><ul><li><code>margin</code> 重叠问题</li><li><code>inline-block</code> 元素空白问题</li><li><code>bfc</code></li><li>水平、垂直居中问题</li></ul><h2 id="为什么-html-中-css-样式-在前-script-在后" tabindex="-1">为什么 html 中 css 样式 在前，script 在后 <a class="header-anchor" href="#为什么-html-中-css-样式-在前-script-在后" aria-label="Permalink to &quot;为什么 html 中 css 样式 在前，script 在后&quot;">​</a></h2><ul><li>浏览器 顺序解析 <code>html</code> ，根据 <code>dom</code> 生成 <code>dom</code> 树，根据 <code>css</code> 生成 <code>cssom</code> 树，然后根据这两个生成 <code>render</code> 树；</li><li>解析 <code>dom</code> 的时候遇到 <code>script</code> 会暂停 <code>dom</code> 解析，去下载、解析、运行 <code>script</code> 文件，耗时过长会导致页面一直空白，所以 <code>script</code> 一般放在 <code>dom</code> 的最后；</li><li><code>css</code> 的 <code>link</code> 一般不会阻塞 <code>dom</code> 的解析，但是生成 <code>render</code> 树前需要先生成 <code>cssom</code> ，否则也会白屏，所以 <code>link</code> 一般放在 <code>dom</code> 前面先。</li><li>实际上， <code>js</code> 的下载、运行 依赖 <code>CSSOM</code> ，因为 <code>js</code> 中有可能修改 <code>css</code> 样式，所以需要等待 <code>css</code> 的下载解析，间接导致了 <code>dom</code> 解析的阻塞。</li></ul><p><img src="'+i+'" alt="含js和css的页面渲染流水线"></p><h2 id="浏览器-回流-和-重绘" tabindex="-1">浏览器 回流 和 重绘 <a class="header-anchor" href="#浏览器-回流-和-重绘" aria-label="Permalink to &quot;浏览器 回流 和 重绘&quot;">​</a></h2><ul><li>更新 <code>dom</code> 元素的几何属性（如宽、高等）会触发 回流、重绘</li><li>更新 <code>dom</code> 元素的 绘制属性（背景色） 则 不会 触发回流、只会重绘</li><li>使用 <code>CSS</code> 的 <code>transform</code> 来实现动画效果，这可以避开 回流 和 重绘 阶段，直接在非主线程上执行合成动画操作，能大大提升绘制效率</li><li>复杂动画元素使用 <code>will-change</code> 属性提前告知浏览器该元素将执行复杂动画，让浏览器提前做优化</li></ul><h2 id="script-的-defer-和-async" tabindex="-1">script 的 defer 和 async <a class="header-anchor" href="#script-的-defer-和-async" aria-label="Permalink to &quot;script 的 defer 和 async&quot;">​</a></h2><ul><li>默认情况下，脚本的下载和执行会按照文档的先后顺序解析执行。当脚本下载和执行时，文档解析就会被阻塞，在脚本下载和执行完后再继续解析。</li><li><code>defer</code> 属性在 <code>script</code> 标签中表示 <strong>异步加载脚本</strong>，等文档解析完毕后再执行。</li><li><code>async</code> 属性表示 异步加载脚本，脚本加载完后会 停止文档解析，转而去执行该脚本。</li><li><code>async</code> 和 <code>defer</code> 同时出现，则 <code>async</code> 优先。</li></ul><h2 id="盒模型" tabindex="-1">盒模型 <a class="header-anchor" href="#盒模型" aria-label="Permalink to &quot;盒模型&quot;">​</a></h2><p>布局模型可通过 <code>box-sizing</code> 进行设置，不同值，其计算区域不同：</p><table><thead><tr><th>模型</th><th>box-sizing</th><th>计算区域</th></tr></thead><tbody><tr><td><strong>W3C 标准盒模型</strong>（默认）</td><td>content-box</td><td>width/height</td></tr><tr><td><strong>IE盒模型</strong></td><td>border-box</td><td>width/height+padding+border</td></tr><tr><td>其他</td><td>padding-box</td><td>width/height+padding</td></tr></tbody></table><h2 id="css-兼容方案" tabindex="-1">css 兼容方案 <a class="header-anchor" href="#css-兼容方案" aria-label="Permalink to &quot;css 兼容方案&quot;">​</a></h2><ul><li>浏览器 <code>css</code> 样式初始化，抹平浏览器间的差异（<code>normalize.css</code>）</li><li>添加 <code>css</code> 属性前缀（<code>-webkit-</code>、<code>-moz-</code>、<code>-ms-</code>）</li><li>自动化插件（ <code>Autoprefixer</code> 插件）</li></ul><h2 id="rgba-和-opacity-的透明效果区别" tabindex="-1">rgba 和 opacity 的透明效果区别 <a class="header-anchor" href="#rgba-和-opacity-的透明效果区别" aria-label="Permalink to &quot;rgba 和 opacity 的透明效果区别&quot;">​</a></h2><ul><li><code>rgba</code> 只作用于 <strong>当前元素</strong> 颜色和背景色，其 子元素 和 内容 不会继承 透明效果。</li><li><code>opacity</code> 作用于元素，以及元素内 所有内容 的 透明度。</li></ul>',18),s=[a];function l(r,n,h,m,p,u){return d(),o("div",null,s)}const g=e(t,[["render",l]]);export{_ as __pageData,g as default};
