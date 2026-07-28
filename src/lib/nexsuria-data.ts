export type Solution = {
  slug: string;
  title: string;
  tagline: string;
  icon: string;
  problem: string;
  impacts: string[];
  delivers: string;
  capabilities: string[];
  specialist: { name: string; description: string; capabilities: string[] };
  benefits: string[];
  indicators: { label: string; value: string }[];
};

export const solutions: Solution[] = [
  {
    slug: "gestao-sistemica-erp",
    title: "Gestão Sistêmica e ERP",
    tagline: "Transforme seu ERP em plataforma estratégica de gestão",
    icon: "Database",
    problem:
      "Sua empresa investiu em ERP, mas continua convivendo com retrabalho, baixa produtividade, falta de indicadores confiáveis e processos desconectados. Muitas organizações utilizam apenas uma pequena parte do potencial de seus sistemas de gestão — pagando por uma Ferrari e usando como bicicleta.",
    impacts: ["Retrabalho operacional", "Indicadores não confiáveis", "Processos desconectados", "Baixa produtividade"],
    delivers:
      "Transformar o ERP em uma plataforma estratégica de gestão — com mais produtividade, mais governança, mais controle e melhor tomada de decisão.",
    capabilities: [
      "Business Blueprint (AS-IS / TO-BE)",
      "Implantação e evolução do ERP",
      "AMS — Application Management Services",
      "Sustentação especializada 24x7",
      "Auditoria e inventário TOTVS",
      "Governança Operacional",
      "Integrações e APIs TOTVS",
      "Fábrica de Software",
      "RPA e Automação de processos",
    ],
    specialist: {
      name: "Logithink",
      description:
        "Com mais de 20 anos de atuação e milhares de projetos em todo o Brasil, a Logithink combina tecnologia, gestão e processos. Parceiro exclusivo do Ecossistema Nexsuria para TOTVS Protheus e RM.",
      capabilities: ["AMS 24x7 com SLA garantido", "Business Blueprint completo", "Integrações e APIs TOTVS", "Fábrica de Software dedicada", "RPA e Automação", "Evolução contínua de processos"],
    },
    benefits: ["Governança operacional", "Redução de retrabalho", "Decisão orientada a dados", "SLA garantido"],
    indicators: [
      { label: "Redução de retrabalho", value: "-35%" },
      { label: "Disponibilidade AMS", value: "99,9%" },
      { label: "Time-to-decision", value: "-60%" },
    ],
  },
  {
    slug: "gestao-ativos-manutencao",
    title: "Gestão de Ativos e Manutenção",
    tagline: "Controle total de ativos e manutenção preventiva",
    icon: "Wrench",
    problem:
      "Ativos sem controle, manutenções corretivas frequentes e alto custo operacional por falta de rastreabilidade. A empresa não sabe o que tem, onde está e quando precisa de manutenção.",
    impacts: ["Paradas não planejadas", "Alto custo corretivo", "Sem rastreabilidade", "OEE baixo"],
    delivers:
      "Controle total de ativos, manutenção preventiva estruturada e redução de custos operacionais — com rastreabilidade completa e indicadores de performance dos ativos.",
    capabilities: [
      "Inventário e cadastro de ativos",
      "Gestão de manutenção preventiva e corretiva",
      "Ordens de serviço digitais",
      "Rastreabilidade de ativos",
      "Integração com ERP TOTVS",
      "Indicadores de OEE e disponibilidade",
      "Gestão de peças e estoque de manutenção",
      "App mobile para técnicos de campo",
    ],
    specialist: {
      name: "Logithink",
      description:
        "Com expertise em TOTVS Protheus e RM, a Logithink implementa os módulos de gestão de ativos e manutenção integrados ao ERP, garantindo rastreabilidade completa.",
      capabilities: ["Módulo de Ativos TOTVS", "Gestão de Manutenção", "Ordens de Serviço", "Rastreabilidade completa", "Integração ERP", "Indicadores de performance"],
    },
    benefits: ["Redução de paradas", "Menor custo de manutenção", "Vida útil estendida", "Rastreabilidade total"],
    indicators: [
      { label: "OEE médio", value: "+22%" },
      { label: "MTBF", value: "+40%" },
      { label: "Custo corretivo", value: "-30%" },
    ],
  },
  {
    slug: "pessoas-rh-compliance",
    title: "Pessoas, RH e Compliance",
    tagline: "RH seguro, organizado e aderente à legislação",
    icon: "Users",
    problem:
      "Mudanças constantes na legislação, eSocial, folha e exigências trabalhistas aumentam riscos. Pequenos erros operacionais podem gerar passivos trabalhistas significativos.",
    impacts: ["Passivos trabalhistas", "Erros de folha", "Não conformidade eSocial", "Multas e autuações"],
    delivers:
      "Um RH mais seguro, organizado e aderente à legislação — com menos riscos trabalhistas, mais conformidade e maior confiabilidade da folha.",
    capabilities: [
      "RH Protheus — implantação e evolução",
      "AMS RH — suporte especializado",
      "BPO de Folha e Ponto completo",
      "eSocial — conformidade total",
      "Compliance Trabalhista",
      "Auditoria de Folha",
      "Treinamentos especializados",
      "Medicina e Segurança do Trabalho",
      "Smart Check — validação legal contínua",
    ],
    specialist: {
      name: "Nokware",
      description:
        "Maior especialista em RH Protheus no Brasil. +150 clientes, +70.000h de projetos, +10.000 colaboradores processados/mês e +R$20M em tributos recuperados.",
      capabilities: ["BPO de Folha e Ponto completo", "AMS RH Especializado", "Nokware Smart Check", "Treinamentos Protheus RH", "Auditoria trabalhista", "Medicina e SST"],
    },
    benefits: ["Compliance total", "Redução de passivos", "Folha confiável", "Governança trabalhista"],
    indicators: [
      { label: "Passivos evitados", value: "-70%" },
      { label: "Conformidade eSocial", value: "100%" },
      { label: "Tributos recuperados", value: "+R$20M" },
    ],
  },
  {
    slug: "saude-seguranca-trabalho",
    title: "Saúde e Segurança do Trabalho",
    tagline: "SST em conformidade e colaboradores protegidos",
    icon: "ShieldCheck",
    problem:
      "Compliance de SST complexo, laudos desatualizados e risco de autuações por falta de controle. A gestão descentralizada expõe a empresa a passivos.",
    impacts: ["Laudos desatualizados", "Autuações NR", "Acidentes evitáveis", "Falhas no eSocial SST"],
    delivers:
      "SST em conformidade total, colaboradores protegidos e empresa blindada contra passivos — com processos estruturados, laudos atualizados e integração com o eSocial.",
    capabilities: [
      "PCMSO — Programa de Controle Médico",
      "PPRA / PGR — Programa de Gerenciamento de Riscos",
      "Laudos técnicos (NR-15, NR-17)",
      "Gestão de EPIs",
      "Treinamentos NR obrigatórios",
      "Integração com eSocial",
      "Gestão de acidentes e incidentes",
      "Auditoria de conformidade SST",
    ],
    specialist: {
      name: "Nokware",
      description:
        "Serviços completos de Medicina e Segurança do Trabalho, integrando a gestão de SST com o RH TOTVS Protheus.",
      capabilities: ["PCMSO e PPRA/PGR", "Laudos técnicos NR", "Gestão de EPIs", "Treinamentos NR", "Integração eSocial", "Auditoria SST"],
    },
    benefits: ["Colaboradores protegidos", "Conformidade legal", "Redução de sinistralidade", "Governança SST"],
    indicators: [
      { label: "Conformidade NR", value: "100%" },
      { label: "Sinistralidade", value: "-45%" },
      { label: "Laudos em dia", value: "100%" },
    ],
  },
  {
    slug: "fiscal-contabil-reforma",
    title: "Fiscal, Contábil e Reforma Tributária",
    tagline: "Prepare sua empresa para o novo cenário tributário",
    icon: "Landmark",
    problem:
      "Alta complexidade tributária brasileira, mudanças constantes e a chegada da Reforma Tributária colocam empresas em risco de erros fiscais e perda de competitividade.",
    impacts: ["Risco fiscal elevado", "Perda de créditos", "Multas e autuações", "Falta de preparo para IBS/CBS"],
    delivers:
      "BPO fiscal e contábil de ponta, com preparação estratégica para a Reforma Tributária — reduzindo riscos, capturando créditos e liberando o time interno para foco em negócio.",
    capabilities: [
      "BPO Contábil e Fiscal",
      "Planejamento tributário",
      "Reforma Tributária — assessment e roadmap",
      "Recuperação de créditos tributários",
      "SPED Fiscal e Contribuições",
      "Bloco K e obrigações acessórias",
      "Auditoria fiscal contínua",
      "Consultoria em IBS / CBS",
    ],
    specialist: {
      name: "AFIN Assessoria",
      description:
        "Assessoria fiscal e contábil especializada em compliance tributário e preparação para a Reforma Tributária brasileira.",
      capabilities: ["BPO Contábil", "BPO Fiscal", "Reforma Tributária", "Recuperação de créditos", "SPED", "Consultoria IBS/CBS"],
    },
    benefits: ["Redução de risco fiscal", "Créditos recuperados", "Preparação IBS/CBS", "Governança tributária"],
    indicators: [
      { label: "Créditos recuperados", value: "+R$M" },
      { label: "Risco fiscal", value: "-60%" },
      { label: "Prazo obrigações", value: "100%" },
    ],
  },
  {
    slug: "processos-automacao-fluig",
    title: "Processos, Automação e Fluig",
    tagline: "Transforme processos manuais em fluxos digitais eficientes",
    icon: "Workflow",
    problem:
      "Processos manuais, planilhas paralelas e falta de padronização geram retrabalho, gargalos e perda de visibilidade sobre o que acontece na operação.",
    impacts: ["Processos manuais", "Retrabalho", "Gargalos ocultos", "Baixa governança"],
    delivers:
      "Processos digitais, padronizados e auditáveis com Fluig, BPM e RPA — dando velocidade à operação e visibilidade completa aos gestores.",
    capabilities: [
      "Fluig — implantação e customização",
      "BPM — modelagem e automação",
      "ECM — Gestão de documentos",
      "Portais e workflows corporativos",
      "Integrações via APIs",
      "RPA e automação de processos",
      "Assinatura eletrônica",
      "Aplicações web e mobile sob medida",
    ],
    specialist: {
      name: "Deverest",
      description:
        "14+ anos de experiência em desenvolvimento sob medida. Especializada em Fluig TOTVS, BPM, ECM e desenvolvimento de aplicações web e mobile.",
      capabilities: ["Fluig TOTVS", "BPM/ECM", "Portais corporativos", "Integrações", "Apps sob medida", "RPA"],
    },
    benefits: ["Processos padronizados", "Ganho de produtividade", "Auditoria facilitada", "Time-to-market menor"],
    indicators: [
      { label: "Produtividade", value: "+40%" },
      { label: "Ciclo de processo", value: "-55%" },
      { label: "Adesão", value: "95%" },
    ],
  },
  {
    slug: "cloud-governanca-digital",
    title: "Cloud e Governança Digital",
    tagline: "Infraestrutura moderna, segura e escalável",
    icon: "Cloud",
    problem:
      "Ambientes on-premise caros, indisponibilidade, backups inconsistentes e falta de plano de continuidade colocam operações críticas em risco.",
    impacts: ["Indisponibilidade", "Backup frágil", "Custos ocultos", "Falta de DR"],
    delivers:
      "Ambiente cloud gerenciado com governança digital ponta a ponta — segurança, resiliência, custos previsíveis e escalabilidade sob demanda.",
    capabilities: [
      "Cloud gerenciado (TOTVS Cloud, AWS, Azure)",
      "Backup e Disaster Recovery",
      "Monitoração 24x7",
      "Segurança da informação",
      "LGPD — adequação e governança",
      "FinOps — governança de custos",
      "Migração de workloads",
      "SRE / Observabilidade",
    ],
    specialist: {
      name: "Skyone",
      description:
        "Tecnologia descomplicada. Plataforma de Cloud e Data com governança, segurança e escalabilidade para operações críticas.",
      capabilities: ["Cloud gerenciado", "Backup/DR", "Monitoração 24x7", "Segurança", "LGPD", "FinOps"],
    },
    benefits: ["Alta disponibilidade", "Custos previsíveis", "Segurança elevada", "Escalabilidade"],
    indicators: [
      { label: "Uptime", value: "99,95%" },
      { label: "RPO", value: "≤ 15min" },
      { label: "Custos cloud", value: "-25%" },
    ],
  },
  {
    slug: "produtividade-comercial-sfa",
    title: "Produtividade Comercial e SFA",
    tagline: "Time comercial mais produtivo e orientado a dados",
    icon: "TrendingUp",
    problem:
      "Equipes comerciais desorganizadas, sem pipeline claro, sem visibilidade de metas e com processos manuais que consomem o tempo do vendedor.",
    impacts: ["Pipeline invisível", "Baixa conversão", "Ciclo de venda longo", "Forecast impreciso"],
    delivers:
      "CRM e SFA implantados com metodologia, transformando o comercial em uma máquina orientada a dados, previsível e escalável.",
    capabilities: [
      "CRM — Customer Relationship Management",
      "SFA — Sales Force Automation",
      "Gestão de Pipeline",
      "Roteirização e força de vendas",
      "Painéis de metas e forecast",
      "Integração com ERP",
      "Automação de propostas",
      "App mobile para vendedores",
    ],
    specialist: {
      name: "Lúnet",
      description:
        "Especialista em soluções de tecnologia para força de vendas e produtividade comercial em campo.",
      capabilities: ["SFA", "Roteirização", "Pipeline", "Metas e forecast", "App mobile", "Integração ERP"],
    },
    benefits: ["Conversão maior", "Ciclo mais curto", "Forecast confiável", "Vendedores focados em venda"],
    indicators: [
      { label: "Conversão", value: "+28%" },
      { label: "Ciclo de venda", value: "-30%" },
      { label: "Adesão SFA", value: "92%" },
    ],
  },
  {
    slug: "automacao-financeira-bancaria",
    title: "Automação Financeira e Bancária",
    tagline: "Finanças automatizadas, integradas e sob controle",
    icon: "Banknote",
    problem:
      "Conciliação manual, múltiplas contas bancárias, planilhas e alto risco operacional na área financeira, com atrasos e falhas de controle.",
    impacts: ["Conciliação manual", "Erro humano", "Falhas de controle", "Baixa visibilidade caixa"],
    delivers:
      "Plataforma financeira integrada que automatiza conciliação, pagamentos, recebimentos e traz visibilidade total do caixa em tempo real.",
    capabilities: [
      "Conciliação bancária automática",
      "Contas a pagar e receber",
      "Gestão de caixa e tesouraria",
      "Integração multi-bancos",
      "Antecipação e crédito",
      "Fluxo de caixa preditivo",
      "Integração com ERP",
      "Compliance financeiro",
    ],
    specialist: {
      name: "Soulsys",
      description:
        "Plataforma financeira integrada — Soulsys Finance — para automação bancária, tesouraria e gestão de caixa.",
      capabilities: ["Soulsys Finance", "Conciliação", "Multi-bancos", "Tesouraria", "Integração ERP", "Compliance"],
    },
    benefits: ["Redução de erros", "Caixa visível", "Menos horas operacionais", "Governança financeira"],
    indicators: [
      { label: "Conciliação automática", value: "95%" },
      { label: "Horas operacionais", value: "-60%" },
      { label: "Visibilidade caixa", value: "Tempo real" },
    ],
  },
  {
    slug: "viagens-despesas-corporativas",
    title: "Viagens e Despesas Corporativas",
    tagline: "Gestão inteligente de T&E com economia e controle",
    icon: "Plane",
    problem:
      "Processos manuais de viagens, prestação de contas demorada, políticas descumpridas e falta de visibilidade sobre gastos corporativos.",
    impacts: ["Descumprimento de política", "Prestação demorada", "Overspend", "Baixa visibilidade"],
    delivers:
      "Plataforma end-to-end de viagens e despesas com política embutida, aprovação digital e visibilidade completa dos gastos corporativos.",
    capabilities: [
      "Booking corporativo integrado",
      "Políticas de viagem parametrizadas",
      "Aprovação digital",
      "Prestação de contas mobile",
      "OCR de notas e recibos",
      "Dashboards de gastos",
      "Integração com ERP e cartões",
      "Compliance e auditoria",
    ],
    specialist: {
      name: "Onfly",
      description:
        "Plataforma líder em gestão de viagens e despesas corporativas, com automação e políticas embutidas.",
      capabilities: ["Booking integrado", "T&E", "Aprovação digital", "OCR", "Dashboards", "Integração ERP"],
    },
    benefits: ["Economia em T&E", "Adesão à política", "Prestação rápida", "Visibilidade total"],
    indicators: [
      { label: "Economia T&E", value: "-18%" },
      { label: "Prestação de contas", value: "-70%" },
      { label: "Adesão política", value: "96%" },
    ],
  },
  {
    slug: "governanca-estrategia-crescimento",
    title: "Governança, Estratégia e Crescimento",
    tagline: "Do plano estratégico à execução com governança",
    icon: "Target",
    problem:
      "Empresas com boa operação mas sem estratégia clara, sem cadência de execução e sem indicadores de crescimento sustentável.",
    impacts: ["Estratégia sem execução", "Falta de cadência", "Indicadores ausentes", "Crescimento estagnado"],
    delivers:
      "Consultoria executiva para desenhar estratégia, montar governança, implantar OKRs/KPIs e acompanhar a execução com cadência disciplinada.",
    capabilities: [
      "Diagnóstico estratégico",
      "Planejamento estratégico",
      "Governança corporativa",
      "OKRs e KPIs",
      "Cadência executiva",
      "M&A e expansão",
      "Conselho consultivo",
      "Programas de crescimento",
    ],
    specialist: {
      name: "MVA Assessoria",
      description:
        "Consultoria executiva em estratégia, governança e crescimento, atuando junto a fundadores e boards.",
      capabilities: ["Estratégia", "Governança", "OKRs", "Cadência", "Conselho", "Crescimento"],
    },
    benefits: ["Estratégia executável", "Governança madura", "Crescimento sustentável", "Decisão orientada"],
    indicators: [
      { label: "Aderência ao plano", value: "+70%" },
      { label: "Velocidade de decisão", value: "+2x" },
      { label: "OKRs entregues", value: "85%" },
    ],
  },
  {
    slug: "educacao-gestao-academica",
    title: "Educação e Gestão Acadêmica",
    tagline: "Gestão acadêmica moderna e financeiramente saudável",
    icon: "GraduationCap",
    problem:
      "Instituições de ensino com gestão acadêmica fragmentada, inadimplência alta e processos manuais que impactam alunos e professores.",
    impacts: ["Inadimplência", "Processos manuais", "Baixa retenção", "Experiência ruim para aluno"],
    delivers:
      "ERP educacional completo, automação de matrículas, portais para aluno e professor e gestão financeira educacional integrada.",
    capabilities: [
      "Sistema de Gestão Acadêmica (SGA)",
      "Portal do Aluno e do Professor",
      "Gestão financeira educacional",
      "Processo seletivo digital",
      "Automação de matrículas",
      "Gestão de bolsas e FIES",
      "Integração com ERP",
      "BI acadêmico e financeiro",
    ],
    specialist: {
      name: "Orbit IT",
      description:
        "Especialista em soluções de tecnologia para instituições de ensino, com plataforma acadêmica integrada.",
      capabilities: ["SGA", "Portais", "Financeiro educacional", "Matrículas", "BI acadêmico", "Integração ERP"],
    },
    benefits: ["Redução de inadimplência", "Retenção maior", "Experiência do aluno", "Gestão integrada"],
    indicators: [
      { label: "Inadimplência", value: "-25%" },
      { label: "Retenção", value: "+18%" },
      { label: "NPS aluno", value: "+30" },
    ],
  },
  {
    slug: "inteligencia-empresarial-ia",
    title: "Inteligência Empresarial e IA",
    tagline: "Decisões orientadas por dados e Inteligência Artificial",
    icon: "BrainCircuit",
    problem:
      "Dados espalhados em múltiplos sistemas, relatórios manuais e decisões baseadas em achismo — enquanto a concorrência já usa IA.",
    impacts: ["Dados em silos", "Relatórios manuais", "Decisão por achismo", "Sem previsibilidade"],
    delivers:
      "Plataforma de BI, Analytics e IA aplicada ao negócio — de dashboards executivos a agentes inteligentes, machine learning e automação com IA.",
    capabilities: [
      "Business Intelligence (Power BI, Tableau)",
      "Analytics e data platform",
      "Inteligência Artificial aplicada",
      "Machine Learning e Predição",
      "Agentes inteligentes",
      "Automação com IA (RPA inteligente)",
      "Integração de dados multi-fonte",
      "Relatórios gerenciais automatizados",
    ],
    specialist: {
      name: "Nexsuria",
      description:
        "A Nexsuria lidera diretamente esta competência, atuando como Centro de Inteligência Empresarial do ecossistema.",
      capabilities: ["BI e Analytics", "IA aplicada", "Machine Learning", "Agentes inteligentes", "Automação IA", "Data platform"],
    },
    benefits: ["Decisão orientada", "Previsibilidade", "Automação inteligente", "Vantagem competitiva"],
    indicators: [
      { label: "Tempo de análise", value: "-80%" },
      { label: "Acurácia previsão", value: "+35%" },
      { label: "Processos com IA", value: "12+" },
    ],
  },
];

export type Partner = {
  slug: string;
  name: string;
  specialty: string;
  exclusive?: boolean;
  about: string;
  capabilities: string[];
  whenToUse: string;
  benefits: string[];
  site?: string;
};

export const partners: Partner[] = [
  { slug: "logithink", name: "Logithink", specialty: "TOTVS Protheus e RM", exclusive: true,
    about: "Mais de 20 anos de atuação e milhares de projetos em ERP TOTVS Protheus e RM. Parceiro exclusivo do Ecossistema Nexsuria.",
    capabilities: ["AMS 24x7", "Business Blueprint", "Integrações TOTVS", "Fábrica de Software", "RPA", "Gestão de Ativos"],
    whenToUse: "Sempre que houver projeto de implantação, evolução, AMS ou integração de TOTVS Protheus/RM.",
    benefits: ["Profundidade técnica", "SLA garantido", "Cobertura nacional", "Governança operacional"] },
  { slug: "nokware", name: "Nokware", specialty: "RH, Folha e Compliance Trabalhista", exclusive: true,
    about: "Maior especialista em RH Protheus no Brasil. +150 clientes, +70.000h de projetos, +10.000 colaboradores/mês, +R$20M em tributos recuperados.",
    capabilities: ["BPO de Folha e Ponto", "AMS RH", "Smart Check", "Auditoria trabalhista", "Medicina e SST", "Treinamentos"],
    whenToUse: "Projetos de RH Protheus, BPO de folha, conformidade eSocial ou SST.",
    benefits: ["Segurança legal", "Redução de passivos", "Validação contínua", "Expertise única no país"] },
  { slug: "afin", name: "AFIN Assessoria", specialty: "Fiscal, Contábil e Reforma Tributária", exclusive: true,
    about: "Assessoria especializada em BPO contábil, fiscal e preparação para a Reforma Tributária.",
    capabilities: ["BPO Contábil", "BPO Fiscal", "Reforma Tributária", "Recuperação de créditos", "SPED", "IBS/CBS"],
    whenToUse: "Compliance tributário, BPO fiscal/contábil e projetos de Reforma Tributária.",
    benefits: ["Redução de risco fiscal", "Créditos recuperados", "Preparo IBS/CBS"] },
  { slug: "deverest", name: "Deverest", specialty: "Processos, Automação e Fluig", exclusive: true,
    about: "14+ anos em desenvolvimento sob medida. Especialista em Fluig TOTVS, BPM, ECM e apps corporativos.",
    capabilities: ["Fluig TOTVS", "BPM/ECM", "Portais", "Integrações", "Apps sob medida", "RPA"],
    whenToUse: "Automação de processos, workflows Fluig, portais e integrações corporativas.",
    benefits: ["Processos padronizados", "Time-to-market curto", "Governança de processo"] },
  { slug: "skyone", name: "Skyone", specialty: "Cloud e Governança Digital",
    about: "Plataforma de Cloud e Data que descomplica tecnologia, com governança, segurança e escala.",
    capabilities: ["Cloud gerenciado", "Backup/DR", "Monitoração 24x7", "Segurança", "LGPD", "FinOps"],
    whenToUse: "Migração para cloud, DR, monitoração 24x7 e governança digital.",
    benefits: ["Alta disponibilidade", "Custos previsíveis", "Segurança elevada"] },
  { slug: "lunet", name: "Lúnet", specialty: "Produtividade Comercial e SFA", exclusive: true,
    about: "Especialista em tecnologia para força de vendas e produtividade comercial em campo.",
    capabilities: ["SFA", "Roteirização", "Pipeline", "Forecast", "App mobile", "Integração ERP"],
    whenToUse: "Times comerciais em campo, distribuição e vendas B2B com alta capilaridade.",
    benefits: ["Conversão maior", "Ciclo mais curto", "Forecast confiável"] },
  { slug: "soulsys", name: "Soulsys", specialty: "Automação Financeira e Bancária", exclusive: true,
    about: "Plataforma financeira integrada — Soulsys Finance — para automação bancária e tesouraria.",
    capabilities: ["Soulsys Finance", "Conciliação", "Multi-bancos", "Tesouraria", "Integração ERP"],
    whenToUse: "Automação de tesouraria, conciliação bancária e gestão de caixa em tempo real.",
    benefits: ["Redução de erros", "Caixa em tempo real", "Governança financeira"] },
  { slug: "onfly", name: "Onfly", specialty: "Viagens e Despesas Corporativas", exclusive: true,
    about: "Plataforma líder em gestão de viagens e despesas corporativas.",
    capabilities: ["Booking integrado", "T&E", "Aprovação digital", "OCR", "Dashboards", "Integração ERP"],
    whenToUse: "Empresas com times em viagem, controle de política e prestação de contas em escala.",
    benefits: ["Economia em T&E", "Política cumprida", "Prestação rápida"] },
  { slug: "mva", name: "MVA Assessoria", specialty: "Governança, Estratégia e Crescimento", exclusive: true,
    about: "Consultoria executiva em estratégia, governança e crescimento — atuando junto a fundadores e boards.",
    capabilities: ["Estratégia", "Governança", "OKRs", "Cadência", "Conselho", "M&A"],
    whenToUse: "Momento de planejamento estratégico, governança, expansão ou sucessão.",
    benefits: ["Estratégia executável", "Governança madura", "Crescimento sustentável"] },
  { slug: "orbit-it", name: "Orbit IT", specialty: "Educação e Gestão Acadêmica", exclusive: true,
    about: "Especialista em soluções para instituições de ensino, com plataforma acadêmica integrada.",
    capabilities: ["SGA", "Portais", "Financeiro educacional", "Matrículas", "BI acadêmico", "Integração ERP"],
    whenToUse: "Instituições de ensino que precisam integrar gestão acadêmica, financeira e experiência do aluno.",
    benefits: ["Redução de inadimplência", "Retenção maior", "Experiência do aluno"] },
];

export const kpis = [
  { value: "10", suffix: "+", label: "Especialistas no Ecossistema" },
  { value: "13", suffix: "", label: "Soluções Empresariais" },
  { value: "28", suffix: "+", label: "Anos de Experiência Executiva" },
  { value: "1", suffix: "", label: "Único Relacionamento" },
];

export const methodology = [
  { step: "01", title: "Diagnóstico", description: "Compreendemos seu negócio, mapeamos processos e identificamos oportunidades reais de evolução." },
  { step: "02", title: "Estratégia", description: "Desenhamos um plano personalizado com as capacidades certas do ecossistema para o seu desafio." },
  { step: "03", title: "Especialista", description: "Selecionamos o parceiro ideal — o especialista exclusivo para a sua área de atuação." },
  { step: "04", title: "Implantação", description: "Executamos com metodologia ágil, entregando valor em ciclos curtos, com prazo e orçamento sob controle." },
  { step: "05", title: "Governança", description: "Acompanhamos indicadores, SLAs e riscos, com cadência executiva e transparência total." },
  { step: "06", title: "Evolução Contínua", description: "Evoluímos a plataforma e os processos conforme o negócio cresce e amadurece." },
];

export const differentials = [
  { title: "Diagnóstico Consultivo", description: "Enxergamos o negócio antes da tecnologia. Estratégia primeiro, ferramenta depois.", icon: "Stethoscope" },
  { title: "Ecossistema Exclusivo", description: "Parceiros líderes, com exclusividade por especialidade — sem sobreposição, sem conflito.", icon: "Network" },
  { title: "Especialistas de Mercado", description: "Os melhores do Brasil em cada disciplina, curados e coordenados pela Nexsuria.", icon: "Award" },
  { title: "Governança", description: "Cadência executiva, SLAs, indicadores e transparência em cada etapa da jornada.", icon: "Gauge" },
  { title: "Relacionamento Único", description: "Um único ponto focal. A responsabilidade é da Nexsuria, sempre.", icon: "Handshake" },
  { title: "Foco em Resultado", description: "Não vendemos software. Entregamos evolução empresarial mensurável.", icon: "Target" },
  { title: "Visão Estratégica", description: "Do plano de crescimento à operação: conectamos estratégia e execução.", icon: "Compass" },
  { title: "Inteligência Artificial", description: "IA aplicada ao negócio, com dashboards, agentes e automação inteligente.", icon: "BrainCircuit" },
];

export const values = [
  { name: "Parceria", description: "Atuamos lado a lado com clientes e parceiros em toda a jornada." },
  { name: "Excelência", description: "Os melhores especialistas, os melhores processos, o melhor resultado." },
  { name: "Ética", description: "Transparência, coerência e responsabilidade em cada decisão." },
  { name: "Resultado", description: "Evolução empresarial mensurável — não apenas entregas técnicas." },
  { name: "Inovação", description: "IA, dados e tecnologia aplicados para acelerar negócios." },
  { name: "Confiança", description: "Um único relacionamento, uma única responsabilidade: a nossa." },
];

export const timeline = [
  { year: "Fundação", title: "Nascimento da Nexsuria", description: "Fundada em Campinas/SP com a missão de conectar pessoas e negócios." },
  { year: "Formação do Ecossistema", title: "Curadoria de Especialistas", description: "Seleção dos melhores especialistas do mercado, com exclusividade por área." },
  { year: "Centro de Inteligência", title: "IA como Competência Direta", description: "A Nexsuria assume diretamente a liderança em Inteligência Empresarial e IA." },
  { year: "Hoje", title: "Portal Executivo Comercial", description: "Uma experiência digital para conduzir diagnósticos e projetos ponta a ponta." },
];

export const contactInfo = {
  whatsapp: "https://wa.me/5519994225089?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20diagn%C3%B3stico%20com%20a%20Nexsuria.",
  whatsappLabel: "+55 (19) 99422-5089",
  linkedin: "https://www.linkedin.com/company/nexsuria/",
  site: "https://nexsuria.com",
  email: "contato@nexsuria.com",
};