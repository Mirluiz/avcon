import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Typography } from "@mui/material";
import { Object } from "../../app/model/Object/Object";
import { Countertop } from "../../app/model/Countertop";

export default function ToggleButtons(props: { item: Object }) {
  const [alignment, setAlignment] = React.useState<string | null>("left");

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    setAlignment(newAlignment);
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
    >
      <ToggleButton
        value="leg1"
        aria-label="left aligned"
        onClick={(e, val) => {
          if (props?.item instanceof Countertop) {
            console.log("-12", props.item);
            props?.item.setLegSupport("prop_01.glb");
            props.item?.notifyObservers();
          }
        }}
      >
        <Typography>Вариант 1</Typography>
      </ToggleButton>
      <ToggleButton
        value="leg2"
        aria-label="centered"
        onClick={(e, val) => {
          if (props?.item instanceof Countertop) {
            props?.item.setLegSupport("prop_02.glb");
            props.item?.notifyObservers();
          }
        }}
      >
        <Typography>Вариант 2</Typography>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
