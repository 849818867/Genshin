# 元神渲染复刻  ![](https://img.shields.io/badge/vuejs-3.2.36-blue)  ![](https://img.shields.io/badge/threejs-0.157.0-orange) ![](https://img.shields.io/badge/tweakpane-3.0.5-lightgreen) ![](https://img.shields.io/badge/stats.js-0.17.0-pink)

<div align="center">
  <img src="https://github.com/849818867/Genshin/blob/main/logo/logo.png?raw=true" width="800px" height="368px"/>
</div><br>

感谢`gamemcu`大佬提供的渲染案例，从中学习到了不少三维知识。[:zap:项目演示](http://pj-genshin.cn/)<br>

`web3d前端渲染`作为一个小众领域关注度不高且学习成本不低，典型吃力不讨好，如果能看到这个项目说明兄弟你也是一位孤勇者。言归正传，在上手项目之前你需要对以下概念有所了解：
+ `threejs`： web3d前端渲染需要借助图形api(`webgl`或`webgpu`)实现，threejs则是基于webgl封装的渲染库，提供更简单的web3d实现方案。
+ `web图形渲染管线`： webgl是基于图形渲染管线的实现，需要去了解`cpu数据`=>`顶点着色器`=>`光栅化`=>`片元着色器`=>`成像`的大概过程。
+ `计算机图形学基础`： 了解`成像原理`、`常见光照模型`、`pbr材质`、`阴影`、`全局环境光照`等概念。

## Installation
```
// 克隆项目
git clone https://github.com/849818867/Genshin.git

// 进入项目目录
cd .\Genshin\

// 安装依赖
pnpm install

// 该项目采用monorepo结构进行组织，genshin是渲染页面的目录
cd .\genshin\

// 启动项目
pnpm run dev
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
