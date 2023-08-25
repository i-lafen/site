# 链表

## 单向链表

- 删除链表中节点
- 删除链表的倒数第 `N` 个节点 - 快慢指针
- 翻转链表 - 双指针 | 递归
- 回文链表 - 快慢指针（快指针先走一半）
- 环形链表 - 快慢指针



### 删除链表中的节点

一般来说，删除链表中的某一个节点，我们需要从链表头开始，往下找到要删除的节点的上一个节点，然后将上一个节点指向要删除的节点的下一个节点即可；

但此题只给了一个要删除的节点，没有给链表头，无法从头开始找到要删除的节点的上一个节点，此时我们需要切**换另一种思路**：

就是将要删除的节点的下一个节点的值赋值给要删除的节点，此时要删除的节点和下一个节点的值一样，然后删除下一个节点即可。

```js
const deleteNode = (node) => {
  node.val = node.next.val;
  node.next = node.next.next;
}
```


### 删除链表的倒数第 `N` 个节点

使用双指针，右指针先走 `n` ， 然后双指针一起走到 `null` ， 当前左指针刚好在要删除的节点上，为方便删除节点，可在链表头添加一个虚拟指针，这样左指针最后会停留在要删除节点的前一个

```js
cosnt removeNthFromEnd = (head, n) => {
  // 虚拟节点，指向链表头
  const tmp = { val: 0, next: head };
  // 定义 左、右 双指针
  let left = tmp, right = head;
  // 右指针先移动 n
  while(n > 0) {
    right = right.next;
    n--;
  }
  // 左、右指针一起移动，直至右指针到链表末尾
  while(right !== null) {
    right = right.next;
    left = left.next;
  }
  // 此时左指针刚好在要删除的节点的前一个节点，直接删除
  left.next = left.next.next;
  // 返回链表头
  return tmp.next;
};
```


### 翻转链表

使用临时变量，或者递归

```js
// 双指针
const reverseLinklist = (head) => {
  // 链表是空 或 单节点，直接返回
  if (head === null || head.next === null) return head;
  // 双指针
  let left = null, right = head;
  while (right !== null) {
    // 保存右指针下一个位置next
    const tmp = right.next;
    // 右指针next 指向左节点
    right.next = left;
    // 移动左指针到右指针位置
    left = right;
    // 移动右指针到下一个位置
    right = tmp;
  }
  return left;
}

// 递归
const reverseLinklist2 = (head) => {
  if (head === null || head.next === null) return head;
  // 先递归到最后，然后返回
  const node = reverseLinklist2(head.next);
  head.next.next = head; // 后面一个节点指向自己
  head.next = null; // 自己本来指向的 next 置为 null
  return node; // 返回最后一个节点
}
```


### 环形链表

可通过 set 来储存链表节点判断，也可通过 快慢指针 来判断（有环必定相遇）

```js
// 哈希表
const hasCycle = (head) => {
  const set = new Set();
  while (head) {
    if (set.has(head)) {
      return true;
    }
    set.add(head);
    head = head.next;
  }
  return false;
}

// 快慢指针
const hasCycle2 = (head) => {
  let slow = head;
  let fast = head;
  // 无欢，必定存在 null
  while (fast !== null && fast.next !== null) {
    // 慢指针走一步
    slow = slow.next;
    // 快指针走两步
    fast = fast.next.next;
    // 如果相遇，则有环
    if (slow === fast) {
      return true;
    }
  }
  // 否则无环
  return false;
}
```
