// "Suggest a fix" — lets a reader flag a docs error / propose a correction
// straight from the page, and posts it directly to a Discord channel.
// If they selected text before clicking, it is pulled in as "what it says now",
// so it feels like pointing at the mistake right where it is.
//
// NOTE (accepted trade-off): a static site can't keep a secret, so WEBHOOK_URL
// below is public. Anyone can read it from the page source and post to the
// channel. That is fine for an internal, low-stakes feedback channel — if it
// ever gets spammed, regenerate the webhook in Discord and paste the new URL.
(function() {
  'use strict';

  // Paste the (regenerated) Discord webhook here. While it is left as the
  // placeholder, the widget runs in preview mode and posts nothing.
  var WEBHOOK_URL = 'PASTE_DISCORD_WEBHOOK_URL_HERE';
  var LABEL = 'Suggest a fix';   // change this one string to rename the button

  var LOCALES = { zh:1, ja:1, ko:1, pt:1, es:1, fr:1, it:1 };

  function pageTitle() {
    var h1 = document.querySelector('h1');
    return h1 ? h1.textContent.trim() : document.title;
  }

  function pageLang() {
    var parts = window.location.pathname.split('/').filter(Boolean);
    return (parts.length && LOCALES[parts[0]]) ? parts[0] : 'en';
  }

  // Text the reader had highlighted when they opened the form.
  function currentSelection() {
    var sel = window.getSelection ? String(window.getSelection()) : '';
    return sel.trim().slice(0, 1000);
  }

  function isConfigured() {
    return WEBHOOK_URL && WEBHOOK_URL.indexOf('discord.com/api/webhooks/') !== -1;
  }

  // Build the Discord message (embed). Discord limits: title<=256, field value<=1024.
  function discordPayload(page, url, lang, current, suggestion, contact) {
    var fields = [{ name: 'Suggestion', value: suggestion.slice(0, 1024) }];
    if (current)  fields.push({ name: 'What it says now', value: current.slice(0, 1024) });
    fields.push({ name: 'Language', value: lang, inline: true });
    if (contact)  fields.push({ name: 'Contact', value: contact.slice(0, 256), inline: true });
    return {
      username: 'Docs feedback',
      embeds: [{
        title: ('Suggest a fix — ' + page).slice(0, 256),
        url: url,
        color: 0x4aa3ff,
        fields: fields,
        footer: { text: url.slice(0, 2048) }
      }]
    };
  }

  function postToDiscord(payload, done) {
    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function(r) { done(r.ok, r.status); })
      .catch(function() { done(false, 0); });
  }

  // ---- modal ----------------------------------------------------------------

  function openModal() {
    var selected = currentSelection();
    var title = pageTitle();
    var url = window.location.href;
    var lang = pageLang();

    var backdrop = document.createElement('div');
    backdrop.className = 'dz-feedback-backdrop';
    backdrop.innerHTML =
      '<div class="dz-feedback-modal" role="dialog" aria-modal="true" aria-label="' + LABEL + '">' +
        '<button type="button" class="dz-feedback-close" aria-label="Close">&times;</button>' +
        '<h3 class="dz-feedback-title">' + LABEL + '</h3>' +
        '<p class="dz-feedback-context">On: <strong>' + title + '</strong></p>' +
        (selected
          ? '<label class="dz-feedback-lbl">What it says now</label>' +
            '<textarea class="dz-feedback-current" rows="2">' + selected.replace(/</g, '&lt;') + '</textarea>'
          : '') +
        '<label class="dz-feedback-lbl">What is wrong / your suggested fix</label>' +
        '<textarea class="dz-feedback-msg" rows="4" placeholder="e.g. the port here should be 7733, not 7734"></textarea>' +
        '<label class="dz-feedback-lbl">How to reach you (optional)</label>' +
        '<input class="dz-feedback-contact" type="text" placeholder="Discord handle or email" />' +
        '<div class="dz-feedback-actions">' +
          '<button type="button" class="dz-feedback-cancel">Cancel</button>' +
          '<button type="button" class="dz-feedback-send">Send</button>' +
        '</div>' +
        '<div class="dz-feedback-result" hidden></div>' +
      '</div>';

    document.body.appendChild(backdrop);

    var msgEl = backdrop.querySelector('.dz-feedback-msg');
    var currentEl = backdrop.querySelector('.dz-feedback-current');
    var contactEl = backdrop.querySelector('.dz-feedback-contact');
    var resultEl = backdrop.querySelector('.dz-feedback-result');
    var sendBtn = backdrop.querySelector('.dz-feedback-send');
    msgEl.focus();

    function close() { if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    backdrop.addEventListener('click', function(e) { if (e.target === backdrop) close(); });
    backdrop.querySelector('.dz-feedback-close').addEventListener('click', close);
    backdrop.querySelector('.dz-feedback-cancel').addEventListener('click', close);

    function showResult(ok, text) {
      resultEl.hidden = false;
      resultEl.className = 'dz-feedback-result ' + (ok ? 'ok' : 'err');
      resultEl.textContent = text;
    }

    sendBtn.addEventListener('click', function() {
      var suggestion = msgEl.value.trim();
      if (!suggestion) { msgEl.focus(); msgEl.classList.add('dz-feedback-invalid'); return; }
      var current = currentEl ? currentEl.value.trim() : selected;
      var contact = contactEl.value.trim();
      var payload = discordPayload(title, url, lang, current, suggestion, contact);

      if (!isConfigured()) {
        showResult(true, 'Preview (no webhook set). Would POST to Discord:\n' + JSON.stringify(payload, null, 2));
        return;
      }

      sendBtn.disabled = true; sendBtn.textContent = 'Sending...';
      postToDiscord(payload, function(ok, status) {
        if (ok) {
          // Persistent, obvious confirmation — the user closes it themselves.
          showResult(true, '✅ Thanks! Your note was sent to the docs team.');
          sendBtn.style.display = 'none';
          var cancel = backdrop.querySelector('.dz-feedback-cancel');
          if (cancel) cancel.textContent = 'Close';
        } else {
          sendBtn.disabled = false; sendBtn.textContent = 'Send';
          showResult(false, 'Could not send (' + (status || 'network') + '). Please try our Discord directly, or check the webhook URL.');
        }
      });
    });
  }

  // ---- toolbar hook ---------------------------------------------------------

  function trigger() {
    var link = document.createElement('a');
    link.href = '#';
    link.className = 'page-toolbar-link dz-feedback-trigger';
    link.innerHTML =
      '<img src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7\'%3E%3C/path%3E%3Cpath d=\'M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z\'%3E%3C/path%3E%3C/svg%3E" class="page-toolbar-icon" alt="" />' +
      LABEL;
    link.addEventListener('click', function(e) { e.preventDefault(); openModal(); });
    return link;
  }

  function attach() {
    var bar = document.querySelector('.page-toolbar');
    if (bar) {
      var sep = document.createElement('span');
      sep.className = 'page-toolbar-separator';
      sep.textContent = '|';
      bar.appendChild(sep);
      bar.appendChild(trigger());
    } else {
      var footer = document.createElement('footer');
      footer.className = 'page-toolbar-footer';
      var wrap = document.createElement('div');
      wrap.className = 'page-toolbar';
      wrap.appendChild(trigger());
      footer.appendChild(wrap);
      document.body.appendChild(footer);
    }
  }

  // page-toolbar.js builds .page-toolbar on DOMContentLoaded too; run just after.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(attach, 0); });
  } else {
    setTimeout(attach, 0);
  }
})();
