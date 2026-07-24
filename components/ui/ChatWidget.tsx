"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

//** A galloping horse shown while the assistant is thinking. */
function ThinkingHorse() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        borderRadius: 8,
        background: "#f1f1f1",
        overflow: "hidden",
      }}
      aria-label="Assistant is thinking"
      role="status"
    >
      <span style={{ position: "relative", width: 46, height: 26 }}>
        {/* dust puffs kicked up behind the horse */}
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: 2,
              bottom: 3,
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#c9c2b8",
              animation: "ccraDust 0.9s infinite ease-out",
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}

        {/* the horse itself: gallops in place with a bob and slight tilt */}
        <span
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            fontSize: 22,
            lineHeight: 1,
            display: "inline-block",
            animation: "ccraGallop 0.55s infinite ease-in-out",
          }}
        >
          🐎
        </span>

        {/* ground line streaking past, to sell the motion */}
        <span
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 2,
            background:
              "repeating-linear-gradient(90deg,#cfc8bd 0 8px,transparent 8px 16px)",
            animation: "ccraGround 0.45s infinite linear",
          }}
        />
      </span>

      <span style={{ fontSize: 13, color: "#777" }}>thinking…</span>
    </span>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

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
      let started = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        assistantText += decoder.decode(value, { stream: true });

        // Only add the assistant bubble once the first content arrives, so the
        // thinking dots stay visible for the whole wait instead of being
        // replaced by an empty bubble.
        if (!started) {
          started = true;
          setLoading(false);
          setMessages((prev) => [...prev, { role: "assistant", content: assistantText }]);
        } else {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: assistantText };
            return updated;
          });
        }
      }

      // Empty response guard.
      if (!started) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I didn't get a response. Please try again." },
        ]);
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
      {/* Keyframes for the thinking horse. Inline styles can't declare these. */}
      <style>{`
  @keyframes ccraGallop {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    30%      { transform: translateY(-5px) rotate(-6deg); }
    60%      { transform: translateY(-1px) rotate(3deg); }
  }
  @keyframes ccraDust {
    0%   { transform: translate(0,0) scale(0.6); opacity: 0.75; }
    100% { transform: translate(-14px,-7px) scale(1.5); opacity: 0; }
  }
  @keyframes ccraGround {
    0%   { background-position-x: 0; }
    100% { background-position-x: -16px; }
  }
`}</style>

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
          <div
            style={{
              padding: "10px 14px",
              background: "#1a1a1a",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            CCRA Assistant
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 12 }}>
            {messages.length === 0 && !loading && (
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
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m.content}
                </span>
              </div>
            ))}

            {loading && (
              <div style={{ marginBottom: 8, textAlign: "left" }}>
                <ThinkingHorse />
              </div>
            )}
          </div>

          <div style={{ display: "flex", borderTop: "1px solid #eee" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message…"
              disabled={loading}
              style={{
                flex: 1,
                border: "none",
                padding: 10,
                fontSize: 14,
                outline: "none",
                background: loading ? "#fafafa" : "#fff",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                border: "none",
                background: loading ? "#666" : "#1a1a1a",
                color: "#fff",
                padding: "0 16px",
                cursor: loading ? "default" : "pointer",
              }}
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