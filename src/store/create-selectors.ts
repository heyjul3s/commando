import { useStore } from 'zustand';

import type { StoreApi, UseBoundStore } from 'zustand';

// Auto create selectors utilities based off of official Zustand docs
// https://zustand.docs.pmnd.rs/learn/guides/auto-generating-selectors

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

/**
 * For Zustand stores created via the "create" method
 * @example
 * const useStore = create((set) => ({ count: 0 }));
 * const store = createStoreSelectors(useStore);
 * @usage
 * store.use.count();
 */
export function createSelectors<S extends UseBoundStore<StoreApi<object>>>(
  store: S,
): WithSelectors<S> {
  return createSelectorsBase(
    store as StoreApi<object>,
    (key) => () => store((s) => s[key as keyof typeof s]),
  ) as WithSelectors<S>;
}

/**
 * For Zustand stores created via the "createStore" method
 * @example
 * const store = createStore((set) => ({ count: 0 }));
 * const storeWithSelectors = createStoreSelectors(store);
 * @usage
 * storeWithSelectors.use.count();
 */
export function createStoreSelectors<S extends StoreApi<object>>(store: S): WithSelectors<S> {
  return createSelectorsBase(
    store,
    (key) => () => useStore(store, (s) => s[key as keyof typeof s]),
  );
}

// Base function for helping create auto-genned store selectors
function createSelectorsBase<S extends StoreApi<object>>(
  store: S,
  selectorFactory: (key: string) => () => any,
) {
  if (!store) {
    return store;
  }

  const storeWithSelectors = store as WithSelectors<S>;

  storeWithSelectors.use = {};

  for (const key of Object.keys(store.getState())) {
    const useSelector = selectorFactory(key);

    Object.defineProperty(useSelector, 'name', {
      value: `use${key.charAt(0).toUpperCase()}${key.slice(1)}`,
    });

    (storeWithSelectors.use as any)[key] = useSelector;
  }

  return storeWithSelectors;
}
