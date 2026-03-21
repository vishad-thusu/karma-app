/* ═══ KARMA — Aria AI ═══ */

function ariaAvatar(sz=32){return`<div style="flex-shrink:0;position:relative;width:${sz}px;height:${sz}px"><div style="position:absolute;inset:-4px;border-radius:50%;background:radial-gradient(circle,rgba(138,126,212,.14),transparent 70%);filter:blur(4px)"></div><svg viewBox="0 0 36 36" width="${sz}" height="${sz}" style="position:relative;filter:drop-shadow(0 0 4px rgba(138,126,212,.3));animation:globeSpin 8s linear infinite"><defs><linearGradient id="ag${sz}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="rgba(138,126,212,.7)"/><stop offset="100%" stop-color="rgba(245,151,104,.5)"/></linearGradient></defs><g transform="translate(18,18)"><circle r="14" fill="none" stroke="url(#ag${sz})" stroke-width=".6" opacity=".3"/><ellipse rx="14" ry="5" fill="none" stroke="url(#ag${sz})" stroke-width=".5" opacity=".45"/><ellipse rx="5" ry="14" fill="none" stroke="url(#ag${sz})" stroke-width=".5" opacity=".45"/><ellipse rx="10" ry="14" fill="none" stroke="url(#ag${sz})" stroke-width=".4" opacity=".25" transform="rotate(30)"/><circle r="2.5" fill="rgba(138,126,212,.12)"/><circle r="1" fill="rgba(138,126,212,.3)"/></g></svg></div>`}

function ariaHeader(title='Aria',sub='AI Assistant'){return`<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">${ariaAvatar(32)}<div><div style="font-size:13px;font-weight:600;letter-spacing:-.02em">${title}</div><div style="font-size:7px;color:var(--int);font-weight:600;letter-spacing:.06em;text-transform:uppercase">${sub}</div></div></div>`}

function ariaTypewriter(){
  if(aiCache)return;
  const el=document.getElementById('aria-intro');if(!el)return;
  const capabilities=['Weight trend analysis','Habit consistency scoring','Stat growth optimization','Daily routine suggestions','Macro & nutrition planning','Streak pattern detection'];
  el.innerHTML=`<div style="margin-bottom:8px">I analyze your real data — weight, streaks, daily completion, stat distribution.</div><div style="margin-bottom:8px">I give 4 specific, actionable recommendations.</div><div style="display:flex;align-items:center;gap:4px"><span style="color:var(--t3)">→</span><span id="aria-cycle" style="color:var(--int);min-width:200px"></span><span id="aria-cursor" style="border-right:1.5px solid var(--int);animation:blink 1s step-end infinite;padding-right:1px">&nbsp;</span></div>`;
  let capIdx=0,charIdx=0,deleting=false;
  function cycle(){
    const target=document.getElementById('aria-cycle');if(!target)return;
    const word=capabilities[capIdx];
    if(!deleting){
      if(charIdx<=word.length){target.textContent=word.slice(0,charIdx);charIdx++;setTimeout(cycle,35)}
      else{setTimeout(()=>{deleting=true;cycle()},1800)}
    }else{
      if(charIdx>0){charIdx--;target.textContent=word.slice(0,charIdx);setTimeout(cycle,20)}
      else{deleting=false;capIdx=(capIdx+1)%capabilities.length;setTimeout(cycle,300)}
    }
  }
  cycle();
}

// Nutrition suggestions based on remaining macros

function openAskAI(){
  document.getElementById('recipe-modal').querySelector('.modal-t').textContent='Ask Aria';
  document.getElementById('recipe-modal').querySelector('.modal-s').textContent='Your AI assistant for everything in KARMA';
  document.getElementById('recipe-form').innerHTML=`
  ${ariaHeader('Aria','Ask Me Anything')}
  <div style="font-size:11px;color:var(--t2);line-height:1.6;margin-bottom:12px">I can log meals, add habits, create todos, analyze progress, suggest workouts, or answer any question about your data.</div>
  <div class="f-group"><label class="f-label">Your question</label><textarea class="f-input" id="ai-ask-inp" rows="3" placeholder="e.g. 'Log my lunch - 2 rotis with dal and rice' or 'What should I focus on today?'" style="resize:vertical"></textarea></div>
  <div id="ai-ask-out" style="display:none;margin-bottom:12px;padding:14px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:10px;font-size:12px;line-height:1.7;color:var(--t2);white-space:pre-line"></div>
  <button class="btn-p" style="width:100%;border-radius:9999px" onclick="runAskAI()" id="ai-ask-btn">✨ Ask Aria</button>`;
  document.getElementById('recipe-modal').classList.add('show');
}

async function runAskAI(){
  const inp=document.getElementById('ai-ask-inp');const out=document.getElementById('ai-ask-out');const btn=document.getElementById('ai-ask-btn');
  if(!inp?.value.trim()){showToast('Type a question');return}
  btn.disabled=true;btn.textContent='Thinking...';out.style.display='block';out.textContent='Processing...';
  const ctx=`User profile: ${S.profile.name}, Level ${S.player.level}, Stats: STR ${S.player.stats.str} CON ${S.player.stats.con} INT ${S.player.stats.int} PER ${S.player.stats.per}. Today completed ${Object.keys(S.dailyLog[todayKey()]||{}).length} items. Weight: ${S.weightLog[todayKey()]||'?'}kg. Water: ${(S.waterLog[todayKey()]||0)/1000}L.`;
  try{
    const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:500,messages:[{role:'user',content:`Context: ${ctx}\n\nUser asks: ${inp.value}\n\nRespond helpfully and concisely. If they want to log something, confirm what you'd log. Keep it under 200 words.`}]})});
    const d=await r.json();out.textContent=d.content?.[0]?.text||'No response.';
  }catch(e){out.textContent='AI unavailable. Try checking your connection.'}
  btn.disabled=false;btn.textContent='✨ Ask Aria Again';
}
