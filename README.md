# Template React + Vite

Template base para crear proyectos frontend con **React + Vite**, manteniendo una estructura clara, reutilizable y fácil de entender por el equipo.

El objetivo es usar este repositorio como punto de partida para nuevos proyectos, evitando repetir configuraciones iniciales y manteniendo una misma forma de organizar el código.

---

## Tecnologías incluidas

- React
- Vite
- JavaScript
- ESLint
- Prettier
- React Router DOM
- React Hook Form
- Bootstrap / React Bootstrap / Bootstrap Icons

---

## Crear el proyecto desde cero

```bash
npm create vite@latest
```

Opciones recomendadas:

```txt
Project name: template-react-vite
Framework: React
Variant: JavaScript
Linter: ESLint
Install with npm and start now: Yes
```

Luego entrar a la carpeta del proyecto:

```bash
cd template-react-vite
```

Instalar dependencias adicionales:

```bash
npm install react-router-dom
npm install react-hook-form
npm install bootstrap react-bootstrap bootstrap-icons
npm install -D prettier
```

Ejecutar el proyecto:

```bash
npm run dev
```

---

## Estructura general

El proyecto usa una arquitectura modular basada en **Screaming Architecture**. Esto significa que la estructura debe mostrar claramente las funcionalidades de la aplicación.

```txt
src/
  app/
  assets/
  modules/
  shared/
  main.jsx
```

### `src/app`

Contiene la configuración general de la aplicación.

Ejemplos:

```txt
router.jsx
providers.jsx
App.jsx
```

### `src/assets`

Contiene recursos estáticos del proyecto.

```txt
images/
icons/
fonts/
```

### `src/modules`

Contiene las funcionalidades principales de la aplicación.

Cada módulo representa una parte del sistema, por ejemplo:

```txt
modules/
  home/
  contacto/
  pacientes/
  auth/
```

Estructura sugerida para cada módulo:

```txt
modules/nombreModulo/
  pages/
  components/
  hooks/
  services/
  utils/
  data/
```

### `src/shared`

Contiene código reutilizable en toda la aplicación.

```txt
shared/
  components/
  hooks/
  services/
  utils/
  constants/
  styles/
```

---

## Responsabilidad de cada carpeta

| Carpeta | Uso |
|---|---|
| `pages` | Pantallas completas del módulo |
| `components` | Elementos visuales reutilizables |
| `hooks` | Lógica de React, estados, efectos, loading y errores |
| `services` | Comunicación con APIs o servicios externos |
| `utils` | Funciones auxiliares puras |
| `data` | Datos estáticos o configuraciones del módulo |
| `shared` | Código reutilizable por varios módulos |
| `app` | Configuración general de la aplicación |

---

## Regla general de flujo

Para mantener el código ordenado, se recomienda respetar este flujo:

```txt
Component → Hook → Service → httpClient → API
```

Esto significa:

- Los componentes muestran la interfaz.
- Los hooks manejan estados y lógica de React.
- Los services definen las operaciones contra la API.
- El `httpClient` centraliza la forma de hacer requests.

---

## Fetch general

El proyecto debe tener un cliente HTTP centralizado en:

```txt
src/shared/services/httpClient.js
```

Este archivo se encarga de centralizar la forma de consumir APIs usando `fetch`.

La idea es que si en el futuro cambia la forma de comunicarse con el backend, se modifique principalmente este archivo y no todos los componentes.

Cada módulo debe tener sus propios services, pero todos pueden usar el mismo `httpClient` general.

Ejemplo de organización:

```txt
shared/services/httpClient.js
modules/pacientes/services/pacienteService.js
modules/pacientes/hooks/usePacientes.js
modules/pacientes/components/PacienteList.jsx
```

---

## Variables de entorno

Crear un archivo `.env.example` para documentar las variables necesarias:

```env
VITE_API_URL=https://api.ejemplo.com/api
```

Cada proyecto debe crear su propio archivo `.env` con los valores reales.

En Vite, las variables accesibles desde React deben comenzar con `VITE_`.

---

## Agentes IA y skills

Este template puede incluir carpetas de configuración para distintos asistentes de IA.

Estructura sugerida:

```txt
.agents/skills/       # Codex
.github/skills/       # GitHub Copilot
.cursor/rules/        # Cursor
.claude/skills/       # Claude
```

También pueden existir archivos generales de instrucciones:

```txt
AGENTS.md
CLAUDE.md
.github/copilot-instructions.md
```

Estos archivos sirven para que los agentes entiendan las reglas generales del proyecto y mantengan una forma consistente de trabajar.

---

## Reglas generales del template

- Mantener componentes simples y legibles.
- No hacer `fetch` directamente desde componentes.
- Usar hooks para lógica de React.
- Usar services para llamadas a APIs.
- Usar `shared` solo para código realmente reutilizable.
- Crear módulos según funcionalidades del sistema.
- Evitar archivos demasiado grandes.
- No instalar dependencias innecesarias en el template base.

---

## Objetivo

Este template busca que todos los proyectos frontend tengan una base común, ordenada y fácil de mantener.

Cada nuevo proyecto puede adaptar esta estructura según sus necesidades, pero respetando la separación general entre módulos, componentes, hooks, services y código compartido.