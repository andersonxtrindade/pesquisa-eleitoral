import express from "express";
import multer from "multer";
import * as localidadeController from "../controllers/LocalidadesController.js";
import * as pesquisaController from "../controllers/PesquisasController.js";
import pesquisaRoutes from './pesquisaRoutes.js';
import localidadeRoutes from './localidadeRoutes.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post("/api/populate", localidadeController.populate);
router.post("/api/populate-research", upload.single("csvFile"), pesquisaController.importAndInsertSearchCsv);
router.get("/api/population-periods", localidadeController.getPopulationPeriods); 

router.use('/api/pesquisas', pesquisaRoutes);
router.use('/api/localidades', localidadeRoutes);

export { router as indexRoutes };
