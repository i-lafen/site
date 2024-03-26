import{_ as s,o as n,c as a,Q as o}from"./chunks/framework.281e52d7.js";const d=JSON.parse('{"title":"Instanceof","description":"","frontmatter":{},"headers":[],"relativePath":"javascript/instanceof.md","filePath":"javascript/instanceof.md"}'),p={name:"javascript/instanceof.md"},l=o(`<h1 id="instanceof" tabindex="-1">Instanceof <a class="header-anchor" href="#instanceof" aria-label="Permalink to &quot;Instanceof&quot;">​</a></h1><p><code>instanceof</code> 模拟函数实现</p><h2 id="定义" tabindex="-1">定义 <a class="header-anchor" href="#定义" aria-label="Permalink to &quot;定义&quot;">​</a></h2><p>能够在 <strong>实例的原型对象链中</strong> 找到该 <strong>构造函数</strong>的 <code>prototype</code> 属性所指向的 <strong>原型对象</strong>，就返回 <code>true</code></p><h2 id="instanceof-模拟" tabindex="-1">instanceof 模拟 <a class="header-anchor" href="#instanceof-模拟" aria-label="Permalink to &quot;instanceof 模拟&quot;">​</a></h2><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">_instanceof</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> (</span><span style="color:#FFAB70;">left</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">right</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">let</span><span style="color:#E1E4E8;"> proto </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> left.</span><span style="color:#79B8FF;">__proto__</span><span style="color:#E1E4E8;">; </span><span style="color:#6A737D;">// 对象的原型</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">prototype</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">right</span><span style="color:#E1E4E8;">.</span><span style="color:#79B8FF;">prototype</span><span style="color:#E1E4E8;">; </span><span style="color:#6A737D;">// 原型对象</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">while</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (proto </span><span style="color:#F97583;">===</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (proto </span><span style="color:#F97583;">===</span><span style="color:#E1E4E8;"> prototype) </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    proto </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> proto.</span><span style="color:#79B8FF;">__proto__</span><span style="color:#E1E4E8;">; </span><span style="color:#6A737D;">// 向上查找</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">obj</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> {};</span></span>
<span class="line"><span style="color:#B392F0;">_instanceof</span><span style="color:#E1E4E8;">(obj, Object); </span><span style="color:#6A737D;">// 模拟 instanceof</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">_instanceof</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">left</span><span style="color:#24292E;">, </span><span style="color:#E36209;">right</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">let</span><span style="color:#24292E;"> proto </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> left.</span><span style="color:#005CC5;">__proto__</span><span style="color:#24292E;">; </span><span style="color:#6A737D;">// 对象的原型</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">prototype</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">right</span><span style="color:#24292E;">.</span><span style="color:#005CC5;">prototype</span><span style="color:#24292E;">; </span><span style="color:#6A737D;">// 原型对象</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">while</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">true</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (proto </span><span style="color:#D73A49;">===</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (proto </span><span style="color:#D73A49;">===</span><span style="color:#24292E;"> prototype) </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    proto </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> proto.</span><span style="color:#005CC5;">__proto__</span><span style="color:#24292E;">; </span><span style="color:#6A737D;">// 向上查找</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">obj</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {};</span></span>
<span class="line"><span style="color:#6F42C1;">_instanceof</span><span style="color:#24292E;">(obj, Object); </span><span style="color:#6A737D;">// 模拟 instanceof</span></span></code></pre></div>`,6),t=[l];function e(c,r,E,y,i,_){return n(),a("div",null,t)}const f=s(p,[["render",e]]);export{d as __pageData,f as default};