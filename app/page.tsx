export default function Home() {
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
            <button className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_20px_50px_-30px_rgba(168,85,247,0.9)] transition hover:brightness-110">
              Gerar Sistema
            </button>
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
                <h3 className="mt-4 text-2xl font-semibold text-white">Seu parceiro estratégico</h3>
                <p className="mt-4 text-sm leading-6 text-slate-400">
                  O assistente NexaFlow IA ajuda a identificar oportunidades, melhorar taxas de conversão e multiplicar receitas com modelos e automações avançadas.
                </p>
                <div className="mt-6 rounded-3xl bg-[#151a37]/90 p-5 text-sm text-slate-300 ring-1 ring-violet-500/10">
                  <p className="font-semibold text-white">Funções ativas</p>
                  <ul className="mt-4 space-y-3">
                    <li>• Diagnóstico de fluxo comercial</li>
                    <li>• Acompanhamento de resultados</li>
                    <li>• Projeções de crescimento</li>
                    <li>• Atendimento conversacional</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-[#111827]/95 p-6 shadow-[0_0_40px_-30px_rgba(0,0,0,0.4)]">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Resumo rápido</p>
                <div className="mt-5 space-y-4">
                  <div className="rounded-3xl border border-violet-500/5 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Nova oportunidade</p>
                    <p className="mt-2 text-lg font-semibold text-white">Integração com CRM</p>
                  </div>
                  <div className="rounded-3xl border border-cyan-500/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Meta do mês</p>
                    <p className="mt-2 text-lg font-semibold text-white">5x mais conversões</p>
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
