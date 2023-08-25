# Unbuild


[unbuild demo](https://gitee.com/lafen/unbuild-demo)


## Usage

Install package:

```sh
# pnpm
pnpm i
```

Import:

```js
// ESM
import { TEMPLATE_ENUM } from "./constant";

// CommonJS
const { TEMPLATE_ENUM } = require("./constant");
```

## unbuild 简介

无官网，只有 `github` 上一点介绍，配置也只有一个 类型声明 文件，需要查源码。

`unbuild` 是一个 `js` 打包工具，相比于 `rollup` 有更好的开发体验，如 即时编译 `jit` 。

## 安装

```sh
pnpm i unbuild -D
```

## 使用

新建 `index.ts` 、 `constant.ts` ， 分别写入

```ts
// index.ts
import { TEMPLATE_ENUM } from './constant'

export default function test() {
  console.log(888, TEMPLATE_ENUM)
}
test()
```
```ts
// constant.ts
export enum TEMPLATE_ENUM {
  WEB = 'WEB',
  H5 = 'H5',
}
```

### 更新 package.json 

```json
{
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  },
  "main": "./dist/index.cjs",
  "types": "./dist/index.d.ts",
  "files": [
    "dist"
  ]
}
```

### build

```sh
npx unbuild
```

这样就打包完成了。 `dist` 目录下会默认生成 `index.cjs` 和 `index.mjs` 文件，以及类型声明文件 `index.d.ts`


### stub

值得注意的是，开发时可以使用 `jiti` 的插桩，此时运行

```sh
npx unbuild --stub
```

这时 `dist` 目录下生成的是带 `jiti` 的 `bundle` ，可以尝试 `node` 直接执行 这个 `bundle` 查看输出，然后更改 `src` 源代码，再次使用 `node` 直接执行这个 `bundle` ，你会发现输出的代码是更改过后的。

也就是说我们只需执行一次插桩命令，无需监听源文件的修改就能做到实时更新打包内容，这极大的节省了监听编译源代码所消耗的时间。


### build.config.ts

也支持配置文件，新建 `build.config.ts`

```ts
import { defineBuildConfig } from 'unbuild'

// unbuild 配置
export default defineBuildConfig({
  // 类型声明
  declaration: true,
  // 入口
  entries: ['./src/index'],
  // 默认是输出的cjs和mjs文件的，但是声明了配置文件，则需要设置 emitCJS 为 true 显式输出 cjs，否则不会输出 cjs
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
    esbuild: {
      target: 'ES2020',
      // 压缩
      minify: true
    }
  }
})
```

注意 配置文件 需要 在 `rollup` 下显式声明 `emitCJS` 才会导出 `cjs` 类型文件， `declaration` 也需要设置为 `true` 以输出类型声明文件


## 功能

- 📦 Optimized bundler
  - unbuild 基于 rollup ，集成了 rollup 中的插件，开箱即用的支持 ts ，并允许生成 cjs 和 es 格式和类型声明（如果需要生成 iife 类型代码，可以通过 hooks 自己生成）。
  - 使用 esbuild 来转换 js 代码，比原生 rollup 更快
- 🪄 Automated config
  - 从 package.json 文件中自动推断 打包配置 和 入口文件
- 📁 Bundleless build
  - 集成 mkdist ，一个轻量的文件转换器，有点像 webpack 的 loader ，用于文件预处理，而且保持原有的目录文件结构
- ✨ Passive watcher
  - stub 插桩，使用 jiti 进行插桩。
  - 以往开发过程都需要监听文件改动，以实时打包，每更新一次都得重新打包一次，这在 monorepo 开发过程中，触发多个包一起打包就会较耗时，也不太合理。
  - 在 unbuild 中，可以使用插桩 ```npx unbuild --stub```
  - 此时并没有对文件进行监听，只是生成了 带 jiti 的 bundle ， 这时已经可以直接使用打包完的代码了，因为 jiti 可以动态的执行 js 或 ts 源码，在开发 monorepo 时还需执行一次 stub 即可，非常好用。
- ✍ Untype Generator
  - 集成 untyped ， 可以通过 markdown 和 配置对象生成类型。
- ✔️ Secure builds
  - 自动检查各种打包问题，例如潜在的丢失和未使用的依赖等。


## 源码

大致看一下源码

### package.json

```json
// package.json
{
  "bin": {
    "unbuild": "./dist/cli.mjs"
  }
}
```

由 `bin` 字段可知，运行 `npx unbuild` 的时候，其实是 `node` 在运行 `dist` 目录下的 `cli.mjs` 文件，对应 `src` 下即 `cli.ts` 。

### cli.ts

看下 `src/cli.ts` 代码

```ts
#!/usr/bin/env node
import { resolve } from "pathe";
import mri from "mri";
import { build } from "./build";

async function main() {
  const args = mri(process.argv.splice(2));
  const rootDir = resolve(process.cwd(), args._[0] || ".");
  await build(rootDir, args.stub).catch((error) => {
    console.error(`Error building ${rootDir}: ${error}`);
    throw error;
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

非常简洁，定义 `main` 函数，然后执行，里面主要调用了 `src/build.ts` 导出的 `build` 构建函数。 `build` 的时候传入 打包根目录 和 命令行 `stub` 参数，根目录默认 '.' ， 即当前目录。此外 `mri` 是一个轻量的命令行参数解析器（相比于 `minimist` 来说）。


### build.ts

看下 `build.ts`

```ts
// Read build.config and package.json
const buildConfig = tryRequire("./build.config", rootDir) || {};
const pkg = tryRequire("./package.json", rootDir);

// Resolve preset
const preset = resolvePreset(
  buildConfig.preset ||
    pkg.unbuild?.preset ||
    pkg.build?.preset ||
    inputConfig.preset ||
    "auto",
  rootDir
);
```

> 源码是 ts ，此处做了适当删减 ts 类型声明

首先通过 `tryRequire` 函数尝试读取根目录下的 `build.config[.js, .ts]` 文件 和 `package.json` 文件，然后 通过 `resolvePreset` 获取 预配置 `preset` ， `preset` 是字符串的话则当做文件，通过 `tryRequire` 去读取，是函数则执行函数拿到返回值。

- `tryRequire()`
  - 内部使用 `jiti` 进行读取文件内容
- `resolvePreset()`
  - 优先获取 `build.config` 文件下的 `preset` 字段
  - 取不到则依次降级为 `package.json` 里的 `unbuild.preset` 或者 `build.preset`
  - `inputConfig` 这里并没有传入，这里猜测为 命令行参数
  - `'auto'` 就比较有意思，直接赋值了 `autoPreset` ， `autoPreset` 由 `auto.ts` 中导出，具体看下
    ```ts
    export const autoPreset = definePreset(() => {
      return {
        hooks: {
          "build:prepare"(ctx) {
            // Disable auto if entries already provided of pkg not available
            if (!ctx.pkg || ctx.options.entries.length > 0) {
              return;
            }
            const sourceFiles = listRecursively(join(ctx.options.rootDir, "src"));
            const res = inferEntries(ctx.pkg, sourceFiles);
          },
        },
      };
    });
    ```
      - 就是 定义了 `'build:prepare'` 的 `hooks` ，在打包前处理完配置项
      - 注意这里的 `return` ， 当读取不到 `package.json` 文件或者 `entries` 入口存在情况下，直接返回，否则就根据 `src` 目录去推断具体的 入口文件
      - `listRecursively()`
        - 递归 `src` 目录下的所有文件，返回一个各个文件的路径的数组
      - `inferEntries()`
        - 接着会处理这个文件路径的数组，先从短到长排序
        - 从 `package.json` 中的 `exports` 中提取导出的文件名，存放到 `outputs`
        - 接着会处理 `package.json` 中的 `bin` 、 `main` 、 `module` 、 `types` ，一样存放到 `outputs` 
        - 遍历 `outputs` ，过滤掉文件夹，留下文件，逐一使用正则匹配每个 `output` 可能的 `input` 入口

接着看回 `build.ts` ， 拿到 `buildConfig` 和 `pkg` 和 `preset` 之后，通过 `defu` 库将他们与默认参数合并， `defu` 是一个深度合并参数的 `node` 包， `defu` 传入多个合并对象会以 **左边** 参数为准

```ts
// 合并优先级逐渐降低
const options = defu(
  buildConfig,
  pkg.unbuild || pkg.build,
  inputConfig,
  preset,
  { ...defaultBuildOptions }
) as BuildOptions
```

组装构建时上下文参数 `ctx` ，这在生成 `type` 类型声明 、 复制文件到输出目录、 `rollup` 打包时都用到

```ts
const ctx: BuildContext = {
  options,
  warnings: new Set(),
  pkg,
  buildEntries: [],
  usedImports: new Set(),
  hooks: createHooks(),
};
```

注册 `hooks` 到 `ctx.hooks` 上， 包括 `preset.hooks` 、 `inputConfig.hooks` 、 `buildConfig.hooks` ，并调用 `'build:prepare'` 这个 `hooks`

```ts
// Allow prepare and extending context
await ctx.hooks.callHook("build:prepare", ctx);
```

接着遍历 `opitons.entries` ， `builder` 字段不存在在自动判断使用 `mkdist` 还是 `rollup`

```ts
entry.builder = entry.input.endsWith("/") ? "mkdist" : "rollup";
```

然后依次调用打包

```ts
// untyped
await typesBuild(ctx);

// mkdist
await mkdistBuild(ctx);

// rollup
await rollupBuild(ctx);
```

如果是 `stub` ，则 `return`

```ts
// Skip rest for stub
if (options.stub) {
  await ctx.hooks.callHook("build:done", ctx);
  return;
}
```


## Sources

[Github](https://github.com/unjs/unbuild)
