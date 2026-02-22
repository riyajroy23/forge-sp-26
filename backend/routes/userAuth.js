import express from 'express';
import supabase from '../config/supabase.js';  

const router = express.Router();

// Helpers -- updated to use Supabase instead of mock data

  // find user by email or username
  const findUser = async (identifier) => {
    try {
      const { data, error } = await supabase
        .from('User')
        .select('*')
        .or(`email.eq.${identifier},username.eq.${identifier}`)
        .single();
      
      if (error) {
        // if no rows returned, that's expected - return null
        if (error.code === 'PGRST116') return null;
        throw error;
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
        .eq('user_id', userId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  };
  
  // generate mock JWT token (may need to change this later when Supabase Auth is set up)
  const generateToken = (user) => {
    return `mock_jwt_${user.user_id}_${Date.now()}`;
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
  // POST /auth/signup - Create a new user account
  router.post('/auth/signup', async (req, res) => {
    try {
      const { email, username, password, role, name, major, grad_year, company, position, previous_experience } = req.body;
  
      // required fields
      if (!email || !username || !password || !role) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: email, username, password, and role are required'
        });
      }
  
      const normalizedRole = role.toLowerCase();
      if (normalizedRole !== 'student' && normalizedRole !== 'employee') {
        return res.status(400).json({
          success: false,
          error: 'Role must be either "student" or "employee"'
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
  
      // check if user already exists
      const existingUser = await findUser(email) || await findUser(username);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'User with this email or username already exists'
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
  
      // create new user (database will auto-generate user_id, created_at, updated_at)
      const newUser = {
        username,
        email,
        password: `hashed_${password}`, // probably will change this later
        first_name,
        last_name,
        user_role: normalizedRole.toUpperCase(),
        bio: '',
        area_of_interest: null,
        current_company: null,
        profile_picture_url: null,
        points: 0,
        previous_experience: previous_experience || null
      };
  
      // fields specific to role (ex: employee has to have a current_company)
      if (normalizedRole === 'student') {
        newUser.major = major || null;
        newUser.grad_year = grad_year || null;
      } else if (normalizedRole === 'employee') {
        newUser.major = null;
        newUser.grad_year = null;
        newUser.current_company = company || null;
      }
  
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
  // POST /auth/login - Authenticate existing user
  router.post('/auth/login', async (req, res) => {
    try {
      const { email, username, password } = req.body;
  
      // validate for required fields
      if ((!email && !username) || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email or username, and password are required'
        });
      }
  
      // find user and make sure credentials match
      const identifier = email || username;
      const user = await findUser(identifier);
  
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }
  
      // verify password
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
  // GET /auth/me - Get current logged-in user
  router.get('/auth/me', async (req, res) => {
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

export default router;

