# Promise.allSettled


`Promise.all` 中如何防⽌某⼀个 `promise` 失败从⽽使整个 `promise` 失败？

```js
// 假设 promise1 成功，promise2 失败
const promise1 = new Promise(resolve => setTimeout(resolve, 1000));
const promise2 = Promise.reject(200);
// 方法1: 使用 catch，catch 是 then 的语法糖，它是then(null, rejection)的别名
Promise.all([promise1.catch(() => {status: "fail"}), promise2.catch(() => {status: 'fail'})])
  .then(() => {
    console.log('已完成')
  })
  .catch(() => {
    console.log('已拒绝')
  });

// 方法2：使用 allSettled
Promise.allSettled([promise1, promise2])
  .then(() => {
    console.log('已完成')
  })
  .catch(() => {
    console.log('已拒绝')
  });
```