# LRU 缓存策略

`LRU` 基本思路即，不常使用的数据，会首先清除，实际应用于 `vue` 组件缓存策略。项目中可以应用在字典的缓存中，经常使用的字典的 `key` 比重更大，更不容易被清除。

```js
class Cache {
	#keys = new Set();
	#cache = new Map();
	#limit = 0;
	#size = 0;
	#rest = 0;
	constructor(max = 20) {
		this.#limit = max;
	}
	get(key) {
		// 更新 key 权重
		this.update(key);
		return this.#cache.get(key);
	}
	set(key, value) {
		this.#keys.add(key);
		this.#cache.set(key, value);
		if (this.#keys.size > this.#limit) {
			const head = [...this.#keys][0];
			this.#keys.delete(head);
			this.#cache.delete(head);
		}
		this.#size = this.#keys.size;
		this.#rest = this.#limit - this.#size;
		return this.#size;
	}
	delete(key) {
		this.#keys.delete(key);
		this.#cache.delete(key);
		this.#size = this.#keys.size;
		this.#rest = this.#limit - this.#size;
	}
	update(key) {
		if (this.#keys.has(key)) {
			this.#keys.delete(key);
			this.#keys.add(key);
		}
	}
	has(key) {
		return this.#keys.has(key);
  }

  /** 返回所有 key */
  keys() {
    return [...this.#keys];
  }

  limit() {
    return this.#limit;
  }

  size() {
    return this.#size;
  }

  rest() {
    return this.#rest;
  }

  clear() {
    this.#keys.clear();
    this.#cache.clear();
    this.#limit = 0;
    this.#rest = 0;
    this.#size = 0;
  }
}

// 示例
const cache = new Cache(3);
cache.set('aaa', { a: 111 });
cache.set('bbb', { b: 222 });
cache.set('ccc', { b: 333 });
cache.set('ddd', { b: 444 });
cache.set('eee', { b: 555 });
cache.get('ccc');
cache;
```
