// routes/auth.js
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias em ms
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
 
        // Busca os dados atualizados do usuário no banco
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


export default router;