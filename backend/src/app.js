import express from "express";
import cors from 'cors';
import { indexRoutes } from "./routes/index.js"; 
import { initializeModels } from "./models/index.js";

const app = express();
app.use(express.json());
app.use(cors());

initializeModels();
 
app.use("/", indexRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
