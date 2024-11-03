# BFC

## 定义

**块级格式上下文** ，是一个**独立渲染的区域**，处于 `BFC` 内部的元素与外部元素 相互隔离，使内外元素的定位不会相互影响。 `IE` 下可通过 `zoom: 1` 触发。


## 触发条件

- `position`: `absolute/fixed`
- `display`: `inline-block/table`、`flex`、`flow-root`（影响较小）
- `float`: `left/right`
- `overflow` 不为 `visible`


## 排列规则

- `BFC` 中相邻元素垂直排列
- `BFC` 中的上下元素 `margin` 会重叠
- `BFC` 区域不会和 `float` 元素区域重叠
- 计算 `BFC` 区域高度， `float` 的子元素也参与计算


## 应用

- 清除内部浮动
