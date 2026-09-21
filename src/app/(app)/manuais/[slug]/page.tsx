import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirSessao } from "@/lib/auth";
import { manualPorSlug } from "@/lib/manuais";
import { BotaoImprimir } from "@/components/botao-imprimir";

export const dynamic = "force-dynamic";

export default async function ManualPage({ params }: { params: Promise<{ slug: string }> }) {
  await exigirSessao();
  const { slug } = await params;
  const manual = manualPorSlug(slug);
  if (!manual) notFound();

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 print:hidden">
        <Link href="/manuais" className="btn btn-ghost">
          ← Manuais e Comunicações
        </Link>
        <BotaoImprimir />
      </div>

      <article className="manual-doc mx-auto max-w-[210mm] rounded-sm border-2 border-[#c9a227] bg-[#f4ecd4] text-[#1a1408] shadow-2xl">
        <div className="bg-[#3a0c0c] px-4 py-1 text-center text-[10px] font-black uppercase tracking-[0.4em] text-[#f5d0d0]">
          Phoenix Taskforce Rangers · Documento de Instrução
        </div>
        <div className="px-8 py-6">
          <header className="flex items-center gap-4 border-b-2 border-[#c9a227] pb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/emblema.png" alt="PTR" className="h-16 w-16 rounded-full ring-2 ring-[#c9a227]" />
            <div>
              <div className="text-[10px] uppercase tracking-[0.35em] text-[#7a651f]">{manual.classe}</div>
              <h1 className="font-[family-name:var(--font-display)] text-2xl font-black leading-tight">{manual.titulo}</h1>
            </div>
          </header>
          <p className="mt-4 text-sm leading-relaxed">{manual.introducao}</p>
          {manual.secoes.map((s) => (
            <section key={s.titulo} className="mt-5">
              <h2 className="font-[family-name:var(--font-display)] text-base font-bold uppercase tracking-wide text-[#5b4a12]">
                {s.titulo}
              </h2>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{s.corpo}</p>
            </section>
          ))}
          <footer className="mt-8 grid grid-cols-2 gap-6">
            <div>
              <div className="h-10 border-b border-[#c9a227]/60" />
              <div className="mt-1 text-[11px] uppercase tracking-wider text-[#7a651f]">O militar</div>
            </div>
            <div className="text-right">
              <div className="h-10 border-b border-[#c9a227]/60" />
              <div className="mt-1 text-[11px] uppercase tracking-wider text-[#7a651f]">Centro de Instrução · PTR</div>
            </div>
          </footer>
        </div>
        <div className="bg-[#3a0c0c] px-4 py-1 text-center text-[10px] font-black uppercase tracking-[0.35em] text-[#f5d0d0]">
          Confidencial · Reprodução autorizada apenas ao efectivo PTR
        </div>
      </article>
    </div>
  );
}
