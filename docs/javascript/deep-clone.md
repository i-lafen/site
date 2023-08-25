# 深拷贝

手写 或使用 `lodash`

```js
const deepClone = (obj = {}, map = new Map()) => {
  // 简单值，直接返回
  if (typeof obj !== 'object') return obj;
  // 循环引用值，直接返回map中保存的
  if (map.get(obj)) return map.get(obj);
  // 结果，需判断类型
  const result = Array.isArray(obj) ? [] : {};
  // 缓存
  map.set(obj, result);
  // 遍历obj，递归拷贝
  for(const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = deepClone(obj[key], map);
    }
  }
  return result;
}

// 示例
const item = { a: 123, b: { c: 333 } };
const _item = deepClone(item);
_item.b.c = 777;
console.log(item, _item);
```
