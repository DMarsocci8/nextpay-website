/* NextPay Agent Portal — front-end passcode gate + tabs + calculators.
   NOTE: front-end only (prototype). Not real security — for demo/internal use. */
(function(){
  const PASS = 'nextpay2026';            // shared agent passcode (change anytime)
  const KEY = 'np_agent_auth';
  const root = document.getElementById('portal-root');
  const gate = document.getElementById('agent-gate');

  function authed(){ try{ return sessionStorage.getItem(KEY)==='1' || localStorage.getItem(KEY)==='1'; }catch(e){ return false; } }
  function unlock(remember){ try{ sessionStorage.setItem(KEY,'1'); if(remember) localStorage.setItem(KEY,'1'); }catch(e){} show(); }
  function lock(){ try{ sessionStorage.removeItem(KEY); localStorage.removeItem(KEY); }catch(e){} location.reload(); }
  function show(){ gate.style.display='none'; root.style.display='block'; initTabs(); }

  // ---- gate ----
  const form = document.getElementById('gate-form');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const v = document.getElementById('gate-pass').value.trim();
    if(v===PASS){ unlock(document.getElementById('gate-remember').checked); }
    else { const err=document.getElementById('gate-err'); err.style.display='block'; document.getElementById('gate-pass').value=''; }
  });
  document.addEventListener('click',function(e){ if(e.target.closest('#agent-logout')){ lock(); }});

  // ---- tabs ----
  function initTabs(){
    const tabs=[].slice.call(document.querySelectorAll('.ap-tab'));
    const panes=[].slice.call(document.querySelectorAll('.ap-pane'));
    tabs.forEach(function(t){ t.addEventListener('click',function(){
      tabs.forEach(x=>x.classList.remove('on')); panes.forEach(x=>x.classList.remove('on'));
      t.classList.add('on'); var p=document.getElementById('pane-'+t.dataset.tab); if(p) p.classList.add('on');
      window.scrollTo({top:0,behavior:'smooth'});
    }); });
    // in-portal jump links (e.g. "go to calculators")
    document.querySelectorAll('a.go[data-jump]').forEach(function(a){ a.addEventListener('click',function(e){ e.preventDefault(); var t=document.querySelector('.ap-tab[data-tab="'+a.dataset.jump+'"]'); if(t) t.click(); }); });
    wireCalcs();
  }

  // ---- calculators ----
  const money=n=>'$'+(Math.round(n*100)/100).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
  function num(id){ const v=parseFloat(document.getElementById(id).value); return isNaN(v)?0:v; }
  function wireCalcs(){
    // Dual pricing savings
    const dp=['dp-vol','dp-rate','dp-fee'];
    function calcDP(){
      const vol=num('dp-vol'), rate=num('dp-rate')/100, dpRate=num('dp-fee')/100;
      const current=vol*rate;                       // what they pay now monthly
      const afterDual=vol*0;                          // 0% effective on dual pricing (merchant)
      const saved=current-afterDual;
      document.getElementById('dp-current').textContent=money(current);
      document.getElementById('dp-saved').textContent=money(saved);
      document.getElementById('dp-year').textContent=money(saved*12);
    }
    dp.forEach(id=>{ var el=document.getElementById(id); if(el) el.addEventListener('input',calcDP); }); calcDP();

    // Effective rate
    ['er-fees','er-vol'].forEach(id=>{ var el=document.getElementById(id); if(el) el.addEventListener('input',calcER); });
    function calcER(){ const fees=num('er-fees'), vol=num('er-vol'); const eff=vol>0?(fees/vol*100):0; document.getElementById('er-rate').textContent=(Math.round(eff*100)/100)+'%'; }
    calcER();

    // Commission / residual
    ['cm-vol','cm-bps','cm-split'].forEach(id=>{ var el=document.getElementById(id); if(el) el.addEventListener('input',calcCM); });
    function calcCM(){
      const vol=num('cm-vol'), bps=num('cm-bps'), split=num('cm-split')/100;
      const monthlyProfit=vol*(bps/10000);
      const agent=monthlyProfit*split;
      document.getElementById('cm-monthly').textContent=money(agent);
      document.getElementById('cm-year').textContent=money(agent*12);
    }
    calcCM();

    // SkyTab / Shift4 Flat Rate Plus
    ['s4-vol','s4-tx','s4-fees','s4-rate','s4-tf'].forEach(id=>{ var el=document.getElementById(id); if(el) el.addEventListener('input',calcS4); });
    function calcS4(){
      const vol=num('s4-vol'), tx=num('s4-tx'), cur=num('s4-fees'), rate=num('s4-rate')/100, tf=num('s4-tf');
      const curEff=vol>0?(cur/vol*100):0;
      const s4=vol*rate + tx*tf;
      const s4Eff=vol>0?(s4/vol*100):0;
      const msave=cur-s4;
      document.getElementById('s4-cureff').value=(Math.round(curEff*100)/100)+'%';
      document.getElementById('s4-fee').textContent=money(s4);
      document.getElementById('s4-eff').textContent=(Math.round(s4Eff*100)/100)+'%';
      document.getElementById('s4-msave').textContent=money(msave);
      document.getElementById('s4-ysave').textContent=money(msave*12);
      document.getElementById('s4-3save').textContent=money(msave*36);
      document.getElementById('s4-warn').style.display = (s4Eff<curEff && msave<0) ? 'block' : 'none';
    }
    calcS4();
  }

  // boot
  if(authed()) show();
})();
