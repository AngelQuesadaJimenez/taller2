# Auditoría final de preproducción

**27 de noviembre de 2026 · Alternadores y Arrancadores Río Segundo**

**Dictamen de publicación: NOT READY.** El candidato se puede entregar al cliente para revisión funcional. Para autorizar el cambio del dominio falta verificar este mismo artefacto en Wix. El dominio público aún sirve el sitio anterior y responde 404 en `/release.txt`. Producción continúa deshabilitada en el repositorio. El LCP móvil también requiere seguimiento.

## Alcance y versión

Se partió del [main fusionado 16734fa](https://github.com/AngelQuesadaJimenez/taller2/commit/16734faa8013c27f8b05921c6e3798c57cd06eea). La referencia visual anterior se sirvió desde el artefacto `sitio-estatico` de [la ejecución de main](https://github.com/AngelQuesadaJimenez/taller2/actions/runs/45924906401), contrastando el SHA de `release.txt` y el digest de GitHub. Para el candidato se hizo instalación limpia desde el lockfile y export estático. Los formularios de prueba usaron datos ficticios. Se interceptaron WhatsApp, Waze y Google Maps en los recorridos de aceptación.

| Inventario | Cobertura |
|---|---|
| Base técnica | Next.js 16.4.6 con App Router y export estático, React 19.3.1, TypeScript 5.9.3, Tailwind 3.4.19, Lucide 1.78.0, MapLibre 6.19.0 y Leaflet 1.9.4. Playwright 1.65.1 y axe 4.14.0. |
| Interfaz | Navegación extendida, menús, portada y carrusel con pausa, servicios y sus fichas de compra/reparación, catálogo con filtros, despiece, proceso, reparaciones, pagos, ubicación, contacto, pie y ayuda flotante. La presentación del negocio se distribuye entre portada, proceso y pie. |
| Sistema visual | Tokens compartidos, GlassCard, GlassPanel, GlassNavbar, Button, BrandIcon, fotografías con reserva de espacio, modal nativo y campos compartidos. Estados de hover, foco, presión, deshabilitado, carga, error y movimiento reducido. |
| Idiomas y temas | Portadas y tres páginas legales por idioma, rutas heredadas, menú ES/EN, temas claro/oscuro y preferencia del sistema. Cambio durante una consulta y persistencia tras recarga. |
| Integraciones | Dos WhatsApp y teléfono fijo, horarios, redes, SINPE y BAC, proveedor de ortofoto, calles y etiquetas, geolocalización por acción explícita, enlaces a Waze y Google. |
| Entrega | Lockfile, pruebas de código, HTML exportado, CI de PR, controles de rama, artefactos, preflight, smoke y procedimiento de reversión. |

## Matriz de hallazgos

| ID | Categoría | Problema | Severidad | Causa raíz | Corrección o mitigación | Evidencia | Estado |
|---|---|---|---|---|---|---|---|
| R01 | Publicación | Falta una vista previa de la nueva web en su alojamiento final | Alto | La migración de Wix no está vinculada al entorno de producción de GitHub | Mantener desactivado el despliegue; validar revisión, rutas, HTTPS y recursos en vista previa antes del cambio de dominio | `/release.txt` público 404; faltan identificadores y secreto en GitHub | Bloquea publicación |
| R02 | Despliegue | Un fallo de red, de autenticación o una respuesta HTML podían disparar un intento de publicación | Alto | El workflow interpretaba toda salida de error de la comprobación de revisión como una revisión pendiente | Diferenciar revisión actual, SHA distinto y 404. Abortar ante respuestas ambiguas | Pruebas aisladas con 200/404/401/403/500, redirección, contenido inválido, conexión interrumpida y SHA ausente | Corregido y probado |
| R03 | Automatización | Faltaba una etapa unitaria en CI y el HTML de Playwright se descartaba en ejecuciones exitosas | Medio | El flujo sólo retenía evidencia en caso de fallo | Añadir pruebas unitarias, auditoría npm con umbral crítico y conservación del informe por siete días | Workflow y suite de negocio/despliegue | Corregido |
| R04 | SEO local | Al cambiar ES/EN, el JSON-LD conservaba el idioma previo. Las páginas legales compartían la metadescripción de portada | Medio | Copia inicial del esquema y metadescripción común | Sincronizar el esquema, añadir URL/geo verificadas y descripción localizada de cada página | 8 rutas en Edge, metadata y prueba unitaria ES/EN | Corregido y probado |
| R05 | Navegación | Era difícil localizar las condiciones de pago desde el pie | Bajo | El índice del pie omitía pagos | Añadir el enlace traducido a la sección existente | Recorrido E, capturas antes y después | Corregido y probado |
| R06 | Seguridad del navegador | El export carecía de una política explícita para base, objetos y destino nativo de formularios | Medio | Export estático con políticas delegadas al host | Añadir CSP limitada a estas tres directivas y política de referencia compatible con cartografía. Probar el contacto en ES/EN | 8 rutas sin violaciones CSP, consulta y mapas completos en navegador | Corregido en el artefacto |
| R07 | Cabeceras de alojamiento | Faltan garantías de seguridad y caché del frontend definitivo | Medio | El servidor local y el dominio antiguo tienen configuraciones diferentes de la futura vista previa | Verificar HSTS, CSP efectiva, frame-ancestors, Permissions-Policy con geolocalización por acción del usuario, tipos, caché y compresión en el host real | Inspección HTTPS del sitio actual y políticas HTML del candidato | Pendiente del alojamiento |
| R08 | Rendimiento móvil | La carga móvil simulada supera 2,5 s | Medio | Conexión móvil simulada, bytes iniciales y retraso hasta presentar el Hero | Descubrir temprano el AVIF de tamaño correcto con prioridad alta. Mostrar la primera foto sin transición de entrada; medir con y sin compresión | Tabla Lighthouse y comprobación de una única descarga AVIF | Mitigado; persiste sobre el objetivo |
| R09 | Cobertura de aceptación | Faltaba trazabilidad por recorrido, perfil y duración | Bajo | Los casos anteriores agrupaban varias acciones comerciales | Añadir A–F con aserciones de destino, contenido y registro JSON por prueba | Edge, Pixel 7 emulado y WebKit con iPhone 13 emulado | Corregido y probado |

## Aceptación comercial

Una ejecución cronometrada por escenario y perfil desde la portada hidratada hasta la aserción final. Incluye acciones del navegador y esperas automáticas. Son simulaciones, sin sesiones con clientes reales. Duraciones en segundos.

| Recorrido | Acciones | Edge escritorio | Pixel 7 emulado | iPhone 13 emulado/WebKit | Qué se comprobó |
|---|---:|---:|---:|---:|---|
| A. Comprar alternador | 4 | 1,68 | 1,24 | 1,53 | Filtrar, tocar la foto de Toyota/Lexus y generar consulta con esa referencia. |
| B. Reparar arrancador | 6 | 0,87 | 0,68 | 2,70 | Acceso desde servicios, pestaña reparación y síntoma escrito incluido en el mensaje. |
| C. Consultar placas de diodos | 6 | 3,47 | 0,95 | 2,00 | Ficha de la pieza, placa opcional y aclaración sobre verificación de compatibilidad. |
| D. Llegar al taller | 2 | 0,32 | 1,25 | 1,64 | Dirección legible, Waze del comercio y destino de Google verificado. |
| E. Encontrar métodos y condiciones de pago | 3 | 1,68 | 0,52 | 1,23 | Acceso desde el pie, cinco opciones y condiciones de BAC a tres meses. |
| F. Contactar en inglés | 4 | 1,90 | 0,70 | 1,71 | Cambio de idioma, contacto y texto de WhatsApp en inglés. |

**Datos comerciales verificados.** WhatsApp principal 8939-1999, secundario 8392-7096 y teléfono fijo 2440-2131. Lunes a viernes de 07:00 a 17:00 y sábado de 07:00 a 12:00 según la configuración comercial. Instagram y Facebook conservan las cuentas configuradas. Pago por SINPE Móvil, efectivo, tarjeta, transferencia bancaria y BAC Tasa Cero a tres meses sujeto a condiciones. SINPE utiliza el arte del BCCR y BAC el logotipo corporativo oficial con variante por tema. [BCCR](https://www.bccr.fi.cr/content/dam/bccr/bccr-espanol/sistema-de-pagos/informacion-general/manual-marca-sinpe-movil.pdf) · [BAC](https://www.baccredomatic.com/themes/custom/bac_theme/images/bac_logo.svg)

**Fotografía.** Se cotejaron 35 fotos de inventario y dos logotipos del material original. Cuatro referencias comerciales y las comparativas Land Cruiser, Lexus, Audi Q5 y Audi Q7 tienen material propio. Las categorías 01–09 son placas de diodos, reguladores, roles, poleas, carbones, porta carbones, planetarios, Bendix y automáticos. Todas usan el respaldo gráfico previsto porque el archivo carece de fotografías identificables de cada pieza. Se decodificaron 92 archivos de fotografías y 14 imágenes raster de marca. La inspección de esos archivos publicados encontró cero bloques EXIF y cero marcadores GPS en XMP.

## Seguridad y publicación

El registro npm respondió con **0 vulnerabilidades conocidas en 476 dependencias**. Diez declaraciones directas tenían una versión posterior en el registro. Se conservaron las versiones fijadas al comprobar compatibilidad. La revisión por firmas de 24 commits alcanzables y archivos de texto no encontró coincidencias de credenciales; el único archivo de entorno versionado fue `.env.example`. Esto acota el resultado a las referencias y firmas inspeccionadas.

El formulario genera una URL con `URLSearchParams`. Se verificaron caracteres especiales, omisión de valores vacíos, opciones válidas y año. Los enlaces de salida usan destinos configurados. El esquema embebido escapa `<`, el cambio de idioma actualiza `textContent` y el script inicial de tema usa constantes del proyecto. Los datos de consulta se mantienen en memoria hasta que se abre el destino solicitado. El HTML publica `base-uri 'none'`, `object-src 'none'`, `form-action 'none'` y `strict-origin-when-cross-origin`. Se probaron contactos, mapa y recursos contra esas políticas.

GitHub exige los checks **Calidad y build** y **Playwright**, rama actualizada, conversaciones resueltas y protección para administradores. Están bloqueados el force-push y el borrado de main; la configuración exige cero revisores. Actions utiliza permisos de contenido de lectura, acciones fijadas por SHA y checkout sin conservar credenciales. Sólo un push a main con los checks aprobados y el interruptor activo puede publicar. Los identificadores `WIX_SITE_ID`, `WIX_APP_ID` y el secreto `WIX_API_KEY` siguen pendientes en el entorno autorizado. `SITE_SMOKE_URL` está configurada. El sitio Wix vigente entrega HTTPS con HSTS y nosniff. No presentó CSP, X-Frame-Options, Permissions-Policy ni Referrer-Policy como cabeceras de respuesta en la comprobación efectuada. La vista previa debe verificarse por separado. [Publicación y reversión](../README.md#wix-y-rollback) · [Dominio vigente](https://www.alternadoresyarrancadoresrio2.com/)

## Mapa, red y estados

En Edge de escritorio se midieron 1,74 s desde aproximarse a la sección hasta disponer del mapa 3D. La portada no hizo peticiones cartográficas externas antes de ese momento. El navegador recibió 57 teselas JPEG 200 del IGN, metadatos, siete vectores y una fuente 200 de OpenFreeMap durante el recorrido. Se comprobaron cambio de vista, rotación, zoom, máscara, marcador, panel, retorno de foco, atribuciones y enlaces. En móvil a 390 px el mapa de calles descargó nueve PNG 200 de OpenStreetMap. La interacción real produjo cero errores de consola, de página o solicitudes fallidas.

La dirección es Calle Arias, Río Segundo, Alajuela. Google utiliza el punto confirmado del predio `10.002114,-84.182999` y Waze su lugar configurado. El predio y el acceso disponen de trazos diferenciados. La entrada exacta separada permanece sin coordenadas confirmadas. En pruebas controladas se ejercitan falta de WebGL, proveedor aéreo caído, teselas tardías, recuperación, fallo de callejero, geolocalización denegada, imagen lenta e imagen ausente. La dirección y las acciones de llegada permanecen disponibles.

El mapa carga bajo demanda un módulo de 1.073.056 B y otro de 4.035 B (transferencias del servidor local sin compresión). El worker de 550.754 B tuvo dos instancias. El render limpia observers, temporizadores, listeners y el mapa al desmontar. Estos tamaños no son el consumo de memoria de un dispositivo físico.

[Mapa aéreo real](evidencia-release/mapa-aereo.webp) · [Mapa de calles real en móvil](evidencia-release/mapa-calles.webp)

## Rendimiento

Lighthouse 12.8.2 en Chrome 158. Una carga fría por fila con perfil móvil o escritorio de Lighthouse. Se utilizaron el export de main y el candidato local; el laboratorio Brotli sirve HTML, JS, CSS y SVG con el mismo nivel de compresión en ambos. Las cifras de JS incluyen cabeceras de transferencia. El TBT es una señal de laboratorio distinta de INP.

| Perfil y servidor | Puntos | LCP | CLS | TBT | JS transferido | Total |
|---|---:|---:|---:|---:|---:|---:|
| Móvil antes, sin compresión | 74 | 6,51 s | 0,00002 | 35 ms | 578 KiB | 923 KiB |
| Móvil candidato, sin compresión | 75 | 6,49 s | 0,00002 | 53 ms | 580 KiB | 925 KiB |
| Móvil antes, Brotli | 92 | 3,34 s | 0,00002 | 48 ms | 167 KiB | 378 KiB |
| Móvil candidato, Brotli | 92 | 3,29 s | 0,00002 | 23 ms | 168 KiB | 379 KiB |
| Escritorio antes, sin compresión | 97 | 1,22 s | 0,00053 | 0 ms | 578 KiB | 923 KiB |
| Escritorio candidato, sin compresión | 97 | 1,22 s | 0,00053 | 0 ms | 580 KiB | 926 KiB |
| Escritorio candidato, Brotli | 100 | 0,69 s | 0,00053 | 0 ms | 168 KiB | 379 KiB |

La foto prioritaria llegó en una única petición AVIF de ~10,2 kB. Las fuentes WOFF2 son propias del bundle y usan intercambio de fuente. La principal oportunidad restante en la simulación móvil es el intervalo hasta la presentación del Hero. La diferencia de centésimas entre antes y después no demuestra por sí sola una mejora sostenida. Falta el percentil 75 de usuarios reales para LCP, CLS e INP del nuevo sitio. [Criterios de Web Vitals](https://web.dev/articles/vitals)

## Evidencia visual y accesibilidad

[Pie móvil antes](evidencia-release/pie-antes-390.png) · [Pie móvil después](evidencia-release/pie-despues-390.png) · [Pie de escritorio antes](evidencia-release/pie-antes-1440.png) · [Pie de escritorio después](evidencia-release/pie-despues-1440.png). Son recortes de la navegación del pie en viewports de 390 y 1440 px.

Axe comprueba reglas A/AA etiquetadas para WCAG 2.0, 2.1 y 2.2 en los flujos automatizados. Se ejercitaron teclado, Escape, retorno de foco al activador, selección de pestañas, estado de formularios, nombres de controles, ayuda de la placa, movimiento reducido y árbol accesible del mapa y de los diálogos. WebKit para Windows con un perfil de iPhone 13 comprobó los seis recorridos más los dos casos ES/EN de modal y foco. Falta una sesión de escucha con VoiceOver/TalkBack en teléfono físico y teclado virtual nativo. El dictamen no certifica conformidad WCAG integral. [Evaluación WAI](https://www.w3.org/WAI/test-evaluate/tools/selecting/)

## Checklist para la entrega

- [x] Datos de contacto, pagos y ubicación cotejados contra configuración y confirmaciones del taller.
- [x] Artefacto estático producido, controles de negocio verificados, respuestas de error y respaldo comprobados.
- [x] Recursos y metadatos ES/EN revisados; material gráfico identificable y con respaldo adecuado.
- [ ] Revisar el artefacto de este PR en la vista previa del Wix asociado al taller, antes del cambio público.
- [ ] Verificar allí raíz, rutas ES/EN y legales, enlaces antiguos del Editor, tratamiento del formulario de reseñas anterior, recursos, compresión, cabeceras, caché y `release.txt`.
- [ ] Acordar con el propietario el cambio de dominio y la reversión. Configurar los identificadores y el secreto en el entorno protegido.
- [ ] Tras publicación autorizada, comprobar el SHA público y ambos idiomas con el smoke del repositorio y medir datos de campo cuando haya muestra.
