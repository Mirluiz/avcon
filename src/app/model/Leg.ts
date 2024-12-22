import { Object } from "./Object/Object.abstract";
import { Object as IObject, ObjectProps, Type } from "./Object/Object";
import { LegSupport } from "./LegSupport";

class Leg extends Object {
  color: string | null = "#00";
  asset?: { url: string } = {
    url: "leg.glb",
  };

  constructor(props: ObjectProps) {
    super(props);

    props.children.forEach((child) => {
      // <<if else>> can be replace to class loader.
      if (child.type === Type.LEG_SUPPORT) {
        this.children.push(new LegSupport(child));
      }
    });
  }

  resize(
    dimension?: Partial<{ width: number; height: number; depth: number }>
  ) {
    if (dimension) {
      if (dimension.width) this.dimension.width = dimension.width;
      if (dimension.height) this.dimension.height = dimension.height;
      if (dimension.depth) this.dimension.depth = dimension.depth;
    }
  }

  getChildren() {
    const frontSupport = this.children.find(
      (child) => child.metadata?.position === "front"
    ) as LegSupport | null;
    const backSupport = this.children.find(
      (child) => child.metadata?.position === "back"
    ) as LegSupport | null;

    return { frontSupport, backSupport };
  }

  static createNew() {
    const props: ObjectProps = {
      type: Type.LEG,
      children: [],
      name: "Опора",
      dimension: { width: 1.2, depth: 1.2, height: 1 },
      position: { x: 0, y: 0, z: 0 },
      rotation: { w: 1, x: 0, y: 0, z: 0 },
    };

    const legSupportFront = LegSupport.createNew();
    legSupportFront.metadata = {
      position: "front",
    };

    const legSupportBack = LegSupport.createNew();
    legSupportBack.metadata = { position: "back" };

    props.children = [legSupportFront, legSupportBack];

    return props;
  }
}

export { Leg };
