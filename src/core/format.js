'use strict';
const $=id=>document.getElementById(id);
const now=()=>new Date().toLocaleString('es-PE',{dateStyle:'short',timeStyle:'short'});
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>'S/ '+Number(n||0).toLocaleString('es-PE',{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtId=r=>'ST-'+String(r.id).padStart(4,'0');
