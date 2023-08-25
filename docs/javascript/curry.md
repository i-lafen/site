# 函数柯里化

为高阶函数，函数复用参数的一种方式

```js
// 现有函数 求立方体体积 xyz分别表示长宽高
const getCubeVolume = (x, y, z) => x * y * z;
// 每次计算都得传入3个参数
const v = getCubeVolume(1, 1, 1);

// 但是现有一批长宽一致，但高不一致的立方体，需要求体积，那函数希望可优化使用，只保留一个高的变量，例如
const curryFn = currying(getCubeVolume, 1, 1);
// 根据z来计算
const getCubeVolumeFn = z => curryFn(z);
// 直接传入高
const v1 = getCubeVolumeFn(2);

// currying 则称为柯里化函数，可进行如下定义
const currying = (fn, ...args) => {
  return (...innerArgs) => {
    const allArgs = [...args, ...innerArgs];
    // fn.length 为函数参数个数
    if (allArgs.length < fn.length) {
      return currying(fn, ...allArgs);
    } else {
      return fn(...allArgs);
    }
  }
}
// 还可以使用
const v2 = currying(getCubeVolume)(1)(1)(2);
const v3 = currying(getCubeVolume, 1)(1)(3);
const v4 = currying(getCubeVolume, 1, 1)(4);
```
