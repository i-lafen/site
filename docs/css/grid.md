# Grid


`flex` 布局可看作是一维布局， `grid` 布局则可以看作是二维布局，它将容器划分成 **行** 和 **列**，产生单元格并能单独设置。也称为**网格布局**。

`grid` 布局比 `flex` 布局更加强大，但同样也更加复杂。


## 基本概念

- 容器 （ `container` ）， 采用网格布局的区域
- 项目 （ `item` ） ， 容器内部采用网格定位的直接子元素
- 行 （ `row` ） ， 默认水平区域
- 列 （ `column` ） ， 默认垂直区域
- 单元格 （ `cell` ） ，行列交叉区域即单元格
- 网格线 （ `grid line` ） ， 划分网格的线


## 属性

定义在容器上的属性为 **容器属性**，定义在项目上的为 **项目属性**


### 容器属性

- `display`
  - `grid` ，开启网格布局，容器元素为**块级元素**，容器占满宽度
  - `inline-grid` ，开启网格布局，容器元素为**行内元素**

> 注意，设为网格布局以后，容器子元素（项目）的 float、display: inline-block、display: table-cell、vertical-align和column-* 等设置都将失效。


- `grid-template-columns` 定义列宽
- `grid-template-rows` 定义行高
  - `repeat(num, ...args)` 可以重复设置 `args` 值 `num` 次，例如 `grid-template-columns: repeat(12, 1fr)`
  - `auto-fill` 表示自动填充，在单元格大小固定，但容器大小不确定时希望行列容纳尽可能多的的单元格可以使用，例如 `grid-template-columns: repeat(auto-fill, 100px)`
  - `fr` 即片段 `fraction` ， 表示比例关系
  - `minmax(min, max)` 产生一个长度范围，表示长度在这最大最小值之间
  - `auto` 浏览器自己决定长度
  - 网格线名称， 可以使用 **方括号** ，指定每一根网格线的名字，方便以后引用，也支持多个名称，列如 `grid-template-columns: [c1 col-other] 100px [c2] 100px [c3] auto [c4]`


- `row-gap` 行间距
- `column-gap` 列间距
- `gap` 行间距和列间距的简写


- `grid-template-areas` 定义区域，例如
  ```css
  grid-template-areas: 'a b c'
                       'd e f'
                       'g h i';
  ```
  其中相同区域可同名，不需要命名区域可使用 `.` 表示

> 注意，区域的命名会影响到网格线。每个区域的起始网格线，会自动命名为 区域名-start ，终止网格线自动命名为 区域名-end 。
> 比如，区域名为 header ，则起始位置的水平网格线和垂直网格线叫做 header-start ，终止位置的水平网格线和垂直网格线叫做 header-end 。


- `grid-auto-flow` 设置网格布局放置顺序
  - `row` 先行后列
  - `column` 先列后行
  - `row dense` 先行后列，并且在某些项目指定位置后，剩下的项目怎么自动放置
  - `column dense` 先列后行，并且在某些项目指定位置后，剩下的项目怎么自动放置


- `justify-items` ， 设置单元格内容的水平位置
- `align-items` ， 垂直位置， 值同上
- `place-items` ， `justify-items` 和 `place-items` 简写

> 可选值 start | end | center | stretch


- `justify-content` ，设置整个内容区域在容器里的水平位置
- `align-content` ， 垂直位置
- `place-content` ， 简写

> 可选值 start | end | center | stretch | space-around | space-between | space-evenly


- `grid-auto-columns` 设置浏览器自动创建的多余的网格的列宽
- `grid-auto-rows` 设置浏览器自动创建的多余的网格的行高


- `grid-template` ， 为 `grid-template-columns`、`grid-template-rows`和`grid-template-areas` 这三个属性的合并简写形式
- `grid` ， 为 `grid-template-rows`、`grid-template-columns`、`grid-template-areas`、 `grid-auto-rows`、`grid-auto-columns`、`grid-auto-flow` 这六个属性的合并简写形式



### 项目属性

- `grid-column-start` 指定项目左边框所在的网格线
- `grid-column-end` 指定项目右边框所在的网格线
- `grid-row-start` 指定项目上边框所在的网格线
- `grid-row-end` 指定项目下边框所在的网格线
  - `span` 可以表示跨域多条网格线

- `grid-column` ， `grid-column-start` 和 `grid-column-end` 的合并简写形式
- `grid-row` ， `grid-row-start` 属性和 `grid-row-end` 的合并简写形式


- `grid-area` 指定项目放在哪一个区域， `grid-are`a 属性还可用作`grid-row-start`、`grid-column-start`、`grid-row-end`、`grid-column-end` 的合并简写形式，直接指定项目的位置


- `justify-self` 设置单元格内容水平位置
- `align-self` 设置单元格内容垂直位置
- `place-self` 简写

> 可选值 start | end | center | stretch
