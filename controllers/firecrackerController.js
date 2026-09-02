const FirecrackerService = require('../services/firecrackerService');

const createSingle = async (req, res) => {
    try {
        const { name, price, type } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({ success: false, message: 'Name is required' });
        }
        if (price === undefined || price === null || price === '' || Number(price) < 0) {
            return res.status(400).json({ success: false, message: 'Valid positive Price is required' });
        }
        if (!type || type.trim() === '') {
            return res.status(400).json({ success: false, message: 'Type is required' });
        }

        const newItem = await FirecrackerService.create({ 
            name, 
            price: Number(price), 
            type 
        });
        
        res.status(201).json({ success: true, data: newItem });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const bulkUploadExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Excel file (.xlsx, .xls, .csv) is required' });
        }

        const result = await FirecrackerService.bulkUploadFromExcel(req.file.path);
        res.status(200).json({ success: true, message: 'Excel processed successfully', ...result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getAll = async (req, res) => {
    try {
        const items = await FirecrackerService.getAll();
        res.json({ success: true, data: items });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getById = async (req, res) => {
    try {
        const item = await FirecrackerService.getById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: item });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const update = async (req, res) => {
    try {
        const { name, price, type } = req.body;

        const updatedItem = await FirecrackerService.update(req.params.id, {
            name,
            price: price ? Number(price) : undefined,
            type
        });

        if (!updatedItem) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: updatedItem });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const deleteItem = async (req, res) => {
    try {
        const success = await FirecrackerService.delete(req.params.id);
        if (!success) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, message: 'Firecracker deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = {
    createSingle,
    bulkUploadExcel,
    getAll,
    getById,
    update,
    deleteItem
};