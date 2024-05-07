import{_ as s,o as n,c as a,Q as l}from"./chunks/framework.a638f038.js";const o="/site/assets/libuv.d99f822b.png",p="/site/assets/event-loop.6cc028af.png",g=JSON.parse('{"title":"Node Event Loop","description":"","frontmatter":{},"headers":[],"relativePath":"browser/node-eventloop.md","filePath":"browser/node-eventloop.md"}'),e={name:"browser/node-eventloop.md"},c=l('<h1 id="node-event-loop" tabindex="-1">Node Event Loop <a class="header-anchor" href="#node-event-loop" aria-label="Permalink to &quot;Node Event Loop&quot;">​</a></h1><h2 id="node-事件循环" tabindex="-1">Node 事件循环 <a class="header-anchor" href="#node-事件循环" aria-label="Permalink to &quot;Node 事件循环&quot;">​</a></h2><p>浏览器中事件循环根据 <code>HTML5</code> 定义的规范来实现， <code>node</code> 中则是基于 <code>libuv</code> 实现， <code>libuv</code> 是一个跨平台的专注于异步 <code>IO</code> 的库</p><p><img src="'+o+'" alt="libuv"></p><p>上图 <code>EVENT_QUEUE</code> 给人看起来只有一个队列，但 <code>EventLoop</code> 存在 <code>6</code> 个阶段，每个阶段都有对应的一个先进先出的回调队列</p><h2 id="循环流程" tabindex="-1">循环流程 <a class="header-anchor" href="#循环流程" aria-label="Permalink to &quot;循环流程&quot;">​</a></h2><p><code>node</code> 中事件循环分成以下六个阶段</p><p><img src="'+p+`" alt="event-loop"></p><ul><li><code>timers</code> ，执行 <code>setTimeout</code> 、 <code>setInterval</code> 的回调</li><li><code>I/O callbacks</code> ， 执行延迟到下一个循环迭代的 <code>I/O</code> 回调，即上一轮循环中未被执行的一些 <code>I/O</code> 回调</li><li><code>idle，prepare</code> ， 闲置阶段，仅系统内部使用</li><li><code>poll</code> ， 轮询阶段，检索新的 <code>I/O</code> 事件，执行与 <code>I/O</code> 相关的回调， <code>node</code> 将在适当的时候在此阻塞</li><li><code>check</code> ， 检查阶段， <code>setImmediate</code> 回调函数在此执行</li><li><code>close callbacks</code> ， 关闭事件回调，如 <code>socket.on(&#39;close&#39;, () =&gt; {})</code></li></ul><p>每个阶段对应一个队列，当事件循环进入某个阶段时，将在该阶段内执行回调，直到队列耗尽或者回调的最大数量已执行，那就进行下一个处理阶段</p><h2 id="process-nexttick" tabindex="-1">process.nextTick <a class="header-anchor" href="#process-nexttick" aria-label="Permalink to &quot;process.nextTick&quot;">​</a></h2><p>除了上述 <code>6</code> 个阶段，还有 <code>process.nextTick</code> ，他不属于事件循环中的任何一个阶段，他属于该阶段与下阶段之间的过渡，即本阶段执行结束，进入下一个阶段前，所要执行的回调，类似插队</p><h2 id="微任务和宏任务" tabindex="-1">微任务和宏任务 <a class="header-anchor" href="#微任务和宏任务" aria-label="Permalink to &quot;微任务和宏任务&quot;">​</a></h2><p>在 <code>node</code> 中，同样有宏任务与微任务的概念，与浏览器中的事件循环相似</p><p>微任务对应有</p><ul><li><code>process.nextTick</code></li><li><code>Promise.then</code> 、 <code>queueMicrotask</code></li></ul><p>宏任务对应有</p><ul><li><code>timers</code> ： <code>setTimeout</code> 、 <code>setInterval</code></li><li><code>poll queue</code> ： <code>I/O</code> 事件</li><li><code>check queue</code> ： <code>setImmediate</code></li><li><code>close queue</code> ： <code>close</code> 事件</li></ul><p>其执行顺序为以此先微任务，后宏任务</p><h2 id="常见题目" tabindex="-1">常见题目 <a class="header-anchor" href="#常见题目" aria-label="Permalink to &quot;常见题目&quot;">​</a></h2><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">async</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">async1</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;async1 start&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">await</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">async2</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;async1 end&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">async</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">async2</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;async2&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;script start&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">setTimeout</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> () {</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;setTimeout0&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">}, </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">setTimeout</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> () {</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;setTimeout2&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">}, </span><span style="color:#79B8FF;">300</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">setImmediate</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;setImmediate&#39;</span><span style="color:#E1E4E8;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">process.</span><span style="color:#B392F0;">nextTick</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;nextTick1&#39;</span><span style="color:#E1E4E8;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">async1</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">process.</span><span style="color:#B392F0;">nextTick</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;nextTick2&#39;</span><span style="color:#E1E4E8;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">Promise</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> (</span><span style="color:#FFAB70;">resolve</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;promise1&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">resolve</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;promise2&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">}).</span><span style="color:#B392F0;">then</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> () {</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;promise3&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;script end&#39;</span><span style="color:#E1E4E8;">)</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">async</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">async1</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;async1 start&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">await</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">async2</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;async1 end&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">async</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">async2</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;async2&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;script start&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">setTimeout</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> () {</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;setTimeout0&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">}, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">setTimeout</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> () {</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;setTimeout2&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">}, </span><span style="color:#005CC5;">300</span><span style="color:#24292E;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">setImmediate</span><span style="color:#24292E;">(() </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;setImmediate&#39;</span><span style="color:#24292E;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">process.</span><span style="color:#6F42C1;">nextTick</span><span style="color:#24292E;">(() </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;nextTick1&#39;</span><span style="color:#24292E;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">async1</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">process.</span><span style="color:#6F42C1;">nextTick</span><span style="color:#24292E;">(() </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;nextTick2&#39;</span><span style="color:#24292E;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">Promise</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">resolve</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;promise1&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">resolve</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;promise2&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">}).</span><span style="color:#6F42C1;">then</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> () {</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;promise3&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">})</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;script end&#39;</span><span style="color:#24292E;">)</span></span></code></pre></div><p><strong>分析过程</strong></p><ul><li>先找到同步任务，输出 <code>script start</code></li><li>遇到第一个 <code>setTimeout</code>，将里面的回调函数放到 <code>timer</code> 队列中</li><li>遇到第二个 <code>setTimeout</code>，<code>300ms</code> 后将里面的回调函数放到 <code>timer</code> 队列中</li><li>遇到第一个 <code>setImmediate</code> ，将里面的回调函数放到 <code>check</code> 队列中</li><li>遇到第一个 <code>nextTick</code> ，将其里面的回调函数放到本轮同步任务执行完毕后执行</li><li>执行 <code>async1</code> 函数，输出 <code>async1 start</code></li><li>执行 <code>async2</code> 函数，输出 <code>async2</code>，<code>async2</code> 后面的输出 <code>async1 end</code> 进入微任务，等待下一轮的事件循环</li><li>遇到第二个 <code>nextTick</code> ，将其里面的回调函数放到本轮同步任务执行完毕后执行</li><li>遇到 <code>new Promise</code>，执行里面的立即执行函数，输出 <code>promise1</code>、<code>promise2</code></li><li><code>then</code> 里面的回调函数进入微任务队列</li><li>遇到同步任务，输出 <code>script end</code></li><li>执行下一轮回调函数，先依次输出 <code>nextTick</code> 的函数，分别是 <code>nextTick1</code>、<code>nextTick2</code></li><li>然后执行微任务队列，依次输出 <code>async1 end</code>、<code>promise3</code></li><li>执行 <code>timer</code> 队列，依次输出 <code>setTimeout0</code></li><li>接着执行 <code>check</code> 队列，依次输出 <code>setImmediate</code></li><li><code>300ms</code> 后， <code>timer</code> 队列存在任务，执行输出 <code>setTimeout2</code></li></ul><p><strong>执行结果</strong></p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">script start</span></span>
<span class="line"><span style="color:#E1E4E8;">async1 start</span></span>
<span class="line"><span style="color:#E1E4E8;">async2</span></span>
<span class="line"><span style="color:#E1E4E8;">promise1</span></span>
<span class="line"><span style="color:#E1E4E8;">promise2</span></span>
<span class="line"><span style="color:#E1E4E8;">script end</span></span>
<span class="line"><span style="color:#E1E4E8;">nextTick1</span></span>
<span class="line"><span style="color:#E1E4E8;">nextTick2</span></span>
<span class="line"><span style="color:#E1E4E8;">async1 end</span></span>
<span class="line"><span style="color:#E1E4E8;">promise3</span></span>
<span class="line"><span style="color:#E1E4E8;">setTimeout0</span></span>
<span class="line"><span style="color:#E1E4E8;">setImmediate</span></span>
<span class="line"><span style="color:#E1E4E8;">setTimeout2</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">script start</span></span>
<span class="line"><span style="color:#24292E;">async1 start</span></span>
<span class="line"><span style="color:#24292E;">async2</span></span>
<span class="line"><span style="color:#24292E;">promise1</span></span>
<span class="line"><span style="color:#24292E;">promise2</span></span>
<span class="line"><span style="color:#24292E;">script end</span></span>
<span class="line"><span style="color:#24292E;">nextTick1</span></span>
<span class="line"><span style="color:#24292E;">nextTick2</span></span>
<span class="line"><span style="color:#24292E;">async1 end</span></span>
<span class="line"><span style="color:#24292E;">promise3</span></span>
<span class="line"><span style="color:#24292E;">setTimeout0</span></span>
<span class="line"><span style="color:#24292E;">setImmediate</span></span>
<span class="line"><span style="color:#24292E;">setTimeout2</span></span></code></pre></div><p>再如以下题目</p><blockquote><p>理解 process.nextTick 的优先级，还有 Promise.then 以及 setTimeout 和 setImmediate</p></blockquote><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">setImmediate</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;setImmediate&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span>
<span class="line"><span style="color:#B392F0;">setTimeout</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;setTimeout1111&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">setTimeout</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;setTimeout4444&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">  })</span></span>
<span class="line"><span style="color:#E1E4E8;">  process.</span><span style="color:#B392F0;">nextTick</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;setTimeout-nextTick&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">  })</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span>
<span class="line"><span style="color:#B392F0;">setTimeout</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;setTimeout3333&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span>
<span class="line"><span style="color:#E1E4E8;">process.</span><span style="color:#B392F0;">nextTick</span><span style="color:#E1E4E8;">(()</span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;nextTick-outer&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">Promise</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">resolve</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;promise&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">resolve</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">  }).</span><span style="color:#B392F0;">then</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">res</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;promise-then&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">  })</span></span>
<span class="line"><span style="color:#E1E4E8;">  process.</span><span style="color:#B392F0;">nextTick</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;nextTick-inner&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">  })</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span>
<span class="line"><span style="color:#E1E4E8;">process.</span><span style="color:#B392F0;">nextTick</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;nextTick-2222&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span>
<span class="line"><span style="color:#B392F0;">setTimeout</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;setTimeout2222&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">setImmediate</span><span style="color:#24292E;">(() </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;setImmediate&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">})</span></span>
<span class="line"><span style="color:#6F42C1;">setTimeout</span><span style="color:#24292E;">(() </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;setTimeout1111&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">setTimeout</span><span style="color:#24292E;">(() </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;setTimeout4444&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">  })</span></span>
<span class="line"><span style="color:#24292E;">  process.</span><span style="color:#6F42C1;">nextTick</span><span style="color:#24292E;">(() </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;setTimeout-nextTick&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">  })</span></span>
<span class="line"><span style="color:#24292E;">})</span></span>
<span class="line"><span style="color:#6F42C1;">setTimeout</span><span style="color:#24292E;">(() </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;setTimeout3333&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">})</span></span>
<span class="line"><span style="color:#24292E;">process.</span><span style="color:#6F42C1;">nextTick</span><span style="color:#24292E;">(()</span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;nextTick-outer&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">Promise</span><span style="color:#24292E;">((</span><span style="color:#E36209;">resolve</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;promise&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">resolve</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">  }).</span><span style="color:#6F42C1;">then</span><span style="color:#24292E;">(</span><span style="color:#E36209;">res</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;promise-then&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">  })</span></span>
<span class="line"><span style="color:#24292E;">  process.</span><span style="color:#6F42C1;">nextTick</span><span style="color:#24292E;">(() </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;nextTick-inner&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">  })</span></span>
<span class="line"><span style="color:#24292E;">})</span></span>
<span class="line"><span style="color:#24292E;">process.</span><span style="color:#6F42C1;">nextTick</span><span style="color:#24292E;">(() </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;nextTick-2222&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">})</span></span>
<span class="line"><span style="color:#6F42C1;">setTimeout</span><span style="color:#24292E;">(() </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;setTimeout2222&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">})</span></span></code></pre></div><p><strong>输出结果</strong></p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">nextTick</span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;">outer</span></span>
<span class="line"><span style="color:#E1E4E8;">promise</span></span>
<span class="line"><span style="color:#E1E4E8;">nextTick</span><span style="color:#F97583;">-</span><span style="color:#79B8FF;">2222</span></span>
<span class="line"><span style="color:#E1E4E8;">nextTick</span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;">inner</span></span>
<span class="line"><span style="color:#E1E4E8;">promise</span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;">then</span></span>
<span class="line"><span style="color:#E1E4E8;">setTimeout1111</span></span>
<span class="line"><span style="color:#E1E4E8;">setTimeout</span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;">nextTick</span></span>
<span class="line"><span style="color:#E1E4E8;">setTimeout3333</span></span>
<span class="line"><span style="color:#E1E4E8;">setTimeout2222</span></span>
<span class="line"><span style="color:#E1E4E8;">setImmediate</span></span>
<span class="line"><span style="color:#E1E4E8;">setTimeout4444</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">nextTick</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">outer</span></span>
<span class="line"><span style="color:#24292E;">promise</span></span>
<span class="line"><span style="color:#24292E;">nextTick</span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">2222</span></span>
<span class="line"><span style="color:#24292E;">nextTick</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">inner</span></span>
<span class="line"><span style="color:#24292E;">promise</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">then</span></span>
<span class="line"><span style="color:#24292E;">setTimeout1111</span></span>
<span class="line"><span style="color:#24292E;">setTimeout</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">nextTick</span></span>
<span class="line"><span style="color:#24292E;">setTimeout3333</span></span>
<span class="line"><span style="color:#24292E;">setTimeout2222</span></span>
<span class="line"><span style="color:#24292E;">setImmediate</span></span>
<span class="line"><span style="color:#24292E;">setTimeout4444</span></span></code></pre></div>`,30),t=[c];function r(E,y,i,d,F,m){return n(),a("div",null,t)}const T=s(e,[["render",r]]);export{g as __pageData,T as default};
