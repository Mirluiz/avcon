import * as THREE from "three";
import { Object } from "./Object";
import { Object as ObjectModel } from "./../model/Object/Object";
import { Observer } from "../services/Observer";

class Countertop implements Object, Observer {
  model: ObjectModel | null = null;
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial> | null = null;
  texture: THREE.Texture | null = null;

  dimension: { width: number; height: number; depth: number } = {
    width: 1,
    height: 1,
    depth: 1,
  };
  rotation: { w: number; x: number; y: number; z: number } = {
    w: 1,
    x: 0,
    y: 0,
    z: 0,
  };
  position: { x: number; y: number; z: number } = {
    x: 0,
    y: 0,
    z: 0,
  };

  private updateByModel() {
    if (this.model) {
      this.dimension = { ...this.model.dimension };
      this.rotation = { ...this.model.rotation };
      this.position = { ...this.model.position };
    }
  }

  render() {
    this.updateByModel();

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    this.mesh = new THREE.Mesh(geometry);
  }

  dispose() {}

  trigger() {
    console.log("triggering");
  }

  setModel(model: ObjectModel) {
    model.addObserver(this);
  }
}

export { Countertop };
