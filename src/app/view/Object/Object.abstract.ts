import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { BasicMesh, Object as IObject } from "../Object/Object";
import { Object as ObjectModel, Type } from "../../model/Object/Object";
import { Highlight } from "./../../services/Highlight";
import { Observer } from "../../services/Observer";

abstract class Object implements IObject, Observer {
  constructor(readonly parent: IObject | null) {}

  glbInitSize: { x: number; y: number; z: number } = { x: 1, y: 1, z: 1 };
  glb: THREE.Group<THREE.Object3DEventMap> | null = null;

  metadata: { [x: string]: any } = {};
  children: Object[] = [];
  model: ObjectModel | null = null;

  mesh: BasicMesh | null = null;

  material: THREE.MeshStandardMaterial | null = null;
  texture: THREE.Texture | null = null;

  fetched: boolean = false;

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

    if (this.model?.asset && !this.fetched) {
      this.loadGLB();
    }

    const geometry = new THREE.BoxGeometry(
      this.dimension.width,
      this.dimension.height,
      this.dimension.depth
    );

    if (this.glb) {
      const cloned_glb = this.glb.clone();
      const neededScale = {
        x: this.dimension.width / this.glbInitSize.x,
        y: this.dimension.height / this.glbInitSize.y,
        z: this.dimension.depth / this.glbInitSize.z,
      };

      cloned_glb.scale.set(neededScale.x, neededScale.y, neededScale.z);

      this.mesh = new THREE.Object3D();
      cloned_glb.userData.isGLB = true;
      this.mesh?.add(cloned_glb);
    } else {
      // we can do it as three object3d
      this.mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({
          transparent: true,
          side: THREE.DoubleSide,
          opacity: 0,
          // depthWrite: false,
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

    // debug only
    // if (this.model?.hightlight) {
    //   let box = Highlight.dashedBox({
    //     color: 0x00,
    //     dimension: this.model.dimension,
    //   });
    //   if (box) {
    //     this.mesh.add(box);
    //   }
    // }

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

    if (this.mesh && this.isMesh(this.mesh)) {
      const { mesh } = this;

      {
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
        // console.log("put texture here");
      }

      if (this.model?.hightlight) {
        let box = Highlight.dashedBox({
          color: 0x00,
          dimension: this.model.dimension,
        });
        if (box) {
          this.mesh.add(box);
        }
      }
    } else if (this.mesh && this.glb) {
      this.rescaleGLB();

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
    }

    this.children.forEach((child) => child.refresh());
  }

  rescaleGLB() {
    if (!this.mesh) return;

    const toScale = this.glb?.clone();

    if (!toScale) return;

    // it is glb for now
    const neededScale = {
      x: this.dimension.width / this.glbInitSize.x,
      y: this.dimension.height / this.glbInitSize.y,
      z: this.dimension.depth / this.glbInitSize.z,
    };

    this.mesh.children[0].scale.set(
      neededScale.x,
      neededScale.y,
      neededScale.z
    );
  }

  dispose() {
    const { mesh } = this;
    this.children.forEach((child) => child.dispose());

    // @ts-ignore
    mesh?.material?.dispose();
    // @ts-ignore
    mesh?.geometry?.dispose();

    // @ts-ignore
    if (mesh.material instanceof THREE.MeshBasicMaterial) {
      // @ts-ignore
      mesh?.material?.map?.dispose();
    }

    this.mesh?.removeFromParent();
  }

  hardRefresh() {
    this.dispose();

    const merged = this.merge();
    if (merged) this.parent?.mesh?.add(merged);
  }

  trigger() {
    this.refresh();
  }

  setModel(model: ObjectModel) {
    model.addObserver(this);
    this.model = model;
    this.updateByModel();
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

          this.glbInitSize.x = this.dimension.width;
          this.glbInitSize.y = this.dimension.height;
          this.glbInitSize.z = this.dimension.depth;

          this.hardRefresh();

          this.fetched = true;
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
