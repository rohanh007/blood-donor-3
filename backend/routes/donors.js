const express = require('express');
const router = express.Router();
const { createDonor, getDonors, getDonor, updateDonor, deleteDonor } = require('../controllers/donorController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.post('/', authorize('donor', 'admin'), createDonor);
router.get('/', getDonors);
router.get('/:id', getDonor);
router.put('/:id', authorize('donor', 'admin'), updateDonor);
router.delete('/:id', authorize('donor', 'admin'), deleteDonor);

module.exports = router;
