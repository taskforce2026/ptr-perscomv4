import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { utilizadorActual } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const u = await utilizadorActual();
  if (!u) return Response.json({ ok: false }, { status: 401 });
  const lista = await db.query.notifications.findMany({
    where: eq(notifications.userId, u.id),
    orderBy: [desc(notifications.criadoEm)],
    limit: 25,
  });
  return Response.json({
    ok: true,
    notificacoes: lista.map((n) => ({
      id: n.id,
      titulo: n.titulo,
      corpo: n.corpo,
      href: n.href,
      lida: n.lida,
      criadoEm: n.criadoEm.toISOString(),
    })),
  });
}
