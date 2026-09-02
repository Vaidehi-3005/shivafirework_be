const OrderService = require('../services/orderService');

// --- Order Lists ---
const getOrders = async (req, res) => {
    try {
        const data = await OrderService.getAllOrders();
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getPendingOrders = async (req, res) => {
    try {
        const data = await OrderService.getOrdersByStatus('pending');
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getApprovedOrders = async (req, res) => {
    try {
        const data = await OrderService.getOrdersByStatus('approved');
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getRejectedOrders = async (req, res) => {
    try {
        const data = await OrderService.getOrdersByStatus('rejected');
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// --- Order Counts ---
const getTotalOrderCount = async (req, res) => {
    try {
        const total = await OrderService.getTotalCount();
        res.status(200).json({ success: true, totalOrders: total });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getTotalPendingCount = async (req, res) => {
    try {
        const total = await OrderService.getStatusCount('pending');
        res.status(200).json({ success: true, totalPending: total });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getTotalApprovedCount = async (req, res) => {
    try {
        const total = await OrderService.getStatusCount('approved');
        res.status(200).json({ success: true, totalApproved: total });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getTotalRejectedCount = async (req, res) => {
    try {
        const total = await OrderService.getStatusCount('rejected');
        res.status(200).json({ success: true, totalRejected: total });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// --- Mutations ---
const createOrder = async (req, res) => {
    try {
        const { customer_name, customer_phone, customer_email, items, total_price } = req.body;

        if (!customer_name || !customer_phone || !items || total_price === undefined) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields: customer_name, customer_phone, items, or total_price.' 
            });
        }

        const orderId = await OrderService.createOrder({
            customer_name,
            customer_phone,
            customer_email,
            items,
            total_price
        });

        res.status(201).json({ 
            success: true, 
            message: 'Order created successfully', 
            orderId 
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        const updated = await OrderService.updateStatus(id, status);
        if (!updated) return res.status(404).json({ success: false, message: 'Order not found' });

        res.status(200).json({ success: true, message: `Order status updated to ${status}` });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await OrderService.deleteOrder(id);
        if (!deleted) return res.status(404).json({ success: false, message: 'Order not found' });

        res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = {
    getOrders,
    getPendingOrders,
    getApprovedOrders,
    getRejectedOrders,
    getTotalOrderCount,
    getTotalPendingCount,
    getTotalApprovedCount,
    getTotalRejectedCount,
    createOrder,
    updateStatus,
    deleteOrder
};