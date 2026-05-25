import { useEffect, useMemo, useState } from "react";
import {
  MdAdd,
  MdClose,
  MdDelete,
  MdDirectionsCar,
  MdEdit,
  MdRefresh,
  MdSearch,
  MdWarning,
} from "react-icons/md";
import { env } from "../config/env";
import { useAuth } from "../features/auth/useAuth";
import { createCar, deleteCar, getCars, updateCar } from "../features/cars/car.api";
import type { Car, CarFormInput } from "../features/cars/car.type";
import { createReport200OK, createReportDeleted } from "../features/reports/reports.api";
import { formatCurrency } from "../lib/formatters";
import { getErrorMessage } from "../lib/http/get-error-message";

const emptyForm = (employeeId = 0): CarFormInput => ({
  brand: "",
  model: "",
  plate: "",
  year: new Date().getFullYear(),
  color: "",
  price: 0,
  employeeId,
  photo: null,
});

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

const getPhotoSrc = (photoUrl?: string | null) => {
  if (!photoUrl || !/^https?:\/\//i.test(photoUrl)) {
    return null;
  }

  return photoUrl;
};

export default function CarsPage() {
  const { session } = useAuth();
  const currentEmployeeId = Number(session?.user?.cedula ?? 0);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [coldStart, setColdStart] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Car | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState<CarFormInput>(emptyForm(currentEmployeeId));

  const loadAll = async () => {
    setLoading(true);
    setPageError("");
    setColdStart(false);

    try {
      const data = await getCars();
      setCars(data);
    } catch (e) {
      if (isColdStartError(e)) {
        setColdStart(true);
        setPageError("El microservicio Cars esta iniciando. Espera unos segundos y presiona Reintentar.");
      } else {
        setPageError(getErrorMessage(e, "No se pudo conectar con el microservicio Cars."));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
  }, []);

  useEffect(() => {
    if (!showModal && !editTarget) {
      setForm(emptyForm(currentEmployeeId));
    }
  }, [currentEmployeeId, editTarget, showModal]);

  const filtered = cars.filter((car) => {
    const term = search.toLowerCase();
    return (
      car.brand.toLowerCase().includes(term) ||
      car.model.toLowerCase().includes(term) ||
      car.plate.toLowerCase().includes(term)
    );
  });

  const precioPromedio = useMemo(
    () => cars.length > 0
      ? cars.reduce((acc, car) => acc + Number(car.price), 0) / cars.length
      : 0,
    [cars],
  );
  const marcasUnicas = useMemo(() => new Set(cars.map((car) => car.brand)).size, [cars]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm(currentEmployeeId));
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (car: Car) => {
    setEditTarget(car);
    setForm({
      brand: car.brand,
      model: car.model,
      plate: car.plate,
      year: Number(car.year),
      color: car.color,
      price: Number(car.price),
      employeeId: Number(car.employeeId),
      photo: null,
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
    const { name, value, files } = e.target;
    const numericFields = ["year", "price", "employeeId"];

    setForm((prev) => ({
      ...prev,
      [name]: name === "photo"
        ? files?.[0] ?? null
        : numericFields.includes(name)
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      if (editTarget) {
        await updateCar(editTarget.id, form);
      } else {
        const created = await createCar(form);
        try {
          await createReport200OK({
            items: [{
              productId: String(created.id),
              productType: "car",
              productName: `${created.brand} ${created.model}`.trim(),
              unitPrice: Number(created.price ?? 0),
              subtotal: Number(created.price ?? 0),
            }],
            totalAmount: Number(created.price ?? 0),
          });
        } catch (reportErr) {
          console.error("No se pudo generar reporte de creacion auto:", reportErr);
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

  const handleDelete = async (car: Car) => {
    if (!window.confirm(`Eliminar el auto con placa "${car.plate}"?`)) return;

    try {
      await deleteCar(car.id);
      try {
        await createReportDeleted({
          items: [{
            productId: String(car.id),
            productType: "car",
            productName: `${car.brand} ${car.model}`.trim(),
            unitPrice: Number(car.price ?? 0),
            subtotal: 0,
          }],
          totalAmount: 0,
        });
      } catch (reportErr) {
        console.error("No se pudo generar reporte de eliminacion auto:", reportErr);
      }
      await loadAll();
    } catch (e) {
      alert(getErrorMessage(e, "No se pudo eliminar el auto."));
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Autos</h1>
          <p>
            Inventario de automoviles ·{" "}
            <a
              href={`${env.apiGatewayUrl}/api/cars`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent-light)", fontSize: "0.8rem" }}
            >
              API Gateway /api/cars
            </a>
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={loadAll} title="Recargar">
            <MdRefresh />
          </button>
          <button className="btn btn-primary" onClick={openCreate}>
            <MdAdd /> Nuevo Auto
          </button>
        </div>
      </div>

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

      {!loading && !pageError && (
        <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
          <div className="stat-card">
            <div className="stat-icon blue"><MdDirectionsCar /></div>
            <div className="stat-info">
              <h3>Total</h3>
              <div className="stat-value">{cars.length}</div>
              <div className="stat-change">en inventario</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><MdDirectionsCar /></div>
            <div className="stat-info">
              <h3>Precio promedio</h3>
              <div className="stat-value" style={{ fontSize: "1.1rem" }}>
                {formatCurrency(precioPromedio)}
              </div>
              <div className="stat-change">del catalogo</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange"><MdDirectionsCar /></div>
            <div className="stat-info">
              <h3>Marcas</h3>
              <div className="stat-value">{marcasUnicas}</div>
              <div className="stat-change">diferentes</div>
            </div>
          </div>
        </div>
      )}

      <div className="search-bar">
        <span className="search-bar-icon"><MdSearch /></span>
        <input
          type="text"
          placeholder="Buscar por marca, modelo o placa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Marca / Modelo</th>
              <th>Placa</th>
              <th>Anio</th>
              <th>Color</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7}>
                  <div className="empty-state">
                    <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", animation: "pulse 1.5s infinite" }}>
                      Conectando con el microservicio...
                    </div>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="empty-state">
                    <div className="empty-state-icon"><MdDirectionsCar /></div>
                    <h3>Sin resultados</h3>
                    <p>{cars.length === 0 ? "El inventario esta vacio. Registra el primer auto." : "No se encontraron autos con ese criterio."}</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((car) => (
                <tr key={car.id}>
                  <td>
                    {getPhotoSrc(car.photoUrl)
                      ? <img src={getPhotoSrc(car.photoUrl) ?? ""} alt={car.model} className="vehicle-photo" />
                      : <div className="vehicle-photo-placeholder"><MdDirectionsCar /></div>}
                  </td>
                  <td>
                    <div className="vehicle-name">{car.brand}</div>
                    <div className="vehicle-sub">{car.model}</div>
                  </td>
                  <td><span className="badge badge-info">{car.plate}</span></td>
                  <td>{car.year}</td>
                  <td>{car.color}</td>
                  <td style={{ fontWeight: 600, color: "var(--success)" }}>{formatCurrency(car.price)}</td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn-icon" title="Editar" onClick={() => openEdit(car)}><MdEdit /></button>
                      <button className="btn-icon" title="Eliminar" style={{ color: "var(--danger)" }} onClick={() => handleDelete(car)}>
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

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editTarget ? "Editar Auto" : "Nuevo Auto"}</h2>
              <button className="btn-icon" onClick={closeModal}><MdClose /></button>
            </div>

            {formError && (
              <div className="login-error" style={{ marginBottom: "1rem" }}>{formError}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Marca</label>
                  <input name="brand" value={form.brand} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Modelo</label>
                  <input name="model" value={form.model} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Placa</label>
                  <input name="plate" value={form.plate} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Anio</label>
                  <input name="year" value={form.year} onChange={handleChange} type="number" min={1900} max={new Date().getFullYear() + 1} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Color</label>
                  <input name="color" value={form.color} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Precio (COP)</label>
                  <input name="price" value={form.price} onChange={handleChange} type="number" min={0} step={0.01} required />
                </div>
              </div>
              <div className="form-group">
                <label>ID empleado responsable</label>
                <input name="employeeId" value={form.employeeId} onChange={handleChange} type="number" min={1} required />
              </div>
              <div className="form-group">
                <label>Foto del vehiculo</label>
                <input name="photo" type="file" accept="image/*" onChange={handleChange} style={{ cursor: "pointer" }} />
              </div>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={submitting}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Guardando..." : editTarget ? "Guardar cambios" : "Registrar Auto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
