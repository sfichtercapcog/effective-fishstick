import clsx from "clsx";
import styles from "../styles/CrashDashboard.module.css";

type Props = {
  selected: number[];
  setSelected: (s: number[] | ((prev: number[]) => number[])) => void;
};

export default function SeverityFilter({ selected, setSelected }: Props) {
  const toggle = (sev: number) => {
    setSelected((prev) =>
      prev.includes(sev)
        ? prev.filter((s: number) => s !== sev)
        : [...prev, sev]
    );
  };

  return (
    <div className={styles.chips}>
      {[1, 2, 3, 4, 5].map((sev) => (
        <button
          key={sev}
          className={clsx(
            styles.chip,
            selected.includes(sev) && styles.activeChip
          )}
          onClick={() => toggle(sev)}
        >
          Sev {sev}
        </button>
      ))}
    </div>
  );
}
