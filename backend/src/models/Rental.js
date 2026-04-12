import mongoose from 'mongoose';

const RentalSchema = new mongoose.Schema({
  item:        { type: String, required: [true, 'Item name is required'] },
  customer:    { type: String, required: [true, 'Customer name is required'] },
  contact:     { type: String, required: [true, 'Contact is required'] },
  rentalDate:  { type: Date,   required: [true, 'Rental date is required'] },
  dueDate:     { type: Date,   required: [true, 'Due date is required'] },
  price:       { type: Number, required: [true, 'Price is required'], min: 0 },
  status:      { type: String, enum: ['active', 'returned', 'overdue'], default: 'active' },
}, { timestamps: true });

export default mongoose.model('Rental', RentalSchema);
