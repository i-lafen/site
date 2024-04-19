# Session Share

不同标签页之间共享 `sessionStorage` 简易实现思路

## 浏览器跨标签页通信方式

### 方案

常见的跨标签页通信有以下 `7` 种

- `localStorage` 或 `sessionStorage`
- `BroadcastChannel`
- `Shared Worker`
- `Service Worker`
- `window.postMessage`
- `IndexedDB`
- `WebSocket`

### 特点

- `localStorage` 能做到不同标签页操作的是同一份数据，能实时同步更新数据，监听 `storage` 事件可以更新到页面
- `sessionStorage` 只在打开新标签页时（ `window.open` ）复制一份数据给新标签页，任一标签页数据修改并不会同步给其他标签页，这是因为 `sessionStorage` 的作用范围和生命周期只限于当前会话窗口
- `BroadcastChannel` 是浏览器的消息通信机制，可以实时通过广播通信
- `webWorker` 是独立的后台线程，也可以在其中实现数据通信共享
- `window.postMessage` 可以给指定的标签窗口发送消息
- `IndexedDB` 是浏览器提供的本地数据库
- `WebSocket` 需要服务端支持，但能实现不同浏览器间的数据同步，在线文档类的需求中常见使用

### 实际场景

在实际项目中，有些实时性的系统数据并不想保存在 `localStorage` 中永久保存，而是希望保存在随窗口消失的 `sessionStorage` 中，以便能够每次打开系统时都能重新请求保存

但系统中总有在另一个标签页中打开链接的需求，虽然此时 `sessionStorage` 中的数据会复制一份到新标签页，但是也希望能够像 `localStorage` 一样能够实现同步

意思就是，既需要 `localStorage` 的同步更新，又需要 `sessionStorage` 的随窗口消失的特性

#### 实现思路

由 `Tab A` 打开 `Tab B` ，同步 系统通用 或 用户基本信息 等数据

- 系统全局监听 `storage` 事件
- `Tab B` 中判断 `sessionStorage` 中没有储存的数据 `info` ，则设置一下 `localStorage.setItem('getSessionStorage', Date.now())`
- `Tab A` 中的 `storage` 事件会触发，则在 `storage` 事件回调中将 `info` 设置到 `localStorage` 中
- `Tab A` 设置 `localStorage` ，便会触发 `Tab B` 中的 `storage` 事件，则可以在 `storage` 事件回调中将 `event.newValue` 设置到 `sessionStorage` 中
- 最后删除 `localStorage` 中的信息


#### 注意

- `storage` 事件只会监听其他标签页的 `localStorage` 变化，当前标签的 `localStorage` 变化则不会
- 实际开发中，一般获取 `info` 数据需要在进入系统之前，但是 `storage` 事件触发是异步的，会导致还未监听 `storage` 就进入了系统，所以需要使用 `Promise` 来进行包装


#### 基本代码

> 大致代码，但还需要根据实际情况在合适的地方移除 事件监听器

```js
async function checkSession() {
  return new Promise(resolve => {
    if (!sessionStorage.userInfo || !Object.keys(JSON.parse(sessionStorage.userInfo)).length) {
      // 如果sessionStorage中没有userInfo或者userInfo是空的，设置localStorage中的一个时间戳
      localStorage.setItem('getSessionStorage', `${Date.now()}`)
    } else {
      // 如果sessionStorage中有userInfo，则直接resolve
      resolve()
    }
    window.addEventListener('storage', function(event) {
      if (event.key === 'getSessionStorage') {
        // 如果其他标签页或窗口设置了getSessionStorage，将sessionStorage中的userInfo存储到localStorage
        localStorage.setItem('userInfo', sessionStorage.getItem('userInfo'))
        // 然后移除localStorage中的getSessionStorage，表示该事件已处理
        localStorage.removeItem('userInfo')
      } else if (event.key === 'userInfo' && event.newValue) {
        // 如果其他标签页或窗口更新了userInfo，将其更新到当前标签页的sessionStorage中
        sessionStorage.setItem('userInfo', event.newValue)
        // 解析新值后，resolve这个Promise
        resolve()
      }
    })
  })
}
function checkLogin() {
  console.log('login')
}
async function main() {
  await checkSession(); // 等待checkSession执行完成
  checkLogin(); // 执行登录检查或其他操作
}
main()
```
