import { useEffect, useState } from "react";
import { MdDirectionsBike, MdAdd, MdSearch, MdEdit, MdDelete, MdClose, MdRefresh, MdWarning } from "react-icons/md";
import {
  getMotorcycles, getMarcas, createMotorcycle,
  updateMotorcycle, deleteMotorcycle, getResumenCatalogo, createMarca,
} from "../features/motorcycle/motorcycle.api";
import type {
  Motorcycle, Marca, CrearMotorcycleInput, ResumenCatalogo, EstadoMotorcycle,
} from "../features/motorcycle/motorcycle.type";
import { CATEGORIAS_MOTORCYCLE, ESTADOS_MOTORCYCLE } from "../features/motorcycle/motorcycle.type";
import { formatCurrency } from "../lib/formatters";
import { getErrorMessage } from "../lib/http/get-error-message";

const EMPTY_FORM: CrearMotorcycleInput = {
  marcaId: 0, modelo: "", categoria: "naked",
  cilindrada: 0, potenciaHp: 0, torqueNm: 0,
  velocidadMaximaKmh: 0, precio: 0, stock: 0,
  estado: "disponible", fotoUrl: null,
};

const estadoBadge = (e: EstadoMotorcycle) => {
  if (e === "disponible") return "badge badge-success";
  if (e === "reservada")  return "badge badge-warning";
  return "badge badge-danger";
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
  const [motos, setMotos]       = useState<Motorcycle[]>([]);
  const [marcas, setMarcas]     = useState<Marca[]>([]);
  const [resumen, setResumen]   = useState<ResumenCatalogo | null>(null);

  const [loading, setLoading]         = useState(true);
  const [coldStart, setColdStart]     = useState(false);
  const [search, setSearch]           = useState("");
  const [showModal, setShowModal]     = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [editTarget, setEditTarget]   = useState<Motorcycle | null>(null);
  const [submitting, setSubmitting]   = useState(false);
  const [brandSubmitting, setBrandSubmitting] = useState(false);
  const [pageError, setPageError]     = useState("");
  const [formError, setFormError]     = useState("");
  const [brandError, setBrandError]   = useState("");
  const [form, setForm]               = useState<CrearMotorcycleInput>(EMPTY_FORM);
  const [brandForm, setBrandForm]     = useState({ nombre: "", pais: "" });
  const [isCreatingMarca, setIsCreatingMarca] = useState(false);
  const [newMarcaNombre, setNewMarcaNombre] = useState("");
  const [newMarcaPais, setNewMarcaPais] = useState("");

  useEffect(() => { void loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    setPageError("");
    setColdStart(false);
    try {
      const [motosData, marcasData, resumenData] = await Promise.all([
        getMotorcycles(),
        getMarcas(),
        getResumenCatalogo(),
      ]);
      setMotos(motosData);
      setMarcas(marcasData);
      setResumen(resumenData);
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
      m.modelo.toLowerCase().includes(t) ||
      (m.marca?.nombre ?? "").toLowerCase().includes(t) ||
      m.categoria.toLowerCase().includes(t)
    );
  });

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setIsCreatingMarca(false);
    setNewMarcaNombre("");
    setNewMarcaPais("");
    setShowModal(true);
  };

  const openEdit = (moto: Motorcycle) => {
    setEditTarget(moto);
    setForm({
      marcaId: moto.marcaId, modelo: moto.modelo, categoria: moto.categoria,
      cilindrada: moto.cilindrada, potenciaHp: moto.potenciaHp, torqueNm: moto.torqueNm,
      velocidadMaximaKmh: moto.velocidadMaximaKmh, precio: moto.precio,
      stock: moto.stock, estado: moto.estado, fotoUrl: moto.fotoUrl,
    });
    setFormError("");
    setIsCreatingMarca(false);
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditTarget(null); setFormError(""); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ["marcaId", "cilindrada", "potenciaHp", "torqueNm", "velocidadMaximaKmh", "precio", "stock"];
    setForm((prev) => ({ ...prev, [name]: numericFields.includes(name) ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      if (editTarget) {
        await updateMotorcycle(editTarget.id, form);
      } else {
        let payload = form;
        if (isCreatingMarca) {
          const createdMarca = await createMarca({ nombre: newMarcaNombre.trim(), pais: newMarcaPais.trim() || "Desconocido" });
          setMarcas((prev) => [...prev, createdMarca]);
          payload = { ...form, marcaId: createdMarca.id };
        }
        await createMotorcycle(payload);
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
    const label = `${moto.marca?.nombre ?? "Marca"} ${moto.modelo}`;
    if (!window.confirm(`¿Eliminar "${label}"?`)) return;
    try {
      await deleteMotorcycle(moto.id);
      await loadAll();
    } catch (e) {
      alert(getErrorMessage(e, "No se pudo eliminar."));
    }
  };

  const handleCreateMarca = async (e: React.FormEvent) => {
    e.preventDefault();
    setBrandSubmitting(true);
    setBrandError("");
    try {
      const createdMarca = await createMarca({ nombre: brandForm.nombre.trim(), pais: brandForm.pais.trim() });
      setMarcas((prev) => [...prev, createdMarca]);
      setShowBrandModal(false);
      setBrandError("");
    } catch (err) {
      setBrandError(getErrorMessage(err, "No se pudo crear la marca."));
    } finally {
      setBrandSubmitting(false);
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
            
              href="https://qzmotorcenter-motorcycles-api.onrender.com/api/health"
              target="_blank" rel="noopener noreferrer"
              style={{ color: "var(--accent-light)", fontSize: "0.8rem" }}
            >
              qzmotorcenter-motorcycles-api.onrender.com
            </a>
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={loadAll} title="Recargar datos"><MdRefresh /></button>
          <button className="btn btn-secondary" onClick={() => { setBrandError(""); setBrandForm({ nombre: "", pais: "" }); setShowBrandModal(true); }}>
            <MdAdd /> Nueva Marca
          </button>
          <button className="btn btn-primary" onClick={openCreate}><MdAdd /> Nueva Moto</button>
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

      {/* ── Stat cards ── */}
      {resumen && (
        <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
          <div className="stat-card">
            <div className="stat-icon orange"><MdDirectionsBike /></div>
            <div className="stat-info">
              <h3>Total</h3>
              <div className="stat-value">{resumen.totalMotorcycles}</div>
              <div className="stat-change">en inventario</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon teal"><MdDirectionsBike /></div>
            <div className="stat-info">
              <h3>Disponibles</h3>
              <div className="stat-value">{resumen.motorcyclesDisponibles}</div>
              <div className="stat-change positive">listas para venta</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple"><MdDirectionsBike /></div>
            <div className="stat-info">
              <h3>Precio promedio</h3>
              <div className="stat-value" style={{ fontSize: "1.1rem" }}>{formatCurrency(resumen.precioPromedio)}</div>
              <div className="stat-change">del catálogo</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue"><MdDirectionsBike /></div>
            <div className="stat-info">
              <h3>Marcas</h3>
              <div className="stat-value">{resumen.totalMarcas}</div>
              <div className="stat-change">registradas</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Búsqueda ── */}
      <div className="search-bar">
        <span className="search-bar-icon"><MdSearch /></span>
        <input
          type="text" placeholder="Buscar por marca, modelo o categoría..."
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── Tabla ── */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Foto</th><th>Marca / Modelo</th><th>Categoría</th>
              <th>Cilindrada</th><th>Potencia</th><th>Vel. máx.</th>
              <th>Stock</th><th>Precio</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={10}>
                <div className="empty-state">
                  <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", animation: "pulse 1.5s infinite" }}>
                    Conectando con el microservicio...
                  </div>
                </div>
              </td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={10}>
                <div className="empty-state">
                  <div className="empty-state-icon"><MdDirectionsBike /></div>
                  <h3>Sin resultados</h3>
                  <p>{motos.length === 0 ? "El inventario está vacío. Crea la primera marca y luego la primera moto." : "No se encontraron motos con ese criterio."}</p>
                </div>
              </td></tr>
            ) : (
              filtered.map((m) => (
                <tr key={m.id}>
                  <td>
                    {m.fotoUrl
                      ? <img src={m.fotoUrl} alt={m.modelo} className="vehicle-photo" />
                      : <div className="vehicle-photo-placeholder">🏍️</div>}
                  </td>
                  <td>
                    <div className="vehicle-name">{m.marca?.nombre ?? `Marca #${m.marcaId}`}</div>
                    <div className="vehicle-sub">{m.modelo}</div>
                  </td>
                  <td><span className="badge badge-purple">{m.categoria}</span></td>
                  <td><span className="badge badge-warning">{m.cilindrada} cc</span></td>
                  <td>{Number(m.potenciaHp).toFixed(0)} hp</td>
                  <td>{Number(m.velocidadMaximaKmh).toFixed(0)} km/h</td>
                  <td style={{ fontWeight: 600 }}>{m.stock} uds</td>
                  <td style={{ fontWeight: 600, color: "var(--success)" }}>{formatCurrency(m.precio)}</td>
                  <td><span className={estadoBadge(m.estado)}>{m.estado}</span></td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn-icon" title="Editar" onClick={() => openEdit(m)}><MdEdit /></button>
                      <button className="btn-icon" title="Eliminar" style={{ color: "var(--danger)" }} onClick={() => handleDelete(m)}><MdDelete /></button>
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
          <div className="modal" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editTarget ? "Editar Moto" : "Nueva Moto"}</h2>
              <button className="btn-icon" onClick={closeModal}><MdClose /></button>
            </div>
            {formError && <div className="login-error" style={{ marginBottom: "1rem" }}>{formError}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Marca *</label>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <select name="marcaId" value={form.marcaId} onChange={handleChange} required={!isCreatingMarca} disabled={isCreatingMarca}>
                      <option value={0} disabled>{marcas.length === 0 ? "No hay marcas — créalas primero" : "Selecciona una marca"}</option>
                      {marcas.map((m) => <option key={m.id} value={m.id}>{m.nombre} ({m.pais})</option>)}
                    </select>
                    <button type="button" className="btn btn-secondary btn-sm"
                      onClick={() => { setIsCreatingMarca((p) => !p); setNewMarcaNombre(""); setNewMarcaPais(""); }}
                      style={{ whiteSpace: "nowrap" }}>
                      {isCreatingMarca ? "Usar existente" : "Agregar marca"}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Modelo *</label>
                  <input name="modelo" value={form.modelo} onChange={handleChange} placeholder="Ej: MT-07" required />
                </div>
              </div>

              {isCreatingMarca && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre marca *</label>
                    <input value={newMarcaNombre} onChange={(e) => setNewMarcaNombre(e.target.value)} placeholder="Ej: Yamaha" required={isCreatingMarca} />
                  </div>
                  <div className="form-group">
                    <label>País *</label>
                    <input value={newMarcaPais} onChange={(e) => setNewMarcaPais(e.target.value)} placeholder="Ej: Japón" required={isCreatingMarca} />
                  </div>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Categoría *</label>
                  <select name="categoria" value={form.categoria} onChange={handleChange} required>
                    {CATEGORIAS_MOTORCYCLE.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select name="estado" value={form.estado} onChange={handleChange}>
                    {ESTADOS_MOTORCYCLE.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Cilindrada (cc) *</label>
                  <input name="cilindrada" type="number" min="1" value={form.cilindrada || ""} onChange={handleChange} placeholder="650" required />
                </div>
                <div className="form-group">
                  <label>Potencia (hp) *</label>
                  <input name="potenciaHp" type="number" min="1" step="0.1" value={form.potenciaHp || ""} onChange={handleChange} placeholder="75" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Torque (Nm) *</label>
                  <input name="torqueNm" type="number" min="1" step="0.1" value={form.torqueNm || ""} onChange={handleChange} placeholder="68" required />
                </div>
                <div className="form-group">
                  <label>Vel. máxima (km/h) *</label>
                  <input name="velocidadMaximaKmh" type="number" min="1" step="0.1" value={form.velocidadMaximaKmh || ""} onChange={handleChange} placeholder="180" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Precio (COP) *</label>
                  <input name="precio" type="number" min="1" value={form.precio || ""} onChange={handleChange} placeholder="18000000" required />
                </div>
                <div className="form-group">
                  <label>Stock *</label>
                  <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} placeholder="3" required />
                </div>
              </div>

              <div className="form-group">
                <label>URL de la foto (opcional)</label>
                <input name="fotoUrl" value={form.fotoUrl ?? ""} onChange={handleChange} placeholder="https://ejemplo.com/moto.jpg" />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={submitting}>Cancelar</button>
                <button type="submit" className="btn btn-primary"
                  disabled={submitting || (!editTarget && !isCreatingMarca && marcas.length === 0) || (isCreatingMarca && (!newMarcaNombre.trim() || !newMarcaPais.trim()))}>
                  {submitting ? "Guardando..." : editTarget ? "Guardar cambios" : "Crear Moto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal nueva marca ── */}
      {showBrandModal && (
        <div className="modal-overlay" onClick={() => setShowBrandModal(false)}>
          <div className="modal" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nueva Marca</h2>
              <button className="btn-icon" onClick={() => setShowBrandModal(false)}><MdClose /></button>
            </div>
            {brandError && <div className="login-error" style={{ marginBottom: "1rem" }}>{brandError}</div>}
            <form onSubmit={handleCreateMarca}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input name="nombre" value={brandForm.nombre} onChange={(e) => setBrandForm((p) => ({ ...p, nombre: e.target.value }))} placeholder="Honda" required />
                </div>
                <div className="form-group">
                  <label>País *</label>
                  <input name="pais" value={brandForm.pais} onChange={(e) => setBrandForm((p) => ({ ...p, pais: e.target.value }))} placeholder="Japón" required />
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowBrandModal(false)} disabled={brandSubmitting}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={brandSubmitting}>{brandSubmitting ? "Guardando..." : "Crear Marca"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}