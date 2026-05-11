import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';

async function main() {
	const adminHash = await bcrypt.hash('password', 10);
	const managerHash = await bcrypt.hash('password', 10);

	const admin = await prisma.user.upsert({
		where: { email: 'admin@recipefinder.com' },
		update: {},
		create: {
			name: 'Administrador',
			username: 'admin',
			email: 'admin@recipefinder.com',
			password: adminHash,
			role: 'admin',
		},
	});

	const manager = await prisma.user.upsert({
		where: { email: 'content_manager@recipefinder.com' },
		update: {},
		create: {
			name: 'Gerente de Conteúdo',
			username: 'content_manager',
			email: 'content_manager@recipefinder.com',
			password: managerHash,
			role: 'content_manager',
		},
	});

	console.log('Seed completed.');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
