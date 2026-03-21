/* ═══ KARMA — Configuration ═══ */

const DEF_HABITS=[
  // ── DAILIES (scheduled routine) ──
  {id:'weigh',name:'Log weight',cat:'grooming',icon:'⚖️',stat:'per',base:8,reps:0,streak:0,type:'daily',schedule:{time:'05:00'}},
  {id:'brush_am',name:'Brush + floss',cat:'grooming',icon:'🦷',stat:'per',base:5,reps:0,streak:0,type:'daily',schedule:{time:'05:05'}},
  {id:'minoxidil_am',name:'Minoxidil AM',cat:'grooming',icon:'💊',stat:'per',base:6,reps:0,streak:0,type:'daily',schedule:{time:'05:12'}},
  {id:'finasteride',name:'Finasteride',cat:'grooming',icon:'🩺',stat:'per',base:6,reps:0,streak:0,type:'daily',schedule:{time:'05:15'}},
  {id:'skincare_am',name:'AM skincare',cat:'grooming',icon:'🪞',stat:'per',base:7,reps:0,streak:0,type:'daily',schedule:{time:'05:18'}},
  {id:'hanuman',name:'Hanuman Chalisa',cat:'mental',icon:'🪔',stat:'int',base:8,reps:0,streak:0,type:'daily',schedule:{time:'07:30'}},
  {id:'breakfast',name:'Breakfast',cat:'nutrition',icon:'🍳',stat:'con',base:10,reps:0,streak:0,type:'daily',schedule:{time:'08:10'}},
  {id:'stairs',name:'Climb stairs',cat:'physical',icon:'🪜',stat:'str',base:6,reps:0,streak:0,type:'daily',schedule:{time:'09:30'}},
  {id:'greentea',name:'Green tea',cat:'nutrition',icon:'🍵',stat:'con',base:5,reps:0,streak:0,type:'daily',schedule:{time:'09:45'}},
  {id:'steps',name:'10K steps',cat:'physical',icon:'👟',stat:'str',base:10,reps:0,streak:0,type:'daily',schedule:{time:'All day'}},
  {id:'lunch',name:'Planned lunch',cat:'nutrition',icon:'🥗',stat:'con',base:10,reps:0,streak:0,type:'daily',schedule:{time:'13:00'}},
  {id:'snack',name:'Office snack',cat:'nutrition',icon:'🫙',stat:'con',base:8,reps:0,streak:0,type:'daily',schedule:{time:'16:30'}},
  {id:'dinner',name:'Dinner',cat:'nutrition',icon:'🍽️',stat:'con',base:10,reps:0,streak:0,type:'daily',schedule:{time:'20:00'}},
  {id:'journal',name:'Journal',cat:'mental',icon:'📓',stat:'int',base:10,reps:0,streak:0,type:'daily',schedule:{time:'21:00'}},
  {id:'biz',name:'Biz planning',cat:'mental',icon:'📈',stat:'int',base:12,reps:0,streak:0,type:'daily',schedule:{time:'21:20'}},
  {id:'meditation',name:'Meditation',cat:'mental',icon:'🧘',stat:'int',base:10,reps:0,streak:0,type:'daily',schedule:{time:'21:50'}},
  {id:'minoxidil_pm',name:'Minoxidil PM',cat:'grooming',icon:'💊',stat:'per',base:6,reps:0,streak:0,type:'daily',schedule:{time:'22:05'}},
  {id:'skincare_pm',name:'PM skincare',cat:'grooming',icon:'🌙',stat:'per',base:7,reps:0,streak:0,type:'daily',schedule:{time:'22:05'}},
  {id:'magnesium',name:'Magnesium',cat:'recovery',icon:'🧪',stat:'con',base:8,reps:0,streak:0,type:'daily',schedule:{time:'22:20'}},
  {id:'brush_pm',name:'Brush teeth',cat:'grooming',icon:'🦷',stat:'per',base:5,reps:0,streak:0,type:'daily',schedule:{time:'22:25'}},
  {id:'sleep_h',name:'Sleep 10:30PM',cat:'recovery',icon:'😴',stat:'con',base:12,reps:0,streak:0,type:'daily',schedule:{time:'22:30'}},
  // ── BOOSTERS (healthy but optional) ──
  {id:'gym',name:'Gym session',cat:'physical',icon:'💪',stat:'str',base:12,reps:0,streak:0,type:'booster',auto:'workout'},
  {id:'protein',name:'Protein target',cat:'nutrition',icon:'🥩',stat:'con',base:10,reps:0,streak:0,type:'booster',auto:'meals'},
  {id:'water_h',name:'3L water',cat:'nutrition',icon:'💧',stat:'con',base:8,reps:0,streak:0,type:'booster',auto:'daily'},
  {id:'stretch',name:'Stretching',cat:'physical',icon:'🤸',stat:'str',base:8,reps:0,streak:0,type:'booster'},
  // ── NEGATIVE (slip tracking) ──
  {id:'junk',name:'Ate junk food',cat:'nutrition',icon:'🍔',stat:'con',base:0,reps:0,streak:0,type:'negative'},
  {id:'late',name:'Slept late',cat:'recovery',icon:'🌑',stat:'con',base:0,reps:0,streak:0,type:'negative'},
  {id:'skip_meal',name:'Skipped meal',cat:'nutrition',icon:'⛔',stat:'con',base:0,reps:0,streak:0,type:'negative'},
];

const DEF_PROGRAM=[
  {day:1,name:'Push',muscles:'Chest · Shoulders · Triceps',exercises:[
    {id:'bench',name:'Bench Press',muscle:'Chest',sets:[{reps:10,weight:60},{reps:8,weight:65},{reps:6,weight:70},{reps:6,weight:70}]},
    {id:'incline_db',name:'Incline DB Press',muscle:'Upper Chest',sets:[{reps:10,weight:22},{reps:10,weight:22},{reps:8,weight:24}]},
    {id:'ohp',name:'Overhead Press',muscle:'Shoulders',sets:[{reps:10,weight:30},{reps:8,weight:35},{reps:6,weight:40}]},
    {id:'lat_raise',name:'Lateral Raises',muscle:'Side Delts',sets:[{reps:15,weight:8},{reps:12,weight:10},{reps:12,weight:10}]},
    {id:'tricep_push',name:'Tricep Pushdowns',muscle:'Triceps',sets:[{reps:12,weight:25},{reps:10,weight:30},{reps:10,weight:30}]},
    {id:'overhead_ext',name:'Overhead Extension',muscle:'Triceps',sets:[{reps:12,weight:15},{reps:10,weight:17}]},
  ]},
  {day:2,name:'Pull',muscles:'Back · Biceps · Rear Delts',exercises:[
    {id:'deadlift',name:'Deadlift',muscle:'Back',sets:[{reps:6,weight:80},{reps:5,weight:90},{reps:5,weight:95},{reps:3,weight:100}]},
    {id:'lat_pull',name:'Lat Pulldown',muscle:'Lats',sets:[{reps:10,weight:50},{reps:8,weight:55},{reps:8,weight:55}]},
    {id:'cable_row',name:'Cable Row',muscle:'Mid Back',sets:[{reps:10,weight:45},{reps:10,weight:50},{reps:8,weight:55}]},
    {id:'face_pull',name:'Face Pulls',muscle:'Rear Delts',sets:[{reps:15,weight:15},{reps:15,weight:15},{reps:12,weight:17}]},
    {id:'barbell_curl',name:'Barbell Curl',muscle:'Biceps',sets:[{reps:10,weight:25},{reps:8,weight:30},{reps:8,weight:30}]},
    {id:'hammer_curl',name:'Hammer Curls',muscle:'Biceps',sets:[{reps:12,weight:12},{reps:10,weight:14}]},
  ]},
  {day:3,name:'Legs',muscles:'Quads · Hams · Glutes · Calves',exercises:[
    {id:'squat',name:'Squats',muscle:'Quads',sets:[{reps:8,weight:70},{reps:6,weight:80},{reps:6,weight:85},{reps:4,weight:90}]},
    {id:'rdl',name:'Romanian Deadlift',muscle:'Hamstrings',sets:[{reps:10,weight:50},{reps:8,weight:60},{reps:8,weight:60}]},
    {id:'leg_press',name:'Leg Press',muscle:'Quads',sets:[{reps:12,weight:120},{reps:10,weight:140},{reps:10,weight:140}]},
    {id:'leg_curl',name:'Leg Curls',muscle:'Hamstrings',sets:[{reps:12,weight:30},{reps:10,weight:35},{reps:10,weight:35}]},
    {id:'calf_raise',name:'Calf Raises',muscle:'Calves',sets:[{reps:15,weight:40},{reps:15,weight:40},{reps:12,weight:50}]},
  ]},
  {day:4,name:'Upper',muscles:'Chest · Back · Arms',exercises:[
    {id:'db_press',name:'DB Bench Press',muscle:'Chest',sets:[{reps:10,weight:24},{reps:8,weight:28},{reps:8,weight:28}]},
    {id:'pullups',name:'Pull-ups',muscle:'Back',sets:[{reps:8,weight:0},{reps:6,weight:0},{reps:6,weight:0}]},
    {id:'db_shoulder',name:'DB Shoulder Press',muscle:'Shoulders',sets:[{reps:10,weight:16},{reps:8,weight:18},{reps:8,weight:18}]},
    {id:'cable_fly',name:'Cable Fly',muscle:'Chest',sets:[{reps:12,weight:12},{reps:12,weight:14}]},
    {id:'ez_curl',name:'EZ Bar Curl',muscle:'Biceps',sets:[{reps:10,weight:20},{reps:10,weight:22}]},
    {id:'skull_crush',name:'Skull Crushers',muscle:'Triceps',sets:[{reps:10,weight:20},{reps:10,weight:22}]},
  ]},
  {day:5,name:'Lower + Core',muscles:'Legs · Abs · Mobility',exercises:[
    {id:'front_squat',name:'Front Squats',muscle:'Quads',sets:[{reps:8,weight:50},{reps:6,weight:60},{reps:6,weight:60}]},
    {id:'hip_thrust',name:'Hip Thrusts',muscle:'Glutes',sets:[{reps:12,weight:60},{reps:10,weight:70},{reps:10,weight:70}]},
    {id:'walking_lunge',name:'Walking Lunges',muscle:'Quads',sets:[{reps:12,weight:16},{reps:12,weight:16}]},
    {id:'leg_ext',name:'Leg Extensions',muscle:'Quads',sets:[{reps:12,weight:35},{reps:12,weight:40}]},
    {id:'plank',name:'Plank',muscle:'Core',sets:[{reps:60,weight:0},{reps:60,weight:0},{reps:45,weight:0}]},
    {id:'cable_crunch',name:'Cable Crunches',muscle:'Abs',sets:[{reps:15,weight:25},{reps:15,weight:30}]},
  ]},
  {day:6,name:'Rest',muscles:'Recovery · Stretching',rest:true,exercises:[]},
  {day:7,name:'Rest',muscles:'Recovery · Active Rest',rest:true,exercises:[]},
];

const MEALS=[
  {id:'eggs_roti',title:'Eggs + Roti',sub:'Breakfast',kcal:530,type:'nv',p:52,c:48,f:14,ings:[{n:'Whole eggs',q:'3'},{n:'Egg whites',q:'4'},{n:'Multigrain roti',q:'×2'},{n:'Whey shake',q:'1 scoop'}],steps:['Scramble eggs+whites.','Warm roti.','Mix whey in 250ml water.']},
  {id:'paneer_bhurji',title:'Paneer Bhurji',sub:'Veg breakfast',kcal:560,type:'veg',p:50,c:46,f:16,ings:[{n:'Low-fat paneer',q:'150g'},{n:'Multigrain roti',q:'×2'},{n:'Whey shake',q:'1 scoop'}],steps:['Crumble paneer.','Sauté with onion+tomato.','Serve with roti+whey.']},
  {id:'dal_chicken',title:'Dal + Chicken',sub:'Power lunch',kcal:620,type:'nv',p:58,c:62,f:11,ings:[{n:'Chicken breast',q:'200g'},{n:'Moong dal',q:'1 cup'},{n:'Roti',q:'×2'}],steps:['Grill chicken.','Pressure cook dal.','Serve with roti+salad.']},
  {id:'rajma_roti',title:'Rajma + Roti',sub:'Veg lunch',kcal:520,type:'veg',p:42,c:70,f:10,ings:[{n:'Rajma',q:'1.5 cups'},{n:'Roti',q:'×2'},{n:'Curd',q:'100g'}],steps:['Cook rajma with masala.','Simmer 10 min.','Serve with roti+curd.']},
  {id:'chana_snack',title:'Chana + Curd',sub:'Snack',kcal:250,type:'veg',p:22,c:28,f:5,ings:[{n:'Roasted chana',q:'50g'},{n:'Dahi',q:'150g'}],steps:['Pre-pack chana.','Add black salt.']},
  {id:'chicken_tikka',title:'Chicken Tikka',sub:'Dinner',kcal:540,type:'nv',p:68,c:30,f:14,ings:[{n:'Chicken tikka',q:'250g'},{n:'Roti',q:'×1–2'},{n:'Raita',q:'large'}],steps:['Get 250g+ portion.','Pair with roti.','Eat raita first.']},
  {id:'soya_dinner',title:'Soya Chunks',sub:'Veg dinner',kcal:490,type:'veg',p:65,c:35,f:12,ings:[{n:'Soya chunks',q:'100g'},{n:'Roti',q:'×2'},{n:'Whey',q:'1 scoop'}],steps:['Soak 15 min.','Cook with masala.','100g = 52g protein!']},
  {id:'greek_yogurt',title:'Greek Yogurt Bowl',sub:'Snack',kcal:240,type:'veg',p:16,c:22,f:10,ings:[{n:'Greek yogurt',q:'150g'},{n:'Almonds',q:'15'},{n:'Walnuts',q:'5'}],steps:['Mix yogurt+cinnamon.','Add nuts.']},
  {id:'moong_chilla',title:'Moong Chilla',sub:'Light meal',kcal:320,type:'veg',p:28,c:35,f:8,ings:[{n:'Moong dal',q:'½ cup'},{n:'Paneer',q:'50g'}],steps:['Grind moong to batter.','Pour on tawa, add paneer.']},
  {id:'grilled_fish',title:'Grilled Fish',sub:'Omega-3 dinner',kcal:420,type:'nv',p:52,c:12,f:16,ings:[{n:'Surmai',q:'200g'},{n:'Broccoli',q:'2 cups'}],steps:['Marinate in lemon.','Grill 4 min/side.']},
  {id:'oats_protein',title:'Protein Oats',sub:'Breakfast',kcal:380,type:'veg',p:35,c:42,f:10,ings:[{n:'Oats',q:'50g'},{n:'Whey',q:'1 scoop'},{n:'Banana',q:'1'}],steps:['Cook oats.','Mix in whey.','Top with banana.']},
  {id:'egg_wrap',title:'Egg Wrap',sub:'Quick lunch',kcal:450,type:'nv',p:42,c:38,f:15,ings:[{n:'Eggs',q:'4'},{n:'Whole wheat wrap',q:'2'},{n:'Veggies',q:'1 cup'}],steps:['Scramble eggs.','Wrap with veggies.']},
];

const QUOTES=[{t:'The pain you feel today is the strength you feel tomorrow.',a:'Schwarzenegger'},{t:'Discipline is choosing between what you want now and what you want most.',a:'Lincoln'},{t:'You don\'t have to be extreme, just consistent.',a:'Unknown'},{t:'The body achieves what the mind believes.',a:'Napoleon Hill'},{t:'Success isn\'t always about greatness. It\'s about consistency.',a:'The Rock'},{t:'What you do every day matters more than what you do once in a while.',a:'Gretchen Rubin'},{t:'We are what we repeatedly do. Excellence is not an act but a habit.',a:'Aristotle'},{t:'Fall seven times, stand up eight.',a:'Japanese Proverb'},{t:'Strength does not come from the body. It comes from the will.',a:'Gandhi'},{t:'A year from now you\'ll wish you had started today.',a:'Karen Lamb'},{t:'Take care of your body. It\'s the only place you have to live.',a:'Jim Rohn'},{t:'No citizen has a right to be an amateur in the matter of physical training.',a:'Socrates'}];

const HORO=['Focus your energy inward — discipline pays compound interest.','A breakthrough is coming. Keep grinding.','Today favors physical effort. Push past limits.','Mental clarity peaks. Use it for planning.','Your consistency is noticed. Don\'t stop.','Small choices today create the person you\'ll be in 6 months.','Rest is not weakness — recovery is growth.','Financial discipline aligns today.','Your body is speaking. Listen, then push past.','Persistence beats talent when talent doesn\'t persist.','Today is for building. Every rep counts twice.','The gap between who you are and who you want shrinks today.'];

const ZODIAC=[{s:'Capricorn',i:'♑',sm:12,sd:22,em:1,ed:19},{s:'Aquarius',i:'♒',sm:1,sd:20,em:2,ed:18},{s:'Pisces',i:'♓',sm:2,sd:19,em:3,ed:20},{s:'Aries',i:'♈',sm:3,sd:21,em:4,ed:19},{s:'Taurus',i:'♉',sm:4,sd:20,em:5,ed:20},{s:'Gemini',i:'♊',sm:5,sd:21,em:6,ed:20},{s:'Cancer',i:'♋',sm:6,sd:21,em:7,ed:22},{s:'Leo',i:'♌',sm:7,sd:23,em:8,ed:22},{s:'Virgo',i:'♍',sm:8,sd:23,em:9,ed:22},{s:'Libra',i:'♎',sm:9,sd:23,em:10,ed:22},{s:'Scorpio',i:'♏',sm:10,sd:23,em:11,ed:21},{s:'Sagittarius',i:'♐',sm:11,sd:22,em:12,ed:21}];

const SC={str:'var(--str)',con:'var(--con)',int:'var(--int)',per:'var(--per)'};

const SN={str:'Strength',con:'Constitution',int:'Intelligence',per:'Perception'};

const MUSCLE_ICONS={Push:'🫁',Pull:'🦾',Legs:'🦵','Upper':'💪','Lower + Core':'🦿',Rest:'🧘'};

const CAT_COLORS={Food:'#34b898',Transport:'#6e61d6',Shopping:'#d6a643',Health:'#e2685a',Entertainment:'#d674a0',Bills:'#5b9cf0',Other:'#7c7a8a'};

const AUTO_HABITS={gym:'Log a workout in the Workout section',protein:'Hit 195g protein in Nutrition tracker',water_h:'Track 3L water in Today\'s water tracker'};

const AUTO_REDIRECT={gym:'workout',protein:'meals',water_h:'daily'};

const getTitle=lv=>lv<5?'Initiate':lv<10?'Apprentice':lv<20?'Warrior':lv<35?'Champion':lv<50?'Veteran':lv<70?'Master':lv<90?'Legend':'Apex';

const goldMult=()=>1+(S.player.stats.per/100);

const xpMult=()=>1+(S.player.stats.int/40);

const xpNeed=lv=>Math.round((.25*lv*lv+10*lv+139.75)/10)*10;

const maxHP=()=>50+S.player.stats.con*2;

const statXpNeed=lv=>30+lv*20;

function getZodiac(dob){const d=new Date(dob),m=d.getMonth()+1,day=d.getDate();for(const z of ZODIAC)if((m===z.sm&&day>=z.sd)||(m===z.em&&day<=z.ed))return z;return ZODIAC[0]}

function getHoro(s){return HORO[(doy()+(s||'A').charCodeAt(0))%HORO.length]}

function getQuote(){return QUOTES[doy()%QUOTES.length]}

function doy(){return Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0))/864e5)}
