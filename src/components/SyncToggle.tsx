// components/SyncToggle.tsx

type SyncToggleProps = {
  syncFilters: boolean;
  setSyncFilters: (value: boolean) => void;
};

export default function SyncToggle({
  syncFilters,
  setSyncFilters,
}: SyncToggleProps) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <input
          type="checkbox"
          checked={syncFilters}
          onChange={(e) => setSyncFilters(e.target.checked)}
        />
        Sync Filters for Both Layers
      </label>
    </div>
  );
}
