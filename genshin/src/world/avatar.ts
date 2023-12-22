import * as doraemon from 'doraemonjs'
import * as THREE from 'three'
import gsap from "gsap"

import Experience from '../Experience'
import { getToonMaterialAvatar } from '../utils'

export default class Avatar extends doraemon.Component
{
  params
  avatar
  animations
  mixer
  skeleton
  firstCamera
  isFollowCamera
  poseTo: Function

  constructor(_doraemon: Experience, _firstCamera)
  {
    super(_doraemon)

    this.isFollowCamera = true
    this.firstCamera = _firstCamera
    // 背景颜色层参数
    this.params = {
      color1: "#001c54",
      color2: "#023fa1",
      color3: "#26a8ff",
      stop1: 0.2,
      stop2: 0.6,
    };

    const avatar = this.doraemon.assetManager.items['QiQi'].scene
    this.avatar = avatar
    avatar.position.z = -50;
    avatar.position.y -= 500;
    avatar.rotation.y = Math.PI
    avatar.scale.multiplyScalar(25);
    avatar.traverse((mesh: THREE.Mesh) =>
    {
      if (mesh.isMesh)
      {
        // @ts-ignore
        const material = getToonMaterialAvatar(mesh.material)
        mesh.material = material
        // @ts-ignore
        mesh.material.roughness = 30;
        // @ts-ignore
        mesh.material.metalness = 0;
        mesh.receiveShadow = true
        mesh.castShadow = true
      }
    })

    this.skeleton = new THREE.SkeletonHelper(avatar);
    this.skeleton.visible = false;
    this.doraemon.scene.add(this.skeleton);

    // animation
    const actions = {}
    let currentStatus = {
      action: 'idle',
      direction: 'front',
      rotation: Math.PI,
      eventName: 'keyUp'
    }

    const animations = this.doraemon.assetManager.items['QiQi'].animations
    this.animations = animations

    this.mixer = new THREE.AnimationMixer(avatar)

    animations.forEach(_element =>
    {
      const name = _element.name

      const action = this.mixer.clipAction(_element)

      currentStatus.action === name ? action.setEffectiveWeight(1) : action.setEffectiveWeight(0)

      actions[name] = action

      actions[name].play()
    });

    function setWeight(action, weight)
    {
      action.enabled = true;
      action.setEffectiveTimeScale(1);
      action.setEffectiveWeight(weight);
    }

    const executeCrossFade = (startAction, endAction, duration) =>
    {

      if (endAction)
      {
        setWeight(endAction, 1);
        endAction.time = 0;

        if (startAction)
        {
          // Crossfade with warping
          startAction.crossFadeTo(endAction, duration, true);
        } else
        {
          // Fade in
          endAction.fadeIn(duration);
        }

      } else
      {
        // Fade out
        startAction.fadeOut(duration);
      }
    }

    const avatarOperation = (_options) =>
    {
      let { startActionName, endActionName, duration, speed, direction, directionRotation, eventName } = _options

      const currentAction = actions[startActionName]

      if (startActionName !== endActionName)
        executeCrossFade(currentAction, actions[endActionName], duration)

      // 设置当前状态
      currentStatus.action = endActionName

      currentStatus.direction = direction

      currentStatus.rotation = directionRotation

      currentStatus.eventName = eventName

      // 设置相机速度
      this.firstCamera.setSpeed(speed)

      // 设置相机方向
      this.firstCamera.setDirection(direction)

      // 人物旋转
      gsap.to(avatar.rotation, {
        y: directionRotation
      })
    }

    const controlCallback = {
      ArrowUp: () => avatarOperation({
        startActionName: currentStatus.action,
        endActionName: 'run',
        duration: 0.15,
        speed: 80,
        direction: 'front',
        directionRotation: Math.PI,
        eventName: 'ArrowUp'
      })
      ,
      ArrowDown: () => avatarOperation({
        startActionName: currentStatus.action,
        endActionName: 'run',
        duration: 0.15,
        speed: 0,
        direction: 'back',
        directionRotation: 0,
        eventName: 'ArrowDown'
      }),
      ArrowLeft: () => avatarOperation({
        startActionName: currentStatus.action,
        endActionName: 'run',
        duration: 0.15,
        speed: 80,
        direction: 'left',
        directionRotation: Math.PI * 1.5,
        eventName: 'ArrowLeft'
      }),
      ArrowRight: () => avatarOperation({
        startActionName: currentStatus.action,
        endActionName: 'run',
        duration: 0.15,
        speed: 80,
        direction: 'right',
        directionRotation: Math.PI * 0.5,
        eventName: 'ArrowRight'
      }),
      keyUp: () =>
      {
        avatarOperation({
          startActionName: currentStatus.action,
          endActionName: 'idle',
          duration: 0.15,
          speed: 0,
          direction: currentStatus.direction,
          directionRotation: currentStatus.rotation,
          eventName: 'keyUp'
        })

        const cameraCenter = this.firstCamera.getCenter()

        if (cameraCenter.x > 20) cameraCenter.x = 20
        else if (cameraCenter.x < -20) cameraCenter.x = -20

      },
    }

    // 监听keydown
    const keyDownCallback = (event) =>
    {
      // 相同事件不重复触发
      if (event.code === currentStatus.eventName) return
      // 根据按键code执行不同操作
      controlCallback[event.code]()
    }
    document.addEventListener('keydown', keyDownCallback)

    // 监听keyup
    const keyUpCallback = (event) =>
    {
      controlCallback['keyUp']()
    }
    document.addEventListener('keyup', keyUpCallback)

    // 切换登录pose
    this.poseTo = async () =>
    {
      // 关闭监听
      document.removeEventListener('keydown', keyDownCallback)
      document.removeEventListener('keyup', keyUpCallback)

      // 角色切换为walk
      avatarOperation({
        startActionName: currentStatus.action,
        endActionName: 'walk',
        duration: 0.25,
        speed: 35,
        direction: 'front',
        directionRotation: Math.PI * 1,
        eventName: 'walk'
      })
      console.log(currentStatus.action)

      // sleep
      await doraemon.sleep(3000)

      // 角色切换为idle
      avatarOperation({
        startActionName: currentStatus.action,
        endActionName: 'idle',
        duration: 0.15,
        speed: 0,
        direction: 'front',
        directionRotation: Math.PI * 1,
        eventName: 'idle'
      })
      this.emit("door-open");

      // 解除人物相机绑定
      this.isFollowCamera = false
    }
  }

  addExisting(): void
  {
    this.doraemon.scene.add(this.avatar)
  }

  addUpdate(): void
  {
    // 人物随着相机位置移动
    if (this.isFollowCamera)
    {
      this.avatar.position.copy(
        this.doraemon.camera.position.clone().add(new THREE.Vector3(0, -27, -100))
      )
    }

    // 更新人物动画
    const delta = this.doraemon.clock.deltaTime
    this.mixer.update(delta)

  }
}