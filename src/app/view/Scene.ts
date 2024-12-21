import { Object } from "./Object/Object";
import { Object as ObjectModel } from "./../model/Object/Object";
import { Scene as SceneModel } from "../model/Scene";
import { Countertop } from "./Countertop";

class Scene {
  views: Object[] = [];

  constructor(readonly sceneModel: SceneModel) {}

  init() {
    this.sceneModel.objects.forEach((model) => {
      const view = new Countertop();
      view.setModel(model);

      this.views.push(view);
    });
  }
}

export { Scene };
