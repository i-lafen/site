# 字符串


## 字符串基本操作

- 翻转字符串
- 验证回文串
- 实现 `strStr()`
- 最常公共前缀



### 翻转字符串

双指针向中间移动，交换指针的值

```js
const reverseString = function(s) {
  let p = 0, q = s.length - 1;
  while(p < Math.floor(s.length / 2)) {
    [s[p], s[q]] = [s[q], s[p]];
    p++;
    q--;
  }
}
```


### 实现 strStr()

判断字符串是否是另一个字符串的子串，是则返回 开头的下标，否则返回 -1

> 遍历长串，里层每次拿到子串的长度的字符串，与子串对比，相同则返回下标

```js
const haystack = "sadbutsad", needle = "sad"; // 返回下标 => 0
const strStr = function(haystack, needle) {
  if (needle.length === 0) {
    return 0;
  }
  for (let i = 0; i < haystack.length - needle.length + 1; i++) {
    let j = 0, s = '';
    while (j < needle.length) {
      s += haystack[i + j];
      j++;
    }
    if (s === needle) {
      return i;
    }
  }
  return -1;
}
```


### 最长公共前缀

```js
const strs = ["flower","flow","flight"]; // 返回 => "fl"
const longestCommonPrefix = function(strs) {
  if (strs.length === 0) return '';
  let str = strs[0];
  for (let i = 1; i < strs.length; i++) {
    let j = 0;
    for (; j < str.length, j < strs[i].length; j++) {
      if (strs[i][j] !== str[j]) {
        break;
      }
    }
    str = str.substr(0, j);
    if (str === '') return str;
  }
  return str;
}
```



### 连续最长字符、次数

```js
const s = 'abbcccddeeee12341111';
const fn = (str) => {
  let i = 0;
  let char = '', count = 1;
  while(i < str.length) {
    let j = i + 1, c = 1;
    // 相同时移动 j
    while(str[j] === str[i]) {
      c = j - i + 1;
      j++;
    }
    // 比较
    if (c >= count) {
      count = c;
      char = str[j - 1];
    }
    // 移动 i 到 j位置
    i = j;
  }
  return { char, count }
}
console.log(fn(s))
```


### 有效括号

给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。

有效字符串需满足：
- 左括号必须用相同类型的右括号闭合。
- 左括号必须以正确的顺序闭合。

```js
const isValid = function(s) {
  // 空串为 true
  if (s.length === 0) {
    return true;
  }
  // 奇数位则不匹配
  if (s.length % 2 !== 0) {
    return false;
  }
  // 栈
  const stack = [];
  // 哈希表
  const obj = {
    '(': ')',
    '[': ']',
    '{': '}',
  };
  for (let i = 0; i < s.length; i++) {
    // 左括号则入栈
    if (['(', '{', '['].includes(s[i])) {
      stack.push(s[i]);
    } else {
      // 栈顶出栈，右括号与栈顶匹配，不能匹配闭合则false
      const top = stack.pop();
      if (obj[top] !== s[i]) {
        return false;
      }
    }
  }
  // 栈为空则完全匹配
  return stack.length === 0;
};

const str = '()[]{}';
console.log(isValid(str));
```
