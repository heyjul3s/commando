import { fireEvent, render, screen, within } from '@testing-library/react';
import { App } from './app';

describe('app', () => {
  beforeEach(() => localStorage.clear());

  it('shares hover selection with keyboard navigation and handles empty results', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Open command menu/ }));
    fireEvent.mouseEnter(screen.getByRole('option', { name: 'Browse Projects' }));
    expect(screen.getByRole('option', { name: 'Browse Projects' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Search commands' }), {
      key: 'ArrowDown',
    });
    expect(screen.getByRole('option', { name: 'Search Documentation' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Search commands' }), { key: 'Enter' });
    expect(
      within(screen.getByRole('region', { name: 'Selected command' })).getByRole('heading', {
        name: 'Search Documentation',
      }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Open command menu/ }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'no matching commands' } });
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Search commands' }), {
      key: 'ArrowDown',
    });
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Search commands' }), { key: 'Enter' });
    expect(screen.getByText('No commands found')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('opens, selects, closes, and clears query through the shared stores', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Open command menu/ }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.change(screen.getByRole('textbox', { name: 'Search commands' }), {
      target: { value: 'projects' },
    });
    fireEvent.click(screen.getByRole('option', { name: 'Browse Projects' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(
      within(screen.getByRole('region', { name: 'Selected command' })).getByRole('heading', {
        name: 'Browse Projects',
      }),
    ).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    expect(screen.getByRole('textbox')).toHaveValue('');

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
