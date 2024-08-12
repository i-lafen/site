# JS 异步并发数控制与大文件上传


## js 异步并发数控制1

```js
// 简易并发池
class TaskPool {
  // 限制最大并发数
  max = 0
  // 当前正在执行的异步任务数
  cur = 0
  // 任务队列
  tasks = []
  constructor(num = 3) {
    this.max = num
  }
  // 添加任务并执行
  add(task) {
    this.tasks.push(task)
    this.run()
  }
  // 执行
  run() {
    // 判断当前正在执行的任务数 以及 剩余任务数，取出任务执行
    while (this.cur < this.max && this.tasks.length) {
      const task = this.tasks.shift()
      this.cur++
      task()
        .then(res => console.log(res))
        .finally(() => { 
          this.cur--
          this.run()
        })
    }
  }
}

// 新建实例
const taskpool = new TaskPool(3)

// 生成异步任务
for (let i = 0; i < 10; i++) {
  const task = () => new Promise(resolve => {
    setTimeout(() => {
      console.log(`task-${i}-resolve`);
      resolve(`task-${i}`)
    }, 1000)
  })

  // 进入并发池执行
  taskpool.add(task)
}
```


## js 请求并发数控制2

```js
// 模拟 api
const mockApi = (i = 0) => {
  return new Promise((resolve, reject) => {
    const time = Math.floor(1000 * Math.random());
    setTimeout(() => {
      time > 500 ? resolve(`api-resolve-${i}-${time}`) : reject(`api-reject-${i}-${time}`);
    }, time);
  });
};
// 模拟异步任务数组
const apiArr = Array.from({ length: 10 }).map(() => (async (i) => await mockApi(i)));

// task
class Task {
  // 最大并发数
  max = 0;
  // 指针，指向下一个请求
  index = 0;
  // 完成数
  count = 0;
  // 异步任务
  taskArr = [];
  // 结果
  results = [];
  // 进行中
  isRunning = true;
  // promise.resolve 函数
  resolvePromise = null;
  // pending 状态的 promise
  promise = null;
  constructor(max, arr) {
    this.max = max;
    this.taskArr = arr;
    // 创建一个 pending 状态的 promise，交出resolve 执行，在请求完了之后再resolve
    this.promise = new Promise((resolve) => {
      this.resolvePromise = resolve;
    })
  }
  add(...addTasks) {
    this.taskArr.push(...addTasks);
  }
  async start() {
    this.isRunning = true;
    this.run();
  }
  stop() {
    this.isRunning = false;
    console.log('%c暂停-----', 'color:pink');
  }
  run() {
    console.log('%c开始-----', 'color:green');
    if (this.taskArr.length === 0) {
      this.resolvePromise([]);
    }

    const request = async () => {
      // 暂停
      if (!this.isRunning) {
        return;
      }
      // 指正移动到最后了
      if (this.index === this.taskArr.length) {
        return;
      }
      // 当前下标
      const i = this.index;
      const fn = this.taskArr[i];
      console.log(`%capi-${i}-请求中...`, 'color:yellow')
      // 指针移动
      this.index++;
      try{
        this.results[i] = await fn(i);
      } catch(e) {
        this.results[i] = e;
      } finally {
        console.log('api-' + i + '完成');
        // 完成一个请求就 完成数++
        this.count++;
        // console.log('=====', this.count, this.taskArr.length);
        // 都完成了就 resolve
        if (this.count === this.taskArr.length) {
          this.resolvePromise(this.results);
        } else {
          request();
        }
      }
    }
    // 可能并发数比较大
    let times = Math.min(this.max, this.taskArr.length);
    while(times--) {
      request();
    }
  }
}

let task = new Task(3, apiArr);

task.promise.then((v) => {
  console.log('==异步任务执行完成==', v)
});

// 开始
task.start();
```


## 大文件上传

假设大文件上传代码如下，即可以使用上面 `Task` 进行管理，如果需要做断点续传，可以使用 `spark-md5` 生成文件 `hash` 进行标记

```html
<input id="file" type="file" />
```

```js
const splitChunk = (file, chunkSize = 100000) => {
  const fileSize = file.size;
  const res = [];
  for (let i = 0; i < fileSize; i += chunkSize) {
    // File.propotype.slice : start - end
    const chunk = file.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

const fileInput = document.querySelector('#file');
fileInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  // 分割文件
  const chunkList = splitChunk(file);

  // 组装任务
  const taskList = chunkList.map(v => {
    return (v) => mockApi(v);
  });
  const task = new Task(10, taskList);
  // promise
  task.promise.then(v => {
    console.log('===完成===', v);
  });
  // 开始
  task.start();
});
```
