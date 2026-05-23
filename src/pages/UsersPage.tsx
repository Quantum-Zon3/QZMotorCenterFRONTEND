import { useState } from "react";
import { MdPeople, MdAdd, MdSearch, MdEdit, MdDelete, MdClose } from "react-icons/md";

interface User {
  id: number;
  nombre: string;
  apellido: string;
  cedula: string;
  correo: string;
  telefono: string;
  role: string;
  estado: string;
}

const mockUsers: User[] = [
  { id: 1, nombre: "Ana", apellido: "García", cedula: "1234567890", correo: "ana@qz.com", telefono: "3001234567", role: "admin", estado: "activo" },
  { id: 2, nombre: "Carlos", apellido: "Pérez", cedula: "0987654321", correo: "carlos@qz.com", telefono: "3109876543", role: "operador", estado: "activo" },
  { id: 3, nombre: "María", apellido: "López", cedula: "1122334455", correo: "maria@qz.com", telefono: "3201122334", role: "cliente", estado: "inactivo" },
];

export default function UsersPage() {
  const [users] = useState<User[]>(mockUsers);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nombre: "", apellido: "", cedula: "", correo: "", telefono: "", role: "operador" });

  const filtered = users.filter((u) => {
    const t = search.toLowerCase();
    return u.nombre.toLowerCase().includes(t) || u.correo.toLowerCase().includes(t) || u.cedula.includes(t);
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Usuarios</h1>
          <p>Gestión de usuarios del sistema — microservicio Auth · Spring Boot + JWT + MySQL</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <MdAdd /> Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="search-bar">
        <span className="search-bar-icon"><MdSearch /></span>
        <input
          type="text"
          placeholder="Buscar por nombre, cédula o correo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cédula</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="empty-state">
                    <div className="empty-state-icon"><MdPeople /></div>
                    <h3>Sin resultados</h3>
                    <p>No se encontraron usuarios con ese criterio.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="vehicle-name">{u.nombre} {u.apellido}</div>
                  </td>
                  <td>{u.cedula}</td>
                  <td>{u.correo}</td>
                  <td>{u.telefono}</td>
                  <td>
                    <span className={`badge ${u.role === "admin" ? "badge-purple" : u.role === "operador" ? "badge-info" : "badge-warning"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.estado === "activo" ? "badge-success" : "badge-danger"}`}>
                      {u.estado}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn-icon" title="Editar"><MdEdit /></button>
                      <button className="btn-icon" title="Eliminar" style={{ color: "var(--danger)" }}><MdDelete /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nuevo Usuario</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><MdClose /></button>
            </div>
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
            <div className="form-row">
              <div className="form-group">
                <label>Cédula</label>
                <input name="cedula" value={form.cedula} onChange={handleChange} placeholder="Cédula" />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" />
              </div>
            </div>
            <div className="form-group">
              <label>Correo electrónico</label>
              <input name="correo" value={form.correo} onChange={handleChange} placeholder="correo@ejemplo.com" />
            </div>
            <div className="form-group">
              <label>Rol</label>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="admin">Admin</option>
                <option value="operador">Operador</option>
                <option value="cliente">Cliente</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary">Crear Usuario</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}