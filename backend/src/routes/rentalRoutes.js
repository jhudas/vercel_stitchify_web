import express from 'express';
import { getRentals, createRental, updateRental, deleteRental } from '../controllers/rentalController.js';

const router = express.Router();

router.get('/',      getRentals);
router.post('/',     createRental);
router.put('/:id',   updateRental);
router.delete('/:id',deleteRental);

export default router;
