const express = require('express');
const router = express.Router();
const {
  getSystemOverview,
  getAllUsers,
  updateUser,
  deleteUser,
  createUser,
  getActivityLog,
} = require('../controllers/superAdminController');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin role
router.use(protect, authorize('admin'));

router.get('/overview', getSystemOverview);
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/activity', getActivityLog);

module.exports = router;
