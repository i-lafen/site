# Promisify


## 将 callback 改造成 promise

将一些 `callback` 形式的 `api` ，改造成 `promise`。即实现一个函数，接收一个 `callback` 风格的函数作为参数，返回一个对等的 `Promise` 风格的函数。

以 `node` 的 `fs.readFile` 为例

```js
const fs = require('fs');

// 返回一个函数，函数内部调用 传入的 fn，并使用 promise 包裹
const promisify = (fn) => {
  return (path) => {
    return new Promise((resolve, reject) => {
      fn.call(null, path, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }
}

// 包装 fs.readFile
const readFilePromisify = promisify(fs.readFile);

// 通过 promise 调用包装函数
readFilePromisify('./index.md')
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.log(err);
  });

// 或通过 async/await 调用
const test = async () => {
  try {
    const data = await readFilePromisify('./index.md');
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}
test();
```


再例如 有 如下 `api`

```js
const api = (str, num, cb) => {
  console.log(str, num, cb);
  setTimeout(function() {
    const n = Math.random();
    if (n > 0.5) {
      cb('timeout-' + n, null);
    } else {
      cb(null, str + num);
    }
  }, 1000);
}
// 1、 回调形式
api('-ccc-', 200, (err, data) => {
  if (err) {
    console.log('err:', err);
  } else {
    console.log('data:', data);
  }
});

// 包装函数
const promisify = (fn) => {
  return (...rest) => {
    return new Promise((resolve, reject) => {
      fn.call(null, ...rest, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }
}
// 2、 promise 形式
const apiPromisify = promisify(api);
apiPromisify('-ppp-', 400)
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.log(err);
  });
```
