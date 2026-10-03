const ARCADE_KEY='playgroundArcadeProgress';
const STUDY_KEY='playgroundStudyData';
const ARCADE_THEMES={midnight:{name:'Midnight',cost:0,bg:'#111827',canvas:'#25295c',text:'#eef5ff',pack:'neon'},sunset:{name:'Sunset',cost:100,bg:'linear-gradient(135deg,#40204f,#f47b53)',canvas:'#71395f',text:'#fff6e8',pack:'sunset'},forest:{name:'Forest',cost:150,bg:'linear-gradient(135deg,#102d2b,#5a9e68)',canvas:'#245445',text:'#efffea',pack:'forest'},candy:{name:'Candy',cost:250,bg:'linear-gradient(135deg,#573b82,#f08ab5)',canvas:'#a34d83',text:'#fff4fc',pack:'candy'},ocean:{name:'Ocean',cost:350,bg:'linear-gradient(135deg,#062c4c,#19a7b8)',canvas:'#12617d',text:'#eaffff',pack:'ocean'},volcano:{name:'Volcano',cost:500,bg:'linear-gradient(135deg,#351016,#e35328)',canvas:'#682326',text:'#fff0df',pack:'volcano'},aurora:{name:'Aurora',cost:700,bg:'linear-gradient(135deg,#152b55,#7b4bb7,#37bca0)',canvas:'#28527a',text:'#f1ffff',pack:'aurora'},arcade:{name:'Pixel Arcade',cost:900,bg:'linear-gradient(135deg,#17134b,#e21d8f)',canvas:'#292061',text:'#fff4ff',pack:'pixel'},paper:{name:'Paper Pop',cost:1200,bg:'linear-gradient(135deg,#fff4c2,#ffd4e8)',canvas:'#fff0bd',text:'#42244f',pack:'paper'},lime:{name:'Lime Glow',cost:1500,bg:'linear-gradient(135deg,#153c2c,#d3ee58)',canvas:'#376b45',text:'#f4ffe0',pack:'lime'},galaxy:{name:'Galaxy',cost:1800,bg:'linear-gradient(135deg,#080b32,#40228d,#e638a1)',canvas:'#21145c',text:'#f9edff',pack:'galaxy'}};
const TANK_COLORS={cyan:{name:'Cyan',cost:0,color:'#6ce5ff'},ruby:{name:'Ruby',cost:200,color:'#ff657b'},emerald:{name:'Emerald',cost:350,color:'#65e69b'},gold:{name:'Gold',cost:550,color:'#ffd85e'},violet:{name:'Violet',cost:800,color:'#c084fc'},white:{name:'Pearl',cost:1100,color:'#f4fbff'}};
function arcadeGet(){try{return JSON.parse(localStorage.getItem(ARCADE_KEY))||{}}catch{return {}}}
function arcadeState(){const s=arcadeGet();if(typeof s.coins!=='number')s.coins=0;return {points:s.points||0,coins:s.coins,highScores:s.highScores||{},items:s.items||['midnight'],theme:s.theme||'midnight',tankColors:s.tankColors||['cyan'],tankColor:s.tankColor||'cyan',fruitReward:s.fruitReward||0,arenaReward:s.arenaReward||0,streak:s.streak||0,lastStreakClaim:s.lastStreakClaim||''}}
function arcadeSave(s){localStorage.setItem(ARCADE_KEY,JSON.stringify(s));return s}
function arcadeAddCoins(amount,source){const s=arcadeState();s.coins+=Math.max(0,Math.floor(amount));if(source)s[`${source}Coins`]=(s[`${source}Coins`]||0)+Math.floor(amount);arcadeSave(s);return s}
function arcadeSpendCoins(amount,source){const s=arcadeState(),n=Math.max(0,Math.floor(amount));if(s.coins<n)return null;s.coins-=n;if(source)s[`${source}Spent`]=(s[`${source}Spent`]||0)+n;return arcadeSave(s)}
function arcadeAddPoints(amount,source){const s=arcadeState();s.points+=Math.max(0,Math.floor(amount));if(source)s[`${source}Earned`]=(s[`${source}Earned`]||0)+Math.floor(amount);arcadeSave(s);return s}
function arcadeRecordScore(game,score){const s=arcadeState();s.highScores[game]=Math.max(s.highScores[game]||0,Math.floor(score));arcadeSave(s);return s}
function arcadeBuyTheme(theme){const s=arcadeState(),t=ARCADE_THEMES[theme];if(!t||s.items.includes(theme))return s;if(s.points<t.cost)return null;s.points-=t.cost;s.items.push(theme);s.theme=theme;return arcadeSave(s)}
function arcadeUseTheme(theme){const s=arcadeState();if(s.items.includes(theme)){s.theme=theme;arcadeSave(s)}arcadeApplyTheme()}
function arcadeBuyTankColor(color){const s=arcadeState(),t=TANK_COLORS[color];if(!t||s.tankColors.includes(color))return s;if(s.points<t.cost)return null;s.points-=t.cost;s.tankColors.push(color);s.tankColor=color;return arcadeSave(s)}
function arcadeUseTankColor(color){const s=arcadeState();if(s.tankColors.includes(color)){s.tankColor=color;arcadeSave(s)}return s}
function arcadeTankColor(){const s=arcadeState(),t=TANK_COLORS[s.tankColor]||TANK_COLORS.cyan;return t.color}
function arcadeApplyTheme(){const s=arcadeState(),t=ARCADE_THEMES[s.theme]||ARCADE_THEMES.midnight;document.body.style.background=t.bg;document.body.style.color=t.text;document.documentElement.style.setProperty('--arcade-text',t.text);document.documentElement.style.setProperty('--arcade-canvas',t.canvas);return s}
function arcadeCanvasBackground(){const s=arcadeState(),t=ARCADE_THEMES[s.theme]||ARCADE_THEMES.midnight;return t.canvas}
function arcadeTexturePack(){const s=arcadeState(),t=ARCADE_THEMES[s.theme]||ARCADE_THEMES.midnight;return t.pack||'neon'}
function arcadeSessionSave(game,data){try{localStorage.setItem(`${ARCADE_KEY}:session:${game}`,JSON.stringify(data))}catch{}return data}
function arcadeSessionLoad(game){try{return JSON.parse(localStorage.getItem(`${ARCADE_KEY}:session:${game}`)||'null')}catch{return null}}
function arcadeSessionClear(game){localStorage.removeItem(`${ARCADE_KEY}:session:${game}`)}
function arcadeDayNumber(date=new Date()){return Math.floor(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/86400000)}
function arcadeToday(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function arcadeStreakReward(streak){return 400+Math.max(0,streak-1)*300}
function arcadeStreakStatus(){const s=arcadeState(),today=arcadeToday(),last=s.lastStreakClaim,days=last?arcadeDayNumber(new Date())-arcadeDayNumber(new Date(last+'T00:00:00')):0;return {streak:days>1?0:s.streak,claimed:last===today,reward:arcadeStreakReward(days>1?1:Math.max(1,s.streak+1)),nextReward:arcadeStreakReward(days>1?1:Math.max(1,s.streak+1))}}
function arcadeClaimStreak(){const s=arcadeState(),today=arcadeToday();if(s.lastStreakClaim===today)return {claimed:false,reward:0,streak:s.streak,points:s.points};const previous=s.lastStreakClaim?arcadeDayNumber(new Date(s.lastStreakClaim+'T00:00:00')):0;const days=previous?arcadeDayNumber(new Date())-previous:0;s.streak=days===1?s.streak+1:1;const reward=arcadeStreakReward(s.streak);s.points+=reward;s.lastStreakClaim=today;arcadeSave(s);return {claimed:true,reward,streak:s.streak,points:s.points}}
document.addEventListener('DOMContentLoaded',arcadeApplyTheme);




function studyGet(){try{const s=JSON.parse(localStorage.getItem(STUDY_KEY))||{};return {title:s.title||'My Study Quest',notes:s.notes||'',tasks:Array.isArray(s.tasks)?s.tasks:[]}}catch{return {title:'My Study Quest',notes:'',tasks:[]}}}
function studySave(s){localStorage.setItem(STUDY_KEY,JSON.stringify(s));return s}
function studyCompleteTask(id){const s=studyGet(),task=s.tasks.find(t=>t.id===id);if(task&&!task.done){task.done=true;studySave(s);arcadeAddCoins(3,'activity')}return s}

