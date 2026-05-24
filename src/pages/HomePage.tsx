import { Link } from "react-router-dom";
import { MdArrowForward, MdPersonAdd, MdVerified } from "react-icons/md";

export default function HomePage() {
  return (
    <section className="hero">
      <div className="hero-badge">
        <MdVerified /> API Gateway conectado
      </div>
      <h1>QZ Motor Center</h1>
      <p>
        Accede al panel administrativo para gestionar usuarios, electrobikes,
        motos y reportes desde una sola entrada conectada al gateway.
      </p>
      <div className="hero-actions">
        <Link to="/login" className="btn btn-primary">
          Ingresar al panel <MdArrowForward />
        </Link>
        <Link to="/registro" className="btn btn-secondary">
          Crear usuario <MdPersonAdd />
        </Link>
      </div>
    </section>
  );
}
