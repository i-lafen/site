# VitePress


## 简介

- 使用 `vitepress` 快速构建在线文档
- 使用 `medium-zoom` 图片放大预览
- 使用 `github pages` 自动部署文档
- 添加 文章字数 、 阅读文章 耗时
- 添加 黑白主题切换动画


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

- `name` 定义工作流名称
- `on` 指定触发工作流的 `git hook` 事件、分支名，全匹配到则执行以下流程
  - `permission` 权限配置
  - `jobs` 节点会生成工作流要执行的步骤
    - `build` 构建流程
      - `runs-on` 指定运行环境，默认 `unbuntu-latest`
      - `steps` 流程，一个 `-` 符号表示一个步骤， `name` 可选
        - `run` 执行脚本
        - `uses` 这里使用了 `pnpm` 下载依赖包，此时需要在项目的 `package.json` 中添加字段 `"packageManager": "pnpm@8.6.11"`
    - `deploy` 部署流程


一些配置说明， `deploy` 节点中的字段也差不多

```yml
- uses: actions/checkout@v4 # 拉取代码，使用的 github action 提供的工具
- uses: actions/setup-node@v4 # 使用 node 环境
  with:
    node-version: 20 # node 版本
- run: pnpm install # 安装依赖
- run: pnpm docs:build # 构建
- uses: actions/upload-pages-artifact@v3 # 上传构建完的文件
  with:
    path: docs/.vitepress/dist # 构建目录
```


以上 `github action` 的配置就差不多了，也可以使用 `Travis` 等工具来尝试下配置构建流程，添加更加丰富的功能，比如 `eslint` 、 `vitest` 等



### 添加文章字数和阅读耗时

按正常阅读速度 `500/min` 算，先获取页面字数，然后按这个一般阅读进行估算阅读时间

暂且将阅读时间放置在每篇文章顶部，可以利用 `vitepress` 提供的页面的插槽来放置，此时需要对默认布局进行修改

`/.vitepress/theme/` 文件夹下放置 `layout/index.vue` ，用这个来覆盖默认主题

```vue
<!-- /.vitepress/theme/layout/index.vue -->
<script setup>
import DefaultTheme from 'vitepress/theme'
import useSpendTime from '../hooks/useSpendTime'

const { text, textStyle, colorStyle } = useSpendTime()
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-before>
      <span :style="textStyle">
        ⏰
        <span :style="colorStyle">{{ text }}</span>
      </span>
    </template>
  </DefaultTheme.Layout>
</template>
```

`useSpendTime` 的 `hooks` 代码如下

```ts
// /theme/hooks/useSpendTime.ts
import { onMounted, ref, watch, computed, nextTick } from 'vue'
import { useRoute } from 'vitepress'

/**
 * 阅读文章花费时间
 * @returns { text: string }
 */
const useSpendTime = () => {
  const route = useRoute()

  const count = ref(0)

  const initStat = () => {
    count.value = document.querySelector("#VPContent")?.innerText?.length ?? 0
  }
  onMounted(initStat)
  watch(() => route.path, () => nextTick(initStat))

  const spendTime = computed(() => Math.round(count.value / 500))
  const text = computed(() => `本文共 ${count.value} 字，阅读约 ${spendTime.value} 分钟`)

  const textStyle = { display: 'flex', marginBottom: '1rem' }
  const colorStyle = { color: 'var(--vp-c-text-3)' }

  return {
    text,
    textStyle,
    colorStyle
  }
}

export default useSpendTime
```

然后在 `/theme/index.ts` 中引入覆盖 `Layout` 即可

```ts
import DefaultTheme from 'vitepress/theme'

import './index.css'
import Layout from './layout/index.vue'

import useImgZoom from './hooks/useImgZoom'

export default {
  ...DefaultTheme,
  Layout,
  setup() {
    useImgZoom()
  }
}
```


### 黑白主题切换动画

新建 `/theme/hooks/useThemeTransition.ts`

```ts
import { useData } from 'vitepress'
import { nextTick, provide } from 'vue'

/**
 * 主题切换动画
 */
const useThemeTransition = () => {
  const { isDark } = useData()
  const enableTransitions = () =>
    'startViewTransition' in document
      && window.matchMedia('(prefers-reduced-motion: no-preference)').matches

  provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
    if (!enableTransitions()) {
      isDark.value = !isDark.value
      return
    }
  
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y)
      )}px at ${x}px ${y}px)`
    ]
  
    await document.startViewTransition(async () => {
      isDark.value = !isDark.value
      await nextTick()
    }).ready
  
    document.documentElement.animate(
      { clipPath: isDark.value ? clipPath.reverse() : clipPath },
      {
        duration: 360,
        easing: 'ease-in',
        pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`
      }
    )
  })
}

export default useThemeTransition
```

修改样式 `/theme/layout/index.css`

```css
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

.VPSwitchAppearance {
  width: 22px !important;
}

.VPSwitchAppearance .check {
  transform: none !important;
}
```


在 `/theme/layout/index.vue` 中引入 `hooks` 和 `css`

```vue
<script setup>
import useThemeTransition from '../hooks/useThemeTransition'
import './index.css'

useThemeTransition()
</script>
```


## Finally

`vitepress` 的使用文档还是挺清晰的，新手基本看下文档就能配置运行构建了，基本零配置也能搭建一个静态博客，配合 `github action` 部署到 `github pages` 还能顺手熟悉下构建部署流程

在 `vite.config.ts` 中配置 `nav` 和 `sidebar` 感觉还是挺麻烦的，本来想尝试自动匹配文件夹下 `md` 文件自动生成导航栏和侧边栏，但是 `nodejs` 脚本读取到的文件路径无法自己指定排序，所以还是手动配置吧



## Reference

- [VitePress](https://vitepress.dev/zh/guide/deploy#github-pages)
