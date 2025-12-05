type Query = {
  key: string;
  value: string;
};

export function createSearchParams(query: Query | Query[], searchParams?: URLSearchParams | string): URLSearchParams {
  const params = new URLSearchParams(searchParams?.toString());

  if (Array.isArray(query)) query.forEach(({ key, value }) => params.set(key, value));
  else params.set(query.key, query.value);

  return params;
}
