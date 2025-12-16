import { useSearchParams } from 'next/navigation';

export function useQueryParams<T extends Record<string, string | string[] | undefined>>() {
  const searchParams = useSearchParams<T>();

  /**
   * 쿼리 파라미터를 설정하여 새로운 URL을 반환합니다.
   * 기존에 해당 키가 있든 없든 요청한 값으로 설정합니다.
   */
  const set = (key: string & keyof T, value: string | string[]): string => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (Array.isArray(value)) {
      newSearchParams.delete(key);
      value.forEach(v => newSearchParams.append(key, v));
    } else {
      newSearchParams.set(key, value);
    }

    const queryString = newSearchParams.toString();
    return queryString;
  };

  /**
   * 현재 URL에서 지정된 쿼리 파라미터를 제거하여 새로운 URL을 반환합니다.
   */
  const remove = (keys: (string & keyof T) | (string & keyof T)[]): string => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const keysArray = Array.isArray(keys) ? keys : [keys];

    keysArray.forEach(key => {
      newSearchParams.delete(key);
    });

    const queryString = newSearchParams.toString();
    return queryString;
  };

  /**
   * 현재 쿼리 파라미터의 값을 가져옵니다.
   */
  const get = (key: string & keyof T) => {
    return searchParams.get(key);
  };
  /**
   * 현재 쿼리 파라미터의 모든 값을 배열로 가져옵니다.
   */
  const getAll = (key: string & keyof T) => {
    return searchParams.getAll(key);
  };

  return { set, remove, get, getAll };
}
