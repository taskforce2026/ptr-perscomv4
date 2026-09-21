"use client";

export function BotaoImprimir({ label = "🖨 Imprimir / PDF" }: { label?: string }) {
  return (
    <button type="button" className="btn btn-primary print:hidden" onClick={() => window.print()}>
      {label}
    </button>
  );
}
