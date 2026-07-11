---
name: fetch-general-react
summary: Crear y mantener una forma centralizada de consumir APIs en proyectos React + Vite.
description: Usar esta skill cuando se necesite crear, refactorizar o revisar la capa de fetching de datos en un frontend React + Vite, separando httpClient, services, hooks y components.
---

# Skill: Fetch General en React + Vite

## Objetivo

Crear una forma centralizada y reutilizable para consumir APIs en proyectos React + Vite.

La implementación debe permitir que, si cambia la forma de consumir datos, se modifique principalmente un único archivo general.

## Estructura esperada

Crear o respetar esta organización:

```txt
src/
  shared/
    services/
      httpClient.js

  modules/
    nombreModulo/
      services/
        nombreModuloService.js
      hooks/
        useNombreModulo.js
      components/
        NombreModuloList.jsx
```

## Reglas principales

- No hacer `fetch` directamente desde componentes.
- No hacer `fetch` directamente desde hooks, salvo que el proyecto no use capa de services.
- El archivo `httpClient.js` debe centralizar la forma general de consumir APIs.
- Los services de cada módulo deben usar `httpClient.js`.
- Los hooks deben usar los services del módulo y manejar estado de React.
- Los componentes deben usar hooks y encargarse de mostrar la interfaz.

## Responsabilidades

### `src/shared/services/httpClient.js`

Debe encargarse de:

- Leer la URL base desde variables de entorno.
- Ejecutar requests HTTP.
- Configurar headers comunes.
- Convertir body a JSON cuando corresponda.
- Manejar errores HTTP.
- Devolver la respuesta parseada.
- Soportar métodos como `get`, `post`, `put`, `patch` y `delete`.

### `src/modules/*/services/*Service.js`

Debe encargarse de:

- Definir funciones específicas del módulo.
- Usar nombres claros como `getPatients`, `createPatient`, `updatePatient`, etc.
- Usar `httpClient`, no `fetch` directo.
- No usar hooks de React.
- No devolver JSX.

### `src/modules/*/hooks/use*.js`

Debe encargarse de:

- Usar los services del módulo.
- Manejar `loading`, `error`, `success` y datos.
- Ejecutar cargas iniciales con `useEffect` cuando corresponda.
- Exponer funciones para recargar, crear, editar o eliminar datos.

### `src/modules/*/components/*.jsx`

Debe encargarse de:

- Mostrar datos en pantalla.
- Usar hooks del módulo.
- Mostrar estados de carga, error y éxito.
- No conocer endpoints ni detalles del backend.

## Variables de entorno

Crear o respetar:

```env
VITE_API_URL=https://api.ejemplo.com/api
```

También agregar en `.env.example`:

```env
VITE_API_URL=https://api.ejemplo.com/api
```

## Resultado esperado

Al finalizar, el proyecto debe tener una capa de acceso a datos ordenada así:

```txt
Component -> Hook -> Service -> httpClient -> API
```

Si cambia la forma general de consumir la API, se debe modificar principalmente:

```txt
src/shared/services/httpClient.js
```

No modificar componentes para cambiar headers, URL base, manejo general de errores o mecanismo HTTP.
