/* AP Inventory 0.8.8 · hallazgos matriciales, nocturno y entrega */
(()=>{
'use strict';
const byId=id=>document.getElementById(id);
function cat(type,id){
 if(type==='structure'){
  if(id==='ST_INCLINATION')return 'GEOMETRÍA Y VERTICALIDAD';
  if(id.startsWith('ST_BASE')||id.startsWith('ST_EMBED'))return 'BASE Y EMPOTRAMIENTO';
  if(/^CO_(LONG|TRANS|MULTI)_/.test(id))return 'FISURACIÓN DEL HORMIGÓN';
  if(id.startsWith('CO_REBAR'))return 'ACERO DE REFUERZO';
  if(id.startsWith('CO_'))return 'CUERPO DE HORMIGÓN';
  if(id.startsWith('ME_CORR')||id==='ME_PERFORATION')return 'CORROSIÓN METÁLICA';
  if(id.startsWith('ME_'))return 'CUERPO METÁLICO';
  if(id.startsWith('WO_INSECT')||id.startsWith('WO_GALLERIES'))return 'ATAQUE BIOLÓGICO';
  if(id.startsWith('WO_ROT'))return 'PUDRICIÓN DE MADERA';
  if(id.startsWith('WO_'))return 'CUERPO DE MADERA';
  if(id.startsWith('FV_'))return 'CUERPO DE FIBRA DE VIDRIO';
  return 'ESTRUCTURA';
 }
 if(['L_NO_LIGHT','L_INTERMITTENT','L_FLICKER','L_DELAY','L_DAY_ON'].includes(id))return 'FUNCIONAMIENTO';
 if(id.startsWith('L_HOUSING'))return 'CARCASA';
 if(id.startsWith('L_DIFF'))return 'DIFUSOR O LENTE';
 if(['L_MOISTURE','L_WATER'].includes(id))return 'HERMETICIDAD';
 if(['L_DISC','L_INSUL','L_EXPOSED','L_SPLICE','L_HEAT','L_ARC'].includes(id))return 'CONEXIONES ELÉCTRICAS';
 if(['L_FIX_LOOSE','L_PART_DETACH','L_FALL_RISK'].includes(id))return 'FIJACIÓN';
 if(id==='L_MISALIGN')return 'ORIENTACIÓN';
 if(id.startsWith('LED_'))return 'MÓDULO LED';
 if(id.startsWith('DRV_'))return 'DRIVER';
 if(id.startsWith('SRC_'))return 'FUENTE LUMINOSA';
 if(id.startsWith('BAL_')||id.startsWith('IGN_'))return 'EQUIPO AUXILIAR';
 if(id.startsWith('PC_'))return 'FOTOCELDA';
 if(id.startsWith('PV_'))return 'PANEL FOTOVOLTAICO';
 if(id.startsWith('BAT_'))return 'BATERÍA';
 if(id.startsWith('CTL_'))return 'CONTROLADOR SOLAR';
 return 'LUMINARIA';
}
function groupInput(box,catalog,type,onChange){
 const old=new Set([...box.querySelectorAll('input:checked')].map(x=>x.value));
 const groups=new Map();
 for(const f of catalog){const group=type==='structure'?apGroupStructure(f):apGroupLum(f);if(!groups.has(group))groups.set(group,[]);groups.get(group).push(f)}
 box.replaceChildren();
 for(const [name,items] of groups){
  const section=document.createElement('div');section.className='matrix-group';
  const head=document.createElement('div');head.className='matrix-heading';head.textContent=name;section.append(head);
  for(const f of items){
   const row=document.createElement('label');row.className='finding-item';
   const ck=document.createElement('input');ck.type='checkbox';ck.value=f.id;ck.checked=old.has(f.id);ck.addEventListener('change',()=>{row.classList.toggle('is-selected',ck.checked);row.setAttribute('aria-selected',String(ck.checked));onChange()});
   const span=document.createElement('span');span.textContent=f.label;row.append(ck,span);row.classList.toggle('is-selected',ck.checked);row.setAttribute('aria-selected',String(ck.checked));section.append(row);
  }box.append(section);
 }onChange();
}
buildStructureFindings=function(){groupInput(byId('stFindings'),currentStructureFindingCatalog(),'structure',updateStructureCalculatedState)};
buildLumFindings=function(){groupInput(byId('lumFindings'),currentLumFindingCatalog(),'luminaire',updateLumCalculatedState)};
buildStructureFindings();buildLumFindings();
/* Cuando se elige NO, la aplicación limpia las selecciones y el resaltado visual. */
function clearFindingHighlight(id){document.querySelectorAll('#'+id+' .finding-item').forEach(row=>{const c=row.querySelector('input');row.classList.toggle('is-selected',!!c?.checked);row.setAttribute('aria-selected',String(!!c?.checked))})}
document.querySelectorAll('#stNoveltySeg button,#lmNoveltySeg button').forEach(btn=>btn.addEventListener('click',()=>{
 const id=btn.closest('#stNoveltySeg')?'stFindings':'lumFindings';
 queueMicrotask(()=>clearFindingHighlight(id));
}));
const lumCatalog=[...LUM_FINDINGS_COMMON,...LUM_FINDINGS_LED,...LUM_FINDINGS_CONVENTIONAL,...LUM_FINDINGS_PHOTOCELL,...LUM_FINDINGS_SOLAR];
function matched(record,type){
 const labels=Array.isArray(record?.findings)?record.findings:[];
 const catalog=type==='structure'?[...STRUCTURE_FINDINGS_COMMON,...(STRUCTURE_FINDINGS_BY_MATERIAL[record.material]||[])]:lumCatalog;
 return labels.map(label=>{const f=catalog.find(x=>String(x.label).toUpperCase()===String(label).toUpperCase());return {id:f?.id||'',description:String(label).toUpperCase(),category:f?cat(type,f.id):'OTRAS OBSERVACIONES'}});
}
/* La persistencia y exportación de la matriz están ahora en index.html.
   No sobrescribir findingDetails: deben conservarse como objetos {id,category,description}. */
const themeKey='ap_inventory_theme';
function setTheme(name){
 const dark=name==='dark';document.documentElement.dataset.theme=dark?'dark':'light';
 const btn=byId('btnTheme');
 if(btn){btn.textContent=dark?'☀':'☾';btn.setAttribute('aria-label',dark?'Modo claro':'Modo nocturno');btn.setAttribute('aria-pressed',String(dark))}
 const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=dark?'#121B24':'#FEFEFF';
}
try{setTheme(localStorage.getItem(themeKey)==='dark'?'dark':'light')}catch{setTheme('light')}
byId('btnTheme')?.addEventListener('click',()=>{
 const next=document.documentElement.dataset.theme==='dark'?'light':'dark';setTheme(next);
 try{localStorage.setItem(themeKey,next)}catch{}
});
const urlField=byId('syncUploadUrl'),openBtn=byId('btnOpenSync'),confirmBtn=byId('btnConfirmSync'),state=byId('syncState');
async function refreshDelivery(){
 if(!state)return;
 const record=await get('sync','SYNC-'+localDateKey());
 if(!record){state.className='sync-state';state.textContent='Pendiente: preparar los archivos del día.';openBtn.disabled=true;confirmBtn.disabled=true;return}
 if(record.status==='uploaded_unverified'){
  state.className='sync-state sent';state.textContent='Carga reportada por el técnico. Pendiente de verificación en recepción.';
  openBtn.disabled=false;confirmBtn.disabled=true;
 }else{
  state.className='sync-state pending';state.textContent='Archivos preparados en Descargas. Aún NO se ha confirmado su carga.';
  openBtn.disabled=false;confirmBtn.disabled=false;
 }
}
const originalPut=put;
const oldRender=renderSyncInfo;
renderSyncInfo=async function(){await oldRender();await refreshDelivery()};
(async()=>{try{for(let n=0;n<40&&!db;n++)await new Promise(r=>setTimeout(r,100));if(!db)return;const s=await getSettings();urlField.value=s.syncUploadUrl||'';await refreshDelivery()}catch(e){console.warn('Sync',e)}})();
urlField?.addEventListener('change',async()=>{
 const text=urlField.value.trim();
 if(text){try{if(new URL(text).protocol!=='https:')throw Error('HTTPS')}catch{toast('Introduce un vínculo de carga HTTPS');return}}
 await saveSettingsPatch({syncUploadUrl:text});toast(text?'Vínculo de recepción guardado':'Vínculo eliminado');
});
byId('btnPrepareSync').onclick=async()=>{
 const btn=byId('btnPrepareSync');btn.disabled=true;btn.textContent='Preparando…';
 try{
  const date=localDateKey(),data=await excelData(null,date);
  if(data.every(x=>x.rows.length<=1)){toast('No hay inventario del día para entregar');return}
  await exportExcel(null);await new Promise(r=>setTimeout(r,400));
  await exportDailyPhotosZip(date);await new Promise(r=>setTimeout(r,400));await exportKmzByCd();
  await originalPut('sync',{id:'SYNC-'+date,date,status:'prepared',generatedAt:nowIso()});
  await refreshDelivery();await dashboard();toast('Archivos listos. Falta cargarlos en recepción.');
 }catch(e){console.error(e);toast('No se prepararon todos los archivos')}finally{btn.disabled=false;btn.textContent='Preparar'}
};
openBtn?.addEventListener('click',()=>{
 const text=urlField.value.trim();
 try{if(new URL(text).protocol!=='https:')throw Error('HTTPS')}catch{toast('Configura primero un vínculo válido de recepción');return}
 const popup=window.open(text,'_blank','noopener');saveSettingsPatch({syncUploadUrl:text}).catch(console.warn);toast(popup===null?'Abre el vínculo de recepción permitido desde el navegador':'Adjunta Excel, ZIP y KMZ. La carga requiere confirmación');
});
confirmBtn?.addEventListener('click',async()=>{
 const date=localDateKey(),r=await get('sync','SYNC-'+date);
 if(!r){toast('Primero prepara los archivos');return}
 if(!confirm('¿Terminaste de cargar TODOS los archivos? Esto NO verifica su recepción.'))return;
 await originalPut('sync',{...r,status:'uploaded_unverified',reportedAt:nowIso()});
 await refreshDelivery();await dashboard();toast('Carga reportada. Pendiente de verificación administrativa');
});
})();