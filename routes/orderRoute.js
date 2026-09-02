const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');

// --- Order Lists Routes ---
router.post('/create', OrderController.createOrder);
router.get('/getorders', OrderController.getOrders);
router.get('/pending', OrderController.getPendingOrders);
router.get('/approved', OrderController.getApprovedOrders);
router.get('/rejected', OrderController.getRejectedOrders);

// --- Order Counts Routes ---
router.get('/totalorder', OrderController.getTotalOrderCount);
router.get('/totalpending', OrderController.getTotalPendingCount);
router.get('/totalapproved', OrderController.getTotalApprovedCount);
router.get('/totalrejected', OrderController.getTotalRejectedCount);

// --- Status Update and Delete Routes ---
router.patch('/:id/status', OrderController.updateStatus);
router.delete('/:id', OrderController.deleteOrder);

module.exports = router;