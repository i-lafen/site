# 数字



### 数字回文

```js
const val = 123454321;

const fn = (num) => {
  let rev = 0, n = num;
  while(n > 0) {
    rev = rev * 10 + n % 10;
    n = Math.floor(n / 10);
  };
  return rev === num;
}

console.log(fn(val));
```

