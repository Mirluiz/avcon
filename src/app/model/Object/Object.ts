import { Observer } from "../../services/Observer";

enum Type {
  OBJECT = 1, // 0 is problematic. start from 1. OBJECT is default type
  COUNTERTOP,
  PANEL,
  LEG,
}

interface ObjectProps {
  type: Type;
  children: ObjectProps[];
  name: string;
  dimension: { width: number; height: number; depth: number };
  rotation: { w: number; x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
}

interface Object {
  useColor: boolean;
  color: string | null;
  name: string;
  children: Object[];
  observers: Observer[];
  uuid: string;
  type: Type;

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

export { Object, ObjectProps, Type };
