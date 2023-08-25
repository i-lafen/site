# Call、Apply、Bind


`js` 中常用于改变 `this` 指向的 `api` ， 模拟实现一下

## call

```js
Function.prototype._call = function(ctx, ...rest) {
  const context = ctx || window; // 获取指向的对象
  context.fn = this; // 获取调用者 this
  const res = context.fn(...rest); // 调用，传入参数
  delete context.fn; // 删除保存的方法
  return res; // 返回结果
}

// 示例
var a = 1; // 注意 var，不是const
function fn(str) {
  console.log(str + '-' + this.a);
}
fn('fn'); // 1 直接调用
const obj = { a: 2 };
fn.call(obj, 'call'); // 2 通过 call
fn._call(obj, '_call'); // 2 通过 _call
```

## apply

```js
Function.prototype._apply = function(ctx, args) {
  const context = ctx || window;
  context.fn = this;
  console.log('_apply: ', args);
  // 原生apply这里会将参数一一传入而不是直接传入数组 故使用展开...
  // 另一个思路是eval，eval(`context.fn(${args})`)，args会自动调用 toString
  const res = args
    ? context.fn(...args)
    : context.fn();
  delete context.fn;
  return res;
}

// 示例
var a = 1;
function fn(arr) {
  console.log(arr + '-' + this.a);
}
fn([1, 2, 3]); // 1 直接调用
const obj = { a: 2 };
fn.apply(obj, [1, 2, 3]); // 2 通过 apply，注意 apply 会将数组中元素展开成参数传入即 fn(arr[0], arr[1], arr[2])
fn._apply(obj, [1, 2, 3]); // 2 通过 _apply
```

## bind

```js
Function.prototype._bind = function(ctx, ...args) {
  const fn = this;
  return function Fn(...innerArgs) {
    console.log(...[...args, ...innerArgs]);
    return fn.apply(this instanceof Fn ? this : ctx, [...args, ...innerArgs]);
  }
}
var a = 1;
function fn(arr) {
  console.log(arr + '-' + this.a);
}
fn([1, 2, 3]);
const obj = { a: 2 };
const f1 = fn.bind(obj, [1, 2, 3]);
const f2 = fn._bind(obj, [1, 2, 3]);
f1();
f2();
```
