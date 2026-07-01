/* NextPay email-signature logo sources.
   IMPORTANT: signatures reference the logos by HOSTED URL, not base64. Gmail caps
   signature size at ~10,000 characters, and a base64-inlined logo (~300KB) blows
   past that ("signature is too long"). Linking keeps the signature tiny.
   We use the PLATED logos (full-color mark on a baked-in white rounded plate) so the
   image carries its own white backing and stays visible on any background, including
   dark-mode Gmail. location.origin means the URL resolves to whatever NextPay host the
   builder is served from (www.nextpaypos.com or the hub). */
(function () {
  var base = (window.location && window.location.origin) || 'https://www.nextpaypos.com';
  // Fall back to the canonical domain if opened from a local file (origin would be "null").
  if (!/^https?:/i.test(base)) base = 'https://www.nextpaypos.com';
  window.NP_SIG_ASSETS = {
    nextpay: base + '/assets/logos/nextpay-signature-plated.png',
    nextlink: base + '/assets/logos/nextlink-plated.png'
  };
})();
