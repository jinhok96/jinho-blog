import { useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

type QueryParamsAPI<T extends Record<string, string | string[] | undefined>> = {
  set: (key: string & keyof T, value: string | string[]) => QueryParamsAPI<T>;
  remove: (keys: (string & keyof T) | (string & keyof T)[]) => QueryParamsAPI<T>;
  get: (key: string & keyof T) => string | null;
  getAll: (key: string & keyof T) => string[];
  toString: () => string;
  toHref: (pathname?: string) => string;
};

export function useQueryParams<T extends Record<string, string | string[] | undefined>>() {
  const currentPathname = usePathname();
  const searchParams = useSearchParams<T>();

  const writeableSearchParams = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);

  console.log('currentPathname', currentPathname);
  console.log('searchParams', searchParams.get('sort'));
  console.log('writeableSearchParams', writeableSearchParams.get('sort'));

  const api = useMemo<QueryParamsAPI<T>>(
    () => ({
      /**
       * 쿼리 파라미터를 설정합니다.
       * 기존에 해당 키가 있든 없든 요청한 값으로 설정합니다.
       * 체이닝을 위해 자기 자신을 반환합니다.
       */
      set(key: string & keyof T, value: string | string[]) {
        if (Array.isArray(value)) {
          writeableSearchParams.delete(key);
          value.forEach(v => writeableSearchParams.append(key, v));
        } else {
          writeableSearchParams.set(key, value);
        }
        return this;
      },

      /**
       * 지정된 쿼리 파라미터를 제거합니다.
       * 체이닝을 위해 자기 자신을 반환합니다.
       */
      remove(keys: (string & keyof T) | (string & keyof T)[]) {
        const keysArray = Array.isArray(keys) ? keys : [keys];
        keysArray.forEach(key => {
          writeableSearchParams.delete(key);
        });
        return this;
      },

      /**
       * 현재 쿼리 파라미터의 값을 가져옵니다.
       */
      get(key: string & keyof T) {
        return writeableSearchParams.get(key);
      },

      /**
       * 현재 쿼리 파라미터의 모든 값을 배열로 가져옵니다.
       */
      getAll(key: string & keyof T) {
        return writeableSearchParams.getAll(key);
      },

      /**
       * 현재 쿼리 파라미터를 알파벳 순으로 정렬하여 문자열로 반환합니다.
       */
      toString() {
        const params = new URLSearchParams(writeableSearchParams);
        params.sort();
        return params.toString();
      },

      /**
       * 현재 쿼리 파라미터를 포함한 href 문자열을 반환합니다.
       * pathname이 주어지면 해당 경로를 기준으로, 없으면 현재 경로를 기준으로 합니다.
       * 쿼리 파라미터는 알파벳 순으로 정렬됩니다.
       */
      toHref(pathname: string = currentPathname) {
        const queryString = this.toString();
        if (!queryString) return pathname;
        return `${pathname}?${queryString}`;
      },
    }),
    [currentPathname, writeableSearchParams],
  );

  return api;
}
