import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import Stats from 'three/examples/jsm/libs/stats.module.js';
// import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';

// * 3차원 공간을 분할하는 자료구조: 3차원 공간을 효율적으로 분할하고 빠르게 충돌 검사를 할 수 있음
import { Octree } from 'three/examples/jsm/math/Octree.js';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';
import '../../public/gltf/root.glb';
import '../../public/img/pure_sky.hdr';
import './style.css';

class RootHTML {
  constructor() {
    const container = document.getElementById('root');
    const cursor = document.getElementById('cursor');
    const descript = document.getElementById('descript');

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const playerVelocity = new THREE.Vector3();
    const playerDirection = new THREE.Vector3();
    const clock = new THREE.Clock();
    const worldOctree = new Octree();

    this._worldOctree = worldOctree;
    this._container = container;
    this._renderer = renderer;
    this._scene = scene;
    this._playerVelocity = playerVelocity;
    this._playerDirection = playerDirection;
    this.playerOnFloor = false;
    this._clock = clock;

    this._setCamera();
    this._setCapsule();
    this._setLight();
    this._setGLTFLoader();
    this._setControls();
    this._setRaycaster();

    // window.addEventListener('resize', this.resize);
    window.onresize = this.resize.bind(this);
    // this.resize();
    this.animate();
    // requestAnimationFrame(this.animate.bind(this));
  }

  _setRaycaster() {
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    window.addEventListener('click', (e) => {
      raycaster.setFromCamera(pointer, this._camera);
      const intersects = raycaster.intersectObjects(this._scene.children);
      for (let i = 0; i < intersects.length; i++) {
        console.log(intersects);
        if (intersects[i].object.name === '상자') {
          if (intersects[i].distance <= 10) {
            console.log(intersects);
            // location.href = '/first.html';
            // fetch('http://127.0.0.1:3000/first.html')
            //   .then((response) => response.json())
            //   .then((res) => console.log(res))
            //   .catch((err) => console.log(err));
          }
        }
      }
    });
  }

  _setCamera() {
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.rotation.order = 'YXZ';
    this._camera = camera;
  }

  _setCapsule() {
    const playerCapsule = new Capsule(
      new THREE.Vector3(0, 0.35, 0),
      new THREE.Vector3(0, 1, 0),
      0.35
    );
    this._playerCapsule = playerCapsule;
  }

  _setLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this._scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
    directionalLight.position.set(0, 10, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.01;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    // directionalLight.shadow.radius = 5;
    // directionalLight.shadow.bias = -0.00006;
    this._scene.add(directionalLight);
    const axisHelper = new THREE.AxesHelper(200);
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      5
    );
    const shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    // this._scene.add(axisHelper);
    // this._scene.add(directionalLightHelper);
    // this._scene.add(shadowHelper);
  }

  _setGLTFLoader() {
    const loader = new GLTFLoader();
    loader.load('../../public/gltf/root.glb', (gltf) => {
      this._scene.add(gltf.scene);
      this._worldOctree.fromGraphNode(gltf.scene);
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material.map) {
            child.material.map.anisotropy = 4;
          }
        }
      });
    });
  }

  _setControls() {
    const keyStates = {};

    document.addEventListener('keydown', (e) => {
      keyStates[e.code] = true;
    });
    document.addEventListener('keyup', (e) => {
      keyStates[e.code] = false;
    });
    this._container.addEventListener('mousedown', () => {
      document.body.requestPointerLock();
    });
    document.body.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement === document.body) {
        this._camera.rotation.y -= e.movementX / 800;
        this._camera.rotation.x -= e.movementY / 800;
      }
    });

    this._keyStates = keyStates;
  }

  controls(deltaTime) {
    // const playerVelocity = new THREE.Vector3();
    // let playerOnFloor = false;

    let speedDelta = 0;
    if (this._keyStates['ShiftLeft']) {
      speedDelta = deltaTime * (this.playerOnFloor ? 30 : 6);
    } else {
      speedDelta = deltaTime * (this.playerOnFloor ? 15 : 6);
    }
    if (this._keyStates['KeyW']) {
      this._playerVelocity.add(
        this.getForwardVector().multiplyScalar(speedDelta)
      );
    }
    if (this._keyStates['KeyS']) {
      this._playerVelocity.add(
        this.getForwardVector().multiplyScalar(-speedDelta)
      );
    }
    if (this._keyStates['KeyA']) {
      this._playerVelocity.add(
        this.getSideVector().multiplyScalar(-speedDelta)
      );
    }
    if (this._keyStates['KeyD']) {
      this._playerVelocity.add(this.getSideVector().multiplyScalar(speedDelta));
    }
    if (this.playerOnFloor) {
      if (this._keyStates['Space']) {
        this._playerVelocity.y = 8;
      }
    }
  }

  getForwardVector() {
    this._camera.getWorldDirection(this._playerDirection);
    this._playerDirection.y = 0;
    this._playerDirection.normalize();
    return this._playerDirection;
  }

  getSideVector() {
    this._camera.getWorldDirection(this._playerDirection);
    this._playerDirection.y = 0;
    this._playerDirection.normalize();
    this._playerDirection.cross(this._camera.up);
    return this._playerDirection;
  }

  playerCollisions() {
    const result = this._worldOctree.capsuleIntersect(this._playerCapsule);
    this.playerOnFloor = false;
    if (result) {
      this.playerOnFloor = result.normal.y > 0;
      if (!this.playerOnFloor) {
        this._playerVelocity.addScaledVector(
          result.normal,
          -result.normal.dot(this._playerVelocity)
        );
      }
      this._playerCapsule.translate(result.normal.multiplyScalar(result.depth));
    }
  }

  updatePlayer(deltaTime) {
    const GRAVITY = 30;

    let damping = Math.exp(-6 * deltaTime) - 1;
    if (!this.playerOnFloor) {
      this._playerVelocity.y -= GRAVITY * deltaTime;
      damping *= 0.1;
    }
    this._playerVelocity.addScaledVector(this._playerVelocity, damping);
    const deltaPosition = this._playerVelocity
      .clone()
      .multiplyScalar(deltaTime);
    this._playerCapsule.translate(deltaPosition);
    this.playerCollisions();
    this._camera.position.copy(this._playerCapsule.end);
  }

  teleportPlayerIfOob() {
    if (this._camera.position.y <= -25) {
      this._playerCapsule.start.set(0, 0.35, 0);
      this._playerCapsule.end.set(0, 1, 0);
      this._playerCapsule.radius = 0.35;
      this._camera.position.copy(this._playerCapsule.end);
      this._camera.rotation.set(0, 0, 0);
    }
  }

  resize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    const STEPS_PER_FRAME = 30;

    const deltaTime = Math.min(0.05, this._clock.getDelta()) / STEPS_PER_FRAME;
    for (let i = 0; i < STEPS_PER_FRAME; i++) {
      this.controls(deltaTime);
      this.updatePlayer(deltaTime);
      this.teleportPlayerIfOob();
    }
    this._renderer.render(this._scene, this._camera);
    requestAnimationFrame(this.animate.bind(this));
  }
}

window.onload = () => {
  new RootHTML();
};
