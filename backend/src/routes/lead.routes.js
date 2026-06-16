const express = require('express');
const { authenticate, authorize, validateRole } = require('../middleware/auth');
const {
  getLeadsByUser,
  getLeadById,
  updateLead,
  addComment,
  getLeadHistory,
  moveLead,
} = require('../controllers/leadController');

const router = express.Router();

router.use(authenticate);

router.get('/', getLeadsByUser);
router.get('/:leadId', getLeadById);
router.put('/:leadId', updateLead);
router.post('/:leadId/comments', addComment);
router.get('/:leadId/history', getLeadHistory);
router.post('/:leadId/move', authorize(['move_leads']), moveLead);

module.exports = router;
