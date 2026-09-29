import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/data-source.js";
import { User } from "../entities/User.js";
import { AuthRequest } from "../middlewares/auth.middleware.js";

const userRepository = AppDataSource.getRepository(User);

// Inscription (Register)
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      res.status(400).json({ message: "Veuillez remplir tous les champs obligatoires (nom, email, mot de passe)." });
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      res.status(400).json({ message: "Format d'adresse email invalide." });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères." });
      return;
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await userRepository.findOne({ where: { email: trimmedEmail } });
    if (existingUser) {
      res.status(409).json({ message: "Un compte avec cette adresse email existe déjà." });
      return;
    }

    // Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Création de l'utilisateur
    const newUser = userRepository.create({
      name: name.trim(),
      email: trimmedEmail,
      password: hashedPassword,
    });

    await userRepository.save(newUser);

    // Génération du JWT
    const secret = process.env.JWT_SECRET || "default_jwt_secret";
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      secret,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Compte créé avec succès !",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Erreur lors de l'inscription:", error);
    res.status(500).json({ message: "Erreur serveur lors de la création du compte.", error: error.message });
  }
};

// Connexion (Login)
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Veuillez renseigner votre email et votre mot de passe." });
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Recherche de l'utilisateur avec son mot de passe haché
    const user = await userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email: trimmedEmail })
      .getOne();

    if (!user) {
      res.status(401).json({ message: "Identifiants incorrects (email ou mot de passe erroné)." });
      return;
    }

    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Identifiants incorrects (email ou mot de passe erroné)." });
      return;
    }

    // Génération du token JWT
    const secret = process.env.JWT_SECRET || "default_jwt_secret";
    const token = jwt.sign(
      { id: user.id, email: user.email },
      secret,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Connexion réussie !",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ message: "Erreur serveur lors de la connexion.", error: error.message });
  }
};

// Déconnexion (Logout)
export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Les tokens JWT étant stateless, la déconnexion principale se fait côté client en supprimant le token.
    res.status(200).json({ message: "Déconnexion réussie." });
  } catch (error: any) {
    res.status(500).json({ message: "Erreur lors de la déconnexion." });
  }
};

// Obtenir les informations de l'utilisateur connecté (Protected Route)
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Non authentifié." });
      return;
    }

    const user = await userRepository.findOne({ where: { id: req.userId } });
    if (!user) {
      res.status(404).json({ message: "Utilisateur introuvable." });
      return;
    }

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("Erreur lors de la récupération du profil:", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération du profil." });
  }
};
