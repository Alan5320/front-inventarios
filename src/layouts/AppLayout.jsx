import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

export default function AppLayout() {
  const { role, email, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const doLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand fw-semibold">ServiEventos Inventory</span>
          <button
            className="navbar-toggler"
            type="button"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="menu">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/" className="nav-link" onClick={closeMenu}>Dashboard</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/profile" className="nav-link" onClick={closeMenu}>Mi perfil</NavLink>
              </li>
              {role === 'ADMINISTRADOR' && (
                <li className="nav-item">
                  <NavLink to="/users" className="nav-link" onClick={closeMenu}>Usuarios</NavLink>
                </li>
              )}
            </ul>
            <div className="text-white-50 small me-3 d-none d-md-block">{email} · {role}</div>
            <button className="btn btn-outline-light btn-sm" onClick={doLogout}>Salir</button>
          </div>
        </div>
      </nav>
      <main className="container py-4">
        <Outlet />
      </main>
    </div>
  );
}
