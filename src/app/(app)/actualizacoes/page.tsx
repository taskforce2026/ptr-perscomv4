import { desc } from "drizzle-orm";
import { db } from "@/db";
import { auditLog } from "@/db/schema";
import { PageHeader, Panel, Vazio, SoComando } from "@/components/ui";
import { fmtDataHora } from "@/lib/format";
import { exigirSessao, eComando } from "@/lib/auth";
import { apagarActualizacao } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function ActualizacoesPage() {
  const sessao = await exigirSessao();
  const comando = eComando(sessao);
  const lista = await db.query.auditLog.findMany({ orderBy: [desc(auditLog.criadoEm)], limit: 80 });
  return (
    <div>
      <PageHeader titulo="Actualizações" subtitulo="Registo de alterações no PERSCOM." />
      <Panel>
        {lista.length === 0 ? (
          <Vazio texto="Sem registos." />
        ) : (
          <ul className="space-y-3">
            {lista.map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-3 border-b border-white/5 pb-2">
                <div>
                  <div className="text-sm">
                    <span className="text-gold-400">{a.actor ?? "Sistema"}</span> · {a.accao}
                  </div>
                  {a.detalhe && <div className="text-sm text-slate-400">{a.detalhe}</div>}
                  <div className="text-[11px] text-slate-500">{fmtDataHora(a.criadoEm)}</div>
                </div>
                {comando && (
                  <form action={apagarActualizacao}>
                    <input type="hidden" name="id" value={a.id} />
                    <button className="btn btn-danger !px-2 !py-1 text-xs" title="Apagar registo (só Comando)">
                      🗑
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
