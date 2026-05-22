import { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import ServiceBadge from "../components/ui/ServiceBadge";
import { serviceRegistry } from "../config/service-registry";
import { authProtectedClient } from "../lib/http/clients";
import { getErrorMessage } from "../lib/http/get-error-message";
import { formatDateTime } from "../lib/formatters";

interface AuthUserRecord {
  cedula?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  fechaRegistro?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<AuthUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data } = await authProtectedClient.get<AuthUserRecord[]>(
          "/qzwork_hub/auth",
        );
        setUsers(Array.isArray(data) ? data : []);
      } catch (requestError: unknown) {
        setError(
          getErrorMessage(
            requestError,
            "La consulta a usuarios requiere que Auth esté disponible y la sesión sea válida.",
          ),
        );
      } finally {
        setLoading(false);
      }
    };

    void loadUsers();
  }, []);

  return (
    <div className="page-stack">
      <section className="surface-card">
        <PageHeader
          eyebrow="Identidad"
          title="Usuarios y autenticación"
          description="Esta pantalla deja sembrado el módulo de Auth con el contrato real del backend actual."
        />

        <div className="chip-row">
          <ServiceBadge value={serviceRegistry.auth.stack} />
          <ServiceBadge value={serviceRegistry.auth.routeBase} />
        </div>

        {error ? <div className="feedback warning">{error}</div> : null}

        {loading ? (
          <div className="screen-center compact">
            <div className="loading-dot" />
            <p>Consultando usuarios...</p>
          </div>
        ) : (
          <div className="data-grid">
            {users.length > 0 ? (
              users.map((user) => (
                <article key={user.cedula ?? user.email} className="info-card">
                  <h3>
                    {user.nombre ?? "Sin nombre"} {user.apellido ?? ""}
                  </h3>
                  <p>{user.email ?? "Sin correo"}</p>
                  <ul className="meta-list">
                    <li>Cédula: {user.cedula ?? "N/D"}</li>
                    <li>Teléfono: {user.telefono ?? "N/D"}</li>
                    <li>Registro: {formatDateTime(user.fechaRegistro)}</li>
                  </ul>
                </article>
              ))
            ) : (
              <article className="empty-panel">
                <h3>Módulo listo para conectar</h3>
                <p>
                  Todavía no llegaron usuarios desde Auth, pero la base del
                  frontend ya entiende el endpoint real y su tipo de respuesta.
                </p>
              </article>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
