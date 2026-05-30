import { render } from '@testing-library/react';
import RootLayout from './layout';

vi.mock('@clerk/nextjs', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('@/providers/QueryProvider', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('RootLayout', () => {
  it('renders children', () => {
    const { getByText } = render(
      <RootLayout>
        <div>test content</div>
      </RootLayout>,
    );

    expect(getByText('test content')).toBeInTheDocument();
  });
});
