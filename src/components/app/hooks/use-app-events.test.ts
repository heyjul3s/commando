import { renderHook } from '@testing-library/react';
import { DOM_EVENT } from '../../../constants/events';
import { KEYBOARD_KEY } from '../../../constants/keyboard';
import { useAppEvents } from './use-app-events';

function setup(overrides = {}) {
  const props = {
    onToggleCommandPalette: vi.fn(),
    ...overrides,
  };

  const hook = renderHook(() => {
    useAppEvents(props);
  });

  return {
    ...hook,
    props,
  };
}

function dispatchKeyDown(
  key: string,
  options: Pick<KeyboardEventInit, 'ctrlKey' | 'metaKey'> = {},
) {
  const event = new KeyboardEvent(DOM_EVENT.KeyDown, {
    cancelable: true,
    key,
    ...options,
  });
  const preventDefault = vi.spyOn(event, 'preventDefault');

  window.dispatchEvent(event);

  return {
    event,
    preventDefault,
  };
}

describe('use-app-events', () => {
  it('calls onToggleCommandPalette when meta + k is pressed', () => {
    const { props } = setup();

    const { preventDefault } = dispatchKeyDown(KEYBOARD_KEY.K, {
      metaKey: true,
    });

    expect(props.onToggleCommandPalette).toHaveBeenCalled();
    expect(preventDefault).toHaveBeenCalled();
  });

  it('calls onToggleCommandPalette when ctrl + k is pressed', () => {
    const { props } = setup();

    dispatchKeyDown(KEYBOARD_KEY.K, {
      ctrlKey: true,
    });

    expect(props.onToggleCommandPalette).toHaveBeenCalledTimes(1);
  });

  it('does not call onToggleCommandPalette when k is pressed without a modifier', () => {
    const { props } = setup();

    dispatchKeyDown(KEYBOARD_KEY.K);

    expect(props.onToggleCommandPalette).not.toHaveBeenCalled();
  });

  it('does not call onToggleCommandPalette when another shortcut is pressed', () => {
    const { props } = setup();

    dispatchKeyDown(KEYBOARD_KEY.ArrowDown, {
      metaKey: true,
    });

    expect(props.onToggleCommandPalette).not.toHaveBeenCalled();
  });

  it('does not call onToggleCommandPalette when a component has unmounted', () => {
    const { unmount, props } = setup();

    unmount();
    dispatchKeyDown(KEYBOARD_KEY.K, {
      metaKey: true,
    });

    expect(props.onToggleCommandPalette).not.toHaveBeenCalled();
  });
});
