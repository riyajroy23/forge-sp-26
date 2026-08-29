const express = require('express');
const { supabase } = require('../lib/supabaseClient');

const router = express.Router();

let posts = [];
let nextPostId = 1;
let nextCommentId = 1;

const getUserIdFromToken = (token) => {
  if (!token || !token.startsWith('mock_jwt_')) return null;
  const parts = token.split('_');
  return parseInt(parts[2]);
};

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

const findCompany = async (companyId) => {
  const { data: company, error } = await supabase
    .from('Company')
    .select('id, name')
    .eq('id', companyId)
    .single();
  if (error || !company) return null;
  return company;
};

// GET /companies/:companyId/posts
router.get('/companies/:companyId/posts', async (req, res) => {
  try {
    const userId = authenticateToken(req, res);
    if (!userId) return;
    const { companyId } = req.params;
    const company = await findCompany(companyId);
    if (!company) return res.status(404).json({ success: false, error: 'Company not found' });
    const companyPosts = posts.filter(p => p.company_id === companyId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.status(200).json({ success: true, data: { company_id: company.id, company_name: company.name, post_count: companyPosts.length, posts: companyPosts } });
  } catch (error) {
    console.error('Get company posts error:', error);
    res.status(500).json({ success: false, error: 'Internal server error while fetching company posts' });
  }
});

// POST /companies/:companyId/posts
router.post('/companies/:companyId/posts', async (req, res) => {
  try {
    const userId = authenticateToken(req, res);
    if (!userId) return;
    const { companyId } = req.params;
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, error: 'Title and content are required' });
    const company = await findCompany(companyId);
    if (!company) return res.status(404).json({ success: false, error: 'Company not found' });
    const newPost = { id: nextPostId++, company_id: companyId, user_id: userId, title, content, comments: [], created_at: new Date(), updated_at: new Date() };
    posts.push(newPost);
    res.status(201).json({ success: true, message: 'Post created successfully', data: { post: newPost } });
  } catch (error) {
    console.error('Create company post error:', error);
    res.status(500).json({ success: false, error: 'Internal server error while creating post' });
  }
});

// GET /companies/:companyId/posts/:postId
router.get('/companies/:companyId/posts/:postId', async (req, res) => {
  try {
    const userId = authenticateToken(req, res);
    if (!userId) return;
    const { companyId, postId } = req.params;
    const company = await findCompany(companyId);
    if (!company) return res.status(404).json({ success: false, error: 'Company not found' });
    const post = posts.find(p => p.id === parseInt(postId) && p.company_id === companyId);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    console.error('Get company post error:', error);
    res.status(500).json({ success: false, error: 'Internal server error while fetching post' });
  }
});

// PUT /companies/:companyId/posts/:postId
router.put('/companies/:companyId/posts/:postId', async (req, res) => {
  try {
    const userId = authenticateToken(req, res);
    if (!userId) return;
    const { companyId, postId } = req.params;
    const { title, content } = req.body;
    if (!title && !content) return res.status(400).json({ success: false, error: 'At least one field (title or content) is required to update' });
    const company = await findCompany(companyId);
    if (!company) return res.status(404).json({ success: false, error: 'Company not found' });
    const post = posts.find(p => p.id === parseInt(postId) && p.company_id === companyId);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    if (post.user_id !== userId) return res.status(403).json({ success: false, error: 'You do not have permission to edit this post' });
    if (title) post.title = title;
    if (content) post.content = content;
    post.updated_at = new Date();
    res.status(200).json({ success: true, message: 'Post updated successfully', data: { post } });
  } catch (error) {
    console.error('Update company post error:', error);
    res.status(500).json({ success: false, error: 'Internal server error while updating post' });
  }
});

// DELETE /companies/:companyId/posts/:postId
router.delete('/companies/:companyId/posts/:postId', async (req, res) => {
  try {
    const userId = authenticateToken(req, res);
    if (!userId) return;
    const { companyId, postId } = req.params;
    const company = await findCompany(companyId);
    if (!company) return res.status(404).json({ success: false, error: 'Company not found' });
    const postIndex = posts.findIndex(p => p.id === parseInt(postId) && p.company_id === companyId);
    if (postIndex === -1) return res.status(404).json({ success: false, error: 'Post not found' });
    if (posts[postIndex].user_id !== userId) return res.status(403).json({ success: false, error: 'You do not have permission to delete this post' });
    posts.splice(postIndex, 1);
    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete company post error:', error);
    res.status(500).json({ success: false, error: 'Internal server error while deleting post' });
  }
});

// POST /companies/:companyId/posts/:postId/comments
router.post('/companies/:companyId/posts/:postId/comments', async (req, res) => {
  try {
    const userId = authenticateToken(req, res);
    if (!userId) return;
    const { companyId, postId } = req.params;
    const { content } = req.body;
    if (!content) return res.status(400).json({ success: false, error: 'Content is required' });
    const company = await findCompany(companyId);
    if (!company) return res.status(404).json({ success: false, error: 'Company not found' });
    const post = posts.find(p => p.id === parseInt(postId) && p.company_id === companyId);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    const newComment = { id: nextCommentId++, post_id: parseInt(postId), user_id: userId, content, created_at: new Date() };
    post.comments.push(newComment);
    res.status(201).json({ success: true, message: 'Comment added successfully', data: { comment: newComment } });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ success: false, error: 'Internal server error while adding comment' });
  }
});

// DELETE /companies/:companyId/posts/:postId/comments/:commentId
router.delete('/companies/:companyId/posts/:postId/comments/:commentId', async (req, res) => {
  try {
    const userId = authenticateToken(req, res);
    if (!userId) return;
    const { companyId, postId, commentId } = req.params;
    const company = await findCompany(companyId);
    if (!company) return res.status(404).json({ success: false, error: 'Company not found' });
    const post = posts.find(p => p.id === parseInt(postId) && p.company_id === companyId);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    const commentIndex = post.comments.findIndex(c => c.id === parseInt(commentId));
    if (commentIndex === -1) return res.status(404).json({ success: false, error: 'Comment not found' });
    if (post.comments[commentIndex].user_id !== userId) return res.status(403).json({ success: false, error: 'You do not have permission to delete this comment' });
    post.comments.splice(commentIndex, 1);
    res.status(200).json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ success: false, error: 'Internal server error while deleting comment' });
  }
});

module.exports = router;
