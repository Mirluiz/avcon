import { Observer } from "../../services/Observer";
import { uuidv4 } from "../../services/uuid";
import { Object as IObject, ObjectProps, Type } from "./Object";

abstract class Object implements IObject {
  hightlight: boolean = false;
  asset?: {
    url: string;
  };
  // pivot: {x: number, y: number, z: number}
  origin: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 }; // origin is only for root object
  isFrame: boolean = true;
  type: Type = Type.OBJECT;
  useColor: boolean = true;
  color: string | null = null;
  name: string = "";
  uuid: string;
  children: IObject[] = [];
  metadata?: Partial<{ position: "left" | "right" | "front" | "back" }>;

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
  observers: Observer[] = [];

  constructor(props: Partial<ObjectProps>) {
    this.uuid = uuidv4();

    if (props) {
      if (props.dimension) this.dimension = { ...props.dimension };
      if (props.position) this.position = { ...props.position };
      if (props.rotation) this.rotation = { ...props.rotation };
      if (props.name) this.name = props.name;
      if (props.type) this.type = props.type;
      if (props.metadata) this.metadata = props.metadata;
    }
  }

  rebuild() {
    this.children.forEach((child) => child.rebuild());
  }
  resize() {
    this.children.forEach((child) => child.resize());
  }

  addObserver(observer: Observer) {
    this.observers.push(observer);
  }

  notifyObservers() {
    for (const observer of this.observers) {
      observer.trigger();
    }
  }
}

export { Object };
