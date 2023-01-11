import * as THREE from 'three';

export default class Camera {
  /**
   * @description PerspectiveCamera
   * @description rotation.order = 'YXZ'
   * @param {number} _fov 기본 값 = 70
   * @param {number} _near 기본 값 = 0.1
   * @param {number} _far 기본 값 = 1000
   */
  constructor(_fov = 70, _near = 0.1, _far = 1000) {
    const camera = new THREE.PerspectiveCamera(
      _fov,
      window.innerWidth / window.innerHeight,
      _near,
      _far
    );
    camera.rotation.order = 'YXZ';
    this._camera = camera;
  }
}
