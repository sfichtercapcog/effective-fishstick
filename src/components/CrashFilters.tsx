import React from 'react';
import Select from 'react-select';
import styles from '../styles/CrashDashboard.module.css';

export type Option = { value: string; label: string };
export type Entity = { id: string; type: 'region' | 'city' | 'county' };
export type ChartMode = 'absolute' | 'normalized';

interface CrashFiltersProps {
  options: Option[];
  selectedEntities: Entity[];
  onChangeEntities: (entities: Entity[]) => void;
  chartMode: ChartMode;
  onChangeChartMode: (mode: ChartMode) => void;
}

export default function CrashFilters({
  options,
  selectedEntities,
  onChangeEntities,
  chartMode,
  onChangeChartMode,
}: CrashFiltersProps) {
  return (
    <div className={styles.controls}>
      <div className={styles.selector}>
        <label><strong>Select Entities:</strong></label>
        <Select<Option, true>
          isMulti
          options={options}
          value={options.filter(opt =>
            selectedEntities.some(sel => opt.value === `${sel.type}-${sel.id}`)
          )}
          onChange={opts => {
            const entities = opts.map(o => {
              const [type, id] = o.value.split('-');
              return { id, type: type as Entity['type'] };
            });
            onChangeEntities(entities);
          }}
          placeholder="Select cities or counties..."
          styles={{
            menuPortal: base => ({ ...base, zIndex: 9999 }),
          }}
          menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
        />
      </div>
      <div className={styles.toggleGroup}>
        <label><strong>View Mode:</strong></label>
        <div>
          <button
            onClick={() => onChangeChartMode('absolute')}
            className={chartMode === 'absolute' ? styles.activeBtn : ''}
          >
            Absolute
          </button>
          <button
            onClick={() => onChangeChartMode('normalized')}
            className={chartMode === 'normalized' ? styles.activeBtn : ''}
          >
            Normalized %
          </button>
        </div>
      </div>
    </div>
  );
}