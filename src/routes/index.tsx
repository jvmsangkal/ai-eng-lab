import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { fetchServerSentEvents, useChat } from "@tanstack/ai-react";
import { OpenRouterKeyForm } from "@/components/open-router-key-form";
import { byok } from "@/lib/byok";

function ChatPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, isLoading, error, stop } = useChat({
    connection: fetchServerSentEvents("/api/chat"),
    threadId: "support-chat",
    byok,
  });

  const handleSendMessage = () => {
    if (!input.trim()) return;
    void sendMessage(input.trim());
    setInput("");
  };

  return (
    <div>
      <OpenRouterKeyForm />
      {messages.map((message) => (
        <div key={message.id}>
          {message.parts.map((part) =>
            part.type === "text" ? <p key={crypto.randomUUID()}>{part.content}</p> : null,
          )}
        </div>
      ))}
      {error ? <p>{error.message}</p> : null}
      {isLoading ? (
        <button type="button" onClick={stop}>
          Stop
        </button>
      ) : null}
      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        disabled={isLoading}
      />
      <button type="button" onClick={handleSendMessage} disabled={!input.trim() || isLoading}>
        Send
      </button>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: ChatPage,
});
