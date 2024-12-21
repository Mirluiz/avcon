import { EventSystem } from "./services/EventSystem";
import { Scene as SceneView } from "../app/view/Scene";
import { Scene as SceneModel } from "../app/model/Scene";

class App {
  view: SceneView;
  model: SceneModel;
  events: EventSystem;

  constructor() {
    this.view = new SceneView();
    this.model = new SceneModel();
  }

  run() {
    this.model.init();
    this.view.init();
  }
}

export { App };
