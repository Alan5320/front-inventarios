import { useAuth } from '../auth/AuthContext';

const panels = {
  ADMINISTRADOR: {
    title: 'Panel Administrador',
    description: 'Gestiona usuarios, permisos y la operación completa del sistema.'
  },
  EMPLEADO: {
    title: 'Panel Empleado',
    description: 'Consulta tu perfil y opera tareas asignadas de inventario.'
  },
  OPERADOR: {
    title: 'Panel Operador',
    description: 'Accede a vistas operativas y seguimiento diario.'
  }
};

export default function DashboardPage() {
  const { role, email } = useAuth();
  const panel = panels[role] || panels.OPERADOR;

  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <h2 className="h4 mb-2">{panel.title}</h2>
            <p className="text-secondary mb-0">{panel.description}</p>
            <div className="badge text-bg-dark mt-3">Sesión: {email}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
