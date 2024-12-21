import { App } from "./app/app";
import { Scene } from "./scene";

const canvas = document.querySelector("#canvas");
if (canvas) {
  (canvas as HTMLElement).style.height = "100vh";
  (canvas as HTMLElement).style.width = "100vw";

  const threeJSScene = new Scene({ canvas: canvas });
  const app = new App();
  app.run();

  app.events.subscribe("scene_init", (views) => {
    views.forEach((view) => {
      threeJSScene.scene.add(view.render());
    });
  });

  threeJSScene.animate();
}
