/* ═══ KARMA — XP Engine ═══ */

function addXP(base,stat,el){
  const e=Math.round(base*xpMult()),gp=parseFloat((Math.random()*.25+.1*goldMult()).toFixed(2));
  S.player.xp+=e;S.player.gold=parseFloat((S.player.gold+gp).toFixed(2));
  if(stat&&S.player.statXP[stat]!==undefined){S.player.statXP[stat]+=e;while(S.player.statXP[stat]>=statXpNeed(S.player.statLevels[stat])){S.player.statXP[stat]-=statXpNeed(S.player.statLevels[stat]);S.player.statLevels[stat]++;S.player.stats[stat]++;showToast(`${SN[stat]} → ${S.player.stats[stat]}!`)}}
  if(el)spawnP(e,gp,el);
  while(S.player.xp>=xpNeed(S.player.level)){S.player.xp-=xpNeed(S.player.level);S.player.level++;S.player.hp=Math.min(maxHP(),S.player.hp+Math.floor(maxHP()*.3));showToast(`Level Up! → ${S.player.level}`)}
  save();updateSB();
}

function removeXP(base,stat){const e=Math.round(base*xpMult());S.player.xp-=e;if(stat)S.player.statXP[stat]=Math.max(0,(S.player.statXP[stat]||0)-e);while(S.player.xp<0){if(S.player.level<=1){S.player.xp=0;break}S.player.level--;S.player.xp+=xpNeed(S.player.level)}save();updateSB()}

function damage(pts){S.player.hp=Math.max(0,S.player.hp-Math.round(pts*(1-S.player.stats.con/300)));save()}
