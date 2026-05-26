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


app.get("/", (req: Request, res: Response) => {
  res.send("Hello from root of the project");
});
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(limiter);



app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksRoutes);

app.use(errorMiddleware);



app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});