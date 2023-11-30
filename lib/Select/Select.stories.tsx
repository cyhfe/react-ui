import {
  SelectLabel,
  SelectOption,
  SelectPlaceholder,
  SelectPopup,
  SelectRoot,
  SelectTrigger,
} from ".";

export default {
  title: "Components/Select",
};

const options = [
  { value: "ocean", label: "Ocean", color: "#00B8D9" },
  { value: "blue", label: "Blue", color: "#0052CC" },
  { value: "purple", label: "Purple", color: "#5243AA" },
  { value: "red", label: "Red", color: "#FF5630" },
  { value: "orange", label: "Orange", color: "#FF8B00" },
  { value: "yellow", label: "Yellow", color: "#FFC400" },
  { value: "green", label: "Green", color: "#36B37E" },
  { value: "forest", label: "Forest", color: "#00875A" },
  { value: "slate", label: "Slate", color: "#253858" },
  { value: "silver", label: "Silver", color: "#666666" },
];

export function Single() {
  return (
    <SelectRoot placeholder="choose color">
      <SelectTrigger className="w-80 min-h-[30px] px-3 py-2 text-left border rounded shadow">
        <SelectPlaceholder className="text-slate-500" />
        <SelectLabel />
      </SelectTrigger>

      <SelectPopup
        keepMounted
        className="flex flex-col gap-y-1 p-2 w-80 min-h-[30px] max-h-[200px] overflow-auto border rounded shadow "
      >
        {options.map((option) => {
          return (
            <SelectOption
              key={option.value}
              value={option.value}
              className="text-left hover:bg-slate-100 px-3 py-2 data-[selected=true]:bg-blue-100 data-[selected=true]:text-blue-900 rounded  "
            >
              {option.label}
            </SelectOption>
          );
        })}
      </SelectPopup>
    </SelectRoot>
  );
}

export function Multiple() {
  return (
    <SelectRoot placeholder="choose color" multiple>
      <SelectTrigger className="w-80 min-h-[30px] px-3 py-2 text-left border rounded shadow">
        <SelectPlaceholder className="text-slate-500" />
        <SelectLabel />
      </SelectTrigger>

      <SelectPopup
        keepMounted
        className="flex flex-col gap-y-1 p-2 w-80 min-h-[30px] max-h-[200px] overflow-auto border rounded shadow "
      >
        {options.map((option) => {
          return (
            <SelectOption
              key={option.value}
              value={option.value}
              className="text-left hover:bg-slate-100 px-3 py-2 data-[selected=true]:bg-blue-100 data-[selected=true]:text-blue-900 rounded  "
            >
              {option.label}
            </SelectOption>
          );
        })}
      </SelectPopup>
    </SelectRoot>
  );
}
