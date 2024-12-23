import * as THREE from "three";
import { Object } from "./Object/Object.abstract";
import { Observer } from "../services/Observer";
import { BasicMesh, Object as IObject } from "./Object/Object";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Object as ObjectModel } from "../model/Object/Object";
import { Leg as LegModel } from "./../model/Leg";
import { BasicView } from "./Object/Object.basic";
import { LegSupport } from "./LegSupport";

class Leg extends Object implements IObject, Observer {
  constructor(readonly parent: IObject | null) {
    super(parent);

    const frontS = new LegSupport(this);
    frontS.metadata.position = "front";

    const backS = new LegSupport(this);
    backS.metadata.position = "back";

    this.children.push(frontS, backS);
  }

  setModel(model: ObjectModel): void {
    super.setModel(model);

    if (model instanceof LegModel) {
      const { backSupport, frontSupport } = model.getChildren();
      const { frontSup, backSup } = this.getChildren();

      if (frontSupport) frontSup?.setModel(frontSupport);
      if (backSupport) backSup?.setModel(backSupport);
    }
  }

  getChildren() {
    const frontSup = this.children.find(
      (child) => child.metadata.position === "front"
    ) as LegSupport | null;

    const backSup = this.children.find(
      (child) => child.metadata.position === "back"
    ) as LegSupport | null;

    return { frontSup, backSup };
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
          fixGLB(gltf.scene);
          this.glb = gltf.scene;

          if (gltf.scene.children[0]?.children[0]) {
            const glbToSize = gltf.scene.children[0]?.children[0] as THREE.Mesh;

            const positionAttribute = glbToSize.geometry.attributes.position;
            const box = new THREE.Box3();

            for (let i = 0; i < positionAttribute.count; i++) {
              const vertex = new THREE.Vector3();
              vertex.fromBufferAttribute(positionAttribute, i);
              box.expandByPoint(vertex);
            }

            const size = box.getSize(new THREE.Vector3());

            const modelBox = new THREE.Box3().setFromObject(
              gltf.scene.children[0]
            );
            const center = modelBox.getCenter(new THREE.Vector3());
            gltf.scene.children[0].position.sub(center);

            this.glbInitSize.x = size.x;
            this.glbInitSize.y = size.y;
            this.glbInitSize.z = size.z;
          }

          this.hardRefresh();
          this.fetched = true;
          this.model?.notifyObservers();
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
}

const fixGLB = (mesh: BasicMesh) => {
  mesh.traverse((child) => {
    if (Object.isMesh(child)) {
      {
        const positionAttribute = child.geometry.attributes.position;
        const box = new THREE.Box3();

        for (let i = 0; i < positionAttribute.count; i++) {
          const vertex = new THREE.Vector3();
          vertex.fromBufferAttribute(positionAttribute, i);
          box.expandByPoint(vertex);
        }

        child.geometry.boundingBox = box;
        child.updateMatrix();
      }
    }
  });
};

export { Leg };
