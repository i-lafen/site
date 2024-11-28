# Vite 插件



## 基础概念

### vite 钩子

`vite` 和 `webpack` 一样从开始构建到结束提供了很多生命周期钩子，以供功能定制开发。

`vite` 基于 `rollup` 封装的，所以 `vite` 中一部分钩子其实就是 `rollup` 中的钩子：

- 通用钩子（沿用 `rollup` 的钩子）
- 独有的钩子

#### 通用钩子 7 个

- `options` - 构建阶段第一个钩子，可在其中获取插件中暴露的参数
  ```js
  myPlugin({
  	name: 'pluginDemo',
  })
  ```
- `buildStart` - 读取入口文件后开始构建
  - 自定义任务：构建前开始执行自定义任务，例如清理临时文件、生成一些构建配置、执行前置操作等
  - 日志记录：记录项目信息等，以便后续分析和调试
  - 状态检查：构建前的状态检查，出错可提前终止并给出错误提示
  - 设置环境变量：根据不同环境配置不同的构建选项
- `resolveId` - 主要用于自定义模块解析的行为
- `load` - 模块加载时调用，可用于自定义模块加载逻辑
- `transform` - 模块代码构建期间调用，用于修改模块源代码，可以在构建期间对模块进行转换和处理，例如添加额外的代码、转换特定格式文件等
- `buildEnd` - 可用于构建结束后生成报告、自动化部署、通知团队构建完成等
- `closeBundle` - 打包生成 `bundle` 文件时调用，可进行上传 `bundle` 文件到 `cdn` 、生成版本号、代码压缩、加密等

#### 独有钩子 6 个

- `config` - 可在配置对象创建之前对其进行修改和扩展，例如修改构建输出目录、设置自定义别名等
- `configResolved` - 用于在 `vite` 配置对象被解析和应用后执行自定义操作，允许检查和修改已解析的 `vite` 配置
- `configureServer` - 用于配置开发服务器，在 `vite` 开发服务器启动之前执行，允许自定义开发服务器的行为，例如添加中间件到开发服务器中，以处理请求、响应、添加验证等
- `configurePreviewServer` - 与 `configureServer` 相同，但用于预览服务器
- `transformIndexHtml` - 在生成最终的 `index.html` 文件之前执行，允许修改 `html` 内容、添加脚本、标签等
- `handleHotUpdate` - 用于模块发生热更新时执行自定义逻辑



### 插件执行顺序

`Vite` 插件可以通过 `enforce: 'pre' | 'post'` 属性，来调整它的应用顺序，解析后的插件将按照以下顺序排列

- `Alias`
- 带有 `enforce: 'pre'` 的用户插件
- `Vite` 核心插件
- 没有 `enforce` 值的用户插件
- `Vite` 构建用的插件
- 带有 `enforce: 'post'` 的用户插件
- `Vite` 后置构建插件（最小化， `manifest` ，报告）

请注意，这与钩子的排序是**分开**的，钩子的顺序仍然会受到它们的 `order` 属性的影响，与 `Rollup` 钩子表现一样


### 插件应用环境

插件默认在 开发 `serve` 和 构建 `build` 模式中都会调用，可以使用 `apply: 'serve' | 'build'` 属性来指明插件在哪些模式下生效，也可以使用 `apply` 声明为函数来进行精准控制

```js
apply(config, { command }) {
  // 非 SSR 情况下的 build
  return command === 'build' && !config.build.ssr
}
```


### 插件路径规范

为消除不同系统环境下路径差异，在将路径与已解析的路径进行比较时，首先规范化路径，使用 `vite` 中导出的帮助函数 `normalizePath`

```js
import { normalizePath } from 'vite'

normalizePath('foo\\bar') // 'foo/bar'
normalizePath('foo/bar') // 'foo/bar'
```


### 虚拟模块

先看示例

```js
export default function myPlugin() {
  // 前缀 virtual:
  const virtualModuleId = 'virtual:timestamp'
  // 固定格式
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  return {
    name: 'my-plugin',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {  
        return `export default ${Date.now()};`
      }
    }
  }
}
```

在项目中就可以通过以下方式引入使用该虚拟模块

```js
import timestamp from 'virtual:timestamp'
console.log(timestamp) // 拿到虚拟模块输出内容
```

`vite` 插件的虚拟模块作用主要体现在 动态内容生成、灵活编程、集成第三方服务、提升开发体验 等方面

实际开发中比较少用




## vite 插件开发

### 基本要求

- `vite` 插件导出是一个函数，可带入参，在使用插件时传入即可
- 函数要 `return` 一个对象
- `return` 的对象要有 `name` 属性
- 返回的对象中使用合适的钩子即可



### 插件 Demo

通过几个常见的示例来学习如何开发一个 `vite` 插件


#### 打印输出日志插件


简单利用 `vite` 来开发一个插件，用于在浏览器中打印一段文字，类似于某些网站的控制台打印的功能

```js
// @/plugins/vite-plugin-log.js
export const vitePluginLog = () => {
  console.log('plugin start')
  return {
    // 插件名
    name: 'vite-plugin-log',
    // 直接给 main.js 文件添加一段代码，或者直接在 transformIndexHtml 钩子中添加脚本也可
    transform(code, id) {
      if (id.endsWith('main.js')) {
        return `${code}\nif (typeof window !== 'undefined') {
					const txt = '这是一个 vite 插件 demo';
					console.log(txt);
				}`
      }
      return code
    }
  }
}
```

在 `vite.config.js` 中使用插件

```js
import { vitePluginLog } from 'src/plugins/vite-plugin-log'

export default defineConfig({
  plugins: [vue(), vitePluginLog()], // 使用插件
})
```

到此即可在项目打包完毕后，将代码插入到项目中，打开浏览器控制台即可看到输出的内容。


#### 注入构建时间戳插件

再或者，开发者想在项目页面注释中能够方便的看到上次构建的时间，则可以自定义如下插件，将构建时间插入到页面中，当然也可以是其他信息

```ts
// @/plugins/vite-plugin-inject-build-time.js
export const vitePluginInjectBuildTime = () => {
  return {
    name: 'vite-plugin-inject-build-time',
    transformIndexHtml(html) {
      const now = new Date().toLocaleString()
      return html.replace(
        '<body>',
        `<body><!-- Last Build Time ${now} -->`
      )
    }
  }
}
```

在 `vite.config.js` 中使用插件

```js
import { vitePluginInjectBuildTime } from 'src/plugins/vite-plugin-inject-build-time'

export default defineConfig({
  plugins: [vue(), vitePluginInjectBuildTime()], // 使用插件
})
```

然后就可在 `html` 中查看到该时间注释了

```html
<!doctype html>
<html lang="en">
  <body>
    <!-- Last Build Time 2024/9/14 01:37:59 -->
    <div id="root"></div>
  </body>
</html>
```


#### 静态资源预加载插件

静态资源预加载，通过 `link` 的 `rel=preload` 的资源提示符，提前加载资源，减少白屏时间，优化用户体验

以 `@/assets/images` 静态图片为例，其中可能包含多张系统背景大图、看板大图等静态资源

- 使用 `fast-glob` 包来批量获取图片文件名，根据 `vite.config.js` 的 `base` 等参数拼接完整路径
- 创建 `link` 标签，并添加 `rel=preload` 属性，追加到 `head` 标签尾部

```js
// @/plugin/vite-plugin-images-preload.js
import fg from 'fast-glob'
import { normalizePath } from 'vite'

// 静态图片资源 预加载 vite 插件
export const vitePluginImagePreload = (config = {}) => {
  const defaultConfig = {
    cwd: 'src/assets/images/',
    match: '*.{jpg,png}',
    injectTo: 'head',
  }
  const mergedConfig = { ...defaultConfig, ...config }
  const { cwd, match, injectTo } = mergedConfig
  return {
    name: 'vite-plugin-image-preload',
    transformIndexHtml(_html, ctx) {
      const { base } = ctx.server.config
      const files = fg.sync(match, { cwd })
      const links = files.map(fileName => {
        return {
          tag: 'link',
          injectTo,
          attrs: {
            rel: 'preload',
            as: 'image',
            href: normalizePath(base + cwd + fileName)
          }
        }
      })
      return links
    }
  }
}
```

在 `vite.config.js` 中使用插件

```js
import { vitePluginImagePreload } from 'src/plugins/vite-plugin-image-preload'

export default defineConfig({
  plugins: [vue(), vitePluginImagePreload()]
})
```


### 可能有的坑

在 `vite` 本地打包 `build` 时，突然报错

```shell
error TS2584: Cannot find name 'console'. Do you need to change your target library? Try changing the 'lib' compiler option to include 'dom'.
```

这里的 `console` 是插件里调试时打印使用的

```js
transformIndexHtml(html) {
  const now = new Date().toLocaleString()
  console.log(now, html)
}
```

具体原因搜索如下

> `console` 不属于 `ecmascript` 标准，属于 `bom api` ， 而 `ts` 自带的类型只有 `dom` 环境里哪些 （在 `lib.dom.d.ts` 里）， `node.js` 的则在 `@types/node` 来维护


如果缺少库，则安装

```sh
pnpm i -g @types/node tslib
```

还得配置 `ts` 编译参数，加上 `DOM` 环境

```json
// tsconfig.node.json
{
  "compilerOptions": {
    "lib": ["ES2023", "DOM"]
  }
}
```



## Finally

`vite` 插件开发就是需要熟悉 `vite` 钩子的功能和边界，使用合适的钩子完成想要的功能，知道 `vite` 有哪些钩子可以使用能够让我们在需要的时候快速实现功能。



## Source

- [Vite](https://cn.vitejs.dev/guide/api-plugin.html#authoring-a-plugin)

- [Vite 插件开发](https://juejin.cn/post/7276260308515389480#heading-3)