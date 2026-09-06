import { useEffect, useRef, useState } from "react";

export function useLoader(minDuration = 1500) {
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const runWithLoader = async (asyncFn: () => Promise<any>) => {
    setLoading(true);

    const startTime = Date.now();

    try {
      const result = await asyncFn();
      return result;
    } finally {
      const elapsed = Date.now() - startTime;
      const remaining = minDuration - elapsed;

      if (remaining > 0) {
        timeoutRef.current = setTimeout(() => {
          if (mountedRef.current) setLoading(false);
        }, remaining);
      } else if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  return { loading, runWithLoader };
}
