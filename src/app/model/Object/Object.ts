interface ObjectProps {
  dimension: { width: number; height: number; depth: number };
  rotation: { w: number; x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
}

interface Object {
  children: Object[];
  uuid: string;

  dimension: { width: number; height: number; depth: number };
  rotation: { w: number; x: number; y: number; z: number };
  position: { x: number; y: number; z: number };

  metadata?: {
    position: "left" | "right";
  };

  rebuild: () => void;
  resize: (props?: Partial<Object["dimension"]>) => void;
}

export { Object, ObjectProps };
