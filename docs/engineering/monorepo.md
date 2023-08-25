# Monorepo


monorepo 介绍见 [Monorepo](./package.md)


创建一个 `pnpm` + `monorepo` 项目，地址见 [Monorepo Demo](https://gitee.com/lafen/monorepo-demo)



## 开始

创建项目文件夹并进入

```sh
mkdir monorepo-demo && cd monorepo-demo
```

根目录初始化

```sh
pnpm init
git init
```

根目录新建 `.gitignore` 并添加 `git` 忽略追踪文件夹

```
node_modules
dist
```

根目录新建 `packages` 文件夹，将子项目存放在此目录下，如新建 `cli` 和 `utils` 两个子项目

```sh
mkdir packages && cd packages
mkdir cli
mkdir utils
```

分别初始化 `cli` 和 `utils` 两个项目

```sh
cd cli && pnpm init
cd utils && pnpm init
```

分别进入 `cli` 和 `utils` 文件夹新建 `src/index.ts` ， 写点代码，比如

```typescript
// utils/src/index.ts
import { random } from 'lodash-es'

export const add = (a: number, b: number) => a + b
export const times = (a: number, b: number) => a * b
export const getRandom = () => random(1, 10)
```

```typescript
// cli/src/index.ts
console.log(sum)
```

目前只是两个不相关的子项目同在 `monorepo-demo` 下，接下来在 `monorepo-demo` 下的设置 `workspace`



## workspace

根目录新建 `pnpm-workspace.yaml` 文件， `packages` 下为子项目空间

```yaml
packages:
  - 'packages/**'
```



## 安装依赖

根目录安装 `typescript` ， `-w` 表示根目录安装

```sh
pnpm install typescript -w -D
```

局部安装，即子项目安装，如 `utils` 下安装 `lodash-es` ， 可进入子项目下直接安装或者使用 `--filter`

```sh
pnpm install lodash-es --filter utils
```

如果子项目之间有依赖的话，可以直接安装， `pnpm` 会从当前 `workspace` 中查找依赖包，找不到会去 `npm` 上找，例如修改一下 `cli/src/index.ts` ， 引入 `utils` 方法来使用

```typescript
import { add } from 'utils'

const sum = add(1, 2)
console.log(sum)
```

给 `cli` 子项目安装 `workspace` 下的依赖包

```sh
pnpm install utils --filter cli
```

此时 `cli/package.json` 加了一条依赖包记录

```json
{
  "dependencies": {
    "utils": "workspace:^1.0.0"
  }
}
```



## unbuild 打包

至此我们完成了一个 `monorepo` 简易项目结构，接下来使用 `unbuild` 来帮忙打包（ `unbuild` 使用可以看 [unbuild-demo](https://gitee.com/lafen/unbuild-demo) ）

根目录安装 `unbuild`

```sh
pnpm install unbuild -w -D
```

根目录已经子项目下 `package.json` 分别新建 `scripts`

`monorepo-demo/package.json`

```json
{
  "scripts": {
    "dev": "pnpm --filter=./packages/* dev",
    "build": "pnpm --filter=./packages/* build"
  },
}
```

`cli/package.json`

```json
{
  "scripts": {
    "dev": "unbuild --stub",
    "build": "unbuild"
  },
}
```

`utils/package.json`

```json
{
  "scripts": {
    "dev": "unbuild --stub",
    "build": "unbuild"
  },
}
```

至此即可在根目录或子项目下运行 打包命令，进行 开发 或 生产 环境打包，运行即可看到子项目下生成了 `dist` 目录

```sh
pnpm dev
pnpm build
```



### cli 调试


此外， `utils/package.json` 修改一下 `main` ，指向 `dist/index.mjs`

```json
{
  "main": "./dist/index.mjs",
}
```

`cli/package.json` 修改一下 `type` 为 `module` ， 并添加 `bin`

```json
"type": "module",
"bin": {
  "create-temp": "./bin/index.js"
},
```

`cli` 下新建 `bin/index.js`

```js
#!/usr/bin/env node

import '../dist/index.mjs'
```

`monorepo-demo` 根目录下执行

```sh
npm link
```

运行开发打包命令

```sh
pnpm dev
```

即可在项目完成打包后，执行 脚手架命令，此时命令行执行得到结果 `3`

```sh
create-temp
```

得益于 `unbuild` 的即时编译能力，能够只运行一次 `dev` 即可随意更改代码后进行调试脚手架命令，例如

修改 `cli/src/index.ts`

```ts
const sum = add(1, 22)
```

或者修改 `utils/src/index.ts`

```ts
export const add = (a: number, b: number) => {
  return a + b + 100
}
```

然后直接运行命令，即可得到代码修改后的运行结果

```sh
create-temp
```


## 使用 changeset


根目录下载依赖

```sh
pnpm add -Dw @changesets/cli
```

然后初始化

```sh
pnpm changeset init
```

这时会在根目录下生成一个 `.changeset` 文件夹，里面包含 `config.json` 和 `README.md` 文件，需要对 `.changeset/config.json` 文件做下修改

```json
{
  "access": "public",
  "baseBranch": "master",
}
```

然后执行 `changeset` 命令生成新的 `changesets`

```sh
pnpm changeset
```

- 这时会让你选择需要更新日志的 `package` ， 手动选择后回车
- 然后会询问是否是 `package` 的 `major` 更新，选择后下一步询问更新摘要输入
- 不选择 `major` 直接回车则询问是否 `minor` 更新，选择后下一步询问更新摘要输入
- 不选择 `minor` 则最后默认是 `patch` 更新
- 最后询问输入更新摘要，回车确认是期望的更新内容
- 然后会在 `.changeset` 文件夹下生成一个 md 文件，例如 `.changeset/purple-hores-wait.md`


`.changeset/purple-hores-wait.md` 包含更新的包以及输入的更新摘要

最后执行更新

```sh
pnpm changeset version
```

`.changeset/purple-hores-wait.md` 文件会被消耗并删除， 选择更新的包的项目目录下会生成 `CHANGELOG.md` 文件，追加包版本记录以及更新摘要，并且会更新 `package.json` 中的 `version` 版本，更新规则按照 之前选择的 `major` 、 `minor` 、 `patch` 来更新版本号
