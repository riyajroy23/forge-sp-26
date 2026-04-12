import express from 'express';
import { supabase } from '../lib/supabaseClient.js';

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
  try {
    const userId = authenticateToken(req, res);
    if (!userId) {
      return;
    }

    const user = await findUserById(parseInt(req.params.userId));

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    // return the specific user
    res.status(200).json({
      success: true,
      data: {
        user: removePassword(user)
      }
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching user'
    });
  }
});

// Updates a user's profile information
// PUT /users/:userId/profile - Update the current user's profile information
router.put('/users/:userId/profile', async (req, res) => {
  try {
    const currentUserId = authenticateToken(req, res);
    if (!currentUserId) {
      return;
    }

    // ensure the current user matches the profile being updated
    const targetUserId = parseInt(req.params.userId);

    if (currentUserId !== targetUserId) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to update this profile'
      });
    }

    // find the user
    const user = await findUserById(currentUserId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    // extract fields
    const { first_name, last_name, major, career_interest, current_company, bio } = req.body;

    // build update object with only provided fields
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

    // update updated_at timestamp
    updates.updated_at = new Date().toISOString();

    // update in database
    const { data: updatedUser, error: updateError } = await supabase
      .from('User')
      .update(updates)
      .eq('id', currentUserId)
      .select()
      .single();

    if (updateError) {
      console.error('Database update error:', updateError);
      return res.status(500).json({
        success: false,
        error: 'Failed to update user profile'
      });
    }

    // return updated user
    res.status(200).json({
      success: true, 
      message: 'Profile updated successfully',
      data: {
        user: removePassword(updatedUser)
      }
    });

  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while trying to update user profile'
    });
  }
});

// Retrieve users matching the specified filters
// GET /users/search - Search for other users by filters
router.get('/users/search', async (req, res) => {
  try {
    const userId = authenticateToken(req, res);
    if (!userId) {
      return;
    }

    // extract query parameters
    const { username, career_interest, company, major, has_cooped_at } = req.query;

    // start with base query
    let query = supabase
      .from('User')
      .select('*');


    if (major) {
      query = query.ilike('major', `%${major}%`);
    }

    if (current_company) {
      query = query.ilike('current_company', `%${company}%`);
    }

    // execute query
    const { data: results, error } = await query;

    if (error) {
      console.error('Search error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to search users'
      });
    }

    // client-side filtering for more complex conditions
    let filteredResults = results || [];

    if (career_interest) {
      filteredResults = filteredResults.filter(u => 
        u.area_of_interest && 
        (typeof u.area_of_interest === 'string' 
          ? u.area_of_interest.toLowerCase().includes(career_interest.toLowerCase())
          : Array.isArray(u.area_of_interest) && u.area_of_interest.some(interest => 
              interest.toLowerCase().includes(career_interest.toLowerCase())
            )
        )
      );
    }

    if (has_cooped_at) {
      filteredResults = filteredResults.filter(u =>
        u.previous_experience && 
        u.previous_experience.toLowerCase().includes(has_cooped_at.toLowerCase())
      );
    }

    // return the users matching the filters
    res.status(200).json({
      success: true,
      data: {
        count: filteredResults.length, 
        users: filteredResults.map(removePassword)
      }
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while searching users'
    });
  }
});

export default router;