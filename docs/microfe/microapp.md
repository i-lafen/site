# Micro App


## 概念

解决项目体积过大问题，大项目每次更新一次牵一发动全身，借鉴于微服务，微前端可以将项目拆分成一个个子项目单独部署。 [micro-app](https://cangdu.org/micro-app/docs.html#/) 能够让旧项目快速接入微前端。


`micro-app` 借鉴于 `WebComponent` ，通过 `CustomElement` 结合自定义的 `ShadowDom` ，将微前端封装成一个类 `WebComponent` 组件，从而实现微前端的组件化渲染。

而且接入简单，同时 `micro-app` 还提供了 `js`沙箱、样式、元素分离、预加载、数据通信、静态资源补全 等一系列完善的功能，并兼容所有框架。


## 快速上手

先准备两个项目，一个基座应用 `vite-vue3-base-app` ， 一个子应用 `vite-vue3-sub-app` ，此处均选择 `vite+vue3` 作为模板。

```shell
npm init vue@latest
```


### 基座应用

1、 安装依赖

```shell
npm i @micro-zoe/micro-app --save
```

2、 入口引入 并初始化

```js
// main.js
import microApp from '@micro-zoe/micro-app'
// start
microApp.start()
```

3、 分配一个路由给子应用

```js
// router.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import MyPage from './my-page.vue'

Vue.use(VueRouter)

const routes = [
  {
    // 👇 非严格匹配，/my-page/* 都指向 MyPage 页面
    path: '/my-page/:page*', // vue-router@4.x path的写法为：'/my-page/:page*'
    name: 'my-page',
    component: MyPage,
  },
]

export default routes
```

4、 在 MyPage 页面嵌入子应用

```vue
<!-- my-page.vue -->
<template>
  <div>
    <h1>子应用</h1>
    <!-- 
      name(必传)：应用名称
      url(必传)：应用地址，会被自动补全为http://localhost:5173/index.html
      baseroute(可选)：基座应用分配给子应用的基础路由，就是上面的 `/my-page`
     -->
    <micro-app
      name='app1'
      url='http://localhost:5173/'
      baseroute='/my-page'
    />
  </div>
</template>
```


### 子应用

1、 设置基础路由

```js
// main.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router'

const router = createRouter({
  // 👇 设置基础路由，子应用可以通过window.__MICRO_APP_BASE_ROUTE__获取基座下发的baseroute，如果没有设置baseroute属性，则此值默认为空字符串
  base: window.__MICRO_APP_BASE_ROUTE__ || import.meta.env.BASE_URL,
  routes,
})

let app = new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
```

2、 跨域问题

使用 `vite` 默认支持 `cors` ，即 `server.cors = true`


完成以上设置即可正常加载子应用了，但是由于基座与子应用都使用的 `vite` ，`micro-app@0.8` 对 `vite` 的支持并不是很好，还需要做更多的兼容处理。



### vite 是 子应用 时的 基座应用 兼容处理

对于 子应用 是 `vite` 应用的， 还需要对 基座应用 做修改

1、 关闭沙箱并使用内联 `script`

```vue
<!-- inline 使用内联 script 模式 -->
<!-- disableSandbox 关闭沙箱 -->
<template>
  <micro-app
    name='app1'
    url='http://localhost:5174/'
    baseroute='/my-page'
    inline
    disableSandbox
  >
</template>
```

2、 处理子应用静态资源

写一个简易的插件，对开发环境的子应用进行处理，补全静态资源路径。

```js
// 主应用 main.js
import microApp from '@micro-zoe/micro-app'

// 子应用 开发 信息
const subAppDevServer = {
  // 和子应用vite.config.js中base的配置保持一致
  base: '/child/vite/',
  // 子应用端口号
  port: '5174'
}

microApp.start({
  plugins: {
    modules: {
      // app1 即子应用的 name 值
      app1: [{
        loader(code) {
          if (process.env.NODE_ENV === 'development') {
            // 这里 /child/vite/ 需要和子应用vite.config.js中base的配置保持一致
            code = code.replace(/(from|import)(\s*['"])(\/child\/vite\/)/g, all => {
              const { protocol, hostname } = window.location
              const devUrl = `${protocol}//${hostname}:${subAppDevServer.port}${subAppDevServer.base}`
              return all.replace(subAppDevServer.base, devUrl)
            })
          }
          return code
        }
      }]
    }
  }
})
```

3、 自定义标签问题处理

基座应用 会报错 `micro-app` 未定义，需要进行以下自定义标签处理

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: tag => /^micro-app/.test(tag)
      }
    }
  }), vueJsx()],
})
```

### vite 子应用的兼容处理

当子应用是 `vite` 应用时需要做特别的适配，`micro-app@0.8` 适配 `vite` 改动非常大，我们必须关闭沙箱功能，因为沙箱在 `module script` 下不支持，这导致大部分功能失效，包括：

- 环境变量
- 样式分割
- 元素分割
- 资源路径补全、
- `baseroute` 等。

在嵌入 `vite` 子应用时，`micro-app` 的功能只负责渲染，其它的行为由应用自行决定，这包括如何防止样式、`JS` 变量、元素的互相影响。

在 `module` 模式下，引入的资源大多为相对地址，兼容主要做的事情就是将地址补全。

1、 修改 vite.config.js

```js
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { join } from 'node:path'
import { writeFileSync } from 'node:fs'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode })=> {
  // 改成 function 形式
  console.log('----[vite.config.js]---', command, mode, process.env.NODE_ENV)

  // 环境判断
  const isDev = process.env.NODE_ENV === 'development'
  const isProd = process.env.NODE_ENV === 'production'

  const base = !isDev
    ? isProd
      ? 'http://生产地址'
      : 'http://dev/qa-地址'
    : '/child/vite/';
  return {
    base,
    plugins: [
      vue(),
      vueJsx(),
      (function() {
        let basePath = ''
        return {
          name: 'vite:micro-app',
          apply: 'build',
          configResolved(config) {
            console.log('----[my plugin]----', config.base, config.build.assetsDir)
            basePath = `${config.base}${config.build.assetsDir}/`
          },
          writeBundle(options, bundle) {
            for(const chunkName in bundle) {
              if (Object.prototype.hasOwnProperty.call(bundle, chunkName)) {
                const chunk = bundle[chunkName]
                if (chunk.fileName && chunk.fileName.endsWith('.js')) {
                  chunk.code = chunk.code.replace(/(from|import\()(\s*['"])(\.\.?\/)/g, (all, $1, $2, $3) => {
                    console.log('---[plugin write]---', $3, basePath)
                    return all.replace($3, new URL($3, basePath))
                  })
                  const fullPath = join(options.dir, chunk.fileName)
                  writeFileSync(fullPath, chunk.code)
                }
              }
            }
          }
        }
      })()
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
  }
})

```

2、 修改容器元素 `id` 并使用新的 `id` 渲染

```html
<!-- index.html -->
<body>
  <div id="my-vite-app"></div>
</body>
```

```js
// main.js
createApp(App).mount('#my-vite-app')
```

当多个 `vite` 子应用同时渲染时，必须修改容器元素的 `id` 值，确保每个子应用容器元素 `id` 的唯一性，否则无法正常渲染。

3、 图片静态资源处理

例如处理 `logo` 图片，也可以封装成通用函数，统一处理

```js
import Logo from '@/assets/logo.svg'

// 获取基本路径，用于将图片相对路径改成绝对路径
const getBaseUrlToImg = () => {
  console.log('---[img]---', import.meta.url)
  const isProd = process.env.NODE_ENV === 'production'
  const index = import.meta.url.indexOf(
    isProd ? '/app1' : '/child/vite/'
  )
  const basePath = `${isProd ? '/app1' : '/child/vite/'}src/`
  return import.meta.url.slice(0, index) + basePath
}
// 图片路径
const logoImg = process.env.NODE_ENV === 'production'
  ? new URL(Logo, import.meta.url).href
  : `${getBaseUrlToImg()}assets/logo.svg`
```


## micro-app 1.x

[micro-app](https://micro-zoe.github.io/micro-app/)已更新至 `1.x beta` 版，兼容 `vite` 子应用不需要再进行过多的修改处理。

`micro-app` 借鉴 `WebComponent` 的思想，通过 `CustomElement` 结合自定义的 `ShadowDom` ，将微前端封装成一个类 `WebComponent` 组件，实现微前端的组件化渲染。

- `js` 沙箱

  与 `qiankun` 一样， `micro-app` 采用 `proxy` + `with` 的沙箱方案，但也使用 `Object.defineProperty` 定义全局变量，以减少 `proxy` 带来的性能损耗

- `css` 隔离

  除了 `shadow dom` ，还可以通过给子应用添加属性选择器来实现样式隔离，例如

  ```css
  main {
    color: black;
  }
  
  /* 添加属性选择器 */
  micro-app[name=app] main {
    color: black;
  }
  ```

- 虚拟路由系统

  自定义 `location` 和 `history` 等核心路由 `api` ，重写了 `popState` 和 `hashChange` 事件，拦截导航和事件。基座应用能方便的获取子应用的路由信息并控制子应用跳转，子应用的路由信息也会作为参数同步到浏览器地址栏

- `vite` 的兼容

  之前的版本要支持 `vite` 必须关闭沙箱，因为 `vite` 打包出来的 `esm` 类型的 `js` 文件，无法运行在 `with` 环境中，故采用了 `iframe` 沙箱方案做兼容。




## Source

- [Demo](https://gitee.com/lafen/micro-app-vite-vue3-demo)
- [Repo](https://github.com/micro-zoe/micro-app-demo)
- [Post](https://zhuanlan.zhihu.com/p/661541867)

