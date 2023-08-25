# Gulp 自动化构建工具

### 前言

前端构建工具 `gulp` 的学习，本文由网络文章以及教程资料整理

### gulp 介绍

在前后端分离的模式中， `node` 充当的是**自动化构建工具**

常见的自动化构建工具

- grunt
- gulp
- webpack

而这篇主要记录的是 `gulp` ，没错，因为 `gulp` 相对来说，比较简单（菜鸡狗头保命）

[gulp](https://www.gulpjs.com.cn/) 是一个基于流的自动化构建工具。他可以监听项目文件、读写文件，管理和执行任务（`Task`）。掌握 `gulp` 的几个关键 `API` 就可以完成你的大部分构建需求

- `gulp.task` 注册一个任务
- `gulp.src` 以文件流的形式获取文件
- `gulp.dest` 保存文件到具体地址
- `gulp.run` 执行任务
- `gulp.series` 让任务按顺序执行
- `gulp.watch` 监控文件改动

`gulp` 最大的特点是引入**流**的概念，同时提供一系列常用的插件去处理流，流可以在插件之间传递

`gulp` 的 `API` 简单，使用起来非常容易，但同时对于复杂应用同样存在缺点，就是需要写非常多的复杂配置。接下来就看看如何使用  `gulp` 的这几个 `API`，还有哪些插件可以使用



### gulp 安装使用

#### 1. 全局安装 gulp

```shell
npm install -g gulp
```

#### 2. 作为项目开发依赖（DevDependencies）安装

```shell
npm install -D gulp
```

#### 3. gulpfile.js

在项目根目录文件夹下创建 `gulpfile.js` 文件

```js
const gulp = require(gulp);
// 创建一个默认任务
gulp.task('default', function() {
  // 任务代码
})
```

#### 4. 运行 gulp

项目根目录下 cmd 执行 gulp 

```shell
gulp
```

默认的名为 `default` 的任务（`task`） 将会被运行，想要单独运行特定的任务，可在定义任务 （`task`） 后，输入执行 `gulp <task> <othertask>`

```shell
gulp task1 task2
```



### gulp 核心 api

#### 1. task([taskName], taskFunction)

定义任务，gulp 的执行由一个个单独的任务组成的

- `taskName` 任务名称
- `taskFunction` 任务具体的执行函数

在 `gulpfile.js` 中

```js
const gulp = require('gulp');
// 定义名为 hello 的任务
gulp.task('hello', () => {
  console.log('hello gulp!')
})
```

在 `cmd` 窗口中执行 `hello` 任务

```js
gulp hello
```

> gulp -f gulpfile2.js hello 可运行指定的 gulp 文件和任务



**注意**

`gulp 4.0` 版本 要求在任务内，返回一个 `promise`对象，需要对齐手动关闭，否则任务不会关闭，可通过以下方式将其关闭

```js
const gulp = require("gulp");

// 1 方式1
gulp.task("hello", done => {
  console.log("hello gulp!");
  // 任务执行完毕之后，需要手动调用done来结束任务
  done();
});

// 2 方式2 返回一个promise对象
gulp.task("hello1", () => {
  return new Promise((resolve, reject) => {
    console.log("hello gulp");
    resolve();
  });
});
// 3 方式3 返回 gulp的strem流
gulp.task("copy", () => {
  return (
    gulp
      .src("src/index.html")
      .pipe(gulp.dest("dist/"))
  );
});
```



#### 2. src(globs, [options]) 和 dest(directory, [options])

`src` 获取文件，以文件流的形式

- `globs` 获取文件的正则写法
- `options` 配置信息，可选

`dest` 保存文件流到具体的地址上

- `directory` 保存的目标地址
- `options` 配置信息，可选

在 `gulpfile.js` 中编写任务

```js
const gulp = require("gulp");
// 编写一个拷贝任务
gulp.task("copy", () => {
  // 1  获取根目录下的src下的一个文件index.html
  return (
    gulp
      .src("src/index.html")
      // 2.1 pipe是gulp内置的管道处理函数，固定写法 可以处理gulp.src内的文件流
      // 2.2 dest 复制到dist目录下
      .pipe(gulp.dest("dist/"))
  );
});
```

以上任务会获取 `src` 文件夹下的 `index.html` 文件，将其通过 `pipe` 复制到 `dist/` 文件夹下

- `pipe` 是 `gulp` 内置的管道处理函数，可处理 `gulp.src` 内的文件流
- `return` 一个文件流表示结束该任务

在 `cmd` 中执行 `copy` 任务

```shell
gulp copy
```



#### 3. series(...tasks)

`gulp` 任务不会按照顺序执行的，需要使用 `series` 来指定执行顺序

```js
const gulp = require("gulp");

// 1  定义任务 
gulp.task("hello1", done => {
  console.log("hello1");
  done();
});

// 2 定义任务 
gulp.task("hello2", done=> {
  console.log("hello2");
  done();
});

// 3  按顺序执行任务 
gulp.task("sequence",gulp.series([
  'hello1',
  'hello2',
]))
```



#### 4. watch(globs, [options], [task])

监控文件的改动，进而触发对应的任务，如 sass 文件改动，触发自动编译

- `globs` 获取文件的正则写法
- `options` 配置信息，可选
- `task` 文件发生改动后执行的任务，可选

**watcher.on(eventName, eventHandler)**

`watcher` 指的是 `watch` 函数的返回值，它可以继续绑定对应的事件，进而触发后续的逻辑

`eventName` 支持的事件名称

- `add`
- `addDir`
- `change`
- `unlink`
- `unlinkDir`
- `ready`
- `error`
- `all`

`eventHandler` 事件的执行函数



### gulp 常用插件

[gulp插件网](https://gulpjs.com/plugins/)

#### 1. [del(patterns, [options])](https://www.npmjs.com/package/del)

- `patterns` 使用正则或数组来匹配要删除的源文件
- `options` 配置信息，可选

1. 安装

```shell
npm install del -D
```

2. 编写删除任务

```js
const gulp = require("gulp");
const del = require("del");

// 编写删除任务 任务名为del
gulp.task("del", () => {
  // 删除目录下名字为dist的文件夹
  return del(["dist"]);
});
```

3. 执行任务

```shell
gulp del
```



#### 2. [gulp-sass](https://www.npmjs.com/package/gulp-sass) 和 [node-sass](https://www.npmjs.com/package/node-sass)

`gulp-sass` 和 `node-sass` 是用来将 `sass` 文件编译成 `css` 文件

1. 安装

```shell
npm install node-sass gulp-sass -D
```

2. 编写任务

```js
const gulp = require("gulp");
const sass = require("gulp-sass");
// 将 node-sass导出为 sass的编译器 compiler 使用sass就可以直接编译css
sass.compiler = require("node-sass");

gulp.task("css", () => {
  return gulp
    .src("src/css/*.scss")
    // 执行编译
    .pipe(sass())
    .pipe(gulp.dest("dist/css/"));
});
```

3. 执行

```shell
gulp css
```



#### 3. [gulp-autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer)

自动添加浏览器前缀

1. 安装

```shell
npm i gulp-autoprefixer -D
```

2. 编写任务

```js
const gulp = require("gulp");
const sass = require("gulp-sass");
sass.compiler = require("node-sass");
// 1 引入自动添加浏览器前缀的文件
const autoprefixer = require("gulp-autoprefixer");

gulp.task("css", () => {
  return gulp
    .src("src/css/*.scss")
    .pipe(sass())
    .pipe(
      // 2 添加最新的各大主流浏览器的两个版本的兼容性前缀
      autoprefixer({
        browsers: ["last 2 versions"]
      })
    )
    .pipe(gulp.dest("dist/css/"));
});
```

3. 执行任务

```shell
gulp css
```



#### 4. [gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps)

提供编译前的 `sass` 文件到编译后的 `css` 文件的映射，生成 `map` 文件。

1. 安装

```shell
npm i gulp-sourcemaps -D
```

2. 编写任务

```js
const gulp = require("gulp");
const sass = require("gulp-sass");
sass.compiler = require("node-sass");
const autoprefixer = require("gulp-autoprefixer");
// 1 引入包 
const sourcemaps = require("gulp-sourcemaps");

gulp.task("css", () => {
  return gulp
    .src("src/css/*.scss")
    // 2 获取到源文件后先记录以下
    .pipe(sourcemaps.init())
    // 3 编译sass文件
    .pipe(sass())
    // 4 添加兼容性前缀
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"]
      })
    )
    // 5 在css文件夹内生成map文件
    .pipe(sourcemaps.write("."))
    // 6 将map文件和sass文件一起放入到对应的目录下
    .pipe(gulp.dest("dist/css/"));
});
```

3. 执行任务

```shell
gulp css
```



#### 5. [gulp-babel](https://www.npmjs.com/package/gulp-babel)

`babel` 是一个专门处理 `js` 编译的库，如将 `es6` 编译成 `es5` 等

1. 安装

```shell
npm i gulp-babel @babel/core @babel/preset-env -D
```

2. 编写任务

```js
const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
// 1 导入babel包
const babel = require("gulp-babel");

gulp.task("js", () => {
  return gulp
    .src("src/js/*.js")
    // 2 记录编译前的 es6的js
    .pipe(sourcemaps.init())
    // 3 使用babel进行编译
    .pipe(babel())
    // 4 js 生成js的map文件
    .pipe(sourcemaps.write("."))
    // 5 存放到对应的地址
    .pipe(gulp.dest("dist/js/"));
});
```

3. 执行任务

```shell
gulp js
```



如果需要将 `es7` 或者 `es8` 编译为 `es6` 或者 `es5` 呢

在根目录下新建文件 `.babelrc` 对齐进行配置

```js
{
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "browsers": ["last 2 years"]
      }
    }]
  ]
}
```

`presets` 为预设的意思，它的值可以进行扩展配置，`"@babel/preset-env"` 是一个模块，里面默认包含了 将 `es6 => es5` 的设定，后期需要增加不同的版本的编译时，只要拓展该字段即可。

以上用法为`babel` 最常见的使用方式



#### 6. [gulp-file-include](https://www.npmjs.com/package/gulp-file-include)

提供了文件合并的功能，可以理解为 类似 `gulp` 中的渲染模板插件，可以实现前端标签的组件化，如 `header.html` 组件，`nav.html` 组件等

1. 安装

```shell
npm install gulp-file-include -D
```

2. 编写任务

```js
const gulp = require("gulp");
// 1 导入包
const fileInclude = require("gulp-file-include");

gulp.task("html", () => {
  return gulp
  // 2 获取页面文件
    .src("src/index.html")
    .pipe(
      // 3  加载模版文件
      fileInclude({
        // 3.1 模版语法的识别符号
        prefix: "@@",
        // 3.2 定义组件路径
        basepath: "src/components/",
        // 3.3 context为关键字，内部的变量是组件内部可以使用的变量
        context: {
          // 3.4 定义整个项目的变量 名为 title 值为 "我们的页面"
          title: "我们的页面"
        }
      })
    )
    // 4 合并成功后，将html文件放置到dist文件夹下
    .pipe(gulp.dest("dist/"));
});
```

3. 执行任务

```shell
gulp html
```



**组件 `header.html`**

在 `src/components/` 内，新增组件文件 名为 header.html,输入内容

```html
<h1>公共的头部</h1>
<h2>gulpflie.js文件的html任务 中定义的变量 @@page</h2>
<h2>index.html文件中传入的变量名 @@title</h2>
```

**页面 `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    @@include("header.html",{"page":"index"})
  </body>
</html>
```



#### 7. [browser-sync](https://browsersync.io/)

实现编辑文件时，浏览器自动刷新，提高编码效率

1. 安装

```shell
npm install browser-sync -D
```

2. 编写任务

```js
const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
// 1 引入文件
const browserSync = require("browser-sync");

// 2 编写编译html的任务
gulp.task("html", () => {
  return gulp
    .src("src/index.html")
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "src/components/",
        context: {
          baseSrc: "."
        }
      })
    )
    .pipe(gulp.dest("dist/"));
});

// 3 开启服务器和动态更新的任务
gulp.task("serve", () => {
  browserSync({
    // 3.1 开启本地服务器
    server: {
      // 3.2 网站的路径
      baseDir: "dist",
      // 3.3 端口
      port: 8080
    },
    // 3.4 关闭浏览器右上方的黑色的提示框
    notify: false
  });
  // 4 使用watch开监控页面的变化 发生变化之后  先执行重新编译html任务，然后执行刷新浏览器页面任务reload
  gulp.watch("src/**/*.html", gulp.series(["html", "reload"]));
});

// 5 刷新页面
gulp.task("reload", done => {
  browserSync.reload();
  done();
});
```

3. 执行任务

```shell
gulp serve
```



#### 8. [gulp-uglify](https://www.npmjs.com/package/gulp-uglify)

网站发布上线了需要将 开发环境中的 `js`，丑化 ，变成 人眼不怎么容易看懂的版本，提高安全性。如去掉注释，修改变量名，函数名等等。

1. 安装

```shell
npm install gulp-uglify -D
```

2. 编写任务

```js
const gulp = require("gulp");
const del = require("del");
const uglify = require("gulp-uglify");
// 1 引入包
const babel = require("gulp-babel");
// 1 引入包

gulp.task("js", () => {
  return (
    gulp
      .src("src/js/*.js")
      // 2 先使用babel将 js 编译为 es5
      .pipe(babel())
      .pipe(
        // 3 执行函数
        uglify({
          // 3.1 丑化的等级
          mangle: {
            // 3.1.1 最高级
            toplevel: true
          }
        })
      )
      .pipe(gulp.dest("./dist/js/"))
  );
});
```

3. 执行任务

```shell
gulp js
```



#### 9. [gulp-rev](https://www.npmjs.com/package/gulp-rev) 和 [gulp-rev-collector](https://www.npmjs.com/package/gulp-rev-collector)

一般的浏览器容易对前端的静态资源进行缓存，如 `index.js` `index.css`等。有时候 网站升级了，想让用户使用最新版本的`js`和`css`。 此时，可以在对应的静态资源上添加特定的字符，如 `index2233355.js` `index20190108233410.css`等。这个工作可以交由  **gulp-rev**和 **gulp-rev-collector** 完成

- **gulp-rev** 负责 给静态资源添加唯一后缀，俗称指纹。
- **gulp-rev-collector** 负责将 html中的 引用路径(`index.css`) 改为(`index392938098094.css`)

1. 安装

```shell
npm install  gulp-rev gulp-rev-collector  -D
```

2. 编写任务

```js
const gulp = require("gulp");
const babel = require("gulp-babel");
const sass = require("gulp-sass");
sass.compiler = require("node-sass");
// 1 引入包
const rev = require("gulp-rev");
// 1 引入包

const revCollector = require("gulp-rev-collector");

// 2 处理sass
gulp.task("css", () => {
  return (
    gulp
      .src("src/css/*.scss")
      .pipe(sass())
      // 2.1 给css文件添加指纹
      .pipe(rev())
      //  2.2 存放css
      .pipe(gulp.dest("./dist/css/"))
      //  3 将 css文件和css指纹文件的映射关系写到文件中
      .pipe(
        rev.manifest({
          path: "rev-css-mainfest.json"
        })
      )
      //  4 存入起来，给后面html修改引用使用
      .pipe(gulp.dest("./src/rev/"))
  );
});
//  2 处理js
gulp.task("js", () => {
  return (
    gulp
      .src("src/js/*.js")
      .pipe(babel())
      //  2.1 给js文件添加指纹
      .pipe(rev())
      //  2.2 存放js文件
      .pipe(gulp.dest("./dist/js/"))
      //  3  将 js文件和js指纹文件的映射关系写到文件中
      .pipe(
        rev.manifest({
          path: "rev-js-mainfest.json"
        })
      )
      //  4 存入起来，给后面html修改引用使用
      .pipe(gulp.dest("./src/rev/"))
  );
});

// 3 处理html
gulp.task("html", () => {
  return (
    gulp
      //  3.1 获取标签文件 和 指纹映射文件
      .src(["src/index.html", "./src/rev/*.json"])
      //  3.2 开始修改html中的文件引用
      .pipe(revCollector())
      //   3.3 存放我们的页面文件
      .pipe(gulp.dest("dist/"))
  );
});

// 4 按顺序执行
gulp.task("default", gulp.series(["css", "js", "html"]));
```

3. 执行任务

```shell
gulp
```



### 开发环境下需要处理的任务

1. 编译 `sass` 文件
2. 给 `css` 文件添加浏览器前缀
3. 给 `css` 文件和 `js` 文件添加 `map` 文件映射
4. 编译 `js` 文件
5. 实现 `html` 标签组件
6. 浏览器自动刷新

### 生产环境下需要处理的任务

1. 编译 `sass` 文件
2. 给 `css` 文件添加浏览器前缀
3. 压缩和丑化 `css` 文件
4. 编译 `js` 文件
5. 压缩和丑化 `js` 文件
6. 实现 `html` 标签组件
7. 给资源文件添加指纹





### 开发环境相应配置

```js
const del = require("del");
const gulp = require("gulp");
const sass = require("gulp-sass");
sass.compiler = require("node-sass");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const fileInclude = require("gulp-file-include");
const browserSync = require("browser-sync");
gulp.task("del", () => {
  return del(["dist"]);
});
gulp.task("css", () => {
  return gulp
    .src("src/css/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"]
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/css/"));
});
gulp.task("js", () => {
  return gulp
    .src("src/js/*.js")
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/js/"));
});
gulp.task("copy", () => {
  gulp.src("src/lib/**").pipe(gulp.dest("dist/lib/"));
  return gulp.src("src/static/**").pipe(gulp.dest("dist/static/"));
});

gulp.task("html", () => {
  gulp
    .src("src/index.html")
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "src/components/",
        context: {
          baseSrc: "."
        }
      })
    )
    .pipe(gulp.dest("dist/"));
  return gulp
    .src("src/pages/*.html")
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "src/components/",
        context: {
          baseSrc: "."
        }
      })
    )
    .pipe(gulp.dest("dist/pages/"));
});
gulp.task("serve", () => {
  browserSync({
    server: {
      baseDir: "dist",
      port: 8080
    },
    notify: false
  });
  gulp.watch("src/css/*.scss", gulp.series(["css", "reload"]));
  gulp.watch("src/**/*.html", gulp.series(["html", "reload"]));
  gulp.watch("src/js/*.js", gulp.series(["js", "reload"]));
  gulp.watch(["src/lib/**", "src/static/**"], gulp.series(["copy", "reload"]));
});

gulp.task("reload", done => {
  browserSync.reload();
  done();
});
gulp.task(
  "default",
  gulp.series(["del", "css", "js", "copy", "html", "serve"])
);
```





### 生产环境相应配置

```js
const del = require('del');
const gulp = require('gulp');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const fileInclude = require("gulp-file-include");
const rev = require("gulp-rev");
const revCollector = require("gulp-rev-collector");


gulp.task("del", () => {
  return del(['dist']);
});
gulp.task("css", () => {
  return gulp.src('src/css/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(rev())
    .pipe(gulp.dest("./dist/css/"))
    .pipe(rev.manifest({
      path: "rev-css-mainfest.json"
    }))
    .pipe(gulp.dest("./src/rev/"));
});
gulp.task('js', () => {
  return gulp.src('src/js/*.js')
    .pipe(babel())
    .pipe(uglify(
      { mangle: {
        toplevel: true
      }}
    ))
    .pipe(rev())
    .pipe(gulp.dest("./dist/js/"))
    .pipe(rev.manifest({
      path: "rev-js-mainfest.json"
    }))
    .pipe(gulp.dest("./src/rev/"));
});
gulp.task("copy", () => {
  gulp.src("src/lib/**")
    .pipe(gulp.dest("dist/lib/"));
  return gulp.src("src/static/**")
    .pipe(gulp.dest("dist/static/"));
});

gulp.task("html", () => {
  gulp.src(['src/index.html','./src/rev/*.json'])
    .pipe(fileInclude({
      prefix: '@@',
      basepath: 'src/components/',
      context: {
        baseSrc: "."
      }
    }))
    .pipe(revCollector())
    .pipe(gulp.dest('dist/'));

  return gulp.src(['src/pages/*.html','./src/rev/*.json'])
    .pipe(fileInclude({
      prefix: '@@',
      basepath: 'src/components/',
      context: {
        baseSrc: ".."
      }
    }))
    .pipe(revCollector())
    .pipe(gulp.dest('dist/pages/'));
});

gulp.task("default", gulp.series([
  'del',
  'css',
  'js',
  'copy',
  'html'
]));
```





### 参考

[常见构建工具及对比](https://webpack.wuhaolin.cn/1入门/1-2常见的构建工具及对比.html)