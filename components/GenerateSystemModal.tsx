'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

type GenerateSystemModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

type SystemModules = {
  [key: string]: {
    modules: string[];
    description: string;
  };
};

const systemModules: SystemModules = {
  ecommerce: {
    modules: ['Catálogo de Produtos', 'Carrinho de Compras', 'Pagamento', 'Gestão de Pedidos', 'Avaliações e Comentários'],
    description: 'Sistema completo para loja virtual com integração de pagamentos e gestão de estoque',
  },
  agencia: {
    modules: ['Portal de Portfólio', 'Gestão de Projetos', 'CRM de Clientes', 'Faturamento', 'Relatórios de Performance'],
    description: 'Plataforma para gerenciar clientes, projetos e resultados de agência criativa',
  },
  saas: {
    modules: ['Dashboard Administrativo', 'Gestão de Usuários', 'Planos e Subscrição', 'Analytics', 'Suporte via Chat'],
    description: 'Infraestrutura SaaS com controle de acesso e sistema de cobrança recorrente',
  },
  consultoria: {
    modules: ['Agenda de Consultas', 'Relatórios de Diagnóstico', 'Gestão de Clientes', 'Documentação', 'Autoatendimento'],
    description: 'Plataforma para consultores gerenciarem clientes e documentação',
  },
  educacao: {
    modules: ['Plataforma de Cursos', 'Gestão de Alunos', 'Certificados', 'Videoaulas', 'Avaliações e Testes'],
    description: 'LMS completo para cursos online e treinamentos corporativos',
  },
  restaurante: {
    modules: ['Cardápio Digital', 'Pedidos Online', 'Reservas', 'Gestão de Mesas', 'Programa de Fidelidade'],
    description: 'Sistema para restaurantes com pedidos online e gestão operacional',
  },
  inmobiliaria: {
    modules: ['Catálogo de Imóveis', 'Agenda de Visitação', 'CRM de Clientes', 'Documentação', 'Simulador de Financiamento'],
    description: 'Plataforma para imobiliárias gerenciar propriedades e clientes',
  },
  startup: {
    modules: ['Landing Page', 'Blog', 'Gestão de Leads', 'Email Marketing', 'Analytics e Conversão'],
    description: 'Kit completo para startups crescerem e capturarem clientes',
  },
};

export default function GenerateSystemModal({ isOpen, setIsOpen }: GenerateSystemModalProps) {
  const [companyType, setCompanyType] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    setShowPreview(false);
    setCompanyType('');
  };

  const handleGeneratePreview = () => {
    if (companyType.trim()) {
      setShowPreview(true);
    }
  };

  const getSystemData = () => {
    const key = companyType.toLowerCase().replace(/\s+/g, '');
    return systemModules[key] || {
      modules: ['Dashboard', 'Gestão de Dados', 'Relatórios', 'Automações', 'Integrações'],
      description: `Sistema personalizado para ${companyType}`,
    };
  };

  const systemData = getSystemData();

  return (
    <>
      {/* Botão para abrir modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_20px_50px_-30px_rgba(168,85,247,0.9)] transition hover:brightness-110"
      >
        Gerar Sistema
      </button>

      {/* Modal de fundo */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        />
      )}

      {/* Modal principal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-y-auto p-4">
          <div
            className="relative w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[#0b0d17]/95 p-8 shadow-[0_20px_60px_-20px_rgba(139,92,246,0.8)] backdrop-blur-xl max-h-[calc(100vh-3rem)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="generate-system-title"
          >
            {/* Botão fechar */}
            <button
              onClick={handleClose}
              className="absolute right-6 top-6 rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
            >
              <X size={24} />
            </button>

            {!showPreview ? (
              <>
                {/* Conteúdo inicial */}
                <div className="mb-8">
                  <p className="text-sm uppercase tracking-[0.3em] text-violet-300/80">Gerar Sistema Personalizado</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">
                    Qual é o tipo da sua empresa?
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Descreva o segmento ou tipo de negócio para receber uma prévia personalizada do seu sistema.
                  </p>
                </div>

                {/* Campo de entrada */}
                <div className="mb-6 space-y-4">
                  <input
                    type="text"
                    placeholder="Ex: E-commerce, Agência, SaaS, Consultoria..."
                    value={companyType}
                    onChange={(e) => setCompanyType(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleGeneratePreview();
                    }}
                    className="w-full rounded-[1.5rem] border border-violet-500/30 bg-white/5 px-5 py-4 text-white placeholder:text-slate-500 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition"
                  />

                  {/* Exemplos de sugestões */}
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {Object.keys(systemModules).map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setCompanyType(type.charAt(0).toUpperCase() + type.slice(1));
                        }}
                        className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 hover:border-violet-400/50 hover:bg-violet-400/10 hover:text-violet-300 transition capitalize"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 rounded-3xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleGeneratePreview}
                    disabled={!companyType.trim()}
                    className="flex-1 rounded-3xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_20px_50px_-30px_rgba(168,85,247,0.9)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Ver Prévia
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Prévia do sistema */}
                <div className="mb-8">
                  <p className="text-sm uppercase tracking-[0.3em] text-violet-300/80">Prévia do Sistema</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">
                    Sistema para {companyType}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    {systemData.description}
                  </p>
                </div>

                {/* Módulos */}
                <div className="mb-8 space-y-4">
                  <p className="text-sm font-semibold text-slate-300">Módulos inclusos:</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {systemData.modules.map((module) => (
                      <div
                        key={module}
                        className="rounded-[1.5rem] border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 p-4 shadow-[0_0_25px_-12px_rgba(139,92,246,0.4)]"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1 h-2 w-2 rounded-full bg-violet-400" />
                          <div>
                            <p className="font-semibold text-white">{module}</p>
                            <p className="mt-1 text-xs text-slate-400">
                              Funcionalidade completa incluída
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Características adicionais */}
                <div className="mb-8 rounded-[1.5rem] border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-5">
                  <p className="text-sm font-semibold text-cyan-300">Funcionalidades Premium Inclusos:</p>
                  <div className="mt-3 grid gap-2 text-sm text-slate-300">
                    <span>✓ Geração 24/7 com IA</span>
                    <span>✓ Deploy instantâneo em produção</span>
                    <span>✓ Suporte e manutenção por 3 meses</span>
                    <span>✓ Relatórios de performance automáticos</span>
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowPreview(false);
                      setCompanyType('');
                    }}
                    className="flex-1 rounded-3xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={() => {
                      alert(`Sistema para ${companyType} criado com sucesso!`);
                      handleClose();
                    }}
                    className="flex-1 rounded-3xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_20px_50px_-30px_rgba(16,185,129,0.9)] hover:brightness-110 transition"
                  >
                    Criar Sistema Completo
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
