const db = require('../config/db');

// --- LIST QUERIES ---
const getAllOrders = async () => {
    const [rows] = await db.query('SELECT * FROM whatsapp_orders ORDER BY created_at DESC');
    return rows;
};

const getOrdersByStatus = async (status) => {
    const [rows] = await db.query(
        'SELECT * FROM whatsapp_orders WHERE status = ? ORDER BY created_at DESC', 
        [status]
    );
    return rows;
};

// --- COUNT QUERIES ---
const getTotalCount = async () => {
    const [rows] = await db.query('SELECT COUNT(*) AS count FROM whatsapp_orders');
    return rows[0].count;
};

const getStatusCount = async (status) => {
    const [rows] = await db.query(
        'SELECT COUNT(*) AS count FROM whatsapp_orders WHERE status = ?', 
        [status]
    );
    return rows[0].count;
};

// --- MUTATIONS ---
const createOrder = async (orderData) => {
    const { customer_name, customer_phone, customer_email, items, total_price, status = 'pending' } = orderData;
    
    const [result] = await db.query(
        'INSERT INTO whatsapp_orders (customer_name, customer_phone, customer_email, items, total_price, status) VALUES (?, ?, ?, ?, ?, ?)',
        [customer_name, customer_phone, customer_email, JSON.stringify(items), total_price, status]
    );
    
    return result.insertId;
};

const updateStatus = async (id, status) => {
    const [result] = await db.query(
        'UPDATE whatsapp_orders SET status = ? WHERE id = ?',
        [status, id]
    );
    return result.affectedRows > 0;
};

const deleteOrder = async (id) => {
    const [result] = await db.query('DELETE FROM whatsapp_orders WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

module.exports = {
    getAllOrders,
    getOrdersByStatus,
    getTotalCount,
    getStatusCount,
    createOrder,
    updateStatus,
    deleteOrder
};