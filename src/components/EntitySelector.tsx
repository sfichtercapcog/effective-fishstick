import Select, { MultiValue } from "react-select";

type OptionType = { label: string; value: string };

interface Props {
  data: { cty: string; mun: string }[];
  onCountyChange: (vals: string[]) => void;
  onMuniChange: (vals: string[]) => void;
}

export default function EntitySelector({
  data,
  onCountyChange,
  onMuniChange,
}: Props) {
  const maxCount = 5;

  const countyOptions: OptionType[] = Array.from(
    new Set(data.map((d) => d.cty))
  )
    .sort()
    .map((c) => ({ label: `${c} County`, value: c }));

  const placeSet = Array.from(new Set(data.map((d) => d.mun)));
  const muniOptions: OptionType[] = placeSet
    .sort((a, b) => {
      const ua = a.startsWith("Unincorporated");
      const ub = b.startsWith("Unincorporated");
      if (ua !== ub) return ua ? 1 : -1;
      return a.localeCompare(b);
    })
    .map((m) => ({ label: m, value: m }));

  const isOptionDisabled = (
    _option: OptionType,
    selected: readonly OptionType[]
  ): boolean => selected.length >= maxCount;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        minWidth: "200px",
      }}
    >
      <Select<OptionType, true>
        options={countyOptions}
        isMulti
        onChange={(vals: MultiValue<OptionType>) =>
          onCountyChange(vals.map((v) => v.value))
        }
        placeholder="Select Counties"
        closeMenuOnSelect={false}
        isSearchable
        maxMenuHeight={150}
        styles={{ menu: (base) => ({ ...base, zIndex: 10 }) }}
        isOptionDisabled={isOptionDisabled}
      />
      <Select<OptionType, true>
        options={muniOptions}
        isMulti
        onChange={(vals: MultiValue<OptionType>) =>
          onMuniChange(vals.map((v) => v.value))
        }
        placeholder="Select Places"
        closeMenuOnSelect={false}
        isSearchable
        maxMenuHeight={150}
        styles={{ menu: (base) => ({ ...base, zIndex: 10 }) }}
        isOptionDisabled={isOptionDisabled}
      />
    </div>
  );
}
