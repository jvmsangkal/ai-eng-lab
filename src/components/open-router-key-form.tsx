import { useState } from "react";
import { openrouterByok } from "@tanstack/ai-openrouter/byok";
import { useByok } from "@tanstack/ai-react";
import { byok } from "@/lib/byok";

export function OpenRouterKeyForm() {
  const snapshot = useByok(byok);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const status = snapshot.status[openrouterByok.id];
  const masked = status && "masked" in status ? status.masked : undefined;
  const missingKey = snapshot.prompt?.reason === "missing";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const next = draft.trim();
        if (!next) return;
        setError("");
        void byok
          .update(openrouterByok.id, next)
          .then(() => setDraft(""))
          .catch((caught: unknown) =>
            setError(caught instanceof Error ? caught.message : "Could not save key"),
          );
      }}
    >
      <input
        type="password"
        autoComplete="off"
        placeholder={masked ? `Saved ${masked}` : "Paste your OpenRouter key"}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />
      <button type="submit" disabled={!draft.trim()}>
        Save key
      </button>
      {missingKey ? <p>Paste an OpenRouter key, then send again.</p> : null}
      {error ? <p>{error}</p> : null}
    </form>
  );
}
