import express from 'express';
import * as productController from '../controllers/product.controller.js';

const router = express.Router();

// Lấy tất cả sản phẩm
router.get('/', productController.getAllProducts);

// Lọc sản phẩm theo giá
router.get('/filter-by-price', productController.filterProductsByPrice);

// Lọc sản phẩm nâng cao (nhiều tiêu chí)
router.get('/advanced-filter', productController.advancedFilterProducts);

export default router; 