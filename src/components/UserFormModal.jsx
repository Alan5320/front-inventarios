import { useEffect, useMemo, useState } from 'react';
import { ROLES } from '../utils/constants';

const initialForm = { name: '', email: '', password: '', role: 'EMPLEADO', enabled: true };

export default function UserFormModal({ id, mode, user, onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        role: user.role || 'EMPLEADO',
        enabled: Boolean(user.enabled)
      });
    } else {
      setForm(initialForm);
    }
    setErrors({});
  }, [mode, user]);

  const isEdit = mode === 'edit';
  const modalTitle = useMemo(() => (isEdit ? 'Editar usuario' : 'Crear usuario'), [isEdit]);

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'El nombre es obligatorio';
    if (!form.email.trim()) nextErrors.email = 'El email es obligatorio';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Email inválido';

    if (!isEdit && !form.password.trim()) nextErrors.password = 'La contraseña es obligatoria';
    if (!isEdit && form.password.length > 0 && form.password.length < 6) {
      nextErrors.password = 'Mínimo 6 caracteres';
    }

    if (!ROLES.includes(form.role)) nextErrors.role = 'Rol inválido';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = () => {
    if (!validate()) return;
    const payload = {
      name: form.name,
      email: form.email,
      role: form.role,
      enabled: form.enabled
    };

    if (!isEdit) payload.password = form.password;
    onSubmit(payload);
  };

  return (
    <div className="modal fade" id={id} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{modalTitle}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nombre</label>
                <input className={`form-control ${errors.name ? 'is-invalid' : ''}`} name="name" value={form.name} onChange={handleChange} />
                <div className="invalid-feedback">{errors.name}</div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input className={`form-control ${errors.email ? 'is-invalid' : ''}`} name="email" value={form.email} onChange={handleChange} />
                <div className="invalid-feedback">{errors.email}</div>
              </div>
              {!isEdit && (
                <div className="col-md-6">
                  <label className="form-label">Contraseña</label>
                  <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} name="password" value={form.password} onChange={handleChange} />
                  <div className="invalid-feedback">{errors.password}</div>
                </div>
              )}
              <div className="col-md-6">
                <label className="form-label">Rol</label>
                <select className={`form-select ${errors.role ? 'is-invalid' : ''}`} name="role" value={form.role} onChange={handleChange}>
                  {ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <div className="invalid-feedback">{errors.role}</div>
              </div>
              {isEdit && (
                <div className="col-12">
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" role="switch" name="enabled" checked={form.enabled} onChange={handleChange} />
                    <label className="form-check-label">Usuario habilitado</label>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" className="btn btn-primary" onClick={handleSave} data-bs-dismiss="modal">
              {isEdit ? 'Guardar cambios' : 'Crear usuario'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
