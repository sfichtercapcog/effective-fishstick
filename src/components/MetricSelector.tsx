import Select from "react-select";

type Metric = "crashes" | "injuries" | "deaths";

interface Props {
  selected: Metric;
  setSelected: (val: Metric) => void;
}

const options = [
  { value: "crashes", label: "Crashes" },
  { value: "injuries", label: "Injuries" },
  { value: "deaths", label: "Deaths" },
];

export default function MetricSelector({ selected, setSelected }: Props) {
  return (
    <div>
      <label style={{ fontWeight: 600 }}>Metric</label>
      <Select
        options={options}
        value={options.find((o) => o.value === selected)}
        onChange={(opt) => opt && setSelected(opt.value as Metric)}
        className="react-select-container"
        classNamePrefix="react-select"
      />
    </div>
  );
}
