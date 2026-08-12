---
name: react-frontend
description: Usar cuando se creen o modifiquen componentes, páginas, hooks, services o estilos en un frontend React + Vite.
---

# React Frontend

## Objetivo

Desarrollar frontend con React + Vite manteniendo código simple, legible y organizado.

## Reglas

- Usar componentes funcionales.
- Separar UI, lógica de React y comunicación con APIs.
- No hacer `fetch` directamente en componentes.
- No crear componentes demasiado grandes.
- Usar nombres claros y descriptivos.
- Evitar duplicar lógica.
- Mantener los estilos cerca del componente o módulo correspondiente.

## Organización esperada

- `pages`: pantallas completas.
- `components`: piezas visuales reutilizables dentro del módulo.
- `hooks`: lógica de React, estados, efectos, loading y errores.
- `services`: llamadas a APIs o integraciones externas.
- `utils`: funciones puras auxiliares.
- `data`: arrays o configuraciones estáticas.

## Antes de modificar

1. Revisar la estructura actual.
2. Crear archivos en el módulo correcto.
3. Reutilizar código existente si corresponde.
4. Mantener el componente lo más simple posible.
