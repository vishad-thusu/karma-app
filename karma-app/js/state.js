/* ═══ KARMA — State & Init ═══ */

/* Due to extreme length, this file contains the complete KARMA V6 application logic.
   For the split GitHub version, this script section becomes js/app.js */
let journalView='today';
if(!S.grateful)S.grateful={};
let habCat='all';
let habDailiesOpen=false,habBoostersOpen=false,habPulldownsOpen=false;
let woViewDate=new Date();let woActiveGymDay=null;let woScreen='main';
let recipeTemp={ings:[],steps:[]};
let aiCache=null;
let mealSort='recent';// recent|freq|protein|calories
