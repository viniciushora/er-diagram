import { html, customElement, property } from "lit-element";
import { Subscription } from "rxjs";
import tuiGrid from "tui-grid";
import { EditorElement } from "./EditorElement";
import { defaultHeight } from "./Layout";
import { Logger } from "@src/core/Logger";
import { SIZE_MENUBAR_HEIGHT } from "@src/core/Layout";
import {
  getDataTypeSyncColumns,
  getColumn,
} from "@src/core/helper/ColumnHelper";
import { Command, CommandType } from "@src/core/Command";
import { changeTableName, changeTableComment } from "@src/core/command/table";
import {
  changeColumnName,
  changeColumnDataType,
  changeColumnDefault,
  changeColumnComment,
  changeColumnPrimaryKey,
  changeColumnNotNull,
  changeColumnUnique,
  changeColumnAutoIncrement,
} from "@src/core/command/column";
import { createGridData, changeColumnOptionList } from "@src/core/Grid";
import { GridTextRender } from "./grid/GridTextRender";
import { GridTextEditor } from "./grid/GridTextEditor";
import { GridColumnOptionEditor } from "./grid/GridColumnOptionEditor";
import { GridColumnDataTypeEditor } from "./grid/GridColumnDataTypeEditor";
import "./grid/ColumnOptionEditor";
import "./grid/ColumnDataTypeEditor";

const GRID_HEADER_HEIGHT = 40;
const HEADER_HEIGHT = GRID_HEADER_HEIGHT + SIZE_MENUBAR_HEIGHT;

@customElement("vuerd-grid")
class Grid extends EditorElement {
  @property({ type: Number })
  height = defaultHeight;

  private subscriptionList: Subscription[] = [];
  private edit = false;
  private grid!: tuiGrid;
  private gridColumns: any = [
    {
      header: "Table Name",
      name: "tableName",
      renderer: { type: GridTextRender, options: { placeholder: "table" } },
      editor: { type: GridTextEditor },
    },
    {
      header: "Table Comment",
      name: "tableComment",
      renderer: { type: GridTextRender, options: { placeholder: "comment" } },
      editor: { type: GridTextEditor },
    },
    {
      header: "Option",
      name: "option",
      minWidth: 100,
      renderer: { type: GridTextRender, options: { placeholder: "option" } },
      editor: { type: GridColumnOptionEditor },
    },
    {
      header: "Name",
      name: "name",
      renderer: { type: GridTextRender, options: { placeholder: "column" } },
      editor: { type: GridTextEditor },
    },
    {
      header: "DataType",
      name: "dataType",
      minWidth: 200,
      renderer: { type: GridTextRender, options: { placeholder: "dataType" } },
      editor: { type: GridColumnDataTypeEditor },
    },
    {
      header: "Default",
      name: "default",
      renderer: { type: GridTextRender, options: { placeholder: "default" } },
      editor: { type: GridTextEditor },
    },
    {
      header: "Comment",
      name: "comment",
      renderer: { type: GridTextRender, options: { placeholder: "comment" } },
      editor: { type: GridTextEditor },
    },
  ];

  get gridHeight() {
    return this.height - HEADER_HEIGHT;
  }

  connectedCallback() {
    super.connectedCallback();
    const { store } = this.context;
    const { keydown$ } = this.context.windowEventObservable;
    this.subscriptionList.push(
      keydown$.subscribe((event) => {
        if (
          !this.edit &&
          (event.key === "Delete" || event.key === "Backspace")
        ) {
          Logger.debug(this.grid.getModifiedRows());
        }
      })
    );
  }
  firstUpdated() {
    const { store } = this.context;
    const rows = createGridData(store) as any;
    const container = this.renderRoot.querySelector(
      ".vuerd-grid"
    ) as HTMLElement;
    const gridDefaultColumn: any = {
      sortingType: "asc",
      sortable: true,
      onAfterChange: this.onAfterChange,
    };
    this.gridColumns.forEach((gridColumn: any) => {
      gridColumn = Object.assign(gridColumn, gridDefaultColumn);
    });
    this.grid = new tuiGrid({
      el: container,
      usageStatistics: false,
      bodyHeight: this.gridHeight,
      columnOptions: {
        frozenCount: 1,
        frozenBorderWidth: 0,
        minWidth: 300,
      },
      columns: this.gridColumns,
      data: rows,
    });
    this.grid.on("editingStart", this.onEditingStart);
    this.grid.on("editingFinish", this.onEditingFinish);
  }
  updated(changedProperties: any) {
    changedProperties.forEach((oldValue: any, propName: string) => {
      switch (propName) {
        case "height":
          this.grid.setBodyHeight(this.gridHeight);
          break;
      }
    });
  }
  disconnectedCallback() {
    this.grid.off("editingStart", this.onEditingStart);
    this.grid.off("editingFinish", this.onEditingFinish);
    this.grid.destroy();
    this.subscriptionList.forEach((sub) => sub.unsubscribe());
    super.disconnectedCallback();
  }

  render() {
    return html`<div class="vuerd-grid"></div>`;
  }

  private onEditingStart = () => {
    this.edit = true;
  };
  private onEditingFinish = () => {
    this.edit = false;
  };
  private onAfterChange = (event: any) => {
    const { store, helper } = this.context;
    const row = this.grid.getRow(event.rowKey) as any;
    if (row) {
      const tableId = row.tableId as string;
      const columnId = row.columnId as string;
      const value = event.value as string;
      const oldValue = event.prevValue as string;
      switch (event.columnName) {
        case "tableName":
          store.dispatch(changeTableName(helper, tableId, value));
          this.grid
            .findRows(
              (row: any) =>
                row.tableId === tableId && row.rowKey !== event.rowKey
            )
            .forEach((row) => {
              this.grid.setValue(row.rowKey, "tableName", value);
            });
          break;
        case "tableComment":
          store.dispatch(changeTableComment(helper, tableId, value));
          this.grid
            .findRows(
              (row: any) =>
                row.tableId === tableId && row.rowKey !== event.rowKey
            )
            .forEach((row) => {
              this.grid.setValue(row.rowKey, "tableComment", value);
            });
          break;
        case "option":
          const changeOptions = changeColumnOptionList(oldValue, value);
          const batchCommand: Array<Command<CommandType>> = [];
          changeOptions.forEach((simpleOption) => {
            switch (simpleOption) {
              case "PK":
                batchCommand.push(
                  changeColumnPrimaryKey(store, tableId, columnId)
                );
                break;
              case "NN":
                batchCommand.push(
                  changeColumnNotNull(store, tableId, columnId)
                );
                break;
              case "UQ":
                batchCommand.push(changeColumnUnique(store, tableId, columnId));
                break;
              case "AI":
                batchCommand.push(
                  changeColumnAutoIncrement(store, tableId, columnId)
                );
                break;
            }
          });
          if (batchCommand.length !== 0) {
            store.dispatch(...batchCommand);
          }
          break;
        case "name":
          store.dispatch(changeColumnName(helper, tableId, columnId, value));
          break;
        case "dataType":
          const { tables } = this.context.store.tableState;
          const { relationships } = this.context.store.relationshipState;
          const column = getColumn(tables, tableId, columnId);
          if (column) {
            store.dispatch(
              changeColumnDataType(helper, tableId, columnId, value)
            );
            // DataTypeSync
            const columnIds = getDataTypeSyncColumns(
              [column],
              tables,
              relationships
            ).map((column) => column.id);
            this.grid
              .findRows(
                (row: any) =>
                  columnIds.some((columnId) => columnId === row.columnId) &&
                  row.rowKey !== event.rowKey
              )
              .forEach((row) => {
                this.grid.setValue(row.rowKey, "dataType", value);
              });
          }
          break;
        case "default":
          store.dispatch(changeColumnDefault(helper, tableId, columnId, value));
          break;
        case "comment":
          store.dispatch(changeColumnComment(helper, tableId, columnId, value));
          break;
      }
    }
    this.grid.clearModifiedData();
  };
}