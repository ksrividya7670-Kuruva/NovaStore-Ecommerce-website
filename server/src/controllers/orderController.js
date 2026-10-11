import prisma from '../prisma.js';

const generateTrackingNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TRK-${timestamp}-${random}`;
};

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod = 'Credit Card' } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item.' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required.' });
    }

    // Verify products exist and have sufficient stock
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ID ${item.productId} not found.` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${product.title}". Available: ${product.stock}, requested: ${item.quantity}.`
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      validatedItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Run order creation and stock decrement in transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Decrement stock
      for (const item of validatedItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      // 2. Create order with nested order items
      const createdOrder = await tx.order.create({
        data: {
          userId: req.user.id,
          totalAmount: parseFloat(totalAmount.toFixed(2)),
          shippingAddress: typeof shippingAddress === 'string' ? shippingAddress : JSON.stringify(shippingAddress),
          paymentMethod,
          paymentStatus: 'Paid',
          status: 'PENDING',
          trackingNumber: generateTrackingNumber(),
          items: {
            create: validatedItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      return createdOrder;
    });

    res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Error processing order', error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                imageUrl: true,
                category: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Role check: User can only view their own order; Admin can view any order
    if (req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied to this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order details', error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        items: {
          include: {
            product: {
              select: { id: true, title: true, imageUrl: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all orders', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: { items: true }
    });

    if (!existingOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // If order is transitioning to CANCELLED and was not previously cancelled, restore stock
    if (status === 'CANCELLED' && existingOrder.status !== 'CANCELLED') {
      await prisma.$transaction(async (tx) => {
        for (const item of existingOrder.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity
              }
            }
          });
        }

        await tx.order.update({
          where: { id: parseInt(id) },
          data: { status }
        });
      });
    } else {
      await prisma.order.update({
        where: { id: parseInt(id) },
        data: { status }
      });
    }

    const updated = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } }
      }
    });

    res.json({ message: 'Order status updated successfully', order: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};
