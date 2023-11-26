import { Tooltip, TooltipContent, TooltipGroup, TooltipTrigger } from ".";

export default { title: "Components/Tooltip", tags: ["autodocs"] };

export function Default() {
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
          <TooltipTrigger className="border border-black rounded px-2 py-1">
            default
          </TooltipTrigger>
          <TooltipContent className="bg-black text-white px-2 py-1 text-sm rounded">
            Label
          </TooltipContent>
        </Tooltip>

        <Tooltip showArrow={false}>
          <TooltipTrigger className="border border-black rounded px-2 py-1">
            hidden arrow
          </TooltipTrigger>
          <TooltipContent className="bg-black text-white px-2 py-1 text-sm rounded">
            Label
          </TooltipContent>
        </Tooltip>
        <Tooltip arrowColor="#10b981">
          <TooltipTrigger className="border border-black rounded px-2 py-1">
            color
          </TooltipTrigger>
          <TooltipContent className="bg-emerald-500 text-white px-2 py-1 text-sm rounded">
            Label
          </TooltipContent>
        </Tooltip>
      </TooltipGroup>
    </div>
  );
}
