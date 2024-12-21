import React, { useEffect, useRef, useState } from "react";
import { Grid } from "@mui/material";
import { App } from "../app/app";
import { Scene } from "../scene";
import { RightPanel } from "./RightPanel";
import { Object } from "../app/view/Object";

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}

export const GuiApp = () => {
  const forceUpdate = useForceUpdate();
  const element = useRef<HTMLDivElement | null>(null);
  const activeItem = useRef<Object | null>(null);

  useEffect(() => {
    if (element.current) {
      try {
        const three = new Scene({ canvas: element.current });

        const app = new App();

        app.events.subscribe("scene_init", (views) => {
          views.forEach((view, index) => {
            if (index === 0) {
              // first item choosed for showcase;
              activeItem.current = view;
            }

            view.render();
            const { mesh } = view;
            if (mesh) three.scene.add(mesh);
          });
        });

        app.init();
        three.animate();
        forceUpdate();
      } catch (er) {
        console.log("Error", er);
      }
    }
  }, []);

  return (
    <Grid container>
      <Grid
        item
        lg={9.5}
        ref={element}
        tabIndex={0}
        style={{
          height: "100vh",
          width: "100%",
        }}
      />
      <Grid item lg={2.5} style={{ height: "100vh", overflowY: "scroll" }}>
        <RightPanel item={activeItem.current} />
      </Grid>
    </Grid>
  );
};
