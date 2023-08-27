import{_ as s,o as a,c as n,Q as o}from"./chunks/framework.d544cf0e.js";const _=JSON.parse('{"title":"New","description":"","frontmatter":{},"headers":[],"relativePath":"javascript/new.md","filePath":"javascript/new.md","lastUpdated":1692961506000}'),l={name:"javascript/new.md"},p=o(`<h1 id="new" tabindex="-1">New <a class="header-anchor" href="#new" aria-label="Permalink to &quot;New&quot;">​</a></h1><p><code>new</code> 模拟实现，由于 <code>new</code> 是关键词，故通过函数实现</p><h2 id="new-时流程" tabindex="-1">new 时流程 <a class="header-anchor" href="#new-时流程" aria-label="Permalink to &quot;new 时流程&quot;">​</a></h2><ul><li>创建一个新对象</li><li>将新对象 <code>__proto__</code> 指向构造函数的 <code>prototype</code></li><li>将 <code>this</code> 指向该新对象，执行构造函数</li><li>返回这个新对象</li></ul><h2 id="new-模拟" tabindex="-1">new 模拟 <a class="header-anchor" href="#new-模拟" aria-label="Permalink to &quot;new 模拟&quot;">​</a></h2><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">objectCreate</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> (</span><span style="color:#FFAB70;">Ctor</span><span style="color:#E1E4E8;">, </span><span style="color:#F97583;">...</span><span style="color:#FFAB70;">rest</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">obj</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> Object.</span><span style="color:#B392F0;">create</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">Ctor</span><span style="color:#E1E4E8;">.</span><span style="color:#79B8FF;">prototype</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">res</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> Ctor.</span><span style="color:#B392F0;">apply</span><span style="color:#E1E4E8;">(obj, rest);</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">typeof</span><span style="color:#E1E4E8;"> res </span><span style="color:#F97583;">===</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;object&#39;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">?</span><span style="color:#E1E4E8;"> res </span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> obj;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">obj</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">objectCreate</span><span style="color:#E1E4E8;">(Object, { a: </span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;"> }); </span><span style="color:#6A737D;">// 模拟 new</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">objectCreate</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">Ctor</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">...</span><span style="color:#E36209;">rest</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">obj</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> Object.</span><span style="color:#6F42C1;">create</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">Ctor</span><span style="color:#24292E;">.</span><span style="color:#005CC5;">prototype</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">res</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> Ctor.</span><span style="color:#6F42C1;">apply</span><span style="color:#24292E;">(obj, rest);</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">typeof</span><span style="color:#24292E;"> res </span><span style="color:#D73A49;">===</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;object&#39;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">?</span><span style="color:#24292E;"> res </span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> obj;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">obj</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">objectCreate</span><span style="color:#24292E;">(Object, { a: </span><span style="color:#005CC5;">1</span><span style="color:#24292E;"> }); </span><span style="color:#6A737D;">// 模拟 new</span></span></code></pre></div>`,6),e=[p];function t(c,r,y,E,i,d){return a(),n("div",null,e)}const C=s(l,[["render",t]]);export{_ as __pageData,C as default};
