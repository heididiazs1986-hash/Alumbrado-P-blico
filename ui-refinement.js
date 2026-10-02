/* AP Inventory v0.8.7 · ayudas y pantalla compacta */
(()=>{
'use strict';
const selectors=[...document.querySelectorAll('.multi-select')];
selectors.forEach(d=>d.addEventListener('toggle',()=>{if(d.open)selectors.forEach(other=>{if(other!==d)other.open=false})}));
const descriptions={
'FOTOCELDA':'Enciende y apaga según la luz ambiental.',
'TELEGESTIÓN':'Permite supervisión y maniobra desde un sistema remoto.',
'TEMPORIZADOR':'Enciende y apaga según horarios programados.',
'SIN CONTROL':'No dispone de dispositivo de control identificado.'};
const control=document.getElementById('lmControl');
if(control){
 const field=control.closest('.field');field.classList.add('control-field');
 const label=field.querySelector('label');label.classList.add('control-title');
 const button=document.createElement('button');button.type='button';button.id='btnControlInfo';
 button.className='control-info-btn';button.textContent='ⓘ';button.setAttribute('aria-label','Ayuda sobre los sistemas de control');label.append(button);
 const pop=document.createElement('div');pop.className='control-info-popover';pop.hidden=true;field.append(pop);
 const close=()=>{pop.hidden=true;button.setAttribute('aria-expanded','false')};
 const render=(onlyCurrent=false)=>{
  pop.replaceChildren();
  const entries=onlyCurrent&&descriptions[control.value]?[[control.value,descriptions[control.value]]]:Object.entries(descriptions);
  for(const [name,desc] of entries){
   const row=document.createElement('button');row.type='button';row.className='control-info-option';
   const title=document.createElement('strong');title.textContent=name;
   const help=document.createElement('small');help.textContent=desc;row.append(title,help);
   row.addEventListener('click',()=>{control.value=name;control.dispatchEvent(new Event('change',{bubbles:true}));close()});
   pop.append(row);
  }
 };
 button.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const wasHidden=pop.hidden;close();if(wasHidden){render(false);pop.hidden=false;button.setAttribute('aria-expanded','true')}});
 control.addEventListener('change',()=>{close();if(descriptions[control.value]){render(true);pop.hidden=false}});
 document.addEventListener('click',e=>{if(!field.contains(e.target))close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
}
document.addEventListener('click',e=>{if(!e.target.closest('.multi-select'))selectors.forEach(d=>d.open=false)});
const banner=document.getElementById('activeOrderNotice');
async function conciseBanner(){
 if(!banner||!activeOrderId)return;
 const o=await get('orders',activeOrderId);if(!o)return;
 const cap=v=>String(v??'').trim().toUpperCase();banner.replaceChildren();
 const a=document.createElement('div');a.className='order-ref';
 for(const value of [`ORDEN ${cap(o.order)}`,o.accountRef?`CUENTA ${cap(o.accountRef)}`:'',o.programDate||''])if(value){
  const el=document.createElement(a.children.length?'span':'strong');el.textContent=value;a.append(el)
 }banner.append(a);
 const b=document.createElement('div');b.className='order-ref';
 for(const text of [[cap(o.municipality),cap(o.sector)].filter(Boolean).join(' · '),o.latRef&&o.lonRef?`LAT ${cap(o.latRef)} · LONG ${cap(o.lonRef)}`:'LAT / LONG PENDIENTES'])if(text){
  const x=document.createElement('span');x.textContent=text;b.append(x)
 }banner.append(b);
}
if(typeof renderStructureForm==='function'){
 const render=renderStructureForm;renderStructureForm=async function(...a){const result=await render(...a);await conciseBanner();return result};
}
if(typeof renderStructureDetail==='function'){
 const render=renderStructureDetail;renderStructureDetail=async function(...a){const result=await render(...a);const b=document.getElementById('btnFixStructureGps');if(b)b.textContent='⌖ Coordenadas';return result};
}
for(const [id,label] of Object.entries({btnGps:'⌖ Coordenadas',btnSaveStructure:'Guardar',btnSaveLum:'Guardar',btnDownloadOrderTxt:'TXT diario',btnCopySummary:'Copiar',btnPrepareSync:'Preparar'})){
 const el=document.getElementById(id);if(el)el.textContent=label;
}
for(const [id,label] of Object.entries({btnAllExcel:'Excel',btnAllZip:'Fotos ZIP',btnDailyTxt:'Resumen TXT',btnShareDailyTxt:'Compartir TXT',btnAllKmz:'KMZ del día'})){
 const b=document.getElementById(id);if(!b)continue;const s=b.querySelector('span:not(.ico)');if(s)s.textContent=label;b.setAttribute('aria-label',label)
}
for(const el of document.querySelectorAll('#screenExport>.card>.notice,#screenSync>.card>.notice'))el.remove();
const serial=document.getElementById('lmSerial');if(serial)serial.placeholder='Rótulo, ILEGIBLE o NO MARCADO';
})();
