# ThreeJs

## 基本概念

- 场景 `Scene`
- 相机 `Camera`
- 渲染器 `Renderer`

## 物体形状： 几何体 Geometry

- 长方体 `BoxGeometry`
- 圆柱体 `CylinderGeometry`
- 球体 `SphereGeometry`
- 圆锥 `ConeGeometry`
- 矩形平面 `PlaneGeometry`
- 圆平面 `CircleGeometry`

## 物体外观： 材质 Material

- 网格基础材质 `MeshBasicMaterial`
- 网格漫反射材质 `MeshLambertMaterial`
- 网格高光材质 `MeshPhongMaterial`
- 物理材质 `MeshStandardMaterial` | `MeshPhysicalMaterial`
- 点材质 `PointsMaterial`
- 线基础材质 `LineBasicMaterial`
- 精灵材质 `SpriteMaterial`

## 物体： 网格模型 Mesh

```js
// 传入几何体geometry、材质material
const mesh = new THREE.Mesh(geometry, material)
```

### 模型位置： .position

```js
// 设置网格模型在三维空间中的位置坐标，默认是坐标原点
mesh.position.set(0, 0, 0)
```

### 添加网格模型到场景 scene.add

```js
scene.add(mesh)
```


## 相机

- `OrthographicCamera` 正投影相机
- `PerspectiveCamera` 透视投影相机

### PerspectiveCamera 透视投影相机

本质上是模拟人眼观察这个世界的规律，透视投影相机的四个参数 `fov`, `aspect`, `near`, `far` 构成一个四棱台 `3D` 空间，被称为视锥体，只有视锥体之内的物体，才会渲染出来，视锥体范围之外的物体不会显示在 `Canvas` 画布上。

宽高比 `aspect = width / height`

| 参数 | 含义 | 默认值 |
| - | - | - |
| `fov` | 相机视椎体竖直方向视野角度 | `50` |
| `aspect` | 相机视椎体水平方向和竖直方向长度比，一般设置为 `Canvas` 画布宽高比 `width/height` | `1` |
| `near` | 相机视椎体近裁界面相对相机距离 | `0.1` |
| `far` | 相机视椎体远裁面相对相机距离，`far-near` 构成了视椎体高度方向 | `2000` |

```js
// 实例化一个透视投影相机对象
const camera = new THREE.PerspectiveCamera()
```

#### 相机位置 .position

```js
camera.position.set(200, 200, 200)
```

#### 相机观察目标 .lookAt()

```js
camera.lookAt(0, 0, 0)
camera.lookAt(mesh.position)
```

## WebGL 渲染器 WebGLRenderer

### 创建渲染器对象

```js
// 创建渲染器对象
const renderer = new THREE.WebGLRenderer()
```

### 设置 Canvas 画布尺寸 .setSize()

```js
// 定义threejs输出画布的尺寸(单位:像素px)
const width = 800; //宽度
const height = 500; //高度
renderer.setSize(width, height); //设置three.js渲染区域的尺寸(像素px)
```

### 渲染器 Canvas 画布属性 .domElement

渲染器 `WebGLRenderer` 通过属性 `.domElement` 可以获得渲染方法 `.render()` 生成的 `Canvas` 画布，`.domElement` 本质上就是一个 `HTML` 元素： `Canvas` 画布。

```js
document.body.appendChild(renderer.domElement);
```

### 渲染器方法 .render()

渲染器 `WebGLRenderer` 执行渲染方法 `.render()` 就可以生成一个 `Canvas` 画布(照片)，并把三维场景 `Scene` 呈现在 `canvas` 画布上面，你可以把 `.render()` 理解为相机的拍照动作“**咔**”。

```js
renderer.render(scene, camera); //执行渲染操作
```

### 让物体动起来

```js
// 使用 requestAnimationFrame 渲染
const render = () => {
  requestAnimationFrame(render);
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;
  renderer.render(scene, camera);
}
render();
```

## 三维坐标系

### 辅助观察坐标系

`THREE.AxesHelper()` 的参数表示坐标系坐标轴线段尺寸大小，你可以根据需要改变尺寸。

```js
const axesHelper = new THREE.AxesHelper(150)
scene.add(axesHelper)
```

`three.js` 坐标轴颜色红`R`、绿`G`、蓝`B`分别对应坐标系的`x`、`y`、`z`轴，对于 `three.js` 的 `3D` 坐标系默认 `y` 轴朝上。


## 光源

基础材质不受光照影响，漫反射材质、高光材质、物理材质 受光照影响

- 环境光 `AmbientLight`
- 点光源 `PointLight`
- 聚光灯光源 `SpotLight`
- 平行光 `DirectionalLight`

### 生成光源

```js
//点光源：两个参数分别表示光源颜色和光照强度
// 参数1：0xffffff是纯白光,表示光源颜色
// 参数2：1.0,表示光照强度，可以根据需要调整
const pointLight = new THREE.PointLight(0xffffff, 1.0);
```

### 光源位置

```js
//点光源位置
pointLight.position.set(50, 0, 0); //点光源放在x轴上
```

### 添加光源到场景中

```js
scene.add(directionalLight); //点光源添加到场景中
```


## 点光源辅助观察 PointLightHelper

通过点光源辅助观察对象 `PointLightHelper` 可视化光源

```js
// 光源辅助观察
const pointLightHelper = new THREE.PointLightHelper(pointLight, 10)
scene.add(pointLightHelper)
```


## 相机控件 OrbitControls

开发时可以通过相机控件 `OrbitControls` 实现旋转缩放预览效果。需要另外引入轨道控制器扩展库 `OrbitControls.js`。

- 旋转： 拖动鼠标左键
- 缩放： 滚动鼠标中键
- 平移： 拖动鼠标右键

```js
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 设置相机控件轨道控制器OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
// 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
controls.addEventListener('change', function () {
    // renderer.render(scene, camera); //执行渲染操作， 在render 里渲染了这里就不用重复了
    // 浏览器控制台查看相机位置变化
    console.log('camera.position',camera.position);
});//监听鼠标、键盘事件
```

`OrbitControls` 本质上就是改变相机的参数，比如相机的位置属性，改变相机位置也可以改变相机拍照场景中模型的角度，实现模型的 `360` 度旋转预览效果，改变透视投影相机距离模型的距离，就可以改变相机能看到的视野范围


## 全屏渲染

使用 `window.innerWidth` 、`window.innerHeight` 设置画布宽高。记得设置 `css`

```css
body {
  overflow: hidden;
  margin: 0px;
}
```

### 画布大小变化

`canvas` 画布宽高动态变化，需要更新相机和渲染参数，否则无法正常渲染

```js
// 窗口大小变化
window.resize = function() {
  // 重置渲染器尺寸
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 全屏下，设置观察范围长宽比 aspect 为窗口宽高比
  camera.aspect = window.innerWidth / window.innerHeight;
  // 渲染器执行 renderer 方法的时候会读取相机对象的投影矩阵属性 projectionMatrix
  // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵，节约计算资源
  // 如果相机的一些属性发生了变化，需要执行 updateProjectionMatrix() 方法更新相机的投影矩阵
  camera.updateProjectionMatrix();
}
```


## stats.js 查看 threejs 渲染帧率

`threejs` 每执行 `WebGL` 渲染器的 `.render()` 方法一次，就在画布上得到一帧图像，所以场景越复杂则渲染性能越低，也就每秒钟执行 `.render()` 的次数越低。

通过 `stats.js` 库可以查看 `threejs` 当前的渲染性能，即渲染帧率（`FPS`），一般渲染达到每秒 `60` 次为最佳状态。

```js
// 引入 stats.js
import Stats from 'three/addons/libs/stats.module.js';

// 创建 stats 对象
const stats = new Stats()
document.body.appendChild(stats.domElement)

// 渲染函数
// 使用 requestAnimationFrame 渲染
const render = () => {
  // 调用 stats.update
  stats.update();

  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;

  // light.rotation.x += 0.1;
  // light.rotation.y += 0.1;

  // 渲染
  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
}
render();
```

### stats.setMode(mode)

```js
// stats.domElement显示：渲染帧率  刷新频率 和 一秒渲染次数 
stats.setMode(0);//默认模式
//stats.domElement显示：渲染周期 渲染一帧多长时间(单位：毫秒ms)
stats.setMode(1);
```

### 性能测试

控制长方体模型数量，增加或减少看看帧率变化，这也与电脑性能有关

```js
const getRandomColor = () => {
  let hex = Math.floor(Math.random() * 16777216).toString(16);
  while(hex.length < 6) {
    hex = '0' + hex;
  }
  return '#' + hex;
}
// 随机创建大量的模型,测试渲染性能，调整 num 值查看页面帧率变化
const num = 10; //控制长方体模型数量
for (let i = 0; i < num; i++) {
  for (let j = 0; j < num; j++) {
    for (let k = 0; k < num; k++) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshLambertMaterial({
        color: getRandomColor(),
        transparent: true,
        opacity: 0.8,
      });
      const mesh = new THREE.Mesh(geometry, material);
      // 随机生成长方体xyz坐标
      const x = i * 2
      const y = k * 2
      const z = j * 2
      mesh.position.set(x, y, z)
      scene.add(mesh); // 模型对象插入场景中
    }
  }
}
```

## 几何体双面可见

`threejs` 的材质默认正面可见，反面不可见，对于矩形平面 `PlaneGeometry`、圆形平面 如果想看到两面，可以设置 `side: THREE.DoubleSide`

```js
//默认只有正面可见
new THREE.MeshBasicMaterial({
  side: THREE.FrontSide,
});
// 设置 两面可见
new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
});
```

## 高光材质

```js
// 球体 几何体
const sphereGeometry = new THREE.SphereGeometry(2);
// 高光网格材质
// 模拟镜面反射，产生一个高光效果
const phongMaterial = new THREE.MeshPhongMaterial({
  color: 0xF80888,
  shininess: 40, //高光部分的亮度，默认30
  specular: 0xFFFFFF, //高光部分的颜色
});
// 网格模型
const mesh2 = new THREE.Mesh(sphereGeometry, phongMaterial);
// 网格模型位置，默认原点
mesh2.position.set(10, 20, 10);
scene.add(mesh2);
```


## WebGL 渲染器设置

### 渲染器锯齿属性 .antialias

```js
// 开启锯齿模糊，几何体过渡更加平滑自然
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
// 或者
renderer.antialias = true;
```

### 设备像素比 .setPixelRatio()

如果你遇到你的 `canvas` 画布输出模糊问题，注意设置 `renderer.setPixelRatio(window.devicePixelRatio)`

注意：注意你的硬件设备设备像素比 `window.devicePixelRatio` 刚好是 `1` ，那么是否执行 `.setPixelRatio()` 不会有明显差异，不过为了适应不同的硬件设备屏幕，通常需要执行该方法。

```js
// 获取你屏幕对应的设备像素比.devicePixelRatio告诉threejs,以免渲染模糊问题
renderer.setPixelRatio(window.devicePixelRatio);
```

### 设置背景颜色 .setClearColor()

```js
renderer.setClearColor(0x444444, 1); //设置背景颜色
```


## gui.js 库 - 可视化改变三维场景

`dat.gui.js` 是一个前端 `js` 库，对 `HTML` 、 `CSS` 和 `JavaScript` 进行了封装，借助 `dat.gui.js` 可以快速创建控制三维场景的 `UI` 交互界面，场景中的参数往往需要以可视化的方式调试出来。

`gui` 实例主要包含以下方法：

- `.add`(控制对象，对象具体属性，其他参数) 其他参数一般是对象具体属性可调试的数值区间
- `.name`(属性命名) 设置属性命名
- `.step`(步长) 设置步长
- `.addColor`(控制对象, `'color'`) 生成颜色值改变的交互界面
- `.onChange((value) => {})`  属性改变时触发

### .add 方法中的参数

- 参数 `3` 和参数 `4` 分别是数字，交互界面是拖动条
- 参数 `3` 是数组，则交互界面是下拉菜单
- 参数 `3` 是对象，则交互界面是下拉菜单
- 如果 `.add` 改变属性的对应的数据类型如果是布尔值，则交互界面是一个单选框


```js
// 引入dat.gui.js的一个类GUI
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

// 创建一个GUI
const gui = new GUI();
//改变交互界面style属性
gui.domElement.style.right = '0px';
gui.domElement.style.width = '300px';
// 通过GUI改变对象属性，其余参数为数值
gui.add(pointLight, 'intensity', 0, 2.0).name('环境光强度');
gui.add(mesh.position, 'y', 0, 30).step(2).name('y轴');
// .add 的其余参数为对象 、 数组，gui界面为下拉选择
gui.add(material, 'transparent', { 开: true, 关: false}).name('开启透明');
gui.add(material, 'opacity', [0.2, 0.4, 0.6, 0.8, 1]).name('透明度');
// .add 的其余参数为 布尔值
const isMove = { bool: true };
gui.add(isMove, 'bool').name('矩形动画');
// 球体颜色
gui.addColor(phongMaterial, 'color').name('球体颜色').onChange(function(color) {
  // renderer.setClearColor(color, 1);
});
```

### gui界面分组 .addFolder()

`gui` 页面分组可 嵌套

```js
// 创建子菜单
const boxFolder = gui.addFolder('矩形');
// 折叠，对应的 .open() , 默认是 open
boxFolder.close();
boxFolder.add(mesh.position, 'y', 0, 30).step(2).name('y轴');
const isMove = { bool: true };
boxFolder.add(isMove, 'bool').name('矩形动画');
// 嵌套子菜单
const transparentFolder = boxFolder.addFolder('透明');
transparentFolder.add(material, 'transparent', { 开: true, 关: false}).name('开启透明');
transparentFolder.add(material, 'opacity', [0.2, 0.4, 0.6, 0.8, 1]).name('透明度');

// 创建子菜单
const sphereFolder = gui.addFolder('球体');
// 球体颜色
sphereFolder.addColor(phongMaterial, 'color').name('球体颜色').onChange(function(color) {
  // renderer.setClearColor(color, 1);
});
```


## html-demo

[threejs-html-demo](https://gitee.com/lafen/threejs-html-demo)
