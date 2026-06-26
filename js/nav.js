/* ===========================================================
   NextPay — shared nav + footer injector
   Pages include <div id="np-nav"></div> and <div id="np-footer"></div>.
   Set <body data-page="..."> to highlight (optional).
   =========================================================== */
(function(){
  const NAV = `
  <nav class="nav">
    <div class="nav-inner">
      <a class="nav-logo" href="/" aria-label="NextPay home"><img src="assets/logos/nextpay-nav.png" alt="NextPay Business Solutions"></a>
      <div class="nav-links">
        <div class="nav-drop">
          <button class="nav-item">Solutions
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button>
          <div class="mega mega-sol">
            <div class="mcol">
              <a class="sol-banner" href="/accept-payments"><img src="assets/lifestyle/card-tap.jpg" alt=""><span>Accept Payments</span></a>
              <a class="mega-link" href="/pos-systems"><b>Point of Sale Systems</b><span>Clover, Shift4Dine, Square &amp; more</span></a>
              <a class="mega-link" href="/terminals"><b>Credit Card Terminals</b><span>PAX, Dejavoo, SwipeSimple &amp; more</span></a>
              <a class="mega-link" href="/invoicing"><b>Online Payments &amp; Invoicing</b><span>Gateways, invoicing &amp; recurring billing</span></a>
              <a class="mega-link" href="/integrations"><b>Integrations</b><span>QuickBooks, FieldPulse, CRMs &amp; more</span></a>
            </div>
            <div class="mcol">
              <a class="sol-banner" href="/run-your-business"><img src="assets/solutions/payroll.jpg" alt=""><span>Run Your Business</span></a>
              <a class="mega-link" href="/payroll"><b>Payroll &amp; Workers Comp</b><span>Pay your team, stay covered</span></a>
              <a class="mega-link" href="/hr-compliance"><b>HR &amp; Compliance</b><span>HR tools for growing teams</span></a>
              <a class="mega-link" href="/bookkeeping"><b>Bookkeeping</b><span>Reconciliation, reports &amp; tax-ready books</span></a>
              <a class="mega-link" href="/fee-programs"><b>Zero Fee Programs</b><span>Dual pricing, cash discount &amp; surcharge</span></a>
              <a class="mega-link" href="/chargeback-protection"><b>Fraud &amp; Chargeback Protection</b><span>Fraud screening &amp; dispute management</span></a>
            </div>
            <div class="mcol">
              <a class="sol-banner" href="/grow"><img src="assets/solutions/business-financing.jpg" alt=""><span>Grow Your Business</span></a>
              <a class="mega-link" href="/outreach"><b>Client Automation Outreach</b><span>LinkedIn, email &amp; voicemail drops</span></a>
              <a class="mega-link" href="/financing"><b>Business Financing</b><span>Working capital &amp; cash advances</span></a>
              <a class="mega-link" href="/brokerage"><b>Business Brokerage</b><span>Buy, sell, or get a valuation</span></a>
              <a class="mega-link" href="/merchant-rewards"><b>Merchant Rewards</b><span>Earn points on every dollar processed</span></a>
            </div>
          </div>
        </div>
        <div class="nav-drop ind-drop">
          <button class="nav-item">Industries
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button>
          <div class="mega mega-ind">
            <div class="ind-cols">
              <div class="ind-col">
                <a class="ind-cat" href="/industries#retail"><image-slot id="indcat-retail" src="assets/industries/retail.png" radius="12" placeholder="Retail photo"></image-slot><span class="ind-cat-lbl">Retail</span></a>
                <a class="ind-item" href="/boutique">Boutique &amp; Clothing</a><a class="ind-item" href="/convenience">Convenience &amp; Grocery</a><a class="ind-item" href="/liquor">Liquor Stores</a><a class="ind-item" href="/jewelry">Jewelry Stores</a><a class="ind-item" href="/specialty-retail">Specialty Retail</a>
              </div>
              <div class="ind-col">
                <a class="ind-cat" href="/industries#services"><image-slot id="indcat-services" src="assets/industries/services.png" radius="12" placeholder="Services photo"></image-slot><span class="ind-cat-lbl">Services</span></a>
                <a class="ind-item" href="/auto-repair">Auto Repair &amp; Automotive</a><a class="ind-item" href="/salons">Salons &amp; Spas</a><a class="ind-item" href="/home-services">Home Services</a><a class="ind-item" href="/fitness">Fitness &amp; Gyms</a><a class="ind-item" href="/professional-services">Professional Services</a><a class="ind-item" href="/cleaning">Cleaning Services</a>
              </div>
              <div class="ind-col">
                <a class="ind-cat" href="/industries#food-beverage"><image-slot id="indcat-food" src="assets/industries/pizzeria.png" radius="12" placeholder="Food &amp; beverage photo"></image-slot><span class="ind-cat-lbl">Food &amp; Beverage</span></a>
                <a class="ind-item" href="/fine-dining">Restaurants</a><a class="ind-item" href="/pizzerias">Pizzerias</a><a class="ind-item" href="/food-trucks">Food Trucks</a><a class="ind-item" href="/bars">Bars &amp; Nightclubs</a><a class="ind-item" href="/qsr-cafes">QSR, Cafes &amp; Coffee Shops</a><a class="ind-item" href="/bakeries">Bakeries, Delis &amp; Markets</a>
              </div>
              <div class="ind-col">
                <a class="ind-cat" href="/industries#healthcare"><image-slot id="indcat-health" src="assets/industries/health.png" radius="12" placeholder="Healthcare photo"></image-slot><span class="ind-cat-lbl">Healthcare &amp; Medical</span></a>
                <a class="ind-item" href="/vision-care">Vision Care</a><a class="ind-item" href="/dental">Dental</a><a class="ind-item" href="/chiropractic">Chiropractic &amp; PT</a><a class="ind-item" href="/dermatology">Dermatology</a><a class="ind-item" href="/mental-health">Mental Health</a><a class="ind-item" href="/wellness">Wellness Centers</a>
              </div>
            </div>
            <div class="mega-foot">
              <a class="link-teal" href="/industries">View All Industries <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
              <a class="link-teal" href="/high-risk">High Risk &amp; Specialty <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
            </div>
            <div class="mega-note">Don’t see your business type? <a href="/contact">Contact us</a> and we’ll see how we — or one of our partners — can help.</div>
          </div>
        </div>
        <div class="nav-drop">
          <button class="nav-item">Pricing
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button>
          <div class="nav-menu">
            <a href="/pricing#processing"><b>Payment Processing</b><span>Dual pricing, IC+, flat rate</span></a>
            <a href="/pricing#programs"><b>Pricing Programs</b><span>Every program explained</span></a>
            <a href="/pricing#pos"><b>POS &amp; Terminals</b><span>Software, hardware &amp; readers</span></a>
            <a href="/pricing#software"><b>Software &amp; Services</b><span>NextLink, payroll, bookkeeping</span></a>
            <a href="/pricing#quoted"><b>Quoted Services</b><span>Brokerage &amp; funding</span></a>
          </div>
        </div>
        <div class="nav-drop">
          <button class="nav-item">Resources
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button>
          <div class="nav-menu">
            <a href="/resources"><b>Blog &amp; Guides</b><span>Tips, how-tos &amp; industry news</span></a>
            <a href="/quiz" target="_blank" rel="noopener"><b>Take the Quiz</b><span>Find your perfect setup</span></a>
            <a href="/statement-upload" target="_blank" rel="noopener"><b>Free Rate Review</b><span>We'll match or beat your rate</span></a>
          </div>
        </div>
        <div class="nav-drop">
          <button class="nav-item">Partners
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button>
          <div class="nav-menu">
            <a href="/partners"><b>Partner with NextPay</b><span>Earn by referring or selling</span></a>
            <a href="/affiliate"><b>Affiliate Program</b><span>Flat $500 per referral</span></a>
            <a href="/agent-program"><b>Agent Program</b><span>50% residuals, bonuses &amp; leads</span></a>
          </div>
        </div>
      </div>
      <div class="nav-right">
        <div class="nav-drop nav-drop-r">
          <button class="nav-item contact">Why NextPay
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button>
          <div class="nav-menu">
            <a href="/why-nextpay"><b>About Us</b><span>Why NextPay &amp; how we work</span></a>
            <a href="/contact"><b>Contact Us</b><span>Talk to our team</span></a>
          </div>
        </div>
        <a class="nav-cta alt" href="/quick-application">Apply Now</a>
        <a class="nav-cta" href="/quiz">Take the Quiz
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      </div>
      <button class="nav-burger" type="button" aria-label="Menu" aria-expanded="false">
        <svg class="bars" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        <svg class="x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <div class="nav-mobile">
      <div class="nm-sec">
        <button class="nm-head" type="button">Solutions <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button>
        <div class="nm-body">
          <a href="/pos-systems">POS Systems</a>
          <a href="/terminals">Credit Card Terminals</a>
          <a href="/invoicing">Online Payments &amp; Invoicing</a>
          <a href="/integrations">Integrations</a>
          <a href="/payroll">Payroll &amp; Workers Comp</a>
          <a href="/fee-programs">Zero Fee Programs</a>
          <a href="/financing">Business Financing</a>
          <a href="/merchant-rewards">Merchant Rewards</a>
        </div>
      </div>
      <div class="nm-sec">
        <button class="nm-head" type="button">Industries <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button>
        <div class="nm-body">
          <a href="/industries">View All Industries</a>
          <a href="/industries#retail">Retail</a>
          <a href="/industries#services">Services</a>
          <a href="/industries#food-beverage">Food &amp; Beverage</a>
          <a href="/industries#healthcare">Healthcare &amp; Medical</a>
          <a href="/high-risk">High Risk &amp; Specialty</a>
        </div>
      </div>
      <div class="nm-sec">
        <button class="nm-head" type="button">Partners <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button>
        <div class="nm-body">
          <a href="/partners">Partner with NextPay</a>
          <a href="/affiliate">Affiliate Program</a>
          <a href="/agent-program">Agent Program</a>
        </div>
      </div>
      <a class="nm-link" href="/pricing">Pricing</a>
      <a class="nm-link" href="/resources">Resources</a>
      <a class="nm-link" href="/why-nextpay">Why NextPay</a>
      <a class="nm-link" href="/contact">Contact</a>
      <a class="nm-cta btn btn-outline" href="/quick-application" style="margin-bottom:10px">Apply Now</a>
      <a class="nm-cta btn btn-primary" href="/quiz">Take the Quiz
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
    </div>
  </nav>`;

  const FOOTER = `
  <footer class="foot">
    <div class="wrap">
      <div class="footcards"><span class="fc-eyebrow">We accept every major card</span><div class="fc-row"><img src="assets/cards/card-1.png" alt="Visa"><img src="assets/cards/card-2.png" alt="Mastercard"><img src="assets/cards/card-3.png" alt="American Express"><img src="assets/cards/card-4.png" alt="Discover"><img src="assets/cards/card-5.png" alt="JCB"><img src="assets/cards/card-6.png" alt="UnionPay"><img src="assets/cards/card-7.png" alt="Link"></div></div>
      <div class="foot-grid">
        <div><h4>Accept Payments</h4>
          <a href="/pos-systems">POS Systems</a><a href="/terminals">Credit Card Terminals</a><a href="/invoicing">Online Payments &amp; Invoicing</a><a href="/integrations">Integrations</a></div>
        <div><h4>Run Your Business</h4>
          <a href="/payroll">Payroll &amp; Workers Comp</a><a href="/hr-compliance">HR &amp; Compliance</a><a href="/bookkeeping">Bookkeeping</a><a href="/fee-programs">Zero Fee Programs</a><a href="/chargeback-protection">Fraud &amp; Chargeback Protection</a></div>
        <div><h4>Grow Your Business</h4>
          <a href="/outreach">Client Automation</a><a href="/financing">Business Financing</a><a href="/brokerage">Business Brokerage</a><a href="/merchant-rewards">Merchant Rewards</a></div>
        <div><h4>Industries</h4>
          <a href="/industries">Retail</a><a href="/industries">Services</a><a href="/industries">Food &amp; Beverage</a><a href="/industries">Healthcare &amp; Medical</a><a href="/high-risk">High Risk &amp; Specialty</a></div>
        <div><h4>Partners</h4>
          <a href="/partners">Partner with NextPay</a><a href="/affiliate">Affiliate Program</a><a href="/agent-program">Agent Program</a></div>
        <div><h4>Company</h4>
          <a href="/why-nextpay">Why NextPay</a><a href="/pricing">Pricing</a><a href="/build">Build Your Solution</a><a href="/resources">Resources</a><a href="/quick-application">Quick Application</a><a href="/contact">Contact</a></div>
      </div>
      <div class="foot-brand">
        <a class="brand" href="/" aria-label="NextPay home"><img src="assets/logos/nextpay-nav.png" alt="NextPay Business Solutions" style="height:40px;width:auto;display:block"></a>
        <p>Smarter Solutions. Stronger Businesses.<br>All the tools to run and grow your business — connected to one account.</p>
      </div>
      <div class="foot-bottom"><span>© 2026 NextPay. All rights reserved.</span><span><a href="https://hub.nextpaypos.com/Sales%20Hub" style="color:var(--teal-bright);font-weight:700">Agent Login</a> nextpaypos.com</span></div>
    </div>
  </footer>`;

  function mount(){
    const n=document.getElementById('np-nav'); if(n) n.outerHTML=NAV;
    const f=document.getElementById('np-footer'); if(f) f.outerHTML=FOOTER;
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount);
  else mount();

  // Keep prospects on one continuous journey: links to our own pages open in
  // the SAME tab (no popups). Only genuinely external (third-party) links open
  // in a new tab, so people don't lose the NextPay site behind them.
  document.addEventListener('click',function(e){
    if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey) return;
    const a=e.target.closest&&e.target.closest('a[target="_blank"]');
    if(!a) return;
    const href=a.getAttribute('href');
    if(!href||href.charAt(0)==='#'||/^(mailto:|tel:|javascript:)/i.test(href)) return;
    let url; try{ url=new URL(href,window.location.href); }catch(err){ return; }
    if(url.origin===window.location.origin){
      // our own page — stay in this tab (strip the new-window behavior)
      a.removeAttribute('target');
      e.preventDefault();
      window.location.href=href;
    }
    // external link: do nothing — the browser opens it in a new tab natively
  },true);

  // Mobile menu: hamburger toggles the slide-in panel; section headers
  // expand/collapse as accordions. Tapping a real link navigates (and the
  // page reload resets the menu).
  document.addEventListener('click',function(e){
    var burger=e.target.closest&&e.target.closest('.nav-burger');
    if(burger){
      e.preventDefault();
      var nav=burger.closest('.nav');
      if(nav){ var open=nav.classList.toggle('open');
        document.body.classList.toggle('nav-open',open);
        burger.setAttribute('aria-expanded',open?'true':'false'); }
      return;
    }
    var head=e.target.closest&&e.target.closest('.nm-head');
    if(head){ e.preventDefault(); var sec=head.closest('.nm-sec'); if(sec) sec.classList.toggle('open'); return; }
  });
})();
