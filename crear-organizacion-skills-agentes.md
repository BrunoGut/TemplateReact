# Tarea para Codex: crear organización de carpetas para skills de agentes IA

Crear la estructura de carpetas para guardar skills e instrucciones de distintos agentes de IA en un proyecto frontend.

No crear ninguna skill concreta todavía. Solo crear la organización de carpetas y, si hace falta, archivos `.gitkeep` para conservar carpetas vacías.

## Agentes incluidos

- Codex
- GitHub Copilot
- Cursor
- Claude Code

## Estructura a crear

```txt
.agents/
  skills/

.github/
  skills/
  instructions/

.cursor/
  rules/

.claude/
  skills/
  rules/
```

## Uso esperado de cada carpeta

- `.agents/skills/`: skills para Codex o agentes compatibles con Agent Skills.
- `.github/skills/`: skills para GitHub Copilot.
- `.github/instructions/`: instrucciones específicas para GitHub Copilot.
- `.cursor/rules/`: reglas persistentes del proyecto para Cursor.
- `.claude/skills/`: skills para Claude Code.
- `.claude/rules/`: reglas o instrucciones adicionales para Claude Code.

## Reglas

- No agregar contenido de skills en esta tarea.
- No crear archivos `SKILL.md` todavía.
- No modificar configuración existente si ya hay carpetas creadas.
- Si alguna carpeta ya existe, conservarla y continuar con las faltantes.
