# 稀疏数组

## 概念

开发中常用的通常都为 密集数组 。与 密集数组 相对， 数组中出现 孔洞 （ `Holey` ） 的，称为 **稀疏数组** 。


## 产生原因

常见产生原因如下

### `new` 指定长度的数组

```js
// 密集数组
const arr1 = [1, 2, 3] // [1, 2, 3]

// 稀疏数组
const arr2 = new Array(3) // [empty × 3]
```

以上两个数组的 `length` 都是 `3` ， 但是 稀疏数组 当中存在 空属性（即孔洞）


### 字面量修改数组元素

```js
const arr3 = []
arr3[2] = 1 // [empty × 2, 1]
```


### 修改数组 length

也可以通过直接改 `length` 方式产生 孔洞

```js
// 密集数组
const arr4 = [1, 2, 3] // [1, 2, 3]
arr4.length = 5 // [1, 2, 3, empty × 2]
```


### 直接删除元素的映射

对数组使用 `delete` ，会断开元素与数组的映射关系，但不会修改数组的 `length` ，所以也会产生 孔洞

```js
const obj = 1
const arr5 = []

arr5[0] = obj // 存入数组

delete arr5[0]

console.log(arr5) // [空白]
console.log(arr5.length) // 1
```


## 稀疏数组和密集数组区别

注意上述例子中的 孔洞 不是指元素值为 `undefined` ，虽然通过数组下标获取时确实时 `undefined` ， 但是 **孔洞** 指的的数组中某个元素不存在

### 孔洞 holey 与 假值 falsy

观察以下例子， `falsy` 不是 `holey`

```js
// 密集数组 ， 每一个元素都有值
const arr6 = [0, '', undefined, false, null] // length = 5

// 稀疏数组 ， 无元素， length = 5 ， 通过下标去取元素为 undefined
const arr7 = new Array(5) // [empty × 5]
```


### 遍历

看下遍历一个有 `10w` 元素的 密集数组 ，与长度为 `10w` 的 稀疏数组 时长对比

```js
const length = 100000
// 密集数组
const arr8 = []
// 稀疏数组
const arr9 = []

// 密集数组赋值
for (let n = 0; n < length; n++) {
  arr8.push(n)
}

// 稀疏数组赋值
arr9[length - 1] = length - 1

// 分别遍历
console.time('密集数组')
for (let i = 0; i < length; i++) {
  arr8[i]
}
console.timeEnd('密集数组')

console.time('稀疏数组')
for (let i = 0; i < length; i++) {
  arr9[i]
}
console.timeEnd('稀疏数组')

// 密集数组: 1.03173828125 ms
// 稀疏数组: 2.1318359375 ms
```

可以多执行几次看耗时，可以明显看到稀疏数组所花时长更长。


这是因为浏览器 `v8` 当中对于 密集数组 和 稀疏数组 的存放方式不同导致的，对于密集数组，在 `v8` 当中对应储存为 `c++` 当中的 `Array` ， 但是对于稀疏数组则做了优化，对应储存为 `c++` 当中的 `HashMap` ， `HashMap` 更方便快速从稀疏的元素中取值，但损耗了遍历的优势。


## Finally

平常使用时应当避免出现**稀疏数组**，毕竟数组常用的方法中，遍历 无可避免。
