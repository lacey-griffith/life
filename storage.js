const STORAGE_KEY = 'lifeos-state';
export const DATA_VERSION = 3;

const defaults = {
  version: DATA_VERSION,
  screen: 'home',
  arrival: null,
  currentQuestion: null,
  entries: [],
  stars: [],
  affinity: {},
  lastUsed: {},
  constellationTransform: { x:-310, y:-170, scale:.72 },
  selectedChoice: null,
  installTipDismissed: false
};

function parse(raw){
  try { return raw ? JSON.parse(raw) : {}; }
  catch { return {}; }
}

function migrate(raw){
  const next = { ...defaults, ...raw };
  next.entries = Array.isArray(next.entries) ? next.entries : [];
  next.stars = Array.isArray(next.stars) ? next.stars : [];
  next.affinity = next.affinity || {};
  next.lastUsed = next.lastUsed || {};
  next.constellationTransform = next.constellationTransform || defaults.constellationTransform;

  // v0.1/v0.2 stored full star objects in `moments` and later duplicated them into `entries`.
  // Preserve all existing user data and normalize stars into references.
  const legacyMoments = Array.isArray(raw.moments) ? raw.moments : [];
  if (legacyMoments.length) {
    for (const moment of legacyMoments) {
      if (!next.entries.some(entry => entry.id === moment.id)) {
        next.entries.push({
          id: moment.id,
          at: moment.at,
          text: moment.text,
          question: moment.question,
          pillar: moment.pillar,
          intent: moment.intent,
          arrival: moment.arrival
        });
      }
      if (!next.stars.some(star => star.entryId === moment.id)) {
        next.stars.push({
          entryId: moment.id,
          x: moment.x,
          y: moment.y,
          importance: moment.importance || 1
        });
      }
    }
  }

  delete next.moments;
  next.version = DATA_VERSION;
  return next;
}

export function loadState(){ return migrate(parse(localStorage.getItem(STORAGE_KEY))); }
export function saveState(state){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
export function newId(){ return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`; }
export function exportState(state){
  const payload = { exportedAt:new Date().toISOString(), version:DATA_VERSION, state };
  const blob = new Blob([JSON.stringify(payload,null,2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `life-os-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
