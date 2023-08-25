# 代码规范


## eslint 和 prettier

- `eslint` 常用于项目中代码检测
- `prettier` 常用于自动格式化代码

### 集成 eslint 和 prettier

安装 `eslint-config-standard`、`eslint-plugin-import`、`eslint-plugin-promise`、`eslint-plugin-node`

```powershell
yarn add eslint-config-standard eslint-plugin-import eslint-plugin-promise eslint-plugin-node
```

设置 `extends` 配置，也可以在 `rules` 里修改校验规则，可选值 `['error', 'warn', 'off']`，更多配置可以试试官网 [eslint playground](https://eslint.org/play/)

```js
// .eslintrc.js
module.exports = {
  extends: 'standard',
  rules: {
    'space-before-function-paren': 'off'
  }
}
```

`vscode` 中安装 `Prettier - Code formatter` 插件，设置格式化规则，例如

```js
// .prettierrc
{
  "semi": false,
  "singleQuote": true
}
```

- 在 `vscode` 的 `Settings` 中搜索并勾选 `Editor: Format On Save` 选项，开启保存时格式化
- `Settings` 中搜索 `Editor: Default Formatter` ，设置使用 `Prettier - Code Formatter` 插件来格式化代码

### 设置 scripts

```json
// package.json
{
  "scripts": {
    "lint": "eslint ./src --ext .js,.vue --ignore-path .eslintignore"
  }
}
```

执行校验

```shell
npm run lint
```

- `./src` 指定校验目录
- `--ext` 校验指定后缀名的文件
- `--ignore-path` 跳过校验的路径，`.eslintignore` 是当前路径下的文件，可直接写入跳过校验的路径，例如

```json
// .eslintignore
src/labs
```



## 使用 husky 在 git commit 前校验

安装 `husky` 包

```shell
yarn add husky -D
```

执行以下命令会在根目录下生成 `.husky` 文件夹

```shell
npx husky install
```

然后继续执行，则会在 `pre-commit` 钩子之前会执行 `npm run lint` 的命令，此时 `.husky` 文件夹下会添加了一个 `pre-commit` 文件

```shell
npx husky add husky/pre-commit "npm run lint"
```

则在 `git commit` 前就会执行校验命令，校验不通过则不会 `commit` 代码

