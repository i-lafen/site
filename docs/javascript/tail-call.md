# 尾调用、尾递归 优化


**尾调用** 和 **尾递归** 是非常重要的概念


## 前提：严格模式下

`ES6` 的尾调用优化只在**严格模式**下开启，正常模式是无效的。

这是因为在正常模式下，函数内部有 `2` 个变量，可以跟踪函数的调用栈。

- `arguments`：返回调用时函数的参数
- `func.caller`：返回调用当前函数的那个函数


尾调用优化发生时，函数的调用栈会改写，因此上面两个变量就会失真。严格模式**禁用**这两个变量，所以尾调用模式仅在**严格模式**下生效。


## 尾调用 Tail Call

函数的最后一步是调用另一个函数，即 **尾调用**

```js
// 1、尾调用
function f(x) {
  g(x)
}

// 2、是最后一步即可，不一定是最后一行，这个也属于尾调用
function f(x) {
  if (x > 0) {
    return m(x)
  }
  return n(x);
}
```


以下两种情况不属于尾调用

```js
// 1、 最后一步不是调用函数， 不是尾调用
function f(x){
  let y = g(x);
  return y;
}

// 2、 最后一步有调用后还有其他操作，不是尾调用
function f(x){
  return g(x) + 1;
}
```


### 尾调用优化 Tail call optimization

我们知道，函数调用会产生调用记录， `push` 入 **调用栈** 中，在函数调用完毕后，再调用栈中 `pop` 出，返回到上一个函数。

由于尾调用是函数的最后一步操作，所以不需要保留上一层函数的调用记录，因为上一层函数的调用位置、内部变量都没有再使用到了，所以上一层函数会直接出栈，让新的函数入栈。

```js
function f() {
  let m = 1;
  let n = 2;
  return g(m + n);
}
f();

// 等同于
function f() {
  return g(3);
}
f();

// 等同于
g(3);
```

上面代码中，如果函数 `g` 不是尾调用，函数 `f` 就需要保存内部变量 `m` 和 `n` 的值、 `g` 的调用位置等信息。但由于调用 `g` 之后，函数 `f` 就结束了，所以执行到最后一步，完全可以删除 `f()` 的调用记录，只保留 `g(3)` 的调用记录。

这就叫做 **尾调用优化**（`Tail call optimization`），即只保留内层函数的调用记录。如果所有函数都是尾调用，那么完全可以做到每次执行时，调用记录只有一项，这将大大节省内存。这就是 **尾调用优化** 的意义。



## 尾递归

函数调用自身为 递归，尾调用自身，则为 **尾递归**

递归非常容易消耗 调用栈，导致 **栈溢出** ，但是对于尾递归来说，调用栈中始终只有一个调用记录，所以不会出现栈溢出情况。

```js
function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}
factorial(5) // 120
```

上面代码是一个阶乘函数，计算 `n` 的阶乘，需要保存 `n` 个调用记录，复杂度 `O(n)` 。

如果改写成尾递归，只保留一个调用记录，复杂度 `O(1)` 。

```js
function factorial(n, total) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}
factorial(5, 1) // 120
```


### 尾递归函数的改写

上面的阶乘计算，调用时需要额外传入 `total` ，不太符合直觉，可继续进行以下改写

#### 提供额外函数

在尾递归函数之外，再提供一个正常形式的函数

```js
function tailFactorial(n, total) {
  if (n === 1) return total;
  return tailFactorial(n - 1, n * total);
}

function factorial(n) {
  return tailFactorial(n, 1);
}

factorial(5) // 120
```


#### ES6 参数默认值

函数参数默认值更优

```js
function factorial(n, total = 1) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}

factorial(5) // 120
```


## Finally

总结一下， 递归 本质上是一种循环操作。纯粹的函数式编程语言没有循环操作命令，所有的循环都用递归实现，这就是为什么尾递归对这些语言极其重要。只要使用递归，则应考虑使用尾递归。



## Source

[Post](https://www.ruanyifeng.com/blog/2015/04/tail-call.html)
