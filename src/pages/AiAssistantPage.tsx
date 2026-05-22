import { useEffect, useState, type FormEvent } from "react";
import PageHeader from "../components/ui/PageHeader";
import ServiceBadge from "../components/ui/ServiceBadge";
import { serviceRegistry } from "../config/service-registry";
import { aiClient } from "../lib/http/clients";
import { clampText } from "../lib/formatters";

interface ConversationRecord {
  id: string;
  title?: string;
  messages?: Array<{ role?: string; content?: string }>;
}

export default function AiAssistantPage() {
  const [conversations, setConversations] = useState<ConversationRecord[]>([]);
  const [title, setTitle] = useState("Exploración comercial");
  const [prompt, setPrompt] = useState(
    "Resume el estado general de los catálogos conectados al frontend.",
  );
  const [responsePreview, setResponsePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const { data } = await aiClient.get<ConversationRecord[]>(
          "/api/v1/conversations",
        );
        setConversations(Array.isArray(data) ? data : []);
      } catch {
        setError(
          "No se pudo consultar el historial del agente. La pantalla queda lista para cuando IA esté disponible.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadConversations();
  }, []);

  const runAgent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRunning(true);
    setResponsePreview("");
    setError("");

    try {
      const { data } = await aiClient.post("/api/v1/agent/run", {
        title,
        prompt,
      });
      setResponsePreview(JSON.stringify(data, null, 2));
    } catch {
      setError(
        "La ejecución del agente falló. Puede ser por el proveedor LLM, la base de datos o porque el servicio no está arriba.",
      );
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="page-stack">
      <section className="surface-card">
        <PageHeader
          eyebrow="Asistencia"
          title="Módulo de IA"
          description="Este espacio ya contempla historial de conversaciones y una primera interacción con /api/v1/agent/run."
        />

        <div className="chip-row">
          <ServiceBadge value={serviceRegistry.ai.stack} />
          <ServiceBadge value="/api/v1/conversations" />
          <ServiceBadge value="/api/v1/agent/run" />
        </div>

        <div className="two-column">
          <form className="surface-subcard form-stack" onSubmit={runAgent}>
            <label className="field">
              <span>Título de conversación</span>
              <input value={title} onChange={(event) => setTitle(event.target.value)} />
            </label>

            <label className="field">
              <span>Prompt inicial</span>
              <textarea
                rows={6}
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
              />
            </label>

            <button className="btn btn-primary" type="submit" disabled={running}>
              {running ? "Ejecutando..." : "Probar agente"}
            </button>

            {error ? <div className="feedback warning">{error}</div> : null}
            {responsePreview ? (
              <pre className="response-box">{responsePreview}</pre>
            ) : null}
          </form>

          <div className="surface-subcard">
            <h3>Conversaciones detectadas</h3>
            {loading ? (
              <div className="screen-center compact">
                <div className="loading-dot" />
                <p>Cargando historial...</p>
              </div>
            ) : conversations.length > 0 ? (
              <div className="stack-list">
                {conversations.map((conversation) => (
                  <article key={conversation.id} className="list-card">
                    <strong>{conversation.title ?? "Sin título"}</strong>
                    <p>
                      {clampText(
                        conversation.messages?.[0]?.content ??
                          "Sin mensajes iniciales todavía.",
                      )}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <article className="empty-panel">
                <h3>Aún no hay historial visible</h3>
                <p>
                  La vista está lista para mostrar conversaciones apenas el
                  servicio de IA responda.
                </p>
              </article>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
