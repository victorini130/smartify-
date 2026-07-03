// layout.js - Main layout building and initialization
const Layout = (() => {
  let originalMainContainer = null;

  function buildLayout() {
    const nav = document.querySelector('#left,#menu,#navigatie,td.left,div.left,nav,#sidebar,#hoofdmenu');
    if (!nav) return;
    const mc = document.querySelector('#content,#main,#midden,td.content,div.content,#maincontent,div.main')
      || [...document.querySelectorAll('div')].reduce((a,b) => a.offsetWidth > b.offsetWidth ? a : b);
    if (!mc) return;

    originalMainContainer = mc;
    Utils.uS();

    const ow = document.createElement('div');
    ow.id = 'original-smartschool'; 
    ow.style.display = 'none';
    while (document.body.firstChild) ow.appendChild(document.body.firstChild);
    document.body.appendChild(ow);

    const nl = document.createElement('div');
    nl.id = 'modern-custom-layout';
    nl.innerHTML = `
      <header id="custom-header">
        <button id="sidebar-toggle" title="Sidebar">${Config.IC.menu}</button>
        <div class="logo">Modern Smartschool</div>
        <div class="header-center">
          <div class="datetime" id="header-datetime"></div>
        </div>
        <button class="user-btn" id="user-btn" title="Profiel & Instellingen"></button>
      </header>
      <div id="custom-main">
        <nav id="custom-sidebar"></nav>
        <div id="custom-content"></div>
      </div>`;
    document.body.appendChild(nl);

    const cz = document.getElementById('custom-content');
    cz.appendChild(mc);
    nav.style.display = 'none';

    const sb = document.getElementById('custom-sidebar');
    const accent = Utils.gS('modern_accent_color') || '#3b82f6';
    Styles.buildStyles(accent);

    // Sidebar helper
    const addItem = (label, icon, cb, href) => {
      const el = document.createElement('a');
      el.className = 'sidebar-item'; 
      el.href = href || '#';
      if (href) el.target = '_blank';
      el.innerHTML = `<span class="sb-icon">${icon}</span><span class="sb-text">${label}</span>`;
      if (cb) el.addEventListener('click', e => { if (!href) e.preventDefault(); cb(); });
      sb.appendChild(el); 
      return el;
    };
    const addSep = label => {
      const d = document.createElement('div'); 
      d.className = 'sidebar-separator'; 
      d.textContent = label; 
      sb.appendChild(d);
    };

    // Dashboard
    const dashItem = addItem('Dashboard', Config.IC.home, () => {
      if (originalMainContainer) originalMainContainer.style.display = 'none';
      Dashboard.renderDashboard();
      Utils.$$('.sidebar-item').forEach(e => e.classList.remove('active'));
      dashItem.classList.add('active');
    });
    dashItem.classList.add('active');

    // Smartschool original
    const startLink = [...document.querySelectorAll('a')].find(a => a.href?.includes('smartschool.be') && a.textContent.trim().toLowerCase().includes('start'));
    if (startLink) addItem('Smartschool', Config.IC.globe, () => Popup.cFP('start-popup','Smartschool',`<iframe src="${startLink.href}" style="width:100%;height:640px;border:none;border-radius:12px;"></iframe>`,'950px','720px'));

    addSep('fun');
    addItem('Game Center', Config.IC.gamepad, createGameCenter);
    addItem('temp Chat', Config.IC.chat, () => Popup.cFP('chat-popup','Chat',`<iframe src="https://smartifychat.base44.app" style="width:100%;height:500px;border:none;border-radius:12px;"></iframe>`,'720px','580px'));
    addItem('Leaderboard', Config.IC.trophy, () => {
      const sorted = [...Config.GAMES].map(g=>({...g,score:Utils.gHS(g.id)})).sort((a,b)=>b.score-a.score);
      const rows = sorted.map((s,i)=>`<div style="display:flex;align-items:center;padding:9px 0;border-bottom:1px solid #f1f5f9;gap:10px;"><span style="font-weight:800;width:28px;color:#3b82f6;font-size:.85rem;">#${i+1}</span><span style="flex:1;font-size:.85rem;font-weight:600;color:#1e293b;">${s.name}</span><span style="font-weight:700;font-size:.85rem;color:#475569;">${s.score}</span></div>`).join('');
      Popup.cFP('leaderboard-popup','Leaderboard',`<div>${rows}</div>`,'380px','auto',true,Config.IC.trophy);
    });
    addItem('Discord', Config.IC.discord, null, 'https://discord.gg/FahUeMAer4');

    addSep('Gereedschap');
    addItem('Rekenmachine', Config.IC.calc, Tools.createCalcPopup);
    addItem('Notities',     Config.IC.notes, Tools.createNotesPopup);
    addItem('Liniaal',      Config.IC.ruler, Tools.createRulerPopup);
    addItem('Timer',        Config.IC.timer, Tools.createTimerPopup);
    addItem('Klok',         Config.IC.clock, Tools.createClockPopup);
    addItem('Citaten',      Config.IC.quote, Tools.createQuotePopup);
    addItem('Todo lijst',   Config.IC.todo, Tools.createTodoPopup);
    addItem('Tekst tools',  Config.IC.type, Tools.createTextToolPopup);
    addItem('AI Chatbot',   Config.IC.chat, Tools.createAiChatPopup);
    addItem('chat', Config.IC.chat, Tools.createGlobalChatPopup);    addItem('Kleurenspel',  Config.IC.palette, Tools.createColorGamePopup);
    addItem('Snelnotities', Config.IC.notes, Tools.createQuickNotesPopup);    addItem('Muziek',       Config.IC.music, Tools.createMusicPopup);
    addItem('Thema',        Config.IC.palette, Tools.createThemePopup);

    // Collapse
    if (Utils.gSdC()) sb.classList.add('collapsed');
    document.getElementById('sidebar-toggle').addEventListener('click', () => {
      sb.classList.toggle('collapsed'); 
      Utils.sSdC(sb.classList.contains('collapsed'));
    });

    // DateTime
    const updateDateTime = () => {
      const el = document.getElementById('header-datetime'); 
      if (!el) return;
      const n = new Date();
      el.textContent = `${n.toLocaleDateString('nl-BE',{weekday:'short',month:'short',day:'numeric'})}  ${n.toLocaleTimeString('nl-BE',{hour:'2-digit',minute:'2-digit'})}`;
    };
    updateDateTime(); 
    setInterval(updateDateTime, 1000);

    // User button
    const updateUser = () => {
      const btn = document.getElementById('user-btn'); 
      if (!btn) return;
      const name = Utils.gSN() || 'Gebruiker', pfp = Utils.gSP(), streak = Utils.gSt();
      btn.innerHTML = '';
      if (pfp) {
        const img = document.createElement('img'); 
        img.src = pfp; 
        img.className = 'pfp-img'; 
        btn.appendChild(img);
      } else {
        const sp = document.createElement('span'); 
        sp.className = 'pfp-default'; 
        sp.innerHTML = Config.IC.user; 
        btn.appendChild(sp);
      }
      const ns = document.createElement('span'); 
      ns.className = 'user-name'; 
      ns.textContent = name; 
      btn.appendChild(ns);
      if (streak >= 2) {
        const badge = document.createElement('span'); 
        badge.className = 'streak-badge'; 
        badge.innerHTML = `${Config.IC.fire}${streak}`; 
        btn.appendChild(badge);
      }
    };
    updateUser();

    // Settings popup
    document.getElementById('user-btn').addEventListener('click', () => {
      const pfp = Utils.gSP(), bday = Utils.gSB();
      Popup.cFP('settings-popup', 'Instellingen', `
        <div style="margin-bottom:14px;">
          <label style="display:block;margin-bottom:5px;font-weight:600;font-size:.8rem;color:#475569;">Naam</label>
          <input type="text" id="username-input" class="field-input" value="${Utils.eH(Utils.gSN())}" placeholder="Jouw naam">
        </div>
        <div style="margin-bottom:14px;">
          <label style="display:block;margin-bottom:5px;font-weight:600;font-size:.8rem;color:#475569;">Verjaardag</label>
          <input type="date" id="birthday-input" class="field-input" value="${bday}">
        </div>
        <div style="margin-bottom:16px;">
          <label style="display:block;margin-bottom:5px;font-weight:600;font-size:.8rem;color:#475569;">Profielfoto</label>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
            <div style="width:52px;height:52px;border-radius:50%;overflow:hidden;border:2px solid #e2e8f0;display:flex;align-items:center;justify-content:center;background:#f8fafc;flex-shrink:0;">
              ${pfp ? `<img src="${pfp}" style="width:100%;height:100%;object-fit:cover;">` : `<span style="color:#94a3b8;">${Config.IC.user}</span>`}
            </div>
            <div style="flex:1;">
              <input type="file" id="pfp-upload" accept="image/*" style="font-size:.78rem;width:100%;">
              ${pfp ? `<button id="remove-pfp" class="btn btn-danger" style="margin-top:6px;font-size:.75rem;padding:5px 12px;">${Config.IC.trash} Verwijder</button>` : ''}
            </div>
          </div>
        </div>
        <button id="save-settings-btn" class="btn btn-primary" style="width:100%;justify-content:center;">${Config.IC.save} Opslaan</button>
      `, '400px', 'auto', false, Config.IC.settings);
    });

    document.addEventListener('click', e => {
      if (e.target.id === 'save-settings-btn' || e.target.closest('#save-settings-btn')) {
        const ni = document.getElementById('username-input'), bi = document.getElementById('birthday-input');
        if (ni) Utils.sSN(ni.value.trim()); 
        if (bi) Utils.sSB(bi.value);
        updateUser(); 
        document.getElementById('settings-popup')?.remove();
      }
      if (e.target.id === 'remove-pfp' || e.target.closest('#remove-pfp')) {
        Utils.rSP(); 
        updateUser(); 
        document.getElementById('settings-popup')?.remove();
        setTimeout(() => document.getElementById('user-btn')?.click(), 50);
      }
    });

    document.addEventListener('change', e => {
      if (e.target.id === 'pfp-upload') {
        const file = e.target.files[0]; 
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => { 
          Utils.sSP(ev.target.result); 
          updateUser(); 
          document.getElementById('settings-popup')?.remove(); 
          setTimeout(() => document.getElementById('user-btn')?.click(), 50); 
        };
        reader.readAsDataURL(file);
      }
    });

    if (originalMainContainer) originalMainContainer.style.display = 'none';
    Dashboard.renderDashboard();
  }

  function createGameCenter() {
    const p = Popup.cFP('gamecenter-popup', 'Game Center', '', '780px', '640px', true, Config.IC.gamepad);
    const b = p.querySelector('.floating-body');
    b.style.padding = '16px';
    b.innerHTML = `
      <div id="gc-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;"></div>
      <div id="gc-play" style="display:none;"></div>`;
    const grid = b.querySelector('#gc-grid');
    Config.GAMES.forEach(g => {
      const card = document.createElement('div');
      card.style.cssText = 'background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:14px;padding:14px 10px;text-align:center;cursor:pointer;transition:background .15s,box-shadow .15s,transform .15s;';
      card.innerHTML = `<div style="color:#3b82f6;display:flex;justify-content:center;margin-bottom:8px;">${Config.GAME_ICONS[g.id]||Config.IC.gamepad}</div><div style="font-size:.8rem;font-weight:700;color:#1e293b;margin-bottom:3px;">${g.name}</div><div style="font-size:.68rem;color:#94a3b8;">${g.desc}</div><div style="font-size:.68rem;color:#64748b;margin-top:5px;font-weight:600;">Best: ${Utils.gHS(g.id)}</div>`;
      card.addEventListener('mouseenter', () => { card.style.background='#fff'; card.style.boxShadow='0 4px 16px rgba(0,0,0,.08)'; card.style.transform='translateY(-2px)'; });
      card.addEventListener('mouseleave', () => { card.style.background='#f8fafc'; card.style.boxShadow=''; card.style.transform=''; });
      card.addEventListener('click', () => {
        grid.style.display = 'none';
        const play = b.querySelector('#gc-play');
        play.style.display = 'block';
        play.innerHTML = `<button id="gc-back" class="btn btn-ghost" style="margin-bottom:12px;">${Config.IC.back} Terug</button><div id="gc-container"></div>`;
        if (Games.gameFns[g.id]) Games.gameFns[g.id](play.querySelector('#gc-container'), () => {});
        play.querySelector('#gc-back').addEventListener('click', () => { grid.style.display='grid'; play.style.display='none'; play.innerHTML=''; });
      });
      grid.appendChild(card);
    });
  }

  return { buildLayout };
})();
