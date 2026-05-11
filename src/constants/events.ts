export const DOM_EVENT = {
  KeyDown: 'keydown',
} as const;

export type DomEvent = (typeof DOM_EVENT)[keyof typeof DOM_EVENT];
