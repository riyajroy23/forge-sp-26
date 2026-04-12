import express from 'express';
import { supabase } from '../lib/supabaseClient.js';
const router = express.Router();


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


// Company overview endpoints

// Return the full overview for a specific company (description, roles, FAQs)
// GET /companies/:companyId/overview
router.get('/companies/:companyId/overview', async (req, res) => {
    try {
        const userId = authenticateToken(req, res);
        if (!userId) {
            return;
        }

        const { companyId } = req.params;

        // fetch core company info
        const { data: company, error: companyError } = await supabase
            .from('Company')
            .select('id, name, industry, description, overview, logo_url, careers_page_url, headquarters_location, website_url')
            .eq('id', companyId)
            .single();

        if (companyError || !company) {
            return res.status(404).json({
                success: false,
                error: 'Company not found'
            });
        }

        // fetch associated roles
        const { data: roles, error: rolesError } = await supabase
            .from('CompanyRole')
            .select('id, title, description, area, relevant_majors, start_date, end_date, salary')
            .eq('company_id', companyId);

        if (rolesError) {
            throw rolesError;
        }

        // fetch associated FAQs
        const { data: faqs, error: faqsError } = await supabase
            .from('CompanyFAQ')
            .select('id, question, answer')
            .eq('company_id', companyId);

        if (faqsError) {
            throw faqsError;
        }

        // return full overview
        res.status(200).json({
            success: true,
            data: {
                ...company,
                roles: roles || [],
                faqs: faqs || []
            }
        });

    } catch (error) {
        console.error('Get company overview error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while fetching company overview'
        });
    }
});


// Return only the roles offered by a specific company
// GET /companies/:companyId/roles
router.get('/companies/:companyId/roles', async (req, res) => {
    try {
        const userId = authenticateToken(req, res);
        if (!userId) {
            return;
        }

        const { companyId } = req.params;

        // verify company exists
        const { data: company, error: companyError } = await supabase
            .from('Company')
            .select('id, name')
            .eq('id', companyId)
            .single();

        if (companyError || !company) {
            return res.status(404).json({
                success: false,
                error: 'Company not found'
            });
        }

        // fetch roles for this company
        const { data: roles, error: rolesError } = await supabase
            .from('CompanyRole')
            .select('id, title, description, area, relevant_majors, start_date, end_date, salary')
            .eq('company_id', companyId);

        if (rolesError) {
            throw rolesError;
        }

        res.status(200).json({
            success: true,
            data: {
                company_id: company.id,
                company_name: company.name,
                roles: roles || []
            }
        });

    } catch (error) {
        console.error('Get company roles error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while fetching company roles'
        });
    }
});


// Return only the FAQs for a specific company
// GET /companies/:companyId/faqs
router.get('/companies/:companyId/faqs', async (req, res) => {
    try {
        const userId = authenticateToken(req, res);
        if (!userId) {
            return;
        }

        const { companyId } = req.params;

        // verify company exists
        const { data: company, error: companyError } = await supabase
            .from('Company')
            .select('id, name')
            .eq('id', companyId)
            .single();

        if (companyError || !company) {
            return res.status(404).json({
                success: false,
                error: 'Company not found'
            });
        }

        // fetch FAQs for this company
        const { data: faqs, error: faqsError } = await supabase
            .from('CompanyFAQ')
            .select('id, question, answer')
            .eq('company_id', companyId);

        if (faqsError) {
            throw faqsError;
        }

        res.status(200).json({
            success: true,
            data: {
                company_id: company.id,
                company_name: company.name,
                faqs: faqs || []
            }
        });

    } catch (error) {
        console.error('Get company FAQs error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while fetching company FAQs'
        });
    }
});


// Company follow endpoints
// Uses the CompanyFollow table -- tracks which users are following which companies

// Follow a company
// POST /companies/:companyId/follow
router.post('/companies/:companyId/follow', async (req, res) => {
    try {
        const userId = authenticateToken(req, res);
        if (!userId) {
            return;
        }

        const { companyId } = req.params;

        // verify company exists
        const { data: company, error: companyError } = await supabase
            .from('Company')
            .select('id, name')
            .eq('id', companyId)
            .single();

        if (companyError || !company) {
            return res.status(404).json({
                success: false,
                error: 'Company not found'
            });
        }

        // check if user is already following this company
        const { data: existing } = await supabase
            .from('CompanyFollow')
            .select('id')
            .eq('user_id', userId)
            .eq('company_id', companyId)
            .single();

        if (existing) {
            return res.status(409).json({
                success: false,
                error: 'User is already following this company'
            });
        }

        // insert new follow record
        const { data: follow, error: insertError } = await supabase
            .from('CompanyFollow')
            .insert({ user_id: userId, company_id: companyId })
            .select()
            .single();

        if (insertError) {
            throw insertError;
        }

        res.status(201).json({
            success: true,
            message: `Successfully followed ${company.name}`,
            data: {
                follow
            }
        });

    } catch (error) {
        console.error('Follow company error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while following company'
        });
    }
});


// Unfollow a company
// DELETE /companies/:companyId/unfollow
router.delete('/companies/:companyId/unfollow', async (req, res) => {
    try {
        const userId = authenticateToken(req, res);
        if (!userId) {
            return;
        }

        const { companyId } = req.params;

        // verify company exists
        const { data: company, error: companyError } = await supabase
            .from('Company')
            .select('id, name')
            .eq('id', companyId)
            .single();

        if (companyError || !company) {
            return res.status(404).json({
                success: false,
                error: 'Company not found'
            });
        }

        // check if the user is actually following before trying to remove
        const { data: existing } = await supabase
            .from('CompanyFollow')
            .select('id')
            .eq('user_id', userId)
            .eq('company_id', companyId)
            .single();

        if (!existing) {
            return res.status(404).json({
                success: false,
                error: 'User is not following this company'
            });
        }

        // delete the follow record
        const { error: deleteError } = await supabase
            .from('CompanyFollow')
            .delete()
            .eq('user_id', userId)
            .eq('company_id', companyId);

        if (deleteError) {
            throw deleteError;
        }

        res.status(200).json({
            success: true,
            message: `Successfully unfollowed ${company.name}`
        });

    } catch (error) {
        console.error('Unfollow company error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while unfollowing company'
        });
    }
});


// Return all followers of a specific company
// GET /companies/:companyId/followers
router.get('/companies/:companyId/followers', async (req, res) => {
    try {
        const userId = authenticateToken(req, res);
        if (!userId) {
            return;
        }

        const { companyId } = req.params;

        // verify company exists
        const { data: company, error: companyError } = await supabase
            .from('Company')
            .select('id, name')
            .eq('id', companyId)
            .single();

        if (companyError || !company) {
            return res.status(404).json({
                success: false,
                error: 'Company not found'
            });
        }

        // fetch all followers, joining with User to get profile info
        const { data: followers, error: followersError } = await supabase
            .from('CompanyFollow')
            .select('id, created_at, User(id, first_name, last_name, email, user_role)')
            .eq('company_id', companyId);

        if (followersError) {
            throw followersError;
        }

        res.status(200).json({
            success: true,
            data: {
                company_id: company.id,
                company_name: company.name,
                follower_count: followers.length,
                followers
            }
        });

    } catch (error) {
        console.error('Get company followers error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while fetching company followers'
        });
    }
});


// Company group endpoints
// Uses Group and Group_Member tables -- distinct from following a company.
// Each company has an associated Group row that users can join to prep together.

// Join a company's prep group
// POST /companies/:companyId/group/join
router.post('/companies/:companyId/group/join', async (req, res) => {
    try {
        const userId = authenticateToken(req, res);
        if (!userId) {
            return;
        }

        const { companyId } = req.params;

        // verify company exists
        const { data: company, error: companyError } = await supabase
            .from('Company')
            .select('id, name')
            .eq('id', companyId)
            .single();

        if (companyError || !company) {
            return res.status(404).json({
                success: false,
                error: 'Company not found'
            });
        }

        // look up the Group row associated with this company
        const { data: group, error: groupError } = await supabase
            .from('Group')
            .select('id')
            .eq('group_name', company.name)
            .single();

        if (groupError || !group) {
            return res.status(404).json({
                success: false,
                error: 'No prep group found for this company'
            });
        }

        // check if user is already a member of this group
        const { data: existing } = await supabase
            .from('Group_Member')
            .select('id')
            .eq('user_id', userId)
            .eq('group_id', group.id)
            .single();

        if (existing) {
            return res.status(409).json({
                success: false,
                error: 'User is already a member of this company group'
            });
        }

        // insert new membership record
        const { data: membership, error: insertError } = await supabase
            .from('Group_Member')
            .insert({ group_id: group.id, user_id: userId, joined_at: new Date() })
            .select()
            .single();

        if (insertError) {
            throw insertError;
        }

        res.status(201).json({
            success: true,
            message: `Successfully joined ${company.name}'s prep group`,
            data: {
                membership
            }
        });

    } catch (error) {
        console.error('Join company group error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while joining company group'
        });
    }
});


// Leave a company's prep group
// DELETE /companies/:companyId/group/leave
router.delete('/companies/:companyId/group/leave', async (req, res) => {
    try {
        const userId = authenticateToken(req, res);
        if (!userId) {
            return;
        }

        const { companyId } = req.params;

        // verify company exists
        const { data: company, error: companyError } = await supabase
            .from('Company')
            .select('id, name')
            .eq('id', companyId)
            .single();

        if (companyError || !company) {
            return res.status(404).json({
                success: false,
                error: 'Company not found'
            });
        }

        // look up the Group row associated with this company
        const { data: group, error: groupError } = await supabase
            .from('Group')
            .select('id')
            .eq('group_name', company.name)
            .single();

        if (groupError || !group) {
            return res.status(404).json({
                success: false,
                error: 'No prep group found for this company'
            });
        }

        // check if the user is actually a member before trying to remove them
        const { data: existing } = await supabase
            .from('Group_Member')
            .select('id')
            .eq('user_id', userId)
            .eq('group_id', group.id)
            .single();

        if (!existing) {
            return res.status(404).json({
                success: false,
                error: 'User is not a member of this company group'
            });
        }

        // delete the membership record
        const { error: deleteError } = await supabase
            .from('Group_Member')
            .delete()
            .eq('user_id', userId)
            .eq('group_id', group.id);

        if (deleteError) {
            throw deleteError;
        }

        res.status(200).json({
            success: true,
            message: `Successfully left ${company.name}'s prep group`
        });

    } catch (error) {
        console.error('Leave company group error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while leaving company group'
        });
    }
});


// Return all members of a company's prep group
// GET /companies/:companyId/group/members
router.get('/companies/:companyId/group/members', async (req, res) => {
    try {
        const userId = authenticateToken(req, res);
        if (!userId) {
            return;
        }

        const { companyId } = req.params;

        // verify company exists
        const { data: company, error: companyError } = await supabase
            .from('Company')
            .select('id, name')
            .eq('id', companyId)
            .single();

        if (companyError || !company) {
            return res.status(404).json({
                success: false,
                error: 'Company not found'
            });
        }

        // look up the Group row associated with this company
        const { data: group, error: groupError } = await supabase
            .from('Group')
            .select('id')
            .eq('group_name', company.name)
            .single();

        if (groupError || !group) {
            return res.status(404).json({
                success: false,
                error: 'No prep group found for this company'
            });
        }

        // fetch all members, joining with User to get profile info
        const { data: members, error: membersError } = await supabase
            .from('Group_Member')
            .select('id, joined_at, User(id, first_name, last_name, email, user_role)')
            .eq('group_id', group.id);

        if (membersError) {
            throw membersError;
        }

        res.status(200).json({
            success: true,
            data: {
                company_id: company.id,
                company_name: company.name,
                group_id: group.id,
                member_count: members.length,
                members
            }
        });

    } catch (error) {
        console.error('Get company group members error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while fetching company group members'
        });
    }
});

export default router;