import './style.css'
import { S as _S } from './data.js'
import { ENG } from './engines.js'

const S = _S;
let ceList=JSON.parse(localStorage.getItem('ainav_ce')||'[]');
let curEng=ENG[0];
(function(){const s=localStorage.getItem('ainav_eng');if(s){const f=ENG.find(e=>e.id===s)||ceList.find(e=>e.id===s);if(f)curEng=f}})();

let cbm=JSON.parse(localStorage.getItem('ainav_bm')||'[]');
S['自定义']=cbm;
const CK=Object.keys(S);
let curCat=CK[0];
let expanded=false;

function fav(u){return'https://www.google.com/s2/favicons?sz=64&domain='+u}

// Particles
!function(){const c=document.getElementById('particles');for(let i=0;i<30;i++){const p=document.createElement('div');p.className='particle';p.style.left=Math.random()*100+'%';p.style.animationDuration=(8+Math.random()*14)+'s';p.style.animationDelay=(Math.random()*10)+'s';const s=2+Math.random()*2;p.style.width=p.style.height=s+'px';p.style.background=['rgba(34,197,94,.3)','rgba(59,130,246,.2)','rgba(168,85,247,.2)'][Math.floor(Math.random()*3)];c.appendChild(p)}}();

// Theme
let dark=true;
!function(){if(localStorage.getItem('ainav_th')==='light'){dark=false;document.documentElement.classList.remove('dark')}}();
function toggleTheme(){
  const btn=document.getElementById('themeBtn');
  const r=btn.getBoundingClientRect();
  const cx=r.left+r.width/2,cy=r.top+r.height/2;
  const maxR=Math.hypot(Math.max(cx,innerWidth-cx),Math.max(cy,innerHeight-cy))*2;
  const next=!dark;
  const rip=document.createElement('div');
  rip.className='theme-ripple';
  rip.style.cssText=`left:${cx-maxR/2}px;top:${cy-maxR/2}px;width:${maxR}px;height:${maxR}px;background:${next?'#0F172A':'#F1F5F9'}`;
  document.body.appendChild(rip);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    rip.classList.add('run');
    rip.addEventListener('transitionend',()=>{
      const noT=document.createElement('style');noT.textContent='*,*::before,*::after{transition-duration:0s!important}';document.head.appendChild(noT);
      dark=next;
      document.documentElement.classList.toggle('dark',dark);
      document.querySelector('.ico-sun').style.display=dark?'block':'none';
      document.querySelector('.ico-moon').style.display=dark?'none':'block';
      localStorage.setItem('ainav_th',dark?'dark':'light');
      document.body.offsetHeight;
      rip.remove();
      requestAnimationFrame(()=>noT.remove());
    },{once:true});
  }));
}
if(!dark){document.querySelector('.ico-sun').style.display='none';document.querySelector('.ico-moon').style.display='block'}

// Expand / Collapse
function expand(){
  if(expanded)return;expanded=true;
  document.getElementById('hero').classList.remove('centered');
  document.getElementById('hero').classList.add('docked');
  document.querySelectorAll('.revealable').forEach((el,i)=>setTimeout(()=>el.classList.add('show'),i*80));
  renderGrid();
}
function collapse(){
  if(!expanded)return;expanded=false;
  document.getElementById('hero').classList.add('centered');
  document.getElementById('hero').classList.remove('docked');
  document.querySelectorAll('.revealable').forEach(el=>el.classList.remove('show'));
  window.scrollTo({top:0,behavior:'smooth'});
}
document.addEventListener('click',e=>{
  if(e.target.closest('.overlay')||e.target.closest('#themeBtn')||e.target.closest('#settingsBtn')||e.target.closest('#si')||e.target.closest('button[onclick*="doSearch"]'))return;
  if(e.target.closest('.nav-card')||e.target.closest('.cat-pill')||e.target.closest('#setOv'))return;
  if(!expanded)expand();
  else if(!e.target.closest('#grid')&&!e.target.closest('#catTabs')&&!e.target.closest('#hero'))collapse();
});

// Search
function doSearch(){const q=document.getElementById('si').value.trim();if(!q)return;const u=curEng.u.includes('%s')?curEng.u.replace('%s',encodeURIComponent(q)):curEng.u+encodeURIComponent(q);window.open(u,'_blank')}

// Categories
function renderCats(){
  const c=document.getElementById('catTabs');c.innerHTML='';
  CK.forEach(k=>{const b=document.createElement('button');b.className='cat-pill'+(k===curCat?' active':'');b.textContent=k;b.onclick=e=>{e.stopPropagation();curCat=k;renderCats();renderGrid()};c.appendChild(b)});
}

// Grid
function renderGrid(){
  const g=document.getElementById('grid'),items=S[curCat]||[];g.innerHTML='';
  if(!items.length){g.innerHTML='<div class="col-span-full flex flex-col items-center py-16 t3"><svg class="w-10 h-10 mb-3 opacity-30" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"/></svg><p class="text-sm mb-3">暂无书签</p><button onclick="event.stopPropagation();openSettings()" class="px-4 py-2 bg-green-500/15 text-green-500 rounded-lg text-xs cursor-pointer">添加第一个</button></div>';return}
  items.forEach((it,i)=>{const a=document.createElement('a');a.href='https://'+it.u;a.target='_blank';a.rel='noopener noreferrer';a.className='nav-card glass rounded-xl p-3 stag';a.style.animationDelay=(i*20)+'ms';a.onclick=e=>e.stopPropagation();a.innerHTML=`<img src="${fav(it.u)}" alt="" class="site-icon" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span class="w-8 h-8 rounded-lg bg-green-500/10 items-center justify-center text-xs font-bold text-green-500 font-mono" style="display:none">${it.t.charAt(0)}</span><span class="text-xs font-medium t1 truncate w-full">${it.t}</span><span class="text-[10px] t3 truncate w-full leading-tight">${it.d||it.u}</span>`;g.appendChild(a)});
  updateBmCount();
}

// Settings
function openSettings(){document.getElementById('setOv').classList.add('open');renderEngTab();initBmSelect();updateBmCount()}
function closeSettings(){document.getElementById('setOv').classList.remove('open')}
function setTab(btn,id){
  btn.parentElement.querySelectorAll('.settings-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  ['tabBm','tabEng','tabSync','tabAccount','tabExt'].forEach(t=>document.getElementById(t).style.display='none');
  document.getElementById(id).style.display='';
}
function initBmSelect(){const s=document.getElementById('bmC');s.innerHTML='';CK.forEach(k=>{const o=document.createElement('option');o.value=k;o.textContent=k;o.style.background='#1E293B';s.appendChild(o)});s.value='自定义'}
function addBm(){const u=document.getElementById('bmU').value.trim().replace(/^https?:\/\//,''),t=document.getElementById('bmT').value.trim(),d=document.getElementById('bmD').value.trim(),cat=document.getElementById('bmC').value;if(!u||!t)return;const it={t,u,d};S[cat].push(it);if(cat==='自定义'){cbm.push(it);localStorage.setItem('ainav_bm',JSON.stringify(cbm))}['bmU','bmT','bmD'].forEach(id=>{const el=document.getElementById(id);el.value='';delete el.dataset.manual});document.getElementById('bmHint').style.display='none';if(curCat===cat&&expanded)renderGrid();updateBmCount()}
let _bmTimer=0,_bmAbort=null;
function bmDomain(url){return url.split('/')[0].replace(/^www\./,'')}
function bmFallbackTitle(host){const parts=host.split('.');const name=parts.length>1?parts.slice(0,-1).join('.'):parts[0];const clean=name.replace(/\.(com|org|net|co|ac|edu|gov)$/,'');return clean.charAt(0).toUpperCase()+clean.slice(1)}
function bmAutoFill(){
  const raw=document.getElementById('bmU').value.trim();
  const url=raw.replace(/^https?:\/\//,'').replace(/\/+$/,'');
  const tEl=document.getElementById('bmT'),dEl=document.getElementById('bmD'),cEl=document.getElementById('bmC'),hint=document.getElementById('bmHint');
  if(_bmAbort){_bmAbort.abort();_bmAbort=null}
  if(!url){hint.style.display='none';hint.textContent='自动识别';return}
  delete tEl.dataset.manual;delete dEl.dataset.manual;
  const host=bmDomain(url);
  let found=null,foundCat='自定义';
  for(const cat of CK){for(const it of S[cat]){if(bmDomain(it.u)===host){found=it;foundCat=cat;break}}if(found)break}
  if(found){
    tEl.value=found.t;dEl.value=found.d;cEl.value=foundCat;hint.textContent='自动识别';hint.style.display='';return;
  }
  tEl.value=bmFallbackTitle(host);dEl.value='';cEl.value='自定义';
  hint.textContent='识别中...';hint.style.display='';
  const fullUrl=(raw.startsWith('http')?raw:'https://'+url);
  _bmAbort=new AbortController();
  fetch('https://api.microlink.io?url='+encodeURIComponent(fullUrl),{signal:_bmAbort.signal})
    .then(r=>r.json()).then(j=>{
      _bmAbort=null;
      if(j.status!=='success'||!j.data)throw 0;
      const d=j.data;
      if(d.title&&!tEl.dataset.manual){
        let t=d.title.replace(/\s*[-–—|·•].{0,30}$/,'').trim();
        if(t.length>20)t=t.slice(0,20);
        tEl.value=t;
      }
      if(d.description&&!dEl.dataset.manual){
        let desc=d.description;
        if(desc.length>15)desc=desc.slice(0,15)+'…';
        dEl.value=desc;
      }
      hint.textContent='自动识别';
    }).catch(()=>{_bmAbort=null;hint.textContent='';hint.style.display='none'});
}
!function(){
  const uEl=document.getElementById('bmU'),tEl=document.getElementById('bmT'),dEl=document.getElementById('bmD');
  uEl.addEventListener('input',()=>{clearTimeout(_bmTimer);_bmTimer=setTimeout(bmAutoFill,500)});
  uEl.addEventListener('paste',()=>{clearTimeout(_bmTimer);_bmTimer=setTimeout(bmAutoFill,200)});
  tEl.addEventListener('input',()=>{tEl.dataset.manual='1'});
  dEl.addEventListener('input',()=>{dEl.dataset.manual='1'});
}();
function updateBmCount(){let n=0;CK.forEach(k=>n+=S[k].length);const el=document.getElementById('bmCount');if(el)el.textContent=n}

// Engine tab
function renderEngTab(){
  document.getElementById('ceI').textContent=curEng.i;document.getElementById('ceI').style.background=curEng.c;document.getElementById('ceN2').textContent=curEng.n;
  const pl=document.getElementById('epL');pl.innerHTML='';
  ENG.forEach(e=>{const d=document.createElement('div');d.className='dd-opt glass rounded-lg p-2.5 flex items-center gap-2 cursor-pointer'+(e.id===curEng.id?' ring-1 ring-green-500':'');d.onclick=()=>pickEng(e);d.innerHTML=`<span class="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white shrink-0" style="background:${e.c}">${e.i}</span><span class="text-xs t1 truncate">${e.n}</span>`;pl.appendChild(d)});
  const cl=document.getElementById('ecL');cl.innerHTML='';
  if(!ceList.length)cl.innerHTML='<p class="text-xs t3 py-1">暂无自定义引擎</p>';
  ceList.forEach((e,i)=>{const d=document.createElement('div');d.className='glass rounded-lg p-2.5 flex items-center gap-2 group';d.innerHTML=`<div class="flex items-center gap-2 flex-1 cursor-pointer" onclick="pickEng(ceList[${i}]);renderEngTab()"><span class="w-6 h-6 rounded bg-slate-500/20 flex items-center justify-center text-xs font-bold t2 shrink-0">${e.i}</span><div class="min-w-0"><p class="text-xs t1 truncate">${e.n}</p><p class="text-[10px] t3 truncate">${e.u}</p></div></div><button onclick="rmCE(${i})" class="w-6 h-6 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 t3 hover:text-red-400 cursor-pointer transition-all shrink-0"><svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>`;cl.appendChild(d)});
}
function pickEng(e){curEng=e;localStorage.setItem('ainav_eng',e.id);document.getElementById('si').placeholder='在 '+e.n+' 中搜索...';renderEngTab()}
function addCE(){const n=document.getElementById('ceNI').value.trim(),u=document.getElementById('ceUI').value.trim();if(!n||!u)return;ceList.push({id:'ce_'+Date.now(),n,u,i:n[0].toUpperCase(),c:'#64748B'});localStorage.setItem('ainav_ce',JSON.stringify(ceList));document.getElementById('ceNI').value='';document.getElementById('ceUI').value='';renderEngTab()}
function rmCE(i){if(curEng.id===ceList[i].id){curEng=ENG[0];localStorage.setItem('ainav_eng',curEng.id)}ceList.splice(i,1);localStorage.setItem('ainav_ce',JSON.stringify(ceList));renderEngTab()}

// Mock login
function mockLogin(provider){alert('即将跳转 '+provider+' 授权登录页面\n(此为演示，实际需接入 OAuth)')}

// Expose for inline onclick in dynamic HTML
window.pickEng=pickEng;window.renderEngTab=renderEngTab;window.rmCE=rmCE;window.ceList=ceList;window.openSettings=openSettings;

// Event bindings (replacing inline onclick on static HTML)
document.getElementById('settingsBtn').addEventListener('click',e=>{e.stopPropagation();openSettings()});
document.getElementById('themeBtn').addEventListener('click',e=>{e.stopPropagation();toggleTheme()});
document.getElementById('closeSetBtn').addEventListener('click',()=>closeSettings());
document.getElementById('setOv').addEventListener('click',e=>{if(e.target===document.getElementById('setOv'))closeSettings()});
document.getElementById('si').addEventListener('keydown',e=>{if(e.key==='Enter')doSearch()});
document.getElementById('si').addEventListener('click',e=>e.stopPropagation());
document.getElementById('searchBtn').addEventListener('click',e=>{e.stopPropagation();doSearch()});
document.getElementById('heroIcon').addEventListener('click',()=>{if(expanded)collapse()});
document.getElementById('addBmBtn').addEventListener('click',()=>addBm());
document.getElementById('addCEBtn').addEventListener('click',()=>addCE());
document.getElementById('syncToggle').addEventListener('click',function(){this.classList.toggle('bg-green-500');this.classList.toggle('bg-slate-600');this.querySelector('div').classList.toggle('ml-auto')});
document.querySelectorAll('[data-provider]').forEach(b=>b.addEventListener('click',()=>mockLogin(b.dataset.provider)));
document.getElementById('settingsTabs').addEventListener('click',e=>{const btn=e.target.closest('.settings-tab');if(!btn)return;setTab(btn,btn.dataset.tab)});

// PWA service worker
if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(()=>{})}

// Init
renderCats();
document.getElementById('si').placeholder='在 '+curEng.n+' 中搜索...';