import { useState } from "react";
import { MdDirectionsBike, MdAdd, MdSearch, MdEdit, MdDelete, MdClose } from "react-icons/md";

interface Moto {
    id: number;
    brand: string;
    model: string;
    plate: string;
    year: number;
    color: string;
    cilindraje: number;
}

const mockMotos: Moto[] = [
    { id: 1, brand: "Honda", model: "CB500F", plate: "MTO111", year: 2022, color: "Rojo", cilindraje: 500 },
    { id: 2, brand: "Yamaha", model: "MT-07", plate: "MTO222", year: 2023, color: "Negro", cilindraje: 700 },
    { id: 3, brand: "KTM", model: "Duke 390", plate: "MTO333", year: 2021, color: "Naranja", cilindraje: 390 },
];

export default function MotorcyclesPage() {
    const [motos] = useState<Moto[]>(mockMotos);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ brand: "", model: "", plate: "", year: "", color: "", cilindraje: "" });

    const filtered = motos.filter((m) => {
        const t = search.toLowerCase();
        return m.brand.toLowerCase().includes(t) || m.model.toLowerCase().includes(t) || m.plate.toLowerCase().includes(t);
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>Motos</h1>
                    <p>Inventario de motocicletas — microservicio Motorcycles · Flask + SQLAlchemy + MySQL</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <MdAdd /> Nueva Moto
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
                            <th>Cilindraje</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={7}>
                                    <div className="empty-state">
                                        <div className="empty-state-icon"><MdDirectionsBike /></div>
                                        <h3>Sin resultados</h3>
                                        <p>No se encontraron motos con ese criterio.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filtered.map((m) => (
                                <tr key={m.id}>
                                    <td><div className="vehicle-photo-placeholder">🏍️</div></td>
                                    <td>
                                        <div className="vehicle-name">{m.brand}</div>
                                        <div className="vehicle-sub">{m.model}</div>
                                    </td>
                                    <td><span className="badge badge-info">{m.plate}</span></td>
                                    <td>{m.year}</td>
                                    <td>{m.color}</td>
                                    <td><span className="badge badge-warning">{m.cilindraje} cc</span></td>
                                    <td>
                                        <div className="actions-cell">
                                            <button className="btn-icon"><MdEdit /></button>
                                            <button className="btn-icon" style={{ color: "var(--danger)" }}><MdDelete /></button>
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
                            <h2>Nueva Moto</h2>
                            <button className="btn-icon" onClick={() => setShowModal(false)}><MdClose /></button>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label>Marca</label><input name="brand" value={form.brand} onChange={handleChange} placeholder="Honda" /></div>
                            <div className="form-group"><label>Modelo</label><input name="model" value={form.model} onChange={handleChange} placeholder="CB500F" /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label>Placa</label><input name="plate" value={form.plate} onChange={handleChange} placeholder="MTO111" /></div>
                            <div className="form-group"><label>Año</label><input name="year" value={form.year} onChange={handleChange} type="number" /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label>Color</label><input name="color" value={form.color} onChange={handleChange} placeholder="Rojo" /></div>
                            <div className="form-group"><label>Cilindraje (cc)</label><input name="cilindraje" value={form.cilindraje} onChange={handleChange} type="number" /></div>
                        </div>
                        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                            <button className="btn btn-primary">Registrar Moto</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}