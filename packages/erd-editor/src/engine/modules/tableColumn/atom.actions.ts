import { SchemaV3Constants } from '@dineug/erd-editor-schema';
import { createAction } from '@dineug/r-html';

import { query } from '@/utils/collection/query';
import { createTable } from '@/utils/collection/table.entity';
import { createColumn } from '@/utils/collection/tableColumn.entity';

import { ActionMap, ActionType, ReducerType } from './actions';

export const addColumnAction = createAction<
  ActionMap[typeof ActionType.addColumn]
>(ActionType.addColumn);

const addColumn: ReducerType<typeof ActionType.addColumn> = (
  { collections },
  { id, tableId }
) => {
  const tableCollection = query(collections).collection('tableEntities');
  const table = tableCollection.getOrCreate(tableId, id => createTable({ id }));

  if (!table.columnIds.includes(id)) {
    tableCollection.updateOne(tableId, table => {
      table.columnIds.push(id);
    });
  }

  const column = createColumn({ id });
  query(collections).collection('tableColumnEntities').addOne(column);
};

export const removeColumnAction = createAction<
  ActionMap[typeof ActionType.removeColumn]
>(ActionType.removeColumn);

const removeColumn: ReducerType<typeof ActionType.removeColumn> = (
  { collections },
  { ids, tableId }
) => {
  const tableCollection = query(collections).collection('tableEntities');
  const table = tableCollection.selectById(tableId);
  if (!table) {
    return;
  }

  for (const id of ids) {
    const index = table.columnIds.indexOf(id);
    if (index !== -1) {
      tableCollection.updateOne(tableId, table => {
        table.columnIds.splice(index, 1);
      });
    }
  }
};

export const changeColumnNameAction = createAction<
  ActionMap[typeof ActionType.changeColumnName]
>(ActionType.changeColumnName);

const changeColumnName: ReducerType<typeof ActionType.changeColumnName> = (
  { collections },
  { tableId, id, value },
  { toWidth }
) => {
  query(collections)
    .collection('tableEntities')
    .getOrCreate(tableId, id => createTable({ id }));

  const collection = query(collections).collection('tableColumnEntities');
  collection.getOrCreate(id, id => createColumn({ id }));
  collection.updateOne(id, column => {
    column.name = value;
    column.ui.widthName = toWidth(value);
  });
};

export const changeColumnCommentAction = createAction<
  ActionMap[typeof ActionType.changeColumnComment]
>(ActionType.changeColumnComment);

const changeColumnComment: ReducerType<
  typeof ActionType.changeColumnComment
> = ({ collections }, { tableId, id, value }, { toWidth }) => {
  query(collections)
    .collection('tableEntities')
    .getOrCreate(tableId, id => createTable({ id }));

  const collection = query(collections).collection('tableColumnEntities');
  collection.getOrCreate(id, id => createColumn({ id }));
  collection.updateOne(id, column => {
    column.comment = value;
    column.ui.widthComment = toWidth(value);
  });
};

export const changeColumnDataTypeAction = createAction<
  ActionMap[typeof ActionType.changeColumnDataType]
>(ActionType.changeColumnDataType);

const changeColumnDataType: ReducerType<
  typeof ActionType.changeColumnDataType
> = ({ collections }, { tableId, id, value }, { toWidth }) => {
  query(collections)
    .collection('tableEntities')
    .getOrCreate(tableId, id => createTable({ id }));

  const collection = query(collections).collection('tableColumnEntities');
  collection.getOrCreate(id, id => createColumn({ id }));
  collection.updateOne(id, column => {
    column.dataType = value;
    column.ui.widthDataType = toWidth(value);
  });
};

export const changeColumnDefaultAction = createAction<
  ActionMap[typeof ActionType.changeColumnDefault]
>(ActionType.changeColumnDefault);

const changeColumnDefault: ReducerType<
  typeof ActionType.changeColumnDefault
> = ({ collections }, { tableId, id, value }, { toWidth }) => {
  query(collections)
    .collection('tableEntities')
    .getOrCreate(tableId, id => createTable({ id }));

  const collection = query(collections).collection('tableColumnEntities');
  collection.getOrCreate(id, id => createColumn({ id }));
  collection.updateOne(id, column => {
    column.default = value;
    column.ui.widthDefault = toWidth(value);
  });
};

export const changeColumnAutoIncrementAction = createAction<
  ActionMap[typeof ActionType.changeColumnAutoIncrement]
>(ActionType.changeColumnAutoIncrement);

const changeColumnAutoIncrement: ReducerType<
  typeof ActionType.changeColumnAutoIncrement
> = ({ collections }, { tableId, id, value }) => {
  query(collections)
    .collection('tableEntities')
    .getOrCreate(tableId, id => createTable({ id }));

  const collection = query(collections).collection('tableColumnEntities');
  collection.getOrCreate(id, id => createColumn({ id }));
  collection.updateOne(id, column => {
    column.options = value
      ? column.options | SchemaV3Constants.ColumnOption.autoIncrement
      : column.options & ~SchemaV3Constants.ColumnOption.autoIncrement;
  });
};

export const changeColumnPrimaryKeyAction = createAction<
  ActionMap[typeof ActionType.changeColumnPrimaryKey]
>(ActionType.changeColumnPrimaryKey);

const changeColumnPrimaryKey: ReducerType<
  typeof ActionType.changeColumnPrimaryKey
> = ({ collections }, { tableId, id, value }) => {
  query(collections)
    .collection('tableEntities')
    .getOrCreate(tableId, id => createTable({ id }));

  const collection = query(collections).collection('tableColumnEntities');
  collection.getOrCreate(id, id => createColumn({ id }));
  collection.updateOne(id, column => {
    column.options = value
      ? column.options | SchemaV3Constants.ColumnOption.primaryKey
      : column.options & ~SchemaV3Constants.ColumnOption.primaryKey;

    if (value) {
      if (column.ui.keys & SchemaV3Constants.ColumnUIKey.foreignKey) {
        column.ui.keys =
          SchemaV3Constants.ColumnUIKey.primaryKey |
          SchemaV3Constants.ColumnUIKey.foreignKey;
      } else {
        column.ui.keys = SchemaV3Constants.ColumnUIKey.primaryKey;
      }
    } else {
      if (
        column.ui.keys & SchemaV3Constants.ColumnUIKey.primaryKey &&
        column.ui.keys & SchemaV3Constants.ColumnUIKey.foreignKey
      ) {
        column.ui.keys = SchemaV3Constants.ColumnUIKey.foreignKey;
      } else {
        column.ui.keys = 0;
      }
    }
  });
};

export const changeColumnUniqueAction = createAction<
  ActionMap[typeof ActionType.changeColumnUnique]
>(ActionType.changeColumnUnique);

const changeColumnUnique: ReducerType<typeof ActionType.changeColumnUnique> = (
  { collections },
  { tableId, id, value }
) => {
  query(collections)
    .collection('tableEntities')
    .getOrCreate(tableId, id => createTable({ id }));

  const collection = query(collections).collection('tableColumnEntities');
  collection.getOrCreate(id, id => createColumn({ id }));
  collection.updateOne(id, column => {
    column.options = value
      ? column.options | SchemaV3Constants.ColumnOption.unique
      : column.options & ~SchemaV3Constants.ColumnOption.unique;
  });
};

export const changeColumnNotNullAction = createAction<
  ActionMap[typeof ActionType.changeColumnNotNull]
>(ActionType.changeColumnNotNull);

const changeColumnNotNull: ReducerType<
  typeof ActionType.changeColumnNotNull
> = ({ collections }, { tableId, id, value }) => {
  query(collections)
    .collection('tableEntities')
    .getOrCreate(tableId, id => createTable({ id }));

  const collection = query(collections).collection('tableColumnEntities');
  collection.getOrCreate(id, id => createColumn({ id }));
  collection.updateOne(id, column => {
    column.options = value
      ? column.options | SchemaV3Constants.ColumnOption.notNull
      : column.options & ~SchemaV3Constants.ColumnOption.notNull;
  });
};

export const tableColumnReducers = {
  [ActionType.addColumn]: addColumn,
  [ActionType.removeColumn]: removeColumn,
  [ActionType.changeColumnName]: changeColumnName,
  [ActionType.changeColumnComment]: changeColumnComment,
  [ActionType.changeColumnDataType]: changeColumnDataType,
  [ActionType.changeColumnDefault]: changeColumnDefault,
  [ActionType.changeColumnAutoIncrement]: changeColumnAutoIncrement,
  [ActionType.changeColumnPrimaryKey]: changeColumnPrimaryKey,
  [ActionType.changeColumnUnique]: changeColumnUnique,
  [ActionType.changeColumnNotNull]: changeColumnNotNull,
};

export const actions = {
  addColumnAction,
  removeColumnAction,
  changeColumnNameAction,
  changeColumnCommentAction,
  changeColumnDataTypeAction,
  changeColumnDefaultAction,
  changeColumnAutoIncrementAction,
  changeColumnPrimaryKeyAction,
  changeColumnUniqueAction,
  changeColumnNotNullAction,
};
