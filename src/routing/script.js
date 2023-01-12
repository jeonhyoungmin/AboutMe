import * as THREE from 'three';
import { Octree } from 'three/examples/jsm/math/Octree.js';
import '../../public/gltf/routing.glb';
import './style.css';

import GLTF from '../components/GLTF.js';
import Camera from '../components/Camera.js';
// import Raycaster from '../components/Raycaster.js';
import PlayerCapsule from '../components/Capsule.js';
// import DirectionalLight from '../components/Light.js';
import Keystates from '../components/Keystates.js';
import Pointlight from '../components/Pointlight.js';
// import Spotlight from '../components/Spotlight.js';

class RootHTML {
  constructor() {
    this.stairSwitch = true;

    const container = document.getElementById('root');

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
    // new Raycaster(this._camera, this._scene);
  }

  _setCamera() {
    this._camera = new Camera()._camera;
  }

  _setCapsule() {
    this._playerCapsule = new PlayerCapsule()._playerCapsule;
  }

  _setLight() {
    // new DirectionalLight(this._scene, 0xffffff, 1, false);
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this._scene.add(ambientLight);

    new Pointlight(this._scene, 0xffffff, 0, 0, 0, false, 10, 3); // 입구
    new Pointlight(this._scene, 0xe90ff, -5, -5, -6, false, 10, 5); // c`lock
    new Pointlight(this._scene, 0xffff00, 0, -5, -11, false, 10, 5); // ugauga
    new Pointlight(this._scene, 0x00fa9a, 5, -5, -6, false, 10, 5); // hipass
  }

  _setGLTFLoader() {
    new GLTF('../../public/gltf/routing.glb', this._scene, this._worldOctree);
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
    if (this._camera.position.y <= -50) {
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
    if (
      this._camera.position.y <= -25 &&
      this._camera.position.y >= -25.9 &&
      this._camera.position.x <= -5
    ) {
      console.log("c'lock");
    } // c`lock
    if (
      this._camera.position.y <= -25 &&
      this._camera.position.y >= -25.9 &&
      this._camera.position.z <= -11
    ) {
      location.href = '/ugauga.html';
    } // ugauga
    if (
      this._camera.position.y <= -25 &&
      this._camera.position.y >= -25.9 &&
      this._camera.position.x >= 5
    ) {
      location.href = '/meojeonpass.html';
    } // hipass

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
