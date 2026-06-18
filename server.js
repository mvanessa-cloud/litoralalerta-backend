import "dotenv/config";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import newsletterRoutes from "./routes/newsletter.js";
import newsRoutes from "./routes/news.js";

// Environment variables
const PORT = process.env.PORT;
const ORIGIN = process.env.ORIGIN;

// App
const app = express();

// Middleware
app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

// Routes
app.use("/auth", authRoutes);
app.use("/newsletter", newsletterRoutes);
app.use("/noticias", newsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});