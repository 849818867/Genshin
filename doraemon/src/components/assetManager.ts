import * as THREE from "three"
import
{
  // DRACOLoader,
  EXRLoader,
  FontLoader,
  // GLTFLoader,
  KTX2Loader,
  OBJLoader,
  RGBELoader,
  SVGLoader,
  FBXLoader
} from "three-stdlib"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import { Component } from "./component"
import { Doraemon } from '../doraemon'

export type ResoureType =
  | "gltfModel"
  | "fbxModel"
  | "texture"
  | "cubeTexture"
  | "font"
  | "audio"
  | "objModel"
  | "hdrTexture"
  | "svg"
  | "exrTexture"
  | "video"
  | "ktx2Texture";

export interface ResourceItem
{
  name: string;
  type: ResoureType;
  path: string | string[];
}

export type ResourcesList = Array<ResourceItem>;

export interface AssetManagerConfig
{
  useDracoLoader: boolean;
  dracoDecoderPath: string;
  ktx2TranscoderPath: string;
}

export interface Loaders
{
  gltfLoader: GLTFLoader;
  fbxLoader: FBXLoader;
  textureLoader: THREE.TextureLoader;
  cubeTextureLoader: THREE.CubeTextureLoader;
  fontLoader: FontLoader;
  audioLoader: THREE.AudioLoader;
  objLoader: OBJLoader;
  hdrTextureLoader: RGBELoader;
  svgLoader: SVGLoader;
  exrLoader: EXRLoader;
  ktx2Loader: KTX2Loader;
}

export class AssetManager extends Component
{
  // 配置信息
  config: AssetManagerConfig;
  // 加载列表
  resourcesList: ResourcesList
  // 已加载文件
  items: any
  // 需要加载的数量
  toLoad: number
  // 已经加载数量
  loaded: number
  // loader列表
  loaders: Partial<Loaders>
  // loader加载函数
  loaderFun: any

  constructor(_doraemon: Doraemon, _resourcesList: ResourcesList, _config: Partial<AssetManagerConfig> = {})
  {
    super(_doraemon)

    // 获取config
    const {
      useDracoLoader = false,
      dracoDecoderPath = "https://www.gstatic.com/draco/versioned/decoders/1.4.3/",
      ktx2TranscoderPath = "https://unpkg.com/three/examples/jsm/libs/basis/",
    } = _config
    this.config = { useDracoLoader, dracoDecoderPath, ktx2TranscoderPath }

    // 获取resources
    this.resourcesList = _resourcesList
    this.items = {}
    this.toLoad = _resourcesList.length
    this.loaded = 0
    this.loaders = {}
    this.loaderFun = {}
    // 设置loaders
    this.setLoaders()
    // 设置draco解码器
    useDracoLoader ? this.setDracoLoader() : undefined
    //设置ktx2转码器
    this.setKTX2Loader()
    // 加载资源
    this.startLoading()
  }

  setLoaders()
  {
    Object.assign(this.loaders, {
      gltfLoader: new GLTFLoader(),
      fbxLoader: new FBXLoader(),
      textureLoader: new THREE.TextureLoader(),
      cubeTextureLoader: new THREE.CubeTextureLoader(),
      fontLoader: new FontLoader(),
      audioLoader: new THREE.AudioLoader(),
      objLoader: new OBJLoader(),
      hdrTextureLoader: new RGBELoader(),
      svgLoader: new SVGLoader(),
      exrLoader: new EXRLoader(),
      ktx2Loader: new KTX2Loader()
    })

    const getCallback = (loaderName: string) => (_resource: ResourceItem) =>
    {
      this.loaders[loaderName]?.load(_resource.path as any, file =>
      {
        this.resourceLoaded(_resource, file);
      });
    }

    this.loaderFun = {
      gltfModel: getCallback('gltfLoader'),
      fbxModel: getCallback('fbxLoader'),
      texture: getCallback('textureLoader'),
      cubeTexture: getCallback('cubeTextureLoader'),
      font: getCallback('fontLoader'),
      audio: getCallback('audioLoader'),
      objModel: getCallback('objLoader'),
      hdrTexture: getCallback('hdrTextureLoader'),
      svg: getCallback('svgLoader'),
      exrTexture: getCallback('exrLoader'),
      ktx2Texture: getCallback('ktx2Loader')
    }
  }

  // 设置draco解码器
  setDracoLoader()
  {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(this.config.dracoDecoderPath);
    this.loaders.gltfLoader?.setDRACOLoader(dracoLoader);
  }

  // 设置ktx2转码器
  setKTX2Loader()
  {
    this.loaders.ktx2Loader
      ?.setTranscoderPath(this.config.ktx2TranscoderPath)
      ?.detectSupport(this.doraemon.renderer);

    if (this.loaders.ktx2Loader)
    {
      this.loaders.gltfLoader?.setKTX2Loader(this.loaders.ktx2Loader);
    }
  }

  // 加载资源
  startLoading()
  {
    for (const resource of this.resourcesList)
    {
      // 根据type调用不同的loader
      this.loaderFun[resource.type](resource)
    }
  }

  // 加载完单个素材
  resourceLoaded(resource: ResourceItem, file: any)
  {
    this.items[resource.name] = file;
    this.loaded += 1;

    this.emit("load-progress", this.loadProgress);

    if (this.isLoaded)
    {
      this.emit("ready");
    }
  }

  // 加载进度
  get loadProgress()
  {
    return this.loaded / this.toLoad;
  }
  // 是否加载完毕
  get isLoaded()
  {
    return this.loaded === this.toLoad;
  }
}
