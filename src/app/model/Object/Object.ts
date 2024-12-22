import { Observer } from "../../services/Observer";

enum Type {
  OBJECT = 1, // 0 is problematic. start from 1. OBJECT is default type
  COUNTERTOP,
  PANEL,
  LEG,
  LEG_SUPPORT,
}

interface ObjectProps {
  metadata?: Partial<{ position: "left" | "right" | "back" | "front" }>;
  type: Type;
  children: ObjectProps[];
  name: string;
  dimension: { width: number; height: number; depth: number };
  rotation: { w: number; x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
}

interface Object {
  asset?: {
    url: string;
  };
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
  origin: { x: number; y: number; z: number };

  metadata?: Partial<{
    position: "left" | "right" | "front" | "back";
  }>;

  rebuild: () => void;
  resize: (props?: Partial<Object["dimension"]>) => void;
  addObserver: (observer: Observer) => void;
  notifyObservers: () => void;
}

export { Object, ObjectProps, Type };
