# Especificación del MVP — AutoControl Car Wash

**Estado:** borrador de alcance para piloto con un primer auto car wash  
**Modelo propuesto:** S/ 100 de configuración inicial + S/ 20 mensuales  
**Propósito:** controlar ingresos por lavados y gastos del negocio desde un navegador de escritorio o celular.

## 1. Problema y objetivo

El negocio registra ingresos y gastos de forma manual y necesita saber, sin depender de cálculos al final del día:

- Cuánto recibió por servicios de lavado.
- Cuánto gastó y en qué categorías.
- Qué operaciones ocurrieron durante un período.
- Cómo descargar el historial para conservarlo o revisarlo.

El MVP debe hacer esas tareas con pocos pasos, datos persistidos en la nube y respuesta clara para cada operación. No se presenta como sistema contable, punto de venta fiscal ni emisor de comprobantes SUNAT.

## 2. Usuarios y límites del alcance

### Usuario del negocio

El dueño o encargado inicia sesión, registra ingresos y gastos, consulta el historial y hace el cierre diario de efectivo.

### Operador de AutoControl (proveedor)

La operación comercial propuesta incluye que el proveedor configure la cuenta y mantenga catálogos. **El panel central para administrar varios clientes todavía no forma parte de la aplicación.** En el piloto el proveedor puede gestionar altas y cambios manualmente, sin mostrar funciones inexistentes al cliente.

## 3. Alcance funcional

### F-01 — Acceso y sesión

- Iniciar sesión y crear cuenta con correo y contraseña mediante Supabase Auth.
- Recuperar la sesión al volver a abrir la aplicación.
- Mostrar estado de inicialización, error de configuración, error de autenticación y resultado.
- Mientras se inicia sesión, deshabilitar acciones duplicadas y cambiar el botón a “Ingresando…”. Al completar el acceso, abrir el panel principal.
- En móvil, los botones “Iniciar sesión” y “Crear cuenta nueva” ocupan filas separadas, ambos al 100% del ancho.
- Cerrar sesión con estado ocupado y error explícito si el servicio falla.

### F-02 — Registrar ingreso por lavado

Campos requeridos: fecha, importe mayor a cero, servicio y método de pago. El tipo de vehículo y la nota son opcionales en el dato; el formulario presenta un tipo de vehículo inicial. Tras confirmar que Supabase guardó el registro, limpiar el formulario, actualizar el historial y mostrar confirmación.

Si falla el guardado, conservar los datos del formulario para que el usuario pueda corregir o reintentar. Deshabilitar el botón durante la operación y mostrar “Guardando venta…”.

### F-03 — Registrar gasto

Campos requeridos: fecha, importe mayor a cero, categoría y método de pago. La descripción es opcional. El estado de guardado es independiente del formulario de ingresos. Ante un error, conservar los datos ingresados.

### F-04 — Resumen diario y caja

- Calcular ingresos y gastos del día, saldo operativo estimado y efectivo esperado.
- El efectivo esperado es efectivo inicial + ingresos pagados en efectivo − gastos pagados en efectivo.
- Permitir guardar efectivo inicial y efectivo contado, y mostrar la diferencia o el estado pendiente.
- Esta vista es una ayuda de control operativo y no reemplaza conciliación bancaria ni contabilidad.

### F-05 — Historial

- Mostrar ingresos y gastos juntos, ordenados del más reciente al más antiguo.
- Filtrar por todos, ingresos por lavados o gastos.
- Filtrar por fecha inicial, fecha final o ambas; los límites son inclusivos.
- Avisar si la fecha inicial es posterior a la final y no presentar resultados engañosos.
- Mostrar número y rango de registros, página actual, total de páginas y selección de 10, 20 o 50 filas por página.
- En escritorio, mostrar tabla. En pantallas pequeñas, mostrar tarjetas legibles; ninguna función debe requerir desplazamiento horizontal de toda la página.
- Permitir eliminar una operación con confirmación, estado “Eliminando…” y error explícito.

### F-06 — Exportación

- Descargar CSV de **todo el conjunto filtrado**, no únicamente de la página actual.
- Incluir encabezados en español, fecha, tipo, detalle, método de pago, importe en soles y nota.
- Deshabilitar descarga si la carga está en curso o el filtro no tiene resultados.

### F-07 — Catálogos administrados

Los valores iniciales de servicios, vehículos, categorías y métodos de pago son definidos por AutoControl para facilitar la puesta en marcha. La primera versión puede configurarlos manualmente durante el onboarding. Cambiarlos desde un panel central o por cliente es una mejora posterior; no afirmar que ya existe administración web.

## 4. Requisitos de interfaz responsive

- Diseñar desde móvil (mínimo 320 px) y escalar a tablet/escritorio.
- Inputs y selects deben ocupar el ancho disponible, ser visibles sobre el fondo oscuro y mostrar foco perceptible.
- Botones de operación deben tener área táctil de al menos 44 px de alto.
- Formularios de ingresos/gastos pasan a una sola columna en móvil y dos columnas en pantallas amplias.
- Los botones de autenticación son de ancho completo y están apilados en móvil.
- El resumen se acomoda a una columna o cuadrícula de dos columnas pequeña; el historial usa tarjetas bajo el breakpoint de escritorio.
- Los mensajes de carga, éxito y error usan roles accesibles (`status`/`alert`) y no dependen solo del color.

## 5. Estados obligatorios para llamadas al servicio

| Operación                     | Estado ocupado                            | Éxito                                                 | Error / recuperación                                              |
| ----------------------------- | ----------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------- |
| Recuperar sesión y datos      | Indicador de inicialización/actualización | Abrir la pantalla correspondiente                     | Mostrar error; permitir reintento o volver a autenticar           |
| Iniciar sesión / crear cuenta | Botón bloqueado con texto de progreso     | Entrar al panel o informar que falta confirmar correo | Mostrar motivo; conservar correo/contraseña para reintento        |
| Guardar ingreso               | Bloquear botón de ingresos                | Confirmar alta y refrescar                            | Conservar formulario y mostrar error                              |
| Guardar gasto                 | Bloquear botón de gastos                  | Confirmar alta y refrescar                            | Conservar formulario y mostrar error                              |
| Guardar cierre                | Bloquear botón de cierre                  | Confirmar y refrescar                                 | Mostrar error sin perder el valor digitado                        |
| Eliminar                      | Bloquear eliminaciones repetidas          | Confirmar y actualizar historial                      | Mantener visible el registro si falló                             |
| Cerrar sesión                 | Bloquear botón                            | Volver a acceso                                       | Mantener sesión/pantalla y mostrar error                          |
| Exportar                      | Bloquear si no hay datos o está cargando  | Iniciar descarga local                                | No mostrar confirmación de éxito si el navegador impide descargar |

Nunca mostrar éxito si el `insert`, `upsert`, `delete` o la lectura de verificación falló. Si una escritura se confirmó pero falló la recarga, informar que el dato puede haberse guardado y pedir verificar/recargar, en vez de afirmar que no se guardó.

## 6. Seguridad y datos

- Usar solo URL del proyecto y clave publishable/anon en variables de entorno del frontend. Nunca enviar claves `service_role` o `sb_secret_` al navegador.
- Habilitar y verificar RLS para aislar negocios en `businesses`, `sales`, `expenses` y `cash_closings`.
- Probar con dos cuentas que cada una no pueda leer, cambiar ni borrar datos de la otra. El filtro del frontend por sí solo no es una barrera de seguridad.
- Verificar restricciones de importe, pertenencia a negocio y tipos de datos en la base además de la validación de HTML.
- Usar datos ficticios en la demostración y contar con una rutina real de respaldo antes de prometer recuperación de datos.

## 7. Rendimiento y paginación

La interfaz pagina localmente porque primero carga el historial del cliente y luego filtra. Esto es suficiente para validar el flujo en el piloto si el volumen es acotado. Antes de producción con varios negocios o historiales extensos, aplicar filtros y `range` en Supabase, con orden estable, y coordinar la paginación de las tablas de ingresos y gastos. La exportación deberá recorrer todos los resultados del filtro, no solo la página actual.

## 8. Criterios de aceptación del piloto

1. El dueño puede entrar desde un celular; los dos botones de acceso se ven apilados y a ancho completo.
2. Al enviar credenciales, se ve el estado de progreso; con credenciales válidas aparece el panel, y con inválidas aparece un error y se conserva el correo.
3. Se registra un lavado y aparece una sola vez en el historial tras confirmación del servicio.
4. Se registra un gasto; los totales del día y efectivo esperado se actualizan según el medio de pago.
5. Los filtros de tipo y fechas inclusivas producen el conjunto correcto; fechas invertidas se explican.
6. Cambiar filtros, cantidad de filas o borrar el último elemento de una página nunca deja una página inválida.
7. Descargar CSV incluye todos los registros filtrados a través de todas las páginas.
8. Fallos de red/BD no muestran confirmación falsa; botones vuelven a habilitarse.
9. No hay desbordamiento horizontal de página en 320, 375, 768 y 1280 px.
10. Las políticas RLS se validan con más de una cuenta antes de introducir información real.

## 9. Oferta comercial a validar

### S/ 100 de implementación, una vez

- Crear y configurar el negocio y su cuenta de propietario.
- Definir los catálogos iniciales con el cliente.
- Explicar cómo registrar ingresos/gastos y cómo descargar el CSV.
- Hacer una prueba guiada con datos ficticios y dejarlo listo para uso.

### S/ 20 por mes

Propuesta de servicio a definir con límites explícitos:

- Mantener la aplicación disponible y gestionar ajustes pequeños de catálogos.
- Soporte remoto básico con horario/canal y plazo de respuesta acordados.
- Actualizaciones y corrección de defectos.
- Respaldo periódico **solo después de implementar y probar** el respaldo y la restauración.

Antes de vender, dejar por escrito si se incluye hosting, el número de usuarios, atención fuera de horario, cambios incluidos, propiedad/exportación de datos y política al cancelar. No ofrecer como incluido un panel administrativo, personalización autoservicio o recuperación no implementados.

Como referencia interna de precio, S/ 100 de implementación + 12 mensualidades de S/ 20 suman S/ 340 durante el primer año; la renovación anual suma S/ 240, antes de costos e impuestos. No presentar esta tarifa como más barata que la competencia: no se verificaron precios comparables. El análisis de alternativas, fuentes consultadas y límites de la comparación está en [el análisis del MVP vendible](./analisis-mvp-producto.md).

## 10. Fuera de alcance

- Emisión de comprobantes, facturación o integración SUNAT.
- Contabilidad, impuestos o asesoría financiera.
- Cobro automático de la mensualidad o gestión de suscripciones.
- Panel multiempresa del proveedor y edición de catálogos autoservicio.
- Inventario completo, nómina, CRM, reservas o programa de fidelización.
- Operación offline o sincronización posterior sin conexión.

## 11. Medición del piloto

Durante las primeras semanas medir con el cliente:

- Porcentaje de días de operación en que registra ingresos y gastos.
- Tiempo aproximado para registrar una operación.
- Uso de filtros y descargas.
- Diferencias detectadas entre efectivo esperado y contado.
- Errores, solicitudes de soporte y cambios de catálogo.
- Si el cliente entiende el valor mensual y qué servicio espera recibir por S/ 20.

## 12. Siguiente decisión de producto

Validar con el primer cliente el flujo central antes de implementar administración multiempresa. Si paga y usa el servicio, el siguiente incremento de mayor valor es el panel privado del proveedor para alta/estado de clientes y gestión remota de catálogos; después, paginación del lado del servidor y reportes mensuales. Antes de fijar el posicionamiento definitivo, confirmar con el cliente qué alternativas usa y contrastar los precios, disponibilidad local y condiciones de soporte de los proveedores citados en [el análisis del MVP vendible](./analisis-mvp-producto.md).
