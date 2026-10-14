/**
 * Formulário de pedido → POST /websites/leads {name, email, phone?, message, source?}.
 * Só um 201 conta como sucesso; 400 é dados inválidos; qualquer outra resposta, falha de rede ou tempo esgotado
 * mostra o erro e mantém o que a pessoa escreveu. Por instância: cada <form class="c-formulario"> tem o seu estado.
 * Os textos vêm do próprio formulário (data-*), já na língua da página.
 */
const TIMEOUT_MS = 15_000;

export function initFormularios(): void {
  document.querySelectorAll<HTMLFormElement>('form.c-formulario').forEach(bind);
}

function bind(form: HTMLFormElement): void {
  const msg = form.querySelector<HTMLElement>('.msg');
  const send = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!msg || !send) return;
  const d = form.dataset;
  const say = (state: '' | 'ok' | 'err' | 'busy', text = '') => {
    msg.dataset.state = state;
    msg.textContent = text;
  };
  const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
  let busy = false;

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (busy) return;

    const inputs = Array.from(form.elements).filter((el): el is HTMLInputElement => el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement);
    let first: HTMLInputElement | null = null;
    for (const el of inputs) {
      if (el.value !== el.value.trim() && el.type !== 'password') el.value = el.value.trim();
      const bad = !el.checkValidity();
      el.setAttribute('aria-invalid', String(bad));
      if (bad && !first) first = el;
    }
    if (first) {
      say('err', d.invalid);
      first.focus();
      return;
    }
    if (!d.endpoint) return say('err', d.off);

    const phone = field('phone')?.value ?? '';
    const type = field('type')?.value ?? '';
    const body = {
      name: field('name')?.value ?? '',
      email: field('email')?.value ?? '',
      ...(phone ? { phone } : {}),
      message: field('message')?.value ?? '',
      source: [type, d.page].filter(Boolean).join(' · ').slice(0, 120),
    };

    busy = true;
    send.disabled = true;
    say('busy', d.sending);
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(d.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Site-Token': d.token ?? '' },
        body: JSON.stringify(body),
        signal: ctl.signal,
      });
      if (res.status === 201) {
        const answer = await res.json().catch(() => ({ ok: true }));
        if (answer?.ok === false) throw new Error('resposta sem ok');
        form.reset();
        inputs.forEach((el) => el.removeAttribute('aria-invalid'));
        say('ok', d.ok);
      } else {
        say('err', res.status === 400 ? d.invalid : d.server);
      }
    } catch (e) {
      // TypeError = o fetch nem chegou ao servidor; o resto (tempo esgotado, resposta estranha) é falha do servidor
      say('err', e instanceof TypeError ? d.network : d.server);
    } finally {
      clearTimeout(timer);
      busy = false;
      send.disabled = false;
    }
  });
}
