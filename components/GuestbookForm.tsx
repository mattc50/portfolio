import { useApiFetch } from "@/hooks/useApiFetch"
import { FormEvent, useEffect, useState } from "react";
import styles from "./GuestbookForm.module.css";

function GuestbookForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState<string>("");

  const { data, loading, error, refetch } = useApiFetch('/api/guestbook', { // ✅ top level
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });

  useEffect(() => {
    if (data) {
      setName("");  // ✅ reset field
      onClose();    // ✅ close form
    }
  }, [data]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    refetch(); // ✅ just trigger it here
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input className={styles.input} id="name" value={name} onChange={(e) => setName(e.target.value)} />
      {error && <p style={{ color: "#e62d20" }}>{error === "HTTP Error: 400" ? "Please enter your name!" : error}</p>}
      <button className={styles.button} type="submit" disabled={loading}>Submit name</button>
    </form>
  )
}

export default GuestbookForm;