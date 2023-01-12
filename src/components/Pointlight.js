import * as THREE from 'three';

export default class Pointlight {
  /**
   * @param {string} _scene this._scene
   * @param {number} _color PointLight color, string 가능, 기본 값 = 0xffffff
   * @param {number} _x position x, 기본 값 = 0
   * @param {number} _y position x, 기본 값 = 0
   * @param {number} _z position x, 기본 값 = 0
   * @param {boolean} _helper PointLight helper, 기본 값 = false
   * @param {number} _intensity PointLight 강도, 기본 값 = 10
   * @param {number} _size PointLight 크기, 기본 값 = 2
   */
  constructor(
    _scene,
    _color = 0xffffff,
    _x = 0,
    _y = 0,
    _z = 0,
    _helper = false,
    _intensity = 10,
    _size = 2
  ) {
    const light = new THREE.PointLight(_color, _intensity, _size);
    light.position.set(_x, _y, _z);
    _scene.add(light);
    const lightHelper = new THREE.PointLightHelper(light, _size, _color);
    if (_helper) _scene.add(lightHelper);
  }
}
