import React, { useEffect, useRef, useState } from "react";
// import { RightPanel } from "./RightPanel";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  MenuItem,
  Snackbar,
  TextField,
} from "@mui/material";
import { App } from "../app/app";
import { Scene } from "../scene";
import { RightPanel } from "./RightPanel";

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}

export const GuiApp = () => {
  const [backDrop, setBackDrop] = useState(false);

  const [app, setApp] = useState<App | null>(null);
  const element = useRef<HTMLDivElement | null>(null);

  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (element.current) {
      try {
        const three = new Scene({ canvas: element.current });

        const app = new App();
        three.animate();
      } catch (er) {
        console.log("Error", er);
      }
    }
  }, []);

  return (
    <Grid
      container
      onMouseMove={(event) => {
        console.log("");
      }}
    >
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
        <RightPanel />
      </Grid>
    </Grid>
  );
};
