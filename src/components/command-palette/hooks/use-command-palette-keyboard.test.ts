import { renderHook } from '@testing-library/react';
import { useCommandPaletteKeyboard } from './use-command-palette-keyboard';
import { DOM_EVENT } from '../../../constants/events';
import { KEYBOARD_KEY } from '../../../constants/keyboard';

import type { KeyboardKey } from '../../../constants/keyboard';

function setup(overrides = {}) {
  const props = {
    onActivateNextCommand: vi.fn(),
    onActivatePreviousCommand: vi.fn(),
    onClose: vi.fn(),
    onSelectActiveCommand: vi.fn(),
    open: true,
    ...overrides,
  };

  const hook = renderHook(() => useCommandPaletteKeyboard(props));

  return {
    ...hook,
    props,
  };
}

function keydown(key: KeyboardKey) {
  window.dispatchEvent(new KeyboardEvent(DOM_EVENT.KeyDown, { key }));
}

describe('use-command-palette-keyboard', () => {
  it('calls onActivateNextCommand when ArrowDown is pressed', () => {
    const { props } = setup();
    keydown(KEYBOARD_KEY.ArrowDown);
    expect(props.onActivateNextCommand).toHaveBeenCalledTimes(1);
  });

  it('calls onActivatePreviousCommand when ArrowUp is pressed', () => {
    const { props } = setup();
    keydown(KEYBOARD_KEY.ArrowUp);
    expect(props.onActivatePreviousCommand).toHaveBeenCalledTimes(1);
  });

  it('calls onSelectActiveCommand when Enter is pressed', () => {
    const { props } = setup();
    keydown(KEYBOARD_KEY.Enter);
    expect(props.onSelectActiveCommand).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape is pressed', () => {
    const { props } = setup();
    keydown(KEYBOARD_KEY.Escape);
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('does not bind keyboard events when closed', () => {
    const { props } = setup({ open: false });

    keydown(KEYBOARD_KEY.Escape);
    keydown(KEYBOARD_KEY.ArrowDown);
    keydown(KEYBOARD_KEY.Enter);

    expect(props.onClose).not.toHaveBeenCalled();
    expect(props.onActivateNextCommand).not.toHaveBeenCalled();
    expect(props.onSelectActiveCommand).not.toHaveBeenCalled();
  });

  it('removes the keyboard event listener when unmounted', () => {
    const { props, unmount } = setup();
    unmount();
    keydown(KEYBOARD_KEY.Escape);
    expect(props.onClose).not.toHaveBeenCalled();
  });
});
