const express = require('express');
const router = express.Router();
const { createRequest, getRequests, updateRequestStatus, deleteRequest } = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.post('/', authorize('receiver', 'admin'), createRequest);
router.get('/', getRequests);
router.put('/:id/status', authorize('admin', 'donor'), updateRequestStatus);
router.delete('/:id', deleteRequest);

module.exports = router;
