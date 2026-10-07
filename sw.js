/* AP Inventory v0.8.30 · cache propio y referencias fotográficas offline */
const CACHE_NAME='ap-inventory-static-v0830';
const ASSETS=[
 './','./index.html','./ui-refinement.css','./ui-refinement.js','./ap-extended.css','./ap-extended.js','./app-config.js','./manifest.json','./app-icon.svg',
 './assets/led.webp','./assets/fluorescente.webp','./assets/halogenuro.webp',
 './assets/mercurio.webp','./assets/sodio_alta.webp','./assets/sodio_baja.webp',
 './assets/halogena.webp','./assets/incandescente.webp','./assets/induccion.webp'
];
self.addEventListener('install',event=>event.waitUntil(
 caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())
));
self.addEventListener('activate',event=>event.waitUntil(
 caches.keys().then(names=>Promise.all(names.filter(n=>n.startsWith('ap-inventory-static-')&&n!==CACHE_NAME).map(n=>caches.delete(n)))).then(()=>self.clients.claim())
));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 event.respondWith(fetch(event.request).then(response=>{
  if(response.ok){const clone=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,clone))}
  return response;
 }).catch(async()=>await caches.match(event.request)||await caches.match('./index.html')));
});
