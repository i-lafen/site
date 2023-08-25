# 打包器基础


## 打包资源处理

### 加载非 js 资源

前端浏览器 `js` 中只能加载 `js` 资源， `node` 中也只能加载 `js` 和 `json` ， 所以打包工具中加载 `json` 和 图片 等资源的时候就得使用不同的方式去加载不同类型的文件，例如 `webpack` 中的 `loader` ， `webpack` 中一切皆为 `module` 。

#### 加载 json

例如

```json
{
  id: 1,
  name: 'lafen'
}
```

项目中使用时，打包器将其当作 `module` ，可以直接通过 `import` 引入

```js
import user from './user.json'
```

实际上，在 `webpack` 和 `rollup` 中，帮我们做了转换，将 `user.json` 的内容转换成了普通的 `js` 

```js
// 实际上 user.json 被编译成以下内容
export default {
  id: 1,
  name: 'lafen'
}
```

`webpack` 中通过 `loader` 来处理非 `js` 资源，例如 `json-loader`

```js
module.exports = function (source) {
  const json = typeof source === "string" ? source : JSON.stringify(source);
  return `module.exports = ${json}`;
};
```


#### 加载图片

图片资源则更简单，直接替换成图片路径即可

```js
export default `$PUBLIC_URL/assets/image/logo.png`;
```

使用的时候实际上引入的只是图片路径

```vue
<template>
  <img :src="logo" />
</template>

<script>
import logo from 'logo.png'
</script>
```


#### 加载 css

加载 `css` 需要处理两个关键点

- `css-loader` ： 借助 `postcss` 的 `postcss-value-parser` 解析处理 成 `AST` ， 并将 `css` 中的 `url` 和 `@import` 视为 模块导入
- `style-loader` ： 将处理完的 `css` 插入 `dom` 中。 即使用 `js` 手动创建 `style` 标签并填充 `css` 内容，然后将 `style` 标签插入 `dom`


将 `css` 资源插入 `dom` 示例

```js
module.exports = function (source) {
  return `
    function injectCss(css) {
      const style = document.createElement('style')
      style.appendChild(document.createTextNode(css))
      document.head.appendChild(style)
    }
    injectCss(\`${source}\`)
  `;
};
```


## 打包基础优化

### 提升 webpack 构建速度

> 使用 [speed-measure-webpack-plugin](https://github.com/stephencookdev/speed-measure-webpack-plugin) 可评估每个 loader/plugin 的执行耗时。


#### 使用更快的 loader： SWC

`webpack` 中最耗时的是负责 `AST` 转换的 `loader`，当 `loader` 进行编译时的 `AST` 操作均为 `CPU` 密集型任务，使用 `javascript` 性能低下，此时可采用高性能语言 `rust` 编写的 `swc`。

比如 `javascript` 转化由 `babel` 转化为更快的 [swc](https://swc.rs/)

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "swc-loader",
        },
      },
    ];
  }
}
```


#### 持久化缓存： cache

`webpack5` 内置了关于缓存的插件，可通过 [cache](https://webpack.js.org/configuration/cache/) 字段配置开启。

它将 `Module` `、Chunk` `、ModuleChunk` 等信息序列化到磁盘中，二次构建避免重复编译计算，编译速度得到很大提升。

```js
{
  cache: {
    type: "filesystem";
  }
}
```

如对一个 `JS` 文件配置了 `eslint`、`typescript`、`babel` 等 `loader`，他将有可能执行五次编译，被五次解析为 `AST` 

1. `acorn`: 用以依赖分析，解析为 `acorn` 的 `AST`
2. `eslint-parser`: 用以 `lint`，解析为 `espree` 的 `AST`
3. `typescript`: 用以 `ts`，解析为 `typescript` 的 `AST`
4. `babel`: 用以转化为低版本，解析为 `@babel/parser` 的 `AST`
5. `terser`: 用以压缩混淆，解析为 `acorn` 的 `AST`


而当开启了持久化缓存功能，最耗时的 `AST` 解析将能够从磁盘的缓存中获取，再次编译时无需再次进行解析 `AST`。

**得益于持久化缓存，二次编译甚至可得到与 Unbundle 的 vite 等相近的开发体验**

在 `webpack4` 中，可使用 [cache-loader](https://github.com/webpack-contrib/cache-loader) 仅仅对 `loader` 进行缓存。需要注意的是该 `loader` 目前已是 `@deprecated` 状态。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.ext$/,
        use: ["cache-loader", ...loaders],
        include: path.resolve("src"),
      },
    ],
  },
};
```


#### 多进程 thread-loader

[thread-loader](https://github.com/webpack-contrib/thread-loader) 为官方推荐的开启多进程的 `loader` ，可对 `babel` 解析 `AST` 时开启多线程处理，提升编译的性能。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "thread-loader",
            options: {
              workers: 8,
            },
          },
          "babel-loader",
        ],
      },
    ],
  },
};
```

在 `webpack4` 中，可使用 [happypack plugin](https://github.com/amireh/happypack) ，但需要注意的是 `happypack` 已经久不维护了
