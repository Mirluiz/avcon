import { Object } from "./Object/Object.abstract";
import { Object as IObject, ObjectProps, Type } from "./Object/Object";
import { Panel } from "./Panel";
import { Leg } from "./Leg";

class Countertop extends Object {
  constructor(props: ObjectProps) {
    super(props);

    props.children.forEach((child) => {
      // <<if else>> can be replace to class loader.
      if (child instanceof Leg) {
        this.children.push(new Leg(child));
      } else if (child instanceof Panel) {
        this.children.push(new Panel(child));
      }
    });
  }

  rebuild() {}

  resize(
    dimension?: Partial<{ width: number; height: number; depth: number }>
  ) {
    if (dimension) {
      if (dimension.width) this.dimension.width = dimension.width;
      if (dimension.height) this.dimension.height = dimension.height;
      if (dimension.depth) this.dimension.depth = dimension.depth;
    }

    const { height } = this.dimension;

    const { leftLeg, rightLeg } = this.getChildren();

    if (leftLeg) leftLeg.resize({ height });
    if (rightLeg) rightLeg.resize({ height });
  }

  private getChildren() {
    const rightLeg = this.children.find(
      (child) => child.metadata?.position === "left"
    ) as IObject | null;
    const leftLeg = this.children.find(
      (child) => child.metadata?.position === "right"
    ) as IObject | null;

    return { rightLeg, leftLeg };
  }

  static createNew() {
    const props: ObjectProps = {
      type: Type.COUNTERTOP,
      children: [],
      name: "Бокс",
      dimension: { width: 1.2, depth: 1.2, height: 1 },
      position: { x: 0, y: 0, z: 0 },
      rotation: { w: 1, x: 0, y: 0, z: 0 },
    };

    const panel = new Panel(Panel.createNew());
    const countertop = new Countertop(props);
    const leftLeg = new Leg(Leg.createNew());
    leftLeg.metadata = { position: "left" };

    const rightLeg = new Leg(Leg.createNew());
    rightLeg.metadata = { position: "right" };

    props.children = [panel, countertop, leftLeg, rightLeg];

    return new Countertop(props);
  }
}

export { Countertop };
