import express from "express"
import cors from "cors"
import "dotenv/config"
import userRouter from "./routes/userRouter/route.js";
const PORT = Number(process.env.PORT) || 3000
const app = express()

app.use(cors());
app.use(express.json());

app.use("/api", userRouter);

app.listen(PORT, ()=> console.log("Servidor ativo na porta "+PORT));