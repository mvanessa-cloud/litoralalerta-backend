import express from "express";

import { prisma } from '../lib/prisma.js';

const router = express.Router();

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

export default router;