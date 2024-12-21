import { uuidv4 } from "../../services/uuid";
import { Object as IObject, ObjectProps } from "./Object";

abstract class Object implements IObject {
  uuid: string;
  children: IObject[] = [];
  metadata?: { position: "left" | "right" };

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
  position: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };

  constructor(props: Partial<ObjectProps>) {
    this.uuid = uuidv4();

    if (props) {
      if (props.dimension) this.dimension = { ...props.dimension };
      if (props.position) this.position = { ...props.position };
      if (props.rotation) this.position = { ...props.rotation };
    }
  }

  rebuild() {}
  resize() {}
}

export { Object };