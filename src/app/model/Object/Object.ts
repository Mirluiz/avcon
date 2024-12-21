import { Observer } from "../../services/Observer";

interface ObjectProps {
  name: string;
  dimension: { width: number; height: number; depth: number };
  rotation: { w: number; x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
}

interface Object {
  name: string;
  children: Object[];
  observers: Observer[];
  uuid: string;

  dimension: { width: number; height: number; depth: number };
  rotation: { w: number; x: number; y: number; z: number };
  position: { x: number; y: number; z: number };

  metadata?: {
    position: "left" | "right";
  };

  rebuild: () => void;
  resize: (props?: Partial<Object["dimension"]>) => void;
  addObserver: (observer: Observer) => void;
  notifyObservers: () => void;
}

export { Object, ObjectProps };
