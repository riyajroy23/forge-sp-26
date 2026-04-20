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


// Create a new private group
// POST /groups
router.post('/groups', async (req, res) => {
    const userId = authenticateToken(req, res);
    if (!userId) {
        return;
    }

    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            error: 'Group name is required'
        });
    }

    // create the group, setting the current user as the owner
    const { data, error } = await supabase
        .from('groups')
        .insert([{ name, description, owner_id: userId }])
        .select()
        .single();

    if (error || !data) {
        console.error('Create group error:', error);
        return res.status(500).json({
            success: false,
            error: 'Cannot create a new group.'
        });
    }

    // automatically add the owner as a member of the group
    const { error: memberError } = await supabase
        .from('group_members')
        .insert([{ group_id: data.id, user_id: userId }]);

    if (memberError) {
        console.error('Add owner as member error:', memberError);
    }

    return res.status(201).json({
        success: true,
        message: 'Group created successfully',
        data
    });
});


// Return all groups
// GET /groups
router.get('/groups', async (req, res) => {
    const userId = authenticateToken(req, res);
    if (!userId) {
        return;
    }

    const { data, error } = await supabase
        .from('groups')
        .select('*');

    if (error) {
        console.error('Get groups error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch groups.'
        });
    }

    if (!data?.length) {
        return res.status(404).json({
            success: false,
            error: 'No groups found.'
        });
    }

    return res.status(200).json({
        success: true,
        data
    });
});


// Return the group with the specified groupId
// GET /groups/:groupId
router.get('/groups/:groupId', async (req, res) => {
    const userId = authenticateToken(req, res);
    if (!userId) {
        return;
    }

    const groupId = parseInt(req.params.groupId);

    const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();

    if (error || !data) {
        return res.status(404).json({
            success: false,
            error: 'Group not found.'
        });
    }

    return res.status(200).json({
        success: true,
        data
    });
});


// Delete the group with the specified groupId -- only the owner can delete the group
// DELETE /groups/:groupId
router.delete('/groups/:groupId', async (req, res) => {
    const userId = authenticateToken(req, res);
    if (!userId) {
        return;
    }

    const groupId = parseInt(req.params.groupId);

    // verify group exists
    const { data: group, error: groupError } = await supabase
        .from('groups')
        .select('id, owner_id')
        .eq('id', groupId)
        .single();

    if (groupError || !group) {
        return res.status(404).json({
            success: false,
            error: 'Group not found.'
        });
    }

    // ensure the current user is the owner
    if (group.owner_id !== userId) {
        return res.status(403).json({
            success: false,
            error: 'You do not have permission to delete this group.'
        });
    }

    // remove all members first to avoid foreign key conflicts
    const { error: membersError } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId);

    if (membersError) {
        console.error('Delete group members error:', membersError);
        return res.status(500).json({
            success: false,
            error: 'Failed to delete group members.'
        });
    }

    // delete the group
    const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId);

    if (error) {
        console.error('Delete group error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to delete group.'
        });
    }

    return res.status(200).json({
        success: true,
        message: 'Group deleted successfully.'
    });
});


// Add the specified user to the specified group
// POST /groups/:groupId/members
router.post('/groups/:groupId/members', async (req, res) => {
    const userId = authenticateToken(req, res);
    if (!userId) {
        return;
    }

    const groupId = parseInt(req.params.groupId);
    const { userId: targetUserId } = req.body;

    // verify group exists
    const { data: group, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();

    if (groupError || !group) {
        return res.status(404).json({
            success: false,
            error: 'Group not found.'
        });
    }

    // check if user is already a member
    const { data: existing } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', groupId)
        .eq('user_id', targetUserId)
        .single();

    if (existing) {
        return res.status(409).json({
            success: false,
            error: 'User is already a member of this group.'
        });
    }

    // add user to group
    const { data, error } = await supabase
        .from('group_members')
        .insert([{ group_id: groupId, user_id: targetUserId }])
        .select()
        .single();

    if (error || !data) {
        console.error('Add member error:', error);
        return res.status(500).json({
            success: false,
            error: 'Cannot add user to group.'
        });
    }

    return res.status(201).json({
        success: true,
        message: 'User added to group successfully.',
        data
    });
});


// Return all members of a group
// GET /groups/:groupId/members
router.get('/groups/:groupId/members', async (req, res) => {
    const userId = authenticateToken(req, res);
    if (!userId) {
        return;
    }

    const groupId = parseInt(req.params.groupId);

    const { data, error } = await supabase
        .from('group_members')
        .select('*, users(*)')
        .eq('group_id', groupId);

    if (error) {
        console.error('Get members error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch group members.'
        });
    }

    if (!data?.length) {
        return res.status(404).json({
            success: false,
            error: 'No members found for this group.'
        });
    }

    return res.status(200).json({
        success: true,
        data
    });
});


// Remove a member from the group -- only the member themselves or the owner can remove
// DELETE /groups/:groupId/members/:userId
router.delete('/groups/:groupId/members/:userId', async (req, res) => {
    const currentUserId = authenticateToken(req, res);
    if (!currentUserId) {
        return;
    }

    const groupId = parseInt(req.params.groupId);
    const targetUserId = parseInt(req.params.userId);

    // verify group exists and get owner
    const { data: group, error: groupError } = await supabase
        .from('groups')
        .select('id, owner_id')
        .eq('id', groupId)
        .single();

    if (groupError || !group) {
        return res.status(404).json({
            success: false,
            error: 'Group not found.'
        });
    }

    // only the member themselves or the group owner can remove a member
    if (currentUserId !== targetUserId && currentUserId !== group.owner_id) {
        return res.status(403).json({
            success: false,
            error: 'You do not have permission to remove this member.'
        });
    }

    const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', targetUserId);

    if (error) {
        console.error('Remove member error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to remove member from group.'
        });
    }

    return res.status(200).json({
        success: true,
        message: 'Member removed successfully from group.'
    });
});


export default router;