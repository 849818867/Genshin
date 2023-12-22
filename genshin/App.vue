<template>
  <div id="webgl" ref="webglRef"></div>
  <div class="loader-screen">
    <div class="loading">
      <img src="./Genshin/Genshin.png">
      <progress class="progress-bar" :value="progressValue" max="1"></progress>
    </div>
  </div>
  <img class="door-button" ref="buttonRef" src="/Genshin/ClickMe.png" @click.once="handleDoorGenerate">
  <div class="start-wrapper" ref="startRef">
    <span class="start-button" @click.once="handleStart">原神！启动</span>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import * as doraemon from 'doraemonjs'

import Experience from './src/Experience'
import './App.css'

const webglRef = ref<any>()
const progressValue = ref<number>(0)
const startRef = ref(null)
const buttonRef = ref(null)
let experience, world

nextTick(() =>
{
  experience = new Experience(webglRef.value, progressValue)
  world = experience.world
})

// 创建传送门
const handleDoorGenerate = async () =>
{
  // 创建传送门
  world.road.activeDoor()

  // 点击音效
  world.clickMusicPlayer.play()

  // 调整角色pose
  await world.avatar.poseTo()

  startRef.value?.classList.add("start-hollow");
}

// 开始游戏
const handleStart = async () =>
{
  // 打开传送门
  world.road.openDoor()

  // 穿过音效
  world.openMusicPlayer.play()

  // 相机进入门内
  world.firstCamera.diveIn()

  await doraemon.sleep(1000)
  // 停止bgm
  world.bgmPlayer.pause()

  // 移除按钮
  buttonRef.value?.classList.remove("button-hollow");
  startRef.value?.classList.remove("start-hollow");

  // 清除场景
  experience.destroy()
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
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.482) 50%, rgba(0, 0, 0, 0) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: all 0.5s ease-in-out;
}

.start-button {
  font-family: DFKai-SB, KaiTi, "楷体", serif;
  font-size: 18px;
  color: #fff;
  transition: all 0.2s ease-in-out;
}

/* .start-button:hover {
  scale: 1.1;
} */

.start-wrapper:hover {
  width: 300px;

}

.door-button:hover {
  scale: 1.1;
}
</style>