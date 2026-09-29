import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./config/data-source.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: "https://frontend.binarybonds.madagascar.webcup.hodi.cloud",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);

// Database connection & Server initialization
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Connexion à la base de données MySQL établie avec succès (TypeORM).");
    app.listen(PORT, () => {
      console.log(`🚀 Serveur API démarré sur http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Erreur de connexion à la base de données:", error);
    process.exit(1);
  });
