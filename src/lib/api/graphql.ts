import { GraphQLClient } from 'graphql-request';

export async function gqlFetch<T>(query: string, token: string | null): Promise<T> {
  const client = new GraphQLClient(
    process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/graphql',
    { headers: token ? { Authorization: `Bearer ${token}` } : {} },
  );
  return client.request<T>(query);
}
