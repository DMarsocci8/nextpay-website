/* ===========================================================
   NextPay — compare tray/drawer + small UI interactions
   Pages declare products in window.NP_PRODUCTS (see page files).
   "Add to compare" buttons carry data-compare="<productId>".
   =========================================================== */
(function(){
  const MAX = 4;
  const KEY = 'np_compare_tray';
  let tray = [];
  try{ tray = JSON.parse(sessionStorage.getItem(KEY)||'[]'); }catch(e){ tray=[]; }

  const P = () => (window.NP_PRODUCTS||{});
  // Scope the tray to products that exist on THIS page (avoid cross-page stragglers)
  if(window.NP_PRODUCTS){ tray = tray.filter(id=>window.NP_PRODUCTS[id]); try{ sessionStorage.setItem(KEY, JSON.stringify(tray)); }catch(e){} }
  const BRAND_LOGOS={pax:'assets/logos/pax.svg',dejavoo:'assets/logos/dejavoo.png',dejapay:'assets/logos/dejapay.webp',clover:'assets/logos/clover.png',square:'assets/logos/square.svg',shift4:'assets/logos/shift4.png',korona:'assets/logos/korona.png',quantic:'assets/logos/quantic.svg',nrs:'assets/logos/nrs.png',valor:'assets/logos/valor.png',swipesimple:'assets/logos/swipesimple.png',nextpay:'assets/logos/nextpay.png'};
  function brandLogo(name){ const s=(name||'').toLowerCase(); for(const k in BRAND_LOGOS){ if(s.indexOf(k)>=0) return BRAND_LOGOS[k]; } return null; }

  function save(){ try{ sessionStorage.setItem(KEY, JSON.stringify(tray)); }catch(e){} }

  function toast(msg){
    let t=document.querySelector('.np-toast');
    if(!t){ t=document.createElement('div'); t.className='np-toast'; document.body.appendChild(t); }
    t.textContent=msg; t.classList.add('show');
    clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('show'),1900);
  }

  function add(id){
    if(tray.includes(id)){ remove(id); return; }
    if(tray.length>=MAX){ toast('Compare holds up to '+MAX+' — remove one first'); return; }
    tray.push(id); save(); renderBar(); syncButtons();
    const p=P()[id]; toast((p?p.name:'Item')+' added to compare');
  }
  function remove(id){ tray=tray.filter(x=>x!==id); save(); renderBar(); syncButtons(); }
  function clear(){ tray=[]; save(); renderBar(); syncButtons(); }

  function slotClone(id){
    const p=P()[id];
    const src=p&&p.slot?document.getElementById(p.slot):null;
    if(src){ const c=src.cloneNode(true); c.removeAttribute('id'); c.style.pointerEvents='none'; return c; }
    const d=document.createElement('div'); d.className='np-noimg'; return d;
  }

  /* ---- sticky compare bar ---- */
  function renderBar(){
    let bar=document.querySelector('.np-comparebar');
    if(!tray.length){ if(bar) bar.classList.remove('show'); document.body.classList.remove('np-cmp-pad'); return; }
    if(!bar){
      bar=document.createElement('div'); bar.className='np-comparebar';
      document.body.appendChild(bar);
    }
    bar.innerHTML='';
    const inner=document.createElement('div'); inner.className='np-comparebar-inner';
    const label=document.createElement('div'); label.className='np-cb-label';
    label.innerHTML='<b>Compare</b><span>'+tray.length+' of '+MAX+' selected</span>';
    inner.appendChild(label);
    const chips=document.createElement('div'); chips.className='np-cb-chips';
    tray.forEach(id=>{
      const p=P()[id]||{name:id};
      const chip=document.createElement('div'); chip.className='np-cb-chip';
      const sc=slotClone(id); sc.classList.add('np-cb-thumb');
      chip.appendChild(sc);
      const nm=document.createElement('span'); nm.textContent=p.name; chip.appendChild(nm);
      const x=document.createElement('button'); x.className='np-cb-x'; x.innerHTML='&times;'; x.title='Remove';
      x.onclick=()=>remove(id); chip.appendChild(x);
      chips.appendChild(chip);
    });
    inner.appendChild(chips);
    const actions=document.createElement('div'); actions.className='np-cb-actions';
    const cmp=document.createElement('button'); cmp.className='btn btn-primary'; cmp.textContent='Compare '+tray.length+' →';
    cmp.disabled=tray.length<2; if(tray.length<2){cmp.style.opacity='.5';cmp.title='Add at least 2';}
    cmp.onclick=openModal;
    const clr=document.createElement('button'); clr.className='np-cb-clear'; clr.textContent='Clear'; clr.onclick=clear;
    actions.appendChild(clr); actions.appendChild(cmp);
    inner.appendChild(actions);
    bar.appendChild(inner);
    document.body.classList.add('np-cmp-pad');
    requestAnimationFrame(()=>bar.classList.add('show'));
  }

  function syncButtons(){
    document.querySelectorAll('[data-compare]').forEach(b=>{
      const on=tray.includes(b.getAttribute('data-compare'));
      b.classList.toggle('is-added',on);
      const lbl=b.querySelector('.cmp-label');
      if(lbl) lbl.textContent=on?'Added ✓':'Add to compare';
    });
  }

  /* ---- compare modal ---- */
  const SPEC_ORDER=['Brand','Best for','Form factor','Type','Connectivity','Payments','Screen','Battery','Printer','Software','Integrations','Setup','Monthly','Processing','Highlight'];
  function specKeys(ids){
    const seen=[]; ids.forEach(id=>{ const s=(P()[id]||{}).specs||{}; Object.keys(s).forEach(k=>{ if(!seen.includes(k)) seen.push(k); }); });
    return seen.sort((a,b)=>{ let ia=SPEC_ORDER.indexOf(a), ib=SPEC_ORDER.indexOf(b); ia=ia<0?99:ia; ib=ib<0?99:ib; return ia-ib; });
  }
  function openModal(){
    if(tray.length<2) return;
    let ov=document.querySelector('.np-modal-ov');
    if(ov) ov.remove();
    ov=document.createElement('div'); ov.className='np-modal-ov';
    const m=document.createElement('div'); m.className='np-modal';
    const head=document.createElement('div'); head.className='np-modal-head';
    head.innerHTML='<div><span class="eyebrow" style="margin:0">Side by side</span><h3>Compare options</h3></div>';
    const close=document.createElement('button'); close.className='np-modal-x'; close.innerHTML='&times;';
    close.onclick=()=>ov.remove(); head.appendChild(close);
    m.appendChild(head);

    const scroll=document.createElement('div'); scroll.className='np-modal-scroll';
    const table=document.createElement('div'); table.className='np-ctable';
    const mob=window.matchMedia('(max-width:680px)').matches;
    const labelW=mob?116:200, colW=mob?150:190;
    table.style.gridTemplateColumns=labelW+'px repeat('+tray.length+',minmax('+colW+'px,1fr))';

    // header row: product cards
    const corner=document.createElement('div'); corner.className='np-ccorner'; table.appendChild(corner);
    tray.forEach(id=>{
      const p=P()[id]||{name:id};
      const cell=document.createElement('div'); cell.className='np-chcell';
      const sc=slotClone(id); sc.classList.add('np-chimg'); cell.appendChild(sc);
      const nm=document.createElement('div'); nm.className='np-chname'; nm.textContent=p.name; cell.appendChild(nm);
      if(p.brand){ const br=document.createElement('div'); br.className='np-chbrand';
        const bl=brandLogo(p.brand);
        if(bl){ const bi=document.createElement('img'); bi.className='np-chbrand-logo'; bi.src=bl; bi.alt=p.brand; bi.onerror=function(){ this.replaceWith(document.createTextNode(p.brand)); }; br.appendChild(bi); }
        else br.textContent=p.brand;
        cell.appendChild(br); }
      const cta=document.createElement('div'); cta.className='np-chcta';
      const a=document.createElement('a'); a.className='btn btn-primary btn-sm'; a.textContent='See pricing'; a.href=p.pricing||p.href||'#'; a.onclick=()=>ov.remove();
      const l=document.createElement('a'); l.className='link-teal'; l.textContent='Learn more'; l.href=p.href||'#'; l.onclick=()=>ov.remove();
      cta.appendChild(a); cta.appendChild(l); cell.appendChild(cta);
      const rx=document.createElement('button'); rx.className='np-chx'; rx.innerHTML='&times;'; rx.title='Remove';
      rx.onclick=()=>{ remove(id); ov.remove(); if(tray.length>=2) openModal(); }; cell.appendChild(rx);
      table.appendChild(cell);
    });
    // spec rows
    specKeys(tray).forEach((k,i)=>{
      const lab=document.createElement('div'); lab.className='np-crlabel'+(i%2?' alt':''); lab.textContent=k; table.appendChild(lab);
      tray.forEach(id=>{
        const v=((P()[id]||{}).specs||{})[k];
        const c=document.createElement('div'); c.className='np-crcell'+(i%2?' alt':'');
        const bl = (k==='Brand' && v) ? brandLogo(v) : null;
        if(bl){ const bi=document.createElement('img'); bi.className='np-brandcell'; bi.src=bl; bi.alt=v; bi.onerror=function(){ this.replaceWith(document.createTextNode(v)); }; c.appendChild(bi); }
        else c.innerHTML = v==null?'<span class="np-dash">—</span>':v;
        table.appendChild(c);
      });
    });
    scroll.appendChild(table); m.appendChild(scroll);
    ov.appendChild(m); document.body.appendChild(ov);
    ov.onclick=e=>{ if(e.target===ov) ov.remove(); };
    document.addEventListener('keydown',function esc(e){ if(e.key==='Escape'){ ov.remove(); document.removeEventListener('keydown',esc);} });
  }

  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-compare]');
    if(b){ e.preventDefault(); add(b.getAttribute('data-compare')); }
  });
  function promptNeed(){
    let ov=document.querySelector('.np-modal-ov'); if(ov) ov.remove();
    ov=document.createElement('div'); ov.className='np-modal-ov';
    const m=document.createElement('div'); m.className='np-modal np-modal-sm';
    m.innerHTML='<div class="np-prompt"><div class="np-prompt-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="7" height="16" rx="1.5"/><rect x="14" y="4" width="7" height="16" rx="1.5"/></svg></div><h3>Choose what to compare</h3><p>Tap <b>Add to compare</b> on at least two devices, then press Compare to see them side by side.</p><button class="btn btn-primary">Got it</button></div>';
    ov.appendChild(m); document.body.appendChild(ov);
    m.querySelector('button').onclick=()=>ov.remove();
    ov.onclick=e=>{ if(e.target===ov) ov.remove(); };
    document.addEventListener('keydown',function esc(e){ if(e.key==='Escape'){ ov.remove(); document.removeEventListener('keydown',esc);} });
  }
  function requestOpen(){ if(tray.length>=2) openModal(); else promptNeed(); }
  window.NPCompare={add,remove,clear,open:openModal,requestOpen};

  /* ---- device detail modal (Learn more / See pricing) ---- */
  const NPARROW='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  function npDeviceDetail(cardId,focusPricing){
    const card=document.getElementById(cardId); if(!card) return;
    const g=s=>card.querySelector(s);
    const name=g('h3')?g('h3').textContent:cardId;
    const desc=g('.pdesc')?g('.pdesc').textContent:'';
    const specs=g('.pspecs')?g('.pspecs').innerHTML:'';
    const price=g('.pprice')?g('.pprice').innerHTML:'';
    const logoEl=g('.cardbrand-img');
    const cmpEl=g('[data-compare]'); const cmp=cmpEl?cmpEl.getAttribute('data-compare'):null;
    // map this device's brand to a Build Your Solution slug (only brands the builder supports)
    const brandTxt=((card.getAttribute('data-brand')||'')+' '+name).toLowerCase();
    let buildSlug=null;
    if(brandTxt.indexOf('shift4')>-1||brandTxt.indexOf('skytab')>-1) buildSlug='shift4';
    else if(brandTxt.indexOf('square')>-1) buildSlug='square';
    else if(brandTxt.indexOf('clover')>-1) buildSlug='clover';
    let ov=document.querySelector('.np-modal-ov'); if(ov) ov.remove();
    ov=document.createElement('div'); ov.className='np-modal-ov';
    const m=document.createElement('div'); m.className='np-modal np-detail';
    const close=document.createElement('button'); close.className='np-modal-x'; close.innerHTML='&times;'; close.onclick=()=>ov.remove(); m.appendChild(close);
    const media=document.createElement('div'); media.className='np-detail-media';
    const slot=card.querySelector('image-slot'); if(slot){ const c=slot.cloneNode(true); c.removeAttribute('id'); c.style.pointerEvents='none'; media.appendChild(c); }
    m.appendChild(media);
    const body=document.createElement('div'); body.className='np-detail-body';
    body.innerHTML=(logoEl?'<img class="np-detail-logo" src="'+logoEl.getAttribute('src')+'" alt="">':'')
      +'<h3>'+name+'</h3><p class="np-detail-desc">'+desc+'</p>'
      +'<div class="pspecs np-detail-specs">'+specs+'</div>'
      +(price?'<div class="np-detail-price">'+price+'</div>':'')
      +'<div class="np-detail-pricing'+(focusPricing?' focus':'')+'"><b>Custom processing rate</b><span>We\u2019ll match or beat your current rate \u2014 get a quote for your exact pricing on this device.</span></div>'
      +'<div class="np-detail-cta">'
      +(buildSlug?'<a class="btn btn-primary" href="/build?brand='+buildSlug+'">Build your system '+NPARROW+'</a>':'')
      +'<a class="'+(buildSlug?'btn btn-outline':'btn btn-primary')+'" target="_blank" rel="noopener" href="/quick-application">Get a quote '+NPARROW+'</a>'
      +'<a class="btn btn-outline" target="_blank" rel="noopener" href="/statement-upload">Upload a statement</a>'
      +(cmp?'<button class="btn btn-compare" data-compare="'+cmp+'"><span class="cmp-label">Add to compare</span></button>':'')
      +'<a class="btn btn-outline" href="/quiz">Take the quiz</a></div>';
    m.appendChild(body);
    ov.appendChild(m); document.body.appendChild(ov);
    ov.onclick=e=>{ if(e.target===ov) ov.remove(); };
    document.addEventListener('keydown',function esc(e){ if(e.key==='Escape'){ ov.remove(); document.removeEventListener('keydown',esc);} });
    syncButtons();
  }
  window.NPDetail=npDeviceDetail;
  document.addEventListener('click',function(e){
    const a=e.target.closest('a.btn, a.link-teal'); if(!a) return;
    const card=a.closest('.pcard'); if(!card||!card.id) return;
    const href=a.getAttribute('href')||'';
    if(href.charAt(0)!=='#') return; // cross-page links navigate normally
    e.preventDefault();
    npDeviceDetail(card.id, /pric/i.test(a.textContent));
  });
  document.addEventListener('DOMContentLoaded',()=>{ renderBar(); syncButtons(); });
  if(document.readyState!=='loading'){ renderBar(); syncButtons(); }
})();
