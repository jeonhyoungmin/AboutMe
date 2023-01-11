import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default class GLTF {
  /**
   * @param {string} _gltf blender 3D 파일의 경로 작성
   * @param {string} _scene blender 3D 파일이 mesh로 들어갈 scene
   * @param {string} _worldOctree blender 3D 파일 Octree 적용, 기본 값 = ''
   */
  constructor(_gltf, _scene, _worldOctree = '') {
    const loader = new GLTFLoader();
    loader.load(_gltf, (gltf) => {
      _scene.add(gltf.scene);
      if (_worldOctree !== '') {
        _worldOctree.fromGraphNode(gltf.scene);
      }
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material.map) {
            child.material.map.anisotropy = 4;
          }
        }
      });
    });
  }
}
