import { supabase } from '../config/supabase.js';

// Create a new general contact inquiry in Supabase contact_inquiries table
export async function createContactInquiry(req, res) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Name, email, subject, and message are required' });
    }

    const { data, error } = await supabase
      .from('contact_inquiries')
      .insert([{
        name: name.trim(),
        email: email.toLowerCase().trim(),
        subject: subject.trim(),
        message: message.trim()
      }])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: 'General contact inquiry stored in database successfully',
      inquiry: data
    });
  } catch (err) {
    console.error('Create contact inquiry error:', err);
    return res.status(500).json({ error: err.message || 'Failed to save contact inquiry' });
  }
}

// Get all general contact inquiries
export async function getContactInquiries(req, res) {
  try {
    const { data, error } = await supabase
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.json({
      success: true,
      count: data.length,
      inquiries: data
    });
  } catch (err) {
    console.error('Get contact inquiries error:', err);
    return res.status(500).json({ error: err.message || 'Failed to fetch contact inquiries' });
  }
}

// Create a new bespoke custom product request in custom_product_requests table
export async function createCustomProductRequest(req, res) {
  try {
    const { name, email, phone, productType, colorPalette, targetDate, quantity, customNotes } = req.body;

    if (!name || !email || !productType || !customNotes) {
      return res.status(400).json({ error: 'Name, email, product type, and customization notes are required' });
    }

    const { data, error } = await supabase
      .from('custom_product_requests')
      .insert([{
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone ? phone.trim() : null,
        product_type: productType.trim(),
        color_palette: colorPalette ? colorPalette.trim() : null,
        target_date: targetDate || null,
        quantity: parseInt(quantity) || 1,
        custom_notes: customNotes.trim()
      }])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: 'Custom product commission request stored in database successfully',
      request: data
    });
  } catch (err) {
    console.error('Create custom product request error:', err);
    return res.status(500).json({ error: err.message || 'Failed to save custom product request' });
  }
}

// Get all custom product commission requests
export async function getCustomProductRequests(req, res) {
  try {
    const { data, error } = await supabase
      .from('custom_product_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.json({
      success: true,
      count: data.length,
      requests: data
    });
  } catch (err) {
    console.error('Get custom product requests error:', err);
    return res.status(500).json({ error: err.message || 'Failed to fetch custom product requests' });
  }
}
