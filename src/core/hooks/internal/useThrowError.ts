import { useState } from 'react';

export function useThrowError() {
  const [error, setError] = useState<Error>();

  if (error) throw error;

  return setError;
}
