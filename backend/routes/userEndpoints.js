const express = require('express');
const router = express.Router();

// Mock data -- using hard-coded values, waiting for database connection

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
        area_of_interest: ["software engineering", "machine learning"],
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


// Retrieve a user's profile
// GET /users/:userId - Get a specific user's profile
router.get('/users/:userId', (req, res) => { 
    try {
        const userId = authenticateToken(req, res);
        if (!userId) {
            return;
        }

        const user = findUserById(parseInt(req.params.userId));

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            })
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
        })
    }
});



// Updates a user's profile information
// PUT /users/:userId/profile - Update the current user's profile information
router.put('/users/:userId/profile', (req, res) => {
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
            })
        }

        // find the user
        const user = findUserById(currentUserId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            })
        }

        // extract fields
        const {first_name, last_name, major, career_interest, current_company, bio} = req.body;

        // update fields
        if (first_name !== undefined) {
            user.first_name = first_name;
        }

        if (last_name !== undefined) {
            user.last_name = last_name;
        }

        if (major !== undefined) {
            user.major = major;
        }

        if (career_interest !== undefined) {
            user.area_of_interest = [].concat(career_interest);
        }

        if (current_company !== undefined) {
            user.current_company = current_company;
        }

        if (bio !== undefined) {
            user.bio = bio;
        }

        // update updated_at timestamp
        user.updated_at = new Date();


        // return updated user
        res.status(200).json({
            success: true, 
            message: 'Profile updated successfully',
            data: {
                user: removePassword(user)
            }
        })


    } catch (error) {
        console.error('Update user profile error');
        res.status(500).json({
            success: false,
            error: 'Internal server error while trying to update user profile'
        })
    }
});



// Retrieve users matching the specified filters
// GET /users/search - Search for others users by filters (username, career_interest, company, major, has_cooped_at)
router.get('/users/search', (req, res) => {
    try {
        const userId = authenticateToken(req, res);
        if (!userId) {
            return;
        }

        // extract query parameters
        const { username, career_interest, company, major, has_cooped_at } = req.query;

        // begin with all users in the resulting array
        let results = users;

        // apply filters
        if (username) {
            results = results.filter(u => 
                u.username.toLowerCase().includes(username.toLowerCase())
             );
        }

        if (career_interest) {
            results = results.filter(u => 
                u.area_of_interest && u.area_of_interest.some(interest => interest.toLowerCase().includes(career_interest.toLowerCase()))
             );
        }

        if (company) {
            results = results.filter(u => 
                (u.current_company && u.current_company.toLowerCase().includes(company.toLowerCase())) ||
                (u.previous_experience && u.previous_experience.toLowerCase().includes(company.toLowerCase()))
            );
        }


        if (major) {
            results = results.filter(u => 
                u.major && u.major.toLowerCase().includes(major.toLowerCase())
             );
        }

        if (has_cooped_at) {
            results = results.filter(u =>
                u.previous_experience && u.previous_experience.toLowerCase().includes(has_cooped_at.toLowerCase())
            );
        }

        // return the users matching the filters
        res.status(200).json({
            success: true,
            data: {
                count: results.length, 
                users: results.map(removePassword)
            }
        })

        
    } catch (error) {
        console.error('Search users error');
        res.status(500).json({
            success: false,
            error: 'Internal server error while searching users'
        })
    }
});

const authenticateToken = (req, res) => {
    // check authentication token 
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            error: 'No authorization token provided'
        })
    }

    const token = authHeader.replace('Bearer ', '');

    // validate token
    const userId = getUserIdFromToken(token);
    if (!userId) {
        return res.status(401).json({
            success: false,
            error: 'Invalid or expired token'
        })
    }

    return userId;
}

module.exports = router;