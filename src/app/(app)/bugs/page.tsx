import { desc } from "drizzle-orm";
import { db } from "@/db";
import { bugReports } from "@/db/schema";
import { PageHeader, Panel, Campo, Vazio, SoEditores, Tag } from "@/components/ui";
import { exigirSessao, podeEditar } from "@/lib/auth";
import { alterarBugEstado, apagarBug, criarBug } from "@/lib/actions";
import { fmtDataHora } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function BugsPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const u = await exigirSessao();
  const admin = podeEditar(u);
  const { erro } = await searchParams;
  const lista = await db.query.bugReports.findMany({
    orderBy: [desc(bugReports.criadoEm)],
    with: { user: { with: { rank: true } } },
  });
  const visiveis = admin ? lista : lista.filter((b) => b.userId === u.id);

  return (
    <div>
      <PageHeader
        titulo="Bug Report"
        subtitulo={
          admin
            ? "Relatórios de erros de todos os operadores. Resolve, reabre ou apaga."
            : "Reporta erros que encontrares na app. Vês aqui os teus relatórios."
        }
      />
      {erro && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          Indica o título do bug.
        </div>
      )}

      <Panel titulo="Reportar bug" className="mb-4">
        <form action={criarBug} className="grid gap-3 md:grid-cols-3">
          <Campo label="Título *">
            <input name="titulo" className="input" required placeholder="Ex.: o chat não carrega no telemóvel" />
          </Campo>
          <Campo label="Página / zona">
            <input name="pagina" className="input" placeholder="Ex.: /chat/operadores" />
          </Campo>
          <div className="md:col-span-3">
            <Campo label="Descrição">
              <textarea name="descricao" className="input min-h-20" placeholder="O que aconteceu, passos para reproduzir…" />
            </Campo>
          </div>
          <button className="btn btn-primary">🐞 Enviar relatório</button>
        </form>
      </Panel>

      {visiveis.length === 0 ? (
        <Vazio texto="Sem relatórios de bugs." />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {visiveis.map((b) => (
            <Panel
              key={b.id}
              titulo={b.titulo}
              accoes={
                <Tag tone={b.estado === "Resolvido" ? "green" : b.estado === "Em análise" ? "slate" : "gold"}>
                  {b.estado}
                </Tag>
              }
            >
              {b.pagina && <p className="mb-1 font-mono text-xs text-slate-500">📍 {b.pagina}</p>}
              <p className="whitespace-pre-wrap text-sm text-slate-300">{b.descricao}</p>
              <p className="mt-2 text-xs text-slate-500">
                {b.user.rank?.abreviatura} {b.user.nomeGuerra ?? b.user.nome} · {fmtDataHora(b.criadoEm)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {admin && (
                  <form action={alterarBugEstado} className="flex items-center gap-1">
                    <input type="hidden" name="id" value={b.id} />
                    <select name="estado" defaultValue={b.estado} className="input !w-auto !py-1 text-xs">
                      <option>Aberto</option>
                      <option>Em análise</option>
                      <option>Resolvido</option>
                    </select>
                    <button className="btn btn-secondary !py-1 text-xs">Guardar estado</button>
                  </form>
                )}
                {(admin || b.userId === u.id) && (
                  <form action={apagarBug}>
                    <input type="hidden" name="id" value={b.id} />
                    <button className="btn btn-danger !py-1 text-xs">Apagar</button>
                  </form>
                )}
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
