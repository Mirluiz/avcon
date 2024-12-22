import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { BasicMesh, Object as IObject } from "../Object/Object";
import { Object as ObjectModel } from "../../model/Object/Object";
import { Observer } from "../../services/Observer";

abstract class Object implements IObject, Observer {
  glbInitSize: { x: number; y: number; z: number } = { x: 1, y: 1, z: 1 };
  glb: THREE.Group<THREE.Object3DEventMap> | null = null;

  metadata: { [x: string]: any } = {};
  children: Object[] = [];
  model: ObjectModel | null = null;
  mesh: BasicMesh | null = null;
  material: THREE.MeshStandardMaterial | null = null;
  texture: THREE.Texture | null = null;

  fetchingGLB: boolean = false;

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

    if (this.model?.asset) {
      this.fetchingGLB = true;
      this.loadGLB();
    }

    const geometry = new THREE.BoxGeometry(
      this.dimension.width,
      this.dimension.height,
      this.dimension.depth
    );

    if (this.glb) {
      this.mesh = this.glb;
    } else {
      this.mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({
          transparent: true,
          side: THREE.DoubleSide,
          opacity: 0,
          depthWrite: false,
        })
      );
    }

    const finalPos = new THREE.Vector3(
      this.position.x - (this.model?.origin.x ?? 0),
      this.position.y - (this.model?.origin.y ?? 0),
      this.position.z - (this.model?.origin.z ?? 0)
    );
    this.mesh.position.set(finalPos.x, finalPos.y, finalPos.z);
    this.mesh.setRotationFromQuaternion(
      new THREE.Quaternion(
        this.rotation.x,
        this.rotation.y,
        this.rotation.z,
        this.rotation.w
      )
    );

    this.children.forEach((element) => {
      element.render();
    });
  }

  merge(): BasicMesh | null {
    this.render();

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
      const reserveChildren = this.mesh.children;
      const parent = this.mesh.parent;

      const { mesh } = this;

      if (this.isMesh(mesh)) {
        mesh.geometry.dispose();
        mesh.material.dispose();
      } else {
        mesh.removeFromParent();
      }

      if (this.glb) {
        mesh.removeFromParent();
        const cloned_glb = this.glb.clone();
        const neededScale = {
          x: this.dimension.width / this.glbInitSize.x,
          y: this.dimension.height / this.glbInitSize.y,
          z: this.dimension.depth / this.glbInitSize.z,
        };

        cloned_glb.scale.set(neededScale.x, neededScale.y, neededScale.z);
        // cloned_glb.scale.set(neededScale.x, neededScale.y, 1);

        this.mesh = cloned_glb;

        parent?.add(this.mesh);
      } else {
        mesh.geometry = new THREE.BoxGeometry(
          this.dimension.width,
          this.dimension.height,
          this.dimension.depth
        );
      }

      const finalPos = new THREE.Vector3(
        this.position.x - (this.model?.origin.x ?? 0),
        this.position.y - (this.model?.origin.y ?? 0),
        this.position.z - (this.model?.origin.z ?? 0)
      );

      this.mesh.position.set(finalPos.x, finalPos.y, finalPos.z);
      this.mesh.setRotationFromQuaternion(
        new THREE.Quaternion(
          this.rotation.x,
          this.rotation.y,
          this.rotation.z,
          this.rotation.w
        )
      );

      if (this.model?.useColor && this.model.color && this.isMesh(mesh)) {
        mesh.material.transparent = false;
        mesh.material.opacity = 1;
        mesh.material.color.set(this.model.color);
      } else {
        console.log("put texture here");
      }
    }

    this.children.forEach((child) => child.refresh());
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

  async loadGLB() {
    if (this.model?.asset?.url) {
      const { url } = this.model.asset;

      const dracoLoader = new DRACOLoader();
      const loader = new GLTFLoader();
      // public/three/examples/jsm/libs/draco
      dracoLoader.setDecoderPath("/three/examples/jsm/libs/draco/gltf/");
      loader.setDRACOLoader(dracoLoader);

      loader?.load(
        url,
        (gltf) => {
          this.glb = gltf.scene;
          const box = new THREE.Box3().setFromObject(this.glb);
          const size = new THREE.Vector3();

          box.getSize(size);

          this.glbInitSize.x = size.x;
          this.glbInitSize.y = size.y;
          this.glbInitSize.z = size.z;

          this.refresh();
        },
        function () {
          // console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
          console.log("An error happened", error);
        }
      );
    }
  }

  private isMesh(
    obj: THREE.Object3D
  ): obj is THREE.Mesh<THREE.BoxGeometry, THREE.Material> {
    return "isMesh" in obj;
  }
}

export { Object };
