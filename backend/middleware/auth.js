import { supabase } from '../config/supabase.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const userIdHeader = req.headers['x-user-id'];

    if (userIdHeader) {
      req.user = { id: userIdHeader };
      return next();
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];

    if (token.startsWith('local_token_')) {
      if (userIdHeader) {
        req.user = { id: userIdHeader };
        return next();
      }
      return res.status(401).json({ error: 'Unauthorized: Missing user ID header for session' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Supabase session token' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({ error: 'Server authentication failure' });
  }
}
