/* ═══ KARMA — Workout ═══ */

function renderWorkout(){
  const dk=woDateKey();const isToday=dk===todayKey();
  const wk=getCurrentWeekKey();
  const dayActs=getDayActivities(dk);
  const prog=S.workoutProgram;const completions=getWeekCompletions();
  const totalGymDone=Object.keys(completions).length;
  const dayPills=Array.from({length:14},(_,i)=>{const d=new Date();d.setDate(d.getDate()-13+i);const k=dateKey(d);const dn=d.toLocaleDateString('en-IN',{weekday:'short'}).slice(0,2);const dd=d.getDate();return`<div class="day-pill ${k===dk?'active':''} ${k===todayKey()?'today':''}" onclick="woViewDate=new Date('${k}T12:00:00');woScreen='main';renderWorkout()">${dn} ${dd}</div>`}).join('');

  if(woScreen==='gym_track'&&woActiveGymDay){renderGymTrack(dk);return}

  document.getElementById('page-workout').innerHTML=`
  <div class="pg-t">Workout</div>
  <div class="pg-s">${isToday?new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'}):'Viewing '+dk} · ${dayActs.length} activities · ${totalGymDone}/5 gym this week</div>
  <div class="day-scroll">${dayPills}</div>
  
  <div style="display:grid;grid-template-columns:1fr 320px;gap:14px;align-items:start;margin-top:14px">
    <!-- LEFT: Tracked + Gym Week -->
    <div>
      <div class="gcard" style="padding:14px">
        <div style="font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);margin-bottom:10px;display:flex;justify-content:space-between">
          <span>📋 Tracked Activities</span><span style="font-family:var(--mono);font-size:9px">${dayActs.length} logged</span>
        </div>
        ${dayActs.length?dayActs.map((a,i)=>`
          <div class="cal-event" style="border-left-color:var(--${a.stat||'str'});margin-bottom:4px">
            <div class="cal-time">${a.time||'—'}</div>
            <div style="flex:1"><div class="cal-name">${a.icon||'🔥'} ${a.name}</div><div class="cal-sub">${a.details||a.type}</div></div>
            <div style="display:flex;gap:4px;align-items:center">
              <span class="type-tag tag-booster">${a.type}</span>
              ${a.xp?`<span style="font-size:9px;color:var(--gold);font-family:var(--mono)">+${a.xp}xp</span>`:''}
              <button style="padding:2px 5px;font-size:8px;background:transparent;border:1px solid var(--bd);border-radius:4px;color:var(--t3);cursor:pointer" onclick="delWoActivity('${dk}',${i})">✕</button>
            </div>
          </div>`).join('')
        :`<div style="text-align:center;padding:30px;color:var(--t3);font-size:12px;line-height:1.7"><div style="font-size:28px;margin-bottom:8px;opacity:.4">🏋️</div>No activities logged${isToday?' today':''}. Add one →</div>`}
      </div>
      <!-- Gym Program Week -->
      <div class="gcard" style="padding:14px;margin-top:10px">
        <div style="font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);margin-bottom:10px;display:flex;justify-content:space-between;align-items:center">
          <span>🗓️ Gym Week · ${totalGymDone}/5</span>
          <div style="display:flex;gap:4px">
            <button class="btn-g" style="padding:2px 8px;font-size:8px;border-radius:9999px" onclick="openAddProgramDay()">+ Add Day</button>
            <button class="btn-g" style="padding:2px 8px;font-size:8px;border-radius:9999px" onclick="openEditProgram()">Edit</button>
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">${prog.map(d=>{
          const comp=completions[d.day];const isDone=!!comp;
          const doneDate=comp?new Date(comp.completedAt).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'}):'';
          return`<div style="flex:1;min-width:100px;padding:10px;border-radius:10px;border:1px solid ${isDone?'var(--con)':d.rest?'rgba(138,126,212,.15)':'rgba(255,255,255,.04)'};background:${isDone?'var(--conbg)':d.rest?'rgba(138,126,212,.03)':'rgba(255,255,255,.02)'};cursor:pointer;transition:.15s" onclick="${d.rest?`logRestDay('${wk}','${d.day}')`:`woActiveGymDay=${d.day};woScreen='gym_track';renderWorkout()`}" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 14px rgba(0,0,0,.2)'" onmouseout="this.style.transform='none';this.style.boxShadow='none'">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <span style="font-size:18px">${MUSCLE_ICONS[d.name]||'💪'}</span>
              ${isDone?'<span style="font-size:9px;color:var(--con);font-weight:600">✓ Done</span>':''}
            </div>
            <div style="font-size:12px;font-weight:600;margin-bottom:2px">${d.name}</div>
            <div style="font-size:9px;color:var(--t3);line-height:1.4">${d.rest?'Recovery · Stretch':'<span style="letter-spacing:-.01em">'+d.muscles+'</span>'}</div>
            ${!d.rest?`<div style="font-size:8px;color:var(--t4);margin-top:4px">${d.exercises?.slice(0,3).map(e=>e.name).join(' · ')}${d.exercises?.length>3?' +more':''}</div>`:`<div style="font-size:8px;color:var(--int);margin-top:4px;opacity:.6">Tap to log</div>`}
            ${isDone?`<div style="font-size:8px;color:var(--con);margin-top:4px">📅 ${doneDate}</div>`:''}
          </div>`}).join('')}</div>
        <!-- Add custom under gym week -->
        <div style="margin-top:8px;text-align:center"><button class="btn-g" style="padding:5px 14px;font-size:9px;border-radius:9999px" onclick="openAddProgramDay()">+ Add Custom Day</button></div>
      </div>
    </div>
    <!-- RIGHT: Add Activity -->
    <div style="position:sticky;top:16px;display:flex;flex-direction:column;gap:10px">
      <div class="gcard" style="padding:14px" id="wo-add-panel">
        <div style="font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);margin-bottom:12px">+ Log Activity</div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <div class="boost-card" onclick="openWoFlow('gym')"><div style="font-size:20px">🏋️</div><div style="flex:1"><div style="font-size:13px;font-weight:600">Gym Session</div><div style="font-size:10px;color:var(--t3)">Push, Pull, Legs, Upper, Lower</div></div><div style="color:var(--str);font-size:10px">→</div></div>
          <div class="boost-card" onclick="openWoFlow('run')"><div style="font-size:20px">🏃</div><div style="flex:1"><div style="font-size:13px;font-weight:600">Running / Walking</div><div style="font-size:10px;color:var(--t3)">Distance, pace, duration</div></div><div style="color:var(--con);font-size:10px">→</div></div>
          <div class="boost-card" onclick="openWoFlow('sport')"><div style="font-size:20px">⚽</div><div style="flex:1"><div style="font-size:13px;font-weight:600">Sport / Game</div><div style="font-size:10px;color:var(--t3)">Basketball, Cricket, Football...</div></div><div style="color:var(--per);font-size:10px">→</div></div>
          <div class="boost-card" onclick="openWoFlow('yoga')"><div style="font-size:20px">🧘</div><div style="flex:1"><div style="font-size:13px;font-weight:600">Yoga / Stretching</div><div style="font-size:10px;color:var(--t3)">Session duration</div></div><div style="color:var(--int);font-size:10px">→</div></div>
          <div class="boost-card" onclick="openWoFlow('other')"><div style="font-size:20px">🔥</div><div style="flex:1"><div style="font-size:13px;font-weight:600">Other Activity</div><div style="font-size:10px;color:var(--t3)">Swimming, cycling, HIIT...</div></div><div style="color:var(--t3);font-size:10px">→</div></div>
        </div>
      </div>
      <!-- Aria Custom Workout -->
      <div class="gcard" style="padding:14px;background:linear-gradient(145deg,rgba(14,17,27,.95),rgba(23,23,23,.95));position:relative;overflow:hidden">
        <div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 0%,rgba(138,126,212,.04),transparent 60%);pointer-events:none"></div>
        <div style="position:relative;z-index:1">
          ${ariaHeader('Aria','Workout Designer')}
          <div style="font-size:10px;color:var(--t2);line-height:1.5;margin-bottom:8px">Describe a workout and Aria will generate exercises, sets, reps, and log it for you.</div>
          <div style="display:flex;gap:4px">
            <input class="f-input" id="aria-wo-inp" placeholder="e.g. 'chest and triceps, 5 exercises'" style="font-size:11px;flex:1">
            <button class="btn-p" style="width:auto;padding:6px 14px;font-size:10px;border-radius:9999px;white-space:nowrap" onclick="ariaCustomWorkout()">Generate</button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function openWoFlow(type){
  const dk=woDateKey();const panel=document.getElementById('wo-add-panel');if(!panel)return;
  const ts=nowTimeStr();
  if(type==='gym'){
    const prog=S.workoutProgram;
    panel.innerHTML=`<div style="font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);margin-bottom:12px;display:flex;justify-content:space-between"><span>🏋️ Pick Session</span><span style="cursor:pointer;color:var(--gold)" onclick="renderWorkout()">✕ Cancel</span></div>
    <div style="display:flex;flex-direction:column;gap:6px">${prog.filter(d=>!d.rest).map(d=>`
      <div class="boost-card" onclick="woActiveGymDay=${d.day};woScreen='gym_track';renderWorkout()">
        <div style="font-size:18px">${MUSCLE_ICONS[d.name]||'💪'}</div>
        <div style="flex:1"><div style="font-size:12px;font-weight:600">${d.name}</div><div style="font-size:9px;color:var(--t3)">${d.muscles} · ${d.exercises.length} ex · ${d.exercises.reduce((a,e)=>a+(e.sets?.length||3),0)} sets</div></div>
        <div style="color:var(--str);font-size:10px">→</div>
      </div>`).join('')}
      <div style="border-top:1px solid rgba(255,255,255,.04);margin:4px 0;padding-top:4px">
        <div class="boost-card" onclick="openQuickCustomSession()">
          <div style="font-size:18px">✨</div>
          <div style="flex:1"><div style="font-size:12px;font-weight:600">Custom Session</div><div style="font-size:9px;color:var(--t3)">Build your own or let Aria design one</div></div>
          <div style="color:var(--primary2);font-size:10px">→</div>
        </div>
      </div>
    </div>`;
  } else if(type==='run'){
    panel.innerHTML=`<div style="font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);margin-bottom:12px;display:flex;justify-content:space-between"><span>🏃 Running / Walking</span><span style="cursor:pointer;color:var(--gold)" onclick="renderWorkout()">✕</span></div>
    <div class="f-group"><label class="f-label">Type</label><select class="f-input" id="wo-run-type"><option>Running</option><option>Walking</option><option>Jogging</option><option>Sprints</option></select></div>
    <div class="f-row"><div class="f-group"><label class="f-label">Distance (km)</label><input class="f-input" id="wo-run-dist" type="number" step="0.1" placeholder="5.0"></div><div class="f-group"><label class="f-label">Duration (min)</label><input class="f-input" id="wo-run-dur" type="number" placeholder="30"></div></div>
    <div class="f-row"><div class="f-group"><label class="f-label">Pace (min/km)</label><input class="f-input" id="wo-run-pace" type="number" step="0.1" placeholder="6.0"></div><div class="f-group"><label class="f-label">Time</label><input class="f-input" id="wo-run-time" type="time" value="${ts}"></div></div>
    <button class="btn-p" style="margin-top:8px" onclick="logRunAct('${dk}')">Log Activity</button>`;
  } else if(type==='sport'){
    panel.innerHTML=`<div style="font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);margin-bottom:12px;display:flex;justify-content:space-between"><span>⚽ Sport / Game</span><span style="cursor:pointer;color:var(--gold)" onclick="renderWorkout()">✕</span></div>
    <div class="f-group"><label class="f-label">Sport</label><select class="f-input" id="wo-sport-name"><option>Basketball</option><option>Football</option><option>Cricket</option><option>Tennis</option><option>Badminton</option><option>Table Tennis</option><option>Volleyball</option><option>Other</option></select></div>
    <div class="f-row"><div class="f-group"><label class="f-label">Duration (min)</label><input class="f-input" id="wo-sport-dur" type="number" placeholder="60"></div><div class="f-group"><label class="f-label">Time</label><input class="f-input" id="wo-sport-time" type="time" value="${ts}"></div></div>
    <div class="f-group"><label class="f-label">Notes</label><input class="f-input" id="wo-sport-notes" placeholder="Score, opponents..."></div>
    <button class="btn-p" style="margin-top:8px" onclick="logSportAct('${dk}')">Log Activity</button>`;
  } else if(type==='yoga'){
    panel.innerHTML=`<div style="font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);margin-bottom:12px;display:flex;justify-content:space-between"><span>🧘 Yoga / Stretching</span><span style="cursor:pointer;color:var(--gold)" onclick="renderWorkout()">✕</span></div>
    <div class="f-group"><label class="f-label">Type</label><select class="f-input" id="wo-yoga-type"><option>Yoga</option><option>Stretching</option><option>Foam Rolling</option><option>Mobility</option></select></div>
    <div class="f-row"><div class="f-group"><label class="f-label">Duration (min)</label><input class="f-input" id="wo-yoga-dur" type="number" placeholder="20"></div><div class="f-group"><label class="f-label">Time</label><input class="f-input" id="wo-yoga-time" type="time" value="${ts}"></div></div>
    <button class="btn-p" style="margin-top:8px" onclick="logYogaAct('${dk}')">Log Activity</button>`;
  } else {
    panel.innerHTML=`<div style="font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);margin-bottom:12px;display:flex;justify-content:space-between"><span>🔥 Other Activity</span><span style="cursor:pointer;color:var(--gold)" onclick="renderWorkout()">✕</span></div>
    <div class="f-group"><label class="f-label">Activity name</label><input class="f-input" id="wo-other-name" placeholder="Swimming, HIIT, Cycling..."></div>
    <div class="f-row"><div class="f-group"><label class="f-label">Duration (min)</label><input class="f-input" id="wo-other-dur" type="number" placeholder="30"></div><div class="f-group"><label class="f-label">Time</label><input class="f-input" id="wo-other-time" type="time" value="${ts}"></div></div>
    <div class="f-group"><label class="f-label">Calories (est)</label><input class="f-input" id="wo-other-cal" type="number" placeholder="200"></div>
    <button class="btn-p" style="margin-top:8px" onclick="logOtherAct('${dk}')">Log Activity</button>`;
  }
}

function logRunAct(dk){const type=document.getElementById('wo-run-type').value;const dist=parseFloat(document.getElementById('wo-run-dist').value)||0;const dur=parseInt(document.getElementById('wo-run-dur').value)||0;const pace=document.getElementById('wo-run-pace').value||'';const time=document.getElementById('wo-run-time').value||nowTimeStr();if(!dur){showToast('Enter duration');return}const xp=Math.round(dur/3);logActivityToTimeline({id:'run_'+Date.now(),type:'cardio',name:type,icon:'🏃',stat:'str',time,xp,details:`${dist?dist+'km · ':''}${dur}min${pace?' · '+pace+'min/km':''}`},dk);addXP(xp,'str',null);showToast(`${type} logged +${xp} XP`);renderWorkout()}

function logSportAct(dk){const name=document.getElementById('wo-sport-name').value;const dur=parseInt(document.getElementById('wo-sport-dur').value)||0;const time=document.getElementById('wo-sport-time').value||nowTimeStr();const notes=document.getElementById('wo-sport-notes')?.value||'';if(!dur){showToast('Enter duration');return}const xp=Math.round(dur/4);logActivityToTimeline({id:'sport_'+Date.now(),type:'sport',name,icon:'⚽',stat:'str',time,xp,details:`${dur}min${notes?' · '+notes:''}`},dk);addXP(xp,'str',null);showToast(`${name} logged +${xp} XP`);renderWorkout()}

function logYogaAct(dk){const type=document.getElementById('wo-yoga-type').value;const dur=parseInt(document.getElementById('wo-yoga-dur').value)||0;const time=document.getElementById('wo-yoga-time').value||nowTimeStr();if(!dur){showToast('Enter duration');return}const xp=Math.round(dur/4);logActivityToTimeline({id:'yoga_'+Date.now(),type:'recovery',name:type,icon:'🧘',stat:'con',time,xp,details:`${dur}min`},dk);addXP(xp,'con',null);showToast(`${type} logged +${xp} XP`);renderWorkout()}

function logOtherAct(dk){const name=document.getElementById('wo-other-name').value.trim();const dur=parseInt(document.getElementById('wo-other-dur').value)||0;const time=document.getElementById('wo-other-time').value||nowTimeStr();const cal=document.getElementById('wo-other-cal')?.value||'';if(!name||!dur){showToast('Name + duration required');return}const xp=Math.round(dur/5);logActivityToTimeline({id:'oth_'+Date.now(),type:'other',name,icon:'🔥',stat:'str',time,xp,details:`${dur}min${cal?' · ~'+cal+'kcal':''}`},dk);addXP(xp,'str',null);showToast(`${name} logged`);renderWorkout()}

async function ariaCustomWorkout(){
  const inp=document.getElementById('aria-wo-inp');
  if(!inp?.value.trim()){showToast('Describe a workout');return}
  const desc=inp.value.trim();inp.value='';
  showToast('Aria is designing your workout...');
  try{
    const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:400,messages:[{role:'user',content:`Design a balanced gym workout for: "${desc}". Return ONLY valid JSON, no markdown. Give exactly 4-5 exercises with 3-4 sets each and realistic reps (8-15). Format: {"name":"Workout Name","muscles":"Primary · Secondary","exercises":[{"name":"Exercise","muscle":"target","sets":[{"weight":0,"reps":10},{"weight":0,"reps":10},{"weight":0,"reps":8}]}]}`}]})});
    const d=await r.json();const text=d.content?.[0]?.text||'';
    const workout=JSON.parse(text.replace(/```json|```/g,'').trim());
    showAriaWorkoutConfirm(workout);
  }catch(e){showToast('Could not generate. Try again.');console.error(e)}
}

function showAriaWorkoutConfirm(workout){
  window._ariaWorkout=workout;
  document.getElementById('recipe-modal').querySelector('.modal-t').textContent='Workout Generated';
  document.getElementById('recipe-modal').querySelector('.modal-s').textContent='Review and confirm';
  const exList=workout.exercises||[];
  document.getElementById('recipe-form').innerHTML=`
  ${ariaHeader('Aria','Workout Designer')}
  <div style="text-align:center;margin-bottom:14px">
    <div style="font-size:18px;font-weight:600;letter-spacing:-.02em;margin-bottom:2px">${workout.name||'Custom Workout'}</div>
    <div style="font-size:10px;color:var(--t2)">${workout.muscles||''} · ${exList.length} exercises</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:14px">
    ${exList.map((ex,i)=>`<div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:8px;padding:10px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <div style="font-size:12px;font-weight:600">${i+1}. ${ex.name}</div>
        <div style="font-size:8px;color:var(--t3);background:rgba(255,255,255,.04);padding:2px 6px;border-radius:9999px">${ex.muscle||''}</div>
      </div>
      <div style="font-size:9px;color:var(--t2);font-family:var(--mono)">${(ex.sets||[]).map((s,si)=>`Set ${si+1}: ${s.weight||0}kg × ${s.reps||12}`).join(' · ')}</div>
    </div>`).join('')}
  </div>
  <div style="display:flex;gap:6px">
    <button class="btn-p" style="flex:2;border-radius:9999px;font-size:12px" onclick="confirmAriaWorkout(window._ariaWorkout,'log')">✓ Log Now</button>
    <button class="btn-g" style="flex:2;border-radius:9999px;font-size:12px" onclick="confirmAriaWorkout(window._ariaWorkout,'save')">💾 Save to Program</button>
    <button class="btn-g" style="flex:1;border-radius:9999px;font-size:12px;color:var(--str)" onclick="document.getElementById('recipe-modal').classList.remove('show')">✕</button>
  </div>`;
  document.getElementById('recipe-modal').classList.add('show');
}

function confirmAriaWorkout(workout,action){
  const dk=woDateKey();const ts=nowTimeStr();const exList=workout.exercises||[];
  if(action==='log'){
    const xp=exList.length*15;
    logActivityToTimeline({id:'custom_'+Date.now(),type:'gym',name:workout.name,icon:'🏋️',stat:'str',time:ts,xp,details:`${exList.length} exercises · ${exList.reduce((a,e)=>(a+(e.sets?.length||3)),0)} sets`},dk);
    addXP(xp,'str',null);
    showToast(`${workout.name} logged! +${xp} STR XP`);
  }
  if(action==='save'||action==='log'){
    // Save as custom program day
    const newDay={day:S.workoutProgram.length+1,name:workout.name,muscles:workout.muscles||'Custom',exercises:exList.map(ex=>({name:ex.name,muscle:ex.muscle||'',sets:(ex.sets||[{reps:12},{reps:12},{reps:10}]).map(s=>({weight:s.weight||0,reps:s.reps||12}))})),rest:false,custom:true};
    S.workoutProgram.push(newDay);save();
    showToast(action==='save'?`${workout.name} added to program`:`Logged & saved to program`);
  }
  document.getElementById('recipe-modal').classList.remove('show');
  renderWorkout();updateSB();
}

function openEditProgram(){
  document.getElementById('recipe-modal').querySelector('.modal-t').textContent='Edit Gym Program';
  document.getElementById('recipe-modal').querySelector('.modal-s').textContent='Reorder or remove days from your program';
  const prog=S.workoutProgram;
  document.getElementById('recipe-form').innerHTML=`
  <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:14px" id="edit-prog-list">
    ${prog.map((d,i)=>`<div style="display:flex;align-items:center;gap:8px;padding:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:8px">
      <div style="font-family:var(--mono);font-size:10px;color:var(--t3);width:20px;text-align:center">${i+1}</div>
      <div style="font-size:14px">${MUSCLE_ICONS[d.name]||'💪'}</div>
      <div style="flex:1">
        <div style="font-size:12px;font-weight:600">${d.name}</div>
        <div style="font-size:9px;color:var(--t3)">${d.rest?'Rest day':d.muscles+' · '+(d.exercises?.length||0)+' exercises'}</div>
      </div>
      ${d.custom?`<button class="btn-g" style="padding:3px 8px;font-size:8px;border-radius:9999px;color:var(--str)" onclick="removeProgramDay(${i})">Remove</button>`:''}
      ${!d.rest&&d.exercises?.length?`<button class="btn-g" style="padding:3px 8px;font-size:8px;border-radius:9999px" onclick="editProgramDay(${i})">Edit</button>`:''}
    </div>`).join('')}
  </div>
  <button class="btn-g" style="width:100%;border-radius:9999px;margin-bottom:6px" onclick="openAddProgramDay()">+ Add Custom Day</button>
  <button class="btn-p" style="width:100%;border-radius:9999px" onclick="document.getElementById('recipe-modal').classList.remove('show');renderWorkout()">Done</button>`;
  document.getElementById('recipe-modal').classList.add('show');
}

function removeProgramDay(idx){
  if(!confirm('Remove '+S.workoutProgram[idx].name+' from program?'))return;
  S.workoutProgram.splice(idx,1);
  // Reindex days
  S.workoutProgram.forEach((d,i)=>d.day=i+1);
  save();openEditProgram();showToast('Removed');
}

function editProgramDay(idx){
  const d=S.workoutProgram[idx];
  document.getElementById('recipe-modal').querySelector('.modal-t').textContent='Edit: '+d.name;
  document.getElementById('recipe-modal').querySelector('.modal-s').textContent='Modify exercises';
  document.getElementById('recipe-form').innerHTML=`
  <div class="f-group"><label class="f-label">Day Name</label><input class="f-input" id="epd-name" value="${d.name}"></div>
  <div class="f-group"><label class="f-label">Muscles</label><input class="f-input" id="epd-muscles" value="${d.muscles||''}"></div>
  <div style="font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);margin:10px 0 6px">Exercises</div>
  <div id="epd-exercises">${(d.exercises||[]).map((ex,ei)=>`<div style="display:flex;align-items:center;gap:6px;padding:6px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:6px;margin-bottom:4px;font-size:11px">
    <span style="font-family:var(--mono);font-size:9px;color:var(--t3)">${ei+1}</span>
    <input class="f-input" value="${ex.name}" style="flex:1;padding:4px 6px;font-size:11px" data-epd-ex="${ei}">
    <span style="font-size:9px;color:var(--t3)">${ex.sets?.length||3} sets</span>
    <button style="border:none;background:transparent;color:var(--t4);cursor:pointer;font-size:9px" onclick="this.parentElement.remove()">✕</button>
  </div>`).join('')}</div>
  <div style="display:flex;gap:4px;margin-top:6px"><input class="f-input" id="epd-new-ex" placeholder="New exercise name" style="flex:1;font-size:11px;padding:5px 8px"><button class="btn-g" style="padding:4px 10px;font-size:9px;border-radius:9999px" onclick="addExToEdit()">+ Add</button></div>
  <button class="btn-p" style="width:100%;border-radius:9999px;margin-top:12px" onclick="saveProgramDay(${idx})">Save Changes</button>`;
}

function addExToEdit(){
  const inp=document.getElementById('epd-new-ex');if(!inp?.value.trim())return;
  const list=document.getElementById('epd-exercises');const count=list.children.length;
  const div=document.createElement('div');
  div.style='display:flex;align-items:center;gap:6px;padding:6px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:6px;margin-bottom:4px;font-size:11px';
  div.innerHTML=`<span style="font-family:var(--mono);font-size:9px;color:var(--t3)">${count+1}</span><input class="f-input" value="${inp.value.trim()}" style="flex:1;padding:4px 6px;font-size:11px" data-epd-ex="${count}"><span style="font-size:9px;color:var(--t3)">3 sets</span><button style="border:none;background:transparent;color:var(--t4);cursor:pointer;font-size:9px" onclick="this.parentElement.remove()">✕</button>`;
  list.appendChild(div);inp.value='';
}

function saveProgramDay(idx){
  const name=document.getElementById('epd-name').value.trim();
  const muscles=document.getElementById('epd-muscles').value.trim();
  if(!name){showToast('Enter a name');return}
  const exInputs=[...document.querySelectorAll('[data-epd-ex]')];
  const exercises=exInputs.map(inp=>({name:inp.value.trim(),muscle:muscles.split('·')[0]?.trim()||'',sets:S.workoutProgram[idx].exercises?.find(e=>e.name===inp.value.trim())?.sets||[{weight:0,reps:12},{weight:0,reps:12},{weight:0,reps:10}]})).filter(e=>e.name);
  S.workoutProgram[idx].name=name;
  S.workoutProgram[idx].muscles=muscles;
  S.workoutProgram[idx].exercises=exercises;
  save();showToast('Saved');openEditProgram();
}

function openAddProgramDay(){
  const MUSCLES=['Chest','Back','Shoulders','Biceps','Triceps','Legs','Quads','Hamstrings','Glutes','Calves','Core','Full Body'];
  document.getElementById('recipe-modal').querySelector('.modal-t').textContent='Add Program Day';
  document.getElementById('recipe-modal').querySelector('.modal-s').textContent='Create a new workout day';
  document.getElementById('recipe-form').innerHTML=`
  <div class="f-group"><label class="f-label">Day Name *</label><input class="f-input" id="apd-name" placeholder="e.g. Arms & Shoulders"></div>
  <div class="f-row">
    <div class="f-group"><label class="f-label">Primary Muscles *</label><select class="f-input" id="apd-muscle1">${MUSCLES.map(m=>`<option>${m}</option>`).join('')}</select></div>
    <div class="f-group"><label class="f-label">Secondary</label><select class="f-input" id="apd-muscle2"><option value="">None</option>${MUSCLES.map(m=>`<option>${m}</option>`).join('')}</select></div>
  </div>
  <div class="f-group"><label class="f-label">Type</label>
    <div style="display:flex;gap:6px">
      <label style="display:flex;align-items:center;gap:4px;font-size:11px;cursor:pointer"><input type="radio" name="apd-type" value="workout" checked> Workout</label>
      <label style="display:flex;align-items:center;gap:4px;font-size:11px;cursor:pointer"><input type="radio" name="apd-type" value="rest"> Rest Day</label>
    </div>
  </div>
  <div id="apd-ex-section">
    <div style="font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);margin:12px 0 6px">Exercises</div>
    <div id="apd-exercises"></div>
    <!-- Manual add with sets/reps -->
    <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:8px;padding:8px;margin-top:6px">
      <div style="font-size:8px;font-weight:600;color:var(--t4);margin-bottom:4px">ADD MANUALLY</div>
      <div style="display:flex;gap:4px;margin-bottom:4px">
        <input class="f-input" id="apd-new-ex" placeholder="Exercise name" style="flex:2;font-size:10px;padding:5px 8px" onkeydown="if(event.key==='Enter')addExToNewDay()">
        <input class="f-input" id="apd-new-sets" type="number" placeholder="Sets" value="3" style="width:50px;font-size:10px;padding:5px;text-align:center">
        <input class="f-input" id="apd-new-reps" type="number" placeholder="Reps" value="12" style="width:50px;font-size:10px;padding:5px;text-align:center">
        <button class="btn-g" style="padding:4px 10px;font-size:9px;border-radius:9999px;white-space:nowrap" onclick="addExToNewDay()">+</button>
      </div>
    </div>
    <!-- Aria auto-fill -->
    <div style="margin-top:8px;padding:10px;background:rgba(138,126,212,.03);border:1px solid rgba(138,126,212,.1);border-radius:8px">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">${ariaAvatar(18)}<span style="font-size:10px;color:var(--int);font-weight:600">Let Aria design it</span></div>
      <div style="font-size:9px;color:var(--t2);margin-bottom:6px">Aria will pick 4-5 exercises with balanced sets and reps based on your muscles.</div>
      <button class="btn-p" style="width:100%;padding:6px;font-size:10px;border-radius:9999px" onclick="ariaFillExercises()">✨ Auto-generate exercises</button>
    </div>
  </div>
  <button class="btn-p" style="width:100%;border-radius:9999px;margin-top:12px" onclick="saveNewProgramDay()">+ Add to Program</button>`;
  document.getElementById('recipe-modal').classList.add('show');
}

function addExToNewDay(){
  const inp=document.getElementById('apd-new-ex');if(!inp?.value.trim())return;
  const sets=parseInt(document.getElementById('apd-new-sets')?.value)||3;
  const reps=parseInt(document.getElementById('apd-new-reps')?.value)||12;
  const list=document.getElementById('apd-exercises');const count=list.children.length;
  const div=document.createElement('div');
  div.style='display:flex;align-items:center;gap:6px;padding:6px 8px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:6px;margin-bottom:3px;font-size:11px';
  div.innerHTML=`<span style="font-family:var(--mono);font-size:9px;color:var(--t3)">${count+1}</span><span style="flex:1;font-weight:500">${inp.value.trim()}</span><span style="font-size:9px;color:var(--t2);font-family:var(--mono)">${sets}×${reps}</span><button style="border:none;background:transparent;color:var(--t4);cursor:pointer;font-size:9px" onclick="this.parentElement.remove()">✕</button>`;
  div.dataset.exName=inp.value.trim();
  div.dataset.exSets=sets;
  div.dataset.exReps=reps;
  list.appendChild(div);inp.value='';inp.focus();
}

async function ariaFillExercises(){
  const m1=document.getElementById('apd-muscle1')?.value||'Chest';
  const m2=document.getElementById('apd-muscle2')?.value||'';
  const name=document.getElementById('apd-name')?.value.trim()||m1;
  const muscles=m2?m1+' · '+m2:m1;
  showToast('Aria is designing your workout...');
  try{
    const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:400,messages:[{role:'user',content:`Design a balanced gym workout targeting: ${muscles}. Return ONLY valid JSON array, no markdown. Give exactly 4-5 exercises. Each exercise must have name, sets (3-4), and reps (8-15). Example: [{"name":"Bench Press","sets":4,"reps":10},{"name":"Incline DB Press","sets":3,"reps":12}]`}]})});
    const d=await r.json();const text=d.content?.[0]?.text||'[]';
    const exercises=JSON.parse(text.replace(/```json|```/g,'').trim());
    const list=document.getElementById('apd-exercises');list.innerHTML='';
    exercises.forEach((ex,i)=>{
      const s=ex.sets||3,rep=ex.reps||12;
      const div=document.createElement('div');
      div.style='display:flex;align-items:center;gap:6px;padding:6px 8px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:6px;margin-bottom:3px;font-size:11px';
      div.innerHTML=`<span style="font-family:var(--mono);font-size:9px;color:var(--t3)">${i+1}</span><span style="flex:1;font-weight:500">${ex.name}</span><span style="font-size:9px;color:var(--t2);font-family:var(--mono)">${s}×${rep}</span><button style="border:none;background:transparent;color:var(--t4);cursor:pointer;font-size:9px" onclick="this.parentElement.remove()">✕</button>`;
      div.dataset.exName=ex.name;
      div.dataset.exSets=s;
      div.dataset.exReps=rep;
      list.appendChild(div);
    });
    // Auto-fill name if empty
    if(!document.getElementById('apd-name').value.trim())document.getElementById('apd-name').value=muscles+' Day';
    showToast(`${exercises.length} exercises generated`);
  }catch(e){showToast('AI unavailable');console.error(e)}
}

function saveNewProgramDay(){
  const name=document.getElementById('apd-name')?.value.trim();
  const m1=document.getElementById('apd-muscle1')?.value||'';
  const m2=document.getElementById('apd-muscle2')?.value||'';
  const muscles=[m1,m2].filter(Boolean).join(' · ');
  const isRest=document.querySelector('input[name="apd-type"]:checked')?.value==='rest';
  if(!name){showToast('Enter a day name');return}
  const newDay={day:S.workoutProgram.length+1,name,muscles,rest:isRest,custom:true};
  if(!isRest){
    const exDivs=[...document.querySelectorAll('#apd-exercises [data-ex-name]')];
    newDay.exercises=exDivs.map(div=>{
      const sets=parseInt(div.dataset.exSets)||3;
      const reps=parseInt(div.dataset.exReps)||12;
      return{name:div.dataset.exName,muscle:m1,sets:Array.from({length:sets},()=>({weight:0,reps}))};
    });
    if(!newDay.exercises.length){showToast('Add at least one exercise');return}
  }
  S.workoutProgram.push(newDay);save();
  document.getElementById('recipe-modal').classList.remove('show');
  showToast(`${name} added to program`);renderWorkout();
}

// Quick custom session from gym picker

function openQuickCustomSession(){
  const panel=document.getElementById('wo-add-panel');if(!panel)return;
  panel.innerHTML=`<div style="font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);margin-bottom:10px;display:flex;justify-content:space-between"><span>✨ Custom Session</span><span style="cursor:pointer;color:var(--gold)" onclick="renderWorkout()">✕</span></div>
  <div class="f-group"><label class="f-label">Session Name *</label><input class="f-input" id="qcs-name" placeholder="e.g. Chest + Arms"></div>
  <div style="font-size:8px;font-weight:600;color:var(--t4);margin:6px 0 4px">EXERCISES</div>
  <div id="qcs-exercises"></div>
  <div style="display:flex;gap:3px;margin-top:4px">
    <input class="f-input" id="qcs-ex-name" placeholder="Exercise" style="flex:2;font-size:10px;padding:4px 6px">
    <input class="f-input" id="qcs-ex-sets" type="number" value="3" style="width:36px;font-size:10px;padding:4px;text-align:center" placeholder="S">
    <input class="f-input" id="qcs-ex-reps" type="number" value="12" style="width:36px;font-size:10px;padding:4px;text-align:center" placeholder="R">
    <button class="btn-g" style="padding:3px 8px;font-size:9px;border-radius:9999px" onclick="addQcsEx()">+</button>
  </div>
  <div style="margin-top:6px;padding:6px;background:rgba(138,126,212,.03);border:1px solid rgba(138,126,212,.08);border-radius:6px;display:flex;gap:4px">
    <input class="f-input" id="qcs-aria" placeholder="Or describe: 'back focused 4 exercises'" style="flex:1;font-size:9px;padding:4px 6px">
    <button class="btn-p" style="width:auto;padding:3px 8px;font-size:8px;border-radius:9999px" onclick="ariaQuickSession()">Aria</button>
  </div>
  <button class="btn-p" style="width:100%;border-radius:9999px;margin-top:10px;font-size:11px" onclick="startQuickCustomSession()">Start Session →</button>`;
}

function addQcsEx(){
  const inp=document.getElementById('qcs-ex-name');if(!inp?.value.trim())return;
  const s=parseInt(document.getElementById('qcs-ex-sets')?.value)||3;
  const r=parseInt(document.getElementById('qcs-ex-reps')?.value)||12;
  const list=document.getElementById('qcs-exercises');const c=list.children.length;
  const div=document.createElement('div');
  div.style='display:flex;align-items:center;gap:4px;padding:4px 6px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:6px;margin-bottom:2px;font-size:10px';
  div.innerHTML=`<span style="color:var(--t3);font-family:var(--mono);font-size:8px">${c+1}</span><span style="flex:1">${inp.value.trim()}</span><span style="color:var(--t2);font-family:var(--mono);font-size:8px">${s}×${r}</span><button style="border:none;background:transparent;color:var(--t4);cursor:pointer;font-size:8px" onclick="this.parentElement.remove()">✕</button>`;
  div.dataset.n=inp.value.trim();div.dataset.s=s;div.dataset.r=r;
  list.appendChild(div);inp.value='';inp.focus();
}

async function ariaQuickSession(){
  const desc=document.getElementById('qcs-aria')?.value.trim();
  if(!desc){showToast('Describe the workout');return}
  showToast('Generating...');
  try{
    const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:300,messages:[{role:'user',content:`Design a balanced gym workout: "${desc}". Return ONLY valid JSON array. Give 4-5 exercises with sets (3-4) and reps (8-15). Example: [{"name":"Lat Pulldown","sets":4,"reps":10}]`}]})});
    const d=await r.json();const exercises=JSON.parse((d.content?.[0]?.text||'[]').replace(/```json|```/g,'').trim());
    const list=document.getElementById('qcs-exercises');list.innerHTML='';
    exercises.forEach((ex,i)=>{
      const div=document.createElement('div');
      div.style='display:flex;align-items:center;gap:4px;padding:4px 6px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:6px;margin-bottom:2px;font-size:10px';
      div.innerHTML=`<span style="color:var(--t3);font-family:var(--mono);font-size:8px">${i+1}</span><span style="flex:1">${ex.name}</span><span style="color:var(--t2);font-family:var(--mono);font-size:8px">${ex.sets||3}×${ex.reps||12}</span><button style="border:none;background:transparent;color:var(--t4);cursor:pointer;font-size:8px" onclick="this.parentElement.remove()">✕</button>`;
      div.dataset.n=ex.name;div.dataset.s=ex.sets||3;div.dataset.r=ex.reps||12;
      list.appendChild(div);
    });
    if(!document.getElementById('qcs-name').value)document.getElementById('qcs-name').value=desc;
    showToast(`${exercises.length} exercises ready`);
  }catch(e){showToast('AI unavailable')}
}

function startQuickCustomSession(){
  const name=document.getElementById('qcs-name')?.value.trim();
  if(!name){showToast('Enter a session name');return}
  const exDivs=[...document.querySelectorAll('#qcs-exercises [data-n]')];
  if(!exDivs.length){showToast('Add exercises first');return}
  const exercises=exDivs.map(d=>({name:d.dataset.n,muscle:'',sets:Array.from({length:parseInt(d.dataset.s)||3},()=>({weight:0,reps:parseInt(d.dataset.r)||12}))}));
  // Add as temporary program day and start tracking
  const tempDay={day:900+Date.now()%1000,name,muscles:'Custom',exercises,rest:false,custom:true,temp:true};
  S.workoutProgram.push(tempDay);save();
  woActiveGymDay=tempDay.day;woScreen='gym_track';renderWorkout();
}

function renderGymTrack(dk){
  const prog=S.workoutProgram.find(d=>d.day===woActiveGymDay);if(!prog||prog.rest){woScreen='main';renderWorkout();return}
  const session=getActiveSession(dk);
  // Calculate total workout volume (current vs previous)
  let totalCurVol=0,totalPrevVol=0;
  prog.exercises.forEach((ex,ei)=>{
    const prevEx=getPrevExerciseLog(ex.id);
    const curSets=session?.exercises?.[ei]?.sets||[];
    totalCurVol+=curSets.filter(s=>s.done).reduce((a,s)=>a+(s.weight||0)*(s.reps||0),0);
    totalPrevVol+=(prevEx?.sets||[]).reduce((a,s)=>a+(s.weight||0)*(s.reps||0),0);
  });
  const woOverload=totalCurVol>totalPrevVol&&totalPrevVol>0;
  const allDone=session?.exercises?.every(e=>e.sets.every(s=>s.done));

  document.getElementById('page-workout').innerHTML=`
  <button class="wo-back-btn" onclick="woScreen='main';woActiveGymDay=null;renderWorkout()">← Back to Workouts</button>
  <div style="margin-bottom:14px">
    <div class="pg-t">${MUSCLE_ICONS[prog.name]||'💪'} ${prog.name}</div>
    <div class="pg-s">${prog.muscles} · ${prog.exercises.length} exercises</div>
  </div>
  <!-- Workout Volume Summary -->
  <div class="gcard" style="padding:10px 14px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center">
    <div style="font-size:10px;color:var(--t3)">Total Volume</div>
    <div style="display:flex;align-items:center;gap:8px">
      <div style="font-size:10px;color:var(--t3)">Prev: <span style="font-family:var(--mono)">${totalPrevVol>0?totalPrevVol.toLocaleString()+'kg':'—'}</span></div>
      <div style="font-size:12px;font-weight:600;font-family:var(--mono);color:${woOverload?'var(--con)':totalCurVol>0?'var(--text)':'var(--t3)'}">${totalCurVol.toLocaleString()}kg</div>
      ${totalPrevVol>0?`<span class="wo-vol-tag ${woOverload?'wo-vol-up':'wo-vol-down'}">${woOverload?'↑ OVERLOAD':'↓'} ${totalPrevVol>0?Math.round((totalCurVol-totalPrevVol)/totalPrevVol*100)+'%':''}</span>`:''}
    </div>
  </div>
  <div class="wo-session">
    ${prog.exercises.map((ex,ei)=>{
      const prevEx=getPrevExerciseLog(ex.id);
      const curSets=session?.exercises?.[ei]?.sets||[];
      const exVol=calcExVolume(curSets,prevEx?.sets);
      return`<div class="wo-exercise">
      <div class="wo-ex-hdr">
        <div><div class="wo-ex-name">${ex.name}</div><div class="wo-ex-muscle">${ex.muscle}</div></div>
        <div style="text-align:right">
          ${exVol.previous>0?`<div style="font-size:8px;color:var(--t4)">prev: ${exVol.previous}kg</div>`:''}
          ${curSets.some(s=>s.done)?`<span class="wo-vol-tag ${exVol.isOverload?'wo-vol-up':exVol.previous>0?'wo-vol-down':'wo-vol-eq'}">${exVol.current}kg ${exVol.isOverload?'↑':exVol.previous>0?'↓':'—'}</span>`:''}
        </div>
      </div>
      <div class="wo-sets">
        <div class="wo-set-row" style="border:none;background:transparent;padding:2px 8px;font-size:9px;color:var(--t4)">
          <div class="wo-set-num">Set</div><div style="width:60px;text-align:center">Weight</div><div style="width:6px"></div><div style="width:60px;text-align:center">Reps</div><div class="wo-set-prev">Previous</div><div style="width:22px">Vol</div>
        </div>
        ${ex.sets.map((set,si)=>{
          const prev=getPrevLog(ex.id,si);
          const ls=curSets[si];const isDone=ls?.done;
          const curW=ls?.weight??set.weight;const curR=ls?.reps??set.reps;
          const prevStr=prev?`${prev.weight>0?prev.weight+'kg':'BW'} × ${prev.reps}`:'—';
          const vol=isDone&&prev?calcSetVolume(curW,curR,prev.weight||0,prev.reps||0):null;
          return`<div class="wo-set-row ${isDone?'set-logged':''}">
            <div class="wo-set-num">${si+1}</div>
            <input class="wo-set-inp" type="number" value="${curW}" step="2.5" min="0" onchange="updateWoSet(${ei},${si},'weight',this.value,'${dk}')">
            <div class="wo-set-label">kg</div>
            <input class="wo-set-inp" type="number" value="${curR}" min="1" onchange="updateWoSet(${ei},${si},'reps',this.value,'${dk}')">
            <div class="wo-set-prev">${prevStr}</div>
            ${vol?`<span class="wo-vol-tag ${vol.isOverload?'wo-vol-up':'wo-vol-down'}" style="font-size:7px">${vol.isOverload?'↑':'↓'}</span>`:'<div style="width:22px"></div>'}
            <div class="wo-set-check ${isDone?'done':''}" onclick="toggleWoSet(${ei},${si},'${dk}')">
              <svg width="8" height="7" viewBox="0 0 8 7" fill="none"><path d="M1 3L3 5.5L7 1" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>
            </div>
          </div>`}).join('')}
        <div class="wo-add-set" onclick="addWoSet(${ei},'${dk}')">+ Add set</div>
      </div>
      ${curSets.some(s=>s.done)?`<div class="wo-ex-summary"><span>Volume: ${exVol.current}kg (${curSets.filter(s=>s.done).length}/${curSets.length} sets)</span>${exVol.isOverload?'<span style="color:var(--con);font-weight:600">🔥 Progressive Overload!</span>':exVol.previous>0?'<span style="color:var(--t3)">No overload</span>':''}</div>`:''}
    </div>`}).join('')}
    <div style="margin-top:14px;display:flex;gap:8px">
      <button class="wo-finish-btn" onclick="finishGymSession('${dk}')" style="flex:1" ${allDone?'':'disabled'}>✓ Finish ${prog.name}${woOverload?' — 🔥 Overload!':''} — ${prog.exercises.length*15} STR XP</button>
    </div>
  </div>`;
}

function getActiveSession(dk){
  const wk=getCurrentWeekKey();if(!S.workoutLog[wk])S.workoutLog[wk]={};
  const key='active_'+woActiveGymDay;
  if(!S.workoutLog[wk][key]){
    const prog=S.workoutProgram.find(d=>d.day===woActiveGymDay);if(!prog||prog.rest)return null;
    S.workoutLog[wk][key]={dayNum:woActiveGymDay,exercises:prog.exercises.map(ex=>({id:ex.id,name:ex.name,sets:ex.sets.map(s=>({weight:s.weight,reps:s.reps,done:false}))}))};
  }
  return S.workoutLog[wk][key];
}

function toggleWoSet(ei,si,dk){
  const session=getActiveSession(dk);if(!session)return;
  if(session.exercises[ei]?.sets[si]){session.exercises[ei].sets[si].done=!session.exercises[ei].sets[si].done;save();renderGymTrack(dk)}
}

function updateWoSet(ei,si,field,val,dk){
  const session=getActiveSession(dk);if(!session)return;
  if(session.exercises[ei]?.sets[si])session.exercises[ei].sets[si][field]=parseFloat(val)||0;save();
}

function addWoSet(ei,dk){
  const session=getActiveSession(dk);if(!session)return;
  const ex=session.exercises[ei];if(!ex)return;const last=ex.sets[ex.sets.length-1];
  ex.sets.push({weight:last?.weight||0,reps:last?.reps||8,done:false});
  const prog=S.workoutProgram.find(d=>d.day===woActiveGymDay);
  if(prog?.exercises[ei]){const ls=prog.exercises[ei].sets;prog.exercises[ei].sets.push({...ls[ls.length-1]})}
  save();renderGymTrack(dk);
}

function calcSetVolume(curW,curR,prevW,prevR){const c=curW*curR,p=prevW*prevR;return{current:c,previous:p,delta:c-p,isOverload:c>p}}

function calcExVolume(sets,prevSets){
  const curVol=sets.filter(s=>s.done).reduce((a,s)=>a+(s.weight||0)*(s.reps||0),0);
  const prevVol=prevSets?prevSets.reduce((a,s)=>a+(s.weight||0)*(s.reps||0),0):0;
  return{current:curVol,previous:prevVol,delta:curVol-prevVol,isOverload:curVol>prevVol&&prevVol>0}
}
// Get completed gym sessions this week with their date

function getPrevExerciseLog(exId){
  for(let w=1;w<=4;w++){const d=new Date();d.setDate(d.getDate()-7*w);const day=d.getDay();const diff=d.getDate()-day+(day===0?-6:1);const mon=new Date(d.setDate(diff));const wk=mon.toISOString().slice(0,10);
  const log=S.workoutLog[wk];if(!log)continue;
  for(const dayKey in log){const dl=log[dayKey];if(dl.exercises){const ex=dl.exercises.find(e=>e.id===exId);if(ex)return ex}}}
  return null;
}
// Volume = weight × reps. Returns {current, previous, delta, isOverload}

function getPrevLog(exId,setIdx){
  for(let w=1;w<=4;w++){const d=new Date();d.setDate(d.getDate()-7*w);const day=d.getDay();const diff=d.getDate()-day+(day===0?-6:1);const mon=new Date(d.setDate(diff));const wk=mon.toISOString().slice(0,10);
  const log=S.workoutLog[wk];if(!log)continue;
  for(const dayKey in log){const dl=log[dayKey];if(dl.exercises){const ex=dl.exercises.find(e=>e.id===exId);if(ex&&ex.sets[setIdx])return ex.sets[setIdx]}}}
  return null;
}
// Find previous week's full exercise log

function finishGymSession(dk){
  const session=getActiveSession(dk);if(!session)return;
  const wk=getCurrentWeekKey();const ts=nowTimeStr();
  S.workoutLog[wk][dk]={dayNum:woActiveGymDay,...session,completedAt:new Date().toISOString()};
  const prog=S.workoutProgram.find(d=>d.day===woActiveGymDay);
  if(prog){session.exercises.forEach((le,ei)=>{if(prog.exercises[ei]){le.sets.forEach((ls,si)=>{if(prog.exercises[ei].sets[si]&&ls.done){if(ls.weight>prog.exercises[ei].sets[si].weight)prog.exercises[ei].sets[si].weight=ls.weight;if(ls.reps>prog.exercises[ei].sets[si].reps)prog.exercises[ei].sets[si].reps=ls.reps}})}})}
  delete S.workoutLog[wk]['active_'+woActiveGymDay];
  const xp=session.exercises.length*15;
  logActivityToTimeline({id:'gym_'+Date.now(),type:'gym',name:`${prog.name} Session`,icon:MUSCLE_ICONS[prog.name]||'💪',stat:'str',time:ts,xp,details:`${session.exercises.length} exercises · ${session.exercises.reduce((a,e)=>a+e.sets.filter(s=>s.done).length,0)} sets`},dk);
  addXP(xp,'str',null);showToast(`${prog.name} done! +${xp} STR XP`);
  woScreen='main';woActiveGymDay=null;save();renderWorkout();updateSB();
}

function logRestDay(wk,dayKey){
  // Open modal to log rest day activity
  document.getElementById('recipe-modal').querySelector('.modal-t').textContent='Rest Day Activity';
  document.getElementById('recipe-modal').querySelector('.modal-s').textContent='Log what you did for recovery';
  document.getElementById('recipe-form').innerHTML=`
  <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
    ${[{n:'Stretching',d:'15-30 min mobility',v:'stretch'},{n:'Yoga',d:'Flow or Yin session',v:'yoga'},{n:'Light Walk',d:'Easy pace walk',v:'walk'},{n:'Foam Rolling',d:'Self-massage & recovery',v:'foam'},{n:'Full Rest',d:'No activity today',v:'rest'}].map(o=>`
    <div class="boost-card" onclick="confirmRestDay('${wk}','${dayKey}','${o.v}','${o.n}')" style="padding:12px">
      <div style="flex:1"><div style="font-size:13px;font-weight:600">${o.n}</div><div style="font-size:10px;color:var(--t3)">${o.d}</div></div>
      <div style="color:var(--int);font-size:10px">→</div>
    </div>`).join('')}
  </div>`;
  document.getElementById('recipe-modal').classList.add('show');
}

function confirmRestDay(wk,dayKey,type,name){
  if(!S.workoutLog[wk])S.workoutLog[wk]={};
  const ts=nowTimeStr();
  S.workoutLog[wk][dayKey]={dayNum:parseInt(dayKey),rest:true,type,completedAt:new Date().toISOString()};
  logActivityToTimeline({id:'rest_'+Date.now(),type:'rest',name:'Rest Day: '+name,icon:'',stat:'con',time:ts,xp:5,details:name},todayKey());
  addXP(5,'con',null);save();
  document.getElementById('recipe-modal').classList.remove('show');
  showToast('Rest day logged ✓ +5 CON XP');renderWorkout();updateSB();
}

function getWeekLog(){const wk=getCurrentWeekKey();if(!S.workoutLog[wk])S.workoutLog[wk]={};return S.workoutLog[wk]}

function getDayActivities(dk){return(S.activityLog[dk]||[]).sort((a,b)=>(a.time||'').localeCompare(b.time||''))}

function logActivityToTimeline(act,dk){
  if(!S.activityLog[dk])S.activityLog[dk]=[];
  S.activityLog[dk].push(act);
  if(!S.dailyLog[dk])S.dailyLog[dk]={};
  S.dailyLog[dk]['wo_'+act.id]=act.time;save();
}
// Find previous week's log for a specific exercise set

function getWeekCompletions(){
  const wk=getCurrentWeekKey();const log=S.workoutLog[wk]||{};const results={};
  Object.entries(log).forEach(([key,val])=>{
    if(key.startsWith('active_'))return;// skip in-progress
    if(val.dayNum&&val.completedAt){results[val.dayNum]={date:key,completedAt:val.completedAt}}
  });
  return results;
}

function woDateKey(){return dateKey(woViewDate)}

function delWoActivity(dk,idx){if(S.activityLog[dk]){const act=S.activityLog[dk][idx];S.activityLog[dk].splice(idx,1);if(act&&S.dailyLog[dk])delete S.dailyLog[dk]['wo_'+act.id]}save();renderWorkout()}

function getCurrentWeekKey(){const d=new Date();const day=d.getDay();const diff=d.getDate()-day+(day===0?-6:1);const mon=new Date(d.setDate(diff));return mon.toISOString().slice(0,10)}
let S;
try{S=JSON.parse(localStorage.getItem('karmaV6')||'null');if(!S)throw 0}catch(e){S={auth:null,profile:{onboarding_complete:false},player:{level:1,xp:0,hp:100,gold:0,pending:0,stats:{str:5,con:5,int:5,per:5},statXP:{str:0,con:0,int:0,per:0},statLevels:{str:1,con:1,int:1,per:1}},habits:JSON.parse(JSON.stringify(DEF_HABITS)),dailyLog:{},mealLog:{},mealFreq:{},weightLog:{},waterLog:{},todos:[],expenses:[],expenseCats:['Food','Transport','Shopping','Health','Entertainment','Bills','Other'],achievements:[],lastCron:null}}
// Migrations
if(!S.auth)S.auth=null;if(!S.habits||!S.habits.length)S.habits=JSON.parse(JSON.stringify(DEF_HABITS));
if(!S.waterLog)S.waterLog={};if(!S.todos)S.todos=[];if(!S.mealLog)S.mealLog={};if(!S.mealFreq)S.mealFreq={};
if(!S.expenses)S.expenses=[];if(!S.expenseCats)S.expenseCats=['Food','Transport','Shopping','Health','Entertainment','Bills','Other'];
if(!S.customMeals)S.customMeals=[];if(!S.budget)S.budget={monthly:0};if(!S.hiddenMeals)S.hiddenMeals=[];
// Migrate + force-sync types from DEF_HABITS
S.habits.forEach(h=>{
  if(!h.type)h.type='booster';// default for old habits
  delete h.neg;
  const def=DEF_HABITS.find(d=>d.id===h.id);
  if(def){h.type=def.type;if(def.schedule)h.schedule=def.schedule;if(def.auto)h.auto=def.auto}
});
// Remove old IDs that got split into _am/_pm variants
S.habits=S.habits.filter(h=>!['skincare','minoxidil'].includes(h.id));
DEF_HABITS.forEach(dh=>{if(!S.habits.find(h=>h.id===dh.id))S.habits.push(JSON.parse(JSON.stringify(dh)))});
if(!S.player.statXP)S.player.statXP={str:0,con:0,int:0,per:0};if(!S.player.statLevels)S.player.statLevels={str:1,con:1,int:1,per:1};
if(!S.dailyLog)S.dailyLog={};if(!S.weightLog)S.weightLog={};if(!S.achievements)S.achievements=[];if(!S.activityLog)S.activityLog={};
if(!S.workoutProgram)S.workoutProgram=JSON.parse(JSON.stringify(DEF_PROGRAM));
if(!S.workoutLog)S.workoutLog={};
