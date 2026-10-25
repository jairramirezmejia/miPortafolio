'use strict';
window.addEventListener('storage',e=>{if(e.key===KEY){try{db=JSON.parse(e.newValue)||seed();if(current)render()}catch{}}});render();
