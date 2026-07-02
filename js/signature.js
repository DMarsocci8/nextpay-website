/* NextPay Agent Portal — email-signature builder.
   Personalizes the three approved layouts (Classic / Stacked / Banner) per
   Payment & Rewards Specialist. Static copy (title, company, tagline, links,
   logos) is baked in; only name / phone / email are variable.
   Email-safe: table layout + inline styles + base64 images only — do NOT
   convert to flexbox/grid or external CSS. */
(function () {
  'use strict';

  var A = window.NP_SIG_ASSETS || { nextpay: '', nextlink: '' };

  // ---- shared snippets (identical across layouts) -------------------------
  function pills(size) {
    var s = size || 'lg';
    if (s === 'sm') {
      return '<a href="https://www.nextpaypos.com/quiz" style="display:inline-block; background:#ffffff; color:#0C1B2A; font-size:11px; font-weight:bold; text-decoration:none; padding:7px 12px; border-radius:5px; margin-right:6px;">Quiz &rarr;</a>' +
        '<a href="https://www.nextpaypos.com/merchant-rewards#calculator" style="display:inline-block; background:#1FC2A6; color:#06231D; font-size:11px; font-weight:bold; text-decoration:none; padding:7px 12px; border-radius:5px;">Rewards &rarr;</a>';
    }
    return '<a href="https://www.nextpaypos.com/quiz" style="display:inline-block; background:#0C1B2A; color:#ffffff; font-size:11px; font-weight:bold; text-decoration:none; padding:7px 13px; border-radius:5px; margin-right:10px;">Take the Quiz &rarr;</a>' +
      '<a href="https://www.nextpaypos.com/merchant-rewards#calculator" style="display:inline-block; background:#1FC2A6; color:#06231D; font-size:11px; font-weight:bold; text-decoration:none; padding:7px 13px; border-radius:5px;">Calculate Rewards &rarr;</a>';
  }

  function nextlinkRow() {
    return '<a href="https://app.nextlinks.co/" style="text-decoration:none; vertical-align:middle;"><img src="' + A.nextlink + '" width="78" alt="NextLink Client Engagement" style="display:inline-block; width:78px; height:auto; vertical-align:middle; border:0;"></a>' +
      '<span style="vertical-align:middle; color:#9AA6B2; white-space:nowrap;">&nbsp;&nbsp;Client engagement &amp; outreach &rarr;</span>';
  }

  // ---- layouts ------------------------------------------------------------
  function classic(d) {
    return '' +
'<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif; border-collapse:collapse;">' +
  '<tr>' +
    '<td style="padding-right:18px; border-right:2px solid #1FC2A6; vertical-align:middle;">' +
      '<img src="' + A.nextpay + '" width="150" alt="NextPay Business Solutions" style="display:block; width:150px; height:auto; border:0;">' +
    '</td>' +
    '<td style="padding-left:18px; vertical-align:middle;">' +
      '<div style="font-size:16px; font-weight:bold; color:#0C1B2A; line-height:1.15;">' + d.name + '</div>' +
      '<div style="font-size:11.5px; font-weight:bold; color:#15B49A; margin-top:2px;">Payment &amp; Rewards Specialist</div>' +
      '<div style="font-size:11px; color:#5A6B7B; margin-top:1px;">NextPay Business Solutions</div>' +
      '<div style="font-size:10px; font-style:italic; color:#9AA6B2; margin-top:5px;">Smarter Solutions. Stronger Businesses.</div>' +
      '<div style="font-size:11px; color:#5A6B7B; margin-top:8px; line-height:1.5;">' +
        '<a href="tel:+1' + d.digits + '" style="color:#5A6B7B; text-decoration:none;">' + d.phone + '</a>' +
        '<span style="color:#C4CCD4;">&nbsp;&middot;&nbsp;</span>' +
        '<a href="mailto:' + d.email + '" style="color:#5A6B7B; text-decoration:none;">' + d.email + '</a>' +
        '<span style="color:#C4CCD4;">&nbsp;&middot;&nbsp;</span>' +
        '<a href="https://www.nextpaypos.com" style="color:#15B49A; text-decoration:none; font-weight:bold;">www.nextpaypos.com</a>' +
      '</div>' +
      '<div style="margin-top:11px; white-space:nowrap;">' + pills('lg') + '</div>' +
      '<div style="margin-top:11px; padding-top:9px; border-top:1px solid #ECEFF2; font-size:10.5px; color:#9AA6B2; line-height:1; white-space:nowrap;">' + nextlinkRow() + '</div>' +
    '</td>' +
  '</tr>' +
'</table>';
  }

  function stacked(d) {
    return '' +
'<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif; border-collapse:collapse;">' +
  '<tr>' +
    '<td style="vertical-align:top;">' +
      '<img src="' + A.nextpay + '" width="170" alt="NextPay Business Solutions" style="display:block; width:170px; height:auto; border:0;">' +
      '<div style="width:270px; max-width:100%; height:3px; line-height:3px; font-size:3px; background:#1FC2A6; border-radius:2px; margin:13px 0 13px;">&nbsp;</div>' +
      '<div style="font-size:16px; font-weight:bold; color:#0C1B2A; line-height:1.15;">' + d.name + '</div>' +
      '<div style="font-size:11.5px; font-weight:bold; color:#15B49A; margin-top:2px;">Payment &amp; Rewards Specialist</div>' +
      '<div style="font-size:11px; color:#0C1B2A; margin-top:1px;">NextPay Business Solutions</div>' +
      '<div style="font-size:10px; font-style:italic; color:#9AA6B2; margin-top:5px;">Smarter Solutions. Stronger Businesses.</div>' +
      '<div style="font-size:11px; color:#5A6B7B; margin-top:9px; line-height:1.7;">' +
        '<a href="tel:+1' + d.digits + '" style="color:#5A6B7B; text-decoration:none;">M&nbsp; ' + d.phone + '</a><br>' +
        '<a href="mailto:' + d.email + '" style="color:#5A6B7B; text-decoration:none;">' + d.email + '</a>' +
        '<span style="color:#C4CCD4;">&nbsp;&middot;&nbsp;</span>' +
        '<a href="https://www.nextpaypos.com" style="color:#15B49A; text-decoration:none; font-weight:bold;">www.nextpaypos.com</a>' +
      '</div>' +
      '<div style="margin-top:11px; white-space:nowrap;">' + pills('lg') + '</div>' +
      '<div style="margin-top:11px; padding-top:9px; border-top:1px solid #ECEFF2; font-size:10.5px; color:#9AA6B2; line-height:1; white-space:nowrap;">' + nextlinkRow() + '</div>' +
    '</td>' +
  '</tr>' +
'</table>';
  }

  function banner(d) {
    return '' +
'<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif; border-collapse:collapse; width:440px;">' +
  '<tr>' +
    '<td style="vertical-align:middle; padding:0 0 13px 0;">' +
      '<div style="font-size:16px; font-weight:bold; color:#0C1B2A; line-height:1.15;">' + d.name + '</div>' +
      '<div style="font-size:11.5px; font-weight:bold; color:#15B49A; margin-top:2px;">Payment &amp; Rewards Specialist</div>' +
      '<div style="font-size:11px; color:#5A6B7B; margin-top:1px;">NextPay Business Solutions</div>' +
      '<div style="font-size:10px; font-style:italic; color:#9AA6B2; margin-top:5px;">Smarter Solutions. Stronger Businesses.</div>' +
    '</td>' +
    '<td style="vertical-align:middle; text-align:right; padding:0 0 13px 0;">' +
      '<img src="' + A.nextpay + '" width="145" alt="NextPay Business Solutions" style="display:inline-block; width:145px; height:auto; border:0;">' +
    '</td>' +
  '</tr>' +
  '<tr>' +
    '<td colspan="2" style="padding:0;">' +
      '<table cellpadding="0" cellspacing="0" border="0" style="width:440px; border-collapse:separate; border-radius:8px; overflow:hidden;">' +
        '<tr>' +
          '<td style="background:#0C1B2A; padding:11px 15px; vertical-align:middle;">' +
            '<a href="tel:+1' + d.digits + '" style="color:#C7D2DC; text-decoration:none; font-size:11px;">' + d.phone + '</a>' +
            '<span style="color:#3A4A5A;">&nbsp;&middot;&nbsp;</span>' +
            '<a href="mailto:' + d.email + '" style="color:#C7D2DC; text-decoration:none; font-size:11px;">' + d.email + '</a>' +
            '<span style="color:#3A4A5A;">&nbsp;&middot;&nbsp;</span>' +
            '<a href="https://www.nextpaypos.com" style="color:#2EE0C0; text-decoration:none; font-size:11px; font-weight:bold;">nextpaypos.com</a>' +
          '</td>' +
          '<td style="background:#0C1B2A; padding:8px 12px 8px 0; vertical-align:middle; text-align:right; white-space:nowrap;">' + pills('sm') + '</td>' +
        '</tr>' +
      '</table>' +
    '</td>' +
  '</tr>' +
  '<tr>' +
    '<td colspan="2" style="padding:9px 2px 0; font-size:10.5px; color:#9AA6B2; line-height:1;">' + nextlinkRow() + '</td>' +
  '</tr>' +
'</table>';
  }

  var LAYOUTS = { classic: classic, stacked: stacked, banner: banner };

  // ---- builder wiring -----------------------------------------------------
  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function init() {
    var nameEl = document.getElementById('sig-name');
    var phoneEl = document.getElementById('sig-phone');
    var emailEl = document.getElementById('sig-email');
    var preview = document.getElementById('sig-preview');
    var copyBtn = document.getElementById('sig-copy');
    var copyHtmlBtn = document.getElementById('sig-copy-html');
    var dlBtn = document.getElementById('sig-download');
    var note = document.getElementById('sig-note');
    if (!preview) return; // pane not present

    var layout = 'classic';

    function data() {
      var phone = (phoneEl.value || '').trim() || '585.555.1234';
      return {
        name: escapeHtml((nameEl.value || '').trim() || 'Your Name'),
        phone: escapeHtml(phone),
        digits: phone.replace(/\D/g, ''),
        email: escapeHtml((emailEl.value || '').trim() || 'you@nextpaypos.com')
      };
    }

    // Wrap the signature in a forced-white "card" so it renders identically in
    // light and dark email clients. Without this, dark-mode Gmail drops a dark
    // canvas behind the signature and the navy logo text + navy Quiz button
    // vanish. bgcolor attr + inline background + color-scheme:light keep it white.
    function plate(inner) {
      return '<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse; color-scheme:light only;">' +
        '<tr><td bgcolor="#ffffff" style="background-color:#ffffff; padding:16px 18px; border-radius:12px;">' +
        inner +
        '</td></tr></table>';
    }

    function currentHtml() { return plate(LAYOUTS[layout](data())); }

    function render() { preview.innerHTML = currentHtml(); }

    function flash(msg) {
      if (!note) return;
      note.textContent = msg;
      note.style.opacity = '1';
      clearTimeout(flash._t);
      flash._t = setTimeout(function () { note.style.opacity = '0'; }, 2600);
    }

    // layout chooser
    [].slice.call(document.querySelectorAll('.sig-layout')).forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('.sig-layout').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        layout = b.dataset.layout;
        render();
      });
    });

    [nameEl, phoneEl, emailEl].forEach(function (el) { el.addEventListener('input', render); });

    // Copy the RENDERED signature (rich) so it pastes straight into Gmail.
    function copyRich() {
      var html = currentHtml();
      if (navigator.clipboard && window.ClipboardItem) {
        var item = new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([preview.innerText], { type: 'text/plain' })
        });
        navigator.clipboard.write([item]).then(
          function () { flash('Signature copied — paste it into Gmail.'); },
          function () { selectAndCopy(); }
        );
      } else {
        selectAndCopy();
      }
    }

    // Fallback: select the live preview node and execCommand('copy').
    function selectAndCopy() {
      try {
        var range = document.createRange();
        range.selectNodeContents(preview);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        var ok = document.execCommand('copy');
        sel.removeAllRanges();
        flash(ok ? 'Signature copied — paste it into Gmail.' : 'Press Ctrl/Cmd+C to copy the selected signature.');
      } catch (e) {
        flash('Select the preview and press Ctrl/Cmd+C.');
      }
    }

    function copySource() {
      var html = currentHtml();
      function done() { flash('HTML source copied.'); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(html).then(done, function () { fallbackText(html, done); });
      } else { fallbackText(html, done); }
    }

    function fallbackText(text, cb) {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta); if (cb) cb();
    }

    function download() {
      var d = data();
      var doc = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>NextPay signature</title></head>' +
        '<body style="margin:0; padding:24px; background:#ffffff;">' + currentHtml() + '</body></html>';
      var blob = new Blob([doc], { type: 'text/html' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      var slug = (d.name === 'Your Name' ? 'nextpay' : d.name.replace(/&amp;/g, 'and').replace(/[^a-z0-9]+/gi, '-')).toLowerCase().replace(/(^-|-$)/g, '');
      a.href = url; a.download = 'nextpay-signature-' + slug + '.html';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      flash('Downloaded signature .html');
    }

    if (copyBtn) copyBtn.addEventListener('click', copyRich);
    if (copyHtmlBtn) copyHtmlBtn.addEventListener('click', copySource);
    if (dlBtn) dlBtn.addEventListener('click', download);

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
