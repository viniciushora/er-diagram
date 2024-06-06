import { AppContext } from '@/components/appContext';
import { BracketType } from '@/constants/schema';
import { changeBracketTypeAction } from '@/engine/modules/settings/atom.actions';

type Menu = {
  name: string;
  value: number;
};

export const menus: Menu[] = [
  {
    name: 'Aspas simples',
    value: BracketType.singleQuote,
  },
  {
    name: 'Aspas duplas',
    value: BracketType.doubleQuote,
  },
  {
    name: 'Crases',
    value: BracketType.backtick,
  },
  {
    name: 'None',
    value: BracketType.none,
  },
];

export function createBracketMenus({ store }: AppContext) {
  const { settings } = store.state;

  return menus.map(menu => {
    const checked = menu.value === settings.bracketType;

    return {
      checked,
      name: menu.name,
      onClick: () => {
        store.dispatch(
          changeBracketTypeAction({
            value: menu.value,
          })
        );
      },
    };
  });
}
