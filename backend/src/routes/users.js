const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const prisma = require('../db');

// Get all users (admin only)
router.get('/', auth, async (req, res) => {
  try {
    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // No cache for sensitive user data
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);
    
    // Validate the ID parameter
    if (!Number.isInteger(parsedId)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }
    
    // Users can only access their own profile unless they're admin
    if (req.user.id !== parsedId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await prisma.user.findUnique({
      where: { id: parsedId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // No cache for sensitive user data
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user role (admin only)
router.put('/:id/role', auth, async (req, res) => {
  try {
    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const { id } = req.params;
    const { role } = req.body;
    const userId = parseInt(id, 10);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    // Prevent admin from changing their own role
    if (req.user.id === userId) {
      return res.status(400).json({ error: 'Cannot modify your own role' });
    }

    if (!['admin', 'staff', 'customer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be admin, staff, or customer.' });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        updatedAt: true
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});
// Delete user (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
