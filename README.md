# Ardalan Plaza — Mental Vision (pitch handoff)

**Public repo for ChatGPT / Codex / Claude.** This is the independent 3D presentation world for Ardalan Plaza, Carmel, Indiana — ready to fold into the multimedia pitch.

> Independent concept visualization. **Not an approved plan.** Not city, architect, or family sign-off.

## Give this link to another model

```
https://github.com/coreyagraphy/ardalan-plaza-mental-vision
```

Paste `CODEX_PROMPT.md` as the task. Read `SITE_GEOMETRY.md` before changing massing.

## What this is

A walkable Three.js / React Three Fiber reconstruction of Ardalan Plaza as a **corner gateway**, not a mid-block strip:

- **Site:** SE corner of West Main Street and 4th Avenue SW
- **Fountain:** Carmel Arts Fountain on the **roundabout island**, not a plaza basin on the sidewalk
- **Block:** north half of the block toward 3rd Avenue SW (~1 acre, 311–331 W Main)
- **Building:** cream Italianate palazzo, ~8,000 sf first-floor retail/gallery, terracotta roofs, clock tower
- **Across Main:** existing Arts & Design District brick mixed-use
- **West of the palazzo:** 4th Ave + roundabout. No fake neighbors on that side

Published sources (appearance / location only — do not treat as a survey):

- [Skender — Ardalan Plaza](https://www.skender.com/project/ardalan-plaza/)
- [IBJ — SE corner of the roundabout](https://www.ibj.com/articles/carmel-planning-19m-ardalan-plaza-as-arts-design-district-gateway)
- [City of Carmel](https://www.carmel.in.gov/redevelopment-projects/ardalan-plaza)
- [Studio M](https://www.studiomarchitecture.net/ardalanplaza)

## Repo map

| Path | Use |
|---|---|
| `CODEX_PROMPT.md` | Paste this into ChatGPT / Codex |
| `SITE_GEOMETRY.md` | Corner, scale, coordinates (estimated) |
| `PITCH_IMPLEMENTATION.md` | How to drop this into the multimedia pitch |
| `src/plaza/` | Live 3D world (R3F). Do **not** import `@react-three/drei` |

## Hard rules for any downstream model

1. Ardalan is **on the corner**. Do not put brick mixed-use against the west facade.
2. The fountain is **in the roundabout**. Do not slide it onto the Main Street sidewalk.
3. Scale is **estimated** from ~8,000 sf first floor. Label it. Do not claim a survey.
4. No tenant logos. No “approved plan” language.
5. Official Studio M / Skender stills are **reference only**. Do not republish them as if they were this model.
