import prisma from '../prisma.js';

export const getAdminStats = async (req, res) => {
  try {
    const [
      totalOrders,
      totalProducts,
      totalUsers,
      allOrders,
      lowStockProducts,
      recentOrders
    ] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.order.findMany({
        select: { totalAmount: true, status: true }
      }),
      prisma.product.findMany({
        where: { stock: { lt: 5 } },
        select: { id: true, title: true, stock: true, price: true }
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: true
        }
      })
    ]);

    const totalRevenue = allOrders
      .filter((o) => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const ordersByStatus = {
      PENDING: allOrders.filter((o) => o.status === 'PENDING').length,
      PROCESSING: allOrders.filter((o) => o.status === 'PROCESSING').length,
      SHIPPED: allOrders.filter((o) => o.status === 'SHIPPED').length,
      DELIVERED: allOrders.filter((o) => o.status === 'DELIVERED').length,
      CANCELLED: allOrders.filter((o) => o.status === 'CANCELLED').length
    };

    res.json({
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalOrders,
      totalProducts,
      totalUsers,
      ordersByStatus,
      lowStockProducts,
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Error fetching admin stats', error: error.message });
  }
};
