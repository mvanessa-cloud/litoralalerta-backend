// routes/auth.js
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { autenticar } from "../middlewares/auth.js";
import { uploadFotoPerfil } from "../middlewares/upload.js";

const router = Router();

const SECRET = process.env.JWT_SECRET;
const IS_PROD = process.env.NODE_ENV === "production";

// POST /auth/cadastrar
router.post("/cadastrar", async (req, res) => {
    const { username, email, senha } = req.body;

    if (!username || !email || !senha) {
        return res.status(400).json({ error: "username, email e senha são obrigatórios" });
    }

    const existente = await prisma.usuario.findUnique({
        where: { username },
    });

    if (existente) {
        return res.status(409).json({ error: "Username já está em uso" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
        data: {
            username,
            email,
            senha: senhaHash,
            tipo: "padrão",
        },
        omit: { senha: true },
    });

    res.status(201).json(usuario);
});

// POST /auth/login
router.post("/login", async (req, res) => {
    const { username, senha } = req.body;

    if (!username || !senha) {
        return res.status(400).json({ error: "username e senha são obrigatórios" });
    }

    const usuario = await prisma.usuario.findUnique({
        where: { username },
    });

    if (!usuario) {
        return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
        return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign(
        { id: usuario.id, username: usuario.username, tipo: usuario.tipo },
        SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: IS_PROD,
        sameSite: IS_PROD ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { senha: _, ...usuarioSemSenha } = usuario;
    res.json(usuarioSemSenha);
});

// POST /auth/logout
router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: IS_PROD,
        sameSite: IS_PROD ? "strict" : "lax",
    });
    res.json({ message: "Logout realizado com sucesso" });
});

// GET /auth/me
router.get("/me", (req, res) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ error: "Não autenticado" });
    }

    try {
        const payload = jwt.verify(token, SECRET);

        prisma.usuario.findUnique({
            where: { id: payload.id },
            omit: { senha: true },
        }).then(usuario => {
            if (!usuario) return res.status(401).json({ error: "Usuário não encontrado" });
            res.json(usuario);
        });

    } catch {
        res.status(401).json({ error: "Token inválido ou expirado" });
    }
});

// PUT /auth/perfil — atualiza dados + foto de perfil do usuário logado
router.put("/perfil", autenticar, (req, res, next) => {
    uploadFotoPerfil(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message || "Erro ao enviar a imagem." });
        }

        try {
            const { id } = req.usuario;
            const { nome, email, bio, local, senhaAtual, novaSenha } = req.body;

            const usuario = await prisma.usuario.findUnique({ where: { id } });

            if (!usuario) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }

            const dataAtualizar = {};

            if (nome !== undefined) dataAtualizar.nome = nome;
            if (email !== undefined) dataAtualizar.email = email;
            if (bio !== undefined) dataAtualizar.bio = bio;
            if (local !== undefined) dataAtualizar.local = local;

            // Se veio nova foto de perfil, salva e apaga a antiga
            if (req.file) {
                dataAtualizar.fotoPerfil = `fotos/perfil/${req.file.filename}`;

                if (usuario.fotoPerfil) {
                    const caminhoAntigo = path.join(process.cwd(), "public", usuario.fotoPerfil);
                    fs.unlink(caminhoAntigo, () => {});
                }
            }

            // Troca de senha é opcional e exige a senha atual
            if (novaSenha) {
                if (!senhaAtual) {
                    return res.status(400).json({ error: "Informe a senha atual para definir uma nova senha" });
                }

                const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
                if (!senhaValida) {
                    return res.status(401).json({ error: "Senha atual incorreta" });
                }

                if (novaSenha.length < 4) {
                    return res.status(400).json({ error: "A nova senha deve ter pelo menos 4 caracteres" });
                }

                dataAtualizar.senha = await bcrypt.hash(novaSenha, 10);
            }

            const usuarioAtualizado = await prisma.usuario.update({
                where: { id },
                data: dataAtualizar,
                omit: { senha: true },
            });

            res.json(usuarioAtualizado);
        } catch (err) {
            next(err);
        }
    });
});

// DELETE /auth/perfil — exclui a conta do usuário logado
router.delete("/perfil", autenticar, async (req, res, next) => {
    try {
        const { id } = req.usuario;
        const { senha } = req.body;

        if (!senha) {
            return res.status(400).json({ error: "Informe sua senha para confirmar a exclusão" });
        }

        const usuario = await prisma.usuario.findUnique({ where: { id } });

        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ error: "Senha incorreta" });
        }

        await prisma.$transaction([
            prisma.comentario.deleteMany({ where: { usuarioId: id } }),
            prisma.curtir.deleteMany({ where: { usuarioId: id } }),
            prisma.seguir.deleteMany({ where: { seguidorId: id } }),
            prisma.publicacao.deleteMany({ where: { usuarioId: id } }),
            prisma.usuario.delete({ where: { id } }),
        ]);

        res.clearCookie("token", {
            httpOnly: true,
            secure: IS_PROD,
            sameSite: IS_PROD ? "strict" : "lax",
        });

        res.json({ message: "Conta excluída com sucesso" });
    } catch (err) {
        next(err);
    }
});

export default router;