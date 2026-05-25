import { useEffect, useState } from "react";
import {
  MdAdd,
  MdClose,
  MdDelete,
  MdEdit,
  MdElectricScooter,
  MdRefresh,
  MdSearch,
  MdWarning,
} from "react-icons/md";
import { createScooter, deleteScooter, getScooters, updateScooter } from "../features/scooters/scooter.api";
import type { Scooter, ScooterFormInput } from "../features/scooters/scooter.type";
import { formatCurrency } from "../lib/formatters";
import { getErrorMessage } from "../lib/http/get-error-message";

const emptyForm: ScooterFormInput = {
  marca: "",
  modelo: "",
  autonomia: 0,
  voltaje: 0,
  precio: 0,
  estado: "disponible",
};

const scooterBrand = (scooter: Scooter) => scooter.marca ?? scooter.brand ?? "";
const scooterModel = (scooter: Scooter) => scooter.modelo ?? scooter.model ?? "";

export default function ScootersPage() {
  const [data, setData] = useState<Scooter[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Scooter | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState<ScooterFormInput>(emptyForm);

  const loadAll = async () => {
    setLoading(true);
    setPageError("");
    try {
      setData(await getScooters());
    } catch (e) {
      setPageError(getErrorMessage(e, "No se pudo conectar con el microservicio Scooters."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
  }, []);

  const filtered = data.filter((scooter) => {
    const term = search.toLowerCase();
    return (
      scooterBrand(scooter).toLowerCase().includes(term) ||
      scooterModel(scooter).toLowerCase().includes(term) ||
      String(scooter.estado ?? "").toLowerCase().includes(term)
    );
  });

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (scooter: Scooter) => {
    setEditTarget(scooter);
    setForm({
      marca: scooterBrand(scooter),
      modelo: scooterModel(scooter),
      autonomia: Number(scooter.autonomia),
      voltaje: Number(scooter.voltaje),
      precio: Number(scooter.precio),
      estado: scooter.estado ?? "disponible",
    });
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTarget(null);
    setFormError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ["autonomia", "voltaje", "precio"];
    setForm((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      if (editTarget) {
        await updateScooter(editTarget.id, form);
      } else {
        await createScooter(form);
      }
      closeModal();
      await loadAll();
    } catch (e) {
      setFormError(getErrorMessage(e, "Error al guardar. Verifica los datos."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (scooter: Scooter) => {
    if (!window.confirm(`Eliminar la scooter "${scooterBrand(scooter)} ${scooterModel(scooter)}"?`)) return;
    try {
      await deleteScooter(scooter.id);
      await loadAll();
    } catch (e) {
      alert(getErrorMessage(e, "No se pudo eliminar."));
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Scooters</h1>
          <p>Inventario de scooters electricas · API Gateway /api/scooters</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={loadAll} title="Recargar"><MdRefresh /></button>
          <button className="btn btn-primary" onClick={openCreate}><MdAdd /> Nueva Scooter</button>
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
        <input type="text" placeholder="Buscar por marca, modelo o estado..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr><th>Foto</th><th>Marca / Modelo</th><th>Autonomia</th><th>Voltaje</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7}><div className="empty-state"><p>Conectando con el microservicio...</p></div></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7}><div className="empty-state"><div className="empty-state-icon"><MdElectricScooter /></div><h3>Sin resultados</h3><p>{data.length === 0 ? "No hay scooters registradas." : "No se encontraron scooters con ese criterio."}</p></div></td></tr>
            ) : filtered.map((scooter) => (
              <tr key={scooter.id}>
                <td>
                  {scooter.photoUrl
                    ? <img src={scooter.photoUrl} alt={scooterModel(scooter)} className="vehicle-photo" />
                    : <div className="vehicle-photo-placeholder"><MdElectricScooter /></div>}
                </td>
                <td>
                  <div className="vehicle-name">{scooterBrand(scooter)}</div>
                  <div className="vehicle-sub">{scooterModel(scooter)}</div>
                </td>
                <td><span className="badge badge-success">{scooter.autonomia} km</span></td>
                <td><span className="badge badge-info">{scooter.voltaje}V</span></td>
                <td style={{ fontWeight: 600, color: "var(--success)" }}>{formatCurrency(scooter.precio)}</td>
                <td><span className={`badge ${scooter.estado === "disponible" ? "badge-success" : "badge-danger"}`}>{scooter.estado ?? "sin estado"}</span></td>
                <td>
                  <div className="actions-cell">
                    <button className="btn-icon" title="Editar" onClick={() => openEdit(scooter)}><MdEdit /></button>
                    <button className="btn-icon" title="Eliminar" style={{ color: "var(--danger)" }} onClick={() => handleDelete(scooter)}><MdDelete /></button>
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
              <h2>{editTarget ? "Editar Scooter" : "Nueva Scooter"}</h2>
              <button className="btn-icon" onClick={closeModal}><MdClose /></button>
            </div>
            {formError && <div className="login-error" style={{ marginBottom: "1rem" }}>{formError}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label>Marca</label><input name="marca" value={form.marca} onChange={handleChange} required /></div>
                <div className="form-group"><label>Modelo</label><input name="modelo" value={form.modelo} onChange={handleChange} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Autonomia (km)</label><input name="autonomia" value={form.autonomia} onChange={handleChange} type="number" min={0} required /></div>
                <div className="form-group"><label>Voltaje (V)</label><input name="voltaje" value={form.voltaje} onChange={handleChange} type="number" min={0} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Precio (COP)</label><input name="precio" value={form.precio} onChange={handleChange} type="number" min={0} required /></div>
                <div className="form-group">
                  <label>Estado</label>
                  <select name="estado" value={form.estado} onChange={handleChange}>
                    <option value="disponible">Disponible</option>
                    <option value="agotado">Agotado</option>
                  </select>
                </div>
              </div>
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
