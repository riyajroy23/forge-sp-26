const express = require('express');
const { supabase } = require('../lib/supabaseClient');

const router = express.Router();

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

// GET /companies/:companyId/overview
router.get('/companies/:companyId/overview', async (req, res) => {
  try {
    const userId = authenticateToken(req, res);
    if (!userId) return;
    const { companyId } = req.params;
    const { data: company, error: companyError } = await supabase
      .from('Company')
      .select('id, name, industry, description, overview, logo_url, careers_page_url, headquarters_location, website_url')
      .eq('id', companyId)
      .single();
    if (companyError || !company) return res.status(404).json({ success: false, error: 'Company not found' });
    const { data: roles, error: rolesError } = await supabase.from('CompanyRole').select('id, title, description, area, relevant_majors, start_date, end_date, salary').eq('company_id', companyId);
    if (rolesError) throw rolesError;
    const { data: faqs, error: faqsError } = await supabase.from('CompanyFAQ').select('id, question, answer').eq('company_id', companyId);
    if (faqsError) throw faqsError;
    res.status(200).json({ success: true, data: { ...company, roles: roles || [], faqs: faqs || [] } });
  } catch (error) {
    console.error('Get company overview error:', error);
    res.status(500).json({ success: false, error: 'Internal server error while fetching company overview' });
  }
});

// GET /companies/:companyId/roles
router.get('/companies/:companyId/roles', async (req, res) => {
  try {
    const userId = authenticateToken(req, res);
    if (!userId) return;
    const { companyId } = req.params;
    const { data: company, error: companyError } = await supabase.from('Company').select('id, name').eq('id', companyId).single();
    if (companyError || !company) return res.status(404).json({ success: false, error: 'Company not found' });
    const { data: roles, error: rolesError } = await supabase.from('CompanyRole').select('id, title, description, area, relevant_majors, start_date, end_date, salary').eq('company_id', companyId);
    if (rolesError) throw rolesError;
    res.status(200).json({ success: true, data: { company_id: company.id, company_name: company.name, roles: roles || [] } });
  } catch (error) {
    console.error('Get company roles error:', error);
    res.status(500).json({ success: false, error: 'Internal server error while fetching company roles' });
  }
});

// GET /companies/:companyId/faqs
router.get('/companies/:companyId/faqs', async (req, res) => {
  try {
    const userId = authenticateToken(req, res);
    if (!userId) return;
    const { companyId } = req.params;
    const { data: company, error: companyError } = await supabase.from('Company').select('id, name').eq('id', companyId).single();
    if (companyError || !company) return res.status(404).json({ success: false, error: 'Company not found' });
    const { data: faqs, error: faqsError } = await supabase.from('CompanyFAQ').select('id, question, answer').eq('company_id', companyId);
    if (faqsError) throw faqsError;
    res.status(200).json({ success: true, data: { company_id: company.id, company_name: company.name, faqs: faqs || [] } });
  } catch (error) {
    console.error('Get company FAQs error:', error);
    res.status(500).json({ success: false, error: 'Internal server error while fetching company FAQs' });
  }
});

// POST /companies/:companyId/follow
router.post('/companies/:companyId/follow', async (req, res) => {
  try {
    const userId = authenticateToken(req, res);
    if (!userId) return;
    const { companyId } = req.params;
    const { data: company, error: companyError } = await supabase.from('Company').select('id, name').eq('id', companyId).single();
    if (companyError || !company) return res.status(404).json({ success: false, error: 'Company not found' });
    const { data: existing } = await supabase.from('CompanyFollow').select('id').eq('user_id', userId).eq('company_id', companyId).single();
    if (existing) return res.status(409).json({ success: false, error: 'User is already following this company' });
    const { data: follow, error: insertError } = await supabase.from('CompanyFollow').insert({ user_id: userId, company_id: companyId }).select().single();
    if (insertError) throw insertError;
    res.status(201).json({ success: true, message: `Successfully followed ${company.name}`, data: { follow } });
  } catch (error) {
    console.error('Follow company error:', error);
    res.status(500).json({ success: false, error: 'Internal server error while following company' });
  }
});

// DELETE /companies/:companyId/unfollow
router.delete('/companies/:companyId/unfollow', async (req, res) => {
  try {
    const userId = authenticateToken(req, res);
    if (!userId) return;
    const { companyId } = req.params;
    const { data: company, error: companyError } = await supabase.from('Company').select('id, name').eq('id', companyId).single();
    if (companyError || !company) return res.status(404).json({ success: false, error: 'Company not found' });
    const { data: existing } = await supabase.from('CompanyFollow').select('id').eq('user_id', userId).eq('company_id', companyId).single();
    if (!existing) return res.status(404).json({ success: false, error: 'User is not following this company' });
    const { error: deleteError } = await supabase.from('CompanyFollow').delete().eq('user_id', userId).eq('company_id', companyId);
    if (deleteError) throw deleteError;
    res.status(200).json({ success: true, message: `Successfully unfollowed ${company.name}` });
  } catch (error) {
    console.error('Unfollow company error:', error);
    res.status(500).json({ success: false, error: 'Internal server error while unfollowing company' });
  }
});

// GET /companies/:companyId/followers
router.get('/companies/:companyId/followers', async (req, res) => {
  try {
    const userId = authenticateToken(req, res);
    if (!userId) return;
    const { companyId } = req.params;
    const { data: company, error: companyError } = await supabase.from('Company').select('id, name').eq('id', companyId).single();
    if (companyError || !company) return res.status(404).json({ success: false, error: 'Company not found' });
    const { data: followers, error: followersError } = await supabase.from('CompanyFollow').select('id, created_at, User(id, first_name, last_name, email, user_role)').eq('company_id', companyId);
    if (followersError) throw followersError;
    res.status(200).json({ success: true, data: { company_id: company.id, company_name: company.name, follower_count: followers.length, followers } });
  } catch (error) {
    console.error('Get company followers error:', error);
    res.status(500).json({ success: false, error: 'Internal server error while fetching company followers' });
  }
});

// POST /companies/:companyId/group/join
router.post('/companies/:companyId/group/join', async (req, res) => {
  try {
    const userId = authenticateToken(req, res);
    if (!userId) return;
    const { companyId } = req.params;
    const { data: company, error: companyError } = await supabase.from('Company').select('id, name').eq('id', companyId).single();
    if (companyError || !company) return res.status(404).json({ success: false, error: 'Company not found' });
    const { data: group, error: groupError } = await supabase.from('Group').select('id').eq('group_name', company.name).single();
    if (groupError || !group) return res.status(404).json({ success: false, error: 'No prep group found for this company' });
    const { data: existing } = await supabase.from('Group_Member').select('id').eq('user_id', userId).eq('group_id', group.id).single();
    if (existing) return res.status(409).json({ success: false, error: 'User is already a member of this company group' });
    const { data: membership, error: insertError } = await supabase.from('Group_Member').insert({ group_id: group.id, user_id: userId, joined_at: new Date() }).select().single();
    if (insertError) throw insertError;
    res.status(201).json({ success: true, message: `Successfully joined ${company.name}'s prep group`, data: { membership } });
  } catch (error) {
    console.error('Join company group error:', error);
    res.status(500).json({ success: false, error: 'Internal server error while joining company group' });
  }
});

// DELETE /companies/:companyId/group/leave
router.delete('/companies/:companyId/group/leave', async (req, res) => {
  try {
    const userId = authenticateToken(req, res);
    if (!userId) return;
    const { companyId } = req.params;
    const { data: company, error: companyError } = await supabase.from('Company').select('id, name').eq('id', companyId).single();
    if (companyError || !company) return res.status(404).json({ success: false, error: 'Company not found' });
    const { data: group, error: groupError } = await supabase.from('Group').select('id').eq('group_name', company.name).single();
    if (groupError || !group) return res.status(404).json({ success: false, error: 'No prep group found for this company' });
    const { data: existing } = await supabase.from('Group_Member').select('id').eq('user_id', userId).eq('group_id', group.id).single();
    if (!existing) return res.status(404).json({ success: false, error: 'User is not a member of this company group' });
    const { error: deleteError } = await supabase.from('Group_Member').delete().eq('user_id', userId).eq('group_id', group.id);
    if (deleteError) throw deleteError;
    res.status(200).json({ success: true, message: `Successfully left ${company.name}'s prep group` });
  } catch (error) {
    console.error('Leave company group error:', error);
    res.status(500).json({ success: false, error: 'Internal server error while leaving company group' });
  }
});

// GET /companies/:companyId/group/members
router.get('/companies/:companyId/group/members', async (req, res) => {
  try {
    const userId = authenticateToken(req, res);
    if (!userId) return;
    const { companyId } = req.params;
    const { data: company, error: companyError } = await supabase.from('Company').select('id, name').eq('id', companyId).single();
    if (companyError || !company) return res.status(404).json({ success: false, error: 'Company not found' });
    const { data: group, error: groupError } = await supabase.from('Group').select('id').eq('group_name', company.name).single();
    if (groupError || !group) return res.status(404).json({ success: false, error: 'No prep group found for this company' });
    const { data: members, error: membersError } = await supabase.from('Group_Member').select('id, joined_at, User(id, first_name, last_name, email, user_role)').eq('group_id', group.id);
    if (membersError) throw membersError;
    res.status(200).json({ success: true, data: { company_id: company.id, company_name: company.name, group_id: group.id, member_count: members.length, members } });
  } catch (error) {
    console.error('Get company group members error:', error);
    res.status(500).json({ success: false, error: 'Internal server error while fetching company group members' });
  }
});

module.exports = router;
