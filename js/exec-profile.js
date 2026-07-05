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

  function emailFrom(text){
    try{ var j = JSON.parse(text); return String(j.email || j.user_email || '').toLowerCase().trim(); }
    catch(e){ return ''; }
  }
  function get(url){
    return fetch(url, {credentials:'same-origin', cache:'no-store'})
      .then(function(r){ return r ? r.text() : ''; })
      .catch(function(){ return ''; });
  }

  /* cb(profileOrNull, loginEmail, rawResponseText) — always called once. Tries the
     server-side Pages Function /whoami first (reads Access's authenticated-email
     header), then falls back to the browser-side Access identity endpoint. Guarded
     so local/preview (no Access) simply reports no identity. */
  function detect(cb){
    var done = false;
    function finish(em, raw){ if(done) return; done = true; cb(em && EXECS[em] ? EXECS[em] : null, em, raw); }
    try{
      get('/whoami').then(function(t){
        var em = emailFrom(t);
        if(em){ finish(em, t); return; }
        get('/cdn-cgi/access/get-identity').then(function(t2){ finish(emailFrom(t2), t2 || t); });
      });
    }catch(e){ finish('', ''); }
  }

  window.NPExec = { detect: detect, EXECS: EXECS };
})();
