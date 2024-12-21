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

    const leftLeg = new BasicView();
    leftLeg.metadata.id = "leftLeg";

    const rightLeg = new BasicView();
    rightLeg.metadata.id = "rightLeg";

    const panel = new BasicView();
    panel.metadata.id = "panel";

    this.children.push(leftLeg, rightLeg, panel);
    this.children.push(panel);
  }

  setModel(model: ObjectModel): void {
    if (model instanceof CountertopModel) {
      super.setModel(model);

      const { leftLeg, panel, rightLeg } = model.getChildren();
      const {
        panel: panelView,
        leftLeg: lLView,
        rightLeg: rlView,
      } = this.getChildren();

      if (panel) panelView?.setModel(panel);
      if (leftLeg) lLView?.setModel(leftLeg);
      if (rightLeg) rlView?.setModel(rightLeg);
    }
  }

  getChildren() {
    const panel = this.children.find(
      (child) => child.metadata.id === "panel"
    ) as BasicView | null;

    const leftLeg = this.children.find(
      (child) => child.metadata.id === "leftLeg"
    ) as BasicView | null;

    const rightLeg = this.children.find(
      (child) => child.metadata.id === "rightLeg"
    ) as BasicView | null;

    return { panel, leftLeg, rightLeg };
  }
}

export { Countertop };
