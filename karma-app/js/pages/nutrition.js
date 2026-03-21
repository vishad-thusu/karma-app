/* ═══ KARMA — Nutrition ═══ */

function renderMeals(){
  const t=todayKey(),logged=S.mealLog[t]||{},macros=getTodayMacros();
  const allM=getAllMeals();
  let filtered=mealFilter==='veg'?allM.filter(m=>m.type==='veg'):mealFilter==='nv'?allM.filter(m=>m.type==='nv'):mealFilter==='custom'?S.customMeals:[...allM];
  filtered=sortMeals(filtered);
  const maxP=Math.max(...allM.map(m=>m.p),1),maxC=Math.max(...allM.map(m=>m.c),1),maxF=Math.max(...allM.map(m=>m.f),1);
  const remP=Math.max(0,195-macros.p),remC=Math.max(0,220-macros.c),remF=Math.max(0,65-macros.f),remK=2400-macros.k;
  const loggedCount=Object.values(logged).filter(Boolean).length;
  document.getElementById('page-meals').innerHTML=`
  <div class="pg-t">Nutrition</div><div class="pg-s" style="font-size:13px">Log meals, track macros, create recipes</div>
  <div style="display:grid;grid-template-columns:340px 1fr;gap:16px;align-items:start">
  <!-- LEFT: Macros + Tools -->
  <div style="position:sticky;top:20px">
    <!-- Today's Macros - BIG -->
    <div class="macro-p" style="margin-bottom:12px">
      <div style="font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);margin-bottom:10px">Today's Nutrition</div>
      <div class="mtn-box" style="padding:18px"><div class="mtn-v" style="font-size:42px;${macros.k>2400?'color:var(--str)':''}">${macros.k}</div><div class="mtn-l" style="font-size:10px">Calories${macros.k>2400?' <span style="color:var(--str);font-weight:700">⚠ OVER</span>':''}</div><div class="mtn-t" style="font-size:11px">/ 2,400 target · ${loggedCount} meals logged</div></div>
      ${[{l:'Protein',v:macros.p,t:195,c:macros.p>195?'var(--str)':'var(--con)'},{l:'Carbs',v:macros.c,t:220,c:macros.c>220?'var(--str)':'var(--int)'},{l:'Fat',v:macros.f,t:65,c:macros.f>65?'var(--str)':'var(--per)'}].map(m=>`<div class="mb-r" style="margin-bottom:10px"><div class="mb-top"><span class="mb-l" style="font-size:12px">${m.l}</span><span class="mb-n" style="color:${m.c};font-size:12px">${m.v} / ${m.t}g</span></div><div class="mb-trk" style="height:4px"><div class="mb-f" style="width:${Math.min(100,Math.round(m.v/m.t*100))}%;background:${m.c}"></div></div></div>`).join('')}
      <div style="background:var(--s3);border:1px solid var(--bd);border-radius:8px;padding:10px 12px;margin-top:8px">
        <div style="font-size:9px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--t3);margin-bottom:6px">Remaining</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
          <div style="font-size:12px"><span style="color:var(--t2)">Cal</span> <span style="font-family:var(--mono);font-weight:600;color:${remK>=0?'var(--con)':'var(--str)'}">${remK>=0?remK:'⚠ +'+Math.abs(remK)}</span></div>
          <div style="font-size:12px"><span style="color:var(--t2)">P</span> <span style="font-family:var(--mono);font-weight:600;color:${remP>0?'var(--con)':'var(--con)'}">${remP>0?remP+'g':'✓'}</span></div>
          <div style="font-size:12px"><span style="color:var(--t2)">C</span> <span style="font-family:var(--mono);font-weight:600;color:${remC>0?'var(--t2)':'var(--con)'}">${remC>0?remC+'g':'✓'}</span></div>
          <div style="font-size:12px"><span style="color:var(--t2)">F</span> <span style="font-family:var(--mono);font-weight:600;color:${remF>0?'var(--t2)':'var(--con)'}">${remF>0?remF+'g':'✓'}</span></div>
        </div>
      </div>
    </div>
    <!-- Create & AI Detect card -->
    <div class="card" style="padding:14px">
      <div style="font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);margin-bottom:10px">Add Meals</div>
      <button class="btn-p" style="width:100%;margin-bottom:8px;font-size:12px" onclick="openRecipeModal()">+ Create Recipe</button>
      <div style="font-size:10px;color:var(--t3);text-align:center;margin-bottom:8px">or describe what you ate</div>
      <div style="display:flex;gap:6px">
        <input class="f-input" id="ai-meal-inp" placeholder="e.g. '2 rotis with dal'" style="font-size:12px;flex:1">
        <button class="btn-p" style="width:auto;padding:8px 12px;font-size:11px;white-space:nowrap" onclick="aiDetectMealV2()" id="ai-meal-btn">🤖 Detect</button>
      </div>
    </div>
    <!-- Suggested to hit macros -->
    ${(()=>{const sug=getSuggestedMeals();return sug.length?`<div class="card" style="padding:14px;margin-top:10px">
      <div style="font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);margin-bottom:8px">Suggested to hit macros</div>
      <div style="font-size:9px;color:var(--t2);margin-bottom:8px">Need ~${Math.max(0,195-macros.p)}g protein, ${Math.max(0,2400-macros.k)} cal remaining</div>
      ${sug.map(m=>`<div style="display:flex;align-items:center;gap:8px;padding:8px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:8px;margin-bottom:4px;cursor:pointer;transition:.12s" onclick="toggleMLog('${m.id}')" onmouseover="this.style.borderColor='rgba(90,184,154,.2)'" onmouseout="this.style.borderColor='rgba(255,255,255,.04)'">
        <div style="flex:1;min-width:0"><div style="font-size:11px;font-weight:500">${m.title}</div><div style="font-size:8px;color:var(--t3)">${m.p}g P · ${m.kcal}kcal</div></div>
        <span style="font-size:8px;color:var(--con);font-weight:600">+ Log</span>
      </div>`).join('')}
    </div>`:''})()}
  </div>
  <div>
    <div class="meals-toolbar"><button class="hab-tab ${mealFilter==='all'?'act':''}" data-c="all" onclick="setMF('all')">All</button><button class="hab-tab ${mealFilter==='veg'?'act':''}" data-c="nutrition" onclick="setMF('veg')">Veg</button><button class="hab-tab ${mealFilter==='nv'?'act':''}" data-c="physical" onclick="setMF('nv')">Non-veg</button>${S.customMeals.length?`<button class="hab-tab ${mealFilter==='custom'?'act':''}" data-c="grooming" onclick="setMF('custom')">My Recipes</button>`:''}<div style="margin-left:auto;display:flex;gap:3px;align-items:center"><span style="font-size:9px;color:var(--t4)">Sort:</span>${[{k:'recent',l:'Recent'},{k:'freq',l:'Most logged'},{k:'protein',l:'Protein ↑'},{k:'calories',l:'Cal ↓'}].map(s=>`<button style="padding:2px 7px;font-size:8px;border-radius:9999px;border:1px solid ${mealSort===s.k?'rgba(245,151,104,.4)':'rgba(255,255,255,.06)'};background:${mealSort===s.k?'rgba(245,151,104,.06)':'transparent'};color:${mealSort===s.k?'var(--primary2)':'var(--t3)'};cursor:pointer" onclick="setMealSort('${s.k}')">${s.l}</button>`).join('')}</div></div>
    <div class="meals-grid">${filtered.map(m=>{const isL=!!logged[m.id];const isCustom=S.customMeals.some(c=>c.id===m.id);return`<div class="card mc ${isL?'logged':''} ${openMeals.has(m.id)?'open':''}" id="mc-${m.id}" onmouseenter="initGlow(this)" onmouseleave="hideGlow(this)" onmousemove="moveGlow(event,this)"><div class="glow"></div>
      <div class="mc-title" style="font-size:14px">${m.title}</div><div class="mc-sub" style="font-size:11px">${m.sub}</div>
      <div class="mc-tags"><span class="mtag ${m.type==='veg'?'tag-veg':'tag-nv'}">${m.type==='veg'?'Veg':'NV'}</span>${(S.mealFreq[m.id]||0)>0?`<span class="mtag tag-freq">×${S.mealFreq[m.id]}</span>`:''}</div>
      <div class="mc-bars"><div class="mcb-r"><div class="mcb-l" style="color:var(--con)">P</div><div class="mcb-trk"><div class="mcb-f" style="width:${Math.round(m.p/maxP*100)}%;background:var(--con)"></div></div><div class="mcb-v" style="color:var(--con)">${m.p}g</div></div><div class="mcb-r"><div class="mcb-l" style="color:var(--int)">C</div><div class="mcb-trk"><div class="mcb-f" style="width:${Math.round(m.c/maxC*100)}%;background:var(--int)"></div></div><div class="mcb-v" style="color:var(--int)">${m.c}g</div></div><div class="mcb-r"><div class="mcb-l" style="color:var(--per)">F</div><div class="mcb-trk"><div class="mcb-f" style="width:${Math.round(m.f/maxF*100)}%;background:var(--per)"></div></div><div class="mcb-v" style="color:var(--per)">${m.f}g</div></div></div>
      <div style="background:rgba(255,255,255,.03);border-radius:8px;padding:8px 10px;margin-top:8px;display:flex;justify-content:space-between;align-items:center"><div style="display:flex;align-items:baseline;gap:4px"><span class="mc-kcal" style="font-size:16px">${m.kcal}</span><span style="font-size:7px;color:var(--t3);text-transform:uppercase;letter-spacing:.04em">kcal</span></div><div style="display:flex;gap:3px"><button class="mc-btn ${isL?'logged':''}" onclick="event.stopPropagation();toggleMLog('${m.id}')" style="padding:4px 8px">${isL?'✓':'+ Log'}</button><button class="mc-btn" onclick="event.stopPropagation();toggleMOpen('${m.id}')" style="padding:4px 6px">⤵</button><button class="mc-btn" onclick="event.stopPropagation();editMeal('${m.id}')" style="padding:4px 6px">✎</button><button class="mc-btn" style="color:var(--str);padding:4px 6px" onclick="event.stopPropagation();delAnyMeal('${m.id}')">✕</button></div></div>
      <div class="mc-body"><div class="recipe-g"><div><div class="rsec-t">Ingredients</div>${(m.ings||[]).map(i=>`<div class="ing-r"><span class="ing-n">${i.n}</span><span class="ing-q">${i.q}</span></div>`).join('')}</div><div><div class="rsec-t">Steps</div>${(m.steps||[]).map((s,i)=>`<div class="step-r"><span class="step-nn">${i+1}</span><span>${s}</span></div>`).join('')}</div></div></div>
    </div>`}).join('')}</div>
  </div>
  </div>`;
}

function setMF(f){mealFilter=f;renderMeals()}

function toggleMOpen(id){if(openMeals.has(id))openMeals.delete(id);else openMeals.add(id);renderMeals()}

function toggleMLog(id){
  const t=todayKey();
  if(S.mealLog[t]?.[id]){
    // Unlog
    delete S.mealLog[t][id];
    // Remove from timeline
    if(S.activityLog[t])S.activityLog[t]=S.activityLog[t].filter(a=>a.id!=='meal_'+id);
    if(S.dailyLog[t])delete S.dailyLog[t]['meal_'+id];
    removeXP(10,'con');save();renderMeals();updateSB();showToast('Meal unlogged');return;
  }
  // Show time prompt
  const meal=getAllMeals().find(m=>m.id===id);if(!meal)return;
  showMealTimePrompt(id,meal.title,meal.kcal,meal.p);
}

function showMealTimePrompt(mealId,mealName,kcal,protein){
  const ts=nowTimeStr();
  document.getElementById('recipe-modal').querySelector('.modal-t').textContent='Log Meal';
  document.getElementById('recipe-modal').querySelector('.modal-s').textContent=mealName;
  document.getElementById('recipe-form').innerHTML=`
  <div style="text-align:center;margin-bottom:14px">
    <div style="font-size:14px;font-weight:600;margin-bottom:2px">${mealName}</div>
    <div style="font-size:10px;color:var(--t2);font-family:var(--mono)">${kcal} kcal · ${protein}g protein</div>
  </div>
  <div style="font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);margin-bottom:8px">When did you eat?</div>
  <div style="display:flex;gap:6px;margin-bottom:10px">
    <button class="btn-p" style="flex:1;border-radius:9999px;font-size:12px" onclick="logMealWithTime('${mealId}','${ts}')">Now (${ts})</button>
    <button class="btn-g" style="flex:1;border-radius:9999px;font-size:12px" onclick="document.getElementById('meal-time-custom').style.display='flex'">Custom Time</button>
  </div>
  <div id="meal-time-custom" style="display:none;gap:6px;align-items:center;justify-content:center">
    <input class="f-input" type="time" id="meal-custom-time" value="${ts}" style="width:120px;text-align:center;font-size:13px;padding:8px">
    <button class="btn-p" style="width:auto;padding:8px 16px;font-size:11px;border-radius:9999px" onclick="logMealWithTime('${mealId}',document.getElementById('meal-custom-time').value)">Log</button>
  </div>`;
  document.getElementById('recipe-modal').classList.add('show');
}

function logMealWithTime(id,time){
  const t=todayKey();
  if(!S.mealLog[t])S.mealLog[t]={};
  S.mealLog[t][id]=time;
  S.mealFreq[id]=(S.mealFreq[id]||0)+1;
  // Add to timeline
  const meal=getAllMeals().find(m=>m.id===id);
  if(meal){
    logActivityToTimeline({id:'meal_'+id,type:'meal',name:meal.title,icon:'🍽️',stat:'con',time,xp:10,details:`${meal.kcal}kcal · ${meal.p}g P · ${meal.c}g C · ${meal.f}g F`},t);
    if(!S.dailyLog[t])S.dailyLog[t]={};
    S.dailyLog[t]['meal_'+id]=time;
  }
  addXP(10,'con',null);save();
  document.getElementById('recipe-modal').classList.remove('show');
  showToast(`${meal?.title||'Meal'} logged at ${time} ✓ +10 CON`);
  renderMeals();updateSB();
}
// Recipe creator

function openRecipeModal(){recipeTemp={ings:[],steps:[]};document.getElementById('recipe-modal').classList.add('show');renderRecipeForm()}

function closeRecipeModal(){document.getElementById('recipe-modal').classList.remove('show')}

function renderRecipeForm(){
  document.getElementById('recipe-form').innerHTML=`
  <div class="f-group"><label class="f-label">Recipe Name *</label><input class="f-input" id="rc-name" placeholder="My protein bowl"></div>
  <div class="f-row"><div class="f-group"><label class="f-label">Type *</label><div class="chip-grid"><div class="chip sel" id="rc-veg" onclick="document.querySelectorAll('#rc-veg,#rc-nv').forEach(c=>c.classList.remove('sel'));this.classList.add('sel')">Veg</div><div class="chip" id="rc-nv" onclick="document.querySelectorAll('#rc-veg,#rc-nv').forEach(c=>c.classList.remove('sel'));this.classList.add('sel')">Non-veg</div></div></div><div class="f-group"><label class="f-label">Category</label><input class="f-input" id="rc-sub" placeholder="Breakfast, lunch..." style="font-size:11px"></div></div>
  <div class="f-row" style="grid-template-columns:1fr 1fr 1fr 1fr">
    <div class="f-group"><label class="f-label">Protein (g) *</label><input class="f-input" id="rc-p" type="number" placeholder="30" style="font-size:12px"></div>
    <div class="f-group"><label class="f-label">Carbs (g) *</label><input class="f-input" id="rc-c" type="number" placeholder="40" style="font-size:12px"></div>
    <div class="f-group"><label class="f-label">Fat (g) *</label><input class="f-input" id="rc-f" type="number" placeholder="12" style="font-size:12px"></div>
    <div class="f-group"><label class="f-label">Calories *</label><input class="f-input" id="rc-k" type="number" placeholder="400" style="font-size:12px"></div>
  </div>
  <div class="f-group"><label class="f-label">Ingredients * (add at least 1)</label>
    <div class="ing-added" id="rc-ings">${recipeTemp.ings.map((ig,i)=>`<div class="ing-chip">${ig.n} — ${ig.q}<span class="ing-chip-x" onclick="recipeTemp.ings.splice(${i},1);renderRecipeForm()">✕</span></div>`).join('')}</div>
    <div class="ing-add-row"><input id="rc-ing-n" placeholder="Ingredient name"><input id="rc-ing-q" placeholder="Qty" style="max-width:80px"><button class="btn-g" style="padding:5px 10px;font-size:10px" onclick="addRecipeIng()">+</button></div>
  </div>
  <div class="f-group"><label class="f-label">Steps * (add at least 1)</label>
    <div id="rc-steps">${recipeTemp.steps.map((s,i)=>`<div class="ing-chip">${i+1}. ${s}<span class="ing-chip-x" onclick="recipeTemp.steps.splice(${i},1);renderRecipeForm()">✕</span></div>`).join('')}</div>
    <div class="step-add-row" style="margin-top:4px"><input id="rc-step-inp" placeholder="Step description"><button class="btn-g" style="padding:5px 10px;font-size:10px" onclick="addRecipeStep()">+</button></div>
  </div>
  <button class="btn-p" style="margin-top:8px" onclick="saveCustomRecipe()">Save Recipe</button>`;
}

function addRecipeIng(){const n=document.getElementById('rc-ing-n').value.trim(),q=document.getElementById('rc-ing-q').value.trim();if(!n||!q){showToast('Fill ingredient name and qty');return}recipeTemp.ings.push({n,q});renderRecipeForm()}

function addRecipeStep(){const s=document.getElementById('rc-step-inp').value.trim();if(!s){showToast('Enter step');return}recipeTemp.steps.push(s);renderRecipeForm()}

function saveCustomRecipe(){
  const name=document.getElementById('rc-name').value.trim();const sub=document.getElementById('rc-sub').value.trim()||'Custom';
  const p=parseInt(document.getElementById('rc-p').value),c=parseInt(document.getElementById('rc-c').value),f=parseInt(document.getElementById('rc-f').value),k=parseInt(document.getElementById('rc-k').value);
  const isVeg=document.getElementById('rc-veg').classList.contains('sel');
  if(!name){showToast('Enter recipe name');return}if(!p&&p!==0||!c&&c!==0||!f&&f!==0||!k){showToast('Fill all macro fields');return}
  if(recipeTemp.ings.length===0){showToast('Add at least 1 ingredient');return}if(recipeTemp.steps.length===0){showToast('Add at least 1 step');return}
  // Check if editing existing
  if(window._editingMealId){
    const idx=S.customMeals.findIndex(m=>m.id===window._editingMealId);
    if(idx>=0){S.customMeals[idx]={...S.customMeals[idx],title:name,sub,kcal:k,type:isVeg?'veg':'nv',p,c,f,ings:recipeTemp.ings,steps:recipeTemp.steps}}
    window._editingMealId=null;showToast(`${name} updated!`);
  }else{
    S.customMeals.push({id:'r_'+Date.now(),title:name,sub,kcal:k,type:isVeg?'veg':'nv',p,c,f,ings:recipeTemp.ings,steps:recipeTemp.steps});
    showToast(`${name} saved!`);
  }
  save();closeRecipeModal();renderMeals();
}

function delCustomMeal(id){S.customMeals=S.customMeals.filter(m=>m.id!==id);save();renderMeals();showToast('Recipe removed')}

function delAnyMeal(id){
  // Remove from custom meals if exists
  if(S.customMeals.some(m=>m.id===id)){S.customMeals=S.customMeals.filter(m=>m.id!==id);save();renderMeals();showToast('Recipe removed');return}
  // For built-in meals, add to a hidden list
  if(!S.hiddenMeals)S.hiddenMeals=[];
  S.hiddenMeals.push(id);save();renderMeals();showToast('Meal hidden');
}

function editMeal(id){
  const allM=getAllMeals();const m=allM.find(x=>x.id===id);if(!m)return;
  // Copy to custom if built-in
  let target=S.customMeals.find(x=>x.id===id);
  if(!target){target={...m,id:'edit_'+Date.now(),ings:[...(m.ings||[])],steps:[...(m.steps||[])]};S.customMeals.push(target);save()}
  recipeTemp={ings:[...(target.ings||[])],steps:[...(target.steps||[])]};
  openRecipeModal();
  // Pre-fill form after modal opens
  setTimeout(()=>{
    const ne=document.getElementById('rc-name');if(ne)ne.value=target.title;
    const se=document.getElementById('rc-sub');if(se)se.value=target.sub||'';
    const pe=document.getElementById('rc-p');if(pe)pe.value=target.p;
    const ce=document.getElementById('rc-c');if(ce)ce.value=target.c;
    const fe=document.getElementById('rc-f');if(fe)fe.value=target.f;
    const ke=document.getElementById('rc-k');if(ke)ke.value=target.kcal;
    if(target.type==='nv'){document.getElementById('rc-veg')?.classList.remove('sel');document.getElementById('rc-nv')?.classList.add('sel')}
    // Override save to update existing
    window._editingMealId=target.id;
  },100);
}

function getAllMeals(){const hidden=S.hiddenMeals||[];return[...MEALS.filter(m=>!hidden.includes(m.id)),...S.customMeals]}

function getTodayMacros(){const t=todayKey(),l=S.mealLog[t]||{};let p=0,c=0,f=0,k=0;getAllMeals().forEach(m=>{if(l[m.id]){p+=m.p;c+=m.c;f+=m.f;k+=m.kcal}});return{p,c,f,k}}

function sortMeals(meals){
  const t=todayKey(),logged=S.mealLog[t]||{};
  if(mealSort==='freq')return[...meals].sort((a,b)=>(S.mealFreq[b.id]||0)-(S.mealFreq[a.id]||0));
  if(mealSort==='protein')return[...meals].sort((a,b)=>b.p-a.p);
  if(mealSort==='calories')return[...meals].sort((a,b)=>a.kcal-b.kcal);
  // recent: logged today first, then by freq
  return[...meals].sort((a,b)=>{const aL=logged[a.id]?1:0,bL=logged[b.id]?1:0;if(aL!==bL)return bL-aL;return(S.mealFreq[b.id]||0)-(S.mealFreq[a.id]||0)});
}

function setMealSort(s){mealSort=s;renderMeals()}

function getSuggestedMeals(){
  const macros=getTodayMacros();const remP=Math.max(0,195-macros.p),remC=Math.max(0,220-macros.c),remK=Math.max(0,2400-macros.k);
  if(remK<=0)return[];
  const allM=getAllMeals();const t=todayKey(),logged=S.mealLog[t]||{};
  return allM.filter(m=>!logged[m.id]).filter(m=>m.kcal<=remK+100).sort((a,b)=>{
    // Score by how well they fill remaining macros
    const sa=Math.min(a.p,remP)/Math.max(remP,1)*3+Math.min(a.kcal,remK)/Math.max(remK,1);
    const sb=Math.min(b.p,remP)/Math.max(remP,1)*3+Math.min(b.kcal,remK)/Math.max(remK,1);
    return sb-sa;
  }).slice(0,3);
}

async function aiDetectMeal(){
  const inp=document.getElementById('ai-meal-inp');const desc=inp.value.trim();
  if(!desc){showToast('Describe what you ate');return}
  const btn=document.getElementById('ai-meal-btn');btn.disabled=true;btn.textContent='Analyzing...';
  try{
    const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:400,messages:[{role:'user',content:`Estimate nutrition for this Indian meal: "${desc}". Respond ONLY JSON: {"title":"short name","sub":"category","type":"veg or nv","kcal":number,"p":protein_grams,"c":carb_grams,"f":fat_grams,"ings":[{"n":"name","q":"qty"}],"steps":["step1"]}`}]})});
    const d=await r.json();const txt=d.content?.find(c=>c.type==='text')?.text||'{}';
    const meal=JSON.parse(txt.replace(/```json|```/g,'').trim());
    meal.id='ai_'+Date.now();
    S.customMeals.push(meal);save();inp.value='';renderMeals();showToast(`${meal.title} created — ${meal.kcal} kcal, ${meal.p}g protein`);
  }catch(e){showToast('AI error: '+e.message)}
  btn.disabled=false;btn.textContent='🤖 Detect Macros';
}

async function aiDetectMealV2(){
  const inp=document.getElementById('ai-meal-inp');const btn=document.getElementById('ai-meal-btn');
  if(!inp?.value.trim()){showToast('Describe what you ate');return}
  btn.disabled=true;btn.textContent='Detecting...';
  const desc=inp.value.trim();
  try{
    const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:500,messages:[{role:'user',content:`Analyze this meal: "${desc}". Return ONLY valid JSON, no markdown: {"title":"Name","sub":"Category","type":"veg or nv","p":protein_grams,"c":carb_grams,"f":fat_grams,"kcal":calories,"ings":[{"n":"ingredient","q":"amount"}],"steps":["step1"]}`}]})});
    const d=await r.json();const text=d.content?.[0]?.text||'';
    const meal=JSON.parse(text.replace(/```json|```/g,'').trim());
    meal.id='ai_'+Date.now();
    showRecipeConfirmation(meal);
  }catch(e){showToast('Could not detect meal. Try again.');console.error(e)}
  btn.disabled=false;btn.textContent='🤖 Detect';inp.value='';
}

function showRecipeConfirmation(meal){
  window._detectedMeal=meal;
  document.getElementById('recipe-modal').querySelector('.modal-t').textContent='Meal Detected';
  document.getElementById('recipe-modal').querySelector('.modal-s').textContent='Review and confirm the details';
  document.getElementById('recipe-form').innerHTML=`
  <div style="text-align:center;margin-bottom:14px;animation:scaleIn .3s var(--ease)">
    <div style="font-size:32px;margin-bottom:6px">🍽️</div>
    <div style="font-size:18px;font-weight:600;letter-spacing:-.02em;margin-bottom:2px">${meal.title}</div>
    <div style="font-size:11px;color:var(--t2)">${meal.sub||'Detected meal'} · ${meal.type==='veg'?'🟢 Veg':'🔴 Non-veg'}</div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:14px;text-align:center">
    <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:8px;padding:8px"><div style="font-family:var(--mono);font-size:18px;font-weight:700">${meal.kcal}</div><div style="font-size:8px;color:var(--t3)">KCAL</div></div>
    <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:8px;padding:8px"><div style="font-family:var(--mono);font-size:18px;font-weight:700;color:var(--con)">${meal.p}g</div><div style="font-size:8px;color:var(--t3)">PROTEIN</div></div>
    <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:8px;padding:8px"><div style="font-family:var(--mono);font-size:18px;font-weight:700;color:var(--int)">${meal.c}g</div><div style="font-size:8px;color:var(--t3)">CARBS</div></div>
    <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:8px;padding:8px"><div style="font-family:var(--mono);font-size:18px;font-weight:700;color:var(--per)">${meal.f}g</div><div style="font-size:8px;color:var(--t3)">FAT</div></div>
  </div>
  ${meal.ings?.length?`<div style="margin-bottom:10px"><div style="font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);margin-bottom:4px">Ingredients</div>${meal.ings.map(i=>`<div style="display:flex;justify-content:space-between;font-size:11px;padding:2px 0;border-bottom:1px solid rgba(255,255,255,.03)"><span>${i.n}</span><span style="color:var(--t2);font-family:var(--mono)">${i.q}</span></div>`).join('')}</div>`:''}
  <div style="display:flex;gap:6px;margin-top:14px">
    <button class="btn-p" style="flex:1;border-radius:9999px;font-size:12px" onclick="confirmDetectedMeal(window._detectedMeal,'log')">✓ Log Meal</button>
    <button class="btn-g" style="flex:1;border-radius:9999px;font-size:12px" onclick="confirmDetectedMeal(window._detectedMeal,'save')">💾 Save Only</button>
    <button class="btn-g" style="padding:8px 14px;border-radius:9999px;font-size:12px;color:var(--str)" onclick="document.getElementById('recipe-modal').classList.remove('show')">✕</button>
  </div>`;
  document.getElementById('recipe-modal').classList.add('show');
}

function confirmDetectedMeal(meal,action){
  S.customMeals.push(meal);save();
  if(action==='log'){
    // Close current modal, show time prompt
    document.getElementById('recipe-modal').classList.remove('show');
    setTimeout(()=>showMealTimePrompt(meal.id,meal.title,meal.kcal,meal.p),200);
  } else{
    showToast(meal.title+' saved to My Recipes');
    document.getElementById('recipe-modal').classList.remove('show');renderMeals();
  }
}
