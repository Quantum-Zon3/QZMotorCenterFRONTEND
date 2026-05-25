import { useEffect, useState } from "react";
import { MdAdd, MdSend, MdSmartToy, MdWarning } from "react-icons/md";
import { aiClient } from "../lib/http/clients";
import { getErrorMessage } from "../lib/http/get-error-message";

interface Message {
  role: "assistant" | "user";
  text: string;
}

interface Conversation {
  id: string | number;
  title?: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

const getConversationTitle = (conversation: Conversation) =>
  conversation.title || `Conversacion ${conversation.id}`;

export default function AiAssistantPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");

  const loadConversations = async () => {
    setPageError("");
    try {
      const { data } = await aiClient.get<Conversation[]>("/api/v1/conversations");
      setConversations(data);
    } catch (e) {
      setPageError(getErrorMessage(e, "No se pudieron cargar conversaciones desde IA."));
    }
  };

  useEffect(() => {
    void loadConversations();
  }, []);

  const handleSend = async () => {
    const prompt = input.trim();
    if (!prompt) return;

    setMessages((prev) => [...prev, { role: "user", text: prompt }]);
    setInput("");
    setLoading(true);
    setPageError("");

    try {
      const { data } = await aiClient.post<{
        conversation_id?: string;
        response?: string;
      }>("/api/v1/agent/run", {
        prompt,
        title: prompt.slice(0, 80),
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.response ?? "Respuesta recibida sin contenido." },
      ]);
      await loadConversations();
    } catch (e) {
      setPageError(getErrorMessage(e, "No se pudo enviar la consulta al microservicio IA."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Asistente IA</h1>
          <p>Consultas inteligentes · API Gateway /api/v1</p>
        </div>
        <button className="btn btn-secondary" onClick={() => setMessages([])}>
          <MdAdd /> Nueva conversacion
        </button>
      </div>

      {pageError && (
        <div className="login-error" style={{ marginBottom: "1rem", display: "flex", gap: "0.75rem" }}>
          <MdWarning style={{ flexShrink: 0 }} />
          <span>{pageError}</span>
        </div>
      )}

      <div className="ai-layout">
        <div className="ai-sidebar-panel">
          <div style={{ padding: "1rem", borderBottom: "1px solid var(--border)", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Conversaciones
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {conversations.length === 0 ? (
              <div style={{ padding: "1rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>Sin conversaciones registradas.</div>
            ) : conversations.map((conversation) => (
              <div key={conversation.id} style={{ padding: "0.85rem 1rem", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-primary)" }}>{getConversationTitle(conversation)}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                  {conversation.updated_at ?? conversation.updatedAt ?? conversation.created_at ?? conversation.createdAt ?? "Sin fecha"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ai-chat-panel">
          <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1rem" }}>
              <MdSmartToy />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>QZ Assistant</div>
              <div style={{ fontSize: "0.72rem", color: "var(--success)" }}>Conectado al gateway</div>
            </div>
          </div>

          <div className="ai-messages">
            {messages.length === 0 && (
              <div className="empty-state">
                <h3>Nueva consulta</h3>
                <p>Escribe una pregunta para enviarla al microservicio IA.</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`ai-message ${message.role}`}>
                <div className="ai-message-avatar">{message.role === "assistant" ? "IA" : "U"}</div>
                <div className="ai-message-bubble">{message.text}</div>
              </div>
            ))}
            {loading && (
              <div className="ai-message assistant">
                <div className="ai-message-avatar">IA</div>
                <div className="ai-message-bubble" style={{ color: "var(--text-muted)" }}>Consultando...</div>
              </div>
            )}
          </div>

          <div className="ai-input-area">
            <input
              type="text"
              placeholder="Escribe tu consulta aqui..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button className="btn btn-primary" onClick={handleSend} disabled={loading || !input.trim()}>
              <MdSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
