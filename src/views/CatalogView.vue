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
            <button :class="{'active': viewMode === 'grid'}" @click="viewMode = 'grid'">
              <i class="fa-solid fa-grip"></i>
            </button>
            <button :class="{'active': viewMode === 'list'}" @click="viewMode = 'list'">
              <i class="fa-solid fa-list"></i>
            </button>
          </div>
        </div>

        <div class="products-section">
          <div class="products-container" :class="viewMode">
            <div
              class="product"
              v-for="product in filteredProducts"
              :key="product.productid"
            >
              <div class="card">
                <div class="img-holder flex-center">
                  <div class="imgs">
                    <img
                      :src="product.firstimg"
                      class="card-img-top first"
                      alt="Product Image"
                    />
                    <img
                      :src="product.secondimg"
                      class="card-img-top second"
                      alt="Product Image"
                    />
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
                    {{ product.productname }}
                  </p>
                  <div class="price">
                    <span style="font-weight: bold">
                      {{ formatPrice(Math.floor(product.price - (product.price * product.discount) / 100)) }}
                    </span>
                    <span class="price-num">
                      {{ formatPrice(product.price) }}
                    </span>
                  </div>
                  <div class="buy">
                    <button
                      @click="addItemToCart(product)"
                      type="button"
                      class="add-product"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      ADD TO CART
                    </button>
                    <!-- Modal -->
                    <div
                      class="modal fade"
                      id="exampleModal"
                      tabindex="-1"
                      aria-labelledby="exampleModalLabel"
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
                            </div>
                            <div class="modal-buttons">
                              <router-link class="view-cart" to="/my-cart">
                                <button
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                >
                                  View My Cart ({{ this.$store.state.cartTotal }})
                                </button>
                              </router-link>
                              <router-link class="checkout" to="/checkout">
                                <button
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                >
                                  Checkout
                                </button>
                              </router-link>
                            </div>
                            <div class="continue">
                              <router-link to="/catalog">
                                <button
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                >
                                  Continue Shopping
                                </button>
                              </router-link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- List view only description -->
                  <p v-if="viewMode === 'list'" class="product-description">
                    {{ product.productdescription || "No description available." }}
                  </p>
                </div>
                <span class="discount">{{ `-${product.discount}%` }}</span>
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
                          description: product.productdescription,
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
            <ProductFilter @filter-applied="applyFilters" :isLoading="isLoading" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ProductFilter from "@/components/Sidebar/ProductFilter.vue";
import axios from 'axios';

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
    };
  },
  computed: {
    ...mapState(["allProducts", "fav", "cart", "compare"]),

    filteredProducts() {
      return this.catalogProducts;
    },
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    },
    // Add Product To Cart
    addItemToCart(product) {
      let exists = false;
      let index = 0;
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === product.id) {
          exists = true;
          index = i;
        }
      }
      if (exists) {
        this.cart[index].count++;
      } else {
        this.cart.push(product);
        this.setCartToLS();
        this.$store.commit("totalCart");
      }
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
        `${product.name}Wishlist_${product.id}`,
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
        `${product.name}Compare_${product.id}`,
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
      this.applyFilters();

      // Cập nhật URL query parameters
      this.$router.push({
        query: {
          ...this.$route.query,
          category: category.id
        },
      });
    },

    applyFilters(filters) {
      if (filters) {
        // Merge the new filters with existing ones
        this.filters = { ...this.filters, ...filters };
      }

      // Gọi API để lọc sản phẩm
      this.applyServerFilters();

      // Cập nhật URL query parameters
      this.$router.push({
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
    },

    // Phương thức gọi API lọc sản phẩm
    async applyServerFilters() {
      try {
        this.isLoading = true;

        const response = await axios.get('http://localhost:3000/api/products/advanced-filter', {
          params: this.filters
        });

        this.catalogProducts = response.data;
      } catch (error) {
        console.error('Lỗi khi lọc sản phẩm:', error);
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
        products = products.filter(p => p.categoryId === this.filters.categoryId);
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
      const response = await axios.get('http://localhost:3000/api/products');
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
          `${product.name}Wishlist_${product.id}`
        );
        const compare = localStorage.getItem(
          `${product.name}Compare_${product.id}`
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

      // Áp dụng bộ lọc ban đầu nếu có
      if (this.filters.categoryId || this.filters.minPrice !== 0 || this.filters.maxPrice !== 5000) {
        this.applyFilters();
      }
    } catch (error) {
      console.error('Lỗi khi khởi tạo dữ liệu:', error);
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
        gap: 20px;
        padding: 0 20px;

        .products-container {
          flex: 1;
          max-width: calc(100% - 270px);

          &.grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;

            @media (max-width: 1200px) {
              grid-template-columns: repeat(2, 1fr);
            }

            @media (max-width: 767px) {
              grid-template-columns: repeat(1, 1fr);
            }

            .product {
              .card {
                width: 100%;
                margin: 0;
                height: 100%;
                max-width: 300px;
                margin: 0 auto;

                .img-holder {
                  height: 180px;
                  width: 100%;
                  padding: 10px;
                  background: #f8f8f8;

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
                      padding: 10px;
                    }
                  }
                }

                .card-body {
                  padding: 10px;

                  .card-text {
                    font-size: 13px;
                    height: 32px;
                    margin: 5px 0;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                  }

                  .price {
                    margin: 8px 0;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 8px;
                  }

                  .price-num {
                    text-decoration: line-through;
                    color: grey;
                    font-size: 13px;
                  }

                  .buy {
                    .add-product {
                      padding: 8px;
                      font-size: 13px;
                      height: 32px;
                    }
                  }
                }

                .discount {
                  font-size: 11px;
                  padding: 2px 6px;
                  top: 8px;
                  left: 8px;
                }

                .product-options {
                  right: 8px;
                  top: 8px;
                  
                  > div {
                    margin-bottom: 8px;
                    font-size: 14px;
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

    .img-holder {
      position: relative;
      width: 100%;
      height: 280px;
      overflow: hidden;
      background: #f8f8f8;
      border-radius: 8px 8px 0 0;

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
          opacity: 1;
          z-index: 1;
        }

        .second {
          opacity: 0;
          z-index: 0;
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
      padding: 15px;

      .card-text {
        margin: 5px 0;
        font-size: 15px;
        height: 40px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .price {
        margin: 8px 0;
        font-size: 14px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
      }

      .price-num {
        text-decoration: line-through;
        color: grey;
        font-size: 13px;
      }

      .buy {
        .add-product {
          color: var(--bg-color);
          border: none;
          font-weight: 500;
          background-color: #e3e3e3;
          padding: 12px;
          border-radius: 6px;
          transition: 0.3s;
          width: 100%;
          cursor: pointer;

          &:hover {
            background-color: var(--yellow);
          }
        }

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
            }
            .modal-buttons {
              display: flex;
              justify-content: center;
              gap: 20px;
              @media (max-width: 420px) {
                flex-direction: column;
              }
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
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

      .img-holder {
        .imgs {
          .first {
            opacity: 0;
          }
          .second {
            opacity: 1;
          }
        }
      }

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
</style>
