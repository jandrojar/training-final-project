import { Context } from "koa";
import { createProject, getProjectsForUser, getProjectForUser } from "../services/projectService";

export async function createProjectHandler(ctx: Context) {
  const userId = ctx.state.userId; 
  const { title } = ctx.request.body as { title: string };

  if (!title) {
    ctx.status = 400;
    ctx.body = { error: "title-required" };
    return;
  }

  try {
    const project = await createProject(userId, title);
    ctx.status = 201;
    ctx.body = project;
  } catch (err) {
    if (err instanceof Error && err.message === "invalid-title") {
      ctx.status = 400;
      ctx.body = { error: "invalid-title" };
      return;
    }

    ctx.status = 500;
    ctx.body = { error: "internal-error" };
  }
}

export async function getProjectsHandler(ctx: Context) {
  const userId = ctx.state.userId;

  const projects = await getProjectsForUser(userId);
  ctx.status = 200;
  ctx.body = projects;
}

export async function getProjectHandler(ctx: Context) {
  const userId = ctx.state.userId;
  const { id } = ctx.params;

  try {
    const project = await getProjectForUser(id, userId);
    ctx.status = 200;
    ctx.body = project;
  } catch (err) {
    if (err instanceof Error && err.message === "not-found-or-not-authorized") {
      ctx.status = 404;
      ctx.body = { error: "not-found" };
      return;
    }

    ctx.status = 500;
    ctx.body = { error: "internal-error" };
  }
}
