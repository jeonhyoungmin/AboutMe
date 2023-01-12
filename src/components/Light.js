import * as THREE from 'three';

export default class DirectionalLight {
  /**
   * @param {string} _scene this._scene
   * @param {number} _color DirectionalLight color, 기본 값 = 0xffffff
   * @param {number} _intensity DirectionalLight 강도, 기본 값 = 0.1
   * @param {boolean} _helper axis, shadow, light helper, 기본 값 = false
   */
  constructor(_scene, _color = 0xffffff, _intensity = 0.1, _helper = false) {
    const directionalLight = new THREE.DirectionalLight(_color, _intensity);
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
    _scene.add(directionalLight);
    const axisHelper = new THREE.AxesHelper(200);
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      5
    );
    const shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    if (_helper) {
      _scene.add(axisHelper);
      _scene.add(directionalLightHelper);
      _scene.add(shadowHelper);
    }
  }
}
