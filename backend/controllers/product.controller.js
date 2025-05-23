import Product from "../models/Product.js";
import { Op } from "sequelize";

// Lấy tất cả sản phẩm
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lọc sản phẩm theo giá
export const filterProductsByPrice = async (req, res) => {
  try {
    const { minPrice = 0, maxPrice = 5000 } = req.query;

    // Sử dụng Sequelize để truy vấn DB
    const products = await Product.findAll({
      where: {
        price: {
          [Op.gte]: minPrice,
          [Op.lte]: maxPrice,
        },
      },
    });

    // Tính giá sau khi giảm giá
    const productsWithDiscountedPrice = products.map((product) => {
      const discountedPrice =
        product.price - (product.price * product.discount) / 100;
      return {
        ...product.toJSON(),
        actualPrice: discountedPrice,
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
      sortBy = "popular",
    } = req.query;

    // Xây dựng điều kiện where
    const whereConditions = {};

    // Điều kiện giá
    whereConditions.price = {
      [Op.gte]: minPrice,
      [Op.lte]: maxPrice,
    };

    // Điều kiện danh mục nếu có
    if (categoryId) {
      whereConditions.categoryId = categoryId;
    }

    // Điều kiện đánh giá
    if (minRating > 0) {
      whereConditions.stars = {
        [Op.gte]: minRating,
      };
    }

    // Truy vấn DB với điều kiện
    const products = await Product.findAll({ where: whereConditions });

    // Tính giá sau giảm giá và áp dụng sắp xếp
    let processedProducts = products.map((product) => {
      const discountedPrice =
        product.price - (product.price * product.discount) / 100;
      return {
        ...product.toJSON(),
        actualPrice: discountedPrice,
      };
    });

    // Sắp xếp sản phẩm theo tiêu chí
    switch (sortBy) {
      case "priceAsc":
        processedProducts.sort((a, b) => a.actualPrice - b.actualPrice);
        break;
      case "priceDesc":
        processedProducts.sort((a, b) => b.actualPrice - a.actualPrice);
        break;
      case "new":
        processedProducts.sort((a, b) => b.id - a.id);
        break;
      default: // popular - mặc định sắp xếp theo discount
        processedProducts.sort((a, b) => b.discount - a.discount);
        break;
    }

    res.status(200).json(processedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
