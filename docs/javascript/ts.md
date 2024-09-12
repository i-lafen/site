# TypeScript 基础


## ts 基本类型

- `Boolean`
- `Number`
- `String`
- `Array`
- `Tuple` 元组
- `Enum` ： 枚举，表示一组有命名值的有限集合，可看成一种特殊的对象
- `Any` 和 `unknown`
- `void` 和 `never`
- `null` 和 `undefined`


## array 和 tuple 区别

- 数组元素类型通常都是相同的，且能随意动态增加、删除元素。
- 元组元素数量和类型都是固定的，元素类型不必相同，不能动态添加、删除


## any 和 unknown 区别

- `any` 表示任意类型，表示可随意使用不会检查类型
- `unknown` 则表示未知类型，不可访问任何属性方法


## void 和 never 区别

- 无返回值的函数类型为 `void`
- 死循环或抛错则类型为 `never`


## ts 访问修饰符

- `public`
  - 公开（默认）
- `private`
  - 私有，当前类内部访问
- `protected`
  - 受保护，父类和子类访问
- `readonly`
  - 只读，控制属性可写性，只在声明或构造函数中被赋值，之后不可修改
- `static`
  - 静态，静态成员属于类本身

通常认为 `readonly` 和 `static` 不作为访问修饰符，但定义中也能发挥相应访问权限设置


## type 和 interface 区别

- `type`
  - 表示类型别名，用于给类型起一个新名字
  - 可通过交叉类型 `&` 来模拟扩展
  - 适合定义复杂类型，支持 联合类型 `|` 、交叉类型 `&` 、字面量类型 等类型操作
- `interface`
  - 表示对象的形状
  - 可被 `extends` 扩展，支持 **同名合并**
  - 适合定义 复杂多层次 的对象形状



## 如何理解 ts 泛型

**ts 泛型** 的核心思想是 **参数化类型**，即类型本身也是参数

这允许在创建 **函数**、**接口** 或 **类** 的时候不指定具体的类型，而是在使用时才指定

可以将其类比为函数的参数，是一个占位符，可能更好理解一点



## 交叉类型 & 和 联合类型 |

- **交叉类型** 是将多个类型合并为一个类型的方式。这种类型包含所有被合并类型的属性，使用 `&` 表示

```ts
type First = { a: number };  
type Second = { b: string };  
type Both = First & Second; // Both类型同时具有a属性和b属性  
  
let value: Both = { a: 1, b: 'hello' }; // 合法，因为value同时具有First和Second的所有属性
```


- **联合类型** 表示一个值可以是多种类型中的任意一个，使用 `|` 表示

```ts
let userName: string | number

userName = '拉粉'
console.log(userName.length) // 2

userName = 9
console.log(userName.length); // 报错，因为userName现在是数字类型，没有length属性
  
function printValue(value: string | number): void {  
  console.log(value)
}  
printValue("Hello"); // 输出: Hello
printValue(42); // 输出: 42
```


## ts 常见操作符

- `?.` 可选链
- `?` 类型中定义中表示可选属性/参数
- `??` 控制合并运算符
- `!` 非空断言
- `&` 交叉类型
- `|` 联合类型


## ts 如何扩展 window 属性

通常通过 `interface` 声明合并来实现扩展其属性， `ts` 编译器会自动将这些新属性合并到现有的 `Window` 类型中

```ts
// 声明一个与window同名的接口来扩展window对象
declare global {
  interface Window {
    myCustomProperty: string;
    myCustomFunction(): void;
  }
}

// 现在你可以安全地在window对象上使用myCustomProperty和myCustomFunction
window.myCustomProperty = "Hello, TypeScript!";
  
// 你还需要实现这个函数，否则在严格模式下会报错
window.myCustomFunction = function() {
  console.log("This is a custom function on window.");
};
  
// 使用  
console.log(window.myCustomProperty); // 输出: Hello, TypeScript!
window.myCustomFunction(); // 输出: This is a custom function on window.
```


## ts 中如何定义第三方模块的类型

- 使用现有的类型定义
  - 大多数流行的第三方库都有对应的类型包，通常以 `@types/` 为前缀，如 `@types/lodash` ，直接 `npm` 安装即可
- 手动编写类型定义
  - 创建 `.d.ts` 文件，例如 `third-party.d.ts`
  - 使用 `declare module` 或 `declare global` 来定义所需类型

