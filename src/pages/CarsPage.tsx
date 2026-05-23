import { useState } from "react";
import { MdDirectionsCar, MdAdd, MdSearch, MdEdit, MdDelete, MdClose } from "react-icons/md";

interface Car {
    id: number;
    brand: string;
    model: string;
    plate: string;
    year: number;
    color: string;
    price: number;
}

const mockCars: Car[] = [
    { id: 1, brand: "Toyota", model: "Corolla", plate: "ABC123", year: 2022, color: "Blanco", price: 75000000 },
    { id: 2, brand: "Mazda", model: "CX-5", plate: "XYZ456", year: 2023, color: "Rojo", price: 95000000 },
    { id: 3, brand: "Chevrolet", model: "Onix", plate: "DEF789", year: 2021, color: "Negro", price: 52000000 },
];

const emptyForm = { brand: "", model: "", plate: "", year: "", color: "", price: "" };

export default function CarsPage() {
    const [cars] = useState<Car[]>(mockCars);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(emptyForm);

    const filtered = cars.filter((c) => {
        const t = search.toLowerCase();
        return c.brand.toLowerCase().includes(t) || c.model.toLowerCase().includes(t) || c.plate.toLowerCase().includes(t);
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const fmtPrice = (p: number) =>
        new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(p);

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>Autos</h1>
                    <p>Inventario de automóviles — microservicio Cars · Node + Express + PostgreSQL</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <MdAdd /> Nuevo Auto
                </button>
            </div>

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
                            <th>Año</th>
                            <th>Color</th>
                            <th>Precio</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={7}>
                                    <div className="empty-state">
                                        <div className="empty-state-icon"><MdDirectionsCar /></div>
                                        <h3>Sin resultados</h3>
                                        <p>No se encontraron autos con ese criterio.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filtered.map((c) => (
                                <tr key={c.id}>
                                    <td>
                                        <div className="vehicle-photo-placeholder">🚗</div>
                                    </td>
                                    <td>
                                        <div className="vehicle-name">{c.brand}</div>
                                        <div className="vehicle-sub">{c.model}</div>
                                    </td>
                                    <td><span className="badge badge-info">{c.plate}</span></td>
                                    <td>{c.year}</td>
                                    <td>{c.color}</td>
                                    <td style={{ fontWeight: 600, color: "var(--success)" }}>{fmtPrice(c.price)}</td>
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

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Nuevo Auto</h2>
                            <button className="btn-icon" onClick={() => setShowModal(false)}><MdClose /></button>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Marca</label>
                                <input name="brand" value={form.brand} onChange={handleChange} placeholder="Toyota" />
                            </div>
                            <div className="form-group">
                                <label>Modelo</label>
                                <input name="model" value={form.model} onChange={handleChange} placeholder="Corolla" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Placa</label>
                                <input name="plate" value={form.plate} onChange={handleChange} placeholder="ABC123" />
                            </div>
                            <div className="form-group">
                                <label>Año</label>
                                <input name="year" value={form.year} onChange={handleChange} placeholder="2023" type="number" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Color</label>
                                <input name="color" value={form.color} onChange={handleChange} placeholder="Blanco" />
                            </div>
                            <div className="form-group">
                                <label>Precio (COP)</label>
                                <input name="price" value={form.price} onChange={handleChange} placeholder="75000000" type="number" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Foto del vehículo</label>
                            <input type="file" accept="image/*" style={{ cursor: "pointer" }} />
                        </div>
                        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                            <button className="btn btn-primary">Registrar Auto</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}