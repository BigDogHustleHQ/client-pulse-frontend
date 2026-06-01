import { GraphQLClient } from 'graphql-request';
import { gqlFetch } from './graphql';

jest.mock('graphql-request');

const mockRequest = jest.fn();

beforeEach(() => {
  (GraphQLClient as jest.Mock).mockImplementation(() => ({ request: mockRequest }));
});

afterEach(() => {
  jest.resetAllMocks();
  delete process.env.NEXT_PUBLIC_API_URL;
});

describe('gqlFetch', () => {
  it('uses NEXT_PUBLIC_API_URL when set', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'http://custom-api/graphql';
    mockRequest.mockResolvedValue({ result: 'ok' });

    await gqlFetch('query { test }', null);

    expect(GraphQLClient).toHaveBeenCalledWith('http://custom-api/graphql', expect.any(Object));
  });

  it('falls back to localhost when NEXT_PUBLIC_API_URL is not set', async () => {
    mockRequest.mockResolvedValue({ result: 'ok' });

    await gqlFetch('query { test }', null);

    expect(GraphQLClient).toHaveBeenCalledWith('http://localhost:4000/graphql', expect.any(Object));
  });

  it('includes Authorization header when a token is provided', async () => {
    mockRequest.mockResolvedValue({ result: 'ok' });

    await gqlFetch('query { test }', 'my-token');

    expect(GraphQLClient).toHaveBeenCalledWith(expect.any(String), {
      headers: { Authorization: 'Bearer my-token' },
    });
  });

  it('omits Authorization header when token is null', async () => {
    mockRequest.mockResolvedValue({ result: 'ok' });

    await gqlFetch('query { test }', null);

    expect(GraphQLClient).toHaveBeenCalledWith(expect.any(String), { headers: {} });
  });

  it('returns the resolved value from the client', async () => {
    const payload = { getCurrentUser: { id: '1', email: 'a@b.com' } };
    mockRequest.mockResolvedValue(payload);

    const result = await gqlFetch('query { test }', null);

    expect(result).toEqual(payload);
  });

  it('propagates errors thrown by GraphQLClient', async () => {
    mockRequest.mockRejectedValue(new Error('Not authorized'));

    await expect(gqlFetch('query { test }', null)).rejects.toThrow('Not authorized');
  });
});
