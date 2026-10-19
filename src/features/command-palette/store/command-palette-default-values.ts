export type CommandPaletteStoreInitialValues = {
  isOpen: boolean;
  query: string;
  activeIndex: number;
};

export const commandPaletteDefaultValues: CommandPaletteStoreInitialValues = {
  activeIndex: 0,
  isOpen: false,
  query: '',
};
