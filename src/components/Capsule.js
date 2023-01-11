import * as THREE from 'three';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';

export default class PlayerCapsule {
  /**
   * @param {number} _start "캐릭터의 맨 아래" 기본 값 = 0.35
   * @param {number} _end "캐릭터의 맨 위" 기본 값 = 1
   * @param {number} _radius "캐릭터의 반경" 기본 값 = 0.35
   */
  constructor(_start = 0.35, _end = 1, _radius = 0.35) {
    const playerCapsule = new Capsule(
      new THREE.Vector3(0, _start, 0),
      new THREE.Vector3(0, _end, 0),
      _radius
    );
    this._playerCapsule = playerCapsule;
  }
}
