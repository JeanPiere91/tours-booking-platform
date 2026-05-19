# Historias de Usuario — Interfaz IPA Tours

## Información general

**Proyecto:** Sistema de reservas online para Inka Planet Adventure (IPA)
**Empresa:** Grupo M&M Viajes y Turismo S.A.C.
**Roles:** `Visitante` (público)
**Enfoque:** Diseño de interfaz y experiencia de usuario
**Total:** 9 HU en 2 épicas

---

## Épica 1 — Catálogo público de tours

### HU-01 · Ver listado de tours disponibles

> **Como** Visitante del sitio
> **quiero** ver todos los tours disponibles en una página
> **para** comparar opciones y encontrar el que se ajusta a mi viaje.

**Criterios de aceptación:**

1. La página `/tours` muestra una grilla con todos los tours disponibles.
2. Cada tarjeta de tour muestra:
   - Imagen representativa
   - Nombre del tour
   - Ruta (ej. Cusco → Machu Picchu)
   - Etiqueta destacada cuando aplica (Más vendido, Nuevo, Premium)
   - Duración (ej. "1 día completo", "10D/9N")
   - Descripción corta de 1-2 líneas
   - Precio "Desde USD XXX / persona"
   - Botón "Ver tour"
3. La página tiene un header con logo IPA, navegación principal y botón de WhatsApp.
4. La página tiene un hero con búsqueda rápida (destino, duración, fecha).
5. Si no hay tours disponibles, se muestra el mensaje *"Pronto agregaremos nuevos tours. Contáctanos por WhatsApp."* con CTA al WhatsApp de IPA.
6. Hover sobre la tarjeta produce un efecto sutil (elevación + sombra).

**Prioridad:** Alta — primera pantalla del flujo.

---

### HU-02 · Filtrar tours por categoría

> **Como** Visitante
> **quiero** filtrar el catálogo por categoría
> **para** encontrar rápidamente el tipo de tour que me interesa.

**Criterios de aceptación:**

1. Sobre la grilla de tours hay chips de filtro: `Todos`, `Machu Picchu`, `Valle Sagrado`, `Aventura`, `Día completo`, `Multi-día`.
2. Al hacer clic en un chip, el listado se actualiza al instante.
3. El chip activo se destaca visualmente (fondo marrón, texto blanco).
4. Solo se puede seleccionar un chip a la vez (excepto `Todos`).
5. Si un filtro no tiene resultados, se muestra mensaje *"No encontramos tours en esta categoría"*.

**Prioridad:** Media.

---

### HU-03 · Ver el detalle de un tour

> **Como** Visitante interesado en un tour
> **quiero** ver toda la información detallada
> **para** decidir si quiero reservarlo.

**Criterios de aceptación:**

1. La página de detalle muestra al inicio un breadcrumb: *Inicio › Tours › [Categoría] › [Nombre del tour]*.
2. Título del tour con metadatos (ubicación, duración, tipo de tren incluido, valoración con estrellas).
3. Galería de imágenes (1 grande + 4 pequeñas con indicador "+12 fotos" en la última).
4. Sección "Sobre este tour" con descripción larga.
5. Sección "Itinerario" con bloques por hora del día (hora destacada en naranja + título + descripción).
6. Sección "¿Qué incluye?" con dos columnas:
   - Columna izquierda: lista de inclusiones con check verde
   - Columna derecha: lista de exclusiones con cruz roja
7. Panel lateral derecho (sticky al hacer scroll) con el formulario de inicio de reserva:
   - Precio "Desde"
   - Selector de fecha
   - Selector de horario
   - Contadores de pasajeros (Adulto, Niño, Infante)
   - Resumen del total
   - Botón "Reservar este tour"

**Prioridad:** Alta.

---

## Épica 2 — Flujo de reserva

### HU-04 · Seleccionar fecha y cantidad de pasajeros

> **Como** Visitante que quiere reservar
> **quiero** elegir la fecha, el horario y la cantidad de pasajeros por categoría
> **para** ver el precio total calculado antes de continuar.

**Criterios de aceptación:**

1. Selector de fecha con calendario que no permite seleccionar fechas pasadas.
2. Selector de horario con las opciones definidas en el tour (ej. Mañana 04:30 / Tarde 13:30).
3. Tres contadores independientes con botones (−) y (+):
   - `Adulto` (12 años o más)
   - `Niño` (3 a 11 años)
   - `Infante` (0 a 2 años)
4. Al menos 1 adulto es obligatorio (el contador de adultos no baja de 1).
5. El precio total se actualiza en tiempo real cada vez que cambia un contador.
6. El desglose muestra: "X Adultos × USD XXX", "X Niños × USD XXX", Total estimado.
7. Botón *"Reservar este tour"* deshabilitado hasta que la selección sea válida (fecha + horario + al menos 1 pasajero).

**Prioridad:** Alta.

---

### HU-05 · Navegación entre pasos del flujo de reserva

> **Como** Visitante en proceso de reserva
> **quiero** ver claramente en qué paso del flujo estoy
> **para** saber cuánto falta para completar mi reserva.

**Criterios de aceptación:**

1. Al inicio de las pantallas de reserva hay un stepper con 4 pasos:
   - Paso 1: Tour y fecha (completado)
   - Paso 2: Pasajeros y extras (activo)
   - Paso 3: Contacto
   - Paso 4: Confirmación
2. Los pasos completados se muestran con check verde.
3. El paso actual se muestra destacado en naranja.
4. Los pasos pendientes se muestran en gris.
5. Hay botones de "Volver" y "Continuar" entre pasos.
6. La información ingresada en pasos anteriores se conserva si el usuario vuelve atrás.

**Prioridad:** Alta.

---

### HU-06 · Ingresar datos de cada pasajero

> **Como** Visitante en proceso de reserva
> **quiero** registrar los datos de cada pasajero
> **para** que la reserva quede a nombre de las personas correctas.

**Criterios de aceptación:**

1. Se renderiza un bloque por pasajero según las cantidades del paso anterior.
2. Cada bloque tiene un encabezado con el número, título y etiqueta de categoría:
   - *"Pasajero 1 — Titular"* (etiqueta "Adulto · 12+")
   - *"Pasajero 2"* (etiqueta "Adulto · 12+")
   - *"Pasajero 3"* (etiqueta "Niño · 3 a 11")
3. Los bloques se diferencian visualmente con bordes laterales de color:
   - Naranja para Adultos
   - Marrón para Niños
   - Gris para Infantes
4. Campos por pasajero: `nombres`, `apellidos`, `tipo de documento` (Pasaporte/DNI/Cédula), `número de documento`, `nacionalidad`.
5. Para niños e infantes se agrega el campo `fecha de nacimiento`.
6. Validaciones visibles: campos obligatorios marcados en rojo si quedan vacíos al avanzar.
7. Si falla alguna validación, se hace scroll automático al primer error.

**Prioridad:** Alta.

---

### HU-07 · Agregar servicios adicionales

> **Como** Visitante en proceso de reserva
> **quiero** elegir servicios adicionales para mi tour
> **para** personalizar mi experiencia.

**Criterios de aceptación:**

1. Lista de servicios opcionales presentados como tarjetas seleccionables.
2. Cada tarjeta muestra:
   - Ícono representativo
   - Nombre del servicio
   - Descripción corta
   - Precio (+ USD XX)
3. Ejemplos de servicios:
   - *Asiento ventana garantizado* (+USD 15 por pasajero)
   - *Almuerzo vegetariano* (+USD 35)
   - *Guía privado bilingüe* (+USD 80)
   - *Traslado hotel-estación* (+USD 25)
4. Al hacer clic en una tarjeta, esta cambia de estado a "seleccionada" (borde naranja + fondo claro).
5. El resumen lateral se actualiza al instante con cada servicio agregado.
6. Es opcional: se puede continuar sin seleccionar ningún servicio.
7. El resumen lateral indica qué servicios son "por pasajero" y cuáles son "por reserva".

**Prioridad:** Media.

---

### HU-08 · Ingresar datos de contacto y confirmar reserva

> **Como** Visitante en proceso de reserva
> **quiero** dejar mis datos de contacto y confirmar la reserva
> **para** completar el proceso.

**Criterios de aceptación:**

1. Campos del formulario de contacto:
   - `Email del titular` (obligatorio, formato válido)
   - `Teléfono con código de país` (obligatorio, mínimo 8 dígitos)
   - `Comentarios adicionales` (opcional, máximo 500 caracteres)
2. Checkbox obligatorio: *"Acepto los términos y condiciones y la política de privacidad de IPA"*.
3. El botón *"Confirmar reserva"* permanece deshabilitado hasta que email, teléfono y checkbox sean válidos.
4. Mensajes de validación visibles bajo cada campo cuando hay errores.
5. Al hacer clic en *"Confirmar reserva"*, aparece un spinner o estado de carga (botón no debe permitir doble clic).
6. El resumen lateral acompaña al usuario en este paso mostrando todo lo seleccionado.

**Prioridad:** Alta.

---

### HU-09 · Ver pantalla de confirmación de reserva

> **Como** Visitante que acaba de reservar
> **quiero** ver una pantalla de confirmación clara
> **para** tener certeza de que mi reserva quedó registrada.

**Criterios de aceptación:**

1. La pantalla muestra al centro:
   - Ícono de check verde grande en círculo
   - Título *"¡Tu reserva está confirmada!"*
   - Mensaje secundario *"Te hemos enviado todos los detalles a tu correo electrónico."*
2. Caja destacada con el código de reserva (ej. `IPA-2026-A8F3K2`) con borde punteado naranja.
3. Ticket completo con todos los detalles de la reserva:
   - Logo + nombre del tour
   - Fecha y hora
   - Cantidad y tipo de pasajeros
   - Servicios extra contratados
   - Punto de encuentro
   - Nombre del titular
   - Total pagado
4. Aviso con ícono de email: *"Confirmación enviada a [email]"*.
5. Dos botones de acción:
   - *"Descargar voucher PDF"* (secundario)
   - *"Contactar por WhatsApp"* (primario, marrón)

**Prioridad:** Alta — cierre del flujo.

---

## Resumen

**Total: 9 HU** repartidas en 2 épicas:

- **Catálogo público** (HU-01, 02, 03) → 3 historias
- **Flujo de reserva** (HU-04 al 09) → 6 historias

**Pantallas que conforman el sistema:**

1. Listado de tours (`/tours`)
2. Detalle de un tour (`/tours/:slug`)
3. Reserva — Paso 2: Pasajeros y servicios extras
4. Reserva — Paso 3: Contacto
5. Reserva — Paso 4: Confirmación

**Línea gráfica:**

- Naranja IPA `#E97817` (acento principal, CTAs)
- Marrón corporativo `#4A2C12` (tipografía y elementos sólidos)
- Crema `#FDF8F1` (fondos)
- Tipografías: **Fraunces** (títulos) + **Inter** (cuerpo)

**Fuera del alcance (versión actual):**

- Pantalla "Mi reserva" para consultar reserva existente
- Panel administrativo interno
- Pago en línea
- Múltiples idiomas (versión inicial en español)
