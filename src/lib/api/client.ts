export const gqlFetch = async <T>(
  query: string,
  token: string | null,
): Promise<T> => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/graphql',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ query }),
    },
  );

  const json = (await res.json()) as {
    data?: T;
    errors?: { message: string }[];
  };

  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }

  return json.data as T;
};
