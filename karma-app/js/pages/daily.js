/* ═══ KARMA — Today ═══ */

function renderDaily(){
  const dk=dateKey(viewDate),isToday=dk===todayKey();
  if(isToday)autoCapture(dk);
  const scheduled=getDailies(dk);const boosters=getBoosters();
  const tw=S.weightLog[dk]||'',waterML=S.waterLog[dk]||0,waterL=(waterML/1000).toFixed(1),waterPct=Math.min(100,Math.round(waterML/3000*100));
  const weightLogged=!!S.weightLog[dk];
  const dayPills=Array.from({length:14},(_,i)=>{const d=new Date();d.setDate(d.getDate()-13+i);const k=dateKey(d);const dn=d.toLocaleDateString('en-IN',{weekday:'short'}).slice(0,2);const dd=d.getDate();return`<div class="day-pill ${k===dk?'active':''} ${k===todayKey()?'today':''}" onclick="setViewDate('${k}')">${dn} ${dd}</div>`}).join('');
  
  const schedDone=scheduled.filter(d=>S.dailyLog[dk]?.[d.id]).length;
  const boostDone=boosters.filter(h=>S.dailyLog[dk]?.[h.id]).length;
  const dayTodos=getTodayTodos(dk);
  const todoDone=dayTodos.filter(t=>S.dailyLog[dk]?.['todo_'+t.created]).length;
  const dailyPct=scheduled.length?Math.round(schedDone/scheduled.length*100):100;
  const totalXP=scheduled.filter(d=>S.dailyLog[dk]?.[d.id]).reduce((a,d)=>a+Math.round(d.xp*xpMult()),0)+boosters.filter(h=>S.dailyLog[dk]?.[h.id]).reduce((a,h)=>a+Math.round(h.base*xpMult()),0);

  // Dynamic insights
  const insights=buildInsights(dk,scheduled,boosters,dayTodos);
  window._currentInsights=insights;
  if(insightIdx>=insights.length)insightIdx=0;
  const ins=insights[insightIdx]||{text:'All clear. Keep going.',bg:'linear-gradient(135deg,#151520,#1a1525)',color:'var(--int)',glow:'rgba(138,126,212,.1)'};

  // Timeline: scheduled + logged boosters + completed todos + weight entry
  const timeline=[];
  scheduled.forEach(d=>{timeline.push({time:d.time,name:d.name,icon:d.emoji,stat:d.stat,done:!!S.dailyLog[dk]?.[d.id],id:d.id,tag:'daily',auto:d.auto})});
  boosters.forEach(h=>{const v=S.dailyLog[dk]?.[h.id];if(v&&typeof v==='string'&&v.includes(':')){timeline.push({time:v,name:h.name,icon:h.icon,stat:h.stat,done:true,id:h.id,tag:'booster'})}});
  // Pull downs logged with timestamp
  getNegatives().forEach(h=>{const v=S.dailyLog[dk]?.[h.id];if(v&&typeof v==='string'&&v.includes(':')){timeline.push({time:v,name:h.name+' ⚠',icon:h.icon,stat:h.stat,done:true,id:h.id,tag:'pulldown'})}});
  dayTodos.forEach(td=>{const v=S.dailyLog[dk]?.['todo_'+td.created];if(v){const t=typeof v==='string'&&v.includes(':')?v:(td.time||'—');timeline.push({time:t,name:td.text,icon:'✅',stat:'int',done:true,id:'todo_'+td.created,tag:'todo'})}});
  // Workout activities from activityLog
  (S.activityLog[dk]||[]).forEach(a=>{timeline.push({time:a.time||'—',name:a.name,icon:a.icon||'🔥',stat:a.stat||'str',done:true,id:'wo_'+a.id,tag:'booster'})});
  // Weight as timeline entry
  if(weightLogged){timeline.push({time:'05:00',name:`Weight logged: ${S.weightLog[dk]}kg`,icon:'⚖️',stat:'per',done:true,id:'_weight',tag:'daily'})}
  timeline.sort((a,b)=>{const ta=a.time==='All day'?'99':a.time==='—'?'98':a.time;const tb=b.time==='All day'?'99':b.time==='—'?'98':b.time;return ta.localeCompare(tb)});

  const dailyW=scheduled.length?Math.round(schedDone/scheduled.length*80):80;
  const todoW=dayTodos.length?Math.round(todoDone/dayTodos.length*20):0;

  document.getElementById('page-daily').innerHTML=`
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px">
    <div><div class="pg-t">Today</div><div class="pg-s">${isToday?new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'}):'Viewing '+dk}</div></div>
    <div style="display:flex;gap:6px">
      <button class="btn-p" style="width:auto;padding:7px 16px;font-size:11px;border-radius:9999px" onclick="goTo('todos')">+ To-Do</button>
      <button class="btn-p" style="width:auto;padding:7px 16px;font-size:11px;border-radius:9999px" onclick="goTo('habits')">+ Habit</button>
    </div>
  </div>
  <div class="day-scroll">${dayPills}</div>
  <!-- Dynamic Insight -->
  <div style="margin-bottom:14px;position:relative">
    <div class="insight-slide" style="background:${ins.bg};color:${ins.color};border-radius:12px">
      <div class="ins-glow" style="position:absolute;inset:0;pointer-events:none;border-radius:12px;background:radial-gradient(ellipse 60% 80% at 20% 50%,${ins.glow},transparent)"></div>
      <div style="position:relative;z-index:1"><div style="font-size:8px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;opacity:.5;margin-bottom:6px">Live Insight</div><div class="ins-text" style="font-size:13px;font-weight:500;line-height:1.6;text-shadow:0 0 16px currentColor">${ins.text}</div></div>
      ${insights.length>1?`<div class="insight-dots">${insights.map((_,i)=>`<div class="insight-dot ${i===insightIdx?'active':''}" onclick="insightIdx=${i};renderInsightSlide()"></div>`).join('')}</div>`:''}
    </div>
  </div>
  <!-- Progress -->
  <div style="margin-bottom:14px">
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
      <span style="font-size:10px;font-weight:600;color:var(--t2)">Progress</span>
      <span style="font-size:10px;font-family:var(--mono)"><span class="glow-con">${schedDone}/${scheduled.length}</span> dailies${boostDone?` · <span class="glow-per">+${boostDone}</span> bonus`:''}</span>
    </div>
    <div class="prog-split"><div class="prog-split-seg" style="width:${dailyW}%;background:var(--con)"></div>${dayTodos.length?`<div class="prog-split-seg" style="width:${todoW}%;background:var(--int)"></div>`:''}${boostDone?`<div class="prog-split-seg" style="width:${Math.min(20,boostDone*5)}%;background:var(--per);opacity:.7"></div>`:''}</div>
    <div style="display:flex;gap:10px;margin-top:4px;font-size:9px">
      <span style="display:flex;align-items:center;gap:3px"><span style="width:6px;height:6px;border-radius:1px;background:var(--con)"></span>Dailies ${schedDone}/${scheduled.length}</span>
      ${dayTodos.length?`<span style="display:flex;align-items:center;gap:3px"><span style="width:6px;height:6px;border-radius:1px;background:var(--int)"></span>To-Do ${todoDone}/${dayTodos.length}</span>`:''}
      <span style="display:flex;align-items:center;gap:3px"><span style="width:6px;height:6px;border-radius:1px;background:var(--per)"></span>Boosters +${boostDone}</span>
    </div>
  </div>
  <!-- Widgets -->
  <div class="widget-row">
    <div class="widget">
      <div class="widget-icon">💧</div>
      <div class="widget-val glow-con">${waterL}L</div>
      <div class="widget-label">/ 3.0L</div>
      <div style="height:3px;background:rgba(255,255,255,.06);border-radius:2px;margin:8px 0 6px"><div style="height:100%;width:${waterPct}%;background:var(--con);border-radius:2px;transition:width .3s"></div></div>
      <div style="display:flex;gap:4px;justify-content:center">${[250,500,1000].map(ml=>`<button class="btn-g" style="padding:4px 10px;font-size:9px;border-radius:9999px;min-width:0" onclick="addWater(${ml},'${dk}')">${ml>=1000?'1L':ml+'ml'}</button>`).join('')}</div>
    </div>
    <div class="widget">
      <div class="widget-icon">⚖️</div>
      ${weightLogged
        ?`<div class="widget-val glow-con">${S.weightLog[dk]}<span style="font-size:10px;font-weight:400;color:var(--t3)"> kg</span></div>
          <div class="widget-label" style="color:var(--con)">✓ in timeline</div>
          <button class="btn-g" style="margin-top:6px;padding:3px 12px;font-size:8px;border-radius:9999px" onclick="undoWeight('${dk}')">↺ Undo</button>`
        :`<div class="widget-val" style="color:var(--t3)">—</div>
          <div class="widget-label">not logged</div>
          <div style="display:flex;gap:4px;margin-top:6px;align-items:center;justify-content:center">
            <input style="width:52px;padding:4px 6px;font-size:10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:8px;color:var(--text);text-align:center;font-family:var(--mono);outline:none" type="number" id="wt-in" placeholder="kg" step=".1">
            <button class="btn-p" style="width:auto;padding:4px 10px;font-size:9px;border-radius:9999px" onclick="saveWeight('${dk}')">Log</button>
          </div>`}
    </div>
    <div class="widget"><div class="widget-icon">⚡</div><div class="widget-val glow-gold">${totalXP}</div><div class="widget-label">XP earned</div></div>
    <div class="widget"><div class="widget-icon">📊</div><div class="widget-val" style="color:${dailyPct===100?'var(--gold)':dailyPct>=70?'var(--con)':'var(--t2)'}">${dailyPct}%</div><div class="widget-label">${dailyPct===100?'Perfect 🏆':dailyPct>=70?'Great':'Keep going'}</div></div>
  </div>
  <!-- Journal mini -->
  <div class="gcard" style="padding:10px 14px;margin-bottom:12px;display:flex;align-items:center;gap:10px">
    <div style="font-size:16px;flex-shrink:0">📝</div>
    <div style="flex:1;min-width:0">
      ${S.journal[dk]?`<div style="font-size:11px;line-height:1.5;color:var(--t2);max-height:36px;overflow:hidden;-webkit-mask-image:linear-gradient(to right,black 85%,transparent)">${S.journal[dk].slice(0,120)}...</div>`
      :`<div style="font-size:11px;color:var(--t3)">No journal entry yet</div>`}
    </div>
    <div style="display:flex;gap:4px;flex-shrink:0">
      ${S.journal[dk]?`<button class="btn-g" style="padding:4px 10px;font-size:9px;border-radius:9999px" onclick="goTo('journal')">Read</button>`
      :`<button class="btn-p" style="width:auto;padding:4px 10px;font-size:9px;border-radius:9999px" onclick="generateJournal('${dk}');goTo('journal')">Generate</button>`}
    </div>
  </div>
  <!-- 3 Columns -->
  <div class="today-3col">
    <!-- COL 1: Timeline -->
    <div><div class="gcard" style="padding:12px">
      <div style="font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);margin-bottom:10px;display:flex;justify-content:space-between;align-items:center">
        <span>📅 Timeline</span><span style="font-family:var(--mono);font-size:9px;color:var(--t4)">${timeline.filter(e=>e.done).length} logged</span>
      </div>
      <div style="position:relative">
        <div style="position:absolute;left:38px;top:0;bottom:0;width:1px;background:var(--s4);z-index:0"></div>
        ${timeline.map(ev=>`<div class="cal-event" style="border-left-color:var(--${ev.stat});${ev.done?'':'opacity:.45'};position:relative;z-index:1" ${ev.tag==='daily'&&!ev.auto&&ev.id!=='_weight'?`onclick="toggleDaily('${ev.id}','${dk}',this)"`:ev.auto?`onclick="goTo('${ev.auto}')"`:''}>
          <div class="cal-time">${ev.time}</div>
          <div style="flex:1"><div class="cal-name">${ev.icon} ${ev.name}</div>
          <div class="cal-sub">${ev.done?(ev.tag==='booster'?'bonus':ev.tag==='todo'?'completed':'done'):ev.auto?'→ go':'tap'}</div></div>
          <div style="display:flex;align-items:center;gap:4px">
            <span class="type-tag tag-${ev.tag}">${ev.tag}</span>
            ${ev.done?'<span style="color:var(--con);font-size:10px;font-weight:600">✓</span>':''}
          </div>
        </div>`).join('')}
      </div>
    </div></div>
    <!-- COL 2: Boosters -->
    <div><div class="gcard" style="padding:12px">
      <div style="font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);margin-bottom:10px;display:flex;justify-content:space-between;align-items:center">
        <span>⚡ Boosters</span>
        <div style="display:flex;gap:6px;align-items:center"><span class="glow-per" style="font-family:var(--mono);font-size:10px">+${boostDone}</span>
        <button class="btn-g" style="padding:2px 10px;font-size:8px;border-radius:9999px" onclick="goTo('habits')">+ New</button></div>
      </div>
      ${boosters.length?boosters.map(h=>{
        const isDone=!!S.dailyLog[dk]?.[h.id];const isAuto=!!h.auto;
        const autoMsg={workout:'Auto-logged when you complete a gym session in Workouts →',meals:'Auto-logged when you hit 195g protein in Nutrition →',daily:'Auto-logged when you reach 3L water in Today →'}[h.auto]||'';
        return`<div class="boost-card ${isDone?'bc-done':''}" onclick="${isAuto?`showToast('${isDone?'✓ Already logged today':'ℹ '+autoMsg}');${!isDone?`goTo('${h.auto}')`:''}`:`logBoosterClick('${h.id}','${dk}',event,this)`}">
          <div style="font-size:16px;flex-shrink:0">${h.icon}</div>
          <div style="flex:1;min-width:0;position:relative;z-index:1">
            <div style="font-size:12px;font-weight:500;letter-spacing:-.01em;${isDone?'color:var(--con)':''}">${h.name}</div>
            <div style="font-size:9px;color:var(--t3)">${isAuto?'auto-tracked':'+ '+h.base+' XP'} · ${h.reps} total</div>
          </div>
          <div style="display:flex;gap:4px;align-items:center;position:relative;z-index:2">
            ${isDone?`<span style="font-size:9px;color:var(--con);font-family:var(--mono)">${typeof S.dailyLog[dk][h.id]==='string'?S.dailyLog[dk][h.id]:'✓'}</span>`
            :isAuto?`<span style="font-size:8px;color:var(--primary2);background:rgba(245,151,104,.06);padding:2px 6px;border-radius:9999px;border:1px solid rgba(245,151,104,.12)">auto</span>`
            :`<span style="font-size:9px;color:var(--per)">tap</span>`}
            ${!isAuto?`<button class="bc-convert" onclick="event.stopPropagation();switchHabitType('${h.id}','daily')" title="Make daily">📅</button>`:''}
          </div>
        </div>`}).join('')
      :`<div style="text-align:center;padding:16px;color:var(--t3);font-size:11px">No boosters<br><span style="color:var(--primary2);cursor:pointer" onclick="goTo('habits')">+ Create</span></div>`}
    </div></div>
    <!-- COL 3: To-Dos -->
    <div><div class="gcard" style="padding:12px">
      <div style="font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);margin-bottom:10px;display:flex;justify-content:space-between;align-items:center">
        <span>✅ To-Dos</span>
        <div style="display:flex;gap:6px;align-items:center"><span class="glow-int" style="font-family:var(--mono);font-size:10px">${todoDone}/${dayTodos.length}</span>
        <button class="btn-g" style="padding:2px 10px;font-size:8px;border-radius:9999px" onclick="goTo('todos')">+ New</button></div>
      </div>
      ${dayTodos.length?dayTodos.map(td=>{
        const tdDone=!!S.dailyLog[dk]?.['todo_'+td.created];
        const doneTime=typeof S.dailyLog[dk]?.['todo_'+td.created]==='string'?S.dailyLog[dk]['todo_'+td.created]:null;
        return`<div class="todo-mini ${tdDone?'td-done':''}">
          <div class="todo-mini-chk" onclick="undoTodo(${td.created},'${dk}')" style="cursor:pointer">${tdDone?'<svg width="7" height="6" viewBox="0 0 8 7" fill="none"><path d="M1 3L3 5.5L7 1" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>':''}</div>
          <div style="flex:1"><div class="todo-mini-text">${td.text}</div>${td.tag?`<div class="todo-mini-tag">${td.tag}</div>`:''}</div>
          ${tdDone
            ?`<div style="font-size:9px;color:var(--con)">${doneTime||'✓'}</div>`
            :`<div style="display:flex;gap:3px;align-items:center">
              <input type="time" id="td-time-${td.created}" value="${nowTimeStr()}" style="padding:2px 4px;font-size:9px;background:var(--s4);border:1px solid var(--bd);border-radius:4px;color:var(--text);font-family:var(--mono);width:70px">
              <button style="padding:3px 6px;font-size:8px;background:var(--conbg);border:1px solid color-mix(in srgb,var(--con) 20%,var(--bd));border-radius:4px;color:var(--con);cursor:pointer" onclick="completeTodoAtTime(${td.created},'${dk}')">Done</button>
            </div>`}
        </div>`}).join('')
      :`<div style="text-align:center;padding:20px;color:var(--t3);font-size:11px;line-height:1.7">No to-dos today<br><span style="color:var(--gold);cursor:pointer" onclick="goTo('todos')">+ Add one</span></div>`}
    </div></div>
  </div>`;
}

function buildInsights(dk,scheduled,boosters,dayTodos){
  const ins=[];const now=new Date();const h=now.getHours();const m=now.getMinutes();const nowMin=h*60+m;
  const dl=S.dailyLog[dk]||{};
  // Find overdue dailies (scheduled time has passed but not done)
  const overdue=scheduled.filter(d=>{
    if(dl[d.id])return false;
    if(d.time==='All day')return false;
    const [th,tm]=(d.time||'00:00').split(':').map(Number);
    return(th*60+(tm||0))<nowMin;
  });
  // Find upcoming dailies (next 2 hours)
  const upcoming=scheduled.filter(d=>{
    if(dl[d.id])return false;
    if(d.time==='All day')return false;
    const [th,tm]=(d.time||'00:00').split(':').map(Number);
    const tMin=th*60+(tm||0);
    return tMin>=nowMin&&tMin<=(nowMin+120);
  });
  // Pending todos
  const pendingTodos=dayTodos.filter(t=>!dl['todo_'+t.created]);
  // Water status
  const waterML=S.waterLog[dk]||0;const waterPct=Math.round(waterML/3000*100);
  // Weight
  const weightDone=!!S.weightLog[dk];

  if(overdue.length>0){
    ins.push({text:`⚠️ ${overdue.length} overdue: ${overdue.slice(0,3).map(d=>d.name).join(', ')}${overdue.length>3?' +more':''}`,bg:'linear-gradient(135deg,#201518,#251a1a)',color:'var(--str)',glow:'rgba(201,123,107,.2)',priority:1});
  }
  if(upcoming.length>0){
    ins.push({text:`⏰ Coming up: ${upcoming.map(d=>d.name+' at '+d.time).join(' · ')}`,bg:'linear-gradient(135deg,#151a20,#182025)',color:'var(--con)',glow:'rgba(90,184,154,.15)',priority:2});
  }
  if(waterPct<50&&h>=10){
    ins.push({text:`💧 Only ${Math.round(waterML/1000*10)/10}L water — you need ${((3000-waterML)/1000).toFixed(1)}L more. ${h>=15?'Running low on time.':'Stay ahead.'}`,bg:'linear-gradient(135deg,#151e1a,#152018)',color:'var(--con)',glow:'rgba(90,184,154,.15)',priority:3});
  }
  if(!weightDone&&h>=6){
    ins.push({text:`⚖️ Weight not logged today. Best to log in the morning for accuracy.`,bg:'linear-gradient(135deg,#1a1815,#1e1a15)',color:'var(--per)',glow:'rgba(196,160,78,.15)',priority:4});
  }
  if(pendingTodos.length>0){
    ins.push({text:`📋 ${pendingTodos.length} to-do${pendingTodos.length>1?'s':''} pending: ${pendingTodos.slice(0,2).map(t=>t.text).join(', ')}`,bg:'linear-gradient(135deg,#151520,#1a1525)',color:'var(--int)',glow:'rgba(138,126,212,.15)',priority:5});
  }
  const schedDone=scheduled.filter(d=>dl[d.id]).length;
  const schedPct=scheduled.length?Math.round(schedDone/scheduled.length*100):100;
  if(schedPct>=80&&schedPct<100){
    const left=scheduled.filter(d=>!dl[d.id]);
    ins.push({text:`🔥 Almost there! ${left.length} left: ${left.slice(0,3).map(d=>d.name).join(', ')}`,bg:'linear-gradient(135deg,#1e1a15,#201815)',color:'var(--gold)',glow:'rgba(196,160,78,.15)',priority:6});
  }
  if(schedPct===100){
    ins.push({text:`🏆 All ${scheduled.length} dailies complete! You're crushing it.`,bg:'linear-gradient(135deg,#152018,#182520)',color:'var(--con)',glow:'rgba(90,184,154,.2)',priority:7});
  }
  // Time-based contextual
  if(h<7)ins.push({text:`🌅 Early start. Knock out morning routine — skincare, supplements, Hanuman Chalisa.`,bg:'linear-gradient(135deg,#1a1520,#1e1628)',color:'var(--int)',glow:'rgba(138,126,212,.12)',priority:8});
  else if(h<12)ins.push({text:`☀️ Morning block active. Green tea, stairs, stay hydrated between tasks.`,bg:'linear-gradient(135deg,#151e1a,#152018)',color:'var(--con)',glow:'rgba(90,184,154,.12)',priority:8});
  else if(h<17)ins.push({text:`⚡ Afternoon push. Hit step count, eat your planned snack. Don't skip.`,bg:'linear-gradient(135deg,#1a1815,#1e1a15)',color:'var(--per)',glow:'rgba(196,160,78,.12)',priority:8});
  else if(h<21)ins.push({text:`🍽️ Evening routine. Dinner, journal, biz planning. Wind down process starts.`,bg:'linear-gradient(135deg,#1a1520,#1e1628)',color:'var(--int)',glow:'rgba(138,126,212,.12)',priority:8});
  else ins.push({text:`🌙 Night mode. PM skincare, magnesium, brush teeth. Phone down by 22:30.`,bg:'linear-gradient(135deg,#151520,#181822)',color:'var(--int)',glow:'rgba(138,126,212,.12)',priority:8});

  ins.sort((a,b)=>a.priority-b.priority);
  return ins.slice(0,6);// max 6 insights
}

function renderInsightSlide(){
  const el=document.querySelector('.insight-slide');const dots=document.querySelectorAll('.insight-dot');
  if(!el||!window._currentInsights||!window._currentInsights.length)return;
  const ins=window._currentInsights[insightIdx%window._currentInsights.length];
  if(!ins)return;
  el.style.background=ins.bg;el.style.color=ins.color;
  const gt=el.querySelector('.ins-text');if(gt)gt.textContent=ins.text;
  const gg=el.querySelector('.ins-glow');if(gg)gg.style.background=`radial-gradient(ellipse 60% 80% at 20% 50%,${ins.glow},transparent)`;
  dots.forEach((d,i)=>d.classList.toggle('active',i===insightIdx%window._currentInsights.length));
}

function toggleDaily(id,dk,el){
  if(!S.dailyLog[dk])S.dailyLog[dk]={};
  if(id==='weigh'&&!S.dailyLog[dk][id]&&!S.weightLog[dk]){showToast('Log your weight first');return}
  const was=S.dailyLog[dk][id];S.dailyLog[dk][id]=!was;
  const h=S.habits.find(x=>x.id===id);
  if(!was){if(h){addXP(h.base,h.stat,el);h.reps++;h.streak++}}
  else{if(h){removeXP(h.base,h.stat);if(h.reps>0)h.reps--;if(h.streak>0)h.streak--}}
  save();renderDaily();updateSB()
}

function addWater(ml,dk){S.waterLog[dk]=(S.waterLog[dk]||0)+ml;save();renderDaily();showToast(`+${ml}ml`)}

function saveWeight(dk){const v=parseFloat(document.getElementById('wt-in').value);if(isNaN(v)||v<30||v>300){showToast('Invalid');return}S.weightLog[dk]=v;
  if(!S.dailyLog[dk])S.dailyLog[dk]={};
  if(!S.dailyLog[dk]['weigh']){S.dailyLog[dk]['weigh']=true;const w=S.habits.find(h=>h.id==='weigh');if(w){w.reps++;w.streak++;addXP(w.base,w.stat,null)}}
  showToast(`${v}kg → timeline`);save();renderDaily()}

function undoWeight(dk){delete S.weightLog[dk];if(S.dailyLog[dk])delete S.dailyLog[dk]['weigh'];save();renderDaily();showToast('Weight cleared')}
// Booster click → time prompt (timestamp required)

function autoCapture(dk){
  if(!S.dailyLog[dk])S.dailyLog[dk]={};
  const now=new Date();const ts=String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
  if((S.waterLog[dk]||0)>=3000&&!S.dailyLog[dk]['water_h']){S.dailyLog[dk]['water_h']=ts;const w=S.habits.find(h=>h.id==='water_h');if(w){w.reps++;w.streak++}}
  if(typeof getTodayMacros==='function'){const m=getTodayMacros();if(m.p>=195&&!S.dailyLog[dk]['protein']){S.dailyLog[dk]['protein']=ts;const p=S.habits.find(h=>h.id==='protein');if(p){p.reps++;p.streak++}}}
  if(typeof getCurrentWeekKey==='function'){const wk=getCurrentWeekKey();const log=S.workoutLog?.[wk];if(log&&Object.values(log).some(s=>s.completedAt&&s.completedAt.startsWith(dk))&&!S.dailyLog[dk]['gym']){S.dailyLog[dk]['gym']=ts;const g=S.habits.find(h=>h.id==='gym');if(g){g.reps++;g.streak++}}}
  save();
}

function setViewDate(k){viewDate=new Date(k+'T12:00:00');renderDaily()}

function getTimeRec(){const h=new Date().getHours()*60+new Date().getMinutes();if(h<360)return{i:'🌅',t:'Early Morning',s:'Perfect time for fasted workout + supplements. Start your day strong.'};if(h<540)return{i:'☀️',t:'Morning Block',s:'Skincare, supplements, Hanuman Chalisa, post-workout breakfast.'};if(h<720)return{i:'🏢',t:'Office Hours',s:'Climb stairs, green tea, stay hydrated. Walk between meetings.'};if(h<900)return{i:'🥗',t:'Lunch Window',s:'Eat your planned meal — don\'t skip! Log it immediately.'};if(h<1080)return{i:'⚡',t:'Afternoon',s:'Office snack, hit step count. Hydrate. Stay focused.'};if(h<1260)return{i:'🍽️',t:'Evening Routine',s:'Dinner, journal entry, business planning time.'};return{i:'🌙',t:'Wind Down',s:'Night skincare, supplements, phone down by 22:30. Recovery = growth.'}}

function logBoosterClick(habId,dk,evt,el){
  evt.stopPropagation();
  const hb=S.habits.find(x=>x.id===habId);if(!hb)return;
  if(!S.dailyLog[dk])S.dailyLog[dk]={};
  if(S.dailyLog[dk][habId]){delete S.dailyLog[dk][habId];if(hb.reps>0)hb.reps--;if(hb.streak>0)hb.streak--;removeXP(hb.base,hb.stat);showToast(hb.name+' removed');save();renderDaily();updateSB();return}
  _pendingHab={id:habId,dk,hb};showHabPrompt(hb,evt);
}

function completeTodoAtTime(created,dk){
  if(!S.dailyLog[dk])S.dailyLog[dk]={};
  const inp=document.getElementById('td-time-'+created);
  const time=inp?inp.value:nowTimeStr();
  if(!time){showToast('Pick a time');return}
  S.dailyLog[dk]['todo_'+created]=time;
  save();renderDaily();updateSB();showToast('To-do done at '+time+' → timeline');
}

function undoTodo(created,dk){
  if(!S.dailyLog[dk])return;
  delete S.dailyLog[dk]['todo_'+created];
  save();renderDaily();updateSB();
}
