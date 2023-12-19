import * as THREE from 'three'

// 下载文件
const downloadBlob = (blob: Blob, name: string) =>
{
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style.display = "none";
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = name;
  a.click();
};

// sleep
const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

// 开启阴影
const enableShadow = (renderer: THREE.WebGLRenderer) =>
{
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
};

export
{
  downloadBlob,
  sleep,
  enableShadow
}