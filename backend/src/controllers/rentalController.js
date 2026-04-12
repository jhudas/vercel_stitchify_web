import Rental from '../models/Rental.js';

// GET /api/rentals
export const getRentals = async (req, res) => {
  try {
    const rentals = await Rental.find().sort({ createdAt: -1 });
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/rentals
export const createRental = async (req, res) => {
  try {
    const rental = await Rental.create(req.body);
    res.status(201).json(rental);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/rentals/:id
export const updateRental = async (req, res) => {
  try {
    const rental = await Rental.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    res.json(rental);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/rentals/:id
export const deleteRental = async (req, res) => {
  try {
    const rental = await Rental.findByIdAndDelete(req.params.id);
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    res.json({ message: 'Rental deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
