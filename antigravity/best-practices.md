# 🏠 Best Practices — Next.js Real Estate

## 📁 Arquitectura
- Usa **App Router** (Next.js 13+). Server Components por defecto, `"use client"` solo cuando sea necesario
- Organiza por **feature/dominio**, no por tipo de archivo (`/properties`, `/search`, `/dashboard`)
- Usa **path aliases** (`@/`) en `tsconfig.json`
- **Barrel exports** (`index.ts`) en carpetas de componentes

## ⚡ Rendimiento
- Siempre `<Image>` de Next.js — nunca `<img>` nativo
- **ISR** con `revalidate` para propiedades que no cambian frecuentemente
- **Paginación server-side** — nunca cargar todas las propiedades en el cliente
- **Streaming con `<Suspense>`** para mostrar contenido parcial mientras el resto carga
- `next/font` para fuentes — evita layout shift
- Audita bundle con `@next/bundle-analyzer`

## 🔍 SEO (Crítico)
- `generateMetadata` dinámico por propiedad (título, descripción, Open Graph)
- **Slugs descriptivos**: `/properties/penthouse-polanco-cdmx` — nunca IDs numéricos
- **Schema.org** `RealEstateListing` con JSON-LD para rich snippets en Google
- `sitemap.ts` dinámico con todas las propiedades activas
- `robots.txt` bloqueando rutas de admin
- **Core Web Vitals**: LCP < 2.5s, CLS < 0.1, FID < 100ms

## 🗄️ Supabase
- **RLS habilitado** en todas las tablas — nunca deshabilitarlo en producción
- Genera tipos con `supabase gen types typescript` y versiónalos en el repo
- Instancias **separadas** de cliente para Server y Client Components
- Índices en columnas de filtro: `location`, `price`, `property_type`, `bedrooms`
- **Full Text Search** de PostgreSQL para el buscador (`tsvector` + `tsquery`)
- Usa `range()` para paginación — nunca `offset()` en tablas grandes
- **Soft deletes**: campo `deleted_at` o `status = 'archived'`, nunca borrar físicamente

## 🎨 UI/UX
- **Skeleton loaders** en listados — no spinners
- Filtros reflejados en la **URL como query params** (compartibles, compatibles con "atrás")
- **Mapa interactivo** (Mapbox / Google Maps) para ubicar propiedades
- **Galería con lightbox/fullscreen** — los usuarios quieren ver fotos en detalle
- **Calculadora de hipoteca** en página de detalle — aumenta engagement
- **Wishlist/Favoritos** con localStorage o cuenta de usuario
- **Mobile-first** — 60-70% del tráfico viene de móvil

## 🔒 Seguridad
- Variables con `NEXT_PUBLIC_` son visibles en el browser — nunca keys privadas
- **Server Actions** para todas las mutaciones (crear/editar/eliminar propiedades)
- **Validación en servidor** con Zod, aunque ya valides en el cliente
- **Rate limiting** en formularios de contacto y búsquedas
- **Sanitiza inputs** que se rendericen como HTML (descripciones rich text)

## 🧪 Calidad de Código
- `strict: true` en `tsconfig.json` — evita `any`
- ESLint (`eslint-config-next`) + Prettier en cada commit con Husky + lint-staged
- **Pruebas E2E con Playwright** en flujos críticos: búsqueda, detalle, contacto, admin

## 📊 Analytics
- Trackea eventos clave: `property_viewed`, `contact_initiated`, `property_saved`, `search_performed`
- **Sentry** para error tracking en producción
- **Vercel Analytics** para Core Web Vitals por deployment

## 💡 Features de Alto Impacto
- Alertas de email/push cuando se publica una propiedad con criterios del usuario
- Botón **WhatsApp flotante** con mensaje pre-escrito con nombre de la propiedad
- **Propiedades similares** en página de detalle (por precio y zona)
- **Blog de contenido** — mejora SEO orgánico y posiciona la marca como autoridad
- Soporte **i18n** con `next-intl` si el target incluye compradores extranjeros

## 📋 Checklist Pre-Producción
- [ ] Lighthouse > 90 en Performance, SEO y Accessibility
- [ ] Metadata única por propiedad y sitemap enviado a Google Search Console
- [ ] RLS activo en todas las tablas de Supabase
- [ ] Variables de entorno separadas por ambiente (dev / preview / prod)
- [ ] Sentry + Analytics configurados
- [ ] Formularios con validación y rate limiting
- [ ] E2E tests pasando
- [ ] Política de privacidad y aviso de cookies
