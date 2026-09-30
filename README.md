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
