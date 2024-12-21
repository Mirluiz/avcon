import { Countertop } from "./Countertop";
import { Object } from "./Object/Object";

class Scene {
  objects: Object[] = [];

  addObject(obj: Object) {
    this.objects.push(obj);
  }

  init() {
    const demoCountertop = Countertop.createNew();
    this.addObject(demoCountertop);
  }
}

export { Scene };
