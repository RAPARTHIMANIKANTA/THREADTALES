import { PRODUCTS } from '../../src/data/products.js';

// Get all 35 real products
export function getAllProducts(req, res) {
  try {
    const { category, search } = req.query;
    let result = [...PRODUCTS];

    if (category && category !== 'ALL') {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    return res.json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).json({ error: 'Failed to retrieve products' });
  }
}

// Get single product by ID (CR001 - CR035)
export function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = PRODUCTS.find(p => p.id === id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json({ success: true, data: product });
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    return res.status(500).json({ error: 'Failed to retrieve product details' });
  }
}
