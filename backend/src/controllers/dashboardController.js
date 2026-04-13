import Rental from '../models/Rental.js';
import Order from '../models/Order.js';

// GET /api/dashboard/stats
export const getStats = async (req, res) => {
  try {
    const [activeRentals, pendingOrders, rentals, orders] = await Promise.all([
      Rental.countDocuments({ status: 'active' }),
      Order.countDocuments({ status: 'pending' }),
      Rental.find(),
      Order.find({ status: 'completed' }),
    ]);

    // Sales summary
    const rentalRevenue = rentals.reduce((sum, r) => sum + (r.price || 0), 0);
    const customRevenue = orders
      .filter(o => o.type === 'customization')
      .reduce((sum, o) => sum + (o.price || 0), 0);
    const printRevenue = orders
      .filter(o => o.type === 'printing')
      .reduce((sum, o) => sum + (o.price || 0), 0);

    res.json({
      activeRentals,
      pendingOrders,
      rentalRevenue,
      customRevenue,
      printRevenue,
      totalRevenue: rentalRevenue + customRevenue + printRevenue,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
