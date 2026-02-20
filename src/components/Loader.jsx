export default function Loader({ text = 'Cargando...' }) {
  return (
    <div className="d-flex align-items-center gap-2 text-secondary">
      <div className="spinner-border spinner-border-sm" role="status" />
      <span>{text}</span>
    </div>
  );
}
