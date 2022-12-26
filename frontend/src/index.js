import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
// import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// * 3차원 공간을 분할하는 자료구조: 3차원 공간을 효율적으로 분할하고 빠르게 충돌 검사를 할 수 있음
import { Octree } from 'three/examples/jsm/math/Octree.js';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';

const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const loader = new GLTFLoader().setPath('../public/gltf/');
const playerVelocity = new THREE.Vector3();
const playerDirection = new THREE.Vector3();
let playerOnFloor = false;
const keyStates = {};
const scene = new THREE.Scene();
// scene.background = new THREE.Color(0x88ccee);
const clock = new THREE.Clock();
const container = document.getElementById('root');
const GRAVITY = 30;
const STEPS_PER_FRAME = 30;
const worldOctree = new Octree();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
container.appendChild(renderer.domElement);

// 카메라가 곧 플레이어
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.rotation.order = 'YXZ';
const playerCapsule = new Capsule(
  new THREE.Vector3(0, 0.35, 0),
  new THREE.Vector3(0, 1, 0),
  0.35
);

const fihemisphereLight = new THREE.HemisphereLight(0xfbf6bf, 0xfbf6bf, 0.5);
fihemisphereLight.position.set(2, 1, 1);
scene.add(fihemisphereLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 10, -8);
directionalLight.castShadow = true;
directionalLight.shadow.camera.near = 0.01;
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.radius = 5;
directionalLight.shadow.bias = -0.00006;
scene.add(directionalLight);
const axisHelper = new THREE.AxesHelper(200);
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  5
);
const shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(axisHelper);
scene.add(directionalLightHelper);
scene.add(shadowHelper);

// const pointColor = '#ffffff';
// const spotLight = new THREE.SpotLight(pointColor);
// spotLight.position.set(0, 5, 0);
// spotLight.castShadow = true;
// scene.add(spotLight);
// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);

// const pointColor = '#ffffff';
// const pointerLight = new THREE.PointLight(pointColor, 0.5);
// pointerLight.position.set(3, 2, -7);
// scene.add(pointerLight);
// const pointerLightHelper = new THREE.PointLightHelper(pointerLight);
// scene.add(pointerLightHelper);

document.addEventListener('keydown', (e) => {
  keyStates[e.code] = true;
});
document.addEventListener('keyup', (e) => {
  keyStates[e.code] = false;
});
container.addEventListener('mousedown', () => {
  document.body.requestPointerLock();
});
document.body.addEventListener('mousemove', (event) => {
  if (document.pointerLockElement === document.body) {
    camera.rotation.y -= event.movementX / 800;
    camera.rotation.x -= event.movementY / 800;
  }
});

function playerCollisions() {
  const result = worldOctree.capsuleIntersect(playerCapsule);
  playerOnFloor = false;
  if (result) {
    playerOnFloor = result.normal.y > 0;
    if (!playerOnFloor) {
      playerVelocity.addScaledVector(
        result.normal,
        -result.normal.dot(playerVelocity)
      );
    }
    playerCapsule.translate(result.normal.multiplyScalar(result.depth));
  }
}

function updatePlayer(deltaTime) {
  let damping = Math.exp(-6 * deltaTime) - 1;
  if (!playerOnFloor) {
    playerVelocity.y -= GRAVITY * deltaTime;
    damping *= 0.1;
  }
  playerVelocity.addScaledVector(playerVelocity, damping);
  const deltaPosition = playerVelocity.clone().multiplyScalar(deltaTime);
  playerCapsule.translate(deltaPosition);
  playerCollisions();
  camera.position.copy(playerCapsule.end);
}

function getForwardVector() {
  camera.getWorldDirection(playerDirection);
  playerDirection.y = 0;
  playerDirection.normalize();
  return playerDirection;
}

function getSideVector() {
  camera.getWorldDirection(playerDirection);
  playerDirection.y = 0;
  playerDirection.normalize();
  playerDirection.cross(camera.up);
  return playerDirection;
}

function controls(deltaTime) {
  let speedDelta = 0;
  if (keyStates['ShiftLeft']) {
    speedDelta = deltaTime * (playerOnFloor ? 15 : 6);
  } else {
    speedDelta = deltaTime * (playerOnFloor ? 8 : 6);
  }
  if (keyStates['KeyW']) {
    playerVelocity.add(getForwardVector().multiplyScalar(speedDelta));
  }
  if (keyStates['KeyS']) {
    playerVelocity.add(getForwardVector().multiplyScalar(-speedDelta));
  }
  if (keyStates['KeyA']) {
    playerVelocity.add(getSideVector().multiplyScalar(-speedDelta));
  }
  if (keyStates['KeyD']) {
    playerVelocity.add(getSideVector().multiplyScalar(speedDelta));
  }
  if (playerOnFloor) {
    if (keyStates['Space']) {
      playerVelocity.y = 8;
    }
  }
}

loader.load('test.glb', (gltf) => {
  scene.add(gltf.scene);
  worldOctree.fromGraphNode(gltf.scene);
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

function teleportPlayerIfOob() {
  if (camera.position.y <= -25) {
    playerCapsule.start.set(0, 0.35, 0);
    playerCapsule.end.set(0, 1, 0);
    playerCapsule.radius = 0.35;
    camera.position.copy(playerCapsule.end);
    camera.rotation.set(0, 0, 0);
  }
}

// const intersectObjects = raycaster.intersectObjects(scene.children);
// const intersects = raycaster.intersectObjects(scene.children);
// function raycasterInteraction() {
// window.addEventListener('click', (e) => {
//   console.log(e);
// raycaster.setFromCamera(pointer, camera);
//   console.log(intersectObjects);
// });
// }

function animate() {
  const deltaTime = Math.min(0.05, clock.getDelta()) / STEPS_PER_FRAME;
  for (let i = 0; i < STEPS_PER_FRAME; i++) {
    controls(deltaTime);
    updatePlayer(deltaTime);
    teleportPlayerIfOob();
  }
  // raycasterInteraction();
  // raycasterInteraction();
  // const intersects = raycaster.intersectObjects(scene.children);
  // raycaster.setFromCamera(pointer, camera);
  // console.log(intersects);
  // window.addEventListener('click', (e) => {
  // for (let i = 0; i < intersects.length; i++) {
  //   if (intersects[i].object.name === '상자') {
  //     fetch('http://localhost:5500/box')
  //       .then((response) => response.json())
  //       .catch((err) => console.log(err));
  // .then((data) => console.log(data));
  // .then((res) => console.log(res));

  // console.log(i);
  // console.log(intersects);
  // const random = Math.floor(Math.random() * 255);
  // intersects[i].object.material.color;
  // intersects[i].object.material.color = new THREE.Color('pink');
  // console.log(intersects[i].object.material.color);
  // console.log(e);
  // console.log(e);
  // i = intersects.length;
  // console.log(i);
  // console.log()
  //   }
  // }
  // });
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', resize);
animate();

window.addEventListener('click', (e) => {
  console.log(raycaster);
  raycaster.setFromCamera(pointer, camera);
  console.log(raycaster);
  const intersects = raycaster.intersectObjects(scene.children);
  console.log(intersects);
  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.name === '상자') {
      fetch('http://localhost:5500/box')
        .then((response) => response.json())
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
  }
});
