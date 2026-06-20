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
        ['Knowledge Base','Sales Hub - Knowledge Base.html'],
        ['Agent Quiz','Sales Hub - Quiz.html'],
        ['Training Academy','Sales Hub - Training.html'],
        ['Product Knowledge','Sales Hub - Product Knowledge.html'],
        ['Quick Reference','Sales Hub - Quick Reference Guide.html'],
        ['Agent Mindset','Sales Hub - Mindset.html']
      ]],
      ['Sell', [
        ['Prospecting Scripts','Sales Hub - Scripts.html'],
        ['Objection Handling','Sales Hub - Objections.html'],
        ['Competitor Battlecards','Sales Hub - PAYS.html'],
        ['Prospecting Questions','Sales Hub - Questions.html'],
        ['Current Promotions','Sales Hub - Promotions.html']
      ]],
      ['Quote', [
        ['Pricing & Fee Programs','Sales Hub - Pricing.html'],
        ['Proposal Builder','Sales Hub - Proposal Builder.html'],
        ['Statement Analyzers','Sales Hub - Statements.html#statements'],
        ['Calculators','Sales Hub - Statements.html#calculators']
      ]],
      ['Submit', [
        ['Submit a Deal','Sales Hub - Submit a Deal.html'],
        ['Document Library','Sales Hub - Document Library.html']
      ]],
      ['Build', [
        ['Marketing Assets','Sales Hub - Marketing Assets.html'],
        ['Brand Assets','Sales Hub - Brand Assets.html'],
        ['Lead Generation','Sales Hub - Lead Generation.html']
      ]],
      ['Grow', [
        ['My Dashboard','Sales Hub - My Dashboard.html'],
        ['Field Sales Plan','Sales Hub - Field Plan.html']
      ]]
    ];

    var here = '';
    try{ here = decodeURIComponent((location.pathname.split('/').pop()||'')).toLowerCase(); }catch(e){}
    function b(h){ return h.split('#')[0].toLowerCase(); }
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
          cols+='<a href="'+it[1]+'"'+(b(it[1])===here?' class="cur"':'')+'>'+esc(it[0])+'</a>';
        });
        cols+='</div>';
      });

      var nav=document.createElement('div');
      nav.className='hb-browse';
      nav.innerHTML=
        '<button type="button" aria-haspopup="true" aria-expanded="false">Browse the hub'
        + ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button>'
        + '<div class="hb-mega">'+cols+'</div>';

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
