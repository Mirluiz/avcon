import { Object } from "./Object/Object.abstract";
import { Object as IObject, ObjectProps, Type } from "./Object/Object";

class LegSupport extends Object {
  // hightlight: boolean = true;
  color: string | null = "#00";
  glbSizeFirst = true;

  asset?: { url: string } = {
    url: "prop_01.glb",
  };

  resize(
    dimension?: Partial<{ width: number; height: number; depth: number }>
  ) {
    if (dimension) {
      if (dimension.width) this.dimension.width = dimension.width;
      if (dimension.height) this.dimension.height = dimension.height;
      if (dimension.depth) this.dimension.depth = dimension.depth;
    }
  }

  getChildren() {}

  static createNew() {
    const props: ObjectProps = {
      type: Type.LEG_SUPPORT,
      children: [],
      name: "Опора",
      dimension: { width: 1.2, depth: 1.2, height: 1 },
      position: { x: 0, y: 0, z: 0 },
      rotation: { w: 1, x: 0, y: 0, z: 0 },
    };

    return props;
  }
}

export { LegSupport };
