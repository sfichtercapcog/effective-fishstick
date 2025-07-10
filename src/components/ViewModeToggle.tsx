import Select from "react-select";

type Mode = "absolute" | "percent";

interface Props {
  selected: Mode;
  setSelected: (val: Mode) => void;
}

const options = [
  { value: "absolute", label: "Total Count" },
  { value: "percent", label: "% of Region" },
];

export default function ViewModeToggle({ selected, setSelected }: Props) {
  return (
    <div>
      <label style={{ fontWeight: 600 }}>View Mode</label>
      <Select
        options={options}
        value={options.find((o) => o.value === selected)}
        onChange={(opt) => opt && setSelected(opt.value as Mode)}
        className="react-select-container"
        classNamePrefix="react-select"
      />
    </div>
  );
}
