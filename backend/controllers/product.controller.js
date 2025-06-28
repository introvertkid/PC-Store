import db from '../database/dbConnection.js';

// Lấy tất cả sản phẩm
export const getAllProducts = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT p.*, 
                   pi.imageurl as firstimg,
                   (SELECT pi2.imageurl 
                    FROM product_images pi2 
                    WHERE pi2.productid = p.productid 
                    AND pi2.imageid > pi.imageid 
                    LIMIT 1) as secondimg
            FROM products p
            LEFT JOIN product_images pi ON p.productid = pi.productid
            WHERE pi.isthumbnail = true
        `);
        
        // Transform data để phù hợp với frontend
        const transformedProducts = result.rows.map(product => ({
            id: product.productid,
            productid: product.productid, // Để backward compatibility
            firstImg: product.firstimg,
            secondImg: product.secondimg || product.firstimg,
            title: product.productname,
            price: parseFloat(product.price),
            discount: Math.floor(Math.random() * 30) + 5,
            stars: Math.floor(Math.random() * 2) + 4,
            description: product.productdescription || product.productname,
            count: 1,
            wishlist: false,
            compare: false,
            name: "all"
        }));
        
        res.status(200).json(transformedProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lọc sản phẩm theo giá
export const filterProductsByPrice = async (req, res) => {
    try {
        const { minPrice = 0, maxPrice = 5000 } = req.query;

        const result = await db.query(`
            SELECT p.*, 
                   pi.imageurl as firstimg,
                   (SELECT pi2.imageurl 
                    FROM product_images pi2 
                    WHERE pi2.productid = p.productid 
                    AND pi2.imageid > pi.imageid 
                    LIMIT 1) as secondimg
            FROM products p
            LEFT JOIN product_images pi ON p.productid = pi.productid
            WHERE pi.isthumbnail = true
            AND p.price >= $1 AND p.price <= $2
        `, [minPrice, maxPrice]);

        // Tính giá sau khi giảm giá
        const processedProducts = result.rows.map(product => {
            const discountedPrice = product.price - (product.price * product.discount / 100);
            return {
                ...product,
                actualPrice: discountedPrice
            };
        });

        res.status(200).json(processedProducts);
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
            SELECT p.*, 
                   c.categoryname,
                   pi.imageurl as firstimg,
                   (SELECT pi2.imageurl 
                    FROM product_images pi2 
                    WHERE pi2.productid = p.productid 
                    AND pi2.imageid > pi.imageid 
                    LIMIT 1) as secondimg
            FROM products p
            LEFT JOIN product_category pc ON p.productid = pc.productid
            LEFT JOIN categories c ON pc.categoryid = c.categoryid
            LEFT JOIN product_images pi ON p.productid = pi.productid
            WHERE pi.isthumbnail = true
            AND p.price >= $1 AND p.price <= $2
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

// Lấy sản phẩm phổ biến (random)
export const getPopularProducts = async (req, res) => {
    try {
        const { limit = 8 } = req.query;
        
        const result = await db.query(`
            SELECT p.*, 
                   pi.imageurl as firstimg,
                   (SELECT pi2.imageurl 
                    FROM product_images pi2 
                    WHERE pi2.productid = p.productid 
                    AND pi2.imageid > pi.imageid 
                    LIMIT 1) as secondimg
            FROM products p
            LEFT JOIN product_images pi ON p.productid = pi.productid
            WHERE pi.isthumbnail = true
            ORDER BY RANDOM()
            LIMIT $1
        `, [limit]);

        // Transform data để phù hợp với frontend
        const transformedProducts = result.rows.map(product => ({
            id: product.productid,
            productid: product.productid, // Để backward compatibility
            firstImg: product.firstimg,
            secondImg: product.secondimg || product.firstimg,
            title: product.productname,
            price: parseFloat(product.price),
            discount: Math.floor(Math.random() * 30) + 5, // Random discount 5-35%
            stars: Math.floor(Math.random() * 2) + 4, // Random stars 4-5
            description: product.productdescription || product.productname,
            count: 1,
            wishlist: false,
            compare: false,
            name: "popular"
        }));

        res.status(200).json(transformedProducts);
    } catch (error) {
        console.error('Error in getPopularProducts:', error);
        res.status(500).json({ message: error.message });
    }
};

// Lấy sản phẩm mới nhất (random)
export const getLatestProducts = async (req, res) => {
    try {
        const { limit = 8 } = req.query;
        
        const result = await db.query(`
            SELECT p.*, 
                   pi.imageurl as firstimg,
                   (SELECT pi2.imageurl 
                    FROM product_images pi2 
                    WHERE pi2.productid = p.productid 
                    AND pi2.imageid > pi.imageid 
                    LIMIT 1) as secondimg
            FROM products p
            LEFT JOIN product_images pi ON p.productid = pi.productid
            WHERE pi.isthumbnail = true
            ORDER BY RANDOM()
            LIMIT $1
        `, [limit]);

        // Transform data để phù hợp với frontend
        const transformedProducts = result.rows.map(product => ({
            id: product.productid,
            productid: product.productid, // Để backward compatibility
            firstImg: product.firstimg,
            secondImg: product.secondimg || product.firstimg,
            title: product.productname,
            price: parseFloat(product.price),
            discount: Math.floor(Math.random() * 25) + 10, // Random discount 10-35%
            stars: Math.floor(Math.random() * 2) + 4, // Random stars 4-5
            description: product.productdescription || product.productname,
            count: 1,
            wishlist: false,
            compare: false,
            name: "latest"
        }));

        res.status(200).json(transformedProducts);
    } catch (error) {
        console.error('Error in getLatestProducts:', error);
        res.status(500).json({ message: error.message });
    }
};

// Lấy sản phẩm nổi bật (random)
export const getFeaturedProducts = async (req, res) => {
    try {
        const { limit = 8 } = req.query;
        
        const result = await db.query(`
            SELECT p.*, 
                   pi.imageurl as firstimg,
                   (SELECT pi2.imageurl 
                    FROM product_images pi2 
                    WHERE pi2.productid = p.productid 
                    AND pi2.imageid > pi.imageid 
                    LIMIT 1) as secondimg
            FROM products p
            LEFT JOIN product_images pi ON p.productid = pi.productid
            WHERE pi.isthumbnail = true
            ORDER BY RANDOM()
            LIMIT $1
        `, [limit]);

        // Transform data để phù hợp với frontend
        const transformedProducts = result.rows.map(product => ({
            id: product.productid,
            productid: product.productid, // Để backward compatibility
            firstImg: product.firstimg,
            secondImg: product.secondimg || product.firstimg,
            title: product.productname,
            price: parseFloat(product.price),
            discount: Math.floor(Math.random() * 35) + 15, // Random discount 15-50%
            stars: Math.floor(Math.random() * 2) + 4, // Random stars 4-5
            description: product.productdescription || product.productname,
            count: 1,
            wishlist: false,
            compare: false,
            name: "featured"
        }));

        res.status(200).json(transformedProducts);
    } catch (error) {
        console.error('Error in getFeaturedProducts:', error);
        res.status(500).json({ message: error.message });
    }
};
