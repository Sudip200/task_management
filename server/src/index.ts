import express, { type Request,Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes";
import { errorMiddleware } from "./middlewares/error.middleware";
import tasksRoutes from "./routes/tasksRoutes";
import { limiter } from "./middlewares/ratelimit.middleware";


dotenv.config();

const app = express();


const allowedOrigins = [
  process.env.CLIENT_URL
];

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());
app.use(helmet());

app.use(limiter);



app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksRoutes);

app.use(errorMiddleware);



app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});