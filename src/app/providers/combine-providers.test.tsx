import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { combineProviders } from './combine-providers';

import type { ContextProviders } from './combine-providers';

type Mock1ProviderProps = {
  children: React.ReactNode;
  testProp?: string;
};

type Mock2ProviderProps = {
  children: React.ReactNode;
  value?: number;
};

type Mock3ProviderProps = {
  children: React.ReactNode;
  enabled?: boolean;
};

const MockProvider1 = ({ children, testProp }: Mock1ProviderProps) => (
  <div data-prop={testProp} data-testid="provider-1">
    {children}
  </div>
);

const MockProvider2 = ({ children, value }: Mock2ProviderProps) => (
  <div data-prop={value} data-testid="provider-2">
    {children}
  </div>
);

const MockProvider3 = ({ children, enabled }: Mock3ProviderProps) => (
  <div data-enabled={enabled} data-testid="provider-3">
    {children}
  </div>
);

const TestComponent = () => <div data-testid="test-component">Test Content</div>;

describe('combineProviders', () => {
  describe('Basic Functionality', () => {
    it('should return a function when called with empty providers array', () => {
      const CombinedProviders = combineProviders([]);
      expect(typeof CombinedProviders).toBe('function');
    });

    it('should render children when no providers are given', () => {
      const CombinedProviders = combineProviders([]);

      render(
        <CombinedProviders>
          <TestComponent />
        </CombinedProviders>,
      );

      expect(screen.getByTestId('test-component')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render children wrapped in a single provider', () => {
      const CombinedProviders = combineProviders([[MockProvider1, { testProp: 'test-value' }]]);

      render(
        <CombinedProviders>
          <TestComponent />
        </CombinedProviders>,
      );

      expect(screen.getByTestId('test-component')).toBeInTheDocument();
      expect(screen.getByTestId('provider-1')).toBeInTheDocument();
      expect(screen.getByTestId('provider-1')).toHaveAttribute('data-prop', 'test-value');
    });
  });

  describe('Multiple Providers', () => {
    it('should nest multiple providers in the correct order', () => {
      const CombinedProvider = combineProviders([
        [MockProvider1, { testProp: 'value1' }],
        [MockProvider2, { value: 42 }],
        [MockProvider3, { enabled: true }],
      ]);

      render(
        <CombinedProvider>
          <TestComponent />
        </CombinedProvider>,
      );

      expect(screen.getByTestId('provider-1')).toBeInTheDocument();
      expect(screen.getByTestId('provider-2')).toBeInTheDocument();
      expect(screen.getByTestId('provider-3')).toBeInTheDocument();
      expect(screen.getByTestId('test-component')).toBeInTheDocument();

      const provider1 = screen.getByTestId('provider-1');
      const provider2 = screen.getByTestId('provider-2');
      const provider3 = screen.getByTestId('provider-3');

      expect(provider1).toContainElement(provider2);
      expect(provider2).toContainElement(provider3);
      expect(provider3).toContainElement(screen.getByTestId('test-component'));
    });

    it('should pass props correctly to each provider', () => {
      const CombinedProvider = combineProviders([
        [MockProvider1, { testProp: 'first-provider' }],
        [MockProvider2, { value: 123 }],
        [MockProvider3, { enabled: false }],
      ]);

      render(
        <CombinedProvider>
          <TestComponent />
        </CombinedProvider>,
      );

      expect(screen.getByTestId('provider-1')).toHaveAttribute('data-prop', 'first-provider');

      expect(screen.getByTestId('provider-2')).toHaveAttribute('data-prop', '123');

      expect(screen.getByTestId('provider-3')).toHaveAttribute('data-enabled', 'false');
    });
  });

  describe('Props Handling', () => {
    it('should handle providers without props', () => {
      const CombinedProviders = combineProviders([[MockProvider1], [MockProvider2, { value: 99 }]]);

      render(
        <CombinedProviders>
          <TestComponent />
        </CombinedProviders>,
      );

      expect(screen.getByTestId('provider-1')).toBeInTheDocument();
      expect(screen.getByTestId('provider-2')).toBeInTheDocument();
      expect(screen.getByTestId('provider-2')).toHaveAttribute('data-prop', '99');
    });

    it('should handle empty props object', () => {
      const CombinedProviders = combineProviders([
        [MockProvider1, {}],
        [MockProvider2, { value: 0 }],
      ]);

      render(
        <CombinedProviders>
          <TestComponent />
        </CombinedProviders>,
      );

      expect(screen.getByTestId('provider-1')).toBeInTheDocument();
      expect(screen.getByTestId('provider-2')).toHaveAttribute('data-prop', '0');
    });

    it('should handle complex props object', () => {
      const complexProps = {
        arrayProp: [1, 2, 3],
        nestedObject: { key: 'value' },
        testProp: 'complex-value',
      };

      const MockComplexProvider = ({
        arrayProp,
        children,
        nestedObject,
        testProp,
      }: {
        arrayProp?: number[];
        children: React.ReactNode;
        nestedObject?: { key: string };
        testProp?: string;
      }) => (
        <div
          data-array-length={arrayProp?.length}
          data-nested={nestedObject?.key}
          data-prop={testProp}
          data-testid="complex-provider"
        >
          {children}
        </div>
      );

      const CombinedProvider = combineProviders([[MockComplexProvider, complexProps]]);

      render(
        <CombinedProvider>
          <TestComponent />
        </CombinedProvider>,
      );

      const provider = screen.getByTestId('complex-provider');
      expect(provider).toHaveAttribute('data-prop', 'complex-value');
      expect(provider).toHaveAttribute('data-nested', 'value');
      expect(provider).toHaveAttribute('data-array-length', '3');
    });
  });

  describe('Edge Cases', () => {
    it('should handle providers that modify children', () => {
      const WrapperProvider = ({ children }: { children: React.ReactNode }) => (
        <div data-testid="wrapper">
          <span data-testid="wrapper-prefix">Wrapped: </span>
          {children}
        </div>
      );

      const CombinedProvider = combineProviders([[WrapperProvider]]);

      render(
        <CombinedProvider>
          <TestComponent />
        </CombinedProvider>,
      );

      expect(screen.getByTestId('wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('wrapper-prefix')).toBeInTheDocument();
      expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });

    it('should handle providers with conditional rendering', () => {
      const ConditionalProvider = ({
        children,
        show = true,
      }: {
        children: React.ReactNode;
        show?: boolean;
      }) => (
        <div data-testid="conditional-provider">
          {show ? children : <div data-testid="fallback">Hidden</div>}
        </div>
      );

      const CombinedProviderVisible = combineProviders([[ConditionalProvider, { show: true }]]);

      const { rerender } = render(
        <CombinedProviderVisible>
          <TestComponent />
        </CombinedProviderVisible>,
      );

      expect(screen.getByTestId('test-component')).toBeInTheDocument();
      expect(screen.queryByTestId('fallback')).not.toBeInTheDocument();

      const CombinedProviderHidden = combineProviders([[ConditionalProvider, { show: false }]]);

      rerender(
        <CombinedProviderHidden>
          <TestComponent />
        </CombinedProviderHidden>,
      );

      expect(screen.queryByTestId('test-component')).not.toBeInTheDocument();
      expect(screen.getByTestId('fallback')).toBeInTheDocument();
    });
  });

  describe('Provider Order', () => {
    it('should maintain provider order with outermost provider first', () => {
      const OrderTrackingProvider = ({
        children,
        order,
      }: {
        children: React.ReactNode;
        order: string;
      }) => (
        <div data-order={order} data-testid={`order-${order}`}>
          {children}
        </div>
      );

      const CombinedProvider = combineProviders([
        [OrderTrackingProvider, { order: 'first ' }],
        [OrderTrackingProvider, { order: 'second ' }],
        [OrderTrackingProvider, { order: 'third ' }],
      ]);

      render(
        <CombinedProvider>
          <TestComponent />
        </CombinedProvider>,
      );

      const firstProvider = screen.getByTestId('order-first');
      const secondProvider = screen.getByTestId('order-second');
      const thirdProvider = screen.getByTestId('order-third');

      expect(firstProvider).toContainElement(secondProvider);
      expect(secondProvider).toContainElement(thirdProvider);
      expect(thirdProvider).toContainElement(screen.getByTestId('test-component'));
    });
  });

  describe('Function return value', () => {
    it('should return a React component that accepts children prop', () => {
      const CombinedProvider = combineProviders([[MockProvider1]]);
      expect(typeof CombinedProvider).toBe('function');

      expect(() => {
        render(
          <CombinedProvider>
            <div>Test</div>
          </CombinedProvider>,
        );
      }).not.toThrow();
    });

    it('should create a new component instance each time it is called', () => {
      const providers: ContextProviders = [[MockProvider1]];
      const CombinedProvider1 = combineProviders(providers);
      const CombinedProvider2 = combineProviders(providers);
      expect(CombinedProvider1).not.toBe(CombinedProvider2);
    });
  });

  describe('Performance and memory', () => {
    it('should handle large number of providers efficiently', () => {
      const manyProviders: ContextProviders = Array.from({ length: 10 }, (_, i) => [
        ({ children }: { children: React.ReactNode }) => (
          <div data-testid={`provider-${i}`}>{children}</div>
        ),
      ]);

      const CombinedProvider = combineProviders(manyProviders);

      render(
        <CombinedProvider>
          <TestComponent />
        </CombinedProvider>,
      );

      for (let i = 0; i < 10; i++) {
        expect(screen.getByTestId(`provider-${i}`)).toBeInTheDocument();
      }

      expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });
  });
});
