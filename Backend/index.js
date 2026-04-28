import authRoutes from "./routes/auth.js";
import workspaceRoutes from "./routes/workspace.js";
import projectRoutes from "./routes/project.js";
import taskRoutes from "./routes/task.js";
import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = new Set([
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean));

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(helmet());  

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // 15 dakika içinde aynı IP'den gelebilecek maksimum istek sayısı
  message: {
    status: 429,
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});


app.use(limiter);
app.use(morgan("dev"));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB bağlandı"))
  .catch((err) => { console.error("❌ MongoDB hatası:", err.message); process.exit(1); });


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes); 
app.use("/api/projects", projectRoutes);
app.use("/api/task", taskRoutes);
app.get("/", (req, res) => res.status(200).json({ message: "Pronnex API 🚀" }));

app.use((req, res) => {
  res.status(404).json({ message: "Route bulunamadı" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Sunucu hatası" });
});

app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
