import * as THREE from "three";
import { Object } from "./Object/Object.abstract";
import { Observer } from "../services/Observer";
import { BasicView } from "./Object/Object.basic";

class Countertop extends Object implements Object, Observer {
  constructor() {
    super();

    const leftLeg = new BasicView();
    const rightLeg = new BasicView();
    const panel = new BasicView();
    this.children.push(leftLeg, rightLeg, panel);
  }
}

export { Countertop };
