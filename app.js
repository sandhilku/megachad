
// ===================== DATA =====================
const PLAN = [
  {
    name: "Day 1 — Pull",
    focus: "Back, Biceps & Forearms",
    type: "pull",
    exercises: [
      { name: "T-Bar Row", sets: 3, reps: "8–12" },
      { name: "Lat Pulldown", sets: 3, reps: "8–12" },
      { name: "Single-Arm Cable Row", sets: 3, reps: "10–12" },
      { name: "Single-Arm Dumbbell Preacher Curl", sets: 3, reps: "10–12" },
      { name: "Reverse Cable Curl", sets: 3, reps: "10–12" },
      { name: "Cable Forearm Curls", sets: 3, reps: "15–20" },
    ]
  },
  {
    name: "Day 2 — Push",
    focus: "Chest, Shoulders & Triceps",
    type: "push",
    exercises: [
      { name: "Bench Press", sets: 3, reps: "8–12" },
      { name: "Incline Press", sets: 3, reps: "8–12" },
      { name: "Pec Deck Fly", sets: 3, reps: "12–15" },
      { name: "Shoulder Press", sets: 3, reps: "8–12" },
      { name: "Lateral Raise", sets: 3, reps: "12–15" },
      { name: "Rear Delt Cable Fly", sets: 3, reps: "12–15" },
      { name: "Seated Tricep Extension", sets: 3, reps: "10–15" },
      { name: "Overhead Tricep Extension", sets: 3, reps: "10–15" },
    ]
  },
  {
    name: "Day 3 — Legs",
    focus: "Quads, Hamstrings, Glutes & Core",
    type: "legs",
    exercises: [
      { name: "RDL", sets: 3, reps: "8–12" },
      { name: "Leg Press", sets: 3, reps: "8–12" },
      { name: "Leg Extension", sets: 3, reps: "10–15" },
      { name: "Leg Curl", sets: 3, reps: "10–15" },
      { name: "Hip Abduction Machine", sets: 3, reps: "15–20" },
      { name: "Hip Adduction Machine", sets: 3, reps: "15–20" },
      { name: "Calf Raises", sets: 3, reps: "12–15" },
      { name: "Cable Crunches", sets: 3, reps: "12–15" },
    ]
  },
  {
    name: "Day 4 — Upper",
    focus: "Chest, Shoulders, Back & Arms",
    type: "upper",
    exercises: [
      { name: "Pec Deck Fly", sets: 3, reps: "12–15" },
      { name: "Incline Press", sets: 3, reps: "8–12" },
      { name: "Shoulder Press", sets: 3, reps: "8–12" },
      { name: "T-Bar Row", sets: 3, reps: "8–12" },
      { name: "Lat Pulldown", sets: 3, reps: "8–12" },
      { name: "Single-Arm Dumbbell Preacher Curl", sets: 3, reps: "10–12" },
      { name: "Seated Tricep Extension", sets: 3, reps: "10–15" },
    ]
  },
  {
    name: "Day 5 — Legs",
    focus: "Quads, Hamstrings, Glutes & Core",
    type: "legs",
    exercises: [
      { name: "RDL", sets: 3, reps: "8–12" },
      { name: "Leg Press", sets: 3, reps: "8–12" },
      { name: "Leg Extension", sets: 3, reps: "10–15" },
      { name: "Leg Curl", sets: 3, reps: "10–15" },
      { name: "Hip Abduction Machine", sets: 3, reps: "15–20" },
      { name: "Hip Adduction Machine", sets: 3, reps: "15–20" },
      { name: "Calf Raises", sets: 3, reps: "12–15" },
      { name: "Cable Crunches", sets: 3, reps: "12–15" },
    ]
  },
  {
    name: "Day 6 — Rest",
    focus: "Recovery & Mobility",
    type: "rest",
    exercises: []
  },
  {
    name: "Day 7 — Rest",
    focus: "Recovery & Mobility",
    type: "rest",
    exercises: []
  }
];

const TYPE_TAGS = {
  pull: { cls: "tag-pull", label: "PULL" },
  push: { cls: "tag-push", label: "PUSH" },
  legs: { cls: "tag-legs", label: "LEGS" },
  upper: { cls: "tag-upper", label: "UPPER" },
  optional: { cls: "tag-optional", label: "OPTIONAL" },
  rest: { cls: "tag-rest", label: "REST" },
};

// Storage helpers
function save(key,val) {
  try { localStorage.setItem(key,JSON.stringify(val)); return true; }
  catch { storageWarning=true; toast('Storage unavailable or full. Export a backup before closing.'); throw Error('Could not save to browser storage'); }
}
function load(key,def) {
  try {
    const value=JSON.parse(localStorage.getItem(key)); if(value==null)return def;
    if(Array.isArray(def)&&!Array.isArray(value))return def;
    if(key==='history')return validateHistory(value);
    if(key==='currentDay')return Number.isInteger(value)&&value>=0?value:0;
    if(key==='weightUnit')return ['kg','lbs'].includes(value)?value:'kg';
    if(key==='planName')return typeof value==='string'&&value.trim()?value:'Big Boy Plan';
    if(key==='bodyweight')return Number.isFinite(Number(value))&&Number(value)>0?Number(value):def;
    if(key==='bodyweightLog')return value.filter(p=>p&&Number.isFinite(Date.parse(p.date))&&Number.isFinite(Number(p.weight))&&Number(p.weight)>0);
    if(key==='prs' && (typeof value!=='object'||Array.isArray(value)))return def;
    return value;
  } catch { return def; }
}

// Local-timezone-safe date key (avoids UTC off-by-one bugs from toISOString())
function localDateKey(d) {
  if(typeof d==='string' && /^\d{4}-\d{2}-\d{2}$/.test(d))return d;
  const dt=d instanceof Date?d:new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
}

function getCurrentBodyweight() { return load('bodyweight', null); }

// ===================== UNITS =====================
let weightUnit = load('weightUnit', 'kg'); // 'kg' | 'lbs' — canonical storage is always kg
function kgToLbs(kg) { return Math.round(kg * 2.20462 * 100) / 100; }
function lbsToKg(lbs) { return Math.round((lbs / 2.20462) * 100) / 100; }
function toDisplayWeight(kg) {
  if (kg === '' || kg === null || kg === undefined || isNaN(kg)) return '';
  const n = parseFloat(kg);
  return weightUnit === 'lbs' ? kgToLbs(n) : Math.round(n * 100) / 100;
}
function fromDisplayWeight(val) {
  if (val === '' || val === null || val === undefined || isNaN(val)) return '';
  const n = parseFloat(val);
  return weightUnit === 'lbs' ? lbsToKg(n) : Math.round(n * 100) / 100;
}
function setWeightUnit(unit) {
  if(!['kg','lbs'].includes(unit))return;save('weightUnit',unit);weightUnit=unit;renderSettings();
  const active=document.querySelector('.page.active');if(active)showPage(active.id.slice(5));
}

function getLastSession(name) {
  const history = load('history', []);
  const sorted = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
  for (const w of sorted) {
    const ex = w.exercises.find(e => e.name === name);
    if (ex) {
      const validSets = ex.sets.filter(validSet);
      if (validSets.length > 0) return { date: w.date, sets: validSets };
    }
  }
  return null;
}

// ===================== SETTINGS =====================
function renderSettings() {
  const bw = getCurrentBodyweight();
  document.getElementById('settings-bw-input').placeholder=`Weight (${weightUnit})`;
  document.getElementById('settings-bw-current').textContent =
    bw ? `Current: ${toDisplayWeight(bw)}${weightUnit}` : 'No body weight logged yet';

  const unitToggle = document.getElementById('settings-unit-toggle');
  if (unitToggle) {
    unitToggle.innerHTML = ['kg', 'lbs'].map(u => `
      <button class="filter-chip ${weightUnit === u ? 'active' : ''}" onclick="setWeightUnit('${u}')">${u.toUpperCase()}</button>
    `).join('');
  }

  const notifyStatus = document.getElementById('settings-notify-status');
  if (notifyStatus) {
    if (!('Notification' in window)) {
      notifyStatus.textContent = 'Not supported in this browser';
    } else if (Notification.permission === 'granted') {
      notifyStatus.textContent = '✓ Enabled';
    } else if (Notification.permission === 'denied') {
      notifyStatus.textContent = 'Blocked — re-enable it in your browser/site settings';
    } else {
      notifyStatus.textContent = 'Not enabled yet';
    }
  }
}

function enableRestNotifications() {
  if(!('Notification' in window)){toast('Notifications are not supported here');return;}
  Notification.requestPermission().then(()=>{notifyPermissionAsked=true;save('notifyPermissionAsked',true);renderSettings();toast(Notification.permission==='granted'?'Notifications enabled':'Notifications not granted — check browser settings');}).catch(()=>toast('Notifications require a supported, secure browser context'));
}

function convertFromKg(val) {
  const lbsInput = document.getElementById('conv-lbs');
  if (val === '' || isNaN(val)) { lbsInput.value = ''; return; }
  lbsInput.value = kgToLbs(parseFloat(val));
}

function convertFromLbs(val) {
  const kgInput = document.getElementById('conv-kg');
  if (val === '' || isNaN(val)) { kgInput.value = ''; return; }
  kgInput.value = lbsToKg(parseFloat(val));
}

function saveBodyweight() {
  const input=document.getElementById('settings-bw-input'),weight=Number(fromDisplayWeight(input.value));if(!input.value.trim()||!Number.isFinite(weight)||weight<=0){toast('Enter a valid weight above zero');return;}
  if(!persistWeightEntries([...getWeightEntries(),{id:uid(),date:new Date().toISOString(),weight}]))return;input.value='';renderSettings();toast('Weight logged — view it in Body Weight');
}

function exportData() {
  const drafts=getDrafts(),day=getSessionDay();drafts[day.id]=Object.fromEntries(day.exercises.map((e,i)=>[e.id,copy(setData[i]||[])]));
  const data={version:5,exportedAt:new Date().toISOString(),trackingStartedOn:load('trackingStartedOn',null),sessionOverrides:readSessionOverrides(),weeklyGoals:readWeeklyGoals(),history:load('history',[]),prs:load('prs',{}),customPlan:getActivePlan(),planName:load('planName','Big Boy Plan'),bodyweight:load('bodyweight',null),bodyweightLog:load('bodyweightLog',[]),weightUnit,currentDay,workoutDrafts:drafts};
  const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=`workout-backup-${localDateKey(new Date())}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Backup exported');
}

function importData(event) {
  const file=event.target.files?.[0];if(!file)return;event.target.value='';
  if(file.size>10000000){toast('Backup is too large (maximum 10 MB)');return;}
  file.text().then(text=>{
    let checked;try{checked=validateBackup(JSON.parse(text));}catch(error){toast('Import cancelled: '+error.message);return;}
    if(!confirm('Replace local workout data with this backup? Export your current data first if needed.'))return;
    const before={};try{
      for(const key of Object.keys(checked))before[key]=localStorage.getItem(key);
      before.prs=localStorage.getItem('prs');
      Object.entries(checked).forEach(([k,v])=>save(k,v));recomputePRs();weightUnit=checked.weightUnit;currentDay=checked.currentDay;setData={};renderPlan();renderToday();renderSettings();const active=document.querySelector('.page.active');if(active)showPage(active.id.slice(5));toast('Backup imported');
    }catch{Object.entries(before).forEach(([k,v])=>{try{v==null?localStorage.removeItem(k):localStorage.setItem(k,v);}catch{}});toast('Import could not be saved; previous data was restored');}
  }).catch(()=>toast('Could not read backup file'));
}

function resetPlanToDefault() {
  if(!confirm('Restore the original plan? History is kept; current plan drafts are cleared.'))return;
  save('customPlan',validatePlan(copy(PLAN)));save('planName','Big Boy Plan');save('workoutDrafts',{});setData={};currentDay=0;save('currentDay',0);renderPlan();renderToday();toast('Original plan restored');
}

// State
let currentDay = load('currentDay', 0);
let setData = {}; // exercise -> sets array [{weight, reps, done}]
let modalCb = null;

// ===================== NAV =====================
function showPage(id) {
  const page=document.getElementById('page-'+id);if(!page)return;
  document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p===page));
  document.querySelectorAll('.nav-tab').forEach(b=>b.classList.toggle('active',b.dataset.page===id));
  ({today:renderToday,history:renderHistory,calendar:renderCalendar,prs:renderPRs,stats:renderStats,progress:renderProgress,bodyweight:renderBodyweight,plan:renderPlan,settings:renderSettings})[id]?.();
}

// ===================== TODAY =====================
function openDayPicker() {
  const modal = document.getElementById('day-picker-modal');
  const list = document.getElementById('day-picker-list');
  list.innerHTML = getActivePlan().map((day, i) => {
    const tag = TYPE_TAGS[day.type] || TYPE_TAGS.custom;
    const isSelected = i === currentDay;
    return `
      <div class="day-picker-item ${isSelected ? 'selected' : ''}" onclick="selectDay(${i})">
        <div class="day-picker-num">${i + 1}</div>
        <div class="day-picker-info">
          <div class="day-picker-name">${h(day.name)}</div>
          <div class="day-picker-focus">${h(day.focus)}</div>
        </div>
        <span class="day-tag ${tag.cls}">${tag.label}</span>
      </div>`;
  }).join('');
  modal.classList.add('open');
}

function closeDayPicker(e) {
  document.getElementById('day-picker-modal').classList.remove('open');
}

function selectDay(i) {
  if(!getActivePlan()[i])return;persistDraft();currentDay=i;save('currentDay',i);closeDayPicker();renderToday();
}

function renderToday() {
  const openCards=[...document.querySelectorAll('.exercise-card.open')].map(c=>Number(c.id.replace('ex-card-','')));
  restoreDraft();
  const day = getSessionDay();
  renderCatchupSuggestion();
  document.querySelector('.save-btn').disabled=day.exercises.length===0;
  document.getElementById('today-day-name').textContent = day.name;
  document.getElementById('today-day-focus').textContent = day.focus;
  const tag = TYPE_TAGS[day.type] || TYPE_TAGS.custom;
  const tagEl = document.getElementById('today-day-tag');
  tagEl.className = 'day-tag ' + tag.cls;
  tagEl.textContent = tag.label;

  const list = document.getElementById('exercise-list');
  if (day.exercises.length === 0) {
    list.innerHTML = `<div class="empty"><div class="empty-icon">😴</div><div>${day.type==='rest'?'Recovery day. Sleep, eat, recover.':'No exercises yet. Add them in the Plan tab.'}</div></div>`;
    return;
  }

  list.innerHTML = day.exercises.map((ex, ei) => {
    const pr = getPR(ex.name);
    const prHint = pr ? `<div class="pr-hint">🏆 PR: ${toDisplayWeight(pr.weight)}${weightUnit} × ${pr.reps} reps</div>` : '';
    const last = getLastSession(ex.name);
    const lastHint = last ? `<div class="pr-hint" style="color:var(--accent2);border-color:#4fffff30;background:#4fffff10;">⏱ Last: ${last.sets.map(s => `${toDisplayWeight(s.weight)}×${s.reps}`).join(', ')}</div>` : '';
    const setsHTML = buildSetsHTML(ex, ei, last);
    return `
      <div class="exercise-card ${openCards.includes(ei)?'open':''} ${(setData[ei]||[]).every(s=>s.done)?'completed':''}" id="ex-card-${ei}">
        <div class="exercise-header" onclick="toggleEx(${ei})">
          <button type="button" class="ex-check" aria-label="Mark exercise complete" onclick="event.stopPropagation();markDone(${ei})"></button>
          <div class="ex-info">
            <div class="ex-name">${h(ex.name)}</div>
            <div class="ex-sets">${ex.sets} sets × ${h(ex.reps)}</div>
          </div>
          <button type="button" class="ex-toggle" aria-label="Expand or collapse sets" onclick="event.stopPropagation();toggleEx(${ei})">⌄</button>
        </div>
        <div class="sets-panel">
          ${prHint}
          ${lastHint}
          <div class="set-labels">
            <div class="set-label">#</div>
            <div class="set-label">Weight (${weightUnit})</div>
            <div class="set-label">Reps</div>
            <div class="set-label">✓</div>
          </div>
          ${setsHTML}
        </div>
      </div>`;
  }).join('');
}

function buildSetsHTML(ex, ei, last) {
  if (!setData[ei]) setData[ei] = Array.from({length: ex.sets}, () => ({ weight: '', reps: '', done: false }));
  return setData[ei].map((s, si) => {
    const lastSet = last && last.sets[si];
    const wPlaceholder = lastSet ? toDisplayWeight(lastSet.weight) : weightUnit;
    const rPlaceholder = lastSet ? lastSet.reps : 'reps';
    const displayWeight = s.weight === '' ? '' : toDisplayWeight(s.weight);
    return `
    <div class="set-row">
      <div class="set-num">${si+1}</div>
      <div class="weight-input-wrap">
        <input class="set-input" type="number" min="0" aria-label="Weight for set ${si+1}" placeholder="${wPlaceholder}" step="any" value="${displayWeight}"
          oninput="updateSet(${ei},${si},'weight',this.value)" id="wt-${ei}-${si}">
        <button type="button" class="lb-convert-btn" onclick="convertSetToKg(${ei},${si})" title="Typed a lbs number? Tap to convert it to kg in place">lb→kg</button>
      </div>
      <input class="set-input" type="number" min="1" step="1" aria-label="Reps for set ${si+1}" placeholder="${rPlaceholder}" value="${h(s.reps)}"
        oninput="updateSet(${ei},${si},'reps',this.value)">
      <button class="set-done ${s.done?'done':''}" onclick="toggleSetDone(${ei},${si})" aria-pressed="${!!s.done}" aria-label="Toggle set ${si+1} complete" title="Toggle completion">✓</button>
    </div>`;
  }).join('');
}

function toggleEx(ei) {
  const card = document.getElementById('ex-card-' + ei);
  card.classList.toggle('open');
}

function updateSet(ei,si,field,val) {
  if(!setData[ei]?.[si] || !['weight','reps'].includes(field))return;
  setData[ei][si][field]=field==='weight'?fromDisplayWeight(val):val;
  setData[ei][si].done=!!validSet(setData[ei][si]);
  persistDraft();syncCompletion(ei);
}

// Quick per-field lbs->kg convert: reads whatever number is currently typed
// in a weight box, treats it as lbs, and replaces it with the kg equivalent
// (or the equivalent in the current display unit, if that's ever lbs too).
function convertSetToKg(ei, si) {
  const input = document.getElementById(`wt-${ei}-${si}`);
  if (!input) return;
  if(weightUnit==='lbs'){toast('This field already uses pounds');return;}
  const typedLbs = parseFloat(input.value);
  if (!typedLbs || isNaN(typedLbs)) { toast('Type the lbs number first'); return; }
  const kgVal = lbsToKg(typedLbs);
  const displayVal = weightUnit === 'lbs' ? kgToLbs(kgVal) : kgVal;
  input.value = displayVal;
  updateSet(ei, si, 'weight', displayVal);
  toast(`${typedLbs}lbs ≈ ${kgVal}kg`);
}

function toggleSetDone(ei,si) {
  const s=setData[ei]?.[si];if(!s)return;
  if(!s.done&&!validSet(s)){toast('Enter a non-negative weight (0 for bodyweight) and whole-number reps first');return;}
  s.done=!s.done;persistDraft();syncCompletion(ei);
  if(s.done){resetRestTimer();startRestTimer();}
}

function checkAllSets(ei) {
  const rows=setData[ei]||[];document.getElementById('ex-card-'+ei)?.classList.toggle('completed',rows.length>0&&rows.every(s=>s.done));
}

function markDone(ei) {
  const rows=setData[ei]||[],clear=rows.every(s=>s.done);
  if(!clear && rows.some(s=>!validSet(s))){toast('Fill every set before marking the exercise complete');return;}
  rows.forEach(s=>s.done=!clear);persistDraft();syncCompletion(ei);
}

function saveWorkout() {
  const base=getActivePlan()[currentDay],day=getSessionDay();
  const exercises=day.exercises.map((e,i)=>({name:e.name,sets:(setData[i]||[]).filter(s=>s.done&&validSet(s)).map(s=>({weight:Number(s.weight),reps:Number(s.reps),done:true}))})).filter(e=>e.sets.length);
  if(!exercises.length){toast('Complete at least one valid set, then save');return;}
  const history=load('history',[]),id=Math.max(Date.now(),...history.map(w=>w.id+1));
  const covered=day.coverage?day.coverage.filter(source=>exercises.some(e=>source.names.includes(e.name.toLocaleLowerCase()))).map(source=>source.id):[base.id];
  syncWeeklyGoal();history.unshift({id,date:new Date().toISOString(),planName:load('planName','Big Boy Plan'),weeklyTarget:getWeeklyTarget(),dayId:base.id,coveredDayIds:covered,dayIndex:currentDay,dayName:day.name,type:day.type,exercises});
  save('history',history);recomputePRs();const drafts=getDrafts();delete drafts[day.id];if(day.id!==base.id)delete drafts[base.id];save('workoutDrafts',drafts);if(day.id!==base.id){const overrides=readSessionOverrides();delete overrides[sessionOverrideKey(base.id)];save('sessionOverrides',overrides);}setData={};renderToday();toast('Workout saved — completed sets logged');
}

// ===================== PRs =====================
function getPR(name) { const prs=load('prs',{});return Object.hasOwn(prs,name)?prs[name]:null; }

function setPR(name, val) {
  const prs = load('prs', {});
  prs[name] = val;
  save('prs', prs);
}

let prFilter = 'all';

function renderPRs() {
  const plan=getActivePlan(),names=new Map(),bw=getCurrentBodyweight();plan.forEach(d=>d.exercises.forEach(e=>names.set(e.name,d.type)));
  load('history',[]).forEach(w=>w.exercises.forEach(e=>{if(!names.has(e.name))names.set(e.name,w.type);}));
  document.getElementById('pr-filters').innerHTML=['all',...Object.keys(TYPE_TAGS)].map(t=>`<button class="filter-chip ${prFilter===t?'active':''}" onclick="setPRFilter('${t}')">${t==='all'?'ALL':TYPE_TAGS[t].label}</button>`).join('');
  document.getElementById('pr-grid').innerHTML=[...names].filter(([,type])=>prFilter==='all'||type===prFilter).map(([name,type])=>{
    const pr=getPR(name),tag=TYPE_TAGS[type]||TYPE_TAGS.custom;
    return `<div class="pr-card"><div class="pr-ex-name">${h(name)}</div><span class="day-tag ${tag.cls}">${tag.label}</span>${pr?`<div class="pr-badge">PERSONAL BEST</div><div class="pr-main"><span class="pr-value">${toDisplayWeight(pr.weight)}</span> ${weightUnit} × ${pr.reps} reps</div><div class="pr-date">${new Date(pr.date).toLocaleDateString()}${bw?' · '+(pr.weight/bw).toFixed(2)+'× bodyweight':''}</div>`:'<div class="no-pr">No completed sets yet</div>'}</div>`;
  }).join('')||'<div class="empty">No exercises in this category yet.</div>';
}

function setPRFilter(f) {
  prFilter = f;
  renderPRs();
}

// ===================== HISTORY =====================
function renderHistory() {
  const history = load('history', []);
  const list = document.getElementById('history-list');
  if (history.length === 0) {
    list.innerHTML = `<div class="empty"><div class="empty-icon">📋</div><div>No workouts logged yet. Hit the gym!</div></div>`;
    return;
  }
  list.innerHTML = history.map((w, i) => {
    const tag = TYPE_TAGS[w.type] || TYPE_TAGS.rest;
    const totalSets = w.exercises.reduce((a, e) => a + e.sets.length, 0);
    const totalVol = w.exercises.reduce((a, e) => a + e.sets.reduce((b, s) => b + (parseFloat(s.weight)||0)*(parseInt(s.reps)||0), 0), 0);
    return `
      <div class="history-card">
        <div class="history-top">
          <div>
            <div class="history-date">${new Date(w.date).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'long',year:'numeric'})}</div>
            <div class="history-day">${h(w.dayName)}</div>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <span class="day-tag ${tag.cls}">${tag.label}</span>
            <button class="plan-remove-btn" style="background:#4fffff18;border-color:#4fffff35;color:var(--accent2);" onclick="openEditWorkout(${w.id})" title="Edit">✎</button>
            <button class="delete-btn" onclick="deleteWorkout(${w.id})" title="Delete">✕</button>
          </div>
        </div>
        <div class="history-stats">
          <div><span>${w.exercises.length}</span> exercises</div>
          <div><span>${totalSets}</span> sets</div>
          ${totalVol > 0 ? `<div><span>${Number(toDisplayWeight(totalVol)).toLocaleString()}</span> ${weightUnit} volume</div>` : ''}
        </div>
        <div class="history-exercises" style="margin-top:10px;">
          ${w.exercises.map(e => `<span class="history-ex-pill">${h(e.name)}</span>`).join('')}
        </div>
      </div>`;
  }).join('');
}

function deleteWorkout(id) {
  if(!confirm('Delete this workout? Its sets and records will be recalculated.'))return;
  save('history',load('history',[]).filter(w=>w.id!==id));recomputePRs();renderHistory();toast('Workout deleted; records updated');
}

let editingWorkoutId = null;

function openEditWorkout(id) {
  const history = load('history', []);
  const w = history.find(x => x.id === id);
  if (!w) return;
  editingWorkoutId = id;
  document.getElementById('edit-workout-title').textContent = w.dayName;
  document.getElementById('edit-workout-sub').textContent =
    new Date(w.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
  document.getElementById('edit-workout-body').innerHTML = w.exercises.map((e, ei) => `
    <div class="plan-day-name" style="font-size:14px;margin:14px 0 6px;">${h(e.name)}</div>
    <div class="set-labels">
      <div class="set-label">#</div>
      <div class="set-label">Weight (${weightUnit})</div>
      <div class="set-label">Reps</div>
    </div>
    ${e.sets.map((s, si) => `
      <div class="set-row" style="grid-template-columns: 28px 1fr 1fr;">
        <div class="set-num">${si + 1}</div>
        <input class="set-input" type="number" step="0.5" value="${toDisplayWeight(s.weight)}" id="edit-w-${ei}-${si}">
        <input class="set-input" type="number" value="${h(s.reps)}" id="edit-r-${ei}-${si}">
      </div>`).join('')}
  `).join('');
  document.getElementById('edit-workout-modal').classList.add('open');
}

function closeEditWorkout() {
  document.getElementById('edit-workout-modal').classList.remove('open');
  editingWorkoutId = null;
}

function saveEditWorkout() {
  const history=load('history',[]),w=history.find(w=>w.id===editingWorkoutId);if(!w)return;
  const updated=copy(w);
  for(let ei=0;ei<updated.exercises.length;ei++)for(let si=0;si<updated.exercises[ei].sets.length;si++){
    const s={weight:fromDisplayWeight(document.getElementById(`edit-w-${ei}-${si}`).value),reps:document.getElementById(`edit-r-${ei}-${si}`).value,done:true};
    if(!validSet(s)){toast('Every set needs a weight of 0 or more and positive whole-number reps');return;}
    updated.exercises[ei].sets[si]={weight:Number(s.weight),reps:Number(s.reps),done:true};
  }
  save('history',history.map(x=>x.id===updated.id?updated:x));recomputePRs();closeEditWorkout();renderHistory();toast('Workout and records updated');
}

// ===================== STATS =====================
function renderStats() {
  const history = load('history', []);
  const prs = load('prs', {});

  const totalWorkouts = history.length;
  const totalSets = history.reduce((a, w) => a + w.exercises.reduce((b, e) => b + e.sets.length, 0), 0);
  const totalVol = history.reduce((a, w) => a + w.exercises.reduce((b, e) => b + e.sets.reduce((c, s) => c + (parseFloat(s.weight)||0)*(parseInt(s.reps)||0), 0), 0), 0);
  const prCount = Object.keys(prs).length;
  const typeCounts = {};
  history.forEach(w => { typeCounts[w.type] = (typeCounts[w.type]||0)+1; });
  const fav = Object.entries(typeCounts).sort((a,b)=>b[1]-a[1])[0];

  const streak=getWeeklyStreak().streak;

  document.getElementById('stats-grid').innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Workouts</div>
      <div class="stat-value">${totalWorkouts}</div>
      <div class="stat-sub">sessions logged</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Total Volume</div>
      <div class="stat-value">${totalVol > 0 ? Number(toDisplayWeight(totalVol)).toLocaleString() : '—'}</div>
      <div class="stat-sub">${weightUnit} lifted</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Total Sets</div>
      <div class="stat-value">${totalSets}</div>
      <div class="stat-sub">sets completed</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">PRs Held</div>
      <div class="stat-value">${prCount}</div>
      <div class="stat-sub">personal records</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Day Streak</div>
      <div class="stat-value">${streak}</div>
      <div class="stat-sub">calendar days · rest included</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Fav Split</div>
      <div class="stat-value" style="font-size:24px;">${fav ? fav[0].toUpperCase() : '—'}</div>
      <div class="stat-sub">${fav ? fav[1]+' sessions' : 'no data yet'}</div>
    </div>
  `;
}

// ===================== CALENDAR =====================
const DOT_COLORS = { pull: '#4fffff', push: '#c8f135', legs: '#ff6b9d', upper: '#ffa94d', optional: '#a855f7', rest: '#6b6b85' };

let calendarDate = new Date();
calendarDate.setDate(1);
let calendarViewMode = 'month'; // 'month' | 'year'
let calendarYearView = new Date().getFullYear();

function getWorkoutsByDate() {
  const history = load('history', []);
  const byDate = {};
  history.forEach(w => {
    const d = localDateKey(w.date);
    if (!byDate[d]) byDate[d] = [];
    byDate[d].push(w);
  });
  return byDate;
}

function calendarLegendHtml() {
  return Object.entries(TYPE_TAGS).map(([key, tag]) => `
    <div class="calendar-legend-item">
      <span class="calendar-dot" style="background:${DOT_COLORS[key] || 'var(--muted)'}"></span>
      ${tag.label}
    </div>`).join('');
}

function toggleCalendarView() {
  calendarViewMode = calendarViewMode === 'month' ? 'year' : 'month';
  renderCalendar();
}

function changeCalendarMonth(delta) {
  calendarDate.setMonth(calendarDate.getMonth() + delta);
  renderCalendar();
}

function changeCalendarYear(delta) {
  calendarYearView += delta;
  renderCalendar();
}

function renderCalendar() {
  const toggleBtn = document.getElementById('calendar-view-toggle');
  const monthView = document.getElementById('calendar-month-view');
  const yearView = document.getElementById('calendar-year-view');

  if (calendarViewMode === 'month') {
    toggleBtn.textContent = 'View Full Year';
    monthView.style.display = 'block';
    yearView.style.display = 'none';
    renderCalendarMonth();renderWeeklyStreak();
  } else {
    toggleBtn.textContent = 'View Month';
    monthView.style.display = 'none';
    yearView.style.display = 'block';
    renderCalendarYear();renderWeeklyStreak();
  }
}

function renderCalendarMonth() {
  const byDate = getWorkoutsByDate();

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  document.getElementById('calendar-month-label').textContent =
    calendarDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay()+6)%7; // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = localDateKey(new Date());
  const dowNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  let html = dowNames.map(d => `<div class="calendar-dow">${d}</div>`).join('');
  for (let i = 0; i < startOffset; i++) html += `<div class="calendar-day empty"></div>`;

  let monthTrainedCount = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const workouts = byDate[dateStr];
    const trained = !!workouts;
    if (trained) monthTrainedCount++;
    const isToday = dateStr === todayStr;
    let dotsHtml = '';
    if (trained) {
      const types = [...new Set(workouts.map(w => w.type))];
      dotsHtml = `<div class="calendar-dots">${types.map(t => `<span class="calendar-dot" style="background:${DOT_COLORS[t] || 'var(--muted)'}"></span>`).join('')}</div>`;
    }
    const title = trained ? workouts.map(w => w.dayName).join(', ') : 'No workout logged';
    html += `<div data-date="${dateStr}" class="calendar-day ${trained ? 'trained' : ''} ${isToday ? 'today' : ''}" title="${h(title)}">
      <div class="calendar-day-num">${day}</div>
      ${trained ? '<div class="calendar-check">✓</div>' : ''}
      ${dotsHtml}
    </div>`;
  }

  document.getElementById('calendar-grid').innerHTML = html;
  document.getElementById('calendar-month-stat').textContent =
    `${monthTrainedCount} day${monthTrainedCount === 1 ? '' : 's'} trained this month`;

  document.getElementById('calendar-legend').innerHTML = calendarLegendHtml();
}

function renderCalendarYear() {
  const byDate = getWorkoutsByDate();
  const todayStr = localDateKey(new Date());

  document.getElementById('calendar-year-label').textContent = calendarYearView;

  const yearTrainedCount = Object.keys(byDate).filter(d => d.startsWith(`${calendarYearView}-`)).length;
  document.getElementById('calendar-month-stat').textContent =
    `${yearTrainedCount} day${yearTrainedCount === 1 ? '' : 's'} trained in ${calendarYearView}`;

  let html = '';
  for (let month = 0; month < 12; month++) {
    const monthName = new Date(calendarYearView, month, 1).toLocaleDateString('en-GB', { month: 'long' });
    const firstDay = new Date(calendarYearView, month, 1);
    const startOffset = (firstDay.getDay()+6)%7;
    const daysInMonth = new Date(calendarYearView, month + 1, 0).getDate();
    let monthTrained = 0;
    let cells = '';
    for (let i = 0; i < startOffset; i++) cells += `<div class="mini-day empty"></div>`;
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${calendarYearView}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const workouts = byDate[dateStr];
      const trained = !!workouts;
      if (trained) monthTrained++;
      const isToday = dateStr === todayStr;
      const title = trained ? workouts.map(w => w.dayName).join(', ') : '';
      cells += `<div data-date="${dateStr}" class="mini-day ${trained ? 'trained' : ''} ${isToday ? 'today' : ''}" title="${h(title)}">${day}</div>`;
    }
    html += `
      <div class="mini-month">
        <div class="mini-month-title">${monthName} <span style="color:var(--muted);font-weight:400;font-family:'DM Mono',monospace;font-size:11px;">(${monthTrained})</span></div>
        <div class="mini-month-grid">${cells}</div>
      </div>`;
  }

  document.getElementById('calendar-year-grid').innerHTML = html;
  document.getElementById('calendar-year-legend').innerHTML = calendarLegendHtml();
}

// ===================== PROGRESS =====================
let progressEx = load('progressEx', null);
let progressChartInstance = null;

function getExerciseHistory(name) {
  return load('history',[]).slice().sort((a,b)=>Date.parse(a.date)-Date.parse(b.date)).flatMap(w=>{
    const rows=w.exercises.filter(e=>e.name===name).flatMap(e=>e.sets).filter(validSet);if(!rows.length)return [];
    const best=rows.reduce((a,b)=>b.weight>a.weight||(b.weight===a.weight&&b.reps>a.reps)?b:a);
    return [{date:w.date,weight:Number(best.weight),reps:Math.max(...rows.map(s=>Number(s.reps))),est1rm:Math.max(...rows.map(s=>s.weight*(Number(s.reps)===1?1:1+Number(s.reps)/30)))}];
  });
}

function getVolumeHistory() {
  const history = load('history', []);
  const sorted = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
  return sorted.map(w => {
    const vol = w.exercises.reduce((a, e) => a + e.sets.reduce((b, s) => b + (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0), 0), 0);
    return { date: w.date, volume: Math.round(vol) };
  }).filter(p => p.volume > 0);
}

function renderProgress() {
  const history=load('history',[]).slice().sort((a,b)=>Date.parse(a.date)-Date.parse(b.date)),names=[...new Set(history.flatMap(w=>w.exercises.map(e=>e.name)))].sort();
  const aggregate=['sets','sessions','volume','cumulativeVolume','bodyweight'];
  if(progressEx && progressEx!=='__volume__' && names.includes(progressEx) && aggregate.includes(chartMetric))chartMetric='weight';
  const isEx=progressEx && progressEx!=='__volume__' && names.includes(progressEx);
  document.getElementById('progress-ex-filters').innerHTML=`<label>View<select id="progress-ex-select" onchange="chooseProgress(this.value)"><option value="" ${!isEx?'selected':''}>All training</option>${names.map(n=>`<option value="${h(n)}" ${n===progressEx?'selected':''}>${h(n)}</option>`).join('')}</select></label><label>Measure<select id="progress-metric" onchange="chartMetric=this.value;renderProgress()">${(isEx?[['weight','Top set weight'],['reps','Best reps'],['est1rm','Estimated 1RM']]:[['sets','Cumulative completed sets'],['sessions','Cumulative workouts'],['volume','Volume per session'],['cumulativeVolume','Cumulative lifted volume'],['bodyweight','Body weight']]).map(([v,label])=>`<option value="${v}" ${v===chartMetric?'selected':''}>${label}</option>`).join('')}</select></label><label>Range<select onchange="chartRange=this.value;renderProgress()"><option value="all" ${chartRange==='all'?'selected':''}>All time</option><option value="30" ${chartRange==='30'?'selected':''}>30 days</option><option value="90" ${chartRange==='90'?'selected':''}>90 days</option></select></label>`;
  let points=[],unit='sets',cumulative=0;
  if(isEx){points=getExerciseHistory(progressEx);if(chartMetric==='weight'&&points.length&&points.every(p=>p.weight===0)){chartMetric='reps';document.getElementById('progress-metric').value='reps';}unit=chartMetric==='reps'?'reps':weightUnit;points=points.map(p=>({date:p.date,value:chartMetric==='reps'?p.reps:Number(toDisplayWeight(p[chartMetric]))}));}
  else if(chartMetric==='bodyweight'){unit=weightUnit;points=load('bodyweightLog',[]).filter(p=>Number.isFinite(Date.parse(p.date))&&p.weight>0).sort((a,b)=>Date.parse(a.date)-Date.parse(b.date)).map(p=>({date:p.date,value:Number(toDisplayWeight(p.weight))}));}
  else {unit=chartMetric==='sessions'?'workouts':chartMetric==='sets'?'sets':weightUnit+' lifted';points=history.map(w=>{const sets=w.exercises.flatMap(e=>e.sets);const vol=sets.reduce((sum,s)=>sum+Number(s.weight)*Number(s.reps),0);let value=chartMetric==='sessions'?1:chartMetric==='sets'?sets.length:Number(toDisplayWeight(vol));if(chartMetric!=='volume'){cumulative+=value;value=cumulative;}return {date:w.date,value};});}
  if(chartRange!=='all'){const cutoff=Date.now()-Number(chartRange)*86400000;points=points.filter(p=>Date.parse(p.date)>=cutoff);}
  const empty=document.getElementById('progress-empty'),wrap=document.getElementById('progress-chart-wrap'),summary=document.getElementById('progress-summary');
  empty.style.display=points.length?'none':'block';wrap.style.display=points.length?'block':'none';summary.innerHTML='';
  if(!points.length){empty.querySelector('div:last-child').textContent=history.length?'No logs in this selection. Try another measure or range.':'Save your first completed workout to start your progress graph.';return;}
  drawTrend(points,unit);
  const first=points[0].value,last=points.at(-1).value,delta=last-first;
  summary.innerHTML=[['Starting',first],['Latest',last],['Change',(delta>0?'+':'')+Number(delta.toFixed(2))],['Data points',points.length]].map(([label,value])=>`<div class="stat-card"><div class="stat-label">${label}</div><div class="stat-value" style="font-size:28px">${h(typeof value==='number'?Number(value.toFixed(2)):value)}</div><div class="stat-sub">${label==='Data points'?'logged observations':h(unit)}</div></div>`).join('');
}



function setProgressEx(name) { chooseProgress(name==='__volume__'?'':name); }





// ===================== PLAN =====================
// Custom plan overrides stored in localStorage
function getCustomPlan() {
  const p=load('customPlan',null); if(!p)return null;
  try{return validatePlan(p);}catch{return null;}
}

function getActivePlan() { return getCustomPlan() || validatePlan(copy(PLAN)); }

function saveCustomPlan(plan) {
  const checked=validatePlan(plan), old=getActivePlan()[currentDay]?.id;
  persistDraft(); save('customPlan',checked);
  const found=checked.findIndex(d=>d.id===old);currentDay=found>=0?found:Math.min(currentDay,checked.length-1);save('currentDay',currentDay);
  renderPlan();renderToday();
}

function renderPlan() {
  updatePlanTitle();syncWeeklyGoal();const plan=getActivePlan();
  document.getElementById('plan-grid').innerHTML=plan.map((d,di)=>`<article class="plan-card"><div class="plan-header"><div style="flex:1;min-width:0"><div class="plan-day-name">${h(d.name)}</div><div class="plan-focus">${h(d.focus)}</div><span class="day-tag ${TYPE_TAGS[d.type].cls}">${TYPE_TAGS[d.type].label}</span></div><button class="plan-edit-btn" onclick="openDayEditor(${di})" aria-label="Edit day ${di+1}">✎</button></div>
    <div class="plan-actions"><button onclick="moveDay(${di},-1)" ${di===0?'disabled':''} aria-label="Move day up">↑ Day</button><button onclick="moveDay(${di},1)" ${di===plan.length-1?'disabled':''} aria-label="Move day down">↓ Day</button><button onclick="duplicateDay(${di})">Duplicate</button><button onclick="removeDay(${di})" ${plan.length===1?'disabled':''}>Remove day</button><button onclick="openAddExercise(${di})">＋ Exercise</button></div>
    <div class="plan-exercises">${d.exercises.map((e,ei)=>`<div class="plan-ex customizable"><div class="plan-ex-name">${h(e.name)}<small>${h(e.reps)} reps${e.bodyweight?' · bodyweight':''}</small></div><label class="inline-set-label"><input type="number" class="inline-sets" min="1" max="100" step="1" aria-label="Sets for ${h(e.name)}" value="${e.sets}" onchange="setExerciseCount(${di},${ei},this.value)"> sets</label><div class="reorder-buttons"><button onclick="moveExercise(${di},${ei},-1)" ${ei===0?'disabled':''} aria-label="Move ${h(e.name)} up">↑</button><button onclick="moveExercise(${di},${ei},1)" ${ei===d.exercises.length-1?'disabled':''} aria-label="Move ${h(e.name)} down">↓</button><button onclick="openEditExercise(${di},${ei})" aria-label="Edit ${h(e.name)}">✎</button><button onclick="removeExercise(${di},${ei})" aria-label="Remove ${h(e.name)}">×</button></div></div>`).join('')||'<p class="empty-day">Recovery day, or add your first exercise.</p>'}</div></article>`).join('');
}

let editingDayIndex = null;
let editingExIndex = null; // null = adding new, number = editing existing

function openAddExercise(dayIndex) { openExerciseEditor(dayIndex,null); }

function openEditExercise(dayIndex,exIndex) { openExerciseEditor(dayIndex,exIndex); }

function closeAddExercise() {
  hideExerciseSuggestions();document.getElementById('add-ex-modal').classList.remove('open');editingDayIndex=null;editingExIndex=null;selectedExerciseTemplate=null;
}

function confirmAddExercise() {
  if(editingDayIndex==null)return;
  const name=document.getElementById('add-ex-name').value.trim(),sets=Number(document.getElementById('add-ex-sets').value),reps=document.getElementById('add-ex-reps').value.trim();
  if(!name || !reps || !Number.isInteger(sets)||sets<1||sets>MAX_SETS){toast('Enter a name, a rep target, and 1–100 whole sets');return;}
  const plan=copy(getActivePlan()),day=plan[editingDayIndex];
  if(day.exercises.some((e,i)=>i!==editingExIndex && e.name.toLocaleLowerCase()===name.toLocaleLowerCase())){toast('That exercise is already in this day');return;}
  if(editingExIndex!=null){
    if(editingDayIndex===currentDay&&sets<day.exercises[editingExIndex].sets&&(setData[editingExIndex]||[]).slice(sets).some(s=>s.reps!==''||s.done)&&!confirm('This removes entered sets from the current draft. Continue?'))return;
    day.exercises[editingExIndex]={...day.exercises[editingExIndex],name,sets,reps,...(selectedExerciseTemplate&&exerciseNameKey(selectedExerciseTemplate.name)===exerciseNameKey(name)&&selectedExerciseTemplate.bodyweight!=null?{bodyweight:!!selectedExerciseTemplate.bodyweight}:{})};
  } else {const template=selectedExerciseTemplate&&exerciseNameKey(selectedExerciseTemplate.name)===exerciseNameKey(name)?selectedExerciseTemplate:null;day.exercises.push({id:uid(),name,sets,reps,bodyweight:template?.bodyweight??day.type==='home'});if(day.type==='rest'){day.type='custom';day.focus='Custom workout';}}
  saveCustomPlan(plan);closeAddExercise();toast('Exercise saved');
}

function removeExercise(di,ei) {
  const plan=copy(getActivePlan());if(!confirm(`Remove ${plan[di].exercises[ei].name} from the plan? Logged history is kept.`))return;
  plan[di].exercises.splice(ei,1);saveCustomPlan(plan);toast('Exercise removed');
}

// ===================== TOAST =====================
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast.timer);toast.timer=setTimeout(() => t.classList.remove('show'), 4500);
}

// ===================== REST TIMER =====================
// Uses a real end-timestamp (not a naive tick counter) so the countdown
// stays accurate even if the browser throttles JS timers while the tab
// is backgrounded or the screen is locked.
let restTimerSeconds = 90;
let restTimerRemaining = 90;
let restTimerEndAt = null;      // Date.now() timestamp the timer finishes at
let restTimerInterval = null;
let restTimerRunning = false;
let notifyPermissionAsked = load('notifyPermissionAsked', false);

function formatRestTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateRestTimerDisplay() {
  const str = formatRestTime(restTimerRemaining);
  const displayEl = document.getElementById('rest-timer-display');
  if (displayEl) displayEl.textContent = str;
  const fabEl = document.getElementById('rest-timer-fab-time');
  if (fabEl) fabEl.textContent = restTimerRunning ? str : '';
}

function setRestTimer(sec) {
  restTimerSeconds = sec;
  restTimerRemaining = sec;
  restTimerEndAt = null;
  clearInterval(restTimerInterval);
  restTimerRunning = false;
  const startBtn = document.getElementById('rest-timer-start-btn');
  if (startBtn) startBtn.textContent = 'Start';
  document.querySelectorAll('#rest-timer-presets button').forEach(b => {
    b.classList.toggle('active', parseInt(b.dataset.preset) === sec);
  });
  updateRestTimerDisplay();
}

function toggleRestTimerRun() {
  if (restTimerRunning) {
    // Pause: snapshot the true remaining time from the end-timestamp
    restTimerRemaining = Math.max(0, Math.round((restTimerEndAt - Date.now()) / 1000));
    restTimerEndAt = null;
    clearInterval(restTimerInterval);
    restTimerRunning = false;
    document.getElementById('rest-timer-start-btn').textContent = 'Resume';
    updateRestTimerDisplay();
    return;
  }
  startRestTimer();
}

function startRestTimer() {
  if (restTimerRemaining <= 0) restTimerRemaining = restTimerSeconds;
  maybeRequestNotifyPermission();
  clearInterval(restTimerInterval);
  restTimerRunning = true;
  restTimerEndAt = Date.now() + restTimerRemaining * 1000;
  const startBtn = document.getElementById('rest-timer-start-btn');
  if (startBtn) startBtn.textContent = 'Pause';
  // The floating countdown stays visible without covering the workout.
  updateRestTimerDisplay();
  restTimerInterval = setInterval(tickRestTimer, 250);
}

function tickRestTimer() {
  if (!restTimerRunning || restTimerEndAt === null) return;
  const remaining = Math.ceil((restTimerEndAt - Date.now()) / 1000);
  if (remaining <= 0) {
    clearInterval(restTimerInterval);
    restTimerRunning = false;
    restTimerRemaining = 0;
    restTimerEndAt = null;
    updateRestTimerDisplay();
    onRestTimerComplete();
    return;
  }
  if (remaining !== restTimerRemaining) {
    restTimerRemaining = remaining;
    updateRestTimerDisplay();
  }
}

// Catches the case where the tab was fully backgrounded/suspended and the
// interval didn't get to fire right at zero — re-check as soon as it's visible again.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && restTimerRunning) tickRestTimer();
});

function resetRestTimer() {
  clearInterval(restTimerInterval);
  restTimerRunning = false;
  restTimerEndAt = null;
  restTimerRemaining = restTimerSeconds;
  const startBtn = document.getElementById('rest-timer-start-btn');
  if (startBtn) startBtn.textContent = 'Start';
  updateRestTimerDisplay();
}

function toggleRestTimerPanel() {
  document.getElementById('rest-timer-panel').classList.toggle('open');
}

function maybeRequestNotifyPermission() { /* Notification permission is an explicit Settings action. */ }

function onRestTimerComplete() {
  document.getElementById('rest-timer-panel').classList.remove('open');
  toast('⏱ Rest complete — go again!');
  if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  playRestBeep();
  fireRestNotification();
  document.getElementById('rest-timer-start-btn').textContent='Start';
  const widget = document.getElementById('rest-timer-widget');
  widget.classList.add('flash');
  setTimeout(() => widget.classList.remove('flash'), 1600);
}

function playRestBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.4].forEach(delay => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.001, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.3);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.32);
      if(delay>0)osc.onended=()=>ctx.close();
    });
  } catch (e) { /* WebAudio unavailable — silently skip the beep */ }
}

// Fires a system-level notification (works even if the app/tab isn't in the
// foreground) so you can hear the device's notification sound + feel it
// vibrate through a locked screen — not just an in-page beep.
function fireRestNotification() {
  if(!('Notification'in window)||Notification.permission!=='granted')return;
  const payload={body:'Time to lift again',icon:'icon-192.png',tag:'rest-timer'};
  const fallback=()=>{try{new Notification('Rest complete',payload);}catch{}};
  if('serviceWorker'in navigator)navigator.serviceWorker.getRegistration().then(reg=>reg?reg.showNotification('Rest complete',payload):fallback()).catch(fallback);else fallback();
}

updateRestTimerDisplay();

// ===================== PWA SETUP =====================
if ('serviceWorker' in navigator && ['http:','https:'].includes(location.protocol)) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).catch(() => {
      // Fails silently if sw.js isn't hosted alongside index.html yet
    });
  });
}

// ===================== MODAL =====================
function closeModal() {
  document.getElementById('modal').classList.remove('open');
  modalCb = null;
}

function confirmModal() {
  const w = document.getElementById('modal-weight').value;
  const r = document.getElementById('modal-reps').value;
  if (modalCb) modalCb(w, r);
  closeModal();
}


// Plan editing, resilient logging, and dependency-free progress charts.
const MAX_SETS = 100;
const copy = value => JSON.parse(JSON.stringify(value));
const uid = () => crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
const h = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
let dayEditing = null;
let storageWarning = false;
let chartMetric = 'sets';
let chartRange = 'all';
TYPE_TAGS.full = {cls:'tag-upper',label:'FULL BODY'};
TYPE_TAGS.home = {cls:'tag-optional',label:'HOME'};
TYPE_TAGS.custom = {cls:'tag-upper',label:'CUSTOM'};
DOT_COLORS.full = '#ffa94d'; DOT_COLORS.home = '#a855f7'; DOT_COLORS.custom = '#ffa94d';












































const ex=(name,sets=3,reps='8–12',bodyweight=false)=>({id:uid(),name,sets,reps,bodyweight});
const workout=(name,type,names,bodyweight=false)=>({id:uid(),name,type,focus:bodyweight?'At home · no equipment':'Adjust exercises and targets to suit your training',exercises:names.map(n=>ex(n,bodyweight?2:3,bodyweight?'8–15':'8–12',bodyweight))});
const rest=()=>workout('Rest & mobility','rest',[]);
const PRESETS=[
 {id:'fullbody',name:'Full body · 3 days',equipment:'Gym',build:()=>[workout('Full Body A','full',['Squat','Bench Press','Lat Pulldown','Calf Raises']),rest(),workout('Full Body B','full',['Romanian Deadlift','Shoulder Press','Cable Row','Dumbbell Curl']),rest(),workout('Full Body C','full',['Leg Press','Incline Press','Lat Pulldown','Tricep Extension']),rest(),rest()]},
 {id:'upperlower',name:'Upper / Lower · 4 days',equipment:'Gym',build:()=>[workout('Upper A','upper',['Bench Press','Cable Row','Shoulder Press','Dumbbell Curl']),workout('Lower A','legs',['Squat','Romanian Deadlift','Leg Curl','Calf Raises']),rest(),workout('Upper B','upper',['Incline Press','Lat Pulldown','Lateral Raise','Tricep Extension']),workout('Lower B','legs',['Leg Press','Romanian Deadlift','Leg Extension','Calf Raises']),rest(),rest()]},
 {id:'ppl',name:'Push / Pull / Legs · 6 days',equipment:'Gym',build:()=>[workout('Push A','push',['Bench Press','Incline Press','Shoulder Press','Tricep Extension']),workout('Pull A','pull',['Lat Pulldown','Cable Row','Rear Delt Fly','Dumbbell Curl']),workout('Legs A','legs',['Squat','Leg Curl','Leg Extension','Calf Raises']),workout('Push B','push',['Incline Press','Shoulder Press','Lateral Raise','Tricep Extension']),workout('Pull B','pull',['Cable Row','Lat Pulldown','Rear Delt Fly','Dumbbell Curl']),workout('Legs B','legs',['Romanian Deadlift','Leg Press','Leg Curl','Calf Raises']),rest()]},
 {id:'strength',name:'5 × 5 basics · 3 days',equipment:'Gym',build:()=>[workout('Strength A','full',['Squat','Bench Press','Barbell Row']),rest(),workout('Strength B','full',['Squat','Overhead Press','Romanian Deadlift']),rest(),workout('Strength A','full',['Squat','Bench Press','Barbell Row']),rest(),rest()].map(d=>({...d,exercises:d.exercises.map(e=>({...e,sets:5,reps:'5'}))}))},
 {id:'home',name:'Home · bodyweight · 3 days',equipment:'No equipment',build:()=>[workout('Home A','home',['Bodyweight Squat','Push-up','Glute Bridge','Dead Bug'],true),rest(),workout('Home B','home',['Reverse Lunge','Wall Push-up','Bird Dog','Standing Calf Raise'],true),rest(),workout('Home C','home',['Bodyweight Squat','Push-up','Glute Bridge','Side-lying Leg Raise'],true),rest(),rest()]},
 {id:'homeeasy',name:'Home · gentle basics · 2 days',equipment:'Chair / wall',build:()=>[workout('Home Basics A','home',['Sit-to-stand','Wall Push-up','Standing Calf Raise','Sideways Leg Lift'],true),rest(),rest(),workout('Home Basics B','home',['Mini-squat','Wall Push-up','Standing Leg Extension','Standing Calf Raise'],true),rest(),rest(),rest()]},
 {id:'dumbbell',name:'Home · dumbbells · 3 days',equipment:'Dumbbells',build:()=>[workout('Dumbbells A','full',['Goblet Squat','Dumbbell Floor Press','One-arm Dumbbell Row']),rest(),workout('Dumbbells B','full',['Dumbbell Romanian Deadlift','Dumbbell Shoulder Press','Dumbbell Curl']),rest(),workout('Dumbbells C','full',['Goblet Squat','Dumbbell Floor Press','One-arm Dumbbell Row']),rest(),rest()]}
];












// Finish initialization only after definitions, data migration and preset setup.
// A common-name starter catalogue, not a popularity ranking or training prescription.
const COMMON_EXERCISES=[
  ['Chest','Bench Press|barbell bench press;flat bench','Incline Bench Press|incline press','Dumbbell Bench Press|dumbbell chest press','Incline Dumbbell Press','Decline Bench Press','Machine Chest Press','Pec Deck Fly|chest fly machine;butterfly','Dumbbell Fly','Cable Chest Fly|cable crossover','Dips|chest dips'],
  ['Back','Lat Pulldown|lat pull down','Wide-Grip Lat Pulldown','Close-Grip Lat Pulldown','Seated Cable Row','Cable Row','Chest-Supported Row','Barbell Row|bent over row','T-Bar Row|t bar row','Single-Arm Dumbbell Row|one arm dumbbell row','Single-Arm Cable Row','Straight-Arm Pulldown','Face Pull','Back Extension|hyperextension'],
  ['Shoulders','Shoulder Press','Dumbbell Shoulder Press','Overhead Press|ohp;military press','Machine Shoulder Press','Arnold Press','Lateral Raise|side raise','Cable Lateral Raise','Rear Delt Fly|rear delt cable fly','Reverse Pec Deck|reverse fly machine','Front Raise','Dumbbell Shrug','Barbell Shrug'],
  ['Biceps','Dumbbell Curl|biceps curl;bicep curl','Barbell Curl','EZ-Bar Curl|ez bar biceps curl','Incline Dumbbell Curl','Hammer Curl','Preacher Curl','Machine Preacher Curl|preacher curl machine;machine curl','Single-Arm Dumbbell Preacher Curl|one arm preacher curl','Cable Curl','Concentration Curl','Reverse Curl|reverse cable curl'],
  ['Triceps','Tricep Pushdown|triceps pushdown;cable pushdown','Rope Tricep Pushdown','Overhead Tricep Extension|overhead triceps extension','Skull Crusher|lying triceps extension','Close-Grip Bench Press','Tricep Kickback','Cable Tricep Extension','Assisted Tricep Dip'],
  ['Legs','Squat|back squat','Barbell Back Squat','Front Squat','Goblet Squat','Leg Press','Hack Squat','Smith Machine Squat','Romanian Deadlift|rdl','Deadlift','Sumo Deadlift','Leg Extension','Seated Leg Curl','Lying Leg Curl','Leg Curl','Bulgarian Split Squat','Walking Lunge','Reverse Lunge','Step-Up|step up','Hip Thrust','Hip Abduction Machine','Hip Adduction Machine','Standing Calf Raise','Seated Calf Raise','Calf Raises'],
  ['Core','Cable Crunch','Hanging Knee Raise','Hanging Leg Raise','Ab Wheel Rollout','Weighted Crunch','Russian Twist'],
  ['Home · bodyweight','Push-Up|push up;pushup;press up','Incline Push-Up','Wall Push-Up','Knee Push-Up','Pike Push-Up','Pull-Up|pull up;pullup','Chin-Up|chin up;chinup','Bodyweight Squat|air squat','Chair Squat','Sit-to-Stand|sit to stand','Glute Bridge','Wall Sit','Plank','Side Plank','Crunch','Reverse Crunch','Dead Bug','Bird Dog','Superman','Mountain Climber'],
  ['Home · bands','Resistance Band Row|band row','Band Pull-Apart','Band Chest Press','Band Bicep Curl','Band Tricep Extension','Band Lateral Raise']
];
let exerciseCatalog=[],exerciseSuggestionRows=[],exerciseSuggestionActive=-1,selectedExerciseTemplate=null;

























let catchupPreview=null;
























let streakDate=null;

let editingWeightId=null;













function validSet(s) {
  return s && s.weight !== '' && s.weight != null && Number.isFinite(Number(s.weight)) && Number(s.weight) >= 0 && Number.isInteger(Number(s.reps)) && Number(s.reps) > 0;
}

function validatePlan(plan) {
  if (!Array.isArray(plan) || !plan.length || plan.length > 31) throw Error('A plan needs 1–31 days');
  const seen = new Set();
  return plan.map((d, di) => {
    if (!d || typeof d.name !== 'string' || !d.name.trim() || !Array.isArray(d.exercises) || d.exercises.length > 100) throw Error('Invalid workout day');
    const id = typeof d.id === 'string' && d.id && !seen.has(d.id) ? d.id : 'day-' + di;
    if (seen.has(id)) throw Error('Duplicate day ID'); seen.add(id);
    const names = new Set(), ids = new Set();
    return {id, name:d.name.trim().slice(0,120), focus:String(d.focus ?? '').slice(0,240), type:Object.hasOwn(TYPE_TAGS,d.type) ? d.type : 'custom', exercises:d.exercises.map((e,ei) => {
      if (!e || typeof e.name !== 'string' || !e.name.trim() || !Number.isInteger(Number(e.sets)) || e.sets < 1 || e.sets > MAX_SETS || typeof e.reps !== 'string' || !e.reps.trim()) throw Error('Exercises need a name, 1–100 sets and a rep target');
      const name=e.name.trim().slice(0,120), key=name.toLocaleLowerCase();
      if (names.has(key)) throw Error('Exercise names must be unique within a day'); names.add(key);
      const exid=typeof e.id==='string' && e.id && !ids.has(e.id) ? e.id : id+'-ex-'+ei;
      if(ids.has(exid)) throw Error('Duplicate exercise ID'); ids.add(exid);
      return {id:exid,name,sets:Number(e.sets),reps:e.reps.trim().slice(0,80),bodyweight:!!e.bodyweight};
    })};
  });
}

function validateHistory(history) {
  if (!Array.isArray(history)) throw Error('History must be a list');
  const ids=new Set();
  return history.map((w,i) => {
    if (!w || typeof w.date!=='string' || !Number.isFinite(Date.parse(w.date)) || typeof w.dayName!=='string' || !Array.isArray(w.exercises)) throw Error('Invalid workout history');
    let id=Number.isSafeInteger(w.id)&&w.id>=0 ? w.id : Date.parse(w.date)+i;
    while(ids.has(id)) id++; ids.add(id);
    return {...w,id,type:Object.hasOwn(TYPE_TAGS,w.type)?w.type:'custom',exercises:w.exercises.map(e=>{
      if(!e || typeof e.name!=='string' || !Array.isArray(e.sets) || e.sets.some(s=>!validSet(s))) throw Error('Invalid historical sets');
      return {name:e.name,sets:e.sets.map(s=>({weight:Number(s.weight),reps:Number(s.reps),done:true}))};
    })};
  });
}

function getDrafts() {
  const d=load('workoutDrafts',{});
  return d && typeof d==='object' && !Array.isArray(d) ? Object.assign(Object.create(null),d) : Object.create(null);
}

function persistDraft() {
  const day=getSessionDay(); if(!day)return;
  const drafts=getDrafts(), rows=Object.create(null);
  day.exercises.forEach((e,i)=>{if(setData[i])rows[e.id]=copy(setData[i]);});
  drafts[day.id]=rows; save('workoutDrafts',drafts);
}

function restoreDraft() {
  const plan=getActivePlan();currentDay=Math.min(Math.max(0,currentDay),plan.length-1);
  const day=getSessionDay(),draft=getDrafts()[day.id]||{};setData={};
  day.exercises.forEach((e,i)=>{
    const old=Array.isArray(draft[e.id])?draft[e.id]:[];
    setData[i]=Array.from({length:e.sets},(_,j)=>{
      const s=old[j];return s && typeof s==='object'?{weight:s.weight ?? '',reps:s.reps ?? '',done:!!s.done && validSet(s)}:{weight:e.bodyweight?0:'',reps:'',done:false};
    });
  });
}

function syncCompletion(ei) {
  const card=document.getElementById('ex-card-'+ei);if(!card)return;
  card.querySelectorAll('.set-done').forEach((b,i)=>{b.classList.toggle('done',!!setData[ei]?.[i]?.done);b.setAttribute('aria-pressed',String(!!setData[ei]?.[i]?.done));});
  checkAllSets(ei);
}

function recomputePRs() {
  const prs=Object.create(null);
  load('history',[]).forEach(w=>w.exercises.forEach(e=>e.sets.filter(validSet).forEach(s=>{
    const old=prs[e.name];if(!old || s.weight>old.weight || (s.weight===old.weight&&s.reps>old.reps))prs[e.name]={weight:Number(s.weight),reps:Number(s.reps),date:w.date};
  })));
  save('prs',prs);return prs;
}

function setExerciseCount(di,ei,value) {
  const sets=Number(value);if(!Number.isInteger(sets)||sets<1||sets>MAX_SETS){toast('Choose 1–100 sets');renderPlan();return;}
  const plan=copy(getActivePlan());
  if(di===currentDay && sets<plan[di].exercises[ei].sets && (setData[ei]||[]).slice(sets).some(s=>s.reps!==''||s.done)){
    if(!confirm('This removes entered sets from the current draft. Continue?')){renderPlan();return;}
  }
  plan[di].exercises[ei].sets=sets;saveCustomPlan(plan);
}

function moveExercise(di,ei,delta) {
  const plan=copy(getActivePlan()),to=ei+delta;if(to<0||to>=plan[di].exercises.length)return;
  [plan[di].exercises[ei],plan[di].exercises[to]]=[plan[di].exercises[to],plan[di].exercises[ei]];saveCustomPlan(plan);
}

function moveDay(di,delta) {
  const plan=copy(getActivePlan()),to=di+delta;if(to<0||to>=plan.length)return;
  [plan[di],plan[to]]=[plan[to],plan[di]];saveCustomPlan(plan);
}

function renamePlan() {
  const value=document.getElementById('plan-name-input').value.trim();if(!value){toast('Enter a plan name');return;}
  save('planName',value.slice(0,120));updatePlanTitle();toast('Plan renamed');
}

function updatePlanTitle() {
  const name=load('planName','Big Boy Plan');document.title=name+' — Workout Tracker';document.getElementById('plan-name-input').value=name;document.getElementById('active-plan-name').textContent=name;
}

function openDayEditor(di=null) {
  dayEditing=di;const d=di==null?{name:'',focus:'',type:'custom'}:getActivePlan()[di];
  document.getElementById('day-editor-title').textContent=di==null?'Add workout day':'Edit workout day';
  document.getElementById('day-edit-name').value=d.name;document.getElementById('day-edit-focus').value=d.focus;
  document.getElementById('day-edit-type').innerHTML=Object.entries(TYPE_TAGS).map(([key,t])=>`<option value="${key}" ${key===d.type?'selected':''}>${t.label}</option>`).join('');
  document.getElementById('day-editor-modal').classList.add('open');document.getElementById('day-edit-name').focus();
}

function saveDayEditor() {
  const name=document.getElementById('day-edit-name').value.trim();if(!name){toast('Give the day a name');return;}
  const plan=copy(getActivePlan()),old=dayEditing==null?{id:uid(),exercises:[]}:plan[dayEditing];
  const day={...old,name,focus:document.getElementById('day-edit-focus').value.trim(),type:document.getElementById('day-edit-type').value};
  if(dayEditing==null){if(plan.length>=31){toast('A cycle supports up to 31 days');return;}plan.push(day);}else plan[dayEditing]=day;
  saveCustomPlan(plan);closeDayEditor();toast('Workout day saved');
}

function closeDayEditor() { document.getElementById('day-editor-modal').classList.remove('open');dayEditing=null; }

function removeDay(di) {
  const plan=copy(getActivePlan());if(plan.length===1)return;
  if(!confirm(`Remove ${plan[di].name}? Saved workout history is kept.`))return;plan.splice(di,1);saveCustomPlan(plan);
}

function duplicateDay(di) {
  const plan=copy(getActivePlan());if(plan.length>=31){toast('A cycle supports up to 31 days');return;}
  const d=copy(plan[di]);d.id=uid();d.name+=' (copy)';d.exercises.forEach(e=>e.id=uid());plan.splice(di+1,0,d);saveCustomPlan(plan);
}

function applyPreset(id) {
  const p=PRESETS.find(p=>p.id===id);if(!p)return;
  if(!confirm(`Use ${p.name}? Your current plan is replaced; saved history is kept. Export first if you want to keep this plan.`))return;
  save('customPlan',validatePlan(p.build()));save('planName',p.name);save('workoutDrafts',{});setData={};currentDay=0;save('currentDay',0);renderPlan();renderToday();toast('Plan applied — every day and exercise is editable');
}

function setupPresets() {
  const select=document.getElementById('plan-preset');select.innerHTML='<option value="">Quick select a plan…</option>'+['Gym','Home'].map(group=>`<optgroup label="${group==='Gym'?'Common gym splits':'Home workouts'}">${PRESETS.filter(p=>group==='Gym'?p.equipment==='Gym':p.equipment!=='Gym').map(p=>`<option value="${p.id}">${p.name} · ${p.equipment}</option>`).join('')}</optgroup>`).join('');
}

function chooseProgress(name) { progressEx=name||null;save('progressEx',progressEx);chartMetric=name?'weight':'sets';renderProgress(); }

function drawTrend(points,unit,target='progress-chart-wrap',focused=false) {
  const W=Math.max(280,Math.min(850,document.getElementById(target).clientWidth-20)),H=300,L=52,R=18,T=24,B=60,low=Math.min(...points.map(p=>p.value)),high=Math.max(...points.map(p=>p.value)),pad=Math.max((high-low)*0.2,high*0.01,0.5),min=focused?Math.max(0,low-pad):0,max=focused?high+pad:Math.max(high,1)*1.12;
  const first=Date.parse(points[0].date),last=Date.parse(points.at(-1).date),span=last-first;
  const xy=points.map(p=>[span?L+(Date.parse(p.date)-first)/span*(W-L-R):W/2,H-B-(p.value-min)/(max-min)*(H-T-B)]);
  const path=xy.map(([x,y],i)=>`${i?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  const format=date=>new Date(date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'2-digit'});
  const grid=Array.from({length:5},(_,i)=>{const y=T+i*(H-T-B)/4;return `<line x1="${L}" x2="${W-R}" y1="${y}" y2="${y}" stroke="#2a2a38"/><text x="${L-10}" y="${y+4}" text-anchor="end" fill="#aaaabb" font-size="12">${Number((min+(max-min)*(1-i/4)).toFixed(1))}</text>`;}).join('');
  document.getElementById(target).innerHTML=`<div class="chart-caption">${h(unit)} · ${points.length===1?'One measurement — keep logging to see a trend':'Actual logged values over time'}${focused?' · Vertical axis fitted to your measurements':''}</div><svg id="${target==='progress-chart-wrap'?'progress-chart':'bw-chart'}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="${target}-title ${target}-desc"><title id="${target}-title">${focused?'Body weight':'Training progress'} in ${h(unit)}</title><desc id="${target}-desc">${points.length} observations. Starting ${points[0].value}, latest ${points.at(-1).value} ${h(unit)}. Use the data table below for all values.</desc>${grid}${xy.length>1?`<path d="${path} L ${xy.at(-1)[0]},${H-B} L ${xy[0][0]},${H-B} Z" fill="#c8f13513"/><path d="${path}" fill="none" stroke="#c8f135" stroke-width="3"/>`:''}${xy.map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="5" fill="#c8f135"><title>${h(new Date(points[i].date).toLocaleString())}: ${Number(points[i].value.toFixed(2))} ${h(unit)}</title></circle>`).join('')}<text x="${L}" y="${H-22}" fill="#aaaabb" font-size="12">${format(points[0].date)}</text><text x="${W-R}" y="${H-22}" text-anchor="end" fill="#aaaabb" font-size="12">${span?format(points.at(-1).date):''}</text></svg><details class="chart-table"><summary>View logged data</summary><table><thead><tr><th>Date</th><th>${h(unit)}</th></tr></thead><tbody>${points.map(p=>`<tr><td>${h(new Date(p.date).toLocaleString())}</td><td>${Number(p.value.toFixed(2))}</td></tr>`).join('')}</tbody></table></details>`;
}

function validateBackup(data) {
  if(!data||typeof data!=='object'||Array.isArray(data)||!Array.isArray(data.history))throw Error('Not a workout backup');
  const history=validateHistory(data.history),customPlan=data.customPlan==null?validatePlan(copy(PLAN)):validatePlan(data.customPlan);
  const log=data.bodyweightLog??[];if(!Array.isArray(log)||log.some(p=>!p||!Number.isFinite(Date.parse(p.date))||!Number.isFinite(Number(p.weight))||Number(p.weight)<=0))throw Error('Invalid body weight log');
  if(data.bodyweight!=null && (!Number.isFinite(Number(data.bodyweight))||Number(data.bodyweight)<=0))throw Error('Invalid body weight');
  const sessionOverrides=validateSessionOverrides(data.sessionOverrides??{},customPlan);if(data.trackingStartedOn!=null&&!validLocalDate(data.trackingStartedOn))throw Error('Invalid tracking start');
  const drafts=Object.create(null),raw=data.workoutDrafts??{};
  if(typeof raw!=='object'||raw===null||Array.isArray(raw))throw Error('Invalid workout drafts');
  for(const day of [...customPlan,...Object.values(sessionOverrides).map(item=>item.day)]){
    const source=Object.hasOwn(raw,day.id)?raw[day.id]:null;if(!source)continue;
    if(typeof source!=='object'||Array.isArray(source))throw Error('Invalid workout draft');
    const rows=Object.create(null);
    for(const e of day.exercises){
      const sets=Object.hasOwn(source,e.id)?source[e.id]:null;if(!sets)continue;
      if(!Array.isArray(sets)||sets.length>MAX_SETS||sets.some(s=>!s||!(s.weight===''||(s.weight!=null&&Number.isFinite(Number(s.weight))&&Number(s.weight)>=0))||!(s.reps===''||(Number.isInteger(Number(s.reps))&&Number(s.reps)>0))))throw Error('Invalid draft sets');
      rows[e.id]=sets.map(s=>({weight:s.weight,reps:s.reps,done:!!s.done&&validSet(s)}));
    }
    drafts[day.id]=rows;
  }
  return {history,customPlan,trackingStartedOn:data.trackingStartedOn??null,sessionOverrides,weeklyGoals:validateWeeklyGoals(data.weeklyGoals??[]),planName:typeof data.planName==='string'&&data.planName.trim()?data.planName.trim().slice(0,120):'My Workout Plan',bodyweight:data.bodyweight==null?null:Number(data.bodyweight),bodyweightLog:log,weightUnit:['kg','lbs'].includes(data.weightUnit)?data.weightUnit:'kg',currentDay:Number.isInteger(data.currentDay)?Math.min(Math.max(data.currentDay,0),customPlan.length-1):0,workoutDrafts:drafts};
}

function normalizeExerciseName(name) { return String(name).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim(); }

function exerciseNameKey(name) { return normalizeExerciseName(name).replace(/\s/g,''); }

function buildExerciseCatalog() {
  const entries=new Map();
  const add=(name,data)=>{const key=exerciseNameKey(name);if(!key)return;const existing=entries.get(key);if(existing){existing.aliases.push(...(data.aliases||[]));if(existing.bodyweight==null&&data.bodyweight!=null)existing.bodyweight=data.bodyweight;return;}entries.set(key,{name,...data,aliases:data.aliases||[]});};
  getActivePlan().forEach(d=>d.exercises.forEach(e=>add(e.name,{source:'Your plan',detail:d.name,priority:0,sets:e.sets,reps:e.reps,bodyweight:e.bodyweight})));
  [...load('history',[])].sort((a,b)=>Date.parse(b.date)-Date.parse(a.date)).forEach(w=>w.exercises.forEach(e=>add(e.name,{source:'Your history',detail:'Previously logged',priority:1,bodyweight:null})));
  COMMON_EXERCISES.forEach(([category,...items])=>items.forEach(item=>{const [name,aliases='']=item.split('|');add(name,{source:'Common exercises',detail:category,priority:2,bodyweight:category==='Home · bodyweight',aliases:aliases.split(';').filter(Boolean)});}));
  return [...entries.values()];
}

function findExerciseSuggestions(query) {
  const normalized=normalizeExerciseName(query),tokens=normalized.split(' ').filter(Boolean),compact=exerciseNameKey(query),day=getActivePlan()[editingDayIndex],excluded=new Set((day?.exercises||[]).filter((e,i)=>i!==editingExIndex).map(e=>exerciseNameKey(e.name)));
  return exerciseCatalog.filter(e=>!excluded.has(exerciseNameKey(e.name))).map(e=>{const names=[e.name,...e.aliases].map(normalizeExerciseName),match=!tokens.length||names.some(n=>tokens.every(token=>n.includes(token))||n.replace(/\s/g,'').includes(compact));if(!match)return null;const main=normalizeExerciseName(e.name),score=main===normalized?0:main.startsWith(normalized)?1:2;return {...e,score};}).filter(Boolean).sort((a,b)=>a.priority-b.priority||a.score-b.score||a.name.localeCompare(b.name)).slice(0,12);
}

function openExerciseEditor(dayIndex,exIndex) {
  const day=getActivePlan()[dayIndex],exercise=exIndex==null?null:day?.exercises[exIndex];if(!day||exIndex!=null&&!exercise)return;
  editingDayIndex=dayIndex;editingExIndex=exIndex;selectedExerciseTemplate=null;exerciseCatalog=buildExerciseCatalog();
  document.getElementById('add-ex-modal-title').textContent=exercise?'Edit Exercise':'Add Exercise';document.getElementById('add-ex-confirm-btn').textContent=exercise?'Save':'Add';document.getElementById('add-ex-day-name').textContent=day.name;document.getElementById('add-ex-name').value=exercise?.name||'';document.getElementById('add-ex-sets').value=exercise?.sets??'';document.getElementById('add-ex-reps').value=exercise?.reps||'';
  document.getElementById('add-ex-modal').classList.add('open');document.getElementById('add-ex-name').focus({preventScroll:true});renderExerciseSuggestions();
}

function renderExerciseSuggestions() {
  const input=document.getElementById('add-ex-name'),list=document.getElementById('exercise-name-suggestions');if(!list||editingDayIndex==null)return;
  if(selectedExerciseTemplate&&exerciseNameKey(input.value)!==exerciseNameKey(selectedExerciseTemplate.name))selectedExerciseTemplate=null;
  exerciseSuggestionRows=findExerciseSuggestions(input.value);exerciseSuggestionActive=-1;input.removeAttribute('aria-activedescendant');
  const help=document.getElementById('exercise-name-help');help.textContent='Your exercises first, then common gym and home options. Custom names work too.';
  if(!input.value.trim()||!exerciseSuggestionRows.length){exerciseSuggestionRows=[];hideExerciseSuggestions();if(input.value.trim())help.textContent='No match — keep typing your own exercise name.';document.getElementById('exercise-name-status').textContent=input.value.trim()?'No matches. Custom names are welcome.':'';return;}
  list.innerHTML=exerciseSuggestionRows.length?exerciseSuggestionRows.map((e,i)=>`<button type="button" class="exercise-name-option" role="option" id="exercise-name-option-${i}" aria-selected="false" tabindex="-1" onmousedown="event.preventDefault()" onclick="chooseExerciseSuggestion(${i})"><strong>${h(e.name)}</strong><small>${h(e.source)} · ${h(e.detail)}${e.sets?' · '+e.sets+' sets × '+h(e.reps):''}</small></button>`).join(''):'<div class="exercise-name-empty">No match. You can use your own exercise name.</div>';
  list.hidden=false;input.setAttribute('aria-expanded','true');document.getElementById('exercise-name-status').textContent=exerciseSuggestionRows.length?`${exerciseSuggestionRows.length} suggestions. Choose one or keep your custom name.`:'No matches. Custom names are welcome.';
}

function hideExerciseSuggestions() {
  const input=document.getElementById('add-ex-name'),list=document.getElementById('exercise-name-suggestions');if(list)list.hidden=true;if(input){input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');}exerciseSuggestionActive=-1;
}

function chooseExerciseSuggestion(index) {
  const entry=exerciseSuggestionRows[index];if(!entry)return;const input=document.getElementById('add-ex-name');input.value=entry.name;selectedExerciseTemplate=entry;
  if(editingExIndex==null){const sets=document.getElementById('add-ex-sets'),reps=document.getElementById('add-ex-reps');if(sets.value===''&&entry.sets)sets.value=entry.sets;if(reps.value===''&&entry.reps)reps.value=entry.reps;}
  input.focus({preventScroll:true});hideExerciseSuggestions();document.getElementById('exercise-name-status').textContent='Selected '+entry.name+'.';
}

function exerciseSuggestionKey(event) {
  const list=document.getElementById('exercise-name-suggestions'),input=document.getElementById('add-ex-name');
  if(event.key==='Tab'){hideExerciseSuggestions();return;}
  if(event.key==='Escape'&&!list.hidden){event.preventDefault();event.stopPropagation();hideExerciseSuggestions();return;}
  if(event.key==='Enter'&&!list.hidden&&exerciseSuggestionActive>=0){event.preventDefault();chooseExerciseSuggestion(exerciseSuggestionActive);return;}
  if(!['ArrowDown','ArrowUp'].includes(event.key))return;event.preventDefault();if(list.hidden)renderExerciseSuggestions();if(!exerciseSuggestionRows.length)return;
  exerciseSuggestionActive=exerciseSuggestionActive<0?(event.key==='ArrowDown'?0:exerciseSuggestionRows.length-1):(exerciseSuggestionActive+(event.key==='ArrowDown'?1:exerciseSuggestionRows.length-1)+exerciseSuggestionRows.length)%exerciseSuggestionRows.length;
  list.querySelectorAll('[role="option"]').forEach((element,i)=>element.setAttribute('aria-selected',String(i===exerciseSuggestionActive)));const option=document.getElementById('exercise-name-option-'+exerciseSuggestionActive);input.setAttribute('aria-activedescendant',option.id);option.scrollIntoView({block:'nearest'});
}

function validLocalDate(value) {
  return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value+'T12:00:00'))&&localDateKey(new Date(value+'T12:00:00'))===value;
}

function ensureTrackingStart() {
  const stored=load('trackingStartedOn',null),today=localDateKey(new Date()),first=load('history',[]).filter(w=>w.type!=='rest'&&w.exercises.some(e=>e.sets.some(validSet))).map(w=>localDateKey(w.date)).filter(d=>d<=today).sort()[0],start=[validLocalDate(stored)?stored:null,first,today].filter(Boolean).sort()[0];
  if(stored!==start)save('trackingStartedOn',start);return start;
}

function sessionOverrideKey(id,date=new Date()) { return weekKey(date)+':'+id; }

function sessionSignature(base,missed) { return JSON.stringify([base,missed]); }

function validateSessionOverrides(raw,plan) {
  if(!raw||typeof raw!=='object'||Array.isArray(raw)||Object.keys(raw).length>500)throw Error('Invalid session adjustments');const result=Object.create(null),ids=new Set(plan.map(day=>day.id));
  for(const [key,item] of Object.entries(raw)){
    if(!item||!validLocalDate(item.week)||weekKey(item.week)!==item.week||key!==item.week+':'+item.baseDayId||!plan.some(d=>d.id===item.baseDayId)||!plan.some(d=>d.id===item.missedDayId)||item.baseDayId===item.missedDayId||typeof item.signature!=='string')throw Error('Invalid session adjustment');
    if(item.date!=null&&(!validLocalDate(item.date)||weekKey(item.date)!==item.week||!validLocalDate(item.missedDate)||weekKey(item.missedDate)!==item.week||item.date===item.missedDate))throw Error('Invalid adjustment dates');
    const day=validatePlan([item.day])[0];if(!['upper','full'].includes(day.type)||ids.has(day.id)||!day.exercises.length)throw Error('Invalid adjusted workout');ids.add(day.id);result[key]={week:item.week,baseDayId:item.baseDayId,missedDayId:item.missedDayId,signature:item.signature,day,...(item.date?{date:item.date,missedDate:item.missedDate}:{})};
  }
  return result;
}

function readSessionOverrides() {
  try{return validateSessionOverrides(load('sessionOverrides',{}),getActivePlan());}catch{return Object.create(null);}
}

function getSessionDay(index=currentDay) {
  const plan=getActivePlan(),base=plan[index];if(!base)return null;
  const entry=readSessionOverrides()[sessionOverrideKey(base.id)],missed=entry&&plan.find(d=>d.id===entry.missedDayId);
  return entry&&missed&&(!entry.date||entry.date<=localDateKey(new Date()))&&entry.signature===sessionSignature(base,missed)?{...entry.day,plannedDate:entry.date||null,coverage:[base,missed].map(day=>({id:day.id,names:day.exercises.map(e=>e.name.toLocaleLowerCase())})),baseDayId:base.id}:base;
}

function isPlanDayLogged(day,history=load('history',[]),date=new Date()) {
  const current=weekKey(date),today=localDateKey(new Date());return history.some(w=>weekKey(w.date)===current&&localDateKey(w.date)<=today&&w.exercises.some(e=>e.sets.some(validSet))&&(w.dayId===day.id||Array.isArray(w.coveredDayIds)&&w.coveredDayIds.includes(day.id)||w.dayName===day.name));
}

function combinedSessionType(base,missed) {
  if(base.type==='legs'&&['push','pull','upper','full'].includes(missed.type)||missed.type==='legs'&&['push','pull','upper','full'].includes(base.type))return 'full';
  return ['push','pull','upper'].includes(base.type)&&['push','pull','upper'].includes(missed.type)&&base.type!==missed.type?'upper':null;
}

function getCatchupSuggestion(index=currentDay) {
  const plan=getActivePlan(),base=plan[index],now=new Date(),weekday=(now.getDay()+6)%7,today=localDateKey(now),start=load('trackingStartedOn',today),history=load('history',[]);
  if(!base||plan.length>7||!base.exercises.length||base.type==='rest'||index>weekday||getSessionDay(index).id!==base.id||isPlanDayLogged(base,history))return null;
  for(let i=0;i<index;i++){
    const missed=plan[i],date=new Date(weekKey(now)+'T12:00:00');date.setDate(date.getDate()+i);
    if(localDateKey(date)>=today||localDateKey(date)<start||!missed.exercises.length||missed.type==='rest'||missed.type==='optional'||isPlanDayLogged(missed,history))continue;
    const type=combinedSessionType(base,missed);if(!type||type==='upper'&&base.type==='upper')continue;
    const key=weekKey(now)+':'+base.id+':'+missed.id;if(load('dismissedCatchups',[]).includes(key))continue;
    return {key,index,missedIndex:i,base,missed,type,name:type==='full'?'Full Body':'Upper Body'};
  }
  return null;
}

function renderCatchupSuggestion() {
  renderPlannedSessions();
  const wrap=document.getElementById('catchup-suggestion');if(!wrap)return;const base=getActivePlan()[currentDay],session=getSessionDay();wrap.innerHTML='';
  if(session.id!==base.id){if(session.plannedDate)return;wrap.innerHTML=`<div class="catchup-card"><strong>${h(session.name)} · this workout only</strong><p>Your original ${h(base.name)} plan is kept. This session counts as one training day.</p><button onclick="restoreOriginalSession()">Restore ${h(base.name)}</button></div>`;return;}
  const suggestion=getCatchupSuggestion();if(!suggestion)return;
  wrap.innerHTML=`<div class="catchup-card"><strong>Adjust this workout?</strong><p>No ${h(suggestion.missed.name)} workout is saved this week. Make ${h(base.name)} an ${suggestion.type==='full'?'adjustable Full Body':'Upper Body'} session with exercises from both days?</p><div class="catchup-actions"><button onclick="openCatchupPreview()">Preview ${h(suggestion.name)}</button><button onclick="dismissCatchup()">Keep ${h(base.name)}</button></div></div>`;
}

function dismissCatchup() {
  const suggestion=getCatchupSuggestion();if(!suggestion)return;const dismissed=load('dismissedCatchups',[]);save('dismissedCatchups',[...dismissed,suggestion.key].slice(-500));renderCatchupSuggestion();
}

function defaultCatchupSelection(suggestion) {
  const pool=[...suggestion.base.exercises.map(e=>({...e,source:'base'})),...suggestion.missed.exercises.map(e=>({...e,source:'missed'}))],chosen=new Set(),names=new Set();
  const pick=(source,pattern)=>{const index=pool.findIndex((e,i)=>e.source===source&&!chosen.has(i)&&!names.has(e.name.toLocaleLowerCase())&&pattern.test(e.name));if(index>=0){chosen.add(index);names.add(pool[index].name.toLocaleLowerCase());}};
  if(suggestion.type==='full'){
    const legs=suggestion.base.type==='legs'?'base':'missed',upper=legs==='base'?'missed':'base';
    pick(legs,/squat|leg press|lunge|step.?up/i);pick(legs,/rdl|romanian|deadlift|leg curl|hip thrust|bridge/i);
    pick(upper,/bench|push.?up|chest|press/i);pick(upper,/row|pulldown|pull.?up/i);
  }else{
    const push=['push','upper'].includes(suggestion.base.type)?'base':'missed',pull=push==='base'?'missed':'base';pick(push,/bench|push.?up|chest/i);pick(push,/shoulder|overhead press/i);pick(push,/tricep/i);pick(pull,/row/i);pick(pull,/pulldown|pull.?up/i);pick(pull,/bicep|preacher|dumbbell curl/i);
  }
  for(const source of ['missed','base'])while([...chosen].filter(i=>pool[i].source===source).length<Math.min(3,pool.filter(e=>e.source===source).length)&&chosen.size<6){const before=chosen.size;pick(source,/.*/);if(before===chosen.size)break;}
  return {pool,chosen};
}

function openCatchupPreview() {
  const suggestion=getCatchupSuggestion();if(suggestion)showCatchupPreview(suggestion);
}

function showCatchupPreview(suggestion) {
  const {pool,chosen}=defaultCatchupSelection(suggestion);catchupPreview={...suggestion,pool,signature:sessionSignature(suggestion.base,suggestion.missed)};
  document.getElementById('catchup-title').textContent='Make this '+suggestion.name+'?';
  document.getElementById('catchup-apply').textContent=suggestion.planned?'Schedule this workout':'Apply for this workout';
  document.getElementById('catchup-options').innerHTML=`${suggestion.planned?`<p class="planned-preview-date">Train ${h(formatPlanDate(suggestion.trainDate))} · Covers ${h(suggestion.missed.name)} on ${h(formatPlanDate(suggestion.missedDate))}</p>`:''}<p class="catchup-note">Choose the exercises for this session. Sets and rep targets come from your plan. Only this session changes; your saved plan stays unchanged. This counts as one training day, not two. Your weekly target is unchanged.</p>${pool.map((e,i)=>`<label class="catchup-option"><input type="checkbox" value="${i}" ${chosen.has(i)?'checked':''}><span>${h(e.name)}<small>${e.sets} sets × ${h(e.reps)} · ${h(e.source==='base'?suggestion.base.name:suggestion.missed.name)}</small></span></label>`).join('')}`;
  document.getElementById('catchup-modal').classList.add('open');document.querySelector('#catchup-modal .modal').scrollTop=0;const title=document.getElementById('catchup-title');title.tabIndex=-1;title.focus({preventScroll:true});
}

function closeCatchupPreview() { document.getElementById('catchup-modal').classList.remove('open');catchupPreview=null; }

function applyCatchupSession() {
  const preview=catchupPreview;let suggestion;try{suggestion=preview?.planned?buildPlannedSuggestion(preview):getCatchupSuggestion();}catch(error){toast(error.message);return;}if(!preview||!suggestion||preview.key!==suggestion.key||preview.signature!==sessionSignature(suggestion.base,suggestion.missed)){closeCatchupPreview();toast('The plan changed. Preview the adjustment again.');return;}
  const selected=[...document.querySelectorAll('#catchup-options input:checked')].map(input=>preview.pool[Number(input.value)]),names=new Set(),ids=new Set();
  const exercises=selected.filter(e=>{if(!e)return false;const name=e.name.toLocaleLowerCase();if(names.has(name))return false;names.add(name);return true;}).map(e=>{let id=e.id;while(ids.has(id))id=uid();ids.add(id);return {id,name:e.name,sets:e.sets,reps:e.reps,bodyweight:e.bodyweight};});
  if(!exercises.length||!selected.some(e=>e?.source==='base')||!selected.some(e=>e?.source==='missed')){toast('Choose at least one exercise from each workout');return;}
  const day=validatePlan([{id:'session-'+uid(),name:preview.name+(preview.planned?' — planned':' — make-up'),focus:preview.base.name+' + '+preview.missed.name,type:preview.type,exercises}])[0],date=preview.planned?preview.trainDate:localDateKey(new Date()),key=sessionOverrideKey(preview.base.id,date),overrides=readSessionOverrides();
  if(overrides[key]&&!confirm('Replace the adjustment already planned for this workout? Its draft is kept.'))return;
  persistDraft();overrides[key]={week:weekKey(date),baseDayId:preview.base.id,missedDayId:preview.missed.id,signature:preview.signature,day,...(preview.planned?{date,missedDate:preview.missedDate}:{})};save('sessionOverrides',overrides);if(preview.planned&&date<=localDateKey(new Date())&&weekKey(date)===weekKey(new Date())){currentDay=preview.index;save('currentDay',currentDay);}closeCatchupPreview();setData={};renderToday();if(document.getElementById('page-calendar').classList.contains('active'))renderCalendar();toast(preview.planned?'Workout scheduled. Your original plan is kept.':'Adjusted for this workout. Your original plan is kept.');
}

function restoreOriginalSession() {
  const base=getActivePlan()[currentDay];persistDraft();const overrides=readSessionOverrides();delete overrides[sessionOverrideKey(base.id)];save('sessionOverrides',overrides);setData={};renderToday();
}

function formatPlanDate(date) { return new Date(date+'T12:00:00').toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric'}); }

function syncAbsenceDay(which) {
  const date=document.getElementById('absence-'+which+'-date').value,select=document.getElementById('absence-'+which+'-day'),plan=getActivePlan();if(!validLocalDate(date)){select.value='';return;}
  const index=(new Date(date+'T12:00:00').getDay()+6)%7;select.value=plan.length<=7&&plan[index]?.exercises.length&&plan[index].type!=='rest'?String(index):'';
}

function openAbsencePlanner() {
  const today=localDateKey(new Date()),next=new Date(today+'T12:00:00');next.setDate(next.getDate()+1);
  for(const which of ['missed','train']){const input=document.getElementById('absence-'+which+'-date');input.min=today;input.value=which==='train'?today:localDateKey(next);document.getElementById('absence-'+which+'-day').innerHTML='<option value="">Choose workout</option>'+getActivePlan().map((d,i)=>d.type!=='rest'&&d.exercises.length?`<option value="${i}">${h(d.name)}</option>`:'').join('');syncAbsenceDay(which);}
  document.getElementById('absence-error').textContent='';document.getElementById('absence-modal').classList.add('open');document.getElementById('absence-missed-date').focus();
}

function closeAbsencePlanner() { document.getElementById('absence-modal').classList.remove('open'); }

function buildPlannedSuggestion(options) {
  const {trainDate,missedDate}=options,today=localDateKey(new Date()),plan=getActivePlan(),index=options.index===''?NaN:Number(options.index),missedIndex=options.missedIndex===''?NaN:Number(options.missedIndex),base=plan[index],missed=plan[missedIndex];
  if(!validLocalDate(trainDate)||!validLocalDate(missedDate)||trainDate<today||missedDate<today)throw Error('Choose today or a future date.');
  if(trainDate===missedDate)throw Error('Choose different training and unavailable dates.');
  if(weekKey(trainDate)!==weekKey(missedDate))throw Error('Choose both dates in the same Monday–Sunday week.');
  if(!Number.isInteger(index)||!Number.isInteger(missedIndex)||!base||!missed||index===missedIndex||!base.exercises.length||!missed.exercises.length||base.type==='rest'||missed.type==='rest')throw Error('Choose two different training workouts.');
  const type=combinedSessionType(base,missed);if(!type)throw Error('Choose complementary upper-body days, or combine a Legs day with an upper-body day.');
  if(isPlanDayLogged(base,load('history',[]),trainDate)||isPlanDayLogged(missed,load('history',[]),missedDate))throw Error('One of these workouts is already logged for that week.');
  return {planned:true,key:weekKey(trainDate)+':'+base.id+':'+missed.id+':'+trainDate+':'+missedDate,index,missedIndex,base,missed,type,name:type==='full'?'Full Body':'Upper Body',trainDate,missedDate};
}

function previewPlannedAbsence() {
  try{const suggestion=buildPlannedSuggestion({trainDate:document.getElementById('absence-train-date').value,missedDate:document.getElementById('absence-missed-date').value,index:document.getElementById('absence-train-day').value,missedIndex:document.getElementById('absence-missed-day').value});closeAbsencePlanner();showCatchupPreview(suggestion);}catch(error){document.getElementById('absence-error').textContent=error.message;}
}

function getPlannedSessions() {
  const plan=getActivePlan(),current=weekKey(new Date());return Object.entries(readSessionOverrides()).filter(([,entry])=>entry.date&&entry.week>=current&&entry.signature===sessionSignature(plan.find(d=>d.id===entry.baseDayId),plan.find(d=>d.id===entry.missedDayId))).map(([key,entry])=>({key,...entry})).sort((a,b)=>a.date.localeCompare(b.date)||a.day.name.localeCompare(b.day.name));
}

function renderPlannedSessions() {
  const entries=getPlannedSessions(),today=localDateKey(new Date()),html=entries.length?`<section class="planned-sessions"><h3>Planned workouts</h3>${entries.map((entry,i)=>`<div class="planned-session"><div><strong>${h(entry.day.name)}</strong><p>${h(formatPlanDate(entry.date))} · ${h(getActivePlan().find(d=>d.id===entry.missedDayId).name)} covered from ${h(formatPlanDate(entry.missedDate))}</p></div><div class="catchup-actions">${entry.date<=today&&entry.week===weekKey(new Date())?`<button onclick="openPlannedSession(${i})">Open workout</button>`:''}<button onclick="cancelPlannedSession(${i})">Cancel plan</button></div></div>`).join('')}</section>`:'';
  for(const id of ['planned-today','planned-calendar']){const element=document.getElementById(id);if(element)element.innerHTML=html;}
}

function openPlannedSession(index) {
  const entry=getPlannedSessions()[index];if(!entry||entry.date>localDateKey(new Date())||entry.week!==weekKey(new Date()))return;const day=getActivePlan().findIndex(d=>d.id===entry.baseDayId);showPage('today');selectDay(day);
}

function cancelPlannedSession(index) {
  const entry=getPlannedSessions()[index];if(!entry)return;persistDraft();const overrides=readSessionOverrides();delete overrides[entry.key];save('sessionOverrides',overrides);setData={};renderToday();if(document.getElementById('page-calendar').classList.contains('active'))renderCalendar();toast('Planned adjustment cancelled. Original workout kept.');
}

function weekKey(value) {
  const date=typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)?new Date(value+'T12:00:00'):new Date(value);date.setHours(12,0,0,0);date.setDate(date.getDate()-(date.getDay()+6)%7);return localDateKey(date);
}

function shiftWeek(key,amount) {
  const date=new Date(key+'T12:00:00');date.setDate(date.getDate()+7*amount);return localDateKey(date);
}

function getWeeklyTarget(plan=getActivePlan()) {
  return Math.min(7,plan.filter(d=>d.type!=='rest'&&d.type!=='optional'&&d.exercises.length>0).length);
}

function validateWeeklyGoals(raw) {
  if(!Array.isArray(raw)||raw.length>10000)throw Error('Invalid weekly goals');const seen=new Set();
  return raw.map(g=>{if(!g||typeof g.week!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(g.week)||weekKey(g.week)!==g.week||!Number.isInteger(g.target)||g.target<0||g.target>7||seen.has(g.week))throw Error('Invalid weekly goal');seen.add(g.week);return {week:g.week,target:g.target};}).sort((a,b)=>a.week.localeCompare(b.week));
}

function readWeeklyGoals() {
  try{return validateWeeklyGoals(load('weeklyGoals',[]));}catch{return [];}
}

function weeklyTargetAt(key,goals,fallback=getWeeklyTarget()) {
  let target=goals[0]?.target??fallback;for(const g of goals){if(g.week>key)break;target=g.target;}return target;
}

function syncWeeklyGoal() {
  ensureTrackingStart();
  const current=weekKey(new Date()),target=getWeeklyTarget(),goals=readWeeklyGoals();
  if(!goals.length){const weeks=load('history',[]).filter(w=>localDateKey(w.date)<=localDateKey(new Date())).map(w=>weekKey(w.date)).sort();goals.push({week:weeks[0]||current,target});}
  const existing=goals.find(g=>g.week===current);if(existing&&existing.target===target&&localStorage.getItem('weeklyGoals')!==null)return;
  if(existing)existing.target=target;else goals.push({week:current,target});save('weeklyGoals',goals.sort((a,b)=>a.week.localeCompare(b.week)));
}

function getWeeklyStreak(history=load('history',[]),goals=readWeeklyGoals(),now=new Date(),startedOn=null) {
  const current=weekKey(now),today=localDateKey(now),buckets=new Map();
  for(const w of history){const day=localDateKey(w.date);if(day>today||w.type==='rest'||!w.exercises.some(e=>e.sets.some(validSet)))continue;const key=weekKey(day);if(!buckets.has(key))buckets.set(key,new Set());buckets.get(key).add(day);}
  const complete=new Set([...buckets].filter(([key,days])=>{const target=weeklyTargetAt(key,goals);return target>0&&days.size>=target;}).map(([key])=>key));
  const firstLogged=[...buckets.values()].flatMap(days=>[...days]).sort()[0],stored=arguments.length===0?load('trackingStartedOn',null):startedOn,start=[firstLogged,validLocalDate(stored)?stored:null].filter(Boolean).sort()[0],firstWeek=start?weekKey(start):null,graceWeek=start&&start!==firstWeek&&buckets.has(firstWeek)?firstWeek:null,graceOffset=graceWeek?(new Date(start+'T12:00:00').getDay()+6)%7:0,protectedWeeks=new Set(complete);
  if(graceWeek)protectedWeeks.add(graceWeek);
  const elapsed=(now.getDay()+6)%7+1;
  let best=0,run=0,previous=null;for(const key of [...protectedWeeks].sort()){const credit=key===graceWeek?7-graceOffset:7;run=previous&&shiftWeek(previous,1)===key?run+credit:credit;best=Math.max(best,run-(key===current?7-elapsed:0));previous=key;}
  let streak=0,cursor=shiftWeek(current,-1);while(protectedWeeks.has(cursor)){streak+=cursor===graceWeek?7-graceOffset:7;cursor=shiftWeek(cursor,-1);}if(streak||buckets.has(current))streak+=elapsed-(current===graceWeek?graceOffset:0);
  return {current,target:weeklyTargetAt(current,goals),count:buckets.get(current)?.size||0,streak,best,complete,protectedWeeks,graceWeek,start,buckets,goals};
}

function renderWeeklyStreak() {
  renderPlannedSessions();
  const result=getWeeklyStreak(),{current,target,count,streak,best,complete,buckets,goals}=result,remaining=Math.max(0,target-count),wrap=document.getElementById('weekly-streak');
  const status=!target?'Add a training day to your plan.':current===result.graceWeek?'First-week grace active.':!remaining?'Weekly goal met.':`${remaining} more training day${remaining===1?'':'s'} this week.`;
  wrap.innerHTML=`<div class="weekly-heading"><div><div class="stat-label">Consistency streak</div><h2>🔥 ${streak}-day streak</h2></div><div class="weekly-best">Best secured: ${best} day${best===1?'':'s'}</div></div><div class="weekly-count">${count} / ${target} training days <span>this week · Mon–Sun</span></div><progress aria-label="Training days this week" max="${target||1}" value="${Math.min(count,target)}"></progress><p class="weekly-status" role="status">${h(status)}</p><details class="weekly-results"><summary>How it works</summary><p class="weekly-note">This week stays active through Sunday for make-ups; it resets next Monday only if the goal is missed. Future dates aren’t counted. Your first partial week has grace: the full target starts next Monday. Grace counts from the day tracking began, including rest days. Each saved training date counts once toward your goal. Your target follows required plan days (up to 7), excluding rest, optional and empty days. Use Save Workout to log a day. Plan changes affect this week onward. Best secured includes goal-met weeks and the protected first partial week. Suggestions follow plan order from Monday and never change a workout without your choice.</p></details><details class="weekly-results"><summary>${calendarViewMode==='year'?'Year':'Month'} · weekly results</summary><div id="weekly-results-list" class="weekly-results-list"></div></details>`;
  const year=calendarViewMode==='year'?calendarYearView:calendarDate.getFullYear(),month=calendarDate.getMonth(),first=new Date(year,calendarViewMode==='year'?0:month,1),last=new Date(year,calendarViewMode==='year'?12:month+1,0),rows=[];
  const firstLogged=[...buckets.keys()].sort()[0];
  for(let key=weekKey(first);key<=weekKey(last);key=shiftWeek(key,1)){
    const goal=weeklyTargetAt(key,goals),done=buckets.get(key)?.size||0,met=complete.has(key),label=key>current?'Upcoming':!goal?'No goal':key===result.graceWeek?'First-week grace':met?'Goal met':key===current?'In progress':!firstLogged||key<firstLogged?'Not started':'Missed goal',date=new Date(key+'T12:00:00');
    rows.push(`<div class="weekly-result ${met?'met':''}"><span>Week of ${date.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</span><strong>${done} / ${goal}</strong><span>${label}</span></div>`);
  }
  document.getElementById('weekly-results-list').innerHTML=rows.join('');
  document.querySelectorAll('#page-calendar [data-date]').forEach(cell=>{const met=complete.has(weekKey(cell.dataset.date));cell.classList.toggle('week-met',met);if(met)cell.title+=(cell.title?' · ':'')+'Weekly goal met';});
}

function refreshStreakDate() {
  const today=localDateKey(new Date());if(today===streakDate)return;streakDate=today;syncWeeklyGoal();
  if(document.getElementById('page-calendar').classList.contains('active'))renderCalendar();if(document.getElementById('page-stats').classList.contains('active'))renderStats();if(document.getElementById('page-today').classList.contains('active'))renderToday();
}

function getWeightEntries() {
  const seen=new Set();return load('bodyweightLog',[]).map((p,i)=>{let id=typeof p.id==='string'&&/^[\w-]+$/.test(p.id)?p.id:'legacy-'+i;while(seen.has(id))id+='-'+i;seen.add(id);return {id,date:p.date,weight:Number(p.weight)};}).sort((a,b)=>Date.parse(a.date)-Date.parse(b.date));
}

function persistWeightEntries(entries) {
  const sorted=[...entries].sort((a,b)=>Date.parse(a.date)-Date.parse(b.date)),beforeLog=localStorage.getItem('bodyweightLog'),beforeWeight=localStorage.getItem('bodyweight');
  try{save('bodyweightLog',sorted);save('bodyweight',sorted.at(-1)?.weight??null);return true;}
  catch{try{beforeLog===null?localStorage.removeItem('bodyweightLog'):localStorage.setItem('bodyweightLog',beforeLog);beforeWeight===null?localStorage.removeItem('bodyweight'):localStorage.setItem('bodyweight',beforeWeight);}catch{}return false;}
}

function resetWeightForm() {
  editingWeightId=null;document.getElementById('bw-date').value=localDateKey(new Date());document.getElementById('bw-date').max=localDateKey(new Date());document.getElementById('bw-value').value='';document.getElementById('bw-submit').textContent='Add entry';document.getElementById('bw-cancel').hidden=true;
}

function renderBodyweight() {
  document.getElementById('bw-unit').value=weightUnit;document.getElementById('bw-value').setAttribute('aria-label',`Body weight (${weightUnit})`);resetWeightForm();renderBodyweightChart();
  const entries=getWeightEntries(),first=entries[0],latest=entries.at(-1),delta=latest&&Number((Number(toDisplayWeight(latest.weight))-Number(toDisplayWeight(first.weight))).toFixed(2));
  document.getElementById('bw-summary').innerHTML=[['Starting',first?toDisplayWeight(first.weight):'—'],['Current',latest?toDisplayWeight(latest.weight):'—'],['Net change',latest?(delta>0?'+':'')+delta:'—'],['Entries',entries.length]].map(([label,value])=>`<div class="stat-card"><div class="stat-label">${label}</div><div class="stat-value" style="font-size:28px">${h(value)}</div><div class="stat-sub">${label==='Entries'?'logged measurements':h(weightUnit)}</div></div>`).join('');
  document.getElementById('bw-history').innerHTML=entries.length?`<table><thead><tr><th>Date</th><th>Weight (${weightUnit})</th><th>Actions</th></tr></thead><tbody>${[...entries].reverse().map(p=>`<tr><td>${h(new Date(p.date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}))}</td><td>${toDisplayWeight(p.weight)}</td><td><div class="bw-actions"><button type="button" aria-label="Edit weight for ${h(localDateKey(p.date))}" onclick="editWeightEntry('${p.id}')">Edit</button><button type="button" aria-label="Delete weight for ${h(localDateKey(p.date))}" onclick="deleteWeightEntry('${p.id}')">Delete</button></div></td></tr>`).join('')}</tbody></table>`:'<p class="bw-empty">No measurements yet. Add your first weight above to start your trend.</p>';
}

function renderBodyweightChart() {
  const range=document.getElementById('bw-range').value,cutoff=new Date();cutoff.setHours(0,0,0,0);if(range!=='all')cutoff.setDate(cutoff.getDate()-Number(range)+1);
  const points=getWeightEntries().filter(p=>range==='all'||Date.parse(p.date)>=cutoff.getTime()).map(p=>({date:p.date,value:Number(toDisplayWeight(p.weight))}));
  if(points.length)drawTrend(points,weightUnit,'bw-chart-wrap',true);else document.getElementById('bw-chart-wrap').innerHTML='<p class="bw-empty">No weights logged in this range. Add a measurement or choose All time.</p>';
}

function saveWeightEntry() {
  const date=document.getElementById('bw-date').value,input=document.getElementById('bw-value').value,parsed=new Date(date+'T12:00:00'),weight=Number(fromDisplayWeight(input));
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(parsed.getTime())||localDateKey(parsed)!==date||date>localDateKey(new Date())){toast('Choose a valid date up to today');return;}
  if(!input.trim()||!Number.isFinite(weight)||weight<=0){toast('Enter a valid weight above zero');return;}
  const entries=getWeightEntries(),old=entries.find(p=>p.id===editingWeightId),entry={id:old?.id||uid(),date:old&&localDateKey(old.date)===date?old.date:date===localDateKey(new Date())?new Date().toISOString():parsed.toISOString(),weight};
  if(editingWeightId&&!old){toast('This entry no longer exists');renderBodyweight();return;}
  if(!persistWeightEntries(old?entries.map(p=>p.id===old.id?entry:p):[...entries,entry]))return;
  renderBodyweight();renderSettings();toast(old?'Weight updated':'Weight logged');
}

function editWeightEntry(id) {
  const entry=getWeightEntries().find(p=>p.id===id);if(!entry)return;editingWeightId=id;document.getElementById('bw-date').value=localDateKey(entry.date);document.getElementById('bw-value').value=toDisplayWeight(entry.weight);document.getElementById('bw-submit').textContent='Save changes';document.getElementById('bw-cancel').hidden=false;document.getElementById('bw-form').scrollIntoView({behavior:'smooth',block:'center'});document.getElementById('bw-value').focus({preventScroll:true});
}

function deleteWeightEntry(id) {
  const entries=getWeightEntries();if(!entries.some(p=>p.id===id)||!confirm('Delete this weight measurement?'))return;
  if(persistWeightEntries(entries.filter(p=>p.id!==id))){renderBodyweight();renderSettings();toast('Weight entry deleted');}
}

function changeBodyweightUnit(unit) {
  const input=document.getElementById('bw-value'),kg=input.value===''?null:fromDisplayWeight(input.value),date=document.getElementById('bw-date').value,id=editingWeightId;
  setWeightUnit(unit);if(id)editWeightEntry(id);document.getElementById('bw-date').value=date;if(kg!==null)input.value=toDisplayWeight(kg);
}

function initializeApp() {
  save('customPlan',getActivePlan());currentDay=Math.min(currentDay,getActivePlan().length-1);save('currentDay',currentDay);
  setupPresets();recomputePRs();syncWeeklyGoal();renderToday();renderPlan();
  document.addEventListener('click',event=>{const wrapper=document.getElementById('exercise-autocomplete');if(wrapper&&!wrapper.contains(event.target))hideExerciseSuggestions();});
  refreshStreakDate();window.addEventListener('focus',refreshStreakDate);window.addEventListener('pageshow',refreshStreakDate);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshStreakDate();});setInterval(refreshStreakDate,60000);
  let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(document.getElementById('page-progress').classList.contains('active'))renderProgress();if(document.getElementById('page-bodyweight').classList.contains('active'))renderBodyweightChart();},150);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('.modal-overlay.open').forEach(m=>m.classList.remove('open'));editingExIndex=null;editingDayIndex=null;dayEditing=null;catchupPreview=null;}});
}
try{initializeApp();}catch(error){console.error(error);setupPresets();renderToday();renderPlan();}
