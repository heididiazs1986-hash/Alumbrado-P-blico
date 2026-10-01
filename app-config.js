/* Configuración AP Inventory. No guardes aquí contraseñas o PIN personales.
 * PIN maestro de recuperación: define masterPinHash antes de distribuir.
 * sha256("APINV_MASTER|" + pinMaestro) en hexadecimal minúscula.
 * En modo pruebas puede permanecer vacío (recuperación deshabilitada).
 */
window.AP_APP_CONFIG = {
  masterPinHash: '',
  syncUploadUrl: 'https://applusglobal.sharepoint.com/:f:/s/GestinSocial/alumbradopublico/IgB_Nb1VNehESrjzIweoy1NcAVF2otsPPDm6kNTwV_NiYLY?e=caVWKt'
};
