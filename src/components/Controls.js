import * as THREE from 'three';

export default class Controls {
  /**
   * @param {string} _keyStates this._keyStates
   * @param {string} _deltaTime deltaTime
   * @param {string} _playerOnFloor this.playerOnFloor
   * @param {string} _playerVelocity this._playerVelocity
   * @param {string} _camera this._camera
   * @param {string} _playerDirection this._playerDirection
   */
  constructor(
    _keyStates,
    _deltaTime,
    _playerOnFloor,
    _playerVelocity,
    _camera,
    _playerDirection
  ) {
    this._keyStates = _keyStates;
    this._deltaTime = _deltaTime;
    this._playerOnFloor = _playerOnFloor;
    this._playerVelocity = _playerVelocity;
    this._camera = _camera;
    this._playerDirection = _playerDirection;

    this.controls();
    this._playerVelocity = _playerVelocity;
  }

  controls() {
    let speedDelta = 0;
    if (this._keyStates['ShiftLeft']) {
      speedDelta = this._deltaTime * (this._playerOnFloor ? 30 : 6);
    } else {
      speedDelta = this._deltaTime * (this._playerOnFloor ? 15 : 6);
    }
    if (this._keyStates['KeyW']) {
      this._playerVelocity.add(
        this._getForwardVector.multiplyScalar(speedDelta)
      );
    }
    if (this._keyStates['KeyS']) {
      this._playerVelocity.add(
        this._getForwardVector.multiplyScalar(-speedDelta)
      );
    }
    if (this._keyStates['KeyA']) {
      this._playerVelocity.add(this._getSideVector.multiplyScalar(-speedDelta));
    }
    if (this._keyStates['KeyD']) {
      this._playerVelocity.add(this._getSideVector.multiplyScalar(speedDelta));
    }
    if (this._playerOnFloor) {
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
}

// this._playerVelocity = new Controls(
//   this._keyStates,
//   deltaTime,
//   this.playerOnFloor,
//   this._playerVelocity,
//   this._camera,
//   this._playerDirection
// )._playerVelocity;
