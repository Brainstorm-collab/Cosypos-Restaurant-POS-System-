const express = require('express');
const router = express.Router();
const { requireAnyAuth } = require('../middleware/auth');
const { prisma } = require('../lib/prisma');
const bcrypt = require('bcryptjs');

// Get all users (admin only)
router.get('/', requireAnyAuth(), async (req, res) => {
  try {
    // Check if user has admin role
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        age: true,
        salary: true,
        timings: true,
        profileImage: true,
        permissions: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
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

// Get all staff members (admin and staff can view)
router.get('/staff', requireAnyAuth(), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: ['ADMIN', 'STAFF']
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        age: true,
        salary: true,
        timings: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // No cache for sensitive user data
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json(users);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});


// Create new staff member (admin only)
router.post('/', requireAnyAuth(), async (req, res) => {
  try {
    // Check if user has admin role
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const { name, email, password, role, phone, age, salary, timings } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Validate role
    if (role && !['ADMIN', 'SUBADMIN', 'STAFF', 'USER'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be ADMIN, SUBADMIN, STAFF, or USER.' });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Set default permissions based on role
    const userRole = role || 'STAFF';
    let defaultPermissions = {
      dashboard: true,
      menu: true,
      orders: true,
      reservation: true,
      staff: false,
      inventory: false,
      reports: false
    };

    // SUBADMIN has all permissions like ADMIN (will be filtered in frontend for manage-access)
    if (userRole === 'ADMIN' || userRole === 'SUBADMIN') {
      defaultPermissions = {
        dashboard: true,
        menu: true,
        orders: true,
        reservation: true,
        staff: true,
        inventory: true,
        reports: true
      };
    } else if (userRole === 'STAFF') {
      defaultPermissions = {
        dashboard: true,
        menu: true,
        orders: true,
        reservation: true,
        staff: true,
        inventory: true,
        reports: false
      };
    } else if (userRole === 'USER') {
      defaultPermissions = {
        dashboard: true,
        menu: false,
        orders: true,
        reservation: true,
        staff: false,
        inventory: false,
        reports: false
      };
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: userRole,
        phone,
        age: age ? parseInt(age) : null,
        salary: salary ? parseFloat(salary) : null,
        timings,
        permissions: JSON.stringify(defaultPermissions)
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        age: true,
        salary: true,
        timings: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get user by ID
router.get('/:id', requireAnyAuth(), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Users can only access their own profile unless they're admin or staff
    if (req.user.id !== id && !['ADMIN', 'STAFF'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        age: true,
        salary: true,
        timings: true,
        profileImage: true,
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

// Update user (admin can update any, users can update themselves)
router.put('/:id', requireAnyAuth(), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, age, salary, timings, role, password, permissions } = req.body;

    // Check permissions
    if (req.user.id !== id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Only admins can change roles and permissions
    if ((role || permissions) && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admins can change roles and permissions' });
    }

    // Validate role if provided
    if (role && !['ADMIN', 'SUBADMIN', 'STAFF', 'USER'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be ADMIN, SUBADMIN, STAFF, or USER.' });
    }

    // Build update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (age !== undefined) updateData.age = age ? parseInt(age) : null;
    if (salary !== undefined) updateData.salary = salary ? parseFloat(salary) : null;
    if (timings !== undefined) updateData.timings = timings;
    if (role !== undefined) updateData.role = role;
    if (permissions !== undefined) {
      console.log('🔄 Updating permissions for user', id, ':', permissions);
      updateData.permissions = permissions;
    }
    
    // Hash password if provided
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    console.log('📝 Updating user with data:', updateData);
    
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        age: true,
        salary: true,
        timings: true,
        profileImage: true,
        permissions: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    console.log('✅ User updated successfully. Permissions:', user.permissions);

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user (admin only)
router.delete('/:id', requireAnyAuth(), async (req, res) => {
  try {
    // Check if user has admin role
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user.id === id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await prisma.user.delete({
      where: { id }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
