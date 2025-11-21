import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default class UserPrismaRepository {
	async findAll() {
		return prisma.user.findMany()
	}

    async findById(id: string) {
        return prisma.user.findUnique({
            where: { id }
        })
    }

    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
        })
    }

    async create(data: {
        name: string;
        lastname?: string | null;
        age: number;
        email: string;
        password: string;
        }) {
        return prisma.user.create({ data})
    }

    async update(id: string, data: Partial<{
    name: string;
    lastname?: string | null;
    age: number;
    email: string;
    password: string;
    }>) {
        return prisma.user.update({
        where: { id },
        data,
        });
    }

    async delete(id: string) {
        return prisma.user.delete({
        where: { id },
        });
    }
}