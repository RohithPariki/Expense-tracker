const express = require('express');
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Transaction routes
router.route('/')
  .get(getTransactions)
  .post(createTransaction);

router.route('/stats')
  .get(getTransactionStats);

router.route('/:id')
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;