import { useState } from "react";
import { MdAdd, MdSearch, MdEdit, MdDelete, MdClose } from "react-icons/md";

interface ElectroBike {
    id: number;
    brand: string;
    model: string;
    autonomia: number;
    voltaje: number;
    stock: number;
    precio: number;
}

const mockData: ElectroBike[] = [
    { id: 1, brand: "Trek", model: "Powerfly 5", autonomia: 120, voltaje: 48, stock: 5, precio: 8500000 },
    { id: 2, brand: "Giant", model: "Explore E+ 1", autonomia: 100, voltaje: 36, stock: 3, precio: 7200000 },
    { id: 3, brand: "Specialized", model: "Turbo Vado 4.0", autonomia: 145, voltaje: 48, stock: 8, precio: 12000000 },
];

export default function ElectroBikesPage() {
    const [data] = useState<ElectroBike[]>(mockData);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ brand: "", model: "", autonomia: "", voltaje: "", stock: "", precio: "" });

    const filtered = data.filter((e) => {
        const t = search.toLowerCase();
        return e.brand.toLowerCase().includes(t) || e.model.toLowerCase().includes(t);
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const fmtPrice = (p: number) =>
        new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(p);

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>Electrobikes</h1>
                    <p>Inventario de bicicletas eléctricas — microservicio ElectroBike · Node + Sequelize</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <MdAdd /> Nueva Electrobike
                </button>
            </div>

            <div className="search-bar">
                <span className="search-bar-icon"><MdSearch /></span>
                <input type="text" placeholder="Buscar por marca o modelo..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Foto</th><th>Marca / Modelo</th><th>Autonomía</th><th>Voltaje</th><th>Stock</th><th>Precio</th><th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((e) => (
                            <tr key={e.id}>
                                <td><div className="vehicle-photo-placeholder">⚡</div></td>
                                <td>
                                    <div className="vehicle-name">{e.brand}</div>
                                    <div className="vehicle-sub">{e.model}</div>
                                </td>
                                <td><span className="badge badge-success">{e.autonomia} km</span></td>
                                <td><span className="badge badge-info">{e.voltaje}V</span></td>
                                <td style={{ fontWeight: 600 }}>{e.stock} uds</td>
                                <td style={{ fontWeight: 600, color: "var(--success)" }}>{fmtPrice(e.precio)}</td>
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
                            <h2>Nueva Electrobike</h2>
                            <button className="btn-icon" onClick={() => setShowModal(false)}><MdClose /></button>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label>Marca</label><input name="brand" value={form.brand} onChange={handleChange} placeholder="Trek" /></div>
                            <div className="form-group"><label>Modelo</label><input name="model" value={form.model} onChange={handleChange} placeholder="Powerfly 5" /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label>Autonomía (km)</label><input name="autonomia" value={form.autonomia} onChange={handleChange} type="number" /></div>
                            <div className="form-group"><label>Voltaje (V)</label><input name="voltaje" value={form.voltaje} onChange={handleChange} type="number" /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label>Stock</label><input name="stock" value={form.stock} onChange={handleChange} type="number" /></div>
                            <div className="form-group"><label>Precio (COP)</label><input name="precio" value={form.precio} onChange={handleChange} type="number" /></div>
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