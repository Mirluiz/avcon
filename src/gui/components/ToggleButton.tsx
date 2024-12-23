import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Typography } from "@mui/material";
import { Object } from "../../app/model/Object/Object";
import { Countertop as CountertopModel } from "../../app/model/Countertop";
import { Countertop } from "../../app/view/Countertop";

export default function ToggleButtons(props: { item: Countertop }) {
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
        value="prop_01.glb"
        aria-label="left aligned"
        onClick={(e, val) => {
          if (props.item.model instanceof CountertopModel) {
            const { model } = props.item;
            const { leftLeg, rightLeg } = model.getChildren();

            if (leftLeg) {
              const { backSupport, frontSupport } = leftLeg?.getChildren();
              if (backSupport) backSupport.asset = { url: val };
              if (frontSupport) frontSupport.asset = { url: val };
            }

            if (rightLeg) {
              const { backSupport, frontSupport } = rightLeg?.getChildren();
              if (backSupport) backSupport.asset = { url: val };
              if (frontSupport) frontSupport.asset = { url: val };
            }
          }

          if (props?.item?.model) {
            const { leftLeg, rightLeg } = props.item.getChildren();

            leftLeg?.children.forEach((child) => (child.fetched = false));
            rightLeg?.children.forEach((child) => (child.fetched = false));
            leftLeg?.children.forEach((child) => child.hardRefresh());
            rightLeg?.children.forEach((child) => child.hardRefresh());
          }
        }}
      >
        <Typography>Вариант 1</Typography>
      </ToggleButton>
      <ToggleButton
        value="prop_02.glb"
        aria-label="centered"
        onClick={(e, val) => {
          if (props.item.model instanceof CountertopModel) {
            const { model } = props.item;
            const { leftLeg, rightLeg } = model.getChildren();

            if (leftLeg) {
              const { backSupport, frontSupport } = leftLeg?.getChildren();
              if (backSupport) backSupport.asset = { url: val };
              if (frontSupport) frontSupport.asset = { url: val };
            }

            if (rightLeg) {
              const { backSupport, frontSupport } = rightLeg?.getChildren();
              if (backSupport) backSupport.asset = { url: val };
              if (frontSupport) frontSupport.asset = { url: val };
            }

            // leftLeg?.notifyObservers();
            // rightLeg?.notifyObservers();
          }

          if (props?.item?.model) {
            const { leftLeg, rightLeg } = props.item.getChildren();

            leftLeg?.children.forEach((child) => (child.fetched = false));
            rightLeg?.children.forEach((child) => (child.fetched = false));
            leftLeg?.children.forEach((child) => child.hardRefresh());
            rightLeg?.children.forEach((child) => child.hardRefresh());
          }
        }}
      >
        <Typography>Вариант 2</Typography>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
