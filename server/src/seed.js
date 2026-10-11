import bcrypt from 'bcryptjs';
import prisma from './prisma.js';

async function main() {
  console.log('--- Clearing existing data ---');
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('--- Seeding Users ---');
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('Admin@123', salt);
  const userPassword = await bcrypt.hash('Customer@123', salt);

  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: 'admin@ecommerce.com',
      password: adminPassword,
      role: 'ADMIN'
    }
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Jane Customer',
      email: 'customer@ecommerce.com',
      password: userPassword,
      role: 'USER'
    }
  });

  console.log(`Created Admin: ${admin.email}`);
  console.log(`Created Customer: ${customer.email}`);

  console.log('--- Seeding Products ---');
  const productsData = [
    {
      title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
      description: 'Industry-leading noise cancellation with two processors and 8 microphones. Up to 30 hours of battery life with ultra-comfortable lightweight design.',
      price: 349.99,
      category: 'Audio',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      stock: 25,
      rating: 4.8,
      numReviews: 142,
      featured: true
    },
    {
      title: 'Apple MacBook Air 15-inch M3 Chip',
      description: 'Strikingly thin design with blazing-fast Apple M3 chip, 16GB unified memory, 512GB SSD storage, Liquid Retina display, and MagSafe charging.',
      price: 1299.00,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      stock: 12,
      rating: 4.9,
      numReviews: 210,
      featured: true
    },
    {
      title: 'Logitech MX Master 3S Wireless Performance Mouse',
      description: 'Ergonomic wireless mouse with Quiet Clicks, 8K DPI any-surface tracking, MagSpeed electromagnetic scrolling, and USB-C quick charge.',
      price: 99.99,
      category: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
      stock: 45,
      rating: 4.7,
      numReviews: 89,
      featured: false
    },
    {
      title: 'Keychron Q1 Pro Custom Wireless Mechanical Keyboard',
      description: 'Full aluminum CNC body, hot-swappable tactile switches, double-gasket design, customizable RGB backlighting, and QMK/VIA support.',
      price: 199.99,
      category: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      stock: 18,
      rating: 4.8,
      numReviews: 64,
      featured: true
    },
    {
      title: 'Samsung 34" Odyssey Ultra-Wide Curved Gaming Monitor',
      description: '165Hz refresh rate with 1ms response time, WQHD 3440x1440p resolution, HDR1000, 1000R curvature for immersive gaming and productivity.',
      price: 599.99,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
      stock: 8,
      rating: 4.6,
      numReviews: 53,
      featured: true
    },
    {
      title: 'Bose SoundLink Revolve+ II Bluetooth 360 Speaker',
      description: 'True 360-degree sound with deep bass, IP55 water and dust resistance, built-in microphone for speakerphone calls, and flexible fabric handle.',
      price: 249.00,
      category: 'Audio',
      imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
      stock: 30,
      rating: 4.7,
      numReviews: 76,
      featured: false
    },
    {
      title: 'Bellroy Tokyo Totepack Premium Commuter Backpack',
      description: 'Transitions effortlessly between tote and backpack. Padded 15" laptop sleeve, water-resistant recycled fabric, pop pockets for water bottle and umbrella.',
      price: 189.00,
      category: 'Lifestyle',
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      stock: 22,
      rating: 4.5,
      numReviews: 38,
      featured: false
    },
    {
      title: 'Apple Watch Series 10 GPS 46mm Smartwatch',
      description: 'Thinnest Apple Watch ever with largest display, advanced ECG and sleep apnea tracking, water resistant to 50 meters, and all-day battery life.',
      price: 399.00,
      category: 'Wearables',
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      stock: 19,
      rating: 4.8,
      numReviews: 95,
      featured: true
    },
    {
      title: 'Anker 737 Power Bank (PowerCore 24K) 140W',
      description: 'Ultra-powerful two-way fast charging with smart digital display, 24,000mAh capacity capable of charging laptops, phones, and tablets simultaneously.',
      price: 109.99,
      category: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80',
      stock: 35,
      rating: 4.9,
      numReviews: 120,
      featured: false
    },
    {
      title: 'Sony PlayStation 5 DualSense Wireless Controller',
      description: 'Haptic feedback, dynamic adaptive triggers, built-in microphone and headset jack in an iconic ergonomic design for immersive gaming.',
      price: 69.99,
      category: 'Gaming',
      imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
      stock: 40,
      rating: 4.8,
      numReviews: 310,
      featured: false
    },
    {
      title: 'Kindle Paperwhite 16GB Waterproof E-Reader',
      description: '6.8" glare-free display with adjustable warm light, up to 10 weeks battery life, 20% faster page turns, waterproof design for reading anywhere.',
      price: 149.99,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      stock: 28,
      rating: 4.7,
      numReviews: 180,
      featured: false
    },
    {
      title: 'Ember Temperature Control Smart Ceramic Mug 2',
      description: 'Maintains your chosen drinking temperature (120°F - 145°F) for up to 80 minutes on a single charge or all day on the included charging coaster.',
      price: 149.95,
      category: 'Lifestyle',
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      stock: 3, // Low stock demo!
      rating: 4.4,
      numReviews: 42,
      featured: false
    }
  ];

  const createdProducts = [];
  for (const item of productsData) {
    const prod = await prisma.product.create({ data: item });
    createdProducts.push(prod);
  }
  console.log(`Created ${createdProducts.length} products.`);

  console.log('--- Seeding Sample Orders ---');
  // Order 1: Delivered
  await prisma.order.create({
    data: {
      userId: customer.id,
      totalAmount: 449.98,
      shippingAddress: JSON.stringify({
        fullName: 'Jane Customer',
        address: '742 Evergreen Terrace',
        city: 'Springfield',
        postalCode: '97477',
        country: 'United States',
        phone: '+1 (555) 019-2834'
      }),
      paymentMethod: 'Credit Card (Visa ending in 4242)',
      paymentStatus: 'Paid',
      status: 'DELIVERED',
      trackingNumber: 'TRK-SPRF-882194',
      items: {
        create: [
          {
            productId: createdProducts[0].id, // Sony Headphones
            quantity: 1,
            price: 349.99
          },
          {
            productId: createdProducts[2].id, // Logitech Mouse
            quantity: 1,
            price: 99.99
          }
        ]
      }
    }
  });

  // Order 2: Shipped / In transit
  await prisma.order.create({
    data: {
      userId: customer.id,
      totalAmount: 199.99,
      shippingAddress: JSON.stringify({
        fullName: 'Jane Customer',
        address: '742 Evergreen Terrace',
        city: 'Springfield',
        postalCode: '97477',
        country: 'United States',
        phone: '+1 (555) 019-2834'
      }),
      paymentMethod: 'PayPal',
      paymentStatus: 'Paid',
      status: 'SHIPPED',
      trackingNumber: 'TRK-SPRF-930412',
      items: {
        create: [
          {
            productId: createdProducts[3].id, // Keychron Keyboard
            quantity: 1,
            price: 199.99
          }
        ]
      }
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
