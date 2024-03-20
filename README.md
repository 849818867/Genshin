# 元神渲染复刻  ![](https://img.shields.io/badge/vuejs-3.2.36-blue)  ![](https://img.shields.io/badge/threejs-0.157.0-orange) ![](https://img.shields.io/badge/tweakpane-3.0.5-lightgreen) ![](https://img.shields.io/badge/stats.js-0.17.0-pink)

![](https://github.com/penghuwan/water.js/blob/master/logo.png)

这是一个好玩的三维渲染案例，感谢gamemcu大佬提供的渲染案例，学习到了不少知识。本项目复刻了元神登录页面渲染效果，作为学习项目你需要对web3d基础知识有所了解:
+ 了解threejs： web3d前端渲染需要借助图形apiwebgl(将来webgpu)实现，threejs则是基于webgl封装的渲染库，提供更简单的web3d实现方案。
+ 了解web图形渲染管线： webgl是基于图形渲染管线的实现，需要去了解cpu数据=>顶点着色器=>光栅化=>片元着色器=>成像的大概过程。
+ 了解计算机图形学基础： 了解成像原理、常见光照模型、pbr材质、阴影原理、全局环境光照等概念。

## Installation
```
npm install water-js
```
## Examples
```js
const { water } = require('water-js')

function print() {
  const content = water(true);
  console.log(content);
}
```
output
```
// 输出
我就是来水的
```
## License
Water.js is MIT licensed.
