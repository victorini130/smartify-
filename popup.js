// popup.js - Floating popup system
const Popup = (() => {
  let pinnedWidgets = null;
  let widgetPositions = null;
  
  const ensureLoaded = () => {
    if (!pinnedWidgets) pinnedWidgets = Utils.gJ('modern_pinned_widgets');
    if (!widgetPositions) widgetPositions = Utils.gJ('modern_widget_positions');
  };
  
  const saveWidgets = () => { 
    ensureLoaded();
    Utils.sJ('modern_pinned_widgets', pinnedWidgets); 
    Utils.sJ('modern_widget_positions', widgetPositions); 
  };

  function cFP(id, title, html, w = '500px', h = 'auto', canPin = true, icon = '') {
    ensureLoaded();
    const ex = document.getElementById(id); 
    if (ex) ex.remove();
    
    const p = document.createElement('div');
    p.id = id;
    p.className = 'floating-popup';
    const isPinned = pinnedWidgets.includes(id);

    const pinIcon = isPinned
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3" fill="#fff"/></svg>`
      : Config.IC.pin;

    p.innerHTML = `
      <div class="floating-header">
        <span class="floating-header-title">${icon ? icon : ''}${Utils.eH(title)}</span>
        <div class="floating-header-actions">
          ${canPin ? `<button class="floating-pin" title="${isPinned ? 'Widget losmaken' : 'Vastpinnen'}">${pinIcon}</button>` : ''}
          <button class="floating-maximize" title="Maximaliseer">${Config.IC.maximize}</button>
          <button class="floating-minimize" title="Minimaliseer">${Config.IC.minimize}</button>
          <button class="floating-close" title="Sluiten">${Config.IC.close}</button>
        </div>
      </div>
      <div class="floating-body">${html}</div>
      <div class="floating-resize-handle"></div>`;

    document.body.appendChild(p);
    p.style.width = w;
    if (h !== 'auto') p.style.height = h;

    if (widgetPositions[id]) {
      p.style.cssText += `position:fixed;left:${widgetPositions[id].left};top:${widgetPositions[id].top};margin:0;transform:none;`;
    } else {
      p.style.cssText += 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);margin:0;';
    }
    
    const sz = JSON.parse(Utils.gS('modern_popup_' + id + '_size') || 'null');
    if (sz) { p.style.width = sz.width; p.style.height = sz.height; }
    if (isPinned) p.classList.add('pinned-widget');

    let maximized = false, prevStyle = {};
    p.querySelector('.floating-maximize').addEventListener('click', () => {
      if (!maximized) {
        prevStyle = { width: p.style.width, height: p.style.height, left: p.style.left, top: p.style.top, transform: p.style.transform, borderRadius: p.style.borderRadius };
        p.style.cssText += 'position:fixed;left:0;top:0;width:100vw;height:100vh;transform:none;margin:0;border-radius:0;max-height:100vh;';
        maximized = true;
      } else {
        Object.assign(p.style, prevStyle);
        p.style.borderRadius = prevStyle.borderRadius || '20px';
        p.style.maxHeight = '85vh';
        maximized = false;
      }
    });

    if (canPin) {
      const pinBtn = p.querySelector('.floating-pin');
      pinBtn.addEventListener('click', () => {
        const idx = pinnedWidgets.indexOf(id);
        if (idx > -1) { 
          pinnedWidgets.splice(idx, 1); 
          pinBtn.innerHTML = Config.IC.pin; 
          p.classList.remove('pinned-widget'); 
        }
        else { 
          pinnedWidgets.push(id); 
          p.classList.add('pinned-widget'); 
        }
        saveWidgets();
      });
    }

    p.querySelector('.floating-close').addEventListener('click', () => {
      const idx = pinnedWidgets.indexOf(id); 
      if (idx > -1) { pinnedWidgets.splice(idx, 1); saveWidgets(); }
      p.remove();
    });

    let minimized = false, originalHeight;
    p.querySelector('.floating-minimize').addEventListener('click', () => {
      const b = p.querySelector('.floating-body'), r = p.querySelector('.floating-resize-handle');
      if (!minimized) { 
        originalHeight = p.style.height; 
        b.style.display = 'none'; 
        r.style.display = 'none'; 
        p.style.height = 'auto'; 
      }
      else { 
        b.style.display = ''; 
        r.style.display = ''; 
        p.style.height = originalHeight; 
      }
      minimized = !minimized;
    });

    // Drag
    const hdr = p.querySelector('.floating-header');
    let drag = false, sx, sy, sl, st;
    hdr.addEventListener('mousedown', (e) => {
      if (maximized || e.target.tagName === 'BUTTON' || e.target.tagName === 'svg' || e.target.tagName === 'path' || e.target.tagName === 'line' || e.target.tagName === 'circle' || e.target.tagName === 'polyline' || e.target.tagName === 'polygon') return;
      drag = true;
      const rect = p.getBoundingClientRect();
      sx = e.clientX; sy = e.clientY; sl = rect.left; st = rect.top;
      p.style.cssText += `position:fixed;left:${sl}px;top:${st}px;margin:0;transform:none;`;
      e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => { if (!drag) return; p.style.left = (sl + e.clientX - sx) + 'px'; p.style.top = (st + e.clientY - sy) + 'px'; });
    document.addEventListener('mouseup', () => {
      if (drag) { widgetPositions[id] = { left: p.style.left, top: p.style.top }; saveWidgets(); }
      drag = false;
    });

    // Resize
    const rs = p.querySelector('.floating-resize-handle');
    let resizing = false, rzx, rzy, sw, sh;
    rs.addEventListener('mousedown', (e) => {
      if (maximized) return; 
      resizing = true; 
      rzx = e.clientX; 
      rzy = e.clientY; 
      sw = p.offsetWidth; 
      sh = p.offsetHeight; 
      e.preventDefault(); 
      e.stopPropagation();
    });
    document.addEventListener('mousemove', (e) => { 
      if (!resizing) return; 
      p.style.width = Math.max(260, sw + e.clientX - rzx) + 'px'; 
      p.style.height = Math.max(160, sh + e.clientY - rzy) + 'px'; 
    });
    document.addEventListener('mouseup', () => {
      if (resizing) { 
        resizing = false; 
        Utils.sS('modern_popup_' + id + '_size', JSON.stringify({ width: p.style.width, height: p.style.height })); 
      }
    });

    return p;
  }

  return { 
    cFP, 
    get pinnedWidgets() { ensureLoaded(); return pinnedWidgets; },
    get widgetPositions() { ensureLoaded(); return widgetPositions; }
  };
})();
