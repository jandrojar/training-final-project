import { Context } from "koa";
import { login as loginService, logout as logoutService } from "../services/authService";

export async function login (ctx: Context) :Promise<void> {
	const {email,password} = ctx.request.body as {email:string,password:string}

    if(!email || !password){
        ctx.status=400
        ctx.body={error:'Missing credentials'}
        return
    }

    try {
        const session = await loginService(email,password)
        ctx.status=200
        ctx.body = session
    } catch (err) {
        if(err instanceof Error && err.message==='Invalid credentials'){
            ctx.status=401
            ctx.body={error: 'invalid credentials'}
            return;
        }
        
        ctx.status=500
        ctx.body={error: 'Internal server error'}
    }
}

export async function logout(ctx: Context) {
  const { sessionId } = ctx.request.body as { sessionId: string };

  if (!sessionId) {
    ctx.status = 400;
    ctx.body = { error: "session-id-required" };
    return;
  }

  try {
    await logoutService(sessionId);
    ctx.status = 200;
    ctx.body = { success: true };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: "internal-error" };
  }
}