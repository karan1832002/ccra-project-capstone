"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: assistantText };
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
      {open && (
        <div
          style={{
            width: 320,
            height: 420,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            marginBottom: 12,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "10px 14px", background: "#1a1a1a", color: "#fff", fontWeight: 600 }}>
            CCRA Assistant
          </div>
          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 12 }}>
            {messages.length === 0 && (
              <p style={{ color: "#888", fontSize: 14 }}>
                Ask me about events, standings, the rulebook, or the store.
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 8,
                  textAlign: m.role === "user" ? "right" : "left",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "6px 10px",
                    borderRadius: 8,
                    background: m.role === "user" ? "#1a1a1a" : "#f1f1f1",
                    color: m.role === "user" ? "#fff" : "#111",
                    fontSize: 14,
                    maxWidth: 220,
                  }}
                >
                  {m.content || "…"}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", borderTop: "1px solid #eee" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message…"
              style={{ flex: 1, border: "none", padding: 10, fontSize: 14, outline: "none" }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{ border: "none", background: "#1a1a1a", color: "#fff", padding: "0 16px", cursor: "pointer" }}
            >
              Send
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#1a1a1a",
          color: "#fff",
          border: "none",
          fontSize: 22,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
        aria-label="Toggle chat"
      >
        {open ? "×" : "💬"}
      </button>
    </div>
  );
}