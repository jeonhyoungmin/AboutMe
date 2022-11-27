import * as THREE from 'three';
import { ShaderChunk } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

class App {
  constructor() {
    const root = document.getElementById('root');
    this._root = root;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    root.appendChild(renderer.domElement);

    // * 그림자 추가 : 렌더러 처리
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;

    this._renderer = renderer;

    const scene = new THREE.Scene();
    this._scene = scene;

    this._setupCamera();
    this._setupLight();
    this._setupModel();
    this._setupControls();

    window.onresize = this.resize.bind(this);
    this.resize();

    requestAnimationFrame(this.render.bind(this));
  }

  _setupControls() {
    this._controls = new OrbitControls(this._camera, this._root);
    // * model을 카메라 중앙으로 오도록 세팅
    this._controls.target.set(0, 1, 0);
    console.log(this._controls);

    // * 초당 fps 표시
    const stats = new Stats();
    this._root.appendChild(stats.dom);
    this._fps = stats;
    // console.log(stats);
    // console.log(stats);
  }

  _setupCamera() {
    const width = this._root.clientWidth;
    const height = this._root.clientHeight;
    const camera = new THREE.PerspectiveCamera(5, width / height, 1, 20000);
    camera.position.set(0, 2, 50);
    this._camera = camera;
  }

  _addPointLight(x, y, z, helperColor) {
    // * 포인터 light
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

  _setupLight() {
    // * 기본 설정 light
    // const color = 0xffffff;
    // const intensity = 2;
    // const light = new THREE.DirectionalLight(color, intensity);
    // light.position.set(0, 0, 1);
    // this._scene.add(light);

    // * 주변광
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this._scene.add(ambientLight);

    this._addPointLight(100, 30, 100, 0xff0000);
    this._addPointLight(-100, 30, 100, 0xffff00);
    this._addPointLight(-100, 30, -100, 0x00ff00);
    this._addPointLight(100, 30, -100, 0x0000ff);

    // * 그림자 생성을 위한 directional light
    const shadowLight = new THREE.DirectionalLight(0xffffff, 0.1);
    shadowLight.position.set(100, 100, 100);
    shadowLight.target.position.set(0, 0, 0);
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      shadowLight,
      10
    );
    this._scene.add(directionalLightHelper);

    this._scene.add(shadowLight);
    this._scene.add(shadowLight.target);

    // * 그림자를 위한 광원 처리
    shadowLight.castShadow = true;
    shadowLight.shadow.mapSize.width = 1024;
    shadowLight.shadow.mapSize.height = 1024;
    shadowLight.shadow.camera.top = shadowLight.shadow.camera.right = 700;
    shadowLight.shadow.camera.bottom = shadowLight.shadow.camera.left = -700;
    shadowLight.shadow.camera.near = 100;
    shadowLight.shadow.camera.far = 900;
    shadowLight.shadow.radius = 5;
    const shadowCameraHelper = new THREE.CameraHelper(
      shadowLight.shadow.camera
    );
    this._scene.add(shadowCameraHelper);
  }

  _setupModel() {
    // * geometry 평면
    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x878787 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    this._scene.add(plane);
    // * 평면은 그림자를 받기만 함
    plane.receiveShadow = true;

    new GLTFLoader().load('../public/gltf/character.glb', (gltf) => {
      const model = gltf.scene;
      this._scene.add(model);

      // * model은 그림자를 생성하기만 함
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
        }
      });

      const animationClips = gltf.animations;
      console.log(animationClips);
      const mixer = new THREE.AnimationMixer(model);
      const animationsMap = {};
      animationClips.forEach((clip) => {
        const name = clip.name;
        console.log(name);
        animationsMap[name] = mixer.clipAction(clip);
      });

      // ! play하기 위해서는 mixer 객체를 통해서 캐릭터의 애니메이션을
      // ! 프레임마다 업데이트 해줘야 함
      this._mixer = mixer;
      this._animationMap = animationsMap;
      this._currentAnimationAction = this._animationMap['idle'];
      // * play
      this._currentAnimationAction.play();

      // * 캐릭터 바운딩 박스
      const box = new THREE.Box3().setFromObject(model);
      model.position.y = (box.max.y - box.min.y - 0.8) / 2;

      // * 바운딩 박스 표시
      const boxHelper = new THREE.BoxHelper(model);
      this._scene.add(boxHelper);

      // * 월드 좌표계 축 표시 helper
      const axisHelper = new THREE.AxesHelper(200);
      this._scene.add(axisHelper);

      // 모델과 바운딩 박스 표시는 다른 메서드에서 사용해야 하므로 변수 설정
      this._boxHelper = boxHelper;
      this._model = model;
    });
  }

  resize() {
    const width = this._root.clientWidth;
    const height = this._root.clientHeight;

    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize(width, height);
  }

  render(time) {
    this._renderer.render(this._scene, this._camera);
    this.update(time);
    requestAnimationFrame(this.render.bind(this));
  }

  update(time) {
    time *= 0.001;
    this._controls.update();

    // * model의 이동에 따라 업데이트
    if (this._boxHelper) {
      this._boxHelper.update();
    }

    this._fps.update();

    if (this._mixer) {
      // * deltaTime = 현재 시간 - 이전 시간
      const deltaTime = time - this._previousTime;
      this._mixer.update(deltaTime);
    }
    this._previousTime = time;
  }
}

window.onload = function () {
  new App();
};
