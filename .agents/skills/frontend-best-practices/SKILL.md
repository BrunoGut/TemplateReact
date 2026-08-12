---
name: frontend-best-practices
description: Usar cuando se revise, refactorice o cree código frontend aplicando buenas prácticas de React, JavaScript y CSS.
---

# Frontend Best Practices

## Objetivo

Mantener el código claro, mantenible y fácil de escalar.

## Reglas generales

- Priorizar legibilidad sobre soluciones complejas.
- Evitar abstracciones innecesarias.
- No agregar dependencias sin necesidad real.
- Mantener archivos con una responsabilidad clara.
- Usar nombres descriptivos para variables, funciones y componentes.
- Evitar lógica repetida.

## React

- Componentes en PascalCase.
- Hooks personalizados con prefijo `use`.
- Handlers con nombres claros, por ejemplo `handleSubmit`, `handleClick`.
- Extraer lógica compleja a hooks.
- Evitar lógica de API dentro del JSX.

## CSS

- Usar clases descriptivas.
- Evitar estilos inline salvo casos puntuales.
- Usar variables CSS para colores, fuentes y medidas comunes.
- Mantener estilos relacionados con su módulo o componente.

## Antes de responder con código

1. Identificar a qué módulo pertenece el cambio.
2. Verificar si corresponde crear componente, hook, service o utility.
3. Mantener la solución simple.
4. Explicar brevemente dónde colocar cada archivo si se crean varios.
