import{_ as s,o as n,c as a,Q as p}from"./chunks/framework.281e52d7.js";const F=JSON.parse('{"title":"Webpack5 Module Federation","description":"","frontmatter":{},"headers":[],"relativePath":"microfe/federation.md","filePath":"microfe/federation.md","lastUpdated":1692961506000}'),l={name:"microfe/federation.md"},e=p(`<h1 id="webpack5-module-federation" tabindex="-1">Webpack5 Module Federation <a class="header-anchor" href="#webpack5-module-federation" aria-label="Permalink to &quot;Webpack5 Module Federation&quot;">​</a></h1><h2 id="模块联邦概念" tabindex="-1">模块联邦概念 <a class="header-anchor" href="#模块联邦概念" aria-label="Permalink to &quot;模块联邦概念&quot;">​</a></h2><p>区分 <strong>本地模块</strong> 和 <strong>远程模块</strong> 。</p><ul><li>本地模块 即为普通模块，为当前构建的一部分</li><li>远程模块 不属于当前构建的模块，并在运行时从所谓的容器加载</li></ul><p>加载远程模块是异步操作，通常使用 <code>import()</code> 实现，但也支持像 <code>require.ensure</code> 或 <code>require([...])</code> 之类的旧语法.</p><p>容器由容器入口创建，入口暴露了对特定模块的异步访问。</p><h2 id="优点" tabindex="-1">优点 <a class="header-anchor" href="#优点" aria-label="Permalink to &quot;优点&quot;">​</a></h2><ul><li>实现任意粒度的模块共享，可以引入远程组件、函数、甚至应用</li><li>优化构建产物体积，从远程拉取而不参与本地项目打包构建</li><li>运行时按需加载</li><li>第三方依赖共享，设置 <code>shared</code> 让远程组件优先使用本地依赖</li></ul><h2 id="新建项目" tabindex="-1">新建项目 <a class="header-anchor" href="#新建项目" aria-label="Permalink to &quot;新建项目&quot;">​</a></h2><p>使用 <a href="https://cli.vuejs.org/zh/guide/creating-a-project.html#vue-create" target="_blank" rel="noreferrer">vue-cli</a> 新建一个 <code>app-expose</code> 项目，作为 导出组件 的 <strong>容器</strong></p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">vue</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">create</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">app-expose</span></span>
<span class="line"><span style="color:#79B8FF;">cd</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">app-expose</span></span>
<span class="line"><span style="color:#B392F0;">npm</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">i</span></span>
<span class="line"><span style="color:#B392F0;">npm</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">run</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">serve</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">vue</span><span style="color:#24292E;"> </span><span style="color:#032F62;">create</span><span style="color:#24292E;"> </span><span style="color:#032F62;">app-expose</span></span>
<span class="line"><span style="color:#005CC5;">cd</span><span style="color:#24292E;"> </span><span style="color:#032F62;">app-expose</span></span>
<span class="line"><span style="color:#6F42C1;">npm</span><span style="color:#24292E;"> </span><span style="color:#032F62;">i</span></span>
<span class="line"><span style="color:#6F42C1;">npm</span><span style="color:#24292E;"> </span><span style="color:#032F62;">run</span><span style="color:#24292E;"> </span><span style="color:#032F62;">serve</span></span></code></pre></div><p>同样新建一个 <code>app-local</code> 项目，引用远程组件</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">vue</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">create</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">app-local</span></span>
<span class="line"><span style="color:#79B8FF;">cd</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">app-local</span></span>
<span class="line"><span style="color:#B392F0;">npm</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">i</span></span>
<span class="line"><span style="color:#B392F0;">npm</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">run</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">serve</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">vue</span><span style="color:#24292E;"> </span><span style="color:#032F62;">create</span><span style="color:#24292E;"> </span><span style="color:#032F62;">app-local</span></span>
<span class="line"><span style="color:#005CC5;">cd</span><span style="color:#24292E;"> </span><span style="color:#032F62;">app-local</span></span>
<span class="line"><span style="color:#6F42C1;">npm</span><span style="color:#24292E;"> </span><span style="color:#032F62;">i</span></span>
<span class="line"><span style="color:#6F42C1;">npm</span><span style="color:#24292E;"> </span><span style="color:#032F62;">run</span><span style="color:#24292E;"> </span><span style="color:#032F62;">serve</span></span></code></pre></div><h2 id="容器项目" tabindex="-1">容器项目 <a class="header-anchor" href="#容器项目" aria-label="Permalink to &quot;容器项目&quot;">​</a></h2><p><code>app-expose</code> 作为容器项目，对外提供组件，需要做些改造。</p><p>修改 入口文件 与 配置</p><ul><li>根目录新建 <code>index.js</code>，引入 <code>main.js</code><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;./main&#39;</span><span style="color:#E1E4E8;">)</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;./main&#39;</span><span style="color:#24292E;">)</span></span></code></pre></div></li><li>修改 vue.config.js<div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> { </span><span style="color:#79B8FF;">defineConfig</span><span style="color:#E1E4E8;"> } </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">require</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;@vue/cli-service&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">webpack</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">require</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;webpack&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;">module</span><span style="color:#E1E4E8;">.</span><span style="color:#79B8FF;">exports</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">defineConfig</span><span style="color:#E1E4E8;">({</span></span>
<span class="line"><span style="color:#E1E4E8;">  publicPath: </span><span style="color:#9ECBFF;">&#39;auto&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  transpileDependencies: </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 模块联邦入口</span></span>
<span class="line"><span style="color:#E1E4E8;">  pages: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    index: {</span></span>
<span class="line"><span style="color:#E1E4E8;">      entry: </span><span style="color:#9ECBFF;">&#39;./src/index.ts&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">  devServer: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    port: </span><span style="color:#79B8FF;">8081</span><span style="color:#E1E4E8;">, </span><span style="color:#6A737D;">// 设置端口号 8081</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">  configureWebpack: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    optimization: {</span></span>
<span class="line"><span style="color:#E1E4E8;">      splitChunks: </span><span style="color:#79B8FF;">false</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"><span style="color:#E1E4E8;">    plugins: [</span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> webpack.container.</span><span style="color:#B392F0;">ModuleFederationPlugin</span><span style="color:#E1E4E8;">({</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// 指定输出容器名</span></span>
<span class="line"><span style="color:#E1E4E8;">      name: </span><span style="color:#9ECBFF;">&#39;app_exposes&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// 指定打包后输出的文件名，位于根目录</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// 即其他应用访问公共组件的入口文件</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// 入口文件保存各公共组件的请求地址</span></span>
<span class="line"><span style="color:#E1E4E8;">      filename: </span><span style="color:#9ECBFF;">&#39;remote-entry.js&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// 导出 给其他应用获取的组件或页面文件</span></span>
<span class="line"><span style="color:#E1E4E8;">      exposes: {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// key: 该文件相对于 上面 remote-entry.js 的相对路径</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// value： 从 vue.config.js 访问组件的路径</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#9ECBFF;">&#39;./CommonComponent.vue&#39;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;./src/components/CommonComponent.vue&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#9ECBFF;">&#39;./AboutView.vue&#39;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;./src/views/AboutView.vue&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      },</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// 用于避免项目出现多个公共依赖，设置这个属性后，webpack在加载时会先判断本地是否存在该依赖包，没有的话则加载远程应用的依赖包</span></span>
<span class="line"><span style="color:#E1E4E8;">      shared: {</span></span>
<span class="line"><span style="color:#E1E4E8;">        vue: {</span></span>
<span class="line"><span style="color:#E1E4E8;">          singleton: </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">        },</span></span>
<span class="line"><span style="color:#E1E4E8;">      },</span></span>
<span class="line"><span style="color:#E1E4E8;">    })],</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> { </span><span style="color:#005CC5;">defineConfig</span><span style="color:#24292E;"> } </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">require</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;@vue/cli-service&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">webpack</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">require</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;webpack&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;">module</span><span style="color:#24292E;">.</span><span style="color:#005CC5;">exports</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">defineConfig</span><span style="color:#24292E;">({</span></span>
<span class="line"><span style="color:#24292E;">  publicPath: </span><span style="color:#032F62;">&#39;auto&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  transpileDependencies: </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 模块联邦入口</span></span>
<span class="line"><span style="color:#24292E;">  pages: {</span></span>
<span class="line"><span style="color:#24292E;">    index: {</span></span>
<span class="line"><span style="color:#24292E;">      entry: </span><span style="color:#032F62;">&#39;./src/index.ts&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">  },</span></span>
<span class="line"><span style="color:#24292E;">  devServer: {</span></span>
<span class="line"><span style="color:#24292E;">    port: </span><span style="color:#005CC5;">8081</span><span style="color:#24292E;">, </span><span style="color:#6A737D;">// 设置端口号 8081</span></span>
<span class="line"><span style="color:#24292E;">  },</span></span>
<span class="line"><span style="color:#24292E;">  configureWebpack: {</span></span>
<span class="line"><span style="color:#24292E;">    optimization: {</span></span>
<span class="line"><span style="color:#24292E;">      splitChunks: </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">    plugins: [</span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> webpack.container.</span><span style="color:#6F42C1;">ModuleFederationPlugin</span><span style="color:#24292E;">({</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 指定输出容器名</span></span>
<span class="line"><span style="color:#24292E;">      name: </span><span style="color:#032F62;">&#39;app_exposes&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 指定打包后输出的文件名，位于根目录</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 即其他应用访问公共组件的入口文件</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 入口文件保存各公共组件的请求地址</span></span>
<span class="line"><span style="color:#24292E;">      filename: </span><span style="color:#032F62;">&#39;remote-entry.js&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 导出 给其他应用获取的组件或页面文件</span></span>
<span class="line"><span style="color:#24292E;">      exposes: {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// key: 该文件相对于 上面 remote-entry.js 的相对路径</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// value： 从 vue.config.js 访问组件的路径</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#032F62;">&#39;./CommonComponent.vue&#39;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;./src/components/CommonComponent.vue&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#032F62;">&#39;./AboutView.vue&#39;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;./src/views/AboutView.vue&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      },</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 用于避免项目出现多个公共依赖，设置这个属性后，webpack在加载时会先判断本地是否存在该依赖包，没有的话则加载远程应用的依赖包</span></span>
<span class="line"><span style="color:#24292E;">      shared: {</span></span>
<span class="line"><span style="color:#24292E;">        vue: {</span></span>
<span class="line"><span style="color:#24292E;">          singleton: </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">        },</span></span>
<span class="line"><span style="color:#24292E;">      },</span></span>
<span class="line"><span style="color:#24292E;">    })],</span></span>
<span class="line"><span style="color:#24292E;">  },</span></span>
<span class="line"><span style="color:#24292E;">})</span></span></code></pre></div></li></ul><p>如上面配置，通过插件 <code>webpack.container.ModuleFederationPlugin</code> 进行配置导出内容，其中 <code>expose</code> 中导出了一个 <code>CommonComponent</code> 组件，一个 <code>AboutView</code> 页面组件。</p><p>最后打包完成，会在根目录存在一个名为 <code>remote-entry.js</code> 的文件，里面保存了导出 组件名 以及 对应的组件路径，以供其他项目访问导出的组件。</p><h2 id="引用远程组件的项目" tabindex="-1">引用远程组件的项目 <a class="header-anchor" href="#引用远程组件的项目" aria-label="Permalink to &quot;引用远程组件的项目&quot;">​</a></h2><p><code>app-local</code> 需要引用 <code>app-expose</code> 项目暴露的组件，同样也需要修改入口和配置文件</p><ul><li>根目录新建 <code>index.js</code>，引入 <code>main.js</code><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;./main&#39;</span><span style="color:#E1E4E8;">)</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;./main&#39;</span><span style="color:#24292E;">)</span></span></code></pre></div></li><li>修改 vue.config.js<div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> { </span><span style="color:#79B8FF;">defineConfig</span><span style="color:#E1E4E8;"> } </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">require</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;@vue/cli-service&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">webpack</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">require</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;webpack&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;">module</span><span style="color:#E1E4E8;">.</span><span style="color:#79B8FF;">exports</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">defineConfig</span><span style="color:#E1E4E8;">({</span></span>
<span class="line"><span style="color:#E1E4E8;">  transpileDependencies: </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 模块联邦的入口</span></span>
<span class="line"><span style="color:#E1E4E8;">  pages: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    index: {</span></span>
<span class="line"><span style="color:#E1E4E8;">      entry: </span><span style="color:#9ECBFF;">&#39;./src/index.ts&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">  devServer: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    port: </span><span style="color:#79B8FF;">8082</span><span style="color:#E1E4E8;">, </span><span style="color:#6A737D;">// 设置端口号 8082</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">  configureWebpack: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    plugins: [</span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> webpack.container.</span><span style="color:#B392F0;">ModuleFederationPlugin</span><span style="color:#E1E4E8;">({</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// 输出模块容器名称</span></span>
<span class="line"><span style="color:#E1E4E8;">      name: </span><span style="color:#9ECBFF;">&#39;app_local&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// 指定打包的文件名</span></span>
<span class="line"><span style="color:#E1E4E8;">      filename: </span><span style="color:#9ECBFF;">&#39;remote-entry.js&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// 引入 的远程模块</span></span>
<span class="line"><span style="color:#E1E4E8;">      remotes: {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// key: 远程应用导出的容器名称</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// value: 映射地址，指定端口号，访问公共组件入口，该入口提供了暴露的所有公共组件资源</span></span>
<span class="line"><span style="color:#E1E4E8;">        app_exposes: </span><span style="color:#9ECBFF;">&#39;app_exposes@http://localhost:8081/remote-entry.js&#39;</span></span>
<span class="line"><span style="color:#E1E4E8;">      },</span></span>
<span class="line"><span style="color:#E1E4E8;">      shared: {</span></span>
<span class="line"><span style="color:#E1E4E8;">        vue: {</span></span>
<span class="line"><span style="color:#E1E4E8;">          singleton: </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">        },</span></span>
<span class="line"><span style="color:#E1E4E8;">      },</span></span>
<span class="line"><span style="color:#E1E4E8;">    })],</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> { </span><span style="color:#005CC5;">defineConfig</span><span style="color:#24292E;"> } </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">require</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;@vue/cli-service&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">webpack</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">require</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;webpack&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;">module</span><span style="color:#24292E;">.</span><span style="color:#005CC5;">exports</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">defineConfig</span><span style="color:#24292E;">({</span></span>
<span class="line"><span style="color:#24292E;">  transpileDependencies: </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 模块联邦的入口</span></span>
<span class="line"><span style="color:#24292E;">  pages: {</span></span>
<span class="line"><span style="color:#24292E;">    index: {</span></span>
<span class="line"><span style="color:#24292E;">      entry: </span><span style="color:#032F62;">&#39;./src/index.ts&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">  },</span></span>
<span class="line"><span style="color:#24292E;">  devServer: {</span></span>
<span class="line"><span style="color:#24292E;">    port: </span><span style="color:#005CC5;">8082</span><span style="color:#24292E;">, </span><span style="color:#6A737D;">// 设置端口号 8082</span></span>
<span class="line"><span style="color:#24292E;">  },</span></span>
<span class="line"><span style="color:#24292E;">  configureWebpack: {</span></span>
<span class="line"><span style="color:#24292E;">    plugins: [</span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> webpack.container.</span><span style="color:#6F42C1;">ModuleFederationPlugin</span><span style="color:#24292E;">({</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 输出模块容器名称</span></span>
<span class="line"><span style="color:#24292E;">      name: </span><span style="color:#032F62;">&#39;app_local&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 指定打包的文件名</span></span>
<span class="line"><span style="color:#24292E;">      filename: </span><span style="color:#032F62;">&#39;remote-entry.js&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 引入 的远程模块</span></span>
<span class="line"><span style="color:#24292E;">      remotes: {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// key: 远程应用导出的容器名称</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// value: 映射地址，指定端口号，访问公共组件入口，该入口提供了暴露的所有公共组件资源</span></span>
<span class="line"><span style="color:#24292E;">        app_exposes: </span><span style="color:#032F62;">&#39;app_exposes@http://localhost:8081/remote-entry.js&#39;</span></span>
<span class="line"><span style="color:#24292E;">      },</span></span>
<span class="line"><span style="color:#24292E;">      shared: {</span></span>
<span class="line"><span style="color:#24292E;">        vue: {</span></span>
<span class="line"><span style="color:#24292E;">          singleton: </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">        },</span></span>
<span class="line"><span style="color:#24292E;">      },</span></span>
<span class="line"><span style="color:#24292E;">    })],</span></span>
<span class="line"><span style="color:#24292E;">  },</span></span>
<span class="line"><span style="color:#24292E;">})</span></span></code></pre></div></li></ul><p>重新运行项目后打开页面，查看网络控制台，会发出一个请求</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">http://localhost:8081/remote-entry.js</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">http://localhost:8081/remote-entry.js</span></span></code></pre></div><p>该请求会拿到 容器 导出的 远程组件名 和 组件地址 ，在页面上使用到 远程组件 的时候，会根据 组件地址 发起请求，例如</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">http://localhost:8081/js/src_components_CommonComponent_vue.js</span></span>
<span class="line"><span style="color:#e1e4e8;">http://localhost:8081/js/src_views_AboutView_vue.js</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">http://localhost:8081/js/src_components_CommonComponent_vue.js</span></span>
<span class="line"><span style="color:#24292e;">http://localhost:8081/js/src_views_AboutView_vue.js</span></span></code></pre></div><p><code>CommonComponent.vue</code> 和 <code>AbountView.vue</code> 最后都打包到了 <code>http://localhost:8081</code> 下的 <code>js</code> 文件夹下。</p><h2 id="finally" tabindex="-1">Finally <a class="header-anchor" href="#finally" aria-label="Permalink to &quot;Finally&quot;">​</a></h2><p>社区中已经提供了一个比较成熟的 <code>Vite</code> 模块联邦方案: <code>vite-plugin-federation</code>，这个方案基于 <code>Vite</code>(或者 <code>Rollup</code>) 实现了完整的模块联邦能力，使用配置基本与 <code>webpack5</code> 一致。</p><h2 id="sources" tabindex="-1">Sources <a class="header-anchor" href="#sources" aria-label="Permalink to &quot;Sources&quot;">​</a></h2><p><a href="https://webpack.docschina.org/concepts/module-federation/" target="_blank" rel="noreferrer">Module Federation</a></p><p><a href="https://gitee.com/lafen/module-federation-demo" target="_blank" rel="noreferrer">Gitee Demo</a></p><p><a href="https://github.com/AshesOfHistory/vue3-cli-module-federation-demo" target="_blank" rel="noreferrer">Demo</a></p>`,33),o=[e];function c(t,r,E,i,y,d){return n(),a("div",null,o)}const h=s(l,[["render",c]]);export{F as __pageData,h as default};
