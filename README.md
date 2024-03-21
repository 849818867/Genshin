# 元神渲染复刻  ![](https://img.shields.io/badge/vuejs-3.2.36-blue)  ![](https://img.shields.io/badge/threejs-0.157.0-orange) ![](https://img.shields.io/badge/tweakpane-3.0.5-lightgreen) ![](https://img.shields.io/badge/stats.js-0.17.0-pink)

<div align="center">
  <img src="https://github.com/849818867/Genshin/blob/main/logo/logo.png?raw=true" width="800px" height="368px"/>
</div><br>

感谢`gamemcu`大佬提供的渲染案例，从中学习到了不少三维知识。[:zap:项目演示](http://pj-genshin.cn/)<br>

`web3d前端渲染`作为一个小众领域关注度不高且学习成本不低，越学越觉得坑很深，如果能看到这个项目说明兄弟你也是一位孤勇者。言归正传，在上手项目之前你需要对以下概念有所了解：
+ `threejs`： web3d前端渲染需要借助图形api(`webgl`或`webgpu`)实现，threejs则是基于webgl封装的渲染库，提供更简单的web3d实现方案。
+ `web图形渲染管线`： webgl是基于图形渲染管线的实现，需要去了解`cpu数据`=>`顶点着色器`=>`光栅化`=>`片元着色器`=>`成像`的大概过程。
+ `计算机图形学基础`： 了解`成像原理`、`常见光照模型`、`pbr材质`、`阴影`、`全局环境光照`等概念。

## :wrench:安装执行
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

## :bookmark:项目结构
当前采用Monorepo方式实现单仓库多项目管理，这种模式有助于简化代码共享、版本管理的复杂性。
```
|-doraemon  #资源管理库，封装了threejs中的部分功能，用于组织项目中的渲染对象以及功能组件。
|-genshin  #元神渲染页面代码，通过软连接可以直接使用doraemon中导出的对象方法。
|-logo  #readme中所需图片
```


## :rocket:性能优化
#### :tada:自定义PBR
threejs自带的pbr(Physically-Based Rendering)材质在性能上存在瓶颈，场景中大量使用pbr会使得渲染开销很大。个人猜测可能由于默认的MeshPhysicalMaterial需要满足各种功能(如fog、多光源计算)从而使得shader逻辑较为复杂，作为框架这样的设计也是一种权衡。本项目中部分物体的材质是基于实时渲染中常用的Cook-Torrance模型修改得到，因此需要我们通过自定义shader去实现完整的PBR光照模型，这样不仅可以满足渲染效果要求，还能缓解pbr性能压力。Cook-Torrance模型的具体数学原理可以参考[:zap:BRDF（Cook-Torrance 模型）](http://pj-genshin.cn/)。下图对比了在未开启独显时自定义的pbr和threejs自带pbr之间的性能指标，可见自带pbr中确实存在一定性能瓶颈。

  | 材质 | 效果 | 帧数 |渲染延时|内存占用|
|-------|-------|-------|-------|-------|
| Threejs PBR | <img src="https://github.com/849818867/Genshin/blob/main/logo/standard.png" width="200px" height="120px"/> | 14fps |56ms|220mb|
| Cook-Torrance PBR | <img src="https://github.com/849818867/Genshin/blob/main/logo/pbr.png" width="200px" height="120px"/> | 22fps |44ms|119mb|


<br>


#### :fire:实例化渲染
实例化渲染是指一次绘制多个渲染对象的技术，由gpu执行批处理。cpu在准备数据时既要获得几何体顶点，又需要将绘制数量、每个渲染对象的变换矩阵一起打包，传递给gpu使用。gpu批处理的时候会先进行每个对象的特有的矩阵变换，在执行正常的渲染流程。简单的说就是我们复制了多个渲染对象，然后单独设置每个对象的仿射变换来达到一次渲染多个的目的。需要注意的是，所以实例化渲染的对象只能使用同一个shader，因此这种方法更适合渲染数量多且相似的物体。
```js
const instanceMesh = new THREE.InstancedMesh(
    geometry,
    material,
    num
)

// i是渲染对象索引 mat是变换矩阵
instanceMesh.setMatrixAt(i, mat);

instanceMesh.instanceMatrix.needsUpdate = true;
```

