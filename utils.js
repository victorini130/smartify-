// utils.js - Shared utility functions
const Utils = (() => {
  // DOM helpers
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  // Storage helpers
  const gS = k => localStorage.getItem(k) || '';
  const sS = (k, v) => localStorage.setItem(k, v);
  const gI = k => parseInt(gS(k) || '0', 10);
  const sI = (k, v) => sS(k, String(v));
  const gJ = k => { try { return JSON.parse(gS(k) || 'null') || []; } catch { return []; } };
  const sJ = (k, v) => sS(k, JSON.stringify(v));

  // High score helpers
  const gHS = g => gI('modern_highscore_' + g);
  const sHS = (g, s) => { if (s > gHS(g)) { sI('modern_highscore_' + g, s); return true; } return false; };

  // User settings
  const gSN = () => gS('modern_username');
  const sSN = n => sS('modern_username', n);
  const gSP = () => gS('modern_pfp');
  const sSP = d => sS('modern_pfp', d);
  const rSP = () => sS('modern_pfp', '');
  const gSB = () => gS('modern_birthday');
  const sSB = d => sS('modern_birthday', d);
  const gSC = () => gS('modern_sidebar_color') || '#0f172a';
  const sSC = c => sS('modern_sidebar_color', c);
  const gSdC = () => gS('modern_sidebar_collapsed') === 'true';
  const sSdC = c => sS('modern_sidebar_collapsed', String(c));

  // Streak
  const gSt = () => gI('modern_streak');
  const uS = () => {
    const t = new Date().toDateString(), l = gS('modern_lastVisit');
    let s = gSt();
    if (l !== t) {
      const y = new Date(); y.setDate(y.getDate() - 1);
      s = l === y.toDateString() ? s + 1 : 1;
      sS('modern_lastVisit', t); sI('modern_streak', s);
    }
    return s;
  };

  // HTML escape
  const eH = t => String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  return {
    $, $$, gS, sS, gI, sI, gJ, sJ, gHS, sHS,
    gSN, sSN, gSP, sSP, rSP, gSB, sSB, gSC, sSC, gSdC, sSdC,
    gSt, uS, eH
  };
})();
