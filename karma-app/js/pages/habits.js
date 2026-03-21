/* ═══ KARMA — Habits ═══ */

function renderHabits(){
  const cats=['all','physical','mental','nutrition','grooming','recovery'];
  const filtered=habCat==='all'?S.habits:S.habits.filter(h=>h.cat===habCat);
  const dailies=filtered.filter(h=>h.type==='daily');
  const boosters=filtered.filter(h=>h.type==='booster');
  const pulldowns=filtered.filter(h=>h.type==='negative');
  const t=todayKey();const SICO={str:'🏋️',con:'🛡️',int:'🧠',per:'👁️'};
  const allReps=S.habits.reduce((a,h)=>a+(h.type==='negative'?0:h.reps),0);
  const ROW=5; // cards per row
  
  function habCard(h,type){
    const dv=!!S.dailyLog[t]?.[h.id];const isAuto=!!h.auto;
    if(type==='negative'){
      const statP={junk:'con',late:'con',skip_meal:'con'}[h.id]||'con';
      return`<div class="card htile" style="border-color:color-mix(in srgb,var(--str) 12%,rgba(255,255,255,.04))" data-cat="${h.cat}" onmouseenter="initGlow(this)" onmouseleave="hideGlow(this)" onmousemove="moveGlow(event,this)"><div class="glow"></div>
      <div class="ht-top"><div class="ht-ico">${h.icon}</div><span class="ht-tag" style="color:var(--str);background:var(--strbg)">🔻 −HP</span></div>
      <div class="ht-n">${h.name}</div>
      <div class="ht-meta" style="font-size:9px;color:var(--str)">−6 HP · −3 ${statP.toUpperCase()} XP</div>
      <div class="ht-foot"><div class="ht-streak"><span style="color:var(--t3)">${h.reps} slips</span></div>
      <div class="ht-ctrl"><button class="hbtn minus" style="border-color:color-mix(in srgb,var(--str) 25%,rgba(255,255,255,.06));color:var(--str);padding:4px 10px;font-size:10px" onclick="logPullDown('${h.id}','${statP}',event)">⚠ Log</button></div></div></div>`;
    }
    return`<div class="card htile ${dv?'ht-done':''}" data-cat="${h.cat}" onmouseenter="initGlow(this)" onmouseleave="hideGlow(this)" onmousemove="moveGlow(event,this)"><div class="glow"></div>
    <div class="ht-top"><div class="ht-ico">${h.icon}</div><div style="display:flex;gap:3px"><span class="ht-tag" style="color:var(--${h.stat});background:color-mix(in srgb,var(--${h.stat}) 10%,transparent)">${SICO[h.stat]} ${h.stat.toUpperCase()}</span>${type==='daily'?`<span class="ht-tag" style="color:var(--con);background:var(--conbg);font-size:7px">📅 ${h.schedule?.time||'—'}</span>`:type==='booster'?`<span class="ht-tag" style="color:var(--per);background:var(--perbg);font-size:7px">⚡</span>`:''}</div></div>
    <div class="ht-n">${h.name}</div><div class="ht-meta" style="font-size:9px">${isAuto?'Auto-linked':'+'+h.base+' XP'} · <span style="cursor:pointer;color:var(--t3)" onclick="event.stopPropagation();switchHabitType('${h.id}','${type==='daily'?'booster':'daily'}')">→ ${type==='daily'?'booster':'daily'}</span></div>
    <div class="ht-foot"><div><div class="ht-streak">${h.streak>0?'🔥'+h.streak+'d':'—'}</div><div class="ht-reps-info">${h.reps} total</div></div>
    <div class="ht-ctrl">${isAuto?`<div style="font-size:11px;font-weight:600;color:${dv?'var(--con)':'var(--t3)'}">${dv?'✓':'—'}</div>`:`<button class="hbtn minus" onclick="decHab('${h.id}',event)" ${!dv?'disabled style="opacity:.2"':''}>−</button><div class="ht-reps" style="color:${dv?'var(--con)':'var(--text)'}">${dv?'✓':'0'}</div><button class="hbtn plus" onclick="logHabWithTime('${h.id}',event)">+</button>`}</div></div></div>`;
  }
  
  function section(label,icon,color,items,type,stateKey){
    if(!items.length)return'';
    const expanded=window[stateKey];
    const visible=expanded?items:items.slice(0,ROW);
    const hasMore=items.length>ROW;
    return`
    <div class="sec-label" style="color:var(--${color})">${icon} ${label} <span style="font-size:9px;color:var(--t3);font-weight:400">${items.length}</span></div>
    <div class="hab-grid">${visible.map(h=>habCard(h,type)).join('')}</div>
    ${hasMore?`<div style="text-align:center;margin:8px 0 4px"><button class="btn-g" style="padding:4px 16px;font-size:9px;border-radius:9999px" onclick="window.${stateKey}=!window.${stateKey};renderHabits()">${expanded?'Show less ↑':'Show '+(items.length-ROW)+' more ↓'}</button></div>`:''}`;
  }

  document.getElementById('page-habits').innerHTML=`
  <div style="display:flex;justify-content:space-between;align-items:flex-start">
    <div><div class="pg-t">Habits</div><div class="pg-s">${allReps} total reps · ${xpMult().toFixed(2)}× XP multiplier</div></div>
    <button class="btn-p" style="width:auto;padding:8px 16px;font-size:11px;border-radius:9999px" onclick="openHabitModal()">+ New Habit</button>
  </div>
  <div class="hab-bar">${cats.map(c=>`<button class="hab-tab ${habCat===c?'act':''}" onclick="setHabCat('${c}')">${c==='all'?'All':c[0].toUpperCase()+c.slice(1)}</button>`).join('')}</div>
  ${section('Dailies','📅','con',dailies,'daily','habDailiesOpen')}
  ${section('Boosters','⚡','per',boosters,'booster','habBoostersOpen')}
  ${section('Pull Downs','🔻','str',pulldowns,'negative','habPulldownsOpen')}`;
}

function setHabCat(c){habCat=c;renderHabits()}
// Habit modal

function openHabitModal(){
  const SICO={str:'🏋️',con:'🛡️',int:'🧠',per:'👁️'};
  document.getElementById('recipe-modal').querySelector('.modal-t').textContent='New Habit';
  document.getElementById('recipe-modal').querySelector('.modal-s').textContent='Create a daily, booster, or pull down habit';
  document.getElementById('recipe-form').innerHTML=`
  <div class="f-group"><label class="f-label">Habit name *</label><input class="f-input" id="new-hab-n" placeholder="e.g. Cold shower, Read 20 min..."></div>
  <div class="f-row">
    <div class="f-group"><label class="f-label">Type *</label><select class="f-input" id="new-hab-type" onchange="document.getElementById('hab-time-group').style.display=this.value==='daily'?'block':'none'"><option value="booster">⚡ Booster</option><option value="daily">📅 Daily</option><option value="negative">🔻 Pull Down</option></select></div>
    <div class="f-group"><label class="f-label">Category</label><select class="f-input" id="new-hab-cat"><option>physical</option><option>mental</option><option>nutrition</option><option>grooming</option><option>recovery</option></select></div>
  </div>
  <div class="f-row">
    <div class="f-group"><label class="f-label">Stat</label><select class="f-input" id="new-hab-stat"><option value="str">${SICO.str} STR</option><option value="con">${SICO.con} CON</option><option value="int">${SICO.int} INT</option><option value="per">${SICO.per} PER</option></select></div>
    <div class="f-group"><label class="f-label">XP value</label><input class="f-input" id="new-hab-xp" type="number" value="10" placeholder="10"></div>
  </div>
  <div class="f-group" id="hab-time-group" style="display:none"><label class="f-label">Scheduled time (for dailies)</label><input class="f-input" id="new-hab-time" type="time" value="08:00"></div>
  <button class="btn-p" style="margin-top:10px" onclick="addCustomHabit()">Create Habit</button>`;
  document.getElementById('recipe-modal').classList.add('show');
}

function addCustomHabit(){
  const n=document.getElementById('new-hab-n').value.trim();if(!n){showToast('Enter name');return}
  const type=document.getElementById('new-hab-type')?.value||'booster';
  const cat=document.getElementById('new-hab-cat').value,stat=document.getElementById('new-hab-stat').value;
  const xp=parseInt(document.getElementById('new-hab-xp').value)||10;
  const hab={id:'c_'+Date.now(),name:n,cat,icon:'⭐',stat,base:xp,reps:0,streak:0,type};
  if(type==='daily'){const time=document.getElementById('new-hab-time')?.value;if(!time){showToast('Daily needs a time');return}hab.schedule={time}}
  S.habits.push(hab);save();
  document.getElementById('recipe-modal').classList.remove('show');
  renderHabits();showToast(n+' added as '+type);
}

function logHabWithTime(id,e){
  e.stopPropagation();const h=S.habits.find(x=>x.id===id);if(!h)return;
  if(h.auto){showToast(AUTO_HABITS[id]||'Auto-linked');return}
  const t=todayKey();if(!S.dailyLog[t])S.dailyLog[t]={};
  if(S.dailyLog[t][id]){showToast('Already logged today');return}
  // Use time prompt
  _pendingHab={id,dk:t,hb:h,fromHabits:true};
  showHabPrompt(h,e);
}

function showHabPrompt(hb,evt){
  const pr=document.getElementById('ht-prompt');if(!pr)return;
  document.getElementById('htp-title').textContent=hb.name;
  document.getElementById('htp-sub').textContent='Pick the time — required for timeline.';
  const now=new Date();const curH=now.getHours();
  const times=[{label:'Just now',value:nowTimeStr()}];
  if(curH>=7)times.push({label:'Morning',value:'08:00'});
  if(curH>=12)times.push({label:'Afternoon',value:'14:00'});
  if(curH>=17)times.push({label:'Evening',value:'19:00'});
  times.push({label:'Before bed',value:'22:00'});
  document.getElementById('htp-grid').innerHTML=times.map(t=>`<div class="ht-time-btn" onclick="confirmHabTime('${t.value}')">${t.label}<div style="font-size:8px;color:var(--t3);margin-top:1px">${t.value}</div></div>`)
    .join('')+`<div style="grid-column:1/-1;display:flex;gap:4px;margin-top:4px"><input type="time" id="htp-exact" value="${nowTimeStr()}" style="flex:1;padding:6px;background:var(--s3);border:1px solid var(--bd);border-radius:4px;color:var(--text);font-size:12px;font-family:var(--mono)"><button class="ht-time-btn" style="flex:0 0 auto;padding:6px 12px" onclick="confirmHabTime(document.getElementById('htp-exact').value)">Set</button></div>`;
  pr.style.display='block';
  const r=evt?.target?.getBoundingClientRect?.();
  pr.style.top=Math.min((r?.bottom||300)+4,window.innerHeight-340)+'px';
  pr.style.left=Math.min((r?.left||200),window.innerWidth-270)+'px';
}

function confirmHabTime(timeStr){
  if(!_pendingHab||!timeStr||!timeStr.includes(':')){showToast('Time is required');return}
  const {id,dk,hb,fromHabits}=_pendingHab;
  if(!S.dailyLog[dk])S.dailyLog[dk]={};
  S.dailyLog[dk][id]=timeStr;
  hb.reps++;hb.streak++;addXP(hb.base,hb.stat,null);
  showToast(`${hb.name} ✓ at ${timeStr} → timeline`);
  closeHabPrompt();save();
  if(fromHabits)renderHabits();else renderDaily();
  updateSB();
}

function closeHabPrompt(){_pendingHab=null;const p=document.getElementById('ht-prompt');if(p)p.style.display='none'}
document.addEventListener('click',e=>{const p=document.getElementById('ht-prompt');if(p&&p.style.display==='block'&&!p.contains(e.target)&&!e.target.closest('.boost-card')){closeHabPrompt()}})

function decHab(id,e){e.stopPropagation();const h=S.habits.find(x=>x.id===id);if(!h)return;
  const t=todayKey();if(!S.dailyLog[t]?.[id]){showToast('Not logged today');return}
  delete S.dailyLog[t][id];if(h.reps>0)h.reps--;if(h.streak>0)h.streak--;removeXP(h.base,h.stat);save();renderHabits()}
// Pull down with timestamp

function logPullDown(id,stat,e){
  e.stopPropagation();const h=S.habits.find(x=>x.id===id);if(!h)return;
  const t=todayKey();if(!S.dailyLog[t])S.dailyLog[t]={};
  const ts=nowTimeStr();
  S.dailyLog[t][id]=ts;// log with timestamp for timeline
  h.reps++;damage(6);
  if(S.player.statXP[stat])S.player.statXP[stat]=Math.max(0,S.player.statXP[stat]-3);
  showToast(`${h.name} at ${ts} — −6 HP · −3 ${stat.toUpperCase()} XP`);
  save();renderHabits();updateSB();
}

function switchHabitType(id,newType){
  const h=S.habits.find(x=>x.id===id);if(!h)return;
  if(newType==='daily'){const time=prompt('Scheduled time? (e.g. 07:00, 18:30)');if(!time)return;h.schedule={time};h.type='daily'}
  else if(newType==='booster'){h.type='booster';delete h.schedule}
  save();renderHabits();showToast(h.name+' → '+newType)
}
// Log any habit with timestamp (reuses time prompt from Today)

function getDailies(dk){
  const d=dk?new Date(dk+'T12:00:00'):new Date();const dow=d.getDay();
  return S.habits.filter(h=>h.type==='daily'&&h.schedule).map(h=>{
    // Weekly check
    if(h.schedule.days&&!h.schedule.days.includes(dow))return null;
    return{id:h.id,name:h.name,time:h.schedule.time||'—',xp:h.base,stat:h.stat,emoji:h.icon,auto:h.auto||null}
  }).filter(Boolean).sort((a,b)=>{const ta=a.time==='All day'?'99':a.time;const tb=b.time==='All day'?'99':b.time;return ta.localeCompare(tb)});
}
// Boosters: habits with type='booster'

function getBoosters(){return S.habits.filter(h=>h.type==='booster')}
// Negatives

function getNegatives(){return S.habits.filter(h=>h.type==='negative')}

function getHabDayVal(id){const t=todayKey();return S.dailyLog[t]?.[id]?1:0}

function isAutoHabit(id){return!!AUTO_HABITS[id]}

function isAutoHabitDone(id){const t=todayKey();if(id==='gym'){const wk=getCurrentWeekKey();const log=S.workoutLog[wk];return log&&Object.values(log).some(s=>s.completedAt&&s.completedAt.startsWith(t))}if(id==='protein'){return getTodayMacros().p>=195}if(id==='water_h'){return(S.waterLog[t]||0)>=3000}return false}

function getTodayTodos(dk){
  const d=new Date(dk+'T12:00:00');const dow=d.getDay();const dom=d.getDate();
  return S.todos.filter(t=>{
    if(t.done&&t.freq==='once')return false;
    if(t.freq==='daily')return true;
    if(t.freq==='weekly'&&t.date){return new Date(t.date+'T12:00:00').getDay()===dow}
    if(t.freq==='monthly'&&t.date){return new Date(t.date+'T12:00:00').getDate()===dom}
    if(!t.freq||t.freq==='once'||t.freq==='custom')return t.date===dk;
    return false;
  });
}
