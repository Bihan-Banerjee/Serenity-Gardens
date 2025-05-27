import { useState } from "react";

export function useLoader(minDuration = 1500) {
  const [loading, setLoading] = useState(false);

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
        setTimeout(() => setLoading(false), remaining);
      } else {
        setLoading(false);
      }
    }
  };

  return { loading, runWithLoader };
}
