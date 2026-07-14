/* np-url-canon — if a page is reached via its raw "/Sales Hub - X.html" filename
   (spaces/%20 in the URL), cosmetically swap the address bar to the flat lowercase
   "/x" form after load. No server redirect, no reload, no loop. Loaded everywhere. */
(function(){try{
  var p=decodeURIComponent(location.pathname), clean=null;
  if(/^\/sales hub\/?$/i.test(p)||/^\/sales hub\.html$/i.test(p)){clean="/saleshub";}
  else{var m=p.match(/^\/sales hub\s*-\s*(.+?)(?:\.html)?\/?$/i); if(m){clean="/"+m[1].replace(/\s+/g,"").toLowerCase();}}
  if(clean&&clean!==location.pathname){history.replaceState(null,"",clean+location.search+location.hash);}
}catch(e){}})();

/* ===========================================================
   NextPay Sales Hub — shared "Browse the hub" navigation
   Drop <script src="js/hub-nav.js"></script> before </body> on any hub page.
   It APPENDS a single Browse dropdown to the existing top bar (nothing is
   removed) so reps can jump between pages. Fully wrapped in try/catch so it
   can never break the page it runs on.
   =========================================================== */
(function(){
  try{
    var GROUPS = [
      ['Learn', [
        ['Knowledge Base','/knowledgebase'],
        ['Agent Quiz','/quiz'],
        ['Training Academy','/training'],
        ['DM-to-Sale Playbook','/dmplaybook'],
        ['Product Knowledge','/productknowledge'],
        ['Quick Reference','/quickreferenceguide'],
        ['Agent Mindset','/mindset']
      ]],
      ['Sell', [
        ['Prospecting Scripts','/scripts'],
        ['Objection Handling','/objections'],
        ['Competitor Battlecards','/battlecards'],
        ['SumUp Battlecards','/sumupbattlecards'],
        ['Prospecting Questions','/prospecting'],
        ['Current Promotions','/promotions']
      ]],
      ['Quote', [
        ['Pricing & Fee Programs','/pricing'],
        ['Proposal Builder','/proposalbuilder'],
        ['Statement Analyzers','/analyzestatement'],
        ['Calculators','/calculators']
      ]],
      ['Products', [
        ['SkyTab by Shift4','/shift4'],
        ['Square','/square'],
        ['Clover','/clover'],
        ['SumUp','/sumup'],
        ['Quantic','/quantic'],
        ['Korona','/korona'],
        ['NRS','/nrs'],
        ['DejaPay Pro','/dejapay'],
        ['PAYS POS','/pays'],
        ['Next2Pay Invoicing','/next2pay']
      ]],
      ['Submit', [
        ['Submit a Deal','/submitadeal'],
        ['Merchant Application','/application',1],
        ['Document Library','/documentlibrary']
      ]],
      ['Build', [
        ['Marketing Assets','/marketingassets'],
        ['Email Signature','/emailsignature'],
        ['Brand Assets','/brandassets'],
        ['Lead Generation','/leadgeneration']
      ]],
      ['Grow', [
        ['My Dashboard','/mydashboard',1],
        ['Agent Pay Plan','/agentpayplan'],
        ['Field Sales Plan','/fieldplan']
      ]]
    ];

    var here = '';
    try{ here = decodeURIComponent((location.pathname.split('/').pop()||'')).toLowerCase(); }catch(e){}
    function b(h){ return (h.split('#')[0].split('?')[0].split('/').pop()||'').toLowerCase(); }
    function esc(s){ return String(s).replace(/&/g,'&amp;'); }

    function injectCSS(){
      if(document.getElementById('hubnav-css')) return;
      var css =
        '.hb-browse{position:relative;display:inline-flex;align-items:center}'
      + '.hb-browse>button{display:inline-flex;align-items:center;gap:7px;color:#fff;font-weight:700;font-size:14.5px;line-height:1;padding:9px 15px;border-radius:999px;background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.16);font-family:inherit;cursor:pointer;white-space:nowrap}'
      + '.hb-browse>button:hover{background:rgba(255,255,255,.16)}'
      + '.hb-browse>button svg{width:13px;height:13px;opacity:.9;transition:transform .15s}'
      + '.hb-browse.open>button svg{transform:rotate(180deg)}'
      + '.hb-mega{position:absolute;top:100%;left:0;margin-top:10px;background:#fff;border-radius:14px;box-shadow:0 20px 50px rgba(12,27,42,.32);padding:18px;z-index:200;'
      +   'display:grid;grid-template-columns:repeat(3,minmax(170px,1fr));gap:6px 22px;width:600px;opacity:0;visibility:hidden;transform:translateY(6px);transition:.15s ease}'
      + '.hb-browse:hover .hb-mega, .hb-browse.open .hb-mega{opacity:1;visibility:visible;transform:translateY(0)}'
      + '.hb-browse::after{content:"";position:absolute;left:0;right:0;top:100%;height:12px}'
      + '.hb-col h6{margin:0 0 6px;font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--teal-dark,#0E8473)}'
      + '.hb-col a{display:block;padding:7px 9px;border-radius:8px;color:var(--ink,#0C1B2A);font-size:13.5px;font-weight:600;white-space:nowrap}'
      + '.hb-col a:hover{background:var(--bg-soft,#F3F7F8);color:var(--teal-dark,#0E8473)}'
      + '.hb-col a.cur{background:var(--bg-soft,#F3F7F8);color:var(--teal-dark,#0E8473)}'
      + '.hb-col a.hl{color:var(--teal-dark,#0E8473);font-weight:800}'
      + '.hb-col a .hb-tag{display:inline-block;margin-left:7px;font-size:9px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;background:var(--teal,#14A18C);color:#fff;padding:2px 6px;border-radius:999px;vertical-align:middle}'
      + '.hb-start{grid-column:1/-1;display:flex;align-items:center;gap:12px;margin-bottom:8px;padding:12px 14px;border-radius:11px;background:#0C1B2A;color:#fff;text-decoration:none;border:1px solid rgba(20,161,140,.45)}'
      + '.hb-start:hover{border-color:var(--teal,#14A18C);background:#0e2230}'
      + '.hb-start .hb-start-tag{flex:none;font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;background:var(--teal,#14A18C);color:#fff;padding:4px 9px;border-radius:999px}'
      + '.hb-start .hb-start-txt{flex:1;font-size:13px;color:#dce6ec;font-weight:600;white-space:normal;line-height:1.35}'
      + '.hb-start .hb-start-txt b{color:#fff}'
      + '.hb-start svg{width:16px;height:16px;flex:none;color:var(--teal-bright,#1FC2A6)}'
      + '@media(max-width:760px){.hb-mega{grid-template-columns:repeat(2,1fr);width:380px}}'
      + '@media(max-width:520px){.hb-browse{display:none}}';
      var st=document.createElement('style'); st.id='hubnav-css'; st.textContent=css;
      document.head.appendChild(st);
    }

    function build(){
      var inner=document.querySelector('.hub-bar .hub-bar-inner');
      if(!inner || inner.querySelector('.hb-browse')) return;

      var cols='';
      GROUPS.forEach(function(g){
        cols+='<div class="hb-col"><h6>'+esc(g[0])+'</h6>';
        g[1].forEach(function(it){
          var cls=[]; if(b(it[1])===here)cls.push('cur'); if(it[2])cls.push('hl');
          cols+='<a href="'+it[1]+'"'+(cls.length?' class="'+cls.join(' ')+'"':'')+'>'+esc(it[0])+'</a>';
        });
        cols+='</div>';
      });

      var nav=document.createElement('div');
      nav.className='hb-browse';
      nav.innerHTML=
        '<button type="button" aria-haspopup="true" aria-expanded="false">Browse the hub'
        + ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button>'
        + '<div class="hb-mega"><a class="hb-start" href="/mydashboard"><span class="hb-start-tag">Start here</span><span class="hb-start-txt"><b>New to NextPay?</b> Open <b>My Dashboard</b> — your guided checklist &amp; Quick Start Package.</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>'+cols+'</div>';

      var right=inner.querySelector('.right');
      if(right) inner.insertBefore(nav, right); else inner.appendChild(nav);

      // click toggle (for touch / keyboard) in addition to hover
      var btn=nav.querySelector('button');
      btn.addEventListener('click', function(e){
        e.preventDefault();
        var open=nav.classList.toggle('open');
        btn.setAttribute('aria-expanded', open?'true':'false');
      });
      document.addEventListener('click', function(e){
        if(!nav.contains(e.target)) nav.classList.remove('open');
      });
    }

    function init(){ injectCSS(); build(); }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  }catch(err){ /* never break the host page */ }
})();
