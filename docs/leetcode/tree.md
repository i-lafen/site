# 树

## 二叉树

- 二叉树最大深度
- 二叉树最小深度
- 翻转二叉树
- 对称二叉树
- 深度优先、广度优先 遍历
- 层序遍历
- 二叉树的前序遍历
- 二叉树的中序遍历
- 二叉树的后序遍历
- 路径总和

```js
// 二叉树 数据
const root = {
  val: 0,
  left: {
    val: 1,
    left: {
      val: 2,
      left: {
        val: 3
      }
    },
    right: {
      val: 4
    }
  },
  right: {
    val: 5
  }
}
```


### 二叉树最大深度

> 递归、队列， 队列注意先入队的先出队

```js
// 递归
const maxDepth = (root) => {
  if (!root) return 0;
  const left = maxDepth(root.left);
  const right = maxDepth(root.right);
  return 1 + Math.max(left, right);
};

// 非递归
const maxDepth2 = (root) => {
  if (!root) return 0;
  const stack = [root];
  let max = 0;
  // 一次遍历就是一层
  while(stack.length) {
    const len = stack.length;
    max++;
    // 清空，并将当前层的子树入队
    while(len--) {
      // 先入队的先出队
      const node = stack.shift();
      // 子树入队
      node.left && stack.push(node.left);
      node.right && stack.push(node.right);
    }
  }
  return max;
}
```


### 二叉树最小深度

> 队列 中保存 子树 和 层级 ，左右没有子树的时候直接返回层级

```js
const minDepth = (root) => {
  if (!root) return 0;
  // 储存节点、 层级
  const stack = [[root, 1]];
  while(stack.length) {
    const [node, n] = stack.shift();
    // 左右都没有，返回层级
    if (!node.left && !node.right) {
      return n;
    }
    // 有子树都得入队
    node.left && stack.push([node.left, n + 1]);
    node.right && stack.push([node.right, n + 1]);
  }
}
```


### 翻转二叉树

> 递归，通过中间变量交换左右子树

```js
const invertTree = (root) => {
  if (!root) return null;

  const tmp = root.left;
  root.left = root.right;
  root.right = tmp;

  invertTree(root.left);
  invertTree(root.right);

  return root;
}
```


### 对称二叉树

验证二叉树是否轴对称

> 递归，比对左右节点值，比对 左子树的左 和 右子树的右，比对左子树的右和右子树的左

```js
const isSymmetric = function(root) {
  const fn = (l, r) => {
    // 左右子树不存在，返回true
    if (!l && !r) return true;
    // 左右子树只存在一个，返回false
    if (!l || !r) return false;
    // 比较左右子树值，递归比较左子树的左和右子树的右，左子树的右和右子树的左
    return l.val === r.val && fn(l.left, r.right) && fn(l.right, r.left);
  };
  return fn(root, root);
};
```


### 二叉树深度优先遍历

> 递归，类似前序遍历

```js
const arr = [];
const depthFirst = (root) => {
  if (!root) return arr;
  arr.push(root.val);
  root.left && depthFirst(root.left);
  root.right && depthFirst(root.right);
}
arr;
```


### 二叉树广度优先遍历

> 队列（先进后出）， 每个节点都需将左右子节点从右边入队，遍历时从左边出队

```js
const breadthFirst = (root) => {
  const arr = [];
  if (!root) return arr;
  // 维护队列
  const stack = [root];
  while(stack.length) {
    // 出队
    const node = stack.shift();
    arr.push(node.val);
    // 入队
    node.left && stack.push(node.left);
    node.right && stack.push(node.right);
  }
  return arr;
}
```


### 层序遍历

> 递归，注意要先遍历完一层，才能进行下一层遍历，返回值应该是一个二维数组，分别用于储存每一层的节点值

```js
const levelOrder = (root) => {
  const arr = []
  if (!root) return arr

  const stack = [root]
  while(stack.length) {
    let len = stack.length
    // 一层一个数组临时储存
    const tmp = []
    while(len--) {
      const node = stack.shift()
      tmp.push(node.val)
      // 按顺序 入队
      node.left && stack.push(node.left)
      node.right && stack.push(node.right)
    }
    // 遍历完一层，push 进 arr
    arr.push(tmp)
  }
}
```


### 二叉树前序遍历

遍历过程 ： 根 -> 左 -> 右

> 可用递归、栈遍历方式。 使用栈遍历时，需要注意入栈顺序

```js
// 递归
const preorderTraversal = (root) => {
  const arr = [];
  if (!root) return arr;
  const mapFn = (node) => {
    if (node) {
      arr.push(node.val);
      mapFn(node.left);
      mapFn(node.right);
    }
  }

  mapFn(root);

  return arr;
}

// 非递归 - 栈 - 在使用栈遍历时需要注意入栈顺序
const preorderTraversal2 = (root) => {
  const arr = [];
  if (!root) return arr;
  // 根节点入栈
  const stack = [root];
  while(stack.length) {
    // 子树出栈
    const node = stack.pop();
    arr.push(node.val);
    // 有顺序要求，左子树后入栈，则先出栈，即先遍历
    node.right && stack.push(node.right);
    node.left && stack.push(node.left);
  }
  return arr;
}
```


### 二叉树中序遍历

遍历过程： 左 -> 根 -> 右

```js
// 递归
const inorderTraversal = (root) => {
  const arr = [];
  if (!root) return arr;
  const mapFn = (node) => {
    if (node) {
      // 先找左子树
      mapFn(node.left);
      // 中间
      arr.push(node.val);
      // 右子树
      mapFn(node.right);
    }
  }
  mapFn(root);
  return arr;
}

// 非递归 - 栈
const inorderTraversal2 = (root) => {
  const arr = [];
  if (!root) return arr;

  const stack = [];
  let node = root;
  while(stack.length || node) {
    // 入栈， 遍历当前子树的左子树入栈
    while(node) {
      stack.push(node);
      node = node.left
    }
    // 出栈
    const n = stack.pop();
    arr.push(n.val);
    node = n.right;
  }
  return arr;
}
```


### 二叉树后序遍历

遍历过程： 左 -> 右 -> 根

> 栈遍历时， 注意入栈顺序

```js
// 递归
const postorderTraversal = (root) => {
  const arr = [];
  const mapFn = (node) => {
    if (node) {
      mapFn(node.left);
      mapFn(node.right);
      arr.push(node.val);
    }
  }
  mapFn(root);
  return arr;
}

// 非递归 - 栈 - 注意入栈顺序
const postorderTraversal2 = (root) => {
  const arr = [];
  const stack = [root];
  while(stack.length) {
    // 出栈
    const node = stack.pop();
    // 注意: 往左边保存
    arr.unshift(node.val);
    // 入栈
    node.left && stack.push(node.left);
    node.right && stack.push(node.right);
  }
  return arr;
}
```


### 路径总和

给定二叉树 和 整数，判断二叉树中是否存在 从根节点到叶子节点 的路径上的值总和，等于该整数。

> 递归，递归遍历时，一遍减去遍历过的节点值，到叶子节点时和剩余的值直接比较

```js
const hasPathSum = (root, targetSum) => {
  if (!root) return false;
  // 叶子节点，直接和剩余的目标值比较
  if (!root.left && !root.right) return root.val === targetSum;
  // 递归左右子树，并减去当前节点值
  return hasPathSum(root.left, targetSum - root.val) || hasPathSum(root.right, targetSum - root.val);
};
```
