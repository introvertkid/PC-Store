import db from '../database/dbConnection.js';

// Lấy tất cả sản phẩm
export const getAllProducts = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM products');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lọc sản phẩm theo giá
export const filterProductsByPrice = async (req, res) => {
    try {
        const { minPrice = 0, maxPrice = 5000 } = req.query;

        const result = await db.query(
            'SELECT * FROM products WHERE price >= $1 AND price <= $2',
            [minPrice, maxPrice]
        );

        // Tính giá sau khi giảm giá
        const productsWithDiscountedPrice = result.rows.map(product => {
            const discountedPrice = product.price - (product.price * product.discount / 100);
            return {
                ...product,
                actualPrice: discountedPrice
            };
        });

        res.status(200).json(productsWithDiscountedPrice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lọc sản phẩm nhiều tiêu chí
export const advancedFilterProducts = async (req, res) => {
    try {
        const {
            minPrice = 0,
            maxPrice = 5000,
            categoryId,
            minRating = 0,
            sortBy = 'popular',
            userNeeds = []
        } = req.query;

        // Xây dựng câu query cơ bản
        let query = `
            SELECT p.*, c.categoryname
            FROM products p
            LEFT JOIN product_category pc ON p.productid = pc.productid
            LEFT JOIN categories c ON pc.categoryid = c.categoryid
            WHERE p.price >= $1 AND p.price <= $2
        `;

        const params = [minPrice, maxPrice];
        let paramCount = 2;

        // Thêm điều kiện category nếu có
        if (categoryId) {
            query += ` AND pc.categoryid = $${++paramCount}`;
            params.push(categoryId);
        }

        // Thêm điều kiện rating nếu có
        if (minRating > 0) {
            query += ` AND p.rating >= $${++paramCount}`;
            params.push(minRating);
        }

        // Thêm điều kiện user needs nếu có
        if (userNeeds.length > 0) {
            const needsArray = Array.isArray(userNeeds) ? userNeeds : userNeeds.split(',');
            query += ` AND c.categoryname = ANY($${++paramCount})`;
            params.push(needsArray);
        }

        // Thêm ORDER BY tùy theo sortBy
        switch (sortBy) {
            case 'priceAsc':
                query += ' ORDER BY p.price ASC';
                break;
            case 'priceDesc':
                query += ' ORDER BY p.price DESC';
                break;
            case 'new':
                query += ' ORDER BY p.productid DESC';
                break;
            default: // popular
                query += ' ORDER BY p.discount DESC';
                break;
        }

        const result = await db.query(query, params);

        // Tính giá sau giảm giá
        const processedProducts = result.rows.map(product => {
            const discountedPrice = product.price - (product.price * product.discount / 100);
            return {
                ...product,
                actualPrice: discountedPrice
            };
        });

        res.status(200).json(processedProducts);
    } catch (error) {
        console.error('Error in advancedFilterProducts:', error);
        res.status(500).json({ message: error.message });
    }
};
