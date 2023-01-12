import * as THREE from 'three';
import { SpotLight, SpotLightHelper } from 'three';

export default class Spotlight {
  /**
   * @param {string} _scene this._scene
   * @param {number} _color Spotlight color, string 가능, 기본 값 = 0xffffff
   * @param {number} _x position x, 기본 값 = 0
   * @param {number} _y position x, 기본 값 = 0
   * @param {number} _z position x, 기본 값 = 0
  //  * @param {boolean} _helper Spotlight helper, 기본 값 = false
   * @param {number} _intensity Spotlight 강도, 기본 값 = 1
   * @param {number} _size Spotlight 크기, 기본 값 = 10
   */
  constructor(
    _scene,
    _color = 0xffffff,
    _x = 0,
    _y = 0,
    _z = 0,
    _helper = false,
    _intensity = 0.5,
    _size = 4
  ) {
    const spotlight = new THREE.SpotLight(_color, _intensity, _size);
    spotlight.position.set(_x, _y, _z);
    _scene.add(spotlight);
    if (_helper) {
      const spotlightHelper = new THREE.SpotLightHelper(spotlight);
      _scene.add(spotlightHelper);
    }
  }
}
