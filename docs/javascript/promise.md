# Promise 手写简单版


```js
class _Promise {
  constructor(executor) {
    this.state = 'pending';

    this.value = undefined;
    this.reason = undefined;
    
    this.resolveCallbackList = [];
    this.rejectCallbackList = [];

    const resolve = (val) => {
      if(this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = val;
        this.resolveCallbackList.forEach(fn => fn());
      }
    }

    const reject = (val) => {
      if(this.state === 'pending') {
        this.state = 'rejected';
        this.reason = val;
        this.rejectCallbackList.forEach(fn => fn());
      }
    }

    try {
      executor(resolve, reject);
    } catch(err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    if (this.state === 'fulfilled') {
      onFulfilled(this.value);
    }
    if (this.state === 'rejected') {
      onRejected(this.reason);
    }
    if (this.state === 'pending') {
      this.resolveCallbackList.push(() => {
        onFulfilled(this.value);
      });
      this.rejectCallbackList.push(() => {
        onRejected(this.reason);
      });
    }
  }

  catch(errCallbak) {
    return this.then(null, errCallbak);
  }

  static resolve(val) {
    return new _Promise((r) => {
      r(val);
    });
  }

  static reject(val) {
    return new _Promise((r, j) => {
      j(val);
    });
  }
}

// 示例
new _Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(200);
  }, 1000);
  console.log(111);
})
.then((val) => {
  console.log('then: ', val);
})
```
