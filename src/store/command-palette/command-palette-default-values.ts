export type CommandPaletteStoreInitialValues = {
  isOpen: boolean;
  query: string;
  activeIndex: number;
};

export const commandPaletteDefaultValues: CommandPaletteStoreInitialValues = {
  isOpen: false,
  query: '',
  activeIndex: 0,
};
