# 居中布局

## 水平居中

- 行内元素：父元素 `text-align: center`
- 块级元素：子元素 `margin: 0 auto`
- `absolute` + `transform`
- `flex` + `jusitify-content: center`

## 垂直居中

- `line-height: height` （并非真的居中，除非 `font-size: 0`）
- `absolute` + `transform`
- `flex` + `align-items: center`

## 水平垂直居中

- `absolute` + `transform`
- `flex` + `jusitify-content` + `align-items`
