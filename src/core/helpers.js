'use strict';
const user=id=>USERS.find(u=>u.id===id)||{name:'—',company:'—'};
const mine=r=>r.client===current.id;
const req=id=>db.requests.find(r=>r.id==id);
const status=s=>({publicada:'Publicada',asignada:'Acuerdo confirmado',en_ruta:'En tránsito',entregada:'Entregada',finalizada:'Finalizada',rechazada:'Rechazada'}[s]||s);
const pill=s=>{const tone={publicada:'amber',asignada:'blue',en_ruta:'blue',entregada:'green',finalizada:'green',rechazada:'red',pendiente:'amber',aprobada:'green',abierta:'amber',aceptada:'green',cerrada:'gray'}[s]||'gray';return '<span class="pill '+tone+'">'+esc(status(s))+'</span>'};
function logout(){current=null;sessionStorage.removeItem(SESSION);render()}
