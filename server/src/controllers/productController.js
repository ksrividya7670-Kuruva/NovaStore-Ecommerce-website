import prisma from '../prisma.js';

export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort = 'newest',
      page = 1,
      limit = 20
    } = req.query;

    const where = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ];
    }

    if (category && category !== 'All') {
      where.category = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'price-asc') orderBy = { price: 'asc' };
    else if (sort === 'price-desc') orderBy = { price: 'desc' };
    else if (sort === 'rating-desc') orderBy = { rating: 'desc' };
    else if (sort === 'oldest') orderBy = { createdAt: 'asc' };

    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      products,
      totalCount,
      totalPages: Math.ceil(totalCount / take),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category']
    });

    res.json(categories.map((c) => c.category));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, imageUrl, stock, featured } = req.body;

    if (!title || !description || price === undefined || !category || !imageUrl) {
      return res.status(400).json({ message: 'Title, description, price, category, and imageUrl are required.' });
    }

    const product = await prisma.product.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category: category.trim(),
        imageUrl: imageUrl.trim(),
        stock: parseInt(stock) || 0,
        featured: Boolean(featured),
        rating: 5.0,
        numReviews: 1
      }
    });

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, imageUrl, stock, featured } = req.body;

    const existing = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updated = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title: title.trim() }),
        ...(description && { description: description.trim() }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(category && { category: category.trim() }),
        ...(imageUrl && { imageUrl: imageUrl.trim() }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(featured !== undefined && { featured: Boolean(featured) })
      }
    });

    res.json({ message: 'Product updated successfully', product: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};
