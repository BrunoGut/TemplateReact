import { Navigate, Route, Routes } from 'react-router-dom'
import { AplicacionesPage } from './modules/aplicaciones/pages/AplicacionesPage'
import { LoginPage } from './modules/auth/pages/LoginPage'
import { ConfiguracionPage } from './modules/configuracion/pages/ConfiguracionPage'
import { SidebarNav } from './shared/components/SidebarNav'
import './App.css'

const moduleRoutes = [
  {
    path: '/pacientes',
    title: 'Pacientes',
    description: 'Gestion de pacientes, historiales y datos de contacto.',
  },
  {
    path: '/drogas',
    title: 'Drogas',
    description: 'Administracion del catalogo de drogas y tratamientos.',
  },
  {
    path: '/estadisticas',
    title: 'Estadisticas',
    description: 'Indicadores clinicos y metricas operativas del sistema.',
  },
  {
    path: '/notificaciones',
    title: 'Notificaciones',
    description: 'Alertas, avisos pendientes y comunicaciones del sistema.',
  },
]

function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <SidebarNav />
      <main className="app-content">{children}</main>
    </div>
  )
}

function ModulePlaceholder({ title, description }) {
  return (
    <AppLayout>
      <section className="dashboard-placeholder">
        <p className="eyebrow">Modulo en desarrollo</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>
    </AppLayout>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<Navigate to="/pacientes" replace />} />
      <Route path="/medico" element={<Navigate to="/pacientes" replace />} />
      <Route
        path="/aplicaciones"
        element={
          <AppLayout>
            <AplicacionesPage />
          </AppLayout>
        }
      />
      {moduleRoutes.map((moduleRoute) => (
        <Route
          key={moduleRoute.path}
          path={moduleRoute.path}
          element={
            <ModulePlaceholder
              title={moduleRoute.title}
              description={moduleRoute.description}
            />
          }
        />
      ))}
      <Route
        path="/configuracion"
        element={
          <AppLayout>
            <ConfiguracionPage />
          </AppLayout>
        }
      />
      <Route
        path="/portal-paciente"
        element={
          <ModulePlaceholder
            title="Portal de pacientes"
            description="Acceso con token limitado para consultar informacion del paciente."
          />
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
