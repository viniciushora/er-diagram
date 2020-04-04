import { html, customElement, property } from "lit-element";
import { styleMap } from "lit-html/directives/style-map";
import { Subscription } from "rxjs";
import { EditorElement } from "./EditorElement";
import { Logger } from "@src/core/Logger";
import { defaultWidth, defaultHeight } from "./Layout";
import { Menu, getERDContextmenu } from "@src/core/Contextmenu";
import { Bus } from "@src/core/Event";
import { keymapMatch } from "@src/core/Keymap";
import {
  addTable,
  removeTable,
  selectEndTable,
  selectAllTable,
} from "@src/core/command/table";
import { addColumn } from "@src/core/command/column";
import { addMemo, selectEndMemo, selectAllMemo } from "@src/core/command/memo";
import { moveCanvas } from "@src/core/command/canvas";
import "./Canvas";

@customElement("vuerd-erd")
class ERD extends EditorElement {
  @property({ type: Number })
  width = defaultWidth;
  @property({ type: Number })
  height = defaultHeight;
  @property({ type: Boolean })
  contextmenu = false;
  @property({ type: Number })
  contextmenuX = 0;
  @property({ type: Number })
  contextmenuY = 0;

  private subMouseup: Subscription | null = null;
  private subMousemove: Subscription | null = null;
  private subKeydown!: Subscription;
  private subCanvas!: Subscription;
  private menus: Menu[] = [];
  private erd!: Element;

  get theme() {
    return {
      width: `${this.width}px`,
      height: `${this.height}px`,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    Logger.debug("ERD before render");
    const { store, eventBus, keymap } = this.context;
    eventBus.on(Bus.ERD.contextmenuEnd, this.onContextmenuEnd);
    this.subKeydown = this.context.windowEventObservable.keydown$.subscribe(
      (event: KeyboardEvent) => {
        const { focus } = store.editorState;
        if (focus) {
          if (keymapMatch(event, keymap.addTable)) {
            store.dispatch(addTable(store));
          }
          if (
            keymapMatch(event, keymap.removeTable) &&
            (store.tableState.tables.some(table => table.ui.active) ||
              store.memoState.memos.some(memo => memo.ui.active))
          ) {
            store.dispatch(removeTable(store));
          }
          if (
            keymapMatch(event, keymap.addColumn) &&
            store.tableState.tables.some(table => table.ui.active)
          ) {
            store.dispatch(addColumn(store));
          }
          if (keymapMatch(event, keymap.addMemo)) {
            store.dispatch(addMemo(store));
          }
          if (keymapMatch(event, keymap.selectAllTable)) {
            // TODO: if add not editor mod
            store.dispatch(selectAllTable(), selectAllMemo());
          }
        }
      }
    );
  }
  firstUpdated() {
    Logger.debug("ERD after render");
    const { store } = this.context;
    this.erd = this.renderRoot.querySelector(".vuerd-erd") as Element;
    this.erd.scrollTop = store.canvasState.scrollTop;
    this.erd.scrollLeft = store.canvasState.scrollLeft;
    this.subCanvas = store.observe(
      store.canvasState,
      (name: string | number | symbol) => {
        if (name === "scrollTop") {
          this.erd.scrollTop = store.canvasState.scrollTop;
        } else if (name === "scrollLeft") {
          this.erd.scrollLeft = store.canvasState.scrollLeft;
        }
      }
    );
  }
  disconnectedCallback() {
    Logger.debug("ERD destroy");
    this.onMouseup();
    this.subKeydown.unsubscribe();
    this.subCanvas.unsubscribe();
    this.context.eventBus.off(Bus.ERD.contextmenuEnd, this.onContextmenuEnd);
    super.disconnectedCallback();
  }

  render() {
    Logger.debug("ERD render");
    return html`
      <div
        class="vuerd-erd"
        style=${styleMap(this.theme)}
        @mousedown=${this.onMousedown}
        @contextmenu=${this.onContextmenu}
      >
        <vuerd-canvas .context=${this.context}></vuerd-canvas>
        ${this.contextmenu
          ? html`
              <vuerd-contextmenu
                .context=${this.context}
                .menus=${this.menus}
                .x=${this.contextmenuX}
                .y=${this.contextmenuY}
              ></vuerd-contextmenu>
            `
          : ``}
      </div>
    `;
  }

  private onContextmenu = (event: MouseEvent) => {
    event.preventDefault();
    const { store, keymap } = this.context;
    this.menus = getERDContextmenu(store, keymap);
    this.contextmenuX = event.x;
    this.contextmenuY = event.y;
    this.contextmenu = true;
  };
  private onContextmenuEnd = (event: Event) => {
    this.contextmenu = false;
  };
  private onMousedown = (event: MouseEvent) => {
    const el = event.target as HTMLElement;
    if (!el.closest(".vuerd-contextmenu")) {
      this.contextmenu = false;
    }
    if (
      !el.closest(".vuerd-contextmenu") &&
      !el.closest(".vuerd-table") &&
      !el.closest(".vuerd-memo")
    ) {
      const { store, windowEventObservable } = this.context;
      store.dispatch(selectEndTable(), selectEndMemo());
      if (event.ctrlKey) {
      } else {
        this.onMouseup();
        this.subMouseup = windowEventObservable.mouseup$.subscribe(
          this.onMouseup
        );
        this.subMousemove = windowEventObservable.mousemove$.subscribe(
          this.onMousemove
        );
      }
    }
  };
  private onMouseup = (event?: MouseEvent) => {
    if (this.subMouseup) {
      this.subMouseup.unsubscribe();
    }
    if (this.subMousemove) {
      this.subMousemove.unsubscribe();
    }
    this.subMouseup = null;
    this.subMousemove = null;
  };
  private onMousemove = (event: MouseEvent) => {
    event.preventDefault();
    let movementX = event.movementX / window.devicePixelRatio;
    let movementY = event.movementY / window.devicePixelRatio;
    // firefox
    if (window.navigator.userAgent.toLowerCase().indexOf("firefox") !== -1) {
      movementX = event.movementX;
      movementY = event.movementY;
    }
    this.erd.scrollTop -= movementY;
    this.erd.scrollLeft -= movementX;
    const { store } = this.context;
    store.dispatch(moveCanvas(this.erd.scrollTop, this.erd.scrollLeft));
  };
}