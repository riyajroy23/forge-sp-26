import express from 'express';
import { supabase } from '../lib/supabaseClient.ts';

const router = express.Router();

// Helpers

// find user by ID
const findUserById = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    return null;
  }
};

// generate mock JWT token (change this later)
const generateToken = (user) => {
  return `mock_jwt_${user.id}_${Date.now()}`;
};

// extract user ID from mock token 
const getUserIdFromToken = (token) => {
  if (!token || !token.startsWith('mock_jwt_')) {
    return null;
  }
  const parts = token.split('_');
  return parseInt(parts[2]);
};

// remove password from user object
const removePassword = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// authenticate token middleware
const authenticateToken = (req, res) => {
  // check authentication token 
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      success: false,
      error: 'No authorization token provided'
    });
    return null;
  }

  const token = authHeader.replace('Bearer ', '');

  // validate token
  const userId = getUserIdFromToken(token);
  if (!userId) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
    return null;
  }

  return userId;
};

// Retrieve a user's profile
// GET /users/:userId - Get a specific user's profile
router.get('/users/:userId', async (req, res) => {
    const userId = authenticateToken(req, res);
    if (!userId) return;

    const { data: user, error } = await supabase
        .from('User')
        .select('*')
        .eq('id', parseInt(req.params.userId))
        .single();

    if (error || !user) {
        return res.status(404).json({ success: false, error: "User not found" });
    }

    res.status(200).json({ success: true, data: { user: removePassword(user) } });
});

// Updates a user's profile information
// PUT /users/:userId/profile - Update the current user's profile information
router.put('/users/:userId/profile', async (req, res) => {
  const currentUserId = authenticateToken(req, res);
  if (!currentUserId) return;

  const targetUserId = parseInt(req.params.userId);
  if (currentUserId !== targetUserId) {
      return res.status(403).json({ success: false, error: 'You do not have permission to update this profile' });
  }

  const { first_name, last_name, major, career_interest, current_company, bio } = req.body;

  const updates = {};
  if (first_name !== undefined) {
    updates.first_name = first_name;
  }
  if (last_name !== undefined) {
      updates.last_name = last_name;
  }
  if (major !== undefined) {
      updates.major = major;
  }
  if (career_interest !== undefined) {
      updates.area_of_interest = career_interest;
  }
  if (current_company !== undefined) {
      updates.current_company = current_company;
  }
  if (bio !== undefined) {
      updates.bio = bio;
  }

  const { data: updatedUser, error } = await supabase
      .from('User')
      .update(updates)
      .eq('id', currentUserId)
      .select()
      .single();

  if (error) {
      return res.status(500).json({ success: false, error: 'Failed to update user profile' });
  }

  res.status(200).json({ success: true, message: 'Profile updated successfully', data: { user: removePassword(updatedUser) } });
});

// Retrieve users matching the specified filters
// GET /users/search - Search for other users by filters
// GET /users/search
router.get('/users/search', async (req, res) => {
  const userId = authenticateToken(req, res);
  if (!userId) return;

  const { username, career_interest, company, major, has_cooped_at } = req.query;

  let query = supabase.from('User').select('*');
  if (username) {
    query = query.ilike('username', `%${username}%`);
  }
  if (major) {
      query = query.ilike('major', `%${major}%`);
  }
  if (company) {
      query = query.ilike('current_company', `%${company}%`);
  }
  if (career_interest) {
      query = query.ilike('area_of_interest', `%${career_interest}%`);
  }
  if (has_cooped_at) {
      query = query.ilike('previous_experience', `%${has_cooped_at}%`);
  }

  const { data: results, error } = await query;

  if (error) {
      return res.status(500).json({ success: false, error: 'Failed to search users' });
  }

  res.status(200).json({ success: true, data: { count: results.length, users: results.map(removePassword) } });
});

export default router;