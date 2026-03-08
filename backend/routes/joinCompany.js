const express = require('express');
const router = express.Router();
const { supabase } = require('../db');

// Note: company overview data (descriptions, roles, FAQs) is hardcoded for now -- 
// waiting for the Company table to be added to the database schema.

// Mock company data -- extended with FAQs for overview functionality
const companies = [
    {
        company_id: 1,
        name: 'Microsoft',
        industry: 'Technology',
        description: 'Developing and supporting software, services, devices, and solutions that help people and businesses realize their full potential.',
        careers_page_url: 'https://careers.microsoft.com/v2/global/en/home.html',
        logo_url: null,
        headquarters_location: 'Redmond, WA',
        roles: [
            { role_id: 1, title: 'Software Engineer Co-op', area: 'Engineering', relevant_majors: ['Computer Science'] },
            { role_id: 2, title: 'UI/UX Design Co-op', area: 'Design', relevant_majors: ['Design', 'Psychology', 'Computer Science'] },
            { role_id: 3, title: 'Product Management Co-op', area: 'Business', relevant_majors: ['Business', 'Computer Science'] }
        ],
        faqs: [
            {
                faq_id: 1,
                question: 'What is the interview process like for co-op positions?',
                answer: 'The process typically includes an online assessment, followed by 1-2 technical interviews and a behavioral interview with the hiring team.'
            },
            {
                faq_id: 2,
                question: 'Are co-ops paid?',
                answer: 'Yes, all Microsoft co-op positions are paid and include housing stipends for those relocating.'
            },
            {
                faq_id: 3,
                question: 'What skills are most important for the Software Engineer Co-op?',
                answer: 'Strong fundamentals in data structures and algorithms, proficiency in at least one programming language, and experience with collaborative development workflows.'
            }
        ],
        created_at: new Date('2025-03-15'),
        updated_at: new Date('2025-03-21')
    },
    {
        company_id: 2,
        name: 'Boston Consulting Group',
        industry: 'Consulting',
        description: 'Global management consulting firm partnering with leaders in business and society to tackle their most important challenges.',
        careers_page_url: 'https://careers.bcg.com/global/en/',
        logo_url: null,
        headquarters_location: 'Boston, Massachusetts',
        roles: [
            { role_id: 1, title: 'Accounting Co-op', area: 'Business', relevant_majors: ['Accounting', 'Finance'] },
            { role_id: 2, title: 'Management Consultant Co-op', area: 'Business', relevant_majors: ['Economics', 'Accounting', 'Finance'] }
        ],
        faqs: [
            {
                faq_id: 1,
                question: 'What does a typical day look like for a co-op at BCG?',
                answer: 'Co-ops work alongside full-time consultants on active client cases, contributing to research, data analysis, and slide preparation.'
            },
            {
                faq_id: 2,
                question: 'Do I need a business background to apply?',
                answer: 'Not necessarily -- BCG values analytical thinking and problem-solving skills across all majors, especially for data-heavy roles.'
            }
        ],
        created_at: new Date('2025-01-10'),
        updated_at: new Date('2025-01-27')
    },
    {
        company_id: 3,
        name: 'Insulet Corporation',
        industry: 'Healthcare',
        description: 'Medical device company that develops, manufactures, and sells the Omnipod Insulin Management System for people with diabetes.',
        careers_page_url: 'https://insulet.wd5.myworkdayjobs.com/insuletcareers',
        logo_url: null,
        headquarters_location: 'Acton, Massachusetts',
        roles: [
            { role_id: 1, title: 'Electrical Engineering Co-op', area: 'Engineering', relevant_majors: ['Electrical Engineering'] },
            { role_id: 2, title: 'Marketing Co-op', area: 'Marketing', relevant_majors: ['Marketing', 'Communications'] }
        ],
        faqs: [
            {
                faq_id: 1,
                question: 'Is prior medical device experience required?',
                answer: 'No prior medical device experience is required. Insulet provides onboarding and training for all co-op positions.'
            },
            {
                faq_id: 2,
                question: 'What tools or software will I use as an Electrical Engineering co-op?',
                answer: 'Co-ops typically work with circuit design tools, embedded systems software, and internal lab equipment depending on the team.'
            }
        ],
        created_at: new Date('2025-09-13'),
        updated_at: new Date('2025-09-25')
    }
];

// Helpers

// find company by ID
const findCompanyById = (companyId) => {
    return companies.find(c => c.company_id === parseInt(companyId));
};

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
router.get('/companies/:companyId/overview', (req, res) => {
    try {
        const userId = authenticateToken(req, res);
        if (!userId) {
            return;
        }

        const company = findCompanyById(req.params.companyId);

        if (!company) {
            return res.status(404).json({
                success: false,
                error: 'Company not found'
            });
        }

        // return full overview: general info, roles, and FAQs
        res.status(200).json({
            success: true,
            data: {
                company_id: company.company_id,
                name: company.name,
                industry: company.industry,
                description: company.description,
                headquarters_location: company.headquarters_location,
                careers_page_url: company.careers_page_url,
                logo_url: company.logo_url,
                roles: company.roles,
                faqs: company.faqs
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
router.get('/companies/:companyId/roles', (req, res) => {
    try {
        const userId = authenticateToken(req, res);
        if (!userId) {
            return;
        }

        const company = findCompanyById(req.params.companyId);

        if (!company) {
            return res.status(404).json({
                success: false,
                error: 'Company not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                company_id: company.company_id,
                company_name: company.name,
                roles: company.roles
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
router.get('/companies/:companyId/faqs', (req, res) => {
    try {
        const userId = authenticateToken(req, res);
        if (!userId) {
            return;
        }

        const company = findCompanyById(req.params.companyId);

        if (!company) {
            return res.status(404).json({
                success: false,
                error: 'Company not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                company_id: company.company_id,
                company_name: company.name,
                faqs: company.faqs
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


// Company group membership endpoints
// These are structured around the Group and Group_Member schema -- 
// swap mock data logic for Supabase queries once the database is connected

// Join a company's group
// POST /companies/:companyId/join
router.post('/companies/:companyId/join', async (req, res) => {
    try {
        const userId = authenticateToken(req, res);
        if (!userId) {
            return;
        }

        const companyId = parseInt(req.params.companyId);
        const company = findCompanyById(companyId);

        if (!company) {
            return res.status(404).json({
                success: false,
                error: 'Company not found'
            });
        }

        // look up the Group row that corresponds to this company
        const { data: group, error: groupError } = await supabase
            .from('Group')
            .select('id')
            .eq('group_name', company.name)
            .single();

        if (groupError || !group) {
            return res.status(404).json({
                success: false,
                error: 'No group found for this company'
            });
        }

        // check if the user is already a member
        const { data: existing, error: existingError } = await supabase
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
        const { data: newMember, error: insertError } = await supabase
            .from('Group_Member')
            .insert({ group_id: group.id, user_id: userId, joined_at: new Date() })
            .select()
            .single();

        if (insertError) {
            throw insertError;
        }

        res.status(201).json({
            success: true,
            message: `Successfully joined ${company.name}'s group`,
            data: {
                membership: newMember
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


// Leave a company's group
// DELETE /companies/:companyId/leave
router.delete('/companies/:companyId/leave', async (req, res) => {
    try {
        const userId = authenticateToken(req, res);
        if (!userId) {
            return;
        }

        const companyId = parseInt(req.params.companyId);
        const company = findCompanyById(companyId);

        if (!company) {
            return res.status(404).json({
                success: false,
                error: 'Company not found'
            });
        }

        // look up the Group row that corresponds to this company
        const { data: group, error: groupError } = await supabase
            .from('Group')
            .select('id')
            .eq('group_name', company.name)
            .single();

        if (groupError || !group) {
            return res.status(404).json({
                success: false,
                error: 'No group found for this company'
            });
        }

        // check if the user is actually a member before trying to remove them
        const { data: existing, error: existingError } = await supabase
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
            message: `Successfully left ${company.name}'s group`
        });

    } catch (error) {
        console.error('Leave company group error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while leaving company group'
        });
    }
});


// Return all members of a specific company's group
// GET /companies/:companyId/members
router.get('/companies/:companyId/members', async (req, res) => {
    try {
        const userId = authenticateToken(req, res);
        if (!userId) {
            return;
        }

        const companyId = parseInt(req.params.companyId);
        const company = findCompanyById(companyId);

        if (!company) {
            return res.status(404).json({
                success: false,
                error: 'Company not found'
            });
        }

        // look up the Group row that corresponds to this company
        const { data: group, error: groupError } = await supabase
            .from('Group')
            .select('id')
            .eq('group_name', company.name)
            .single();

        if (groupError || !group) {
            return res.status(404).json({
                success: false,
                error: 'No group found for this company'
            });
        }

        // fetch all members of the group, joining with User to get profile info
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
                company_id: companyId,
                company_name: company.name,
                member_count: members.length,
                members
            }
        });

    } catch (error) {
        console.error('Get company members error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while fetching company group members'
        });
    }
});

module.exports = router;