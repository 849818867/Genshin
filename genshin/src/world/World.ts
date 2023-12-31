import * as doraemon from 'doraemonjs'
import * as THREE from 'three'

import { useSoundPlay } from '../utils'
import Experience from '../Experience'
import Background from './Background'
import FarCloud from './FarCloud'
import Column from './Column'
import AmbientLight from './AmbientLight'
import PolarLight from './PolarLight'
import DirectLight from './DirectLight'
import Cloud from './Cloud'
import Fog from './Fog'
import Stars from './Stars'
import Road from './road'
import FirstCamera from './FirstCamera'
import Avatar from './avatar'


export default class World extends doraemon.Component
{
  background
  farCloud
  column
  ambientLight
  polarLight
  directLight
  cloud
  fog
  stars
  road
  firstCamera
  avatar
  bgmBuffer
  clickMusicPlayer
  openMusicPlayer
  bgmPlayer

  constructor(_doraemon: Experience)
  {
    super(_doraemon)

    this.doraemon = _doraemon

    _doraemon.assetManager.on('ready', async () =>
    {
      await doraemon.sleep(1000)

      // 加载完成后隐藏载入界面
      document.querySelector(".loader-screen")?.classList.add("hollow");
      document.querySelector(".door-button")?.classList.add("button-hollow");


      // 场景场景雾
      this.doraemon.scene.fog = new THREE.Fog(0x389af2, 5000, 10000);
      // 创建并添加物体、光源
      this.background = new Background(_doraemon)
      this.background.addExisting()
      this.farCloud = new FarCloud(_doraemon)
      this.farCloud.addExisting()
      this.column = new Column(_doraemon)
      this.column.addExisting()
      this.ambientLight = new AmbientLight(_doraemon)
      this.ambientLight.addExisting()
      this.polarLight = new PolarLight(_doraemon)
      this.polarLight.addExisting()
      this.directLight = new DirectLight(_doraemon)
      this.directLight.addExisting()
      this.cloud = new Cloud(_doraemon)
      this.cloud.addExisting()
      this.fog = new Fog(_doraemon)
      this.fog.addExisting()
      this.stars = new Stars(_doraemon)
      this.stars.addExisting()
      this.firstCamera = new FirstCamera(_doraemon)
      this.road = new Road(_doraemon, this.firstCamera)
      this.road.addExisting()
      this.avatar = new Avatar(_doraemon, this.firstCamera)
      this.avatar.addExisting()

      // 创建音效
      this.creatMusic()
    })
  }

  async creatMusic()
  {
    // 生成音效
    const soundPlayerCreator = await useSoundPlay(this.doraemon.scene, this.doraemon.camera)

    // bgm
    const bgmBuffer = this.doraemon.assetManager.items['BGM']
    const bgmPlayer: THREE.Audio = soundPlayerCreator(bgmBuffer)
    bgmPlayer.setLoop(true);
    bgmPlayer.play();
    this.bgmPlayer = bgmPlayer

    // 点击创建传送门
    const duangBuffer = this.doraemon.assetManager.items['Genshin Impact [Duang]']
    const clickMusicPlayer: THREE.Audio = soundPlayerCreator(duangBuffer)
    clickMusicPlayer.setLoop(false);
    this.clickMusicPlayer = clickMusicPlayer

    // 打开传送门进入游戏
    const doorThroughBuffer = this.doraemon.assetManager.items['Genshin Impact [DoorThrough]']
    const openMusicPlayer: THREE.Audio = soundPlayerCreator(doorThroughBuffer)
    openMusicPlayer.setLoop(false);
    this.openMusicPlayer = openMusicPlayer
  }
}