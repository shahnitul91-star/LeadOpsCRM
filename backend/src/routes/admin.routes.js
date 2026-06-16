const express = require('express');
const { authenticate, authorize, validateRole } = require('../middleware/auth');
const {
  createUser,
  updateUser,
  assignRole,
  assignLead,
  getAllUsers,
  getDepartmentStats,
} = require('../controllers/adminController');

const router = express.Router();

router.use(authenticate);
router.use(authorize(['manage_users', 'assign_roles']));

router.post('/users', createUser);
router.put('/users/:userId', updateUser);
router.post('/assign-role', assignRole);
router.post('/assign-lead', assignLead);
router.get('/users', getAllUsers);
router.get('/stats/departments', getDepartmentStats);

module.exports = router;
