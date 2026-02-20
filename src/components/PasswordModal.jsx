import { useState } from 'react';

export default function PasswordModal({ id, onSubmit }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (password.length < 6) {
      setError('Mínimo 6 caracteres');
      return;
    }
    onSubmit(password);
    setPassword('');
    setError('');
  };

  return (
    <div className="modal fade" id={id} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Actualizar contraseña</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body">
            <label className="form-label">Nueva contraseña</label>
            <input type="password" className={`form-control ${error ? 'is-invalid' : ''}`} value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} />
            <div className="invalid-feedback">{error}</div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" className="btn btn-warning" data-bs-dismiss="modal" onClick={handleConfirm}>Actualizar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
