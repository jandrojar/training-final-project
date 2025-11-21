import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class PrismaProjectRepository {
  async createProject(data: { title: string; userId: string }) {
    return prisma.project.create({
      data,
    });
  }

  // Returns all projects that belong to a specific user
  async getProjectsByUser(userId: string) {
    return prisma.project.findMany({
      where: { userId },
    });
  }

  // Only returns the project if it belongs to the user
  async getProjectByIdForUser(projectId: string, userId: string) {
    return prisma.project.findFirst({
      where: {
        id: projectId,
        userId: userId,
      },
    });
  }
}
