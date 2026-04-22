import express from 'express';
import { supabase } from '../lib/supabaseClient.ts';

const router = express.Router();

// Helpers -- using Supabase with password hashing

  // find user by email
  const findUser = async (email) => {
    try {
      const { data, error } = await supabase
        .from('User')
        .select('*')
        .eq('email', email)
        .maybeSingle();
      
      if (error) {
        console.error('Error finding user:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error finding user:', error);
      return null;
    }
  };
  
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
  
  // generate mock JWT token (will be replaced later)
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

  // Signup
  // POST /signup - Create a new user account
  router.post('/signup', async (req, res) => {
    try {
      const { email, password, name } = req.body;
  
      // required fields - only email, password, and name
      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: email, password, and name are required'
        });
      }
  
      // check email format - must be Northeastern email
      const emailRegex = /^[^\s@]+@northeastern\.edu$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Must use a Northeastern email address (@northeastern.edu)'
        });
      }

      // password strength check
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 6 characters long'
        });
      }
  
      // check if user already exists
      const existingUser = await findUser(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'User with this email already exists'
        });
      }
  
      // parse name, split into first and last 
      let first_name = '';
      let last_name = '';
      if (name) {
        const nameParts = name.trim().split(' ');
        first_name = nameParts[0];
        last_name = nameParts.slice(1).join(' ') || '';
      }
  
      const newUser = {
        email,
        first_name,
        last_name,
        password: `hashed_${password}` 
      };
  
      // insert user into database
      const { data: insertedUser, error: insertError } = await supabase
        .from('User')
        .insert([newUser])
        .select()
        .single();

      if (insertError) {
        console.error('Database insert error:', insertError);
        return res.status(500).json({
          success: false,
          error: 'Failed to create user account'
        });
      }
  
      // generate auth token
      const token = generateToken(insertedUser);
  
      // return response that user registration was successful
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          token,
          user: removePassword(insertedUser)
        }
      });
  
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error during signup'
      });
    }
  });
  
  // Login endpoint
  // POST /login - Authenticate existing user
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // validate for required fields - only email and password
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
      }
  
      // find user by email
      const user = await findUser(email);
  
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }
  
      // verify password (use bcrypt.compare() later)
      const isValidPassword = user.password === `hashed_${password}`;
      
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }
  
      // generate auth token
      const token = generateToken(user);
  
      // return response for success
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: removePassword(user)
        }
      });
  
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error during login'
      });
    }
  });
  
  // Get current user
  // GET /me - Get current logged-in user
  router.get('/me', async (req, res) => {
    try {
      // extract token
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          error: 'No authorization token provided'
        });
      }
      const token = authHeader.replace('Bearer ', '');
      
      // validate token
      const userId = getUserIdFromToken(token);
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired token'
        });
      }
  
      // find user by ID
      const user = await findUserById(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
  
      // return the current user
      res.status(200).json({
        success: true,
        data: {
          user: removePassword(user)
        }
      });
  
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error while fetching user'
      });
    }
  });

// helper to authenticate and return userId, sends 401 on failure
const authenticateToken = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ success: false, error: 'No authorization token provided' });
    return null;
  }
  const token = authHeader.replace('Bearer ', '');
  const userId = getUserIdFromToken(token);
  if (!userId) {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
    return null;
  }
  return userId;
};

// Get all users except the current user
// GET /users
router.get('/users', async (req, res) => {
  try {
    const currentUserId = authenticateToken(req, res);
    if (!currentUserId) return;

    const { data: users, error } = await supabase
      .from('User')
      .select('*')
      .neq('id', currentUserId);

    if (error) {
      return res.status(500).json({ success: false, error: 'Failed to fetch users' });
    }

    res.status(200).json({
      success: true,
      data: { users: (users || []).map(removePassword) }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get current user's friends list
// GET /friends
router.get('/friends', async (req, res) => {
  try {
    const currentUserId = authenticateToken(req, res);
    if (!currentUserId) return;

    const { data: friendships, error } = await supabase
      .from('friends')
      .select('friend_id')
      .eq('user_id', currentUserId);

    if (error) {
      return res.status(500).json({ success: false, error: 'Failed to fetch friends' });
    }

    const friendIds = (friendships || []).map(f => f.friend_id);

    if (friendIds.length === 0) {
      return res.status(200).json({ success: true, data: { friends: [] } });
    }

    const { data: friends, error: usersError } = await supabase
      .from('User')
      .select('*')
      .in('id', friendIds);

    if (usersError) {
      return res.status(500).json({ success: false, error: 'Failed to fetch friend details' });
    }

    res.status(200).json({
      success: true,
      data: { friends: (friends || []).map(removePassword) }
    });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Add a friend (bidirectional)
// POST /friends  body: { friend_id }
router.post('/friends', async (req, res) => {
  try {
    const currentUserId = authenticateToken(req, res);
    if (!currentUserId) return;

    const { friend_id } = req.body;
    if (!friend_id) {
      return res.status(400).json({ success: false, error: 'friend_id is required' });
    }

    if (currentUserId === parseInt(friend_id)) {
      return res.status(400).json({ success: false, error: 'Cannot friend yourself' });
    }

    // check if already friends
    const { data: existing } = await supabase
      .from('friends')
      .select('id')
      .eq('user_id', currentUserId)
      .eq('friend_id', friend_id)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ success: false, error: 'Already friends' });
    }

    // insert bidirectional rows
    const { error } = await supabase
      .from('friends')
      .insert([
        { user_id: currentUserId, friend_id: parseInt(friend_id) },
        { user_id: parseInt(friend_id), friend_id: currentUserId }
      ]);

    if (error) {
      console.error('Add friend error:', error);
      return res.status(500).json({ success: false, error: 'Failed to add friend' });
    }

    res.status(201).json({ success: true, message: 'Friend added successfully' });
  } catch (error) {
    console.error('Add friend error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Remove a friend
// DELETE /friends/:friendId
router.delete('/friends/:friendId', async (req, res) => {
  try {
    const currentUserId = authenticateToken(req, res);
    if (!currentUserId) return;

    const friendId = parseInt(req.params.friendId);

    // delete both directions
    const { error } = await supabase
      .from('friends')
      .delete()
      .or(
        `and(user_id.eq.${currentUserId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${currentUserId})`
      );

    if (error) {
      return res.status(500).json({ success: false, error: 'Failed to remove friend' });
    }

    res.status(200).json({ success: true, message: 'Friend removed' });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
