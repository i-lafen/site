import{_ as o,o as t,c as r,Q as n}from"./chunks/framework.d544cf0e.js";const _=JSON.parse('{"title":"V8 垃圾回收机制","description":"","frontmatter":{},"headers":[],"relativePath":"browser/v8-gc.md","filePath":"browser/v8-gc.md","lastUpdated":1692961506000}'),s={name:"browser/v8-gc.md"},a=n('<h1 id="v8-垃圾回收机制" tabindex="-1">V8 垃圾回收机制 <a class="header-anchor" href="#v8-垃圾回收机制" aria-label="Permalink to &quot;V8 垃圾回收机制&quot;">​</a></h1><p><code>V8</code> 中会把堆分为 <strong>新生代</strong> 和 <strong>老生代</strong> 两个区域</p><ul><li><strong>新生代</strong> 中存放的是生存 时间短 的对象</li><li><strong>老生代</strong> 中存放的是生存 时间久 的对象</li></ul><p>新生区通常只支持 <code>1~8M</code> 的容量，而老生区支持的容量就大很多。对于这两块区域，<code>V8</code> 分别使用两个不同的垃圾回收器，以便更高效地实施垃圾回收。</p><ul><li><strong>副垃圾回收器</strong>，主要负责 <strong>新生代</strong> 的垃圾回收</li><li><strong>主垃圾回收器</strong>，主要负责 <strong>老生代</strong> 的垃圾回收</li></ul><h2 id="垃圾回收器工作流程" tabindex="-1">垃圾回收器工作流程 <a class="header-anchor" href="#垃圾回收器工作流程" aria-label="Permalink to &quot;垃圾回收器工作流程&quot;">​</a></h2><ul><li>第一步 标记 空间中 <strong>活动对象</strong> 和 <strong>非活动对象</strong></li><li>第二步 回收 <strong>非活动对象</strong> 所占据的内存</li><li>第三步 内存整理，回收对象后，内存中会存在大量不连续空间，即 内存碎片，此时如果需要分配较大的连续内存时，就有可能出现内存不足的情况。但有的垃圾回收器不会产生内存碎片，比如 副垃圾回收器。</li></ul><h2 id="副垃圾回收器" tabindex="-1">副垃圾回收器 <a class="header-anchor" href="#副垃圾回收器" aria-label="Permalink to &quot;副垃圾回收器&quot;">​</a></h2><p>大部分小的对象都会被分配到 新生区，所以这个区域虽然容量不大，但是 垃圾回收 还是比较 频繁。</p><p>新生代中用 <strong>Scavenge 算法</strong> 来处理，即新生代空间对半划分为两个区域，，一半是 <strong>对象区域</strong> ，一半是 <strong>空闲区域</strong> 。</p><ul><li>新加入的对象都会存放到 <strong>对象区域</strong> ，当对象区域快被写满时，就需要执行一次垃圾清理操作；</li><li>在垃圾回收过程中，首先对 对象区域 中的垃圾做 <strong>标记</strong> ；</li><li>标记完成，进入垃圾清理阶段，<strong>副垃圾回收器</strong> 会把这些 <strong>存活的对象</strong> 复制到 <strong>空闲区域</strong>，同时还会把这些对象 <strong>有序排列</strong> 起来，这个复制过程就相当于完成了 <strong>内存整理</strong> 操作，复制后的 <strong>空闲区域</strong> 就没有内存碎片了；</li><li>复制完成后，对象区域 与 空闲区域 进行 角色反转，也就是 原来的 对象区域 变成 空闲区域，原来的空闲区域 变成了 对象区域。这样就完成了垃圾对象的回收操作。</li></ul><p><strong>Scavenge 算法</strong> 每次执行清理操作都需要将存活对象从 对象区域 复制到 空闲区域，所以为了执行效率，一般新生区的空间会被设置得比较小。</p><h2 id="主垃圾回收器" tabindex="-1">主垃圾回收器 <a class="header-anchor" href="#主垃圾回收器" aria-label="Permalink to &quot;主垃圾回收器&quot;">​</a></h2><p>主垃圾回收器主要负责老生区中的垃圾回收。除了新生区中晋升的对象，一些大的对象会直接被分配到老生区。老生区中的对象有两个特点：</p><ul><li>对象 占用空间大</li><li>对象 存活时间长</li></ul><p>主垃圾回收器采用 <strong>标记 - 清除（Mark-Sweep）的算法</strong> 进行垃圾回收：</p><ul><li>首先是 <strong>标记</strong> 过程阶段。标记阶段 就是从一组根元素开始，递归遍历这组根元素，在这个遍历过程中，能到达的元素称为 活动对象 ，没有到达的元素就可以判断为 垃圾数据，将会被 标记 为 需要回收的数据。</li><li>接下来就是垃圾的 <strong>清除</strong> 过程。它和 副垃圾回收器 的垃圾清除过程完全不同，即将 标记为垃圾回收的数据就行清理。</li></ul><p><strong>标记 - 清除</strong> 算法 同样会产生 内存碎片，于是又产生了另一种算法 ： <strong>标记 - 整理（Mark-Compact）</strong>，这个标记过程仍然与 <strong>标记 - 清除</strong> 算法 一样，但后续步骤是 将所有 <strong>存活的对象</strong> 都向一端 <strong>移动</strong>，然后直接 清理掉端边界以外的内存。</p><h2 id="全停顿" tabindex="-1">全停顿 <a class="header-anchor" href="#全停顿" aria-label="Permalink to &quot;全停顿&quot;">​</a></h2><p>由于 <code>JavaScript</code> 是运行在主线程之上，一旦执行垃圾回收算法，都需要将正在执行的 <code>JavaScript</code> 脚本暂停下来，待垃圾回收完成后再恢复脚本执行，我们把这种行为叫做 <strong>全停顿（Stop-The-World）</strong>。</p><p>新生代的垃圾回收中，因其空间较小，存活对象较少，所以全停顿影响不大，但是 <strong>老生代</strong> 就不一样了，<strong>占用主线程时间太长的话容易造成页面的卡顿</strong>。</p><p>为了降低老生代的垃圾回收而造成的卡顿， <code>V8</code> 将 <strong>标记过程</strong> 分为一个个的 <strong>子标记过程</strong> ，同时让 垃圾回收标记 和 <code>JavaScript</code> 应用逻辑交替进行，直到 标记 阶段完成，我们把这个算法称为 <strong>增量标记（Incremental Marking）算法</strong>。</p><p>使用 <strong>增量标记算法</strong>，可以把一个完整的垃圾回收任务拆分为很多 小的任务，这些 小的任务 执行时间较短，可以穿插在其他 <code>JavaScript</code> 任务中间执行，这样就不会造成页面卡顿了。</p>',23),e=[a];function g(l,i,c,d,p,h){return t(),r("div",null,e)}const m=o(s,[["render",g]]);export{_ as __pageData,m as default};
