import { Context, Next } from "koa";
import SessionPrismaRepository from "../repositories/SessionPrismaRepository";

const sessionRepo = new SessionPrismaRepository();

export async function authMiddleware(ctx: Context, next: Next) {
  const sessionId = ctx.headers["authorization"]; // 

  if (!sessionId || typeof sessionId !== "string") {
    ctx.status = 401;
    ctx.body = { error: "missing-session" };
    return;
  }

  // Buscar sesión en BD
  const session = await sessionRepo.findSessionById(sessionId);

  if (!session) {
    ctx.status = 401;
    ctx.body = { error: "invalid-session" };
    return;
  }

  // Comprobar expiración
  const now = new Date();
  if (session.expiresAt < now) {
    ctx.status = 401;
    ctx.body = { error: "session-expired" };
    return;
  }

  // Guardamos el userId en ctx.state para usarlo en controllers
  ctx.state.userId = session.userId;

  // Dejar pasar
  await next();
}
