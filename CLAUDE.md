# CLAUDE.md — PEP Motors Website + CRM

> Instrucciones completas para el agente Claude Code. Leer TODO antes de escribir una sola línea de código.

---

## 🎯 RESUMEN DEL PROYECTO

Sitio web completo para **PEP Motors**, concesionario de autos usados y 0km.  
Stack actual: **HTML + CSS + JavaScript vanilla** (sin frameworks).  
Datos: **JSON files** como base de datos (simulando un backend, fácilmente migrable a PHP+MySQL después).  
Deploy: **GitHub Pages** (sitio estático).  
El panel de administrador debe permitir **control total** sobre todo el contenido del sitio.

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
pepmotors/
│
├── index.html                  # Home
├── catalogo.html               # Catálogo de vehículos
├── vehiculo.html               # Ficha individual de vehículo
├── financiacion.html           # Simulador de financiación
├── nosotros.html               # Sobre nosotros
├── contacto.html               # Contacto
│
├── admin/
│   ├── index.html              # Login del admin
│   ├── dashboard.html          # Panel principal
│   ├── vehiculos.html          # ABM de vehículos
│   ├── leads.html              # CRM - Gestión de leads
│   ├── clientes.html           # CRM - Clientes
│   ├── ventas.html             # Registro de ventas
│   ├── agenda.html             # Calendario / seguimiento
│   ├── reportes.html           # Estadísticas
│   └── configuracion.html      # Config general del sitio
│
├── assets/
│   ├── css/
│   │   ├── main.css            # Estilos sitio público
│   │   └── admin.css           # Estilos panel admin
│   ├── js/
│   │   ├── main.js             # JS global público
│   │   ├── catalogo.js         # Lógica de filtros y catálogo
│   │   ├── vehiculo.js         # Ficha de vehículo
│   │   ├── simulador.js        # Simulador de cuotas
│   │   ├── storage.js          # Capa de abstracción de datos (localStorage/JSON)
│   │   └── admin/
│   │       ├── auth.js         # Login y sesión
│   │       ├── dashboard.js
│   │       ├── vehiculos.js
│   │       ├── leads.js
│   │       ├── clientes.js
│   │       ├── ventas.js
│   │       ├── agenda.js
│   │       ├── reportes.js
│   │       └── configuracion.js
│   └── img/
│       └── logo.png            # Logo de PEP Motors
│
└── data/
    ├── vehiculos.json          # Inventario de vehículos
    ├── leads.json              # Leads / consultas
    ├── clientes.json           # Base de clientes
    ├── ventas.json             # Historial de ventas
    ├── agenda.json             # Eventos y tareas
    ├── usuarios.json           # Usuarios del admin
    └── config.json             # Configuración general del sitio
```

---

## 🎨 IDENTIDAD VISUAL

### Paleta de colores
```css
:root {
  --color-primary: #C8102E;       /* Rojo PEP - color principal */
  --color-primary-dark: #A00D24;  /* Rojo oscuro - hover */
  --color-black: #0A0A0A;         /* Negro casi puro */
  --color-dark: #1A1A1A;          /* Fondo oscuro */
  --color-dark-2: #242424;        /* Card oscura */
  --color-dark-3: #2E2E2E;        /* Bordes, separadores */
  --color-gray: #6B6B6B;          /* Texto secundario */
  --color-light-gray: #B0B0B0;    /* Texto terciario */
  --color-white: #F5F5F5;         /* Blanco suave */
  --color-pure-white: #FFFFFF;
  
  /* Semánticos */
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
  --color-info: #3B82F6;
}
```

### Tipografía
- **Display / Logo:** `Barlow Condensed` (700, 800) — potente, automotriz
- **Títulos:** `Barlow` (600, 700)
- **Cuerpo:** `Inter` (400, 500)
- Importar de Google Fonts

### Diseño general
- **Tema:** Oscuro (`#0A0A0A` base) con acentos rojo
- **Estética:** Premium, deportivo, moderno — NO genérico
- Cards con bordes sutiles y glassmorphism leve
- Transiciones suaves (0.2s-0.3s ease)
- Sombras rojizas en hover de elementos importantes
- Separadores con gradiente rojo

---

## 🌐 SITIO PÚBLICO — ESPECIFICACIONES

### `index.html` — HOME

**Secciones:**
1. **Navbar fija** con logo, links de navegación, botón "WhatsApp" y botón "Admin" (discreto)
2. **Hero** — pantalla completa con:
   - Frase de impacto: *"Tu próximo auto, a un click."*
   - Buscador rápido (marca, modelo, precio máx, condición: usado/0km)
   - Botón "Ver catálogo" y "Contactanos"
   - Imagen/video de fondo de auto
3. **Stats** — contador animado: N° de autos disponibles, años en el mercado, clientes satisfechos (datos desde `config.json`)
4. **Vehículos destacados** — 6 cards de vehículos con `destacado: true` en el JSON
5. **Financiación** — sección corta con propuesta de valor + CTA al simulador
6. **¿Querés vender tu auto?** — sección de tasación, formulario simple
7. **Testimonios** — array en `config.json`, editable desde admin
8. **Footer** — logo, links, redes sociales, dirección, teléfono (todo desde `config.json`)

---

### `catalogo.html` — CATÁLOGO

**Filtros (sidebar o top):**
- Condición: Todos / 0km / Usado
- Marca (select dinámico desde vehiculos.json)
- Modelo (select dinámico según marca)
- Año desde / hasta
- Precio desde / hasta (slider)
- Kilometraje máximo
- Combustible: Nafta / Diesel / Híbrido / Eléctrico
- Transmisión: Manual / Automática
- Color

**Listado:**
- Toggle vista grilla / lista
- Ordenar por: Precio ↑↓ / Más nuevo / Más reciente
- Paginación (12 por página)
- Contador: "Mostrando X de Y vehículos"

**Card de vehículo:**
- Foto principal (con badge "0KM" o "USADO")
- Marca + Modelo + Año
- Precio formateado en ARS
- Km, combustible, transmisión
- Botón "Ver más" → `vehiculo.html?id=XXX`
- Botón corazón para favoritos (localStorage)

---

### `vehiculo.html` — FICHA INDIVIDUAL

- Parámetro: `?id=` en URL
- **Galería de fotos** con thumbnails y zoom
- **Precio grande y visible**
- **Specs completas:** todos los campos del JSON
- **Descripción** del vehículo
- **Botones de acción:**
  - "Me interesa" → abre modal con formulario de lead
  - "Solicitar test drive" → abre modal con formulario + fecha
  - "Compartir" → WhatsApp / copiar link
- **Simulador de cuotas** integrado (versión reducida)
- **Vehículos similares** — 4 cards al pie

---

### `financiacion.html` — SIMULADOR

**Simulador completo:**
- Monto del vehículo (prellenado o manual)
- Entrada (%)
- Plazo: 12, 24, 36, 48, 60 cuotas
- Tasa de interés (configurable desde admin)
- Resultado: cuota estimada, total a pagar, costo financiero
- Aclaración legal pequeña

**Opciones de financiamiento** (contenido editable desde admin en `config.json`):
- Crédito prendario
- Plan de ahorro
- Leasing
- Contado (con descuento)

---

### `nosotros.html`
- Historia de la empresa (desde `config.json`)
- Equipo (array de personas con foto, nombre, cargo)
- Ubicación con embed de Google Maps
- Galería del local

### `contacto.html`
- Formulario: nombre, email, teléfono, mensaje → guarda en `leads.json`
- Datos de contacto (desde `config.json`)
- WhatsApp directo
- Mapa

---

## 🔒 PANEL ADMIN — ESPECIFICACIONES

> Todas las páginas del admin verifican autenticación al cargar.  
> Si no hay sesión activa → redirect a `admin/index.html`.

### `admin/index.html` — LOGIN

- Logo PEP Motors
- Formulario email + password
- Valida contra `usuarios.json`
- Guarda sesión en `sessionStorage`
- Rol guardado en sesión: `admin` / `gerente` / `vendedor`

---

### `admin/dashboard.html` — PANEL PRINCIPAL

**Widgets de resumen (datos en tiempo real del JSON):**
- Total vehículos disponibles
- Leads nuevos hoy
- Ventas del mes
- Test drives pendientes

**Accesos rápidos:** a cada módulo

**Actividad reciente:** últimos 10 leads, últimas ventas

**Gráfico:** Leads por día (últimos 7 días) — con Chart.js

---

### `admin/vehiculos.html` — INVENTARIO (ABM COMPLETO)

**Tabla** con todos los vehículos + búsqueda y filtros.

**Formulario de ALTA/EDICIÓN de vehículo (modal o página):**

```
DATOS BÁSICOS
- Condición: 0km / Usado (select)
- Marca (text)
- Modelo (text)
- Versión (text)
- Año (number)
- Color (text)

MOTOR Y MECÁNICA
- Kilometraje (number)
- Combustible (select: Nafta, Diesel, Híbrido, Eléctrico, GNC)
- Transmisión (select: Manual, Automática)
- Motor (text: ej. "1.6 16V")
- Potencia (text: ej. "116 CV")
- Tracción (select: Delantera, Trasera, 4x4)
- Puertas (select: 2, 3, 4, 5)

PRECIOS
- Precio de venta (ARS) — número
- Precio de costo (ARS) — número (solo visible para admin/gerente)
- ¿Acepta permutas? (checkbox)
- ¿Financiable? (checkbox)

ESTADO
- Estado (select: Disponible, Reservado, Vendido, En revisión)
- ¿Destacado en home? (checkbox)

FOTOS
- Upload múltiple de imágenes (guardadas como base64 en el JSON o paths)
- Reordenar fotos (drag & drop)
- Foto principal (marcar una como principal)

DESCRIPCIÓN
- Textarea libre para descripción del vehículo

EQUIPAMIENTO
- Checkboxes: Aire acondicionado, Dirección hidráulica, Vidrios eléctricos,
  Cierre centralizado, ABS, Airbag, Alarma, Tapizado de cuero,
  Techo solar, Bluetooth, Pantalla táctil, Cámara trasera, Sensores de estacionamiento
  (array guardado en JSON)

DATOS TÉCNICOS EXTRA
- N° de dominio (texto)
- N° de chasis (texto)
- Observaciones internas (textarea, no visible al público)
```

**Acciones en tabla:**
- Editar → abre modal/formulario
- Eliminar → confirm dialog
- Ver en sitio → abre `vehiculo.html?id=X`
- Duplicar
- Cambiar estado rápido (dropdown inline)

---

### `admin/leads.html` — CRM LEADS

**¿Qué es un lead?**  
Cualquier persona que consultó por un vehículo o dejó sus datos.  
Los leads entran desde: formulario del sitio, carga manual.

**Tabla de leads con columnas:**
- Nombre
- Teléfono / Email
- Vehículo de interés
- Fuente (Web, WhatsApp, Instagram, Referido, Llamada, Presencial)
- Estado (badge coloreado)
- Fecha
- Vendedor asignado
- Acciones

**Estados posibles (pipeline):**
```
🔵 Nuevo → 🟡 Contactado → 🟠 En negociación → 🟢 Cerrado ✅ / 🔴 Perdido ❌
```

**Kanban board** — vista alternativa a la tabla, columnas por estado drag & drop.

**Modal de detalle de lead:**
- Todos los datos del lead
- Historial de interacciones (notas, llamadas, mensajes)
- Agregar nota/actividad
- Cambiar estado
- Asignar a vendedor
- Convertir a cliente (si se cierra la venta)

**Alta manual de lead:**
- Formulario completo con todos los campos

---

### `admin/clientes.html` — CLIENTES

**Tabla** de clientes con búsqueda.

**Ficha de cliente:**
- Datos personales: nombre, apellido, DNI, email, teléfono, dirección
- Historial de vehículos consultados (links a los leads)
- Historial de compras (links a ventas)
- Notas

---

### `admin/ventas.html` — VENTAS

**Tabla** con historial de ventas cerradas.

**Registro de venta:**
- Vehículo vendido (select desde inventario → solo disponibles)
- Cliente (select o crear nuevo)
- Fecha de venta
- Precio final de venta (puede diferir del precio lista)
- Forma de pago: Contado / Financiado / Plan de ahorro / Permuta + diferencia
- Vendedor (select)
- Observaciones

Al registrar una venta:
- El vehículo cambia automáticamente a estado "Vendido"
- El lead asociado cierra como "Cerrado"

---

### `admin/agenda.html` — AGENDA

**Vista de calendario mensual** (implementar con FullCalendar.js o propio).

**Tipos de eventos:**
- Test drive (cliente, vehículo, horario)
- Seguimiento de lead (recordatorio)
- Tarea general

**Lista de tareas pendientes** del día actual.

**Agregar evento** desde botón flotante.

---

### `admin/reportes.html` — REPORTES

**Métricas (con Chart.js):**
- Vehículos vendidos por mes (bar chart)
- Leads por fuente (pie chart)
- Conversión de leads (funnel: total → contactados → negociación → cerrados)
- Ingresos por mes vs costo → margen
- Ranking de vendedores (tabla)
- Stock disponible por marca (bar chart)

**Filtro de período:** Este mes / Último trimestre / Este año / Custom

---

### `admin/configuracion.html` — CONFIGURACIÓN GENERAL ⭐

> Este es el módulo más importante para el "control total".  
> Todo lo que aparece en el sitio público sale de aquí.

**Secciones:**

**🏢 Datos de la empresa**
- Nombre del negocio
- Slogan / frase del hero
- Dirección
- Teléfono
- WhatsApp (número para botón flotante)
- Email de contacto
- Horario de atención

**📱 Redes sociales**
- Instagram URL
- Facebook URL
- TikTok URL
- YouTube URL

**🗺️ Ubicación**
- Embed URL de Google Maps (copiar iframe src)

**🏠 Home — Contenido editable**
- Frase principal del hero (H1)
- Frase secundaria del hero (párrafo)
- Estadísticas: años en el mercado, clientes satisfechos (el de "vehículos disponibles" es automático)
- Activar/desactivar secciones de la home (checkboxes)

**💰 Financiación**
- Tasa de interés por defecto del simulador (%)
- Plazos disponibles (checkboxes: 12, 24, 36, 48, 60)
- Texto de las opciones de financiamiento (textarea por opción)

**💬 Testimonios**
- Lista de testimonios: nombre, cargo, texto, estrellitas
- Agregar / editar / eliminar testimonios

**👥 Equipo**
- Lista de personas: nombre, cargo, foto URL
- Agregar / editar / eliminar

**🎨 Apariencia**
- Color primario (color picker) — cambia el rojo en todo el sitio
- Logo del sitio (upload)

**👤 Usuarios del admin**
- Lista de usuarios: nombre, email, rol, activo/inactivo
- Cambiar password
- Agregar nuevo usuario

---

## 💾 ESTRUCTURA DE DATOS JSON

### `data/vehiculos.json`
```json
[
  {
    "id": "v001",
    "condicion": "usado",
    "marca": "Toyota",
    "modelo": "Corolla",
    "version": "XEI 2.0",
    "anio": 2021,
    "color": "Blanco Perlado",
    "km": 45000,
    "combustible": "nafta",
    "transmision": "automatica",
    "motor": "2.0 Dual VVT-i",
    "potencia": "170 CV",
    "traccion": "delantera",
    "puertas": 4,
    "precio": 25000000,
    "precio_costo": 21000000,
    "acepta_permuta": true,
    "financiable": true,
    "estado": "disponible",
    "destacado": true,
    "fotos": ["base64_o_path_1", "base64_o_path_2"],
    "foto_principal": 0,
    "descripcion": "Excelente estado, único dueño...",
    "equipamiento": ["aire_acondicionado", "bluetooth", "camara_trasera"],
    "dominio": "AB123CD",
    "chasis": "XXXXXXXXX",
    "obs_internas": "Llegó con rayón en paragolpes, ya reparado.",
    "fecha_ingreso": "2025-03-15",
    "fecha_venta": null
  }
]
```

### `data/leads.json`
```json
[
  {
    "id": "l001",
    "nombre": "Carlos García",
    "email": "carlos@mail.com",
    "telefono": "1155556666",
    "vehiculo_id": "v001",
    "vehiculo_texto": "Toyota Corolla 2021",
    "fuente": "web",
    "estado": "nuevo",
    "vendedor_id": "u002",
    "fecha_creacion": "2025-04-01T10:30:00",
    "ultima_actividad": "2025-04-01T10:30:00",
    "historial": [
      {
        "fecha": "2025-04-01T10:30:00",
        "tipo": "consulta_web",
        "nota": "Consultó por el Corolla desde la ficha del vehículo."
      }
    ],
    "notas": ""
  }
]
```

### `data/clientes.json`
```json
[
  {
    "id": "c001",
    "nombre": "Carlos",
    "apellido": "García",
    "dni": "30123456",
    "email": "carlos@mail.com",
    "telefono": "1155556666",
    "direccion": "Av. Rivadavia 1234, CABA",
    "fecha_creacion": "2025-04-01",
    "leads_ids": ["l001"],
    "ventas_ids": [],
    "notas": ""
  }
]
```

### `data/ventas.json`
```json
[
  {
    "id": "vta001",
    "vehiculo_id": "v001",
    "vehiculo_texto": "Toyota Corolla XEI 2021",
    "cliente_id": "c001",
    "cliente_nombre": "Carlos García",
    "fecha_venta": "2025-04-10",
    "precio_lista": 25000000,
    "precio_final": 24500000,
    "forma_pago": "financiado",
    "vendedor_id": "u002",
    "observaciones": ""
  }
]
```

### `data/usuarios.json`
```json
[
  {
    "id": "u001",
    "nombre": "Admin PEP",
    "email": "admin@pepmotors.com",
    "password": "hashed_or_plain_for_demo",
    "rol": "admin",
    "activo": true
  },
  {
    "id": "u002",
    "nombre": "Vendedor 1",
    "email": "vendedor1@pepmotors.com",
    "password": "1234",
    "rol": "vendedor",
    "activo": true
  }
]
```

### `data/config.json`
```json
{
  "empresa": {
    "nombre": "PEP Motors",
    "slogan": "Tu próximo auto, a un click.",
    "hero_titulo": "Encontrá tu auto ideal",
    "hero_subtitulo": "Amplio stock de vehículos 0km y usados con la mejor financiación.",
    "direccion": "Av. Ejemplo 1234, Buenos Aires",
    "telefono": "+54 11 1234-5678",
    "whatsapp": "5491112345678",
    "email": "info@pepmotors.com",
    "horario": "Lun-Sáb 9:00 a 18:00",
    "maps_embed": "https://maps.google.com/maps?...",
    "stats_anios": 10,
    "stats_clientes": 500
  },
  "redes": {
    "instagram": "https://instagram.com/pepmotors",
    "facebook": "",
    "tiktok": "",
    "youtube": ""
  },
  "apariencia": {
    "color_primario": "#C8102E",
    "logo_url": "assets/img/logo.png"
  },
  "financiacion": {
    "tasa_interes": 65,
    "plazos": [12, 24, 36, 48, 60],
    "opciones": [
      { "titulo": "Crédito Prendario", "descripcion": "Financiá hasta el 70% del valor..." },
      { "titulo": "Plan de Ahorro", "descripcion": "Accedé a tu 0km desde..." }
    ]
  },
  "testimonios": [
    {
      "nombre": "María López",
      "texto": "Excelente atención, encontré el auto que buscaba.",
      "estrellas": 5
    }
  ],
  "equipo": [
    {
      "nombre": "Pedro Pérez",
      "cargo": "Gerente Comercial",
      "foto": ""
    }
  ],
  "secciones_home": {
    "destacados": true,
    "financiacion": true,
    "tasacion": true,
    "testimonios": true
  }
}
```

---

## ⚙️ LÓGICA DE DATOS — `storage.js`

Este archivo es el **único punto de contacto con los datos**. Toda lectura/escritura va por acá.

```javascript
// Para GitHub Pages (estático), los JSON se cargan via fetch
// Para el admin, los cambios se guardan en localStorage (simulando escritura)
// Al migrar a PHP, solo se reemplaza este archivo

const Storage = {
  async get(key) { /* fetch data/[key].json + merge localStorage */ },
  async set(key, data) { /* guarda en localStorage */ },
  async add(key, item) { /* agrega item al array */ },
  async update(key, id, changes) { /* actualiza item por id */ },
  async delete(key, id) { /* elimina item por id */ },
  generateId(prefix) { /* genera ID único */ }
}
```

**IMPORTANTE:** Los JSONs en `/data/` son los datos iniciales de demo.  
El admin guarda cambios en `localStorage` bajo la key `pep_[nombre].json`.  
Al cargar, se hace merge: localStorage tiene prioridad sobre el JSON.  
Esto permite que el admin funcione en GitHub Pages sin backend.

---

## 🛡️ AUTENTICACIÓN ADMIN

- Sin backend real, la autenticación es contra `usuarios.json`
- Sesión guardada en `sessionStorage` como `{ id, nombre, rol, activo }`
- Cada página admin tiene al inicio:
```javascript
const session = sessionStorage.getItem('pep_session');
if (!session) window.location.href = '/admin/index.html';
```
- Los roles controlan qué ven: precio de costo solo para `admin`/`gerente`

---

## 📋 PERMISOS POR ROL

| Feature | Admin | Gerente | Vendedor |
|---|---|---|---|
| Ver/editar vehículos | ✅ | ✅ | Solo ver |
| Ver precio de costo | ✅ | ✅ | ❌ |
| CRM Leads | ✅ | ✅ | Solo los propios |
| Clientes | ✅ | ✅ | Solo los propios |
| Ventas | ✅ | ✅ | Solo las propias |
| Reportes | ✅ | ✅ | ❌ |
| Configuración | ✅ | ❌ | ❌ |
| Usuarios | ✅ | ❌ | ❌ |

---

## 🔔 NOTIFICACIONES / UX ADMIN

- Todas las acciones (guardar, eliminar, etc.) muestran un **toast** (arriba derecha)
- Confirmación con modal antes de eliminar cualquier cosa
- Formularios con validación inline
- Loading skeleton en tablas mientras cargan datos
- Sidebar colapsable en mobile

---

## 📱 RESPONSIVE

- Sitio público: 100% mobile-first
- Admin: funcional en tablet/desktop; en mobile sidebar se colapsa a hamburger

---

## 🔌 LIBRERÍAS EXTERNAS (CDN, sin npm)

```html
<!-- Íconos -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lucide-static@latest/font/lucide.css">
<!-- O usar Font Awesome Free -->

<!-- Gráficos (solo en admin/reportes.html) -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<!-- Tipografías -->
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@400;500;600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">

<!-- Calendario (solo en admin/agenda.html) -->
<!-- Implementar propio simple o usar FullCalendar si es necesario -->
```

---

## ✅ ORDEN DE CONSTRUCCIÓN RECOMENDADO

1. `storage.js` — la base de todo
2. `data/*.json` — datos de demo realistas (mínimo 8 vehículos variados)
3. `assets/css/main.css` + `assets/css/admin.css`
4. `admin/index.html` + `admin/auth.js` — login funcional
5. `admin/dashboard.html` — panel principal
6. `admin/vehiculos.html` — ABM completo ⭐
7. `admin/configuracion.html` — config del sitio ⭐
8. `admin/leads.html` — CRM
9. `index.html` — home pública (consume config.json + vehiculos.json)
10. `catalogo.html` + `catalogo.js`
11. `vehiculo.html` + `vehiculo.js`
12. `financiacion.html` + `simulador.js`
13. `nosotros.html` + `contacto.html`
14. `admin/clientes.html`
15. `admin/ventas.html`
16. `admin/agenda.html`
17. `admin/reportes.html`
18. Pulido final: animaciones, responsive, edge cases

---

## ⚠️ REGLAS ABSOLUTAS

1. **CERO placeholders.** Todo funciona. Datos de demo reales y coherentes.
2. **CERO frameworks JS** (no React, no Vue). Vanilla JS puro.
3. **CERO dependencias npm.** Solo CDN en `<script>` tags.
4. **Archivos completos.** Nunca entregar archivos incompletos o con `// TODO`.
5. **El admin tiene control total** — si algo se muestra en el sitio público, debe poder editarse desde admin/configuracion.html o el módulo correspondiente.
6. **Consistencia visual** — mismo design system en todas las páginas, sin excepciones.
7. **El logo de PEP Motors** (imagen subida) debe aparecer en navbar y footer.
8. **Formato de precios** siempre en ARS con separador de miles: `$25.000.000`.
9. **Formularios del sitio público** → siempre guardan lead en `leads.json` vía Storage.
10. **Mobile first** en el sitio público. Admin puede ser desktop-first.

---

## 🚀 FUTURO (fase 2 — no implementar ahora, pero diseñar pensando en esto)

- Migrar `storage.js` para hacer fetch a endpoints PHP en lugar de localStorage
- Upload real de fotos (PHP `move_uploaded_file`)
- Envío real de emails (PHPMailer)
- Integración con MercadoPago para reservas
- Publicación automática a MercadoAutos / Autocosmos API
- PWA / notificaciones push para leads nuevos
