import { FC, html } from '@dineug/r-html';

import { useAppContext } from '@/components/appContext';
import Icon from '@/components/primitives/icon/Icon';
import TextInput from '@/components/primitives/text-input/TextInput';
import { CanvasType } from '@/constants/schema';
import {
  changeCanvasTypeAction,
  changeDatabaseNameAction,
  changeZoomLevelAction,
  resizeAction,
} from '@/engine/modules/settings/atom.actions';
import {
  canvasSizeInRange,
  toNumString,
  toZoomFormat,
  zoomLevelInRange,
} from '@/utils/validation';

import * as styles from './Toolbar.styles';

export type ToolbarProps = {};

const Toolbar: FC<ToolbarProps> = (props, ctx) => {
  const app = useAppContext(ctx);

  const handleChangeDatabaseName = (event: InputEvent) => {
    const el = event.target as HTMLInputElement | null;
    if (!el) return;

    const { store } = app.value;
    store.dispatch(changeDatabaseNameAction({ value: el.value }));
  };

  const handleResize = (event: Event) => {
    const el = event.target as HTMLInputElement | null;
    if (!el) return;

    const size = canvasSizeInRange(el.value);
    const { store } = app.value;
    el.value = size.toString();
    store.dispatch(resizeAction({ width: size, height: size }));
  };

  const handleZoomLevel = (event: Event) => {
    const el = event.target as HTMLInputElement | null;
    if (!el) return;

    const zoomLevel = zoomLevelInRange(Number(toNumString(el.value)) / 100);
    const { store } = app.value;
    el.value = toZoomFormat(zoomLevel);
    store.dispatch(changeZoomLevelAction({ value: zoomLevel }));
  };

  const handleChangeCanvasType = (value: string) => {
    const { store } = app.value;
    store.dispatch(changeCanvasTypeAction({ value }));
  };

  const handleUndo = () => {
    const { store } = app.value;
    store.undo();
  };

  const handleRedo = () => {
    const { store } = app.value;
    store.redo();
  };

  return () => {
    const { store } = app.value;
    const { settings, editor } = store.state;

    const showUndoRedo =
      settings.canvasType === CanvasType.ERD &&
      !editor.runAutomaticTablePlacement;

    return html`
      <div class=${styles.root}>
        <${TextInput}
          title="database name"
          placeholder="database name"
          width=${150}
          value=${settings.databaseName}
          .onInput=${handleChangeDatabaseName}
        />
        <${TextInput}
          title="canvas size"
          placeholder="canvas size"
          width=${45}
          value=${settings.width.toString()}
          numberOnly=${true}
          .onChange=${handleResize}
        />
        <${TextInput}
          title="zoom level"
          placeholder="zoom level"
          width=${45}
          value=${toZoomFormat(settings.zoomLevel)}
          numberOnly=${true}
          .onChange=${handleZoomLevel}
        />
        <div class=${styles.vertical}></div>
        <div
          class=${[
            styles.menu,
            { active: settings.canvasType === CanvasType.ERD },
          ]}
          title="Entity Relationship Diagram"
          @click=${() => handleChangeCanvasType(CanvasType.ERD)}
        >
          <${Icon} name="diagram-project" size=${16} />
        </div>
        <div
          class=${[
            styles.menu,
            { active: settings.canvasType === CanvasType.visualization },
          ]}
          title="Visualization"
          @click=${() => handleChangeCanvasType(CanvasType.visualization)}
        >
          <${Icon} prefix="mdi" name="chart-scatter-plot" size=${16} />
        </div>
        <div
          class=${[
            styles.menu,
            { active: settings.canvasType === CanvasType.schemaSQL },
          ]}
          title="Schema SQL"
          @click=${() => handleChangeCanvasType(CanvasType.schemaSQL)}
        >
          <${Icon} prefix="mdi" name="database-export" size=${16} />
        </div>
        <div
          class=${[
            styles.menu,
            { active: settings.canvasType === CanvasType.generatorCode },
          ]}
          title="Generator Code"
          @click=${() => handleChangeCanvasType(CanvasType.generatorCode)}
        >
          <${Icon} name="file-code" size=${16} />
        </div>
        <div
          class=${[
            styles.menu,
            { active: settings.canvasType === CanvasType.settings },
          ]}
          title="Settings"
          @click=${() => handleChangeCanvasType(CanvasType.settings)}
        >
          <${Icon} name="gear" size=${16} />
        </div>
        <div class=${styles.vertical}></div>
        ${showUndoRedo
          ? html`
              <div
                class=${[
                  'undo-redo',
                  styles.menu,
                  {
                    active: editor.hasUndo,
                  },
                ]}
                title="Undo"
                @click=${handleUndo}
              >
                <${Icon} name="rotate-left" size=${16} />
              </div>
              <div
                class=${[
                  'undo-redo',
                  styles.menu,
                  {
                    active: editor.hasRedo,
                  },
                ]}
                title="Redo"
                @click=${handleRedo}
              >
                <${Icon} name="rotate-right" size=${16} />
              </div>
            `
          : null}
      </div>
    `;
  };
};

export default Toolbar;
