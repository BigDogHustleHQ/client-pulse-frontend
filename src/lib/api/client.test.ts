import { gqlFetch } from './client';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const successResponse = (data: unknown) => ({
  json: () => Promise.resolve({ data }),
});

const errorResponse = (errors: { message: string }[]) => ({
  json: () => Promise.resolve({ errors }),
});

describe('gqlFetch', () => {
  afterEach(() => {
    jest.resetAllMocks();
    delete process.env.NEXT_PUBLIC_API_URL;
  });

  it('uses NEXT_PUBLIC_API_URL when set', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'http://custom-api/graphql';
    mockFetch.mockResolvedValue(successResponse({ result: 'ok' }));

    await gqlFetch('query { test }', null);

    expect(mockFetch).toHaveBeenCalledWith('http://custom-api/graphql', expect.any(Object));
  });

  it('falls back to localhost when NEXT_PUBLIC_API_URL is not set', async () => {
    mockFetch.mockResolvedValue(successResponse({ result: 'ok' }));

    await gqlFetch('query { test }', null);

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/graphql', expect.any(Object));
  });

  it('includes Authorization header when a token is provided', async () => {
    mockFetch.mockResolvedValue(successResponse({ result: 'ok' }));

    await gqlFetch('query { test }', 'my-token');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer my-token' }),
      }),
    );
  });

  it('returns the data field on a successful response', async () => {
    const payload = { getCurrentUser: { id: '1', email: 'a@b.com' } };
    mockFetch.mockResolvedValue(successResponse(payload));

    const result = await gqlFetch('query { test }', null);

    expect(result).toEqual(payload);
  });

  it('throws with the first error message when the response contains errors', async () => {
    mockFetch.mockResolvedValue(errorResponse([{ message: 'Not authorized' }]));

    await expect(gqlFetch('query { test }', null)).rejects.toThrow('Not authorized');
  });
});
