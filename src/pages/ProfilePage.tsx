import { useState } from "react";
import { useAuth } from "../features/auth/useAuth";
import { MdSave } from "react-icons/md";

export default function ProfilePage() {
    const { session } = useAuth();
    const [form, setForm] = useState({
        nombre: (session?.user as { nombre?: string })?.nombre ?? "",
        apellido: (session?.user as { apellido?: string })?.apellido ?? "",
        correo: session?.user?.email ?? "",
        telefono: (session?.user as { telefono?: string })?.telefono ?? "",
        direccion: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const initial = (form.nombre || session?.user?.email || "U").charAt(0).toUpperCase();

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>Mi Perfil</h1>
                    <p>Información personal y configuración de tu cuenta</p>
                </div>
            </div>

            <div className="profile-grid">
                {/* Avatar card */}
                <div className="profile-card">
                    <div className="profile-avatar">{initial}</div>
                    <div className="profile-name">{form.nombre} {form.apellido}</div>
                    <div className="profile-role">{(session?.user as { role?: string })?.role ?? "Operador"}</div>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.75rem" }}>
                        {form.correo}
                    </p>
                </div>

                {/* Form */}
                <div>
                    <div className="card">
                        <h3 style={{ marginBottom: "1.25rem" }}>Información personal</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Nombre</label>
                                <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" />
                            </div>
                            <div className="form-group">
                                <label>Apellido</label>
                                <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Correo electrónico</label>
                            <input name="correo" value={form.correo} onChange={handleChange} type="email" />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Teléfono</label>
                                <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="300..." />
                            </div>
                            <div className="form-group">
                                <label>Dirección</label>
                                <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Cra 1 #2-3" />
                            </div>
                        </div>

                        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "1.5rem 0" }} />

                        <h3 style={{ marginBottom: "1.25rem" }}>Cambiar contraseña</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Nueva contraseña</label>
                                <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="••••••••" />
                            </div>
                            <div className="form-group">
                                <label>Confirmar contraseña</label>
                                <input name="confirmPassword" value={form.confirmPassword} onChange={handleChange} type="password" placeholder="••••••••" />
                            </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
                            <button className="btn btn-primary">
                                <MdSave /> Guardar cambios
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}