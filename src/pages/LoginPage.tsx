import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../features/auth/useAuth";
import { getErrorMessage } from "../lib/http/get-error-message";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const redirectTarget =
    (location.state as { from?: string } | null)?.from ?? "/app/dashboard";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(redirectTarget, { replace: true });
    } catch (requestError: unknown) {
      setError(
        getErrorMessage(
          requestError,
          "No fue posible iniciar sesión con el microservicio Auth.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <PageHeader
          eyebrow="Acceso interno"
          title="Conecta el frontend con Auth"
          description="Esta pantalla ya apunta al endpoint real /qzwork_hub/auth/login y deja lista la persistencia de sesión."
        />

        <form className="form-stack" onSubmit={handleSubmit}>
          <label className="field">
            <span>Correo</span>
            <input
              type="email"
              placeholder="operador@qzmotorcenter.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label className="field">
            <span>Contraseña</span>
            <input
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error ? <div className="feedback error">{error}</div> : null}

          <button type="submit" className="btn btn-primary full-width" disabled={isSubmitting}>
            {isSubmitting ? "Ingresando..." : "Entrar al panel"}
          </button>
        </form>
      </div>
    </div>
  );
}
