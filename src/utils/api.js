import axios from "axios";

const API_URL = "http://localhost:3000/api";

export default {
  // Product API
  getProducts() {
    return axios.get(`${API_URL}/products`);
  },

  // Lọc sản phẩm theo giá
  filterProductsByPrice(minPrice, maxPrice) {
    return axios.get(`${API_URL}/products/filter-by-price`, {
      params: { minPrice, maxPrice },
    });
  },

  // Lọc sản phẩm nâng cao
  advancedFilterProducts(filters) {
    return axios.get(`${API_URL}/products/advanced-filter`, {
      params: filters,
    });
  },

  // Lấy sản phẩm phổ biến
  getPopularProducts(limit = 8) {
    return axios.get(`${API_URL}/products/popular`, {
      params: { limit },
    });
  },

  // Lấy sản phẩm mới nhất
  getLatestProducts(limit = 8) {
    return axios.get(`${API_URL}/products/latest`, {
      params: { limit },
    });
  },

  // Lấy sản phẩm nổi bật
  getFeaturedProducts(limit = 8) {
    return axios.get(`${API_URL}/products/featured`, {
      params: { limit },
    });
  },
};
