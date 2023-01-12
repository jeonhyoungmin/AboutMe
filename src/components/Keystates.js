export default class Keystates {
  /**
   * @param {string} _container this._container
   * @param {string} _camera this._camera
   */
  constructor(_container, _camera) {
    const keyStates = {};

    document.addEventListener('keydown', (e) => {
      keyStates[e.code] = true;
    });
    document.addEventListener('keyup', (e) => {
      keyStates[e.code] = false;
    });
    _container.addEventListener('mousedown', () => {
      document.body.requestPointerLock();
    });
    document.body.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement === document.body) {
        _camera.rotation.y -= e.movementX / 800;
        _camera.rotation.x -= e.movementY / 800;
      }
    });

    this._keyStates = keyStates;
  }
}
