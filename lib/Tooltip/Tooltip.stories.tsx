import { Tooltip, TooltipContent, TooltipGroup, TooltipTrigger } from ".";

export default { title: "Components/Tooltip" };

export function Group() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 5,
      }}
    >
      <TooltipGroup delay={200}>
        <Tooltip>
          <TooltipTrigger>trigger1</TooltipTrigger>
          <TooltipContent>Label 1</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>trigger2</TooltipTrigger>
          <TooltipContent>Label 2</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>trigger3</TooltipTrigger>
          <TooltipContent>Label 3</TooltipContent>
        </Tooltip>
      </TooltipGroup>
    </div>
  );
}
