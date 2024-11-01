import express from 'express';
import { getPesquisas, getAllPesquisasIdsController } from '../controllers/PesquisasController.js';

const router = express.Router();

router.get('/ids', getAllPesquisasIdsController);
router.get('/', getPesquisas);

export default router;
