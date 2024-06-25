import { useState, useEffect, useCallback } from 'react';

import { useAppStore } from '../stores';

const useFetchData = (fetchFunction, ...args) => {
  const reFetch = useAppStore((state) => state.isRefecth);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedFetchFunction = useCallback(fetchFunction, [...args]);

  useEffect(() => {
    setLoading(true);
    memoizedFetchFunction()
      .then((res) => {
        setLoading(false);
        if (res) {
          setResponse(res);
        } else {
          setError('Sorry! Something went wrong. App server error');
        }
      })
      .catch((err) => {
        setError(err.message || 'Sorry! Something went wrong. App server error');
        setLoading(false);
      });
  }, [memoizedFetchFunction, reFetch]);

  return [loading, error, response];
};

export default useFetchData;
