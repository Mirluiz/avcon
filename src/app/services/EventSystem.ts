import { Object } from "../view/Object/Object";
import { uuidv4 } from "./uuid";

type SceneEvents = "scene_init";

type SceneData = {
  scene_init: Object[];
};

class EventSystem {
  private _events: {
    [key in string]: Array<{
      id: string;
      callBack: (...args: any[]) => void;
    }>;
  } = {};

  subscribe<T extends SceneEvents>(
    action: T,
    event: (data: SceneData[T]) => void
  ) {
    if (typeof event === "function") {
      if (this._events[action]) {
        this._events[action].push({
          id: uuidv4(),
          callBack: event,
        });
      } else {
        this._events[action] = [
          {
            id: uuidv4(),
            callBack: event,
          },
        ];
      }
    } else {
      console.warn("Event has to be a function!");
    }
  }

  unsubscribe(action: string) {
    if (this._events[action]) {
      delete this._events[action];
    }
  }

  emit<T extends SceneEvents>(action: T, data?: SceneData[T]) {
    if (this._events[action]) {
      this._events[action].map((event) => event.callBack(data));
    }
  }
}
export { EventSystem };
