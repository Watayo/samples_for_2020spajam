
import * as THREE from './three.js-master/build/three.module.js';
import { OrbitControls } from './three.js-master/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from './three.js-master/examples/jsm/loaders/OBJLoader.js';
// effect
import { EffectComposer } from './three.js-master/examples/jsm/postprocessing/EffectComposer.js';
import { BloomPass } from './three.js-master/examples/jsm/postprocessing/BloomPass.js';
import { RenderPass } from './three.js-master/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from './three.js-master/examples/jsm/postprocessing/ShaderPass.js';
import { CopyShader } from './three.js-master/examples/jsm/shaders/CopyShader.js';
// cherry
import Cherry from './myLib/Cherry.js';
//===============================================================
// Template
//===============================================================
window.addEventListener('load', function () {
    init();
});


let scene, camera, renderer, composer;
let orbitControls;
let renderPass;
let cherry = [];

function init() {
    //シーン、カメラ、レンダラーを生成
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.set(0.0, 55, 55);

    scene.add(camera);

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // composer
    composer = new EffectComposer(renderer);

    // renderPass
    renderPass = new RenderPass(scene, camera);

    let effectBloom = new BloomPass(1.1, 25, 0.6, 1024);

    composer.addPass(renderPass);
    composer.addPass(effectBloom);

    let toScreen = new ShaderPass(CopyShader);
    toScreen.renderToScreen = true;
    composer.addPass(toScreen);

    //OrbitControls
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.target = new THREE.Vector3(0, 10, 0);

    //canvasを作成
    const container = document.getElementById("canvas-container");
    container.appendChild(renderer.domElement);

    //ウィンドウのリサイズに対応
    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    threeWorld();
    setLight();
    rendering();
}

function threeWorld() {
    //座標軸の生成
    const axes = new THREE.AxesHelper(40);
    axes.position.set(0, 0, 0);
    scene.add(axes);

    //グリッドの生成
    const grid = new THREE.GridHelper(100, 100);
    scene.add(grid);

    // OBJオブジェクトの生成
    // 3Dモデルデータ(OBJ)を読み込む
    const loader = new OBJLoader();
    // OBJマテリアル
    let OBJMaterial = new THREE.MeshLambertMaterial({ color: 0xccab9f });
    // objファイルのパスを指定
    loader.load('./three.js-master/examples/models/obj/tree.obj', function (object) {
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material = OBJMaterial;
            }
        });
        object.position.set(0, 0, 0);
        object.scale.multiplyScalar(32);
        scene.add(object);
    });

    // 桜エフェクト
    let num = 8;

    let a = 38;
    for (let i = 0; i < 53; i++) {
        cherry.push(new Cherry(renderer, num, (Math.random() - 1 / 2) * a, (Math.random() - 1 / 2) * 12 + 22, (Math.random() - 1 / 2) * a));
    }
    let aa = 16;
    for (let i = 0; i < 30; i++) {
        cherry.push(new Cherry(renderer, num, (Math.random() - 1 / 2) * aa, (Math.random() - 1 / 2) * 6 + 32, (Math.random() - 1 / 2) * aa));
    }

    for (let i = 0; i < cherry.length; i++) {
        scene.add(cherry[i].obj);
    }
}

function setLight() {
    const sakura = 0xffdfe1;
    //環境光
    const ambientLight = new THREE.AmbientLight(0x999999);
    scene.add(ambientLight);

    // 平行光源を作成
    const directionalLight = new THREE.DirectionalLight(sakura);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
}

function rendering() {
    requestAnimationFrame(rendering);
    orbitControls.update();
    // time = performance.now();
    // uniforms.time.value = time;
    for (let i = 0; i < cherry.length; i++) {
        cherry[i].update();
    }

    // renderer.render(scene, camera);
    composer.render();
}
