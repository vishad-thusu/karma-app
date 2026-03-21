/* ═══ KARMA — Router ═══ */

function goTo(p){curPage=p;document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));const pg=document.getElementById('page-'+p);if(pg)pg.classList.add('active');document.querySelectorAll('.nav-i').forEach(x=>x.classList.toggle('active',x.dataset.p===p));document.getElementById('sidebar').classList.toggle('open',p!=='dashboard');renderPage(p);updateSB()}

function renderPage(p){
  if(p==='dashboard')renderDash();
  else if(p==='habits')renderHabits();
  else if(p==='workout')renderWorkout();
  else if(p==='daily')renderDaily();
  else if(p==='todos')renderTodos();
  else if(p==='meals')renderMeals();
  else if(p==='progress')renderProgress();
  else if(p==='expenses')renderExpenses();
  else if(p==='journal')renderJournal();
  else if(p.startsWith('stat-'))renderStatPage(p.replace('stat-',''));
  else if(p.startsWith('stat-'))renderStatPage(p.replace('stat-',''));
}

function updateSB(){
  const pl=S.player,p=S.profile;
  document.getElementById('sb-name').textContent=p.name||'Warrior';
  document.getElementById('sb-sub').textContent=`Lv${pl.level} · ${getTitle(pl.level)}`;
  document.getElementById('sb-av').innerHTML=miniAvSVG();
  const STAT_ICONS={str:'🏋️',con:'🛡️',int:'🧠',per:'👁️'};
  const STAT_NAMES={str:'Strength',con:'Constitution',int:'Intelligence',per:'Perception'};
  const STAT_SHORT={str:'STR',con:'CON',int:'INT',per:'PER'};
  document.getElementById('sb-stat-inline').innerHTML=['str','con','int','per'].map(s=>{
    const lv=pl.statLevels[s],xp=pl.statXP[s],need=statXpNeed(lv),pct=Math.round(xp/need*100);
    return`<div class="sb-si" data-s="${s}" onclick="event.stopPropagation();goTo('stat-${s}')">
      <div class="sb-si-icon">${SVG_I[s]?'<div style="width:14px;height:14px">'+SVG_I[s]+'</div>':''}</div>
      <div class="sb-si-info"><div class="sb-si-top"><div class="sb-si-name" style="color:var(--${s})">${STAT_SHORT[s]}</div><div class="sb-si-val" style="color:var(--${s})">${pl.stats[s]}</div></div>
      <div class="sb-si-track"><div class="sb-si-fill" style="width:${pct}%;background:var(--${s})"></div></div></div></div>`;
  }).join('');
  const t2=todayKey(),dls2=typeof getDailies==='function'?getDailies():[];const done2=dls2.filter(d=>S.dailyLog[t2]?.[d.id]).length;
  const posH2=S.habits.filter(h=>h.type==='booster'),habDn2=posH2.filter(h=>S.dailyLog[t2]?.[h.id]).length;
  const dayTd2=typeof getTodayTodos==='function'?getTodayTodos(t2):[];
  const tdDn2=dayTd2.filter(td=>S.dailyLog[t2]?.['todo_'+td.created]).length;
  const allCount=dls2.length+posH2.length+dayTd2.length;
  const allDone=done2+habDn2+tdDn2;
  document.getElementById('nb-d').textContent=allDone+'/'+allCount;
  document.getElementById('nb-h').textContent=S.habits.reduce((a,h)=>a+(h.type==='negative'?0:h.reps),0);
}

function miniAvSVG(){return`<svg viewBox="0 0 36 36" width="36" height="36" style="animation:globeSpin 12s linear infinite;filter:drop-shadow(0 0 4px rgba(245,151,104,.3)) drop-shadow(0 0 8px rgba(138,126,212,.15))"><defs><linearGradient id="mg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="rgba(245,151,104,.6)"/><stop offset="50%" stop-color="rgba(138,126,212,.5)"/><stop offset="100%" stop-color="rgba(90,184,154,.6)"/></linearGradient></defs><circle cx="18" cy="18" r="14" fill="none" stroke="url(#mg)" stroke-width=".8" opacity=".35"/><ellipse cx="18" cy="18" rx="14" ry="5" fill="none" stroke="url(#mg)" stroke-width=".7" opacity=".55"/><ellipse cx="18" cy="18" rx="5" ry="14" fill="none" stroke="url(#mg)" stroke-width=".7" opacity=".55"/><ellipse cx="18" cy="18" rx="10" ry="14" fill="none" stroke="url(#mg)" stroke-width=".5" opacity=".35" transform="rotate(30 18 18)"/><ellipse cx="18" cy="18" rx="10" ry="14" fill="none" stroke="url(#mg)" stroke-width=".5" opacity=".35" transform="rotate(-30 18 18)"/><circle cx="18" cy="18" r="2.5" fill="rgba(245,151,104,.3)"/><circle cx="18" cy="18" r="5" fill="rgba(245,151,104,.06)"/></svg>`}

function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById(id).classList.add('active')}
