import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
// import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// * 3차원 공간을 분할하는 자료구조: 3차원 공간을 효율적으로 분할하고 빠르게 충돌 검사를 할 수 있음
import { Octree } from 'three/examples/jsm/math/Octree.js';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';

const cameraValue = {
  fov: 50,
  near: 1,
  far: 10000,
  positionX: 0,
  positionY: 100,
  positionZ: 500,
};

class App {
  constructor() {
    const root = document.getElementById('root');
    this._root = root;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    root.appendChild(renderer.domElement);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;

    this._renderer = renderer;
    console.log(renderer);

    const scene = new THREE.Scene();
    this._scene = scene;

    // this._setupOctree()
    this._setupCamera();
    this._setupLight();
    this._setupModel();
    this._setupControls();
    this._setupBackground();

    const loader = new THREE.TextureLoader();
    loader.load(
      'https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg',
      function (texture) {
        scene.background = texture;
      }
    );

    window.onresize = this.resize.bind(this);
    this.resize();

    requestAnimationFrame(this.render.bind(this));
  }

  _setupBackground() {
    // console.log(this._scene);
    // const loader = new THREE.TextureLoader();
    // loader.load(
    //   'https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg',
    //   function (texture) {
    //     scene.background = texture;
    //   }
    // );
  }

  _setupControls() {
    this._controls = new OrbitControls(this._camera, this._root);
    this._controls.target.set(0, 0, 0);
    // this._controls.enablePan = false;
    // this._controls.enableDamping = true;

    const stats = new Stats();
    this._root.appendChild(stats.dom);
    this._fps = stats;

    this._pressedKeys = {};

    document.addEventListener('keydown', (e) => {
      this._pressedKeys[e.key.toLowerCase()] = true;
      this._processAnimation();
    });

    document.addEventListener('keyup', (e) => {
      this._pressedKeys[e.key.toLowerCase()] = false;
      this._processAnimation();
    });
  }

  _processAnimation() {}

  _setupLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this._scene.add(ambientLight);

    // this._addPointLight(1000, 300, 1000, 0xff0000);
    // this._addPointLight(-1000, 300, 1000, 0xffff00);
    // this._addPointLight(-1000, 300, -1000, 0x00ff00);
    // this._addPointLight(1000, 300, -1000, 0x0000ff);

    // const shadowLight = new THREE.DirectionalLight(0xf29886, 1);
    const shadowLight = new THREE.DirectionalLight(0xffffff, 1);
    shadowLight.position.set(-1000, 1500, 1000);
    shadowLight.target.position.set(-2000, -1000, -1000);
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      shadowLight,
      10
    );
    this._scene.add(directionalLightHelper);

    this._scene.add(shadowLight);
    // this._scene.add(shadowLight.target);
    console.log(shadowLight.target);

    shadowLight.castShadow = true;
    shadowLight.shadow.mapSize.width = 2000;
    shadowLight.shadow.mapSize.height = 1000;
    shadowLight.shadow.camera.top = shadowLight.shadow.camera.right = 4000;
    shadowLight.shadow.camera.bottom = shadowLight.shadow.camera.let = -2000;
    shadowLight.shadow.camera.near = 10;
    shadowLight.shadow.camera.far = 3500;
    shadowLight.shadow.radius = 5;
    const shadowCameraHelper = new THREE.CameraHelper(
      shadowLight.shadow.camera
    );
    this._scene.add(shadowCameraHelper);
  }

  _addPointLight(x, y, z, helperColor) {
    const color = 0xffffff;
    const intensity = 1.5;
    const pointLight = new THREE.PointLight(color, intensity, 1000);
    pointLight.position.set(x, y, z);
    this._scene.add(pointLight);
    const pointLightHelper = new THREE.PointLightHelper(
      pointLight,
      10,
      helperColor
    );
    this._scene.add(pointLightHelper);
  }

  _setupModel() {
    const loader = new GLTFLoader();

    loader.load('../public/gltf/space.glb', (gltf) => {
      const model = gltf.scene;
      model.position.x = 1800;
      model.position.z = 1000;

      this._scene.add(model);

      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    });

    loader.load('../public/gltf/character.glb', (gltf) => {
      const model = gltf.scene;
      model.position.x = 1800;
      model.position.z = 1000;

      this._scene.add(model);

      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
        }
      });

      const animationClips = gltf.animations;
      const mixer = new THREE.AnimationMixer(model);
      const animationsMap = {};
      animationClips.forEach((clip) => {
        const name = clip.name;
        animationsMap[name] = mixer.clipAction(clip);
      });

      this._mixer = mixer;
      this._animationMap = animationsMap;
      this._currentAnimationAction = this._animationMap['idle'];
      this._currentAnimationAction.play();

      const box = new THREE.Box3().setFromObject(model);
      // model.position.y = (box.max.y - box.min.y) / 2;

      const height = box.max.y - box.min.y;
      const diameter = box.max.z - box.min.z;
      console.log(height);
      console.log(diameter);
      model._capsule = new Capsule(
        new THREE.Vector3(0, 90.9 / 2, 0),
        new THREE.Vector3(0, 259 - 90.9 / 2, 0),
        90.9 / 2
      );
      console.log(model._capsule);

      const boxHelper = new THREE.BoxHelper(model);
      // this._scene.add(boxHelper);

      const axisHelper = new THREE.AxesHelper(10000);
      this._scene.add(axisHelper);

      this._boxHepler = boxHelper;
      this._model = model;
    });
  }

  _setupCamera() {
    const width = this._root.clientWidth;
    const height = this._root.clientHeight;
    const camera = new THREE.PerspectiveCamera(
      cameraValue.fov,
      width / height,
      cameraValue.near,
      cameraValue.far
    );
    camera.position.set(
      cameraValue.positionX,
      cameraValue.positionY,
      cameraValue.positionZ
    );
    this._camera = camera;
  }

  render() {
    this._renderer.render(this._scene, this._camera);
    requestAnimationFrame(this.render.bind(this));
  }

  resize() {
    const width = this._root.clientWidth;
    const height = this._root.clientHeight;

    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize(width, height);
  }
}

window.onload = function () {
  new App();
};
