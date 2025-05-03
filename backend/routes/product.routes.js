import express from 'express';
import * as productController from '../controllers/product.controller.js'

const router = express.Router();

router.get('/getAllProducts', productController.getAllProducts);

export default router;