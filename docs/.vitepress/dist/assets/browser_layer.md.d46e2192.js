import{_ as e,o as a,c as s,Q as o}from"./chunks/framework.281e52d7.js";const l="/site/assets/line.5cbe3ce7.webp",t="/site/assets/reflow.60c861cf.webp",r="/site/assets/repaint.aaa37413.webp",n="/site/assets/gen.aba359fa.webp",c="/site/assets/layer.0edadd07.webp",w=JSON.parse('{"title":"分层与合成","description":"","frontmatter":{},"headers":[],"relativePath":"browser/layer.md","filePath":"browser/layer.md"}'),i={name:"browser/layer.md"},p=o('<h1 id="分层与合成" tabindex="-1">分层与合成 <a class="header-anchor" href="#分层与合成" aria-label="Permalink to &quot;分层与合成&quot;">​</a></h1><h2 id="渲染流程" tabindex="-1">渲染流程 <a class="header-anchor" href="#渲染流程" aria-label="Permalink to &quot;渲染流程&quot;">​</a></h2><p>一个大致渲染流程可以总结如下</p><ul><li>渲染进程将 <code>HTML</code> 内容转换为能够读懂的 <code>DOM</code> 树结构。</li><li>渲染引擎将 <code>CSS</code> 样式表转化为浏览器可以理解的 <code>styleSheets</code> ，计算出 <code>DOM</code> 节点的样式。</li><li>创建 <strong>布局树</strong> ，并计算元素的布局信息。</li><li>对 布局树 进行 分层 ，并生成 <strong>分层树</strong> 。</li><li>为每个图层生成绘制列表，并将其提交到 合成线程 。</li><li>合成线程将图层分成 图块 ，并在 光栅化线程池 中将图块转换成 位图 。</li><li>合成线程 发送绘制图块命令 <code>DrawQuad</code> 给 浏览器进程。</li><li>浏览器进程根据 <code>DrawQuad</code> 消息生成页面，并显示到显示器上</li></ul><p><img src="'+l+'" alt="渲染流水线"></p><h2 id="重排、重绘、合成" tabindex="-1">重排、重绘、合成 <a class="header-anchor" href="#重排、重绘、合成" aria-label="Permalink to &quot;重排、重绘、合成&quot;">​</a></h2><p>在渲染流水线中，生成一帧的方式有 <code>3</code> 种</p><ul><li><p>重排 ， 一般更新元素的几何属性会触发 <img src="'+t+'" alt="重排"></p></li><li><p>重绘 ， 更新元素的绘制属性 <img src="'+r+'" alt="重绘"></p></li><li><p>合成 <img src="'+n+'" alt="合成"></p></li></ul><p>这三种方式的渲染路径是不同的，通常渲染路径越长，生成图像花费的时间就越多。</p><ul><li>重排，需要重新根据 <code>CSSOM</code> 和 <code>DOM</code> 来计算布局树，会让整个渲染流水线的每个阶段都执行一遍</li><li>重绘 因为没有了重新布局的阶段，操作效率稍微高点，但是依然需要重新计算绘制信息，并触发绘制操作之后的一系列操作</li><li>合成 ，不需要触发布局和绘制，在 <strong>合成线程</strong> 上进行，不占用主线程，流畅效率高</li></ul><h2 id="分层、合成" tabindex="-1">分层、合成 <a class="header-anchor" href="#分层、合成" aria-label="Permalink to &quot;分层、合成&quot;">​</a></h2><p>页面上存在炫酷动画时，没有采用 分层 的话，就可能会导致频繁的进行渲染流水线的执行，导致页面卡顿。为了提升渲染效率， <code>chrome</code> 引入了分层和合成机制。</p><p><strong>分层</strong> 和 <strong>合成</strong> 通常是一体的，我们所看到的页面都是平面，但是网页呈现也像 <code>PS</code> 的图层一般，可以由大大小小的<strong>图层</strong>来堆叠而成的。</p><p><strong>分层</strong> 体现在生成 布局树 之后，渲染引擎会根据布局树的特点将其转换成层数（ <code>Layer Tree</code> ），层树中每一个节点都对应一个图层，每个图层对应绘制一张图片，最后绘制时将这些 图片 合成 “一张” 图片。这就是大致的 分层 、 合成 流程。</p><h2 id="开启分层" tabindex="-1">开启分层 <a class="header-anchor" href="#开启分层" aria-label="Permalink to &quot;开启分层&quot;">​</a></h2><p>通常满足下面两点中任意一点的元素就可以被提升为单独的一个图层。</p><ul><li><p>拥有层叠上下文属性的元素会被提升为单独的一层 <img src="'+c+`" alt="分层"></p><p>图中可以看出，明确 <strong>定位属性</strong> 的元素、定义 <strong>透明属性</strong> 的元素、使用 <code>CSS</code> 滤镜的元素等，都拥有 <strong>层叠上下文属性</strong> 。</p></li><li><p>需要剪裁（ <code>clip</code> ）的地方也会被创建为图层，即需要滚动的元素也会创建一个单独的图层</p></li><li><p>will-change</p><p>通过 <code>will-change</code> 属性来提前告知渲染引擎对元素的一些特效变换，生成 分层</p><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">.box</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">will-change</span><span style="color:#E1E4E8;">: tranfrom, opacity;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">.box</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">will-change</span><span style="color:#24292E;">: tranfrom, opacity;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div></li></ul><h2 id="finally" tabindex="-1">Finally <a class="header-anchor" href="#finally" aria-label="Permalink to &quot;Finally&quot;">​</a></h2><p>分层渲染并没有涉及到主线程，这样就大大提升了渲染的效率。这也是 <code>CSS</code> 动画比 <code>JavaScript</code> 动画高效的原因。</p><p>但是凡事都有两面性，每当渲染引擎为一个元素准备一个独立层的时候，它占用的内存也会大大增加，因为从层树开始，后续每个阶段都会多一个层结构，这些都需要额外的内存，所以你需要恰当地使用 <code>will-change</code> 等属性来开启分层</p><h2 id="source" tabindex="-1">Source <a class="header-anchor" href="#source" aria-label="Permalink to &quot;Source&quot;">​</a></h2><p><a href="https://blog.poetries.top/browser-working-principle/" target="_blank" rel="noreferrer">Post</a></p>`,22),d=[p];function h(g,u,_,b,m,y){return a(),s("div",null,d)}const E=e(i,[["render",h]]);export{w as __pageData,E as default};
