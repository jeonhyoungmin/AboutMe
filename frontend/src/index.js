import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
// import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// * 3차원 공간을 분할하는 자료구조: 3차원 공간을 효율적으로 분할하고 빠르게 충돌 검사를 할 수 있음
import { Octree } from 'three/examples/jsm/math/Octree.js';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';

import {
  cameraValue,
  ambientLightValue,
  shadowLightValue,
  addPointLightValue,
  spaceValue,
  characterValue,
} from './value.js';

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

    const scene = new THREE.Scene();
    this._scene = scene;

    const loader = new THREE.TextureLoader();
    loader.load(
      'https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg',
      function (texture) {
        scene.background = texture;
      }
    );

    this._setupCamera();
    this._setupLight();
    this._setupModel();
    this._setupControls();

    window.onresize = this.resize.bind(this);
    this.resize();

    requestAnimationFrame(this.render.bind(this));
  }

  _setupOctree(model) {
    this._worldOctree = new Octree();
    this._worldOctree.fromGraphNode(model);
  }

  _setupControls() {
    this._controls = new OrbitControls(this._camera, this._root);
    this._controls.target.set(0, 1, 0);
    this._controls.enablePan = false;
    this._controls.enableDamping = true;
    // this._controls.enableZoom = false;

    const stats = new Stats();
    this._root.appendChild(stats.dom);
    this._fps = stats;

    this._pressedKeys = {};

    document.addEventListener('keydown', (event) => {
      this._pressedKeys[event.key.toLowerCase()] = true;
      this._processAnimation();
    });

    document.addEventListener('keyup', (event) => {
      this._pressedKeys[event.key.toLowerCase()] = false;
      this._processAnimation();
    });
  }

  _processAnimation() {
    const previousAnimationAction = this._currentAnimationAction;

    if (
      this._pressedKeys['w'] ||
      this._pressedKeys['a'] ||
      this._pressedKeys['s'] ||
      this._pressedKeys['d']
    ) {
      if (this._pressedKeys['shift']) {
        this._currentAnimationAction = this._animationMap['walk'];
        this._maxSpeed = 150;
        this._acceleration = 50;
      } else {
        this._currentAnimationAction = this._animationMap['walk'];
        this._maxSpeed = 100;
        this._acceleration = 25;
      }
    } else {
      this._currentAnimationAction = this._animationMap['idle'];
      this._speed = 0;
      this._maxSpeed = 0;
      this._acceleration = 0;
    }

    if (previousAnimationAction != this._currentAnimationAction) {
      previousAnimationAction.fadeOut(0.5);
      this._currentAnimationAction.reset().fadeIn(0.5).play();
    }
  }

  _setupModel() {
    const loader = new GLTFLoader();

    loader.load('../public/gltf/space-1.glb', (gltf) => {
      const model = gltf.scene;
      model.position.x = spaceValue.positionX;
      model.position.y = spaceValue.positionY;
      model.position.z = spaceValue.positionZ;

      this._scene.add(model);

      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this._setupOctree(model);
    });

    loader.load('../public/gltf/character-1.glb', (gltf) => {
      const model = gltf.scene;
      model.position.x = characterValue.positionX;
      model.position.y = characterValue.positionY;
      model.position.z = characterValue.positionZ;
      this._scene.add(model);

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

      this._mixer = mixer;
      this._animationMap = animationsMap;
      this._currentAnimationAction = this._animationMap['idle'];
      this._currentAnimationAction.play();

      const box = new THREE.Box3().setFromObject(model);

      // const height = box.max.y - box.min.y;
      // const diameter = box.max.z - box.min.z;

      // model._capsule = new Capsule(
      //   new THREE.Vector3(0, diameter / 2, 0),
      //   new THREE.Vector3(0, height - diameter / 2, 0),
      //   diameter / 2
      // );

      const height = 16.1;
      const diameter = 5.66;

      model._capsule = new Capsule(
        new THREE.Vector3(0, diameter / 2, 0),
        new THREE.Vector3(0, height - diameter / 2, 0),
        diameter / 2
      );

      const boxHelper = new THREE.BoxHelper(model);
      // this._scene.add(boxHelper);

      const axisHelper = new THREE.AxesHelper(characterValue.axisHelper);
      this._scene.add(axisHelper);

      this._boxHelper = boxHelper;
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

  _addPointLight(x, y, z, helperColor) {
    const color = addPointLightValue.color;
    const intensity = addPointLightValue.intensity;

    const pointLight = new THREE.PointLight(
      color,
      intensity,
      addPointLightValue.distance
    );
    pointLight.position.set(x, y, z);

    this._scene.add(pointLight);

    const pointLightHelper = new THREE.PointLightHelper(
      pointLight,
      addPointLightValue.sphereSize,
      helperColor
    );
    this._scene.add(pointLightHelper);
  }

  _setupLight() {
    const ambientLight = new THREE.AmbientLight(
      ambientLightValue.color,
      ambientLightValue.intensity
    );
    if (ambientLightValue.on) this._scene.add(ambientLight);

    if (addPointLightValue.on) {
      this._addPointLight(100, 30, 100, 0xff0000);
      this._addPointLight(-100, 30, 100, 0xffff00);
      this._addPointLight(-100, 30, -100, 0x00ff00);
      this._addPointLight(100, 30, -100, 0x0000ff);
    }

    const shadowLight = new THREE.DirectionalLight(
      shadowLightValue.color,
      shadowLightValue.intensity
    );
    shadowLight.position.set(
      shadowLightValue.positionX,
      shadowLightValue.positionY,
      shadowLightValue.positionZ
    );
    shadowLight.target.position.set(
      shadowLightValue.targetX,
      shadowLightValue.targetY,
      shadowLightValue.targetZ
    );
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      shadowLight,
      shadowLightValue.helperSize
    );

    shadowLight.castShadow = shadowLightValue.castShadow;
    shadowLight.shadow.mapSize.width = shadowLightValue.width;
    shadowLight.shadow.mapSize.height = shadowLightValue.height;
    shadowLight.shadow.camera.top = shadowLight.shadow.camera.right =
      shadowLightValue.TopRight;
    shadowLight.shadow.camera.bottom = shadowLight.shadow.camera.left =
      shadowLightValue.BottomLeft;
    shadowLight.shadow.camera.near = shadowLightValue.near;
    shadowLight.shadow.camera.far = shadowLightValue.far;
    shadowLight.shadow.radius = shadowLightValue.radius;
    const shadowCameraHelper = new THREE.CameraHelper(
      shadowLight.shadow.camera
    );
    if (shadowLightValue.on) {
      this._scene.add(directionalLightHelper);
      this._scene.add(shadowLight);
      this._scene.add(shadowLight.target);
      this._scene.add(shadowCameraHelper);
    }
  }

  _previousDirectionOffset = 0;

  _directionOffset() {
    const pressedKeys = this._pressedKeys;
    let directionOffset = 0; // w키

    if (pressedKeys['w']) {
      if (pressedKeys['a']) {
        directionOffset = Math.PI / 4; // w+a (45도)
      } else if (pressedKeys['d']) {
        directionOffset = -Math.PI / 4; // w+d (-45도)
      }
    } else if (pressedKeys['s']) {
      if (pressedKeys['a']) {
        directionOffset = Math.PI / 4 + Math.PI / 2; // s+a (135도)
      } else if (pressedKeys['d']) {
        directionOffset = -Math.PI / 4 - Math.PI / 2; // s+d (-135도)
      } else {
        directionOffset = Math.PI; // s (180도)
      }
    } else if (pressedKeys['a']) {
      directionOffset = Math.PI / 2; // a (90도)
    } else if (pressedKeys['d']) {
      directionOffset = -Math.PI / 2; // d (-90도)
    } else {
      directionOffset = this._previousDirectionOffset;
    }
    this._previousDirectionOffset = directionOffset;

    return directionOffset;
  }

  _speed = 0;
  _maxSpeed = 0;
  _acceleration = 0;

  _bOnTheGround = false;
  _fallingAcceleration = 0;
  _fallingSpeed = 0;

  update(time) {
    time *= 0.001; // ms(밀리세컨드) => s(세컨드) 변환
    this._controls.update();

    if (this._boxHelper) {
      this._boxHelper.update();
    }

    this._fps.update();

    if (this._mixer) {
      const deltaTime = time - this._previousTime;
      this._mixer.update(deltaTime);

      const angleCameraDirectionAxisY =
        Math.atan2(
          this._camera.position.x - this._model.position.x,
          this._camera.position.z - this._model.position.z
        ) + Math.PI;

      // angleCameraDirectionAxisY 값 만큼 캐릭터 회전
      // 회전을 위해 quaternion 사용
      const rotateQuarternion = new THREE.Quaternion();
      rotateQuarternion.setFromAxisAngle(
        // y축에 대해서 angleCameraDirectionAxisY 만큼 회전
        new THREE.Vector3(0, 1, 0),
        angleCameraDirectionAxisY + this._directionOffset()
        // wasd 키를 눌렀을 때, 해당 방향을 바라보기 위해서는
        // angleCameraDirectionAxisY + ? (값 보정 필요)
        // 보정값은 notion 이미지 참고
      );

      // rotateQuarternion로 캐릭터를 회전시키는 코드
      this._model.quaternion.rotateTowards(
        rotateQuarternion,
        THREE.MathUtils.degToRad(5)
      );

      const walkDirection = new THREE.Vector3();
      this._camera.getWorldDirection(walkDirection);

      walkDirection.y = this._bOnTheGround ? 0 : -1;
      walkDirection.normalize(); // 정규화

      // 키보드 입력에 대해 이동해야 할 방향각 만큼 회전
      walkDirection.applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        this._directionOffset()
      );

      if (this._speed < this._maxSpeed) {
        this._speed += this._acceleration;
      } else {
        this._speed -= this._acceleration * 2;
      }

      // 캐릭터가 떨어지는 속도, 가속도 초기화
      if (!this._bOnTheGround) {
        this._fallingAcceleration += 1;
        this._fallingSpeed += Math.pow(this._fallingAcceleration, 2);
      } else {
        this._fallingAcceleration = 0;
        this._fallingSpeed = 0;
      }

      // 속도 vector
      const velocity = new THREE.Vector3(
        walkDirection.x * this._speed,
        walkDirection.y * this._fallingSpeed,
        walkDirection.z * this._speed
      );

      // deltatime에 따른 이동 거리를 구하기 위해
      // velocity(3차원) vector3을 스칼라곱 진행.
      const deltaPosition = velocity.clone().multiplyScalar(deltaTime);
      // * 캡슐이 먼저 이동하고 그 다음 바로 캐릭터가 이동하도록 만들기 위해
      // * 다음과 같이 작성
      this._model._capsule.translate(deltaPosition);
      const result = this._worldOctree.capsuleIntersect(this._model._capsule);
      // 캡슐 이동 if()문
      if (result) {
        // 충돌한 경우
        this._model._capsule.translate(
          result.normal.multiplyScalar(result.depth)
        );
        this._bOnTheGround = true;
      } else {
        // 충돌하지 않은 경우
        this._bOnTheGround = false;
      }

      // 변경하기 전 위치 저장
      const previousPosition = this._model.position.clone();
      // 모델 캡슐 높이
      const capsuleHeight =
        this._model._capsule.end.y -
        this._model._capsule.start.y +
        this._model._capsule.radius * 2;

      this._model.position.set(
        this._model._capsule.start.x,
        this._model._capsule.start.y - this._model._capsule.radius,
        this._model._capsule.start.z
      );

      this._camera.position.x -= previousPosition.x - this._model.position.x;
      this._camera.position.z -= previousPosition.z - this._model.position.z;

      this._controls.target.set(
        this._model.position.x,
        this._model.position.y + 10,
        this._model.position.z
      );
    }
    this._previousTime = time;
  }

  render(time) {
    this._renderer.render(this._scene, this._camera);
    this.update(time);
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
