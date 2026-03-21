/* ═══ KARMA — Progress ═══ */

function renderProgress(){
  const pl=S.player,wts=Object.entries(S.weightLog).sort((a,b)=>a[0].localeCompare(b[0]));
  const lastWt=wts.length?wts[wts.length-1][1]:98;const totalReps=S.habits.reduce((a,h)=>a+(h.type==='negative'?0:h.reps),0);
  const maxStreak=Math.max(...S.habits.map(h=>h.streak),0);
  const avg7=Math.round(getLast(7).reduce((a,d)=>{const dl=getDailies();return a+(dl.length?Object.values(S.dailyLog[d]||{}).filter(Boolean).length/dl.length*100:0)},0)/7);
  document.getElementById('page-progress').innerHTML=`
  <div class="pg-t">Progress</div><div class="pg-s">Every data point matters.</div>
  <div class="prog-grid"><div class="pc"><div class="pc-l">Weight</div><div class="pc-v">${lastWt}<span style="font-size:11px;color:var(--t3)">kg</span></div><div class="pc-s">Target ${S.profile.target_weight_kg||85}</div></div><div class="pc"><div class="pc-l">7-Day</div><div class="pc-v" style="color:${avg7>=80?'var(--con)':'var(--per)'}">${avg7}%</div><div class="pc-s">Completion</div></div><div class="pc"><div class="pc-l">Reps</div><div class="pc-v" style="color:var(--int)">${totalReps}</div><div class="pc-s">All time</div></div><div class="pc"><div class="pc-l">Streak</div><div class="pc-v" style="color:var(--per)">${maxStreak}d</div><div class="pc-s">Record</div></div></div>
  <div style="display:grid;grid-template-columns:1fr 280px;gap:14px;align-items:start">
    <!-- LEFT: Charts -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;min-width:0;overflow:hidden">
      <div class="chart-box"><div class="chart-t">Weight</div><canvas id="wt-ch" height="130"></canvas></div>
      <div class="chart-box"><div class="chart-t">Completion — 14 days</div><canvas id="comp-ch" height="130"></canvas></div>
      <div class="chart-box"><div class="chart-t">28-Day Heatmap</div><div class="hm-days">${['S','M','T','W','T','F','S'].map(d=>`<div class="hm-day">${d}</div>`).join('')}</div><div class="hm-grid" id="hm-g"></div></div>
      <div class="chart-box"><div class="chart-t">Stat Radar</div><canvas id="radar-ch" height="160"></canvas></div>
    </div>
    <!-- RIGHT: Aria -->
    <div style="position:sticky;top:16px">
      <div class="gcard" id="ai-p" style="padding:16px;background:linear-gradient(145deg,rgba(14,17,27,.95),rgba(23,23,23,.95));position:relative;overflow:hidden">
        <div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 0%,rgba(138,126,212,.04),transparent 60%);pointer-events:none"></div>
        <div style="position:relative;z-index:1">
        ${ariaHeader('Aria','Wellness Coach')}
        <div id="ai-out" style="min-height:80px">${aiCache?renderIns(aiCache):`<div style="font-size:11px;line-height:1.7;color:var(--t2)" id="aria-intro"></div>`}</div>
        <button class="btn-p" id="ai-btn" onclick="genAI()" style="width:100%;margin-top:10px;border-radius:9999px;font-size:11px;padding:8px">${aiCache?'↻ Refresh Insights':'✨ Ask Aria'}</button>
        </div>
      </div>
    </div>
  </div>`;
  setTimeout(()=>{buildCharts();buildHM();ariaTypewriter()},50);
}

function renderStatPage(stat){
  const pl=S.player,lv=pl.statLevels[stat],xp=pl.statXP[stat],need=statXpNeed(lv),pct=Math.round(xp/need*100);
  const col=`var(--${stat})`;
  const linkedHabits=S.habits.filter(h=>h.stat===stat&&!h.type==='negative');
  const linkedDailies=getDailies().filter(d=>d.stat===stat);
  const desc={str:'Physical output, gym performance, movement',con:'HP cap, nutrition, recovery, endurance',int:'XP multiplier (+2.5%/pt), mental tasks',per:'Gold drops, streaks, grooming, appearance'}[stat];
  const sugHabits={str:[{n:'Pull-ups',ico:'💪'},{n:'Plank hold',ico:'🧘'},{n:'Swimming',ico:'🏊'}],con:[{n:'Cold shower',ico:'🧊'},{n:'Meal prep',ico:'🥘'},{n:'Probiotic',ico:'💊'}],int:[{n:'Read 20min',ico:'📚'},{n:'Chess puzzle',ico:'♟️'},{n:'New skill',ico:'🎯'}],per:[{n:'Grooming check',ico:'🪞'},{n:'Posture drill',ico:'🧍'},{n:'Outfit plan',ico:'👔'}]}[stat]||[];

  document.getElementById('page-stat-'+stat).innerHTML=`
  <div style="cursor:pointer;font-size:10px;color:var(--t3);margin-bottom:10px" onclick="goTo('dashboard')">← Back to Dashboard</div>
  <div class="stat-detail-header" style="border-left:3px solid ${col}">
    <div class="sdh-num" style="color:${col}">${pl.stats[stat]}</div>
    <div class="sdh-info"><div class="sdh-name" style="color:${col}">${SN[stat]}</div><div class="sdh-desc">${desc}</div>
    <div class="sdh-bar"><div class="sdh-fill" style="width:${pct}%;background:${col}"></div></div>
    <div style="font-size:9px;color:var(--t3);margin-top:3px;font-family:var(--mono)">Lv ${lv} · ${xp}/${need} XP to next</div></div>
  </div>
  <div class="sd-cols">
    <div class="sd-sec"><div class="sd-sec-t">Linked Habits (${linkedHabits.length})</div>${linkedHabits.map(h=>`<div class="sd-item"><div class="sd-item-ico">${h.icon}</div><div class="sd-item-info"><div class="sd-item-name">${h.name}</div><div class="sd-item-meta">${h.reps} reps · ${h.streak}d streak · +${h.base} XP</div></div></div>`).join('')}${linkedHabits.length===0?'<div style="font-size:10px;color:var(--t3);padding:8px">No linked habits yet</div>':''}</div>
    <div class="sd-sec"><div class="sd-sec-t">Daily Tasks (${linkedDailies.length})</div>${linkedDailies.map(d=>`<div class="sd-item"><div class="sd-item-ico">${d.emoji}</div><div class="sd-item-info"><div class="sd-item-name">${d.name}</div><div class="sd-item-meta">${d.time} · +${d.xp} XP</div></div></div>`).join('')}</div>
    <div class="sd-sec" style="grid-column:span 2"><div class="sd-sec-t">Suggested Habits to Add</div><div style="display:flex;gap:6px;flex-wrap:wrap">${sugHabits.map(h=>`<div class="card" style="padding:10px 14px;cursor:pointer;display:flex;align-items:center;gap:6px" onclick="addSugHabit('${h.n}','${stat}')" onmouseenter="initGlow(this)" onmouseleave="hideGlow(this)" onmousemove="moveGlow(event,this)"><div class="glow"></div><span>${h.ico}</span><span style="font-size:11px;font-weight:500">${h.n}</span><span style="font-size:9px;color:var(--t3);margin-left:4px">+ Add</span></div>`).join('')}</div></div>
  </div>`;
}
