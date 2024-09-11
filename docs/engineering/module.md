# 前端模块化方案

随着前端应用的功能模块越来越多，工程文件越来越多， `js` 文件之间的引用关系越来越复杂，变量冲突也越发容易，亟需模块化方案，于是有了 `IIFE`、`AMD`、`CMD`、`CommonJs`、`ES Module` 等模块化方案。

- `CommonJS` 特点是 同步加载，适合服务端实时操作环境，作为 `nodejs` 的模块化方案在服务端使用
- `AMD`、`CMD`、`ES Module` 特点是异步加载，适合浏览器异步加载服务器资源文件的需求， `ES Module` 是浏览器规范

## 闭包 + 对象

早期使用 闭包 `(IIFE)` 和 对象 的方式来达到模块化目的，

```js
// 立即执行函数 闭包
;(function() {
  const name = 'lafen'
  const age = 18
  console.log(name, age)
})()
;(function() {
  const name = 'zzz'
  const age = 20
  console.log(name, age)
})()

// 对象
const person1 = {
  name: 'lafen',
  age: 18
}
const person2 = {
  name: 'zzz',
  age: 20
}
```

- 有一定的可复用性，提升开发效率，
- 但是 需要自己构建、模块间的依赖关系需要明确导出顺序


## AMD

`AMD` 即 `Asynchronous Module Definition` （异步模块加载），代表 `require.js`

- 通过 `define` 方法将代码定义为模块
- 通过 `require` 方法实现模块加载

### require.js 简易实现

```js
const factories = {}
const define = (moduleName, factory) => {
  factories[moduleName] = factory
}
const require = (modules, callback) => {
  modules = modules.map(moduleName => {
    const factory = factories[moduleName]
    return factory()
  })
  callback(...modules)
}

// 使用
define('moduleA', function() {
  return {
    fn() {
      console.log('A')
    }
  }
})
define('moduleB', function() {
  return {
    fn() {
      console.log('B')
    }
  }
})

require(['moduleA', 'moduleB'], function(moduleA, moduleB) {
  moduleA.fn()
  moduleB.fn()
})
```

## CMD

`CMD` 即 `Common Module Definition` （通用模块加载），代表 `Sea.js`

- 与 `nodejs` 环境的 `CommonJs` 规范相比， `CMD` 是浏览器版的 `CommonJs` 规范
- 对于依赖的模块， `AMD` 是提前执行， `CMD` 是延迟执行
- `CMD` 推崇依赖就近， `AMD` 推崇依赖前置


## ES6 Module

浏览器原生模块化方案，使用方式如下

```js
// moduleA.js
const sum = (a, b) => a + b
export default {
  sum
}

// main.js
import A from './moduleA.js'
import { sum } from './moduleA.js'

A.sum(1, 2)
sum()
```

可通过在 `script` 标签上添加 `type="module"` 来告知浏览器这是个模块化文件

```html
<script src="./moduleA.js" type="module"></script>
```

另外 也可以使用别名

```html
<!-- import 路径别名 -->
<script type="importmap">
  {
    "imports": {
      "vue": "src/lib/vue.js"
    }
  }
</script>

<script type="module">
  import Vue from 'vue'
</script>
```


## CommonJs 和 ES6Module 差异

- `CommonJs` 输出的是一个值的拷贝， `ES Module` 是值的引用
- `CommonJs` 是动态加载， `ES Module` 是静态加载，编译时就确定了依赖关系，所以 `ES Module` 能够支持 `tree shaking`


## umd

一种兼容 `cjs` 与 `amd` 的模块，既可以在 `node/webpack` 环境中被 `require` 引用，也可以在浏览器中直接用 `CDN` 被 `script.src` 引入。
