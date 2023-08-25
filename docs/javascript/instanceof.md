# Instanceof


`instanceof` 模拟函数实现


## 定义

能够在 **实例的原型对象链中** 找到该 **构造函数**的 `prototype` 属性所指向的 **原型对象**，就返回 `true`


## instanceof 模拟

```js
const _instanceof = (left, right) => {
  let proto = left.__proto__; // 对象的原型
  const prototype = right.prototype; // 原型对象
  while(true) {
    if (proto === null) return null;
    if (proto === prototype) return true;
    proto = proto.__proto__; // 向上查找
  }
}

const obj = {};
_instanceof(obj, Object); // 模拟 instanceof
```
