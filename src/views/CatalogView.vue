/catalog2 //catalog
<!-- eslint-disable prettier/prettier, vue/no-deprecated-destroyed-lifecycle -->
<template>
  <div class="catalog-container">
    <!-- All Products section -->
    <div class="content-column">
      <div class="all-products-section">
        <div class="products-header">
          <h2>All Products</h2>
          <div class="view-options">
            <span class="view-text">View as:</span>
            <button
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
            >
              <i class="fa-solid fa-grip"></i>
            </button>
            <button
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
            >
              <i class="fa-solid fa-list"></i>
            </button>
          </div>
        </div>

        <div class="products-section">
          <div class="products-container" :class="viewMode">
            <div
              class="product"
              v-for="product in paginatedProducts"
              :key="product.productid"
            >
              <div class="card">
                <div class="img-holder flex-center">
                  <div class="imgs">
                    <img
                      :src="product.firstImg"
                      class="card-img-top first"
                      alt="Product Image"
                    />
                    <!-- Loại bỏ ảnh thứ 2 để tránh lỗi hover
                    <img
                      :src="product.secondImg"
                      class="card-img-top second"
                      alt="Product Image"
                    />
                    -->
                  </div>
                </div>
                <div class="card-body">
                  <span v-if="product.stars === 5" style="color: var(--yellow)">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                  </span>
                  <span v-else style="color: var(--yellow)">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star" style="color: grey"></i>
                  </span>
                  <p class="card-text">
                    {{ product.title }}
                  </p>
                  <div class="price">
                    <span style="font-weight: bold">
                      {{
                        formatPrice(
                          Math.floor(
                            Number(product.price) -
                              (Number(product.price) * Number(product.discount || 0)) / 100
                          )
                        )
                      }}
                    </span>
                    <span class="price-num">
                      {{ formatPrice(Number(product.price)) }}
                    </span>
                  </div>
                  <div class="buy">
                    <button
                      @click="addItemToCart(product, $event)"
                      type="button"
                      class="add-product"
                    >
                      ADD TO CART
                    </button>

                  </div>

                  <!-- List view only description -->
                  <p v-if="viewMode === 'list'" class="product-description">
                    {{
                      product.description || "No description available."
                    }}
                  </p>
                </div>
                <span class="discount">{{ `-${Number(product.discount || 0)}%` }}</span>
                <div class="product-options">
                  <div class="fav" @click="toggleFavourite(product)">
                    <i v-if="!product.wishlist" class="fa-regular fa-heart"></i>
                    <i v-if="product.wishlist" class="fa-solid fa-heart"></i>
                  </div>
                  <div class="compare" @click="toggleCompare(product)">
                    <i
                      v-if="!product.compare"
                      class="fa-solid fa-arrows-rotate"
                    ></i>
                    <i v-if="product.compare" class="fa-solid fa-check"></i>
                  </div>
                  <div
                    class="view"
                    @click="
                      this.$router.push({
                        name: 'product',
                        params: {
                          id: product.productid,
                          description: product.description,
                        },
                      })
                    "
                  >
                    <i class="fa-regular fa-eye"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="filter-sidebar">
            <ProductFilter
              @filter-applied="applyFilters"
              :isLoading="isLoading"
            />
          </div>
        </div>

        <!-- Pagination Section -->
        <div class="pagination-section" v-if="totalPages > 1">
          <div class="pagination-info">
            <div class="results-info">
              {{ paginationInfo }}
            </div>
            <div class="items-per-page">
              <label>Hiển thị:</label>
              <select
                :value="itemsPerPage"
                @change="changeItemsPerPage(parseInt($event.target.value))"
                class="items-select"
              >
                <option value="8">8</option>
                <option value="12">12</option>
                <option value="16">16</option>
                <option value="24">24</option>
                <option value="48">48</option>
              </select>
              <span>sản phẩm/trang</span>
            </div>
          </div>

          <div class="pagination-controls">
            <button
              @click="goToFirstPage"
              :disabled="currentPage === 1"
              class="pagination-btn first"
            >
              <i class="fa-solid fa-angles-left"></i>
            </button>

            <button
              @click="goToPrevPage"
              :disabled="currentPage === 1"
              class="pagination-btn prev"
            >
              <i class="fa-solid fa-chevron-left"></i>
            </button>

            <div class="pagination-numbers">
              <button
                v-for="page in visiblePageNumbers"
                :key="page"
                @click="changePage(page)"
                :class="['pagination-number', {
                  'active': page === currentPage,
                  'dots': page === '...'
                }]"
                :disabled="page === '...'"
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="goToNextPage"
              :disabled="currentPage === totalPages"
              class="pagination-btn next"
            >
              <i class="fa-solid fa-chevron-right"></i>
            </button>

            <button
              @click="goToLastPage"
              :disabled="currentPage === totalPages"
              class="pagination-btn last"
            >
              <i class="fa-solid fa-angles-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Global Modal -->
  <div
    class="modal fade"
    id="cartModal"
    tabindex="-1"
    aria-labelledby="cartModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="modal-info">
            <h2>
              Product Added Successfully to the Cart
              <i class="fa-regular fa-circle-check"></i>
            </h2>
            <div class="product-image-container">
              <img
                :src="addedProduct.firstImg || addedProduct.firstimg || addedProduct.images?.[0]?.url"
                alt="Product img"
                v-if="addedProduct"
              />
            </div>
            <span
              style="
                color: grey;
                text-align: center;
                margin-bottom: 20px;
                display: block;
              "
              v-if="addedProduct"
            >
              {{ addedProduct.title || addedProduct.productname }}
            </span>
          </div>
          <div class="modal-buttons">
            <router-link class="view-cart" to="/my-cart">
              <button data-bs-dismiss="modal" aria-label="Close">
                VIEW MY CART ({{ this.$store.state.cartTotal }})
              </button>
            </router-link>
            <router-link class="checkout" to="/checkout">
              <button data-bs-dismiss="modal" aria-label="Close">
                CHECKOUT
              </button>
            </router-link>
          </div>
          <div class="continue">
            <button
              @click="closeModal"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ProductFilter from "@/components/Sidebar/ProductFilter.vue";
import axios from "axios";

export default {
  components: {
    ProductFilter,
  },
  data() {
    return {
      catalogProducts: [],
      viewMode: "grid",
      filters: {
        categoryId: null,
        minPrice: 0,
        maxPrice: 5000,
        sortBy: "popular",
        userNeeds: [],
        minRating: 0,
      },
      isLoading: false,
      addedProduct: "",
      // Pagination data
      currentPage: 1,
      itemsPerPage: 12,
    };
  },
  computed: {
    ...mapState(["allProducts", "fav", "cart", "compare"]),

    filteredProducts() {
      return this.catalogProducts;
    },

    // Pagination computed properties
    totalProducts() {
      return this.filteredProducts.length;
    },

    totalPages() {
      return Math.ceil(this.totalProducts / this.itemsPerPage);
    },

    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredProducts.slice(start, end);
    },

    paginationInfo() {
      if (this.totalProducts === 0) {
        return "Không có sản phẩm nào";
      }
      const start = (this.currentPage - 1) * this.itemsPerPage + 1;
      const end = Math.min(
        this.currentPage * this.itemsPerPage,
        this.totalProducts
      );
      return `Hiển thị ${start}-${end} trong tổng số ${this.totalProducts} sản phẩm`;
    },

    visiblePageNumbers() {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(2, this.currentPage - delta);
        i <= Math.min(this.totalPages - 1, this.currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (this.currentPage - delta > 2) {
        rangeWithDots.push(1, "...");
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (this.currentPage + delta < this.totalPages - 1) {
        rangeWithDots.push("...", this.totalPages);
      } else if (this.totalPages > 1) {
        rangeWithDots.push(this.totalPages);
      }

      return rangeWithDots;
    },
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    },
    // Add Product To Cart
    addItemToCart(product, event) {
      // Prevent multiple clicks
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      let exists = false;
      let index = 0;
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i].productid === product.productid) {
          exists = true;
          index = i;
        }
      }
      if (exists) {
        this.cart[index].count++;
      } else {
        product.count = 1;
        this.cart.push(product);
      }

      this.setCartToLS();
      this.$store.commit("totalCart");

      // Save added product for modal display
      this.addedProduct = product;

      // Show modal manually
      this.showModal();
    },

    // Show Modal Function
    showModal() {
      this.$nextTick(() => {
        const modalElement = document.getElementById("cartModal");
        if (modalElement && window.bootstrap) {
          const modal = new window.bootstrap.Modal(modalElement);
          modal.show();
        }
      });
    },

    // Close Modal
    closeModal() {
      // Modal sẽ tự đóng bởi data-bs-dismiss="modal"
    },

    // Pagination methods
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.scrollToTop();
      }
    },

    goToFirstPage() {
      this.changePage(1);
    },

    goToLastPage() {
      this.changePage(this.totalPages);
    },

    goToPrevPage() {
      this.changePage(this.currentPage - 1);
    },

    goToNextPage() {
      this.changePage(this.currentPage + 1);
    },

    changeItemsPerPage(newItemsPerPage) {
      this.itemsPerPage = newItemsPerPage;
      this.currentPage = 1; // Reset to first page
      this.scrollToTop();
    },

    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    setCartToLS() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    checkCartLS() {
      localStorage.getItem("cart")
        ? (this.cart = JSON.parse(localStorage.getItem("cart")))
        : (this.cart = []);
    },
    // Add to Favourit
    addToFav(product) {
      if (!this.fav.includes(product)) {
        this.fav.push(product);
        this.setFavToLS();
        this.$store.commit("totalFav");
      }
    },
    deleteFav(product) {
      this.fav.splice(this.fav.indexOf(product), 1);
      this.setFavToLS();
      this.$store.commit("totalFav");
    },
    toggleFavourite(product) {
      if (product.wishlist) {
        this.deleteFav(product);
      } else {
        this.addToFav(product);
      }
      product.wishlist = !product.wishlist;
      localStorage.setItem(
        `${product.title}Wishlist_${product.productid}`,
        product.wishlist
      );
    },
    setFavToLS() {
      localStorage.setItem("fav", JSON.stringify(this.fav));
    },
    checkFavToLS() {
      localStorage.getItem("fav")
        ? (this.fav = JSON.parse(localStorage.getItem("fav")))
        : (this.fav = []);
    },
    // Add To Compare
    addToCompare(product) {
      if (!this.compare.includes(product)) {
        this.compare.push(product);
        this.setCompareToLS();
        this.$store.commit("totalCompare");
      }
    },
    deleteCompare(product) {
      this.compare.splice(this.compare.indexOf(product), 1);
      this.setCompareToLS();
      this.$store.commit("totalCompare");
    },
    toggleCompare(product) {
      if (product.compare) {
        this.deleteCompare(product);
      } else {
        this.addToCompare(product);
      }
      product.compare = !product.compare;
      localStorage.setItem(
        `${product.title}Compare_${product.productid}`,
        product.compare
      );
    },
    setCompareToLS() {
      localStorage.setItem("compare", JSON.stringify(this.compare));
    },
    checkCompareToLS() {
      localStorage.getItem("compare")
        ? (this.compare = JSON.parse(localStorage.getItem("compare")))
        : (this.compare = []);
    },

    // Filter methods
    filterByCategory(category) {
      this.filters.categoryId = category.id;
      this.currentPage = 1; // Reset pagination
      this.applyFilters();

      // Cập nhật URL query parameters
      this.$router.push({
        query: {
          ...this.$route.query,
          category: category.id,
        },
      });
    },

    applyFilters(filters, updateUrl = true) {
      if (filters) {
        // Merge the new filters with existing ones
        this.filters = { ...this.filters, ...filters };
      }

      // Reset pagination when filters change
      this.currentPage = 1;

      // Gọi API để lọc sản phẩm
      this.applyServerFilters();

      // Chỉ cập nhật URL khi cần thiết (không phải từ mounted)
      if (updateUrl) {
        this.$router.replace({
          query: {
            ...this.$route.query,
            minPrice: this.filters.minPrice,
            maxPrice: this.filters.maxPrice,
            sortBy: this.filters.sortBy,
            userNeeds: this.filters.userNeeds.join(","),
            minRating: this.filters.minRating,
            categoryId: this.filters.categoryId,
          },
        });
      }
    },

    // Phương thức gọi API lọc sản phẩm
    async applyServerFilters() {
      try {
        this.isLoading = true;

        const response = await axios.get(
          "http://localhost:3000/api/products/advanced-filter",
          {
            params: this.filters,
          }
        );

        this.catalogProducts = response.data;
      } catch (error) {
        console.error("Lỗi khi lọc sản phẩm:", error);
        // Fallback to client filtering if API fails
        this.applyClientFilters();
      } finally {
        this.isLoading = false;
      }
    },

    // Phương thức lọc sản phẩm phía client (dùng làm fallback)
    applyClientFilters() {
      let products = [...this.allProducts];

      // Filter by category if selected
      if (this.filters.categoryId) {
        products = products.filter(
          (p) => p.categoryId === this.filters.categoryId
        );
      }

      // Filter by price range
      products = products.filter((product) => {
        const actualPrice = Math.floor(
          product.price - (product.price * product.discount) / 100
        );
        return (
          actualPrice >= this.filters.minPrice &&
          actualPrice <= this.filters.maxPrice
        );
      });

      // Filter by rating
      if (this.filters.minRating > 0) {
        products = products.filter(
          (product) => product.stars >= this.filters.minRating
        );
      }

      // Sort products
      switch (this.filters.sortBy) {
        case "priceAsc":
          products.sort((a, b) => {
            const priceA = Math.floor(a.price - (a.price * a.discount) / 100);
            const priceB = Math.floor(b.price - (b.price * b.discount) / 100);
            return priceA - priceB;
          });
          break;
        case "priceDesc":
          products.sort((a, b) => {
            const priceA = Math.floor(a.price - (a.price * a.discount) / 100);
            const priceB = Math.floor(b.price - (b.price * b.discount) / 100);
            return priceB - priceA;
          });
          break;
        case "new":
          products.sort((a, b) => b.id - a.id);
          break;
        default: // popular
          products.sort((a, b) => b.discount - a.discount);
          break;
      }

      this.catalogProducts = products;
    },
  },
  async mounted() {
    try {
      // Lấy tất cả sản phẩm từ API
      const response = await axios.get("http://localhost:3000/api/products");
      this.catalogProducts = response.data;

      // Các đoạn code khác giữ nguyên
      this.checkCartLS();
      this.setCartToLS();
      this.checkFavToLS();
      this.setFavToLS();
      this.checkCompareToLS();
      this.setCompareToLS();

      // Get the Active Product Icons
      this.catalogProducts.forEach((product) => {
        const wishlist = localStorage.getItem(
          `${product.title}Wishlist_${product.productid}`
        );
        const compare = localStorage.getItem(
          `${product.title}Compare_${product.productid}`
        );

        if (wishlist !== null) {
          product.wishlist = wishlist === "true";
        }

        if (compare !== null) {
          product.compare = compare === "true";
        }
      });

      // Set initial filters from URL if present
      const query = this.$route.query;
      if (query.category) this.filters.categoryId = parseInt(query.category);
      if (query.minPrice) this.filters.minPrice = parseInt(query.minPrice);
      if (query.maxPrice) this.filters.maxPrice = parseInt(query.maxPrice);
      if (query.sortBy) this.filters.sortBy = query.sortBy;
      if (query.userNeeds) this.filters.userNeeds = query.userNeeds.split(",");
      if (query.minRating) this.filters.minRating = parseInt(query.minRating);

      // Áp dụng bộ lọc ban đầu nếu có (không update URL để tránh loop)
      if (
        this.filters.categoryId ||
        this.filters.minPrice !== 0 ||
        this.filters.maxPrice !== 5000
      ) {
        this.applyFilters(null, false);
      }
    } catch (error) {
      console.error("Lỗi khi khởi tạo dữ liệu:", error);
      // Fallback to Vuex store data if API fails
      this.catalogProducts = [...this.allProducts];
    }
  },
};
</script>

<style lang="scss" scoped>
.catalog-container {
  width: 100%;

  .content-column {
    width: 100%;
    padding-left: 20px;

    .all-products-section {
      width: 100%;

      .products-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        h2 {
          font-size: 24px;
          margin-bottom: 0;
        }

        .view-options {
          display: flex;
          align-items: center;

          .view-text {
            margin-right: 10px;
            color: #666;
          }

          button {
            background: none;
            border: 1px solid #ddd;
            width: 40px;
            height: 40px;
            border-radius: 4px;
            margin-left: 5px;
            cursor: pointer;

            &.active {
              background-color: var(--yellow);
              border-color: var(--yellow);
            }
          }
        }
      }

      .products-section {
        display: flex;
        gap: 20px; /* Gap vừa phải giữa products và filter */
        padding: 0 10px; /* Padding compact hơn */
        align-items: flex-start;

        .products-container {
          flex: 1;
          max-width: calc(100% - 250px);
          margin-left: -0.5cm; /* Điều chỉnh vị trí phù hợp */
          padding: 0 5px; /* Giảm padding để compact hơn */

          &.grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px; /* Gap vừa phải như trong ảnh */
            align-items: stretch;
            justify-items: center;

            @media (max-width: 1400px) {
              grid-template-columns: repeat(3, 1fr);
              gap: 14px;
            }

            @media (max-width: 1200px) {
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
              margin-left: -0.3cm;
            }

            @media (max-width: 991px) {
              margin-left: -0.2cm;
              gap: 12px;
            }

            @media (max-width: 767px) {
              grid-template-columns: repeat(1, 1fr);
              gap: 12px;
              padding: 0 3px;
              margin-left: 0;
            }

            @media (max-width: 480px) {
              gap: 10px;
              padding: 0;
              margin-left: 0;
            }

            .product {
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: stretch; /* Đảm bảo tất cả items có cùng chiều cao */

              .card {
                width: 200px; /* Giảm width để compact như ảnh */
                margin: 0;
                height: 320px; /* Giảm height để giống ảnh */
                max-width: 200px;
                min-width: 200px;

                @media (max-width: 1400px) {
                  width: 190px;
                  max-width: 190px;
                  min-width: 190px;
                }

                @media (max-width: 1200px) {
                  width: 200px;
                  max-width: 200px;
                  min-width: 200px;
                }

                @media (max-width: 991px) {
                  width: 180px;
                  max-width: 180px;
                  min-width: 180px;
                }

                @media (max-width: 767px) {
                  width: 100%;
                  max-width: 280px;
                  min-width: 250px;
                  margin: 0 auto;
                }

                @media (max-width: 480px) {
                  width: 100%;
                  max-width: 100%;
                  min-width: unset;
                }
                display: flex;
                flex-direction: column;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease, box-shadow 0.3s ease;

                .img-holder {
                  height: 160px; /* Giảm height ảnh để compact */
                  width: 100%;
                  padding: 8px;
                  background: #f8f8f8;
                  flex-shrink: 0;

                  .imgs {
                    height: 100%;
                    width: 100%;
                    position: relative;

                    img {
                      position: absolute;
                      top: 0;
                      left: 0;
                      width: 100%;
                      height: 100%;
                      object-fit: contain;
                      padding: 6px;
                    }

                    .first {
                      /* Single image - no special styling needed */
                    }

                    .second {
                      display: none; /* Ẩn ảnh thứ 2 trong grid */
                    }
                  }
                }

                .card-body {
                  padding: 10px;
                  flex: 1;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;

                  .card-text {
                    font-size: 12px;
                    height: 32px; /* Giảm height cho compact */
                    margin: 4px 0;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    line-height: 1.3;
                  }

                  .price {
                    margin: 6px 0;
                    font-size: 13px;
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 6px;
                    min-height: 20px; /* Giảm height để compact */
                  }

                  .price-num {
                    text-decoration: line-through;
                    color: grey;
                    font-size: 12px;
                  }

                  .buy {
                    margin-top: auto;

                    .add-product {
                      padding: 8px 10px;
                      font-size: 11px;
                      height: 32px; /* Giảm height nút cho compact */
                      width: 100%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-weight: 600;
                      border-radius: 4px;
                      transition: all 0.3s ease;
                    }
                  }
                }

                .discount {
                  font-size: 11px;
                  padding: 4px 6px;
                  top: 8px;
                  left: 8px;
                  border-radius: 4px;
                  background: #ff4444;
                  color: white;
                  font-weight: 500;
                }

                .product-options {
                  right: 8px;
                  top: 8px;
                  opacity: 0;
                  transition: all 0.3s ease;

                  > div {
                    margin-bottom: 8px;
                    font-size: 14px;
                    cursor: pointer;

                    i {
                      pointer-events: none;
                    }
                  }
                }

                /* Hover effects cho grid - loại bỏ image transition */
                &:hover {
                  transform: translateY(-5px);
                  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);

                  .product-options {
                    opacity: 1;
                  }

                  .buy {
                    .add-product {
                      background-color: var(--yellow);
                      color: white;
                    }
                  }
                }
              }
            }
          }

          &.list {
            .product {
              .card {
                display: flex;
                max-width: 100%;

                .img-holder {
                  width: 180px !important;
                  min-width: 180px !important;
                  height: 180px !important;
                }

                .card-body {
                  flex: 1;
                  padding: 15px;

                  .card-text {
                    height: auto;
                    -webkit-line-clamp: unset;
                  }
                }
              }
            }
          }
        }

        .filter-sidebar {
          width: 250px;
          min-width: 250px;
          height: fit-content;
          background: #fff;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-left: 1cm;

          @media (max-width: 991px) {
            display: none;
          }
        }
      }
    }
  }
}

.product {
  .card {
    border: none;
    position: relative;
    margin-bottom: 24px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    height: 320px; /* Giảm height để compact như ảnh */
    display: flex;
    flex-direction: column;

    .img-holder {
      position: relative;
      width: 100%;
      height: 160px; /* Giảm height ảnh đồng nhất */
      overflow: hidden;
      background: #f8f8f8;
      border-radius: 8px 8px 0 0;
      flex-shrink: 0;

      .imgs {
        width: 100%;
        height: 100%;
        position: relative;

        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: opacity 0.3s ease;
          padding: 10px;
        }

        .first {
          /* Simplified cho single image */
        }

        .second {
          display: none; /* Ẩn hoàn toàn ảnh thứ 2 để tránh lỗi */
        }
      }
    }

    .product-options {
      position: absolute;
      right: 0;
      top: 5%;
      opacity: 0;
      transition: 0.3s;
      z-index: 2;
      > div {
        margin-bottom: 12px;
        font-size: 17px;
        color: #2230409e;
        cursor: pointer;
        i {
          pointer-events: none;
        }
      }
    }

    .card-body {
      padding: 10px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .card-text {
        margin: 4px 0;
        font-size: 12px;
        height: 32px; /* Giảm height cho compact */
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height: 1.4;
      }

      .price {
        margin: 6px 0;
        font-size: 13px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px;
        min-height: 20px;
      }

      .price-num {
        text-decoration: line-through;
        color: grey;
        font-size: 12px;
      }

      .buy {
        margin-top: auto;

        .add-product {
          color: var(--bg-color);
          border: none;
          font-weight: 600;
          background-color: #e3e3e3;
          padding: 8px 10px;
          font-size: 11px;
          border-radius: 4px;
          transition: all 0.3s ease;
          width: 100%;
          height: 32px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;

          &:hover {
            background-color: var(--yellow);
          }
        }
      }
    }

    .discount {
      position: absolute;
      top: 10px;
      left: 15px;
      background-color: #ff4444;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 500;
      z-index: 2;
      font-size: 11px;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

      /* Loại bỏ image transition để tránh lỗi */
      /* .img-holder {
        .imgs {
          .first {
            opacity: 0;
          }
          .second {
            opacity: 1;
          }
        }
      } */

      .product-options {
        opacity: 1;
        right: 5%;
      }

      .buy {
        .add-product {
          background-color: var(--yellow);
        }
      }
    }
  }
}

/* Modal styling - copied from ProductsSwiper.vue */
.modal-content {
  .modal-header {
    border-bottom: none;
    padding: 16px;
  }
  .modal-body {
    padding: 0 16px 16px;
    .modal-info {
      h2 {
        margin-bottom: 20px;
        font-size: 18px;
        text-align: center;
        color: green;
      }

      .product-image-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 20px 0;

        img {
          max-width: 150px;
          max-height: 150px;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      }
    }
    .modal-buttons {
      display: flex;
      justify-content: center;
      a {
        button {
          width: 100%;
          border: none;
          border-radius: 6px;
          padding: 12px 0;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
        &.view-cart {
          flex: 1;
          margin-right: 20px;
          button {
            background-color: #e3e3e3;
          }
        }
        &.checkout {
          flex: 1;
          button {
            background-color: var(--yellow);
          }
        }
      }
    }
    .continue {
      margin-top: 15px;
      button {
        display: block;
        margin: auto;
        border: none;
        background-color: transparent;
        text-decoration: underline;
        font-size: 18px;
      }
    }
  }
}

// Pagination Styling
.pagination-section {
  margin-top: 40px;
  padding: 20px;
  border-top: 1px solid #e5e5e5;

  .pagination-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    font-size: 14px;
    color: #666;

    @media (max-width: 767px) {
      flex-direction: column;
      gap: 10px;
      align-items: flex-start;
    }

    .results-info {
      font-weight: 500;
    }

    .items-per-page {
      display: flex;
      align-items: center;
      gap: 8px;

      label {
        margin: 0;
        font-weight: 500;
      }

      .items-select {
        padding: 4px 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        background: white;
        cursor: pointer;

        &:focus {
          outline: none;
          border-color: var(--yellow);
        }
      }
    }
  }

  .pagination-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;

    @media (max-width: 480px) {
      flex-wrap: wrap;
      gap: 4px;
    }

    .pagination-btn {
      width: 40px;
      height: 40px;
      border: 1px solid #ddd;
      background: white;
      color: #666;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover:not(:disabled) {
        background: var(--yellow);
        border-color: var(--yellow);
        color: white;
      }

      &:disabled {
        background: #f5f5f5;
        color: #ccc;
        cursor: not-allowed;
        border-color: #e5e5e5;
      }

      @media (max-width: 480px) {
        width: 35px;
        height: 35px;
        font-size: 12px;
      }
    }

    .pagination-numbers {
      display: flex;
      gap: 4px;
      margin: 0 12px;

      @media (max-width: 480px) {
        margin: 0 8px;
      }
    }

    .pagination-number {
      min-width: 40px;
      height: 40px;
      border: 1px solid #ddd;
      background: white;
      color: #666;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      padding: 0 8px;

      &:hover:not(:disabled):not(.dots) {
        background: var(--yellow);
        border-color: var(--yellow);
        color: white;
      }

      &.active {
        background: var(--yellow);
        border-color: var(--yellow);
        color: white;
        font-weight: 600;
      }

      &.dots {
        border: none;
        background: transparent;
        cursor: default;
        font-weight: bold;
        color: #999;
      }

      @media (max-width: 480px) {
        min-width: 35px;
        height: 35px;
        font-size: 14px;
      }
    }
  }
}
</style>
