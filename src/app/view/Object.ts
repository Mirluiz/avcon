import * as THREE from "three";
import { Object as ObjectModel } from "./../model/Object/Object";

interface Object {
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial> | null;
  texture: THREE.Texture | null;
  model: ObjectModel | null;

  dimension: { width: number; height: number; depth: number };
  rotation: { w: number; x: number; y: number; z: number };
  position: { x: number; y: number; z: number };

  render: () => void;
  dispose: () => void;
  setModel: (model: ObjectModel) => void;
}

export { Object };
