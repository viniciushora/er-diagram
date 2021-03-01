import { State } from '@@types/engine/store';
import {
  HasUndoRedo,
  FocusTable,
  FocusColumn,
  FocusMoveTable,
} from '@@types/engine/command/editor.cmd';
import { getData } from '@/core/helper';
import {
  appendSelectColumns,
  selectRangeColumns,
  appendSelectRangeColumns,
} from './helper/editor.helper';
import {
  arrowUp,
  arrowRight,
  arrowDown,
  arrowLeft,
} from './helper/editor.focus.helper';

export function executeHasUndoRedo({ editorState }: State, data: HasUndoRedo) {
  editorState.hasUndo = data.hasUndo;
  editorState.hasRedo = data.hasRedo;
}

export function executeFocusTable(
  { editorState, tableState: { tables } }: State,
  data: FocusTable
) {
  if (editorState.focusTable?.table.id === data.tableId && data.focusType) {
    editorState.focusTable.focusType = data.focusType;
    editorState.focusTable.columnId = null;
    editorState.focusTable.prevSelectColumnId = null;
    editorState.focusTable.selectColumnIds = [];
  } else if (data.focusType) {
    const table = getData(tables, data.tableId);
    if (!table) return;

    editorState.focusTable = {
      table,
      focusType: data.focusType,
      columnId: null,
      prevSelectColumnId: null,
      selectColumnIds: [],
      edit: false,
    };
  } else if (editorState.focusTable?.table.id !== data.tableId) {
    const table = getData(tables, data.tableId);
    if (!table) return;

    editorState.focusTable = {
      table,
      focusType: 'tableName',
      columnId: null,
      prevSelectColumnId: null,
      selectColumnIds: [],
      edit: false,
    };
  }
}

export function executeFocusColumn(
  { editorState, tableState: { tables } }: State,
  data: FocusColumn
) {
  if (editorState.focusTable?.table.id === data.tableId) {
    const focusTable = editorState.focusTable;
    focusTable.columnId = data.columnId;
    focusTable.focusType = data.focusType;

    if (data.ctrlKey && data.shiftKey) {
      focusTable.selectColumnIds = appendSelectRangeColumns(
        focusTable.table.columns,
        focusTable.selectColumnIds,
        focusTable.prevSelectColumnId,
        focusTable.columnId
      );
    } else if (data.shiftKey) {
      focusTable.selectColumnIds = selectRangeColumns(
        focusTable.table.columns,
        focusTable.prevSelectColumnId,
        focusTable.columnId
      );
    } else if (data.ctrlKey) {
      focusTable.selectColumnIds = appendSelectColumns(
        focusTable.selectColumnIds,
        data.columnId
      );
    } else {
      focusTable.selectColumnIds = [data.columnId];
    }

    focusTable.prevSelectColumnId = data.columnId;
  } else {
    const table = getData(tables, data.tableId);
    if (!table) return;

    editorState.focusTable = {
      table,
      focusType: data.focusType,
      columnId: data.columnId,
      prevSelectColumnId: data.columnId,
      selectColumnIds: [data.columnId],
      edit: false,
    };
  }
}

export function executeFocusTableEnd({ editorState }: State) {
  editorState.focusTable = null;
}

export function executeFocusMoveTable(state: State, data: FocusMoveTable) {
  const { editorState } = state;
  if (!editorState.focusTable) return;
  editorState.focusTable.edit = false;

  switch (data.moveKey) {
    case 'ArrowUp':
      arrowUp(state, data);
      break;
    case 'ArrowDown':
      arrowDown(state, data);
      break;
    case 'ArrowLeft':
      arrowLeft(state, data);
      break;
    case 'ArrowRight':
      arrowRight(state, data);
      break;
    case 'Tab':
      data.shiftKey ? arrowLeft(state, data) : arrowRight(state, data);
      break;
  }
}

export function executeEditTable({ editorState: { focusTable } }: State) {
  if (!focusTable) return;
  focusTable.edit = true;
}

export function executeEditTableEnd({ editorState: { focusTable } }: State) {
  if (!focusTable) return;
  focusTable.edit = false;
}

export function executeSelectAllColumn({ editorState: { focusTable } }: State) {
  if (!focusTable) return;
  focusTable.selectColumnIds = focusTable.table.columns.map(
    column => column.id
  );
}

export const executeEditorCommandMap = {
  'editor.hasUndoRedo': executeHasUndoRedo,
  'editor.focusTable': executeFocusTable,
  'editor.focusColumn': executeFocusColumn,
  'editor.focusTableEnd': executeFocusTableEnd,
  'editor.focusMoveTable': executeFocusMoveTable,
  'editor.editTable': executeEditTable,
  'editor.editTableEnd': executeEditTableEnd,
  'editor.selectAllColumn': executeSelectAllColumn,
};
