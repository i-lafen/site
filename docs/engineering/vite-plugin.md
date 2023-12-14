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



## vite 插件开发

### 基本要求

- `vite` 插件导出是一个函数，可带入参，在使用插件时传入即可
- 函数要 `return` 一个对象
- `return` 的对象要有 `name` 属性
- 对象中使用合适的钩子即可

### 插件 Demo

简单利用 `vite` 来开发一个插件，用于在浏览器中打印一段文字，类似于某些网站的控制台打印的功能。

```js
// plugins > logPlugin.js
export const logPlugin = () => {
  console.log('logPlugin start')
  return {
    // 插件名
    name: 'log-plugin',
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

在 `vite.config.js` 中调用插件

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { logPlugin } from '@/plugins/logPlugins'

export default defineConfig({
  plugins: [vue(), logPlugin()], // 使用插件
})
```

到此即可在项目打包完毕后，将代码插入到项目中，打开浏览器控制台即可看到输出的内容。



## Finally

`vite` 插件开发就是需要熟悉 `vite` 钩子的功能和边界，使用合适的钩子完成想要的功能，知道 `vite` 有哪些钩子可以使用能够让我们在需要的时候快速实现功能。



## Source

[Vite](https://cn.vitejs.dev/guide/api-plugin.html#authoring-a-plugin)

[Vite 插件开发](https://juejin.cn/post/7276260308515389480#heading-3)