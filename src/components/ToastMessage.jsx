export default function ToastMessage({ type = 'success', message, onClose }) {
  if (!message) return null;

  return (
    <div className={`alert alert-${type} alert-dismissible fade show shadow-sm`} role="alert">
      {message}
      <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
    </div>
  );
}
