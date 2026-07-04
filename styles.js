// styles.js - Global CSS styling
const Styles = (() => {
  function buildStyles(accent = '#3b82f6') {
    const existing = document.getElementById('modern-global-style');
    if (existing) existing.remove();
    const s = document.createElement('style');
    s.id = 'modern-global-style';
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
      *{margin:0;padding:0;box-sizing:border-box;}
      body{font-family:'Inter',system-ui,sans-serif;background:#f1f5f9;overflow:hidden;height:100vh;}
      #modern-custom-layout{display:flex;flex-direction:column;height:100vh;}

      /* ── Header ── */
      #custom-header{display:flex;align-items:center;gap:12px;background:linear-gradient(135deg,#0f172a,#1e293b);color:#fff;padding:0 20px;height:56px;z-index:100;box-shadow:0 4px 24px rgba(0,0,0,.2);border-bottom:1px solid rgba(255,255,255,.06);flex-shrink:0;}
      #sidebar-toggle{display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);color:#fff;padding:8px;border-radius:10px;cursor:pointer;transition:background .2s,transform .15s;}
      #sidebar-toggle:hover{background:rgba(255,255,255,.16);transform:scale(1.05);}
      .logo{font-size:1.1rem;font-weight:800;letter-spacing:-.5px;background:linear-gradient(135deg,#60a5fa,#a78bfa);-webkit-background-clip:text;background-clip:text;color:transparent;white-space:nowrap;}
      .header-center{display:flex;align-items:center;gap:10px;margin-left:auto;}
      .search{position:relative;display:flex;align-items:center;}
      .search-icon{position:absolute;left:10px;color:#64748b;pointer-events:none;display:flex;}
      .search input{padding:7px 14px 7px 34px;border-radius:20px;border:1px solid rgba(255,255,255,.1);outline:none;width:180px;font-size:.8rem;background:rgba(255,255,255,.07);color:#fff;transition:background .2s,width .3s;}
      .search input::placeholder{color:#64748b;}
      .search input:focus{background:rgba(255,255,255,.13);width:220px;}
      .datetime{font-size:.7rem;color:#94a3b8;background:rgba(255,255,255,.07);padding:5px 12px;border-radius:20px;font-weight:500;white-space:nowrap;}
      .mode-toggle{display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.07);color:#e2e8f0;cursor:pointer;font-size:.75rem;font-weight:600;transition:background .2s,border-color .2s;}
      .mode-toggle:hover{background:rgba(255,255,255,.12);}
      .mode-toggle.active{background:rgba(96,165,250,.2);border-color:rgba(96,165,250,.35);}
      .mode-toggle-switch{position:relative;width:36px;height:20px;border-radius:999px;background:rgba(255,255,255,.2);transition:background .2s;}
      .mode-toggle.active .mode-toggle-switch{background:linear-gradient(135deg,#60a5fa,#a78bfa);}
      .mode-toggle-knob{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.25);}
      .mode-toggle.active .mode-toggle-knob{transform:translateX(16px);}      
      .modern-mode-reenable-btn{position:fixed;top:12px;right:12px;z-index:20000;display:inline-flex;align-items:center;gap:6px;padding:7px 10px;border:none;border-radius:999px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#fff;font-weight:700;font-size:.72rem;cursor:pointer;box-shadow:0 6px 16px rgba(59,130,246,.24);line-height:1;white-space:nowrap;max-width:calc(100vw - 24px);overflow:hidden;text-overflow:ellipsis;}
      .modern-mode-reenable-btn:hover{transform:translateY(-1px);opacity:.95;}
      .user-btn{display:flex;align-items:center;gap:8px;cursor:pointer;padding:5px 12px 5px 5px;border-radius:24px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);transition:background .2s,box-shadow .2s;}
      .user-btn:hover{background:rgba(255,255,255,.14);box-shadow:0 0 0 2px rgba(96,165,250,.3);}
      .pfp-img{width:28px;height:28px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,.25);}
      .pfp-default{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#60a5fa,#a78bfa);display:flex;align-items:center;justify-content:center;color:#fff;}
      .user-name{font-size:.8rem;font-weight:600;}
      .streak-badge{display:flex;align-items:center;gap:3px;background:rgba(251,146,60,.15);color:#fb923c;font-size:.7rem;font-weight:700;padding:2px 8px;border-radius:20px;}

      /* ── Layout ── */
      #custom-main{display:flex;flex:1;overflow:hidden;}

      /* ── Sidebar ── */
      #custom-sidebar{width:240px;overflow-y:auto;overflow-x:hidden;padding:12px 8px;transition:width .3s cubic-bezier(.4,0,.2,1);background:linear-gradient(180deg,#1e293b 0%,#0f172a 100%);border-right:1px solid rgba(255,255,255,.05);flex-shrink:0;}
      #custom-sidebar.collapsed{width:64px;}
      #custom-sidebar.collapsed .sb-text{display:none;}
      #custom-sidebar.collapsed .sidebar-item{justify-content:center;padding:10px;}
      #custom-sidebar.collapsed .sidebar-separator{padding:4px;height:1px;background:rgba(255,255,255,.08);border-radius:1px;margin:8px 10px;overflow:hidden;}
      #custom-sidebar.collapsed .sidebar-separator span{display:none;}
      .sidebar-separator{padding:14px 10px 4px;font-size:.65rem;color:#475569;text-transform:uppercase;letter-spacing:1.2px;font-weight:600;}
      .sidebar-item{display:flex;align-items:center;gap:10px;padding:9px 12px;margin:1px 0;color:#94a3b8;text-decoration:none;font-size:.82rem;border-radius:10px;cursor:pointer;transition:background .15s,color .15s,transform .15s;font-weight:500;white-space:nowrap;overflow:hidden;border:1px solid transparent;}
      .sidebar-item:hover{background:rgba(255,255,255,.07);color:#e2e8f0;transform:translateX(3px);}
      .sidebar-item.active{background:linear-gradient(135deg,${accent},${accent}cc);color:#fff;border-color:rgba(255,255,255,.1);box-shadow:0 4px 16px ${accent}40;}
      .sb-icon{flex-shrink:0;width:20px;display:flex;align-items:center;justify-content:center;}
      #custom-content{flex:1;overflow-y:auto;background:linear-gradient(135deg,#f8fafc,#f1f5f9);position:relative;}

      /* ── Floating Popup ── */
      .floating-popup{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(255,255,255,.98);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-radius:20px;box-shadow:0 24px 64px -12px rgba(0,0,0,.3),0 0 0 1px rgba(0,0,0,.05);z-index:10000;min-width:280px;max-height:85vh;display:flex;flex-direction:column;overflow:hidden;}
      .floating-popup.pinned-widget{box-shadow:0 8px 32px ${accent}50,0 0 0 2px ${accent};}
      .floating-header{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:linear-gradient(135deg,#0f172a,#1e293b);color:#fff;cursor:move;user-select:none;flex-shrink:0;}
      .floating-header-title{font-weight:700;font-size:.88rem;display:flex;align-items:center;gap:8px;}
      .floating-header-title svg{opacity:.7;}
      .floating-header-actions{display:flex;gap:4px;}
      .floating-header-actions button{display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.1);border:none;color:#fff;cursor:pointer;padding:6px;border-radius:8px;transition:background .15s,transform .15s;line-height:0;}
      .floating-header-actions button:hover{background:rgba(255,255,255,.2);}
      .floating-body{flex:1;overflow-y:auto;padding:16px;}
      .floating-resize-handle{position:absolute;bottom:0;right:0;width:16px;height:16px;cursor:nwse-resize;background:linear-gradient(135deg,transparent 50%,#cbd5e1 50%);border-radius:0 0 20px 0;opacity:.5;}

      /* ── Dashboard ── */
      .dashboard-widget{background:#fff;border-radius:16px;box-shadow:0 1px 4px rgba(0,0,0,.06),0 4px 16px rgba(0,0,0,.04);overflow:hidden;transition:box-shadow .2s,transform .2s;border:1px solid rgba(226,232,240,.8);}
      .dashboard-widget:hover{box-shadow:0 4px 24px rgba(0,0,0,.1);transform:translateY(-2px);}
      .dash-widget-header{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:#f8fafc;border-bottom:1px solid #f1f5f9;font-weight:700;font-size:.82rem;color:#1e293b;gap:8px;}
      .dash-widget-header-left{display:flex;align-items:center;gap:6px;}
      .dash-widget-header-left svg{color:${accent};}
      .dash-remove-item{display:flex;align-items:center;justify-content:center;background:transparent;border:none;color:#94a3b8;cursor:pointer;padding:4px;border-radius:6px;transition:background .15s,color .15s;line-height:0;}
      .dash-remove-item:hover{background:#fee2e2;color:#ef4444;}

      /* ── Buttons ── */
      .btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border:none;border-radius:10px;cursor:pointer;font-weight:600;font-size:.8rem;transition:opacity .15s,transform .15s,box-shadow .15s;}
      .btn:hover{opacity:.9;transform:translateY(-1px);}
      .btn-primary{background:linear-gradient(135deg,${accent},${accent}cc);color:#fff;box-shadow:0 4px 12px ${accent}40;}
      .btn-success{background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;box-shadow:0 4px 12px #22c55e40;}
      .btn-danger{background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;box-shadow:0 4px 12px #ef444440;}
      .btn-ghost{background:rgba(0,0,0,.05);color:#475569;}
      .btn-ghost:hover{background:rgba(0,0,0,.09);}

      /* ── Game ── */
      .game-container{display:flex;flex-direction:column;align-items:center;gap:10px;width:100%;}
      .game-controls{display:flex;justify-content:space-between;align-items:center;width:100%;flex-wrap:wrap;gap:6px;background:#f8fafc;padding:8px 12px;border-radius:12px;font-size:.8rem;border:1px solid #f1f5f9;}
      .game-reset-btn{display:inline-flex;align-items:center;gap:5px;background:linear-gradient(135deg,${accent},${accent}cc);border:none;padding:6px 14px;border-radius:8px;color:#fff;cursor:pointer;font-weight:600;transition:opacity .15s,transform .15s;font-size:.75rem;}
      .game-reset-btn:hover{opacity:.9;transform:translateY(-1px);}
      canvas{border-radius:12px;background:#0f172a;display:block;}

      /* ── Timer ── */
      .timer-mode-btn{padding:6px 14px;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:8px;cursor:pointer;font-weight:500;transition:background .15s,color .15s;font-size:.8rem;}
      .timer-mode-btn.active{background:${accent};color:#fff;border-color:${accent};}
      .timer-display{font-size:2.8rem;font-weight:800;font-family:ui-monospace,monospace;background:linear-gradient(135deg,#1e293b,${accent});-webkit-background-clip:text;background-clip:text;color:transparent;letter-spacing:2px;}

      /* ── Input ── */
      .field-input{width:100%;padding:9px 12px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:.875rem;outline:none;transition:border-color .15s,box-shadow .15s;font-family:inherit;}
      .field-input:focus{border-color:${accent};box-shadow:0 0 0 3px ${accent}20;}

      /* ── Scrollbar ── */
      ::-webkit-scrollbar{width:5px;height:5px;}
      ::-webkit-scrollbar-track{background:transparent;}
      ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:10px;}
      ::-webkit-scrollbar-thumb:hover{background:#94a3b8;}

      @media(max-width:768px){
        #custom-sidebar{width:64px;}
        .sb-text{display:none !important;}
        .sidebar-item{justify-content:center;padding:10px !important;}
        .datetime{display:none;}
        .floating-popup{max-width:95vw !important;}
      }
    `;
    document.head.appendChild(s);
  }

  return { buildStyles };
})();
