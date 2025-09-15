import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// ✅ Inscription
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  // Vérifier si l'utilisateur existe déjà
  const existing = await prisma.users.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ error: "Utilisateur déjà existant" });
  }

  // Hash du mot de passe
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // Sauvegarde
  const user = await prisma.users.create({
    data: {
      email,
      password_hash: hash,
      name,
    },
  });

  res.json({ message: "Utilisateur créé", id: user.id });
});

// ✅ Connexion
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Utilisateur introuvable" });

  // Vérifier le mot de passe
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) return res.status(401).json({ error: "Mot de passe incorrect" });

  // Génération d’un token JWT
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

  res.json({ message: "Connexion réussie", token });
});

export default router;
