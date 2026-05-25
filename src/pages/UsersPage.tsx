import { useEffect, useState } from "react";
import { MdAdd, MdClose, MdDelete, MdEdit, MdPeople, MdRefresh, MdSearch, MdWarning } from "react-icons/md";
import { deleteUserRequest, getUsersRequest, registerRequest, updateUserRequest } from "../features/auth/auth.api";
import type { AuthUser, RegisterPayload } from "../features/auth/auth.types";
import { formatDateTime } from "../lib/formatters";
import { getErrorMessage } from "../lib/http/get-error-message";

type UserForm = Omit<RegisterPayload, "fechaRegistro"> & {
  fechaRegistro?: string;
};

const emptyForm: UserForm = {
  cedula: 0,
  nombre: "",
  apellido: "",
  email: "",
  contraseña: "",
  telefono: "",
  fechaRegistro: "",
};

export default function UsersPage() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<AuthUser | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState<UserForm>(emptyForm);

  const loadAll = async () => {
    setLoading(true);
    setPageError("");
    try {
      setUsers(await getUsersRequest());
    } catch (e) {
      setPageError(getErrorMessage(e, "No se pudo cargar usuarios desde Auth por el gateway."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
  }, []);

  const filtered = users.filter((user) => {
    const term = search.toLowerCase();
    return (
      String(user.nombre ?? "").toLowerCase().includes(term) ||
      String(user.apellido ?? "").toLowerCase().includes(term) ||
      String(user.email ?? "").toLowerCase().includes(term) ||
      String(user.cedula ?? "").includes(term)
    );
  });

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (user: AuthUser) => {
    setEditTarget(user);
    setForm({
      cedula: Number(user.cedula ?? 0),
      nombre: user.nombre ?? "",
      apellido: user.apellido ?? "",
      email: user.email ?? "",
      contraseña: user.contraseña ?? "",
      telefono: user.telefono ?? "",
      fechaRegistro: user.fechaRegistro ? String(user.fechaRegistro).slice(0, 16) : "",
    });
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTarget(null);
    setFormError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "cedula" ? Number(value) : value,
    }));
  };

  const buildPayload = (): RegisterPayload => ({
    cedula: Number(form.cedula),
    nombre: form.nombre,
    apellido: form.apellido,
    email: form.email,
    contraseña: form.contraseña,
    telefono: form.telefono,
    fechaRegistro: form.fechaRegistro || new Date().toISOString(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      if (editTarget?.cedula) {
        await updateUserRequest(Number(editTarget.cedula), buildPayload());
      } else {
        await registerRequest(buildPayload());
      }
      closeModal();
      await loadAll();
    } catch (e) {
      setFormError(getErrorMessage(e, "Error al guardar usuario."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (user: AuthUser) => {
    if (!user.cedula || !window.confirm(`Eliminar usuario "${user.email}"?`)) return;
    try {
      await deleteUserRequest(Number(user.cedula));
      await loadAll();
    } catch (e) {
      alert(getErrorMessage(e, "No se pudo eliminar el usuario."));
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Usuarios</h1>
          <p>Gestion de usuarios del sistema · API Gateway /qzMotorCenter/auth</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={loadAll} title="Recargar"><MdRefresh /></button>
          <button className="btn btn-primary" onClick={openCreate}><MdAdd /> Nuevo Usuario</button>
        </div>
      </div>

      {pageError && (
        <div className="login-error" style={{ marginBottom: "1rem", display: "flex", gap: "0.75rem" }}>
          <MdWarning style={{ flexShrink: 0 }} />
          <span>{pageError}</span>
        </div>
      )}

      <div className="search-bar">
        <span className="search-bar-icon"><MdSearch /></span>
        <input
          type="text"
          placeholder="Buscar por nombre, cedula o correo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cedula</th>
              <th>Correo</th>
              <th>Telefono</th>
              <th>Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6}><div className="empty-state"><p>Cargando usuarios reales...</p></div></td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="empty-state">
                    <div className="empty-state-icon"><MdPeople /></div>
                    <h3>Sin resultados</h3>
                    <p>{users.length === 0 ? "No hay usuarios registrados o el gateway no expone el listado." : "No se encontraron usuarios con ese criterio."}</p>
                  </div>
                </td>
              </tr>
            ) : filtered.map((user) => (
              <tr key={user.cedula ?? user.email}>
                <td><div className="vehicle-name">{user.nombre} {user.apellido}</div></td>
                <td>{user.cedula}</td>
                <td>{user.email}</td>
                <td>{user.telefono}</td>
                <td>{formatDateTime(user.fechaRegistro ? String(user.fechaRegistro) : null)}</td>
                <td>
                  <div className="actions-cell">
                    <button className="btn-icon" title="Editar" onClick={() => openEdit(user)}><MdEdit /></button>
                    <button className="btn-icon" title="Eliminar" style={{ color: "var(--danger)" }} onClick={() => handleDelete(user)}><MdDelete /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editTarget ? "Editar Usuario" : "Nuevo Usuario"}</h2>
              <button className="btn-icon" onClick={closeModal}><MdClose /></button>
            </div>
            {formError && <div className="login-error" style={{ marginBottom: "1rem" }}>{formError}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label>Nombre</label><input name="nombre" value={form.nombre} onChange={handleChange} required /></div>
                <div className="form-group"><label>Apellido</label><input name="apellido" value={form.apellido} onChange={handleChange} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Cedula</label><input name="cedula" value={form.cedula || ""} onChange={handleChange} type="number" disabled={Boolean(editTarget)} required /></div>
                <div className="form-group"><label>Telefono</label><input name="telefono" value={form.telefono} onChange={handleChange} required /></div>
              </div>
              <div className="form-group"><label>Correo electronico</label><input name="email" value={form.email} onChange={handleChange} type="email" disabled={Boolean(editTarget)} required /></div>
              <div className="form-group"><label>Contrasena</label><input name="contraseña" value={form.contraseña} onChange={handleChange} type="password" required /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={submitting}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? "Guardando..." : "Guardar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
