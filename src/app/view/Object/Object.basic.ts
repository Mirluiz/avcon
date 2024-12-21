import * as THREE from "three";
import { Object } from "./Object.abstract";
import { Observer } from "../../services/Observer";

class BasicView extends Object implements Object, Observer {}

export { BasicView };
