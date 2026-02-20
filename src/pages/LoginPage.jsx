import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Loader from '../components/Loader';

export default function LoginPage() {
  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'No fue posible iniciar sesión');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-login">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card shadow border-0">
              <div className="card-body p-4">
                <h3 className="mb-3">Iniciar sesión</h3>
                <p className="text-secondary small mb-4">Ingresa tus credenciales.</p>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit} className="d-grid gap-3">
                  <input className="form-control" placeholder="Email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required />
                  <input type="password" className="form-control" placeholder="Contraseña" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} required />
                  <button className="btn btn-primary" disabled={loading}>
                    {loading ? <Loader text="Validando..." /> : 'Entrar'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
