# 数据结构的使用


## Promise 模拟

```js
class _Promise {
  constructor(executor) {
    // 构造函数状态变量
    this.state = 'pending'
    this.value = undefined
    this.reason = undefined
    this.resolveFnList = []
    this.rejectFnList = []
    // 成功时才调用 清空成功队列
    const resolve = (val) => {
      if (this.state === 'pending') {
        this.state = 'fulfulled'
        this.value = val
        this.resolveFnList.forEach(fn => fn())
      }
    }
    // 失败时才调用 清空失败队列
    const reject = (rea) => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = rea
        this.rejectFnList.forEach(fn => fn())
      }
    }
    // 同步执行
    try {
      executor(resolve, reject)
    } catch(err) {
      reject(err)
    }
  }
  // 实例 then，根据状态处理传入的函数
  then(onFulfilled, onRejected) {
    if (this.state === 'fulfilled') {
      onFulfilled(this.value)
    }
    if (this.state === 'rejected') {
      onRejected(this.reason)
    }
    if (this.state === 'pending') {
      this.resolveFnList.push(() => onFulfilled(this.value))
      this.rejectFnList.push(() => onRejected(this.reason))
    }
  }
  // then 的语法糖
  catch(errFn) {
    return this.then(undefined, errFn)
  }
  // 静态方法 重新 new 一个实例
  static resolve(val) {
    return new _Promise(r => r(val))
  }
  static reject(rea) {
    return new _Promise((r, j) => j(rea))
  }
}

new _Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('test')
    resolve(111)
  }, 1000)
}).then((val) => {
  console.log(val)
})
```



## 简单模拟vue从数据变更到视图渲染过程

```js
class Component {
  _data = { name: '' }
	pending = false
	constructor() {
    this.data = new Proxy(this._data, {
      set: (target, key, value) => {
        target[key] = value
        // 通过信号量控制render延迟更新
        if (!this.pending) {
          this.pending = true
          Promise.resolve().then(() => {
            this.pending = false
            this.render()
          })
        }
      }
    })
  }
	render() {
    console.log('render：' + this.data.name)
  }
}
// 实现
const comp = new Component()
comp.data.name = '1'
comp.data.name = '2'
comp.data.name = '3'

setTimeout(() => {
  comp.data.name = '1000'
}, 0)
```





## 链表

#### 删除链表给定节点

> 给的当前节点为要删除节点，所以只能将下一个节点赋给当前节点，然后删除下一个节点

```js
const deleteNode = (node) => {
  node.val = node.next.value
  node.next = node.next.next
}
```

#### 翻转链表

```js
// 递归
const reverseLink = (head) => {
  if (head === null || head.next === null) return head
  const node = reverseLink(head)
  head.next.next = head
  head.next = null
  return node
}
// 遍历
const reverseLink = (head) => {
  let prev = null, curr = head
  while(curr !== null) {
    const nextTemp = curr.next
    curr.next = prev
    prev = nextTemp
  }
  return prev
}
```

#### 判断是否环形链表

```js
// 哈希表
const hasCycle = (head) => {
  const set = new Set()
  while(head) {
    if (set.has(head)) {
      return true
    }
    set.add(head)
    head = head.next
  }
  return false
}
// 快慢指针
const hasCycle = (head) => {
  let slow = head
  let fast = head
  while(slow !== null && fast !== null) {
    slow = slow.next
    fast = fast.next.next
    if (slow === fast) {
      return true
    }
  }
  return false
}
```



## 二叉树

#### 二叉树最大深度

```js
const maxDepth = (root) => {
  if (!root) return 0
  const left = maxDepth(root.left)
  const right = maxDepth(root.right)
  return 1 + Math.max(left, right)
}
```

#### 翻转二叉树

```js
const invertTree = (root) => {
  if (!root) return null
  // 左右节点交换
  const temp = root.left
  root.left = root.right
  root.right = temp
  // 递归左右子节点进行交换
  invertTree(root.left)
  invertTree(root.right)
  return root
}
```

#### 判断是否对称二叉树

```js
const isSymmetryTree = (root) => {
  const fn = (l, r) => {
    // 左右节点都不存在，则对称
    if (!l && !r) return true
    // 左右有节点一个不存在就不对称
    if (!l || !r) return false
    // 判断 值 并且分别判断左右子节点
    return l.val === r.val
    	&& fn(l.left, r.right)
    	&& fn(l.right, r.left)
  }
  return fn(root, root)
}
```

#### 二叉树深度优先遍历

> 与前序遍历类似

```js
const arr = []
const depthFirst = (root) => {
  if (!root) return arr
  arr.push(root.val)
  // 递归
  root.left && depthFirst(root.left)
  root.right && depthFirst(root.right)
}
```

#### 二叉树广度优先遍历

```js
const breathFirst = (root) => {
  const arr = []
  if (!root) return arr
  // 队列
  const stack = [root]
  while(stack.length) {
    // 出队
    const node = stack.shift()
    arr.push(node.val)
    // 入队
    node.left && stack.push(node.left)
    node.right && stack.push(node.right)
  }
  return arr
}
```

#### 二叉树层序遍历

> 返回二维数组，一层一个数组保存

```js
const levelOrder = (root) => {
  const arr = []
  if (!root) return arr
  // 队列
  const stack = [root]
  while(stack.length) {
    let len = stack.length
    // 同一层保存在一个数组中
    const temp = []
    while(len--) {
      const node = stack.shift()
      temp.push(node.val)
      node.left && stack.push(node.left)
      node.right && stack.push(node.right)
    }
    arr.push(temp)
  }
  return arr
}
```

#### 二叉树前序遍历

>  遍历顺序： 根 - 左 - 右

```js
// 1. 递归方式，与深度优先遍历类似
const preorder = (root) => {
  const arr = []
  if (!root) return arr
  // 递归
  const mapFn = (node) => {
    if (node) {
      arr.push(node.val)
      mapFn(node.left)
      mapFn(node.right)
    }
  }
  mapFn(root)
  return arr
}

// 2. 遍历方式
const preorder2 = (root) => {
  const arr = []
  if (!root) return arr
  // 使用栈遍历
  const stack = [root]
  while(stack.length) {
    // 出栈
    const node = stack.pop()
    arr.push(node.val)
    // 入栈，注意left在后
    node.right && stack.push(node.right)
    node.left && stack.push(node.left)
  }
  return arr
}
```

#### 二叉树中序遍历

> 遍历顺序： 左 - 根 - 右

```js
const inorder = (root) => {
  const arr = []
  if (!root) return arr
  // 递归
  const mapFn = (node) => {
    if (node) {
      mapFn(node.left)
      arr.push(node.val)
      mapFn(node.right)
    }
  }
  mapFn(root)
  return arr
}
```

#### 二叉树后序遍历

> 遍历顺序： 左 - 右 - 根

```js
const postorder = (root) => {
  const arr = []
  if (!root) return arr
  // 递归
  const mapFn = (node) => {
    if (node) {
      mapFn(node.left)
      mapFn(node.right)
      arr.push(node.val)
    }
  }
  mapFn(root)
  return arr
}
```



## 数组

#### 两数之和

```js
const nums = [2, 7, 10, 11, 99], target = 9
const twoSum = (nums, target) => {
  const map = new Map()
  for (let i = 0; i < nums.length; i++) {
    if (map.has(nums[i])) {
      return [map.get(nums[i]), i]
    } else {
      map.set(target - nums[i], i)
    }
  }
  return []
}
```

#### 二分查找

> 左右指针趋近目标

```js
const arr = [1, 2, 3, 4, 5, 6, 9, 10, 88]
const findIndex = (arr, num) => {
  let left = 0, right = arr.length - 1
  while (left <= right) {
    const i = Math.floor((left + right) / 2)
    if (arr[i] > num) {
      right = i - 1
    } else if (arr[i] < num) {
      left = i + 1
    } else {
      return i
    }
  }
  return -1
}
```

#### 数组转树

```js
const list = [
  { id: 1, name: '部门A', parentId: 0 },
  { id: 2, name: '部门B', parentId: 1 },
  { id: 3, name: '部门C', parentId: 1 },
  { id: 4, name: '部门D', parentId: 2 },
  { id: 5, name: '部门E', parentId: 3 },
  { id: 6, name: '部门F', parentId: 3 },
]

const convertArrToTree = (list) => {
  let root = null
  const map = new Map()
  list.forEach(item => {
    const { id, name, parentId } = item
    const treeItem = { id, name }
    map.set(id, treeItem)
    const parentItem = map.get(parentId)
    if (parentItem) {
      if (parentItem.children === undefined) {
        parentItem.children = []
      }
      parentItem.children.push(treeItem)
    }
    if (parentId === 0) {
      root = treeItem
    }
  })
  return root
}
```

#### 打乱数组 - 洗牌算法

> 确保每一个元素都能随机交换，即 每个元素都与后面的随机一个元素交换即可

```js
const nums = [1, 2, 3, 4, 5]
const shuffle = (nums) => {
  for (let i = 0; i < nums.length; i++) {
    const index = Math.floor(i + Math.random() * (nums.length - i))
    // 交换
    const temp = nums[i]
    nums[i] = nums[index]
    nums[index] = temp
  }
  return nums
}
```

