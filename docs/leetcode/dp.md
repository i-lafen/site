# 动态规划


## 设计思路

- 定义子问题
- 写出子问题的递推关系
- 确定 DP 数组的计算顺序
- 空间优化（可选）


也可以先根据子问题写出递归方式，然后将其改成非递归方式


### 爬楼梯

爬 n 阶楼梯，一次可以爬 1 阶 或 2 阶，有多少种方法

> 递推公式 f(x) = f(x - 1) + f(x - 2)


#### 递归

```js
const climbStairs = (n) => {
  // 边界
  if (n === 1) return 1
  if (n === 2) return 2

  return climbStairs(n - 1) + climbStairs(n - 2)
}
```

#### 动态规划

```js
const climbStairs2 = (n) => {
  // 边界
  if (n === 1) return 1
  if (n === 2) return 2

  // 使用两个变量来储存 f(n - 1) 和 f(n - 2) 的结果
  let first = 1, second = 2
  for (let i = 3; i <= n; i++) {
    // 整体后移
    const tmp = first + second
    first = second
    second = tmp
  }
  return second
}
```


### 买卖股票最佳时机

给定一个数组 `prices` ，它的第 `i` 个元素 `prices[i]` 表示一支给定股票第 `i` 天的价格;
你只能选择 某一天 买入这只股票，并选择在 未来的某一个不同的日子 卖出该股票。设计一个算法来计算你所能获取的最大利润;
返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 `0` 。

```js
const arr = [7, 1, 5, 3, 6, 4];

// 动态规划，本质在求解 某个数和它右边最大数的差值
const getMaxProfit = function(prices) {
  // 最大收益，最小买入价格
  let maxProfit = 0, min = Infinity;
  for (let i = 0; i < prices.length; i++) {
    // 寻找最小买入价格
    if (prices[i] < min) {
      min = prices[i];
    } else if (prices[i] - min > maxProfit) {
      // 当前价格 减去 最小买入价格，如果大于最大收益，则保存最大收益
      maxProfit = prices[i] - min;
    }
  }
  return maxProfit;
};

console.log(getMaxProfit(arr));
```


### 最大子序和

找出给定数组的具有最大和的连续子数组

此类 问题必须遍历，如 [a, b, c]，需要列举所有子序列出来求和作比较。


#### 1. 动态规划

通常遍历 子串 或 子序列 有三种方法：

  1. 以某个节点为开头的某个子序列，如 [a]、[a, b]、[a, b, c]，然后再是  [b]、[b, c]，最后是 [c]；
  2. 根据序列的长度来遍历子序列，长度为 1 的子序列，[a]、[b]、[c]，然后长度为 2 的子序列 [a, b]、[b, c]，然后是长度是 3 的子序列，[a, b, c];
  3. 以子序列的**结尾为基准**，先遍历以某个节点为结束的子序列，因为每个节点都可能为结束节点，故需要遍历整个序列，例如，以 a 为结束节点的子序列为：[a]；以 b 为结束节点的子序列为：[a, b]、[b]；以 c 为结束节点的子序列为 [a, b, c]、[b, c]、[c];


通常惯性思维都是以子序列的开头为基准进行查找，但 【动态规划】 为了找到递推关系，恰恰是以子序列结束节点为基准进行查找的。

```js
const arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4];

// 1、动态规划
const maxSubArr = (nums) => {
  let preSum = 0;
  // 子序列的和的最大值
  let maxSum = nums[0];
  // 遍历
  for(let i = 0; i < nums.length; i++) {
    let item = nums[i];
    // 当前节点 对 之前的 子序列的和 是否有增益，有增益 则当前节点作为新的结束节点，并记录 和
    preSum = Math.max(preSum + item, item);
    // 保存最大子序列和
    maxSum = Math.max(maxSum, preSum);
  }
  return maxSum;
}

console.log(maxSubArr(arr));
```


#### 2. 贪心算法

核心：若当前指针所指元素之和小于 `0`，则丢弃当前元素之前的数列

```js
const arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4];

// 2、贪心算法
const maxSubArr2 = (nums) => {
  let curSum = 0, maxSum = nums[0];
  for (var i = 0; i < nums.length; i++) {
    if (curSum > 0) {
      curSum += nums[i];
    } else {
      curSum = nums[i];
    }
    maxSum = Math.max(maxSum, curSum);
  }
  return maxSum;
}

console.log(maxSubArr2(arr));
```


### 打家劫舍

你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。

给定一个代表每个房屋存放金额的非负整数数组，计算你 不触动警报装置的情况下 ，一夜之内能够偷窃到的最高金额。


#### 递归

```js
const robTo = (nums, lastIndex) => {
  // 只有一家或者两家情况
  if (lastIndex === 0) return nums[0]
  if (lastIndex === 1) return Math.max(nums[0], nums[1])

  // 方案一，包含最后一栋房子，则应该丢弃倒数第二栋房子
  let sum1 = robTo(nums, lastIndex - 2) + nums[lastIndex]; 
  // 方案二，不包含最后一栋房子，那么方案二的结果就是到偷到 lastIndex-1 为止的最优结果
  let sum2 = robTo(nums, lastIndex - 1); 

  return Math.max(sum1, sum2);
}

const rob = (nums) => {
  return robTo(nums, nums.length - 1)
}
```


#### 动态规划

**基本思想**：最终问题的最优解可以分解成一个个相似的子问题的最优解来求得。

例如此题中，要知道不触发报警前提下盗窃 `i = nums.length` 户房子的最大金额，可以这样分析：

1. 当 `i = 0`，盗窃金额为 `f(0) = 0`
2. 当 `i = 1`，只有一户人家，直接盗窃这一家，金额为 `f(1) = nums[0]`
3. 当 `i = k`，则偷窃金额是 `f(k)`，判断第 `k` 家要不要盗窃，需要分析两种情况：
  - 如果不偷 `k` 家，那么问题就变成了求前 `k-1` 家中所能偷到的最大金额，即金额为 `f(k-1)`
  - 如果偷 `k` 家，那么第 `k-1` 家是不能偷的，问题又变成了求 `k` 家 和 前 `k-2` 家中所能偷到的最大金额，即 `nums[k] + f(k-2)`
  - 则子问题的最优解从这两者选择中比较得出最大值，即：`max = Math.max(f(k-1), nums[k] + f(k-2))`
    一直到最后，求得原问题最优解

```js
const rob = function(nums) {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];
  // 前 k-1 最大金额
  var dp1 = 0;
  // 前 k-2 最大金额
  var dp2 = 0;
  for (var i = 0; i < nums.length; i++) {
    // 前 k 最大金额
    var max = Math.max(dp1, nums[i] + dp2);
    // 在 下一次前 k+1 最大金额时，依赖于 前 k 次和 前 k-1 次金额的比较
    dp2 = dp1;
    dp1 = max;
  }
  return dp1;
}
```
