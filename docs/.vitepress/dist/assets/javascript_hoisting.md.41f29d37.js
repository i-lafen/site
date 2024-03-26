import{_ as s,o as a,c as n,Q as l}from"./chunks/framework.281e52d7.js";const o="/site/assets/var-hoisting.1b87d330.webp",p="/site/assets/func-hoisting.85ae17b8.webp",e="/site/assets/hoisting-like.cd997080.webp",c="/site/assets/js-run.27fd0582.webp",t="/site/assets/compile.23ab1132.webp",b=JSON.parse('{"title":"JS 变量提升","description":"","frontmatter":{},"headers":[],"relativePath":"javascript/hoisting.md","filePath":"javascript/hoisting.md"}'),r={name:"javascript/hoisting.md"},y=l(`<h1 id="js-变量提升" tabindex="-1">JS 变量提升 <a class="header-anchor" href="#js-变量提升" aria-label="Permalink to &quot;JS 变量提升&quot;">​</a></h1><p>我们知道 <code>js</code> 是顺序执行，但是看下以下代码</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">showName</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(myname)</span></span>
<span class="line"><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> myname </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;极客时间&#39;</span></span>
<span class="line"><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">showName</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;函数showName被执行&#39;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">showName</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(myname)</span></span>
<span class="line"><span style="color:#D73A49;">var</span><span style="color:#24292E;"> myname </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;极客时间&#39;</span></span>
<span class="line"><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">showName</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;函数showName被执行&#39;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>如果程序按照 顺序执行 的话，以上代码将会报错，但实际上却不会，复制到浏览器控制台打印</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">函数showName被执行</span></span>
<span class="line"><span style="color:#79B8FF;">undefined</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">函数showName被执行</span></span>
<span class="line"><span style="color:#005CC5;">undefined</span></span></code></pre></div><p>这是 <code>js</code> 中的特性导致，即 <strong>变量提升</strong></p><h2 id="变量提升-hoisting" tabindex="-1">变量提升（Hoisting） <a class="header-anchor" href="#变量提升-hoisting" aria-label="Permalink to &quot;变量提升（Hoisting）&quot;">​</a></h2><h3 id="变量" tabindex="-1">变量 <a class="header-anchor" href="#变量" aria-label="Permalink to &quot;变量&quot;">​</a></h3><p>变量提升不难理解，就是变量会被提升到作用域顶部，早期 <code>js</code> 设计时遗留的问题，可以将上面的变量声明赋值代码看成以下</p><p><img src="`+o+`" alt="var-hoisting"></p><h3 id="函数" tabindex="-1">函数 <a class="header-anchor" href="#函数" aria-label="Permalink to &quot;函数&quot;">​</a></h3><p>接下来看下函数的声明</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">foo</span><span style="color:#E1E4E8;">(){</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;foo&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">bar</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;">(){</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;bar&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">foo</span><span style="color:#24292E;">(){</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;foo&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">var</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">bar</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">function</span><span style="color:#24292E;">(){</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;bar&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>同样可以看成以下</p><p><img src="`+p+'" alt="func-hoisting"></p><h3 id="变量提升简述" tabindex="-1">变量提升简述 <a class="header-anchor" href="#变量提升简述" aria-label="Permalink to &quot;变量提升简述&quot;">​</a></h3><p>所谓的 变量提升 ，是指在 <code>JavaScript</code> 代码执行过程中， <code>JavaScript</code> 引擎把 变量 的声明部分和 函数 的声明部分提升到代码开头的 行为 。变量被提升后，会给变量设置默认值，这个默认值就是我们熟悉的 <code>undefined</code> 。</p><h3 id="变量提升模拟" tabindex="-1">变量提升模拟 <a class="header-anchor" href="#变量提升模拟" aria-label="Permalink to &quot;变量提升模拟&quot;">​</a></h3><p>以上代码模拟变量提升如下图</p><p><img src="'+e+'" alt="hoisting-like"></p><h2 id="js-代码的执行流程" tabindex="-1">js 代码的执行流程 <a class="header-anchor" href="#js-代码的执行流程" aria-label="Permalink to &quot;js 代码的执行流程&quot;">​</a></h2><p><strong>变量提升</strong> 的存在意味着代码在执行之前，浏览器是做了类似于上面我们模拟的将声明移动到最前面的做法。</p><p>但是，移动代码到最前面这个说法并不准确，实际上变量和函数在代码中的位置是不会变的，是在 <strong>编译阶段</strong>，被 <code>js</code> 引擎存放到了内存中。</p><p>一段 <code>js</code> 代码，是需要经过 <strong>编译</strong> 之后才会进入 <strong>执行</strong> 阶段的。</p><p><img src="'+c+'" alt="js-run"></p><h3 id="编译阶段" tabindex="-1">编译阶段 <a class="header-anchor" href="#编译阶段" aria-label="Permalink to &quot;编译阶段&quot;">​</a></h3><p>我们有了 <code>js</code> 编译、执行的概念后，可以将上面代码，根据这个过程画图如下</p><p><img src="'+t+`" alt="compile"></p><p>由图可知，经过编译后，会生成两部分内容</p><ul><li>执行上下文</li><li>可执行代码</li></ul><h4 id="执行上下文" tabindex="-1">执行上下文 <a class="header-anchor" href="#执行上下文" aria-label="Permalink to &quot;执行上下文&quot;">​</a></h4><p>执行上下文是 <code>JavaScript</code> 执行一段代码时的运行环境，比如调用一个函数，就会进入这个函数的执行上下文，确定该函数在执行期间用到的诸如 <code>this</code> 、变量、对象 以及 函数 等</p><p>执行上下文中保存的是 <strong>变量环境对象</strong>，可以看成结构如下</p><div class="language-c++ vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c++</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">VariableEnvironment:</span></span>
<span class="line"><span style="color:#e1e4e8;">  myname -&gt; undefined, </span></span>
<span class="line"><span style="color:#e1e4e8;">  showName -&gt;function : {console.log(myname)}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">VariableEnvironment:</span></span>
<span class="line"><span style="color:#24292e;">  myname -&gt; undefined, </span></span>
<span class="line"><span style="color:#24292e;">  showName -&gt;function : {console.log(myname)}</span></span></code></pre></div><p>编译阶段， <code>js</code> 引擎就将 变量 和 函数 保存到了 <strong>变量环境对象</strong> 中。</p><h3 id="执行阶段" tabindex="-1">执行阶段 <a class="header-anchor" href="#执行阶段" aria-label="Permalink to &quot;执行阶段&quot;">​</a></h3><p>执行阶段就比较好理解了，就是顺序执行下来，遇到 变量 或 函数 就从 <strong>执行上下文中</strong> 查找。</p><h2 id="同名的函数提升" tabindex="-1">同名的函数提升 <a class="header-anchor" href="#同名的函数提升" aria-label="Permalink to &quot;同名的函数提升&quot;">​</a></h2><p>观察以下代码，输出的是什么</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">showName</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;极客邦&#39;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#B392F0;">showName</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">showName</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;极客时间&#39;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#B392F0;">showName</span><span style="color:#E1E4E8;">();</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">showName</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;极客邦&#39;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#6F42C1;">showName</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">showName</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;极客时间&#39;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#6F42C1;">showName</span><span style="color:#24292E;">();</span></span></code></pre></div><p>记住一个结论，就是 <code>js</code> 代码是需要经过 <strong>编译 - 执行</strong> 的，所以以上代码可以做如下分析</p><ul><li><strong>编译阶段</strong>， <code>js</code> 引擎会查找代码中的声明语句，发现两个同名的函数声明，此时后者会覆盖前者</li><li><strong>执行阶段</strong>， 遇到 <code>showName()</code> ，从执行上下文中找到函数并调用，所以其实两次调用打印的都是后者</li></ul><h2 id="函数提升是最高优先级" tabindex="-1">函数提升是最高优先级 <a class="header-anchor" href="#函数提升是最高优先级" aria-label="Permalink to &quot;函数提升是最高优先级&quot;">​</a></h2><p>同名的变量和函数，函数提升会覆盖变量提升</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">typeof</span><span style="color:#E1E4E8;"> showName) </span><span style="color:#6A737D;">// function</span></span>
<span class="line"><span style="color:#6A737D;">// 变量</span></span>
<span class="line"><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> showName </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">999</span><span style="color:#E1E4E8;"> </span><span style="color:#6A737D;">// 执行阶段，覆盖了原来的函数</span></span>
<span class="line"><span style="color:#E1E4E8;">console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">typeof</span><span style="color:#E1E4E8;"> showName) </span><span style="color:#6A737D;">// number</span></span>
<span class="line"><span style="color:#6A737D;">// 函数</span></span>
<span class="line"><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">showName</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">typeof</span><span style="color:#E1E4E8;"> showName) </span><span style="color:#6A737D;">// number</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">typeof</span><span style="color:#24292E;"> showName) </span><span style="color:#6A737D;">// function</span></span>
<span class="line"><span style="color:#6A737D;">// 变量</span></span>
<span class="line"><span style="color:#D73A49;">var</span><span style="color:#24292E;"> showName </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">999</span><span style="color:#24292E;"> </span><span style="color:#6A737D;">// 执行阶段，覆盖了原来的函数</span></span>
<span class="line"><span style="color:#24292E;">console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">typeof</span><span style="color:#24292E;"> showName) </span><span style="color:#6A737D;">// number</span></span>
<span class="line"><span style="color:#6A737D;">// 函数</span></span>
<span class="line"><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">showName</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">typeof</span><span style="color:#24292E;"> showName) </span><span style="color:#6A737D;">// number</span></span></code></pre></div><ul><li>编译阶段，函数声明覆盖了变量</li><li>执行阶段，变量的赋值，覆盖了原来的函数声明</li></ul><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><ul><li><code>js</code> 是顺序执行的，但是需要经过 <strong>编译 - 执行</strong> 阶段，编译 过程存在 <strong>变量提升</strong> ，这是 <code>js</code> 早期为了方便简单做的设计</li><li>同名函数 会在 编译阶段 被后者覆盖</li><li><strong>函数声明提升</strong> 优先级高于 <strong>变量提升</strong></li><li><code>js</code> 是 先编译后执行</li></ul><h2 id="finally" tabindex="-1">Finally <a class="header-anchor" href="#finally" aria-label="Permalink to &quot;Finally&quot;">​</a></h2><p>观察如下代码，输出什么</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">showName</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">showName</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">2</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">showName</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#B392F0;">showName</span><span style="color:#E1E4E8;">()</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">showName</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#D73A49;">var</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">showName</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">function</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">showName</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#6F42C1;">showName</span><span style="color:#24292E;">()</span></span></code></pre></div><ul><li>编译阶段<div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> showName</span></span>
<span class="line"><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">showName</span><span style="color:#E1E4E8;">() { console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">) } </span><span style="color:#6A737D;">// 函数声明提升 优先级高于 变量提升</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">var</span><span style="color:#24292E;"> showName</span></span>
<span class="line"><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">showName</span><span style="color:#24292E;">() { console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">) } </span><span style="color:#6A737D;">// 函数声明提升 优先级高于 变量提升</span></span></code></pre></div></li><li>执行阶段<div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">showName</span><span style="color:#E1E4E8;">() </span><span style="color:#6A737D;">// 1</span></span>
<span class="line"><span style="color:#B392F0;">showName</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;">() { console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">2</span><span style="color:#E1E4E8;">) } </span><span style="color:#6A737D;">// 同名函数被重新赋值</span></span>
<span class="line"><span style="color:#B392F0;">showName</span><span style="color:#E1E4E8;">() </span><span style="color:#6A737D;">// 2</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">showName</span><span style="color:#24292E;">() </span><span style="color:#6A737D;">// 1</span></span>
<span class="line"><span style="color:#6F42C1;">showName</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">function</span><span style="color:#24292E;">() { console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">) } </span><span style="color:#6A737D;">// 同名函数被重新赋值</span></span>
<span class="line"><span style="color:#6F42C1;">showName</span><span style="color:#24292E;">() </span><span style="color:#6A737D;">// 2</span></span></code></pre></div></li></ul><p>记住一个结论就是， <code>js</code> 中 函数声明是优先级最高的存在，以下例子体会</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">typeof</span><span style="color:#E1E4E8;"> showName) </span><span style="color:#6A737D;">// function</span></span>
<span class="line"><span style="color:#B392F0;">showName</span><span style="color:#E1E4E8;">() </span><span style="color:#6A737D;">// 111</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 变量</span></span>
<span class="line"><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> showName </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">999</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">typeof</span><span style="color:#E1E4E8;"> showName) </span><span style="color:#6A737D;">// number</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">showName</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">222</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#B392F0;">showName</span><span style="color:#E1E4E8;">() </span><span style="color:#6A737D;">// 222</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 函数</span></span>
<span class="line"><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">showName</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">111</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">showName</span><span style="color:#E1E4E8;">() </span><span style="color:#6A737D;">// 222</span></span>
<span class="line"><span style="color:#E1E4E8;">console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">typeof</span><span style="color:#E1E4E8;"> showName) </span><span style="color:#6A737D;">// function</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">typeof</span><span style="color:#24292E;"> showName) </span><span style="color:#6A737D;">// function</span></span>
<span class="line"><span style="color:#6F42C1;">showName</span><span style="color:#24292E;">() </span><span style="color:#6A737D;">// 111</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 变量</span></span>
<span class="line"><span style="color:#D73A49;">var</span><span style="color:#24292E;"> showName </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">999</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">typeof</span><span style="color:#24292E;"> showName) </span><span style="color:#6A737D;">// number</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">var</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">showName</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">function</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">222</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#6F42C1;">showName</span><span style="color:#24292E;">() </span><span style="color:#6A737D;">// 222</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 函数</span></span>
<span class="line"><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">showName</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">111</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">showName</span><span style="color:#24292E;">() </span><span style="color:#6A737D;">// 222</span></span>
<span class="line"><span style="color:#24292E;">console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">typeof</span><span style="color:#24292E;"> showName) </span><span style="color:#6A737D;">// function</span></span></code></pre></div>`,54),E=[y];function i(d,h,g,F,u,m){return a(),n("div",null,E)}const v=s(r,[["render",i]]);export{b as __pageData,v as default};