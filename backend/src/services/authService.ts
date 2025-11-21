import UserPrismaRepository from "../repositories/UserPrismaRepository";
import SessionPrismaRepository from "../repositories/SessionPrismaRepository";

const userRepo = new UserPrismaRepository();
const sessionRepo = new SessionPrismaRepository();

export async function login(email: string, password: string) {
    const user = await userRepo.findByEmail(email);
    if(!user){
        throw new Error('Invalid credentials');
    }

    if(user.password !== password){
        throw new Error('Invalid credentials');
    }

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    const session = await sessionRepo.createSession(user.id, expiresAt);

    return {
        sessionId: session.id,
        expiresAt,
        userId: user.id
    };
}

export async function logout(sessionId: string) {
    await sessionRepo.deleteSession(sessionId);
    return {success:true}
}