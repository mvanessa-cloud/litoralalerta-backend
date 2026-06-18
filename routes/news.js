import express from "express";
import fs from "fs";
import path from "path";

import { prisma } from '../lib/prisma.js';
import { autenticar, podePublicar } from "../middlewares/auth.js";
import { uploadFotoCapa } from "../middlewares/upload.js";

const router = express.Router();

// Transforma um título em slug: minúsculas, sem acento, espaços -> hífen
function gerarSlugBase(texto = "") {
    return texto
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove acentos
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "") // remove caracteres especiais
        .replace(/\s+/g, "-") // espaços -> hífen
        .replace(/-+/g, "-") // remove hífens duplicados
        .replace(/^-|-$/g, ""); // remove hífen no começo/fim
}

// Garante que o slug gerado é único no banco, adicionando um sufixo numérico se necessário
async function gerarSlugUnico(textoBase) {
    const base = gerarSlugBase(textoBase) || "noticia";
    let slug = base;
    let contador = 1;

    while (await prisma.publicacao.findFirst({ where: { slug } })) {
        slug = `${base}-${contador}`;
        contador++;
    }

    return slug;
}

// GET /noticias — lista todas as notícias
router.get("/", async (req, res, next) => {
    try {
        const noticias = await prisma.publicacao.findMany({
            where: {
                tipo: "noticia",
            },
            orderBy: {
                dataPublicacao: "desc",
            },
            select: {
                id: true,
                slug: true,
                resumo: true,
                fotoCapa: true,
                acessos: true,
                dataPublicacao: true,
                usuario: {
                    select: {
                        id: true,
                        username: true,
                        nome: true,
                        fotoPerfil: true,
                    },
                },
            },
        });

        res.json(noticias);
    } catch (err) {
        next(err);
    }
});

// GET /noticias/:slug — retorna uma notícia pelo slug
router.get("/:slug", async (req, res, next) => {
    try {
        const { slug } = req.params;

        const noticia = await prisma.publicacao.findFirst({
            where: {
                slug,
                tipo: "noticia",
            },
            select: {
                id: true,
                slug: true,
                resumo: true,
                conteudo: true,
                fotoCapa: true,
                acessos: true,
                dataPublicacao: true,
                usuario: {
                    select: {
                        id: true,
                        username: true,
                        nome: true,
                        fotoPerfil: true,
                        bio: true,
                    },
                },
            },
        });

        if (!noticia) {
            return res.status(404).json({ error: "Notícia não encontrada." });
        }

        // Incrementa o contador de acessos em background (fire and forget)
        prisma.publicacao.update({
            where: { id: noticia.id },
            data: { acessos: { increment: 1 } },
        }).catch(() => {});

        res.json(noticia);
    } catch (err) {
        next(err);
    }
});

// POST /noticias — cria uma nova notícia (somente administradores autenticados)
// Recebe multipart/form-data: titulo, resumo, conteudo, fotoCapa (arquivo)
router.post("/", autenticar, podePublicar, (req, res, next) => {
    uploadFotoCapa(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message || "Erro ao enviar a imagem." });
        }

        try {
            const { titulo, resumo, conteudo } = req.body;

            if (!titulo || !titulo.trim()) {
                return res.status(400).json({ error: "O título da notícia é obrigatório." });
            }

            if (!req.file) {
                return res.status(400).json({ error: "A imagem de capa é obrigatória." });
            }

            const slug = await gerarSlugUnico(titulo);
            const fotoCapa = `fotos/${req.file.filename}`;

            const noticia = await prisma.publicacao.create({
                data: {
                    resumo: resumo || titulo,
                    slug,
                    conteudo: conteudo || "",
                    fotoCapa,
                    tipo: "noticia",
                    usuarioId: req.usuario.id,
                },
            });

            res.status(201).json(noticia);
        } catch (err) {
            next(err);
        }
    });
});

// DELETE /noticias/:id — exclui uma notícia (somente administradores/editores autenticados)
router.delete("/:id", autenticar, podePublicar, async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({ error: "ID inválido." });
        }

        const noticia = await prisma.publicacao.findFirst({
            where: { id, tipo: "noticia" },
        });

        if (!noticia) {
            return res.status(404).json({ error: "Notícia não encontrada." });
        }

        // Apenas admin pode excluir notícias de outros autores; editor só exclui as próprias
        if (req.usuario.tipo !== "admin" && noticia.usuarioId !== req.usuario.id) {
            return res.status(403).json({ error: "Você só pode excluir suas próprias notícias." });
        }

        // Remove primeiro os registros dependentes para não violar foreign keys
        await prisma.$transaction([
            prisma.comentario.deleteMany({ where: { publicacaoId: id } }),
            prisma.curtir.deleteMany({ where: { publicacaoId: id } }),
            prisma.publicacao.delete({ where: { id } }),
        ]);

        // Remove o arquivo de imagem do disco (não derruba a request se falhar)
        if (noticia.fotoCapa) {
            const caminhoArquivo = path.join(process.cwd(), "public", noticia.fotoCapa);
            fs.unlink(caminhoArquivo, () => {});
        }

        res.json({ message: "Notícia excluída com sucesso." });
    } catch (err) {
        next(err);
    }
});

export default router;