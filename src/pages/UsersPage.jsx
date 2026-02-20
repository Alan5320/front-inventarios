import { useEffect, useMemo, useState } from 'react';
import { Modal } from 'bootstrap';
import { usersApi } from '../api/usersApi';
import { useAuth } from '../auth/AuthContext';
import Loader from '../components/Loader';
import ToastMessage from '../components/ToastMessage';
import UserFormModal from '../components/UserFormModal';
import ConfirmModal from '../components/ConfirmModal';
import PasswordModal from '../components/PasswordModal';

export default function UsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast, setToast] = useState({ type: 'success', message: '' });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await usersApi.list(token);
      setUsers(data);
    } catch (error) {
      setToast({ type: 'danger', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = [user.name, user.email].join(' ').toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'ALL' || String(user.enabled) === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const openModal = (id, user = null) => {
    setSelectedUser(user);
    Modal.getOrCreateInstance(document.getElementById(id)).show();
  };

  const handleCreate = async (payload) => {
    try {
      await usersApi.create(payload, token);
      setToast({ type: 'success', message: 'Usuario creado correctamente' });
      await loadUsers();
    } catch (error) {
      setToast({ type: 'danger', message: error.message });
    }
  };

  const handleUpdate = async (payload) => {
    try {
      await usersApi.update(selectedUser.id, payload, token);
      setToast({ type: 'success', message: 'Usuario actualizado correctamente' });
      await loadUsers();
    } catch (error) {
      setToast({ type: 'danger', message: error.message });
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await usersApi.remove(selectedUser.id, token);
      setToast({ type: 'success', message: 'Usuario eliminado correctamente' });
      await loadUsers();
    } catch (error) {
      setToast({ type: 'danger', message: error.message });
    }
  };

  const handlePasswordUpdate = async (newPassword) => {
    if (!selectedUser) return;
    try {
      await usersApi.updatePassword(selectedUser.id, newPassword, token);
      setToast({ type: 'success', message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      setToast({ type: 'danger', message: error.message });
    }
  };

  return (
    <>
      <div className="d-flex flex-column flex-md-row gap-2 justify-content-between align-items-md-center mb-3">
        <h2 className="h4 m-0">Gestión de usuarios</h2>
        <button className="btn btn-primary" onClick={() => openModal('userCreateModal')}>
          <i className="bi bi-plus-circle me-2" />Nuevo usuario
        </button>
      </div>

      <ToastMessage type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, message: '' })} />

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-4">
              <input className="form-control" placeholder="Buscar por nombre o email" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="col-md-4">
              <select className="form-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="ALL">Todos los roles</option>
                <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                <option value="EMPLEADO">EMPLEADO</option>
                <option value="OPERADOR">OPERADOR</option>
              </select>
            </div>
            <div className="col-md-4">
              <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="ALL">Todos los estados</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {loading ? (
            <Loader text="Cargando usuarios..." />
          ) : (
            <>
              <div className="table-responsive d-none d-md-block">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Estado</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-secondary py-4">No hay usuarios para mostrar.</td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td><span className="badge text-bg-info-subtle text-black">{user.role}</span></td>
                          <td>
                            <span className={`badge ${user.enabled ? 'text-bg-success' : 'text-bg-secondary'}`}>
                              {user.enabled ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="btn-group flex gap-1">
                              <button className="btn btn-outline-primary btn-sm" onClick={() => openModal('userEditModal', user)}>Editar</button>
                              <button className="btn btn-outline-warning btn-sm" onClick={() => openModal('passwordModal', user)}>Contraseña</button>
                              <button className="btn btn-outline-danger btn-sm" onClick={() => openModal('deleteModal', user)}>Eliminar</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="d-md-none">
                {filteredUsers.length === 0 ? (
                  <div className="text-center text-secondary py-4">No hay usuarios para mostrar.</div>
                ) : (
                  <div className="row g-3">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="col-12">
                        <div className="user-mobile-card border rounded-3 p-3">
                          <div className="d-flex justify-content-between mb-2">
                            <strong>{user.name}</strong>
                            <span className="text-secondary">#{user.id}</span>
                          </div>
                          <div className="small text-secondary mb-2">{user.email}</div>
                          <div className="d-flex gap-2 mb-3 flex-wrap">
                            <span className="badge text-bg-info-subtle text-black">{user.role}</span>
                            <span className={`badge ${user.enabled ? 'text-bg-success' : 'text-bg-secondary'}`}>
                              {user.enabled ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                          <div className="d-grid gap-2">
                            <button className="btn btn-outline-primary btn-sm" onClick={() => openModal('userEditModal', user)}>Editar</button>
                            <button className="btn btn-outline-warning btn-sm" onClick={() => openModal('passwordModal', user)}>Contraseña</button>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => openModal('deleteModal', user)}>Eliminar</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <UserFormModal id="userCreateModal" mode="create" onSubmit={handleCreate} />
      <UserFormModal id="userEditModal" mode="edit" user={selectedUser} onSubmit={handleUpdate} />
      <PasswordModal id="passwordModal" onSubmit={handlePasswordUpdate} />
      <ConfirmModal
        id="deleteModal"
        title="Eliminar usuario"
        message={`¿Deseas eliminar a ${selectedUser?.name || 'este usuario'}?`}
        confirmLabel="Sí, eliminar"
        onConfirm={handleDelete}
      />
    </>
  );
}
