/* ═══ KARMA — Dashboard ═══ */

function renderDash(){
  const p=S.profile,pl=S.player,hpM=maxHP();pl.hp=Math.min(hpM,pl.hp);
  const xpP=Math.min(100,Math.round(pl.xp/xpNeed(pl.level)*100)),hpP=Math.round(pl.hp/hpM*100);
  const q=getQuote(),z={s:p.zodiac,i:p.zodiacIcon};
  const lastWt=Object.values(S.weightLog).slice(-1)[0]||p.weight_kg||98;
  const totalDays=Math.max(1,Math.floor((Date.now()-new Date(p.created_at||Date.now()))/864e5)+1);
  const t=todayKey(),dls=getDailies(),dDone=dls.filter(d=>S.dailyLog[t]?.[d.id]).length;
  const totalReps=S.habits.reduce((a,h)=>a+(h.type==='negative'?0:h.reps),0);
  const streak=S.habits.reduce((a,h)=>Math.max(a,h.streak||0),0);
  const dailyPct=dls.length?Math.round(dDone/dls.length*100):0;
  const dateStr=new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'short',year:'numeric'});

  document.getElementById('page-dashboard').innerHTML=`<div class="dash-ambient"></div>
  <div style="position:relative;z-index:1;max-width:1020px;margin:0 auto">
  <!-- Header -->
  <div class="dash-hdr"><div class="dh-l"><div class="dh-logo">K</div><div class="dh-brand">KARMA</div></div><div class="dh-r"><div class="dh-date">${dateStr}</div><div class="dh-btn" onclick="openAskAI()" title="Ask AI" style="color:var(--primary2);border-color:rgba(245,151,104,.2)"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><path d="M8 2l1.5 3.5L13 7l-3.5 1.5L8 12l-1.5-3.5L3 7l3.5-1.5z"/></svg></div><div class="dh-btn" onclick="toggleTheme()"><svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="8" cy="8" r="5"/><path d="M8 3v10" fill="currentColor" opacity=".3"/></svg></div><div class="dh-btn" onclick="resetProfile()"><svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="2"/></svg></div></div></div>

  <!-- ROW 1: Profile (left) + Stats (right) — 50/50 -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
    <!-- Profile card -->
    <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:var(--radius);padding:16px;position:relative">
      <div style="position:absolute;inset:0;border-radius:var(--radius);background:radial-gradient(circle at 10% 50%,rgba(245,151,104,.04),transparent 50%);pointer-events:none"></div>
      <div style="display:flex;gap:16px;align-items:center;position:relative;z-index:1">
        <!-- Globe -->
        <div style="width:44px;height:44px;flex-shrink:0;display:flex;align-items:center;justify-content:center;position:relative">
          <div style="position:absolute;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle,rgba(245,151,104,.1),transparent 70%);filter:blur(6px)"></div>
          <svg viewBox="0 0 44 44" width="44" height="44" style="position:relative;filter:drop-shadow(0 0 5px rgba(245,151,104,.25))">
            <defs><linearGradient id="dg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="rgba(245,151,104,.6)"/><stop offset="50%" stop-color="rgba(138,126,212,.5)"/><stop offset="100%" stop-color="rgba(90,184,154,.6)"/></linearGradient></defs>
            <g transform="translate(22,22)" style="animation:globeSpin 14s linear infinite">
              <circle r="18" fill="none" stroke="url(#dg)" stroke-width=".7" opacity=".3"/>
              <ellipse rx="18" ry="7" fill="none" stroke="url(#dg)" stroke-width=".6" opacity=".5"/>
              <ellipse rx="7" ry="18" fill="none" stroke="url(#dg)" stroke-width=".6" opacity=".5"/>
              <ellipse rx="13" ry="18" fill="none" stroke="url(#dg)" stroke-width=".5" opacity=".3" transform="rotate(30)"/>
              <ellipse rx="13" ry="18" fill="none" stroke="url(#dg)" stroke-width=".5" opacity=".3" transform="rotate(-30)"/>
              <circle r="3" fill="rgba(245,151,104,.08)"/><circle r="1.2" fill="rgba(245,151,104,.25)"/>
            </g>
          </svg>
        </div>
        <!-- Info -->
        <div style="flex:1;min-width:0">
          <div style="font-size:16px;font-weight:600;letter-spacing:-.03em;margin-bottom:1px">${p.name||'Warrior'}</div>
          <div style="font-size:9px;color:var(--t2);margin-bottom:8px">Level ${pl.level} · ${getTitle(pl.level)} · ${z.s||''}</div>
          <div style="display:flex;flex-direction:column;gap:4px">
            <div><div style="display:flex;justify-content:space-between;font-size:8px;margin-bottom:2px"><span style="color:var(--t3);font-weight:600;letter-spacing:.04em">HP</span><span style="font-family:var(--mono);color:var(--str);font-size:9px">${pl.hp}/${hpM}</span></div><div style="height:3px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden"><div style="height:100%;width:${hpP}%;background:var(--str);border-radius:2px"></div></div></div>
            <div><div style="display:flex;justify-content:space-between;font-size:8px;margin-bottom:2px"><span style="color:var(--t3);font-weight:600;letter-spacing:.04em">XP</span><span style="font-family:var(--mono);color:var(--primary2);font-size:9px">${pl.xp}/${xpNeed(pl.level)}</span></div><div style="height:3px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden"><div style="height:100%;width:${xpP}%;background:var(--primary2);border-radius:2px"></div></div></div>
          </div>
          ${S.auth?`<div style="font-size:8px;color:var(--t3);margin-top:6px;font-family:var(--mono)">${S.auth.username} · ${S.auth.password}</div>`:''}
        </div>
      </div>
    </div>
    <!-- Stats grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      ${['str','con','int','per'].map(s=>{const lv=pl.statLevels[s],sxp=pl.statXP[s],need=statXpNeed(lv),pct=Math.round(sxp/need*100);
        return`<div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:var(--radius);padding:12px;position:relative;overflow:hidden;cursor:pointer;transition:.2s" onclick="goTo('stat-${s}')" onmouseover="this.style.borderColor='rgba(255,255,255,.1)';this.style.transform='translateY(-1px)'" onmouseout="this.style.borderColor='rgba(255,255,255,.04)';this.style.transform='none'">
          <div style="position:absolute;top:-8px;right:-4px;width:40px;height:40px;opacity:.08">${SVG_I[s]}</div>
          <div style="position:absolute;inset:0;background:radial-gradient(circle at 90% 10%,var(--${s === 'per' ? 'per' : s}bg),transparent 60%);pointer-events:none;opacity:.5"></div>
          <div style="position:relative;z-index:1">
            <div style="font-size:8px;font-weight:700;letter-spacing:.08em;color:var(--${s});margin-bottom:4px">${SN[s].toUpperCase()}</div>
            <div style="font-family:var(--mono);font-size:22px;font-weight:700;color:var(--${s});line-height:1;margin-bottom:6px">${pl.stats[s]}</div>
            <div style="height:2px;background:rgba(255,255,255,.06);border-radius:1px;overflow:hidden;margin-bottom:4px"><div style="height:100%;width:${pct}%;background:var(--${s});border-radius:1px"></div></div>
            <div style="font-size:7px;color:var(--t3);font-family:var(--mono)">Lv${lv} · ${sxp}/${need}</div>
          </div>
        </div>`}).join('')}
    </div>
  </div>

  <!-- ROW 2: Metrics + Quote/Horoscope -->
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr 280px;gap:8px;margin-bottom:12px">
    ${[
      {l:'Weight',v:lastWt+'<span style=\\"font-size:10px;color:var(--t3)\\">kg</span>',s:Math.abs(lastWt-(p.target_weight_kg||85)).toFixed(1)+'kg to target',svg:SVG_I.weight,c:''},
      {l:'Daily',v:`<span style="color:var(--con)">${dDone}</span><span style="font-size:10px;color:var(--t3)">/${dls.length}</span>`,s:dailyPct+'% complete',svg:SVG_I.check,c:'con'},
      {l:'Streak',v:`<span style="color:var(--primary2)">${streak}d</span>`,s:'Best streak',svg:SVG_I.flame,c:'per'},
      {l:'Journey',v:`<span style="color:var(--int)">${totalDays}</span>`,s:'Days active',svg:SVG_I.mountain,c:'int'},
    ].map(m=>`<div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:var(--radius);padding:12px;position:relative;overflow:hidden">
      <div style="position:absolute;bottom:-2px;right:0;width:28px;height:28px;opacity:.06">${m.svg}</div>
      <div style="font-size:8px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--t4);margin-bottom:4px">${m.l}</div>
      <div style="font-family:var(--mono);font-size:20px;font-weight:700;line-height:1;margin-bottom:2px">${m.v}</div>
      <div style="font-size:8px;color:var(--t3)">${m.s}</div>
    </div>`).join('')}
    <!-- Quote (compact, right column) -->
    <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:var(--radius);padding:12px;display:flex;flex-direction:column;justify-content:center;position:relative;overflow:hidden">
      <div style="position:absolute;top:0;left:0;bottom:0;width:2px;background:linear-gradient(180deg,var(--primary2),transparent);border-radius:1px"></div>
      <div style="font-size:11px;line-height:1.65;font-style:italic;color:var(--t2);padding-left:6px">${q.t}</div>
      <div style="font-size:8px;color:var(--t3);margin-top:4px;padding-left:6px">— ${q.a}</div>
    </div>
  </div>

  <!-- ROW 3: Horoscope (full width, compact) -->
  <div style="display:flex;align-items:center;gap:12px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:var(--radius);padding:10px 14px;margin-bottom:14px;position:relative;overflow:hidden">
    <div style="position:absolute;right:0;top:0;bottom:0;width:120px;background:radial-gradient(circle at 100% 50%,rgba(138,126,212,.04),transparent 70%);pointer-events:none"></div>
    <!-- Mini prediction globe -->
    <div style="flex-shrink:0;position:relative;width:24px;height:24px">
      <svg viewBox="0 0 24 24" width="24" height="24" style="filter:drop-shadow(0 0 3px rgba(138,126,212,.3))">
        <g transform="translate(12,12)" style="animation:globeSpin 10s linear infinite">
          <circle r="9" fill="none" stroke="rgba(138,126,212,.4)" stroke-width=".6"/>
          <ellipse rx="9" ry="3.5" fill="none" stroke="rgba(138,126,212,.3)" stroke-width=".5"/>
          <ellipse rx="3.5" ry="9" fill="none" stroke="rgba(138,126,212,.3)" stroke-width=".5"/>
          <circle r="1.5" fill="rgba(138,126,212,.15)"/>
        </g>
      </svg>
    </div>
    <div style="flex:1;min-width:0">
      <div style="font-size:11px;font-weight:600;letter-spacing:-.01em">${z.s||'Aries'} · Today</div>
      <div style="font-size:10px;color:var(--t2);line-height:1.5">${getHoro(p.zodiac)}</div>
    </div>
    <div style="font-size:8px;font-weight:600;color:var(--int);background:rgba(138,126,212,.06);border:1px solid rgba(138,126,212,.12);padding:3px 10px;border-radius:9999px;flex-shrink:0;font-family:var(--mono)">Lucky ${[Math.floor(Math.random()*42)+1,Math.floor(Math.random()*42)+1].join(', ')}</div>
  </div>

  <!-- ROW 4: Arsenal (compact horizontal strip) -->
  <div style="margin-bottom:8px"><div style="font-size:8px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--t4);margin-bottom:8px;display:flex;align-items:center;gap:8px">Arsenal<div style="flex:1;height:1px;background:rgba(255,255,255,.04)"></div></div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">
    ${[
      {n:'Today',d:dDone+'/'+dls.length,svg:SVG_I.sun,c:'var(--primary2)',p:'daily',hl:true},
      {n:'Habits',d:totalReps+' reps',svg:SVG_I.dumbbell,c:'var(--str)',p:'habits'},
      {n:'Workout',d:'Overload',svg:SVG_I.target,c:'var(--str)',p:'workout'},
      {n:'To-Do',d:S.todos.filter(t=>!t.done).length+' pending',svg:SVG_I.list,c:'var(--int)',p:'todos'},
      {n:'Nutrition',d:'Macros',svg:SVG_I.bowl,c:'var(--con)',p:'meals'},
      {n:'Progress',d:'Analytics',svg:SVG_I.chart,c:'var(--int)',p:'progress'},
      {n:'Expenses',d:'Spending',svg:SVG_I.wallet,c:'var(--primary2)',p:'expenses'},
      {n:'Journal',d:'AI entries',svg:SVG_I.pen,c:'var(--int)',p:'journal'},
    ].map(c=>`<div style="background:${c.hl?'rgba(245,151,104,.03)':'rgba(255,255,255,.02)'};border:1px solid ${c.hl?'rgba(245,151,104,.12)':'rgba(255,255,255,.04)'};border-radius:10px;padding:10px;cursor:pointer;transition:.15s;position:relative;overflow:hidden;display:flex;align-items:center;gap:8px" onclick="goTo('${c.p}')" onmouseover="this.style.borderColor='rgba(255,255,255,.1)';this.style.transform='translateY(-1px)'" onmouseout="this.style.borderColor='${c.hl?'rgba(245,151,104,.12)':'rgba(255,255,255,.04)'}';this.style.transform='none'">
      <div style="width:18px;height:18px;color:${c.c};flex-shrink:0">${c.svg}</div>
      <div><div style="font-size:11px;font-weight:600;letter-spacing:-.02em">${c.n}</div><div style="font-size:8px;color:var(--t3)">${c.d}</div></div>
    </div>`).join('')}
  </div></div></div>`;
}

function buildCharts(){const isL=document.documentElement.classList.contains('light');const cfg={legend:{display:false},tooltip:{backgroundColor:isL?'rgba(255,255,255,.96)':'rgba(12,12,14,.96)',titleColor:isL?'#1a1a1e':'#eaeaef',bodyColor:isL?'#5c5c66':'#a0a0aa',borderColor:isL?'rgba(0,0,0,.08)':'rgba(255,255,255,.06)',borderWidth:1}};const gc={color:isL?'rgba(0,0,0,.04)':'rgba(255,255,255,.04)'};const tc={color:isL?'#8a8a96':'#6a6a75',font:{size:9}};
const wts=Object.entries(S.weightLog).sort((a,b)=>a[0].localeCompare(b[0])).slice(-20);const wl=wts.length?wts.map(([d])=>d.slice(5)):['—'];const wd=wts.length?wts.map(([,w])=>w):[98];
const wc=document.getElementById('wt-ch');if(wc){try{Chart.getChart(wc)?.destroy()}catch(e){}new Chart(wc,{type:'line',data:{labels:wl,datasets:[{data:wd,borderColor:'#5856d6',backgroundColor:'rgba(88,86,214,.06)',tension:.4,pointBackgroundColor:'#5856d6',fill:true,pointRadius:2,borderWidth:1.5}]},options:{responsive:true,scales:{y:{grid:gc,ticks:tc,min:Math.max(50,Math.min(...wd)-3)},x:{grid:gc,ticks:tc}},plugins:cfg}})}
const d14=getLast(14);const cl=d14.map(d=>new Date(d).toLocaleDateString('en-IN',{weekday:'short'}).slice(0,2));
const cd=d14.map(d=>{const dl=getDailies();return dl.length?Math.round(Object.values(S.dailyLog[d]||{}).filter(Boolean).length/dl.length*100):0});
const cc=document.getElementById('comp-ch');if(cc){try{Chart.getChart(cc)?.destroy()}catch(e){}new Chart(cc,{type:'bar',data:{labels:cl,datasets:[{data:cd,backgroundColor:cd.map(v=>v>=80?'rgba(40,168,120,.5)':v>=50?'rgba(192,138,36,.5)':'rgba(226,104,90,.4)'),borderRadius:4}]},options:{responsive:true,scales:{y:{min:0,max:100,grid:gc,ticks:{...tc,callback:v=>v+'%'}},x:{grid:{display:false},ticks:tc}},plugins:cfg}})}
const rc=document.getElementById('radar-ch');const pl=S.player;if(rc){try{Chart.getChart(rc)?.destroy()}catch(e){}new Chart(rc,{type:'radar',data:{labels:['STR','CON','INT','PER'],datasets:[{data:[pl.stats.str,pl.stats.con,pl.stats.int,pl.stats.per],borderColor:'rgba(214,166,67,.7)',backgroundColor:'rgba(214,166,67,.06)',pointBackgroundColor:'#d6a643',pointRadius:3,borderWidth:1.2}]},options:{responsive:true,scales:{r:{min:0,max:Math.max(25,...Object.values(pl.stats))+5,grid:{color:isL?'rgba(0,0,0,.05)':'rgba(255,255,255,.04)'},angleLines:{color:isL?'rgba(0,0,0,.05)':'rgba(255,255,255,.04)'},ticks:{backdropColor:'transparent',color:isL?'#8a8a96':'#6a6a75',font:{size:8}},pointLabels:{color:isL?'#5c5c66':'#a0a0aa',font:{size:10}}}},plugins:cfg}})}}

function buildHM(){const dates=getLast(28);const grid=document.getElementById('hm-g');if(!grid)return;let h='';const fw=new Date(dates[0]).getDay();for(let i=0;i<fw;i++)h+=`<div class="hm-cell" style="opacity:0"></div>`;dates.forEach(d=>{const dl=getDailies(),dn=Object.values(S.dailyLog[d]||{}).filter(Boolean).length;const p=dl.length?dn/dl.length:0;const op=p===0?.06:p<.4?.2:p<.7?.4:p<.9?.6:1;const c=p>=.9?'40,168,120':p>=.6?'192,138,36':'226,104,90';h+=`<div class="hm-cell" style="background:rgba(${c},${op})" title="${d.slice(5)}: ${Math.round(p*100)}%"></div>`});grid.innerHTML=h}

function moveAvatar(e,el){const r=el.getBoundingClientRect();const dx=(e.clientX-(r.left+r.width/2))/r.width;const dy=(e.clientY-(r.top+r.height/2))/r.height;const inner=el.querySelector('.av-body-inner');if(inner)inner.style.transform=`rotateY(${dx*30}deg) rotateX(${-dy*20}deg)`}

function resetAvatar(el){const inner=el.querySelector('.av-body-inner');if(inner)inner.style.transform='rotateY(0) rotateX(0)'}

function renderIns(d){if(!d?.insights)return'';return d.insights.map(i=>`<div class="insight ${i.type||''}"><div class="ins-t">${i.title}</div><div class="ins-b">${i.body}</div></div>`).join('')}

async function genAI(){const btn=document.getElementById('ai-btn'),out=document.getElementById('ai-out');btn.disabled=true;btn.textContent='Analyzing...';out.innerHTML=`<div style="display:flex;align-items:center;gap:6px;color:var(--t2);font-size:10px"><div class="dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>Reading data...</div>`;
const pl=S.player,p=S.profile,wts=Object.entries(S.weightLog).sort((a,b)=>a[0].localeCompare(b[0])).slice(-10);
const avg7=Math.round(getLast(7).reduce((a,d)=>{const dl=getDailies();return a+(dl.length?Object.values(S.dailyLog[d]||{}).filter(Boolean).length/dl.length*100:0)},0)/7);
const topH=S.habits.filter(h=>h.type!=='negative').sort((a,b)=>b.reps-a.reps).slice(0,3).map(h=>`${h.name}(${h.reps}r)`);
const prompt=`You are Aria, a warm but direct female wellness coach. Analyze this fitness data: ${p.gender||'male'}, ${p.height_cm||187}cm, target ${p.target_weight_kg||85}kg, ${p.experience_level||'advanced'}. Goals: ${(p.goals||[]).join(',')}. Lv${pl.level} STR:${pl.stats.str} CON:${pl.stats.con} INT:${pl.stats.int} PER:${pl.stats.per}. Weights: ${wts.map(([d,w])=>d.slice(5)+':'+w).join(',')||'none logged yet'}. 7d avg:${avg7}%. Top habits: ${topH.join(',')||'none yet'}. Give 4 data-driven insights with actual numbers. Be encouraging but honest. JSON only: {"insights":[{"title":"","body":"","type":"positive|warning|action"}]}`;
try{const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:600,messages:[{role:'user',content:prompt}]})});const d=await r.json();const txt=d.content?.find(c=>c.type==='text')?.text||'{}';aiCache=JSON.parse(txt.replace(/```json|```/g,'').trim());save();out.innerHTML=renderIns(aiCache);const panel=document.getElementById('ai-p');if(panel){panel.classList.add('glowing');setTimeout(()=>panel.classList.remove('glowing'),3500)}}catch(e){out.innerHTML=`<div class="ai-empty" style="color:var(--str)">Aria couldn't connect: ${e.message}</div>`}
btn.disabled=false;btn.textContent='✨ Ask Aria Again'}
