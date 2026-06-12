/* ════ WINTERPLATEAU · MARKETING ════
   Configuração central: WhatsApp, formulário de orçamento e analytics.
   Tudo num só sítio para ser fácil de ligar em produção. */
(function () {
  const CFG = (window.WP_CONFIG = {
    /* TODO: substituir pelo número WhatsApp real (indicativo + número, só dígitos) */
    whatsapp: '351253193667',
    email: 'geral@winterplateau.pt',
    /* opcional: URL de um endpoint (backoffice / Formspree) — se vazio, usa mailto */
    formEndpoint: '',
    /* opcional: ID Google Analytics 4, ex.: 'G-XXXXXXXXXX' — se vazio, não carrega nada */
    gaId: '',
  });

  /* ── Google Analytics 4 (só carrega se houver ID) ── */
  if (CFG.gaId) {
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + CFG.gaId;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', CFG.gaId);
  }

  /* ── botão flutuante WhatsApp ── */
  const css = document.createElement('style');
  css.textContent = [
    '.wa-float{position:fixed;right:22px;bottom:22px;z-index:300;width:54px;height:54px;border-radius:50%;background:#25D366;display:grid;place-items:center;box-shadow:0 6px 22px rgba(0,0,0,.35);transition:transform .18s}',
    '.wa-float:hover{transform:scale(1.08)}',
    '.wa-float svg{width:28px;height:28px;fill:#fff}',
    '@media(max-width:640px){.wa-float{right:14px;bottom:14px;width:50px;height:50px}}',
  ].join('');
  document.head.appendChild(css);
  const wa = document.createElement('a');
  wa.className = 'wa-float';
  wa.href = 'https://wa.me/' + CFG.whatsapp.replace(/\D/g, '');
  wa.target = '_blank';
  wa.rel = 'noopener';
  wa.setAttribute('aria-label', 'WhatsApp');
  wa.innerHTML = '<svg viewBox="0 0 32 32"><path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.6 6L4 29l8.2-1.5c1.2.5 2.5.7 3.8.7 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.2 0-2.4-.2-3.5-.7l-.5-.2-4.9.9.9-4.7-.3-.5c-1-1.7-1.6-3.6-1.6-5.6C6.1 9.5 10.5 5 16 5s9.9 4.5 9.9 10-4.4 9.8-9.9 9.8zm5.4-7.3c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.6l-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.2-.6-.4z"/></svg>';
  document.body.appendChild(wa);

  /* ── formulário de orçamento → email (mailto) ou endpoint ── */
  const form = document.getElementById('quoteForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = (id) => { const el = form.querySelector('#' + id); return el ? el.value : ''; };
      const nome = v('qNome').trim();
      const email = v('qEmail').trim();
      if (!nome || !email) return;
      const tipo = v('qTipo'), tel = v('qTel').trim(), msg = v('qMsg').trim();
      const t = window.t || ((s) => s);
      const subject = t('Pedido de Orçamento') + ' — ' + tipo + ' (' + nome + ')';
      const body = [
        t('Nome') + ': ' + nome,
        'Email: ' + email,
        t('Telefone') + ': ' + (tel || '—'),
        t('Tipo de obra') + ': ' + tipo,
        '',
        msg,
      ].join('\n');
      const ok = () => { const k = form.querySelector('.qok'); if (k) k.hidden = false; };
      const mailto = () => {
        location.href = 'mailto:' + CFG.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        ok();
      };
      if (CFG.formEndpoint) {
        fetch(CFG.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, email, telefone: tel, tipo, mensagem: msg }),
        }).then(ok).catch(mailto);
      } else {
        mailto();
      }
    });
  }
})();
