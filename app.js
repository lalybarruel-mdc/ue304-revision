
const DATA = window.REVISION_DATA;



// ---------------- UI preferences (calm / reading / progress style / intent)
const PREF_KEY = "ue304_ui_prefs_v1";
function loadPrefs(){
  try{ return JSON.parse(localStorage.getItem(PREF_KEY) || "{}"); }catch{ return {}; }
}
function savePrefs(p){ localStorage.setItem(PREF_KEY, JSON.stringify(p)); }

const prefs = loadPrefs();
function applyPrefs(){
  document.body.classList.toggle("calm", !!prefs.calm);
  document.body.classList.toggle("reading", !!prefs.reading);

  // progress mode buttons
  const bSoft = document.getElementById("progressSoft");
  const bNum  = document.getElementById("progressNum");
  if(bSoft && bNum){
    bSoft.classList.toggle("active", (prefs.progressMode || "soft") === "soft");
    bNum.classList.toggle("active", (prefs.progressMode || "soft") === "num");
  }
  const bCalm = document.getElementById("toggleCalm");
  if(bCalm) bCalm.classList.toggle("active", !!prefs.calm);
  const bRead = document.getElementById("toggleReading");
  if(bRead) bRead.classList.toggle("active", !!prefs.reading);

  // intent
  const intent = document.getElementById("todayIntent");
  if(intent) intent.value = prefs.intent || "";
}
applyPrefs();

document.getElementById("toggleCalm")?.addEventListener("click", ()=>{
  prefs.calm = !prefs.calm; savePrefs(prefs); applyPrefs();
});
document.getElementById("toggleReading")?.addEventListener("click", ()=>{
  prefs.reading = !prefs.reading; savePrefs(prefs); applyPrefs();
});
document.getElementById("progressSoft")?.addEventListener("click", ()=>{
  prefs.progressMode = "soft"; savePrefs(prefs); applyPrefs(); updateStats();
});
document.getElementById("progressNum")?.addEventListener("click", ()=>{
  prefs.progressMode = "num"; savePrefs(prefs); applyPrefs(); updateStats();
});
document.getElementById("saveIntent")?.addEventListener("click", ()=>{
  const v = (document.getElementById("todayIntent")?.value || "").trim();
  prefs.intent = v; savePrefs(prefs); applyPrefs();
});
document.getElementById("todayIntent")?.addEventListener("keydown", (e)=>{
  if(e.key === "Enter"){ e.preventDefault(); document.getElementById("saveIntent")?.click(); }
});

// ---------------- Tabs
const tdFilter = document.getElementById('tdFilter');
const tabs = Array.from(document.querySelectorAll('.tab'));
const panels = Array.from(document.querySelectorAll('.panel'));

function setTab(tabId){
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
  panels.forEach(p => p.classList.toggle('active', p.id === tabId));
}
tabs.forEach(t => t.addEventListener('click', () => setTab(t.dataset.tab)));

// ---------------- TD filter
function buildTdFilter(){
  if(!tdFilter) return;
  tdFilter.innerHTML = "";
  const optAll = document.createElement('option');
  optAll.value = "ALL"; optAll.textContent = "Tous (TD1→TD5)";
  tdFilter.appendChild(optAll);

  (DATA.tds || []).forEach(td => {
    const o = document.createElement('option');
    o.value = td.id;
    o.textContent = `${td.id} – ${td.name}`;
    tdFilter.appendChild(o);
  });

  tdFilter.value = localStorage.getItem('ue304_tdFilter') || "ALL";
}
buildTdFilter();

tdFilter?.addEventListener('change', () => {
  localStorage.setItem('ue304_tdFilter', tdFilter.value);
  
// ---------------- Keyboard shortcuts
document.addEventListener("keydown", (e)=>{
  const tag = (document.activeElement?.tagName || "").toLowerCase();
  const typing = ["input","textarea","select"].includes(tag);

  if(!typing && (e.key === "ArrowLeft")){
    const active = document.querySelector(".panel.active")?.id;
    if(active === "cards"){ e.preventDefault(); showCard(cardIndex-1); }
  }
  if(!typing && (e.key === "ArrowRight")){
    const active = document.querySelector(".panel.active")?.id;
    if(active === "cards"){ e.preventDefault(); showCard(cardIndex+1); }
  }
  if(!typing && e.key === "/"){
    // focus fiche search if on fiches
    const active = document.querySelector(".panel.active")?.id;
    if(active === "fiches"){
      e.preventDefault();
      document.getElementById("ficheSearch")?.focus();
    }
  }
});


// ---------------- Pause (non-blocking) + timer + curve dot
function bindPauseAndCurve(){
  const pauseBtn = document.getElementById("togglePause");
  const pauseCard = document.getElementById("pauseCard");
  const timerDisplay = document.getElementById("timerDisplay");
  const startBtn = document.getElementById("startTimer");
  const resetBtn = document.getElementById("resetTimerBtn");
  const curveDot = document.getElementById("curveDot");

  // Pause toggle persisted
  if(pauseBtn && pauseCard){
    const key = "ue304_pause_open_v1";
    const open = localStorage.getItem(key) === "1";
    pauseCard.hidden = !open;
    pauseBtn.classList.toggle("active", open);

    pauseBtn.addEventListener("click", ()=>{
      const now = pauseCard.hidden;
      pauseCard.hidden = !now;
      pauseBtn.classList.toggle("active", now);
      localStorage.setItem(key, now ? "1" : "0");
    });
  }

  // Timer
  let left = 120;
  let handle = null;
  function fmt(sec){
    const m = String(Math.floor(sec/60)).padStart(2,"0");
    const s = String(sec%60).padStart(2,"0");
    return `${m}:${s}`;
  }
  function render(){ if(timerDisplay) timerDisplay.textContent = fmt(left); }
  render();

  startBtn?.addEventListener("click", ()=>{
    if(handle) return;
    handle = setInterval(()=>{
      left = Math.max(0, left-1);
      render();
      if(left===0){ clearInterval(handle); handle=null; }
    }, 1000);
  });
  resetBtn?.addEventListener("click", ()=>{
    if(handle){ clearInterval(handle); handle=null; }
    left = 120; render();
  });

  // Curve position helper stored globally for updateStats to call
  window.__setCurveDot = function(ratio){
    if(!curveDot) return;
    const r = Math.max(0, Math.min(1, ratio||0));
    const x = 10 + r * 78;
    const y = 46 - Math.sin(r * Math.PI * 2) * 14;
    curveDot.style.left = x + "%";
    curveDot.style.top = y + "%";
  };
}

reloadAll();
renderFav();

});

function getFilter(){
  return tdFilter?.value || "ALL";
}
function applyFilter(items){
  const f = getFilter();
  if(f === "ALL") return items;
  return items.filter(x => x.td === f);
}

// ---------------- Flashcards progress
const PROG_KEY = "ue304_flashcard_progress_v2";
function loadProg(){ try{ return JSON.parse(localStorage.getItem(PROG_KEY) || "{}"); }catch{ return {}; } }
function saveProg(p){ localStorage.setItem(PROG_KEY, JSON.stringify(p)); }

let cards = [];
let cardIndex = 0;

const flashcard = document.getElementById('flashcard');
const cardFront = document.getElementById('cardFront');
const cardBack = document.getElementById('cardBack');
const cardCounter = document.getElementById('cardCounter');
const knownStats = document.getElementById('knownStats');

// Star button for current flashcard
let starBtn = null;
function ensureStarBtn(){
  if(!flashcard) return;
  if(starBtn) return;
  starBtn = document.createElement("button");
  starBtn.className = "starBtn";
  starBtn.type = "button";
  starBtn.style.position = "absolute";
  starBtn.style.bottom = "14px";
  starBtn.style.left = "14px";
  starBtn.textContent = "☆";
  starBtn.title = "Marquer à revoir (⭐)";
  flashcard.style.position = "relative";
  flashcard.appendChild(starBtn);

  starBtn.addEventListener("click", (e)=>{
    e.stopPropagation();
    if(cards.length===0) return;
    const c = cards[cardIndex];
    const id = `${c.td}::${c.front}`;
    toggleFav("cards", id, {td:c.td, front:c.front, back:c.back});
    updateCurrentStar();
    renderFav();
  });
}
function updateCurrentStar(){
  ensureStarBtn();
  if(!starBtn || cards.length===0) return;
  const c = cards[cardIndex];
  const id = `${c.td}::${c.front}`;
  const on = isFav("cards", id);
  starBtn.classList.toggle("active", on);
  starBtn.textContent = on ? "⭐" : "☆";
}


function showCard(i){
  if(!cardFront || !cardBack) return;
  if(cards.length === 0){
    cardFront.textContent = "Aucune flashcard pour ce filtre.";
    cardBack.textContent = "";
    cardCounter.textContent = "";
    knownStats.textContent = "";
    flashcard?.classList.remove('flipped');
    return;
  }
  cardIndex = (i + cards.length) % cards.length;
  const c = cards[cardIndex];
  cardFront.textContent = c.front;
  cardBack.textContent = c.back;
  flashcard?.classList.remove('flipped');
  cardCounter.textContent = `${cardIndex+1} / ${cards.length} • ${c.td}`;
  updateStats();
  updateCurrentStar();
}

function flip(){ flashcard?.classList.toggle('flipped'); }
flashcard?.addEventListener('click', flip);
flashcard?.addEventListener('keydown', (e)=>{ if(e.code==="Space" || e.code==="Enter"){ e.preventDefault(); flip(); } });

document.getElementById('prevCard')?.addEventListener('click', ()=>showCard(cardIndex-1));
document.getElementById('nextCard')?.addEventListener('click', ()=>showCard(cardIndex+1));

function currentCardId(){
  const c = cards[cardIndex];
  return `${c.td}::${c.front}`;
}
function mark(val){
  if(cards.length===0) return;
  const p = loadProg();
  p[currentCardId()] = val; // known | unknown
  saveProg(p);
  showCard(cardIndex+1);
}
document.getElementById('markKnown')?.addEventListener('click', ()=>mark("known"));
document.getElementById('markUnknown')?.addEventListener('click', ()=>mark("unknown"));
document.getElementById('resetProgress')?.addEventListener('click', ()=>{
  localStorage.removeItem(PROG_KEY);
  updateStats();
  updateCurrentStar();
});

function updateStats(){
  if(!knownStats) return;
  const p = loadProg();
  const ids = cards.map(c => `${c.td}::${c.front}`);
  const known = ids.filter(id => p[id] === "known").length;
  const unknown = ids.filter(id => p[id] === "unknown").length;
  const prog = known / Math.max(1, ids.length);
  document.documentElement.style.setProperty('--progress', Math.round(prog*100)+'%');
  if(window.__setCurveDot) window.__setCurveDot(known/Math.max(1, ids.length));
  
  const mode = (prefs.progressMode || "soft");
  if(mode === "num"){
    knownStats.textContent = `Progression: ${known} connus ✅ • ${unknown} à revoir 🔁 • ${ids.length-known-unknown} non classés`;
  }else{
    // soft (non-chiffré)
    const total = ids.length;
    const done = known;
    const steps = Math.max(3, Math.min(7, Math.round(total/6)));
    const filled = Math.round((done/Math.max(1,total))*steps);
    const dots = "🌱".repeat(filled) + "○".repeat(Math.max(0, steps-filled));
    knownStats.textContent = `Progression douce : ${dots}`;
  }
}

// ---------------- QCM
let qcms = [];
let qcmIndex = 0;

const qcmCounter = document.getElementById('qcmCounter');
const qcmQuestion = document.getElementById('qcmQuestion');
const qcmOptions = document.getElementById('qcmOptions');
const qcmFeedback = document.getElementById('qcmFeedback');

function pickRandomQcm(){
  if(!qcmQuestion || !qcmOptions) return;
  if(qcms.length===0){
    qcmCounter.textContent="";
    qcmQuestion.textContent="Aucun QCM pour ce filtre.";
    qcmOptions.innerHTML="";
    qcmFeedback.textContent="";
    return;
  }
  qcmIndex = Math.floor(Math.random()*qcms.length);
  const q = qcms[qcmIndex];
  qcmCounter.textContent = `${q.td} • ${qcms.length} questions dans ce filtre`;
  qcmQuestion.textContent = q.q || q.question;
  const options = q.options || q.choices || [];
  qcmOptions.innerHTML = "";
  qcmFeedback.textContent = "";
  options.forEach((opt, idx)=>{
    const b = document.createElement('button');
    b.className = "opt";
    b.textContent = opt;
    b.addEventListener('click', ()=>gradeQcm(idx));
    qcmOptions.appendChild(b);
  });
}

function gradeQcm(chosen){
  const q = qcms[qcmIndex];
  const correct = (q.answer ?? q.correct ?? 0);
  const expl = q.explanation || q.explain || "";
  const buttons = Array.from(qcmOptions.querySelectorAll('.opt'));
  buttons.forEach((b, idx)=>{
    b.disabled = true;
    if(idx === correct) b.classList.add('correct');
    if(idx === chosen && chosen !== correct) b.classList.add('wrong');
  });
  qcmFeedback.textContent = expl || (chosen === correct ? "✅ Correct." : "❌ Incorrect.");
}
document.getElementById('newQcm')?.addEventListener('click', pickRandomQcm);

// ---------------- Vignettes
const vignetteList = document.getElementById('vignetteList');
const vignetteBox = document.getElementById('vignetteBox');
const vTitle = document.getElementById('vTitle');
const vCase = document.getElementById('vCase');
const vQuestions = document.getElementById('vQuestions');

document.getElementById('backToVignettes')?.addEventListener('click', ()=>{
  vignetteBox.hidden = true;
  vignetteList.hidden = false;
});

function renderVignettes(){
  if(!vignetteList) return;
  const arr = applyFilter(DATA.vignettes || []);
  vignetteList.innerHTML="";
  vignetteBox.hidden=true;
  vignetteList.hidden=false;

  if(arr.length===0){
    vignetteList.innerHTML = `<div class="item">Aucune vignette pour ce filtre.</div>`;
    return;
  }

  arr.forEach((vi)=>{
    const d = document.createElement('div');
    d.className="item";
    const vid = `${vi.td}::${vi.title}`;
    const on = isFav("vignettes", vid);
    d.innerHTML = `<div class="itemTopRow"><div><b>${vi.title}</b><div class="small muted">${vi.td}</div></div><button class="starBtn ${on?"active":""}" type="button">${on?"⭐":"☆"}</button></div>`;
    d.querySelector("button")?.addEventListener("click",(e)=>{e.stopPropagation(); toggleFav("vignettes", vid, {td:vi.td, title:vi.title, case:vi.case, questions:vi.questions}); renderVignettes(); renderFav();});
    d.addEventListener('click', ()=>openVignette(vi));
    vignetteList.appendChild(d);
  });
}

function openVignette(vi){
  vignetteList.hidden=true;
  vignetteBox.hidden=false;
  vTitle.textContent = `${vi.title} (${vi.td})`;
  vCase.textContent = vi.case;
  vQuestions.innerHTML = "";

  (vi.questions || []).forEach((qq, idx)=>{
    const wrap = document.createElement('div');
    wrap.style.marginTop = "12px";

    const qh = document.createElement('div');
    qh.innerHTML = `<b>Q${idx+1}.</b> ${qq.q}`;

    const ta = document.createElement('textarea');
    ta.placeholder = "Écris ta réponse ici…";

    const reveal = document.createElement('button');
    reveal.className = "btn ghost";
    reveal.textContent = "Voir correction";

    const ans = document.createElement('div');
    ans.className = "answer";
    ans.textContent = qq.answer || qq.expected || "";
    ans.hidden = true;

    reveal.addEventListener('click', ()=> ans.hidden = !ans.hidden);

    wrap.appendChild(qh);
    wrap.appendChild(ta);
    wrap.appendChild(reveal);
    wrap.appendChild(ans);
    vQuestions.appendChild(wrap);
  });
}

// ---------------- Questions ouvertes
const openList = document.getElementById('openList');
function renderOpen(){
  if(!openList) return;
  const oq = applyFilter((DATA.open_questions && DATA.open_questions.length) ? DATA.open_questions : (DATA.ouvertes || []));
  openList.innerHTML="";
  if(oq.length===0){
    openList.innerHTML = `<div class="item">Aucune question ouverte pour ce filtre.</div>`;
    return;
  }
  oq.forEach((o)=>{
    const d = document.createElement('div');
    d.className="item";
    const prompt = o.prompt || o.question;
    const oid = `${o.td}::${prompt}`;
    const on = isFav("open", oid);
    d.innerHTML = `<div class="itemTopRow"><div><b>${prompt}</b><div class="small muted">${o.td}</div></div><button class="starBtn ${on?"active":""}" type="button">${on?"⭐":"☆"}</button></div>`;
    d.querySelector("button")?.addEventListener("click",(e)=>{e.stopPropagation(); toggleFav("open", oid, {td:o.td, question:prompt, plan:(o.points||o.plan||[])}); renderOpen(); renderFav();});
    const points = o.points || o.plan || [];
    if(points.length){
      const ul = document.createElement('ul');
      ul.className="small bullets";
      points.forEach(p=>{
        const li = document.createElement('li');
        li.textContent = p;
        ul.appendChild(li);
      });
      d.appendChild(ul);
    }
    openList.appendChild(d);
  });
}

// ---------------- Fiches
const fichesList = document.getElementById('fichesList');
const ficheSearch = document.getElementById('ficheSearch');

function escapeHtml(s){
  return (s||"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}

function highlight(text, query){
  if(!query) return escapeHtml(text);
  const q = query.trim();
  if(!q) return escapeHtml(text);
  // simple case-insensitive highlight (no regex injection)
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`,'ig'));
  return parts.map(p => p.toLowerCase() === q.toLowerCase() ? `<mark>${escapeHtml(p)}</mark>` : escapeHtml(p)).join("");
}

function renderFiches(){
  if(!fichesList) return;
  const f = getFilter();
  const query = (ficheSearch?.value || "").trim();

  let fiches = DATA.fiches || [];
  if(f !== "ALL") fiches = fiches.filter(x => x.td === f);

  fichesList.innerHTML = "";
  if(!fiches.length){
    fichesList.innerHTML = `<div class="item">Aucune fiche pour ce filtre.</div>`;
    return;
  }

  fiches.forEach((fiche)=>{
    const wrap = document.createElement('div');
    wrap.className = "fiche";

    // header
    const top = document.createElement('div');
    top.className = "ficheTop";

    const left = document.createElement('div');
    left.innerHTML = `
      <div class="badge">📌 ${fiche.td}</div>
      <h3 class="ficheTitle">${escapeHtml(fiche.title || "")}</h3>
      <p class="ficheHint">Lis en diagonale → puis ouvre les sections utiles.</p>
    `;

    const right = document.createElement('div');
    right.innerHTML = `<div class="badge">🧠 Mode partiel</div>`;

    top.appendChild(left);
    top.appendChild(right);
    wrap.appendChild(top);

    // sections as accordion
    (fiche.sections || []).forEach((sec, idx)=>{
      const acc = document.createElement('div');
      acc.className = "acc";

      const btn = document.createElement('button');
      btn.className = "accBtn";
      btn.innerHTML = `<span>${escapeHtml(sec.h || "Section")}</span><span class="chev">⌄</span>`;

      const body = document.createElement('div');
      body.className = "accBody";

      const parts = [];

      if(sec.p){
        sec.p.forEach(par=>{
          const html = highlight(par, query);
          parts.push(`<p class="p">${html}</p>`);
        });
      }
      if(sec.bullets){
        const lis = sec.bullets.map(b => `<li>${highlight(b, query)}</li>`).join("");
        parts.push(`<ul class="bullets">${lis}</ul>`);
      }
      body.innerHTML = parts.join("");

      btn.addEventListener('click', ()=>{
        acc.classList.toggle('open');
        const chev = btn.querySelector('.chev');
        if(chev) chev.textContent = acc.classList.contains('open') ? "⌃" : "⌄";
      });

      // Auto-open if query matches
      if(query){
        const hay = JSON.stringify(sec).toLowerCase();
        if(hay.includes(query.toLowerCase())) acc.classList.add('open');
      }

      acc.appendChild(btn);
      acc.appendChild(body);
      wrap.appendChild(acc);
    });

    fichesList.appendChild(wrap);
  });
}

ficheSearch?.addEventListener('input', renderFiches);


// ---------------- Favorites (⭐ À revoir)
const FAV_KEY = "ue304_favorites_v1";
function loadFav(){ try{ return JSON.parse(localStorage.getItem(FAV_KEY) || "{}"); }catch{ return {}; } }
function saveFav(f){ localStorage.setItem(FAV_KEY, JSON.stringify(f)); }
function toggleFav(type, id, payload){
  const f = loadFav();
  f[type] = f[type] || {};
  if(f[type][id]) delete f[type][id];
  else f[type][id] = payload || true;
  saveFav(f);
}
function isFav(type, id){
  const f = loadFav();
  return !!(f[type] && f[type][id]);
}

const favCardsBox = document.getElementById("favCards");
const favVignettesBox = document.getElementById("favVignettes");
const favOpenBox = document.getElementById("favOpen");

function renderFav(){
  const f = loadFav();
  // Cards
  if(favCardsBox){
    favCardsBox.innerHTML = "";
    const obj = (f.cards || {});
    const ids = Object.keys(obj);
    if(!ids.length){ favCardsBox.innerHTML = `<div class="item">Rien pour l’instant ✨</div>`; }
    ids.forEach(id=>{
      const c = obj[id];
      const d = document.createElement("div");
      d.className="item";
      d.innerHTML = `<div class="itemTopRow"><div><b>${escapeHtml(c.front||"Flashcard")}</b><div class="small muted">${escapeHtml(c.td||"")}</div></div><button class="starBtn active" type="button">⭐</button></div>`;
      d.querySelector("button")?.addEventListener("click", (e)=>{ e.stopPropagation(); toggleFav("cards", id); renderFav(); updateCurrentStar(); });
      d.addEventListener("click", ()=>{
        // jump to flashcards + filter td
        if(tdFilter && c.td){ tdFilter.value = c.td; localStorage.setItem('ue304_tdFilter', tdFilter.value); }
        
// ---------------- Keyboard shortcuts
document.addEventListener("keydown", (e)=>{
  const tag = (document.activeElement?.tagName || "").toLowerCase();
  const typing = ["input","textarea","select"].includes(tag);

  if(!typing && (e.key === "ArrowLeft")){
    const active = document.querySelector(".panel.active")?.id;
    if(active === "cards"){ e.preventDefault(); showCard(cardIndex-1); }
  }
  if(!typing && (e.key === "ArrowRight")){
    const active = document.querySelector(".panel.active")?.id;
    if(active === "cards"){ e.preventDefault(); showCard(cardIndex+1); }
  }
  if(!typing && e.key === "/"){
    // focus fiche search if on fiches
    const active = document.querySelector(".panel.active")?.id;
    if(active === "fiches"){
      e.preventDefault();
      document.getElementById("ficheSearch")?.focus();
    }
  }
});


// ---------------- Pause (non-blocking) + timer + curve dot
function bindPauseAndCurve(){
  const pauseBtn = document.getElementById("togglePause");
  const pauseCard = document.getElementById("pauseCard");
  const timerDisplay = document.getElementById("timerDisplay");
  const startBtn = document.getElementById("startTimer");
  const resetBtn = document.getElementById("resetTimerBtn");
  const curveDot = document.getElementById("curveDot");

  // Pause toggle persisted
  if(pauseBtn && pauseCard){
    const key = "ue304_pause_open_v1";
    const open = localStorage.getItem(key) === "1";
    pauseCard.hidden = !open;
    pauseBtn.classList.toggle("active", open);

    pauseBtn.addEventListener("click", ()=>{
      const now = pauseCard.hidden;
      pauseCard.hidden = !now;
      pauseBtn.classList.toggle("active", now);
      localStorage.setItem(key, now ? "1" : "0");
    });
  }

  // Timer
  let left = 120;
  let handle = null;
  function fmt(sec){
    const m = String(Math.floor(sec/60)).padStart(2,"0");
    const s = String(sec%60).padStart(2,"0");
    return `${m}:${s}`;
  }
  function render(){ if(timerDisplay) timerDisplay.textContent = fmt(left); }
  render();

  startBtn?.addEventListener("click", ()=>{
    if(handle) return;
    handle = setInterval(()=>{
      left = Math.max(0, left-1);
      render();
      if(left===0){ clearInterval(handle); handle=null; }
    }, 1000);
  });
  resetBtn?.addEventListener("click", ()=>{
    if(handle){ clearInterval(handle); handle=null; }
    left = 120; render();
  });

  // Curve position helper stored globally for updateStats to call
  window.__setCurveDot = function(ratio){
    if(!curveDot) return;
    const r = Math.max(0, Math.min(1, ratio||0));
    const x = 10 + r * 78;
    const y = 46 - Math.sin(r * Math.PI * 2) * 14;
    curveDot.style.left = x + "%";
    curveDot.style.top = y + "%";
  };
}

reloadAll();
renderFav();

        setTab("cards");
        // find card index
        const idx = cards.findIndex(x => `${x.td}::${x.front}` === id);
        if(idx >= 0) showCard(idx);
      });
      favCardsBox.appendChild(d);
    });
  }

  // Vignettes
  if(favVignettesBox){
    favVignettesBox.innerHTML="";
    const obj = (f.vignettes || {});
    const ids = Object.keys(obj);
    if(!ids.length){ favVignettesBox.innerHTML = `<div class="item">Rien pour l’instant ✨</div>`; }
    ids.forEach(id=>{
      const v = obj[id];
      const d = document.createElement("div");
      d.className="item";
      d.innerHTML = `<div class="itemTopRow"><div><b>${escapeHtml(v.title||"Vignette")}</b><div class="small muted">${escapeHtml(v.td||"")}</div></div><button class="starBtn active" type="button">⭐</button></div>`;
      d.querySelector("button")?.addEventListener("click", (e)=>{ e.stopPropagation(); toggleFav("vignettes", id); renderFav(); });
      d.addEventListener("click", ()=>{
        if(tdFilter && v.td){ tdFilter.value = v.td; localStorage.setItem('ue304_tdFilter', tdFilter.value); }
        
// ---------------- Keyboard shortcuts
document.addEventListener("keydown", (e)=>{
  const tag = (document.activeElement?.tagName || "").toLowerCase();
  const typing = ["input","textarea","select"].includes(tag);

  if(!typing && (e.key === "ArrowLeft")){
    const active = document.querySelector(".panel.active")?.id;
    if(active === "cards"){ e.preventDefault(); showCard(cardIndex-1); }
  }
  if(!typing && (e.key === "ArrowRight")){
    const active = document.querySelector(".panel.active")?.id;
    if(active === "cards"){ e.preventDefault(); showCard(cardIndex+1); }
  }
  if(!typing && e.key === "/"){
    // focus fiche search if on fiches
    const active = document.querySelector(".panel.active")?.id;
    if(active === "fiches"){
      e.preventDefault();
      document.getElementById("ficheSearch")?.focus();
    }
  }
});


// ---------------- Pause (non-blocking) + timer + curve dot
function bindPauseAndCurve(){
  const pauseBtn = document.getElementById("togglePause");
  const pauseCard = document.getElementById("pauseCard");
  const timerDisplay = document.getElementById("timerDisplay");
  const startBtn = document.getElementById("startTimer");
  const resetBtn = document.getElementById("resetTimerBtn");
  const curveDot = document.getElementById("curveDot");

  // Pause toggle persisted
  if(pauseBtn && pauseCard){
    const key = "ue304_pause_open_v1";
    const open = localStorage.getItem(key) === "1";
    pauseCard.hidden = !open;
    pauseBtn.classList.toggle("active", open);

    pauseBtn.addEventListener("click", ()=>{
      const now = pauseCard.hidden;
      pauseCard.hidden = !now;
      pauseBtn.classList.toggle("active", now);
      localStorage.setItem(key, now ? "1" : "0");
    });
  }

  // Timer
  let left = 120;
  let handle = null;
  function fmt(sec){
    const m = String(Math.floor(sec/60)).padStart(2,"0");
    const s = String(sec%60).padStart(2,"0");
    return `${m}:${s}`;
  }
  function render(){ if(timerDisplay) timerDisplay.textContent = fmt(left); }
  render();

  startBtn?.addEventListener("click", ()=>{
    if(handle) return;
    handle = setInterval(()=>{
      left = Math.max(0, left-1);
      render();
      if(left===0){ clearInterval(handle); handle=null; }
    }, 1000);
  });
  resetBtn?.addEventListener("click", ()=>{
    if(handle){ clearInterval(handle); handle=null; }
    left = 120; render();
  });

  // Curve position helper stored globally for updateStats to call
  window.__setCurveDot = function(ratio){
    if(!curveDot) return;
    const r = Math.max(0, Math.min(1, ratio||0));
    const x = 10 + r * 78;
    const y = 46 - Math.sin(r * Math.PI * 2) * 14;
    curveDot.style.left = x + "%";
    curveDot.style.top = y + "%";
  };
}

reloadAll();
renderFav();

        setTab("vignettes");
        // open
        const found = (applyFilter(DATA.vignettes || [])).find(x => `${x.td}::${x.title}` === id);
        if(found) openVignette(found);
      });
      favVignettesBox.appendChild(d);
    });
  }

  // Open questions
  if(favOpenBox){
    favOpenBox.innerHTML="";
    const obj = (f.open || {});
    const ids = Object.keys(obj);
    if(!ids.length){ favOpenBox.innerHTML = `<div class="item">Rien pour l’instant ✨</div>`; }
    ids.forEach(id=>{
      const o = obj[id];
      const d = document.createElement("div");
      d.className="item";
      d.innerHTML = `<div class="itemTopRow"><div><b>${escapeHtml(o.question||"Question")}</b><div class="small muted">${escapeHtml(o.td||"")}</div></div><button class="starBtn active" type="button">⭐</button></div>`;
      d.querySelector("button")?.addEventListener("click", (e)=>{ e.stopPropagation(); toggleFav("open", id); renderFav(); });
      d.addEventListener("click", ()=>{
        if(tdFilter && o.td){ tdFilter.value = o.td; localStorage.setItem('ue304_tdFilter', tdFilter.value); }
        
// ---------------- Keyboard shortcuts
document.addEventListener("keydown", (e)=>{
  const tag = (document.activeElement?.tagName || "").toLowerCase();
  const typing = ["input","textarea","select"].includes(tag);

  if(!typing && (e.key === "ArrowLeft")){
    const active = document.querySelector(".panel.active")?.id;
    if(active === "cards"){ e.preventDefault(); showCard(cardIndex-1); }
  }
  if(!typing && (e.key === "ArrowRight")){
    const active = document.querySelector(".panel.active")?.id;
    if(active === "cards"){ e.preventDefault(); showCard(cardIndex+1); }
  }
  if(!typing && e.key === "/"){
    // focus fiche search if on fiches
    const active = document.querySelector(".panel.active")?.id;
    if(active === "fiches"){
      e.preventDefault();
      document.getElementById("ficheSearch")?.focus();
    }
  }
});


// ---------------- Pause (non-blocking) + timer + curve dot
function bindPauseAndCurve(){
  const pauseBtn = document.getElementById("togglePause");
  const pauseCard = document.getElementById("pauseCard");
  const timerDisplay = document.getElementById("timerDisplay");
  const startBtn = document.getElementById("startTimer");
  const resetBtn = document.getElementById("resetTimerBtn");
  const curveDot = document.getElementById("curveDot");

  // Pause toggle persisted
  if(pauseBtn && pauseCard){
    const key = "ue304_pause_open_v1";
    const open = localStorage.getItem(key) === "1";
    pauseCard.hidden = !open;
    pauseBtn.classList.toggle("active", open);

    pauseBtn.addEventListener("click", ()=>{
      const now = pauseCard.hidden;
      pauseCard.hidden = !now;
      pauseBtn.classList.toggle("active", now);
      localStorage.setItem(key, now ? "1" : "0");
    });
  }

  // Timer
  let left = 120;
  let handle = null;
  function fmt(sec){
    const m = String(Math.floor(sec/60)).padStart(2,"0");
    const s = String(sec%60).padStart(2,"0");
    return `${m}:${s}`;
  }
  function render(){ if(timerDisplay) timerDisplay.textContent = fmt(left); }
  render();

  startBtn?.addEventListener("click", ()=>{
    if(handle) return;
    handle = setInterval(()=>{
      left = Math.max(0, left-1);
      render();
      if(left===0){ clearInterval(handle); handle=null; }
    }, 1000);
  });
  resetBtn?.addEventListener("click", ()=>{
    if(handle){ clearInterval(handle); handle=null; }
    left = 120; render();
  });

  // Curve position helper stored globally for updateStats to call
  window.__setCurveDot = function(ratio){
    if(!curveDot) return;
    const r = Math.max(0, Math.min(1, ratio||0));
    const x = 10 + r * 78;
    const y = 46 - Math.sin(r * Math.PI * 2) * 14;
    curveDot.style.left = x + "%";
    curveDot.style.top = y + "%";
  };
}

reloadAll();
renderFav();

        setTab("ouvertes");
        // scroll to item (simple: find matching text)
        setTimeout(()=>{
          const el = Array.from(document.querySelectorAll("#openList .item b")).find(b => (b.textContent||"") === o.question);
          el?.scrollIntoView({behavior:"smooth", block:"center"});
        }, 60);
      });
      favOpenBox.appendChild(d);
    });
  }
}


// ---------------- Reload all
function reloadAll(){
  cards = applyFilter(DATA.flashcards || []);
  showCard(0);

  // support both schemas (mcq / qcm)
  qcms = applyFilter((DATA.mcq && DATA.mcq.length) ? DATA.mcq : (DATA.qcm || []));
  pickRandomQcm();

  renderVignettes();
  renderOpen();
  renderFiches();
}


// ---------------- Keyboard shortcuts
document.addEventListener("keydown", (e)=>{
  const tag = (document.activeElement?.tagName || "").toLowerCase();
  const typing = ["input","textarea","select"].includes(tag);

  if(!typing && (e.key === "ArrowLeft")){
    const active = document.querySelector(".panel.active")?.id;
    if(active === "cards"){ e.preventDefault(); showCard(cardIndex-1); }
  }
  if(!typing && (e.key === "ArrowRight")){
    const active = document.querySelector(".panel.active")?.id;
    if(active === "cards"){ e.preventDefault(); showCard(cardIndex+1); }
  }
  if(!typing && e.key === "/"){
    // focus fiche search if on fiches
    const active = document.querySelector(".panel.active")?.id;
    if(active === "fiches"){
      e.preventDefault();
      document.getElementById("ficheSearch")?.focus();
    }
  }
});


// ---------------- Pause (non-blocking) + timer + curve dot
function bindPauseAndCurve(){
  const pauseBtn = document.getElementById("togglePause");
  const pauseCard = document.getElementById("pauseCard");
  const timerDisplay = document.getElementById("timerDisplay");
  const startBtn = document.getElementById("startTimer");
  const resetBtn = document.getElementById("resetTimerBtn");
  const curveDot = document.getElementById("curveDot");

  // Pause toggle persisted
  if(pauseBtn && pauseCard){
    const key = "ue304_pause_open_v1";
    const open = localStorage.getItem(key) === "1";
    pauseCard.hidden = !open;
    pauseBtn.classList.toggle("active", open);

    pauseBtn.addEventListener("click", ()=>{
      const now = pauseCard.hidden;
      pauseCard.hidden = !now;
      pauseBtn.classList.toggle("active", now);
      localStorage.setItem(key, now ? "1" : "0");
    });
  }

  // Timer
  let left = 120;
  let handle = null;
  function fmt(sec){
    const m = String(Math.floor(sec/60)).padStart(2,"0");
    const s = String(sec%60).padStart(2,"0");
    return `${m}:${s}`;
  }
  function render(){ if(timerDisplay) timerDisplay.textContent = fmt(left); }
  render();

  startBtn?.addEventListener("click", ()=>{
    if(handle) return;
    handle = setInterval(()=>{
      left = Math.max(0, left-1);
      render();
      if(left===0){ clearInterval(handle); handle=null; }
    }, 1000);
  });
  resetBtn?.addEventListener("click", ()=>{
    if(handle){ clearInterval(handle); handle=null; }
    left = 120; render();
  });

  // Curve position helper stored globally for updateStats to call
  window.__setCurveDot = function(ratio){
    if(!curveDot) return;
    const r = Math.max(0, Math.min(1, ratio||0));
    const x = 10 + r * 78;
    const y = 46 - Math.sin(r * Math.PI * 2) * 14;
    curveDot.style.left = x + "%";
    curveDot.style.top = y + "%";
  };
}

reloadAll();
renderFav();



try{ bindPauseAndCurve(); }catch(e){ console.warn('Pause/curve bind failed', e); }


// --------- Robust progress animation ----------
function animateProgress(done, total){
  const fill = document.getElementById("curveFill");
  if(!fill) return;
  const pct = Math.round((done / Math.max(1,total)) * 100);
  fill.style.width = pct + "%";
}

// Patch updateStats to animate curve
if(typeof updateStats === "function"){
  const _oldUpdateStats = updateStats;
  updateStats = function(){
    _oldUpdateStats();
    try{
      const p = loadProg();
      const ids = cards.map(c => `${c.td}::${c.front}`);
      const known = ids.filter(id => p[id] === "known").length;
      animateProgress(known, ids.length);
    }catch(e){}
  }
}

// --------- Pause motivation message ----------
const MOTIVATIONS = [
  "Tu as pris soin de toi. C’est aussi ça, bien travailler 🌱",
  "Reprendre doucement, c’est déjà avancer.",
  "Une pause bien faite vaut mieux qu’une heure épuisée.",
  "Tu peux être fière de t’être arrêtée au bon moment.",
  "Respirer, c’est aussi faire progresser ton cerveau."
];

function showMotivation(){
  let box = document.getElementById("motivationBox");
  if(!box){
    box = document.createElement("div");
    box.id = "motivationBox";
    box.className = "motivation";
    box.textContent = MOTIVATIONS[Math.floor(Math.random()*MOTIVATIONS.length)];
    const pauseCard = document.getElementById("pauseCard");
    if(pauseCard) pauseCard.appendChild(box);
  }else{
    box.textContent = MOTIVATIONS[Math.floor(Math.random()*MOTIVATIONS.length)];
  }
}

// Hook timer end
if(typeof bindPauseAndCurve === "function"){
  const _oldBind = bindPauseAndCurve;
  bindPauseAndCurve = function(){
    _oldBind();
    const startBtn = document.getElementById("startTimer");
    const resetBtn = document.getElementById("resetTimerBtn");
    let timerCheck = setInterval(()=>{
      const display = document.getElementById("timerDisplay");
      if(display && display.textContent === "00:00"){
        showMotivation();
        clearInterval(timerCheck);
      }
    }, 500);
  }
}
