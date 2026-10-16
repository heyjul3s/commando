import { describe, it, expect, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { create, createStore } from 'zustand';
import { createSelectors, createStoreSelectors } from './create-selectors';

describe('createSelectors', () => {
  describe('createSelectors - with stores created via create()', () => {
    it('should add use object to store', () => {
      const useStore = create(() => ({ count: 0, name: 'test' }));
      const store = createSelectors(useStore);

      expect(store.use).toBeDefined();
      expect(typeof store.use.count).toBe('function');
      expect(typeof store.use.name).toBe('function');
    });

    it('should create selectors for all state keys', () => {
      const useStore = create(() => ({
        count: 0,
        name: 'test',
        isActive: true,
      }));

      const store = createSelectors(useStore);
      const keys = Object.keys(store.getState());
      const selectorKeys = Object.keys(store.use);

      expect(selectorKeys).toEqual(keys);
      expect(selectorKeys).toHaveLength(3);
    });

    it('should return correct values when selectors are called', () => {
      const useStore = create(() => ({
        count: 42,
        name: 'test',
      }));

      const store = createSelectors(useStore);
      const { result: countResult } = renderHook(() => store.use.count());
      const { result: nameResult } = renderHook(() => store.use.name());

      expect(countResult.current).toBe(42);
      expect(nameResult.current).toBe('test');
    });

    it('should react to state changes', () => {
      const useStore = create<{ count: number; increment: () => void }>((set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
      }));

      const store = createSelectors(useStore);
      const { result, rerender } = renderHook(() => store.use.count());

      expect(result.current).toBe(0);

      act(() => {
        store.getState().increment();
      });
      rerender();

      expect(result.current).toBe(1);
    });

    it('should create named hook functions', () => {
      const useStore = create(() => ({
        count: 0,
        userName: 'test',
        isActive: true,
      }));

      const store = createSelectors(useStore);

      expect(store.use.count.name).toBe('useCount');
      expect(store.use.userName.name).toBe('useUserName');
      expect(store.use.isActive.name).toBe('useIsActive');
    });

    it('should be able to handle empty state', () => {
      const useStore = create(() => ({}));
      const store = createSelectors(useStore);

      expect(store.use).toEqual({});
    });

    it('should be able to handle nested objects', () => {
      const useStore = create(() => ({
        user: { name: 'test', age: 30 },
        settings: { theme: 'dark' },
      }));

      const store = createSelectors(useStore);

      const { result: userResult } = renderHook(() => store.use.user());
      const { result: settingsResult } = renderHook(() => store.use.settings());

      expect(userResult.current).toEqual({ name: 'test', age: 30 });
      expect(settingsResult.current).toEqual({ theme: 'dark' });
    });

    it('should be able to handle functions in state', () => {
      const mockFn = vi.fn();
      const useStore = create(() => ({
        count: 0,
        increment: mockFn,
      }));

      const store = createSelectors(useStore);
      const { result } = renderHook(() => store.use.increment());

      expect(result.current).toBe(mockFn);
      expect(typeof store.use.increment).toBe('function');
    });
  });

  describe('createStoreSelectors - with stores created via createStore()', () => {
    it('should add use object to store', () => {
      const store = createStore(() => ({ count: 0, name: 'test' }));
      const storeWithSelectors = createStoreSelectors(store);

      expect(storeWithSelectors).toBeDefined();
      expect(typeof storeWithSelectors.use.count).toBe('function');
      expect(typeof storeWithSelectors.use.name).toBe('function');
    });

    it('should create selectors for all state keys', () => {
      const store = createStore(() => ({
        count: 0,
        name: 'test',
        isActive: true,
      }));

      const storeWithSelectors = createStoreSelectors(store);
      const keys = Object.keys(store.getState());
      const selectorKeys = Object.keys(storeWithSelectors.use);

      expect(selectorKeys).toEqual(keys);
      expect(selectorKeys).toHaveLength(3);
    });

    it('should return correct values when selectors are called', () => {
      const store = createStore(() => ({
        count: 42,
        name: 'test',
      }));

      const storeWithSelectors = createStoreSelectors(store);
      const { result: countResult } = renderHook(() => storeWithSelectors.use.count());
      const { result: nameResult } = renderHook(() => storeWithSelectors.use.name());

      expect(countResult.current).toBe(42);
      expect(nameResult.current).toBe('test');
    });

    it('should react to state changes', () => {
      const store = createStore<{ count: number; increment: () => void }>((set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
      }));

      const storeWithSelectors = createStoreSelectors(store);
      const { result, rerender } = renderHook(() => storeWithSelectors.use.count());

      expect(result.current).toBe(0);

      act(() => {
        store.getState().increment();
      });
      rerender();

      expect(result.current).toBe(1);
    });

    it('should create named hook functions', () => {
      const store = createStore(() => ({
        count: 0,
        userName: 'test',
        isActive: true,
      }));

      const storeWithSelectors = createStoreSelectors(store);

      expect(storeWithSelectors.use.count.name).toBe('useCount');
      expect(storeWithSelectors.use.userName.name).toBe('useUserName');
      expect(storeWithSelectors.use.isActive.name).toBe('useIsActive');
    });

    it('should be able to handle null store', () => {
      const nullStore = null as any;
      expect(() => createStoreSelectors(nullStore)).not.toThrow();
    });

    it('should be able to handle empty state', () => {
      const store = createStore(() => ({}));
      const storeWithSelectors = createStoreSelectors(store);
      expect(storeWithSelectors.use).toEqual({});
    });
  });
});
