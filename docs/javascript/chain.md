# 链式调用


如以下代码所示，实现类似的链式调用示例


## 期望实现

```js
// 需要实现 以下链式调用
lazyMan('Tony')
  .eat('egg')
  .sleep(5)
  .run('10km')
  .sleepFirst(2)
  .eat('2 egg');

// Hi, i am Tony
// sleeping 2s first ...
// eatting egg ...
// sleeping 5s ...
// running 10km ...
// eatting 2 egg ...
```


## 代码

```js
class LazyMan {
	#tasks = [];
	constructor(name) {
		console.log(`Hi, i am ${name}`);
		setTimeout(() => {
			this.#next();
		});
	}
	eat(str) {
		const fn = () => {
			console.log(`eatting ${str} ...`);
			this.#next();
		}
		this.#tasks.push(fn);
		return this;
	}
	run(str) {
		const fn = () => {
			console.log(`running ${str} ...`);
			this.#next();
		}
		this.#tasks.push(fn);
		return this;
	}
	sleep(ms) {
		const fn = () => {
			setTimeout(() => {
				console.log(`sleep ${ms}s ...`);
				this.#next();
			}, ms * 1000);
		}
		this.#tasks.push(fn);
		return this;
	}
	sleepFirst(ms) {
		const fn = () => {
			setTimeout(() => {
				console.log(`sleep ${ms}s first ...`);
				this.#next();
			}, ms * 1000);
		}
		this.#tasks.unshift(fn);
		return this;
	}
		
	#next() {
		const fn = this.#tasks.shift();
		fn && fn();
	}
}
```


## 测试

```js
function lazyMan(name) {
  return new LazyMan(name);
}
lazyMan('Tony')
  .eat('egg')
  .sleep(5)
  .run('10km')
  .sleepFirst(2)
  .eat('2 egg');
```


## 其他例子


另外的链式调用例子也与之类似，其中

- `where` 可以使用 `filter` 实现
- `sortBy` 可以使用 `sort` 实现
- `groupBy` 类似于 `lodash` 的实现
- `execute()` 在开始执行


```js
const list = [
	{ id: 1, name: 'lafen', age: 18 },
	{ id: 2, name: 'judy', age: 22 },
	{ id: 3, name: 'zoom', age: 16 },
	{ id: 4, name: 'candy', age: 18 },
	{ id: 5, name: 'david', age: 22 },
]

// 实现查询函数
const query = (list) => {
	// code...
}

const arr = query(list)
	.where(id => id !== 5)
	.sortBy('name')
	.groupBy('age')
	.execute()
```


