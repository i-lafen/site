# Event Loop

## 概念

`JavaScript`是一门**单线程**语言，同一时间内只能处理一件事情。



## JavaScript 事件循环

既然`js`是单线程，处理任务是顺序执行的，那如果要处理的任务多了，就需要排队了，万一某一个任务一直没有处理完，那后面的任务就会一直堵塞，故任务需要区分为**同步任务**和**异步任务**


![eventtask.png](./images/task.png)


图中表示的意思是：

- `js`在执行任务的时候，将区分**同步任务**和**异步任务**，同步任务进入主线程执行，异步任务进入`Event Table`，并**注册**回调函数
- 当指定的事情完成时，`Event Table`会将这个回调函数移入`Event Queue`
- 主线程内的任务执行完毕为**空**时，会去`Event Queue`读取对应的回调函数进入主线程执行
- 然后不断**重复**上述过程，也就是常说的`Event Loop`（**事件循环**）

**注**：`js`引擎存在`monitoring process`进程，会持续不断检查主线程执行栈是否为空，一旦为空，就会去`Event Queue`那里检查是否有等待被调用的函数



**简单示例**

```js
var data = []
$.ajax({
	url: 'www.js.com',
    data: data,
    success: function() {
    	console.log('请求成功')
	}
})
console.log('结束')
```

以上是一段简易的`ajax`请求代码，看看`js`是如何执行的

- `ajax`进入`Event Table`，并**注册**回调函数`success`
- 执行`console.log`('结束')
- `ajax`事件完成，回调函数`success`进入`Event Queue`
- 主线程从`Event Queue`中读取回调函数`success`并执行

原来`ajax`请求干了这么多事情0.0...



## setTimeout

常用于模拟耗时操作的`setTimeout`，有时也并不是很精准，写的延时`1000ms`执行，但是有时候却可能有些差别，先看以下实例

```js
var start = Date.now()
setTimeout(function() {
  var end = Date.now()
  console.log('延时1秒后执行', end - start)
}, 1000)
console.log('我先执行')
```

我们都知道，以上代码打印顺序如下

```js
// 我先执行
// '延时1秒后执行' 1000
```

看起来貌似没什么毛病，但是运行多几次就会发现，`1000`并不一直是`1000`，还可能会是`1001、1002`...



假如主线程中存在非常**耗时**的操作，例如以下伪代码：

```js
setTimeout(function() {
  task()
}, 1000)
sleep(10000) // 假如这是一个非常耗时的函数
```

此时，`setTimeout`的延时`1000ms`执行，就差别很多了，先看看是怎么执行的

- `js`执行过程中遇到`setTimeout`，首先将`task()`放入`Event Table`并注册，计时开始
- 往下执行遇到`sleep`函数，但是`sleep`函数执行得很慢，计时还在继续
- 1秒到了，计时事件`setTimeout`完成，`task()`进入`Event Queue`，但是`sleep`函数还在占用主线程，还没执行完，只能继续等待
- `sleep`函数终于执行完毕，`task()`终于从`Event Queue`进入主线程执行



现在我们知道此时的`setTimeout`的含义是：

```js
在1秒之后，需要把task()加入到Event Queue中,
等待主线程空闲时进入主线程执行,
但是当主线程正在处理耗时操作时，那就只能等着,
从而导致了延迟的时间远超过了1秒
```



那我们经常遇到的`setTimeout(fn, 0)`，是不是就会立即执行呢？

```js
答案是不会的，fn依然会进入Event Queue中等待主线程空闲之后才能进入主线程执行
```

如果主线程为空时，会达到0秒后执行吗？

```js
实际上也不会，根据HTML的标准，最低是4ms，可运行尝试

var start = Date.now()
setTimeout(function() {
  var end = Date.now()
  console.log('延时0秒？', end - start)
}, 0)
```



## setInterval

与`setTimeout`相似，`setInterval`是**每隔指定时间**会将回调函数放入`EventQueue`中，如果主线程在忙，也同样需要等待。

值得注意的是，放入`Event Queue`的时间间隔是指定的，但是如果主线程耗时操作大于或等于这个时间间隔，那就完全看不出有时间间隔执行了，伪代码示例如下：

```js
setInterval(fn, 1000) // 每间隔1000ms将回调fn置入Event Queue
sleep(1000) // 假如这个函数将耗时1000ms，以上的间隔1000ms执行则看不出是有间隔的执行了
```



## Promise 与 process.nextTick(callback)

`Promise`的定义和功能不再赘述，不了解的读者可以学习一下阮一峰老师的[Promise](https://link.juejin.im/?target=http%3A%2F%2Fes6.ruanyifeng.com%2F%23docs%2Fpromise)

而`process.nextTick(callback)`类似node.js版的"`setTimeout`"，在事件循环的下一次循环中调用 `callback` 回调函数。

除了**同步任务**和**异步任务**，我们需要对任务有更精细的定义：

- `macro-task`(**宏任务**)：包含整体代码`script`、`setTimeout`、`setInterval`
- `micro-task`(**微任务**)：`Promise`、`process.nextTick`

**宏任务**和**微任务**会进入**不同**的`Event Queue`，`js`在执行过程中，进入**整体代码（宏任务）**，开始第一次循环，接着执行**所有微任务**，然后再次从宏任务开始执行任务队列，完毕之后再次执行所有微任务，依次循环

先看以下代码：

```js
setTimeout(function() {
  console.log('setTimeout')
}, 0)

new Promise(function(resolve) {
  console.log('promise')
  resolve()
}).then(function() {
  console.log('then')
})

console.log('console')
```

- 整体代码作为**宏任务**，进入主线程
- 先遇到`setTimeout`，将其回调函数注册后分发到**宏任务**`Event Queue`
- 然后遇到`new Promise`，立即执行其中的函数打印出`promise`，`then`函数则分发到**微任务**`Event Queue`
- 往下遇到`console.log()`，直接打印出`console`
- 此时整体代码作为**第一个宏任务执行结束**，首先看看有哪些微任务？此时**微任务**`Event Queue`中发现了`then`，取出执行，打印出`then`
- 第一轮事件循环结束，开始第二轮循环，从宏任务`Event Queue`开始，此时发现宏任务`Event Queue`中有`setTimeout`对应的回调函数，立即执行
- 结束



**事件循环、宏任务、微任务**关系图如下：

![eventloop.png](./images/loop.png)



## 经典示例

检验是否掌握了`js`执行机制，看以下代码

```js
console.log('1');

setTimeout(function() {
  console.log('2');
  process.nextTick(function() {
    console.log('3');
  })
  new Promise(function(resolve) {
    console.log('4');
    resolve();
  }).then(function() {
    console.log('5')
  })
})
process.nextTick(function() {
  console.log('6');
})
new Promise(function(resolve) {
  console.log('7');
  resolve();
}).then(function() {
  console.log('8')
})

setTimeout(function() {
  console.log('9');
  process.nextTick(function() {
    console.log('10');
  })
  new Promise(function(resolve) {
    console.log('11');
    resolve();
  }).then(function() {
    console.log('12')
  })
})
```



### **详细分析**

**第一轮**

- 整体代码作为**宏任务**进入主线程执行

- 首先遇到`console.log('1')`，直接打印，***此时控制台输出*** *1*

| 宏任务`Event Queue`  | 微任务`Event Queue`  |   控制台`console`    |
| :-----------------: | :-----------------: | :-----------------: |
|          -          |          -          |          *1*          |

  

- 往下遇到`setTimeout`，没有设置延迟时间，则默认为`0`，将其**回调函数**注册到`Event Table`后立即分发至**宏任务**`Event Queue`，至于回调函数中有什么，先不管，因为要等待主线程空闲了才能进入主线程去执行，此时的任务队列里面是这样的

| 宏任务`Event Queue`  | 微任务`Event Queue`  |   控制台`console`    |
| :-----------------: | :-----------------: | :-----------------: |
|   1. `setTimeout`   |          -          |          *1*          |



- 再往下遇到`process.nextTick`，将其注册后分发至**微任务**`Event Queue`，此时

| 宏任务`Event Queue`  |  微任务`Event Queue`   |   控制台`console`    |
| :-----------------: | :-------------------: | :-----------------: |
|   1. `setTimeout`   | 1. `process.nextTick` |         *1*         |




- 然后往下遇到`new Promise`，直接执行里面代码打印，***此时控制台输出*** *7*，再调用`resolve()`，将`then`分发至**微任务**`Event Queue`中。此时**微任务**`Event Queue`中包含： `process.nextTick`和`then`的回调

| 宏任务`Event Queue`  |  微任务`Event Queue`   |   控制台`console`    |
| :-----------------: | :-------------------: | :-----------------: |
|   1. `setTimeout`   | 1. `process.nextTick` |       *1 7*         |
|          -          | 2.       `then`       |                     |




- 最后遇到`setTimeout`，同样没有设置延迟时间，则默认为`0`，将其回调立即分发至**宏任务**`Event Queue`，里面有什么，先不管，还没到他执行，注意区别于前一个`setTimeout`

| 宏任务`Event Queue`  |  微任务`Event Queue`   |   控制台`console`    |
| :-----------------: | :-------------------: | :-----------------: |
|   1. `setTimeout`   | 1. `process.nextTick` |        *1 7*        |
|   2. `setTimeout`   | 2.       `then`       |                     |

  

- 至此，整体代码作为**宏任务**执行完毕，主线程此时空闲了，就会去看看**微任务**`Event Queue`中是否有任务，如果有，则将其执行**清空**，此时发现**微任务**`Event Queue`中包含两个任务，则依次将`process.nextTick`与`then`添加至主线程执行：

  先执行`process.nextTick`的回调，***此时控制台输出*** *6*，然后执行`then`，此时***此时控制台输出*** *8*
  
| 宏任务`Event Queue`  |  微任务`Event Queue`   |   控制台`console`    |
| :-----------------: | :-------------------: | :-----------------: |
|   1. `setTimeout`   |                       |    *1 7 6 8*        |
|   2. `setTimeout`   |                       |                     |



- 清空完**微任务**`Event Queue`后，至此，**一轮事件循环已结束**，主线程立即进入**下一轮事件循环**，下一轮的事件循环，依旧采用这样的思路进行分析



**第二轮**

- 主线程将**宏任务**`Evenet Queue`中的第一个`setTimeout`**回调**取出执行，首先遇到`console.log('2')`，直接打印，***此时控制台输出*** *2*

- 往下遇到`process.nextTick`，将其分发至**微任务**`Event Queue`等待

- 往下遇到`new Promise`，直接执行其中代码，先打印 *4*，***此时控制台输出*** *4*，然后执行`resolve()`，将`then`分发至**微任务**`Event Queue`

- 至此，第二轮事件循环中的**宏任务**执行完毕，现在看看任务队列中都有些什么

| 宏任务`Event Queue`  |  微任务`Event Queue`   |   控制台`console`    |
| :-----------------: | :-------------------: | :-----------------: |
|   2. `setTimeout`   | 1. `process.nextTick` |    *1 7 6 8 2 4*    |
|                     | 2. `then`             |                     |



- 此时主线程发现**微任务**`Event Queue`中又有两个任务可执行，然后又依次调用执行并将其清空，首先执行`process.nextTick`，打印出 *3*，***此时控制台输出*** *3*

- 然后执行`then`，打印出 *5*，***此时控制台输出*** *5*

- **微任务**`Event Queue`执行完毕，**第二轮事件循环正式结束**，此时任务队列如下

| 宏任务`Event Queue`  |  微任务`Event Queue`   |   控制台`console`    |
| :-----------------: | :-------------------: | :-----------------: |
|   2. `setTimeout`   |                       |  *1 7 6 8 2 4 3 5*  |
|                     |                       |                     |



**第三轮**

- 主线程再次将**宏任务**`Event Queue`中的第二个`setTimeout`取出执行，首先就遇到了打印 *9*，***此时控制台输出*** *9*

- 往下执行遇到`process.nextTick`，分发至**微任务**`Event Queue`中等待

- 再往下遇到`new Promise`，执行其中代码，打印出 *11*，***此时控制台输出*** *11*，执行`resolve()`，将`then`分发至**微任务**`Event Queue`，**宏任务**执行完毕，此时的任务队列如下

| 宏任务`Event Queue`  |  微任务`Event Queue`   |   控制台`console`    |
| :-----------------: | :-------------------: | :-----------------: |
|                     | 1. `process.nextTick` |*1 7 6 8 2 4 3 5 9 11*|
|                     |   2. `then`           |                     |



- 此时主线程发现**微任务**`Event Queue`中又有任务，于是有依次去取其中的任务到主线程上执行，首先执行`process.nextTick`，打印出 *10*，***此时控制台输出*** *10*，然后执行`then`，打印出 *12*，***此时控制台输出*** *12*

- 至此第三轮事件循环也已结束，此时的宏任务Event Queue与微任务Event Queue中都已清空，此时控制台已打印出全部

| 宏任务`Event Queue`  |  微任务`Event Queue`   |   控制台`console`    |
| :-----------------: | :-------------------: | :-----------------: |
|                     |                 |*1 7 6 8 2 4 3 5 9 11 10 12*|
|                     |                       |                     |



整段代码，进行了三次事件循环，才执行完毕，打印输出的顺序跟代码顺序毫无相干，可见：理解其中的事件循环机制多么的重要。

(请注意，`node`环境下的事件监听依赖`libuv`与前端环境不完全相同，输出顺序可能会有误差)



## Finally

- **javascript是一门单线程语言**，不管是什么新框架新语法糖实现的所谓异步，其实都是用同步的方法去模拟的
- 事件循环`Event Loop`是`js`实现异步的一种方法，也是`js`的**执行机制**
- 微任务和宏任务还有很多种类，比如`setImmediate`等等，执行都是有共同点的


## Source

[Post](https://juejin.im/post/59e85eebf265da430d571f89)
