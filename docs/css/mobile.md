# 移动端适配方案


- `media query` 媒体查询
- `flex` 布局
- `rem` 根字体大小
- `vh`、`vw`
- 百分比 `%`
- `rem` + `flex` + `vw/vh`
- `px` + `px2rem` 插件 + `flex`


实际开发中并不直接使用其中某一种方案，而是多种方式组合，例如移动端 h5 中，经常采用的方式也是多种的

- `flex` + `rem` + `vw/vh`
- `flex` + `px` + `px2rem` 插件


## Media 媒体查询

不同的屏幕宽度加载不同的 `css` 代码，核心语法

```css
@media only screen and (max-width: 374px) {
  /* iphone5 或者更小的尺寸，以 iphone5 的宽度（320px）比例设置样式*/
}
@media only screen and (min-width: 375px) and (max-width: 413px) {
  /* iphone6/7/8 和 iphone x */
}
@media only screen and (min-width: 414px) {
  /* iphone6p 或者更大的尺寸，以 iphone6p 的宽度（414px）比例设置样式 */
}
```


### Media 优点

- 方法简单，目前 `bootstrap` 等框架使用这种方式布局
- 调整屏幕宽度的时候不用刷新页面即可响应式展示


### Media 缺点

- 代码量大，维护不便


## Flex 弹性布局

基本不用做过多的配置，即可实现响应式，能满足大多数页面的合理展示，但对复杂布局较难实现。


## rem

相对单位，相对于 `html` 的 `font-size` 大小，对于需要适配屏幕等比缩放的元素使用 `rem`，通过 调整 `html` 的 `font-size` 大小即可控制页面布局大小。可在 `window.onresize` 中改变 根元素字体大小。


## vw 适配方案

`vw` 也是相对单位，即相对屏幕宽度的百分比。不用 `js` 即可适配，但换算复杂。


## 百分比

百分比计算，不友好，百分比计算参考对象是父元素，元素嵌套深难以计算。
