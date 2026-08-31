const db = require('../config/db');
const xlsx = require('xlsx');
const fs = require('fs');

const create = async (data) => {
    const { name, qty, price, type } = data;
    
    // 1. Insert item initially with empty string for img to prevent strict MySQL mode errors
    const [result] = await db.query(
        'INSERT INTO firecrackers (name, qty, price, type, img) VALUES (?, ?, ?, ?, ?)',
        [name, qty, price, type, '']
    );

    const newId = result.insertId;
    const imgPath = `uploads/${newId}.webp`;

    // 2. Update record with the generated route uploads/{id}.webp
    await db.query('UPDATE firecrackers SET img = ? WHERE id = ?', [imgPath, newId]);

    return { id: newId, name, qty, price, type, img: imgPath };
};

const bulkUploadFromExcel = async (filePath) => {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!rows.length) throw new Error('Excel file is empty');

    let insertedCount = 0;

    for (const [idx, row] of rows.entries()) {
        const name = row.name || row.Name;
        const qty = row.qty !== undefined ? row.qty : row.Qty;
        const price = row.price !== undefined ? row.price : row.Price;
        const type = row.type || row.Type;

        if (!name || qty === undefined || price === undefined || !type) {
            throw new Error(`Row ${idx + 2} in Excel has missing fields. name, qty, price, and type are required.`);
        }

        await create({
            name,
            qty: parseInt(qty, 10),
            price: parseFloat(price),
            type
        });

        insertedCount++;
    }

    fs.unlinkSync(filePath);
    return { insertedCount };
};

const getAll = async () => {
    const [rows] = await db.query('SELECT * FROM firecrackers');
    return rows;
};

const getById = async (id) => {
    const [rows] = await db.query('SELECT * FROM firecrackers WHERE id = ?', [id]);
    return rows[0];
};

const update = async (id, data) => {
    const fields = [];
    const values = [];

    if (data.name) { fields.push('name = ?'); values.push(data.name); }
    if (data.qty !== undefined) { fields.push('qty = ?'); values.push(data.qty); }
    if (data.price !== undefined) { fields.push('price = ?'); values.push(data.price); }
    if (data.type) { fields.push('type = ?'); values.push(data.type); }
    if (data.img) { fields.push('img = ?'); values.push(data.img); }

    if (fields.length === 0) return null;

    values.push(id);

    await db.query(`UPDATE firecrackers SET ${fields.join(', ')} WHERE id = ?`, values);
    return await getById(id);
};

const deleteItem = async (id) => {
    const [result] = await db.query('DELETE FROM firecrackers WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

module.exports = {
    bulkUploadFromExcel,
    create,
    getAll,
    getById,
    update,
    delete: deleteItem
};