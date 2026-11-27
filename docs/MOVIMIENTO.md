# Movimiento y navegación del taller

## Comportamiento

| Elemento | Comportamiento |
| --- | --- |
| Barra y anclas | El navegador desplaza la página hasta la sección. La altura medida de la barra y el margen del destino dejan el título visible. El fondo, la sombra y los menús cambian en 200 ms. La navegación móvil permanece extendida. |
| Portada y secciones | Se reutilizan la entrada del título de portada y el observador de intersección. Los títulos, fichas y bloques de contacto aparecen una vez en 400 ms, con hasta 90 ms de escalonamiento. La primera pintura ya contiene el contenido. |
| Servicios, catálogo y despiece | La tarjeta completa conserva una única acción y un punto de tabulación. Con ratón se eleva 4 px en 180 ms. Al presionar, la escala pasa a 0,988 y el borde cambia de color. En las tarjetas grandes de servicios y catálogo, las pantallas táctiles animan el texto de entrada sobre la foto fija. |
| Cómo trabajamos | El conector utiliza la distancia real entre nodos. Crece horizontalmente desde 768 px y verticalmente por debajo de ese ancho. Los iconos y el texto acompañan los tres pasos. |
| Detalles y consultas | El diálogo nativo entra en 250 ms. En escritorio utiliza escala y opacidad. En móvil sube desde el borde inferior. El fondo se atenúa junto con el panel. Escape, el botón de cierre y el fondo conservan sus acciones. El foco vuelve a la tarjeta que abrió la consulta. |
| Formularios | Compra y Reparación, la selección de placa o datos, los errores y la preparación del mensaje tienen respuesta visual breve. El foco y los datos introducidos se conservan al alternar campos. |
| Mapa | Se reutilizan las cámaras de MapLibre. Zoom utiliza 260 ms y los cambios de vista, 600 ms. Una nueva orden o un gesto interrumpe el desplazamiento. Al volver de la vista general a 3D se recupera la inclinación. El canvas se conserva al cambiar tema o idioma. |

Las duraciones de interfaz y desplazamientos están en `app/tokens.css`. Las distancias y tiempos de cámara están en `data/map.config.ts`. La implementación reutiliza `ScrollReveal`, `GlassCard`, `SectionHeading`, `ServiceModal`, `Header` y `useMapCamera`. La rotación manual de las fotografías del hero y el comportamiento existente de pausa siguen disponibles.

## Accesibilidad y compatibilidad

Con movimiento reducido, las anclas son inmediatas, los conectores quedan dibujados y los controles siguen indicando foco, selección y pulsación. El mapa también usa cambios de cámara inmediatos cuando el navegador comunica entre uno y cuatro procesadores lógicos. Esta cifra se usa como aproximación a la capacidad del dispositivo.

Las pruebas de movimiento cubren 320, 375, 390, 768, 1024 y 1440 px. Comprueban la geometría del conector, el clic y toque sobre la imagen de una tarjeta, el cierre del diálogo, el foco de teclado y el cambio de preferencia durante la visita. También verifican que la información siga visible sin JavaScript o sin `IntersectionObserver`. Las pruebas del mapa comparan la posición proyectada del marcador en las vistas plana y 3D.

## Evidencia visual

- [Recorrido en móvil](evidencia-movimiento/movil.webm), [captura de la ficha](evidencia-movimiento/ficha-movil.png) y [conector vertical](evidencia-movimiento/proceso-movil.png).
- [Recorrido en escritorio](evidencia-movimiento/escritorio.webm) y [captura del proceso](evidencia-movimiento/proceso-escritorio.png).

## Mediciones de laboratorio

Se comparó la exportación de `main` (`a3a842d`) con la versión de este PR. Se tomaron las medianas de tres sesiones nuevas por perfil en Edge con aceleración gráfica. El recorrido incluyó anclas, apertura de ficha, cambio de intención y modo de identificación, cierre y proceso. La etapa del mapa midió giro y zoom con cartografía de prueba reproducible.

| Medida | Escritorio antes | Escritorio después | Móvil antes | Móvil después |
| --- | ---: | ---: | ---: | ---: |
| CLS | 0,00047 | 0,00047 | 0,00060 | 0,00060 |
| Mayor latencia de interacción por sesión | 40 ms | 40 ms | 200 ms | 208 ms |
| Intervalo entre cuadros del recorrido, percentil 95 | 7,0 ms | 7,0 ms | 13,9 ms | 14,0 ms |
| Cadencia media del recorrido, callbacks rAF/s | 143,0 | 143,0 | 121,9 | 115,4 |
| Hilo principal ocupado durante el recorrido | 18,1 % | 20,8 % | 68,6 % | 77,2 % |
| Hilo principal ocupado durante la cámara | 21,0 % | 24,0 % | 61,2 % | 62,6 % |
| JavaScript inicial transferido, bytes | 593 443 | 593 954 | 593 443 | 593 954 |

Escritorio se midió a 1440 × 900. Para móvil se emularon 390 × 844, CPU cuatro veces más lenta, 120 ms de latencia y 4 Mbps de descarga. El hilo principal móvil estuvo más ocupado durante el recorrido. Las tres sesiones finales de móvil registraron máximos de interacción de 176, 216 y 208 ms. El CLS permaneció estable y el desbordamiento horizontal medido fue de 0 px.

Event Timing aproxima la respuesta del recorrido en laboratorio. El INP de campo queda pendiente de mediciones con visitantes reales. rAF mide la frecuencia de callbacks del navegador. El servidor local sirvió el JavaScript sin compresión. El recuento corresponde a las solicitudes de la página y excluye los workers del mapa. Las grabaciones muestran recorridos con movimiento habilitado. Las comparaciones visuales automatizadas usan capturas estables con animaciones desactivadas. [Resultados por perfil y etapa](evidencia-movimiento/comparativa-lab.json).

Para reproducir las comprobaciones del proyecto, ejecutar `npm run lint`, `npm run typecheck`, `npm run test:unit` y `npm run build`. Con la exportación servida en la URL de `PLAYWRIGHT_BASE_URL`, ejecutar `npm test -- --workers=1`. GitHub Actions compara las capturas con las referencias de Linux.
