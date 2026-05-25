import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdBadge, MdLock, MdMail, MdPerson, MdPhone } from "react-icons/md";
import { registerRequest } from "../features/auth/auth.api";
import { getErrorMessage } from "../lib/http/get-error-message";

const todayForBackend = () => new Date().toISOString().slice(0, 19);

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    cedula: "",
    nombre: "",
    apellido: "",
    email: "",
    contraseña: "",
    telefono: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,45}$/.test(form.contraseña)) {
      setError("La contrasena debe tener entre 8 y 45 caracteres e incluir al menos una letra y un numero.");
      return;
    }

    setLoading(true);

    try {
      await registerRequest({
        cedula: Number(form.cedula),
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        email: form.email.trim(),
        contraseña: form.contraseña,
        telefono: form.telefono.trim(),
        fechaRegistro: todayForBackend(),
      });
      navigate("/login", {
        replace: true,
        state: { registeredEmail: form.email.trim() },
      });
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo crear el usuario. Verifica los datos e intenta de nuevo."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card register-card">
        <div className="login-header">
          <div className="login-logo">QZ</div>
          <h1>Crear usuario</h1>
          <p>Registra una cuenta para acceder al panel administrativo</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

          <div className="login-input-group">
            <span className="input-icon"><MdBadge /></span>
            <input
              name="cedula"
              type="number"
              placeholder="Cedula"
              value={form.cedula}
              onChange={handleChange}
              required
              min={1}
            />
          </div>

          <div className="auth-form-grid">
            <div className="login-input-group">
              <span className="input-icon"><MdPerson /></span>
              <input
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                maxLength={45}
              />
            </div>
            <div className="login-input-group">
              <span className="input-icon"><MdPerson /></span>
              <input
                name="apellido"
                placeholder="Apellido"
                value={form.apellido}
                onChange={handleChange}
                required
                maxLength={45}
              />
            </div>
          </div>

          <div className="login-input-group">
            <span className="input-icon"><MdMail /></span>
            <input
              name="email"
              type="email"
              placeholder="Correo electronico"
              value={form.email}
              onChange={handleChange}
              required
              maxLength={45}
              autoComplete="username"
            />
          </div>

          <div className="login-input-group">
            <span className="input-icon"><MdPhone /></span>
            <input
              name="telefono"
              placeholder="Telefono"
              value={form.telefono}
              onChange={handleChange}
              required
              maxLength={45}
            />
          </div>

          <div className="login-input-group">
            <span className="input-icon"><MdLock /></span>
            <input
              name="contraseña"
              type="password"
              placeholder="Contrasena con letras y numeros"
              value={form.contraseña}
              onChange={handleChange}
              required
              minLength={8}
              maxLength={45}
              pattern="^(?=.*[A-Za-z])(?=.*\d).{8,45}$"
              title="Debe tener entre 8 y 45 caracteres e incluir al menos una letra y un numero."
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Creando usuario..." : "Crear usuario"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
          Ya tienes cuenta?{" "}
          <Link to="/login" style={{ color: "var(--accent-light)" }}>Inicia sesion</Link>
        </p>
      </div>
    </div>
  );
}
