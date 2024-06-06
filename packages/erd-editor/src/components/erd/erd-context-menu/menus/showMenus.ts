import { AppContext } from '@/components/appContext';
import { Show } from '@/constants/schema';
import { changeShowAction } from '@/engine/modules/settings/atom.actions';
import { bHas } from '@/utils/bit';

type Menu = {
  name: string;
  show: number;
};

const menus: Menu[] = [
  {
    name: 'Comentário da Tabela',
    show: Show.tableComment,
  },
  {
    name: 'Comentário da Coluna',
    show: Show.columnComment,
  },
  {
    name: 'Tipo de Dado',
    show: Show.columnDataType,
  },
  {
    name: 'Default',
    show: Show.columnDefault,
  },
  {
    name: 'Not Null',
    show: Show.columnNotNull,
  },
  {
    name: 'Unique',
    show: Show.columnUnique,
  },
  {
    name: 'Auto Increment',
    show: Show.columnAutoIncrement,
  },
  {
    name: 'Relacionamento',
    show: Show.relationship,
  },
];

export function createShowMenus({ store }: AppContext) {
  const { settings } = store.state;

  return menus.map(menu => {
    const checked = bHas(settings.show, menu.show);

    return {
      checked,
      name: menu.name,
      onClick: () => {
        store.dispatch(
          changeShowAction({
            show: menu.show,
            value: !checked,
          })
        );
      },
    };
  });
}
