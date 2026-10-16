import { createContext, useState } from 'react';
import { createStore } from 'zustand';
import { commandPaletteDefaultValues } from './command-palette-default-values';
import { commandPaletteActions } from './command-palette-actions';
import { createStoreSelectors } from '../create-selectors';

import type { PropsWithChildren } from 'react';
import type { CommandPaletteStoreActions } from './command-palette-actions';
import type { CommandPaletteStoreInitialValues } from './command-palette-default-values';

export interface CommandPaletteStore extends CommandPaletteStoreInitialValues {
  actions: CommandPaletteStoreActions;
}

type CommandPaletteStoreProvider = PropsWithChildren<{
  initialValues?: Partial<CommandPaletteStoreInitialValues>;
}>;

export const CommandPaletteContext = createContext<null | ReturnType<
  typeof createCommandPaletteStore
>>(null);

export function CommandPaletteProvider({ children, initialValues }: CommandPaletteStoreProvider) {
  const [store] = useState(() =>
    createCommandPaletteStore({
      ...commandPaletteDefaultValues,
      ...initialValues,
    }),
  );

  return <CommandPaletteContext.Provider value={store}>{children}</CommandPaletteContext.Provider>;
}

function createCommandPaletteStore(initialValues: CommandPaletteStoreInitialValues) {
  return createStoreSelectors(
    createStore<CommandPaletteStore>()((set) => ({
      ...initialValues,
      actions: commandPaletteActions(set),
    })),
  );
}
