import * as THREE from '../three.js-master/build/three.module.js';
import { cherryPos } from '../shaders/cherryPos.js';
import { cherryVel } from '../shaders/cherryVel.js';
import { cherryfrag } from '../shaders/cherryfrag.js';
import { cherryvert } from '../shaders/cherryvert.js';


import { GPUComputationRenderer } from '../three.js-master/examples/jsm/misc/GPUComputationRenderer.js';

export default class Cherry {

  constructor(renderer, width, x, y, z) {
    this.renderer = renderer;

    this.computeRenderer;
    this.width = width;
    this.particles = width * width;

    this.obj;

    this.time = 0;
    this.clock = new THREE.Clock();

    this.comTexs = {
      position: {
        texture: null,
        uniforms: null,
      },
      velocity: {
        texture: null,
        uniforms: null,
      },
    }

    this.x = x;
    this.y = y;
    this.z = z;

    this.initComputeRenderer();
    this.createCherry();
  }

  initComputeRenderer() {
    this.computeRenderer = new GPUComputationRenderer(this.width, this.width, this.renderer);

    let initPositionTex = this.computeRenderer.createTexture();
    let initVelocityTex = this.computeRenderer.createTexture();

    this.initPosition(initPositionTex);
    // this.initVelocity(initVelocityTex);

    // shader
    this.comTexs.position.texture = this.computeRenderer.addVariable("texturePosition", cherryPos, initPositionTex);
    this.comTexs.velocity.texture = this.computeRenderer.addVariable("textureVelocity", cherryVel, initVelocityTex);

    this.computeRenderer.setVariableDependencies(this.comTexs.position.texture, [this.comTexs.position.texture, this.comTexs.velocity.texture]);
    this.comTexs.position.uniforms = this.comTexs.position.texture.material.uniforms;

    this.computeRenderer.setVariableDependencies(this.comTexs.velocity.texture, [this.comTexs.position.texture, this.comTexs.velocity.texture]);
    this.comTexs.velocity.uniforms = this.comTexs.velocity.texture.material.uniforms;
    this.comTexs.velocity.uniforms.time = { type: "f", value: 0 };

    this.computeRenderer.init();
  }

  update() {
    this.time += this.clock.getDelta();
    this.uni.time.value = this.time;

    this.computeRenderer.compute();
    this.comTexs.velocity.uniforms.time.value = this.time;
    this.uni.texturePosition.value = this.computeRenderer.getCurrentRenderTarget(this.comTexs.position.texture).texture;
    this.uni.textureVelocity.value = this.computeRenderer.getCurrentRenderTarget(this.comTexs.velocity.texture).texture;
  }

  initPosition(tex) {
    var texArray = tex.image.data;
    let r = 3;

    for (let i = 0; i < texArray.length; i += 4) {
      let x, y, z, rr;
      do {

        x = (Math.random() * 2 - 1) * r;
        y = (Math.random() * 2 - 1) * r;
        z = (Math.random() * 2 - 1) * r;

        rr = x * x + y * y + z * z;

      } while (rr > r);

      rr = Math.sqrt(rr);
      x *= rr;
      z *= rr;
      y *= rr;

      texArray[i + 0] = x + this.x;
      texArray[i + 1] = y + this.y;
      texArray[i + 2] = z + this.z;
      texArray[i + 3] = 0.0;
    }
  }

  // initVelocity(tex){
  //     var texArray = tex.image.data;
  //     for(var i = 0; i < texArray.length; i += this.length * 4){
  //         texArray[i + 0] = 0;
  //         texArray[i + 1] = 0;
  //         texArray[i + 2] = 0;
  //         texArray[i + 3] = 0;
  //     }
  // }

  createCherry() {
    let geo = new THREE.BufferGeometry();
    let position = new Float32Array(this.particles * 3);
    let p = 0;
    for (let i = 0; i < this.particles; i++) {
      position[p++] = 0;
      position[p++] = 0;
      position[p++] = 0;
    }

    let uv = new Float32Array(this.particles * 2);
    p = 0;
    for (let j = 0; j < this.width; j++) {
      for (let k = 0; k < this.width; k++) {
        uv[p++] = k / (this.width - 1);
        uv[p++] = j / (this.width - 1);
      }
    }

    geo.addAttribute('position', new THREE.BufferAttribute(position, 3));
    geo.addAttribute('uv', new THREE.BufferAttribute(uv, 2));

    const loader = new THREE.TextureLoader();// テクスチャローダーを作成
    const texture = loader.load('../Assets/asset5.png');// テクスチャ読み込み
    this.uni = {
      time: { value: 0.0 },
      cherry: { value: texture },
      texturePosition: { value: null },
      textureVelocity: { value: null },
    }

    let mat = new THREE.ShaderMaterial({
      uniforms: this.uni,
      vertexShader: cherryvert,
      fragmentShader: cherryfrag,
    });

    this.obj = new THREE.Points(geo, mat);
    this.obj.matrixAutoUpdate = false;
    this.obj.updateMatrix();
  }
}