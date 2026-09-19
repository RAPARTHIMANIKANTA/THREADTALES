import { supabase } from '../config/supabase.js';

// Get user cart items
export async function getUserCart(req, res) {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return res.json({
      success: true,
      cartItems: data || []
    });
  } catch (err) {
    console.error('Get cart error:', err);
    return res.status(500).json({ error: 'Failed to fetch cart items' });
  }
}

// Add item to cart or increment quantity
export async function addToCart(req, res) {
  try {
    const userId = req.user.id;
    const { product_id, product_name, product_image, price, quantity = 1, color, size } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if item already exists in user's cart (matching product_id and color)
    let query = supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', product_id);

    if (color) {
      query = query.eq('color', color);
    }

    const { data: existingItems, error: checkErr } = await query;
    if (checkErr) throw checkErr;

    if (existingItems && existingItems.length > 0) {
      // Update quantity
      const itemToUpdate = existingItems[0];
      const newQty = itemToUpdate.quantity + quantity;

      const { data: updated, error: upErr } = await supabase
        .from('cart_items')
        .update({ quantity: newQty })
        .eq('id', itemToUpdate.id)
        .select()
        .single();

      if (upErr) throw upErr;

      return res.json({ success: true, item: updated, action: 'updated' });
    } else {
      // Insert new cart item
      const { data: newItem, error: insErr } = await supabase
        .from('cart_items')
        .insert([{
          user_id: userId,
          product_id,
          product_name: product_name || 'Atelier Product',
          product_image: product_image || '',
          price: price || 0,
          quantity,
          color: color || '#9D3158',
          size: size || 'Standard'
        }])
        .select()
        .single();

      if (insErr) throw insErr;

      return res.status(201).json({ success: true, item: newItem, action: 'created' });
    }
  } catch (err) {
    console.error('Add to cart error:', err);
    return res.status(500).json({ error: err.message || 'Failed to add item to cart' });
  }
}

// Update cart item quantity
export async function updateCartQuantity(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      // Delete item
      const { error: delErr } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (delErr) throw delErr;
      return res.json({ success: true, action: 'deleted', id });
    }

    const { data: updated, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return res.json({ success: true, item: updated });
  } catch (err) {
    console.error('Update cart quantity error:', err);
    return res.status(500).json({ error: 'Failed to update cart item quantity' });
  }
}

// Remove single cart item
export async function removeFromCart(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    return res.json({ success: true, message: 'Item removed from cart', id });
  } catch (err) {
    console.error('Remove cart item error:', err);
    return res.status(500).json({ error: 'Failed to remove cart item' });
  }
}

// Clear all cart items for user
export async function clearCart(req, res) {
  try {
    const userId = req.user.id;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;

    return res.json({ success: true, message: 'Cart cleared successfully' });
  } catch (err) {
    console.error('Clear cart error:', err);
    return res.status(500).json({ error: 'Failed to clear cart' });
  }
}
