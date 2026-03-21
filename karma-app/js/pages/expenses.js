/* ═══ KARMA — Expenses ═══ */

function renderExpenses(){
  const items=getMonthExp(),total=items.reduce((a,e)=>a+e.amount,0);const mn=new Date(expY,expM).toLocaleDateString('en-IN',{month:'long',year:'numeric'});
  const catT={};items.forEach(e=>{catT[e.category]=(catT[e.category]||0)+e.amount});const maxCat=Math.max(...Object.values(catT),1);
  const insights=getExpInsights(items,total,catT);
  const budgetPct=S.budget.monthly>0?Math.min(100,Math.round(total/S.budget.monthly*100)):0;
  document.getElementById('page-expenses').innerHTML=`
  <div class="pg-t">Expenses</div><div class="pg-s">Track spending, set budgets</div>
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px"><div class="dh-btn" onclick="shiftExpM(-1)">←</div><div style="font-size:12px;font-weight:600;min-width:100px;text-align:center">${mn}</div><div class="dh-btn" onclick="shiftExpM(1)">→</div></div>
  <!-- Summary + Budget row -->
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;margin-bottom:14px">
    <div class="esc"><div class="esc-l">Total</div><div class="esc-v" style="color:var(--str)">₹${total.toLocaleString('en-IN')}</div><div class="esc-s">${items.length} txns</div></div>
    <div class="esc"><div class="esc-l">Daily Avg</div><div class="esc-v" style="color:var(--per)">₹${items.length?Math.round(total/new Date(expY,expM+1,0).getDate()).toLocaleString('en-IN'):0}</div></div>
    <div class="esc"><div class="esc-l">Budget</div><div class="esc-v" style="color:${budgetPct>90?'var(--str)':budgetPct>60?'var(--per)':'var(--con)'}">${S.budget.monthly?budgetPct+'%':'—'}</div><div class="esc-s">${S.budget.monthly?'₹'+Math.max(0,S.budget.monthly-total).toLocaleString('en-IN')+' left':''}</div></div>
    <div class="esc" style="display:flex;flex-direction:column;justify-content:center;gap:4px">
      <div class="esc-l">Budget</div>
      <div style="display:flex;gap:4px;align-items:center"><span style="font-size:9px;color:var(--t3)">₹</span><input class="f-input" id="budget-inp" type="number" value="${S.budget.monthly||''}" placeholder="30000" style="width:70px;padding:4px 6px;font-size:10px;border-radius:6px"><button class="btn-p" style="width:auto;padding:3px 10px;font-size:8px;border-radius:9999px" onclick="setBudget()">Set</button></div>
      ${S.budget.monthly?`<div style="height:3px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden"><div style="height:100%;width:${budgetPct}%;background:${budgetPct>90?'var(--str)':budgetPct>60?'var(--per)':'var(--con)'};border-radius:2px"></div></div>`:''}</div>
  </div>
  <!-- AI Insights + Alerts -->
  ${insights.length?`<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px">${insights.map(i=>`<div style="display:flex;align-items:center;gap:6px;padding:6px 10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:9999px;font-size:10px;color:var(--t2)"><span>${i.icon}</span>${i.text}</div>`).join('')}</div>`:''}
  <!-- Main grid: Chart + AI | Transactions + Categories -->
  <div style="display:grid;grid-template-columns:1fr 280px;gap:14px;align-items:start">
    <div>
      <!-- Chart -->
      <div class="chart-box" style="margin-bottom:12px"><div class="chart-t">Daily Spending — ${mn}</div><canvas id="exp-ch" height="90"></canvas></div>
      <!-- Action buttons -->
      <div style="display:flex;gap:6px;margin-bottom:12px">
        <button class="btn-p" style="width:auto;padding:8px 18px;font-size:11px;border-radius:9999px" onclick="openExpModal()">+ Add Expense</button>
        <button class="btn-g" style="padding:8px 18px;font-size:11px;border-radius:9999px" onclick="openLentModal()">💸 Lend Money</button>
      </div>
      <!-- Transactions -->
      <div class="exp-list">${items.length?items.map(e=>{const idx=S.expenses.indexOf(e);return`<div class="exp-i"><div class="exp-dot" style="background:${CAT_COLORS[e.category]||'#7c7a8a'}"></div><div class="exp-info"><div class="exp-nm">${e.description||e.category}</div><div class="exp-dt">${e.date} · ${e.category}</div></div><div class="exp-amt">₹${e.amount.toLocaleString('en-IN')}</div><button class="exp-del" onclick="delExp(${idx})">✕</button></div>`}).join(''):'<div style="text-align:center;padding:20px;color:var(--t3);font-size:12px">No expenses this month</div>'}</div>
      <!-- Lent Money list -->
      ${S.lentMoney.filter(l=>!l.returned).length?`<div style="margin-top:12px"><div style="font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);margin-bottom:6px">💸 Outstanding Loans · ₹${S.lentMoney.filter(l=>!l.returned).reduce((a,l)=>a+l.amount,0).toLocaleString('en-IN')}</div>
      ${S.lentMoney.filter(l=>!l.returned).map((l,i)=>{const idx=S.lentMoney.indexOf(l);return`<div class="exp-i" style="margin-bottom:3px"><div class="exp-dot" style="background:var(--per)"></div><div class="exp-info"><div class="exp-nm">${l.who}</div><div class="exp-dt">${l.date}</div></div><div class="exp-amt" style="color:var(--per)">₹${l.amount.toLocaleString('en-IN')}</div><button class="mc-btn" style="font-size:9px;color:var(--con)" onclick="returnLent(${idx})">✓ Returned</button></div>`}).join('')}</div>`:''}
    </div>
    <div style="position:sticky;top:16px;display:flex;flex-direction:column;gap:10px">
      <!-- Aria AI -->
      <div class="gcard" style="padding:14px;background:linear-gradient(145deg,rgba(14,17,27,.95),rgba(23,23,23,.95));position:relative;overflow:hidden">
        <div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 0%,rgba(138,126,212,.04),transparent 60%);pointer-events:none"></div>
        <div style="position:relative;z-index:1">
        ${ariaHeader('Aria','Financial Insights')}
        <div id="ai-exp-out" style="min-height:40px"><div style="font-size:11px;color:var(--t2);line-height:1.6">Analyzes spending patterns, compares trends, and recommends savings.</div></div>
        <button class="btn-p" id="ai-exp-btn" onclick="aiExpInsights()" style="margin-top:8px;width:100%;font-size:11px;padding:8px;border-radius:9999px">✨ Ask Aria</button>
        </div>
      </div>
      <!-- Categories -->
      <div class="exp-cp"><div class="exp-ct">Categories</div>
      ${S.expenseCats.map(c=>{const v=catT[c]||0;const isExp=expandedCat===c;const catItems=items.filter(e=>e.category===c);
        return`<div><div class="ecr" onclick="toggleExpCat('${c}')" style="cursor:pointer"><div class="ecr-d" style="background:${CAT_COLORS[c]||'#7c7a8a'}"></div><div class="ecr-n">${c}</div><div class="ecr-bw"><div class="ecr-b"><div class="ecr-f" style="width:${maxCat?Math.round(v/maxCat*100):0}%;background:${CAT_COLORS[c]||'#7c7a8a'}"></div></div></div><div class="ecr-v" style="color:${CAT_COLORS[c]||'#7c7a8a'}">₹${v.toLocaleString('en-IN')}</div></div>
        ${isExp&&catItems.length?`<div style="padding:4px 0 8px 14px">${catItems.slice(0,5).map(e=>`<div style="display:flex;justify-content:space-between;padding:2px 0;font-size:9px;color:var(--t3)"><span>${e.description||c}</span><span style="font-family:var(--mono)">₹${e.amount}</span></div>`).join('')}${catItems.length>5?`<div style="font-size:8px;color:var(--t4);padding-top:2px">+${catItems.length-5} more</div>`:''}</div>`:''}</div>`}).join('')}
      <div class="add-cat-row"><input class="add-cat-inp" id="new-cat-inp" placeholder="New category..."><button class="add-cat-btn" onclick="addExpCat()">+</button></div>
      </div>
    </div>
  </div>`;
  setTimeout(()=>buildExpChart(),50);
}

function buildExpChart(){
  const ec=document.getElementById('exp-ch');if(!ec)return;
  const isL=document.documentElement.classList.contains('light');
  const daysInMonth=new Date(expY,expM+1,0).getDate();
  const dailySpend=Array(daysInMonth).fill(0);
  getMonthExp().forEach(e=>{const d=new Date(e.date).getDate();if(d>=1&&d<=daysInMonth)dailySpend[d-1]+=e.amount});
  const labels=Array.from({length:daysInMonth},(_,i)=>i+1);
  const avgLine=dailySpend.reduce((a,v)=>a+v,0)/daysInMonth;
  try{Chart.getChart(ec)?.destroy()}catch(e){}
  new Chart(ec,{type:'bar',data:{labels,datasets:[
    {data:dailySpend,backgroundColor:dailySpend.map(v=>v>avgLine*1.5?'rgba(201,123,107,.6)':'rgba(138,126,212,.4)'),borderRadius:3},
  ]},options:{responsive:true,scales:{
    y:{grid:{color:isL?'rgba(0,0,0,.04)':'rgba(255,255,255,.04)'},ticks:{color:isL?'#888':'#686678',font:{size:8},callback:v=>'₹'+v}},
    x:{grid:{display:false},ticks:{color:isL?'#888':'#686678',font:{size:7},maxTicksLimit:15}}
  },plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>'₹'+c.raw.toLocaleString('en-IN')}}}}});
}

function getMonthExp(){return S.expenses.filter(e=>{const d=new Date(e.date);return d.getMonth()===expM&&d.getFullYear()===expY}).sort((a,b)=>new Date(b.date)-new Date(a.date))}

function getExpInsights(items,total,catT){
  const ins=[];
  const topCat=Object.entries(catT).sort((a,b)=>b[1]-a[1])[0];
  if(topCat&&topCat[1]>total*.4)ins.push({icon:'⚠️',text:`${topCat[0]} is ${Math.round(topCat[1]/total*100)}% of spending — consider reducing`});
  const daysInMonth=new Date(expY,expM+1,0).getDate();const daily=total/Math.max(daysInMonth,1);
  if(S.budget.monthly>0){const pct=Math.round(total/S.budget.monthly*100);if(pct>90)ins.push({icon:'🔴',text:`${pct}% of budget used — only ₹${Math.max(0,S.budget.monthly-total).toLocaleString('en-IN')} left`});else if(pct>60)ins.push({icon:'🟡',text:`${pct}% of ₹${S.budget.monthly.toLocaleString('en-IN')} budget used`});else ins.push({icon:'🟢',text:`On track — ${pct}% of budget used`})}
  if(daily>1500)ins.push({icon:'📊',text:`Averaging ₹${Math.round(daily).toLocaleString('en-IN')}/day — ${daily>2000?'high':'moderate'} burn rate`});
  const weekItems=items.filter(e=>{const d=new Date(e.date);const now=new Date();return(now-d)/(864e5)<7});
  if(weekItems.length>0){const weekTotal=weekItems.reduce((a,e)=>a+e.amount,0);ins.push({icon:'📅',text:`₹${weekTotal.toLocaleString('en-IN')} spent this week (${weekItems.length} transactions)`})}
  return ins;
}

function addExp(){const amt=parseFloat(document.getElementById('exp-amt').value);const desc=document.getElementById('exp-desc').value.trim();const cat=document.getElementById('exp-cat').value;const date=document.getElementById('exp-date').value;
  if(!amt||amt<=0){showToast('Enter amount');return}if(!desc){showToast('Enter description');return}if(!date){showToast('Pick a date');return}
  S.expenses.push({amount:amt,description:desc,category:cat,date,created:Date.now()});save();
  document.getElementById('recipe-modal').classList.remove('show');renderExpenses();showToast(`₹${amt} added`)}

function openExpModal(){
  document.getElementById('recipe-modal').querySelector('.modal-t').textContent='Add Expense';
  document.getElementById('recipe-modal').querySelector('.modal-s').textContent='Log a new expense';
  document.getElementById('recipe-form').innerHTML=`
  <div class="f-row"><div class="f-group"><label class="f-label">Amount (₹) *</label><input class="f-input" id="exp-amt" type="number" placeholder="500"></div>
  <div class="f-group"><label class="f-label">Description *</label><input class="f-input" id="exp-desc" placeholder="Coffee, groceries..."></div></div>
  <div class="f-row"><div class="f-group"><label class="f-label">Category *</label><select class="f-input" id="exp-cat">${S.expenseCats.map(c=>`<option>${c}</option>`).join('')}</select></div>
  <div class="f-group"><label class="f-label">Date *</label><input class="f-input" id="exp-date" type="date" value="${todayKey()}"></div></div>
  <button class="btn-p" style="margin-top:10px" onclick="addExp()">+ Add Expense</button>`;
  document.getElementById('recipe-modal').classList.add('show');
}

function addLent(){const who=document.getElementById('lent-who').value.trim();const amt=parseFloat(document.getElementById('lent-amt').value);const date=document.getElementById('lent-date').value;
  if(!who){showToast('Enter name');return}if(!amt||amt<=0){showToast('Enter amount');return}if(!date){showToast('Pick a date');return}
  S.lentMoney.push({who,amount:amt,date,returned:false,created:Date.now()});save();
  document.getElementById('recipe-modal').classList.remove('show');renderExpenses();showToast(`₹${amt} lent to ${who}`)}

function openLentModal(){
  document.getElementById('recipe-modal').querySelector('.modal-t').textContent='Lend Money';
  document.getElementById('recipe-modal').querySelector('.modal-s').textContent='Track money you lent out';
  document.getElementById('recipe-form').innerHTML=`
  <div class="f-row"><div class="f-group"><label class="f-label">To Whom *</label><input class="f-input" id="lent-who" placeholder="Name"></div>
  <div class="f-group"><label class="f-label">Amount (₹) *</label><input class="f-input" id="lent-amt" type="number" placeholder="1000"></div></div>
  <div class="f-group"><label class="f-label">Date *</label><input class="f-input" id="lent-date" type="date" value="${todayKey()}"></div>
  <button class="btn-p" style="margin-top:10px" onclick="addLent()">+ Lend Money</button>`;
  document.getElementById('recipe-modal').classList.add('show');
}

function delExp(i){S.expenses.splice(i,1);save();renderExpenses()}

function returnLent(i){if(S.lentMoney[i]){S.lentMoney[i].returned=true;showToast('Marked as returned')}save();renderExpenses()}

function setBudget(){const v=parseFloat(document.getElementById('budget-inp').value);S.budget.monthly=v||0;save();renderExpenses();showToast(v?`Budget set: ₹${v.toLocaleString('en-IN')}`:'Budget cleared')}

function addExpCat(){const inp=document.getElementById('new-cat-inp');const v=inp.value.trim();if(!v)return;if(S.expenseCats.includes(v)){showToast('Exists');return}S.expenseCats.push(v);save();renderExpenses();showToast(`${v} added`)}

function toggleExpCat(c){expandedCat=expandedCat===c?null:c;renderExpenses()}

function shiftExpM(n){expM+=n;if(expM>11){expM=0;expY++}if(expM<0){expM=11;expY--}renderExpenses()}

async function aiExpInsights(){
  const btn=document.getElementById('ai-exp-btn');const out=document.getElementById('ai-exp-out');
  if(!btn||!out)return;btn.disabled=true;btn.textContent='Analyzing...';
  out.innerHTML='<div style="color:var(--t3);font-size:11px">Aria is analyzing your expenses...</div>';
  const items=getMonthExp();const total=items.reduce((a,e)=>a+e.amount,0);
  const catT={};items.forEach(e=>{catT[e.category]=(catT[e.category]||0)+e.amount});
  const mn=new Date(expY,expM).toLocaleDateString('en-IN',{month:'long',year:'numeric'});
  // Get last 6 months for trend comparison
  const monthTotals=[];for(let i=0;i<6;i++){const m=(expM-i+12)%12;const y=expM-i<0?expY-1:expY;const mi=S.expenses.filter(e=>{const d=new Date(e.date);return d.getMonth()===m&&d.getFullYear()===y});monthTotals.push({month:new Date(y,m).toLocaleDateString('en-IN',{month:'short'}),total:mi.reduce((a,e)=>a+e.amount,0)})}
  const lentTotal=S.lentMoney.filter(l=>!l.returned).reduce((a,l)=>a+l.amount,0);
  const prompt=`You are Aria, a smart female financial advisor. Analyze expenses for ${mn}: Total ₹${total}. Categories: ${Object.entries(catT).map(([k,v])=>`${k}:₹${v}`).join(', ')}. Budget: ₹${S.budget.monthly||'not set'}. ${items.length} transactions. Lent money outstanding: ₹${lentTotal}. Last 6 months: ${monthTotals.map(m=>`${m.month}:₹${m.total}`).join(', ')}. Give: 1) Overview with trend (compare to avg), 2) Category where spending increased most vs avg, 3) Specific saving tip, 4) Recommended asset split (needs/wants/savings %). Be specific with numbers. JSON only: {"overview":"","trend":"","saving":"","recommendation":"","split":{"needs":50,"wants":30,"savings":20}}`;
  try{
    const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:500,messages:[{role:'user',content:prompt}]})});
    const d=await r.json();const txt=d.content?.find(c=>c.type==='text')?.text||'{}';
    const data=JSON.parse(txt.replace(/```json|```/g,'').trim());
    out.innerHTML=`
    <div style="font-size:12px;line-height:1.7;margin-bottom:8px">${data.overview||''}</div>
    ${data.trend?`<div class="insight-card" style="margin-bottom:6px"><span class="ins-icon">📈</span><span style="font-size:11px">${data.trend}</span></div>`:''}
    <div class="insight-card" style="margin-bottom:6px"><span class="ins-icon">💡</span><span style="font-size:11px">${data.saving||''}</span></div>
    <div class="insight-card" style="margin-bottom:6px"><span class="ins-icon">📊</span><span style="font-size:11px">${data.recommendation||''}</span></div>
    ${data.split?`<div style="margin-top:10px"><div style="font-size:9px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--t3);margin-bottom:6px">Recommended Split</div>
    <div style="display:flex;gap:4px;height:10px;border-radius:5px;overflow:hidden">
      <div style="flex:${data.split.needs||50};background:var(--con);border-radius:5px"></div>
      <div style="flex:${data.split.wants||30};background:var(--per);border-radius:5px"></div>
      <div style="flex:${data.split.savings||20};background:var(--int);border-radius:5px"></div>
    </div>
    <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--t2);margin-top:4px"><span style="color:var(--con)">Needs ${data.split.needs}%</span><span style="color:var(--per)">Wants ${data.split.wants}%</span><span style="color:var(--int)">Save ${data.split.savings}%</span></div></div>`:''}`
  }catch(e){out.innerHTML=`<div style="color:var(--str);font-size:11px">Aria couldn't connect: ${e.message}</div>`}
  btn.disabled=false;btn.textContent='✨ Ask Aria Again';
}
