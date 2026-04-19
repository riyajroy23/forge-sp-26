const express = require('express');
const router = express.Router();
import { supabase } from '../lib/supabaseClient.js';


// Return all public groups
// GET /groups/public - return all public groups
router.get('/groups/public', async (req, res) => {
    const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('is_public', true);

    if (error || !data?.length) {
        return res.status(404).json("No public groups found.");
    }

    // otherwise, return all public groups if successful
    return res.status(200).json(data);
});

// Return public groups that match the given category.
// GET /groups/public/search/category/:category - return public groups in that category
router.get('/groups/public/search/category/:category', async (req, res) => {

    // extract fields
    const category = req.params.category;

    const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('is_public', true)
        .ilike('category', `%${category}%`);

    if (error || !data?.length) {
        return res.status(404).json("No public groups found in this category.");
    }

    // otherwise, return matched public groups if successful
    return res.status(200).json(data);
});


// Return public groups located in the specified location.
// GET /groups/public/search/location/:location - return public groups in that location
router.get('/groups/public/search/location/:location', async (req, res) => {

    const location = req.params.location;

    const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('is_public', true)
        .ilike('location', `%${location}%`);

    if (error || !data?.length) {
        return res.status(404).json("No public groups found in this location.");
    }

    // otherwise, return matched public groups if successful
    return res.status(200).json(data);
});

// Return the public group with the specified groupId.
// GET /groups/public/:groupId - return the public group with that groupId
router.get('/groups/public/:groupId', async (req, res) => {

    const groupId = parseInt(req.params.groupId);

    const { data, error } = await supabase
        .from('groups')
        .select('*, group_members(*, users(*))')
        .eq('id', groupId)
        .eq('is_public', true)
        .single();

    if (error || !data) {
        return res.status(404).json("Group not found.");
    }

    // otherwise, return public group if successful
    return res.status(200).json(data);
});


export default router;