/* ═══ KARMA — Journal ═══ */

function renderJournal(){
  const dk=todayKey();const entry=S.journal[dk];
  const allDates=Object.keys(S.journal).sort().reverse();
  const hour=new Date().getHours();const shouldAutoGen=hour>=21&&!entry;
  const grateful=S.grateful[dk]||{a:'',b:'',c:''};
  document.getElementById('page-journal').innerHTML=`
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px">
    <div><div class="pg-t">Journal</div><div class="pg-s">${allDates.length} entries</div></div>
    <div style="display:flex;gap:4px">
      <button class="btn-g" style="padding:5px 12px;font-size:10px;border-radius:9999px;${journalView==='today'?'background:rgba(245,151,104,.06);border-color:rgba(245,151,104,.3);color:var(--primary2)':''}" onclick="journalView='today';renderJournal()">Today</button>
      <button class="btn-g" style="padding:5px 12px;font-size:10px;border-radius:9999px;${journalView==='calendar'?'background:rgba(245,151,104,.06);border-color:rgba(245,151,104,.3);color:var(--primary2)':''}" onclick="journalView='calendar';renderJournal()">Calendar</button>
    </div>
  </div>
  ${journalView==='today'?`
  <div style="display:grid;grid-template-columns:1fr 260px;gap:14px;align-items:start">
    <div>
      <!-- Gratitude: 3 fields -->
      <div class="gcard" style="padding:14px;margin-bottom:10px">
        <div style="font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--primary2);margin-bottom:8px">I am grateful for...</div>
        <div style="display:flex;flex-direction:column;gap:6px">
          ${['a','b','c'].map((k,i)=>`<div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:11px;color:var(--primary2);font-weight:600;width:16px;text-align:center">${i+1}</span>
            <input class="f-input" value="${(grateful[k]||'').replace(/"/g,'&quot;')}" placeholder="${['Something that made you smile','A person you appreciate','A small win today'][i]}" style="font-size:11px;padding:7px 10px;flex:1" oninput="if(!S.grateful['${dk}'])S.grateful['${dk}']={a:'',b:'',c:''};S.grateful['${dk}']['${k}']=this.value;save()">
          </div>`).join('')}
        </div>
      </div>
      <!-- Today's entry -->
      ${entry?`<div class="gcard" style="padding:16px;margin-bottom:10px">
        <div style="font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--t3);margin-bottom:8px;display:flex;justify-content:space-between"><span>${new Date(dk+'T12:00:00').toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</span><button class="btn-g" style="padding:2px 10px;font-size:8px;border-radius:9999px" onclick="generateJournal('${dk}')">↻ Regen</button></div>
        <div style="font-size:13px;line-height:1.8;color:var(--t2);white-space:pre-line">${entry}</div>
      </div>`:
      `<div class="gcard" style="padding:20px;text-align:center;margin-bottom:10px">
        <div style="font-size:20px;margin-bottom:6px;opacity:.3">📝</div>
        <div style="font-size:13px;font-weight:500;margin-bottom:3px">No entry for today</div>
        <div style="font-size:10px;color:var(--t3);margin-bottom:12px">${shouldAutoGen?'It is late — let Aria capture your day.':'Generate based on your activities.'}</div>
        <button class="btn-p" style="width:auto;padding:8px 20px;font-size:11px;border-radius:9999px" onclick="generateJournal('${dk}')" id="journal-gen-btn">✨ Generate Entry</button>
      </div>`}
      <!-- Past entries -->
      ${allDates.filter(d=>d!==dk).slice(0,7).map(d=>`<div class="gcard" style="padding:12px;margin-bottom:5px;cursor:pointer" onclick="this.querySelector('.j-body').style.maxHeight=this.querySelector('.j-body').style.maxHeight==='none'?'60px':'none'">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <span style="font-size:8px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t3)">${new Date(d+'T12:00:00').toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})}</span>
          <div style="display:flex;gap:3px"><button class="btn-g" style="padding:1px 6px;font-size:7px;border-radius:9999px" onclick="event.stopPropagation();ariaAnalyzeEntry('${d}')">Insights</button><button class="btn-g" style="padding:1px 5px;font-size:7px;border-radius:9999px;color:var(--str)" onclick="event.stopPropagation();delete S.journal['${d}'];save();renderJournal()">✕</button></div>
        </div>
        <div class="j-body" style="font-size:11px;line-height:1.6;color:var(--t2);max-height:60px;overflow:hidden;-webkit-mask-image:linear-gradient(to bottom,black 50%,transparent);transition:max-height .3s">${S.journal[d]}</div>
      </div>`).join('')}
    </div>
    <!-- Right sidebar -->
    <div style="position:sticky;top:16px;display:flex;flex-direction:column;gap:10px">
      <!-- Aria Analyst -->
      <div class="gcard" style="padding:14px;background:linear-gradient(145deg,rgba(14,17,27,.95),rgba(23,23,23,.95));position:relative;overflow:hidden">
        <div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 0%,rgba(138,126,212,.04),transparent 60%);pointer-events:none"></div>
        <div style="position:relative;z-index:1">
        ${ariaHeader('Aria','Journal Analyst')}
        <div style="font-size:10px;color:var(--t2);line-height:1.5;margin-bottom:6px">Finds patterns — what is working and what needs attention.</div>
        <div id="journal-aria-out"></div>
        ${entry?`<button class="btn-p" style="width:100%;font-size:10px;padding:7px;border-radius:9999px;margin-top:6px" onclick="ariaAnalyzeEntry('${dk}')">✨ Analyze Today</button>`
        :`<div style="font-size:9px;color:var(--t3);text-align:center;padding:6px 0">Generate a journal entry first to unlock analysis</div>`}
        </div>
      </div>
      <!-- Generate card -->
      <div class="gcard" style="padding:12px">
        <div style="font-size:9px;font-weight:600;color:var(--t3);letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px">Write Entry</div>
        <div style="font-size:9px;color:var(--t2);line-height:1.4;margin-bottom:6px">AI journal from today's data</div>
        <button class="btn-p" style="width:100%;font-size:10px;padding:6px;border-radius:9999px" onclick="generateJournal('${dk}')" id="journal-gen-btn2">${entry?'↻ Regenerate':'✨ Generate'}</button>
      </div>
    </div>
  </div>`
  :`<div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
      ${Array.from({length:12},(_,mi)=>{
        const yr=new Date().getFullYear();
        const mName=new Date(yr,mi).toLocaleDateString('en-IN',{month:'short'});
        const daysInMonth=new Date(yr,mi+1,0).getDate();
        const firstDay=new Date(yr,mi,1).getDay();
        const mKey=yr+'-'+String(mi+1).padStart(2,'0');
        const mCount=allDates.filter(k=>k.startsWith(mKey)).length;
        let cells='';
        for(let i=0;i<firstDay;i++)cells+='<div></div>';
        for(let d=1;d<=daysInMonth;d++){
          const key=mKey+'-'+String(d).padStart(2,'0');
          const has=!!S.journal[key];const isTd=key===dk;
          cells+=`<div style="width:10px;height:10px;border-radius:2px;cursor:${has?'pointer':'default'};background:${isTd?'var(--primary2)':has?'var(--con)':'rgba(255,255,255,.04)'};transition:.15s" ${has?`onclick="showJournalDay('${key}')" onmouseover="this.style.transform='scale(1.5)'" onmouseout="this.style.transform='none'"`:''} title="${key}"></div>`;
        }
        return`<div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:10px;padding:10px">
          <div style="font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);margin-bottom:6px;display:flex;justify-content:space-between"><span>${mName}</span><span style="color:var(--con);font-family:var(--mono)">${mCount}||''}</span></div>
          <div style="display:grid;grid-template-columns:repeat(7,10px);gap:2px">${cells}</div>
        </div>`;
      }).join('')}
    </div>
    <div id="journal-day-view" style="margin-top:14px"></div>
  </div>`}`;
  if(shouldAutoGen&&journalView==='today')setTimeout(()=>generateJournal(dk),500);
}

function showJournalDay(dk){
  const entry=S.journal[dk];if(!entry)return;
  const el=document.getElementById('journal-day-view');if(!el)return;
  el.innerHTML=`<div class="gcard" style="padding:18px;animation:scaleIn .2s var(--ease)">
    <div style="font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--t3);margin-bottom:8px;display:flex;justify-content:space-between">
      <span>${new Date(dk+'T12:00:00').toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</span>
      <div style="display:flex;gap:4px"><button class="btn-g" style="padding:2px 8px;font-size:8px;border-radius:9999px" onclick="ariaAnalyzeEntry('${dk}')">Aria Insights</button><button class="btn-g" style="padding:2px 6px;font-size:8px;border-radius:9999px" onclick="document.getElementById('journal-day-view').innerHTML=''">✕</button></div>
    </div>
    ${S.grateful?.[dk]?`<div style="font-size:11px;color:var(--primary2);margin-bottom:8px;padding:8px;background:rgba(245,151,104,.03);border:1px solid rgba(245,151,104,.08);border-radius:8px">🙏 ${[S.grateful[dk].a,S.grateful[dk].b,S.grateful[dk].c].filter(Boolean).join(' · ')}</div>`:''}
    <div style="font-size:13px;line-height:1.8;color:var(--t2);white-space:pre-line">${entry}</div>
  </div>`;
  el.scrollIntoView({behavior:'smooth',block:'nearest'});
}

async function generateJournal(dk){
  const btn=document.getElementById('journal-gen-btn')||document.getElementById('journal-gen-btn2');
  if(btn){btn.disabled=true;btn.textContent='Generating...'}
  const dls=getDailies(dk);const dlLog=S.dailyLog[dk]||{};
  const done=dls.filter(d=>dlLog[d.id]).map(d=>d.name);const missed=dls.filter(d=>!dlLog[d.id]).map(d=>d.name);
  const boosters=getBoosters().filter(h=>dlLog[h.id]).map(h=>h.name);
  const acts=(S.activityLog[dk]||[]).map(a=>a.name+' ('+a.details+')');
  const water=(S.waterLog[dk]||0)/1000;const weight=S.weightLog[dk]||'not logged';
  const macros=typeof getTodayMacros==='function'?getTodayMacros():{k:0,p:0,c:0,f:0};
  const grat=S.grateful?.[dk];const gratText=grat?[grat.a,grat.b,grat.c].filter(Boolean).join(', '):'';
  const prompt=`Write a short first-person journal entry (150 words max). Be reflective, honest, motivational. Facts:
Dailies done: ${done.join(', ')||'none'} | Missed: ${missed.join(', ')||'none'}
Boosters: ${boosters.join(', ')||'none'} | Activities: ${acts.join(', ')||'none'}
Water: ${water}L/3L | Weight: ${weight} | Nutrition: ${macros.k}cal, ${macros.p}g protein
${gratText?'Grateful for: '+gratText:''}
Write naturally, first person, no bullets.`;
  try{
    const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:300,messages:[{role:'user',content:prompt}]})});
    const d=await r.json();S.journal[dk]=d.content?.[0]?.text||'Could not generate.';save();renderJournal();
  }catch(e){S.journal[dk]=`Today I completed ${done.length}/${dls.length} dailies. Water: ${water}L. ${boosters.length?'Bonus: '+boosters.join(', ')+'.':''} ${acts.length?'Did: '+acts.join(', ')+'.':''}${gratText?' Grateful for: '+gratText+'.':''}`;save();renderJournal()}
}

async function ariaAnalyzeEntry(dk){
  const entry=S.journal[dk];if(!entry){showToast('No entry to analyze');return}
  const out=document.getElementById('journal-aria-out');
  if(out)out.innerHTML='<div style="font-size:10px;color:var(--t3)">Analyzing...</div>';
  else showToast('Analyzing...');
  try{
    const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:400,messages:[{role:'user',content:`Analyze this journal entry briefly. What's going well? What needs improvement? 3-4 points, 1 sentence each. Be warm but direct.\n\nEntry: "${entry}"\n\nFormat:\n✅ [positive]\n✅ [positive]\n⚠️ [improve]\n💡 [suggestion]`}]})});
    const d=await r.json();const text=d.content?.[0]?.text||'Could not analyze.';
    if(out)out.innerHTML=`<div style="font-size:11px;line-height:1.7;color:var(--t2);white-space:pre-line;margin-top:6px">${text}</div>`;
    else{document.getElementById('recipe-modal').querySelector('.modal-t').textContent='Aria Insights';document.getElementById('recipe-form').innerHTML=`${ariaHeader('Aria','Journal Analyst')}<div style="font-size:12px;line-height:1.8;color:var(--t2);white-space:pre-line">${text}</div><button class="btn-p" style="width:100%;border-radius:9999px;margin-top:12px" onclick="document.getElementById('recipe-modal').classList.remove('show')">Close</button>`;document.getElementById('recipe-modal').classList.add('show')}
  }catch(e){if(out)out.innerHTML='<div style="font-size:10px;color:var(--str)">Could not connect.</div>'}
}
