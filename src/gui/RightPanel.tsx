import React, { useEffect, useRef, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Grid, Stack } from "@mui/material";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { InputSlider } from "./components/InputSlider";
import ToggleButtons from "./components/ToggleButton";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: "rotate(90deg)",
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(255, 255, 255, .05)",
  }),
}));

const shapeStyles = { bgcolor: "black", width: 40, height: 40 };
const shapeCircleStyles = { borderRadius: "50%" };
const circle = (color: string) => (
  <Box sx={{ ...shapeStyles, ...shapeCircleStyles, bgcolor: color }} />
);

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}

export const RightPanel = () => {
  return (
    <Grid
      sx={{
        padding: 1,
      }}
    >
      <Accordion defaultExpanded={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Материал вверха</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={3} direction="row">
            {circle("#c7b299")}
            {circle("#cd7f32")}
            {circle("#1c1c1c")}
            {circle("#f0f0f0")}
            {circle("#773f1a")}
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Размеры</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <InputSlider
            name={"Ширина А (мм)"}
            onChange={(val: number) => {
              console.log("val", val);
            }}
            ext={{
              min: 1200,
              max: 2400,
            }}
          />

          <InputSlider
            name={"Глубина А (мм)"}
            onChange={(val: number) => {
              console.log("val", val);
            }}
            ext={{
              min: 300,
              max: 900,
            }}
          />

          <InputSlider
            name={"Высота А (мм)"}
            onChange={(val: number) => {
              console.log("val", val);
            }}
            ext={{
              min: 500,
              max: 1200,
            }}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Опоры</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ToggleButtons />
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};
