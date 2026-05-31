import { render } from '@testing-library/react';
import RootLayout from './layout';

jest.mock('@clerk/nextjs', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
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
