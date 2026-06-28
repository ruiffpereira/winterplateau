/* ════ WINTERPLATEAU · i18n PT / EN / FR ════
   PT é a língua base (no HTML). EN/FR são dicionários aplicados em runtime
   sobre os nós de texto. O seletor PT/EN/FR da nav fica funcional e a
   escolha persiste em localStorage. Em produção Astro, isto pode migrar
   para rotas estáticas /en /fr com hreflang. */
(function () {
  const DICT = {
    en: {
      /* cookie consent (RGPD) — banner em BaseLayout.astro, PT é a base */
      'Cookies': 'Cookies',
      'Utilizamos cookies essenciais e, com o seu consentimento, cookies para melhorar a experiência. Escolha para continuar.': 'We use essential cookies and, with your consent, cookies to improve your experience. Choose to continue.',
      'Política de privacidade': 'Privacy policy',
      'Aceitar': 'Accept',
      'Rejeitar': 'Reject',
      /* nav + chrome */
      'Perfis Metálicos': 'Metal Profiles',
      'Obras': 'Projects',
      'Empresa': 'Company',
      'Downloads': 'Downloads',
      'Contactos': 'Contacts',
      'Solicitar Orçamento': 'Request a Quote',
      'Início': 'Home',
      /* hero */
      'Vila Verde, Portugal · Desde 2016': 'Vila Verde, Portugal · Since 2016',
      'Soluções em EPS e Perfis Metálicos para construção nova e reabilitação de edifícios. Fabricação nacional, certificação europeia.': 'EPS and metal profile solutions for new construction and building renovation. Made in Portugal, European certification.',
      'Ver Soluções': 'View Solutions',
      'Catálogo PDF': 'PDF Catalogue',
      /* marquee + produtos */
      'Bandas': 'Bands', 'Cornijas': 'Cornices', 'Colunas': 'Columns', 'Peitoris': 'Window Sills',
      'Rodatetos': 'Crown Mouldings', 'Tetos Falsos': 'Suspended Ceilings', 'Divisórias': 'Partitions',
      'Abobadilhas': 'Infill Blocks', 'Capoto': 'ETICS',
      /* stats */
      'Fundação': 'Founded', 'Produtos EPS': 'EPS Products', 'Projetos': 'Projects',
      'Portugal · Espanha · França': 'Portugal · Spain · France',
      'Certificação': 'Certification', 'Declaração de Desempenho': 'Declaration of Performance',
      /* secções produto */
      'Linha de Produto': 'Product Line',
      'Fachadas inovadoras com molduras leves de poliestireno expandido. Fácil aplicação, elevada durabilidade e versatilidade decorativa para qualquer obra.': 'Innovative façades with lightweight expanded-polystyrene mouldings. Easy installation, high durability and decorative versatility for any project.',
      'Molduras interiores que transformam espaços residenciais e comerciais com elegância. Instalação simples, acabamento refinado, sem obras disruptivas.': 'Interior mouldings that elegantly transform residential and commercial spaces. Simple installation, refined finish, no disruptive works.',
      'Bandas decorativas': 'Decorative bands',
      'Cornijas e entablamentos': 'Cornices and entablatures',
      'Colunas e pilastras': 'Columns and pilasters',
      'Peitoris de janela': 'Window sills',
      'Rodatetos e molduras de teto': 'Crown and ceiling mouldings',
      'Molduras de parede e painéis': 'Wall mouldings and panels',
      'Rodapés decorativos': 'Decorative skirting',
      'Perfis de canto e remate': 'Corner and trim profiles',
      'Ver todos os produtos': 'View all products',
      /* statement */
      'Fabricação Nacional · Desde 2016': 'Made in Portugal · Since 2016',
      'Mais de 500 projetos construídos com': 'Over 500 projects built with',
      'rigor e inovação.': 'rigour and innovation.',
      'Certificação CE · Declaração de Desempenho · Exportação para PT, ES e FR': 'CE Certification · Declaration of Performance · Exports to PT, ES & FR',
      /* metal */
      'Ver todos os perfis': 'View all profiles',
      'Complementos': 'Trims', 'Acessórios': 'Accessories',
      'Sistema de suspensão para tetos rebaixados. Maior controlo acústico e térmico.': 'Suspension system for lowered ceilings. Better acoustic and thermal control.',
      'Partições leves e versáteis para escritórios e espaços comerciais.': 'Light, versatile partitions for offices and commercial spaces.',
      'Alhetas, cantoneiras e perfis de acabamento para soluções completas.': 'Shadow gaps, angles and finishing profiles for complete solutions.',
      'Sistema completo de fixação, suspensão e conectividade para qualquer solução.': 'Complete fixing, suspension and connection system for any solution.',
      /* obras */
      'Portefólio · Obras': 'Portfolio · Projects',
      'Projetos que falam por nós': 'Projects that speak for us',
      'Cada obra mostra o antes e o depois — arraste para ver a transformação que as nossas soluções trazem à fachada.': 'Each project shows the before and after — drag to see the transformation our solutions bring to the façade.',
      'Ver todas as obras': 'View all projects',
      'Ver obra': 'View project',
      'Antes': 'Before', 'Depois': 'After',
      'Reabilitação': 'Renovation', 'Construção Nova': 'New Build',
      'obras': 'projects', 'obra': 'project',
      /* about */
      'Quem Somos': 'About Us',
      'Criados para responder a uma': 'Created to answer a',
      'necessidade real': 'real need',
      'da construção moderna.': 'of modern construction.',
      'A Winterplateau foi fundada em Janeiro de 2016 em Vila Verde, Braga, com o propósito de desenvolver e colmatar uma necessidade detectada no mercado da construção civil e reabilitação — produtos inovadores em EPS multifuncionais assentes nas melhores práticas e tecnologias. Uma busca incansável por qualidade que resulta em vantagens competitivas concretas para os nossos clientes.': 'Winterplateau was founded in January 2016 in Vila Verde, Braga, to develop and answer a need identified in the construction and renovation market — innovative, multifunctional EPS products built on best practices and technologies. A relentless pursuit of quality that delivers concrete competitive advantages to our clients.',
      'Decl. de Desempenho': 'Decl. of Performance',
      'Co-financiado UE': 'EU Co-funded',
      /* testemunhos */
      'A confiança de quem construiu': 'Trusted by those who built with us',
      'Testemunhos': 'Testimonials',
      'Espaço reservado para o testemunho real do cliente.': "Reserved space for the client's real testimonial.",
      'Nome do Cliente': 'Client name',
      'Tipo de obra · Localidade': 'Project type · Location',
      'Secção preparada — substitua pelos testemunhos reais dos seus clientes.': "Section ready — replace with your clients' real testimonials.",
      /* downloads */
      'Documentação Técnica': 'Technical Documentation',
      /* cta */
      'Pronto para o': 'Ready for your',
      'próximo projecto?': 'next project?',
      'Peça um orçamento personalizado ou fale com a nossa equipa técnica.': 'Request a tailored quote or talk to our technical team.',
      'Descarregar Catálogo': 'Download Catalogue',
      /* orçamento */
      'Pedido de Orçamento': 'Quote Request',
      'Peça o seu orçamento': 'Request your quote',
      'Envie os detalhes da sua obra — respondemos com uma proposta personalizada em 1–2 dias úteis.': 'Send us your project details — we reply with a tailored proposal within 1–2 working days.',
      'Resposta até 48 horas': 'Reply within 48 hours',
      'Aconselhamento técnico incluído': 'Technical advice included',
      'Sem compromisso': 'No obligation',
      'Nome': 'Name', 'Telefone': 'Phone', 'Tipo de obra': 'Project type', 'Mensagem': 'Message',
      'O seu nome': 'Your name', 'Descreva a sua obra…': 'Describe your project…',
      'Reabilitação de fachada': 'Façade renovation', 'Construção nova': 'New build',
      'EPS interior': 'Interior EPS', 'Perfis metálicos': 'Metal profiles', 'Outro': 'Other',
      'Enviar pedido': 'Send request',
      'Os pedidos seguem diretamente para geral@winterplateau.pt': 'Requests go directly to geral@winterplateau.pt',
      'Obrigado! O seu pedido foi preparado no seu programa de email — basta enviar.': 'Thank you! Your request has been prepared in your email client — just press send.',
      /* contacto */
      'Fale Connosco': 'Get in Touch', 'Morada': 'Address',
      /* footer */
      'Soluções em EPS e Perfis Metálicos para construção e reabilitação. Fabricação nacional, qualidade europeia.': 'EPS and metal profile solutions for construction and renovation. Made in Portugal, European quality.',
      'Soluções': 'Solutions', 'Portefólio': 'Portfolio',
      '© 2026 Winterplateau. Todos os direitos reservados.': '© 2026 Winterplateau. All rights reserved.',
      'Política de Privacidade': 'Privacy Policy', 'Termos e Condições': 'Terms & Conditions',
      /* página Projetos */
      'As nossas': 'Our',
      'Reabilitação de fachadas e construção nova por todo o norte de Portugal. Em cada projeto, arraste a comparação para ver a transformação que as molduras e o isolamento Winterplateau trazem ao edifício.': 'Façade renovation and new construction across northern Portugal. On each project, drag the comparison to see the transformation Winterplateau mouldings and insulation bring to the building.',
      'Todas': 'All',
      'Tem um projeto em mente?': 'Have a project in mind?',
      'Fale com a nossa equipa técnica e descubra a solução certa para a sua obra.': 'Talk to our technical team and find the right solution for your project.',
      /* página de detalhe */
      'O Processo': 'The Process',
      'Durante a obra': 'During the works',
      'Soluções aplicadas': 'Solutions applied',
      'Materiais Winterplateau nesta obra': 'Winterplateau materials in this project',
      'Outras obras': 'Other projects', 'Ver todas': 'View all',
      'Arraste para comparar o antes e o depois': 'Drag to compare before and after',
      'Fotografia da obra': 'Site photograph',
      /* dados das obras */
      'Reabilitação de Fachada': 'Façade Renovation',
      'Moradia Unifamiliar': 'Single-Family House',
      'Edifício Comercial': 'Commercial Building',
      'Bloco de Apartamentos': 'Apartment Block',
      'Restauro de Solar': 'Manor House Restoration',
      'Clínica Privada': 'Private Clinic',
      'Capoto / ETICS': 'ETICS / External Insulation',
      'Molduras de Vão': 'Opening Surrounds', 'Pilastras': 'Pilasters',
      'Cornija': 'Cornice', 'Molduras à medida': 'Custom mouldings',
      'Fachada': 'Façade', 'Duração': 'Duration', 'Eficiência': 'Efficiency',
      'Área': 'Area', 'Molduras': 'Mouldings', 'Intervenção': 'Scope',
      'Habitação': 'Housing', 'Época': 'Era',
      'sem': 'wks', 'vãos': 'openings', 'pisos': 'floors', 'frações': 'units',
      'Recuperação integral da envolvente de um edifício de habitação dos anos 80. Aplicação de sistema ETICS (capoto) com molduras decorativas em EPS — cornijas, bandas e peitoris — devolvendo carácter e eficiência térmica ao imóvel.': 'Full recovery of the envelope of a 1980s residential building. ETICS (external insulation) with decorative EPS mouldings — cornices, bands and sills — restoring character and thermal efficiency to the property.',
      'Construção de raiz de moradia contemporânea. As molduras de vão e a cornija de remate em EPS conferem profundidade à fachada sem o peso e o custo da pedra natural.': 'New-build contemporary house. EPS opening surrounds and top cornice give the façade depth without the weight and cost of natural stone.',
      'Modernização da fachada de um edifício comercial no centro histórico. Bandas horizontais e pilastras verticais em EPS criam um ritmo elegante que valoriza as montras ao nível da rua.': 'Façade modernisation of a commercial building in the historic centre. Horizontal EPS bands and vertical pilasters create an elegant rhythm that enhances the street-level shopfronts.',
      'Empreendimento de habitação coletiva com fachada ventilada e remates em EPS. Solução leve que acelera a obra e garante uniformidade em todos os pisos.': 'Multi-family housing development with ventilated façade and EPS trims. A lightweight solution that speeds up construction and ensures uniformity across all floors.',
      'Recuperação de elementos decorativos de um solar do século XIX. Réplicas das molduras originais executadas em EPS de alta densidade, fiéis ao desenho histórico.': 'Recovery of decorative elements of a 19th-century manor house. Replicas of the original mouldings made in high-density EPS, faithful to the historic design.',
      'Fachada limpa e contemporânea para um edifício de saúde. Linhas horizontais em banda de EPS marcam os pisos e integram a sinalética exterior.': 'A clean, contemporary façade for a healthcare building. Horizontal EPS bands mark the floors and integrate the exterior signage.',
      'Diagnóstico': 'Diagnosis', 'Preparação': 'Preparation', 'Molduras EPS': 'EPS Mouldings', 'Acabamento': 'Finishing',
      'Projeto': 'Design', 'Estrutura': 'Structure', 'Aplicação': 'Installation', 'Pintura': 'Painting',
      'Estudo': 'Study', 'Isolamento': 'Insulation', 'Composição': 'Composition', 'Entrega': 'Handover',
      'Planeamento': 'Planning', 'Levantamento': 'Survey', 'Produção': 'Production', 'Montagem': 'Assembly',
      'Patine': 'Patina', 'Conceito': 'Concept',
      'Levantamento de patologias, fissuras e pontes térmicas da fachada existente.': 'Survey of defects, cracks and thermal bridges on the existing façade.',
      'Limpeza, reparação do reboco e aplicação do sistema de isolamento ETICS.': 'Cleaning, render repair and installation of the ETICS insulation system.',
      'Colagem e fixação das cornijas, bandas e peitoris Winterplateau.': 'Bonding and fixing of Winterplateau cornices, bands and sills.',
      'Barramento armado, primário e revestimento final na cor escolhida.': 'Reinforced base coat, primer and final render in the chosen colour.',
      'Definição do desenho de fachada e seleção dos perfis de moldura.': 'Façade design definition and selection of moulding profiles.',
      'Alvenaria concluída e fachada preparada para receber as molduras.': 'Masonry completed and façade prepared to receive the mouldings.',
      'Montagem das molduras de vão, pilastras e cornija de remate.': 'Installation of opening surrounds, pilasters and top cornice.',
      'Acabamento final e tratamento hidrófugo das superfícies.': 'Final finishing and water-repellent treatment of the surfaces.',
      'Compatibilização com as regras do centro histórico e licenciamento.': 'Compliance with historic-centre rules and permitting.',
      'Aplicação de capoto em toda a envolvente exterior.': 'ETICS applied to the entire external envelope.',
      'Montagem das bandas e pilastras segundo o desenho aprovado.': 'Installation of bands and pilasters following the approved design.',
      'Acabamento, limpeza e entrega da obra ao cliente.': 'Finishing, cleaning and handover to the client.',
      'Faseamento da obra por alçado e logística de estaleiro.': 'Phasing of works by elevation and site logistics.',
      'Sistema ETICS aplicado piso a piso.': 'ETICS system applied floor by floor.',
      'Bandas, cornijas e peitoris montados em série.': 'Bands, cornices and sills installed in series.',
      'Revestimento final e ensaios de desempenho térmico.': 'Final render and thermal performance testing.',
      'Medição e moldagem dos elementos decorativos originais.': 'Measurement and moulding of the original decorative elements.',
      'Corte CNC das réplicas em EPS de alta densidade.': 'CNC cutting of the replicas in high-density EPS.',
      'Aplicação cuidada respeitando a composição histórica.': 'Careful installation respecting the historic composition.',
      'Acabamento texturado a imitar a pedra envelhecida.': 'Textured finish imitating aged stone.',
      'Definição da linguagem de fachada com o gabinete de arquitetura.': 'Façade language defined with the architecture studio.',
      'Capoto contínuo para máximo desempenho térmico.': 'Continuous ETICS for maximum thermal performance.',
      'Montagem das bandas horizontais que ritmam os pisos.': 'Installation of the horizontal bands that rhythm the floors.',
      'Acabamento branco e integração da sinalética.': 'White finish and signage integration.',
    },
    fr: {
      /* cookie consent (RGPD) — banner em BaseLayout.astro, PT é a base */
      'Cookies': 'Cookies',
      'Utilizamos cookies essenciais e, com o seu consentimento, cookies para melhorar a experiência. Escolha para continuar.': 'Nous utilisons des cookies essentiels et, avec votre consentement, des cookies pour améliorer votre expérience. Choisissez pour continuer.',
      'Política de privacidade': 'Politique de confidentialité',
      'Aceitar': 'Accepter',
      'Rejeitar': 'Refuser',
      'Perfis Metálicos': 'Profilés métalliques',
      'Obras': 'Chantiers',
      'Empresa': 'Entreprise',
      'Downloads': 'Téléchargements',
      'Contactos': 'Contacts',
      'Solicitar Orçamento': 'Demander un devis',
      'Início': 'Accueil',
      'Vila Verde, Portugal · Desde 2016': 'Vila Verde, Portugal · Depuis 2016',
      'Soluções em EPS e Perfis Metálicos para construção nova e reabilitação de edifícios. Fabricação nacional, certificação europeia.': 'Solutions en EPS et profilés métalliques pour la construction neuve et la réhabilitation. Fabrication portugaise, certification européenne.',
      'Ver Soluções': 'Voir les solutions',
      'Catálogo PDF': 'Catalogue PDF',
      'Bandas': 'Bandeaux', 'Cornijas': 'Corniches', 'Colunas': 'Colonnes', 'Peitoris': 'Appuis de fenêtre',
      'Rodatetos': 'Corniches intérieures', 'Tetos Falsos': 'Faux plafonds', 'Divisórias': 'Cloisons',
      'Abobadilhas': 'Hourdis', 'Capoto': 'ITE',
      'Fundação': 'Fondation', 'Produtos EPS': 'Produits EPS', 'Projetos': 'Projets',
      'Portugal · Espanha · França': 'Portugal · Espagne · France',
      'Certificação': 'Certification', 'Declaração de Desempenho': 'Déclaration de performance',
      'Linha de Produto': 'Gamme de produits',
      'Fachadas inovadoras com molduras leves de poliestireno expandido. Fácil aplicação, elevada durabilidade e versatilidade decorativa para qualquer obra.': 'Des façades innovantes avec des moulures légères en polystyrène expansé. Pose facile, grande durabilité et polyvalence décorative pour tout chantier.',
      'Molduras interiores que transformam espaços residenciais e comerciais com elegância. Instalação simples, acabamento refinado, sem obras disruptivas.': 'Des moulures intérieures qui transforment avec élégance les espaces résidentiels et commerciaux. Pose simple, finition raffinée, sans travaux lourds.',
      'Bandas decorativas': 'Bandeaux décoratifs',
      'Cornijas e entablamentos': 'Corniches et entablements',
      'Colunas e pilastras': 'Colonnes et pilastres',
      'Peitoris de janela': 'Appuis de fenêtre',
      'Rodatetos e molduras de teto': 'Corniches et moulures de plafond',
      'Molduras de parede e painéis': 'Moulures murales et panneaux',
      'Rodapés decorativos': 'Plinthes décoratives',
      'Perfis de canto e remate': "Profils d'angle et de finition",
      'Ver todos os produtos': 'Voir tous les produits',
      'Fabricação Nacional · Desde 2016': 'Fabrication portugaise · Depuis 2016',
      'Mais de 500 projetos construídos com': 'Plus de 500 chantiers réalisés avec',
      'rigor e inovação.': 'rigueur et innovation.',
      'Certificação CE · Declaração de Desempenho · Exportação para PT, ES e FR': 'Certification CE · Déclaration de performance · Export PT, ES & FR',
      'Ver todos os perfis': 'Voir tous les profilés',
      'Complementos': 'Compléments', 'Acessórios': 'Accessoires',
      'Sistema de suspensão para tetos rebaixados. Maior controlo acústico e térmico.': 'Système de suspension pour plafonds abaissés. Meilleur contrôle acoustique et thermique.',
      'Partições leves e versáteis para escritórios e espaços comerciais.': 'Cloisons légères et polyvalentes pour bureaux et espaces commerciaux.',
      'Alhetas, cantoneiras e perfis de acabamento para soluções completas.': 'Joints creux, cornières et profils de finition pour des solutions complètes.',
      'Sistema completo de fixação, suspensão e conectividade para qualquer solução.': 'Système complet de fixation, suspension et connexion pour toute solution.',
      'Portefólio · Obras': 'Portfolio · Chantiers',
      'Projetos que falam por nós': 'Des chantiers qui parlent pour nous',
      'Cada obra mostra o antes e o depois — arraste para ver a transformação que as nossas soluções trazem à fachada.': "Chaque chantier montre l'avant et l'après — faites glisser pour voir la transformation que nos solutions apportent à la façade.",
      'Ver todas as obras': 'Voir tous les chantiers',
      'Ver obra': 'Voir le chantier',
      'Antes': 'Avant', 'Depois': 'Après',
      'Reabilitação': 'Réhabilitation', 'Construção Nova': 'Construction neuve',
      'obras': 'chantiers', 'obra': 'chantier',
      'Quem Somos': 'Qui sommes-nous',
      'Criados para responder a uma': 'Créés pour répondre à un',
      'necessidade real': 'besoin réel',
      'da construção moderna.': 'de la construction moderne.',
      'A Winterplateau foi fundada em Janeiro de 2016 em Vila Verde, Braga, com o propósito de desenvolver e colmatar uma necessidade detectada no mercado da construção civil e reabilitação — produtos inovadores em EPS multifuncionais assentes nas melhores práticas e tecnologias. Uma busca incansável por qualidade que resulta em vantagens competitivas concretas para os nossos clientes.': "Winterplateau a été fondée en janvier 2016 à Vila Verde, Braga, pour développer et répondre à un besoin identifié sur le marché de la construction et de la réhabilitation — des produits EPS innovants et multifonctionnels fondés sur les meilleures pratiques et technologies. Une recherche incessante de qualité qui se traduit par des avantages compétitifs concrets pour nos clients.",
      'Decl. de Desempenho': 'Décl. de performance',
      'Co-financiado UE': 'Cofinancé UE',
      'A confiança de quem construiu': 'La confiance de ceux qui ont construit',
      'Testemunhos': 'Témoignages',
      'Espaço reservado para o testemunho real do cliente.': 'Espace réservé au témoignage réel du client.',
      'Nome do Cliente': 'Nom du client',
      'Tipo de obra · Localidade': 'Type de chantier · Localité',
      'Secção preparada — substitua pelos testemunhos reais dos seus clientes.': 'Section prête — remplacez par les témoignages réels de vos clients.',
      'Documentação Técnica': 'Documentation technique',
      'Pronto para o': 'Prêt pour votre',
      'próximo projecto?': 'prochain chantier ?',
      'Peça um orçamento personalizado ou fale com a nossa equipa técnica.': 'Demandez un devis personnalisé ou parlez à notre équipe technique.',
      'Descarregar Catálogo': 'Télécharger le catalogue',
      'Pedido de Orçamento': 'Demande de devis',
      'Peça o seu orçamento': 'Demandez votre devis',
      'Envie os detalhes da sua obra — respondemos com uma proposta personalizada em 1–2 dias úteis.': 'Envoyez-nous les détails de votre chantier — nous répondons avec une proposition personnalisée sous 1 à 2 jours ouvrés.',
      'Resposta até 48 horas': 'Réponse sous 48 heures',
      'Aconselhamento técnico incluído': 'Conseil technique inclus',
      'Sem compromisso': 'Sans engagement',
      'Nome': 'Nom', 'Telefone': 'Téléphone', 'Tipo de obra': 'Type de chantier', 'Mensagem': 'Message',
      'O seu nome': 'Votre nom', 'Descreva a sua obra…': 'Décrivez votre chantier…',
      'Reabilitação de fachada': 'Réhabilitation de façade', 'Construção nova': 'Construction neuve',
      'EPS interior': 'EPS intérieur', 'Perfis metálicos': 'Profilés métalliques', 'Outro': 'Autre',
      'Enviar pedido': 'Envoyer la demande',
      'Os pedidos seguem diretamente para geral@winterplateau.pt': 'Les demandes sont envoyées directement à geral@winterplateau.pt',
      'Obrigado! O seu pedido foi preparado no seu programa de email — basta enviar.': "Merci ! Votre demande a été préparée dans votre logiciel de messagerie — il ne reste qu'à l'envoyer.",
      'Fale Connosco': 'Contactez-nous', 'Morada': 'Adresse',
      'Soluções em EPS e Perfis Metálicos para construção e reabilitação. Fabricação nacional, qualidade europeia.': 'Solutions en EPS et profilés métalliques pour la construction et la réhabilitation. Fabrication portugaise, qualité européenne.',
      'Soluções': 'Solutions', 'Portefólio': 'Portfolio',
      '© 2026 Winterplateau. Todos os direitos reservados.': '© 2026 Winterplateau. Tous droits réservés.',
      'Política de Privacidade': 'Politique de confidentialité', 'Termos e Condições': 'Conditions générales',
      'As nossas': 'Nos',
      'Reabilitação de fachadas e construção nova por todo o norte de Portugal. Em cada projeto, arraste a comparação para ver a transformação que as molduras e o isolamento Winterplateau trazem ao edifício.': 'Réhabilitation de façades et construction neuve dans tout le nord du Portugal. Sur chaque chantier, faites glisser la comparaison pour voir la transformation apportée par les moulures et l\'isolation Winterplateau.',
      'Todas': 'Tous',
      'Tem um projeto em mente?': 'Un projet en tête ?',
      'Fale com a nossa equipa técnica e descubra a solução certa para a sua obra.': 'Parlez à notre équipe technique et trouvez la solution adaptée à votre chantier.',
      'O Processo': 'Le processus',
      'Durante a obra': 'Pendant les travaux',
      'Soluções aplicadas': 'Solutions appliquées',
      'Materiais Winterplateau nesta obra': 'Matériaux Winterplateau sur ce chantier',
      'Outras obras': 'Autres chantiers', 'Ver todas': 'Voir tout',
      'Arraste para comparar o antes e o depois': "Glissez pour comparer l'avant et l'après",
      'Fotografia da obra': 'Photo du chantier',
      'Reabilitação de Fachada': 'Réhabilitation de façade',
      'Moradia Unifamiliar': 'Maison individuelle',
      'Edifício Comercial': 'Immeuble commercial',
      'Bloco de Apartamentos': 'Immeuble résidentiel',
      'Restauro de Solar': "Restauration d'un manoir",
      'Clínica Privada': 'Clinique privée',
      'Capoto / ETICS': 'ITE (Capoto)',
      'Molduras de Vão': 'Encadrements de baies', 'Pilastras': 'Pilastres',
      'Cornija': 'Corniche', 'Molduras à medida': 'Moulures sur mesure',
      'Fachada': 'Façade', 'Duração': 'Durée', 'Eficiência': 'Efficacité',
      'Área': 'Surface', 'Molduras': 'Moulures', 'Intervenção': 'Intervention',
      'Habitação': 'Logements', 'Época': 'Époque',
      'sem': 'sem.', 'vãos': 'baies', 'pisos': 'étages', 'frações': 'logements',
      'Recuperação integral da envolvente de um edifício de habitação dos anos 80. Aplicação de sistema ETICS (capoto) com molduras decorativas em EPS — cornijas, bandas e peitoris — devolvendo carácter e eficiência térmica ao imóvel.': "Récupération intégrale de l'enveloppe d'un immeuble d'habitation des années 80. Système ITE avec moulures décoratives en EPS — corniches, bandeaux et appuis — redonnant caractère et efficacité thermique au bâtiment.",
      'Construção de raiz de moradia contemporânea. As molduras de vão e a cornija de remate em EPS conferem profundidade à fachada sem o peso e o custo da pedra natural.': "Construction neuve d'une maison contemporaine. Les encadrements et la corniche en EPS donnent de la profondeur à la façade sans le poids ni le coût de la pierre naturelle.",
      'Modernização da fachada de um edifício comercial no centro histórico. Bandas horizontais e pilastras verticais em EPS criam um ritmo elegante que valoriza as montras ao nível da rua.': "Modernisation de la façade d'un immeuble commercial du centre historique. Bandeaux horizontaux et pilastres en EPS créent un rythme élégant qui met en valeur les vitrines.",
      'Empreendimento de habitação coletiva com fachada ventilada e remates em EPS. Solução leve que acelera a obra e garante uniformidade em todos os pisos.': "Programme de logements collectifs avec façade ventilée et finitions en EPS. Une solution légère qui accélère le chantier et garantit l'uniformité à tous les étages.",
      'Recuperação de elementos decorativos de um solar do século XIX. Réplicas das molduras originais executadas em EPS de alta densidade, fiéis ao desenho histórico.': "Restauration des éléments décoratifs d'un manoir du XIXe siècle. Répliques des moulures d'origine en EPS haute densité, fidèles au dessin historique.",
      'Fachada limpa e contemporânea para um edifício de saúde. Linhas horizontais em banda de EPS marcam os pisos e integram a sinalética exterior.': 'Façade épurée et contemporaine pour un bâtiment de santé. Des bandeaux horizontaux en EPS marquent les étages et intègrent la signalétique extérieure.',
      'Diagnóstico': 'Diagnostic', 'Preparação': 'Préparation', 'Molduras EPS': 'Moulures EPS', 'Acabamento': 'Finitions',
      'Projeto': 'Conception', 'Estrutura': 'Structure', 'Aplicação': 'Pose', 'Pintura': 'Peinture',
      'Estudo': 'Étude', 'Isolamento': 'Isolation', 'Composição': 'Composition', 'Entrega': 'Livraison',
      'Planeamento': 'Planification', 'Levantamento': 'Relevé', 'Produção': 'Production', 'Montagem': 'Montage',
      'Patine': 'Patine', 'Conceito': 'Concept',
      'Levantamento de patologias, fissuras e pontes térmicas da fachada existente.': 'Relevé des pathologies, fissures et ponts thermiques de la façade existante.',
      'Limpeza, reparação do reboco e aplicação do sistema de isolamento ETICS.': "Nettoyage, réparation de l'enduit et pose du système d'isolation ITE.",
      'Colagem e fixação das cornijas, bandas e peitoris Winterplateau.': 'Collage et fixation des corniches, bandeaux et appuis Winterplateau.',
      'Barramento armado, primário e revestimento final na cor escolhida.': 'Sous-enduit armé, primaire et revêtement final dans la couleur choisie.',
      'Definição do desenho de fachada e seleção dos perfis de moldura.': 'Définition du dessin de façade et sélection des profils de moulures.',
      'Alvenaria concluída e fachada preparada para receber as molduras.': 'Maçonnerie achevée et façade préparée pour recevoir les moulures.',
      'Montagem das molduras de vão, pilastras e cornija de remate.': 'Pose des encadrements, pilastres et corniche de couronnement.',
      'Acabamento final e tratamento hidrófugo das superfícies.': 'Finitions et traitement hydrofuge des surfaces.',
      'Compatibilização com as regras do centro histórico e licenciamento.': 'Mise en conformité avec les règles du centre historique et permis.',
      'Aplicação de capoto em toda a envolvente exterior.': "ITE appliquée sur toute l'enveloppe extérieure.",
      'Montagem das bandas e pilastras segundo o desenho aprovado.': 'Pose des bandeaux et pilastres selon le dessin approuvé.',
      'Acabamento, limpeza e entrega da obra ao cliente.': 'Finitions, nettoyage et livraison au client.',
      'Faseamento da obra por alçado e logística de estaleiro.': 'Phasage des travaux par façade et logistique de chantier.',
      'Sistema ETICS aplicado piso a piso.': 'Système ITE appliqué étage par étage.',
      'Bandas, cornijas e peitoris montados em série.': 'Bandeaux, corniches et appuis posés en série.',
      'Revestimento final e ensaios de desempenho térmico.': 'Revêtement final et essais de performance thermique.',
      'Medição e moldagem dos elementos decorativos originais.': "Relevé et moulage des éléments décoratifs d'origine.",
      'Corte CNC das réplicas em EPS de alta densidade.': 'Découpe CNC des répliques en EPS haute densité.',
      'Aplicação cuidada respeitando a composição histórica.': 'Pose soignée dans le respect de la composition historique.',
      'Acabamento texturado a imitar a pedra envelhecida.': 'Finition texturée imitant la pierre vieillie.',
      'Definição da linguagem de fachada com o gabinete de arquitetura.': "Langage de façade défini avec le cabinet d'architecture.",
      'Capoto contínuo para máximo desempenho térmico.': 'ITE continue pour une performance thermique maximale.',
      'Montagem das bandas horizontais que ritmam os pisos.': 'Pose des bandeaux horizontaux qui rythment les étages.',
      'Acabamento branco e integração da sinalética.': 'Finition blanche et intégration de la signalétique.',
    },
  };

  let LANG = localStorage.getItem('wp-lang') || 'pt';
  window.WP_LANG = LANG;
  window.t = (s) => (LANG === 'pt' ? s : (DICT[LANG] && DICT[LANG][s]) || s);

  function walk(lang) {
    const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        const p = n.parentElement;
        if (!p || p.closest('script,style')) return NodeFilter.FILTER_REJECT;
        return n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });
    let n;
    while ((n = tw.nextNode())) {
      if (n.__pt === undefined) n.__pt = n.nodeValue;
      const key = n.__pt.trim();
      if (lang === 'pt') { n.nodeValue = n.__pt; continue; }
      const tr = DICT[lang][key];
      n.nodeValue = tr ? n.__pt.replace(key, tr) : n.__pt;
    }
    document.querySelectorAll('[placeholder]').forEach((el) => {
      if (el.__pt === undefined) el.__pt = el.getAttribute('placeholder');
      el.setAttribute('placeholder', lang === 'pt' ? el.__pt : (DICT[lang][el.__pt] || el.__pt));
    });
  }

  window.applyI18n = function (lang) {
    lang = lang || LANG;
    if (!DICT[lang] && lang !== 'pt') lang = 'pt';
    LANG = lang;
    window.WP_LANG = lang;
    localStorage.setItem('wp-lang', lang);
    document.documentElement.lang = lang === 'pt' ? 'pt-PT' : lang;
    walk(lang);
    document.querySelectorAll('.nlang span, .mlang span').forEach((s) =>
      s.classList.toggle('on', s.textContent.trim().toLowerCase() === lang));
  };

  document.addEventListener('click', (e) => {
    const s = e.target.closest('.nlang span, .mlang span');
    if (!s) return;
    window.applyI18n(s.textContent.trim().toLowerCase());
  });

  window.applyI18n(LANG);
})();
