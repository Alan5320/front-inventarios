import { useEffect, useState } from 'react';
import { usersApi } from '../api/usersApi';
import { useAuth } from '../auth/AuthContext';
import Loader from '../components/Loader';

export default function ProfilePage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    usersApi
      .me(token)
      .then(setProfile)
      .catch((err) => setError(err.message));
  }, [token]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!profile) return <Loader text="Cargando perfil..." />;

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h2 className="h5 mb-3">Mi perfil</h2>
        <div className="row g-3">
          <div className="col-md-6"><strong>Nombre:</strong> {profile.name}</div>
          <div className="col-md-6"><strong>Email:</strong> {profile.email}</div>
          <div className="col-md-6"><strong>Rol:</strong> {profile.role}</div>
          <div className="col-md-6"><strong>Estado:</strong> {profile.enabled ? 'Activo' : 'Inactivo'}</div>
        </div>
      </div>
    </div>
  );
}
