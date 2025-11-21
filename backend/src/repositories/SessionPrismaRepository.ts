import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default class SessionPrismaRepository {

    async createSession(userId: string, expiresAt: Date) {
        return prisma.session.create({data: {userId, expiresAt}
        });
    }

    async findSessionById(id: string) {
        return prisma.session.findUnique({
            where: { id },
          });
    }

    async deleteSession(id:string) {
        return prisma.session.delete({
            where:{id},
          });
    }

    async deleteSessionByUser(userId:string){
        return prisma.session.deleteMany({
            where:{userId},
        });
        
    }    


}