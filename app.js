
const app = document.querySelector('#app');

const seedQuestions = [
  {id:'self-1', pillar:'Self', depth:2, states:['open','hopeful','distant'], text:'When did you feel most like yourself today?', intent:'identity'},
  {id:'presence-1', pillar:'Presence', depth:1, states:['open','heavy','distant','hopeful'], text:'What did you notice today that you might normally have missed?', intent:'notice'},
  {id:'home-1', pillar:'Home', depth:2, states:['heavy','distant'], text:'Where did today feel easier on your nervous system?', intent:'ease'},
  {id:'wonder-1', pillar:'Wonder', depth:2, states:['open','hopeful'], text:'What has been quietly fascinating you lately?', intent:'curiosity'},
  {id:'energy-1', pillar:'Energy', depth:1, states:['heavy','distant'], text:'What took more out of you today than it seemed like it should?', intent:'energy'},
  {id:'connection-1', pillar:'Connection', depth:2, states:['open','heavy','hopeful'], text:'When did you feel genuinely connected to someone today?', intent:'connection'},
  {id:'comfort-1', pillar:'Comfort', depth:1, states:['heavy','distant'], text:'You do not have to understand everything right now. What feels easiest to notice — your body, the room around you, or one thought that keeps returning?', intent:'ground'},
  {id:'remembrance-1', pillar:'Remembrance', depth:2, states:['heavy','distant','open'], text:'Is there someone — human or animal — you are missing today? Would remembering them feel comforting, or would you rather simply let their name be here with you?', intent:'grief'},
  {id:'growth-1', pillar:'Growth', depth:3, states:['open','hopeful'], text:'What truth about yourself has been getting harder to ignore?', intent:'growth'},
  {id:'play-1', pillar:'Wonder', depth:1, states:['open','hopeful'], text:'What made you laugh, play, or feel a little lighter today?', intent:'play'}
];

const defaultState = {
  screen:'home',
  arrival:null,
  currentQuestion:null,
  moments:[],
  affinity:{},
  lastUsed:{},
  constellationTransform:{x:-310,y:-170,scale:.72}
};

const state = Object.assign({}, defaultState, JSON.parse(localStorage.getItem('lifeos-state') || '{}'));
state.moments = state.moments || [];
state.affinity = state.affinity || {};
state.lastUsed = state.lastUsed || {};
state.constellationTransform = state.constellationTransform || defaultState.constellationTransform;

function persist(){ localStorage.setItem('lifeos-state', JSON.stringify(state)); }
function navigate(screen){state.screen=screen;persist();render();}

function chooseQuestion(arrival){
  const eligible = seedQuestions.filter(q => q.states.includes(arrival));
  const now = Date.now();
  eligible.sort((a,b)=>{
    const affA=state.affinity[a.intent]||0, affB=state.affinity[b.intent]||0;
    const ageA=now-(state.lastUsed[a.id]||0), ageB=now-(state.lastUsed[b.id]||0);
    return (affB-affA) + ((ageB-ageA)/86400000)*.015;
  });
  let q = eligible[0] || seedQuestions[0];
  if(arrival==='heavy' && Math.random()<.4) q=seedQuestions.find(x=>x.id==='comfort-1');
  if(arrival==='distant' && Math.random()<.35) q=seedQuestions.find(x=>x.id==='comfort-1');
  state.arrival=arrival;
  state.currentQuestion=q.id;
  state.lastUsed[q.id]=now;
  persist();
  navigate('question');
}

function getQ(){return seedQuestions.find(q=>q.id===state.currentQuestion)||seedQuestions[0];}

function topbar(label='Life OS'){
  return `<div class="topbar"><div class="brand"><span class="brand-star">✦</span><span>${label}</span></div><button class="icon-btn" onclick="navigate('home')" aria-label="Home">⌂</button></div>`;
}
function nav(active){
 return `<nav class="bottom-nav">
   <button class="nav-btn ${active==='home'?'active':''}" onclick="navigate('home')"><span class="nav-icon">⌂</span>Hearth</button>
   <button class="nav-btn ${active==='sky'?'active':''}" onclick="navigate('sky')"><span class="nav-icon">✦</span>Sky</button>
   <button class="nav-btn ${active==='archive'?'active':''}" onclick="navigate('archive')"><span class="nav-icon">⌘</span>Archive</button>
 </nav>`;
}

function home(){
 return `<div class="app-shell"><section class="phone">
 ${topbar()}
 <div class="hero">
   <div class="kicker">The Hearth</div>
   <h1>Welcome Home</h1>
   <div class="hearth" aria-hidden="true"></div>
   <p class="lede">You don’t have to arrive as anything other than you.</p>
 </div>
 <div class="actions">
   <button class="btn btn-primary" onclick="navigate('arrival')">How are you arriving?</button>
   <button class="btn btn-secondary" onclick="quickWrite()">I just want to write</button>
 </div>
 <p class="micro">No streaks. No grades. Just a place to notice.</p>
 ${state.moments.length?`<div class="notice">Your sky has <strong>${state.moments.length}</strong> ${state.moments.length===1?'star':'stars'} now. Nothing here needs to become a lesson to be worth keeping.</div>`:''}
 ${nav('home')}
 </section></div>`;
}

function arrival(){
 const options=[
  ['open','🍃','Open','Present, curious, okay'],
  ['heavy','🌧','Heavy','Tired, overwhelmed, carrying something'],
  ['distant','🌫','Distant','Numb, unsure, disconnected'],
  ['hopeful','🌅','Hopeful','Something feels possible']
 ];
 return `<div class="app-shell"><section class="phone">
 ${topbar('Arrive')}
 <div class="question-tag">A small check-in</div>
 <h2>How are you arriving today?</h2>
 <p class="lede" style="font-family:inherit;font-size:14px">Choose what feels closest. You can change your mind.</p>
 <div class="card-list">
 ${options.map(([v,e,t,s])=>`<button class="arrival-card" onclick="chooseQuestion('${v}')"><strong>${e}&nbsp;&nbsp;${t}</strong><span>${s}</span></button>`).join('')}
 </div>
 <div class="actions"><button class="btn btn-quiet" onclick="chooseQuestion('distant')">I don’t know yet</button></div>
 ${nav('')}
 </section></div>`;
}

function question(){
 const q=getQ();
 return `<div class="app-shell"><section class="phone">
 ${topbar('Tonight')}
 <div class="question-tag">${q.pillar} · ${q.depth===1?'gentle':q.depth===2?'reflective':'deeper'}</div>
 <div class="question">${q.text}</div>
 <p class="micro" style="text-align:left">There is no right amount to write.</p>
 <textarea id="answer" class="textarea" placeholder="Start wherever you are…"></textarea>
 <div class="feedback">
   <button class="pill" onclick="feedback('${q.intent}',1,this)">♡ That helped</button>
   <button class="pill" onclick="feedback('${q.intent}',2,this)">🌱 More like this</button>
   <button class="pill" onclick="feedback('${q.intent}',-1,this)">🌙 Not right now</button>
 </div>
 <div class="actions">
   <button class="btn btn-primary" onclick="saveMoment()">✦ Keep this moment as a star</button>
   ${q.intent==='grief'?`<button class="btn btn-secondary" onclick="lightLantern()">🕯 Just light the lantern</button>`:''}
   <button class="btn btn-quiet" onclick="navigate('home')">Not today</button>
 </div>
 <p class="micro">Meaningful, not necessarily happy.</p>
 ${nav('')}
 </section></div>`;
}

function quickWrite(){
 state.currentQuestion='presence-1';persist();navigate('question');
}

function feedback(intent,val,el){
 state.affinity[intent]=(state.affinity[intent]||0)+val;
 [...el.parentElement.children].forEach(x=>x.classList.remove('active'));
 el.classList.add('active');persist();
}

function saveMoment(){
 const text=(document.querySelector('#answer')?.value||'').trim();
 if(!text){ showModal('Nothing to prove','You can keep a moment without finding perfect words. Write a few words, or choose “Not today.”');return; }
 const q=getQ();
 const idx=state.moments.length;
 const angle=(idx*2.3999632297)%(Math.PI*2);
 const ring=90+Math.sqrt(idx+1)*74;
 const x=590+Math.cos(angle)*ring+(Math.random()*80-40);
 const y=470+Math.sin(angle)*ring+(Math.random()*70-35);
 state.moments.push({
   id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),
   at:new Date().toISOString(),
   text, question:q.text, pillar:q.pillar, intent:q.intent,
   arrival:state.arrival||'unknown', x,y,
   importance:(text.length>180?2:1)
 });
 persist();
 showModal('A new star appeared','This moment is part of your sky now. It does not have to be happy to be luminous.',()=>navigate('sky'));
}

function lightLantern(){
 const q=getQ();
 state.moments.push({
   id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),
   at:new Date().toISOString(),
   text:'A lantern was lit in remembrance.',
   question:q.text,pillar:'Remembrance',intent:'grief',arrival:state.arrival||'unknown',
   x:520+Math.random()*280,y:350+Math.random()*300,importance:2
 });
 persist(); showModal('The lantern is lit','No words needed.',()=>navigate('sky'));
}

function lineBetween(a,b){
 const dx=b.x-a.x, dy=b.y-a.y, len=Math.hypot(dx,dy), angle=Math.atan2(dy,dx)*180/Math.PI;
 return `<div class="line" style="left:${a.x}px;top:${a.y}px;width:${len}px;transform:rotate(${angle}deg)"></div>`;
}

function buildLines(m){
 let lines='';
 const groups={};
 m.forEach(s=>(groups[s.intent]??=[]).push(s));
 Object.values(groups).forEach(g=>{
   if(g.length<2)return;
   const sorted=g.slice().sort((a,b)=>new Date(a.at)-new Date(b.at));
   for(let i=1;i<sorted.length;i++) lines+=lineBetween(sorted[i-1],sorted[i]);
 });
 return lines;
}

function sky(){
 const m=state.moments;
 return `<div class="app-shell"><section class="phone">
 ${topbar('Your Night Sky')}
 <div class="question-tag">Constellations</div>
 <h2>Your life, made visible.</h2>
 <p class="micro" style="text-align:left;margin-bottom:12px">Drag to move through your sky. Pinch or use + / − to zoom. Brightness means <em>meaning</em>, not happiness.</p>
 <div class="sky-wrap" id="skyWrap">
   ${m.length?`<div id="sky" class="sky">
     ${buildLines(m)}
     ${constellationLabels(m)}
     ${m.map((s,i)=>`<button aria-label="Open moment" class="star ${s.importance>1?'meaningful':''} ${s.intent==='grief'?'grief':''}" style="left:${s.x}px;top:${s.y}px" onclick="openStar('${s.id}')"></button>
     ${state.constellationTransform.scale>.8?`<div class="star-label" style="left:${s.x+15}px;top:${s.y-3}px">${escapeHtml(shorten(s.text,32))}</div>`:''}`).join('')}
   </div>`:`<div class="empty"><div style="font-size:35px;margin-bottom:15px">✦</div>Your sky is quiet.<br/>The first star appears when you keep a moment.</div>`}
 </div>
 <div class="sky-controls"><span>${m.length} ${m.length===1?'star':'stars'}</span><div class="sky-buttons"><button onclick="zoomSky(-.15)">−</button><button onclick="resetSky()">⌂</button><button onclick="zoomSky(.15)">+</button></div></div>
 ${nav('sky')}
 </section></div>`;
}

function constellationLabels(m){
 const groups={};m.forEach(s=>(groups[s.intent]??=[]).push(s));
 return Object.entries(groups).filter(([k,g])=>g.length>=2).map(([k,g])=>{
   const x=g.reduce((n,s)=>n+s.x,0)/g.length, y=g.reduce((n,s)=>n+s.y,0)/g.length;
   const names={identity:'Self',notice:'Presence',ease:'Ease',curiosity:'Wonder',energy:'Energy',connection:'Connection',ground:'Coming Back',grief:'Love That Continues',growth:'Becoming',play:'Play'};
   return `<div class="constellation-name" style="left:${x+18}px;top:${y+18}px">${names[k]||k}</div>`;
 }).join('');
}

function archive(){
 const m=state.moments.slice().reverse();
 return `<div class="app-shell"><section class="phone">
 ${topbar('Archive')}
 <div class="question-tag">A record of becoming</div>
 <h2>Moments you chose to keep.</h2>
 ${m.length?m.map(s=>`<article class="memory-card" onclick="openStar('${s.id}')"><time>${new Date(s.at).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})} · ${s.pillar}</time><p>${escapeHtml(shorten(s.text,180))}</p></article>`).join(''):`<div class="empty">Nothing has to be saved before it is ready.</div>`}
 ${nav('archive')}
 </section></div>`;
}

function openStar(id){
 const s=state.moments.find(x=>x.id===id); if(!s)return;
 showModal(`${s.intent==='grief'?'🕯':'✦'} ${s.pillar}`, `<small>${new Date(s.at).toLocaleString()}</small><p><em>${escapeHtml(s.question)}</em></p><p style="color:var(--cream)">${escapeHtml(s.text)}</p>`);
}

function showModal(title,html,onClose){
 const d=document.createElement('div');d.className='modal-backdrop';
 d.innerHTML=`<div class="modal"><h3>${title}</h3><div>${html}</div><div class="actions"><button class="btn btn-primary">Return</button></div></div>`;
 d.querySelector('button').onclick=()=>{d.remove();if(onClose)onClose();};
 d.addEventListener('click',e=>{if(e.target===d){d.remove();if(onClose)onClose();}});
 document.body.appendChild(d);
}

function shorten(s,n){return s.length>n?s.slice(0,n-1)+'…':s}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

function installSkyGestures(){
 const wrap=document.querySelector('#skyWrap'), sky=document.querySelector('#sky');if(!wrap||!sky)return;
 let t=state.constellationTransform; apply();
 let dragging=false,last=null,startDist=null,startScale=null;
 function apply(){sky.style.transform=`translate(${t.x}px,${t.y}px) scale(${t.scale})`}
 wrap.addEventListener('pointerdown',e=>{dragging=true;last={x:e.clientX,y:e.clientY};wrap.setPointerCapture(e.pointerId)});
 wrap.addEventListener('pointermove',e=>{if(!dragging||!last)return;t.x+=e.clientX-last.x;t.y+=e.clientY-last.y;last={x:e.clientX,y:e.clientY};apply()});
 wrap.addEventListener('pointerup',()=>{dragging=false;last=null;persist()});
 wrap.addEventListener('wheel',e=>{e.preventDefault();const old=t.scale;t.scale=Math.max(.35,Math.min(2.2,t.scale+(e.deltaY<0?.08:-.08)));const r=wrap.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;t.x=mx-(mx-t.x)*(t.scale/old);t.y=my-(my-t.y)*(t.scale/old);apply();persist()},{passive:false});
}

function zoomSky(delta){state.constellationTransform.scale=Math.max(.35,Math.min(2.2,state.constellationTransform.scale+delta));persist();render();}
function resetSky(){state.constellationTransform={x:-310,y:-170,scale:.72};persist();render();}

function render(){
 let html=state.screen==='arrival'?arrival():state.screen==='question'?question():state.screen==='sky'?sky():state.screen==='archive'?archive():home();
 app.innerHTML=html;
 if(state.screen==='sky') installSkyGestures();
}
render();

if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
