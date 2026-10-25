'use strict';
function summary(){
  const unread=db.notifications.filter(n=>n.user===current.id&&!n.read).slice(0,4);
  const n=db.requests.length,active=db.requests.filter(r=>r.status==='publicada').length;
  const matched=db.requests.filter(r=>r.winner).length;
  const trips=db.requests.filter(r=>r.trip&&r.status!=='finalizada').length;
  const stats=current.role==='cliente'
    ?[stat('📦','Mis solicitudes',db.requests.filter(mine).length,'Cargas registradas'),stat('💬','Cotizaciones recibidas',db.requests.filter(mine).reduce((a,r)=>a+r.negotiations.length,0),'Transportistas interesados'),stat('🤝','Acuerdos',db.requests.filter(r=>mine(r)&&r.winner).length),stat('🚚','Envíos activos',db.requests.filter(r=>mine(r)&&r.trip&&r.status!=='finalizada').length)]
    :current.role==='transportista'
      ?[stat('📦','Cargas abiertas',active),stat('💬','Mis negociaciones',db.requests.filter(r=>negotiate(r,current.id)).length),stat('🤝','Servicios asignados',db.requests.filter(r=>r.winner===current.id).length),stat('🚚','Viajes activos',db.requests.filter(r=>r.winner===current.id&&r.trip&&r.status!=='finalizada').length)]
      :[stat('📦','Cargas publicadas',n),stat('💬','Ofertas totales',db.requests.reduce((a,r)=>a+r.negotiations.length,0)),stat('🤝','Acuerdos',matched),stat('🚚','Viajes activos',trips)];
  const action=current.role==='cliente'?'publicar':current.role==='transportista'?'mercado':'viajes';
  const actionLabel=current.role==='cliente'?'＋ Nueva solicitud':current.role==='transportista'?'Ver cargas disponibles':'Ver viajes';
  const heading=current.role==='cliente'?'Tu carga, más opciones de transporte':current.role==='transportista'?'Aprovecha cada ruta y cada viaje':'Operaciones bajo control';
  const description=current.role==='cliente'?'Publica solicitudes, recibe varias ofertas y elige la más conveniente.':current.role==='transportista'?'Consulta solicitudes disponibles, envía propuestas y negocia.':'Consulta las operaciones y su trazabilidad en una sola vista.';
  const primary=current.role==='transportista'?'Cargas disponibles':'Actividad reciente';
  const activity=unread.length?`<section class="activity-strip" aria-label="Avisos y actividad pendiente"><div class="activity-strip-heading"><div><span class="activity-indicator"></span><b>Avisos recientes</b><span class="activity-count">${unread.length}</span></div><button class="btn outline tiny" onclick="openNotifications()">Ver todas</button></div><div class="activity-strip-list">${unread.map(onlineNote).join('')}</div></section>`:'';
  return title('Hola, '+current.name.split(' ')[0]+' 👋','Aquí tienes un resumen de tu actividad.','<button class="btn primary" onclick="go(\''+action+'\')">'+actionLabel+'</button>')
    +activity
    +`<div class="grid stats">${stats.join('')}</div>`
    +`<div class="banner"><div><b>${heading}</b><p>${description}</p></div><span class="banner-icon">${current.role==='cliente'?'📦':current.role==='transportista'?'🚛':'📊'}</span></div>`
    +`<div class="grid two"><div>${card(primary,reqsFor().slice(0,3).map(requestItem).join('')||'<div class="empty">Sin solicitudes todavía.</div>')}</div><div>${card('Próximo paso',`<p class="muted">${current.role==='cliente'?'Publica una carga para recibir propuestas de transporte.':current.role==='transportista'?'Explora las cargas disponibles y presenta una oferta.':'Revisa las solicitudes y el seguimiento de los viajes.'}</p><button class="btn navy tiny" onclick="go('${action}')">${actionLabel} →</button>`)}</div></div>`;
}
