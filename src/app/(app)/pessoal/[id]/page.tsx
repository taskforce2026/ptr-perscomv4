import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { colocacoes, reactions, reconhecimentos, reviews, userDocuments, users } from "@/db/schema";
import { PageHeader, Panel, StatusBadge, Tag, SoEditores, Campo, Vazio } from "@/components/ui";
import { Insignia, Medalha } from "@/components/insignia";
import { Reacoes, contarReacoes } from "@/components/reacoes";
import { fmtData, nomeCompleto } from "@/lib/format";
import { exigirSessao, podeEditar } from "@/lib/auth";
import { RECONHECIMENTOS } from "@/lib/reconhecimentos-def";
import {
  actualizarColocacao,
  actualizarMilitar,
  adicionarCombate,
  adicionarPromocao,
  adicionarQualificacao,
  alternarReconhecimento,
  alterarPresenca,
  apagarOperador,
  apagarReview,
  atribuirCondecoracao,
  criarReview,
  gerarCertificadoRapido,
  removerCombate,
  removerCondecoracao,
  removerQualificacao,
} from "@/lib/actions";

export const dynamic = "force-dynamic";

const TABS = [
  { k: "resumo", l: "Resumo" },
  { k: "colocacoes", l: "Colocações" },
  { k: "promocoes", l: "Promoções" },
  { k: "condecoracoes", l: "Condecorações" },
  { k: "qualificacoes", l: "Qualificações" },
  { k: "combate", l: "Combate" },
  { k: "eventos", l: "Eventos" },
  { k: "reviews", l: "Reviews" },
  { k: "documentos", l: "Documentos" },
  { k: "acesso", l: "Acesso" },
] as const;

export default async function PerfilPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const sessao = await exigirSessao();
  const { id } = await params;
  const { tab } = await searchParams;
  const activa = TABS.some((t) => t.k === tab) ? (tab as (typeof TABS)[number]["k"]) : "resumo";
  const u = await db.query.users.findFirst({
    where: eq(users.id, Number(id)),
    with: {
      rank: true,
      position: true,
      specialty: true,
      status: true,
      unit: true,
      promotions: { with: { rank: true } },
      awards: { with: { award: true } },
      qualifications: { with: { qualification: true } },
      combatRecords: true,
      attendance: { with: { event: true } },
    },
  });
  if (!u) notFound();

  const [patentes, cargos, specs, estados, unidades, docsGerados, medalhas, qualsCat, historico, reviewsLista, reconhec, reacoesPromo] =
    await Promise.all([
    db.query.ranks.findMany({ orderBy: (r, { asc }) => asc(r.ordem) }),
    db.query.positions.findMany({ orderBy: (r, { asc }) => asc(r.ordem) }),
    db.query.specialties.findMany({ orderBy: (r, { asc }) => asc(r.ordem) }),
    db.query.statuses.findMany({ orderBy: (r, { asc }) => asc(r.ordem) }),
    db.query.units.findMany({ orderBy: (r, { asc }) => asc(r.ordem) }),
    db.query.userDocuments.findMany({
      where: eq(userDocuments.userId, u.id),
      orderBy: [desc(userDocuments.criadoEm)],
      with: { document: true },
    }),
    db.query.awards.findMany({ orderBy: (r, { asc }) => asc(r.ordem) }),
    db.query.qualifications.findMany({ orderBy: (r, { asc }) => asc(r.ordem) }),
    db.query.colocacoes.findMany({
      where: eq(colocacoes.userId, u.id),
      orderBy: [desc(colocacoes.data)],
      with: { unit: true, position: true },
    }),
    db.query.reviews.findMany({
      where: eq(reviews.alvoId, u.id),
      orderBy: [desc(reviews.criadoEm)],
      with: { autor: { with: { rank: true } } },
    }),
    db.query.reconhecimentos.findMany({ where: eq(reconhecimentos.alvoId, u.id) }),
    db.query.reactions.findMany({ where: eq(reactions.targetType, "promocao") }),
  ]);

  const admin = podeEditar(sessao);
  const reacoesPromoMap = contarReacoes(reacoesPromo, "promocao", sessao.id);
  const contagemReconh = RECONHECIMENTOS.map((tipo) => ({
    tipo,
    n: reconhec.filter((r) => r.tipo === tipo).length,
    dei: reconhec.some((r) => r.tipo === tipo && r.autorId === sessao.id),
  }));

  return (
    <div>
      <div className="panel mb-4 flex flex-col gap-4 rounded-2xl p-5 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <Insignia rank={u.rank} size={64} />
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-gold-500">
              {u.rank?.nome} {u.rank?.abreviatura && `· ${u.rank.abreviatura}`}
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl text-gold-300">{nomeCompleto(u)}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              {u.status && <StatusBadge nome={u.status.nome} cor={u.status.cor} />}
              {u.unit && <Tag>{u.unit.nome}</Tag>}
              {u.position && <Tag tone="slate">{u.position.nome}</Tag>}
              {u.specialty && <Tag tone="green">+ {u.specialty.abreviatura}</Tag>}
              {u.numeroServico && <Tag tone="slate">{u.numeroServico}</Tag>}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {u.awards.slice(0, 6).map((a) => (a.award ? <Medalha key={a.id} award={a.award} size={22} mostrarNome={false} /> : null))}
            </div>
          </div>
        </div>
        <div className="md:ml-auto">
          <Link href={`/pessoal/${u.id}?tab=acesso`} className="btn btn-secondary">
            Editar perfil
          </Link>
        </div>
      </div>

      <div className="mb-4 flex gap-1 overflow-x-auto border-b border-gold-500/15">
        {TABS.map((t) => (
          <Link
            key={t.k}
            href={`/pessoal/${u.id}?tab=${t.k}`}
            className={`whitespace-nowrap px-3 py-2 text-sm ${
              activa === t.k ? "border-b-2 border-gold-400 text-gold-300" : "text-slate-400 hover:text-gold-200"
            }`}
          >
            {t.l}
          </Link>
        ))}
      </div>

      {activa === "resumo" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Panel>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u.foto || "/emblema.png"} alt="" className="mx-auto h-48 w-48 rounded-2xl object-cover ring-2 ring-gold-500/30" />
            {u.bio && <p className="mt-4 text-sm text-slate-300">{u.bio}</p>}
          </Panel>
          <Panel titulo="Ficha" className="lg:col-span-2">
            <dl className="space-y-2 text-sm">
              <Linha k="Unidade" v={u.unit?.nome} />
              <Linha k="Cargo" v={u.position?.nome} />
              <Linha k="Especialidade" v={u.specialty ? `${u.specialty.abreviatura} · ${u.specialty.nome}` : null} />
              <Linha k="Discord" v={u.discord} />
              <Linha k="Alistamento" v={fmtData(u.dataAlistamento)} />
              <Linha k="Perfil app" v={u.role} />
            </dl>
          </Panel>
        </div>
      )}

      {activa === "colocacoes" && (
        <div className="space-y-4">
          <Panel titulo="Colocação actual">
            <p className="text-sm">
              <b className="text-gold-200">{u.unit?.nome ?? "Sem unidade"}</b> · {u.position?.nome ?? "Sem cargo"}
            </p>
          </Panel>
          <Panel titulo={`Histórico de colocações (${historico.length})`}>
            {historico.length === 0 ? (
              <Vazio texto="Sem histórico. As alterações de colocação ficam registadas aqui." />
            ) : (
              <ul className="space-y-2 text-sm">
                {historico.map((h) => (
                  <li key={h.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                    <div>
                      <div className="font-semibold text-gold-200">
                        {h.unit?.nome ?? "Sem unidade"} · {h.position?.nome ?? "Sem cargo"}
                      </div>
                      {h.notas && <div className="text-xs text-slate-400">{h.notas}</div>}
                    </div>
                    <span className="text-xs text-slate-500">{fmtData(h.data)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <SoEditores>
            <Panel titulo="Editar colocação">
              <form action={actualizarColocacao} className="grid gap-3 md:grid-cols-4">
                <input type="hidden" name="id" value={u.id} />
                <Campo label="Unidade">
                  <select name="unitId" className="input" defaultValue={u.unitId ?? ""}>
                    <option value="">Sem unidade</option>
                    {unidades.map((un) => (
                      <option key={un.id} value={un.id}>
                        {un.nome}
                      </option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Cargo">
                  <select name="positionId" className="input" defaultValue={u.positionId ?? ""}>
                    <option value="">Sem cargo</option>
                    {cargos.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Notas (opcional)">
                  <input name="notas" className="input" placeholder="Ordem de transferência…" />
                </Campo>
                <div className="flex items-end">
                  <button className="btn btn-primary">Guardar colocação</button>
                </div>
              </form>
              <p className="mt-2 text-xs text-slate-500">
                A colocação actualizada aparece de imediato no perfil, nos rosters e nas estatísticas, e fica no histórico.
              </p>
            </Panel>
          </SoEditores>
        </div>
      )}

      {activa === "promocoes" && (
        <div className="space-y-4">
          <Panel titulo={`Promoções (${u.promotions.length})`}>
            <ul className="space-y-2 text-sm">
              {u.promotions.length === 0 && <Vazio texto="Sem promoções." />}
              {[...u.promotions]
                .sort((a, b) => b.data.getTime() - a.data.getTime())
                .map((p) => (
                  <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                    <span className="flex items-center gap-2">
                      <Insignia rank={p.rank} size={20} />
                      <span>
                        {p.rank?.nome} · {fmtData(p.data)} {p.notas && <span className="text-slate-500">— {p.notas}</span>}
                      </span>
                    </span>
                    <Reacoes
                      targetType="promocao"
                      targetId={p.id}
                      counts={reacoesPromoMap.get(p.id) ?? { gosto: 0, adoro: 0, minha: null }}
                    />
                  </li>
                ))}
            </ul>
            <p className="mt-2 text-xs text-slate-500">Patente actual: {u.rank?.nome ?? "—"}</p>
          </Panel>
          <SoEditores>
            <Panel titulo="Registar promoção">
              <form action={adicionarPromocao} className="grid gap-3 md:grid-cols-4">
                <input type="hidden" name="userId" value={u.id} />
                <Campo label="Nova patente">
                  <select name="rankId" className="input" required>
                    {patentes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.abreviatura} — {p.nome}
                      </option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Data">
                  <input name="data" type="date" className="input" defaultValue={new Date().toISOString().slice(0, 10)} />
                </Campo>
                <Campo label="Notas">
                  <input name="notas" className="input" placeholder="Ordem de promoção, mérito…" />
                </Campo>
                <div className="flex items-end">
                  <button className="btn btn-primary">★ Promover</button>
                </div>
              </form>
              <p className="mt-2 text-xs text-slate-500">
                A promoção altera a patente do operador em todo o PERSCOM (perfil, rosters, estatísticas, holograma).
              </p>
            </Panel>
          </SoEditores>
        </div>
      )}

      {activa === "condecoracoes" && (
        <div className="space-y-4">
          <Panel titulo={`Condecorações do operador (${u.awards.length})`}>
            {u.awards.length === 0 ? (
              <p className="text-sm text-slate-500">Sem condecorações. Atribui uma medalha abaixo.</p>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                {u.awards.map((a) => (
                  <div key={a.id} className="relative flex flex-col items-center rounded-xl border border-gold-500/20 bg-black/20 p-3">
                    {a.award && <Medalha award={a.award} size={64} />}
                    {admin && (
                      <form action={removerCondecoracao}>
                        <input type="hidden" name="id" value={a.id} />
                        <button
                          type="submit"
                          title="Remover medalha"
                          className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full border border-red-500/40 bg-red-950 text-xs text-red-300 hover:bg-red-900"
                        >
                          ✕
                        </button>
                      </form>
                    )}
                    <div className="mt-1 text-[10px] text-slate-500">{fmtData(a.data)}</div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
          <SoEditores>
            <Panel titulo="Atribuir medalha">
              <form action={atribuirCondecoracao} className="grid gap-3 md:grid-cols-3">
                <input type="hidden" name="userId" value={u.id} />
                <Campo label="Medalha">
                  <select name="awardId" className="input" required>
                    {medalhas.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nome}
                        {m.designacao ? ` — ${m.designacao}` : ""}
                      </option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Data">
                  <input name="data" type="date" className="input" defaultValue={new Date().toISOString().slice(0, 10)} />
                </Campo>
                <div className="flex items-end">
                  <button className="btn btn-primary">🏅 Atribuir medalha</button>
                </div>
              </form>
              <p className="mt-2 text-xs text-slate-500">
                A medalha aparece de imediato na ficha deste operador. Gerir o catálogo em Administração → Condecorações.
              </p>
            </Panel>
          </SoEditores>
        </div>
      )}

      {activa === "qualificacoes" && (
        <div className="space-y-4">
          <Panel titulo={`Qualificações (${u.qualifications.length})`}>
            {u.qualifications.length === 0 ? (
              <p className="text-sm text-slate-500">Sem qualificações.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {u.qualifications.map((q) =>
                  q.qualification ? (
                    <span
                      key={q.id}
                      className="relative inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5"
                    >
                      <Tag tone="green">
                        {q.qualification.abreviatura} · {q.qualification.nome}
                      </Tag>
                      <span className="text-[10px] text-slate-400">{fmtData(q.data)}</span>
                      {admin && (
                        <form action={removerQualificacao}>
                          <input type="hidden" name="id" value={q.id} />
                          <button
                            type="submit"
                            title="Remover qualificação"
                            className="grid h-5 w-5 place-items-center rounded-full border border-red-500/40 bg-red-950 text-[10px] text-red-300 hover:bg-red-900"
                          >
                            ✕
                          </button>
                        </form>
                      )}
                    </span>
                  ) : null,
                )}
              </div>
            )}
          </Panel>
          <SoEditores>
            <Panel titulo="Atribuir qualificação">
              <form action={adicionarQualificacao} className="grid gap-3 md:grid-cols-3">
                <input type="hidden" name="userId" value={u.id} />
                <Campo label="Qualificação">
                  <select name="qualificationId" className="input" required>
                    {qualsCat.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.abreviatura} — {q.nome}
                      </option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Data">
                  <input name="data" type="date" className="input" defaultValue={new Date().toISOString().slice(0, 10)} />
                </Campo>
                <div className="flex items-end">
                  <button className="btn btn-primary">◎ Atribuir</button>
                </div>
              </form>
            </Panel>
          </SoEditores>
        </div>
      )}

      {activa === "combate" && (
        <div className="space-y-4">
          <Panel titulo={`Registos de combate (${u.combatRecords.length})`}>
            {u.combatRecords.length === 0 ? (
              <Vazio texto="Sem registos de combate." />
            ) : (
              <ul className="space-y-2 text-sm">
                {[...u.combatRecords]
                  .sort((a, b) => b.data.getTime() - a.data.getTime())
                  .map((c) => (
                    <li key={c.id} className="flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                      <div>
                        <div className="font-semibold text-gold-200">{c.titulo}</div>
                        <div className="text-xs text-slate-500">{fmtData(c.data)}</div>
                        {c.descricao && <div className="mt-1 text-sm text-slate-300">{c.descricao}</div>}
                      </div>
                      {admin && (
                        <form action={removerCombate}>
                          <input type="hidden" name="id" value={c.id} />
                          <button
                            type="submit"
                            title="Remover registo"
                            className="grid h-6 w-6 place-items-center rounded-full border border-red-500/40 bg-red-950 text-xs text-red-300 hover:bg-red-900"
                          >
                            ✕
                          </button>
                        </form>
                      )}
                    </li>
                  ))}
              </ul>
            )}
          </Panel>
          <SoEditores>
            <Panel titulo="Adicionar registo de combate">
              <form action={adicionarCombate} className="grid gap-3 md:grid-cols-4">
                <input type="hidden" name="userId" value={u.id} />
                <Campo label="Título">
                  <input name="titulo" className="input" required placeholder="Operação Fénix Negra" />
                </Campo>
                <Campo label="Data">
                  <input name="data" type="date" className="input" defaultValue={new Date().toISOString().slice(0, 10)} />
                </Campo>
                <div className="md:col-span-2">
                  <Campo label="Descrição">
                    <input name="descricao" className="input" placeholder="Resumo da acção…" />
                  </Campo>
                </div>
                <div className="md:col-span-4 flex">
                  <button className="btn btn-primary">⚔ Registar</button>
                </div>
              </form>
            </Panel>
          </SoEditores>
        </div>
      )}

      {activa === "eventos" && (
        <div className="space-y-4">
          <Panel titulo={`Presenças em eventos (${u.attendance.length})`}>
            {u.attendance.length === 0 ? (
              <Vazio texto="Sem presenças registadas." />
            ) : (
              <ul className="space-y-2 text-sm">
                {[...u.attendance]
                  .sort((a, b) => (b.event?.dataInicio.getTime() ?? 0) - (a.event?.dataInicio.getTime() ?? 0))
                  .map((a) => {
                    const podeMudar = admin || sessao.id === u.id;
                    const cor =
                      a.estado === "Presente"
                        ? "#22c55e"
                        : a.estado === "Ausente"
                          ? "#ef4444"
                          : a.estado === "Justificado"
                            ? "#3b82f6"
                            : "#eab308";
                    return (
                      <li
                        key={a.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2"
                      >
                        <div>
                          <div className="font-semibold text-gold-200">{a.event?.titulo ?? "Evento"}</div>
                          <div className="text-xs text-slate-500">
                            {a.event ? fmtData(a.event.dataInicio) : ""} ·{" "}
                            <span style={{ color: cor }} className="font-bold">
                              {a.estado}
                            </span>
                          </div>
                        </div>
                        {podeMudar && (
                          <div className="flex flex-wrap gap-1">
                            {["Presente", "Talvez", "Ausente", "Justificado"].map((est) => (
                              <form key={est} action={alterarPresenca}>
                                <input type="hidden" name="id" value={a.id} />
                                <input type="hidden" name="estado" value={est} />
                                <input type="hidden" name="proximo" value={`/pessoal/${u.id}?tab=eventos`} />
                                <button
                                  type="submit"
                                  className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                                    a.estado === est
                                      ? "border-gold-400 bg-gold-500/20 text-gold-200"
                                      : "border-white/10 text-slate-400 hover:border-gold-500/40 hover:text-gold-200"
                                  }`}
                                  title={a.estado === est ? "Estado actual" : `Marcar como ${est}`}
                                >
                                  {est === "Ausente" && a.estado !== est ? "Não compareceu" : est}
                                </button>
                              </form>
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  })}
              </ul>
            )}
            <p className="mt-2 text-xs text-slate-500">
              A presença fica registada no perfil. Se o operador não comparecer, muda para «Ausente» (não compareceu).
            </p>
          </Panel>
        </div>
      )}

      {activa === "reviews" && (
        <div className="space-y-4">
          <Panel titulo="Reconhecimentos">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {contagemReconh.map((r) => (
                <div
                  key={r.tipo}
                  className="flex flex-col items-center rounded-xl border border-gold-500/20 bg-black/20 p-3 text-center"
                >
                  <div className="text-2xl font-black text-gold-300">{r.n}</div>
                  <div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-300">{r.tipo}</div>
                  {sessao.id !== u.id && (
                    <form action={alternarReconhecimento} className="mt-2">
                      <input type="hidden" name="alvoId" value={u.id} />
                      <input type="hidden" name="tipo" value={r.tipo} />
                      <button
                        type="submit"
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
                          r.dei
                            ? "border-gold-400 bg-gold-500/20 text-gold-200"
                            : "border-white/10 text-slate-400 hover:border-gold-500/40 hover:text-gold-200"
                        }`}
                      >
                        {r.dei ? "✓ Reconhecido" : "+ Reconhecer"}
                      </button>
                    </form>
                  )}
                </div>
              ))}
            </div>
            {sessao.id === u.id && (
              <p className="mt-2 text-xs text-slate-500">Os reconhecimentos são atribuídos pelos outros operadores.</p>
            )}
          </Panel>

          {sessao.id !== u.id && (
            <Panel titulo="Escrever review">
              <form action={criarReview} className="space-y-2">
                <input type="hidden" name="alvoId" value={u.id} />
                <textarea name="texto" className="input min-h-20" required placeholder="Escreve uma review sobre este operador…" />
                <button className="btn btn-primary">Publicar review</button>
              </form>
            </Panel>
          )}

          <Panel titulo={`Reviews (${reviewsLista.length})`}>
            {reviewsLista.length === 0 ? (
              <Vazio texto="Sem reviews. Sê o primeiro a escrever." />
            ) : (
              <ul className="space-y-3">
                {reviewsLista.map((r) => (
                  <li key={r.id} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-gold-400">
                        {r.autor.rank?.abreviatura} {r.autor.nomeGuerra ?? r.autor.nome}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500">{fmtData(r.criadoEm)}</span>
                        {(r.autorId === sessao.id || admin) && (
                          <form action={apagarReview}>
                            <input type="hidden" name="id" value={r.id} />
                            <button className="text-xs text-red-300 hover:underline" title="Apagar review">
                              🗑
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-300">{r.texto}</p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      )}

      {activa === "documentos" && (
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <Panel titulo="Documentos gerados">
            {docsGerados.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gold-500/20 px-4 py-12 text-center text-sm text-slate-500">
                Ainda não foram gerados documentos para este militar.
              </div>
            ) : (
              <ul className="space-y-2">
                {docsGerados.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-2 rounded-lg border border-gold-500/15 px-3 py-2">
                    <div>
                      <div className="font-semibold text-gold-200">{d.document.titulo}</div>
                      <div className="text-xs text-slate-500">
                        {d.numero} · {fmtData(d.criadoEm)}
                      </div>
                    </div>
                    <Link href={`/documentos/emitidos/${d.id}`} className="btn btn-primary !py-1 text-xs">
                      Abrir / PDF / PNG
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          {admin && (
            <div className="space-y-2">
              {(
                [
                  ["alistamento", "Gerar: Certificado de alistamento"],
                  ["condecoracao", "Gerar: Certificado de condecoração"],
                  ["qualificacao", "Gerar: Certificado de qualificação"],
                  ["promocao", "Gerar: Ordem de promoção"],
                  ["missao", "Gerar: Certificado de missão cumprida"],
                  ["ranger", "Gerar: Certificado de curso Ranger"],
                  ["louvor", "Gerar: Louvor"],
                  ["servico", "Gerar: Ordem de serviço"],
                  ["transferencia", "Gerar: Ordem de transferência"],
                  ["comparencia", "Gerar: Declaração de comparência"],
                  ["apresentacao", "Gerar: Auto de apresentação"],
                  ["termo", "Gerar: Termo de responsabilidade"],
                  ["honra", "Gerar: Declaração de honra"],
                ] as const
              ).map(([chave, label]) => (
                <form key={chave} action={gerarCertificadoRapido}>
                  <input type="hidden" name="userId" value={u.id} />
                  <input type="hidden" name="chave" value={chave} />
                  <button className="btn btn-ghost w-full justify-start !border-gold-500/30 text-left text-xs uppercase tracking-wider text-gold-300">
                    ▶ {label}
                  </button>
                </form>
              ))}
            </div>
          )}
        </div>
      )}

      {activa === "acesso" && (
        <SoEditores fallback={<Panel>Só o Comando edita o acesso e a ficha.</Panel>}>
          <Panel titulo="Editar ficha">
            <form action={actualizarMilitar} className="grid gap-3 md:grid-cols-2">
              <input type="hidden" name="id" value={u.id} />
              <Campo label="Nome">
                <input name="nome" defaultValue={u.nome} className="input" />
              </Campo>
              <Campo label="Nome de guerra">
                <input name="nomeGuerra" defaultValue={u.nomeGuerra ?? ""} className="input" />
              </Campo>
              <Campo label="Nº serviço">
                <input name="numeroServico" defaultValue={u.numeroServico ?? ""} className="input" />
              </Campo>
              <Campo label="Discord">
                <input name="discord" defaultValue={u.discord ?? ""} className="input" />
              </Campo>
              <Campo label="Foto (URL)">
                <input name="foto" defaultValue={u.foto ?? ""} className="input" />
              </Campo>
              <Campo label="Patente">
                <select name="rankId" defaultValue={u.rankId ?? ""} className="input">
                  <option value="">—</option>
                  {patentes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.abreviatura} — {p.nome}
                    </option>
                  ))}
                </select>
              </Campo>
              <Campo label="Cargo">
                <select name="positionId" defaultValue={u.positionId ?? ""} className="input">
                  <option value="">—</option>
                  {cargos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))}
                </select>
              </Campo>
              <Campo label="Especialidade">
                <select name="specialtyId" defaultValue={u.specialtyId ?? ""} className="input">
                  <option value="">—</option>
                  {specs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.abreviatura}
                    </option>
                  ))}
                </select>
              </Campo>
              <Campo label="Estado">
                <select name="statusId" defaultValue={u.statusId ?? ""} className="input">
                  <option value="">—</option>
                  {estados.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))}
                </select>
              </Campo>
              <Campo label="Unidade">
                <select name="unitId" defaultValue={u.unitId ?? ""} className="input">
                  <option value="">—</option>
                  {unidades.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))}
                </select>
              </Campo>
              <Campo label="Bio">
                <textarea name="bio" defaultValue={u.bio ?? ""} className="input min-h-20" />
              </Campo>
              <div className="md:col-span-2">
                <button className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </Panel>
          <Panel titulo="Zona de perigo" className="!border-red-500/40">
            <p className="text-sm text-red-200">
              Apagar o ficheiro do operador remove todos os registos associados (presenças, promoções,
              condecorações, documentos, fotos e mensagens). Esta acção é <b>irreversível</b>.
            </p>
            <form action={apagarOperador} className="mt-3">
              <input type="hidden" name="id" value={u.id} />
              <button className="btn btn-danger">🗑 Apagar ficheiro do operador</button>
            </form>
          </Panel>
        </SoEditores>
      )}
    </div>
  );
}

function Linha({ k, v }: { k: string; v?: string | null }) {
  return (
    <div className="flex justify-between gap-3 border-b border-white/5 pb-1">
      <dt className="text-slate-500">{k}</dt>
      <dd>{v ?? "—"}</dd>
    </div>
  );
}
