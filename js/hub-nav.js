/* ===========================================================
   NextPay Sales Hub — shared top navigation
   Drop <script src="js/hub-nav.js"></script> before </body> on any hub page.
   It upgrades the existing .hub-bar into a full section nav so reps can jump
   between pages without going back to the hub home first.
   =========================================================== */
(function(){
  var SECTIONS = [
    { label:'Home', href:'Sales Hub.html' },
    { label:'Learn', items:[
      ['Agent Knowledge Base','Sales Hub - Knowledge Base.html'],
      ['Agent Quiz','Sales Hub - Quiz.html'],
      ['Training Academy','Sales Hub - Training.html'],
      ['Product Knowledge','Sales Hub - Product Knowledge.html'],
      ['Quick Reference Guide','Sales Hub - Quick Reference Guide.html'],
      ['Agent Mindset','Sales Hub - Mindset.html']
    ]},
    { label:'Sell', items:[
      ['Prospecting Scripts','Sales Hub - Scripts.html'],
      ['Objection Handling','Sales Hub - Objections.html'],
      ['Competitor Battlecards','Sales Hub - PAYS.html'],
      ['Prospecting Questions','Sales Hub - Questions.html'],
      ['Current Promotions','Sales Hub - Promotions.html']
    ]},
    { label:'Quote', items:[
      ['Pricing & Fee Programs','Sales Hub - Pricing.html'],
      ['Statement Analyzers','Sales Hub - Statements.html#statements'],
      ['Calculators','Sales Hub - Statements.html#calculators']
    ]},
    { label:'Submit', items:[
      ['Submit a Deal & Processes','Sales Hub - Submit a Deal.html'],
      ['Document Library','Sales Hub - Document Library.html']
    ]},
    { label:'Build', items:[
      ['Marketing Assets','Sales Hub - Marketing Assets.html'],
      ['Brand Assets & Logo Kit','Sales Hub - Brand Assets.html'],
      ['Lead Generation & Marketing','Sales Hub - Lead Generation.html']
    ]},
    { label:'Grow', items:[
      ['My Dashboard','Sales Hub - My Dashboard.html'],
      ['Field Sales Action Plan','Sales Hub - Field Plan.html']
    ]}
  ];

  var here = decodeURIComponent((location.pathname.split('/').pop()||'')).toLowerCase();
  function base(h){ return h.split('#')[0].toLowerCase(); }
  function esc(s){ return s.replace(/&/g,'&amp;'); }

  function build(){
    var inner = document.querySelector('.hub-bar .hub-bar-inner');
    if(!inner) return;

    var html =
      '<a href="Sales Hub.html" class="hb-logo" aria-label="Sales Hub home"><img src="assets/logos/nextpay-nav.png" alt="NextPay"></a>'
      + '<span class="pipe"></span>'
      + '<span class="hub-tag">Sales Hub <span class="badge">Internal</span></span>'
      + '<nav class="hb-nav">';

    SECTIONS.forEach(function(s){
      if(s.href){
        var a = base(s.href)===here ? ' aria-current="page"' : '';
        html += '<a class="hb-link'+(base(s.href)===here?' active':'')+'" href="'+s.href+'"'+a+'>'+esc(s.label)+'</a>';
      } else {
        var active = s.items.some(function(it){ return base(it[1])===here; });
        html += '<div class="hb-drop"><button type="button" class="hb-link'+(active?' active':'')+'">'+esc(s.label)
              + ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button><div class="hb-menu">';
        s.items.forEach(function(it){
          var cur = base(it[1])===here ? ' class="cur"' : '';
          html += '<a href="'+it[1]+'"'+cur+'>'+esc(it[0])+'</a>';
        });
        html += '</div></div>';
      }
    });

    html += '</nav>'
      + '<div class="hb-right">'
      + '<a href="index.html" target="_blank" rel="noopener">Main site &#8599;</a>'
      + '<a href="Sales Hub - My Dashboard.html">My Progress</a>'
      + '<a href="Sales Hub - Help.html">Help</a>'
      + '</div>';

    inner.innerHTML = html;
  }

  function injectCSS(){
    if(document.getElementById('hubnav-css')) return;
    var css = ''
      + '.hub-bar-inner{gap:12px !important}'
      + '.hb-logo{display:flex;align-items:center;flex:none}'
      + '.hb-logo img{height:30px;width:auto;display:block}'
      + '.hub-bar .hb-nav{display:flex;align-items:center;gap:2px;margin-left:4px;min-width:0}'
      + '.hub-bar .hb-link{display:inline-flex;align-items:center;gap:5px;color:#cdd8e2;font-weight:600;font-size:14.5px;line-height:1;padding:9px 12px;border-radius:9px;background:none;border:0;font-family:inherit;cursor:pointer;white-space:nowrap}'
      + '.hub-bar .hb-link:hover{color:#fff;background:rgba(255,255,255,.08)}'
      + '.hub-bar .hb-link.active{color:#fff;background:rgba(31,194,166,.18)}'
      + '.hub-bar .hb-link svg{width:12px;height:12px;opacity:.85}'
      + '.hb-drop{position:relative}'
      + '.hb-drop::after{content:"";position:absolute;left:0;right:0;top:100%;height:10px}'
      + '.hb-menu{position:absolute;top:100%;left:0;margin-top:8px;background:#fff;border-radius:12px;box-shadow:0 18px 48px rgba(12,27,42,.30);padding:8px;min-width:236px;opacity:0;visibility:hidden;transform:translateY(6px);transition:.15s ease;z-index:90}'
      + '.hb-drop:hover .hb-menu, .hb-drop:focus-within .hb-menu{opacity:1;visibility:visible;transform:translateY(0)}'
      + '.hb-menu a{display:block;padding:9px 12px;border-radius:8px;color:var(--ink);font-size:14px;font-weight:600;white-space:nowrap}'
      + '.hb-menu a:hover{background:var(--bg-soft);color:var(--teal-dark)}'
      + '.hb-menu a.cur{background:var(--bg-soft);color:var(--teal-dark)}'
      + '.hub-bar .hb-right{margin-left:auto;display:flex;align-items:center;gap:16px;flex:none}'
      + '.hub-bar .hb-right a{color:#cdd8e2;font-weight:600;font-size:14.5px;white-space:nowrap}'
      + '.hub-bar .hb-right a:hover{color:#fff}'
      + '@media(max-width:1180px){.hub-bar .hb-right a[href="Sales Hub - My Dashboard.html"]{display:none}}'
      + '@media(max-width:1024px){.hub-bar .hb-nav{display:none}}';
    var st = document.createElement('style');
    st.id = 'hubnav-css';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function init(){ injectCSS(); build(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
