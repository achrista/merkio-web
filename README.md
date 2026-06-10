# merkio-web

Öffentliche Werbeseite und App-Download für **merkio** (gehostet via GitHub Pages unter [merkio.de](https://merkio.de)).

Der eigentliche App- und Backend-Quellcode liegt im privaten Repo `merkio`.

## Inhalt
- `index.html` – die Landing Page
- `CNAME` – Custom Domain (merkio.de)
- Die Android-APK wird als **Release-Asset** veröffentlicht (Datei `merkio.apk`).
  Der Download-Button verlinkt immer auf das neueste Release:
  `https://github.com/achrista/merkio-web/releases/latest/download/merkio.apk`

## Neue App-Version veröffentlichen
1. Signierte Release-APK im privaten Repo bauen (`./gradlew :app:assembleRelease`).
2. Die APK als `merkio.apk` an ein neues Release hier anhängen:
   ```
   gh release create v1.x.x merkio.apk --repo achrista/merkio-web -t "merkio 1.x.x"
   ```
