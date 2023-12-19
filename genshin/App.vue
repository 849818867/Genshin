<template>
  <div id="webgl" ref="webglRef"></div>
  <div class="loader-screen">
    <div class="loading">
      <img src="./Genshin/Genshin.png">
      <progress class="progress-bar" :value="progressValue" max="1"></progress>
    </div>
  </div>

  <img class="door-button" src="/Genshin/ClickMe.png" @click="handleDoorOpen">
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

const handleDoorOpen = () =>
{
  // 打开传送门
  world.road.activeDoor()

  // 调整角色pose
  world.avatar.poseTo()
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
}

.door-button:hover {
  scale: 1.05;
}
</style>