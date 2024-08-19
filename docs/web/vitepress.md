# VitePress


## 简介

- 使用 `vitepress` 快速构建在线文档
- 使用 `medium-zoom` 图片放大预览
- 使用 `github pages` 自动部署文档


## 环境准备

- [Node.js >= 18](https://nodejs.org)
- [VitePress](https://vitepress.dev)


## 开始

### 初始化 vitepress

下载 `vitepress` 并初始化一个 `vitepress` 项目

```sh
# install
pnpm add -D vitepress
# init
pnpm vitepess init
```

初始化时会出现以下选择

```sh
┌   Welcome to VitePress!
│
◇  Where should VitePress initialize the config?
│  ./docs
│
◇  Site title:
│  My Awesome Project
│
◇  Site description:
│  A VitePress Site
│
◇  Theme:
│  Default Theme
│
◇  Use TypeScript for config and theme files?
│  Yes
│
◇  Add VitePress npm scripts to package.json?
│  Yes
│
└  Done! Now run pnpm run docs:dev and start writing.
```

一般默认即可完成初始化了，我这里将 `config` 配置文件放置在了 `/docs` 目录下

```sh
pnpm run docs:dev
```

此时项目的 `docs/.vitepress/config.ts` 文件中会包含项目的配置信息，可以进行常用配置

- 基础 `url`
- 顶部导航
- 侧边栏菜单
- 本地搜索
- 最近更新时间

具体配置可以参考 [vitepress文档](https://vitepress.dev/zh/reference/site-config)


### medium-zoom 图片放大预览

`vitepress` 默认不支持图片放大预览，需要安装依赖支持

```sh
pnpm add medium-zoom
```

然后在文档主题文件中引入依赖， `docs/.vitepress` 下没有 `theme` 文件夹直接创建即可

```ts
// docs/.vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import './index.css'

import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'

export default {
  ...DefaultTheme,
  setup() {
    const route = useRoute()
    const initRoom = () => mediumZoom('.main img', { background: 'var(--vp-c-bg)' })
    onMounted(initRoom)
    watch(() => route.path, () => nextTick(initRoom))
  }
}
```

并配置以下预览样式

```css
/* docs/.vitepress/theme/index.css */
.medium-zoom-overlay {
  z-index: 20;
}
.medium-zoom-image {
  z-index: 21;
}
```

完成以上操作后，就可以放大图片预览了


### 开启 github pages

登录 `github` 创建仓库，并将代码推送到仓库中

- 仓库中点击菜单进入 `Setting -> Pages` 进行配置
- `Source` 选择 `Deploy from a branch`
- `Branch` 选择 `master` （本地主分支）， `folder` 选择 `/docs` ，保存即可


在仓库根目录 `.github/workflows/deploy.yml` 中创建构建脚本

```yml
# .github/workflows/deploy.yml
# 构建 VitePress 站点并将其部署到 GitHub Pages 的示例工作流程
#
name: Deploy VitePress site to Pages

on:
  # 在针对 `main` 分支的推送上运行。如果你
  # 使用 `master` 分支作为默认分支，请将其更改为 `master`
  push:
    branches: [master]

  # 允许你从 Actions 选项卡手动运行此工作流程
  workflow_dispatch:

# 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# 只允许同时进行一次部署，跳过正在运行和最新队列之间的运行队列
# 但是，不要取消正在进行的运行，因为我们希望允许这些生产部署完成
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # 构建工作
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # 如果未启用 lastUpdated，则不需要
      - uses: pnpm/action-setup@v3 # 如果使用 pnpm，请取消注释
      # - uses: oven-sh/setup-bun@v1 # 如果使用 Bun，请取消注释
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm # 或 pnpm / yarn
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Install dependencies
        run: pnpm install # 或 pnpm install / yarn install / bun install / npm ci
      - name: Build with VitePress
        run: pnpm docs:build # 或 pnpm docs:build / yarn docs:build / bun run docs:build / npm run docs:build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  # 部署工作
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4

```

推送到远程仓库即可，等待一会就可以访问你的文档了，地址如下
```http
https://{username}.github.io/{repository}
```


#### deploy.yml 脚本内容

- `name` 定义名称
- `on` 节点表示触发工作流的事件，及分支名
- `permission` 权限配置
- `jobs` 节点会生成工作流要执行的步骤
  - `build` 构建
    - `run` 执行脚本
    - `uses` 这里使用了 `pnpm` 下载依赖包，此时需要在项目的 `package.json` 中添加字段 `"packageManager": "pnpm@8.6.11"`
  - `deploy` 部署
