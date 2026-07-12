# Alternadores y Arrancadores Río Segundo — Sitio Web

Sitio web profesional, responsive y orientado a conversión para **Taller y Repuestos
Eléctricos Río Segundo** (Alajuela, Costa Rica). Construido con **Next.js 14 (App Router),
TypeScript y Tailwind CSS**.

---

## 🚀 Instalación y ejecución

Requisitos: **Node.js 18.17+** (probado con Node 22).

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local   # y completa los valores

# 3. Ejecutar en desarrollo
npm run dev                  # http://localhost:3000

# 4. Compilar para producción
npm run build
npm run start
```

---

## 🔑 Variables de entorno

Ver `.env.example`. Las principales:

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública (SEO, sitemap, Open Graph) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` | Envío del formulario por correo |
| `CONTACT_TO_EMAIL` | Correo que recibe los mensajes del formulario |
| `NEXT_PUBLIC_GA_ID` | (Opcional) Google Analytics |

El formulario funciona sin configuración (registra en consola). Para envío real, descomenta el
snippet de **nodemailer** en `app/api/contact/route.ts` e instala `npm i nodemailer`.

---

## 📁 Estructura

```
app/
  layout.tsx        → metadata SEO, fuentes, JSON-LD (negocio local)
  page.tsx          → composición de la landing
  api/contact/      → endpoint del formulario
  sitemap.ts        → sitemap.xml automático
  robots.ts         → robots.txt automático
  privacidad|terminos|cookies/ → páginas legales
components/         → Header, Hero, Services, About, WhyUs, Process,
                     Gallery, Testimonials, Faq, Contact, Footer, WhatsAppFloat
  ui/               → Icon, Logo (SVG inline, sin dependencias)
data/site.ts        → ⭐ FUENTE ÚNICA DE VERDAD (edita aquí los textos y datos)
lib/whatsapp.ts     → generador de enlaces de WhatsApp
```

> **Para actualizar textos, teléfonos, servicios o FAQ:** edita únicamente
> [`data/site.ts`](data/site.ts). Los componentes se alimentan de ahí.

---

## ✅ Qué incluye

- Diseño **mobile-first**, responsive y accesible (skip-link, ARIA, foco visible,
  `prefers-reduced-motion`).
- **Header fijo** con menú móvil y navegación por anclas.
- **Botón flotante de WhatsApp** con mensaje prellenado.
- **Formulario** con validación, honeypot anti-spam y estados carga/éxito/error.
- **SEO**: título, meta description, Open Graph, Twitter Card, JSON-LD `AutoRepair`,
  sitemap y robots.
- Paleta e identidad propias (azul eléctrico + ámbar “chispa”).

---

## 📌 Pendiente del propietario (placeholders `TODO(owner)`)

1. **Logo oficial** → `public/logo.svg` y actualizar `components/ui/Logo.tsx`.
2. **Fotos reales** → `public/gallery/` (taller, productos, trabajos) + `public/hero.jpg`.
3. **Imagen Open Graph** → `public/og-image.jpg` (1200×630).
4. **Horario real** de atención → `data/site.ts`.
5. **Testimonios reales** (Google/Facebook) → `components/Testimonials.tsx`.
6. **Precios, garantía, envíos y medios de pago** → `data/site.ts` (FAQ) y páginas legales.
7. **Coordenadas exactas** para el mapa → `data/site.ts`.
8. Revisión legal de Privacidad/Términos/Cookies (Ley N.° 8968, Costa Rica).

---

## ☁️ Publicación recomendada

**Vercel** (creadores de Next.js, plan gratuito suficiente):

1. Sube el proyecto a GitHub.
2. Importa el repo en [vercel.com](https://vercel.com).
3. Define las variables de entorno en el panel de Vercel.
4. Conecta el dominio `alternadoresyarrancadoresrio2.com` (DNS).

Alternativas: Netlify, o cualquier hosting con Node. Para envío de correo en serverless,
usa **Resend** o un SMTP externo.
