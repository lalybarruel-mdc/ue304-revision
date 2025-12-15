const DATA = window.REVISION_DATA;

const tdFilter = document.getElementById("tdFilter");
const tabs = [...document.querySelectorAll(".tab")];
const panels = [...document.querySelectorAll(".panel")];

function setTab(id){
  tabs.forEach(t => t.classList.toggle("active", t.dataset.tab === id));
  panels.forEach(p => p.classList.toggle("active", p.id === id));
}
tabs.forEach(t => t.addEventListener("click", () => setTab(t.dataset.tab)));

(function buildFilter(){
  const all = document.createElement("option");
  all.value="ALL"; all.textContent="Tous (TD1→TD5)";
  tdFilter.appendChild(all);

  DATA.tds.forEach(td => {
    const o=document.createElement("option");
    o.value=td.id;
    o.textContent=`${td.id} – ${td.name}`;
    tdFilter.appendChild(o);
  });

  tdFilter.value = localStorage.getItem("ue304_tdFilter") || "ALL";
})();
tdFilter.addEventListener("change", () => {
  localStorage.setItem("ue304_tdFilter", tdFilter.value);
  reloadAll();
});

function applyFilter(items){
  const f = tdFilter.value;
  return f==="ALL" ? items : items.filter(x => x.td === f);
}

/* ---------------- Flashcards ---------------- */
let cards=[], i=0;
const flashcard=document.getElementById("flashcard");
const front=document.getElementById("cardFront");
const back=document.getElementById("cardBack");
const counter=document.getElementById("cardCounter");
const stats=document.getElementById("knownStats");

const KEY="ue304_flashcard_progress_v1";
const load=()=>{ try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch{return {}} };
const save=(p)=>localStorage.setItem(KEY, JSON.stringify(p));
const idOf=(c)=>`${c.td}::${c.front}`;

function updateStats(){
  const p=load();
  const ids=cards.map(idOf);
  const known=ids.filter(x=>p[x]==="known").length;
  const unk=ids.filter(x=>p[x]==="unknown").length;
  stats.textContent=`Progression: ${known} connus ✅ • ${unk} à revoir 🔁 • ${ids.length-known-unk} non classés`;
}

function show(k){
  if(cards.length===0){
    front.textContent="Aucune flashcard pour ce filtre.";
    back.textContent="";
    counter.textContent="";
    stats.textContent="";
    flashcard.classList.remove("flipped");
    return;
  }
  i=(k+cards.length)%cards.length;
  const c=cards[i];
  front.textContent=c.front;
  back.textContent=c.back;
  counter.textContent=`${i+1} / ${cards.length} • ${c.td}`;
  flashcard.classList.remove("flipped");
  updateStats();
}

flashcard.addEventListener("click", ()=>flashcard.classList.toggle("flipped"));
flashcard.addEventListener("keydown",(e)=>{
  if(e.code==="Space"||e.code==="Enter"){ e.preventDefault(); flashcard.classList.toggle("flipped"); }
});

document.getElementById("prevCard").addEventListener("click", ()=>show(i-1));
document.getElementById("nextCard").addEventListener("click", ()=>show(i+1));

function mark(v){
  if(cards.length===0) return;
  const p=load();
  p[idOf(cards[i])] = v;
  save(p);
  show(i+1);
}
document.getElementById("markKnown").addEventListener("click", ()=>mark("known"));
document.getElementById("markUnknown").addEventListener("click", ()=>mark("unknown"));
document.getElementById("resetProgress").addEventListener("click", ()=>{
  localStorage.removeItem(KEY);
  updateStats();
});

/* ---------------- QCM ---------------- */
let qcms=[], qi=0;
const qCount=document.getElementById("qcmCounter");
const qText=document.getElementById("qcmQuestion");
const qOpts=document.getElementById("qcmOptions");
const qFb=document.getElementById("qcmFeedback");

function newQ(){
  if(qcms.length===0){
    qCount.textContent="";
    qText.textContent="Aucun QCM pour ce filtre.";
    qOpts.innerHTML="";
    qFb.textContent="";
    return;
  }
  qi=Math.floor(Math.random()*qcms.length);
  const q=qcms[qi];
  qCount.textContent=`${q.td} • ${qcms.length} questions`;
  qText.textContent=q.q;
  qFb.textContent="";
  qOpts.innerHTML="";
  q.options.forEach((o,idx)=>{
    const b=document.createElement("button");
    b.className="opt";
    b.textContent=o;
    b.onclick=()=>grade(idx);
    qOpts.appendChild(b);
  });
}
function grade(ch){
  const q=qcms[qi];
  const btns=[...qOpts.querySelectorAll(".opt")];
  btns.forEach((b,idx)=>{
    b.disabled=true;
    if(idx===q.answer) b.classList.add("correct");
    if(idx===ch && ch!==q.answer) b.classList.add("wrong");
  });
  qFb.textContent = q.explanation || (ch===q.answer ? "✅ Correct." : "❌ Incorrect.");
}
document.getElementById("newQcm").addEventListener("click", newQ);

/* ---------------- Vignettes ---------------- */
const vList=document.getElementById("vignetteList");
const vBox=document.getElementById("vignetteBox");
const vTitle=document.getElementById("vTitle");
const vCase=document.getElementById("vCase");
const vQs=document.getElementById("vQuestions");

document.getElementById("backToVignettes").addEventListener("click", ()=>{
  vBox.hidden=true; vList.hidden=false;
});

function renderV(){
  const vs=applyFilter(DATA.vignettes);
  vList.innerHTML="";
  vBox.hidden=true; vList.hidden=false;
  if(vs.length===0){
    vList.innerHTML='<div class="item">Aucune vignette pour ce filtre.</div>';
    return;
  }
  vs.forEach(v=>{
    const d=document.createElement("div");
    d.className="item";
    d.innerHTML=`<b>${v.title}</b><div class="small muted">${v.td}</div>`;
    d.onclick=()=>openV(v);
    vList.appendChild(d);
  });
}
function openV(v){
  vList.hidden=true; vBox.hidden=false;
  vTitle.textContent=`${v.title} (${v.td})`;
  vCase.textContent=v.case;
  vQs.innerHTML="";
  v.questions.forEach((qq,idx)=>{
    const wrap=document.createElement("div");
    wrap.style.marginTop="12px";
    wrap.innerHTML=`<div><b>Q${idx+1}.</b> ${qq.q}</div>`;
    const ta=document.createElement("textarea");
    ta.placeholder="Écris ta réponse ici…";
    const btn=document.createElement("button");
    btn.className="btn ghost";
    btn.textContent="Voir correction";
    const ans=document.createElement("div");
    ans.className="answer";
    ans.textContent=qq.answer;
    ans.hidden=true;
    btn.onclick=()=>ans.hidden=!ans.hidden;
    wrap.appendChild(ta); wrap.appendChild(btn); wrap.appendChild(ans);
    vQs.appendChild(wrap);
  });
}

/* ---------------- Questions ouvertes ---------------- */
const oList=document.getElementById("openList");
function renderO(){
  const os=applyFilter(DATA.open_questions);
  oList.innerHTML="";
  if(os.length===0){
    oList.innerHTML='<div class="item">Aucune question ouverte pour ce filtre.</div>';
    return;
  }
  os.forEach(o=>{
    const d=document.createElement("div");
    d.className="item";
    d.innerHTML=`<b>${o.prompt}</b><div class="small muted">${o.td}</div>`;
    const ul=document.createElement("ul");
    ul.className="small";
    o.points.forEach(p=>{
      const li=document.createElement("li");
      li.textContent=p;
      ul.appendChild(li);
    });
    d.appendChild(ul);
    oList.appendChild(d);
  });
}

/* ---------------- Reload ---------------- */
function reloadAll(){
  cards=applyFilter(DATA.flashcards);
  show(0);
  qcms=applyFilter(DATA.mcq);
  newQ();
  renderV();
  renderO();
}
reloadAll();
