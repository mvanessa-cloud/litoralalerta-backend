// routes/newsletter.js
import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// POST /newsletter/assinar
router.post("/assinar", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "email é obrigatório" });
  }

  const assinatura = await prisma.newsletter.upsert({
    where: { email },
    update: { ativo: true },
    create: { email },
  });

  res.status(200).json({
    email: assinatura.email,
    assinado: assinatura.ativo,
  });
});

// POST /newsletter/cancelar
router.post("/cancelar", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "email é obrigatório" });
  }

  const existente = await prisma.newsletter.findUnique({
    where: { email },
  });

  if (!existente) {
    return res.status(404).json({ error: "E-mail não encontrado" });
  }

  const assinatura = await prisma.newsletter.update({
    where: { email },
    data: { ativo: false },
  });

  res.json({
    email: assinatura.email,
    assinado: assinatura.ativo,
  });
});

export default router;