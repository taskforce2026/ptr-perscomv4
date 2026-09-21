import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { radioFrequencies } from "@/db/schema";
import { PageHeader, Panel, Campo, Vazio, SoComando, Tag } from "@/components/ui";
import { exigirSessao, eComando } from "@/lib/auth";
import { apagarFrequencia, guardarFrequencia } from "@/lib/actions";
import { MANUAIS } from "@/lib/manuais";

export const dynamic = "force-dynamic";

export default async function ManuaisPage({ searchParams }: { searchParams: Promise<{ editar?: string; erro?: string }> }) {
  const sessao = await exigirSessao();
  const comando = eComando(sessao);
  const { editar, erro } = await searchParams;
  const freqs = await db.query.radioFrequencies.findMany({ orderBy: [asc(radioFrequencies.ordem), asc(radioFrequencies.equipa)] });
  const equipas = Array.from(new Set(freqs.map((f) => f.equipa)));
  const editando = editar ? freqs.find((f) => String(f.id) === editar) : undefined;

  return (
    <div>
      <PageHeader
        titulo="Manuais e Comunicações"
        subtitulo="Frequências de rádio por equipa, manuais de classe e manual geral de procedimentos. Manuais disponíveis em PDF para todos."
      />
      {erro && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          Indica equipa e canal da frequência.
        </div>
      )}

      <SoComando>
        <Panel titulo={editando ? `Editar frequência: ${editando.equipa}` : "Nova frequência de rádio"} className="mb-4">
          <form action={guardarFrequencia} className="grid gap-3 md:grid-cols-5">
            {editando && <input type="hidden" name="id" value={editando.id} />}
            <Campo label="Equipa *">
              <input name="equipa" className="input" required defaultValue={editando?.equipa ?? ""} placeholder="Alpha" />
            </Campo>
            <Campo label="Canal *">
              <input name="canal" className="input" required defaultValue={editando?.canal ?? ""} placeholder="51.2" />
            </Campo>
            <Campo label="Tipo">
              <select name="tipo" className="input" defaultValue={editando?.tipo ?? "SR"}>
                <option>SR</option>
                <option>LR</option>
              </select>
            </Campo>
            <Campo label="Ordem">
              <input name="ordem" type="number" className="input" defaultValue={editando?.ordem ?? freqs.length + 1} />
            </Campo>
            <div className="md:col-span-2">
              <Campo label="Notas">
                <input name="notas" className="input" defaultValue={editando?.notas ?? ""} />
              </Campo>
            </div>
            <div className="flex items-end gap-2 md:col-span-3">
              <button className="btn btn-primary">{editando ? "Guardar" : "Adicionar frequência"}</button>
              {editando && (
                <Link href="/manuais" className="btn btn-ghost">
                  Cancelar
                </Link>
              )}
            </div>
          </form>
        </Panel>
      </SoComando>

      <div className="grid gap-4 lg:grid-cols-2">
        {equipas.length === 0 && <Vazio texto="Sem frequências definidas." />}
        {equipas.map((eqNome) => (
          <Panel key={eqNome} titulo={`📻 Equipa ${eqNome}`}>
            <table className="table">
              <thead>
                <tr>
                  <th>Canal</th>
                  <th>Tipo</th>
                  <th>Notas</th>
                  {comando && <th></th>}
                </tr>
              </thead>
              <tbody>
                {freqs
                  .filter((f) => f.equipa === eqNome)
                  .map((f) => (
                    <tr key={f.id}>
                      <td className="font-mono font-bold text-gold-300">{f.canal}</td>
                      <td>
                        <Tag tone={f.tipo === "LR" ? "green" : "slate"}>{f.tipo}</Tag>
                      </td>
                      <td className="text-slate-400">{f.notas}</td>
                      {comando && (
                        <td className="text-right whitespace-nowrap">
                          <Link href={`/manuais?editar=${f.id}`} className="btn btn-ghost !px-2 !py-1 text-xs">
                            Editar
                          </Link>
                          <form action={apagarFrequencia} className="inline">
                            <input type="hidden" name="id" value={f.id} />
                            <button className="btn btn-danger !px-2 !py-1 text-xs">Apagar</button>
                          </form>
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </Panel>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 font-[family-name:var(--font-display)] text-2xl text-gold-300">Manuais de instrução</h2>
        <p className="mb-4 text-sm text-slate-400">
          Procedimentos militares simplificados por classe. Todos os operadores podem abrir e exportar em PDF.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MANUAIS.map((m) => (
            <Link
              key={m.slug}
              href={`/manuais/${m.slug}`}
              className="panel rounded-2xl p-4 transition hover:border-gold-400/50"
            >
              <div className="text-[10px] uppercase tracking-[0.2em] text-gold-500">{m.classe}</div>
              <div className="mt-1 font-semibold text-gold-200">{m.titulo}</div>
              <p className="mt-1 line-clamp-3 text-xs text-slate-400">{m.introducao}</p>
              <div className="mt-3 text-xs font-bold text-gold-300">Abrir / PDF →</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
