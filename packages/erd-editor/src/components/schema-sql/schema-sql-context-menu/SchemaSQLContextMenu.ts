import { FC, html, onMounted } from '@dineug/r-html';

import { useAppContext } from '@/components/appContext';
import { createDatabaseMenus } from '@/components/erd/erd-context-menu/menus/databaseMenus';
import ContextMenu from '@/components/primitives/context-menu/ContextMenu';
import Icon from '@/components/primitives/icon/Icon';
import { useUnmounted } from '@/hooks/useUnmounted';
import { KeyBindingName } from '@/utils/keyboard-shortcut';

import { createBracketMenus } from './menus/bracketMenus';

export type SchemaSQLContextMenuProps = {
  onClose: () => void;
};

const SchemaSQLContextMenu: FC<SchemaSQLContextMenuProps> = (props, ctx) => {
  const app = useAppContext(ctx);
  const chevronRightIcon = html`<${Icon} name="chevron-right" size=${14} />`;
  const { addUnsubscribe } = useUnmounted();

  onMounted(() => {
    const { shortcut$ } = app.value;

    addUnsubscribe(
      shortcut$.subscribe(({ type }) => {
        type === KeyBindingName.stop && props.onClose();
      })
    );
  });

  return () => html`
    <${ContextMenu.Root}
      children=${html`
        <${ContextMenu.Item}
          children=${html`
            <${ContextMenu.Menu}
              icon=${html`
                <${Icon} prefix="mdi" name="database" size=${14} />
              `}
              name="Banco de Dados"
              right=${chevronRightIcon}
            />
          `}
          subChildren=${html`${createDatabaseMenus(app.value).map(
            menu => html`
              <${ContextMenu.Item}
                .onClick=${menu.onClick}
                children=${html`
                  <${ContextMenu.Menu}
                    icon=${menu.checked
                      ? html`<${Icon} name="check" size=${14} />`
                      : null}
                    name=${menu.name}
                  />
                `}
              />
            `
          )}`}
        />
        <${ContextMenu.Item}
          children=${html`
            <${ContextMenu.Menu}
              icon=${html`
                <${Icon} prefix="mdi" name="code-brackets" size=${14} />
              `}
              name="Bracket"
              right=${chevronRightIcon}
            />
          `}
          subChildren=${html`${createBracketMenus(app.value).map(
            menu => html`
              <${ContextMenu.Item}
                .onClick=${menu.onClick}
                children=${html`
                  <${ContextMenu.Menu}
                    icon=${menu.checked
                      ? html`<${Icon} name="check" size=${14} />`
                      : null}
                    name=${menu.name}
                  />
                `}
              />
            `
          )}`}
        />
      `}
    />
  `;
};

export default SchemaSQLContextMenu;
