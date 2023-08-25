# 节流防抖


`js` 中常用的代码优化手段，相应的也可以使用 `lodash` 中提供的节流防抖函数


## 节流

限制事件触发**频率**

```js
const throttle = function(func, delay) {
  let timer = null;
  return function(...args) {
    // 一定时间内，只能触发一次
    if (!timer) {
      timer = setTimeout(function() {
        func.apply(this, args);
        timer = null;
      }, delay);
    }
  }
}
// 处理函数
function handle() {
  console.log(Math.random());
}
// 监听事件
window.addEventListener('resize', throttle(handle, 1000));
```


## 防抖

改变事件触发**时机**

```js
const debounce = function(func, delay) {
  let timer = null;
  return function(...args) {
    // 一定时间内，重复触发则取消，只触发最后一次
    if (timer) clearTimeout(timer);
    timer = setTimeout(function() {
      func.apply(this, args);
      timer = null;
    }, delay);
  }
}
function handle() {
  console.log(Math.random());
}
window.addEventListener('resize', debounce(handle, 1000));
```
