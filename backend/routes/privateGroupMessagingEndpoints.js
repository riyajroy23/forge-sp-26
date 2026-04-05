const express = require('express');
const router = express.Router();


// Create a new private group.
// POST /groups - create a new group
router.post('/groups', async (req, res) => {

    // extract fields
    const { name, description, owner_id } =  req.body;

    const { data, error } = await supabase
        .from('groups')
        .insert([{ name, description, owner_id }])
        .select()
        .single()

    if (error || !data) {
        return res.status(500).json("Cannot create a new group.");
    }

    // otherwise, confirm creation of group
    return res.status(201).json(data);
});


// Return all groups
// GET /groups
router.get('/groups', async (req, res) => {

    const { data, error } = await supabase
        .from('groups')
        .select('*')

    if (error || !data?.length) {
        return res.status(404).json("No groups found.");
    }

    // otherwise, return all groups if successful
    return res.status(200).json(data);
});


// Return the group that has the specified groupId.
// GET /groups/:groupId - return the group with that groupId
router.get('/groups/:groupId', async (req, res) => {

    // extract fields
    const groupId = parseInt(req.params.groupId);

    const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();

    // cannot find group with the specified id
    if (error || !data) {
        return res.status(404).json("Group not found.");
    }

    // otherwise, return group if successful
    return res.status(200).json(data);
});

// Delete the group with the specified groupdId.
// DELETE /groups/:groupId - delete the group with that groupId
router.delete('/groups/:groupId', async (req, res) => {

    // extract fields
    const groupId = parseInt(req.params.groupId);

    const { data, error } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId)

    // cannot find group with the specified groupId
    if (error) {
        return res.status(404).json("Group not found.");
    }

    // otherwise, confirm deletion of group
    return res.status(200).json("Group deleted successfully.");
});


// Add the specified user to the specified group
// POST /groups/:groupId/members - add the user to the group
router.post('/groups/:groupId/members', async (req, res) => {

    // extract fields
    const groupId = parseInt(req.params.groupId);
    const { userId } = req.body;


    // first check if group exists
    const { data: group, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();

    if (groupError || !group) {
        return res.status(404).json("Group not found.");
    }

    // add user to group
    const { data, error } = await supabase
        .from('group_members')
        .insert([{ group_id: groupId, user_id: userId }])
        .select()
        .single();

    // cannot add user
    if (error || !data) {
        return res.status(404).json("Cannot add user to group.");
    }

    // otherwise, confirm addition of user to group
    return res.status(201).json(data);
});


// Return all members of a group
// GET /groups/:groupId/members
router.get('/groups/:groupId/members', async (req, res) => {

    // extract fields
    const groupId = parseInt(req.params.groupId);

    const { data, error } = await supabase
        .from('group_members')
        .select('*, users(*)')
        .eq('group_id', groupId);

    // cannot find members in group
    if (error || !data?.length) {
        return res.status(404).json("No members found for this group.");
    }

    // otherwise, return members if successful
    return res.status(200).json(data);
});


// Remove a member from the group with the specified groupId.
// DELETE /groups/:groupId/members/:userId - remove the member who has that userId from the group
router.delete('/groups/:groupId/members/:userId', async (req, res) => {

    // extract fields
    const groupId = parseInt(req.params.groupId);
    const userId = parseInt(req.params.userId);

    const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userId);

    // cannot find member in group
    if (error) {
        return res.status(404).json("Member not found in this group.");
    }

    // otherwise, confirm deletion of member from group 
    return res.status(200).json("Member removed successfully from group.");
});
