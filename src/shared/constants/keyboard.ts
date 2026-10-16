export const KEYBOARD_KEY = {
  ArrowDown: 'ArrowDown',
  ArrowUp: 'ArrowUp',
  Enter: 'Enter',
  Escape: 'Escape',
  K: 'k',
} as const;

export type KeyboardKey = (typeof KEYBOARD_KEY)[keyof typeof KEYBOARD_KEY];
