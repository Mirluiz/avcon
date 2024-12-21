import * as THREE from "three";
import { Object as ObjectModel } from "./../model/Object/Object";

interface Object {
  mesh: THREE.Mesh | null;
  texture: THREE.Texture | null;
  model: ObjectModel | null;

  dimension: { width: number; height: number; depth: number };
  rotation: { w: number; x: number; y: number; z: number };
  position: { x: number; y: number; z: number };

  render: () => void;

  dispose: () => void;
}

export { Object };
