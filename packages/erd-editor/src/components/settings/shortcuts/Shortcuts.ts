import { FC, html } from '@dineug/r-html';

import { useAppContext } from '@/components/appContext';
import Kbd from '@/components/primitives/kbd/Kbd';
import { ShortcutOption } from '@/utils/keyboard-shortcut';

import * as styles from './Shortcuts.styles';

export type ShortcutsProps = {};

type ShortcutItem = {
  command: string;
  shortcuts: ShortcutOption[];
};

const Shortcuts: FC<ShortcutsProps> = (props, ctx) => {
  const app = useAppContext(ctx);

  const getItems = (): ShortcutItem[] => {
    const { keyBindingMap } = app.value;

    return [
      {
        command: 'Editar',
        shortcuts: keyBindingMap.edit,
      },
      {
        command: 'Parar',
        shortcuts: keyBindingMap.stop,
      },
      {
        command: 'Buscar',
        shortcuts: keyBindingMap.search,
      },
      {
        command: 'Desfazer',
        shortcuts: keyBindingMap.undo,
      },
      {
        command: 'Refazer',
        shortcuts: keyBindingMap.redo,
      },
      {
        command: 'Adicionar Tabela',
        shortcuts: keyBindingMap.addTable,
      },
      {
        command: 'Adicionar Coluna',
        shortcuts: keyBindingMap.addColumn,
      },
      {
        command: 'Adicionar Anotação',
        shortcuts: keyBindingMap.addMemo,
      },
      {
        command: 'Remover Tabela, Anotação',
        shortcuts: keyBindingMap.removeTable,
      },
      {
        command: 'Remover Coluna',
        shortcuts: keyBindingMap.removeColumn,
      },
      {
        command: 'Chave Primária',
        shortcuts: keyBindingMap.primaryKey,
      },
      {
        command: 'Selecionar todas as Tabelas, Anotações',
        shortcuts: keyBindingMap.selectAllTable,
      },
      {
        command: 'Selecionar todas as Colunas',
        shortcuts: keyBindingMap.selectAllColumn,
      },
      {
        command: 'Relacionamento (0,1)',
        shortcuts: keyBindingMap.relationshipZeroOne,
      },
      {
        command: 'Relacionamento (0,n)',
        shortcuts: keyBindingMap.relationshipZeroN,
      },
      {
        command: 'Relacionamento (1,1)',
        shortcuts: keyBindingMap.relationshipOneOnly,
      },
      {
        command: 'Relacionamento (1,n)',
        shortcuts: keyBindingMap.relationshipOneN,
      },
      {
        command: 'Propriedades da Tabela',
        shortcuts: keyBindingMap.tableProperties,
      },
      {
        command: 'Aumentar Zoom',
        shortcuts: keyBindingMap.zoomIn,
      },
      {
        command: 'Diminuir Zoom',
        shortcuts: keyBindingMap.zoomOut,
      },
    ];
  };

  return () => {
    return html`
      <table class=${styles.table}>
        <thead>
          <tr>
            <th>Comando</th>
            <th>Atalho</th>
          </tr>
        </thead>
        <tbody>
          ${getItems().map(
            ({ command, shortcuts }) => html`
              <tr>
                <td>${command}</td>
                <td>
                  ${shortcuts.map(
                    ({ shortcut }) => html`
                      <div class=${styles.shortcutGroup}>
                        <${Kbd} shortcut=${shortcut} />
                      </div>
                    `
                  )}
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  };
};

export default Shortcuts;
