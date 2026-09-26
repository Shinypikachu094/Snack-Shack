const ARCADE_KEY='playgroundArcadeProgress';
const ARCADE_THEMES={midnight:{name:'Midnight',cost:0,bg:'#111827',text:'#eef5ff'},sunset:{name:'Sunset',cost:100,bg:'linear-gradient(135deg,#40204f,#f47b53)',text:'#fff6e8'},forest:{name:'Forest',cost:150,bg:'linear-gradient(135deg,#102d2b,#5a9e68)',text:'#efffea'},candy:{name:'Candy',cost:250,bg:'linear-gradient(135deg,#573b82,#f08ab5)',text:'#fff4fc'}};
function arcadeGet(){try{return JSON.parse(localStorage.getItem(ARCADE_KEY))||{}}catch{return {}}}
function arcadeState(){const s=arcadeGet();return {points:s.points||0,highScores:s.highScores||{},items:s.items||['midnight'],theme:s.theme||'midnight',fruitReward:s.fruitReward||0,arenaReward:s.arenaReward||0}}
function arcadeSave(s){localStorage.setItem(ARCADE_KEY,JSON.stringify(s));return s}
function arcadeAddPoints(amount,source){const s=arcadeState();s.points+=Math.max(0,Math.floor(amount));if(source)s[`${source}Earned`]=(s[`${source}Earned`]||0)+Math.floor(amount);arcadeSave(s);return s}
function arcadeRecordScore(game,score){const s=arcadeState();s.highScores[game]=Math.max(s.highScores[game]||0,Math.floor(score));arcadeSave(s);return s}
function arcadeBuyTheme(theme){const s=arcadeState(),t=ARCADE_THEMES[theme];if(!t||s.items.includes(theme))return s;if(s.points<t.cost)return null;s.points-=t.cost;s.items.push(theme);s.theme=theme;return arcadeSave(s)}
function arcadeUseTheme(theme){const s=arcadeState();if(s.items.includes(theme)){s.theme=theme;arcadeSave(s)}arcadeApplyTheme()}
function arcadeApplyTheme(){const s=arcadeState(),t=ARCADE_THEMES[s.theme]||ARCADE_THEMES.midnight;document.body.style.background=t.bg;document.body.style.color=t.text;document.documentElement.style.setProperty('--arcade-text',t.text);return s}
document.addEventListener('DOMContentLoaded',arcadeApplyTheme);
