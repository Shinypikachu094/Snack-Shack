const ARCADE_KEY='playgroundArcadeProgress';
const STUDY_KEY='playgroundStudyData';
const ARCADE_THEMES={midnight:{name:'Midnight',cost:0,bg:'#111827',canvas:'#25295c',text:'#eef5ff',pack:'neon'},sunset:{name:'Sunset',cost:100,bg:'linear-gradient(135deg,#40204f,#f47b53)',canvas:'#71395f',text:'#fff6e8',pack:'sunset'},forest:{name:'Forest',cost:150,bg:'linear-gradient(135deg,#102d2b,#5a9e68)',canvas:'#245445',text:'#efffea',pack:'forest'},candy:{name:'Candy',cost:250,bg:'linear-gradient(135deg,#573b82,#f08ab5)',canvas:'#a34d83',text:'#fff4fc',pack:'candy'},ocean:{name:'Ocean',cost:350,bg:'linear-gradient(135deg,#062c4c,#19a7b8)',canvas:'#12617d',text:'#eaffff',pack:'ocean'},volcano:{name:'Volcano',cost:500,bg:'linear-gradient(135deg,#351016,#e35328)',canvas:'#682326',text:'#fff0df',pack:'volcano'},aurora:{name:'Aurora',cost:700,bg:'linear-gradient(135deg,#152b55,#7b4bb7,#37bca0)',canvas:'#28527a',text:'#f1ffff',pack:'aurora'},arcade:{name:'Pixel Arcade',cost:900,bg:'linear-gradient(135deg,#17134b,#e21d8f)',canvas:'#292061',text:'#fff4ff',pack:'pixel'}};
function arcadeGet(){try{return JSON.parse(localStorage.getItem(ARCADE_KEY))||{}}catch{return {}}}
function arcadeState(){const s=arcadeGet();if(typeof s.coins!=='number')s.coins=0;return {points:s.points||0,coins:s.coins,highScores:s.highScores||{},items:s.items||['midnight'],theme:s.theme||'midnight',fruitReward:s.fruitReward||0,arenaReward:s.arenaReward||0}}
function arcadeSave(s){localStorage.setItem(ARCADE_KEY,JSON.stringify(s));return s}
function arcadeAddCoins(amount,source){const s=arcadeState();s.coins+=Math.max(0,Math.floor(amount));if(source)s[`${source}Coins`]=(s[`${source}Coins`]||0)+Math.floor(amount);arcadeSave(s);return s}
function arcadeSpendCoins(amount,source){const s=arcadeState(),n=Math.max(0,Math.floor(amount));if(s.coins<n)return null;s.coins-=n;if(source)s[`${source}Spent`]=(s[`${source}Spent`]||0)+n;return arcadeSave(s)}
function arcadeAddPoints(amount,source){const s=arcadeState();s.points+=Math.max(0,Math.floor(amount));if(source)s[`${source}Earned`]=(s[`${source}Earned`]||0)+Math.floor(amount);arcadeSave(s);return s}
function arcadeRecordScore(game,score){const s=arcadeState();s.highScores[game]=Math.max(s.highScores[game]||0,Math.floor(score));arcadeSave(s);return s}
function arcadeBuyTheme(theme){const s=arcadeState(),t=ARCADE_THEMES[theme];if(!t||s.items.includes(theme))return s;if(s.points<t.cost)return null;s.points-=t.cost;s.items.push(theme);s.theme=theme;return arcadeSave(s)}
function arcadeUseTheme(theme){const s=arcadeState();if(s.items.includes(theme)){s.theme=theme;arcadeSave(s)}arcadeApplyTheme()}
function arcadeApplyTheme(){const s=arcadeState(),t=ARCADE_THEMES[s.theme]||ARCADE_THEMES.midnight;document.body.style.background=t.bg;document.body.style.color=t.text;document.documentElement.style.setProperty('--arcade-text',t.text);document.documentElement.style.setProperty('--arcade-canvas',t.canvas);return s}
function arcadeCanvasBackground(){const s=arcadeState(),t=ARCADE_THEMES[s.theme]||ARCADE_THEMES.midnight;return t.canvas}
function arcadeTexturePack(){const s=arcadeState(),t=ARCADE_THEMES[s.theme]||ARCADE_THEMES.midnight;return t.pack||'neon'}
document.addEventListener('DOMContentLoaded',arcadeApplyTheme);




function studyGet(){try{const s=JSON.parse(localStorage.getItem(STUDY_KEY))||{};return {title:s.title||'My Study Quest',notes:s.notes||'',tasks:Array.isArray(s.tasks)?s.tasks:[]}}catch{return {title:'My Study Quest',notes:'',tasks:[]}}}
function studySave(s){localStorage.setItem(STUDY_KEY,JSON.stringify(s));return s}
function studyCompleteTask(id){const s=studyGet(),task=s.tasks.find(t=>t.id===id);if(task&&!task.done){task.done=true;studySave(s);arcadeAddCoins(3,'activity')}return s}

