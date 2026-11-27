# Alternadores y Arrancadores Río Segundo

Web comercial en español e inglés con venta y reparación de alternadores y arrancadores, catálogo, consultas por WhatsApp y mapa del taller en Alajuela. [Dominio público](https://www.alternadoresyarrancadoresrio2.com/) · [CI en GitHub](https://github.com/AngelQuesadaJimenez/taller2/actions/workflows/ci.yml)

## Desarrollo

Requiere Node.js 22 y npm. Python 3 permite servir el export estático en local.

```sh
npm ci
npm run dev
```

Abrí [la vista de desarrollo](http://localhost:3000/). Para revisar el mismo formato que se publica:

```sh
npm run build
python -m http.server 4317 --bind 127.0.0.1 --directory out
```

Copiá [`.env.example`](.env.example) a `.env.local` para personalizar el entorno. `NEXT_PUBLIC_SITE_URL` determina el dominio canónico, el sitemap y los metadatos. Las parejas `NEXT_PUBLIC_MAP_TILE_URL` y `NEXT_PUBLIC_MAP_ATTRIBUTION`, y `NEXT_PUBLIC_MAP_IMAGERY_URL` y `NEXT_PUBLIC_MAP_IMAGERY_ATTRIBUTION`, son opcionales. Next.js incorpora esas variables públicas durante el build.

Los datos comerciales y el WhatsApp **8939-1999** se gestionan en [data/business.config.ts](data/business.config.ts). Las fotos publicadas están en [public/photos](public/photos). Los originales se conservan localmente porque algunos contienen metadatos de cámara y ubicación.

## Pull requests y CI

1. Partí de `main` al día y abrí una rama `feature/*`, `fix/*` o `chore/*`.
2. Publicá la rama y abrí un PR a `main`. Usá la plantilla para explicar cómo probarlo y adjuntar comparaciones visuales.
3. Revisá **Calidad y build** y **Playwright**. Resuelve las conversaciones y fusioná por squash cuando el cambio esté aprobado.

**Calidad y build** ejecuta `npm ci`, lint, TypeScript, pruebas unitarias, auditoría npm con umbral crítico y el export estático. **Playwright** prueba ese mismo artefacto en Chromium, con escritorio, móvil y comprobaciones de 320, 360, 375, 390, 428, 768, 1024, 1280, 1440 y 1920 px. Las comparaciones visuales versionadas usan 375, 768 y 1440 px. El informe HTML adjunta capturas de las secciones y el modal en claro y oscuro a 390 y 1440 px. Consultá la [auditoría de entrega](docs/QA_RELEASE_FINAL.md). Las teselas de prueba son locales y los enlaces de WhatsApp se verifican sin enviar mensajes. Axe cubre contraste y accesibilidad en los flujos de prueba. La validación manual sigue siendo necesaria para una auditoría WCAG completa.

```sh
npm run lint
npm run typecheck
npm run test:unit
npx playwright install chromium
npm test
```

Para ejecutar las pruebas contra el export, definí `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4317` con el servidor estático activo. Las comparaciones de píxeles usan Ubuntu 24.04 y el Chromium del lockfile. Aprobá el diff en GitHub antes de regenerar una referencia con `npx playwright test --project=visual --update-snapshots=changed` en ese entorno. Los PR comparan los PNG versionados y archivan el informe HTML durante siete días. Los fallos incluyen capturas y trazas.

## Wix y rollback

El dominio público está en Wix. En el panel del sitio existente, el dueño o copropietario abre **Headless Settings → Headless Migration**, inicia la migración y revisa las apps compatibles. **Copy prompt** entrega los datos de vinculación del sitio de prueba. En el `wix.config.json` local de esa vinculación, configurá `site.outputDirectory` como `./out/`. Usá como `out/` el artefacto `sitio-estatico` de los checks del PR. Con Node.js 24.22.1 o superior y la sesión de Wix activa, ejecutá `npm exec --yes --package=@wix/cli@1.2.20 -- wix preview`.

En el enlace de Wix de esa vista previa comprobá `/`, `/es/` y `/en/`, los recursos y el contacto. Si la vista requiere sesión, verificá en un navegador autorizado. Revisá el formulario de reseñas y las redirecciones del sitio anterior antes de completar la transición. [Transición en Wix](https://support.wix.com/en/article/wix-headless-moving-your-site-to-a-custom-frontend) · [Vista previa con el CLI](https://dev.wix.com/docs/wix-cli/cli-for-headless/command-reference/project-commands/preview)

Cuando se haya validado la vista previa y autorizado el cambio público, completá la migración en Wix. Después, configurá el Environment **wix-production** en GitHub con los identificadores de producción que indica Wix para esa vinculación.

| Configuración | Valor |
| --- | --- |
| Variables de `wix-production` | `WIX_SITE_ID` y `WIX_APP_ID` de la vinculación real, y `SITE_SMOKE_URL` con la raíz HTTPS publicada |
| Secreto de `wix-production` | `WIX_API_KEY` con el acceso necesario al sitio |
| Variable del repositorio | `WIX_DEPLOY_ENABLED=true` activa la publicación al actualizar `main` |

El job **Producción en Wix** publica el artefacto validado por los dos checks. Comprueba el SHA público, las portadas en español e inglés, sus secciones, el enlace de contacto y los recursos CSS y JavaScript. Solo un marcador HTTP 404 o un SHA válido distinto habilita una publicación autorizada. Una respuesta ambigua aborta el job. Las publicaciones se serializan por entorno y se omite una revisión que ya esté publicada. [CLI de Wix](https://dev.wix.com/docs/go-headless/wix-managed-headless/other-frameworks/your-own-frontend/deploy-your-own-frontend-with-the-cli) · [Variables y secretos de entorno](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments)

Para **revertir una versión**, abrí un PR con `git revert <commit>` sobre una rama de corrección. Cuando se fusione, el pipeline validará y publicará el estado restaurado. Si necesitás revertir la transición completa hacia Headless, Wix permite **Switch back** en Headless Settings. Ese cambio restaura el frontend del Editor y elimina el frontend Headless, por lo que se reserva para esa reversión. [Reversión de Wix](https://support.wix.com/en/article/wix-headless-moving-your-site-to-a-custom-frontend#faqs)

## Créditos y recursos

La cartografía usa [IGN/SNIT](https://www.snitcr.go.cr/servicios_ogc_completo), [OpenStreetMap](https://www.openstreetmap.org/) y [OpenFreeMap](https://openfreemap.org/). El worker de MapLibre y su licencia se copian desde la dependencia durante el build. SINPE Móvil usa el [arte oficial del BCCR](https://www.bccr.fi.cr/content/dam/bccr/bccr-espanol/sistema-de-pagos/informacion-general/manual-marca-sinpe-movil.pdf). La tarjeta Tasa Cero muestra el [logotipo corporativo de BAC](https://www.baccredomatic.com/themes/custom/bac_theme/images/bac_logo.svg) y su [variante oficial en rojo oscuro](https://www.baccredomatic.com/themes/custom/bac_theme/images/bac_logo_dark_red.svg).
