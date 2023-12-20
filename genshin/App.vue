<template>
  <div id="webgl" ref="webglRef"></div>
  <div class="loader-screen">
    <div class="loading">
      <img src="./Genshin/Genshin.png">
      <progress class="progress-bar" :value="progressValue" max="1"></progress>
    </div>
  </div>
  <img class="door-button" src="/Genshin/ClickMe.png" @click="handleDoorGenerate">
  <div class="start-wrapper">
    <span class="start-button" @click="handleStart">原神！启动</span>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";

import Experience from './src/Experience'
import './App.css'

const webglRef = ref<any>()
const progressValue = ref<number>(0)
let experience, world

nextTick(() =>
{
  experience = new Experience(webglRef.value, progressValue)
  world = experience.world
})

// 创建传送门
const handleDoorGenerate = () =>
{
  // 创建传送门
  world.road.activeDoor()

  // 调整角色pose
  world.avatar.poseTo()
}

// 开始游戏
const handleStart = () =>
{
  // 打开传送门
  world.road.openDoor()
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  cursor: url("/Genshin/T_Mouse.png"), default;
}

#app {
  height: 100%;
  overflow: hidden;
}

#webgl {
  height: 100%;
}

.door-button {
  width: 50px;
  height: 50px;
  position: absolute;
  right: 5%;
  bottom: 20%;
  opacity: 0;
  transition: all 0.3s ease-in-out;
}

.start-wrapper {
  width: 100%;
  height: 32px;
  position: absolute;
  left: 0;
  bottom: 10%;
  background: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.482) 50%, rgba(0, 0, 0, 0) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.start-button {
  font-family: DFKai-SB, KaiTi, "楷体", serif;
  font-size: 18px;
  color: #fff;
}

.door-button:hover {
  scale: 1.1;
}
</style>