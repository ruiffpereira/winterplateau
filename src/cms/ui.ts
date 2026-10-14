/**
 * Texto do próprio kit (não vem do CMS): botões, rótulos e mensagens do formulário, nomes acessíveis.
 * Por língua do site; uma língua sem tradução cai no inglês.
 */
export interface Ui {
  skip: string;
  menu: string;
  lang: string;
  sections: string;
  top: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  message: string;
  send: string;
  sending: string;
  ok: string;
  invalid: string;
  server: string;
  network: string;
  off: string;
  callouts: [string, string, string, string];
}

const UI: Record<string, Ui> = {
  pt: {
    skip: 'Saltar para o conteúdo', menu: 'Menu', lang: 'Idioma', sections: 'Secções da página', top: 'Topo',
    name: 'Nome', email: 'Email', phone: 'Telefone', type: 'Tipo de obra', message: 'Mensagem', send: 'Enviar pedido', sending: 'A enviar…',
    ok: 'Obrigado! Recebemos o seu pedido e respondemos em breve.',
    invalid: 'Verifique os dados: nome, email válido e mensagem são obrigatórios.',
    server: 'Não foi possível enviar o pedido agora. Tente novamente dentro de instantes.',
    network: 'Sem ligação. Verifique a internet e tente novamente.',
    off: 'O formulário está indisponível neste momento.',
    callouts: ['CORNIJA', 'PILASTRA', 'PEITORIL', 'BANDA'],
  },
  en: {
    skip: 'Skip to content', menu: 'Menu', lang: 'Language', sections: 'Page sections', top: 'Top',
    name: 'Name', email: 'Email', phone: 'Phone', type: 'Type of work', message: 'Message', send: 'Send request', sending: 'Sending…',
    ok: 'Thank you! We received your request and will reply shortly.',
    invalid: 'Please check your details: name, a valid email and a message are required.',
    server: 'We could not send your request right now. Please try again in a moment.',
    network: 'No connection. Check your internet and try again.',
    off: 'The form is unavailable right now.',
    callouts: ['CORNICE', 'PILASTER', 'SILL', 'BAND'],
  },
  fr: {
    skip: 'Aller au contenu', menu: 'Menu', lang: 'Langue', sections: 'Sections de la page', top: 'Haut',
    name: 'Nom', email: 'Email', phone: 'Téléphone', type: 'Type de travaux', message: 'Message', send: 'Envoyer la demande', sending: 'Envoi…',
    ok: 'Merci ! Nous avons reçu votre demande et répondrons rapidement.',
    invalid: 'Vérifiez vos données : nom, email valide et message sont obligatoires.',
    server: "Impossible d'envoyer la demande pour le moment. Réessayez dans un instant.",
    network: 'Pas de connexion. Vérifiez votre internet et réessayez.',
    off: "Le formulaire est indisponible pour le moment.",
    callouts: ['CORNICHE', 'PILASTRE', 'APPUI', 'BANDE'],
  },
};

export const ui = (locale: string): Ui => UI[locale] ?? UI.en;
