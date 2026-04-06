import { useEffect, useState } from "react"

export function useApiFetch<T = unknown>(url: string, options?: RequestInit, manual = false) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    if (manual && refetchTrigger === 0) return; // ← skip the initial mount run

    const controller = new AbortController();

    async function fetchData() {
      setLoading(true);

      try {
        const response = await fetch(url, { signal: controller.signal, ...options });
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const json = await response.json();

        setData(json);
        setError(null);
      } catch (err: any) {
        if (err.name === "AbortError") return;

        setData(null);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => controller.abort();
  }, [url, refetchTrigger]);

  const refetch = () => setRefetchTrigger((prev) => prev + 1);

  return { data, loading, error, refetch };
}
