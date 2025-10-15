import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import { billingRouter, billingWebhookRouter } from "./routes/billing.js";
import { aiRouter } from "./routes/ai.js";
import { uploadRouter } from "./routes/upload.js";
import { usageRouter } from "./routes/usage.js";
import healthRouter from "./routes/health.js";
import { errorHandler } from "./middleware/error-handler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = express();

const corsOrigin = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map((origin) => origin.trim());

app.use(helmet());
app.use(cors({ origin: corsOrigin }));
app.use(rateLimit({ windowMs: 60_000, max: 60 }));

app.use("/billing", billingWebhookRouter);

app.use(express.json({ limit: "2mb" }));

app.use("/health", healthRouter);
app.use("/ai", aiRouter);
app.use("/upload", uploadRouter);
app.use("/usage", usageRouter);
app.use("/billing", billingRouter);

app.use(errorHandler);

const port = Number(process.env.PORT || 8080);
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
