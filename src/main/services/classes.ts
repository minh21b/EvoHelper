import { PrismaClient } from "@prisma/client";

export function createClassesService (prismaClient: PrismaClient) {
    const prisma = prismaClient;

    return {
        async getAllClasses() {
            return await prisma.class.findMany();
        },
        async getAllClassesArray() {
            const classes = await prisma.class.findMany();
            return classes.map(e => e.name)
        },
        async getT4ClassesArray() {
            const classes = await prisma.class.findMany({
                where: {
                    tier: 4
                }
            })
            return classes.map(e => e.name)
        }
    }
}