# Ardalan Plaza — website 3D

Standalone 3D world you can drop on any site. Mouse orbit, scroll zoom, simple camera buttons.

Independent concept visualization. **Not an approved plan.**

## Mouse

- **Drag** — look around
- **Scroll** — zoom
- **Right-drag** — pan
- **Walk** — click the scene, then WASD

## Add it to a website

### Fastest: upload the `dist` folder

1. Unzip this package.
2. Upload **everything inside `dist/`** to your host (Netlify, S3, GitHub Pages, a `/plaza` folder on your domain).
3. Open `index.html`.

Embed in an existing page:

```html
<iframe
  src="/plaza/"
  title="Ardalan Plaza 3D"
  style="width:100%;height:80vh;border:0;border-radius:12px"
  allow="fullscreen"
></iframe>
```

### Or build from source

```bash
npm install
npm run build
```

Output is `dist/`. `base` is `./` so it works in a subfolder.

`npm run dev` for local editing.

## Files

- `dist/` — prebuilt site (upload this)
- `src/plaza/` — the 3D world
- `src/SimpleHUD.tsx` — the camera / day-dusk bar
