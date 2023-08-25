# Cli 脚手架

## 定制脚手架

一般公司往往都会根据公司主要技术栈，预先搭建好自己的一套项目模板，存放在公司的代码仓库中，例如 `web-template` 、 `h5-template` 、 `weapp-template` 等，在开发新项目的时候，只需要下载项目模板即可快速进行开发。

但每次都得打开公司代码仓库，找到相应的模板进行下载，这时就可以开发自己的一套命令行指令，像 `create-vite-app` 一样能够自己选择对应模板后，自动下载项目模板下来，提升项目开发前的一点点体验。


### my-cli 功能

暂且叫这款简易的脚手架名为 `my-cli` ，先确定以下我们希望这款简易的脚手架能**提供什么功能**

- `npm i my-cli` 方式下载安装
- `my-cli create [projectName]` 快速创建（下载）模板


**应该具备哪些能力**

- 解析命令行参数能力，拿到命令行输入的项目名、下载路径等
- 提供命令行交互功能，选择指定模板
- 根据选择模板的 `git` 地址下载项目模板到指定路径
- 判断路径是否存在项目，提供是否覆盖询问功能


### 常见 node 包

以下是开发 `my-cli` 过程中可能会使用到的 `node` 包，目前大概看个预览功能，可以在使用到的时候再去查询相应的详细功能

- `minimist` - 命令行参数解析
- `chokidar` - `fs.watch` 和 `fs.watchFile` 替代品，解决两者存在的文件监听不正确的问题
- `child_process` - `nodejs` 包开启子线程
- `pathe` - 处理路径，与 `path` 类似
- `inquirer` - 命令行交互
- `prompts` - 也是命令行交互
- `git-clone` - `git clone` 操作，用于下载仓库和执行 `git` 命令，支持 `promise`
- `cli-spinner` - 命令行 `loading...`
- `fs-extra` - `nodejs` 中的 `fs` 替代，用于操作文件
- `semver` - 版本管理
- `clear` - 清空命令行输出
- `consola` - 命令行输出
- `colorette` - 命令行输出着色，配合 `consola` 使用


## 功能

逐一进行功能开发，可能会遇到的功能点

- 选择模板
- 输入项目名称
- 选择是否是小程序，小程序需要提供 `appid`
- `git` 模板下载
- 文件路径判断
- 文件读取、编辑、写入
- 命令行下载提示、着色


### 准备

先准备基础环境，安装 `node` ，初始化项目

```shell
npm init
```

安装 `typescript` 和 `ts-node` ，`ts-node` 用于编译并执行 `ts` 文件

```shell
pnpm i typescript ts-node -D
```

新建 `script` 命令，使用 `ts-node` 来编译执行 `ts` 文件

```json
{
  "scripts": {
    "dev": "ts-node ./src/index.ts"
  }
}
```

新建 `src/index.ts` ，并写入一些代码，运行 `dev` 命令即可看到 `ts-note` 正常使用，以下出现 `运行 dev 命令` 即执行以下命令 

```shell
npm run dev
```


### inquirer 命令行交互

首先从命令行交互开始，命令行交互需要借助 `inquirer` 包，这里使用 `inquirer@8` （`inquirer@9` 版本会报错不支持 `require` 引入使用）

#### 下载

```shell
pnpm i inquirer@8
pnpm i @types/inquirer -D
```


#### 获取选择的模板

```ts
// src/index.ts
import inquirer from 'inquirer'

const { prompt } = inquirer

const run = async () => {
  const { template } = await prompt({
    name: 'template',
    message: '请选择模板',
    type: 'list',
    default: 'web',
    choices: ['web', 'h5', 'weapp']
  })

  console.log(template)
}

run()

```

运行 `dev` 命令，即可看到命令行中出现 提示

```shell
? 请选择模板 (Use arrow keys)
> web
  h5
  weapp
```

选择 `web` 回车后打印的结果是 `'web'` ，至此简单介绍下传入 `prompt` 的参数是什么意思

- `name` ： 返会结果所存放的字段
- `message` ： 提示文案
- `type` ： 交互类型，这里 `list` 指的是 列表选择，此外还有 `checkbox` 、 `confirm` 、 `input` 、 `password` 等类型
- `default` ： 默认选中
- `choices` ： 可选项，也可是 `{ value: string, name: string }[]` 类型


#### 获取项目名

借助 `inquirer.prompt` 我们能做到提供命令行交互功能，并且能顺利拿到了选择的结果，以此类推，也可以拿到输入的 项目名称

```ts
import consola from consola

// code...

const { projectName } = await prompt({
  name: 'projectName',
  message: '请输入项目名称',
  type: 'input',
  default: `${template}-template`,
  validate: (val) => {
    const reg = /^[\w-]+$/
    if (!reg.test(val)) {
      consola.error('请输入正确的项目名称')
      return false
    }
    return true
  }
})

consola.log(green(projectName))
```

项目名称做了校验，不符合的名称将会输出 `error` 并且等待重新输入，注意这里改用 `consola` 输出，需要安装一下包，并引入使用，它与 `console` 功能类似，但可以美化命令行输出，此外可以搭配 `colorette` 使用

```shell
pnpm i consola colorette
```


### 模板下载

前面拿到了 **模板** 和 **项目名称** ，接下来进行下载，此时会用到 文件、路径处理 和 下载 等，需要先安装相应的依赖包

```shell
pnpm i pathe cli-spinner fs-extra git-clone
```


#### 路径处理

下载前进行文件夹、路径处理的函数

```ts
import { pathExistsSync, readdirSync, removeSync, existsSync } from 'fs-extra'

export const isEmpty = (path: string) => {
  return !(pathExistsSync(path) && readdirSync(path).length !== 0)
}

export const emptyDir = (path: string) => {
  if (!existsSync(path)) return
  removeSync(path)
}
```

#### 覆盖询问

默认覆盖，否则退出

```ts
import { join } from 'pathe'

// code...

const targetDir = join(process.cwd(), projectName)

if (!isEmpty(targetDir)) {
  const { overwrite } = await prompt({
    name: 'overwrite',
    default: true,
    type: 'confirm',
    message: () => (targetDir === '.' ? 'Current directory' : `Target directory "${targetDir}"`) + ' is not empty, Remove existing files and continue?',
  })
  if (!overwrite) {
    process.exit(1)
  } else {
    emptyDir(targetDir)
  }
}
```

#### 下载模板

准备项目模板的 `git` 地址

```ts
const remotes = [
  { git: 'exmaple.git', for: 'web' },
  { git: 'exmaple.git', for: 'h5' },
  { git: 'exmaple.git', for: 'weapp' },
]
```

开始下载模板

- 使用 `spinner` 提示下载中
- 使用 `git-clone/promise` 下载远程仓库模板，
- `readJson` 和 `writeJSON` 则用于编辑 `package.json` 文件
- 需要另外注意的是，如果选择小程序模板有传入 `appid` 的话，需要另外编辑 `project.config.json` 文件写入 `appid`

```ts
import { Spinner } from 'cli-spinner'
import gitClone from 'git-clone/promise'
import { existsSync, readJson, remove, writeJSON } from 'fs-extra'
import { greenBright } from 'colorette'

// code...

const remote = remotes.find(v => v.for === template).git

const spinner = new Spinner('正在下载中... %s')
spinner.setSpinnerString('|/-\\')
spinner.start()

await gitClone(remote, projectName)

await remove(join(targetDir, '.git'))

const packageJson = await readJson(join(targetDir, 'package.json'))
packageJson.name = projectName

if (template === 'weapp' && appid !== '') {
  if (existsSync(join(targetDir, 'project.config.json'))) {
    const miniProjectConfig = await readJson(join(targetDir, 'project.config.json'));
    miniProjectConfig.appid = appid;
    await writeJSON(join(targetDir, 'project.config.json'), miniProjectConfig, { spaces: 2 });
  }
}

await writeJSON(join(targetDir, 'package.json'), packageJson, { spaces: 2 })

spinner.stop(true)

consola.log(greenBright('模板下载完成'))
```

至此完成一个简易的模板下载脚手架


## 优化打包

前面使用的是 `ts-node` 做编译执行调试，不是很友好，可以使用 `unbuild` 来优化打包体验，开发环境下采用即时编译 `jiti` 实时获取最新代码，省去监听文件变动重新编译过程。

### 安装依赖

```sh
pnpm i -D unbuild
```

### scripts

```json
{
  "build": "unbuild",
  "dev": "unbuild --stub",
}
```


## Sources

`unbuild` 更多可以参考 [unbuild-demo](./unbuild.md)
