# 双指针


使用双指针的典型场景

- **首尾指针**： 从两端向中间迭代 数组 或 字符串，排序常用
- **快慢指针**： 同时有一个慢指针和一个快指针，主要是如何确定两个指针的移动策略
- **滑动窗口**： 指针收缩移动，主要是确定指针移动的策略


可以先从简单的题目体会双指针的用法


## 反转字符串

首尾指针

```js
var reverseString = function(s) {
  var left = 0, right = s.length - 1
  while(left < Math.floor(s.length / 2)) {
    [s[left], s[right]] = [s[right], s[left]]
    left++
    right--
  }
}

reverseString(['h', 'e', 'l', 'l', 'o'])
```


## 两数之和 II - 输入有序数组

给你一个下标从 `1` 开始的整数数组 `numbers` ，该数组已按 **非递减顺序排列** ，请你从数组中找出满足相加之和等于目标数 `target` 的两个数。如果设这两个数分别是 `numbers[index1]` 和 `numbers[index2]` ，则 `1 <= index1 < index2 <= numbers.length` 。

以长度为 `2` 的整数数组 `[index1, index2]` 的形式返回这两个整数的下标 `index1` 和 `index2`。

```js
/**
  因为是已排序数组，可以定义 【首尾指针】 ，判断指针的值的和是否等于目标值
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


## 移除元素

给你一个数组 `nums` 和一个值 `val`，你需要 原地 移除所有数值等于 `val` 的元素，并返回移除后数组的新长度。

不要使用额外的数组空间，你必须仅使用 `O(1)` 额外空间并 原地 修改输入数组。

元素的顺序可以改变。你不需要考虑数组中超出新长度后面的元素。

```js
// 快慢指针
var removeElement = function(nums, val) {
  let left = 0, right = 0
  while(right < nums.length) {
    // 将右指针不等于目标值的元素往左指针位置移动，最后返回左指针位置即刚好是数组长度
    if (nums[right] !== val) {
      [nums[left], nums[right]] = [nums[right], nums[left]]
      left++
    }
    right++
  }
  return left
}

removeElement([3, 2, 2, 3], 3)
```



## 最大连续1的个数

给定一个二进制数组 `nums` ， 计算其中最大连续 `1` 的个数

```js
var findMaxConsecutiveOnes = function(nums) {
  let left = 0, right = 0, max = 0;
  // 右指针移动，直到数组末尾
  while(right < nums.length) {
    if (nums[right] === 1) {
      // 找到1则左指针保存索引，右指针继续移动找0
      left = right;
      while(right < nums.length && nums[right] === 1) {
        right++;
      }
      // 保存左右指针之间1个数最大的数
      max = Math.max(max, right - left);
    }
    // 右指针继续移动
    right++;
  }
  return max;
}

findMaxConsecutiveOnes([1, 1, 0, 1, 1, 1])
```


## 长度最小的子数组

给定一个含有 `n` 个正整数的数组和一个正整数 `target` 。

找出该数组中满足其和 `≥ target` 的长度最小的 连续子数组 `[numsl, numsl+1, ..., numsr-1, numsr]` ，并返回其长度。如果不存在符合条件的子数组，返回 `0` 

```js
var minSubArrayLen = function(target, nums) {
  // 滑动窗口，移动右指针，如果找到符合的，则移动左指针进行收缩
  var left = 0, right = 0, sum = 0, min = Number.MAX_VALUE;
  while(right < nums.length) {
    sum += nums[right]
    while (sum >= target) {
      min = Math.min(right + 1 - left, min)
      // 减去收缩的左指针指向的值
      sum -= nums[left]
      left++
    }
    right++
  }
  return min > nums.length ? 0 : min
}

minSubArrayLen(7, [2, 3, 1, 2, 4, 3])
```

