import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  type:        { type: String, enum: ['customization', 'printing'], required: true },
  customer:    { type: String, required: [true, 'Customer name is required'] },
  contact:     { type: String, required: [true, 'Contact is required'] },
  description: { type: String, required: [true, 'Description is required'] },
  qty:         { type: Number, required: true, min: 1 },
  price:       { type: Number, required: true, min: 0 },
  dueDate:     { type: Date,   required: [true, 'Due date is required'] },
  status:      { type: String, enum: ['pending', 'in progress', 'completed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);
