import { AppContext } from '@/components/appContext';
import { RelationshipType } from '@/constants/schema';
import { drawStartRelationshipAction$ } from '@/engine/modules/editor/generator.actions';
import { KeyBindingName } from '@/utils/keyboard-shortcut';

type Menu = {
  iconName: string;
  name: string;
  keyBindingName: KeyBindingName;
  relationshipType: number;
};

export const menus: Menu[] = [
  {
    iconName: 'ZeroOne',
    name: '(0,1)',
    keyBindingName: KeyBindingName.relationshipZeroOne,
    relationshipType: RelationshipType.ZeroOne,
  },
  {
    iconName: 'ZeroN',
    name: '(0,n)',
    keyBindingName: KeyBindingName.relationshipZeroN,
    relationshipType: RelationshipType.ZeroN,
  },
  {
    iconName: 'OneOnly',
    name: '1',
    keyBindingName: KeyBindingName.relationshipOneOnly,
    relationshipType: RelationshipType.OneOnly,
  },
  {
    iconName: 'OneN',
    name: '(1,n)',
    keyBindingName: KeyBindingName.relationshipOneN,
    relationshipType: RelationshipType.OneN,
  },
];

export function createDrawRelationshipMenus(
  { store, keyBindingMap }: AppContext,
  onClose: () => void
) {
  return menus.map(menu => ({
    iconName: menu.iconName,
    name: menu.name,
    shortcut: keyBindingMap[menu.keyBindingName][0]?.shortcut,
    onClick: () => {
      store.dispatch(drawStartRelationshipAction$(menu.relationshipType));
      onClose();
    },
  }));
}
