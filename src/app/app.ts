import { EventSystem } from "./services/EventSystem";
import { Scene as SceneView } from "../app/view/Scene";
import { Scene as SceneModel } from "../app/model/Scene";

class App {
  view: SceneView;
  model: SceneModel;
  events: EventSystem;

  constructor() {
    this.model = new SceneModel();
    this.view = new SceneView(this.model);
    this.events = new EventSystem();
  }

  init() {
    this.model.init();
    this.view.init();
    this.events.emit("scene_init", this.view.views);
  }
}

export { App };
