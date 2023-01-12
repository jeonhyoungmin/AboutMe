import * as THREE from 'three';

export default class Raycaster {
  /**
   * @param {string} _camera this._camera
   * @param {string} _scene this._scene
   */
  constructor(_camera, _scene) {
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    window.addEventListener('click', (e) => {
      raycaster.setFromCamera(pointer, _camera);
      const intersects = raycaster.intersectObjects(_scene.children);
      for (let i = 0; i < intersects.length; i++) {
        console.log(intersects);
        if (intersects[i].object.name === '상자') {
          if (intersects[i].distance <= 10) {
            console.log(intersects);
            // location.href = '/first.html';
            // fetch('http://127.0.0.1:3000/first.html')
            //   .then((response) => response.json())
            //   .then((res) => console.log(res))
            //   .catch((err) => console.log(err));
          }
        }
      }
    });
  }
}
