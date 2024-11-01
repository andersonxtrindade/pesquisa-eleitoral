import express from 'express';
import { getAllStates, getCityByState } from '../controllers/LocalidadesController.js';

const router = express.Router();

router.get('/estados', getAllStates);
router.get('/cidades', getCityByState);

export default router;
