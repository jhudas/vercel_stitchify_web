import mongoose from 'mongoose';

const InventoryItemSchema = new mongoose.Schema({
  name:        { type: String, required: [true, 'Name is required'] },
  status:      { type: String, enum: ['pending', 'on process', 'done'], required: true, default: 'pending' },
  serviceType: { type: String, enum: ['customization', 'printing'], required: true },
  quantity:    { type: Number, required: true, min: 0 },
  price:       { type: Number, required: true, min: 0 },
}, { timestamps: true });

export default mongoose.model('InventoryItem', InventoryItemSchema);
