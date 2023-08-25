# Css module 和 Scoped

两者都是实现 `css` 作用域的，`css module` 通过 `className + hash` 来实现作用域， `scoped` 则是 `className + [data-v-attrName]` 来实现作用域。


## css module

- 在 `webpack` 配置的 `css-loader` 中添加 `modules: true` 配置开启。
- `template` 中的类书写为 `$style.moduleA` 获取样式
- `style` 中通过 `module` 开启， `moduleA` 为类名
- 编译后会直接给类名 加上 `hash` 值，通过 **类选择器** 命中样式。注意不要使用 `id` 选择器
  
```vue
<template>
  <p :class="$style.page">css</p>
  <p :class="[$style.page, $style.main]">modules</p>
</template>
<style lang="scss" module>
  .page { color: #333; }
  .main { background-color: #fff; }
</style>
```

编译后，类名增加 `hash`

```html
<p class="page_1nmsErQ">css</p>
<p class="main_suEsjDd">module</p>
```

```css
.page_1nmsErQ { color: #333; }
.main_suEsjDd { background-color: #fff; }
```


## scoped

- `template` 中直接写 `class`
- `style` 上添加 `scoped`
- 编译后会在 **组件下的所有标签上** 加上额外的 `data-v-hash` 属性， `css` 通过 **属性选择器** 命中

  ```vue
  <template>
  	<p class="page">css</p>
  </template>
  <style lang="scss" scoped>
    .page { color: #333; }
  </style>
  ```

  编译后，同一组件拥有同一 `hash` 值的属性选择器

  ```css
  .page[data-v-72j8su6] { color: #333; }
  ```

  ```html
  <p data-v-72j8su6 class="page">css</p>
  ```
