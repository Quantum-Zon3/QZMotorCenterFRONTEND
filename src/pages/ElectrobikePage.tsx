import { useEffect, useState } from "react";
import { MdElectricBike, MdAdd, MdSearch, MdEdit, MdDelete, MdClose, MdRefresh, MdWarning } from "react-icons/md";
import {
  getElectroBikes,
  getMarcas,
  createElectroBike,
  updateElectroBike,
  deleteElectroBike,
  getResumenCatalogo,
  createMarca,
} from "../features/electrobike/electrobike.api";
import type {
  ElectroBike,
  Marca,
  CrearElectroBikeInput,
  ResumenCatalogo,
  EstadoElectroBike,
} from "../features/electrobike/electrobike.type";
import { CATEGORIAS_ELECTROBIKE, ESTADOS_ELECTROBIKE } from "../features/electrobike/electrobike.type";
import { formatCurrency } from "../lib/formatters";
import { createReport200OK, createReportDeleted } from "../features/reports/reports.api";
import { getErrorMessage } from "../lib/http/get-error-message";
import { env } from "../config/env";

const EMPTY_FORM: CrearElectroBikeInput = {
  marcaId: 0,
  modelo: "",
  categoria: "urbana",
  capacidadBateriaWh: 0,
  autonomiaKm: 0,
  velocidadMaximaKmh: 0,
  tiempoCargaHoras: 0,
  precio: 0,
  stock: 0,
  estado: "disponible",
  fotoUrl: null,
};

const estadoBadge = (e: EstadoElectroBike) => {
  if (e === "disponible") return "badge badge-success";
  if (e === "reservada")  return "badge badge-warning";
  return "badge badge-danger";
};

// Detecta si es un error de timeout / red (típico cold start de Render)
const isColdStartError = (e: unknown) => {
  const msg = getErrorMessage(e, "").toLowerCase();
  return (
    msg.includes("timeout") ||
    msg.includes("network") ||
    msg.includes("econnrefused") ||
    msg.includes("enotfound") ||
    (e as { code?: string })?.code === "ECONNABORTED"
  );
};

export default function ElectroBikesPage() {
  const [bikes, setBikes]       = useState<ElectroBike[]>([]);
  const [marcas, setMarcas]     = useState<Marca[]>([]);
  const [resumen, setResumen]   = useState<ResumenCatalogo | null>(null);

  const [loading, setLoading]         = useState(true);
  const [coldStart, setColdStart]     = useState(false);   // aviso Render
  const [search, setSearch]           = useState("");
  const [showModal, setShowModal]     = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [editTarget, setEditTarget]   = useState<ElectroBike | null>(null);
  const [submitting, setSubmitting]   = useState(false);
  const [brandSubmitting, setBrandSubmitting] = useState(false);
  const [pageError, setPageError]     = useState("");
  const [formError, setFormError]     = useState("");
  const [brandError, setBrandError]   = useState("");
  const [form, setForm]               = useState<CrearElectroBikeInput>(EMPTY_FORM);
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
      const [bikesData, marcasData, resumenData] = await Promise.all([
        getElectroBikes(),
        getMarcas(),
        getResumenCatalogo(),
      ]);
      setBikes(bikesData);
      setMarcas(marcasData);
      setResumen(resumenData);
    } catch (e) {
      if (isColdStartError(e)) {
        setColdStart(true);
        setPageError(
          "El microservicio está iniciando (cold start en Render). " +
          "Espera unos segundos y presiona Reintentar."
        );
      } else {
        setPageError(getErrorMessage(e, "No se pudo conectar con el microservicio ElectroBike."));
      }
    } finally {
      setLoading(false);
    }
  };

  const filtered = bikes.filter((b) => {
    const t = search.toLowerCase();
    return (
      b.modelo.toLowerCase().includes(t) ||
      (b.marca?.nombre ?? "").toLowerCase().includes(t) ||
      b.categoria.toLowerCase().includes(t)
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

  const openBrandModal = () => {
    setBrandError("");
    setBrandForm({ nombre: "", pais: "" });
    setShowBrandModal(true);
  };

  const closeBrandModal = () => {
    setShowBrandModal(false);
    setBrandError("");
  };

  const openEdit = (bike: ElectroBike) => {
    setEditTarget(bike);
    setForm({
      marcaId:            bike.marcaId,
      modelo:             bike.modelo,
      categoria:          bike.categoria,
      capacidadBateriaWh: bike.capacidadBateriaWh,
      autonomiaKm:        bike.autonomiaKm,
      velocidadMaximaKmh: bike.velocidadMaximaKmh,
      tiempoCargaHoras:   bike.tiempoCargaHoras,
      precio:             bike.precio,
      stock:              bike.stock,
      estado:             bike.estado,
      fotoUrl:            bike.fotoUrl,
    });
    setFormError("");
    setIsCreatingMarca(false);
    setNewMarcaNombre("");
    setNewMarcaPais("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTarget(null);
    setFormError("");
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBrandForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateMarca = async (e: React.FormEvent) => {
    e.preventDefault();
    setBrandSubmitting(true);
    setBrandError("");

    try {
      const createdMarca = await createMarca({
        nombre: brandForm.nombre.trim(),
        pais: brandForm.pais.trim(),
      });
      setMarcas((prev) => [...prev, createdMarca]);
      closeBrandModal();
      await loadAll();
    } catch (err) {
      setBrandError(getErrorMessage(err, "No se pudo crear la marca."));
    } finally {
      setBrandSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = [
      "marcaId","capacidadBateriaWh","autonomiaKm",
      "velocidadMaximaKmh","tiempoCargaHoras","precio","stock",
    ];
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
        await updateElectroBike(editTarget.id, form);
      } else {
        let bikePayload = form;
        if (isCreatingMarca) {
          const createdMarca = await createMarca({
            nombre: newMarcaNombre.trim(),
            pais: newMarcaPais.trim() || "Desconocido",
          });
          setMarcas((prev) => [...prev, createdMarca]);
          bikePayload = {
            ...form,
            marcaId: createdMarca.id,
          };
          setForm((prev) => ({ ...prev, marcaId: createdMarca.id }));
        }

        const newBike = await createElectroBike(bikePayload);
        
        // Generar un reporte 200 OK en el microservicio de reportes
        try {
          const selectedMarca = marcas.find((m) => m.id === bikePayload.marcaId) ?? { nombre: newMarcaNombre || "ElectroBike" };
          const brandName = selectedMarca.nombre || "ElectroBike";
          const reportPayload = {
            items: [
              {
                productId: String(newBike.id),
                productType: "electrobike",
                productName: `${brandName} ${newBike.modelo}`,
                unitPrice: Number(newBike.precio),
                subtotal: Number(newBike.precio),
              }
            ],
            totalAmount: Number(newBike.precio),
            saleDate: new Date().toISOString()
          };
          console.debug("[reports] sending createReport200OK", reportPayload);

          await createReport200OK(reportPayload);
        } catch (reportErr) {
          console.error("No se pudo generar el reporte 200 OK:", reportErr);
        }
      }
      closeModal();
      await loadAll();
    } catch (e) {
      setFormError(getErrorMessage(e, "Error al guardar. Verifica los datos."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (bike: ElectroBike) => {
    const label = `${bike.marca?.nombre ?? "Marca"} ${bike.modelo}`;
    if (!window.confirm(`¿Eliminar "${label}"?`)) return;
    try {
      await deleteElectroBike(bike.id);

      try {
        const deletePayload = {
          items: [
            {
              productId: String(bike.id),
              productType: "electrobike",
              productName: `${bike.marca?.nombre ?? "ElectroBike"} ${bike.modelo}`,
              unitPrice: Number(bike.precio ?? 0),
              subtotal: 0,
            },
          ],
          totalAmount: 0,
          saleDate: new Date().toISOString(),
        };
        console.debug("[reports] sending createReportDeleted", deletePayload);

        await createReportDeleted(deletePayload);
      } catch (reportErr) {
        console.error("No se pudo generar el reporte de eliminación:", reportErr);
        if ((reportErr as any)?.response) {
          console.error("Reporte de eliminación response data:", (reportErr as any).response.data);
          console.error("Reporte de eliminación response status:", (reportErr as any).response.status);
        }
      }

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
          <h1>Electrobikes</h1>
          <p>
            Inventario de bicicletas eléctricas ·{" "}
            <a
              href={`${env.apiGatewayUrl}/health/electrobikes`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent-light)", fontSize: "0.8rem" }}
            >
              API Gateway /health/electrobikes
            </a>
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={loadAll} title="Recargar datos">
            <MdRefresh />
          </button>
          <button className="btn btn-secondary" onClick={openBrandModal} title="Agregar marca">
            <MdAdd /> Nueva Marca
          </button>
          <button className="btn btn-primary" onClick={openCreate}>
            <MdAdd /> Nueva Electrobike
          </button>
        </div>
      </div>

      {/* ── Banner error / cold start ── */}
      {pageError && (
        <div
          className="login-error"
          style={{
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
          }}
        >
          <MdWarning style={{ flexShrink: 0, fontSize: "1.2rem", marginTop: "0.1rem" }} />
          <div style={{ flex: 1 }}>
            <div>{pageError}</div>
            {coldStart && (
              <button
                className="btn btn-secondary btn-sm"
                style={{ marginTop: "0.6rem" }}
                onClick={loadAll}
              >
                <MdRefresh /> Reintentar
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Stat cards (resumen del endpoint /resumen) ── */}
      {resumen && (
        <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
          <div className="stat-card">
            <div className="stat-icon purple"><MdElectricBike /></div>
            <div className="stat-info">
              <h3>Total</h3>
              <div className="stat-value">{resumen.totalElectroBikes}</div>
              <div className="stat-change">en inventario</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon teal"><MdElectricBike /></div>
            <div className="stat-info">
              <h3>Disponibles</h3>
              <div className="stat-value">{resumen.electroBikesDisponibles}</div>
              <div className="stat-change positive">listas para venta</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange"><MdElectricBike /></div>
            <div className="stat-info">
              <h3>Precio promedio</h3>
              <div className="stat-value" style={{ fontSize: "1.1rem" }}>
                {formatCurrency(resumen.precioPromedio)}
              </div>
              <div className="stat-change">del catálogo</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue"><MdElectricBike /></div>
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
          type="text"
          placeholder="Buscar por marca, modelo o categoría..."
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
              <th>Categoría</th>
              <th>Autonomía</th>
              <th>Vel. máx.</th>
              <th>Batería</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10}>
                  <div className="empty-state">
                    <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", animation: "pulse 1.5s infinite" }}>
                      Conectando con el microservicio...
                    </div>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={10}>
                  <div className="empty-state">
                    <div className="empty-state-icon"><MdElectricBike /></div>
                    <h3>Sin resultados</h3>
                    <p>
                      {bikes.length === 0
                        ? "El inventario está vacío. Crea la primera marca y luego la primera electrobike."
                        : "No se encontraron electrobikes con ese criterio."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr key={b.id}>
                  <td>
                    {b.fotoUrl ? (
                      <img src={b.fotoUrl} alt={b.modelo} className="vehicle-photo" />
                    ) : (
                      <div className="vehicle-photo-placeholder">⚡</div>
                    )}
                  </td>
                  <td>
                    <div className="vehicle-name">{b.marca?.nombre ?? `Marca #${b.marcaId}`}</div>
                    <div className="vehicle-sub">{b.modelo}</div>
                  </td>
                  <td><span className="badge badge-purple">{b.categoria}</span></td>
                  <td><span className="badge badge-success">{Number(b.autonomiaKm).toFixed(0)} km</span></td>
                  <td>{Number(b.velocidadMaximaKmh).toFixed(0)} km/h</td>
                  <td>{b.capacidadBateriaWh} Wh</td>
                  <td style={{ fontWeight: 600 }}>{b.stock} uds</td>
                  <td style={{ fontWeight: 600, color: "var(--success)" }}>
                    {formatCurrency(b.precio)}
                  </td>
                  <td><span className={estadoBadge(b.estado)}>{b.estado}</span></td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn-icon" title="Editar" onClick={() => openEdit(b)}>
                        <MdEdit />
                      </button>
                      <button
                        className="btn-icon"
                        title="Eliminar"
                        style={{ color: "var(--danger)" }}
                        onClick={() => handleDelete(b)}
                      >
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
          <div className="modal" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editTarget ? "Editar Electrobike" : "Nueva Electrobike"}</h2>
              <button className="btn-icon" onClick={closeModal} title="Cerrar" aria-label="Cerrar modal"><MdClose /></button>
            </div>

            {formError && (
              <div className="login-error" style={{ marginBottom: "1rem" }}>{formError}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="marcaId">Marca *</label>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <select id="marcaId" name="marcaId" value={form.marcaId} onChange={handleChange} required={!isCreatingMarca} disabled={isCreatingMarca}>
                      <option value={0} disabled>
                        {marcas.length === 0 ? "No hay marcas — créalas primero" : "Selecciona una marca"}
                      </option>
                      {marcas.map((m) => (
                        <option key={m.id} value={m.id}>{m.nombre} ({m.pais})</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setIsCreatingMarca((prev) => !prev);
                        setNewMarcaNombre("");
                        setNewMarcaPais("");
                      }}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {isCreatingMarca ? "Usar existente" : "Agregar marca"}
                    </button>
                  </div>
                  {marcas.length === 0 && !isCreatingMarca && (
                    <small style={{ display: "block", marginTop: "0.5rem", color: "var(--muted)" }}>
                      No hay marcas registradas. Puedes crear una marca desde aquí o usar el botón "Nueva Marca".
                    </small>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="modelo">Modelo *</label>
                  <input id="modelo" name="modelo" value={form.modelo} onChange={handleChange} placeholder="Ej: Powerfly 5" required />
                </div>
              </div>

              {isCreatingMarca && (
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="newMarcaNombre">Nombre marca *</label>
                    <input
                      id="newMarcaNombre"
                      name="newMarcaNombre"
                      value={newMarcaNombre}
                      onChange={(e) => setNewMarcaNombre(e.target.value)}
                      placeholder="Ej: Thunder Bikes"
                      required={isCreatingMarca}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newMarcaPais">País *</label>
                    <input
                      id="newMarcaPais"
                      name="newMarcaPais"
                      value={newMarcaPais}
                      onChange={(e) => setNewMarcaPais(e.target.value)}
                      placeholder="Ej: Colombia"
                      required={isCreatingMarca}
                    />
                  </div>
                </div>
              )}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="categoria">Categoría *</label>
                  <select id="categoria" name="categoria" value={form.categoria} onChange={handleChange} required>
                    {CATEGORIAS_ELECTROBIKE.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="estado">Estado</label>
                  <select id="estado" name="estado" value={form.estado} onChange={handleChange}>
                    {ESTADOS_ELECTROBIKE.map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="autonomiaKm">Autonomía (km) *</label>
                  <input id="autonomiaKm" name="autonomiaKm" type="number" min="1" step="0.1" value={form.autonomiaKm || ""} onChange={handleChange} placeholder="120" required />
                </div>
                <div className="form-group">
                  <label htmlFor="velocidadMaximaKmh">Velocidad máxima (km/h) *</label>
                  <input id="velocidadMaximaKmh" name="velocidadMaximaKmh" type="number" min="1" step="0.1" value={form.velocidadMaximaKmh || ""} onChange={handleChange} placeholder="45" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="capacidadBateriaWh">Capacidad batería (Wh) *</label>
                  <input id="capacidadBateriaWh" name="capacidadBateriaWh" type="number" min="1" value={form.capacidadBateriaWh || ""} onChange={handleChange} placeholder="500" required />
                </div>
                <div className="form-group">
                  <label htmlFor="tiempoCargaHoras">Tiempo de carga (horas) *</label>
                  <input id="tiempoCargaHoras" name="tiempoCargaHoras" type="number" min="0.1" step="0.1" value={form.tiempoCargaHoras || ""} onChange={handleChange} placeholder="4" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="precio">Precio (COP) *</label>
                  <input id="precio" name="precio" type="number" min="1" value={form.precio || ""} onChange={handleChange} placeholder="8500000" required />
                </div>
                <div className="form-group">
                  <label htmlFor="stock">Stock *</label>
                  <input id="stock" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} placeholder="5" required />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="fotoUrl">URL de la foto (opcional)</label>
                <input id="fotoUrl" name="fotoUrl" value={form.fotoUrl ?? ""} onChange={handleChange} placeholder="https://ejemplo.com/foto.jpg" />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={submitting}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    submitting ||
                    (!editTarget && !isCreatingMarca && marcas.length === 0) ||
                    (isCreatingMarca && (!newMarcaNombre.trim() || !newMarcaPais.trim()))
                  }
                >
                  {submitting ? "Guardando..." : editTarget ? "Guardar cambios" : "Crear Electrobike"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBrandModal && (
        <div className="modal-overlay" onClick={closeBrandModal}>
          <div className="modal" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nueva Marca</h2>
              <button className="btn-icon" onClick={closeBrandModal} title="Cerrar" aria-label="Cerrar modal"><MdClose /></button>
            </div>
            {brandError && (
              <div className="login-error" style={{ marginBottom: "1rem" }}>{brandError}</div>
            )}
            <form onSubmit={handleCreateMarca}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="brandNombre">Nombre de la marca *</label>
                  <input
                    id="brandNombre"
                    name="nombre"
                    value={brandForm.nombre}
                    onChange={handleBrandChange}
                    placeholder="Ej: Thunder Bikes"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="brandPais">País *</label>
                  <input
                    id="brandPais"
                    name="pais"
                    value={brandForm.pais}
                    onChange={handleBrandChange}
                    placeholder="Ej: Colombia"
                    required
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
                <button type="button" className="btn btn-secondary" onClick={closeBrandModal} disabled={brandSubmitting}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={brandSubmitting}>
                  {brandSubmitting ? "Guardando..." : "Crear Marca"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
