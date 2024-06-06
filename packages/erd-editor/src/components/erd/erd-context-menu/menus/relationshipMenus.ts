import { query } from '@dineug/erd-editor-schema';

import { AppContext } from '@/components/appContext';
import { RelationshipType } from '@/constants/schema';
import { changeRelationshipTypeAction } from '@/engine/modules/relationship/atom.actions';

type Menu = {
  iconName: string;
  name: string;
  relationshipType: number;
};

const menus: Menu[] = [
  {
    iconName: 'ZeroOne',
    name: '(0,1)',
    relationshipType: RelationshipType.ZeroOne,
  },
  {
    iconName: 'ZeroN',
    name: '(0,n)',
    relationshipType: RelationshipType.ZeroN,
  },
  {
    iconName: 'OneOnly',
    name: '1',
    relationshipType: RelationshipType.OneOnly,
  },
  {
    iconName: 'OneN',
    name: '(0,n)',
    relationshipType: RelationshipType.OneN,
  },
];

export function createRelationshipMenus(
  { store }: AppContext,
  relationshipId?: string
) {
  if (!relationshipId) return [];

  const { collections } = store.state;
  const relationship = query(collections)
    .collection('relationshipEntities')
    .selectById(relationshipId);
  if (!relationship) return [];

  return menus.map(menu => {
    const checked = menu.relationshipType === relationship.relationshipType;

    return {
      checked,
      iconName: menu.iconName,
      name: menu.name,
      onClick: () => {
        store.dispatch(
          changeRelationshipTypeAction({
            id: relationshipId,
            value: menu.relationshipType,
          })
        );
      },
    };
  });
}
