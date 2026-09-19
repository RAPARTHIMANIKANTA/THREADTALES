import { supabase } from '../config/supabase.js';

// Get user wishlist
export async function getUserWishlist(req, res) {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase
      .from('wishlists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.json({
      success: true,
      wishlist: data || []
    });
  } catch (err) {
    console.error('Get wishlist error:', err);
    return res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
}

// Toggle product in wishlist (Add if not exists, remove if exists)
export async function toggleWishlist(req, res) {
  try {
    const userId = req.user.id;
    const { product_id, product_name, product_image, price } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if item already in wishlist
    const { data: existing, error: checkErr } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', product_id)
      .maybeSingle();

    if (checkErr && checkErr.code !== 'PGRST116') throw checkErr;

    if (existing) {
      // Remove item
      const { error: delErr } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', existing.id);

      if (delErr) throw delErr;

      return res.json({
        success: true,
        action: 'removed',
        product_id
      });
    } else {
      // Add item
      const { data: newItem, error: insErr } = await supabase
        .from('wishlists')
        .insert([{
          user_id: userId,
          product_id,
          product_name: product_name || 'Atelier Item',
          product_image: product_image || '',
          price: price || 0
        }])
        .select()
        .single();

      if (insErr) throw insErr;

      return res.json({
        success: true,
        action: 'added',
        item: newItem
      });
    }
  } catch (err) {
    console.error('Toggle wishlist error:', err);
    return res.status(500).json({ error: err.message || 'Failed to update wishlist' });
  }
}

// Remove specific product from wishlist
export async function removeFromWishlist(req, res) {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) throw error;

    return res.json({ success: true, message: 'Removed from wishlist', productId });
  } catch (err) {
    console.error('Remove wishlist error:', err);
    return res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
}
