import * as THREE from 'three';

class Countertop {
  mesh: THREE.Mesh
  texture: THREE.Texture

  controller: ControllerCountertop

  dimension: {width: number, height: number, depth: number}
  rotation: {width: number, height: number, depth: number}
 
  render() {

  }

  dispose() {
    
  }


}

export {Countertop}