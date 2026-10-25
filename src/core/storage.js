'use strict';
function loadState(){
  let savedData=null;
  try{
    savedData=localStorage.getItem(KEY)||localStorage.getItem(LEGACY_KEY);
    db=JSON.parse(savedData)||seed();
  }catch(error){
    console.error('No se pudieron leer los datos guardados.',error);
    db=seed();
  }
  if(savedData&&!localStorage.getItem(KEY)){
    localStorage.setItem(KEY,savedData);
    localStorage.removeItem(LEGACY_KEY);
  }
  db.registrations ||= [];
  db.inquiries ||= [];
  db.notifications ||= [];
  db.availability ||= [];
  db.registrations.filter(x=>x.status==='aprobada').forEach(x=>{
    if(!USERS.some(u=>u.email===x.email))USERS.push(x.user);
  });
  current=USERS.find(x=>x.id===sessionStorage.getItem(SESSION))||null;
}
const save=()=>{localStorage.setItem(KEY,JSON.stringify(db));};
loadState();
