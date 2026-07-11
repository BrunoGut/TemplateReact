# Tarea para Codex: crear estructura Screaming Architecture

Crear la estructura base de carpetas para un proyecto frontend con React + Vite usando Screaming Architecture.

La arquitectura debe organizar el código por funcionalidades/módulos y no solamente por tipo técnico.

## Estructura a crear

```txt
src/
  app/
  assets/
    images/
    icons/
    fonts/
  modules/
    home/
      pages/
      components/
      hooks/
      services/
      utils/
      data/
  shared/
    components/
    hooks/
    services/
    utils/
    constants/
    styles/
```

## Reglas

- No eliminar archivos existentes sin autorización.
- Crear solo carpetas y, si es necesario, archivos `.gitkeep` para conservar carpetas vacías.
- `src/app` debe quedar reservado para configuración global de la app, router y providers.
- `src/modules` debe contener las funcionalidades principales del sistema.
- `src/shared` debe contener elementos reutilizables entre varios módulos.
- `src/assets` debe contener recursos estáticos como imágenes, íconos y fuentes.
