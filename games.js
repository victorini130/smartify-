// games.js - All game implementations (Snake, Flappy, Whack-a-Mole, 2048, Galgje, Quiz, Tetris, Memory, Pong, Breakout, TicTacToe)
const Games = (() => {
  const gameFns = {};

  // ---- SNAKE ----
  gameFns.snake = (c, onEnd) => {
    c.innerHTML = `<div class="game-container"><canvas id="snake-c" width="400" height="400"></canvas><div class="game-controls"><span>Score: <b id="snake-s">0</b></span><span>Best: <b id="snake-hs">${Utils.gHS('snake')}</b></span><button class="game-reset-btn" id="snake-r">${Config.IC.refresh} Reset</button></div></div>`;
    const cv = Utils.$('#snake-c',c), ctx = cv.getContext('2d');
    const gs=20,tc=20; let snake=[{x:10,y:10}],dx=1,dy=0,food={x:15,y:15},score=0,loop,active=true;
    const draw=()=>{ ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,400,400); ctx.fillStyle='#4ade80'; snake.forEach(p=>ctx.fillRect(p.x*gs,p.y*gs,gs-2,gs-2)); ctx.fillStyle='#f87171'; ctx.fillRect(food.x*gs,food.y*gs,gs-2,gs-2); Utils.$('#snake-s',c).textContent=score; };
    const placeFood=()=>{ do{food.x=Math.floor(Math.random()*tc);food.y=Math.floor(Math.random()*tc);}while(snake.some(p=>p.x===food.x&&p.y===food.y)); };
    const gameOver=()=>{ if(!active)return; active=false; clearInterval(loop); const rec=Utils.sHS('snake',score); if(rec)Utils.$('#snake-hs',c).textContent=score; if(onEnd)onEnd('snake',score,rec); ctx.fillStyle='rgba(0,0,0,.75)'; ctx.fillRect(0,0,400,400); ctx.fillStyle='#fff'; ctx.textAlign='center'; ctx.font='bold 22px Inter,sans-serif'; ctx.fillText('Game Over',200,190); ctx.font='16px Inter,sans-serif'; ctx.fillText('Score: '+score,200,220); };
    const update=()=>{ if(!active)return; const head={x:snake[0].x+dx,y:snake[0].y+dy}; if(head.x<0||head.x>=tc||head.y<0||head.y>=tc||snake.some(p=>p.x===head.x&&p.y===head.y))return gameOver(); snake.unshift(head); if(head.x===food.x&&head.y===food.y){score++;placeFood();}else snake.pop(); draw(); };
    const reset=()=>{ clearInterval(loop); snake=[{x:10,y:10}]; dx=1; dy=0; score=0; active=true; placeFood(); draw(); loop=setInterval(update,100); };
    document.addEventListener('keydown',e=>{ if(!active)return; if(e.key==='ArrowUp'&&dy===0){dx=0;dy=-1;}else if(e.key==='ArrowDown'&&dy===0){dx=0;dy=1;}else if(e.key==='ArrowLeft'&&dx===0){dx=-1;dy=0;}else if(e.key==='ArrowRight'&&dx===0){dx=1;dy=0;} });
    Utils.$('#snake-r',c).addEventListener('click',reset);
    placeFood(); draw(); loop=setInterval(update,100);
  };

  // ---- FLAPPY ----
  gameFns.flappy = (c, onEnd) => {
    c.innerHTML = `<div class="game-container"><canvas id="flappy-c" width="320" height="480"></canvas><div class="game-controls"><span>Score: <b id="flappy-s">0</b></span><span>Best: <b id="flappy-hs">${Utils.gHS('flappy')}</b></span><button class="game-reset-btn" id="flappy-r">${Config.IC.refresh} Reset</button></div></div>`;
    const cv=Utils.$('#flappy-c',c),ctx=cv.getContext('2d');
    let birdY=240,vel=0,pipes=[],frame=0,score=0,active=true,loop;
    const birdX=60,pipeW=50,gap=120,grav=.5,jump=-8;
    const draw=()=>{ ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,320,480); ctx.fillStyle='#fbbf24'; ctx.fillRect(birdX,birdY,25,25); ctx.fillStyle='#22c55e'; pipes.forEach(p=>{ctx.fillRect(p.x,0,pipeW,p.top);ctx.fillRect(p.x,p.top+gap,pipeW,480-p.top-gap);}); ctx.fillStyle='#fff'; ctx.font='bold 24px Inter,sans-serif'; ctx.fillText(score,10,40); };
    const gameOver=()=>{ if(!active)return; active=false; clearInterval(loop); const rec=Utils.sHS('flappy',score); if(rec)Utils.$('#flappy-hs',c).textContent=score; if(onEnd)onEnd('flappy',score,rec); ctx.fillStyle='rgba(0,0,0,.75)'; ctx.fillRect(0,0,320,480); ctx.fillStyle='#fff'; ctx.textAlign='center'; ctx.font='bold 22px Inter,sans-serif'; ctx.fillText('Game Over',160,230); ctx.font='16px Inter,sans-serif'; ctx.fillText('Score: '+score,160,260); };
    const update=()=>{ if(!active)return; vel+=grav; birdY+=vel; if(birdY<=0){birdY=0;vel=0;} if(birdY+25>=480)return gameOver(); if(frame%90===0)pipes.push({x:320,top:Math.random()*(480-gap-50)+50}); for(let i=0;i<pipes.length;i++){pipes[i].x-=3;if(pipes[i].x+pipeW<0){pipes.splice(i,1);i--;}else if(!pipes[i].passed&&pipes[i].x+pipeW<birdX){pipes[i].passed=true;score++;Utils.$('#flappy-s',c).textContent=score;}else if(birdX+25>pipes[i].x&&birdX<pipes[i].x+pipeW&&(birdY<pipes[i].top||birdY+25>pipes[i].top+gap))return gameOver();} draw(); frame++; };
    const reset=()=>{ clearInterval(loop); birdY=240; vel=0; pipes=[]; frame=0; score=0; active=true; Utils.$('#flappy-s',c).textContent='0'; draw(); loop=setInterval(update,20); };
    document.addEventListener('keydown',e=>{ if(e.code==='Space'&&active){e.preventDefault();vel=jump;} });
    cv.addEventListener('click',()=>{ if(active)vel=jump; });
    Utils.$('#flappy-r',c).addEventListener('click',reset);
    draw(); loop=setInterval(update,20);
  };

  // ---- WHACK-A-MOLE ----
  gameFns.whackamole = (c, onEnd) => {
    c.innerHTML = `<div class="game-container"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:210px;margin:0 auto;" id="whack-g"></div><div class="game-controls"><span>Score: <b id="whack-s">0</b></span><span>Tijd: <b id="whack-t">30</b>s</span><button class="game-reset-btn" id="whack-r">${Config.IC.refresh} Reset</button></div></div>`;
    const grid=Utils.$('#whack-g',c); let score=0,time=30,active=true,timerInt,moleInt,holes=Array(9).fill(false);
    for(let i=0;i<9;i++){const cell=document.createElement('div');cell.style.cssText='aspect-ratio:1;background:#78350f;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.8rem;cursor:pointer;transition:.1s;';cell.dataset.index=i;cell.addEventListener('click',()=>{if(!active||!holes[i])return;score++;Utils.$('#whack-s',c).textContent=score;holes[i]=false;cell.textContent='';cell.style.background='#78350f';});grid.appendChild(cell);}
    const showMole=()=>{ if(!active)return; const idx=Math.floor(Math.random()*9); if(!holes[idx]){holes[idx]=true;const cell=grid.children[idx];cell.textContent='🐭';cell.style.background='#fcd34d';setTimeout(()=>{if(holes[idx]){holes[idx]=false;cell.textContent='';cell.style.background='#78350f';}},800);} };
    const updateTimer=()=>{ if(!active)return; time--; Utils.$('#whack-t',c).textContent=time; if(time<=0){active=false;clearInterval(timerInt);clearInterval(moleInt);const rec=Utils.sHS('whackamole',score);if(onEnd)onEnd('whackamole',score,rec);alert('Game Over! Score: '+score+(rec?' — Nieuw record!':'')); } };
    const reset=()=>{ active=false;clearInterval(timerInt);clearInterval(moleInt);score=0;time=30;active=true;holes.fill(false);Utils.$('#whack-s',c).textContent='0';Utils.$('#whack-t',c).textContent='30';for(let i=0;i<9;i++){grid.children[i].textContent='';grid.children[i].style.background='#78350f';}timerInt=setInterval(updateTimer,1000);moleInt=setInterval(showMole,700); };
    timerInt=setInterval(updateTimer,1000); moleInt=setInterval(showMole,700);
    Utils.$('#whack-r',c).addEventListener('click',reset);
  };

  // ---- 2048 ----
  gameFns['2048'] = (c, onEnd) => {
    c.innerHTML = `<div class="game-container"><div id="t-board" style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;background:#bbada0;padding:6px;border-radius:12px;max-width:260px;margin:0 auto;"></div><div class="game-controls"><span>Score: <b id="t-s">0</b></span><button class="game-reset-btn" id="t-r">${Config.IC.refresh} Reset</button></div></div>`;
    let board=Array(4).fill().map(()=>Array(4).fill(0)),score=0;
    const bd=Utils.$('#t-board',c);
    const colors={0:'#cdc1b4',2:'#eee4da',4:'#ede0c8',8:'#f2b179',16:'#f59563',32:'#f67c5f',64:'#f65e3b',128:'#edcf72',256:'#edcc61',512:'#edc850',1024:'#edc53f',2048:'#edc22e'};
    const updateUI=()=>{ for(let i=0;i<4;i++)for(let j=0;j<4;j++){const v=board[i][j],cell=bd.children[i*4+j];cell.textContent=v||'';cell.style.background=colors[v]||'#3c3a32';cell.style.color=v<8?'#776e65':'#f9f6f2';}Utils.$('#t-s',c).textContent=score; };
    const addNew=()=>{ const e=[];for(let i=0;i<4;i++)for(let j=0;j<4;j++)if(!board[i][j])e.push([i,j]);if(!e.length)return false;const[r,c2]=e[Math.floor(Math.random()*e.length)];board[r][c2]=Math.random()<.9?2:4;return true; };
    const move=dir=>{ let changed=false; const slide=row=>{let r=row.filter(v=>v);for(let j=0;j<r.length-1;j++)if(r[j]===r[j+1]){r[j]*=2;score+=r[j];r.splice(j+1,1);}while(r.length<4)r.push(0);return r;}; const slideR=row=>{let r=row.filter(v=>v);for(let j=r.length-1;j>0;j--)if(r[j]===r[j-1]){r[j]*=2;score+=r[j];r.splice(j-1,1);j--;}while(r.length<4)r.unshift(0);return r;};
      if(dir==='left'){for(let i=0;i<4;i++){const n=slide([...board[i]]);if(JSON.stringify(n)!==JSON.stringify(board[i]))changed=true;board[i]=n;}}
      else if(dir==='right'){for(let i=0;i<4;i++){const n=slideR([...board[i]]);if(JSON.stringify(n)!==JSON.stringify(board[i]))changed=true;board[i]=n;}}
      else if(dir==='up'){for(let j=0;j<4;j++){const col=[board[0][j],board[1][j],board[2][j],board[3][j]],n=slide(col);for(let i=0;i<4;i++){if(board[i][j]!==n[i])changed=true;board[i][j]=n[i];}}}
      else if(dir==='down'){for(let j=0;j<4;j++){const col=[board[0][j],board[1][j],board[2][j],board[3][j]],n=slideR(col);for(let i=0;i<4;i++){if(board[i][j]!==n[i])changed=true;board[i][j]=n[i];}}}
      if(changed){addNew();updateUI();if(Math.max(...board.flat())>=2048){const rec=Utils.sHS('2048',score);if(onEnd)onEnd('2048',score,rec);alert('Gefeliciteerd! Je hebt 2048 bereikt!');}} };
    const handleKey=e=>{if(e.key.startsWith('Arrow')){e.preventDefault();move(e.key.replace('Arrow','').toLowerCase());}};
    const reset=()=>{board=Array(4).fill().map(()=>Array(4).fill(0));score=0;addNew();addNew();updateUI();};
    for(let i=0;i<16;i++){const cell=document.createElement('div');cell.style.cssText='aspect-ratio:1;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:800;transition:.1s;font-family:ui-monospace,monospace;';bd.appendChild(cell);}
    document.addEventListener('keydown',handleKey);
    Utils.$('#t-r',c).addEventListener('click',reset);
    reset();
  };

  // ---- GALGJE ----
  gameFns.galgje = (c, onEnd) => {
    const words=['APPEL','BANANA','CACTUS','DRAAK','EEND','FOTO','GROEN','HOND','IJZER','JAS','KAT','LEEUW','MUIS','NEDERLAND','OLIFANT','PAARD','QUIZ','ROOD','SLANG','TAFEL','UIL','VOGEL','WOLF','XENON','YOGURT','ZEBRA'];
    let word=words[Math.floor(Math.random()*words.length)],guessed=Array(word.length).fill('_'),wrong=0,maxWrong=6,guessedLetters=[];
    const render=()=>{ c.innerHTML=`<div class="game-container"><div style="text-align:center;padding:8px;"><div style="font-family:ui-monospace,monospace;font-size:1.6rem;letter-spacing:6px;margin:10px;color:#1e293b;">${guessed.join(' ')}</div><div style="font-size:.85rem;color:#64748b;margin:4px;">Fout: <b style="color:#ef4444;">${wrong}</b>/${maxWrong}</div><div style="display:flex;gap:8px;justify-content:center;margin:10px 0;"><input type="text" id="g-inp" maxlength="1" class="field-input" style="width:52px;text-align:center;"><button class="btn btn-primary" id="g-guess">Gok</button><button class="btn btn-ghost" id="g-r">Nieuw</button></div><div id="g-msg" style="font-size:.8rem;min-height:20px;"></div></div></div>`; attachGalgjeListeners(); };
    const attachGalgjeListeners=()=>{ const input=Utils.$('#g-inp',c),msg=Utils.$('#g-msg',c);
      const guess=()=>{ const letter=(input.value||'').toUpperCase();input.value='';if(!letter||guessedLetters.includes(letter))return;guessedLetters.push(letter);if(word.includes(letter)){for(let i=0;i<word.length;i++)if(word[i]===letter)guessed[i]=letter;if(!guessed.includes('_')){const rec=Utils.sHS('galgje',word.length);if(onEnd)onEnd('galgje',word.length,rec);render();msg&&(msg.textContent=`Gefeliciteerd! Het woord was ${word}!`);msg&&(msg.style.color='#22c55e');return;}msg.textContent='Goed!';msg.style.color='#22c55e';}else{wrong++;if(wrong>=maxWrong){if(onEnd)onEnd('galgje',0,false);render();Utils.$('#g-msg',c).textContent=`Verloren! Het woord was ${word}.`;Utils.$('#g-msg',c).style.color='#ef4444';return;}msg.textContent='Fout!';msg.style.color='#ef4444';}render();setTimeout(()=>{const m=Utils.$('#g-msg',c);if(m)m.textContent='';},1000);};
      Utils.$('#g-guess',c).addEventListener('click',guess);
      Utils.$('#g-r',c).addEventListener('click',()=>{word=words[Math.floor(Math.random()*words.length)];guessed=Array(word.length).fill('_');wrong=0;guessedLetters=[];render();});
      input.addEventListener('keypress',e=>{if(e.key==='Enter')guess();});
    };
    render();
  };

  // ---- QUIZ ----
  gameFns.quiz = (c, onEnd) => {
    const qs=[{q:"Hoofdstad van Frankrijk?",a:"Parijs",opts:["Parijs","Londen","Berlijn","Madrid"]},{q:"7 × 8?",a:"56",opts:["48","56","64","72"]},{q:"Nachtwacht schilder?",a:"Rembrandt",opts:["Van Gogh","Rembrandt","Vermeer","Picasso"]},{q:"Grootste planeet?",a:"Jupiter",opts:["Aarde","Mars","Jupiter","Saturnus"]},{q:"Start WOI?",a:"1914",opts:["1912","1914","1916","1918"]}];
    let idx=0,score=0;
    const loadQ=()=>{
      if(idx>=qs.length){const rec=Utils.sHS('quiz',score);if(onEnd)onEnd('quiz',score,rec);c.innerHTML=`<div class="game-container"><div style="text-align:center;padding:20px;"><div style="font-size:2.5rem;margin-bottom:12px;">🎉</div><h3 style="color:#1e293b;font-size:1.1rem;margin-bottom:8px;">Quiz voltooid!</h3><p style="color:#64748b;">Score: <b style="color:#3b82f6;">${score}/${qs.length}</b></p><button class="btn btn-primary" id="q-r" style="margin-top:16px;">Opnieuw</button></div></div>`;Utils.$('#q-r',c).addEventListener('click',()=>{idx=0;score=0;loadQ();});return;}
      const q=qs[idx];
      c.innerHTML=`<div class="game-container"><div style="width:100%;"><div style="font-size:.75rem;color:#94a3b8;margin-bottom:6px;">Vraag ${idx+1} / ${qs.length}</div><div style="font-weight:700;font-size:.95rem;color:#1e293b;margin-bottom:14px;">${q.q}</div>${q.opts.map(o=>`<button class="quiz-opt" data-opt="${Utils.eH(o)}" style="display:block;width:100%;margin:6px 0;padding:10px 16px;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:10px;cursor:pointer;text-align:left;font-size:.85rem;font-weight:500;transition:background .15s,border-color .15s;">${Utils.eH(o)}</button>`).join('')}<div style="font-size:.8rem;color:#64748b;margin-top:10px;">Score: <b style="color:#3b82f6;">${score}</b></div></div></div>`;
      Utils.$$('.quiz-opt',c).forEach(b=>{b.addEventListener('mouseenter',()=>{b.style.background='#f1f5f9';b.style.borderColor='#cbd5e1';});b.addEventListener('mouseleave',()=>{b.style.background='#f8fafc';b.style.borderColor='#e2e8f0';});b.addEventListener('click',()=>{if(b.dataset.opt===q.a)score++;idx++;loadQ();});});
    };
    loadQ();
  };

  // ---- TETRIS ----
  gameFns.tetris = (c, onEnd) => {
    c.innerHTML=`<div class="game-container"><canvas id="tetris-c" width="250" height="400"></canvas><div class="game-controls"><span>Score: <b id="tetris-s">0</b></span><button class="game-reset-btn" id="tetris-r">${Config.IC.refresh} Reset</button></div></div>`;
    const cv=Utils.$('#tetris-c',c),ctx=cv.getContext('2d');
    const COLS=10,ROWS=20,BLOCK=25;
    let board=Array(ROWS).fill().map(()=>Array(COLS).fill(0));
    const PIECES=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]],[[1,1,0],[0,1,1]],[[0,1,1],[1,1,0]]];
    const COLORS=['#0f172a','#06b6d4','#f59e0b','#a855f7','#22c55e','#ef4444','#3b82f6','#ec4899'];
    let piece,px,py,pColor,score=0,loop,active=true;
    const newPiece=()=>{ const idx=Math.floor(Math.random()*PIECES.length);piece=PIECES[idx];pColor=idx+1;px=Math.floor(COLS/2)-Math.floor(piece[0].length/2);py=0;if(collision()){active=false;clearInterval(loop);if(onEnd)onEnd('tetris',score,Utils.sHS('tetris',score));} };
    const collision=()=>{ for(let y=0;y<piece.length;y++)for(let x=0;x<piece[y].length;x++)if(piece[y][x]&&(py+y>=ROWS||px+x<0||px+x>=COLS||board[py+y][px+x]))return true;return false; };
    const merge=()=>{ for(let y=0;y<piece.length;y++)for(let x=0;x<piece[y].length;x++)if(piece[y][x])board[py+y][px+x]=pColor;for(let y=ROWS-1;y>=0;y--){if(board[y].every(cell=>cell)){board.splice(y,1);board.unshift(Array(COLS).fill(0));score+=100;Utils.$('#tetris-s',c).textContent=score;}}newPiece(); };
    const move=(dx,dy)=>{ px+=dx;py+=dy;if(collision()){px-=dx;py-=dy;return false;}return true; };
    const rotate=()=>{ const r=piece[0].map((_,i)=>piece.map(row=>row[i]).reverse()),prev=piece;piece=r;if(collision())piece=prev; };
    const draw=()=>{ ctx.fillStyle='#0f172a';ctx.fillRect(0,0,250,400);for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(board[y][x]){ctx.fillStyle=COLORS[board[y][x]];ctx.fillRect(x*BLOCK,y*BLOCK,BLOCK-1,BLOCK-1);}for(let y=0;y<piece.length;y++)for(let x=0;x<piece[y].length;x++)if(piece[y][x]){ctx.fillStyle=COLORS[pColor];ctx.fillRect((px+x)*BLOCK,(py+y)*BLOCK,BLOCK-1,BLOCK-1);} };
    const drop=()=>{ if(!move(0,1))merge();draw(); };
    const handler=e=>{ if(!active)return;if(e.key==='ArrowLeft')move(-1,0);else if(e.key==='ArrowRight')move(1,0);else if(e.key==='ArrowDown')drop();else if(e.key==='ArrowUp')rotate();draw(); };
    const reset=()=>{ board=Array(ROWS).fill().map(()=>Array(COLS).fill(0));score=0;active=true;Utils.$('#tetris-s',c).textContent='0';clearInterval(loop);newPiece();draw();loop=setInterval(drop,400); };
    document.addEventListener('keydown',handler);
    Utils.$('#tetris-r',c).addEventListener('click',reset);
    newPiece();draw();loop=setInterval(drop,400);
  };

  // ---- MEMORY ----
  gameFns.memory = (c, onEnd) => {
    const icons=['🍎','🍌','🍇','🍊','🍓','🍒','🍉','🥝'];
    let cards=[...icons,...icons];
    for(let i=cards.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[cards[i],cards[j]]=[cards[j],cards[i]];}
    let flipped=[],matched=[],lock=false,moves=0;
    c.innerHTML=`<div class="game-container"><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;max-width:240px;margin:0 auto;" id="mem-b"></div><div class="game-controls"><span>Moves: <b id="mem-m">0</b></span><button class="game-reset-btn" id="mem-r">${Config.IC.refresh} Reset</button></div></div>`;
    const bd=Utils.$('#mem-b',c);
    cards.forEach((ic,idx)=>{ const cd=document.createElement('div');cd.style.cssText='aspect-ratio:1;background:linear-gradient(135deg,#3b82f6,#2563eb);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;cursor:pointer;transition:background .2s;';cd.dataset.icon=ic;cd.dataset.index=idx;cd.addEventListener('click',()=>{if(lock||cd.classList.contains('flipped')||matched.includes(String(idx)))return;cd.classList.add('flipped');cd.textContent=ic;cd.style.background='#fff';cd.style.border='1.5px solid #e2e8f0';flipped.push(cd);if(flipped.length===2){moves++;Utils.$('#mem-m',c).textContent=moves;lock=true;const[c1,c2]=flipped;if(c1.dataset.icon===c2.dataset.icon){matched.push(c1.dataset.index,c2.dataset.index);c1.style.background='#f0fdf4';c2.style.background='#f0fdf4';flipped=[];lock=false;if(matched.length===cards.length){if(onEnd)onEnd('memory',Math.max(0,20-moves),false);}}else{setTimeout(()=>{c1.classList.remove('flipped');c2.classList.remove('flipped');c1.textContent='';c2.textContent='';c1.style.background='linear-gradient(135deg,#3b82f6,#2563eb)';c2.style.background='linear-gradient(135deg,#3b82f6,#2563eb)';c1.style.border='none';c2.style.border='none';flipped=[];lock=false;},800);}}});bd.appendChild(cd);});
    Utils.$('#mem-r',c).addEventListener('click',()=>location.reload());
  };

  // ---- PONG ----
  gameFns.pong = (c, onEnd) => {
    c.innerHTML=`<div class="game-container"><canvas id="pong-c" width="500" height="300"></canvas><div class="game-controls"><span>Jij: <b id="pong-p">0</b></span><span>CPU: <b id="pong-a">0</b></span><button class="game-reset-btn" id="pong-r">${Config.IC.refresh} Reset</button></div></div>`;
    const cv=Utils.$('#pong-c',c),ctx=cv.getContext('2d');
    const pw=8,ph=60;let pY=120,aY=120,bX=250,bY=150,bDX=4,bDY=3,pS=0,aS=0,active=true;
    cv.addEventListener('mousemove',e=>{const r=cv.getBoundingClientRect();pY=Math.min(Math.max((e.clientY-r.top)*(300/r.height)-ph/2,0),300-ph);});
    const draw=()=>{ ctx.fillStyle='#0f172a';ctx.fillRect(0,0,500,300);ctx.setLineDash([5,8]);ctx.strokeStyle='rgba(255,255,255,.15)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(250,0);ctx.lineTo(250,300);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#e2e8f0';ctx.fillRect(15,pY,pw,ph);ctx.fillRect(477,aY,pw,ph);ctx.beginPath();ctx.arc(bX,bY,6,0,2*Math.PI);ctx.fillStyle='#f87171';ctx.fill();ctx.font='bold 18px Inter,sans-serif';ctx.fillStyle='rgba(255,255,255,.6)';ctx.fillText(pS,60,30);ctx.fillText(aS,420,30); };
    const update=()=>{ if(!active)return;bX+=bDX;bY+=bDY;if(bY<=6||bY>=294)bDY*=-1;if(bX-6<=23&&bY>pY&&bY<pY+ph){bDX*=-1;bX=24;}if(bX+6>=477&&bY>aY&&bY<aY+ph){bDX*=-1;bX=476;}const reset2=(spd)=>{bX=250;bY=150;bDX=spd*(Math.random()>.5?1:-1);bDY=3*(Math.random()>.5?1:-1);};if(bX<0){aS++;Utils.$('#pong-a',c).textContent=aS;reset2(4);}else if(bX>500){pS++;Utils.$('#pong-p',c).textContent=pS;reset2(4);}const aC=aY+ph/2;if(aC<bY-15)aY+=3;else if(aC>bY+15)aY-=3;aY=Math.min(Math.max(aY,0),240);draw();requestAnimationFrame(update); };
    const reset=()=>{ pS=0;aS=0;pY=120;aY=120;bX=250;bY=150;bDX=4;bDY=3;Utils.$('#pong-p',c).textContent='0';Utils.$('#pong-a',c).textContent='0'; };
    Utils.$('#pong-r',c).addEventListener('click',reset);
    draw();update();
  };

  // ---- BREAKOUT ----
  gameFns.breakout = (c, onEnd) => {
    c.innerHTML=`<div class="game-container"><canvas id="break-c" width="400" height="300"></canvas><div class="game-controls"><span>Score: <b id="break-s">0</b></span><span>Levens: <b id="break-l">3</b></span><button class="game-reset-btn" id="break-r">${Config.IC.refresh} Reset</button></div></div>`;
    const cv=Utils.$('#break-c',c),ctx=cv.getContext('2d');
    let px=165,bX=200,bY=250,bDX=3,bDY=-3,score=0,lives=3,active=true;
    let bricks=[];for(let col=0;col<8;col++){bricks[col]=[];for(let row=0;row<4;row++)bricks[col][row]={x:col*45+15,y:row*18+30,s:1};}
    cv.addEventListener('mousemove',e=>{const r=cv.getBoundingClientRect();px=Math.min(Math.max((e.clientX-r.left)*(400/r.width)-40,0),330);});
    const brickColors=['#3b82f6','#22c55e','#f59e0b','#ef4444'];
    const draw=()=>{ ctx.fillStyle='#0f172a';ctx.fillRect(0,0,400,300);ctx.fillStyle='#e2e8f0';ctx.fillRect(px,280,80,8);ctx.beginPath();ctx.arc(bX,bY,5,0,2*Math.PI);ctx.fillStyle='#f87171';ctx.fill();for(let col=0;col<8;col++)for(let row=0;row<4;row++)if(bricks[col][row].s){ctx.fillStyle=brickColors[row%4];ctx.fillRect(bricks[col][row].x,bricks[col][row].y,40,12);} };
    const update=()=>{ if(!active)return;bX+=bDX;bY+=bDY;if(bX+5>400||bX-5<0)bDX*=-1;if(bY-5<0)bDY*=-1;if(bY+5>300){lives--;Utils.$('#break-l',c).textContent=lives;if(lives<=0){active=false;if(onEnd)onEnd('breakout',score,Utils.sHS('breakout',score));alert('Game Over! Score: '+score);return;}bX=200;bY=250;bDX=3;bDY=-3;}if(bY+5>280&&bX>px&&bX<px+80){bDY*=-1;bY=276;}for(let col=0;col<8;col++)for(let row=0;row<4;row++){const b=bricks[col][row];if(b.s&&bX>b.x&&bX<b.x+40&&bY>b.y&&bY<b.y+12){bDY*=-1;b.s=0;score+=10;Utils.$('#break-s',c).textContent=score;if(bricks.every(c2=>c2.every(b2=>!b2.s))){active=false;if(onEnd)onEnd('breakout',score,Utils.sHS('breakout',score));alert('Gewonnen! Score: '+score);return;}}}draw();if(active)requestAnimationFrame(update); };
    Utils.$('#break-r',c).addEventListener('click',()=>location.reload());
    draw();update();
  };

  // ---- TICTACTOE ----
  gameFns.tictactoe = (c, onEnd) => {
    c.innerHTML=`<div class="game-container"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;max-width:190px;margin:0 auto;" id="ttt-b"></div><div class="game-controls" style="justify-content:center;flex-direction:column;text-align:center;gap:8px;"><span id="ttt-st" style="font-size:.82rem;color:#475569;"></span><button class="game-reset-btn" id="ttt-r">${Config.IC.refresh} Reset</button></div></div>`;
    const bd=Utils.$('#ttt-b',c),st=Utils.$('#ttt-st',c);
    let board=Array(9).fill(''),curr='X',active=true;
    for(let i=0;i<9;i++){const cell=document.createElement('div');cell.style.cssText='aspect-ratio:1;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:800;cursor:pointer;transition:background .15s;color:#1e293b;';cell.dataset.index=i;cell.addEventListener('click',()=>{if(!active||board[i])return;board[i]=curr;cell.textContent=curr;cell.style.color=curr==='X'?'#3b82f6':'#ef4444';if(checkWin()){st.textContent=`Speler ${curr} wint!`;active=false;if(onEnd)onEnd('tictactoe',curr==='X'?1:0,false);}else if(board.every(v=>v)){st.textContent='Gelijkspel!';active=false;}else{curr=curr==='X'?'O':'X';st.textContent=`Beurt: ${curr}`;if(curr==='O'&&active)setTimeout(aiMove,280);}});bd.appendChild(cell);}
    const checkWin=()=>[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]].some(([a,b,d])=>board[a]&&board[a]===board[b]&&board[b]===board[d]);
    const aiMove=()=>{ const e=board.map((v,i)=>v?null:i).filter(v=>v!==null);if(!e.length)return;bd.querySelector(`[data-index="${e[Math.floor(Math.random()*e.length)]}"]`)?.click(); };
    const reset=()=>{ board=Array(9).fill('');curr='X';active=true;st.textContent='Jij bent X, CPU is O.';Utils.$$('[data-index]',bd).forEach(cell=>{cell.textContent='';cell.style.color='';cell.style.background='#f8fafc';}); };
    Utils.$('#ttt-r',c).addEventListener('click',reset);
    st.textContent='Jij bent X, CPU is O.';
  };

  return { gameFns };
})();
