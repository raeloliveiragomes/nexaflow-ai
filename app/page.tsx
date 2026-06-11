"use client";

import { useState } from 'react';
import GenerateSystemModal from '@/components/GenerateSystemModal';

type SystemType = {
  name: string;
  type: string;
  modules: string[];
  created: string;
  status: string;
};

const mySystems: SystemType[] = [
  {
    name: 'Nexa CRM 360',
    type: 'E-commerce',
    modules: ['Catálogo', 'Carrinho', 'Pagamento'],
    created: '04 Jun 2026',
    status: 'Ativo',
  },
  {
    name: 'Flow Analytics',
    type: 'SaaS',
    modules: ['Dashboard', 'Usuários', 'Analytics'],
    created: '28 Mai 2026',
    status: 'Ativo',
  },
  {
    name: 'Smart Lead Bot',
    type: 'Agência',
    modules: ['CRM', 'Fluxo de Leads', 'Chat'],
    created: '19 Mai 2026',
    status: 'Ativo',
  },
];

export default function Home() {
  const [activeSystem, setActiveSystem] = useState<SystemType | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'vendas' | 'clientes' | 'pedidos' | 'estoque' | 'relatorios' | 'socio'>('dashboard');

  return (
    <div className="min-h-screen bg-[#05060f] text-white">
      <div className="fixed inset-y-0 left-0 w-80 border-r border-white/10 bg-[#0b0d17]/90 backdrop-blur-xl shadow-2xl shadow-violet-950/20">
        <div className="flex h-full flex-col px-8 py-10">
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 rounded-3xl border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-200 shadow-[0_0_40px_-30px_rgba(139,92,246,0.8)]">
              <span className="h-2.5 w-2.5 rounded-full bg-violet-400" />
              NexaFlow AI Premium
            </div>
            <h1 className="mt-8 text-3xl font-semibold tracking-tight text-white">
              Painel Admin
            </h1>
            <p className="mt-3 max-w-[260px] text-sm text-slate-400">
              Controle seus sistemas IA, métricas e geração de soluções digitais com estilo neon.
            </p>
          </div>

          <nav className="space-y-2 text-sm text-slate-300">
            {[
              { label: "Dashboard", active: true },
              { label: "Sistemas", active: false },
              { label: "Métricas", active: false },
              { label: "Relatórios", active: false },
              { label: "Configurações", active: false },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-3xl px-4 py-3 transition ${item.active ? "bg-violet-500/15 text-violet-200 shadow-[0_0_25px_-12px_rgba(139,92,246,0.8)]" : "hover:bg-white/5 hover:text-white"}`}
              >
                {item.label}
              </div>
            ))}
          </nav>

          <div className="mt-auto rounded-3xl border border-violet-500/10 bg-white/5 p-5 shadow-[0_0_40px_-30px_rgba(139,92,246,0.8)]">
            <p className="text-xs uppercase tracking-[0.3em] text-violet-300/80">
              Conta Premium
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-200">
                NF
              </div>
              <div>
                <p className="font-semibold text-white">Admin NexaFlow</p>
                <p className="text-sm text-slate-400">Acesso total</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ml-80 min-h-screen px-10 py-8">
        <div className="flex flex-col gap-8">
          <header className="flex items-center justify-between rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-violet-300/80">Admin</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Dashboard SaaS</h2>
              <p className="mt-2 text-sm text-slate-400">
                Monitoramento em tempo real dos seus sistemas gerados e resultados premium.
              </p>
            </div>
            <GenerateSystemModal />
          </header>

          <section className="grid gap-6 xl:grid-cols-[repeat(4,minmax(0,1fr))]">
            {[
              { value: "1.248", label: "Sistemas Gerados", change: "+18%" },
              { value: "92,4%", label: "Taxa de Conversão", change: "+9%" },
              { value: "R$ 487K", label: "Receita Mensal", change: "+12%" },
              { value: "74,1%", label: "Engajamento IA", change: "+27%" },
            ].map((metric) => (
              <div key={metric.label} className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_0_40px_-26px_rgba(139,92,246,0.6)]">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">{metric.label}</p>
                <div className="mt-6 flex items-end justify-between gap-4">
                  <p className="text-4xl font-semibold text-white">{metric.value}</p>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </section>

          <section className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_0_40px_-30px_rgba(139,92,246,0.55)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-violet-300/80">Meus Sistemas</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">Sistemas gerados recentemente</h3>
                </div>
                <button className="rounded-3xl border border-violet-500/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition">
                  Ver todos
                </button>
              </div>

              <div className="mt-8 grid gap-5 lg:grid-cols-3">
                {[
                  {
                    name: "Nexa CRM 360",
                    type: "E-commerce",
                    modules: ["Catálogo", "Carrinho", "Pagamento"],
                    created: "04 Jun 2026",
                    status: "Ativo",
                  },
                  {
                    name: "Flow Analytics",
                    type: "SaaS",
                    modules: ["Dashboard", "Usuários", "Analytics"],
                    created: "28 Mai 2026",
                    status: "Ativo",
                  },
                  {
                    name: "Smart Lead Bot",
                    type: "Agência",
                    modules: ["CRM", "Fluxo de Leads", "Chat"],
                    created: "19 Mai 2026",
                    status: "Ativo",
                  },
                ].map((system) => (
                  <div key={system.name} className="rounded-[1.75rem] border border-white/10 bg-[#0f1227]/95 p-6 shadow-[0_0_30px_-15px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:border-violet-500/20">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{system.type}</p>
                        <h4 className="mt-3 text-xl font-semibold text-white">{system.name}</h4>
                      </div>
                      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-200">
                        {system.status}
                      </span>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {system.modules.map((module) => (
                        <span key={module} className="rounded-2xl bg-white/5 px-3 py-2 text-xs text-slate-300">
                          {module}
                        </span>
                      ))}
                    </div>
                    <p className="mt-5 text-sm text-slate-400">Criado em {system.created}</p>
                    <button
                      onClick={() => {
                        setActiveSystem(system);
                        setActiveTab('dashboard');
                      }}
                      className="mt-6 inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_20px_50px_-30px_rgba(168,85,247,0.9)] hover:brightness-110 transition"
                    >
                      Acessar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {activeSystem && (
            <section className="rounded-[2rem] border border-white/10 bg-[#10152a]/95 p-6 shadow-[0_0_40px_-30px_rgba(139,92,246,0.55)]">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-violet-300/80">Painel interno</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">{activeSystem.name}</h3>
                  <p className="mt-2 text-sm text-slate-400">{activeSystem.type} • Criado em {activeSystem.created}</p>
                </div>
                <button
                  onClick={() => setActiveSystem(null)}
                  className="rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  Fechar painel
                </button>
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-[280px_1fr]">
                <aside className="rounded-[1.75rem] border border-white/10 bg-[#0b0f1f]/95 p-5">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Navegação</p>
                  <div className="mt-4 space-y-2">
                    {[
                      { key: 'dashboard', label: 'Dashboard' },
                      { key: 'vendas', label: 'Vendas' },
                      { key: 'clientes', label: 'Clientes' },
                      { key: 'pedidos', label: 'Pedidos' },
                      { key: 'estoque', label: 'Estoque' },
                      { key: 'relatorios', label: 'Relatórios' },
                      { key: 'socio', label: 'Sócio Digital IA' },
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setActiveTab(item.key as typeof activeTab)}
                        className={`w-full rounded-3xl px-4 py-3 text-left text-sm font-medium transition ${activeTab === item.key ? 'bg-violet-500/15 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </aside>

                <main className="rounded-[1.75rem] border border-white/10 bg-[#11172e]/95 p-6">
                  {activeTab === 'dashboard' && (
                    <>
                      <div className="grid gap-4 sm:grid-cols-3">
                        {[
                          { label: 'Visitas', value: '28.7K' },
                          { label: 'Leads', value: '1.590' },
                          { label: 'Taxa de Conversão', value: '8,4%' },
                        ].map((item) => (
                          <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-[#0f1227]/90 p-4">
                            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{item.label}</p>
                            <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 rounded-[1.75rem] border border-violet-500/10 bg-gradient-to-br from-[#130f2f] via-[#1f1841] to-[#100d20] p-6">
                        <p className="text-sm text-slate-400">Resumo do sistema</p>
                        <p className="mt-4 text-lg font-medium text-white">
                          Este painel reúne vendas, clientes e estoque para aumentar a eficiência operacional e melhorar resultados comerciais.
                        </p>
                      </div>
                    </>
                  )}

                  {activeTab === 'vendas' && (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[1.5rem] border border-white/10 bg-[#0f1227]/90 p-4">
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Receita</p>
                          <p className="mt-3 text-2xl font-semibold text-white">R$ 184.500</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-white/10 bg-[#0f1227]/90 p-4">
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Pedidos</p>
                          <p className="mt-3 text-2xl font-semibold text-white">612</p>
                        </div>
                      </div>
                      <div className="mt-6 space-y-3">
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Principais recomendações</p>
                        <ul className="space-y-2 text-slate-300">
                          <li>• Use campanhas de follow-up para aumentar o ticket médio.</li>
                          <li>• Ative ofertas de upsell no checkout.</li>
                          <li>• Priorize vendas recorrentes com planos e assinaturas.</li>
                        </ul>
                      </div>
                    </>
                  )}

                  {activeTab === 'clientes' && (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[1.5rem] border border-white/10 bg-[#0f1227]/90 p-4">
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Clientes ativos</p>
                          <p className="mt-3 text-2xl font-semibold text-white">1.220</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-white/10 bg-[#0f1227]/90 p-4">
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Novos</p>
                          <p className="mt-3 text-2xl font-semibold text-white">143</p>
                        </div>
                      </div>
                      <div className="mt-6 space-y-3">
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Ações recomendadas</p>
                        <ul className="space-y-2 text-slate-300">
                          <li>• Segmente e personalize ofertas para clientes VIP.</li>
                          <li>• Automatize o pós-venda com mensagens inteligentes.</li>
                          <li>• Implemente pesquisas de satisfação em tempo real.</li>
                        </ul>
                      </div>
                    </>
                  )}

                  {activeTab === 'pedidos' && (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[1.5rem] border border-white/10 bg-[#0f1227]/90 p-4">
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Pedidos em aberto</p>
                          <p className="mt-3 text-2xl font-semibold text-white">48</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-white/10 bg-[#0f1227]/90 p-4">
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Envios hoje</p>
                          <p className="mt-3 text-2xl font-semibold text-white">27</p>
                        </div>
                      </div>
                      <div className="mt-6 space-y-3">
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Controle de pedidos</p>
                        <ul className="space-y-2 text-slate-300">
                          <li>• Automatize notificações de pedido e rastreamento.</li>
                          <li>• Priorize pedidos com potencial de recompra.</li>
                          <li>• Ajuste processos para reduzir tempo de atendimento.</li>
                        </ul>
                      </div>
                    </>
                  )}

                  {activeTab === 'estoque' && (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[1.5rem] border border-white/10 bg-[#0f1227]/90 p-4">
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Itens baixos</p>
                          <p className="mt-3 text-2xl font-semibold text-white">12</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-white/10 bg-[#0f1227]/90 p-4">
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Repostos hoje</p>
                          <p className="mt-3 text-2xl font-semibold text-white">8</p>
                        </div>
                      </div>
                      <div className="mt-6 space-y-3">
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Gestão de estoque</p>
                        <ul className="space-y-2 text-slate-300">
                          <li>• Receba alertas automáticos de produtos no fim do estoque.</li>
                          <li>• Sincronize estoque com pedidos em tempo real.</li>
                          <li>• Otimize compras com relatórios de giro.</li>
                        </ul>
                      </div>
                    </>
                  )}

                  {activeTab === 'relatorios' && (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[1.5rem] border border-white/10 bg-[#0f1227]/90 p-4">
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Último relatório</p>
                          <p className="mt-3 text-2xl font-semibold text-white">Semana de vendas</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-white/10 bg-[#0f1227]/90 p-4">
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Performance</p>
                          <p className="mt-3 text-2xl font-semibold text-white">+14% ROI</p>
                        </div>
                      </div>
                      <div className="mt-6 rounded-[1.75rem] border border-cyan-500/20 bg-[#09202f]/95 p-5">
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Relatórios disponíveis</p>
                        <ul className="mt-4 space-y-2 text-slate-300">
                          <li>• Vendas por canal</li>
                          <li>• Desempenho por produto</li>
                          <li>• Fluxo de clientes e conversões</li>
                        </ul>
                      </div>
                    </>
                  )}

                  {activeTab === 'socio' && (
                    <>
                      <div className="rounded-[1.75rem] border border-violet-500/10 bg-[#130f2f]/95 p-6">
                        <p className="text-sm uppercase tracking-[0.3em] text-violet-300/80">Sócio Digital IA</p>
                        <p className="mt-4 text-lg font-medium text-white">
                          Recomendação estratégica para vender mais, automatizar atendimento, controlar estoque e melhorar resultados.
                        </p>
                      </div>
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        {[
                          { title: 'Vendas', detail: 'Aumente ticket médio com ofertas segmentadas.' },
                          { title: 'Atendimento', detail: 'Implemente chatbots para suporte 24/7.' },
                          { title: 'Estoque', detail: 'Sincronize estoque em tempo real com vendas.' },
                          { title: 'Resultados', detail: 'Monitore KPIs e ajuste rapidamente.' },
                        ].map((item) => (
                          <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-[#0f1227]/90 p-4">
                            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{item.title}</p>
                            <p className="mt-3 text-sm text-slate-200">{item.detail}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </main>
              </div>
            </section>
          )}

          <section className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-violet-500/10 bg-[#10122a]/80 p-6 shadow-[0_0_40px_-30px_rgba(99,102,241,0.5)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-violet-300/70">Sistemas Gerados</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">Últimos lançamentos</h3>
                  </div>
                  <span className="rounded-3xl bg-white/5 px-4 py-2 text-sm text-slate-300">Ativo</span>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {[
                    { name: "Nexa CRM 360", desc: "Automação de vendas e suporte IA" },
                    { name: "Flow Analytics", desc: "Painel de performance em tempo real" },
                    { name: "Smart Lead Bot", desc: "Gerador de prospecção inteligente" },
                    { name: "Conversor de Pitch", desc: "Pitch CV para fechamento rápido" },
                  ].map((system) => (
                    <div key={system.name} className="rounded-3xl border border-white/10 bg-slate-900/90 p-4 transition hover:border-violet-400/40 hover:bg-slate-800/90">
                      <p className="font-semibold text-white">{system.name}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{system.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-6 shadow-[0_0_40px_-28px_rgba(139,92,246,0.45)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-violet-300/70">Prévia do Sistema</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">NexaFlow AI Pro</h3>
                  </div>
                  <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-violet-200">Demo</span>
                </div>

                <div className="mt-6 rounded-[1.75rem] border border-violet-500/10 bg-gradient-to-br from-[#130f2f] via-[#1f1841] to-[#100d20] p-6 shadow-[inset_0_0_40px_rgba(139,92,246,0.2)]">
                  <p className="text-sm text-slate-400">Painel Inteligente</p>
                  <p className="mt-4 text-lg font-medium text-white">
                    “Crie fluxos de atendimento, automações e assistentes digitais com emissão automática de relatórios e análise de performance.”
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[
                      "Geração 24/7",
                      "Insights automáticos",
                      "Templates premium",
                      "Deploy instantâneo",
                    ].map((item) => (
                      <span key={item} className="rounded-2xl bg-white/5 px-4 py-2 text-xs text-slate-300">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[2rem] border border-violet-500/10 bg-[#0f1227]/90 p-6 shadow-[0_0_40px_-30px_rgba(139,92,246,0.55)]">
                <p className="text-sm uppercase tracking-[0.3em] text-violet-300/80">Sócio Digital IA</p>
                <h3 className="mt-4 text-2xl font-semibold text-white">Análise do sistema gerado</h3>
                <p className="mt-4 text-sm leading-6 text-slate-400">
                  O assistente NexaFlow IA analisa o sistema gerado e mostra recomendações inteligentes para vender mais, automatizar atendimento, controlar estoque e melhorar resultados.
                </p>
                <div className="mt-6 rounded-3xl bg-[#151a37]/90 p-5 text-sm text-slate-300 ring-1 ring-violet-500/10">
                  <p className="font-semibold text-white">Recomendações inteligentes</p>
                  <ul className="mt-4 space-y-3">
                    <li>• Estratégias para aumentar vendas com funis e upsell</li>
                    <li>• Automação do atendimento com chatbots e fluxo de mensagens</li>
                    <li>• Controle de estoque em tempo real para evitar rupturas</li>
                    <li>• Ajustes de performance para melhorar conversão e retenção</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-[#111827]/95 p-6 shadow-[0_0_40px_-30px_rgba(0,0,0,0.4)]">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Resumo rápido</p>
                <div className="mt-5 space-y-4">
                  <div className="rounded-3xl border border-violet-500/5 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Oportunidade de vendas</p>
                    <p className="mt-2 text-lg font-semibold text-white">Reforce campanhas de cross-sell</p>
                  </div>
                  <div className="rounded-3xl border border-cyan-500/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Melhoria de atendimento</p>
                    <p className="mt-2 text-lg font-semibold text-white">Use chat automático para pedidos e suporte</p>
                  </div>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </div>
    </div>
  );
}
