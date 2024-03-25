import{_ as t,o as d,c as e,Q as l}from"./chunks/framework.281e52d7.js";const p=JSON.parse('{"title":"Flex","description":"","frontmatter":{},"headers":[],"relativePath":"css/flex.md","filePath":"css/flex.md"}'),a={name:"css/flex.md"},r=l('<h1 id="flex" tabindex="-1">Flex <a class="header-anchor" href="#flex" aria-label="Permalink to &quot;Flex&quot;">​</a></h1><h2 id="概念" tabindex="-1">概念 <a class="header-anchor" href="#概念" aria-label="Permalink to &quot;概念&quot;">​</a></h2><blockquote><p>弹性盒子、弹性布局</p></blockquote><h2 id="优劣势" tabindex="-1">优劣势 <a class="header-anchor" href="#优劣势" aria-label="Permalink to &quot;优劣势&quot;">​</a></h2><h3 id="float、position" tabindex="-1">float、position <a class="header-anchor" href="#float、position" aria-label="Permalink to &quot;float、position&quot;">​</a></h3><ul><li>兼容性好但使用繁琐</li></ul><h3 id="flex-1" tabindex="-1">flex <a class="header-anchor" href="#flex-1" aria-label="Permalink to &quot;flex&quot;">​</a></h3><ul><li>使用方便但兼容性较差，移动端使用多</li></ul><h2 id="flex重要概念" tabindex="-1">flex重要概念 <a class="header-anchor" href="#flex重要概念" aria-label="Permalink to &quot;flex重要概念&quot;">​</a></h2><ul><li>父项：父级元素</li><li>子项：直接子元素</li><li>主轴：默认 <code>x</code> 轴</li><li>侧轴：默认 <code>y</code> 轴</li><li>父项属性：作用在父级元素的属性</li><li>子项属性：作用在直接子元素的属性</li></ul><h3 id="父项属性" tabindex="-1">父项属性 <a class="header-anchor" href="#父项属性" aria-label="Permalink to &quot;父项属性&quot;">​</a></h3><p>父项属性主要有 <code>6</code> 个</p><table><thead><tr><th>属性</th><th>含义</th></tr></thead><tbody><tr><td>display</td><td>开启 <code>flex</code> 布局</td></tr><tr><td>flex-direction</td><td>设置主轴方向，默认为<code>x</code>轴方向</td></tr><tr><td>justify-content</td><td>置主轴子项的对齐方式</td></tr><tr><td>align-items</td><td>设置侧轴子项的对齐方式（<strong>单行</strong>）</td></tr><tr><td>align-content</td><td>设置侧轴子项的对齐方式（<strong>多行</strong>）</td></tr><tr><td>flex-wrap</td><td>子元素是否换行</td></tr></tbody></table><ul><li><p>display</p><table><thead><tr><th>属性值</th><th>含义</th></tr></thead><tbody><tr><td>flex</td><td>开启 <code>flex</code> 布局</td></tr></tbody></table></li><li><p>flex-direction</p><table><thead><tr><th>属性值</th><th>含义</th></tr></thead><tbody><tr><td>row</td><td>从左到右（默认）</td></tr><tr><td>row-reverse</td><td>从右到左</td></tr><tr><td>column</td><td>从上到下</td></tr><tr><td>column-reverse</td><td>从下到上</td></tr></tbody></table></li><li><p>justify-content</p><table><thead><tr><th>属性值</th><th>含义</th></tr></thead><tbody><tr><td>flex-start</td><td>左对齐（默认）</td></tr><tr><td>flex-end</td><td>右对齐</td></tr><tr><td>center</td><td>水平居中</td></tr><tr><td>space-between</td><td>先左右对齐，剩下的子项再平分剩余空间</td></tr><tr><td>space-around</td><td>子项平分空间</td></tr></tbody></table></li><li><p>align-item</p><table><thead><tr><th>属性值</th><th>含义</th></tr></thead><tbody><tr><td>flex-start</td><td>上对齐</td></tr><tr><td>flex-end</td><td>下对齐</td></tr><tr><td>center</td><td>垂直居中对齐</td></tr></tbody></table></li><li><p>align-content</p><table><thead><tr><th>属性值</th><th>含义</th></tr></thead><tbody><tr><td>flex-start</td><td>上对齐</td></tr><tr><td>flex-end</td><td>下对齐</td></tr><tr><td>center</td><td>垂直居中对齐</td></tr><tr><td>space-between</td><td>先上下对齐，剩余的子项平分剩余空间</td></tr><tr><td>space-around</td><td>子项平分空间</td></tr></tbody></table></li><li><p>flex-wrap</p><table><thead><tr><th>属性值</th><th>含义</th></tr></thead><tbody><tr><td>nowrap</td><td>不换行（默认），子项超过父项宽度会互相挤压</td></tr><tr><td>wrap</td><td>换行</td></tr></tbody></table></li></ul><h3 id="子项属性" tabindex="-1">子项属性 <a class="header-anchor" href="#子项属性" aria-label="Permalink to &quot;子项属性&quot;">​</a></h3><p>子项属性主要包含以下 3 个</p><table><thead><tr><th>子项属性</th><th>含义</th></tr></thead><tbody><tr><td>align-self</td><td>子项自己在侧轴上的对齐方式</td></tr><tr><td>order</td><td>子项自己在主轴上的排列顺序</td></tr><tr><td>flex</td><td>子项占用父项的比例</td></tr></tbody></table><ul><li><p>align-self</p><table><thead><tr><th>属性值</th><th>含义</th></tr></thead><tbody><tr><td>flex-start</td><td>上对齐</td></tr><tr><td>flex-end</td><td>下对齐</td></tr><tr><td>center</td><td>垂直居中</td></tr></tbody></table></li><li><p>order</p><table><thead><tr><th>属性值</th><th>含义</th></tr></thead><tbody><tr><td>0</td><td>子项自己在主轴上的排列顺序，默认 <code>0</code> ，值越小，子项越靠前</td></tr></tbody></table></li><li><p>flex</p><table><thead><tr><th>属性值</th><th>含义</th></tr></thead><tbody><tr><td>1</td><td>子项自己占用父项的比例</td></tr></tbody></table><p>flex: 1 是 flex-grow、flex-shrink、flex-basis 的缩写，默认值是 0 1 auto。</p><ul><li>flex-grow：放大比例，0 即不放大</li><li>flex-shrink：缩小比例，1 即空间不足时缩小</li><li>flex-basis：指定了 flex 元素在株主轴方向上的初始大小，auto 表示参照元素的 width 和 hight</li></ul></li></ul><h2 id="注意项" tabindex="-1">注意项 <a class="header-anchor" href="#注意项" aria-label="Permalink to &quot;注意项&quot;">​</a></h2><ul><li><code>flex</code> 布局中没有 行内、行内块、块元素的概念，可以直接设置宽高</li><li>子项宽度默认由内容撑开，高度与父项高度一致</li><li>子项添加 <code>float</code> 无效， <code>position</code> 有效（一般情况下不适合混用）</li><li><code>flex</code> 可以继续嵌套 <code>flex</code></li><li>父项中的 <code>flex-wrap: wrap</code> 会与子项的 <code>flex: 1</code> 冲突，导致换行无效，只能通过给子项添加宽度来保证换行</li></ul>',20),o=[r];function i(h,n,c,s,f,b){return d(),e("div",null,o)}const u=t(a,[["render",i]]);export{p as __pageData,u as default};
