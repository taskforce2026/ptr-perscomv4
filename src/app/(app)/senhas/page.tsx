import { desc } from "drizzle-orm";
import { db } from "@/db";
import { passwordResets } from "@/db/schema";
import { PageHeader, Panel, Vazio, Tag } from "@/components/ui";
import { Insignia } from "@/components/insignia";
import { exigirEdicao } from "@/lib/auth";
import { apagarResetSenha, resetPasswordOperador } from "@/lib/actions";
import { fmtDataHora, nomeCompleto } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SenhasPage() {
  await exigirEdicao();
  const contas = await db.query.users.findMany({ with: { rank: true } });
  const comPassword = contas.filter((c) => c.passwordHash);
  comPassword.sort((a, b) => (b.rank?.ordem ?? 0) - (a.rank?.ordem ?? 0) || a.nome.localeCompare(b.nome));
  const resets = await db.query.passwordResets.findMany({ orderBy: [desc(passwordResets.criadoEm)], limit: 10 });

  return (
    <div>
      <PageHeader
        titulo="Senhas e Recuperação"
        subtitulo="Área restrita ao Comando e administração. As passwords são guardadas cifradas — a recuperação gera uma password temporária que deves entregar ao operador em privado."
      />

      <Panel titulo="Passwords temporárias geradas" className="mb-4 !border-amber-500/40">
        {resets.length === 0 ? (
          <Vazio texto="Nenhuma password temporária gerada." />
        ) : (
          <ul className="space-y-2">
            {resets.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2">
                <div>
                  <div className="text-sm font-semibold text-gold-200">
                    Login: <span className="font-mono">{r.login}</span>
                  </div>
                  <div className="font-mono text-lg font-black tracking-wider text-emerald-300">{r.passwordPlain}</div>
                  <div className="text-[11px] text-slate-500">
                    Gerada por {r.criadoPor} · {fmtDataHora(r.criadoEm)}
                  </div>
                </div>
                <form action={apagarResetSenha}>
                  <input type="hidden" name="id" value={r.id} />
                  <button className="btn btn-danger !py-1 text-xs" title="Apagar depois de entregar ao operador">
                    🗑 Apagar registo
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-amber-200/80">
          ⚠ Entrega a password temporária ao operador por canal privado e apaga o registo de seguida. O operador deve
          alterá-la em «A minha conta».
        </p>
      </Panel>

      <Panel titulo={`Contas com password (${comPassword.length})`} className="!p-0">
        <table className="table">
          <thead>
            <tr>
              <th>Operador</th>
              <th>Login</th>
              <th>Estado da conta</th>
              <th>Último acesso</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {comPassword.map((c) => (
              <tr key={c.id}>
                <td>
                  <span className="flex items-center gap-2">
                    <Insignia rank={c.rank} size={22} />
                    {nomeCompleto(c)}
                  </span>
                </td>
                <td className="font-mono text-xs">{c.login ?? "—"}</td>
                <td>
                  <Tag tone={c.contaEstado === "aprovada" ? "green" : c.contaEstado === "pendente" ? "gold" : "red"}>
                    {c.contaEstado}
                  </Tag>
                </td>
                <td className="text-xs text-slate-400">{fmtDataHora(c.ultimoLogin)}</td>
                <td className="text-right whitespace-nowrap">
                  <form action={resetPasswordOperador} className="inline">
                    <input type="hidden" name="id" value={c.id} />
                    <button className="btn btn-secondary !py-1 text-xs" title="Gerar password temporária">
                      🔑 Recuperar password
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
