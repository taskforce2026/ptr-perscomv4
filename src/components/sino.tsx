"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { apagarNotificacao, limparNotificacoes, marcarNotificacoesLidas } from "@/lib/actions";

export type Notif = {
  id: number;
  titulo: string;
  corpo: string | null;
  href: string | null;
  lida: boolean;
  criadoEm: string;
};

let audioCtx: AudioContext | null = null;

function tocarAviso() {
  try {
    const AC: typeof AudioContext | undefined =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === "suspended") void audioCtx.resume();
    const ctx = audioCtx;
    const t0 = ctx.currentTime;
    [880, 1320].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      const start = t0 + i * 0.15;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.14);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.16);
    });
  } catch {
    // áudio indisponível — ignora
  }
}

export function SinoNotificacoes({ iniciais }: { iniciais: Notif[] }) {
  const [aberto, setAberto] = useState(false);
  const [lista, setLista] = useState(iniciais);
  const [pending, start] = useTransition();
  const router = useRouter();
  const idsRef = useRef<Set<number>>(new Set(iniciais.map((n) => n.id)));
  const naoLidas = lista.filter((n) => !n.lida).length;

  // Desbloqueia o áudio no primeiro gesto do utilizador.
  useEffect(() => {
    const desbloquear = () => {
      try {
        if (!audioCtx) {
          const AC: typeof AudioContext | undefined =
            window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
          if (AC) audioCtx = new AC();
        }
        if (audioCtx?.state === "suspended") void audioCtx.resume();
      } catch {
        // ignora
      }
    };
    document.addEventListener("pointerdown", desbloquear, { once: true });
    return () => document.removeEventListener("pointerdown", desbloquear);
  }, []);

  // Notificações dinâmicas: verifica a cada 5 s e toca aviso quando chegam novas.
  useEffect(() => {
    async function verificar() {
      try {
        const r = await fetch("/api/notificacoes", { cache: "no-store" });
        if (!r.ok) return;
        const dados = (await r.json()) as { notificacoes: Notif[] };
        const remotas = dados.notificacoes;
        const novas = remotas.filter((n) => !idsRef.current.has(n.id));
        idsRef.current = new Set(remotas.map((n) => n.id));
        if (novas.length > 0) tocarAviso();
        setLista(remotas);
      } catch {
        // tenta de novo no próximo ciclo
      }
    }
    void verificar();
    const t = setInterval(verificar, 5_000);
    return () => clearInterval(t);
  }, []);

  function correr(fn: () => Promise<unknown>) {
    start(async () => {
      await fn();
      router.refresh();
    });
  }

  function eliminarLocal(id: number) {
    setLista((prev) => prev.filter((n) => n.id !== id));
    idsRef.current.delete(id);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        className="relative grid h-10 w-10 place-items-center rounded-full border border-gold-500/30 text-lg text-gold-300 hover:bg-gold-500/10"
        aria-label="Notificações"
      >
        🔔
        {naoLidas > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 animate-pulse place-items-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">
            {naoLidas > 9 ? "9+" : naoLidas}
          </span>
        )}
      </button>
      {aberto && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-gold-500/25 bg-forest-900 shadow-2xl">
          <div className="flex items-center justify-between gap-1 border-b border-gold-500/15 px-3 py-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
              Notificações {pending ? "· …" : ""}
            </span>
            <div className="flex gap-1">
              {naoLidas > 0 && (
                <button
                  type="button"
                  onClick={() => correr(() => marcarNotificacoesLidas())}
                  className="rounded-full border border-gold-500/30 px-2 py-0.5 text-[10px] font-bold text-gold-300 hover:bg-gold-500/10"
                >
                  ✓ Lidas
                </button>
              )}
              {lista.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setLista([]);
                    idsRef.current.clear();
                    correr(() => limparNotificacoes());
                  }}
                  className="rounded-full border border-red-500/30 px-2 py-0.5 text-[10px] font-bold text-red-300 hover:bg-red-500/10"
                >
                  🗑 Limpar
                </button>
              )}
            </div>
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {lista.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-slate-500">Sem notificações.</li>
            ) : (
              lista.map((n) => (
                <li
                  key={n.id}
                  className={`flex items-start gap-2 border-b border-white/5 px-3 py-2 ${n.lida ? "" : "bg-gold-500/5"}`}
                >
                  <div className="min-w-0 flex-1">
                    {n.href ? (
                      <Link href={n.href} onClick={() => setAberto(false)} className="block">
                        <div className="text-sm font-semibold text-gold-200">{n.titulo}</div>
                        {n.corpo && <div className="whitespace-pre-wrap text-xs text-slate-400">{n.corpo}</div>}
                      </Link>
                    ) : (
                      <>
                        <div className="text-sm font-semibold text-gold-200">{n.titulo}</div>
                        {n.corpo && <div className="whitespace-pre-wrap text-xs text-slate-400">{n.corpo}</div>}
                      </>
                    )}
                  </div>
                  <div className="mt-0.5 flex shrink-0 flex-col gap-1">
                    {!n.lida && (
                      <button
                        type="button"
                        title="Marcar como lida"
                        onClick={() => correr(() => marcarNotificacoesLidas())}
                        className="grid h-6 w-6 place-items-center rounded-full border border-gold-500/30 text-[10px] text-gold-300 hover:bg-gold-500/10"
                      >
                        ✓
                      </button>
                    )}
                    <button
                      type="button"
                      title="Eliminar notificação"
                      onClick={() => {
                        eliminarLocal(n.id);
                        correr(() => apagarNotificacao(formDataId(n.id)));
                      }}
                      className="grid h-6 w-6 place-items-center rounded-full border border-red-500/30 text-[10px] text-red-300 hover:bg-red-500/10"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function formDataId(id: number) {
  const fd = new FormData();
  fd.set("id", String(id));
  return fd;
}
