# Análisis del MVP vendible: AutoControl Car Wash

## Resumen ejecutivo

El HTML original resuelve una primera versión útil para que **un encargado de un car wash registre operaciones diarias**. Todavía no es una plataforma que el dueño del producto pueda administrar para varios clientes: los catálogos están escritos en el código, cada cuenta se aprovisiona por su cuenta y no hay panel central, suscripciones, onboarding ni operación de soporte.

La propuesta de **S/ 100 de implementación y S/ 20 mensuales** se puede presentar como un piloto de control operativo, no como un sistema contable ni como una solución SUNAT. Para que la mensualidad se perciba como servicio, debe incluir beneficios recurrentes verificables —respaldo, soporte, ajustes de catálogos, continuidad y mejoras— y no solo “mantenimiento” indefinido.

## Qué hace hoy el prototipo

El HTML `autocontrol_carwash_supabase.html` y su migración Vue contemplan:

- Registro e inicio de sesión por correo y contraseña con Supabase Auth.
- Creación o recuperación de un negocio asociado a la cuenta autenticada.
- Registro de ventas por fecha, importe, servicio, vehículo, método de pago y nota.
- Registro de gastos por fecha, importe, categoría, método de pago y descripción.
- Resumen diario de ventas, gastos, saldo operativo y efectivo esperado.
- Cierre de caja con efectivo inicial, efectivo contado y diferencia.
- Consulta de movimientos por fecha y tipo, eliminación y descarga CSV.
- Persistencia en Supabase; el acceso a datos depende de que las tablas y políticas RLS estén correctamente configuradas.

La interfaz tiene formularios con validación básica y el diseño ya contempla anchos pequeños. La migración Vue agrega componentes por dominio, tipos TypeScript, Pinia, estados visibles de autenticación y operaciones, y una lista de movimientos en tarjetas para móvil.

## Análisis competitivo y posicionamiento

### Alcance y método

Revisión de páginas públicas de producto y una ficha de Google Play, consultadas el **23 de octubre de 2026**. Es un panorama competitivo útil para preparar el piloto, no un censo exhaustivo de proveedores ni una investigación de adopción en Perú. Las funciones descritas abajo son las que sus propios proveedores o la ficha de la aplicación anuncian; no equivalen a una prueba independiente del producto. No se encontró una tarifa pública verificable para comparar planes equivalentes. La disponibilidad, el soporte local, las condiciones comerciales y los precios deben confirmarse directamente con cada proveedor.

### Alternativas relevantes

| Alternativa                                            | Lo que anuncia la fuente consultada                                                                                                                                                                                                                                                                    | Relación con AutoControl                                                                                                                        | Lectura comercial                                                                                                                                                                                                                                     |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Car Wash Solutions** (Android, ficha de Google Play) | Órdenes, clientes, servicios y precios, gastos, caja, reportes, pagos Yape/Plin, personal y comisiones, promociones, fotos, exportación PDF/Excel y varios usuarios. [Ficha de Google Play](https://play.google.com/store/apps/details?id=com.jhsoft.carwash&hl=es_PE).                                | Es la referencia más directa: ya cubre varios flujos que AutoControl quiere resolver y anuncia un alcance más amplio.                           | **Competencia directa alta por funcionalidad.** No sería creíble vender como diferencial únicamente “registrar ingresos y gastos desde el celular”. Su precio, adopción local y condiciones de soporte no se pudieron verificar en la ficha revisada. |
| **Washify / DRB**                                      | Planes de lavado ilimitado con cobro mensual automático, inscripción y gestión autoservicio, integración con POS/puntos de pago e identificación de vehículos por RFID o reconocimiento de placas. [Página de Washify en DRB](https://drb.com/tunnel_solutions/point-of-sale/washify?from=washifycom). | Referencia de una operación más automatizada, con membresías y tecnología física; no es una comparación de precio o alcance equivalente al MVP. | Señala una posible evolución de la industria hacia ingresos recurrentes y automatización. No conviene intentar replicar RFID, reconocimiento de placas ni cobros recurrentes en el primer piloto. Precio y requisitos comerciales no verificados.     |
| **Rinsed**                                             | Un testimonio publicado en su sitio describe recorridos de clientes según membresía, gestión de cuentas e interacciones centralizadas. [Sitio de Rinsed](https://www.rinsed.com/).                                                                                                                     | Referencia de CRM y relación con clientes, más que de una libreta de caja sencilla.                                                             | Puede inspirar una fase posterior de retención, historial de cliente y membresías. La cita es un testimonio del proveedor, no una evaluación independiente; precio y disponibilidad local no verificados.                                             |
| **EverWash**                                           | Su sitio para socios destaca membresías, marketing, tecnología e interacción con clientes; también publica testimonios de operadores. [Sitio para socios de EverWash](https://everwashpartners.com/).                                                                                                  | Referencia de programas de membresía y crecimiento/retención, no una alternativa equivalente al registro diario del MVP.                        | Muestra que la membresía puede ser una oferta especializada separada. Las cifras de crecimiento son afirmaciones testimoniales del sitio y no deben presentarse como resultados garantizados. Precio y adecuación al primer cliente no verificados.   |
| **Papel, hojas de cálculo y mensajería**               | Sustitutos operativos que el negocio puede mantener con sus herramientas existentes; no se hizo una medición de uso ni de costos de cada negocio.                                                                                                                                                      | Alternativa probable cuando la operación es pequeña y el dueño ya controla la caja manualmente.                                                 | La venta debe demostrar ahorro de tiempo, trazabilidad y facilidad de consulta frente al proceso real del cliente; no basta con comparar una lista de funciones. Validar en entrevista qué usa hoy.                                                   |

### Conclusiones para la propuesta

1. **No afirmar que AutoControl es el único producto móvil que registra gastos o ingresos de car wash.** La ficha de Car Wash Solutions ya anuncia ventas/órdenes, gastos, caja, reportes, Yape/Plin y exportaciones, además de funciones adicionales.
2. **Competir por ajuste y servicio, no por cantidad de funciones.** Para un auto car pequeño, la oportunidad a validar es un flujo simple para registrar cada lavado y gasto, entender el efectivo del día, consultar fechas y recibir ayuda de configuración en español. Hoy esto es una hipótesis de posicionamiento, no una ventaja competitiva demostrada.
3. **Demostrar el resultado en el teléfono del cliente.** En la presentación, registrar un lavado, un gasto y un cierre; luego filtrar un período y descargarlo. Preguntar qué parte de su proceso actual reemplaza y cuánto tiempo le toma.
4. **Mantener el alcance menor que el de las plataformas verticales.** Membresías con pagos recurrentes, CRM, identificación de vehículos, inventario, nómina y marketing no son requisito para validar el control diario de caja.
5. **No usar “más barato que la competencia” como argumento comprobado.** No se verificaron precios comparables ni costos totales de instalación, hardware, soporte o pagos. S/ 100 + S/ 20 al mes es una oferta propia que debe validarse con el cliente, no una comparación de mercado.
6. **Vender explícitamente el servicio recurrente.** La mensualidad debe asociarse a soporte delimitado, continuidad y mejoras que realmente se presten. No prometer panel de administración, catálogos autogestionables, respaldos restaurables o atención ilimitada antes de implementarlos y probarlos.

### Lectura del precio propuesto

Con S/ 100 de implementación y S/ 20 mensuales, el desembolso del primer año sería **S/ 340** (S/ 100 + 12 × S/ 20); la renovación anual sería **S/ 240**, sin contar impuestos, infraestructura ni horas de soporte. A S/ 20 mensuales, dedicar 30 minutos de soporte equivale a S/ 40 por hora bruta; dedicar una hora equivale a S/ 20 por hora bruta. Es un cálculo de ingresos antes de costos, no una estimación de rentabilidad. Define por escrito el canal y horario de atención, el tiempo de respuesta, los cambios incluidos y qué cubre el pago.

### Fuentes revisadas

- S1 — [Car Wash Solutions, ficha de Google Play](https://play.google.com/store/apps/details?id=com.jhsoft.carwash&hl=es_PE): funciones anunciadas por la aplicación; consultada el 23-10-2026.
- S2 — [Washify, página de producto de DRB](https://drb.com/tunnel_solutions/point-of-sale/washify?from=washifycom): membresías, cargos recurrentes, autoservicio e identificación de vehículos; consultada el 23-10-2026.
- S3 — [Rinsed, sitio oficial](https://www.rinsed.com/): testimonio sobre membresías, cuentas e interacciones de clientes; consultado el 23-10-2026.
- S4 — [EverWash Partners, sitio oficial](https://everwashpartners.com/): descripción y testimonios sobre membresías y marketing; consultado el 23-10-2026.

## Alcance funcional confirmado para el primer producto

El objetivo del MVP es ayudar al negocio a responder cuatro preguntas operativas: cuánto ingresó por lavados, cuánto gastó, qué movimientos ocurrieron y qué registros puede guardar o compartir.

### Ingresos por lavados

- Registrar fecha, importe, tipo de servicio, tipo de vehículo, método de pago y una nota opcional.
- Mostrar el agregado diario y cómo contribuye al efectivo esperado si el pago fue en efectivo.
- Confirmar visualmente guardado o mostrar el error del servicio; bloquear envíos repetidos mientras el registro está en curso.

### Gastos diarios

- Registrar fecha, importe, categoría, método de pago y descripción opcional.
- Restar los gastos pagados en efectivo del efectivo esperado del día.
- Mantener su estado de guardado y error independiente del formulario de ventas.

### Listado, filtros, paginación y descarga

- Consultar ingresos y gastos en una sola cronología, más filtros para ver todos, solo ingresos o solo gastos.
- Filtrar por fechas Desde/Hasta, permitir cualquiera de los extremos vacío y avisar si el inicio es posterior al final.
- Paginar en lotes seleccionables de 10, 20 o 50 resultados; representar cada página como tarjetas en pantallas pequeñas y tabla en pantallas amplias.
- Descargar un CSV de **todos los resultados que cumplen los filtros**, no solo la página visible.
- Mostrar estados de carga al refrescar y estado vacío solo cuando la búsqueda terminó sin coincidencias.

La paginación actual es del lado del cliente porque el prototipo recupera el historial completo del negocio. Es suficiente para el piloto mientras el volumen sea bajo; antes de escalar a historiales grandes, la lectura deberá paginarse en Supabase y combinar correctamente ventas y gastos por fecha.

### Estados de interfaz que no se deben omitir

- Al abrir: verificar sesión, mostrar preparación y comunicar errores de configuración o sesión.
- Al iniciar sesión o crear cuenta: deshabilitar acciones duplicadas, cambiar el texto del botón a “Ingresando…”/“Creando cuenta…” y entrar al panel cuando se resuelva la operación.
- Al cargar o actualizar datos: indicar espera; al fallar, mostrar error visible y no afirmar que la lista se actualizó.
- En cada alta, cierre, eliminación y cierre de sesión: estado ocupado propio, confirmación o error explícito y recuperación de controles.
- En móviles: botones táctiles, campos de ancho completo, filtros apilados, listado en tarjetas y sin depender de una tabla ancha.

## Diferencia entre la versión actual y un producto vendible

| Área                         | Situación actual                                                                              | Necesario para vender y operar con confianza                                                                                                                      |
| ---------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Administración del proveedor | No hay panel central para el dueño de AutoControl.                                            | Un rol de operador/superadministrador para crear clientes, activar/suspender cuentas y administrar catálogos globales o por negocio.                              |
| Catálogos                    | Servicios, vehículos, gastos y pagos son opciones fijas en el frontend.                       | Catálogos administrables desde el panel, con valores activos/inactivos y posibilidad de personalización por cliente.                                              |
| Clientes y suscripciones     | No hay ciclo de alta, vencimiento ni estado de servicio.                                      | Ficha de cliente, fecha de inicio, estado, plan, próxima renovación y recordatorios. El cobro puede controlarse manualmente al comienzo.                          |
| Accesos del cliente          | Hay una cuenta Supabase y un negocio por propietario; no hay gestión de empleados o permisos. | Invitación de usuarios, roles sencillos (dueño/encargado) y recuperación de acceso probada.                                                                       |
| Aislamiento de información   | El frontend filtra por negocio, pero eso no sustituye las políticas de seguridad.             | RLS comprobada para cada tabla y pruebas que demuestren que un cliente nunca ve ni modifica datos de otro. No exponer credenciales privilegiadas en el navegador. |
| Informes                     | Resumen del día, filtros y exportación CSV.                                                   | Informes por semana/mes, desglose por servicio y método de pago, y exportación con filtros que coincidan con lo visible.                                          |
| Continuidad y soporte        | La app depende de conexión y no define respaldo o soporte.                                    | Respaldos y restauración probados, monitoreo básico, procedimiento de atención y alcance del mantenimiento por escrito.                                           |
| Confianza comercial          | El mismo producto advierte que no es contabilidad ni emite comprobantes SUNAT.                | Mantener esa limitación visible y definir por contrato qué datos se respaldan, cuánto dura el soporte y qué pasa al cancelar.                                     |

## Qué vendería como MVP inicial

Mantendría el alcance corto y demostrable:

1. **Operación móvil rápida:** registrar una venta o gasto en pocos pasos y confirmar si se guardó o qué falló.
2. **Control de caja del día:** apertura, efectivo esperado y cierre, con fecha local y valores claros.
3. **Historial e informe sencillo:** movimientos filtrados y resumen semanal/mensual descargable.
4. **Panel privado del proveedor:** administrar clientes y sus estados; cambiar servicios, tipos de vehículo y categorías sin volver a desplegar el frontend.
5. **Alta guiada:** configurar el primer negocio, revisar permisos y dejar un usuario de dueño listo para el cliente.
6. **Seguridad y recuperación:** políticas RLS validadas, respaldos/restauración documentados y recuperación de contraseña comprobada.

No intentaría incluir en este MVP facturación, comprobantes SUNAT, inventario completo, nómina ni contabilidad. Son alcances distintos y aumentan el riesgo y el soporte.

## Paquete comercial sugerido

**Implementación: S/ 100 (una vez)**

- Configuración inicial del negocio y catálogos.
- Alta de una cuenta de propietario.
- Capacitación breve y prueba con datos de ejemplo.

**Mantenimiento: S/ 20 al mes**

- Uso y continuidad de la aplicación alojada (si el proveedor cubre ese costo).
- Respaldo periódico y verificación de que pueda restaurarse.
- Soporte remoto básico con horario y límite de atención definidos.
- Ajustes razonables de servicios, tipos de vehículo y categorías.
- Correcciones y actualizaciones del producto.

Definir antes de cobrar si los S/ 20 incluyen hosting, cuántos usuarios/dispositivos cubre, el plazo de respuesta, el límite de cambios de catálogo, qué datos se conservan al cancelar y si hay costo por visita presencial. No prometer soporte ilimitado ni restauración si todavía no se ha ensayado.

## Guion de demostración para el cliente

1. Abrir el sistema en un teléfono y mostrar acceso/estado de carga.
2. Registrar una venta y enseñar el resumen y el movimiento resultante.
3. Registrar un gasto en efectivo y mostrar cómo cambia el efectivo esperado.
4. Cerrar caja, aplicar un filtro de fecha y exportar los datos.
5. Explicar con transparencia que el panel del proveedor y los catálogos remotos son la siguiente entrega, no una función ya disponible.

Usar una cuenta de prueba y datos ficticios; no mostrar credenciales ni información de otro negocio.

## Prioridad recomendada después de la presentación

- **P0 — antes de cobrar el primer mes:** RLS revisada, flujos de error/éxito probados en un móvil real, respaldo y alcance de soporte acordados.
- **P1 — para que la mensualidad tenga valor operativo:** panel privado de clientes, estado de servicio y catálogos administrables.
- **P2 — para retención y diferenciación:** informes mensuales, varios empleados/roles y recordatorios de renovación.
- **P3 — solo si los clientes lo piden:** inventario, comprobantes u otras integraciones, con evaluación de alcance legal/técnico.

El siguiente paso técnico de mayor valor es crear el **panel de administración del proveedor y los catálogos remotos**. Eso elimina las opciones hardcodeadas y permite demostrar un servicio continuo sin confundir el panel privado de cada car wash con la administración de AutoControl.
