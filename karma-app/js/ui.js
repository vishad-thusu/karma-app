/* ═══ KARMA — UI Components ═══ */

function initGlow(el){const g=el.querySelector('.glow');if(g)g.style.opacity='1'}

function moveGlow(e,el){const g=el.querySelector('.glow');if(!g)return;const r=el.getBoundingClientRect();g.style.left=(e.clientX-r.left)+'px';g.style.top=(e.clientY-r.top)+'px'}

function hideGlow(el){const g=el.querySelector('.glow');if(g)g.style.opacity='0'}

function spawnP(xp,gp,el){const r=el.getBoundingClientRect?el.getBoundingClientRect():{left:innerWidth/2,top:innerHeight/2,width:0,height:0};[['+'+xp+' XP','var(--gold)','-20px','-36px'],['+'+gp.toFixed(2)+' GP','var(--con)','16px','-30px']].forEach(([t,c,dx,dy])=>{const d=document.createElement('div');d.className='particle';d.textContent=t;d.style.color=c;d.style.left=(r.left+r.width/2-8)+'px';d.style.top=r.top+'px';d.style.setProperty('--pdx',dx);d.style.setProperty('--pdy',dy);document.body.appendChild(d);setTimeout(()=>d.remove(),650)})}

function toggleTheme(){document.documentElement.classList.toggle('light');const isLight=document.documentElement.classList.contains('light');localStorage.setItem('karmaTheme',isLight?'light':'dark');showToast(isLight?'Light mode':'Dark mode');
// Re-render charts if on progress
if(curPage==='progress')setTimeout(()=>{buildCharts();buildHM()},100)}
