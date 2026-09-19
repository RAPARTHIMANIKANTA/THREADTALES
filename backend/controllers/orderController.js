import { supabase } from '../config/supabase.js';

// Create a new order in Supabase
export async function createOrder(req, res) {
  try {
    const userId = req.user.id;
    const { items, deliveryAddress, totalAmount, paymentMethod } = req.body;

    if (!items || !items.length || !totalAmount) {
      return res.status(400).json({ error: 'Order items and total amount are required' });
    }

    // 1. Generate unique order number
    const orderNumber = `TT-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 2. Insert order into orders table
    const { data: newOrder, error: orderErr } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        order_number: orderNumber,
        total_amount: totalAmount,
        shipping_address: deliveryAddress || {},
        payment_method: paymentMethod || 'Cash on Delivery',
        status: 'Placed'
      }])
      .select()
      .single();

    if (orderErr) throw orderErr;

    // 3. Insert order items into order_items table
    const orderItems = items.map(item => ({
      order_id: newOrder.id,
      product_id: item.id || item.product_id,
      product_name: item.name || item.product_name,
      product_image: item.image || item.product_image,
      quantity: item.quantity || 1,
      price: item.price
    }));

    const { error: itemsErr } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsErr) throw itemsErr;

    // 4. Insert initial tracking log event
    const { error: trackErr } = await supabase
      .from('order_tracking')
      .insert([{
        order_id: newOrder.id,
        status: 'Placed',
        description: 'Your order has been placed successfully in Supabase Atelier.'
      }]);

    if (trackErr) console.error('Tracking log error:', trackErr);

    // 5. Clear user cart items after successful order placement
    await supabase.from('cart_items').delete().eq('user_id', userId);

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: newOrder
    });

  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ error: err.message || 'Failed to create order' });
  }
}

// Get authenticated user orders
export async function getUserOrders(req, res) {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.json({
      success: true,
      count: data.length,
      orders: data || []
    });
  } catch (err) {
    console.error('Get user orders error:', err);
    return res.status(500).json({ error: 'Failed to retrieve user orders' });
  }
}

// Get single order details with items and tracking timeline
export async function getOrderDetails(req, res) {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    // Query order ensuring ownership (user_id = userId)
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();

    if (orderErr || !order) {
      return res.status(404).json({ error: 'Order not found or access denied' });
    }

    // Query order items
    const { data: items } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    // Query tracking history
    const { data: tracking } = await supabase
      .from('order_tracking')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });

    return res.json({
      success: true,
      order,
      items: items || [],
      tracking: tracking || []
    });

  } catch (err) {
    console.error('Get order details error:', err);
    return res.status(500).json({ error: 'Failed to retrieve order details' });
  }
}
