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
    // * orbitcontrols의 shift 기능 제거
    this._controls.enablePan = false;
    // * 화면 회전 부드럽게
    this._controls.enableDamping = true;

    // * 초당 fps 표시
    const stats = new Stats();
    this._root.appendChild(stats.dom);
    this._fps = stats;
    // console.log(stats);

    // 무슨 키가 눌렸는지 확인
    this._pressedKeys = {};

    // * 키가 눌렸을 때 이벤트
    document.addEventListener('keydown', (event) => {
      this._pressedKeys[event.key.toLowerCase()] = true;
      this._processAnimation();
    });

    // * 눌린 키가 떼졌을 때 이벤트
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
        // "run" 애니메이션 추가 필요, "walk"로 대체
        this._currentAnimationAction = this._animationMap['walk'];
        // this._speed = 20;
        this._maxSpeed = 20;
        this._acceleration = 2;
      } else {
        this._currentAnimationAction = this._animationMap['walk'];
        // this._speed = 5;
        this._maxSpeed = 5;
        this._acceleration = 1;
      }
    } else {
      this._currentAnimationAction = this._animationMap['idle'];
      this._speed = 0;
      this._maxSpeed = 0;
      this._acceleration = 0;
    }

    if (previousAnimationAction != this._currentAnimationAction) {
      // 만약 이전 액션과 현재 액션이 동일하지 않으면
      // 이전 액션은 0.5초에 걸쳐서 서서히 소멸
      previousAnimationAction.fadeOut(0.5);
      // 새롭게 지정된 애니메이션 액션은
      // reset을 통해 첫 번째 프레임으로 설정하고
      // 0.5초에 걸쳐서 서서히 들어나게 하고 플레이
      this._currentAnimationAction.reset().fadeIn(0.5).play();
    }
  }

  _setupCamera() {
    const width = this._root.clientWidth;
    const height = this._root.clientHeight;
    const camera = new THREE.PerspectiveCamera(5, width / height, 1, 20000);
    camera.position.set(0, 2, 40);
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

  _previousDirectionOffset = 0;

  // * 눌러진 키에 따른 보정값
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
    // * 마지막으로 눌린 방향으로 캐릭터의 시선 고정
    // * 아무것도 눌리기 전에는 directionOffset = 0(previousDirectionOffset)이였다가
    this._previousDirectionOffset = directionOffset;
    // * 다른 키가 눌린 뒤에는 그 눌린 키의 방향이 previousDirectionOffset이 됨

    return directionOffset;
  }

  // 캐릭터 이동 초기 값
  _speed = 0;
  _maxSpeed = 0;
  _acceleration = 0;

  update(time) {
    time *= 0.001; // ms(밀리세컨드) => s(세컨드) 변환
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
        // 한 번에 회전시키는 것이 아닌, '5'도씩 단계적으로 회전
      );

      const walkDirection = new THREE.Vector3();
      this._camera.getWorldDirection(walkDirection);

      walkDirection.y = 0; // 공중이나 아래로 가지 않도록
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

      // 캐릭터 x, z 평면에서 이동할 변이 값을 델타 타임과 속도로 계산
      const moveX = walkDirection.x * (this._speed * deltaTime);
      const moveZ = walkDirection.z * (this._speed * deltaTime);

      this._model.position.x += moveX;
      this._model.position.z += moveZ;

      this._camera.position.x += moveX;
      this._camera.position.z += moveZ;

      // 캐릭터가 항상 카메라의 중심에 있도록 조정
      this._controls.target.set(
        this._model.position.x,
        this._model.position.y + 1,
        this._model.position.z
      );
    }
    this._previousTime = time;
  }
}

window.onload = function () {
  new App();
};
