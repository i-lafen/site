# Gitflow

## 介绍

gitflow 工作流测试



### 建立新的功能

1. Git 工作流 - 初始化 gitflow
2. Git 工作流 - **建立新的功能** （将在 develop 分支上新建 feature 分支）： 
   1. 创建一个新的功能分支
   2. 在新的功能分支上开发功能
   3. 暂存 - 提交
3. Git 工作流 - **完成功能**（将开发完毕的 feature 分支合并到 develop 分支）



### 建立新的发布版本

1. Git 工作流 - 建立新的发布版本（在 develop 分支上新建 release 分支）
2. Git 工作流 - 完成发布版本



### 建立新的修复补丁

1. Git 工作流 - 建立新的修复补丁
2. 完成修复补丁




### gitflow + sourceTree

#### 作用

1. 规范代码分支管理
2. 提高代码分支管理效率



#### gitflow

gitflow 是一套使用 Git 进行源代码管理时的一套行为规范，sourceTree 是简化部分 gitflow 操作的工具。

#### gitflow 常用分支

##### 主分支

核心分支，主要分为 master 和 develop 分支，不直接在主分支进行开发。

- master

  master 分支存放的是生产环境的代码

- develop

  develop 分支保存的是当前最新的开发进度，通常可用于发布

##### 辅助分支

用于实际开发与解决各种软件开发活动的分支。可用于新功能开发、辅助版本发布、生产代码缺陷的紧急修复等工作。与主分支不同的是，辅助分支通常只用于解决某些问题的有限时间内存在。

- feature 分支
  - 可以从 develop 分支发起 feature 分支
  - feature 分支必须合并回 develop 分支
  - 分支命名应避免 master、develop 等关键词，惯用 feature/xxx 命名
- release 分支
  - 可以从 develop 分支发起
  - 必须合并回 develop 分支和 master 分支
  - 分支命名惯用 release/1.0.0
- hotfix 分支
  - 从 master 分支发起
  - 必须合并回 master 分支和 develop 分支
  - 分支命名惯用 hotfix/xxx



#### sourceTree

sourceTree 是非常方便约束 gitflow 流程的工具，建议使用。





### Git commit message

git 提交信息格式采用目前主流的 Angular 规范。

commit message 格式一般包括三部分

- Header
- Body
- Footer



#### Header

> type(scope): subject

- type：用于说明 commit 的类别，规定为以下几种
  - feat： 新增功能
  - fix：修复 bug
  - docs：修改文档
  - refactor：代码重构，未新增任何功能和修复任何 bug
  - build：改变构建流程，新增依赖库、工具（例如 webpack 修改）
  - style：仅仅修改了空格、缩进等，不改变代码逻辑
  - perf：改善性能和体现的修改
  - chore：非 src 和 test 的修改
  - ci：自动化流程配置修改
  - revert：回滚到上一个版本
- scope：【可选】用于说明 commit 的影响范围
- subject：commit 的简要说明，尽量简短



#### Body

对本次 commit 的详细描述，可分多行



#### Footer

- 不兼容变动：需要描述相关信息
- 关闭指定 Issue：输入 Issue 信息
- 非必须



#### commit message 工具

[Commitizen](https://github.com/commitizen/cz-cli) 是一个主流的 Commit message 生成工具，支持 Angular 的 commit message 格式，被众多主流框架采用

```shell
npm install -g commitizen
```

安装完成后，需要在项目目录下，输入以下命令来初始化您的项目以使用 cz-conventional-changelog 适配器

```shell
commitizen init cz-conventional-changelog --save --save-exact
```

> 上述命令会干 3 件事情：
>
> - 安装 cz-conventional-changelog
> - 保存其依赖到 package.json 中
> - 添加 config.commitizen key 到 package.json 中，如下：
>
> ```json
> "config": {
>    "commitizen": {
>        "path": "./node_modules/cz-conventional-changelog"
>    }
> }
> ```


### 灵活使用

版本管理在团队开发中不可或缺，但也并非 gitflow 管理不可，应该按实际情况进行调整适配，比如：

- 并非 source tree 不可，也可以使用 git 命令行或 vscode 插件
- master 为受保护分支不可删除、推送更新，合并到 master 需提交 merge request
- 有时的测试环境资源不足，需多个功能分支合并测试的，可协定一个测试分支，如 test/qa，将功能分支合并到此分支进行测试

