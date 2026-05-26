import { render } from '@testing-library/react';
import Page from './page';

const mockRedirect = jest.fn();

jest.mock('next/navigation', () => ({
  redirect: (url: string) => mockRedirect(url),
}));

describe('Page', () => {
  it('redirects to /login', () => {
    render(<Page />);
    expect(mockRedirect).toHaveBeenCalledWith('/login');
  });
});
