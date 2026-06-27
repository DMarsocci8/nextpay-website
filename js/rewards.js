/* ===========================================================
   NextPay — Merchant Rewards points calculator
   Earn rate derived from program guidance:
   $50,000/mo  ->  ~10,000 pts/mo   =>  0.2 pts per $1
   =========================================================== */
(function(){
  const RATE = 0.2;                // points per dollar processed
  const fmt = n => Math.round(n).toLocaleString('en-US');

  // milestone rewards (points) used to translate a yearly total into tangibles
  const MILES = [
    {pts:12000,  label:'an Amazon, Starbucks or Uber gift card'},
    {pts:62040,  label:'an Xbox Series X'},
    {pts:75840,  label:'Apple AirPods Max'},
    {pts:179280, label:'an iMac all-in-one'},
    {pts:455000, label:'a flight-for-two + hotel trip to Maui'},
    {pts:690000, label:'a premium electric scooter'},
    {pts:814200, label:'an Omega Seamaster watch'},
    {pts:1970000,label:'a Rolex Submariner'}
  ];

  function bestReachable(yr){
    let pick=null; for(const m of MILES){ if(yr>=m.pts) pick=m; }
    return pick;
  }
  function giftCardsPerYear(yr){ return Math.floor(yr/12000); }

  function init(){
    const root = document.getElementById('rewardscalc'); if(!root) return;
    const range = root.querySelector('#rc-range');
    const numWrap = root.querySelector('#rc-num');
    const ptsMo = root.querySelector('#rc-permo');
    const ptsYr = root.querySelector('#rc-peryr');
    const fill  = root.querySelector('#rc-fill');
    const out   = root.querySelector('#rc-out');

    // Update slider + points/output for a value WITHOUT touching the text the user is typing.
    function render(v){
      const slid = Math.max(2000, Math.min(250000, v||2000));
      range.value = slid;
      fill.style.width = ((slid-2000)/(250000-2000)*100)+'%';
      const mo = (v||0)*RATE, yr = mo*12;
      ptsMo.textContent = fmt(mo);
      ptsYr.textContent = fmt(yr);
      const gc = giftCardsPerYear(yr);
      const best = bestReachable(yr);
      let html = '<div class="rc-out-row"><span class="rc-out-pts">'+fmt(yr)+'</span> points a year</div>';
      html += '<p class="rc-out-sub">That\u2019s about <b>'+gc+' gift card'+(gc===1?'':'s')+'</b> a year';
      if(best) html += ', or enough for <b>'+best.label+'</b>';
      html += ' \u2014 just for running the sales you already make.</p>';
      out.innerHTML = html;
    }
    // Clamp to range, format with commas, and render \u2014 for the slider, quick buttons and on blur.
    function setVol(v){
      v = Math.max(2000, Math.min(500000, Math.round(v||0)));
      numWrap.value = fmt(v);
      render(v);
    }

    range.addEventListener('input',()=>setVol(+range.value));
    // While typing: live-update the results from the raw digits, but leave the field exactly as typed
    // (no min-clamp, no comma reformatting) so you can clear it and type a full amount.
    numWrap.addEventListener('input',()=>{ render(+numWrap.value.replace(/[^0-9]/g,'') || 0); });
    // On blur: finalize \u2014 clamp to the allowed range and add commas.
    numWrap.addEventListener('blur',()=>setVol(+numWrap.value.replace(/[^0-9]/g,'') || 2000));
    root.querySelectorAll('[data-vol]').forEach(b=>b.addEventListener('click',()=>setVol(+b.getAttribute('data-vol'))));
    setVol(50000);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
