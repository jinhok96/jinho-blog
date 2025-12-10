export type Params<T = Record<string, string>> = {
  params: Promise<T>;
};

export type ParamsWithSearchParams<T = Record<string, string>> = {
  params: Promise<T>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
