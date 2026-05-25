import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from '../../lib/prisma.js';

const usuarios = [
    {
        id: 1,
        username: "admin",
        nome: "Administrador",
        email: "admin@example.com",
        senha: "admin123",
        tipo: "admin",
        bio: "Administrador do sistema.",
        fotoPerfil: null,
        local: "Caraguatatuba, SP",
    },
    {
        id: 2,
        username: "litoralalerta",
        nome: "Litoral Alerta",
        email: "litoralalerta@litoralalerta.com.br",
        senha: "editor123",
        tipo: "editor",
        bio: "Responsável pela gestão de conteúdo do site.",
        fotoPerfil: null,
        local: "Caraguatatuba, SP",
    },
];

async function main() {
    console.log("🌱 Iniciando seed de usuários...");

    for (const usuario of usuarios) {
        const senhaHash = await bcrypt.hash(usuario.senha, 10);

        const criado = await prisma.usuario.upsert({
            where: { id: usuario.id },
            update: {},
            create: {
                id: usuario.id,
                username: usuario.username,
                nome: usuario.nome,
                email: usuario.email,
                senha: senhaHash,
                tipo: usuario.tipo,
                bio: usuario.bio,
                fotoPerfil: usuario.fotoPerfil,
                local: usuario.local,
            },
        });

        console.log(`✅ Usuário criado: [${criado.id}] ${criado.username} (${criado.tipo})`);
        console.log(`   📧 Email: ${usuario.email}`);
        console.log(`   🔑 Senha: ${usuario.senha}\n`);
    }

    console.log("🎉 Seed concluído! 2 usuários inseridos.");
}

main()
    .catch((e) => {
        console.error("❌ Erro durante o seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });