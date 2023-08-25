# New


`new` 模拟实现，由于 `new` 是关键词，故通过函数实现


## new 时流程

- 创建一个新对象
- 将新对象 `__proto__` 指向构造函数的 `prototype`
- 将 `this` 指向该新对象，执行构造函数
- 返回这个新对象


## new 模拟

```js
const objectCreate = (Ctor, ...rest) => {
  const obj = Object.create(Ctor.prototype);
  const res = Ctor.apply(obj, rest);
  return typeof res === 'object' ? res : obj;
}
const obj = objectCreate(Object, { a: 1 }); // 模拟 new
```
