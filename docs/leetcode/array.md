# 数组

## 数组基本操作

- 两数之和 - `map` 字典储存
- 两数之和 II - 输入有序数组
- 删除数组重复项 - 双指针
- 旋转数组 - 切割/翻转
- 移动零 - 双指针
- 二分法查找
- 买卖股票最佳时机2
- 数组转树
- 打乱数组 - 洗牌算法



### 两数之和

给定数组和目标值，从数组中找出和为目标值的两个数，返回下标

> 遍历数组，保存到 `值 -> 下标` 到 `map` 中， 遍历时 计算当前值与目标值的差值 ， `map` 中使用 `has` 判断是否存在与差值相同的数 即可 

```js
const nums = [2, 7, 10, 11, 99], target = 9;
const towSum = (nums, target) => {
  // 储存 值、 下标
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const num = target - nums[i];
    if (map.has(num)) {
      return [map.get(num), i];
    } else {
      map.set(nums[i], i);
    }
  }
  return [];
}
towSum(nums, target);
```


### 两数之和 II - 输入有序数组

给你一个下标从 `1` 开始的整数数组 `numbers` ，该数组已按 **非递减顺序排列** ，请你从数组中找出满足相加之和等于目标数 `target` 的两个数。如果设这两个数分别是 `numbers[index1]` 和 `numbers[index2]` ，则 `1 <= index1 < index2 <= numbers.length` 。

以长度为 `2` 的整数数组 `[index1, index2]` 的形式返回这两个整数的下标 `index1` 和 `index2`。

```js
/**
  因为是已排序数组，可以定义首尾指针，判断指针的值的和是否等于目标值
  - 等于目标值返回下标
  - 大于目标值则尾指针左移，以减小与目标值差距
  - 小于目标值则首指针右移

 */
var twoSum = function(numbers, target) {
  var left = 0, right = numbers.length - 1
  while(left < right) {
    var sum = numbers[left] + numbers[right]
    if (sum === target) {
      return [left + 1, right + 1]
    } else if (sum > target) {
      right--
    } else {
      left++
    }
  }
  return []
}

twoSum([2,7,11,15], 9)
```




### 删除数组重复项

删除 已排序 的数组的重复项，返回不重复的数组的长度

> 双指针，主要遍历时移动右指针，与左指针不同，则将右指针的值赋值给左指针的下一个，并移动左指针，最后左指针指向最后一个不为重复的值

```js
const removeDuplicates = function(nums) {
  if (nums.length === 0) return 0;
  let left = 0, right = 1;
  while(right < nums.length) {
    if (nums[left] !== nums[right]) {
      nums[left + 1] = nums[right];
      left++;
    }
    right++;
  }
  return left + 1;
};
```



### 旋转数组

给定数组与旋转个数，将数组元素从尾部旋转到头部。

```js
// 1、 切割
const nums = [1, 2, 3, 4, 5], n = 2; // target = [4, 5, 1, 2, 3]
const rotate = (nums, n) => {
  const k = n % nums.length;
  const cuts = nums.splice(nums.length - k);
  nums.unshift(...cuts);
  return nums;
};

// 2、 翻转
const reverse = function(start, end, nums) {
  while(start < end) {
    [nums[start], nums[end]] = [nums[end], nums[start]];
    start++;
    end--;
  }
}
const rotate = function(nums, k) {
  k %= nums.length ;
  reverse(0, nums.length - 1, nums);
  reverse(0, k - 1, nums);
  reverse(k, nums.length - 1, nums);
};
```



### 加一

> 从后遍历， 不为 `9` 则直接加 `1` ，返回即可； 如果遇到 `9` 则置零，在下一轮遍历中 加 `1` 返回；如果能遍历到最后，则最后需要在数组左边补 `1` 。

```js
// 数组表示 123，加一后 变为 124
const list = [1, 2, 3];
const list1 = [4, 3, 2, 1];

const plusOne = (arr) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === 9) {
      arr[i] = 0;
    } else {
      arr[i] += 1;
      return arr;
    }
  }
  return [1, ...arr];
}
console.log(plusOne(list));
console.log(plusOne(list1));
```


### 移动 0 到数组末尾

> 双指针，右指针遍历，遇到非 `0` 就和左指针交换，左指针加 `1` ，继续下一轮遍历

```js
const list1 = [0, 0, 3, 0, 11, 0];
const moveZero1 = (nums) => {
  if (nums.length === 0) return;
  var j = 0;
  for (var i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      [nums[i], nums[j]] = [nums[j], nums[i]];
      j++;
    }
  }
}
console.log(moveZero1(list1));

const list = [0, 0, 3, 0, 11, 0];
const moveZero = (arr) => {
  let i = 0, j = i + 1;
  while(j < arr.length) {
    if (arr[i] === 0) {
      while(arr[j] === 0) {
        j++;
      }
      if (j < arr.length) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    i++;
    j++;
  }
  return arr;
}
console.log(moveZero(list));
```


### 二分法查找

在已排序的数组中查找的目标值的下标

> 每次都取 中间下标 的值和 目标值 比对大小，根据大小区分目标值在左、右区间，然后再在区间中取中间下标的值和目标值比大小

```js
const list = [1, 2, 3, 4, 5, 6, 9, 10, 88];
const findIndex = (arr, num) => {
	let left = 0, right = arr.length - 1;
	while(left <= right) {
		let i = Math.floor((left + right) / 2);
		if (arr[i] > num) {
			right = i - 1;
		} else if (arr[i] < num) {
			left = i + 1;
		} else {
			return i;
		}
	}
	return -1;
}
console.log(findIndex(list, 6));
```


### 数组 转 树

使用 `map` 来缓存 `id` 和 对应的数组元素 `id -> treeItem` ， 遍历时判断 `map` 中是否存在 `parentId` ， 存在则将 `treeItem` 保存到 `parentItem.children` 中

```js
const list = [
  { id: 1, name: '部门A', parentId: 0 },
  { id: 2, name: '部门B', parentId: 1 },
  { id: 3, name: '部门C', parentId: 1 },
  { id: 4, name: '部门D', parentId: 2 },
  { id: 5, name: '部门E', parentId: 3 },
  { id: 6, name: '部门F', parentId: 3 },
];

const convertArrToTree = (arr) => {
  let root = null;
  const idMap = new Map();
  arr.forEach((item) => {
    // tree item
    const { id, parentId, name } = item;
    const treeItem = { id, name };
    // 缓存
    idMap.set(id, treeItem);
    // 找到 parent 并 push 到 children
    const parentItem = idMap.get(parentId);
    if (parentItem) {
      if (parentItem.children === undefined) {
        parentItem.children = [];
      }
      parentItem.children.push(treeItem);
    }

    // 是根节点的话赋值给 root
    if (parentId === 0) {
      root = treeItem;
    }
  });
  return root;
}

console.log(convertArrToTree(list));
```


### 树 转 数组

> 使用队列遍历，使用 `map` 储存父子关系，即遍历 `children` 储存 `childrenItem -> currentItem` 到 `map` ，这样在队列遍历到 子节点 时就能知道子节点对应的 父节点 是哪个

```js
const tree = {
  id: 1,
  name: '部门A',
  children: [
    {
      id: 2,
      name: '部门B',
      children: [
        { id: 4, name: '部门D' },
      ],
    },
    {
      id: 3,
      name: '部门C',
      children: [
        { id: 5, name: '部门E' },
        { id: 6, name: '部门F' },
      ],
    },
  ],
};

const convertTreeToArr = (root) => {
  // 父子节点映射
  const nodeMap = new Map();
  const arr = [];
  // 广度优先遍历，队列
  const queue = [];
  queue.unshift(root);
  while(queue.length > 0) {
    // 出队
    const curNode = queue.pop();
    if (curNode === null) {
      break;
    }

    const { id, name, children = [] } = curNode;
    // 从缓存获取 父节点
    const parentNode = nodeMap.get(curNode);
    const parentId = parentNode?.id ?? 0;
    // 拼接 item
    const item = { id, name, parentId };
    arr.push(item);

    // 子节点入队
    children.forEach(child => {
      // 映射 curNode 为 父节点
      nodeMap.set(child, curNode);
      // 入队
      queue.unshift(child);
    });
  }
  return arr;
};
console.log(convertTreeToArr(tree));
```


### 打乱数组 - 洗牌算法

长度为 `n` 的数组的全排列有 `n!` 种，也就是说打乱结果总共有 `n!` 种。

洗牌算法，产生的结果必须有 `n!` 种可能，否则无法做到真的打乱了。

```js
const nums = [1, 2, 3, 4, 5]
const shuffle = (arr) => {
  const n = arr.length
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i + Math.random() * (n - i))
    const t = arr[i]
    arr[i] = arr[r]
    arr[r] = t
  }
  return arr
}
```
