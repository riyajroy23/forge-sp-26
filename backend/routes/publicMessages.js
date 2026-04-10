import express from "express";
import { supabase } from "../lib/supabaseClient.js";
const router = express.Router();

// Note: CompanyPost and CompanyPostComment tables have not been created yet.
// Post and comment logic uses mock data for now, swap for Supabase queries

// Mock data -- tracks posts and comments in memory
let posts = [];
let nextPostId = 1;
let nextCommentId = 1;

// Helpers

// extract and validate auth token (KEEP)
const authenticateToken = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      success: false,
      error: "No authorization token provided",
    });
    return null;
  }

  const token = authHeader.replace("Bearer ", "");

  const userId = getUserIdFromToken(token);
  if (!userId) {
    res.status(401).json({
      success: false,
      error: "Invalid or expired token",
    });
    return null;
  }

  return userId;
};

// extract user ID from mock token (KEEP)
const getUserIdFromToken = (token) => {
  if (!token || !token.startsWith("mock_jwt_")) {
    return null;
  }
  const parts = token.split("_");
  return parseInt(parts[2]);
};

// verify group exists using real Supabase query
const findGroup = async (groupId) => {
  const { data: group, error } = await supabase
    .from("Group")
    .select("id, name")
    .eq("id", groupId)
    .single();

  if (error || !group) return null;
  return group;
};

// verify group is public using real Supabase query
const GroupisPublic = async (groupisbool = True) => {
  const { data: group, error } = await supabase
    .from("Group")
    .select("is_bool")
    .eq("is_bool", groupisbool)
    .single();

  if (error || !group) return null;
  return group;
};

// Company message board endpoints

// Return all posts on a company's message board
// GET /companies/:companyId/posts
router.get("/groups/:groupId/posts", async (req, res) => {
  try {
    const userId = authenticateToken(req, res);
    if (!userId) {
      return;
    }

    const { groupId } = req.params;

    // verify group exists
    const group = await findGroup(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        error: "Public Group not found",
      });
    }

    // filter posts by group from mock data
    const groupPosts = posts
      .filter((p) => p.group_id === groupId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.status(200).json({
      success: true,
      data: {
        group_id: group.id,
        group_name: group.name,
        post_count: groupPosts.length,
        posts: groupPosts,
      },
    });
  } catch (error) {
    console.error("Get public groups posts error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while fetching public group posts",
    });
  }
});

// Create a new post on a public group's message board
// POST /groups/:groupId/posts
router.post("/groups/:groupId/posts", async (req, res) => {
  try {
    const userId = authenticateToken(req, res);
    if (!userId) {
      return;
    }

    const { groupId } = req.params;
    const { title, content } = req.body;

    // validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: "Title and content are required",
      });
    }

    // verify company exists
    const group = await findCompany(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        error: "Public group not found",
      });
    }

    // create new post in mock data
    const newPost = {
      id: nextGroupId++,
      group_id: groupId,
      user_id: userId,
      title,
      content,
      comments: [],
      created_at: new Date(),
      updated_at: new Date(),
    };

    posts.push(newPost);

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: {
        post: newPost,
      },
    });
  } catch (error) {
    console.error("Create public group post error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while creating post",
    });
  }
});

// Return a specific post and all its comments
// GET /groups/:groupId/posts/:postId
router.get("/groups/:groupId/posts/:postId", async (req, res) => {
  try {
    const userId = authenticateToken(req, res);
    if (!userId) {
      return;
    }

    const { groupId, postId } = req.params;

    // verify group exists
    const group = await findGroup(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        error: "Group not found",
      });
    }

    // find post in mock data
    const post = posts.find(
      (p) => p.id === parseInt(postId) && p.group_id === groupId,
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Get public group post error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while fetching post",
    });
  }
});

// Edit a post -- only the author can edit their own post
// PUT /groups/:groupId/posts/:postId
router.put("/groups/:groupId/posts/:postId", async (req, res) => {
  try {
    const userId = authenticateToken(req, res);
    if (!userId) {
      return;
    }

    const { groupId, postId } = req.params;
    const { title, content } = req.body;

    // validate that at least one field is being updated
    if (!title && !content) {
      return res.status(400).json({
        success: false,
        error: "At least one field (title or content) is required to update",
      });
    }

    // verify company exists
    const group = await findCompany(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        error: "Public Group not found",
      });
    }

    // find post in mock data
    const post = posts.find(
      (p) => p.id === parseInt(postId) && p.group_id === groupId,
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    // ensure the current user is the author
    if (post.user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: "You do not have permission to edit this post",
      });
    }

    // update fields in mock data
    if (title) post.title = title;
    if (content) post.content = content;
    post.updated_at = new Date();

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: {
        post,
      },
    });
  } catch (error) {
    console.error("Update company post error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while updating post",
    });
  }
});

// Delete a post -- only the author can delete their own post
// DELETE /groups/:groupId/posts/:postId
router.delete("/groups/:groupId/posts/:postId", async (req, res) => {
  try {
    const userId = authenticateToken(req, res);
    if (!userId) {
      return;
    }

    const { groupId, postId } = req.params;

    // verify public group exists (real Supabase query)
    const company = await findGroup(groupId);
    if (!company) {
      return res.status(404).json({
        success: false,
        error: "Public group not found",
      });
    }

    // find post in mock data
    const postIndex = posts.findIndex(
      (p) => p.id === parseInt(postId) && p.group_id === groupId,
    );

    if (postIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    // ensure the current user is the author
    if (posts[postIndex].user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: "You do not have permission to delete this post",
      });
    }

    // remove post from mock data (comments are stored on the post object so they are removed too)
    posts.splice(postIndex, 1);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete public group post error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while deleting post",
    });
  }
});

// Add a comment to a post
// POST /groups/:groupId/posts/:postId
router.post("/groups/:groupId/posts/:postId", async (req, res) => {
  try {
    const userId = authenticateToken(req, res);
    if (!userId) {
      return;
    }

    const { groupId, postId } = req.params;
    const { content } = req.body;

    // validate required fields
    if (!content) {
      return res.status(400).json({
        success: false,
        error: "Content is required",
      });
    }

    // verify group exists (real Supabase query)
    const group = await findCompany(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        error: "Group not found",
      });
    }

    // find post in mock data
    const post = posts.find(
      (p) => p.id === parseInt(postId) && p.group_id === groupId,
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    // add comment to mock data
    const newComment = {
      id: nextCommentId++,
      post_id: parseInt(postId),
      user_id: userId,
      content,
      created_at: new Date(),
    };

    post.comments.push(newComment);

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: {
        comment: newComment,
      },
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while adding comment",
    });
  }
});

// Delete a comment -- only the author can delete their own comment
// DELETE /companies/:companyId/posts/:postId/comments/:commentId
router.delete(
  "/companies/:companyId/posts/:postId/comments/:commentId",
  async (req, res) => {
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
          error: "Company not found",
        });
      }

      // find post in mock data
      const post = posts.find(
        (p) => p.id === parseInt(postId) && p.company_id === companyId,
      );

      if (!post) {
        return res.status(404).json({
          success: false,
          error: "Post not found",
        });
      }

      // find comment in mock data
      const commentIndex = post.comments.findIndex(
        (c) => c.id === parseInt(commentId),
      );

      if (commentIndex === -1) {
        return res.status(404).json({
          success: false,
          error: "Comment not found",
        });
      }

      // ensure the current user is the author
      if (post.comments[commentIndex].user_id !== userId) {
        return res.status(403).json({
          success: false,
          error: "You do not have permission to delete this comment",
        });
      }

      // remove comment from mock data
      post.comments.splice(commentIndex, 1);

      res.status(200).json({
        success: true,
        message: "Comment deleted successfully",
      });
    } catch (error) {
      console.error("Delete comment error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error while deleting comment",
      });
    }
  },
);

export default router;
