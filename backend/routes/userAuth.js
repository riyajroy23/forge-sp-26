const express = require('express');
const { supabase } = require('../lib/supabaseClient');

const router = express.Router();

// find user by email
const findUser = async (email) => {
  try {
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    if (error) { console.error('Error finding user:', error); return null; }
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
    if (error) { console.error('Error finding user by ID:', error); return null; }
    return data;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    return null;
  }
};

const generateToken = (user) => `mock_jwt_${user.id}_${Date.now()}`;

const getUserIdFromToken = (token) => {
  if (!token || !token.startsWith('mock_jwt_')) return null;
  const parts = token.split('_');
  return parseInt(parts[2]);
};

const removePassword = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// POST /signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, username, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: 'Missing required fields: email, password, and name are required' });
    }

    const emailRegex = /^[^\s@]+@northeastern\.edu$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Must use a Northeastern email address (@northeastern.edu)' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long' });
    }

    const existingUser = await findUser(email);
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'User with this email already exists' });
    }

    let first_name = '', last_name = '';
    if (name) {
      const nameParts = name.trim().split(' ');
      first_name = nameParts[0];
      last_name = nameParts.slice(1).join(' ') || '';
    }

    const newUser = {
      email,
      first_name,
      last_name,
      username: username || null,
      role: role || 'STUDENT',
      password: `hashed_${password}`
    };

    const { data: insertedUser, error: insertError } = await supabase
      .from('User')
      .insert([newUser])
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return res.status(500).json({ success: false, error: 'Failed to create user account' });
    }

    const token = generateToken(insertedUser);
    res.status(201).json({ success: true, message: 'User registered successfully', data: { token, user: removePassword(insertedUser) } });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, error: 'Internal server error during signup' });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const user = await findUser(email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isValidPassword = user.password === `hashed_${password}`;
    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.status(200).json({ success: true, message: 'Login successful', data: { token, user: removePassword(user) } });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Internal server error during login' });
  }
});

// GET /me
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'No authorization token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    const userId = getUserIdFromToken(token);
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({ success: true, data: { user: removePassword(user) } });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ success: false, error: 'Internal server error while fetching user' });
  }
});

module.exports = router;
