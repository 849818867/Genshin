import * as THREE from 'three'
import { Component, UniformInjector } from "../components"
import { Doraemon } from '../doraemon'


const defaultVertexShader = /* glsl */ `
varying vec2 vUv;

void main(){
    vec3 p=position;
    gl_Position=vec4(p,1.);
    
    vUv=uv;
}
`;

const defaultFragmentShader = /* glsl */ `
uniform float uTime;
uniform vec3 uResolution;

varying vec2 vUv;

void main(){
    vec2 p=vUv;
    vec3 color=vec3(p,0.);
    gl_FragColor=vec4(color,1.);
}
`;

export interface PlaneCofig
{
  vertexShader: string;
  fragmentShader: string;
  uniforms: { [uniform: string]: THREE.IUniform<any> };
}

export class ScreenPlane extends Component
{
  uniformInjector
  geometry
  material
  mesh

  constructor(_doraemon: Doraemon, _config: Partial<PlaneCofig>)
  {
    super(_doraemon)

    const {
      vertexShader = defaultVertexShader,
      fragmentShader = defaultFragmentShader,
      uniforms = {},
    } = _config

    this.uniformInjector = new UniformInjector(_doraemon);

    // 覆盖-1-1范围，通过vertexshader覆盖全屏
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        ...this.uniformInjector.shaderUniforms,
        ...uniforms
      },
      side: THREE.DoubleSide
    })

    this.material = material
    this.geometry = geometry
    this.mesh = new THREE.Mesh(geometry, material)
  }

  addExisting(): void
  {
    this.scene.add(this.mesh);
  }

  addUpdate()
  {
    const uniforms = this.material.uniforms;
    this.uniformInjector.injectShaderUniforms(uniforms);
  }
}