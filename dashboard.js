// dashboard.js - Dashboard widget management
const Dashboard = (() => {
  let dashboardWidgets = null;
  let dashboardGames = null;
  
  const ensureLoaded = () => {
    if (!dashboardWidgets) dashboardWidgets = Utils.gJ('modern_dashboard_widgets');
    if (!dashboardGames) dashboardGames = Utils.gJ('modern_dashboard_games');
  };

  const saveDashboard = () => { 
    ensureLoaded();
    Utils.sJ('modern_dashboard_widgets', dashboardWidgets); 
    Utils.sJ('modern_dashboard_games', dashboardGames); 
  };

  function renderDashboard() {
    ensureLoaded();
    const content = document.getElementById('custom-content'); 
    if (!content) return;
    const old = document.getElementById('modern-dashboard'); 
    if (old) old.remove();
    
    const db = document.createElement('div');
    db.id = 'modern-dashboard';
    db.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;padding:20px;overflow-y:auto;background:linear-gradient(135deg,#f8fafc,#f1f5f9);';

    // header row
    const hRow = document.createElement('div');
    hRow.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:8px;';
    hRow.innerHTML = `
      <h2 style="font-size:1.25rem;font-weight:800;color:#0f172a;letter-spacing:-.5px;display:flex;align-items:center;gap:8px;">
        ${Config.IC.chart}<span>Dashboard</span>
      </h2>
      <div style="display:flex;gap:8px;">
        <button id="add-widget-btn" class="btn btn-primary">${Config.IC.plus} Widget</button>
        <button id="add-game-btn" class="btn btn-success">${Config.IC.plus} Game</button>
        <button id="clear-dashboard-btn" class="btn btn-danger">${Config.IC.trash} Clear</button>
      </div>`;
    db.appendChild(hRow);

    const total = dashboardWidgets.length + dashboardGames.length;
    if (total === 0) {
      const empty = document.createElement('div');
      empty.style.cssText = 'text-align:center;padding:60px 20px;background:rgba(255,255,255,.7);border-radius:16px;border:1.5px dashed #e2e8f0;';
      empty.innerHTML = `<div style="color:#cbd5e1;margin-bottom:12px;">${Config.IC.grid}</div><p style="color:#64748b;font-weight:600;">Dashboard is leeg</p><p style="font-size:.8rem;color:#94a3b8;margin-top:4px;">Klik op + Widget of + Game om te beginnen</p>`;
      db.appendChild(empty);
    } else {
      const grid = document.createElement('div');
      grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:16px;';

      const widgetRenderers = {
        clock: () => {
          const w = document.createElement('div'); w.className = 'dashboard-widget';
          w.innerHTML = `<div class="dash-widget-header"><div class="dash-widget-header-left">${Config.IC.clock}<span>Klok</span></div><button class="dash-remove-item" data-type="widget" data-item="clock">${Config.IC.close}</button></div><canvas id="dash-clock" width="160" height="160" style="margin:12px auto;display:block;"></canvas>`;
          return w;
        },
        weather: () => {
          const n=new Date(),m=n.getMonth(),h=n.getHours();
          let icon='☀️',temp='22°C',desc='Zonnig';
          if(m>=11||m<=1){icon='❄️';temp='3°C';desc='Koud en winters';}
          else if(m>=9&&m<=10){icon='🍂';temp='15°C';desc='Herfstachtig';}
          else if(m>=2&&m<=4){icon='🌸';temp='12°C';desc='Lenteachtig';}
          if(h<6||h>21){icon='🌙';}
          const w = document.createElement('div'); w.className = 'dashboard-widget';
          w.innerHTML = `<div class="dash-widget-header"><div class="dash-widget-header-left">${Config.IC.sun}<span>Weer</span></div><button class="dash-remove-item" data-type="widget" data-item="weather">${Config.IC.close}</button></div><div style="text-align:center;padding:20px;"><div style="font-size:3rem;margin-bottom:6px;">${icon}</div><div style="font-size:1.5rem;font-weight:800;color:#1e293b;">${temp}</div><div style="font-size:.8rem;color:#64748b;margin-top:4px;">${desc}</div></div>`;
          return w;
        },
        todo: () => {
          const w = document.createElement('div'); w.className = 'dashboard-widget';
          const todos = Utils.gJ('modern_todos');
          const items = todos.length
            ? todos.map((t,i) => `<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid #f1f5f9;"><input type="checkbox" data-index="${i}" ${t.done?'checked':''} style="width:16px;height:16px;cursor:pointer;accent-color:#3b82f6;"><span style="flex:1;font-size:.82rem;${t.done?'text-decoration:line-through;color:#94a3b8;':'color:#1e293b;'}">${Utils.eH(t.text)}</span><button class="delete-todo" data-index="${i}" style="background:none;border:none;cursor:pointer;color:#cbd5e1;line-height:0;padding:2px;">${Config.IC.close}</button></div>`).join('')
            : '<p style="color:#94a3b8;text-align:center;padding:12px;font-size:.8rem;">Geen taken</p>';
          w.innerHTML = `<div class="dash-widget-header"><div class="dash-widget-header-left">${Config.IC.todo}<span>Taken</span></div><button class="dash-remove-item" data-type="widget" data-item="todo">${Config.IC.close}</button></div><div id="dash-todo" style="padding:8px 14px;max-height:200px;overflow-y:auto;">${items}</div>`;
          return w;
        },
        notes: () => {
          const w = document.createElement('div'); w.className = 'dashboard-widget';
          w.innerHTML = `<div class="dash-widget-header"><div class="dash-widget-header-left">${Config.IC.notes}<span>Notities</span></div><button class="dash-remove-item" data-type="widget" data-item="notes">${Config.IC.close}</button></div><textarea id="dash-notes" placeholder="Schrijf hier..." style="width:100%;height:110px;border:none;padding:12px 14px;resize:none;font-size:.82rem;outline:none;background:transparent;font-family:inherit;line-height:1.6;color:#334155;"></textarea>`;
          return w;
        },
        quote: () => {
          const qs=[{t:"De enige manier om geweldig werk te doen is houden van wat je doet.",a:"Steve Jobs"},{t:"Leren is een schat die zijn eigenaar overal volgt.",a:"Chinees gezegde"},{t:"Onderwijs is het krachtigste wapen om de wereld te veranderen.",a:"Nelson Mandela"}];
          const q=qs[new Date().getDate()%qs.length];
          const w = document.createElement('div'); w.className = 'dashboard-widget';
          w.innerHTML = `<div class="dash-widget-header"><div class="dash-widget-header-left">${Config.IC.quote}<span>Quote</span></div><button class="dash-remove-item" data-type="widget" data-item="quote">${Config.IC.close}</button></div><div style="padding:16px;"><div style="font-size:.88rem;font-style:italic;color:#475569;line-height:1.6;">"${q.t}"</div><div style="margin-top:10px;font-size:.78rem;font-weight:700;color:#1e293b;">— ${q.a}</div></div>`;
          return w;
        },
        birthday: () => {
          const bd=Utils.gSB(); if(!bd)return null;
          const n=new Date(),[,m,d]=bd.split('-').map(Number);
          let nb=new Date(n.getFullYear(),m-1,d);
          if(nb<n)nb=new Date(n.getFullYear()+1,m-1,d);
          const days=Math.floor((nb-n)/86400000);
          const w = document.createElement('div'); w.className = 'dashboard-widget';
          w.innerHTML = `<div class="dash-widget-header"><div class="dash-widget-header-left">${Config.IC.birthday}<span>Verjaardag</span></div><button class="dash-remove-item" data-type="widget" data-item="birthday">${Config.IC.close}</button></div><div style="text-align:center;padding:20px;"><div style="font-size:2.5rem;margin-bottom:8px;">🎂</div><div style="font-size:1rem;color:#1e293b;">Nog <strong style="color:#3b82f6;font-size:1.4rem;">${days}</strong> dagen!</div></div>`;
          return w;
        },
        ruler: () => {
          const w = document.createElement('div'); w.className = 'dashboard-widget';
          w.innerHTML = `<div class="dash-widget-header"><div class="dash-widget-header-left">${Config.IC.ruler}<span>Liniaal</span></div><button class="dash-remove-item" data-type="widget" data-item="ruler">${Config.IC.close}</button></div><div style="padding:12px 14px;"><div id="dash-ruler" style="position:relative;height:40px;background:repeating-linear-gradient(90deg,#e2e8f0 0,#e2e8f0 1px,transparent 1px,transparent 10px);border-radius:8px;overflow:hidden;cursor:crosshair;border:1.5px solid #e2e8f0;"><div id="dash-ruler-bar" style="height:100%;background:linear-gradient(90deg,#3b82f640,#3b82f6);width:0;"></div></div><p id="dash-ruler-info" style="text-align:center;font-size:.75rem;color:#64748b;margin-top:6px;">Beweeg de muis</p></div>`;
          return w;
        },
        stats: () => {
          const w = document.createElement('div'); w.className = 'dashboard-widget';
          const totalPts = Config.GAMES.reduce((s,g)=>s+Utils.gHS(g.id),0);
          w.innerHTML = `<div class="dash-widget-header"><div class="dash-widget-header-left">${Config.IC.chart}<span>Statistieken</span></div><button class="dash-remove-item" data-type="widget" data-item="stats">${Config.IC.close}</button></div><div style="padding:14px;display:grid;grid-template-columns:1fr 1fr;gap:10px;">${[['Naam',Utils.gSN()||'—',Config.IC.user],['Streak',Utils.gSt()+' dagen',Config.IC.fire],['Games',Config.GAMES.length,Config.IC.gamepad],['Punten',totalPts,Config.IC.star]].map(([l,v,ic])=>`<div style="background:#f8fafc;border-radius:10px;padding:10px;"><div style="color:#94a3b8;display:flex;align-items:center;gap:4px;font-size:.7rem;margin-bottom:4px;">${ic}${l}</div><div style="font-weight:700;font-size:.95rem;color:#1e293b;">${v}</div></div>`).join('')}</div>`;
          return w;
        }
      };

      dashboardWidgets.forEach(id => {
        const el = widgetRenderers[id] ? widgetRenderers[id]() : null;
        if (el) grid.appendChild(el);
      });
      
      dashboardGames.forEach(id => {
        const game = Config.GAMES.find(g => g.id === id); 
        if (!game) return;
        const w = document.createElement('div'); 
        w.className = 'dashboard-widget dashboard-game';
        w.innerHTML = `<div class="dash-widget-header"><div class="dash-widget-header-left">${Config.GAME_ICONS[id]||Config.IC.gamepad}<span>${game.name}</span></div><button class="dash-remove-item" data-type="game" data-item="${id}">${Config.IC.close}</button></div><div id="dash-game-${id}" style="padding:10px;min-height:280px;display:flex;align-items:center;justify-content:center;"></div>`;
        grid.appendChild(w);
      });
      
      db.appendChild(grid);
    }
    
    content.appendChild(db);

    // Wire up events
    setTimeout(() => {
      // Add widget
      document.getElementById('add-widget-btn')?.addEventListener('click', () => {
        const avail=[{id:'clock',name:'Klok',icon:Config.IC.clock},{id:'weather',name:'Weer',icon:Config.IC.sun},{id:'todo',name:'Taken',icon:Config.IC.todo},{id:'notes',name:'Notities',icon:Config.IC.notes},{id:'quote',name:'Quote',icon:Config.IC.quote},{id:'birthday',name:'Verjaardag',icon:Config.IC.birthday},{id:'ruler',name:'Liniaal',icon:Config.IC.ruler},{id:'stats',name:'Statistieken',icon:Config.IC.chart}];
        const unused=avail.filter(w=>!dashboardWidgets.includes(w.id));
        if(!unused.length){alert('Alle widgets zijn al toegevoegd!');return;}
        const menu=unused.map(w=>`<button class="widget-option" data-id="${w.id}" style="display:flex;align-items:center;gap:10px;width:100%;padding:10px 14px;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:10px;cursor:pointer;margin-bottom:6px;font-size:.85rem;font-weight:500;color:#1e293b;transition:background .15s;">${w.icon}<span>${w.name}</span></button>`).join('');
        const popup=Popup.cFP('widget-selector','Widget toevoegen',`<div>${menu}</div>`,'300px','auto',false,Config.IC.plus);
        popup.querySelectorAll('.widget-option').forEach(b=>b.addEventListener('click',()=>{dashboardWidgets.push(b.dataset.id);saveDashboard();renderDashboard();popup.remove();}));
      });

      // Add game
      document.getElementById('add-game-btn')?.addEventListener('click', () => {
        const unused=Config.GAMES.filter(g=>!dashboardGames.includes(g.id));
        if(!unused.length){alert('Alle games zijn al toegevoegd!');return;}
        const menu=unused.map(g=>`<button class="widget-option" data-id="${g.id}" style="display:flex;align-items:center;gap:10px;width:100%;padding:10px 14px;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:10px;cursor:pointer;margin-bottom:6px;font-size:.85rem;font-weight:500;color:#1e293b;transition:background .15s;">${Config.GAME_ICONS[g.id]||Config.IC.gamepad}<span>${g.name} <small style="color:#94a3b8;font-weight:400;">— ${g.desc}</small></span></button>`).join('');
        const popup=Popup.cFP('game-selector','Game toevoegen',`<div style="max-height:360px;overflow-y:auto;">${menu}</div>`,'320px','auto',false,Config.IC.gamepad);
        popup.querySelectorAll('.widget-option').forEach(b=>b.addEventListener('click',()=>{dashboardGames.push(b.dataset.id);saveDashboard();renderDashboard();popup.remove();}));
      });

      // Clear
      document.getElementById('clear-dashboard-btn')?.addEventListener('click', () => {
        if(confirm('Weet je zeker dat je alles wilt verwijderen?')){dashboardWidgets.length=0;dashboardGames.length=0;saveDashboard();renderDashboard();}
      });

      // Remove items
      Utils.$$('.dash-remove-item').forEach(b=>b.addEventListener('click',()=>{
        const{type,item}=b.dataset;
        if(type==='widget'){const i=dashboardWidgets.indexOf(item);if(i>-1)dashboardWidgets.splice(i,1);}
        else{const i=dashboardGames.indexOf(item);if(i>-1)dashboardGames.splice(i,1);}
        saveDashboard();renderDashboard();
      }));

      // Clock widget
      if(dashboardWidgets.includes('clock')){const cv=document.getElementById('dash-clock');if(cv){const ctx=cv.getContext('2d'),r=80;ctx.translate(r,r);const drawC=()=>{ctx.clearRect(-r,-r,160,160);ctx.beginPath();ctx.arc(0,0,r-1,0,2*Math.PI);ctx.fillStyle='#f8fafc';ctx.fill();ctx.strokeStyle='#e2e8f0';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#334155';ctx.font='bold 9px Inter,sans-serif';ctx.textBaseline='middle';ctx.textAlign='center';for(let i=1;i<=12;i++){const a=i*Math.PI/6,x=Math.sin(a)*(r-14),y=-Math.cos(a)*(r-14);ctx.fillText(i,x,y);}const n=new Date(),h=n.getHours()%12,m=n.getMinutes(),s=n.getSeconds();const hand=(pos,len,wid,col='#1e293b')=>{ctx.beginPath();ctx.lineWidth=wid;ctx.lineCap='round';ctx.strokeStyle=col;ctx.moveTo(0,0);ctx.rotate(pos);ctx.lineTo(0,-len);ctx.stroke();ctx.rotate(-pos);};hand((h*Math.PI/6)+(m*Math.PI/360)+(s*Math.PI/21600),r*.42,4);hand((m*Math.PI/30)+(s*Math.PI/1800),r*.58,2.5);hand(s*Math.PI/30,r*.66,1.5,'#ef4444');ctx.beginPath();ctx.arc(0,0,3,0,2*Math.PI);ctx.fillStyle='#1e293b';ctx.fill();};drawC();setInterval(drawC,1000);}}

      // Notes widget
      if(dashboardWidgets.includes('notes')){const a=document.getElementById('dash-notes');if(a){a.value=Utils.gS('modern_dash_notes')||'';a.addEventListener('input',()=>Utils.sS('modern_dash_notes',a.value));}}

      // Todo widget
      if(dashboardWidgets.includes('todo')){
        const tc=document.getElementById('dash-todo');if(tc){
          tc.querySelectorAll('input[type="checkbox"]').forEach(cb=>cb.addEventListener('change',e=>{const todos=Utils.gJ('modern_todos');if(todos[e.target.dataset.index]){todos[e.target.dataset.index].done=e.target.checked;Utils.sJ('modern_todos',todos);renderDashboard();}}));
          tc.querySelectorAll('.delete-todo').forEach(btn=>btn.addEventListener('click',()=>{const todos=Utils.gJ('modern_todos');todos.splice(parseInt(btn.dataset.index),1);Utils.sJ('modern_todos',todos);renderDashboard();}));
        }
      }

      // Ruler widget
      if(dashboardWidgets.includes('ruler')){const rc=document.getElementById('dash-ruler');if(rc){const rb=document.getElementById('dash-ruler-bar'),ri=document.getElementById('dash-ruler-info');rc.addEventListener('mousemove',e=>{const r=rc.getBoundingClientRect(),w=Math.min(Math.max(e.clientX-r.left,0),r.width);rb.style.width=w+'px';ri.innerHTML=`<b style="color:#3b82f6;">${Math.round(w)}px</b> ≈ ${(w/37.8).toFixed(1)} cm`;});rc.addEventListener('mouseleave',()=>ri.textContent='Beweeg de muis');}}

      // Dashboard games
      dashboardGames.forEach(id=>{const container=document.getElementById('dash-game-'+id);if(container&&Games.gameFns[id])Games.gameFns[id](container,()=>{});});

    }, 80);
  }

  return { 
    renderDashboard, 
    get dashboardWidgets() { ensureLoaded(); return dashboardWidgets; },
    get dashboardGames() { ensureLoaded(); return dashboardGames; }
  };
})();
