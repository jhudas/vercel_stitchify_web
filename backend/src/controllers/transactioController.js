import TransactionItem from '../models/TransactionItem.js';

// GET /api/transactions
export const getItems = async (req, res) => {
  try {
    const { serviceType } = req.query;
    const filter = serviceType ? { serviceType } : {};
    const items = await TransactionItem.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/transactions
export const createItem = async (req, res) => {
  try {
    const item = await TransactionItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/transactions/:id
export const updateItem = async (req, res) => {
  try {
    const item = await TransactionItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/transactions/:id
export const deleteItem = async (req, res) => {
  try {
    const item = await TransactionItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
