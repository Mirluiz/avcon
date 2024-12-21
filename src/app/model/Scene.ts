import { Object } from "./Object/Object";

class Scene {
  objects: Object[] = [];

  addObject(obj: Object) {
    this.objects.push(obj);
  }
}

export { Scene };
