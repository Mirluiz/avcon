import { Object } from "./Object/Object.abstract";
import { Object as IObject, ObjectProps, Type } from "./Object/Object";
import { Panel } from "./Panel";
import { Leg } from "./Leg";

class Countertop extends Object {
  frame = true;

  constructor(props: ObjectProps) {
    super(props);

    props.children.forEach((child) => {
      // <<if else>> can be replace to class loader.
      if (child.type === Type.LEG) {
        this.children.push(new Leg(child));
      } else if (child.type === Type.PANEL) {
        this.children.push(new Panel(child));
      }
    });
  }

  rebuild() {
    const { leftLeg, rightLeg, panel } = this.getChildren();

    if (rightLeg) {
      rightLeg.rotation = { w: 0.7071068, x: 0, y: 0.7071068, z: 0 };
      rightLeg.position.x =
        -this.dimension.width / 2 + rightLeg.dimension.depth / 2;
    }

    if (leftLeg) {
      leftLeg.rotation = { w: 0.7071068, x: 0, y: -0.7071068, z: 0 };
      leftLeg.position.x =
        this.dimension.width / 2 - leftLeg.dimension.depth / 2;
    }

    if (panel) {
      panel.rotation = { w: 0.7071068, x: 0.7071068, y: 0, z: 0 };
      panel.position.y = this.dimension.height / 2 + panel.dimension.depth / 2;
    }
  }

  resize(
    dimension?: Partial<{ width: number; height: number; depth: number }>
  ) {
    if (dimension) {
      if (dimension.width) this.dimension.width = dimension.width;
      if (dimension.height) this.dimension.height = dimension.height;
      if (dimension.depth) this.dimension.depth = dimension.depth;
    }

    this.origin.y = -this.dimension.height / 2;

    const { width, height, depth } = this.dimension;
    const { leftLeg, rightLeg, panel } = this.getChildren();

    if (leftLeg) leftLeg.resize({ height, width: depth, depth: 0.01 });
    if (rightLeg) rightLeg.resize({ height, width: depth, depth: 0.01 });
    if (panel) {
      panel.resize({ width, height: depth, depth: 0.018 });
    }
  }

  getChildren() {
    const rightLeg = this.children.find(
      (child) => child.metadata?.position === "left"
    ) as Leg | null;
    const leftLeg = this.children.find(
      (child) => child.metadata?.position === "right"
    ) as Leg | null;
    const panel = this.children.find(
      (child) => child.type === Type.PANEL
    ) as Panel | null;
    console.log("rigt", rightLeg, leftLeg);

    return { rightLeg, leftLeg, panel };
  }

  setPanelMaterial(color: string) {
    const { panel } = this.getChildren();
    if (panel) panel.color = color;
  }

  setLeg(variant: "leg1" | "leg2") {
    console.log("legs changed", variant);
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

    const panel = Panel.createNew();
    const leftLeg = Leg.createNew();
    leftLeg.metadata = { position: "left" };

    const rightLeg = Leg.createNew();
    rightLeg.metadata = { position: "right" };

    props.children = [panel, leftLeg, rightLeg];

    return new Countertop(props);
  }
}

export { Countertop };
