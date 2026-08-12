import { NavLink } from 'react-router-dom'
import './SidebarNav.css'

const navigationItems = [
  { label: 'Pacientes', path: '/pacientes', icon: 'bi-people' },
  { label: 'Aplicaciones', path: '/aplicaciones', icon: 'bi-grid' },
  { label: 'Drogas', path: '/drogas', icon: 'bi-capsule' },
  { label: 'Estadisticas', path: '/estadisticas', icon: 'bi-bar-chart' },
  { label: 'Notificaciones', path: '/notificaciones', icon: 'bi-bell' },
  { label: 'Configuracion', path: '/configuracion', icon: 'bi-gear' },
]

export function SidebarNav() {
  return (
    <aside className="sidebar-nav" aria-label="Navegacion principal">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark" aria-hidden="true">
          SC
        </span>
        <div>
          <p>Sistema clinico</p>
          <span>Gestion interna</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {navigationItems.map((item) => (
          <NavLink key={item.path} to={item.path} className="sidebar-link">
            <i className={`bi ${item.icon}`} aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
