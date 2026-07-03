// tools.js - Tool popups (Calculator, Timer, Notes, Ruler, Clock, Music, Theme)
const Tools = (() => {
  let activeTimer = null;

  function createTimerPopup() {
    Popup.cFP('timer-popup', 'Timer & Stopwatch', `
      <div style="text-align:center;">
        <div style="display:flex;gap:6px;justify-content:center;margin-bottom:16px;">
          <button class="timer-mode-btn active" data-mode="countdown">Countdown</button>
          <button class="timer-mode-btn" data-mode="stopwatch">Stopwatch</button>
        </div>
        <div class="timer-display" id="timer-display">05:00</div>
        <div id="countdown-inputs" style="display:flex;gap:8px;justify-content:center;align-items:center;margin:14px 0;">
          <input type="number" id="timer-minutes" class="field-input" style="width:70px;text-align:center;" value="5" min="0" max="99">
          <span style="font-weight:700;color:#94a3b8;font-size:1.2rem;">:</span>
          <input type="number" id="timer-seconds" class="field-input" style="width:70px;text-align:center;" value="0" min="0" max="59">
        </div>
        <div style="display:flex;gap:8px;justify-content:center;margin-bottom:12px;">
          <button id="timer-start-btn" class="btn btn-success">Start</button>
          <button id="timer-pause-btn" class="btn" style="background:#f59e0b;color:#fff;" disabled>Pauze</button>
          <button id="timer-reset-btn" class="btn btn-ghost">Reset</button>
        </div>
        <div id="timer-status" style="font-size:.8rem;color:#64748b;">Stel een tijd in</div>
      </div>`, '380px', 'auto', true, Config.IC.timer);

    if (activeTimer) clearInterval(activeTimer);
    let currentMode = 'countdown', timeLeft = 300, stopwatchTime = 0, isRunning = false, timerInterval = null;
    const display = Utils.$('#timer-display'), minInp = Utils.$('#timer-minutes'), secInp = Utils.$('#timer-seconds');
    const startBtn = Utils.$('#timer-start-btn'), pauseBtn = Utils.$('#timer-pause-btn'), resetBtn = Utils.$('#timer-reset-btn');
    const status = Utils.$('#timer-status'), modeBtns = Utils.$$('.timer-mode-btn'), countdownInputs = Utils.$('#countdown-inputs');
    const fmt = s => `${String(Math.floor(Math.max(0,s)/60)).padStart(2,'0')}:${String(Math.max(0,s)%60).padStart(2,'0')}`;
    const updateDisplay = () => {
      if (currentMode === 'countdown') {
        display.textContent = fmt(timeLeft);
        if (timeLeft <= 0 && isRunning) { display.textContent = '00:00'; stopTimer(); status.textContent = 'Tijd is om!'; status.style.color = '#ef4444'; }
        else { status.textContent = isRunning ? 'Bezig met aftellen...' : 'Gepauzeerd'; status.style.color = isRunning ? '#22c55e' : '#f59e0b'; }
      } else {
        display.textContent = fmt(stopwatchTime);
        status.textContent = isRunning ? 'Stopwatch loopt...' : 'Gestopt';
        status.style.color = isRunning ? '#22c55e' : '#64748b';
      }
    };
    const updateTimer = () => { if (!isRunning) return; if (currentMode === 'countdown') { if (timeLeft > 0) timeLeft--; else stopTimer(); } else stopwatchTime++; updateDisplay(); };
    const startTimer = () => {
      if (isRunning) return;
      if (currentMode === 'countdown') {
        let mins = parseInt(minInp.value)||0, secs = Math.min(parseInt(secInp.value)||0,59);
        if (timeLeft <= 0) { timeLeft = mins*60+secs; if (timeLeft<=0) { status.textContent='Vul een geldige tijd in'; return; } }
        minInp.disabled = secInp.disabled = true;
      }
      isRunning = true; timerInterval = setInterval(updateTimer, 1000);
      startBtn.disabled = true; pauseBtn.disabled = false; updateDisplay();
    };
    const stopTimer = () => { isRunning = false; if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } startBtn.disabled = false; pauseBtn.disabled = true; updateDisplay(); };
    const resetTimer = () => {
      stopTimer();
      if (currentMode === 'countdown') { let m=parseInt(minInp.value)||0,s2=Math.min(parseInt(secInp.value)||0,59); timeLeft=m*60+s2; minInp.disabled=secInp.disabled=false; status.textContent='Stel een tijd in'; }
      else { stopwatchTime=0; status.textContent='Gereset'; }
      status.style.color='#64748b'; updateDisplay();
    };
    const switchMode = mode => {
      if (isRunning) stopTimer(); currentMode = mode;
      modeBtns.forEach(b => b.classList.toggle('active', b.dataset.mode===mode));
      if (mode==='countdown') { countdownInputs.style.display='flex'; minInp.disabled=secInp.disabled=false; timeLeft=(parseInt(minInp.value)||5)*60+Math.min(parseInt(secInp.value)||0,59); status.textContent='Stel een tijd in'; }
      else { countdownInputs.style.display='none'; status.textContent='Druk op Start'; }
      status.style.color='#64748b'; startBtn.disabled=false; pauseBtn.disabled=true; updateDisplay();
    };
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', stopTimer);
    resetBtn.addEventListener('click', resetTimer);
    modeBtns.forEach(b => b.addEventListener('click', () => switchMode(b.dataset.mode)));
    [minInp,secInp].forEach(inp => inp.addEventListener('change', () => { if(!isRunning&&currentMode==='countdown'){secInp.value=Math.min(parseInt(secInp.value)||0,59);timeLeft=(parseInt(minInp.value)||0)*60+(parseInt(secInp.value)||0);updateDisplay();} }));
    updateDisplay();
  }

  function createCalcPopup() {
    Popup.cFP('calc-popup', 'Rekenmachine', `
      <input id="calc-disp" readonly value="0" style="width:100%;padding:10px 14px;font-size:1.4rem;text-align:right;border:1.5px solid #e2e8f0;border-radius:10px;background:#f8fafc;outline:none;margin-bottom:10px;font-family:ui-monospace,monospace;font-weight:600;">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;">
        ${['7','8','9','/',  '4','5','6','*',  '1','2','3','-',  '0','.','=','+'].map(v => {
          const isOp = '/+*-'.includes(v), isEq = v==='=';
          const bg = isEq ? 'background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;' : isOp ? 'background:#f1f5f9;color:#3b82f6;font-weight:700;' : 'background:#f8fafc;';
          return `<button class="calc-btn" data-value="${v}" style="padding:13px;font-size:1rem;border:1.5px solid #e2e8f0;border-radius:10px;cursor:pointer;font-weight:600;transition:background .1s,transform .1s;${bg}">${v}</button>`;
        }).join('')}
        <button class="calc-btn" data-value="C" style="padding:13px;font-size:.9rem;border:1.5px solid #fee2e2;border-radius:10px;background:#fff1f2;color:#ef4444;cursor:pointer;font-weight:700;grid-column:span 4;">Wissen</button>
      </div>`, '300px', 'auto', true, Config.IC.calc);
    const inp = document.getElementById('calc-disp'); let expr = '';
    document.getElementById('calc-popup').querySelectorAll('.calc-btn').forEach(b => {
      b.addEventListener('click', () => {
        const v = b.dataset.value;
        if (v==='C') { expr=''; inp.value='0'; }
        else if (v==='=') { try { expr=eval(expr).toString(); } catch { expr=''; inp.value='Fout'; return; } inp.value=expr; }
        else { if (expr==='0'&&v!=='.') expr=v; else expr+=v; inp.value=expr; }
      });
    });
  }

  function createNotesPopup() {
    Popup.cFP('notes-popup', 'Notities', `
      <textarea id="global-notes" class="field-input" style="height:300px;resize:none;line-height:1.6;" placeholder="Schrijf hier je notities..."></textarea>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
        <span id="notes-count" style="font-size:.75rem;color:#94a3b8;">0 tekens</span>
        <button id="notes-copy" class="btn btn-ghost" style="font-size:.75rem;">Kopiëren</button>
      </div>`, '500px', '420px', true, Config.IC.notes);
    const area = document.getElementById('global-notes'), counter = document.getElementById('notes-count');
    area.value = Utils.gS('modern_global_notes') || '';
    const upd = () => { Utils.sS('modern_global_notes', area.value); counter.textContent = area.value.length + ' tekens'; };
    upd(); area.addEventListener('input', upd);
    document.getElementById('notes-copy').addEventListener('click', () => navigator.clipboard.writeText(area.value).catch(()=>{}));
  }

  function createRulerPopup() {
    Popup.cFP('ruler-popup', 'Liniaal', `
      <div id="ruler-container" style="position:relative;height:48px;background:repeating-linear-gradient(90deg,#e2e8f0 0,#e2e8f0 1px,transparent 1px,transparent 10px);border-radius:10px;overflow:hidden;cursor:crosshair;border:1.5px solid #e2e8f0;">
        <div id="ruler-bar" style="height:100%;background:linear-gradient(90deg,#3b82f650,#3b82f6);width:0;transition:width .05s;"></div>
        <div id="ruler-line" style="position:absolute;top:0;bottom:0;width:2px;background:#3b82f6;pointer-events:none;display:none;"></div>
      </div>
      <p id="ruler-info" style="text-align:center;font-weight:600;color:#475569;margin-top:10px;font-size:.875rem;">Beweeg de muis over de liniaal</p>`, '440px', 'auto', true, Config.IC.ruler);
    const rb = document.getElementById('ruler-bar'), ri = document.getElementById('ruler-info'), rc = document.getElementById('ruler-container'), rl = document.getElementById('ruler-line');
    rc.addEventListener('mousemove', e => {
      const r = rc.getBoundingClientRect(), w = Math.min(Math.max(e.clientX-r.left,0),r.width);
      rb.style.width = w+'px'; rl.style.left = w+'px'; rl.style.display = 'block';
      ri.innerHTML = `<span style="color:#3b82f6;font-weight:700;">${Math.round(w)}px</span> &nbsp;/&nbsp; ≈ ${(w/37.8).toFixed(1)} cm`;
    });
    rc.addEventListener('mouseleave', () => { rl.style.display='none'; ri.textContent='Beweeg de muis over de liniaal'; });
  }

  function createClockPopup() {
    Popup.cFP('clock-popup', 'Klok', '<canvas id="clock-canvas" width="200" height="200" style="display:block;margin:0 auto;"></canvas>', '240px', 'auto', true, Config.IC.clock);
    setTimeout(() => {
      const cv = document.getElementById('clock-canvas'); if (!cv) return;
      const ctx = cv.getContext('2d'), r = 100; ctx.translate(r, r);
      const draw = () => {
        ctx.clearRect(-r,-r,200,200);
        ctx.beginPath(); ctx.arc(0,0,r-2,0,2*Math.PI); ctx.fillStyle='#f8fafc'; ctx.fill();
        ctx.strokeStyle='#e2e8f0'; ctx.lineWidth=4; ctx.stroke();
        ctx.fillStyle='#334155'; ctx.font='bold 11px Inter,sans-serif'; ctx.textBaseline='middle'; ctx.textAlign='center';
        for (let i=1;i<=12;i++) { const a=i*Math.PI/6; const x=Math.sin(a)*(r-18), y=-Math.cos(a)*(r-18); ctx.fillText(i,x,y); }
        ctx.strokeStyle='#cbd5e1'; ctx.lineWidth=1;
        for (let i=0;i<60;i++) { const a=i*Math.PI/30, x1=Math.sin(a)*(r-8), y1=-Math.cos(a)*(r-8), x2=Math.sin(a)*(r-4), y2=-Math.cos(a)*(r-4); ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); }
        const n=new Date(), h=n.getHours()%12, m=n.getMinutes(), s=n.getSeconds();
        const hand=(pos,len,wid,col='#1e293b')=>{ ctx.beginPath(); ctx.lineWidth=wid; ctx.lineCap='round'; ctx.strokeStyle=col; ctx.moveTo(0,0); ctx.rotate(pos); ctx.lineTo(0,-len); ctx.stroke(); ctx.rotate(-pos); };
        hand((h*Math.PI/6)+(m*Math.PI/360)+(s*Math.PI/21600),r*.45,5);
        hand((m*Math.PI/30)+(s*Math.PI/1800),r*.62,3.5);
        hand(s*Math.PI/30,r*.72,1.5,'#ef4444');
        ctx.beginPath(); ctx.arc(0,0,4,0,2*Math.PI); ctx.fillStyle='#1e293b'; ctx.fill();
      };
      draw(); setInterval(draw,1000);
    }, 80);
  }

  function createMusicPopup() {
    const connected = Utils.gS('modern_spotify_connected') === 'true';
    const lastQuery = Utils.gS('modern_spotify_last_query') || '';
    const content = connected ? `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div style="padding:12px 14px;border-radius:14px;background:linear-gradient(135deg,#1db954,#169c46);color:#fff;">
          <div style="font-weight:800;margin-bottom:4px;">Spotify verbonden</div>
          <div style="font-size:.85rem;opacity:.95;">Zoek muziek op Spotify en open direct je resultaten.</div>
        </div>
        <div style="padding:12px 14px;border-radius:14px;border:1px solid #e2e8f0;background:#f8fafc;color:#334155;font-size:.9rem;line-height:1.5;">
          We zijn bezig met een ingebouwde Spotify in de extensie-victorini.
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <input id="spotify-search" class="field-input" value="${Utils.eH(lastQuery)}" placeholder="Zoek een nummer of artiest..." style="flex:1;">
          <button id="spotify-search-btn" class="btn btn-success">Zoek</button>
        </div>
        <div style="display:flex;gap:8px;">
          <button id="spotify-open-btn" class="btn btn-ghost" style="flex:1;">Openen in Spotify</button>
          <button id="spotify-disconnect-btn" class="btn" style="background:#ef4444;color:#fff;">Verbreken</button>
        </div>
        <div id="spotify-status" style="font-size:.8rem;color:#64748b;">${lastQuery ? `Laatste zoekopdracht: ${Utils.eH(lastQuery)}` : 'Nog geen zoekopdracht'}</div>
        <iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M" width="100%" height="300" frameborder="0" allow="autoplay;clipboard-write;encrypted-media;fullscreen;picture-in-picture"></iframe>
      </div>` : `
      <div style="display:flex;flex-direction:column;gap:12px;text-align:center;">
        <div style="padding:16px;border-radius:14px;background:linear-gradient(135deg,#1db954,#169c46);color:#fff;">
          <div style="font-weight:800;font-size:1rem;margin-bottom:6px;">Spotify verbinden</div>
          <div style="font-size:.9rem;opacity:.95;">Verbind je Spotify-account om muziek te zoeken en te luisteren vanuit deze popup.</div>
        </div>
        <button id="spotify-connect-btn" class="btn btn-success" style="padding:12px 16px;">Verbinden met Spotify</button>
        <div style="font-size:.8rem;color:#64748b;">Na de verbinding kun je zoeken en direct naar Spotify gaan.</div>
      </div>`;

    Popup.cFP('music-popup', 'Spotify', content, '520px', '440px', true, Config.IC.music);

    const connectBtn = document.getElementById('spotify-connect-btn');
    if (connectBtn) {
      connectBtn.addEventListener('click', () => {
        Utils.sS('modern_spotify_connected', 'true');
        createMusicPopup();
      });
    }

    const disconnectBtn = document.getElementById('spotify-disconnect-btn');
    if (disconnectBtn) {
      disconnectBtn.addEventListener('click', () => {
        Utils.sS('modern_spotify_connected', 'false');
        Utils.sS('modern_spotify_last_query', '');
        createMusicPopup();
      });
    }

    const searchInput = document.getElementById('spotify-search');
    const searchBtn = document.getElementById('spotify-search-btn');
    const openBtn = document.getElementById('spotify-open-btn');
    const statusEl = document.getElementById('spotify-status');

    if (searchInput && searchBtn && openBtn && statusEl) {
      const openSpotifySearch = () => {
        const query = searchInput.value.trim();
        if (!query) {
          statusEl.textContent = 'Typ een nummer of artiest om te zoeken.';
          return;
        }
        Utils.sS('modern_spotify_last_query', query);
        statusEl.textContent = `Zoekopdracht: ${query}`;
        window.open(`https://open.spotify.com/search/${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer');
      };

      searchBtn.addEventListener('click', openSpotifySearch);
      openBtn.addEventListener('click', openSpotifySearch);
      searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') openSpotifySearch();
      });
    }
  }

  function createQuotePopup() {
    const quotes = [
      { text: 'Kleine stapjes voeren ook tot grote vooruitgang.', author: 'Modern Smartschool' },
      { text: 'Een rustige geest leert sneller.', author: 'Inspiratie' },
      { text: 'Plan je dag en je dag plan je leven.', author: 'Zelfontwikkeling' },
      { text: 'Focus is de sleutel tot resultaat.', author: 'Productiviteit' }
    ];
    const index = Utils.gI('modern_quote_index') % quotes.length;
    Utils.sI('modern_quote_index', (index + 1) % quotes.length);
    const quote = quotes[index];

    const p = Popup.cFP('quote-popup', 'Citaten', `
      <div style="text-align:center;padding:6px 0;">
        <div style="font-size:1.05rem;font-weight:700;color:#1e293b;margin-bottom:10px;line-height:1.5;">“${Utils.eH(quote.text)}”</div>
        <div style="color:#64748b;font-size:.9rem;">— ${Utils.eH(quote.author)}</div>
      </div>
      <div style="display:flex;gap:8px;justify-content:center;margin-top:14px;">
        <button id="quote-new-btn" class="btn btn-success">Nieuwe quote</button>
        <button id="quote-copy-btn" class="btn btn-ghost">Kopiëren</button>
      </div>`, '420px', 'auto', true, Config.IC.quote);

    p.querySelector('#quote-new-btn').addEventListener('click', createQuotePopup);
    p.querySelector('#quote-copy-btn').addEventListener('click', () => {
      navigator.clipboard.writeText(`“${quote.text}” — ${quote.author}`).catch(() => {});
    });
  }

  function createTodoPopup() {
    const key = 'modern_todo_items';
    let items = [];
    try { items = JSON.parse(Utils.gS(key) || '[]'); } catch { items = []; }

    const saveItems = () => Utils.sS(key, JSON.stringify(items));
    const renderItems = listEl => {
      if (!listEl) return;
      if (!items.length) {
        listEl.innerHTML = '<div style="padding:10px;border-radius:12px;background:#f8fafc;color:#64748b;text-align:center;">Nog geen taken.</div>';
        return;
      }
      listEl.innerHTML = items.map((item, index) => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border:1px solid #e2e8f0;border-radius:12px;background:${item.done ? '#f0fdf4' : '#fff'};">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;flex:1;">
            <input type="checkbox" ${item.done ? 'checked' : ''} data-index="${index}">
            <span style="text-decoration:${item.done ? 'line-through' : 'none'};color:${item.done ? '#64748b' : '#1e293b'};">${Utils.eH(item.text)}</span>
          </label>
          <button class="todo-delete-btn" data-index="${index}" style="border:none;background:none;color:#ef4444;cursor:pointer;">${Config.IC.trash}</button>
        </div>`).join('');

      listEl.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.addEventListener('change', e => {
        const idx = parseInt(e.target.dataset.index, 10);
        if (!Number.isNaN(idx)) {
          items[idx].done = e.target.checked;
          saveItems();
          renderItems(listEl);
        }
      }));

      listEl.querySelectorAll('.todo-delete-btn').forEach(btn => btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        if (!Number.isNaN(idx)) {
          items.splice(idx, 1);
          saveItems();
          renderItems(listEl);
        }
      }));
    };

    Popup.cFP('todo-popup', 'Todo lijst', `
      <div style="display:flex;gap:8px;margin-bottom:10px;">
        <input id="todo-input" class="field-input" placeholder="Nieuwe taak..." style="flex:1;">
        <button id="todo-add-btn" class="btn btn-success">Toevoegen</button>
      </div>
      <div id="todo-list" style="display:flex;flex-direction:column;gap:8px;max-height:280px;overflow:auto;"></div>`, '420px', '420px', true, Config.IC.todo);

    const listEl = document.getElementById('todo-list');
    const inputEl = document.getElementById('todo-input');
    const addBtn = document.getElementById('todo-add-btn');
    const addTask = () => {
      const text = inputEl?.value.trim();
      if (!text) return;
      items.push({ text, done: false });
      saveItems();
      inputEl.value = '';
      renderItems(listEl);
    };

    addBtn?.addEventListener('click', addTask);
    inputEl?.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });
    renderItems(listEl);
  }

  function createTextToolPopup() {
    Popup.cFP('texttool-popup', 'Tekst tools', `
      <textarea id="texttool-input" class="field-input" style="height:180px;resize:none;" placeholder="Typ hier je tekst..."></textarea>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:10px;">
        <button class="texttool-btn" data-action="upper">Uppercase</button>
        <button class="texttool-btn" data-action="lower">Lowercase</button>
        <button class="texttool-btn" data-action="reverse">Omgekeerd</button>
        <button class="texttool-btn" data-action="clear">Wissen</button>
      </div>
      <div id="texttool-info" style="margin-top:10px;font-size:.8rem;color:#64748b;">0 tekens</div>`, '440px', 'auto', true, Config.IC.type);

    const input = document.getElementById('texttool-input');
    const info = document.getElementById('texttool-info');
    const updateInfo = () => {
      if (!input || !info) return;
      info.textContent = `${input.value.length} tekens`;
    };
    input?.addEventListener('input', updateInfo);
    updateInfo();

    const popup = document.getElementById('texttool-popup');
    popup?.querySelectorAll('.texttool-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (!input) return;
        const value = input.value;
        if (action === 'upper') input.value = value.toUpperCase();
        else if (action === 'lower') input.value = value.toLowerCase();
        else if (action === 'reverse') input.value = value.split('').reverse().join('');
        else if (action === 'clear') input.value = '';
        updateInfo();
      });
    });
  }

  function createColorGamePopup() {
    const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    let score = 0;
    let target = colors[Math.floor(Math.random() * colors.length)];

    const render = () => {
      const html = `
        <div style="text-align:center;display:flex;flex-direction:column;gap:12px;">
          <div style="font-size:1rem;font-weight:800;color:#1e293b;">Kleurenspel</div>
          <div style="font-size:.9rem;color:#64748b;">Klik op de kleur die overeenkomt met de tekst.</div>
          <div style="font-size:1.3rem;font-weight:800;letter-spacing:.1em;color:${target};">${target.toUpperCase()}</div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
            ${colors.map(c => `<button class="color-game-btn" data-color="${c}" style="height:50px;border:none;border-radius:12px;background:${c};cursor:pointer;box-shadow:0 4px 12px ${c}40;"></button>`).join('')}
          </div>
          <div style="font-size:.9rem;font-weight:700;color:#475569;">Score: ${score}</div>
        </div>`;
      const popup = document.getElementById('color-game-popup');
      if (popup) popup.querySelector('.floating-body').innerHTML = html;
      popup?.querySelectorAll('.color-game-btn').forEach(btn => btn.addEventListener('click', () => {
        const selected = btn.dataset.color;
        if (selected === target) {
          score += 1;
          target = colors[Math.floor(Math.random() * colors.length)];
          render();
        } else {
          score = Math.max(0, score - 1);
          render();
        }
      }));
    };

    Popup.cFP('color-game-popup', 'Kleurenspel', '<div></div>', '360px', 'auto', true, Config.IC.palette);
    render();
  }

  function createQuickNotesPopup() {
    const key = 'modern_quick_notes';
    let notes = Utils.gS(key) || '';

    Popup.cFP('quick-notes-popup', 'Snelnotities', `
      <textarea id="quick-notes-input" class="field-input" style="height:220px;resize:none;" placeholder="Schrijf een snelle notitie..."></textarea>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
        <span style="font-size:.75rem;color:#64748b;">Auto-opgeslagen</span>
        <button id="quick-notes-clear" class="btn btn-ghost" style="font-size:.75rem;">Wissen</button>
      </div>`, '420px', '300px', true, Config.IC.notes);

    const input = document.getElementById('quick-notes-input');
    if (input) {
      input.value = notes;
      input.addEventListener('input', () => Utils.sS(key, input.value));
    }
    document.getElementById('quick-notes-clear')?.addEventListener('click', () => {
      if (input) input.value = '';
      Utils.sS(key, '');
    });
  }

  function createAiChatPopup() {
    const storageKey = 'modern_ai_chat_history';
    const apiKeyStorageKey = 'modern_gemini_api_key';
    let history = [];
    try { history = JSON.parse(Utils.gS(storageKey) || '[]'); } catch { history = []; }

    const saveHistory = () => Utils.sS(storageKey, JSON.stringify(history));

    const popup = Popup.cFP('ai-chatbot-popup', 'AI Chatbot', `
      <div style="display:flex;flex-direction:column;height:100%;gap:10px;">
        <div style="display:flex;gap:8px;margin-bottom:4px;">
          <input id="ai-chatbot-apikey" class="field-input" type="password" placeholder="Gemini API-key" style="flex:1;">
          <button id="ai-chatbot-savekey" class="btn btn-ghost">Opslaan</button>
        </div>
        <div id="ai-chatbot-status" style="font-size:.75rem;color:#64748b;">Voer je Gemini API-key in om te beginnen.</div>
        <div id="ai-chatbot-messages" style="flex:1;display:flex;flex-direction:column;gap:8px;overflow:auto;padding-right:4px;"></div>
        <div style="display:flex;gap:8px;">
          <input id="ai-chatbot-input" class="field-input" placeholder="Stel een vraag of typ een opdracht..." style="flex:1;">
          <button id="ai-chatbot-send" class="btn btn-success">Verstuur</button>
        </div>
      </div>`, '480px', '480px', true, Config.IC.chat);

    const msgBox = popup.querySelector('#ai-chatbot-messages');
    const input = popup.querySelector('#ai-chatbot-input');
    const sendBtn = popup.querySelector('#ai-chatbot-send');
    const apiKeyInput = popup.querySelector('#ai-chatbot-apikey');
    const saveKeyBtn = popup.querySelector('#ai-chatbot-savekey');
    const statusBox = popup.querySelector('#ai-chatbot-status');

    const setStatus = text => { if (statusBox) statusBox.textContent = text; };

    const renderMessages = () => {
      if (!msgBox) return;
      if (!history.length) {
        msgBox.innerHTML = '<div style="padding:12px 14px;border-radius:12px;background:#f8fafc;color:#64748b;">Welkom! Stel een vraag of laat me je helpen met een tool.</div>';
        return;
      }
      msgBox.innerHTML = history.map(item => `
        <div style="display:flex;justify-content:${item.role === 'user' ? 'flex-end' : 'flex-start'};">
          <div style="max-width:82%;padding:10px 12px;border-radius:14px;background:${item.role === 'user' ? '#3b82f6' : '#f1f5f9'};color:${item.role === 'user' ? '#fff' : '#1e293b'};box-shadow:0 2px 10px rgba(0,0,0,.04);">
            ${Utils.eH(item.text)}
          </div>
        </div>`).join('');
      msgBox.scrollTop = msgBox.scrollHeight;
    };

    const loadApiKey = () => {
      const saved = Utils.gS(apiKeyStorageKey).trim();
      if (apiKeyInput && saved) apiKeyInput.value = saved;
    };

    const saveApiKey = () => {
      const key = apiKeyInput?.value.trim();
      if (!key) {
        setStatus('Voer een Gemini API-key in voordat je begint.');
        return;
      }
      Utils.sS(apiKeyStorageKey, key);
      setStatus('Gemini API-key opgeslagen.');
    };

    const sendMessage = async () => {
      const text = input?.value.trim();
      const apiKey = Utils.gS(apiKeyStorageKey).trim();
      if (!text) return;
      if (!apiKey) {
        setStatus('Voeg eerst je Gemini API-key toe.');
        return;
      }

      history.push({ role: 'user', text });
      saveHistory();
      renderMessages();
      setStatus('Bezig met reageren via Gemini...');
      sendBtn.disabled = true;
      input.disabled = true;

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: history.slice(-12).map(item => ({
              role: item.role === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }]
            })),
            generationConfig: { temperature: 0.7 }
          })
        });

        const data = await response.json();
        const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Ik kon geen antwoord ophalen van Gemini.';
        history.push({ role: 'assistant', text: aiText });
        saveHistory();
        renderMessages();
        setStatus('Antwoord ontvangen van Gemini.');
      } catch (err) {
        history.push({ role: 'assistant', text: 'Er ging iets mis bij het ophalen van het antwoord van Gemini.' });
        saveHistory();
        renderMessages();
        setStatus('Kon geen verbinding maken met Gemini.');
      } finally {
        input.value = '';
        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
      }
    };

    saveKeyBtn?.addEventListener('click', saveApiKey);
    sendBtn?.addEventListener('click', () => { sendMessage(); });
    input?.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
    loadApiKey();
    renderMessages();
  }

  function createGlobalChatPopup() {
    Popup.cFP('global-chat-popup', 'Globale chat', `
      <div style="display:flex;align-items:center;justify-content:center;height:100%;padding:20px;text-align:center;">
        <div style="max-width:320px;">
          <div style="font-size:1.05rem;font-weight:800;color:#1e293b;margin-bottom:10px;">Globale chat is nog niet beschikbaar</div>
          <div style="font-size:.95rem;color:#64748b;line-height:1.5;">We werken eraan - victorini</div>
        </div>
      </div>`, '420px', '260px', true, Config.IC.chat);
  }

  function createThemePopup() {
    const themes = [
      { n: 'Nacht',    s: '#0f172a', h: '#0f172a', a: '#3b82f6', label: 'Donkerblauw' },
      { n: 'Nacht',    s: '#0f0f1a', h: '#1a1a2e', a: '#6c63ff', label: 'Middernacht' },
      { n: 'Natuur',   s: '#1a2e1a', h: '#0f1a0f', a: '#22c55e', label: 'Groen' },
      { n: 'Royaal',   s: '#2d1b4e', h: '#1a0f2e', a: '#a855f7', label: 'Paurs' },
      { n: 'Oceaan',   s: '#0c4a6e', h: '#082f49', a: '#06b6d4', label: 'Oceaan' },
      { n: 'Neon',     s: '#1a0a2e', h: '#0d0015', a: '#d946ef', label: 'Gaming' },
    ];
    const swatches = themes.map((t, i) => `
      <button class="theme-card" data-theme="${i}" style="background:linear-gradient(135deg,${t.s},${t.h});padding:14px 10px;border-radius:14px;cursor:pointer;text-align:center;color:#fff;border:2px solid rgba(255,255,255,.1);transition:transform .2s,box-shadow .2s;">
        <div style="width:28px;height:28px;border-radius:50%;background:${t.a};margin:0 auto 8px;box-shadow:0 0 12px ${t.a}80;"></div>
        <div style="font-size:.75rem;font-weight:700;">${t.label}</div>
      </button>`).join('');
    const p = Popup.cFP('theme-popup', 'Thema', `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">${swatches}</div>`, '360px', 'auto', false, Config.IC.palette);
    p.querySelectorAll('.theme-card').forEach(c => {
      c.addEventListener('mouseenter', () => { c.style.transform='scale(1.04)'; c.style.boxShadow='0 8px 24px rgba(0,0,0,.3)'; });
      c.addEventListener('mouseleave', () => { c.style.transform=''; c.style.boxShadow=''; });
      c.addEventListener('click', () => {
        const t = themes[parseInt(c.dataset.theme)];
        const sb = document.getElementById('custom-sidebar'), hd = document.getElementById('custom-header');
        if (sb) sb.style.background = `linear-gradient(180deg,${t.h} 0%,${t.s} 100%)`;
        if (hd) hd.style.background = `linear-gradient(135deg,${t.s},${t.h})`;
        Utils.sSC(t.s); Utils.sS('modern_header_color', t.h); Utils.sS('modern_accent_color', t.a);
        Styles.buildStyles(t.a);
        Utils.$$('.sidebar-item.active').forEach(el => { el.style.background = `linear-gradient(135deg,${t.a},${t.a}cc)`; el.style.boxShadow = `0 4px 16px ${t.a}40`; });
        p.remove();
      });
    });
  }

  return { createTimerPopup, createCalcPopup, createNotesPopup, createRulerPopup, createClockPopup, createQuotePopup, createTodoPopup, createTextToolPopup, createColorGamePopup, createQuickNotesPopup, createAiChatPopup, createGlobalChatPopup, createMusicPopup, createThemePopup };
})();
