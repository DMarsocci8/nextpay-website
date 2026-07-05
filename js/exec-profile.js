/* ===========================================================
   NextPay Sales Hub — shared exec identity
   The hub sits behind Cloudflare Access, so /cdn-cgi/access/get-identity
   returns the verified email of whoever is logged in. Personalizable tools
   (Email Signature, Business Card) call NPExec.detect() to see if that person
   is a known exec and, if so, use their name/title/phone/email.

   Add a new exec = one line in EXECS below. Titles are stored PLAIN here;
   each page encodes as needed. A person can have more than one login email
   (e.g. their @nextpaypos.com address and their Google account) — just add a
   key per address pointing at the same details.
   =========================================================== */
(function(){
  var DOM = { name:'Domenico Marsocci', title:'Co-Founder & CEO', phone:'585.303.2769', email:'dom@nextpaypos.com' };
  var ALEX = { name:'Alexander Bautista', title:'CFO', phone:'310.357.4660', email:'alexander@nextpaypos.com' };

  var EXECS = {
    'dom@nextpaypos.com':       DOM,
    'dmarsocci@gmail.com':      DOM,   /* Dom's Google login */
    'alexander@nextpaypos.com': ALEX
  };

  /* cb(profileOrNull, loginEmail, rawResponseText) — always called once,
     guarded so local/preview (no Access) simply reports no identity. */
  function detect(cb){
    try{
      fetch('/cdn-cgi/access/get-identity', {credentials:'same-origin'})
        .then(function(r){ return r ? r.text() : ''; })
        .then(function(t){
          var j = null; try{ j = JSON.parse(t); }catch(e){}
          var em = j ? String(j.email || j.user_email || '').toLowerCase().trim() : '';
          cb(em && EXECS[em] ? EXECS[em] : null, em, t);
        })
        .catch(function(){ cb(null, '', ''); });
    }catch(e){ cb(null, '', ''); }
  }

  window.NPExec = { detect: detect, EXECS: EXECS };
})();
