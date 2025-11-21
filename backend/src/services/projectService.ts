import PrismaProjectRepository from "../repositories/ProjectPrismaRepository";

const projectRepo = new PrismaProjectRepository();

export async function createProject(userId: string, title: string) {
  if (!title || title.trim().length === 0) {
    throw new Error("invalid-title");
  }

  return projectRepo.createProject({
    title: title.trim(),
    userId,
  });
}

export async function getProjectsForUser(userId: string) {
  return projectRepo.getProjectsByUser(userId);
}

export async function getProjectForUser(projectId: string, userId: string) {
  const project = await projectRepo.getProjectByIdForUser(projectId, userId);

  if (!project) {
    throw new Error("not-found-or-not-authorized");
  }

  return project;
}
