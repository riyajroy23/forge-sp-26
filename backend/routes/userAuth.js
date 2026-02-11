
const express = require('express');
const router = express.Router();

// Mock data -- using for now, waiting for database connection

let users = [
    {
        user_id: 1,
        username: 'johndoe',
        email: 'john@example.com',
        password: 'hashed_password123', 
        first_name: 'John',
        last_name: 'Doe',
        major: 'Computer Science',
        grad_year: 2026,
        bio: 'Aspiring software engineer',
        area_of_interest: null,
        current_company: null,
        user_role: 'STUDENT',
        profile_picture_url: null,
        points: 0,
        previous_experience: null,
        created_at: new Date('2025-01-15'),
        updated_at: new Date('2025-01-15')
    },
    
    {
        user_id: 2,
        username: 'sarahsmith',
        email: 'sarah@company.com',
        password: 'hashed_password456',
        first_name: 'Sarah',
        last_name: 'Smith',
        major: null,
        grad_year: null,
        bio: 'Senior engineer at Amazon',
        area_of_interest: null,
        current_company: 'Amazon',
        user_role: 'EMPLOYEE',
        profile_picture_url: null,
        points: 100,
        previous_experience: 'Google, Microsoft',
        created_at: new Date('2025-01-20'),
        updated_at: new Date('2025-01-20')
    }
];

let nextUserId = 3;

// Helpers -- have to change once db connection and oauth is set up

  // find user by email or username
  const findUser = (identifier) => {
    return users.find(u => u.email === identifier || u.username === identifier);
  };
  
  // find user by ID
  const findUserById = (userId) => {
    return users.find(u => u.user_id === parseInt(userId));
  };
  
  // generate mock JWT token (change this later)
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
  router.post('/auth/signup', (req, res) => {
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
  
      // check email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format'
        });
      }
  
      // check if user already exists
      const existingUser = findUser(email) || findUser(username);
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
  
      // create new user
      const newUser = {
        user_id: nextUserId++,
        username,
        email,
        password: `hashed_${password}`, // probably will change this later
        first_name,
        last_name,
        user_role: normalizedRole.toUpperCase(), // right now, only have 'student', 'employee', or 'admin' options, may change
        bio: '',
        area_of_interest: null,
        current_company: null,
        profile_picture_url: null,
        points: 0,
        previous_experience: previous_experience || null,
        created_at: new Date(),
        updated_at: new Date()
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
  
      // Add user to mock database
      users.push(newUser);
  
      // generate auth token
      const token = generateToken(newUser);
  
      // return response that user registration was successful
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          token,
          user: removePassword(newUser)
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
  router.post('/auth/login', (req, res) => {
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
      const user = findUser(identifier);
  
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
  router.get('/auth/me', (req, res) => {
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
      const user = findUserById(userId);
      
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