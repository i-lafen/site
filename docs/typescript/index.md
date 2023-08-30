# TypeScript 高级用法


## 类型

### unknown

> `unknown` 指的是不可预先定义的类型，在很多场景下，他可以替代 `any` 的功能同时保留静态检查的能力。

```typescript
const num: number = 10;
(num as unknown as string).split(''); // 这里与 any 一样可以通过静态检查
```

这里 使用 `unknown` 可以转换成任意类型，但是 `unknown` 不能调用任何方法，而 `any` 可以。

**使用场景**

避免使用 `any` 作为函数的参数类型而导致的静态类型检查 `bug`：

```typescript
function test(input: unknown): number {
  if (Array.isArray(input)) {
    return input.length; // Pass: 此代码块中，已经将类型识别为 array
  }
  return input.length; // Error: 这里的 input 还是 unknown 类型，无法调用任何方法和属性，将会报错
}
```



### void

> 在 TS 中，void 和 undefined 功能高度类似，可以在逻辑上避免不小心使用了空指针导致的错误。

```typescript
function foo() {} // 这个空函数返回类型缺省为 void
const a = foo(); // 此时 a 的类型定义是 void，也不能调用 a 的任何属性方法
```

`void` 和 `undefined` 类型最大的区别是，你可以理解为 `undefined` 是 `void` 的一个子集，当你对函数返回值并不在意时，使用 `void` 而不是 `undefined` 。



### never

> `never` 是指没法正常结束返回的类型，一个必定会报错或者死循环的函数会返回这样的类型。

```typescript
function foo(): never { throw new Error('err') } // 抛出错误，返回值是 never
function foo(): never { while(true){} } // 死循环无法正常退出
function foo(): never { let count = 1; while (count) { count++; } } // Error：这个无法将返回值定义为 never，因为无法在静态编译阶段直接识别出
```

永远没有相交的类型

```typescript
type human = 'boy' & 'girl' // 这两个单独的字符串类型不可能相交，故为 never 类型
```

任何类型联合上 `never` 类型，还是原来的类型

```typescript
type lang = 'ts' | never // lang 的类型还是 'ts' 类型
```

在一个函数中调用了一个返回 `never` 的函数后，之后的代码都会变成了 `deadcode`

```typescript
function test() {
  foo(); // 以上返回 never 的示例
  console.log(111); // Error：检查报错，这行代码不会执行到
}
```

无法将其他类型赋给 `never`

```typescript
let n: never;
let o: any = {};
n = o; // Error：不能把 非never 类型赋给 never，包括 any
```



## 运算符

### 非空断言 ! 

! 运算符可以用在变量名或函数后，用来声明对应的元素是非 `null` | `undefined` 的

```typescript
function onClick(callback?: () => void) {
  callback!(); // 入参数可选的，加上 ! 后 TS 编译不会报错
}
```



### 可选连 ?.

相比于 `!` 作用于编译阶段的非空判断，`?.` 这个是开发者最需要的运行时（编译时也有效）的非空判断。

```typescript
obj?.prop
obj?.[index]
func?.(args)
```

`?.` 用来判断左侧表达式是否为 `null` | `undefined` ，如果是则会停止表达式运行，可以减少 `&&` 的运算，编译如下

```typescript
// a?.b
a === null || a === void 0 ? void 0 : a.b;
```

**void 0**：`undefined` 这个值在非严格模式下会被重新赋值，使用 `void 0` 必定返回真正的 `undefined`。



### 空值合并运算符 ??

> `??` 与 `||` 的功能类似，区别在于 `??` 左边的表达式结果为 `null` | `undefined` 时，才会返回右侧表达式。
>
> 而 `||` 表达式 对于 `false`、`''` 、`NaN`、`0` 等逻辑空值也会生效，不适于我们做参数合并。

```typescript
let b = a ?? 10;
// 编译为
let b = a !== null && a !== void 0 ? a : 10;
```



### 数字分隔符 _

> `_` 可以用来对长数字做任意分割，方便数字阅读，编译出来是正常的数字。

```typescript
let num: number = 123_456.333_122
```





### 操作符

#### 键值获取 keyof

>  `keyof` 可以获取一个类型所有键值，返回一个联合类型
>
>  语法格式为： 类型 = keyof 类型

```typescript
type Person {
	name: string;
	age: number;
}
type PersonKey = keyof Person; // 'name' | 'age'
```

一个典型用途是限制访问对象的 `key` 合法化，因为 `any` 做索引是不被接受的

```typescript
function getValue(p: Person, k: keyof Person) {
  return p[k];
}
```



### 实例类型获取 typeof

> `typeof` 是获取一个对象/实例的类型。
>
> 语法格式：类型 = typeof 实例对象

```typescript
const me: Person = { name: 'xxx', age: 16 };
type p = typeof me; // { name: string; age: number }
const you: typeof me = { name: 'ccc', age: 26 } // 可以通过编译
```

`typeof` 只能用在**具体的对象**上，这与 `js` 中 `typeof` 是一致的，并且他会根据左侧值自动决定应该执行哪种行为。

```typescript
const typeStr = typeof me // typeStr 的值为 "Object" ， 与 js 同
type meType = typeof me // { name: string; age: number } ， ts 类型
```

`typeof` 可以 和 `keyof` 一起使用，来获取具体对象的 `key` 的集合

```typescript
type PersonKey = keyof typeof me;
```



### 遍历属性 in

> `in` 只能用在类型的定义中，可以对枚举类型进行遍历
>
> 语法格式：[自定义变量名 in 枚举类型]: 类型

```typescript
// 这个类型可以将任何类型的键值转化成 number 类型
type TypeToNumber<T> = {
  [key in keyof T]: number;
}
```

使用

```typescript
const obj: TypeToNumber<Person> = { name: 10, age: 10 }
```



## 泛型

> **泛型**是 `TS` 中非常重要的属性，他承载了静态定义到动态调用的桥梁，同时也是 `TS` 对自己类型定义的元编程。泛型是精髓也是难点。
>
> 语法格式：类型名<泛型列表> 具体类型定义

### 基本使用

泛型可以用在 普通类型定义、类定义、函数定义上

```typescript
// 普通类型定义;
type Dog<T> = { name: string, type: T }
// 普通类型使用
const dog: Dog<number> = { name: 'xx', type: 20 }

// 类定义
class Cat<T> {
  private type: T;
  constructor(type: T) { this.type = type }
}
// 类使用
const cat: Cat<number> = new Cat<number>(10); // 或简写 const cat = new Cat(10)

// 函数定义
function swipe<T, U>(value: [T, u]): [U, T] {
  return [value[1], value[0]];
}
// 函数使用
swipe<Cat<number>, Dog<number>>([cat, dog]); // 或简写 swipe([cat, dog])
```



### 泛型约束

有时候我们可以不用关注泛型具体的类型

```typescript
function fill<T>(length: number, value: T): T[] {
  return new Array(length).fill(value);
}
```

但是有时候需要限定类型时，使用 `extends` 关键字即可

```typescript
function sum<T extend number>(value: T[]): number {
  let count = 0;
  value.forEach(v => count += v);
  return count;
}
sum([1, 2]); // Pass
sum(['1', '2']); // Error
```

泛型约束也可以用在多个泛型参数的情况

```typescript
function pick<T, U extends keyof T>() {};
// 这里的意思是 限制了 U 一定是 T 的 key 类型中的子集
```



### 泛型条件

#### 三元运算符

```typescript
T extends U ? X : Y
```

这里倒没有限制 `T` 一定是 `U` 的子类型，如果是 `U` 子类型，则将 `T` 定义成 `X` 类型，否则为 `Y` 类型。

注意，生成的结果是 **分配式** 的。例如：

```typescript
T extends U ? T : never
```

此时返回的 `T` ，是满足原来的 `T` 中包含 `U` 的部分，可以理解为 `T` 和 `U` 的**交集**。



#### 泛型推断

`infer` 为**推断**的意思，一般搭配上面的泛型条件语句使用，所谓推断，就是你不用预先指定在泛型列表中，在运行时会自动判断，不过得先预定义好整体结构

```typescript
type Foo<T> = T extends { t: infer Test } ? Test : string
```

首先看 `extends` 后面的内容，`{ t: infer Test }` 可以看成是一个包含 `t` 属性的类型定义，这个 `t` 属性的 `value` 通过 `infer` 进行推断后会赋值给 `Test` 类型，如果泛型实际参数符合 `{ t: infer Test }` 的定义那么返回的就是 `Test` 类型，否则默认给缺省的 `string` 类型。

```typescript
type One = Foo<number> // string, 因为 number 不是一个包含 t 属性的对象类型
type Two = Foo<{ t: boolean }> // boolean, 因为泛型参数匹配上，使用了 infer 对应的类型
type Three = Foo<{ a: number, t: () => void }> // () => void, 泛型定义的是参数的子集，同样适配
```

另一个常见的应用场景在于获取 `Promise` 包裹的返回值类型

```typescript
// 获取promise中的value
type GetPromiseValue<T> = T extends Promise<infer Value>
  ? GetPromiseValue<Value> : T;

const api = async () => {
  const res = await 200;
  return res;
}

type IPromiseRes = ReturnType<typeof api>; // Promise<number>
type IRes = GetPromiseValue<IPromiseRes>; // number
```



### 泛型工具

#### `Partial<T>`

此工具的作用就是将泛型中全部属性变为 **可选** 的

```typescript
type Partial<T> = {
  [P in keyof T]?: T[p]
}
```

例子

```typescript
type Animal = {
  name: string,
  category: string,
  age: number,
  eat: () => number
}
```

使用 `Partial` 包裹一下

```typescript
type PartOfAnimal = Partial<Animal>;
const pa: PartOfAnimal = { name: 'xxx' }; // 属性变为可选
```


#### `Required<T>`

此工具可以将类型 `T` 中所有属性变为**必选**项

```typescript
type Required<T> = {
  [P in keyof T]-?: T[P]
}
```

`-?` 可以理解为 `TS` 中把 `?` 可选属性减去的意思。与 `Partial` 相反


#### `Record<K, T>`

此工具将 `K` 中所有属性值转化为 `T` 类型，我们常用他声明一个普通 `object` 对象。

```typescript
type Record<K extends keyof any, T> = {
  [key in K]: T
}
```

说明一下，这里 `keyof any` 对应的类型为 `number | string | symbol`，也就是可以做对象键的类型集合。

举个例子

```typescript
const obj: Record<string, string> = { 'name': 'zzz', 'tag': 'coder' }
```



#### `Pick<T, K>`

此工具是将 `T` 类型中的 `K` 键列表提取出来，生成新的**子键值对类型**。

```typescript
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```

例如上面的 `Animal` 定义，看看 `Pick` 如何使用

```typescript
const bird: Pcik<Animal, 'name' | 'age'> = { name: 'bird', age: 1 }
```


#### `Omit<T, K>`

此工具可认为是适用于键值对对象的 `Exclude`，他会去除类型 `T` 中包含 `K` 的键值对，与 `Pick` 相对

```typescript
type Omit = Pick<T, Exclude<keyof T, K>>
```

在定义中，第一步先从 `T` 的 `key` 中去掉与 `K` 重叠的 `key`，接着使用 `Pick` 把 `T` 类型和剩余的 `key` 组合起来即可。

```typescript
const OmitAnimal: Omit<Animal, 'name' | 'age'> = { category: 'lion', eat: () => { console.log('eat') } }
```

可以发现 `Omit` 与 `Pick` 得到的结果完全相反，一个 **取非** 结果，一个 **取交** 结果。




#### `Exclude<T, U>`

从联合类型中 **移除** 一部分类型。

```typescript
type Exclude<T, U> = T extends U ? never : T
```

注意这里的 `extends` 返回的 `T` 是原来的 `T` 中 和 `U` 无交集的属性，而任何属性联合 `never` 都是自身。举个例子

```typescript
type T1 = Exclude<'a' | 'b' | 'c', 'a' | 'b'>; // 'c'
type T2 = Exclude<string | number | (() => void), Function>; // string | number
```

#### `Extract<T, U>`

从联合类型中保留一部分类型，与 `Exclude` 相反

```typescript
type t = Extract<'a' | 'b' | 'c', 'a'>
typeof t === 'a' // true
```


#### `Parameters<T>`

返回类型为 `T` 的函数参数类型数组

```typescript
const fn = () => {
  return 'xxx';
}
const fn1 = (str: string) => {
  return str;
}
type t = Parameters<fn> // []
type t1 = Parameters<fn1> // [string]
```


#### ConstructorParameters

用于提取 **构造器参数** 的类型



#### `ReturnType<T>`

此工具就是获取 `T` 类型（函数）对应的**返回值类型**

```typescript
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
```

简化

```typescript
type ReturnType<T extends func> = T extends () => infer R ? : R : any;
```

通过使用 `infer` 推断返回值类型，然后返回此类型

```typescript
function foo(x: string | number): string | number {}
type FooType = ReturnType<typeof foo>; // string | numbeer
```


#### Awaited

用于提取 `Promise` 的值的类型，实际上只要是个**对象** 且 有 `then` 方法都可



#### `NonNullable<T>`

去除 `T` 中的 `null` 和 `undefined` 类型


#### `InstanceType<T>`

用于提取 **构造器返回值** 的类型

```typescript
class C {
  x = 0;
  y = 0;
}
type t = InstanceType<typeof C>; // C
```


#### Readonly

将索引类型加上 `readonly` 修饰



#### 其他内置类型

- `Uppercase` 大写
- `Lowercase` 小写
- `Capitalize` 首字母大写
- `Uncapitalize` 首字母小写


### 类型保护

可通过以下关键字来判断类型， `is` 是 `ts` 类型谓词

- `in` 判断类型包含某类型
- `typeof` 根据左边关键字返回 `ts` 对象类型 或 `js` 类型
- `instanceof`
- `is` 类型谓词


#### is 类型谓词

先看一个典型的例子，以下例子会警告类型不存在属性

```typescript
type Student = {
  name: string;
  type: string;
  class: string;
}
type Techer = {
  name: string;
  type: string;
  office: string;
}

type People = Student | Techer

const isTecher = (p: People) => {
  return p.type === 'techer'
}

const fn = (p: People) => {
  if (isTecher(p)) {
    console.log(p.office) // 类型“People”上不存在属性“office” 类型“Student”上不存在属性“office”
  }
}
```

虽然我们使用 `isTecher` 做了判断，但是参数 `p` 的类型并没有做收窄，还是报了警告， `is` 这时候就派上用场

给 `isTecher` 显式添加返回值类型，并使用 `is` ， 这样 `fn` 中调用 `isTecher` 后， `p` 的类型就收窄为了 `Techer`

```typescript
const isTecher = (p: People): p is Techer => {
  return p.type === 'techer'
}
```

以上就是 `is` 类型谓词的典型的使用场景，通常我们在开发时需要使用联合类型，但使用到联合类型中的 **非交叉属性** （非公共属性） 时，就会报错， `is` 就可以比较优雅的解决这个问题，除此之外使用类型断言 `as` 也可以。



### never 判断

```typescript
type IsNever<T> = [T] extends [never] ? true : false

type T50 = IsNever<never>  // true
type T51 = IsNever<number>  // false
```
