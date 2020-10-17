
import * as THREE from './three.js-master/build/three.module.js';
import { OrbitControls } from './three.js-master/examples/jsm/controls/OrbitControls.js';

//===============================================================
// Template
//===============================================================
window.addEventListener('load', function () {
    init();
});


let scene, camera, renderer;
let orbitControls;

function init() {
    //シーン、カメラ、レンダラーを生成
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0.0, 50, 50);
    scene.add(camera);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    //OrbitControls
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
    orbitControls = new OrbitControls(camera, renderer.domElement);

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
    const axes = new THREE.AxesHelper(1000);
    axes.position.set(0, 0, 0);
    scene.add(axes);

    //グリッドの生成
    const grid = new THREE.GridHelper(100, 100);
    scene.add(grid);
}

function setLight() {
    //環境光
    const ambientLight = new THREE.AmbientLight(0xFFFFFF);
    scene.add(ambientLight);
}

function rendering() {
    requestAnimationFrame(rendering);
    orbitControls.update();
    renderer.render(scene, camera);
}
