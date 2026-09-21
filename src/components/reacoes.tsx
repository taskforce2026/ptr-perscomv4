import { alternarReacao } from "@/lib/actions";

export type ContagemReacoes = { gosto: number; adoro: number; minha: "gosto" | "adoro" | null };

export function Reacoes({
  targetType,
  targetId,
  counts,
  className = "",
}: {
  targetType: "mensagem" | "promocao" | "foto";
  targetId: number;
  counts: ContagemReacoes;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {(["gosto", "adoro"] as const).map((t) => {
        const activa = counts.minha === t;
        const n = counts[t];
        return (
          <form key={t} action={alternarReacao}>
            <input type="hidden" name="targetType" value={targetType} />
            <input type="hidden" name="targetId" value={targetId} />
            <input type="hidden" name="tipo" value={t} />
            <button
              type="submit"
              title={t === "gosto" ? "Gosto" : "Adoro"}
              className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold transition ${
                activa
                  ? t === "gosto"
                    ? "border-sky-400/60 bg-sky-500/20 text-sky-200"
                    : "border-red-400/60 bg-red-500/20 text-red-200"
                  : "border-white/10 text-slate-400 hover:border-gold-500/40 hover:text-gold-200"
              }`}
            >
              {t === "gosto" ? "👍" : "❤️"}
              {n > 0 && <span>{n}</span>}
            </button>
          </form>
        );
      })}
    </div>
  );
}

export function contarReacoes(
  todas: { targetType: string; targetId: number; userId: number; tipo: string }[],
  targetType: string,
  meId: number,
): Map<number, ContagemReacoes> {
  const mapa = new Map<number, ContagemReacoes>();
  for (const r of todas) {
    if (r.targetType !== targetType) continue;
    const c = mapa.get(r.targetId) ?? { gosto: 0, adoro: 0, minha: null };
    if (r.tipo === "gosto") c.gosto += 1;
    if (r.tipo === "adoro") c.adoro += 1;
    if (r.userId === meId) c.minha = r.tipo as "gosto" | "adoro";
    mapa.set(r.targetId, c);
  }
  return mapa;
}
