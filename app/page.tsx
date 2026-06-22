"use client";

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

type SystemStatus = 'Ativo' | 'Demo' | 'Preparando';
type SavedActionStatus = 'Pendente' | 'Em andamento' | 'Concluída';
type ModuleFieldType = 'text' | 'select' | 'textarea';
type SectionKey =
  | 'dashboard'
  | 'gerar-sistema'
  | 'meus-sistemas'
  | 'clientes'
  | 'assinaturas'
  | 'ia-atendimento'
  | 'automacao'
  | 'relatorios'
  | 'apresentacao'
  | 'configuracoes'
  | 'ajuda';

type SystemType = {
  id: string;
  name: string;
  type: string;
  modules: string[];
  created: string;
  status: SystemStatus;
  description: string;
  target: string;
};

type ModuleField = {
  key: string;
  label: string;
  placeholder: string;
  type?: ModuleFieldType;
  options?: string[];
};

type ActionForm = {
  name: string;
  responsible: string;
  date: string;
  priority: string;
  description: string;
  extraFields: Record<string, string>;
};

type SavedActionType = {
  id: string;
  systemId: string;
  title: string;
  module: string;
  system: string;
  created: string;
  name: string;
  responsible: string;
  date: string;
  priority: string;
  description: string;
  status: SavedActionStatus;
  extraFields: Record<string, string>;
};

type SystemDbRow = {
  id: string;
  name: string;
  type: string;
  modules: string[] | null;
  status: string | null;
  created_label: string | null;
  created_at?: string | null;
};

type ActionDbRow = {
  id: string;
  system_id: string | null;
  system_name: string | null;
  module: string;
  title: string;
  status: string | null;
  name: string | null;
  responsible: string | null;
  date: string | null;
  priority: string | null;
  description: string | null;
  extra_fields: Record<string, string> | null;
  created_label: string | null;
  created_at?: string | null;
};

const storageKeys = {
  systems: 'nexaflow.systems.v11',
  actions: 'nexaflow.actions.v11',
};

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const emptyForm: ActionForm = {
  name: '',
  responsible: '',
  date: '',
  priority: 'Prioridade normal',
  description: '',
  extraFields: {},
};

const generatedSystemOptions: SystemType[] = [
  {
    id: 'modelo-radio',
    name: 'Sistema IA para Rádio',
    type: 'Rádio',
    modules: ['Programação', 'Vinhetas', 'Locutores', 'Anunciantes', 'Comerciais', 'Relatórios'],
    created: '',
    status: 'Ativo',
    description: 'Controle completo da rádio: grade, vinhetas, locutores, anunciantes e relatórios comerciais.',
    target: 'Rádio FM, web rádio e emissoras locais',
  },
  {
    id: 'modelo-tv',
    name: 'Sistema IA para TV',
    type: 'TV',
    modules: ['Grade de Programação', 'Reportagens', 'Ao Vivo', 'Comercial', 'Equipe', 'Relatórios'],
    created: '',
    status: 'Ativo',
    description: 'Gestão para canal de TV: programação, matérias, equipe, transmissão e comercial.',
    target: 'TV aberta, canal digital e produtoras',
  },
  {
    id: 'modelo-hamburgueria',
    name: 'Sistema IA para Hamburgueria',
    type: 'Hamburgueria',
    modules: ['Cardápio Digital', 'Pedidos', 'Delivery', 'WhatsApp', 'Clientes', 'Vendas'],
    created: '',
    status: 'Ativo',
    description: 'Pedido, cardápio, delivery, WhatsApp e controle de clientes em um painel único.',
    target: 'Hamburguerias, lanchonetes e delivery',
  },
  {
    id: 'modelo-supermercado',
    name: 'Sistema IA para Supermercado',
    type: 'Supermercado',
    modules: ['Produtos', 'Estoque', 'Caixa', 'Clientes', 'Relatórios', 'Vendas'],
    created: '',
    status: 'Ativo',
    description: 'Controle de produtos, estoque, vendas, clientes e relatórios gerenciais.',
    target: 'Mercados, mercearias e atacarejos',
  },
  {
    id: 'modelo-barbearia',
    name: 'Sistema IA para Barbearia',
    type: 'Barbearia',
    modules: ['Agenda', 'Serviços', 'Clientes', 'WhatsApp', 'Comissões', 'Vendas'],
    created: '',
    status: 'Ativo',
    description: 'Agendamento, clientes, serviços, comissões e mensagens automáticas.',
    target: 'Barbearias, salões e estética',
  },
  {
    id: 'modelo-pizzaria',
    name: 'Sistema IA para Pizzaria',
    type: 'Pizzaria',
    modules: ['Cardápio', 'Pedidos', 'Delivery', 'Cupons', 'WhatsApp', 'Clientes'],
    created: '',
    status: 'Ativo',
    description: 'Cardápio, pedidos, entregas, cupons e atendimento pelo WhatsApp.',
    target: 'Pizzarias e restaurantes delivery',
  },
  {
    id: 'modelo-loja',
    name: 'Sistema IA para Loja',
    type: 'Loja',
    modules: ['Vitrine', 'Produtos', 'Vendas', 'Clientes', 'Estoque', 'Relatórios'],
    created: '',
    status: 'Ativo',
    description: 'Vitrine, produtos, vendas, estoque, clientes e relatórios de desempenho.',
    target: 'Lojas físicas, confecções e comércio local',
  },
];

const demoSystems: SystemType[] = [
  {
    id: 'demo-radio-difusora',
    name: 'Demo Rádio Difusora FM',
    type: 'Rádio',
    modules: ['Programação', 'Vinhetas', 'Locutores', 'Anunciantes', 'Comerciais', 'Relatórios'],
    created: 'Demo pronta',
    status: 'Demo',
    description: 'Modelo pronto para apresentar a rádio no ar com operação comercial organizada.',
    target: 'Apresentação para direção, anunciantes e equipe',
  },
  {
    id: 'demo-tv-digital',
    name: 'Demo TV Canal 7.1',
    type: 'TV',
    modules: ['Grade de Programação', 'Reportagens', 'Ao Vivo', 'Comercial', 'Equipe', 'Relatórios'],
    created: 'Demo pronta',
    status: 'Demo',
    description: 'Modelo pronto para TV aberta digital com programação, jornalismo e comercial.',
    target: 'Apresentação rápida da TV no ar',
  },
];

const moduleFields: Record<string, ModuleField[]> = {
  Vinhetas: [
    { key: 'tipo', label: 'Tipo da vinheta', placeholder: 'Abertura, chamada, comercial, institucional', type: 'select', options: ['Abertura', 'Chamada', 'Comercial', 'Institucional', 'Encerramento'] },
    { key: 'duracao', label: 'Duração', placeholder: 'Ex: 15 segundos' },
    { key: 'locutor', label: 'Locutor responsável', placeholder: 'Nome do locutor' },
    { key: 'arquivo', label: 'Arquivo/versão', placeholder: 'Ex: vinheta_abertura_v1.mp3' },
  ],
  Locutores: [
    { key: 'programa', label: 'Programa', placeholder: 'Ex: Jornal da Manhã' },
    { key: 'horario', label: 'Horário', placeholder: 'Ex: 08h às 11h' },
    { key: 'whatsapp', label: 'WhatsApp', placeholder: 'Número para contato' },
    { key: 'statusLocutor', label: 'Status do locutor', placeholder: 'Ativo', type: 'select', options: ['Ativo', 'Folga', 'Substituto', 'Convidado'] },
  ],
  Programação: [
    { key: 'dia', label: 'Dia da semana', placeholder: 'Segunda-feira', type: 'select', options: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'] },
    { key: 'inicio', label: 'Horário inicial', placeholder: 'Ex: 07:00' },
    { key: 'fim', label: 'Horário final', placeholder: 'Ex: 10:00' },
    { key: 'apresentador', label: 'Apresentador', placeholder: 'Nome do apresentador' },
  ],
  Anunciantes: [
    { key: 'empresa', label: 'Empresa anunciante', placeholder: 'Nome da empresa' },
    { key: 'valor', label: 'Valor do contrato', placeholder: 'Ex: R$ 1.500,00' },
    { key: 'periodo', label: 'Período da campanha', placeholder: 'Ex: 30 dias' },
    { key: 'insercoes', label: 'Inserções por dia', placeholder: 'Ex: 8 chamadas por dia' },
  ],
  Comerciais: [
    { key: 'cliente', label: 'Cliente', placeholder: 'Nome do cliente' },
    { key: 'pacote', label: 'Pacote comercial', placeholder: 'Bronze, Prata, Ouro', type: 'select', options: ['Bronze', 'Prata', 'Ouro', 'Patrocínio master'] },
    { key: 'prazo', label: 'Prazo de veiculação', placeholder: 'Ex: 15 dias' },
    { key: 'midia', label: 'Mídia', placeholder: 'Spot, testemunhal, banner, VT' },
  ],
  'Grade de Programação': [
    { key: 'programa', label: 'Programa', placeholder: 'Nome do programa' },
    { key: 'horario', label: 'Horário', placeholder: 'Ex: 18h às 19h' },
    { key: 'categoria', label: 'Categoria', placeholder: 'Jornal, entretenimento, esporte', type: 'select', options: ['Jornal', 'Entretenimento', 'Esporte', 'Religioso', 'Comercial'] },
    { key: 'responsavel', label: 'Responsável', placeholder: 'Equipe/apresentador' },
  ],
  Reportagens: [
    { key: 'pauta', label: 'Pauta', placeholder: 'Tema da reportagem' },
    { key: 'repórter', label: 'Repórter', placeholder: 'Nome do repórter' },
    { key: 'local', label: 'Local', placeholder: 'Cidade ou bairro' },
    { key: 'statusPauta', label: 'Status da pauta', placeholder: 'Em produção', type: 'select', options: ['Em apuração', 'Em gravação', 'Editando', 'Pronta para ir ao ar'] },
  ],
  'Ao Vivo': [
    { key: 'evento', label: 'Evento ao vivo', placeholder: 'Nome do evento' },
    { key: 'local', label: 'Local', placeholder: 'Endereço/local da transmissão' },
    { key: 'equipe', label: 'Equipe técnica', placeholder: 'Câmera, áudio, apresentador' },
    { key: 'horario', label: 'Horário de entrada', placeholder: 'Ex: 20:00' },
  ],
  Comercial: [
    { key: 'cliente', label: 'Cliente comercial', placeholder: 'Nome do anunciante' },
    { key: 'formato', label: 'Formato', placeholder: 'VT, chamada, patrocínio', type: 'select', options: ['VT 15s', 'VT 30s', 'Chamada', 'Patrocínio', 'Merchan'] },
    { key: 'valor', label: 'Valor', placeholder: 'Ex: R$ 2.000,00' },
    { key: 'veiculacao', label: 'Veiculação', placeholder: 'Ex: 3 vezes por dia' },
  ],
  Equipe: [
    { key: 'funcao', label: 'Função', placeholder: 'Apresentador, câmera, editor' },
    { key: 'contato', label: 'Contato', placeholder: 'WhatsApp ou telefone' },
    { key: 'escala', label: 'Escala', placeholder: 'Dias e horários' },
    { key: 'statusEquipe', label: 'Status', placeholder: 'Ativo', type: 'select', options: ['Ativo', 'Folga', 'Plantão', 'Substituto'] },
  ],
  Cardápio: [
    { key: 'categoria', label: 'Categoria', placeholder: 'Pizza, bebida, combo', type: 'select', options: ['Pizza', 'Bebida', 'Combo', 'Sobremesa', 'Promoção'] },
    { key: 'preco', label: 'Preço', placeholder: 'Ex: R$ 39,90' },
    { key: 'disponibilidade', label: 'Disponibilidade', placeholder: 'Disponível', type: 'select', options: ['Disponível', 'Indisponível', 'Promoção'] },
    { key: 'ingredientes', label: 'Ingredientes', placeholder: 'Itens principais' },
  ],
  'Cardápio Digital': [
    { key: 'categoria', label: 'Categoria', placeholder: 'Burger, bebida, combo', type: 'select', options: ['Burger', 'Bebida', 'Combo', 'Porção', 'Promoção'] },
    { key: 'preco', label: 'Preço', placeholder: 'Ex: R$ 24,90' },
    { key: 'tempo', label: 'Tempo de preparo', placeholder: 'Ex: 20 min' },
    { key: 'ingredientes', label: 'Ingredientes', placeholder: 'Itens principais' },
  ],
  Pedidos: [
    { key: 'cliente', label: 'Cliente', placeholder: 'Nome do cliente' },
    { key: 'valor', label: 'Valor do pedido', placeholder: 'Ex: R$ 84,00' },
    { key: 'pagamento', label: 'Pagamento', placeholder: 'Pix, cartão, dinheiro', type: 'select', options: ['Pix', 'Cartão', 'Dinheiro', 'Fiado autorizado'] },
    { key: 'statusPedido', label: 'Status do pedido', placeholder: 'Em preparo', type: 'select', options: ['Recebido', 'Em preparo', 'Saiu para entrega', 'Finalizado'] },
  ],
  Delivery: [
    { key: 'entregador', label: 'Entregador', placeholder: 'Nome do entregador' },
    { key: 'rota', label: 'Rota/Bairro', placeholder: 'Ex: Centro' },
    { key: 'taxa', label: 'Taxa de entrega', placeholder: 'Ex: R$ 5,00' },
    { key: 'tempoEntrega', label: 'Tempo previsto', placeholder: 'Ex: 35 min' },
  ],
  Produtos: [
    { key: 'sku', label: 'Código/SKU', placeholder: 'Ex: PROD-001' },
    { key: 'preco', label: 'Preço', placeholder: 'Ex: R$ 59,90' },
    { key: 'categoria', label: 'Categoria', placeholder: 'Categoria do produto' },
    { key: 'margem', label: 'Margem estimada', placeholder: 'Ex: 35%' },
  ],
  Estoque: [
    { key: 'quantidade', label: 'Quantidade', placeholder: 'Ex: 120 unidades' },
    { key: 'minimo', label: 'Estoque mínimo', placeholder: 'Ex: 20 unidades' },
    { key: 'fornecedor', label: 'Fornecedor', placeholder: 'Nome do fornecedor' },
    { key: 'validade', label: 'Validade', placeholder: 'Data de validade' },
  ],
  Clientes: [
    { key: 'telefone', label: 'Telefone/WhatsApp', placeholder: 'Contato do cliente' },
    { key: 'origem', label: 'Origem', placeholder: 'Instagram, indicação, loja', type: 'select', options: ['Instagram', 'WhatsApp', 'Indicação', 'Loja física', 'Anúncio'] },
    { key: 'interesse', label: 'Interesse', placeholder: 'O que o cliente procura' },
    { key: 'valorPotencial', label: 'Valor potencial', placeholder: 'Ex: R$ 500,00' },
  ],
  Vendas: [
    { key: 'produto', label: 'Produto vendido', placeholder: 'Nome do produto/serviço' },
    { key: 'valor', label: 'Valor', placeholder: 'Ex: R$ 350,00' },
    { key: 'canal', label: 'Canal', placeholder: 'Loja, WhatsApp, Instagram', type: 'select', options: ['Loja', 'WhatsApp', 'Instagram', 'Site', 'Indicação'] },
    { key: 'vendedor', label: 'Vendedor', placeholder: 'Responsável pela venda' },
  ],
  Agenda: [
    { key: 'cliente', label: 'Cliente', placeholder: 'Nome do cliente' },
    { key: 'servico', label: 'Serviço', placeholder: 'Corte, barba, tratamento' },
    { key: 'horario', label: 'Horário', placeholder: 'Ex: 15:30' },
    { key: 'profissional', label: 'Profissional', placeholder: 'Nome do profissional' },
  ],
  WhatsApp: [
    { key: 'fluxo', label: 'Fluxo de mensagem', placeholder: 'Boas-vindas, pedido, cobrança' },
    { key: 'gatilho', label: 'Gatilho', placeholder: 'Quando enviar' },
    { key: 'publico', label: 'Público', placeholder: 'Clientes novos, antigos, leads' },
    { key: 'objetivo', label: 'Objetivo', placeholder: 'Vender, informar, recuperar cliente' },
  ],
  Relatórios: [
    { key: 'periodo', label: 'Período', placeholder: 'Hoje, semana, mês' },
    { key: 'indicador', label: 'Indicador principal', placeholder: 'Vendas, audiência, estoque' },
    { key: 'meta', label: 'Meta', placeholder: 'Ex: aumentar 20%' },
    { key: 'responsavel', label: 'Responsável', placeholder: 'Quem analisa' },
  ],
};

const actionTemplates: Record<string, string[]> = {
  Programação: ['Adicionar programa', 'Montar grade semanal', 'Gerar programação com IA', 'Revisar horário nobre'],
  Vinhetas: ['Cadastrar nova vinheta', 'Enviar áudio de vinheta', 'Gerar texto de vinheta com IA', 'Organizar arquivos de vinhetas'],
  Locutores: ['Cadastrar locutor', 'Criar escala de locutores', 'Ver perfil do locutor', 'Relatório de participação'],
  Anunciantes: ['Cadastrar anunciante', 'Criar campanha comercial', 'Gerenciar contrato', 'Ver faturamento de anúncios'],
  Comerciais: ['Cadastrar comercial', 'Montar pacote comercial', 'Criar proposta para anunciante', 'Organizar veiculação'],
  'Grade de Programação': ['Adicionar programa', 'Organizar grade semanal', 'Definir horário nobre', 'Gerar chamada de programação'],
  Reportagens: ['Cadastrar pauta', 'Definir repórter', 'Marcar gravação', 'Finalizar reportagem'],
  'Ao Vivo': ['Criar entrada ao vivo', 'Definir equipe técnica', 'Registrar local', 'Montar checklist de transmissão'],
  Comercial: ['Cadastrar cliente comercial', 'Criar proposta', 'Registrar veiculação', 'Gerar roteiro de VT'],
  Equipe: ['Cadastrar membro da equipe', 'Montar escala', 'Definir função', 'Organizar plantão'],
  Cardápio: ['Adicionar item ao cardápio', 'Criar combo promocional', 'Editar preço', 'Gerar descrição com IA'],
  'Cardápio Digital': ['Adicionar produto', 'Criar combo', 'Atualizar preço', 'Gerar descrição vendedora'],
  Pedidos: ['Registrar pedido', 'Atualizar status', 'Organizar entrega', 'Gerar mensagem para cliente'],
  Delivery: ['Cadastrar entregador', 'Definir rota', 'Calcular taxa', 'Relatório do delivery'],
  Produtos: ['Cadastrar produto', 'Editar produto', 'Definir margem', 'Ver mais vendidos'],
  Estoque: ['Adicionar item ao estoque', 'Controlar entrada e saída', 'Ver produtos acabando', 'Gerar alerta de compra'],
  Clientes: ['Cadastrar cliente', 'Ver histórico', 'Criar mensagem no WhatsApp', 'Gerar oferta personalizada'],
  Vendas: ['Registrar venda', 'Ver vendas do dia', 'Criar estratégia para vender mais', 'Gerar relatório de vendas'],
  Agenda: ['Cadastrar horário', 'Confirmar cliente', 'Remarcar atendimento', 'Gerar lembrete automático'],
  WhatsApp: ['Criar mensagem automática', 'Montar fluxo de atendimento', 'Criar campanha', 'Responder cliente com IA'],
  Relatórios: ['Ver relatório geral', 'Gerar análise com IA', 'Exportar dados', 'Comparar desempenho'],
  'Sócio Digital IA': ['Analisar o negócio', 'Sugerir melhorias', 'Criar plano de crescimento', 'Gerar estratégia de vendas'],
};

const sectionMeta: Record<SectionKey, { subtitle: string; title: string; description: string }> = {
  dashboard: {
    subtitle: 'Visão Geral',
    title: 'NexaFlow AI — Central de Comando',
    description: 'Painel limpo para apresentar rádio, TV, sistemas, operação e estratégia comercial em tempo real.',
  },
  'gerar-sistema': {
    subtitle: 'Gerador Inteligente',
    title: 'Gerar sistema de acordo com a empresa',
    description: 'Escolha o segmento e o NexaFlow cria uma estrutura com módulos inteligentes.',
  },
  'meus-sistemas': {
    subtitle: 'Sistemas',
    title: 'Meus sistemas gerados',
    description: 'Acesse sistemas, cadastre dados reais e mostre a versão demo para clientes.',
  },
  clientes: {
    subtitle: 'Clientes',
    title: 'Pipeline comercial',
    description: 'Organize leads, empresas interessadas e oportunidades para vender o NexaFlow.',
  },
  assinaturas: {
    subtitle: 'Receita',
    title: 'Planos e assinaturas',
    description: 'Estruture planos mensais, implantação e suporte para clientes empresariais.',
  },
  'ia-atendimento': {
    subtitle: 'Atendimento',
    title: 'IA de atendimento',
    description: 'Central para fluxos de WhatsApp, respostas automáticas e atendimento inteligente.',
  },
  automacao: {
    subtitle: 'Automação',
    title: 'Fluxos automáticos',
    description: 'Monte rotinas para reduzir trabalho manual e aumentar velocidade operacional.',
  },
  relatorios: {
    subtitle: 'Relatórios',
    title: 'Relatórios e exportação',
    description: 'Gere visão gerencial das ações, sistemas, status e oportunidades.',
  },
  apresentacao: {
    subtitle: 'Modo Apresentação',
    title: 'Modo apresentação profissional',
    description: 'Tela de impacto para mostrar TV, rádio, anunciantes, sistemas prontos e proposta comercial.',
  },
  configuracoes: {
    subtitle: 'Configurações',
    title: 'Ajustes do NexaFlow',
    description: 'Limpeza de dados teste, preferências e controle local do painel.',
  },
  ajuda: {
    subtitle: 'Ajuda',
    title: 'Roteiro rápido de uso',
    description: 'Passo a passo para apresentar e vender o NexaFlow sem travar.',
  },
};

const menuItems: { key: SectionKey; label: string }[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'apresentacao', label: 'Apresentação' },
  { key: 'meus-sistemas', label: 'Meus Sistemas' },
  { key: 'gerar-sistema', label: 'Gerar Sistema' },
  { key: 'relatorios', label: 'Relatórios' },
  { key: 'clientes', label: 'Clientes' },
  { key: 'assinaturas', label: 'Assinaturas' },
  { key: 'ia-atendimento', label: 'IA Atendimento' },
  { key: 'automacao', label: 'Automação' },
  { key: 'configuracoes', label: 'Configurações' },
  { key: 'ajuda', label: 'Ajuda' },
];

function getModuleFields(moduleName: string): ModuleField[] {
  return moduleFields[moduleName] ?? [
    { key: 'tipo', label: 'Tipo', placeholder: `Tipo de item em ${moduleName}` },
    { key: 'valor', label: 'Valor/Referência', placeholder: 'Valor, código ou referência' },
    { key: 'statusInterno', label: 'Status interno', placeholder: 'Ativo', type: 'select', options: ['Ativo', 'Pausado', 'Em análise', 'Finalizado'] },
    { key: 'observacaoRapida', label: 'Observação rápida', placeholder: 'Resumo rápido' },
  ];
}

function getActionTemplates(moduleName: string): string[] {
  return actionTemplates[moduleName] ?? [
    `Criar novo item em ${moduleName}`,
    `Gerenciar ${moduleName}`,
    `Gerar sugestão com IA`,
    `Ver relatório de ${moduleName}`,
  ];
}

function getAiRecommendation(system: SystemType | null, actions: SavedActionType[]): string {
  if (!system) {
    return 'Abra um sistema para receber análise do Sócio Digital IA.';
  }

  const pending = actions.filter((item) => item.status === 'Pendente').length;
  const done = actions.filter((item) => item.status === 'Concluída').length;
  const modulesWithActions = new Set(actions.map((item) => item.module));
  const missingModules = system.modules.filter((module) => !modulesWithActions.has(module));

  if (actions.length === 0) {
    return `Comece cadastrando dados em ${system.modules.slice(0, 2).join(' e ')}. Isso deixa o sistema ${system.type} pronto para uma apresentação real.`;
  }

  if (pending > done) {
    return `Existem ${pending} ações pendentes. Priorize concluir as mais importantes antes de apresentar para cliente ou anunciante.`;
  }

  if (missingModules.length > 0) {
    return `Os módulos ${missingModules.slice(0, 3).join(', ')} ainda não têm dados. Cadastre pelo menos uma ação em cada para a demo ficar completa.`;
  }

  return `O sistema ${system.name} já tem boa estrutura. Próximo passo: gerar proposta comercial, apresentar relatórios e vender implantação mensal.`;
}

function formatActionDetails(action: SavedActionType): string[] {
  const details = [
    `Nome: ${action.name || 'Não informado'}`,
    `Responsável: ${action.responsible || 'Não informado'}`,
    `Data: ${action.date || 'Não informada'}`,
    `Prioridade: ${action.priority}`,
  ];

  Object.entries(action.extraFields || {}).forEach(([key, value]) => {
    if (value) {
      details.push(`${key}: ${value}`);
    }
  });

  return details;
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function normalizeSystemStatus(status: string | null | undefined): SystemStatus {
  if (status === 'Ativo' || status === 'Demo' || status === 'Preparando') {
    return status;
  }

  return 'Ativo';
}

function normalizeActionStatus(status: string | null | undefined): SavedActionStatus {
  if (status === 'Pendente' || status === 'Em andamento' || status === 'Concluída') {
    return status;
  }

  return 'Pendente';
}

function systemFromDb(row: SystemDbRow): SystemType {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    modules: row.modules ?? [],
    created: row.created_label || (row.created_at ? new Date(row.created_at).toLocaleDateString('pt-BR') : 'Supabase'),
    status: normalizeSystemStatus(row.status),
    description: 'Sistema salvo no banco Supabase do NexaFlow.',
    target: 'Cliente NexaFlow',
  };
}

function actionFromDb(row: ActionDbRow): SavedActionType {
  return {
    id: row.id,
    systemId: row.system_id ?? '',
    title: row.title || 'Ação sem nome',
    module: row.module,
    system: row.system_name || 'Sistema NexaFlow',
    created: row.created_label || (row.created_at ? new Date(row.created_at).toLocaleString('pt-BR') : ''),
    name: row.name ?? '',
    responsible: row.responsible ?? '',
    date: row.date ?? '',
    priority: row.priority || 'Prioridade normal',
    description: row.description ?? '',
    status: normalizeActionStatus(row.status),
    extraFields: row.extra_fields ?? {},
  };
}

function actionToDbPayload(action: SavedActionType) {
  return {
    id: action.id,
    system_id: isUuid(action.systemId) ? action.systemId : null,
    system_name: action.system,
    module: action.module,
    title: action.title,
    status: action.status,
    name: action.name,
    responsible: action.responsible,
    date: action.date,
    priority: action.priority,
    description: action.description,
    extra_fields: action.extraFields ?? {},
    created_label: action.created,
  };
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionKey>('dashboard');
  const [systems, setSystems] = useState<SystemType[]>([]);
  const [savedActions, setSavedActions] = useState<SavedActionType[]>([]);
  const [activeSystem, setActiveSystem] = useState<SystemType | null>(null);
  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [editingActionId, setEditingActionId] = useState<string | null>(null);
  const [actionForm, setActionForm] = useState<ActionForm>(emptyForm);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todas' | SavedActionStatus>('Todas');
  const [moduleFilter, setModuleFilter] = useState('Todos');
  const [copiedText, setCopiedText] = useState('');
  const [isLoadingDb, setIsLoadingDb] = useState(true);
  const [dbMessage, setDbMessage] = useState('Banco online: carregando...');

  useEffect(() => {
    async function loadSupabaseData() {
      try {
        const [{ data: systemRows, error: systemsError }, { data: actionRows, error: actionsError }] = await Promise.all([
          supabase.from('nexaflow_systems').select('*').order('created_at', { ascending: false }),
          supabase.from('nexaflow_actions').select('*').order('created_at', { ascending: false }),
        ]);

        if (systemsError) throw systemsError;
        if (actionsError) throw actionsError;

        setSystems(((systemRows ?? []) as SystemDbRow[]).map(systemFromDb));
        setSavedActions(((actionRows ?? []) as ActionDbRow[]).map(actionFromDb));
        setDbMessage('Banco online conectado ao Supabase');
      } catch (error) {
        console.error('Erro ao carregar Supabase:', error);
        setDbMessage('Modo navegador: Supabase não respondeu');

        const storedSystems = window.localStorage.getItem(storageKeys.systems) || window.localStorage.getItem('nexaflow.systems.v9');
        const storedActions = window.localStorage.getItem(storageKeys.actions) || window.localStorage.getItem('nexaflow.actions.v9');

        if (storedSystems) {
          try {
            setSystems(JSON.parse(storedSystems) as SystemType[]);
          } catch {
            setSystems([]);
          }
        }

        if (storedActions) {
          try {
            setSavedActions(JSON.parse(storedActions) as SavedActionType[]);
          } catch {
            setSavedActions([]);
          }
        }
      } finally {
        setIsLoadingDb(false);
      }
    }

    loadSupabaseData();
  }, []);

  useEffect(() => {
    if (!isLoadingDb) {
      window.localStorage.setItem(storageKeys.systems, JSON.stringify(systems));
    }
  }, [isLoadingDb, systems]);

  useEffect(() => {
    if (!isLoadingDb) {
      window.localStorage.setItem(storageKeys.actions, JSON.stringify(savedActions));
    }
  }, [isLoadingDb, savedActions]);

  const allSystems = useMemo(() => [...systems, ...demoSystems], [systems]);

  const currentSystemActions = useMemo(() => {
    if (!activeSystem) return [];
    return savedActions.filter((item) => item.systemId === activeSystem.id || item.system === activeSystem.name);
  }, [activeSystem, savedActions]);

  const visibleActions = useMemo(() => {
    const source = activeSystem ? currentSystemActions : savedActions;
    return source.filter((item) => {
      const text = `${item.title} ${item.module} ${item.system} ${item.name} ${item.responsible} ${item.description} ${Object.values(item.extraFields || {}).join(' ')}`.toLowerCase();
      const matchesSearch = text.includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'Todas' || item.status === statusFilter;
      const matchesModule = moduleFilter === 'Todos' || item.module === moduleFilter;
      const matchesActiveTab = activeSystem && activeTab !== 'Dashboard' && activeTab !== 'Sócio Digital IA' ? item.module === activeTab : true;
      return matchesSearch && matchesStatus && matchesModule && matchesActiveTab;
    });
  }, [activeSystem, activeTab, currentSystemActions, moduleFilter, savedActions, searchTerm, statusFilter]);

  const currentModuleFields = getModuleFields(activeTab);
  const currentModuleActions = getActionTemplates(activeTab);
  const aiRecommendation = getAiRecommendation(activeSystem, currentSystemActions);

  const metrics = useMemo(() => {
    const pending = savedActions.filter((item) => item.status === 'Pendente').length;
    const inProgress = savedActions.filter((item) => item.status === 'Em andamento').length;
    const done = savedActions.filter((item) => item.status === 'Concluída').length;
    const generatedCount = systems.length;
    return { pending, inProgress, done, generatedCount, totalActions: savedActions.length };
  }, [savedActions, systems.length]);

  const activeModuleStats = useMemo(() => {
    const moduleActions = visibleActions;
    return {
      total: moduleActions.length,
      pending: moduleActions.filter((item) => item.status === 'Pendente').length,
      done: moduleActions.filter((item) => item.status === 'Concluída').length,
    };
  }, [visibleActions]);

  async function generateSystem(model: SystemType) {
    const newSystem: SystemType = {
      ...model,
      id: createId(),
      created: new Date().toLocaleDateString('pt-BR'),
      status: 'Ativo',
    };

    const { data, error } = await supabase
      .from('nexaflow_systems')
      .insert({
        id: newSystem.id,
        name: newSystem.name,
        type: newSystem.type,
        modules: newSystem.modules,
        status: newSystem.status,
        created_label: newSystem.created,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar sistema no Supabase:', error);
      alert('Não consegui salvar no Supabase agora. Vou manter no navegador para não travar seu trabalho.');
      setSystems((prev) => [newSystem, ...prev]);
      setDbMessage('Modo navegador: falha ao salvar sistema no Supabase');
    } else {
      const savedSystem = systemFromDb(data as SystemDbRow);
      setSystems((prev) => [savedSystem, ...prev.filter((item) => item.id !== savedSystem.id)]);
      setActiveSystem(savedSystem);
      setDbMessage('Sistema salvo no Supabase');
      setActiveTab('Dashboard');
      setActiveSection('meus-sistemas');
      return;
    }

    setActiveSystem(newSystem);
    setActiveTab('Dashboard');
    setActiveSection('meus-sistemas');
  }

  function openSystem(system: SystemType, tab = 'Dashboard') {
    setActiveSystem(system);
    setActiveTab(tab);
    setActiveSection('meus-sistemas');
    setSearchTerm('');
    setStatusFilter('Todas');
    setModuleFilter('Todos');
    resetForm();
  }

  function resetForm() {
    setActionForm(emptyForm);
    setActiveAction(null);
    setEditingActionId(null);
  }

  async function saveAction() {
    if (!activeSystem || !activeAction) return;

    if (editingActionId) {
      const updatedAction: SavedActionType = {
        id: editingActionId,
        systemId: activeSystem.id,
        title: activeAction,
        module: activeTab,
        system: activeSystem.name,
        created: savedActions.find((item) => item.id === editingActionId)?.created || new Date().toLocaleString('pt-BR'),
        name: actionForm.name,
        responsible: actionForm.responsible,
        date: actionForm.date,
        priority: actionForm.priority,
        description: actionForm.description,
        status: savedActions.find((item) => item.id === editingActionId)?.status || 'Pendente',
        extraFields: actionForm.extraFields,
      };

      const { error } = await supabase
        .from('nexaflow_actions')
        .update(actionToDbPayload(updatedAction))
        .eq('id', editingActionId);

      if (error) {
        console.error('Erro ao editar ação no Supabase:', error);
        setDbMessage('Modo navegador: falha ao editar ação no Supabase');
      } else {
        setDbMessage('Ação editada no Supabase');
      }

      setSavedActions((prev) => prev.map((item) => (item.id === editingActionId ? { ...item, ...updatedAction } : item)));
      resetForm();
      return;
    }

    const newAction: SavedActionType = {
      id: createId(),
      systemId: activeSystem.id,
      title: activeAction,
      module: activeTab,
      system: activeSystem.name,
      created: new Date().toLocaleString('pt-BR'),
      name: actionForm.name,
      responsible: actionForm.responsible,
      date: actionForm.date,
      priority: actionForm.priority,
      description: actionForm.description,
      status: 'Pendente',
      extraFields: actionForm.extraFields,
    };

    const { error } = await supabase.from('nexaflow_actions').insert(actionToDbPayload(newAction));

    if (error) {
      console.error('Erro ao salvar ação no Supabase:', error);
      alert('Não consegui salvar no Supabase agora. Vou manter no navegador para não travar seu trabalho.');
      setDbMessage('Modo navegador: falha ao salvar ação no Supabase');
    } else {
      setDbMessage('Ação salva no Supabase');
    }

    setSavedActions((prev) => [newAction, ...prev]);
    resetForm();
  }

  function startEdit(action: SavedActionType) {
    setActiveSystem(allSystems.find((system) => system.id === action.systemId || system.name === action.system) ?? activeSystem);
    setActiveTab(action.module);
    setActiveAction(action.title);
    setEditingActionId(action.id);
    setActionForm({
      name: action.name,
      responsible: action.responsible,
      date: action.date,
      priority: action.priority,
      description: action.description,
      extraFields: action.extraFields || {},
    });
  }

  async function updateStatus(actionId: string, status: SavedActionStatus) {
    const { error } = await supabase.from('nexaflow_actions').update({ status }).eq('id', actionId);

    if (error) {
      console.error('Erro ao atualizar status no Supabase:', error);
      setDbMessage('Modo navegador: falha ao atualizar status no Supabase');
    } else {
      setDbMessage('Status atualizado no Supabase');
    }

    setSavedActions((prev) => prev.map((item) => (item.id === actionId ? { ...item, status } : item)));
  }

  async function deleteAction(actionId: string) {
    const { error } = await supabase.from('nexaflow_actions').delete().eq('id', actionId);

    if (error) {
      console.error('Erro ao excluir ação no Supabase:', error);
      setDbMessage('Modo navegador: falha ao excluir ação no Supabase');
    } else {
      setDbMessage('Ação excluída do Supabase');
    }

    setSavedActions((prev) => prev.filter((item) => item.id !== actionId));
  }

  async function clearLocalData() {
    const confirmClear = window.confirm('Tem certeza que deseja limpar dados de teste do navegador e do Supabase?');
    if (!confirmClear) return;

    await supabase.from('nexaflow_actions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('nexaflow_systems').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    setSystems([]);
    setSavedActions([]);
    setActiveSystem(null);
    setActiveTab('Dashboard');
    resetForm();
    window.localStorage.removeItem(storageKeys.systems);
    window.localStorage.removeItem(storageKeys.actions);
    setDbMessage('Dados de teste limpos');
  }

  function buildReportText() {
    const source = activeSystem ? currentSystemActions : savedActions;
    const systemTitle = activeSystem ? activeSystem.name : 'Todos os sistemas';
    const lines = [
      `RELATÓRIO NEXAFLOW AI — ${systemTitle}`,
      `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
      `Total de ações: ${source.length}`,
      `Pendentes: ${source.filter((item) => item.status === 'Pendente').length}`,
      `Em andamento: ${source.filter((item) => item.status === 'Em andamento').length}`,
      `Concluídas: ${source.filter((item) => item.status === 'Concluída').length}`,
      '',
      'AÇÕES:',
      ...source.map((item, index) => `${index + 1}. ${item.title} | ${item.module} | ${item.status} | ${item.name || 'Sem nome'} | ${item.created}`),
    ];

    return lines.join('\n');
  }

  function exportReport() {
    const report = buildReportText();
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-nexaflow-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function copyText(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2200);
  }

  const commercialPitch = `O NexaFlow AI é um sócio digital para empresas. Ele cria sistemas por tipo de negócio, organiza atendimento, vendas, módulos, relatórios e automações. Para rádio e TV, ele controla programação, vinhetas, locutores, anunciantes, comercial, equipe e relatórios em um painel profissional.`;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05060f] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.24),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.16),_transparent_30%)]" />

      <aside className="fixed inset-y-0 left-0 z-20 w-80 overflow-y-auto border-r border-white/10 bg-[#080a18]/90 backdrop-blur-2xl">
        <div className="flex h-full flex-col px-7 py-6">
          <div className="rounded-[2rem] border border-violet-400/20 bg-white/5 p-4 shadow-[0_0_80px_-45px_rgba(139,92,246,0.9)]">
            <p className="text-xs uppercase tracking-[0.35em] text-violet-300">NexaFlow AI</p>
            <h1 className="mt-3 text-2xl font-black tracking-tight">Sócio Digital</h1>
            <p className="mt-2 text-xs leading-5 text-slate-400">Cria, organiza e acelera empresas com IA, sistemas e automação.</p>
          </div>

          <nav className="mt-5 flex-1 space-y-1 overflow-y-auto pr-1 text-sm text-slate-300">
            {menuItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveSection(item.key)}
                className={`w-full rounded-3xl px-4 py-2.5 text-left transition ${
                  activeSection === item.key
                    ? 'bg-gradient-to-r from-violet-500/25 to-cyan-400/10 text-white ring-1 ring-violet-300/20'
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-4 rounded-[2rem] border border-cyan-400/10 bg-cyan-400/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">Modo Segunda-feira</p>
            <p className="mt-2 text-xs leading-5 text-slate-300">TV e Rádio com demo pronta para painel, módulos, ações e proposta comercial.</p>
            <p className="mt-3 rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2 text-[11px] text-emerald-200">{dbMessage}</p>
          </div>
        </div>
      </aside>

      <main className="relative z-10 ml-80 min-h-screen px-10 py-8">
        <header className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-[0_40px_120px_-85px_rgba(99,102,241,0.8)] backdrop-blur-2xl">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-violet-300">{sectionMeta[activeSection].subtitle}</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">{sectionMeta[activeSection].title}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">{sectionMeta[activeSection].description}</p>
            </div>
            <div className="grid min-w-[360px] grid-cols-3 gap-3 text-center">
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-2xl font-black text-cyan-200">{systems.length}</p>
                <p className="mt-1 text-xs text-slate-400">Gerados</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-2xl font-black text-amber-200">{metrics.pending}</p>
                <p className="mt-1 text-xs text-slate-400">Pendentes</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-2xl font-black text-emerald-200">{metrics.done}</p>
                <p className="mt-1 text-xs text-slate-400">Concluídas</p>
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 border-t border-white/10 pt-5">
            <button type="button" onClick={() => setActiveSection('apresentacao')} className="rounded-3xl bg-gradient-to-r from-cyan-300 to-violet-400 px-5 py-3 text-sm font-black text-slate-950">Modo Apresentação</button>
            <button type="button" onClick={() => openSystem(demoSystems[0], 'Dashboard')} className="rounded-3xl border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-black text-cyan-100">Abrir Demo Rádio</button>
            <button type="button" onClick={() => openSystem(demoSystems[1], 'Dashboard')} className="rounded-3xl border border-violet-300/30 bg-violet-300/10 px-5 py-3 text-sm font-black text-violet-100">Abrir Demo TV</button>
            <button type="button" onClick={exportReport} className="rounded-3xl border border-emerald-300/30 bg-emerald-300/10 px-5 py-3 text-sm font-black text-emerald-100">Exportar relatório</button>
          </div>
        </header>

        <div className="mt-8 space-y-8">
          {activeSection === 'dashboard' && (
            <section className="space-y-8">
              <div className="grid gap-5 xl:grid-cols-4">
                {[
                  { label: 'Sistemas prontos', value: `${systems.length + demoSystems.length}`, detail: 'inclui demos TV/Rádio' },
                  { label: 'Ações registradas', value: `${metrics.totalActions}`, detail: 'salvas no navegador' },
                  { label: 'Em andamento', value: `${metrics.inProgress}`, detail: 'operação ativa' },
                  { label: 'Versão', value: 'V10', detail: 'organização final demo' },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-[0_25px_90px_-70px_rgba(56,189,248,0.8)]">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{metric.label}</p>
                    <p className="mt-5 text-4xl font-black">{metric.value}</p>
                    <p className="mt-2 text-sm text-slate-400">{metric.detail}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
                <div className="rounded-[2rem] border border-violet-400/20 bg-[#0d1025]/90 p-7">
                  <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Central de apresentação</p>
                  <h3 className="mt-3 text-3xl font-black">Acesso rápido para mostrar segunda-feira</h3>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button type="button" onClick={() => openSystem(demoSystems[0], 'Vinhetas')} className="rounded-3xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950">Rádio / Vinhetas</button>
                    <button type="button" onClick={() => openSystem(demoSystems[0], 'Locutores')} className="rounded-3xl border border-cyan-300/30 px-5 py-3 text-sm font-black text-cyan-100">Rádio / Locutores</button>
                    <button type="button" onClick={() => openSystem(demoSystems[1], 'Grade de Programação')} className="rounded-3xl border border-violet-300/30 px-5 py-3 text-sm font-black text-violet-100">TV / Grade</button>
                    <button type="button" onClick={() => setActiveSection('apresentacao')} className="rounded-3xl border border-white/10 px-5 py-3 text-sm font-black text-white">Abrir apresentação</button>
                  </div>
                  <div className="mt-6 grid gap-3 md:grid-cols-2">
                    {[
                      'Abrir Demo Rádio Difusora FM',
                      'Cadastrar 3 vinhetas reais',
                      'Cadastrar 2 locutores',
                      'Cadastrar 2 anunciantes teste',
                      'Abrir Demo TV Canal 7.1',
                      'Mostrar relatório e Sócio Digital IA',
                    ].map((task) => (
                      <div key={task} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">✓ {task}</div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-cyan-400/20 bg-cyan-400/5 p-7">
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">Pitch rápido</p>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{commercialPitch}</p>
                  <button
                    type="button"
                    onClick={() => copyText(commercialPitch, 'Pitch copiado')}
                    className="mt-6 rounded-3xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950"
                  >
                    {copiedText === 'Pitch copiado' ? 'Copiado!' : 'Copiar pitch'}
                  </button>
                </div>
              </div>
            </section>
          )}

          {activeSection === 'gerar-sistema' && (
            <section className="rounded-[2rem] border border-violet-500/20 bg-slate-950/70 p-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Gerador de sistemas</p>
                  <h3 className="mt-3 text-3xl font-black">Escolha o segmento e gere a demo</h3>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">Para segunda-feira, priorize Rádio e TV. Os outros segmentos ficam como prova de que a plataforma cria sistemas para qualquer empresa.</p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {generatedSystemOptions.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => generateSystem(model)}
                    className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-left transition hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-cyan-400/10"
                  >
                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">{model.type}</p>
                    <h4 className="mt-3 text-xl font-black">{model.name}</h4>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{model.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {model.modules.slice(0, 4).map((module) => (
                        <span key={module} className="rounded-full bg-violet-400/10 px-3 py-1 text-xs text-violet-100">{module}</span>
                      ))}
                    </div>
                    <span className="mt-6 inline-flex rounded-2xl bg-gradient-to-r from-cyan-300 to-violet-400 px-5 py-3 text-sm font-black text-slate-950">Gerar agora</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {activeSection === 'meus-sistemas' && (
            <section className="space-y-8">
              <div className="rounded-[2rem] border border-cyan-500/20 bg-slate-950/70 p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Sistemas e demos</p>
                    <h3 className="mt-3 text-3xl font-black">Acesse o sistema e cadastre dados reais</h3>
                  </div>
                  <button type="button" onClick={exportReport} className="rounded-3xl border border-emerald-300/30 bg-emerald-300/10 px-5 py-3 text-sm font-black text-emerald-100">Exportar relatório</button>
                </div>

                <div className="mt-8 grid gap-5 lg:grid-cols-2">
                  {allSystems.map((system) => (
                    <div key={system.id} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{system.type}</p>
                          <h4 className="mt-3 text-2xl font-black">{system.name}</h4>
                          <p className="mt-3 text-sm leading-6 text-slate-400">{system.description}</p>
                        </div>
                        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-200">{system.status}</span>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {system.modules.map((module) => (
                          <span key={module} className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">{module}</span>
                        ))}
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => openSystem(system, 'Dashboard')}
                          className="rounded-3xl bg-gradient-to-r from-violet-400 to-cyan-300 px-5 py-3 text-sm font-black text-slate-950"
                        >
                          Acessar painel
                        </button>
                        <button
                          type="button"
                          onClick={() => openSystem(system, 'Sócio Digital IA')}
                          className="rounded-3xl border border-violet-300/30 px-5 py-3 text-sm font-black text-violet-100"
                        >
                          Abrir Sócio IA
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {activeSystem && (
                <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Painel interno</p>
                      <h3 className="mt-3 text-3xl font-black">{activeSystem.name}</h3>
                      <p className="mt-2 text-sm text-slate-400">{activeSystem.type} • {activeSystem.target}</p>
                    </div>
                    <button type="button" onClick={() => setActiveSystem(null)} className="rounded-3xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-300 hover:bg-white/10">Fechar painel</button>
                  </div>

                  <div className="mt-6 grid gap-6 xl:grid-cols-[280px_1fr]">
                    <aside className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Navegação</p>
                      <div className="mt-4 space-y-2">
                        {[{ key: 'Dashboard', label: 'Dashboard' }, ...activeSystem.modules.map((module) => ({ key: module, label: module })), { key: 'Sócio Digital IA', label: 'Sócio Digital IA' }].map((item) => (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => {
                              setActiveTab(item.key);
                              resetForm();
                            }}
                            className={`w-full rounded-3xl border px-4 py-3 text-left text-sm font-bold transition ${activeTab === item.key ? 'border-cyan-300/40 bg-cyan-300/10 text-cyan-100' : 'border-white/10 text-slate-300 hover:bg-white/10'}`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </aside>

                    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                      {activeTab === 'Dashboard' && (
                        <div className="space-y-6">
                          <div className="grid gap-4 md:grid-cols-3">
                            {[
                              { label: 'Ações no sistema', value: currentSystemActions.length },
                              { label: 'Pendentes', value: currentSystemActions.filter((item) => item.status === 'Pendente').length },
                              { label: 'Concluídas', value: currentSystemActions.filter((item) => item.status === 'Concluída').length },
                            ].map((item) => (
                              <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{item.label}</p>
                                <p className="mt-3 text-3xl font-black">{item.value}</p>
                              </div>
                            ))}
                          </div>
                          <div className="rounded-3xl border border-violet-400/20 bg-violet-400/5 p-6">
                            <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Análise rápida</p>
                            <p className="mt-3 text-lg leading-8 text-white">{aiRecommendation}</p>
                          </div>
                        </div>
                      )}

                      {activeTab === 'Sócio Digital IA' && (
                        <div className="space-y-6">
                          <div className="rounded-3xl border border-violet-400/20 bg-violet-400/5 p-6">
                            <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Sócio Digital IA</p>
                            <h4 className="mt-3 text-3xl font-black">Plano inteligente para {activeSystem.type}</h4>
                            <p className="mt-4 text-lg leading-8 text-slate-200">{aiRecommendation}</p>
                          </div>
                          <div className="grid gap-4 md:grid-cols-2">
                            {[
                              'Cadastre dados reais para a demo parecer operação verdadeira.',
                              'Mostre os relatórios para vender organização e controle.',
                              'Use o pitch para explicar que o NexaFlow é sócio digital, não apenas site.',
                              'Depois da apresentação, ofereça implantação + mensalidade de suporte.',
                            ].map((tip) => (
                              <div key={tip} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-sm leading-6 text-slate-300">{tip}</div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeTab !== 'Dashboard' && activeTab !== 'Sócio Digital IA' && (
                        <div className="space-y-6">
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Módulo ativo</p>
                              <h4 className="mt-3 text-3xl font-black">{activeTab}</h4>
                              <p className="mt-2 text-sm text-slate-400">Cadastre dados reais para demonstrar o módulo funcionando.</p>
                            </div>
                            <div className="grid grid-cols-3 gap-3 text-center">
                              <div className="rounded-2xl bg-white/5 p-3"><p className="font-black">{activeModuleStats.total}</p><p className="text-xs text-slate-500">Total</p></div>
                              <div className="rounded-2xl bg-white/5 p-3"><p className="font-black">{activeModuleStats.pending}</p><p className="text-xs text-slate-500">Pend.</p></div>
                              <div className="rounded-2xl bg-white/5 p-3"><p className="font-black">{activeModuleStats.done}</p><p className="text-xs text-slate-500">Concl.</p></div>
                            </div>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            {currentModuleActions.map((action) => (
                              <button
                                key={action}
                                type="button"
                                onClick={() => {
                                  setActiveAction(action);
                                  setEditingActionId(null);
                                  setActionForm(emptyForm);
                                }}
                                className="rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-5 text-left text-sm font-bold text-white transition hover:border-cyan-300/50 hover:bg-cyan-400/10"
                              >
                                {action}
                              </button>
                            ))}
                          </div>

                          {activeAction && (
                            <div className="rounded-[2rem] border border-violet-400/20 bg-violet-400/5 p-6">
                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <p className="text-sm uppercase tracking-[0.3em] text-violet-300">{editingActionId ? 'Editando ação' : 'Nova ação'}</p>
                                  <h5 className="mt-3 text-2xl font-black">{activeAction}</h5>
                                </div>
                                <button type="button" onClick={resetForm} className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/10">Cancelar</button>
                              </div>

                              <div className="mt-6 grid gap-4 md:grid-cols-2">
                                <input value={actionForm.name} onChange={(event) => setActionForm((prev) => ({ ...prev, name: event.target.value }))} placeholder={`Nome em ${activeTab}`} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50" />
                                <input value={actionForm.responsible} onChange={(event) => setActionForm((prev) => ({ ...prev, responsible: event.target.value }))} placeholder="Responsável" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50" />
                                <input value={actionForm.date} onChange={(event) => setActionForm((prev) => ({ ...prev, date: event.target.value }))} placeholder="Data ou horário" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50" />
                                <select value={actionForm.priority} onChange={(event) => setActionForm((prev) => ({ ...prev, priority: event.target.value }))} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50">
                                  <option>Prioridade normal</option>
                                  <option>Prioridade alta</option>
                                  <option>Urgente</option>
                                </select>

                                {currentModuleFields.map((field) => (
                                  <label key={field.key} className="space-y-2">
                                    <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{field.label}</span>
                                    {field.type === 'select' ? (
                                      <select value={actionForm.extraFields[field.label] ?? ''} onChange={(event) => setActionForm((prev) => ({ ...prev, extraFields: { ...prev.extraFields, [field.label]: event.target.value } }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50">
                                        <option value="">Selecione</option>
                                        {(field.options ?? []).map((option) => <option key={option}>{option}</option>)}
                                      </select>
                                    ) : (
                                      <input value={actionForm.extraFields[field.label] ?? ''} onChange={(event) => setActionForm((prev) => ({ ...prev, extraFields: { ...prev.extraFields, [field.label]: event.target.value } }))} placeholder={field.placeholder} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50" />
                                    )}
                                  </label>
                                ))}
                              </div>

                              <textarea value={actionForm.description} onChange={(event) => setActionForm((prev) => ({ ...prev, description: event.target.value }))} placeholder="Descrição, observações ou instruções..." className="mt-4 min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50" />

                              <button type="button" onClick={saveAction} className="mt-5 rounded-2xl bg-gradient-to-r from-cyan-300 to-violet-400 px-6 py-3 text-sm font-black text-slate-950">
                                {editingActionId ? 'Salvar edição' : 'Salvar ação'}
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-8 rounded-[2rem] border border-white/10 bg-slate-950/60 p-5">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Ações salvas</p>
                            <p className="mt-2 text-sm text-slate-400">Busque, filtre, edite, conclua ou exclua registros.</p>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Buscar ação..." className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500" />
                            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'Todas' | SavedActionStatus)} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none">
                              <option>Todas</option>
                              <option>Pendente</option>
                              <option>Em andamento</option>
                              <option>Concluída</option>
                            </select>
                            <select value={moduleFilter} onChange={(event) => setModuleFilter(event.target.value)} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none">
                              <option>Todos</option>
                              {(activeSystem?.modules ?? []).map((module) => <option key={module}>{module}</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="mt-5 space-y-3">
                          {visibleActions.length === 0 ? (
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-400">Nenhuma ação encontrada.</div>
                          ) : (
                            visibleActions.map((item) => (
                              <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                                  <div>
                                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{item.module} • {item.system}</p>
                                    <h5 className="mt-2 text-lg font-black">{item.title}</h5>
                                    <p className="mt-2 text-xs text-slate-500">Criado em {item.created}</p>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    <select value={item.status} onChange={(event) => updateStatus(item.id, event.target.value as SavedActionStatus)} className="rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-white outline-none">
                                      <option>Pendente</option>
                                      <option>Em andamento</option>
                                      <option>Concluída</option>
                                    </select>
                                    <button type="button" onClick={() => startEdit(item)} className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 px-3 py-2 text-xs font-bold text-cyan-100">Editar</button>
                                    <button type="button" onClick={() => deleteAction(item.id)} className="rounded-2xl border border-red-400/20 bg-red-400/5 px-3 py-2 text-xs font-bold text-red-100">Excluir</button>
                                  </div>
                                </div>

                                <div className="mt-4 grid gap-2 text-xs text-slate-300 md:grid-cols-2 xl:grid-cols-4">
                                  {formatActionDetails(item).map((detail) => <p key={detail}>{detail}</p>)}
                                </div>
                                {item.description && <p className="mt-4 rounded-2xl bg-black/20 p-4 text-sm leading-6 text-slate-300">{item.description}</p>}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </section>
          )}

          {activeSection === 'relatorios' && (
            <section className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/5 p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Relatório executivo</p>
              <h3 className="mt-3 text-3xl font-black">Resumo para apresentar</h3>
              <div className="mt-6 grid gap-4 md:grid-cols-4">
                {[
                  { label: 'Sistemas criados', value: systems.length },
                  { label: 'Ações totais', value: metrics.totalActions },
                  { label: 'Pendentes', value: metrics.pending },
                  { label: 'Concluídas', value: metrics.done },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{item.label}</p>
                    <p className="mt-3 text-3xl font-black">{item.value}</p>
                  </div>
                ))}
              </div>
              <button type="button" onClick={exportReport} className="mt-6 rounded-3xl bg-emerald-300 px-6 py-3 text-sm font-black text-slate-950">Baixar relatório TXT</button>
            </section>
          )}

          {activeSection === 'apresentacao' && (
            <section className="rounded-[2rem] border border-violet-400/20 bg-[#0d1025]/95 p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Apresentação rápida</p>
              <h3 className="mt-4 max-w-4xl text-5xl font-black leading-tight">NexaFlow AI: o sócio digital que cria, organiza e acelera empresas.</h3>
              <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">Para rádio e TV, o NexaFlow organiza programação, equipe, vinhetas, jornalismo, anunciantes, comercial e relatórios em um painel moderno. Para outros negócios, cria módulos específicos conforme o segmento.</p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {['Sistema pronto por segmento', 'Dados reais salvos no painel', 'Relatórios para decisão e venda'].map((item) => (
                  <div key={item} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-lg font-black">{item}</div>
                ))}
              </div>
              <div className="mt-8 rounded-[2rem] border border-cyan-300/20 bg-cyan-300/5 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">Roteiro de 2 minutos</p>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {['1. Mostrar a Central de Comando', '2. Abrir Demo Rádio Difusora FM', '3. Mostrar Vinhetas, Locutores e Anunciantes', '4. Abrir Demo TV Canal 7.1', '5. Mostrar relatório e Sócio Digital IA', '6. Fechar com implantação + mensalidade'].map((step) => (
                    <div key={step} className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm font-bold text-slate-200">{step}</div>
                  ))}
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={() => openSystem(demoSystems[0], 'Dashboard')} className="rounded-3xl bg-gradient-to-r from-cyan-300 to-violet-400 px-6 py-3 text-sm font-black text-slate-950">Abrir Demo Rádio</button>
                <button type="button" onClick={() => openSystem(demoSystems[1], 'Dashboard')} className="rounded-3xl border border-cyan-300/30 px-6 py-3 text-sm font-black text-cyan-100">Abrir Demo TV</button>
                <button type="button" onClick={() => copyText(commercialPitch, 'Texto copiado')} className="rounded-3xl border border-white/10 px-6 py-3 text-sm font-black text-white">{copiedText === 'Texto copiado' ? 'Copiado!' : 'Copiar apresentação'}</button>
                <button type="button" onClick={exportReport} className="rounded-3xl border border-emerald-300/30 px-6 py-3 text-sm font-black text-emerald-100">Exportar relatório</button>
              </div>
            </section>
          )}

          {activeSection === 'clientes' && (
            <section className="grid gap-6 xl:grid-cols-3">
              {['Rádio/TV local', 'Hamburguerias e delivery', 'Lojas e supermercados'].map((segment) => (
                <div key={segment} className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Segmento</p>
                  <h3 className="mt-3 text-2xl font-black">{segment}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">Use as demos prontas para abrir conversa, mostrar painel e oferecer implantação.</p>
                </div>
              ))}
            </section>
          )}

          {activeSection === 'assinaturas' && (
            <section className="grid gap-6 xl:grid-cols-3">
              {[
                { plan: 'Start', price: 'R$ 497', desc: 'Implantação simples + painel demo' },
                { plan: 'Pro', price: 'R$ 997', desc: 'Sistema completo + treinamento' },
                { plan: 'Premium', price: 'R$ 1.997+', desc: 'Sistema + automações + suporte mensal' },
              ].map((plan) => (
                <div key={plan.plan} className="rounded-[2rem] border border-violet-400/20 bg-violet-400/5 p-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-violet-300">{plan.plan}</p>
                  <h3 className="mt-3 text-4xl font-black">{plan.price}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{plan.desc}</p>
                </div>
              ))}
            </section>
          )}

          {activeSection === 'ia-atendimento' && (
            <section className="rounded-[2rem] border border-cyan-400/20 bg-cyan-400/5 p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">IA Atendimento</p>
              <h3 className="mt-3 text-3xl font-black">Fluxos prontos para WhatsApp e atendimento</h3>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {['Boas-vindas automática', 'Resposta para orçamento', 'Confirmação de pedido', 'Recuperação de cliente parado'].map((flow) => (
                  <div key={flow} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-sm font-bold">{flow}</div>
                ))}
              </div>
            </section>
          )}

          {activeSection === 'automacao' && (
            <section className="rounded-[2rem] border border-cyan-400/20 bg-slate-950/70 p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Automação</p>
              <h3 className="mt-3 text-3xl font-black">Rotinas automáticas para empresas</h3>
              <div className="mt-6 space-y-3">
                {['Quando cadastrar anunciante → criar lembrete de renovação', 'Quando pedido sair → enviar mensagem ao cliente', 'Quando estoque ficar baixo → gerar alerta', 'Toda semana → gerar relatório executivo'].map((flow) => (
                  <div key={flow} className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">{flow}</div>
                ))}
              </div>
            </section>
          )}

          {activeSection === 'configuracoes' && (
            <section className="rounded-[2rem] border border-red-400/20 bg-red-400/5 p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-red-200">Configurações</p>
              <h3 className="mt-3 text-3xl font-black">Controle local</h3>
              <p className="mt-3 text-sm text-slate-300">Use limpar dados apenas se quiser zerar os testes salvos neste navegador.</p>
              <button type="button" onClick={clearLocalData} className="mt-6 rounded-3xl bg-red-400 px-6 py-3 text-sm font-black text-slate-950">Limpar dados teste</button>
            </section>
          )}

          {activeSection === 'ajuda' && (
            <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Roteiro de apresentação</p>
              <h3 className="mt-3 text-3xl font-black">Como mostrar sem se perder</h3>
              <ol className="mt-6 space-y-3 text-sm leading-7 text-slate-300">
                <li>1. Abra Apresentação e fale a frase principal do NexaFlow.</li>
                <li>2. Abra Meus Sistemas e escolha Demo Rádio ou Demo TV.</li>
                <li>3. Mostre módulos: Vinhetas, Locutores, Programação, Comercial.</li>
                <li>4. Cadastre uma ação ao vivo para provar que funciona.</li>
                <li>5. Mostre Ações Salvas, filtros, editar, status e relatório.</li>
                <li>6. Finalize oferecendo implantação + mensalidade.</li>
              </ol>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
