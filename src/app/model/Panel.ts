import { Object } from "./Object/Object.abstract";
import { Object as IObject, ObjectProps, Type } from "./Object/Object";

class Panel extends Object {
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
      type: Type.PANEL,
      children: [],
      name: "Panel",
      dimension: { width: 0.3, depth: 0.01, height: 0.3 },
      position: { x: 0, y: 0, z: 0 },
      rotation: { w: 1, x: 0, y: 0, z: 0 },
    };

    return new Panel(props);
  }
}

export { Panel };
