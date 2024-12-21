import * as THREE from "three";
import { Object } from "./Object/Object.abstract";
import { Observer } from "../services/Observer";
import { BasicView } from "./Object/Object.basic";
import { Object as IObject } from "./Object/Object";
import { Object as ObjectModel } from "./../model/Object/Object";
import { Countertop as CountertopModel } from "../model/Countertop";

class Countertop extends Object implements IObject, Observer {
  constructor() {
    super();

    // const leftLeg = new BasicView();
    // const rightLeg = new BasicView();
    const panel = new BasicView();
    panel.metadata.id = "panel";
    // this.children.push(leftLeg, rightLeg, panel);
    this.children.push(panel);
  }

  setModel(model: ObjectModel): void {
    if (model instanceof CountertopModel) {
      const { leftLeg, panel, rightLeg } = model.getChildren();
      const { panel: panelView } = this.getChildren();
      console.log("panelview", panelView);

      if (panel) panelView?.setModel(panel);
    }
  }

  getChildren() {
    const panel = this.children.find(
      (child) => child.metadata.id === "panel"
    ) as BasicView | null;

    return { panel };
  }
}

export { Countertop };
