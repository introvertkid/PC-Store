import db from '../database/dbConnection.js'

export const getAllProducts = async (req, res) => {
    try {
        const result = await db.query('select * from products');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};