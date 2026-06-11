"use client";

import { useMemo, useState } from "react";

type GeneratedSystem = {
  name: string;
  type: string;
  status: string;
  modules: string[];
  createdAt: string;
};

type GenerateSystemModalProps = {
  isOpen?: boolean;
  onClose?: () => void;
  onCreateSystem?: (system: GeneratedSystem) => void;
  onSystemCreated?: (system: GeneratedSystem) => void;
  onCreate?: (system: GeneratedSystem) => void;
  [key: string]: unknown;
};

const systemTemplates: Record<string, string[]> = {
  restaurante: [
    "Pedidos e Delivery",
    "Cardápio Digital",
    "Gestão de Mesas",
    "Controle de Caixa",
    "Clientes e Fidelidade",
    "Sócio Digital IA",
  ],
  hamburgueria: [
    "Pedidos Online",
    "Cardápio de Combos",
    "Delivery",
    "Controle de Cozinha",
    "Cupons e Promoções",
    "Sócio Digital IA",
  ],
  supermercado: [
    "Produtos e Estoque",
    "PDV",
    "Fornecedores",
    "Fluxo de Caixa",
    "Relatórios Financeiros",
    "Sócio Digital IA",
  ],
  mercado: [
    "Produtos e Estoque",
    "PDV",
    "Fornecedores",
    "Fluxo de Caixa",
    "Relatórios Financeiros",
    "Sócio Digital IA",
  ],
  clinica: [
    "Agenda de Consultas",
    "Pacientes",
    "Prontuários",
    "Financeiro",
    "Lembretes Automáticos",
    "Sócio Digital IA",
  ],
  loja: [
    "Catálogo de Produtos",
    "Vendas",
    "Estoque",
    "Clientes",
    "Relatórios",
    "Sócio Digital IA",
  ],
  radio: [
    "Programação",
    "Comerciais",
    "Vinhetas",
    "Notícias",
    "Locutores",
    "Sócio Digital IA",
  ],
  saas: [
    "Dashboard Administrativo",
    "Gestão de Usuários",
    "Planos e Assinaturas",
    "Analytics",
    "Suporte via Chat",
    "Sócio Digital IA",
  ],
  ecommerce: [
    "Catálogo Online",
    "Carrinho de Compras",
    "Pagamentos",
    "Pedidos",
    "Clientes",
    "Sócio Digital IA",
  ],
  agencia: [
    "Clientes",
    "Projetos",
    "Contratos",
    "Relatórios",
    "Automação Comercial",
    "Sócio Digital IA",
  ],
};

export default function GenerateSystemModal({
  isOpen = false,
  onClose,
  onCreateSystem,
  onSystemCreated,
  onCreate,
}: GenerateSystemModalProps) {
  const [businessType, setBusinessType] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const selectedModules = useMemo(() => {
    const value = businessType.toLowerCase().trim();

    const key =
      Object.keys(systemTemplates).find((item) => value.includes(item)) ||
      "saas";

    return systemTemplates[key];
  }, [businessType]);

  function handlePreview() {
    setShowPreview(true);
  }

  function handleCreateSystem() {
    const system: GeneratedSystem = {
      name: businessType || "NexaFlow AI Pro",
      type: businessType || "SaaS",
      status: "Ativo",
      modules: selectedModules,
      createdAt: new Date().toLocaleDateString("pt-BR"),
    };

    onCreateSystem?.(system);
    onSystemCreated?.(system);
    onCreate?.(system);
    onClose?.();
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4 backdrop-blur-xl">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2rem] border border-cyan-400/30 bg-slate-950/95 p-8 text-white shadow-[0_0_80px_rgba(34,211,238,0.25)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-5 rounded-full border border-white/10 px-4 py-2 text-2xl text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          ×
        </button>

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
          Gerar Sistema Personalizado
        </p>

        <h2 className="mb-4 text-4xl font-black">
          Qual é o tipo da sua empresa?
        </h2>

        <p className="mb-6 max-w-2xl text-white/70">
          Digite o segmento do negócio e o NexaFlow monta uma prévia com módulos,
          automações e recursos para o seu sistema.
        </p>

        <input
          value={businessType}
          onChange={(event) => setBusinessType(event.target.value)}
          placeholder="Ex: restaurante, supermercado, clínica, rádio..."
          className="mb-5 w-full rounded-2xl border border-violet-400/30 bg-white/10 px-5 py-4 text-white outline-none placeholder:text-white/40 focus:border-cyan-300"
        />

        <div className="mb-6 flex flex-wrap gap-3">
          {["Restaurante", "Supermercado", "Clínica", "Loja", "Rádio", "Hamburgueria"].map(
            (item) => (
              <button
                key={item}
                type="button"
                onClick={() => setBusinessType(item)}
                className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-cyan-300 hover:bg-cyan-400/20"
              >
                {item}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          onClick={handlePreview}
          className="mb-8 w-full rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-4 font-bold text-white shadow-[0_0_35px_rgba(139,92,246,0.35)] transition hover:scale-[1.02]"
        >
          Ver Prévia
        </button>

        {showPreview && (
          <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-6">
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
              Prévia do Sistema
            </p>

            <h3 className="mb-4 text-2xl font-black">
              {businessType || "NexaFlow AI Pro"}
            </h3>

            <div className="grid gap-3 md:grid-cols-2">
              {selectedModules.map((module) => (
                <div
                  key={module}
                  className="rounded-2xl border border-cyan-400/10 bg-black/30 p-4"
                >
                  ✅ {module}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCreateSystem}
              className="mt-6 w-full rounded-2xl bg-emerald-400 px-6 py-4 font-black text-black transition hover:scale-[1.02]"
            >
              Criar Sistema Completo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}