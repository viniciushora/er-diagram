import { FC, html } from '@dineug/r-html';

import { ValuesType } from '@/internal-types';

import * as styles from './TablePropertiesTabs.styles';

export const Tab = {
  Indexes: 'Índices',
  SchemaSQL: 'Modelo Físico',
  GeneratorCode: 'Gerar Código',
} as const;
export type Tab = ValuesType<typeof Tab>;
const tabs: ReadonlyArray<string> = Object.values(Tab);

export type TablePropertiesTabsProps = {
  value: Tab;
  onChange: (value: Tab) => void;
};

const TablePropertiesTabs: FC<TablePropertiesTabsProps> = (props, ctx) => {
  return () => html`
    <div class=${styles.tabs}>
      ${tabs.map(
        tab => html`
          <div
            class=${[styles.tab, { selected: tab === props.value }]}
            @click=${() => props.onChange(tab as Tab)}
          >
            ${tab}
          </div>
        `
      )}
    </div>
  `;
};

export default TablePropertiesTabs;
