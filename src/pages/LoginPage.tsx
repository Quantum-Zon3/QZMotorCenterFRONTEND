import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdLock, MdPerson } from "react-icons/md";
import { useAuth } from "../features/auth/useAuth";

export default function LoginPage() {
  const location = useLocation();
  const registeredEmail = (location.state as { registeredEmail?: string } | null)?.registeredEmail ?? "";
  const [email, setEmail] = useState(registeredEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/app/dashboard");
    } catch {
      setError("Credenciales invalidas. Verifica tu usuario y contrasena.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">QZ</div>
          <h1>QZ Motor Center</h1>
          <p>Inicia sesion para continuar</p>
        </div>

        <form onSubmit={handleSubmit}>
          {registeredEmail && (
            <div className="login-success">Usuario creado. Ahora inicia sesion con tu correo.</div>
          )}
          {error && <div className="login-error">{error}</div>}

          <div className="login-input-group">
            <span className="input-icon"><MdPerson /></span>
            <input
              type="email"
              placeholder="Correo electronico"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="login-input-group">
            <span className="input-icon"><MdLock /></span>
            <input
              type="password"
              placeholder="Contrasena"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Iniciando sesion..." : "Iniciar sesion"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
          No tienes usuario?{" "}
          <Link to="/registro" style={{ color: "var(--accent-light)" }}>Crear cuenta</Link>
        </p>
      </div>
    </div>
  );
}
