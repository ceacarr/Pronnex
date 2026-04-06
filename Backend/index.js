import authRoutes from "./routes/auth.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(morgan("dev"));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB bağlandı"))
  .catch((err) => { console.error("❌ MongoDB hatası:", err.message); process.exit(1); });

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.status(200).json({ message: "Pronnex API 🚀" }));

app.use((req, res) => {
  res.status(404).json({ message: "Route bulunamadı" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Sunucu hatası" });
});

app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));