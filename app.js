const app = document.querySelector('#app');

const seedQuestions = [
  {id:'self-1', pillar:'Self', depth:2, states:['open','hopeful','distant'], text:'When did you feel most like yourself today?', intent:'identity'},
  {id:'presence-1', pillar:'Presence', depth:1, states:['open','heavy','distant','hopeful'], text:'What did you notice today that you might normally have missed?', intent:'notice'},
  {id:'home-1', pillar:'Home', depth:2, states:['heavy','distant'], text:'Where did today feel easier on your nervous system?', intent:'ease'},
  {id:'wonder-1', pillar:'Wonder', depth:2, states:['open','hopeful'], text:'What has been quietly fascinating you lately?', intent:'curiosity'},
  {id:'energy-1', pillar:'Energy', depth:1, states:['heavy','distant'], text:'What took more out of you today than it seemed like it should?', intent:'energy'},
  {id:'connection-1', pillar:'Connection', depth:2, states:['open','heavy','hopeful'], text:'When did you feel genuinely connected to someone today?', intent:'connection'},
  {id:'comfort-1', pillar:'Comfort', depth:1, states:['heavy','distant'], text:'You do not have to understand everything right now. What feels easiest to notice — your body, the room around you, or one thought that keeps returning?', intent:'ground'},
  {id:'comfort-2', pillar:'Comfort', depth:1, states:['heavy','distant'], text:'What would feel kindest right now: less noise, less responsibility, more closeness, more space, or something else?', intent:'ground'},
  {id:'remembrance-1', pillar:'Remembrance', depth:2, states:['heavy','distant','open','hopeful'], text:'Is there someone — human or animal — you are missing today? Would remembering them feel comforting, or would you rather simply let their name be here with you?', intent:'grief'},
  {id:'remembrance-2', pillar:'Remembrance', depth:2, states:['open','heavy','distant'], text:'What is one tiny thing about them you never want time to smooth away?', intent:'grief'},
  {id:'growth-1', pillar:'Growth', depth:3, states:['open','hopeful'], text:'What truth about yourself has been getting harder to ignore?', intent:'growth'},
  {id:'play-1', pillar:'Wonder', depth:1, states:['open','hopeful'], text:'What made you laugh, play, or feel a little lighter today?', intent:'play'},
  {id:'ease-2', pillar:'Home', depth:2, states:['open','hopeful','heavy'], text:'What felt natural today — like you did not have to force it?', intent:'ease'},
  {id:'connection-2', pillar:'Connection', depth:2, states:['open','hopeful','heavy'], text:'Who felt easy to be yourself around today?', intent:'connection'}
];

const defaultState = {
  screen:'home', arrival:null, currentQuestion:null, moments:[], affinity:{}, lastUsed:{},
  constellationTransform:{x:-310,y:-170,scale:.72}, firstSeenAt:null, installTipDismissed:false
};
const state = Object.assign({}, defaultState, safeParse(localStorage.getItem('lifeos-state')));
state.moments ||= []; state.affinity ||= {}; state.lastUsed ||= {};
state.constellationTransform ||= defaultState.constellationTransform;
if(!state.firstSeenAt) state.firstSeenAt = new Date().toISOString();
persist();

function safeParse(raw){ try{return raw?JSON.parse(raw):{}}catch{return {}} }
function persist(){ localStorage.setItem('lifeos-state', JSON.stringify(state)); }
function navigate(screen){ state.screen=screen; persist(); render(); window.scrollTo({top:0,behavior:'smooth'}); }
function getQ(){ return seedQuestions.find(q=>q.id===state.currentQuestion)||seedQuestions[0]; }

function chooseQuestion(arrival, forcedIntent=null){
  let eligible = seedQuestions.filter(q => q.states.includes(arrival));
  if(forcedIntent) eligible = eligible.filter(q=>q.intent===forcedIntent);
  const now = Date.now();
  eligible.sort((a,b)=>{
    const score = q => (state.affinity[q.intent]||0) + Math.min(4,(now-(state.lastUsed[q.id]||0))/86400000)*.08 - q.depth*.03;
    return score(b)-score(a);
  });
  let q = eligible[0] || seedQuestions[0];
  if(!forcedIntent && (arrival==='heavy'||arrival==='distant') && Math.random()<.5){
    const gentle=eligible.filter(x=>x.depth===1); if(gentle.length) q=gentle[Math.floor(Math.random()*gentle.length)];
  }
  state.arrival=arrival; state.currentQuestion=q.id; state.lastUsed[q.id]=now; persist(); navigate('question');
}

function anotherQuestion(){
  const current=getQ(); state.lastUsed[current.id]=Date.now();
  chooseQuestion(state.arrival||'open');
}

function topbar(label='Life OS'){
  return `<div class="topbar"><div class="brand"><span class="brand-star">✦</span><span>${label}</span></div><button class="icon-btn" onclick="navigate('home')" aria-label="Home">⌂</button></div>`;
}
function nav(active){ return `<nav class="bottom-nav" aria-label="Primary">
  <button class="nav-btn ${active==='home'?'active':''}" onclick="navigate('home')"><span class="nav-icon">⌂</span>Hearth</button>
  <button class="nav-btn ${active==='sky'?'active':''}" onclick="navigate('sky')"><span class="nav-icon">✦</span>Sky</button>
  <button class="nav-btn ${active==='archive'?'active':''}" onclick="navigate('archive')"><span class="nav-icon">⌘</span>Archive</button>
</nav>`; }

function installTip(){
  const standalone=window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone===true;
  const isiOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
  if(standalone||state.installTipDismissed||!isiOS) return '';
  return `<div class="install-card"><div><strong>Want the Hearth on your Home Screen?</strong><span>In Safari: Share → Add to Home Screen.</span></div><button onclick="dismissInstallTip()">×</button></div>`;
}
function dismissInstallTip(){ state.installTipDismissed=true; persist(); render(); }

function home(){
  const count=state.moments.length;
  return `<div class="app-shell"><section class="phone">${topbar()}
    ${installTip()}
    <div class="hero"><div class="kicker">The Hearth</div><h1>Welcome Home</h1><div class="hearth" aria-hidden="true"><span></span></div>
    <p class="lede">You don’t have to arrive as anything other than you.</p></div>
    <div class="actions"><button class="btn btn-primary" onclick="navigate('arrival')">How are you arriving?</button><button class="btn btn-secondary" onclick="quickWrite()">I just want to write</button></div>
    <p class="micro">No streaks. No grades. Just a place to notice.</p>
    ${count?`<button class="sky-peek" onclick="navigate('sky')"><span class="tiny-stars">✦ · ✧ · ✦</span><span>Your sky holds <strong>${count}</strong> ${count===1?'moment':'moments'}.</span><small>Nothing here has to become a lesson to be worth keeping.</small></button>`:''}
    ${nav('home')}</section></div>`;
}

function arrival(){
  const options=[['open','🍃','Open','Present, curious, okay'],['heavy','🌧','Heavy','Tired, overwhelmed, carrying something'],['distant','🌫','Distant','Numb, unsure, disconnected'],['hopeful','🌅','Hopeful','Something feels possible']];
  return `<div class="app-shell"><section class="phone">${topbar('Arrive')}
    <div class="question-tag">A small check-in</div><h2>How are you arriving today?</h2>
    <p class="subcopy">Choose what feels closest. You can change your mind.</p>
    <div class="card-list">${options.map(([v,e,t,s])=>`<button class="arrival-card" onclick="chooseQuestion('${v}')"><strong>${e}&nbsp;&nbsp;${t}</strong><span>${s}</span></button>`).join('')}</div>
    <div class="arrival-shortcuts"><button onclick="chooseQuestion('heavy','ground')">🫂 I need comfort</button><button onclick="chooseQuestion('heavy','grief')">🕯 I’m missing someone</button></div>
    <div class="actions"><button class="btn btn-quiet" onclick="chooseQuestion('distant')">I don’t know yet</button></div>${nav('')}</section></div>`;
}

function question(){
  const q=getQ();
  return `<div class="app-shell"><section class="phone">${topbar(q.intent==='grief'?'Remembrance':'Tonight')}
    <div class="question-tag">${q.pillar} · ${q.depth===1?'gentle':q.depth===2?'reflective':'deeper'}</div>
    <div class="question">${q.text}</div><p class="micro left">There is no right amount to write.</p>
    <textarea id="answer" class="textarea" placeholder="Start wherever you are…" spellcheck="true"></textarea>
    <div class="feedback"><button class="pill" onclick="feedback('${q.intent}',1,this)">♡ That helped</button><button class="pill" onclick="feedback('${q.intent}',2,this)">🌱 More like this</button><button class="pill" onclick="feedback('${q.intent}',-1,this)">🌙 Not right now</button></div>
    <div class="actions"><button class="btn btn-primary" onclick="saveMoment()">✦ Keep this moment as a star</button>
    ${q.intent==='grief'?`<button class="btn btn-secondary" onclick="lightLantern()">🕯 Just light the lantern</button>`:''}
    <button class="btn btn-secondary" onclick="anotherQuestion()">Ask me something else</button><button class="btn btn-quiet" onclick="navigate('home')">Not today</button></div>
    <p class="micro">Meaningful, not necessarily happy.</p>${nav('')}</section></div>`;
}

function quickWrite(){ state.currentQuestion='presence-1'; state.arrival='open'; persist(); navigate('question'); }
function feedback(intent,val,el){ state.affinity[intent]=(state.affinity[intent]||0)+val; [...el.parentElement.children].forEach(x=>x.classList.remove('active')); el.classList.add('active'); persist(); }

function starPosition(idx){ const angle=(idx*2.3999632297)%(Math.PI*2), ring=95+Math.sqrt(idx+1)*75; return {x:590+Math.cos(angle)*ring+(Math.random()*55-27),y:470+Math.sin(angle)*ring+(Math.random()*55-27)}; }
function saveMoment(){
  const text=(document.querySelector('#answer')?.value||'').trim();
  if(!text){ showModal('Nothing to prove','You can keep a moment without finding perfect words. A few words is enough — or you can leave it here for tonight.');return; }
  const q=getQ(), pos=starPosition(state.moments.length);
  state.moments.push({id:globalThis.crypto?.randomUUID?.()||String(Date.now()),at:new Date().toISOString(),text,question:q.text,pillar:q.pillar,intent:q.intent,arrival:state.arrival||'unknown',x:pos.x,y:pos.y,importance:text.length>180?2:1});
  persist(); showModal('A new star appeared','This moment is part of your sky now. It does not have to be happy to be luminous.',()=>navigate('sky'));
}
function lightLantern(){ const q=getQ(),pos=starPosition(state.moments.length); state.moments.push({id:globalThis.crypto?.randomUUID?.()||String(Date.now()),at:new Date().toISOString(),text:'A lantern was lit in remembrance.',question:q.text,pillar:'Remembrance',intent:'grief',arrival:state.arrival||'unknown',x:pos.x,y:pos.y,importance:2}); persist(); showModal('The lantern is lit','No words needed.',()=>navigate('sky')); }

function lineBetween(a,b){ const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy),angle=Math.atan2(dy,dx)*180/Math.PI; return `<div class="line" style="left:${a.x}px;top:${a.y}px;width:${len}px;transform:rotate(${angle}deg)"></div>`; }
function grouped(m){ const groups={};m.forEach(s=>(groups[s.intent]??=[]).push(s));return groups; }
function buildLines(m){ let lines='';Object.values(grouped(m)).forEach(g=>{if(g.length<2)return;const sorted=g.slice().sort((a,b)=>new Date(a.at)-new Date(b.at));for(let i=1;i<sorted.length;i++)lines+=lineBetween(sorted[i-1],sorted[i]);});return lines; }
function constellationLabels(m){
  const names={identity:'Self',notice:'Presence',ease:'Ease',curiosity:'Wonder',energy:'Energy',connection:'Connection',ground:'Coming Back',grief:'Love That Continues',growth:'Becoming',play:'Play'};
  return Object.entries(grouped(m)).filter(([,g])=>g.length>=2).map(([k,g])=>{const x=g.reduce((n,s)=>n+s.x,0)/g.length,y=g.reduce((n,s)=>n+s.y,0)/g.length;return `<div class="constellation-name" style="left:${x+18}px;top:${y+18}px">${names[k]||k}</div>`}).join('');
}

function sky(){
  const m=state.moments;
  return `<div class="app-shell sky-shell"><section class="phone">${topbar('Your Night Sky')}
    <div class="question-tag">Constellations</div><h2>Your life, made visible.</h2>
    <p class="micro left sky-help">Drag to move. Pinch or use + / − to zoom. Brightness means <em>meaning</em>, not happiness.</p>
    <div class="sky-wrap" id="skyWrap">${m.length?`<div id="sky" class="sky">${buildLines(m)}${constellationLabels(m)}${m.map(s=>`<button aria-label="Open saved moment" class="star ${s.importance>1?'meaningful':''} ${s.intent==='grief'?'grief':''}" style="left:${s.x}px;top:${s.y}px" onclick="openStar('${s.id}')"></button>${state.constellationTransform.scale>.85?`<div class="star-label" style="left:${s.x+15}px;top:${s.y-3}px">${escapeHtml(shorten(s.text,34))}</div>`:''}`).join('')}</div>`:`<div class="empty"><div class="empty-star">✦</div>Your sky is quiet.<br><span>The first star appears when you keep a moment.</span></div>`}</div>
    <div class="sky-controls"><span>${m.length} ${m.length===1?'star':'stars'}</span><div class="sky-buttons"><button onclick="zoomSky(-.15)">−</button><button onclick="resetSky()">⌂</button><button onclick="zoomSky(.15)">+</button></div></div>
    ${nav('sky')}</section></div>`;
}

function archive(){
  const m=state.moments.slice().reverse();
  return `<div class="app-shell"><section class="phone">${topbar('Archive')}
    <div class="question-tag">A record of becoming</div><h2>Moments you chose to keep.</h2>
    <div class="archive-actions"><button class="pill" onclick="exportSky()">↗ Back up my sky</button></div>
    ${m.length?m.map(s=>`<article class="memory-card" onclick="openStar('${s.id}')"><time>${new Date(s.at).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})} · ${s.pillar}</time><p>${escapeHtml(shorten(s.text,180))}</p></article>`).join(''):`<div class="empty">Nothing has to be saved before it is ready.</div>`}${nav('archive')}</section></div>`;
}

function exportSky(){
  const payload={exportedAt:new Date().toISOString(),version:'0.2',moments:state.moments,affinity:state.affinity};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`life-os-sky-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href);
  showModal('Your sky is backed up','A copy of your saved moments was downloaded to this device.');
}
function openStar(id){ const s=state.moments.find(x=>x.id===id);if(!s)return;showModal(`${s.intent==='grief'?'🕯':'✦'} ${s.pillar}`,`<small>${new Date(s.at).toLocaleString()}</small><p><em>${escapeHtml(s.question)}</em></p><p class="modal-answer">${escapeHtml(s.text)}</p>`); }
function showModal(title,html,onClose){ const d=document.createElement('div');d.className='modal-backdrop';d.innerHTML=`<div class="modal"><div class="modal-handle"></div><h3>${title}</h3><div>${html}</div><div class="actions"><button class="btn btn-primary">Return</button></div></div>`;const close=()=>{d.remove();if(onClose)onClose()};d.querySelector('button').onclick=close;d.addEventListener('click',e=>{if(e.target===d)close()});document.body.appendChild(d); }
function shorten(s,n){return s.length>n?s.slice(0,n-1)+'…':s}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

function installSkyGestures(){
  const wrap=document.querySelector('#skyWrap'),sky=document.querySelector('#sky');if(!wrap||!sky)return;
  const t=state.constellationTransform,pointers=new Map();let lastCenter=null,lastDistance=null;
  const apply=()=>sky.style.transform=`translate(${t.x}px,${t.y}px) scale(${t.scale})`;apply();
  wrap.addEventListener('pointerdown',e=>{pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});wrap.setPointerCapture(e.pointerId);if(pointers.size===1)lastCenter={x:e.clientX,y:e.clientY}});
  wrap.addEventListener('pointermove',e=>{
    if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});const pts=[...pointers.values()];
    if(pts.length===1&&lastCenter){t.x+=pts[0].x-lastCenter.x;t.y+=pts[0].y-lastCenter.y;lastCenter={...pts[0]};}
    if(pts.length>=2){const a=pts[0],b=pts[1],center={x:(a.x+b.x)/2,y:(a.y+b.y)/2},dist=Math.hypot(a.x-b.x,a.y-b.y);if(lastDistance){const old=t.scale;t.scale=Math.max(.32,Math.min(2.4,t.scale*(dist/lastDistance)));const rect=wrap.getBoundingClientRect(),mx=center.x-rect.left,my=center.y-rect.top;t.x=mx-(mx-t.x)*(t.scale/old);t.y=my-(my-t.y)*(t.scale/old);}lastDistance=dist;lastCenter=center;}apply();
  });
  const end=e=>{pointers.delete(e.pointerId);lastDistance=null;lastCenter=pointers.size?[...pointers.values()][0]:null;persist()};wrap.addEventListener('pointerup',end);wrap.addEventListener('pointercancel',end);
  wrap.addEventListener('wheel',e=>{e.preventDefault();const old=t.scale;t.scale=Math.max(.32,Math.min(2.4,t.scale+(e.deltaY<0?.08:-.08)));const r=wrap.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;t.x=mx-(mx-t.x)*(t.scale/old);t.y=my-(my-t.y)*(t.scale/old);apply();persist()},{passive:false});
}
function zoomSky(delta){state.constellationTransform.scale=Math.max(.32,Math.min(2.4,state.constellationTransform.scale+delta));persist();render()}
function resetSky(){state.constellationTransform={x:-310,y:-170,scale:.72};persist();render()}

function render(){ const html=state.screen==='arrival'?arrival():state.screen==='question'?question():state.screen==='sky'?sky():state.screen==='archive'?archive():home();app.innerHTML=html;if(state.screen==='sky')requestAnimationFrame(installSkyGestures); }
render();
if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});