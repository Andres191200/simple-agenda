import { useEffect, useState } from "react";

/**
 * Returns the current Date, refreshed about once per minute so the now-line
 * stays current without churning renders. See design.md D7.
 */
export function useNow(): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}
