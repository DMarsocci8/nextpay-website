/* ===========================================================
   NextPay — Take the Quiz engine (10-step decision tree)
   Renders into #quiz, computes recommendations from the matrix.
   =========================================================== */
(function(){
  const ARROW='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const CHECK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M5 13l4 4L19 7"/></svg>';

  const STEPS=[
    {id:'stage',q:'Where is your business today?',sub:'Tell us your starting point.',type:'single',opts:[
      {v:'existing',t:'I have an existing business',d:'Open and processing — or looking to switch or upgrade.'},
      {v:'new',t:"I'm opening a new business",d:"Pre-launch or getting started. Let's build the stack from scratch."}]},
    {id:'need',q:'What do you need?',sub:'This sets which solutions we line up for you.',type:'single',opts:[
      {v:'pos',t:'A full POS system',d:'Software + hardware to run checkout, ordering, and back office.'},
      {v:'terminal',t:'A standalone terminal',d:'Just a device to take cards — no full POS needed.'},
      {v:'online',t:'Gateway / software only',d:'Online payments, invoicing, virtual terminal — no hardware.'},
      {v:'combo',t:'A combination',d:'POS + online, or terminal + invoicing software.'}]},
    {id:'industry',q:'What industry are you in?',sub:'This drives the core recommendations.',type:'single',opts:[
      {v:'fnb',t:'Food & Beverage',d:'Restaurant, bar, café, food truck, QSR, catering.'},
      {v:'retail',t:'Retail',d:'Clothing, specialty, gift shop, general retail.'},
      {v:'conv',t:'Convenience / QSR / Ticketing',d:'Convenience store, QSR, museum, event ticketing.'},
      {v:'services',t:'Services',d:'Salon, auto, home services, professional, fitness, beauty.'},
      {v:'home',t:'Home Services / Contractors',d:'HVAC, plumbing, electrical, construction, landscaping.'},
      {v:'healthcare',t:'Healthcare',d:'Medical, dental, optometry, chiropractic, dermatology.'},
      {v:'highrisk',t:'High Risk',d:'CBD, vape/smoke, peptides, travel, specialty.'}]},
    {id:'addons',q:'Anything else on your list?',sub:'Select all that apply — optional.',type:'multi',opts:[
      {v:'offset',t:'Offset card fees to the customer',d:'Dual pricing, surcharging, or cash discount. Available on every platform.'},
      {v:'financing',t:'Business financing / funding',d:'Working capital, equipment loans, merchant cash advance.'},
      {v:'payroll',t:'Payroll & Workers Comp',d:'Full-service payroll and workers comp coverage.'},
      {v:'marketing',t:'Network building & marketing',d:'NextLink — digital outreach, reputation, campaigns.'}]},
    {id:'hardware',q:'How do you want your hardware?',sub:'Drives no-upfront vs. purchase options.',type:'single',
      when:a=>a.need==='pos'||a.need==='combo',opts:[
      {v:'own',t:'Own it outright',d:'Purchase hardware — yours to keep. Lower long-term cost.'},
      {v:'lease',t:'No upfront cost / placement',d:'Low or no upfront — hardware placed at a low monthly fee.'},
      {v:'flex',t:'Flexible / not sure yet',d:'Open to either — show me the best options.'}]},
    {id:'mobile',q:'Do you take payments in the field?',sub:'Filters mobile-capable platforms.',type:'single',
      when:a=>a.industry==='services'||a.industry==='home',opts:[
      {v:'yes',t:'Yes — payments from my phone',d:'At a customer site, field work, or away from a fixed location.'},
      {v:'no',t:'No — mostly fixed location',d:'Counter, desk, or office-based checkout.'}]},
    {id:'volume',q:'Monthly card volume?',sub:'Helps match the right pricing model.',type:'single',opts:[
      {v:'a',t:'Under $20,000 / month',d:'Early stage or lower-volume.'},
      {v:'b',t:'$20,000 – $60,000 / month',d:'Growing with steady card volume.'},
      {v:'c',t:'$60,000 – $120,000 / month',d:'Established with strong volume.'},
      {v:'d',t:'$120,000+ / month',d:'High-volume — custom pricing.'}]},
    {id:'ticket',q:'Average transaction size?',sub:'Affects which pricing model benefits you most.',type:'single',opts:[
      {v:'a',t:'Under $20',d:'Quick service, low-cost items.'},
      {v:'b',t:'$20 – $40',d:'Moderate services or retail purchases.'},
      {v:'c',t:'$40 – $80',d:'Professional services, specialty products.'},
      {v:'d',t:'$80+',d:'Healthcare, B2B, or complex services.'}]},
    {id:'locations',q:'How many locations?',sub:'Multi-location drives centralized management.',type:'single',opts:[
      {v:'a',t:'1 location',d:'Single store, restaurant, or office.'},
      {v:'b',t:'2 – 3 locations',d:'Small chain or growing footprint.'},
      {v:'c',t:'4+ locations',d:'Multi-unit operator, franchise, or enterprise.'}]},
    {id:'timeline',q:'When do you need it?',sub:'Prioritizes urgency and setup.',type:'single',opts:[
      {v:'a',t:'ASAP / under 1 month',d:'Need it now — fast setup and onboarding.'},
      {v:'b',t:'2 – 3 months',d:'Have runway to evaluate and set up properly.'},
      {v:'c',t:'4+ months',d:'Planning ahead — want the best fit.'}]}
  ];

  // ---- recommendation engine ----
  const POS='POS Systems.html', TERM='Credit Card Terminals.html', GW='Online Gateways.html', INV='Invoicing.html';
  function C(name,role,why,price,href){return {name,role,why,price,href,top:role.indexOf('Top')===0};}
  function recCards(a){
    const I=a.industry,need=a.need,hw=a.hardware,offset=(a.addons||[]).includes('offset');
    function pos(){
      const lease=hw==='lease';
      if(I==='fnb') return lease
        ?[C('Shift4 POS','Top pick','Restaurant-built, lease only, lifetime warranty, no upfront.','from $29.99/mo',POS),C('Clover POS','Option','Placement program, 500+ app marketplace.','no upfront',POS)]
        :[C('Square POS','Top pick','Free tier, inventory & eCommerce — broadest fit.','from $0/mo',POS),C('Clover POS','Option','Buy or lease, lifetime warranty, 500+ apps.','placement',POS)];
      if(I==='retail') return [C('Square POS','Top pick','Free tier, inventory and eCommerce built in.','from $0/mo',POS),C('SwipeSimple','Option','Mobile-first, Text-to-Pay, flexible.','from $25/mo',POS)];
      if(I==='conv') return [C('Square POS','Top pick','Fast checkout, scalable, free tier.','from $0/mo',POS),C('KORONA POS','Option','Regulated products, ticketing, multi-location.','from $59/mo',POS),C('Clover POS','Option','Placement program, 500+ apps.','no upfront',POS)];
      if(I==='services') return [C('SwipeSimple','Top pick','Mobile app, appointments, Text-to-Pay.','from $25/mo',POS),C('Clover POS','Option','Appointments, placement program.','no upfront',POS)];
      if(I==='highrisk') return [C('KORONA POS','Top pick','Age verification, compliance, multi-location.','from $59/mo',POS)];
      return [C('Square POS','Top pick','Free tier, broad industry fit.','from $0/mo',POS),C('Clover POS','Option','500+ apps, placement program.','no upfront',POS)];
    }
    function term(){
      if(I==='fnb') return [C('Dejavoo Terminals','Top pick','Countertop + wireless, tip prompting, dual pricing.','processing only',TERM+'#dejavoo'),C('Clover Flex & Go','Option','Natural add-on if Clover is your POS.','processing only',TERM+'#clover')];
      if(I==='healthcare') return [C('Dejavoo Terminals','Top pick','Countertop, PIN debit — pairs with LQpay.','processing only',TERM+'#dejavoo'),C('Square Terminal','Option','Simple all-in-one front-desk option.','2.6% + 10¢',TERM+'#square')];
      if(I==='highrisk') return [C('Valor PayTech','Top pick','High-risk processors, dual pricing, multi-MID.','processing only',TERM+'#valor')];
      return [C('PAX Terminals','Top pick','4G LTE, Wi-Fi, long battery, built-in printer.','processing only',TERM+'#pax'),C('Valor PayTech','Option','Dual pricing built-in, SMS marketing.','processing only',TERM+'#valor')];
    }
    function online(){
      if(I==='fnb') return [C('Square Online & Invoicing','Top pick','Free tier, eCommerce, online ordering.','2.9% + 30¢',GW),C('iPOSpays by Dejavoo','Option','Dual pricing invoicing, ACH, 0% option.','from $25/mo',GW)];
      if(I==='retail') return [C('Authorize.net','Top pick','Invoicing, ACH, QuickBooks sync.','from $25/mo',GW),C('Square Online','Option','eCommerce store + invoicing, free tier.','free',GW)];
      if(I==='services') return [C('SwipeSimple','Top pick','Text-to-Pay, invoicing, mobile app.','from $25/mo',INV),C('iPOSpays by Dejavoo','Option','Dual pricing invoicing, virtual terminal.','from $25/mo',GW),C('FluidPay','Option','AI fraud, recurring billing, mobile.','from $25/mo',GW)];
      if(I==='home') return [C('Field Work','Top pick','Job-based invoicing, scheduling & recurring billing.','custom',INV),C('iPOSpays by Dejavoo','Option','Dual pricing invoicing, Text-to-Pay.','from $25/mo',GW)];
      if(I==='healthcare') return [C('LQpay','Top pick','EMR/EHR integration, Text-to-Pay billing.','custom',INV),C('SwipeSimple','Option','In-person + remote, Text-to-Pay.','from $25/mo',INV)];
      if(I==='highrisk') return [C('Valor Gateway','Top pick','High-risk capable, dual pricing, ACH.','from $25/mo',GW),C('FluidPay','Option','Invoicing, AI fraud detection.','from $25/mo',GW)];
      return [C('NMI Gateway','Top pick','Multi-platform, recurring billing, ACH.','from $25/mo',GW),C('Authorize.net','Option','Trusted, invoicing, QuickBooks sync.','from $25/mo',GW)];
    }
    let cards=[];
    if(I==='home'){ cards=online().concat(term().slice(0,1)); }
    else if(I==='healthcare'){ cards = need==='terminal'? term() : online().concat(term().slice(0,1)); }
    else if(need==='pos') cards=pos();
    else if(need==='terminal') cards=term();
    else if(need==='online') cards=online();
    else if(need==='combo') cards=pos().slice(0,1).concat(online().slice(0,1),term().slice(0,1));
    else cards=pos();
    if(offset && (need==='pos'||need==='combo') && (I==='fnb'||I==='retail'||I==='services'))
      cards.push(C('PAYS POS','Add-on','Dual-pricing specialist — 0% processing.','custom',POS));
    return cards;
  }
  function services(a){
    const s=[], add=a.addons||[];
    if(add.includes('financing')) s.push({name:'NextFund — Business Financing',d:'Working capital, equipment financing, and merchant cash advances — fast approval based on processing history.',href:'Business Financing.html'});
    if(add.includes('payroll')) s.push({name:'Payroll & Workers Comp',d:'Full-service payroll, direct deposit, tax filing, and workers comp — managed in one place.',href:'Payroll - Workers Comp.html'});
    if(add.includes('marketing')) s.push({name:'NextLink — Network & Growth',d:'Digital outreach, reputation management, and campaign support to grow demand.',href:'Client Automation Outreach.html'});
    s.push({name:'Business Brokerage',d:"Looking to buy, expand, or sell? NextPay's brokerage connections help you navigate growth and transition.",href:'Business Brokerage.html'});
    return s;
  }

  // ---- state + render ----
  const root=document.getElementById('quiz');
  let answers={}; try{ answers=JSON.parse(localStorage.getItem('np_quiz')||'{}'); }catch(e){}
  let idx=0;
  function visible(){ return STEPS.filter(s=>!s.when||s.when(answers)); }
  function save(){ try{ localStorage.setItem('np_quiz',JSON.stringify(answers)); }catch(e){} }

  function render(){
    const vis=visible();
    if(idx>vis.length) idx=vis.length;
    if(idx>=vis.length){ return renderResults(); }
    const step=vis[idx];
    const n=vis.length, cur=idx+1;
    const sel=answers[step.id];
    root.innerHTML='';
    const card=el('div','quiz-card');
    // progress
    const prog=el('div','quiz-prog');
    const bar=el('div','quiz-prog-bar'); bar.innerHTML='<i style="width:'+Math.round((cur-1)/n*100)+'%"></i>';
    const pl=el('div','quiz-prog-l'); pl.textContent='Step '+cur+' of '+n;
    prog.appendChild(pl); prog.appendChild(bar); card.appendChild(prog);
    // question
    const h=el('h2','quiz-q'); h.textContent=step.q; card.appendChild(h);
    const sub=el('p','quiz-sub'); sub.textContent=step.sub; card.appendChild(sub);
    // options
    const opts=el('div','quiz-opts'+(step.opts.length>4?' two':''));
    step.opts.forEach(o=>{
      const on = step.type==='multi' ? (Array.isArray(sel)&&sel.includes(o.v)) : sel===o.v;
      const b=el('button','quiz-opt'+(on?' on':'')); b.type='button';
      b.innerHTML='<div class="qo-tick">'+CHECK+'</div><div class="qo-body"><b>'+o.t+'</b><span>'+o.d+'</span></div>';
      b.onclick=()=>{
        if(step.type==='multi'){
          let arr=Array.isArray(answers[step.id])?answers[step.id].slice():[];
          if(arr.includes(o.v)) arr=arr.filter(x=>x!==o.v); else arr.push(o.v);
          answers[step.id]=arr; save(); render();
        } else {
          answers[step.id]=o.v; save();
          // mark the selection; the agent advances with the Continue button
          render();
        }
      };
      opts.appendChild(b);
    });
    card.appendChild(opts);
    // nav
    const nav=el('div','quiz-nav');
    const back=el('button','btn btn-outline'); back.type='button'; back.textContent='Back';
    back.disabled=idx===0; if(idx===0) back.style.visibility='hidden';
    back.onclick=()=>{ idx=Math.max(0,idx-1); render(); };
    nav.appendChild(back);
    const last=idx===vis.length-1;
    if(step.type==='multi'){
      const next=el('button','btn btn-primary'); next.type='button';
      next.innerHTML=(last?'See my results ':(Array.isArray(sel)&&sel.length?'Continue ':'Skip '))+ARROW;
      next.onclick=()=>{ idx++; render(); };
      nav.appendChild(next);
    } else {
      const next=el('button','btn btn-primary'); next.type='button';
      next.innerHTML=(last?'See my results ':'Continue ')+ARROW;
      const hasSel=sel!==undefined&&sel!==null&&sel!=='';
      if(!hasSel){ next.disabled=true; next.style.opacity='.45'; next.style.cursor='not-allowed'; }
      next.onclick=()=>{ if(answers[step.id]===undefined) return; idx++; render(); };
      nav.appendChild(next);
    }
    card.appendChild(nav);
    root.appendChild(card);
    root.scrollIntoView?null:null; window.scrollTo({top:0,behavior:'smooth'});
  }

  function renderResults(){
    const cards=recCards(answers), svc=services(answers), offset=(answers.addons||[]).includes('offset');
    root.innerHTML='';
    const wrap=el('div','quiz-results');
    const head=el('div','quiz-res-head');
    head.innerHTML='<span class="eyebrow" style="justify-content:center">Your recommendation</span><h2>Here\u2019s the NextPay stack we\u2019d build for you</h2><p class="quiz-sub" style="text-align:center;margin:10px auto 0;max-width:560px">Based on your answers. <b>Top pick</b> is the best fit; options are strong alternatives. A specialist will confirm the exact setup and rate.</p>';
    wrap.appendChild(head);
    const grid=el('div','quiz-res-grid');
    cards.forEach(c=>{
      const k=el('a','quiz-rcard'+(c.top?' top':'')); k.href=c.href; k.target='_blank'; k.rel='noopener';
      k.innerHTML=(c.top?'<span class="rc-ribbon">\u2605 Top pick</span>':'<span class="rc-role">'+c.role+'</span>')
        +'<h3>'+c.name+'</h3><p>'+c.why+'</p><div class="rc-foot"><span class="rc-price">'+c.price+'</span><span class="rc-go">View '+ARROW+'</span></div>';
      grid.appendChild(k);
    });
    wrap.appendChild(grid);
    if(offset){
      const note=el('div','quiz-note');
      note.innerHTML=CHECK+'<span><b>Fee offset is available on every option above.</b> Ask us about dual pricing, surcharging, or cash discount to eliminate or reduce your processing costs.</span>';
      wrap.appendChild(note);
    }
    if(svc.length){
      const sh=el('h3','quiz-res-sub'); sh.textContent='Also worth a look'; wrap.appendChild(sh);
      const sg=el('div','quiz-svc-grid');
      svc.forEach(s=>{ const c=el('a','quiz-svc'); c.href=s.href||'#'; c.target='_blank'; c.rel='noopener'; c.innerHTML='<b>'+s.name+'</b><span>'+s.d+'</span><span class="svc-go">Learn more '+ARROW+'</span>'; sg.appendChild(c); });
      wrap.appendChild(sg);
    }
    const cta=el('div','quiz-res-cta');
    cta.innerHTML='<a class="btn btn-primary" target="_blank" rel="noopener" href="Contact.html">Get my custom quote '+ARROW+'</a><a class="btn btn-outline" target="_blank" rel="noopener" href="Contact.html">Talk to a specialist</a><button class="btn btn-ghost-dark" type="button" id="quiz-restart">Start over</button>';
    wrap.appendChild(cta);
    root.appendChild(wrap);
    document.getElementById('quiz-restart').onclick=()=>{ answers={}; idx=0; save(); render(); };
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function el(tag,cls){ const e=document.createElement(tag); if(cls)e.className=cls; return e; }
  render();
})();
