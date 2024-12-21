import { Object } from "./Object/Object.abstract";
import { Object as IObject, ObjectProps, Type } from "./Object/Object";

class Leg extends Object {
  color: string | null = "#00";
  asset?: { url: string; } = {
    url: '/leg.glb';
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

    return props;
  }
}

export { Leg };
