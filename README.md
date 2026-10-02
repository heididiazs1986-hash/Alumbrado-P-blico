## AP Inventory v0.8.12 — capacidad del transformador

En **Nueva estructura AP**, cuando el tipo es **CD**, aparece un selector obligatorio **Capacidad del transformador (kVA)**, con el catálogo exacto de GS Diagnósticos: 5, 10, 15, 25, 30, 45, 75, 112.5, 150 y 225 kVA. No se muestra para MT/BT: estos nodos heredan la capacidad del CD de la misma orden. En una estructura CD ya registrada, la ficha permite agregar o corregir el kVA y actualizar los nodos asociados sin borrar datos.

La hoja **ESTRUCTURAS** agrega la columna `CAPACIDAD_TRANSFORMADOR_KVA`. El KMZ por CD presenta también este dato. Si tienes un flujo de Power Automate que lee `tbl_Estructuras`, revisa el mapeo de esta columna antes de usar el maestro. Se renovó la caché PWA a `ap-inventory-static-v0810`.

# AP Inventory v0.8.8 — cambios de interfaz, matrices y sincronización

- Multiselect de novedades de estructuras y luminarias agrupado por categoría y presentado como **opciones compactas resaltadas**. El checkbox permanece únicamente como control accesible oculto, sin segunda casilla visible.
- Matriz de hallazgos: los registros guardan `id`, `category` y `description`; el Excel presenta **GRUPO_NOVEDAD_…** y **DESCRIPCION_NOVEDAD_…** en ambas tablas. Los registros previos se pueden exportar a partir de sus etiquetas.
- Formulario sin párrafos explicativos bajo el CD ni observación de solicitud extendida. Encabezado con orden, cuenta, municipio, sector y coordenadas de programación **identificadas como referencia**, nunca utilizadas como GPS capturado.
- Botón **Coordenadas**, acciones cortas y azul `#79D1FF` con naranja `#FF6600`, gris `#C1C7CE` y neutral `#FEFEFF`.
- El icono luna/sol cambia entre modos claro y nocturno, conservando la preferencia local.
- Ayuda contextual flotante de **Fotocelda, Telegestión, Temporizador y Sin control**.
- Sincronización diferenciada de Exportar: preparación de Excel/fotos/KMZ, vínculo de recepción HTTPS guardado, apertura del formulario de carga y estado **CARGA REPORTADA / PENDIENTE DE VERIFICACIÓN**. No declara sincronización confirmada por el servidor.
- Actualización de caché PWA a `ap-inventory-static-v088` para instalar archivos de interfaz y referencias offline.

**Pendiente antes del uso operativo:** confirmar una vía de recepción permitida por el tenant, probar carga completa en móvil y reactivar GPS obligatorio ≤12 m (`REQUIRE_GPS_12M`). El PIN maestro no está configurado ni debe publicarse en el repositorio.

---

# AP Inventory v0.8.5.2 – paquete fuente para pruebas

## Cambios integrados (v0.8.5)

- `Tipo de red BT`: RED ABIERTA, RED MIXTA, RED TRENZADA y RED AP.
- La longitud del brazo se captura por luminaria, no por estructura; el Excel la exporta en LUMINARIAS.
- Rótulo/serial obligatorio: ILEGIBLE, NO MARCADO, SIN RÓTULO, etc. se convierten automáticamente a `LUMINARIA_1`, `LUMINARIA_2`… con numeración por ORDEN + CD, incluso si las luminarias pertenecen a estructuras diferentes. Al cambiar de CD la secuencia puede reiniciar. No se permite guardar luminarias con el campo vacío: debe escribirse un rótulo real o una condición (por ejemplo ILEGIBLE o NO MARCADO).
- Fotografías de referencia de tecnología embebidas dentro de `index.html`: funcionan incluso si se copia el HTML sin la carpeta assets y sin conexión.
- Se elimina la frase repetitiva «La imagen es esquemática…» de la ayuda de tipo de luminaria. La tecnología usa fotografías; el tipo usa esquemas.
- Compatibilidad con datos de pruebas anteriores: rótulos genéricos antiguos se normalizan sin tocar rótulos reales, y una longitud de brazo heredada de estructura se conserva como fallback de exportación.

## Base heredada de v0.8.4

- CD es un tipo de estructura y **debe ser el primer registro de cada orden**. No se habilitan MT/BT hasta registrar CD. Para asociar un nodo MT/BT a otro CD dentro de la misma orden, primero debe existir la estructura CD de ese CD.
- Campo CD: completa `TR1` en claves compatibles cuando se ingresa la base (por ejemplo E94267 → E94267TR1). Respeta `TR2`, `TR3`, etc. La normalización se aplica al salir del campo y al guardar. Se ofrecen CDs ya registrados dentro de la orden para reducir digitación.
- Características dependen de material y clasificación (la estructura CD utiliza el catálogo de MT).
- Menús de luminarias sin opciones «otra / no identificada» para tecnología, tipo, alimentación ni control; propiedad admite PARTICULAR.
- Ayuda visual sin conexión de las 9 tecnologías de la referencia gráfica previamente aprobada, con recortes ilustrativos, más guías esquemáticas para los tipos de luminaria. Disponibles al seleccionar y en galería modal.
- Tarjetas, etiquetas y estados más ligeros y acentos azul claro `#79D1FF`, respetando naranja `#FF6600`, gris `#C1C7CE` y neutral `#FEFEFF`.
- Fotos: mínimo 3, máximo 7 por estructura/luminaria; las fotos se eligen del dispositivo (la app no abre la cámara).
- GPS de pruebas: se puede guardar sin GPS o con precisión >12 m. Se puede volver a capturar GPS de cualquier estructura guardada desde «Actualizar GPS de esta estructura». **Activar validación antes de producción**.
- KMZ por CD levantado, con marcador CD naranja basado **solo en GPS real de la estructura CD**, MT azul oscuro, BT azul claro y una luminaria amarilla individual con conexión visual a su nodo. Cada luminaria contiene un popup individual y **comparte coordenadas reales con su nodo**; solo la figura en PNG se desplaza en pantalla. Carpetas por estructura en Google Earth.
- Excel de registro diario con únicamente `ESTRUCTURAS` y `LUMINARIAS`. Ambas hojas contienen **tablas Excel reales**, con `tbl_Estructuras` y `tbl_Luminarias`, IDs únicos, filtros, fila 1 inmovilizada y tipografía ligera con encabezado azul.
- ZIP diario con **solo fotos**, carpetas según `ORDEN_CD_PUNTO_FISICO` y `ORDEN_CD_PUNTO_FISICO_ROTULO` o `LUMINARIA_1`.
- TXT de resúmenes acumulados para ENEL, aparte del ZIP y del Excel. Cuando la APK tenga integrado el plugin nativo Filesystem, reemplaza el archivo RESUMEN_FECHA.txt en Documentos/AP_Inventory. En un navegador compatible con showSaveFilePicker conserva el archivo elegido. Otros navegadores pueden generar descargas con (1) en lugar de reemplazar: se informa al usuario de esta limitación.
- Regla general: datos capturados de texto/alfanuméricos guardados en MAYÚSCULAS; las ayudas y etiquetas se muestran legibles.

## Límite: entrega a SharePoint
«Preparar archivos del día» crea las descargas en el dispositivo (Excel, fotos y KMZ). **La subida a SharePoint/OneDrive y el flujo de consolidación en Power Automate siguen pendientes** del mecanismo de recepción que estará disponible en el tenant. No se afirma sincronización automática ni confirmación remota.

## Antes de uso operativo
- Cambiar `REQUIRE_GPS_12M=false` a `true` en index.html.
- Validar GPS real de la estructura CD y nodos; no se inventan coordenadas a partir de programación.
- Configurar de forma segura el PIN maestro en app-config.js; actualmente está vacío.
- Probar el KMZ en Google Earth con nodos densos, pues la legibilidad de iconos depende del zoom y del motor de superposición de Google Earth. Si dos estructuras están muy próximas puede ser necesario ampliar la vista.
- Cargar desde HTTPS/PWA para que el GPS y el Service Worker funcionen; un archivo local no representa todas las características de una APK.
- Mantener una copia de respaldo de los datos de prueba antes de sustituir la versión. IndexedDB conserva el nombre de la base APInventoryDB.

## Validaciones realizadas
- Sintaxis completa de JavaScript con Node.js.
- Archivos XLSX y KMZ generados ejecutando los generadores reales, inspección del ZIP y XML, verificación de las 2 tablas únicas y de las coordenadas reales heredadas por luminarias.
- No fue posible ejecutar la interfaz en Chromium dentro del entorno de creación porque la política administrada del navegador bloquea la navegación; se requiere prueba visual y funcional en dispositivo.

## Novedad v0.8.5.2
- Botones Cancelar explícitos junto al guardado de **estructuras** y **luminarias**, adaptables a móvil.
- Al cancelar una luminaria, se vuelve a la estructura actual; al cancelar una nueva estructura, a las órdenes o a la estructura anterior según procedencia.
- Si hay campos diligenciados o fotografías cargadas, se solicita confirmación antes de descartar el borrador. La información previamente guardada no se modifica.
- La flecha de retorno de estructura y la X de luminaria comparten comportamiento seguro con Cancelar.


## v0.8.12
- Multiselectores de hallazgos compactos, agrupados por categoría técnica.
- Exportación conserva PRESENTA_NOVEDADES y separa GRUPO/CATEGORÍA de DESCRIPCIÓN para estructuras y luminarias.
- Modo nocturno visible y persistente (Noche/Claro).
- Sincronización con accesos directos a Excel, Fotos ZIP, KMZ por CD y Preparar todo.
- Renovación de caché PWA para evitar servir recursos visuales antiguos.


## v0.8.12
- Se elimina el botón independiente “Guardar kVA”.
- La capacidad del transformador se actualiza automáticamente al cambiar el valor en la estructura CD.
- El valor se propaga a las estructuras relacionadas del mismo CD.


## v0.8.13
- Hallazgos exclusivos para estructura CD, mostrados antes que los hallazgos del poste.
- Grupos: TRANSFORMADOR, PUESTA A TIERRA DEL CD y PROTECCIONES DEL CD.
- Incluye fuga de aceite, daños visibles en transformador, puesta a tierra, DPS y cortacircuitos/portafusibles.
- Estos hallazgos no aparecen para estructuras MT o BT.
- La matriz Excel conserva grupo/categoría y descripción seleccionada.


## v0.8.14
- Destino fijo de recepción configurado en SharePoint.
- Se elimina de la app el campo visible para pegar el vínculo de recepción.
- Se elimina la confirmación manual del técnico.
- El botón de salida queda como “Cargar” y abre directamente la carpeta institucional de recepción.
- La verificación real de recepción queda prevista para Power Automate.


## v0.8.15
- Corrección del tipo MIME del Excel exportado.
- El registro diario ahora descarga como .xlsx, no .xlsx.zip.
- Se mantiene el contenido OOXML y las tablas tbl_Estructuras y tbl_Luminarias para Power Automate.


## v0.8.16
- Sincronización simplificada a un único botón “Preparar y cargar”.
- El botón genera Excel + ZIP de fotografías + KMZ por CD y abre inmediatamente la carpeta fija de recepción en SharePoint.
- Se eliminan de Sync los botones individuales redundantes; continúan disponibles en Exportar.
- El KMZ se descarga como un único archivo con MIME de Google Earth y nombre basado únicamente en el CD, por ejemplo E25418TR1.kmz.
- El KMZ sigue siendo internamente un contenedor comprimido, como define el formato KMZ, pero no se agrega un ZIP exterior.


## v0.8.17
- Se elimina el manejador antiguo de “Preparar todo” que podía detener el JavaScript al ya no existir ese botón.
- Sync queda definitivamente con un único botón: Preparar y cargar.


## v0.8.21
- El KMZ se consolida por jornada de trabajo: un único archivo por fecha y técnico, sin importar cuántas órdenes o CD se hayan trabajado.
- Nombre: KMZ_AP_NOMBRE_APELLIDO_FECHA.kmz.
- Dentro del KMZ, los elementos quedan agrupados por CD y conservan la simbología de CD, nodo MT, nodo BT y luminarias.
- Exportar y Sync usan el mismo KMZ diario.
