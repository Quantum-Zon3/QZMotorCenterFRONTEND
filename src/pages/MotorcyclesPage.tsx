import { useEffect, useState } from "react";
import {
  MdDirectionsBike, MdAdd, MdSearch,
  MdEdit, MdDelete, MdClose, MdRefresh, MdWarning,
} from "react-icons/md";
import {
  getMotorcycles, createMotorcycle,
  updateMotorcycle, deleteMotorcycle,
} from "../features/motorcycles/motorcycle.api";
import type { Motorcycle, CrearMotorcycleInput } from "../features/motorcycles/motorcycle.type";
import { formatCurrency } from "../lib/formatters";
import { getErrorMessage } from "../lib/http/get-error-message";
import { env } from "../config/env";

const EMPTY_FORM: CrearMotorcycleInput = {
  placa: "", marca: "", modelo: "",
  year: new Date().getFullYear(),
  precio: 0, cilindraje: 0,
  image_url: null, creada_el: null,
};

const isColdStartError = (e: unknown) => {
  const msg = getErrorMessage(e, "").toLowerCase();
  return (
    msg.includes("timeout") || msg.includes("network") ||
    msg.includes("econnrefused") || msg.includes("enotfound") ||
    (e as { code?: string })?.code === "ECONNABORTED"
  );
};

export default function MotorcyclesPage() {
  const [motos, setMotos]         = useState<Motorcycle[]>([]);
  const [loading, setLoading]     = useState(true);
  const [coldStart, setColdStart] = useState(false);
  const [search, setSearch]       = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Motorcycle | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError]   = useState("");
  const [formError, setFormError]   = useState("");
  const [form, setForm]             = useState<CrearMotorcycleInput>(EMPTY_FORM);

  useEffect(() => { void loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    setPageError("");
    setColdStart(false);
    try {
      const data = await getMotorcycles();
      setMotos(data);
    } catch (e) {
      if (isColdStartError(e)) {
        setColdStart(true);
        setPageError("El microservicio está iniciando (cold start en Render). Espera unos segundos y presiona Reintentar.");
      } else {
        setPageError(getErrorMessage(e, "No se pudo conectar con el microservicio Motorcycles."));
      }
    } finally {
      setLoading(false);
    }
  };

  const filtered = motos.filter((m) => {
    const t = search.toLowerCase();
    return (
      m.placa.toLowerCase().includes(t) ||
      m.marca.toLowerCase().includes(t) ||
      m.modelo.toLowerCase().includes(t)
    );
  });

  // Stats calculadas del lado del cliente
  const total       = motos.length;
  const precioPromedio = motos.length > 0
    ? motos.reduce((acc, m) => acc + Number(m.precio), 0) / motos.length
    : 0;
  const marcasUnicas = new Set(motos.map((m) => m.marca)).size;

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (moto: Motorcycle) => {
    setEditTarget(moto);
    setForm({
      placa: moto.placa, marca: moto.marca, modelo: moto.modelo,
      year: moto.year, precio: moto.precio, cilindraje: moto.cilindraje,
      image_url: moto.image_url ?? null,
      creada_el: moto.creada_el ?? null,
    });
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditTarget(null); setFormError(""); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericFields = ["year", "precio", "cilindraje"];
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
        await updateMotorcycle(editTarget.placa, form);
      } else {
        await createMotorcycle({
          ...form,
          creada_el: form.creada_el || new Date().toISOString(),
        });
      }
      closeModal();
      await loadAll();
    } catch (e) {
      setFormError(getErrorMessage(e, "Error al guardar. Verifica los datos."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (moto: Motorcycle) => {
    if (!window.confirm(`¿Eliminar la moto con placa "${moto.placa}"?`)) return;
    try {
      await deleteMotorcycle(moto.placa);
      await loadAll();
    } catch (e) {
      alert(getErrorMessage(e, "No se pudo eliminar."));
    }
  };

  return (
    <div className="animate-fade-in">
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1>Motos</h1>
          <p>
            Inventario de motocicletas ·{" "}
            <a
              href={`${env.apiGatewayUrl}/api/motorcycles/`}
              target="_blank" rel="noopener noreferrer"
              style={{ color: "var(--accent-light)", fontSize: "0.8rem" }}
            >
              API Gateway /api/motorcycles
            </a>
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={loadAll} title="Recargar">
            <MdRefresh />
          </button>
          <button className="btn btn-primary" onClick={openCreate}>
            <MdAdd /> Nueva Moto
          </button>
        </div>
      </div>

      {/* ── Banner error / cold start ── */}
      {pageError && (
        <div className="login-error" style={{ marginBottom: "1.25rem", display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
          <MdWarning style={{ flexShrink: 0, fontSize: "1.2rem", marginTop: "0.1rem" }} />
          <div style={{ flex: 1 }}>
            <div>{pageError}</div>
            {coldStart && (
              <button className="btn btn-secondary btn-sm" style={{ marginTop: "0.6rem" }} onClick={loadAll}>
                <MdRefresh /> Reintentar
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Stat cards calculadas del cliente ── */}
      {!loading && !pageError && (
        <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
          <div className="stat-card">
            <div className="stat-icon orange"><MdDirectionsBike /></div>
            <div className="stat-info">
              <h3>Total</h3>
              <div className="stat-value">{total}</div>
              <div className="stat-change">en inventario</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple"><MdDirectionsBike /></div>
            <div className="stat-info">
              <h3>Precio promedio</h3>
              <div className="stat-value" style={{ fontSize: "1.1rem" }}>
                {formatCurrency(precioPromedio)}
              </div>
              <div className="stat-change">del catálogo</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue"><MdDirectionsBike /></div>
            <div className="stat-info">
              <h3>Marcas</h3>
              <div className="stat-value">{marcasUnicas}</div>
              <div className="stat-change">diferentes</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Búsqueda ── */}
      <div className="search-bar">
        <span className="search-bar-icon"><MdSearch /></span>
        <input
          type="text"
          placeholder="Buscar por placa, marca o modelo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── Tabla ── */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Marca / Modelo</th>
              <th>Placa</th>
              <th>Año</th>
              <th>Cilindraje</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7}>
                <div className="empty-state">
                  <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", animation: "pulse 1.5s infinite" }}>
                    Conectando con el microservicio...
                  </div>
                </div>
              </td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7}>
                <div className="empty-state">
                  <div className="empty-state-icon"><MdDirectionsBike /></div>
                  <h3>Sin resultados</h3>
                  <p>{motos.length === 0 ? "El inventario está vacío. Registra la primera moto." : "No se encontraron motos con ese criterio."}</p>
                </div>
              </td></tr>
            ) : (
              filtered.map((m) => (
                <tr key={m.placa}>
                  <td>
                    {m.image_url
                      ? <img src={m.image_url} alt={m.modelo} className="vehicle-photo" />
                      : <div className="vehicle-photo-placeholder">🏍️</div>}
                  </td>
                  <td>
                    <div className="vehicle-name">{m.marca}</div>
                    <div className="vehicle-sub">{m.modelo}</div>
                  </td>
                  <td><span className="badge badge-info">{m.placa}</span></td>
                  <td>{m.year}</td>
                  <td><span className="badge badge-warning">{m.cilindraje} cc</span></td>
                  <td style={{ fontWeight: 600, color: "var(--success)" }}>
                    {formatCurrency(m.precio)}
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn-icon" title="Editar" onClick={() => openEdit(m)}>
                        <MdEdit />
                      </button>
                      <button className="btn-icon" title="Eliminar"
                        style={{ color: "var(--danger)" }}
                        onClick={() => handleDelete(m)}>
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Modal crear / editar ── */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editTarget ? "Editar Moto" : "Nueva Moto"}</h2>
              <button className="btn-icon" onClick={closeModal}><MdClose /></button>
            </div>

            {formError && (
              <div className="login-error" style={{ marginBottom: "1rem" }}>{formError}</div>
            )}

            <form onSubmit={handleSubmit} className="motorcycle-form">
              <div className="form-grid">
                <label>
                  Placa
                  <input
                    name="placa"
                    value={form.placa}
                    onChange={handleChange}
                    disabled={Boolean(editTarget)}
                    required
                  />
                </label>
                <label>
                  Marca
                  <input
                    name="marca"
                    value={form.marca}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Modelo
                  <input
                    name="modelo"
                    value={form.modelo}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Año
                  <input
                    type="number"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    required
                    min={1900}
                    max={new Date().getFullYear() + 1}
                  />
                </label>
                <label>
                  Precio
                  <input
                    type="number"
                    name="precio"
                    value={form.precio}
                    onChange={handleChange}
                    required
                    min={0}
                    step={0.01}
                  />
                </label>
                <label>
                  Cilindraje
                  <input
                    type="number"
                    name="cilindraje"
                    value={form.cilindraje}
                    onChange={handleChange}
                    required
                    min={0}
                  />
                </label>
                <label style={{ gridColumn: "span 2" }}>
                  URL imagen
                  <input
                    name="image_url"
                    value={form.image_url ?? ""}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={submitting}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Guardando..." : editTarget ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
