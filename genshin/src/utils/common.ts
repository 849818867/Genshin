import * as THREE from 'three'

const groupBy = (array: Array<any>, fun) =>
{
  let groups = {}
  array.forEach(element =>
  {
    let name = fun(element)
    groups[name] = groups[name] || []
    groups[name].push(element)
  });
  return groups
}


function debounce(func, delay)
{
  let timerId;

  return function ()
  {
    const context = this;
    const args = arguments;

    clearTimeout(timerId);

    timerId = setTimeout(() =>
    {
      func.apply(context, args);
    }, delay);
  };
}

const useSoundPlay = async (_scene: THREE.Scene, _camera: THREE.Camera): Promise<Function> =>
{
  const camera = _camera
  const scene = _scene

  await navigator.mediaDevices.getUserMedia({ audio: true })

  return (_bgmBuffer) =>
  {
    // 创建andio监听
    const listener = new THREE.AudioListener();
    // 创建一个audio源
    const sound = new THREE.Audio(listener);

    camera.add(listener);
    scene.add(sound)
    sound.setBuffer(_bgmBuffer)

    return sound
  }
}

export
{
  groupBy,
  debounce,
  useSoundPlay
}