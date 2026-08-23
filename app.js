import { QUESTIONS, ARRIVAL_OPTIONS } from './questions.js';
import { loadState, saveState, newId, exportState } from './storage.js';

const app = document.querySelector('#app');
const state = loadState();

const persist = () => saveState(state);
const getQuestion = () => QUESTIONS.find(q => q.id === state.currentQuestion) || QUESTIONS[0];
const entryById = id => state.entries.find(entry => entry.id === id);
const starRecords = () => state.stars.map(star => ({ ...star, entry:entryById(star.entryId) })).filter(star => star.entry);

function navigate(screen){
  state.screen = screen;
  state.selectedChoice = null;
  persist();
  render();
  window.scrollTo({ top:0, behavior:'smooth' });
}

function questionScore(question, now){
  const affinity = state.affinity[question.intent] || 0;
  const lastUsed = state.lastUsed[question.id] || 0;
  const daysSince = lastUsed ? (now - lastUsed) / 86400000 : 30;
  return affinity + Math.min(daysSince, 7) * .08 - question.depth * .03;
}

function chooseQuestion(arrival, forcedIntent = null){
  let pool = QUESTIONS.filter(q => q.states.includes(arrival));
  if (forcedIntent) pool = pool.filter(q => q.intent === forcedIntent);
  const now = Date.now();
  pool.sort((a,b) => questionScore(b, now) - questionScore(a, now));
  const top = pool.slice(0, Math.min(3, pool.length));
  const question = top[Math.floor(Math.random() * top.length)] || QUESTIONS[0];
  state.arrival = arrival;
  state.currentQuestion = question.id;
  state.lastUsed[question.id] = now;
  navigate('question');
}

function anotherQuestion(){
  state.lastUsed[getQuestion().id] = Date.now();
  chooseQuestion(state.arrival || 'open');
}

function topbar(label='Life OS'){
  return `<div class="topbar"><div class="brand"><span class="brand-star">✦</span><span>${label}</span></div><button class="icon-btn" onclick="window.lifeOS.navigate('home')" aria-label="Go home">⌂</button></div>`;
}

function nav(active){
  const items = [['home','⌂','Hearth'],['sky','✦','Sky'],['archive','⌘','Archive']];
  return `<nav class="bottom-nav" aria-label="Primary navigation">${items.map(([screen,icon,label]) => `<button class="nav-btn ${active===screen?'active':''}" onclick="window.lifeOS.navigate('${screen}')"><span class="nav-icon">${icon}</span>${label}</button>`).join('')}</nav>`;
}

function installTip(){
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const isiOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (standalone || state.installTipDismissed || !isiOS) return '';
  return `<div class="install-card"><span>Add Life OS to your Home Screen</span><button aria-label="Dismiss" onclick="window.lifeOS.dismissInstallTip()">×</button></div>`;
}

function home(){
  return `<div class="app-shell"><section class="phone">${topbar()}${installTip()}<div class="hero"><div class="kicker">The Hearth</div><h1>Welcome Home</h1><div class="hearth" aria-hidden="true"><span></span></div><p class="lede">How are you arriving?</p></div><div class="actions"><button class="btn btn-primary" onclick="window.lifeOS.navigate('arrival')">Check in</button><button class="btn btn-secondary" onclick="window.lifeOS.quickWrite()">Write</button></div>${nav('home')}</section></div>`;
}

function arrival(){
  return `<div class="app-shell"><section class="phone">${topbar('Arrive')}<h2>How are you arriving?</h2><div class="card-list">${ARRIVAL_OPTIONS.map(([value,emoji,label]) => `<button class="arrival-card" onclick="window.lifeOS.chooseQuestion('${value}')"><strong>${emoji}&nbsp;&nbsp;${label}</strong></button>`).join('')}</div><div class="arrival-shortcuts"><button onclick="window.lifeOS.chooseQuestion('heavy','ground')">🫂 Comfort</button><button onclick="window.lifeOS.chooseQuestion('heavy','grief')">🕯 Remember</button></div>${nav('')}</section></div>`;
}

function questionInput(question){
  if (question.type === 'choice') {
    return `<div class="card-list choice-list">${question.choices.map(choice => `<button class="arrival-card choice ${state.selectedChoice===choice?'selected':''}" aria-pressed="${state.selectedChoice===choice}" onclick='window.lifeOS.selectChoice(${JSON.stringify(choice)})'><strong>${choice}</strong></button>`).join('')}</div>`;
  }
  return `<textarea id="answer" class="textarea" placeholder="Write here…"></textarea>`;
}

function question(){
  const q = getQuestion();
  return `<div class="app-shell"><section class="phone">${topbar(q.intent==='grief'?'Remembrance':'Reflect')}<div class="question-tag">${q.pillar}</div><div class="question">${q.text}</div>${questionInput(q)}<div class="feedback"><button class="pill" onclick="window.lifeOS.feedback('${q.intent}',1,this)">♡ Helped</button><button class="pill" onclick="window.lifeOS.feedback('${q.intent}',2,this)">🌱 More</button><button class="pill" onclick="window.lifeOS.feedback('${q.intent}',-1,this)">🌙 Not now</button></div><div class="actions"><button class="btn btn-primary" onclick="window.lifeOS.saveEntry(false)">Save</button><button class="btn btn-secondary" onclick="window.lifeOS.saveEntry(true)">✦ Save as star</button>${q.intent==='grief'?`<button class="btn btn-secondary" onclick="window.lifeOS.lightLantern()">🕯 Light a lantern</button>`:''}<button class="btn btn-quiet" onclick="window.lifeOS.navigate('home')">Done</button></div>${nav('')}</section></div>`;
}

function answerValue(){
  const q = getQuestion();
  return q.type === 'choice' ? (state.selectedChoice || '') : (document.querySelector('#answer')?.value || '').trim();
}

function createEntry(text, question=getQuestion()){
  return { id:newId(), at:new Date().toISOString(), text, question:question.text, pillar:question.pillar, intent:question.intent, arrival:state.arrival || 'unknown' };
}

function starPosition(index){
  const angle = (index * 2.3999632297) % (Math.PI * 2);
  const ring = 95 + Math.sqrt(index + 1) * 75;
  return { x:590 + Math.cos(angle)*ring + (Math.random()*55-27), y:470 + Math.sin(angle)*ring + (Math.random()*55-27) };
}

function saveEntry(asStar){
  const text = answerValue();
  if (!text) return;
  const entry = createEntry(text);
  state.entries.push(entry);
  if (asStar) {
    const pos = starPosition(state.stars.length);
    state.stars.push({ entryId:entry.id, x:pos.x, y:pos.y, importance:text.length > 180 ? 2 : 1 });
  }
  persist();
  navigate(asStar ? 'sky' : 'archive');
}

function lightLantern(){
  const q = getQuestion();
  const entry = createEntry('A lantern was lit in remembrance.', q);
  const pos = starPosition(state.stars.length);
  state.entries.push(entry);
  state.stars.push({ entryId:entry.id, x:pos.x, y:pos.y, importance:2 });
  persist();
  navigate('sky');
}

function groupedStars(){
  const groups = {};
  for (const star of starRecords()) (groups[star.entry.intent] ||= []).push(star);
  return groups;
}

function lineBetween(a,b){
  const dx=b.x-a.x, dy=b.y-a.y, len=Math.hypot(dx,dy), angle=Math.atan2(dy,dx)*180/Math.PI;
  return `<div class="line" style="left:${a.x}px;top:${a.y}px;width:${len}px;transform:rotate(${angle}deg)"></div>`;
}

function buildLines(){
  let html='';
  for (const group of Object.values(groupedStars())) {
    if (group.length < 2) continue;
    const sorted = group.slice().sort((a,b) => new Date(a.entry.at)-new Date(b.entry.at));
    for (let i=1;i<sorted.length;i++) html += lineBetween(sorted[i-1], sorted[i]);
  }
  return html;
}

function constellationLabels(){
  const names={identity:'Self',notice:'Presence',ease:'Ease',curiosity:'Wonder',energy:'Energy',connection:'Connection',ground:'Coming Back',grief:'Love That Continues',growth:'Becoming',play:'Play'};
  return Object.entries(groupedStars()).filter(([,group])=>group.length>=2).map(([intent,group])=>{const x=group.reduce((n,s)=>n+s.x,0)/group.length,y=group.reduce((n,s)=>n+s.y,0)/group.length;return `<div class="constellation-name" style="left:${x+18}px;top:${y+18}px">${names[intent]||intent}</div>`}).join('');
}

function sky(){
  const stars = starRecords();
  return `<div class="app-shell sky-shell"><section class="phone">${topbar('Night Sky')}<div class="sky-wrap" id="skyWrap">${stars.length?`<div id="sky" class="sky">${buildLines()}${constellationLabels()}${stars.map(star=>`<button aria-label="Open saved star" class="star ${star.importance>1?'meaningful':''} ${star.entry.intent==='grief'?'grief':''}" style="left:${star.x}px;top:${star.y}px" onclick="window.lifeOS.openEntry('${star.entryId}')"></button>`).join('')}</div>`:`<div class="empty"><div class="empty-star">✦</div>Your sky is quiet.</div>`}</div><div class="sky-controls"><span>${stars.length} ${stars.length===1?'star':'stars'}</span><div class="sky-buttons"><button aria-label="Zoom out" onclick="window.lifeOS.zoomSky(-.15)">−</button><button aria-label="Reset sky" onclick="window.lifeOS.resetSky()">⌂</button><button aria-label="Zoom in" onclick="window.lifeOS.zoomSky(.15)">+</button></div></div>${nav('sky')}</section></div>`;
}

function archive(){
  const entries = state.entries.slice().reverse();
  return `<div class="app-shell"><section class="phone">${topbar('Archive')}<div class="archive-header"><h2>Moments</h2>${entries.length?`<button class="pill" onclick="window.lifeOS.exportBackup()">Back up</button>`:''}</div>${entries.length?entries.map(entry=>`<article class="memory-card" tabindex="0" onclick="window.lifeOS.openEntry('${entry.id}')"><time>${new Date(entry.at).toLocaleDateString(undefined,{month:'short',day:'numeric'})} · ${entry.pillar}</time><p>${escapeHtml(entry.text)}</p></article>`).join(''):`<div class="empty">No saved moments yet.</div>`}${nav('archive')}</section></div>`;
}

function openEntry(id){
  const entry = entryById(id);
  if (!entry) return;
  showModal(entry.pillar, `<p><em>${escapeHtml(entry.question)}</em></p><p class="modal-answer">${escapeHtml(entry.text)}</p>`);
}

function showModal(title,html){
  const backdrop=document.createElement('div');
  backdrop.className='modal-backdrop';
  backdrop.innerHTML=`<div class="modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}"><div class="modal-handle"></div><h3>${title}</h3>${html}<div class="actions"><button class="btn btn-primary">Close</button></div></div>`;
  const close=()=>backdrop.remove();
  backdrop.querySelector('button').onclick=close;
  backdrop.addEventListener('click',e=>{if(e.target===backdrop)close()});
  document.body.appendChild(backdrop);
  backdrop.querySelector('button').focus();
}

function installSkyGestures(){
  const wrap=document.querySelector('#skyWrap'), sky=document.querySelector('#sky');
  if(!wrap||!sky) return;
  const t=state.constellationTransform, pointers=new Map();
  let lastCenter=null,lastDistance=null;
  const apply=()=>sky.style.transform=`translate(${t.x}px,${t.y}px) scale(${t.scale})`;
  const center=()=>{const a=[...pointers.values()];return{x:a.reduce((n,p)=>n+p.x,0)/a.length,y:a.reduce((n,p)=>n+p.y,0)/a.length}};
  const distance=()=>{const a=[...pointers.values()];return a.length<2?null:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)};
  apply();
  wrap.addEventListener('pointerdown',e=>{pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});wrap.setPointerCapture(e.pointerId);lastCenter=center();lastDistance=distance()});
  wrap.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});const c=center();if(lastCenter){t.x+=c.x-lastCenter.x;t.y+=c.y-lastCenter.y}const d=distance();if(d&&lastDistance)t.scale=Math.max(.3,Math.min(2.5,t.scale*d/lastDistance));lastCenter=c;lastDistance=d;apply()});
  const end=e=>{pointers.delete(e.pointerId);lastCenter=pointers.size?center():null;lastDistance=distance();persist()};
  wrap.addEventListener('pointerup',end);wrap.addEventListener('pointercancel',end);
}

function zoomSky(delta){state.constellationTransform.scale=Math.max(.3,Math.min(2.5,state.constellationTransform.scale+delta));persist();render()}
function resetSky(){state.constellationTransform={x:-310,y:-170,scale:.72};persist();render()}
function selectChoice(choice){state.selectedChoice=choice;persist();render()}
function feedback(intent,value,element){state.affinity[intent]=(state.affinity[intent]||0)+value;persist();element.parentElement.querySelectorAll('.pill').forEach(btn=>btn.classList.remove('active'));element.classList.add('active')}
function quickWrite(){state.currentQuestion='presence-1';state.arrival='open';navigate('question')}
function dismissInstallTip(){state.installTipDismissed=true;persist();render()}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}

function render(){
  const screens={home,arrival,question,sky,archive};
  app.innerHTML=(screens[state.screen]||home)();
  if(state.screen==='sky')installSkyGestures();
}

window.lifeOS={navigate,chooseQuestion,anotherQuestion,selectChoice,feedback,saveEntry,lightLantern,openEntry,zoomSky,resetSky,quickWrite,dismissInstallTip,exportBackup:()=>exportState(state)};
render();
if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
