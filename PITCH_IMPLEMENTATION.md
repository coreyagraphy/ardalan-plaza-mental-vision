# Folding this into the multimedia pitch

## Use as

1. **Hero 3D world** — interactive walk / film cameras for live presentation.
2. **Opening plate** — 20s establishing film (west arrival → corner palazzo → Main Street).
3. **Still sequence** — Plaza, Street, Foyer, Gallery, Aerial. Same architecture, dusk default.
4. **Geometry contract** for Higgsfield / Seedance / Blender — do not re-blockout the site.

## Slide / chapter copy (short)

**People / Place / Possibility**

Ardalan Plaza sits at the southeast corner of Main Street and 4th Avenue SW — the gateway into Carmel’s Arts & Design District. The fountain in the roundabout is the first landmark. The palazzo is the second.

8,000 square feet of street-level retail and gallery. Five residences above. A private home on the third floor. Italian villa detailing on a one-acre corner.

*Independent concept visualization. Not an approved plan.*

## Technical drop-in

`src/plaza/` is the live world (React Three Fiber + three.js).

- Entry: `PlazaApp.tsx` → `PlazaScene.tsx`
- Site contract: `config.ts` (`BAYS`, `ROUNDABOUT`, `FOURTH_AVE`, `THIRD_AVE`)
- Cameras / 20s path: `cameras.ts` + `config.ts` `CAMERAS`
- Do not import the `@react-three/drei` barrel

If the pitch is After Effects / Keynote / Premiere, export stills from cameras `establishing`, `street`, `foyer`, `gallery`, `aerial` and cut the 20s plate as the opener. Keep the corner spatial story in every wide shot.

## Higgsfield / Seedance

Keep viewpoint and architecture. Change only light and activity. Footer:

`MENTAL VISION | CONCEPT VISUAL STUDY — NOT AN APPROVED PLAN`

Source `.blend` / `.glb` from the earlier Higgsfield revision are generic blockouts. Prefer this reconstruction over that massing.
