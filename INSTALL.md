# Installer StreamDask Mix Live en natif avec Tauri

## 1. Prerequis

- Node.js 20+
- Rust (via https://rustup.rs)
- Dependances systeme Tauri par OS:
- Windows: Visual Studio C++ Build Tools
- macOS: Xcode Command Line Tools (`xcode-select --install`)
- Linux (Debian/Ubuntu): `sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev`

## 2. Installer les dependances JS

```bash
npm install
```

## 3. Lancer l'application desktop en dev (fenetre native)

```bash
npx tauri dev
```

## 4. Generer les installateurs natifs

```bash
npx tauri build
```

Sorties generees:

- Windows: `.exe` (et/ou `.msi`) dans `src-tauri/target/release/bundle/`
- macOS: `.dmg` dans `src-tauri/target/release/bundle/dmg/`
- Linux: `.AppImage` dans `src-tauri/target/release/bundle/appimage/`

## 5. Notes

- La generation cross-platform n'est pas supportee nativement: pour produire un `.dmg`, il faut builder sur macOS; pour `.exe` sur Windows.
- Le mode PWA reste disponible dans le navigateur, mais Tauri fournit une installation desktop native hors navigateur.