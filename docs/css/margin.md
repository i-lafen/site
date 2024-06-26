# Margin 重叠问题

## 概念

**外边距合并** ，普通文档流种两个外边距相遇时，将合并为外边距 **较大者**（发生在兄弟、父子元素之间），但 左右外边距 不会合并。

## 合并规则

- 两外边距都为正数，合并为较大者
- 两负数，合并为绝对值较大者
- 一正一负，合并为两者相加

## 触发条件

- 普通文档流中
- 相邻 或 父子 元素
- 块级元素

## 清除 margin 重叠

- 使用 `padding` 替代 `margin`
- 内层元素使用 **透明边框**
- 内层元素使用 **绝对定位**
- 外层元素 `overflow: hidden`
- 内层元素 `float` 或 `inline-block`
