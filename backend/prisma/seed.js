const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('password123', 10);

    const users = [
        { name: 'Alice Admin', email: 'alice@example.com', role: 'ADMIN', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice' },
        { name: 'Bob Builder', email: 'bob@example.com', role: 'USER', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob' },
        { name: 'Charlie Customer', email: 'charlie@example.com', role: 'USER', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie' },
        { name: 'Diana Designer', email: 'diana@example.com', role: 'USER', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diana' },
        { name: 'Evan Engineer', email: 'evan@example.com', role: 'USER', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=evan' },
        { name: 'Fiona Founder', email: 'fiona@example.com', role: 'ADMIN', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fiona' },
        { name: 'George Guest', email: 'george@example.com', role: 'USER', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=george' },
        { name: 'Hannah HR', email: 'hannah@example.com', role: 'USER', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hannah' },
    ];

    console.log(`Start seeding ...`);
    for (const u of users) {
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: {
                email: u.email,
                name: u.name,
                password,
                role: u.role,
                image: u.image,
                emailVerified: new Date(),
            },
        });
        console.log(`Created user with id: ${user.id}`);
    }
    console.log(`Seeding finished.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
