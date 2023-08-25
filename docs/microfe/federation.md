# Webpack5 Module Federation



## 模块联邦概念

区分 **本地模块** 和 **远程模块** 。

- 本地模块 即为普通模块，为当前构建的一部分
- 远程模块 不属于当前构建的模块，并在运行时从所谓的容器加载

加载远程模块是异步操作，通常使用 `import()` 实现，但也支持像 `require.ensure` 或 `require([...])` 之类的旧语法.

容器由容器入口创建，入口暴露了对特定模块的异步访问。


## 优点

- 实现任意粒度的模块共享，可以引入远程组件、函数、甚至应用
- 优化构建产物体积，从远程拉取而不参与本地项目打包构建
- 运行时按需加载
- 第三方依赖共享，设置 `shared` 让远程组件优先使用本地依赖


## 新建项目

使用 [vue-cli](https://cli.vuejs.org/zh/guide/creating-a-project.html#vue-create) 新建一个 `app-expose` 项目，作为 导出组件 的 **容器**

```shell
vue create app-expose
cd app-expose
npm i
npm run serve
```

同样新建一个 `app-local` 项目，引用远程组件

```shell
vue create app-local
cd app-local
npm i
npm run serve
```



## 容器项目

`app-expose` 作为容器项目，对外提供组件，需要做些改造。

修改 入口文件 与 配置

- 根目录新建 `index.js`，引入 `main.js`
  ```js
  import('./main')
  ```
- 修改 vue.config.js
  ```js
  const { defineConfig } = require('@vue/cli-service')
  const webpack = require('webpack')

  module.exports = defineConfig({
    publicPath: 'auto',
    transpileDependencies: true,
    // 模块联邦入口
    pages: {
      index: {
        entry: './src/index.ts',
      },
    },
    devServer: {
      port: 8081, // 设置端口号 8081
    },
    configureWebpack: {
      optimization: {
        splitChunks: false,
      },
      plugins: [new webpack.container.ModuleFederationPlugin({
        // 指定输出容器名
        name: 'app_exposes',
        // 指定打包后输出的文件名，位于根目录
        // 即其他应用访问公共组件的入口文件
        // 入口文件保存各公共组件的请求地址
        filename: 'remote-entry.js',
        // 导出 给其他应用获取的组件或页面文件
        exposes: {
          // key: 该文件相对于 上面 remote-entry.js 的相对路径
          // value： 从 vue.config.js 访问组件的路径
          './CommonComponent.vue': './src/components/CommonComponent.vue',
          './AboutView.vue': './src/views/AboutView.vue',
        },
        // 用于避免项目出现多个公共依赖，设置这个属性后，webpack在加载时会先判断本地是否存在该依赖包，没有的话则加载远程应用的依赖包
        shared: {
          vue: {
            singleton: true,
          },
        },
      })],
    },
  })
  ```

如上面配置，通过插件 `webpack.container.ModuleFederationPlugin` 进行配置导出内容，其中 `expose` 中导出了一个 `CommonComponent` 组件，一个 `AboutView` 页面组件。

最后打包完成，会在根目录存在一个名为 `remote-entry.js` 的文件，里面保存了导出 组件名 以及 对应的组件路径，以供其他项目访问导出的组件。



## 引用远程组件的项目

`app-local` 需要引用 `app-expose` 项目暴露的组件，同样也需要修改入口和配置文件

- 根目录新建 `index.js`，引入 `main.js`
  ```js
  import('./main')
  ```
- 修改 vue.config.js
  ```js
  const { defineConfig } = require('@vue/cli-service')
  const webpack = require('webpack')

  module.exports = defineConfig({
    transpileDependencies: true,
    // 模块联邦的入口
    pages: {
      index: {
        entry: './src/index.ts',
      },
    },
    devServer: {
      port: 8082, // 设置端口号 8082
    },
    configureWebpack: {
      plugins: [new webpack.container.ModuleFederationPlugin({
        // 输出模块容器名称
        name: 'app_local',
        // 指定打包的文件名
        filename: 'remote-entry.js',
        // 引入 的远程模块
        remotes: {
          // key: 远程应用导出的容器名称
          // value: 映射地址，指定端口号，访问公共组件入口，该入口提供了暴露的所有公共组件资源
          app_exposes: 'app_exposes@http://localhost:8081/remote-entry.js'
        },
        shared: {
          vue: {
            singleton: true,
          },
        },
      })],
    },
  })
  ```

重新运行项目后打开页面，查看网络控制台，会发出一个请求

```
http://localhost:8081/remote-entry.js
```

该请求会拿到 容器 导出的 远程组件名 和 组件地址 ，在页面上使用到 远程组件 的时候，会根据 组件地址 发起请求，例如

```
http://localhost:8081/js/src_components_CommonComponent_vue.js
http://localhost:8081/js/src_views_AboutView_vue.js
```

`CommonComponent.vue` 和 `AbountView.vue` 最后都打包到了 `http://localhost:8081` 下的 `js` 文件夹下。



## Finally

社区中已经提供了一个比较成熟的 `Vite` 模块联邦方案: `vite-plugin-federation`，这个方案基于 `Vite`(或者 `Rollup`) 实现了完整的模块联邦能力，使用配置基本与 `webpack5` 一致。


## Sources

[Module Federation](https://webpack.docschina.org/concepts/module-federation/)

[Gitee Demo](https://gitee.com/lafen/module-federation-demo)

[Demo](https://github.com/AshesOfHistory/vue3-cli-module-federation-demo)
