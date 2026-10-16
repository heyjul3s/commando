import type { ComponentProps, ComponentType } from 'react';

export type ContextProviders = [ComponentType<any>, ComponentProps<any>?][];

export function combineProviders(contextProviders: ContextProviders) {
  return contextProviders.reduce(
    (AccumulatedContextProviders, [ContextProvider, props = {}]) => {
      return ({ children }) => (
        <AccumulatedContextProviders>
          <ContextProvider {...props}>
            <>{children}</>
          </ContextProvider>
        </AccumulatedContextProviders>
      );
    },
    ({ children }: any) => <>{children}</>,
  );
}
