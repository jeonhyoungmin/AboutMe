import * as THREE from 'three';
import { Octree } from 'three/examples/jsm/math/Octree.js';
import '../../public/gltf/root.glb';
import './style.css';

import GLTF from '../components/GLTF.js';
import Camera from '../components/Camera.js';
import Raycaster from '../components/Raycaster.js';
import PlayerCapsule from '../components/Capsule.js';
import DirectionalLight from '../components/Light.js';
import Keystates from '../components/Keystates.js';
import Pointlight from '../components/Pointlight.js';
import { PointLight } from 'three';

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
    this._setKeystates();
    this._setRaycaster();

    window.onresize = this.resize.bind(this);
    this.animate();
  }

  _setRaycaster() {
    new Raycaster(this._camera, this._scene);
  }

  _setCamera() {
    this._camera = new Camera()._camera;
  }

  _setCapsule() {
    this._playerCapsule = new PlayerCapsule()._playerCapsule;
  }

  _setLight() {
    const rainbow = [
      'red',
      'orange',
      'yellow',
      'green',
      'blue',
      'indigo',
      'purple',
    ];
    // new DirectionalLight(this._scene, 0xffffff, 0.1, false);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this._scene.add(ambientLight);

    // for (let i = 1; i <= rainbow.length; i++) {
    //   const light = new THREE.PointLight(rainbow[0], 10, 2);
    //   // light.position.set(0, i, -(i / 2));
    //   light.position.set(0, 0, -1);
    //   this._scene.add(light);
    //   const lightHelper = new THREE.PointLight(light, 2, rainbow[0]);
    //   this._scene.add(lightHelper);
    // }
    // const light = new THREE.PointLight(rainbow[0], 10, 2);
    // light.position.set(0, 0, -1);
    // this._scene.add(light);
    // const lightHelper = new THREE.PointLightHelper(light, 2, rainbow[0]);
    // this._scene.add(lightHelper);

    // let cameraPosition = this._camera.position;
    // console.log(cameraPosition);

    // if ((this._camera.position.z = -10)) {
    //   new Pointlight(this._scene, 'red', 0, 0, -1);
    // }
    // new Pointlight(this._scene, 'orange', 0, 0, -3);
    // new Pointlight(this._scene, 'yellow', 0, 1, -5);
    // new Pointlight(this._scene, 'green', 0, 1, -6);
    // new Pointlight(this._scene, 'blue', 0, 1, -8);
    // new Pointlight(this._scene, 'indigo', 0, 1, -10);
    // new Pointlight(this._scene, 'purple', 0, 1, -12);

    // new Pointlight(this._scene, 'red', 0, 2, -13);
    // new Pointlight(this._scene, 'orange', 0, 2, -15);
    // new Pointlight(this._scene, 'yellow', 0, 2, -17);
    // new Pointlight(this._scene, 'green', 0, 2, -19);
    // new Pointlight(this._scene, 'blue', 0, 2, -21);
    // new Pointlight(this._scene, 'indigo', 0, 3, -23);
    // new Pointlight(this._scene, 'purple', 0, 3, -25);

    // for (let i = 0; i < rainbow.length; i++) {
    //   new Pointlight(this._scene, rainbow[i], 0, 0, -i - 1, false);
    // }
    // for (let i = 0; i < rainbow.length; i++) {
    //   new Pointlight(this._scene, rainbow[i], 0, 1, -i - 5, false);
    // }
    // for (let i = 0; i < rainbow.length; i++) {
    //   new Pointlight(this._scene, rainbow[i], 0, 2, -i - 10, false);
    // }
    // new Pointlight(this._scene, 'green', 0, 3, -18);
  }

  // pointlight() {
  //   let p = this._camera.position;
  //   new Pointlight(this._scene, 'red', p.x, p.y, p.z);
  // }

  _setGLTFLoader() {
    new GLTF('../../public/gltf/root.glb', this._scene, this._worldOctree);
  }

  _setKeystates() {
    this._keyStates = new Keystates(this._container, this._camera)._keyStates;
  }

  controls(deltaTime) {
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
    // console.log(this._camera.position);
    const STEPS_PER_FRAME = 30;
    const deltaTime = Math.min(0.05, this._clock.getDelta()) / STEPS_PER_FRAME;
    // this.pointlight();
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
