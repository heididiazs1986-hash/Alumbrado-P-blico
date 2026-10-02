/* Configuración AP Inventory. No guardes aquí contraseñas o PIN personales.
 * PIN maestro de recuperación: define masterPinHash antes de distribuir.
 * sha256("APINV_MASTER|" + pinMaestro) en hexadecimal minúscula.
 * En modo pruebas puede permanecer vacío (recuperación deshabilitada).
 */
window.AP_APP_CONFIG = {
  masterPinHash: '5f1199fc87401d5fd5cb16788a08a2d969de53fb89614ba909d9824ec6ec6b86',
  syncUploadUrl: 'https://applusglobal.sharepoint.com/:f:/s/GestinSocial/alumbradopublico/IgB_Nb1VNehESrjzIweoy1NcAVF2otsPPDm6kNTwV_NiYLY?e=caVWKt'
};
