import { desc } from "drizzle-orm";
import { db } from "@/db";
import { sugestoes } from "@/db/schema";
import { PageHeader, Panel, Campo, Vazio, Tag } from "@/components/ui";
import { exigirSessao, podeEditar } from "@/lib/auth";
import { apagarSugestao, criarSugestao, responderSugestao } from "@/lib/actions";
import { fmtDataHora } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SugestoesPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const u = await exigirSessao();
  const admin = podeEditar(u);
  const { erro } = await searchParams;
  const lista = await db.query.sugestoes.findMany({
    orderBy: [desc(sugestoes.criadoEm)],
    with: { user: { with: { rank: true } } },
  });

  return (
    <div>
      <PageHeader
        titulo="Sugestões"
        subtitulo={
          admin
            ? "Sugestões do efectivo. Responde e define o estado de cada uma."
            : "Envia sugestões para melhorar a PTR. O Comando responde aqui."
        }
      />
      {erro && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          Indica o título da sugestão.
        </div>
      )}

      <Panel titulo="Nova sugestão" className="mb-4">
        <form action={criarSugestao} className="grid gap-3 md:grid-cols-3">
          <div className="md:col-span-1">
            <Campo label="Título *">
              <input name="titulo" className="input" required placeholder="Ex.: mapa de operações no painel" />
            </Campo>
          </div>
          <div className="md:col-span-2">
            <Campo label="Descrição">
              <textarea name="descricao" className="input min-h-20" placeholder="Descreve a tua ideia…" />
            </Campo>
          </div>
          <button className="btn btn-primary">💡 Enviar sugestão</button>
        </form>
      </Panel>

      {lista.length === 0 ? (
        <Vazio texto="Sem sugestões." />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {lista.map((s) => (
            <Panel
              key={s.id}
              titulo={s.titulo}
              accoes={
                <Tag tone={s.estado === "Aceite" ? "green" : s.estado === "Rejeitada" ? "red" : "gold"}>
                  {s.estado}
                </Tag>
              }
            >
              <p className="whitespace-pre-wrap text-sm text-slate-300">{s.descricao}</p>
              <p className="mt-2 text-xs text-slate-500">
                {s.user.rank?.abreviatura} {s.user.nomeGuerra ?? s.user.nome} · {fmtDataHora(s.criadoEm)}
              </p>
              {s.resposta && (
                <div className="mt-3 rounded-lg border border-gold-500/25 bg-gold-500/5 px-3 py-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gold-400">
                    💬 Resposta do Comando · {s.respondidoPor} · {s.respondidoEm ? fmtDataHora(s.respondidoEm) : ""}
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gold-100">{s.resposta}</p>
                </div>
              )}
              {admin && (
                <form action={responderSugestao} className="mt-3 space-y-2 rounded-lg border border-white/10 bg-black/20 p-3">
                  <input type="hidden" name="id" value={s.id} />
                  <textarea name="resposta" className="input min-h-16" defaultValue={s.resposta ?? ""} placeholder="Responder à sugestão…" />
                  <div className="flex flex-wrap gap-2">
                    <select name="estado" className="input !w-auto !py-1 text-xs" defaultValue={s.estado}>
                      <option>Em análise</option>
                      <option>Aceite</option>
                      <option>Rejeitada</option>
                    </select>
                    <button className="btn btn-secondary !py-1 text-xs">Responder / Guardar</button>
                  </div>
                </form>
              )}
              {(admin || s.userId === u.id) && (
                <form action={apagarSugestao} className="mt-2">
                  <input type="hidden" name="id" value={s.id} />
                  <button className="btn btn-danger !py-1 text-xs">Apagar</button>
                </form>
              )}
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
