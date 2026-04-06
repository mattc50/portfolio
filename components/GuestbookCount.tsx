// components/GuestbookCount.tsx
import { useApiFetch } from "@/hooks/useApiFetch";

type GuestbookResponse = {
  count: number;
  entries: { id: number; name: string; created_at: number }[];
};

function GuestbookCount() {
  const { data, loading, error } = useApiFetch<GuestbookResponse>('/api/guestbook');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading count</p>;
  if (!data) return null;

  return (
    <p
      style={{
        marginTop: "4px",
        fontSize: "var(--font-size-2xs",
        color: "var(--muted)"
      }}
    >
      {data.count} {data.count === 1 ? "entry" : "entries"}
    </p>
  );
}

export default GuestbookCount;