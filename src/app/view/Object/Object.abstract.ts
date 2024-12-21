import * as THREE from "three";
import { Object as IObject } from "../Object/Object";
import { Object as ObjectModel } from "../../model/Object/Object";
import { Observer } from "../../services/Observer";

abstract class Object implements Object, Observer {
  children: Object[] = [];
  model: ObjectModel | null = null;
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial> | null = null;
  material: THREE.MeshStandardMaterial | null = null;
  texture: THREE.Texture | null = null;

  constructor() {}

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

    const geometry = new THREE.BoxGeometry(
      this.dimension.width,
      this.dimension.height,
      this.dimension.depth
    );
    this.mesh = new THREE.Mesh(geometry);

    this.children.forEach((element) => {
      element.render();
    });
  }

  merge(): THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial> | null {
    const { mesh } = this;

    this.children.forEach((child) => {
      const res = child.merge();
      if (res) mesh?.add(res);
    });

    return mesh;
  }

  refresh() {
    this.updateByModel();

    if (this.mesh) {
      const { mesh } = this;

      mesh.geometry = new THREE.BoxGeometry(
        this.dimension.width,
        this.dimension.height,
        this.dimension.depth
      );

      if (this.model?.useColor && this.model.color) {
        mesh.material.color.set(this.model.color);
      } else {
        console.log("put texture here");
      }
    }
  }

  dispose() {
    const { mesh } = this;

    // this?.children.forEach((child) => {
    //   child.dispose();
    // });

    if (mesh) {
      if (this.isMesh(mesh)) {
        mesh?.material?.dispose();
        mesh.geometry.dispose();

        if (mesh.material instanceof THREE.MeshBasicMaterial) {
          mesh?.material?.map?.dispose();
        }
      }
    }
  }

  trigger() {
    this.refresh();
  }

  setModel(model: ObjectModel) {
    model.addObserver(this);
    this.model = model;
  }

  private isMesh(
    obj: THREE.Object3D
  ): obj is THREE.Mesh<THREE.BoxGeometry, THREE.Material> {
    return "isMesh" in obj;
  }
}

export { Object };
