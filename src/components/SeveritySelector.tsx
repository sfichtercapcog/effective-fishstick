import Select, { MultiValue } from "react-select";

type Opt = { value: number; label: string };

interface Props {
  selected: number[];
  setSelected: (vals: number[]) => void;
}

export default function SeveritySelector({ selected, setSelected }: Props) {
  // Define options including the "All Crashes" pseudo-option with value 0
  const allOpts: Opt[] = [
    { value: 0, label: "All Crashes" },
    ...[1, 2, 3, 4, 5].map((s) => ({ value: s, label: `Severity ${s}` })),
  ];

  // Compute the react-select "value" prop:
  // - If every severity (1–5) is in selected, show only the "All Crashes" tag.
  // - Otherwise show the individual sev tags.
  const value: Opt[] =
    selected.length === 5
      ? allOpts.filter((o) => o.value === 0)
      : allOpts.filter((o) => selected.includes(o.value));

  return (
    <div style={{ minWidth: 180 }}>
      <label style={{ display: "block", fontWeight: 600, marginBottom: 4 }}>
        Severity
      </label>
      <Select<Opt, true>
        options={allOpts}
        value={value}
        isMulti
        closeMenuOnSelect={false}
        onChange={(vals: MultiValue<Opt>) => {
          // If user selects "All Crashes", reset to [1,2,3,4,5]
          if (vals.some((v) => v.value === 0)) {
            setSelected([1, 2, 3, 4, 5]);
          } else {
            setSelected(vals.map((v) => v.value));
          }
        }}
        placeholder="All Crashes"
      />
    </div>
  );
}
