# 元神渲染复刻  ![](https://img.shields.io/badge/vuejs-3.2.36-blue)  ![](https://img.shields.io/badge/threejs-0.157.0-orange) ![](https://img.shields.io/badge/tweakpane-3.0.5-lightgreen) ![](https://img.shields.io/badge/stats.js-0.17.0-pink)

![](https://github.com/penghuwan/water.js/blob/master/logo.png)

本项目是一个好玩的三维渲染案例，在学习代码前你需要对web3d开发的常见技术以及知识有所了解:
+ 正式性： 一看就知道这个库是认真写的
+ 优雅性： 给人以美好的视觉感受，和其他黑白两色的readMe区分开来
+ 装笔性：  有利于向他人展示自己代码的美好的一面

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
