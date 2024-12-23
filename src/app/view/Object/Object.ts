import * as THREE from "three";
import { Object as ObjectModel } from "../../model/Object/Object";

export type BasicMesh =
  | THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>
  | THREE.Object3D;

interface Object {
  metadata: { [key in string]: any };
  children: Object[];
  mesh: BasicMesh | null;
  texture: THREE.Texture | null;
  model: ObjectModel | null;

  dimension: { width: number; height: number; depth: number };
  rotation: { w: number; x: number; y: number; z: number };
  position: { x: number; y: number; z: number };

  render: () => void;
  dispose: () => void;
  setModel: (model: ObjectModel) => void;
  merge: () => BasicMesh | null;
}

export { Object };
