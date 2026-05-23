import { useState } from "react";
import { MdAdd, MdSearch, MdEdit, MdDelete, MdClose } from "react-icons/md";

interface Scooter {
    id: number;
    brand: string;
    model: string;
    autonomia: number;
    voltaje: number;
    precio: number;
    estado: string;
}

const mockData: Scooter[] = [
    { id: 1, brand: "Xiaomi", model: "Pro 2", autonomia: 45, voltaje: 36, precio: 2800000, estado: "disponible" },
    { id: 2, brand: "Segway", model: "Ninebot F30", autonomia: 30, voltaje: 36, precio: 2100000, estado: "disponible" },
    { id: 3, brand: "Kaabo", model: "Wolf King", autonomia: 100, voltaje: 60, precio: 9500000, estado: "agotado" },
];

export default function ScootersPage() {
    const [data] = useState<Scooter[]>(mockData);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ brand: "", model: "", autonomia: "", voltaje: "", precio: "", estado: "disponible" });

    const filtered = data.filter((s) => {
        const t = search.toLowerCase();
        return s.brand.toLowerCase().includes(t) || s.model.toLowerCase().includes(t);
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const fmtPrice = (p: number) =>
        new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(p);

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>Scooters</h1>
                    <p>Inventario de scooters eléctricas — microservicio Scooter · Node + Express + MySQL</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <MdAdd /> Nueva Scooter
                </button>
            </div>

            <div className="search-bar">
                <span className="search-bar-icon"><MdSearch /></span>
                <input type="text" placeholder="Buscar por marca o modelo..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr><th>Foto</th><th>Marca / Modelo</th><th>Autonomía</th><th>Voltaje</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                        {filtered.map((s) => (
                            <tr key={s.id}>
                                <td><div className="vehicle-photo-placeholder">🛴</div></td>
                                <td>
                                    <div className="vehicle-name">{s.brand}</div>
                                    <div className="vehicle-sub">{s.model}</div>
                                </td>
                                <td><span className="badge badge-success">{s.autonomia} km</span></td>
                                <td><span className="badge badge-info">{s.voltaje}V</span></td>
                                <td style={{ fontWeight: 600, color: "var(--success)" }}>{fmtPrice(s.precio)}</td>
                                <td><span className={`badge ${s.estado === "disponible" ? "badge-success" : "badge-danger"}`}>{s.estado}</span></td>
                                <td>
                                    <div className="actions-cell">
                                        <button className="btn-icon"><MdEdit /></button>
                                        <button className="btn-icon" style={{ color: "var(--danger)" }}><MdDelete /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Nueva Scooter</h2>
                            <button className="btn-icon" onClick={() => setShowModal(false)}><MdClose /></button>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label>Marca</label><input name="brand" value={form.brand} onChange={handleChange} placeholder="Xiaomi" /></div>
                            <div className="form-group"><label>Modelo</label><input name="model" value={form.model} onChange={handleChange} placeholder="Pro 2" /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label>Autonomía (km)</label><input name="autonomia" value={form.autonomia} onChange={handleChange} type="number" /></div>
                            <div className="form-group"><label>Voltaje (V)</label><input name="voltaje" value={form.voltaje} onChange={handleChange} type="number" /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label>Precio (COP)</label><input name="precio" value={form.precio} onChange={handleChange} type="number" /></div>
                            <div className="form-group">
                                <label>Estado</label>
                                <select name="estado" value={form.estado} onChange={handleChange}>
                                    <option value="disponible">Disponible</option>
                                    <option value="agotado">Agotado</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                            <button className="btn btn-primary">Registrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}