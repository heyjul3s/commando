import type { Locator, Page } from '@playwright/test';

export type RoleSelector = {
  role: Parameters<Page['getByRole']>[0];
  options?: Parameters<Page['getByRole']>[1];
};

export function roleBy(scope: Page | Locator, selector: RoleSelector): Locator {
  return scope.getByRole(selector.role, selector.options);
}
