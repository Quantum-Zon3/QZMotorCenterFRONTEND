import { useState } from "react";
import { MdSend, MdAdd, MdSmartToy } from "react-icons/md";

interface Message {
  role: "assistant" | "user";
  text: string;
}

const mockConversations = [
  { id: 1, title: "Consulta de inventario", date: "Hoy" },
  { id: 2, title: "Análisis de ventas Q1", date: "Ayer" },
  { id: 3, title: "Recomendación de scooter", date: "Hace 2 días" },
];

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "¡Hola! Soy el asistente IA de QZ Motor Center. Puedo ayudarte con consultas sobre inventario, estadísticas, recomendaciones de vehículos y más. ¿En qué puedo ayudarte hoy?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Entendido. Esta funcionalidad estará disponible una vez conectado el microservicio IA (FastAPI + PostgreSQL). Por ahora estoy en modo de demostración visual." },
      ]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Asistente IA</h1>
          <p>Consultas inteligentes — microservicio IA · FastAPI + PostgreSQL</p>
        </div>
        <button className="btn btn-secondary">
          <MdAdd /> Nueva conversación
        </button>
      </div>

      <div className="ai-layout">
        {/* Conversations sidebar */}
        <div className="ai-sidebar-panel">
          <div style={{ padding: "1rem", borderBottom: "1px solid var(--border)", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Conversaciones
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {mockConversations.map((c) => (
              <div key={c.id} style={{ padding: "0.85rem 1rem", borderBottom: "1px solid var(--border)", cursor: "pointer", transition: "background var(--transition-fast)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-card-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-primary)" }}>{c.title}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>{c.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat panel */}
        <div className="ai-chat-panel">
          <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1rem" }}>
              <MdSmartToy />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>QZ Assistant</div>
              <div style={{ fontSize: "0.72rem", color: "var(--success)" }}>● En línea</div>
            </div>
          </div>

          <div className="ai-messages">
            {messages.map((m, i) => (
              <div key={i} className={`ai-message ${m.role}`}>
                <div className="ai-message-avatar">
                  {m.role === "assistant" ? "🤖" : "U"}
                </div>
                <div className="ai-message-bubble">{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="ai-message assistant">
                <div className="ai-message-avatar">🤖</div>
                <div className="ai-message-bubble" style={{ color: "var(--text-muted)" }}>Escribiendo...</div>
              </div>
            )}
          </div>

          <div className="ai-input-area">
            <input
              type="text"
              placeholder="Escribe tu consulta aquí..."
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