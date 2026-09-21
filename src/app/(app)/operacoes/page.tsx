import { desc } from "drizzle-orm";
import { db } from "@/db";
import { operacoes } from "@/db/schema";
import { PageHeader, Panel, Campo, SoEditores, Vazio, Tag } from "@/components/ui";
import { FormConfirm } from "@/components/form-confirm";
import { exigirSessao } from "@/lib/auth";
import { servidorSeleccionado } from "@/lib/servidor";
import { criarOperacao, actualizarOperacao, apagarOperacao } from "@/lib/actions";
import { fmtDataHora } from "@/lib/format";

export const dynamic = "force-dynamic";

const ESTADOS = ["Planeada", "Em curso", "Concluída", "Cancelada"] as const;

function corEstado(e: string) {
  return e === "Em curso" ? "#22c55e" : e === "Concluída" ? "#3b82f6" : e === "Cancelada" ? "#ef4444" : "#eab308";
}

export default async function OperacoesPage({
  searchParams,
}: {
  searchParams: Promise<{ editar?: string; erro?: string }>;
}) {
  await exigirSessao();
  const { editar, erro } = await searchParams;
  const srv = await servidorSeleccionado();
  const [lista, unidades, servidores] = await Promise.all([
    db.query.operacoes.findMany({
      orderBy: [desc(operacoes.criadoEm)],
      with: { unidade: true, servidor: true },
    }),
    db.query.units.findMany({ orderBy: (u, { asc }) => asc(u.ordem) }),
    db.query.servers.findMany({ orderBy: (s, { asc }) => asc(s.ordem) }),
  ]);
  const editando = editar ? lista.find((o) => String(o.id) === editar) : undefined;
  const activas = lista.filter((o) => o.estado === "Planeada" || o.estado === "Em curso");
  const arquivadas = lista.filter((o) => o.estado === "Concluída" || o.estado === "Cancelada");

  return (
    <div>
      <PageHeader
        titulo="Sistema de Operações"
        subtitulo={
          srv
            ? `Planeamento e acompanhamento de operações da PTR · servidor de referência: ${srv.nome}`
            : "Planeamento e acompanhamento de operações da PTR."
        }
      />
      {erro && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          Indica o nome da operação.
        </div>
      )}

      <SoEditores>
        <Panel titulo={editando ? `Editar: ${editando.nome}` : "Nova operação"} className="mb-6">
          <form action={editando ? actualizarOperacao : criarOperacao} className="grid gap-3 md:grid-cols-3">
            {editando ? (
              <>
                <input type="hidden" name="id" value={editando.id} />
                <input type="hidden" name="campo" value="tudo" />
              </>
            ) : null}
            <Campo label="Nome *">
              <input name="nome" className="input" required defaultValue={editando?.nome ?? ""} placeholder="Operação Fénix Negra" />
            </Campo>
            <Campo label="Tipo">
              <select name="tipo" className="input" defaultValue={editando?.tipo ?? "Operação"}>
                <option>Operação</option>
                <option>Missão</option>
                <option>Exercício</option>
                <option>Campanha</option>
              </select>
            </Campo>
            <Campo label="Estado">
              <select name="estado" className="input" defaultValue={editando?.estado ?? "Planeada"}>
                {ESTADOS.map((e) => (
                  <option key={e}>{e}</option>
                ))}
              </select>
            </Campo>
            <Campo label="Data / hora">
              <input
                name="dataInicio"
                type="datetime-local"
                className="input"
                defaultValue={
                  editando?.dataInicio
                    ? new Date(editando.dataInicio.getTime() - editando.dataInicio.getTimezoneOffset() * 60000)
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
              />
            </Campo>
            <Campo label="Unidade">
              <select name="unidadeId" className="input" defaultValue={editando?.unidadeId ?? ""}>
                <option value="">Toda a Taskforce</option>
                {unidades.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nome}
                  </option>
                ))}
              </select>
            </Campo>
            <Campo label="Servidor">
              <select name="servidorId" className="input" defaultValue={editando?.servidorId ?? srv?.id ?? ""}>
                <option value="">—</option>
                {servidores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.tipo} · {s.nome}
                  </option>
                ))}
              </select>
            </Campo>
            <div className="md:col-span-2">
              <Campo label="Objectivos">
                <input name="objectivos" className="input" defaultValue={editando?.objectivos ?? ""} placeholder="Objectivos principais…" />
              </Campo>
            </div>
            <div className="md:col-span-3">
              <Campo label="Briefing">
                <textarea name="briefing" className="input min-h-20" defaultValue={editando?.briefing ?? ""} />
              </Campo>
            </div>
            <div className="flex flex-wrap gap-2 md:col-span-3">
              <button className="btn btn-primary">{editando ? "Guardar alterações" : "Criar operação"}</button>
              {editando && (
                <a href="/operacoes" className="btn btn-ghost">
                  Cancelar
                </a>
              )}
            </div>
          </form>
        </Panel>
      </SoEditores>

      {lista.length === 0 ? (
        <Vazio texto="Sem operações. Cria a primeira acima." />
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl text-gold-300">
              Operações activas ({activas.length})
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {activas.map((o) => (
                <OpCard key={o.id} op={o} />
              ))}
              {activas.length === 0 && <Vazio texto="Sem operações activas." />}
            </div>
          </section>
          <section>
            <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl text-slate-400">
              Arquivo ({arquivadas.length})
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {arquivadas.map((o) => (
                <OpCard key={o.id} op={o} />
              ))}
              {arquivadas.length === 0 && <Vazio texto="Arquivo vazio." />}
            </div>
          </section>
        </div>
      )}
    </div>
  );

  function OpCard({ op }: { op: (typeof lista)[number] }) {
    const cor = corEstado(op.estado);
    return (
      <Panel
        titulo={`${op.tipo} · ${op.nome}`}
        accoes={
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider"
            style={{ borderColor: `${cor}66`, background: `${cor}1a`, color: cor }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: cor }} />
            {op.estado}
          </span>
        }
      >
        <div className="space-y-1 text-sm text-slate-300">
          {op.dataInicio && <div>📅 {fmtDataHora(op.dataInicio)}</div>}
          <div>
             {op.unidade?.nome ?? "Toda a Taskforce"} · 🖥 {op.servidor?.nome ?? "—"}
          </div>
          {op.objectivos && <div className="text-slate-400">Objectivos: {op.objectivos}</div>}
          {op.briefing && <p className="whitespace-pre-wrap rounded-lg bg-black/30 p-2 text-xs text-slate-400">{op.briefing}</p>}
          <div className="text-[10px] text-slate-500">Criada por {op.criadoPor ?? "—"}</div>
        </div>
        <SoEditores>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {ESTADOS.filter((e) => e !== op.estado).map((e) => (
              <form key={e} action={actualizarOperacao}>
                <input type="hidden" name="id" value={op.id} />
                <input type="hidden" name="campo" value="estado" />
                <input type="hidden" name="estado" value={e} />
                <button className="rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] font-bold text-slate-300 transition hover:border-gold-500/40 hover:text-gold-200">
                  → {e}
                </button>
              </form>
            ))}
            <a href={`/operacoes?editar=${op.id}`} className="btn btn-ghost !py-1 text-xs">
              Editar
            </a>
            <FormConfirm action={apagarOperacao} message={`Apagar a operação "${op.nome}"?`}>
              <input type="hidden" name="id" value={op.id} />
              <button className="btn btn-danger !py-1 text-xs">Apagar</button>
            </FormConfirm>
          </div>
        </SoEditores>
        <div className="mt-2">
          <Tag tone="slate">Visível a todos os operadores</Tag>
        </div>
      </Panel>
    );
  }
}
