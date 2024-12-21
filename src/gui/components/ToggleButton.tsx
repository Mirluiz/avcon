import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Typography } from "@mui/material";

export default function ToggleButtons() {
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
      <ToggleButton value="leg1" aria-label="left aligned">
        <Typography>Вариант 1</Typography>
      </ToggleButton>
      <ToggleButton value="leg2" aria-label="centered">
        <Typography>Вариант 2</Typography>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
