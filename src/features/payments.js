'use strict';
function paymentsPage(){
  const arr=db.requests.filter(r=>r.trip&&(current.role==='operaciones'||mine(r)||r.winner===current.id));
  return title('Pagos','Consulta el estado y registra los pagos acordados.')
    +card('Estado de pagos',arr.map(r=>{const p=r.trip.payment;return `<div class="item payment-item"><div><b>${fmtId(r)} — ${esc(r.title)}</b><p class="muted">Acuerdo: ${money(r.trip.amount)} · Anticipo ${money(p.deposit)} · Saldo ${money(r.trip.amount-p.deposit)}</p><span class="pill ${p.depositPaid?'green':'amber'}">${p.depositPaid?'Anticipo registrado':'Anticipo pendiente'}</span> <span class="pill ${p.balancePaid?'green':'amber'}">${p.balancePaid?'Pago completo':'Saldo pendiente'}</span></div>${current.role==='cliente'?`<button class="btn navy tiny" onclick="openPayment(${r.id})">${p.depositPaid&&p.balancePaid?'Ver pagos':'Registrar pago'}</button>`:''}</div>`}).join('')||'<div class="empty">No hay pagos pendientes.</div>');
}
function openPayment(id){
  const r=req(id);if(!r||!r.trip||current.role!=='cliente')return;
  const p=r.trip.payment,deposit=p.deposit,balance=r.trip.amount-deposit;
  const kind=!p.depositPaid?'deposit':!p.balancePaid?'balance':null;
  const amount=kind==='deposit'?deposit:balance;
  modal(`<h2>Pagos · ${fmtId(r)}</h2>
    <div class="payment-summary"><b>Tarifa acordada: ${money(r.trip.amount)}</b><span>${esc(user(r.winner).company)} · ${esc(r.origin)} → ${esc(r.destination)}</span></div>
    <div class="metrics-row">
      <div class="metric"><span>ANTICIPO · 30 %</span><b>${money(deposit)}</b><span>${p.depositPaid?'Registrado':'Pendiente'}</span></div>
      <div class="metric"><span>SALDO · 70 %</span><b>${money(balance)}</b><span>${p.balancePaid?'Registrado':'Pendiente'}</span></div>
      <div class="metric"><span>ESTADO DEL VIAJE</span><b>${esc(STAGES[r.trip.stage])}</b></div>
    </div>
    ${kind?`<section class="payment-action"><h3>Registrar ${kind==='deposit'?'anticipo':'saldo'} · ${money(amount)}</h3>
      <p class="muted">Selecciona el método utilizado para este pago.</p>
      <div class="payment-tabs">
        <button type="button" class="btn outline" data-method="transfer" onclick="selectMethod('transfer')">Transferencia</button>
        <button type="button" class="btn outline" data-method="yape" onclick="selectMethod('yape')">Yape</button>
        <button type="button" class="btn outline" data-method="plin" onclick="selectMethod('plin')">Plin</button>
        <button type="button" class="btn outline" data-method="card" onclick="selectMethod('card')">Tarjeta</button>
      </div>
      <form id="pay"><input type="hidden" name="rid" value="${id}"><input type="hidden" name="kind" value="${kind}"><input type="hidden" name="method" value="Transferencia"><p id="paymentMethodHint" class="payment-method-hint">Método seleccionado: Transferencia</p><button class="btn primary full">Registrar pago · ${money(amount)}</button></form>
    </section>`:'<div class="notice success">Todos los pagos acordados están registrados.</div>'}`);
  if(kind){selectMethod('transfer');bindForms()}
}
function selectMethod(method){
  const labels={transfer:'Transferencia',yape:'Yape',plin:'Plin',card:'Tarjeta'},form=$('pay');
  if(!form)return;
  form.elements.method.value=labels[method];
  $('paymentMethodHint').textContent='Método seleccionado: '+labels[method];
  document.querySelectorAll('.payment-tabs [data-method]').forEach(button=>button.classList.toggle('on',button.dataset.method===method));
}
function bindPaymentForms(){
  bindForm('pay',d=>{
    const r=req(+d.rid);if(!r||r.client!==current.id||!r.trip)return;
    const p=r.trip.payment,k=d.kind;
    if(k==='deposit'){p.depositPaid=true;p.depositMethod=d.method}
    else if(k==='balance'){if(!p.depositPaid){toast('Registra primero el anticipo.');return}p.balancePaid=true;p.balanceMethod=d.method;if(r.trip.stage===6)r.status='finalizada'}
    else return;
    r.trip.events.push({at:now(),text:`${k==='deposit'?'Anticipo':'Saldo'} registrado · ${d.method}`});
    notify([r.winner],`${fmtId(r)}: ${k==='deposit'?'Anticipo':'Saldo'} registrado mediante ${d.method}`,'success');
    audit(`${fmtId(r)}: ${k==='deposit'?'anticipo':'saldo'} registrado`);
    save();openPayment(r.id);toast('Pago registrado');
  });
}
