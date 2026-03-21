/* ═══ KARMA — Utilities ═══ */

function todayKey(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}

function dateKey(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}

function nowTimeStr(){const n=new Date();return String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0')}

function getLast(n){return Array.from({length:n},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(n-1)+i);return dateKey(d)})}

function exportData(){const b=new Blob([JSON.stringify(S,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='karma-'+todayKey()+'.json';a.click();showToast('Exported')}

function resetProfile(){if(confirm('Reset all data?')){localStorage.removeItem('karmaV6');location.reload()}}

// Aria typewriter intro
