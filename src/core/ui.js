'use strict';
const toast=txt=>{$('toastroot').innerHTML='<div class="toast">'+esc(txt)+'</div>';setTimeout(()=>$('toastroot').innerHTML='',3500)};
const card=(title,content)=>`<section class="card"><h2>${title}</h2>${content}</section>`;const stat=(ico,label,value,foot='')=>`<div class="card"><div class="row between"><span class="muted">${label}</span><span class="icon">${ico}</span></div><div class="stat">${value}</div><span class="smallprint">${foot}</span></div>`;const title=(a,b,right='')=>`<div class="hero"><div><h1>${a}</h1><p>${b}</p></div>${right}</div>`;const reqsFor=()=>db.requests.filter(r=>r.status!=='eliminada').filter(r=>current.role==='cliente'?mine(r):current.role==='transportista'?r.status==='publicada':true);const negotiate=(r,carrier)=>r.negotiations.find(n=>n.carrier===carrier);const best=r=>r.negotiations.map(n=>n.amount).sort((a,b)=>a-b)[0];const img=(type)=>PH[type]||PH.boxes;
function modal(content){$('modalroot').innerHTML=`<div class="modalback" onclick="if(event.target===this)modalClose()"><div class="modal"><div class="modalhead"><img class="modal-brand-logo" src="assets/smartransfer-logo.png" alt="SmarTransfer"><button class="btn outline tiny" onclick="modalClose()">\u2715 Cerrar</button></div><div style="margin-top:17px">${content}</div></div></div>`}
function modalClose(){$('modalroot').innerHTML=''}
function describeFormFields(f){
  [...f.elements].forEach(control=>{
    if(!control.name||control.type==='hidden'||control.type==='submit'||control.type==='button')return;
    const label=control.previousElementSibling?.classList.contains('label')?control.previousElementSibling:null;
    if(!label)return;
    if(!label.dataset.baseLabel)label.dataset.baseLabel=label.textContent.replace(/\s*(?:\*|\(opcional\))\s*$/i,'').trim();
    label.textContent=label.dataset.baseLabel+(control.required?' *':' (opcional)');
  });
  if(!f.querySelector('.form-guidance')){
    const note=document.createElement('p');
    note.className='form-guidance smallprint';
    note.innerHTML='<b>* Obligatorio</b> · Los campos marcados como opcionales pueden dejarse vacíos.';
    f.insertBefore(note,f.firstChild);
  }
}
function enhanceForm(f){
  if(!f)return;
  f.noValidate=true;
  describeFormFields(f);
  if(f.dataset.validationBound)return;
  f.dataset.validationBound='true';
  f.addEventListener('submit',e=>{
    const invalid=[...f.elements].filter(control=>control.willValidate&&!control.validity.valid);
    f.querySelector('.form-errors')?.remove();
    if(!invalid.length)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const errors=invalid.map(control=>{
      const label=control.previousElementSibling?.classList.contains('label')?control.previousElementSibling.dataset.baseLabel:'Este campo';
      const detail=control.validity.valueMissing?'es obligatorio':control.validationMessage;
      return `<li><b>${esc(label)}</b>: ${esc(detail)}</li>`;
    });
    const summary=document.createElement('div');
    summary.className='form-errors';
    summary.setAttribute('role','alert');
    summary.setAttribute('aria-live','assertive');
    summary.innerHTML=`<b>Completa o corrige estos campos antes de continuar:</b><ul>${errors.join('')}</ul>`;
    f.insertBefore(summary,f.firstChild);
    invalid[0].focus();
    summary.scrollIntoView({block:'nearest',behavior:'smooth'});
  },true);
}
function bindForm(id,handler){const f=$(id);if(f){enhanceForm(f);f.onsubmit=e=>{e.preventDefault();handler(Object.fromEntries(new FormData(f)))}}}
