import express from 'express';
import { supabase } from '../lib/supabaseClient.js';
const router = express.Router();

// Note: CompanyPost and CompanyPostComment tables have not been created yet.
// Post and comment logic uses mock data for now, swap for Supabase queries

// Mock data -- tracks posts and comments in memory
let posts = [];
let nextPostId = 1;
let nextCommentId = 1;

// Helpers

// extract and validate auth token
const authenticateToken = (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({
            success: false,
            error: 'No authorization token provided'
        });
        return null;
    }

    const token = authHeader.replace('Bearer ', '');

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

// extract user ID from mock token
const getUserIdFromToken = (token) => {
    if (!token || !token.startsWith('mock_jwt_')) {
        return null;
    }
    const parts = token.split('_');
    return parseInt(parts[2]);
};

// verify company exists using real Supabase query
const findCompany = async (companyId) => {
    const { data: company, error } = await supabase
        .from('Company')
        .select('id, name')
        .eq('id', companyId)
        .single();

    if (error || !company) return null;
    return company;
};


// Company message board endpoints

// Return all posts on a company's message board
// GET /companies/:companyId/posts
router.get('/companies/:companyId/posts', async (req, res) => {
    try {
        const userId = authenticateToken(req, res);
        if (!userId) {
            return;
        }

        const { companyId } = req.params;

        // verify company exists 
        const company = await findCompany(companyId);
        if (!company) {
            return res.status(404).json({
                success: false,
                error: 'Company not found'
            });
        }

        // filter posts by company from mock data
        const companyPosts = posts
            .filter(p => p.company_id === companyId)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        res.status(200).json({
            success: true,
            data: {
                company_id: company.id,
                company_name: company.name,
                post_count: companyPosts.length,
                posts: companyPosts
            }
        });

    } catch (error) {
        console.error('Get company posts error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while fetching company posts'
        });
    }
});


// Create a new post on a company's message board
// POST /companies/:companyId/posts
router.post('/companies/:companyId/posts', async (req, res) => {
    try {
        const userId = authenticateToken(req, res);
        if (!userId) {
            return;
        }

        const { companyId } = req.params;
        const { title, content } = req.body;

        // validate required fields
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                error: 'Title and content are required'
            });
        }

        // verify company exists 
        const company = await findCompany(companyId);
        if (!company) {
            return res.status(404).json({
                success: false,
                error: 'Company not found'
            });
        }

        // create new post in mock data
        const newPost = {
            id: nextPostId++,
            company_id: companyId,
            user_id: userId,
            title,
            content,
            comments: [],
            created_at: new Date(),
            updated_at: new Date()
        };

        posts.push(newPost);

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: {
                post: newPost
            }
        });

    } catch (error) {
        console.error('Create company post error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while creating post'
        });
    }
});


// Return a specific post and all its comments
// GET /companies/:companyId/posts/:postId
router.get('/companies/:companyId/posts/:postId', async (req, res) => {
    try {
        const userId = authenticateToken(req, res);
        if (!userId) {
            return;
        }

        const { companyId, postId } = req.params;

        // verify company exists 
        const company = await findCompany(companyId);
        if (!company) {
            return res.status(404).json({
                success: false,
                error: 'Company not found'
            });
        }

        // find post in mock data
        const post = posts.find(p => p.id === parseInt(postId) && p.company_id === companyId);

        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'Post not found'
            });
        }

        res.status(200).json({
            success: true,
            data: post
        });

    } catch (error) {
        console.error('Get company post error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while fetching post'
        });
    }
});


// Edit a post -- only the author can edit their own post
// PUT /companies/:companyId/posts/:postId
router.put('/companies/:companyId/posts/:postId', async (req, res) => {
    try {
        const userId = authenticateToken(req, res);
        if (!userId) {
            return;
        }

        const { companyId, postId } = req.params;
        const { title, content } = req.body;

        // validate that at least one field is being updated
        if (!title && !content) {
            return res.status(400).json({
                success: false,
                error: 'At least one field (title or content) is required to update'
            });
        }

        // verify company exists 
        const company = await findCompany(companyId);
        if (!company) {
            return res.status(404).json({
                success: false,
                error: 'Company not found'
            });
        }

        // find post in mock data
        const post = posts.find(p => p.id === parseInt(postId) && p.company_id === companyId);

        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'Post not found'
            });
        }

        // ensure the current user is the author
        if (post.user_id !== userId) {
            return res.status(403).json({
                success: false,
                error: 'You do not have permission to edit this post'
            });
        }

        // update fields in mock data
        if (title) post.title = title;
        if (content) post.content = content;
        post.updated_at = new Date();

        res.status(200).json({
            success: true,
            message: 'Post updated successfully',
            data: {
                post
            }
        });

    } catch (error) {
        console.error('Update company post error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while updating post'
        });
    }
});


// Delete a post -- only the author can delete their own post
// DELETE /companies/:companyId/posts/:postId
router.delete('/companies/:companyId/posts/:postId', async (req, res) => {
    try {
        const userId = authenticateToken(req, res);
        if (!userId) {
            return;
        }

        const { companyId, postId } = req.params;

        // verify company exists (real Supabase query)
        const company = await findCompany(companyId);
        if (!company) {
            return res.status(404).json({
                success: false,
                error: 'Company not found'
            });
        }

        // find post in mock data
        const postIndex = posts.findIndex(p => p.id === parseInt(postId) && p.company_id === companyId);

        if (postIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Post not found'
            });
        }

        // ensure the current user is the author
        if (posts[postIndex].user_id !== userId) {
            return res.status(403).json({
                success: false,
                error: 'You do not have permission to delete this post'
            });
        }

        // remove post from mock data (comments are stored on the post object so they are removed too)
        posts.splice(postIndex, 1);

        res.status(200).json({
            success: true,
            message: 'Post deleted successfully'
        });

    } catch (error) {
        console.error('Delete company post error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while deleting post'
        });
    }
});


// Add a comment to a post
// POST /companies/:companyId/posts/:postId/comments
router.post('/companies/:companyId/posts/:postId/comments', async (req, res) => {
    try {
        const userId = authenticateToken(req, res);
        if (!userId) {
            return;
        }

        const { companyId, postId } = req.params;
        const { content } = req.body;

        // validate required fields
        if (!content) {
            return res.status(400).json({
                success: false,
                error: 'Content is required'
            });
        }

        // verify company exists (real Supabase query)
        const company = await findCompany(companyId);
        if (!company) {
            return res.status(404).json({
                success: false,
                error: 'Company not found'
            });
        }

        // find post in mock data
        const post = posts.find(p => p.id === parseInt(postId) && p.company_id === companyId);

        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'Post not found'
            });
        }

        // add comment to mock data
        const newComment = {
            id: nextCommentId++,
            post_id: parseInt(postId),
            user_id: userId,
            content,
            created_at: new Date()
        };

        post.comments.push(newComment);

        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            data: {
                comment: newComment
            }
        });

    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while adding comment'
        });
    }
});


// Delete a comment -- only the author can delete their own comment
// DELETE /companies/:companyId/posts/:postId/comments/:commentId
router.delete('/companies/:companyId/posts/:postId/comments/:commentId', async (req, res) => {
    try {
        const userId = authenticateToken(req, res);
        if (!userId) {
            return;
        }

        const { companyId, postId, commentId } = req.params;

        // verify company exists (real Supabase query)
        const company = await findCompany(companyId);
        if (!company) {
            return res.status(404).json({
                success: false,
                error: 'Company not found'
            });
        }

        // find post in mock data
        const post = posts.find(p => p.id === parseInt(postId) && p.company_id === companyId);

        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'Post not found'
            });
        }

        // find comment in mock data
        const commentIndex = post.comments.findIndex(c => c.id === parseInt(commentId));

        if (commentIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Comment not found'
            });
        }

        // ensure the current user is the author
        if (post.comments[commentIndex].user_id !== userId) {
            return res.status(403).json({
                success: false,
                error: 'You do not have permission to delete this comment'
            });
        }

        // remove comment from mock data
        post.comments.splice(commentIndex, 1);

        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully'
        });

    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while deleting comment'
        });
    }
});

export default router;