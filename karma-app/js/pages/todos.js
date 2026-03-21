/* ═══ KARMA — Todos ═══ */

function renderTodos(){
  const t=todayKey();const active=S.todos.filter(t=>!t.done).sort((a,b)=>(a.date||'9').localeCompare(b.date||'9'));
  const completed=S.todos.filter(t=>t.done);
  document.getElementById('page-todos').innerHTML=`
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px">
    <div><div class="pg-t">To-Do</div><div class="pg-s">${active.length} active · ${completed.length} done</div></div>
  </div>
  <div style="display:grid;grid-template-columns:280px 1fr;gap:16px;align-items:start">
  <!-- Left: Add form -->
  <div style="position:sticky;top:20px">
    <div class="gcard" style="padding:16px">
      <div style="font-size:12px;font-weight:600;margin-bottom:12px;letter-spacing:-.02em">New Task</div>
      <div class="f-group"><label class="f-label">Task *</label><input class="f-input" id="todo-inp" placeholder="What needs to be done?" onkeydown="if(event.key==='Enter')addTodo()"></div>
      <div class="f-group"><label class="f-label">Tag</label><input class="f-input" id="todo-tag" placeholder="Work, Personal..." style="font-size:12px"></div>
      <div class="f-group"><label class="f-label">Frequency</label>
        <select class="f-input" id="todo-freq">
          <option value="once">One-time</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option>
        </select>
      </div>
      <div class="f-row">
        <div class="f-group"><label class="f-label">Date</label><input class="f-input" id="todo-date" type="date" value="${t}"></div>
        <div class="f-group"><label class="f-label">Time</label>
          <select class="f-input" id="todo-time">
            <option value="">All day</option>
            ${Array.from({length:24},(_,h)=>[`${String(h).padStart(2,'0')}:00`,`${String(h).padStart(2,'0')}:30`]).flat().map(t=>`<option value="${t}">${t}</option>`).join('')}
          </select>
        </div>
      </div>
      <button class="btn-p" style="margin-top:8px;border-radius:9999px" onclick="addTodo()">+ Add Task</button>
    </div>
  </div>
  <!-- Right: Task list -->
  <div>
  ${active.length===0?'<div style="text-align:center;padding:40px;color:var(--t3);font-size:13px"><div style="font-size:28px;margin-bottom:8px;opacity:.3">✓</div>All clear! Add a task on the left.</div>':''}
  ${active.map((td,i)=>{const idx=S.todos.indexOf(td);
    return`<div class="gcard" style="padding:12px 14px;margin-bottom:6px;display:flex;align-items:flex-start;gap:10px;animation:entranceStagger .25s var(--ease) ${i*.03}s both">
      <div style="width:18px;height:18px;border-radius:5px;border:1.5px solid rgba(255,255,255,.12);flex-shrink:0;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.15s;margin-top:2px" onclick="toggleTodo(${idx})" onmouseover="this.style.borderColor='var(--con)'" onmouseout="this.style.borderColor='rgba(255,255,255,.12)'"></div>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:500;letter-spacing:-.01em">${td.text}</div>
        <div style="display:flex;gap:4px;margin-top:4px;flex-wrap:wrap">
          ${td.tag?`<span style="font-size:8px;padding:2px 7px;border-radius:9999px;background:rgba(245,151,104,.06);border:1px solid rgba(245,151,104,.12);color:var(--primary2)">${td.tag}</span>`:''}
          ${td.freq&&td.freq!=='once'?`<span style="font-size:8px;padding:2px 7px;border-radius:9999px;background:rgba(138,126,212,.06);border:1px solid rgba(138,126,212,.12);color:var(--int)">${td.freq}</span>`:''}
          ${td.date?`<span style="font-size:8px;padding:2px 7px;border-radius:9999px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);color:var(--t3);font-family:var(--mono)">${td.date.slice(5)}</span>`:''}
        </div>
      </div>
      <button style="width:24px;height:24px;border-radius:6px;border:1px solid rgba(255,255,255,.06);background:transparent;color:var(--t4);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px;transition:.15s;flex-shrink:0" onclick="delTodo(${idx})" onmouseover="this.style.borderColor='rgba(176,93,65,.4)';this.style.color='var(--str)';this.style.background='rgba(176,93,65,.06)'" onmouseout="this.style.borderColor='rgba(255,255,255,.06)';this.style.color='var(--t4)';this.style.background='transparent'">✕</button>
    </div>`}).join('')}
  ${completed.length?`<div class="sec-label" style="margin-top:14px">Completed (${completed.length})</div>${completed.slice(0,10).map(td=>{const idx=S.todos.indexOf(td);return`<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;margin-bottom:3px;opacity:.4;background:rgba(255,255,255,.01);border:1px solid rgba(255,255,255,.02);border-radius:10px">
    <div style="width:16px;height:16px;border-radius:4px;background:var(--con);display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer" onclick="toggleTodo(${idx})"><svg width="7" height="6" viewBox="0 0 8 7" fill="none"><path d="M1 3L3 5.5L7 1" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg></div>
    <div style="font-size:12px;text-decoration:line-through;flex:1">${td.text}</div>
    <button style="width:20px;height:20px;border:none;background:transparent;color:var(--t4);cursor:pointer;font-size:9px;border-radius:4px" onclick="delTodo(${idx})">✕</button>
  </div>`}).join('')}${completed.length>10?`<div style="font-size:10px;color:var(--t3);padding:8px">+${completed.length-10} more</div>`:''}`:''} 
  </div>
  </div>`;
}

function addTodo(){const inp=document.getElementById('todo-inp');const text=inp.value.trim();if(!text){showToast('Enter a task');return}
  const tag=document.getElementById('todo-tag')?.value.trim()||'';
  const freq=document.getElementById('todo-freq')?.value||'once';
  const date=document.getElementById('todo-date')?.value||'';
  const time=document.getElementById('todo-time')?.value||'';
  S.todos.push({text,tag,freq,date,time,created:Date.now(),done:false});
  save();renderTodos();showToast('To-do added');inp.value='';if(document.getElementById('todo-tag'))document.getElementById('todo-tag').value=''}

function delTodo(idx){S.todos.splice(idx,1);save();renderTodos();showToast('Deleted')}

function toggleTodo(idx){const td=S.todos[idx];if(!td)return;td.done=!td.done;if(td.done){const t=todayKey();if(!S.dailyLog[t])S.dailyLog[t]={};S.dailyLog[t]['todo_'+td.created]=nowTimeStr();addXP(15,'int',null);showToast('Done! +15 INT XP')}else{removeXP(15,'int')}save();renderTodos();updateSB()}
