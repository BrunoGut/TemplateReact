---
name: screaming-architecture
description: Usar cuando se cree, modifique u organice la estructura de carpetas de un frontend React + Vite con arquitectura modular.
---

# Screaming Architecture

## Objetivo

Organizar el proyecto por funcionalidades del sistema, no solamente por tipo técnico.

La estructura debe mostrar claramente qué módulos existen en la aplicación.

## Estructura base

```txt
src/
  app/
  assets/
  modules/
  shared/
```

## Responsabilidades

- `src/app`: configuración general de la app, rutas, providers y layout principal.
- `src/assets`: imágenes, íconos, fuentes y recursos estáticos.
- `src/modules`: funcionalidades principales del sistema.
- `src/shared`: código reutilizable por varios módulos.

## Estructura de cada módulo

```txt
src/modules/nombre-modulo/
  pages/
  components/
  hooks/
  services/
  utils/
  data/
```

Crear solo las carpetas necesarias. No crear carpetas vacías si no van a usarse todavía, salvo que el usuario pida preparar la estructura completa.

## Reglas

- Si algo pertenece a una funcionalidad concreta, va dentro de `modules/nombre-modulo`.
- Si algo se reutiliza en varios módulos, va dentro de `shared`.
- No crear carpetas globales como `components`, `hooks` o `services` directamente dentro de `src` si pertenecen a un módulo.
- Mantener nombres de carpetas en minúscula y descriptivos.
