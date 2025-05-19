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
              :key="product.id"
            >
              <div class="card">
                <div class="img-holder flex-center">
                  <div class="imgs">
                    <img
                      :src="product.firstImg"
                      class="card-img-top first"
                      alt="Product Image"
                    />
                    <img
                      :src="product.secondImg"
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
                    {{ product.title }}
                  </p>
                  <div class="price">
                    <span style="font-weight: bold">
                      {{
                        `$${Math.floor(
                          product.price - (product.price * product.discount) / 100
                        )}.00 `
                      }}</span
                    >
                    <span class="price-num"> {{ `$${product.price}.00` }}</span>
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
                    {{ product.description || "No description available." }}
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
                          id: product.id,
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
      this.applyClientFilters();
      
      // Cập nhật URL query parameters
      this.$router.push({
        query: {
          ...this.$route.query,
          category: category.id
        },
      });
    },

    applyFilters(filters) {
      // Merge the new filters with existing ones
      this.filters = { ...this.filters, ...filters };
      
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
        
        // Comment lại phần gọi API vì có thể gây lỗi 404
        // const response = await api.advancedFilterProducts(this.filters);
        
        // Luôn sử dụng client filtering
        this.applyClientFilters();
      } catch (error) {
        console.error('Lỗi khi lọc sản phẩm:', error);
        // Sử dụng client filtering làm fallback
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
        // This is a simplified example. In reality, you would need product-category mapping.
        // products = products.filter(p => p.categoryId === this.filters.categoryId);
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
          // Assume newer products have higher IDs
          products.sort((a, b) => b.id - a.id);
          break;
        default: // popular
          // Assume popularity is based on discount (for demo)
          products.sort((a, b) => b.discount - a.discount);
          break;
      }

      this.catalogProducts = products;
    },
  },
  mounted() {
    try {
      // Không gọi API, sử dụng dữ liệu từ Vuex store trực tiếp
      this.catalogProducts = [...this.allProducts]; // Sử dụng spread operator để tạo bản sao
      
      // Các đoạn code khác giữ nguyên
      // Check and Set Cart
      this.checkCartLS();
      this.setCartToLS();

      // Check and Set Favourite
      this.checkFavToLS();
      this.setFavToLS();

      // Check and Set Compare
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
      
      // Áp dụng bộ lọc ban đầu
      if (this.filters.categoryId || this.filters.minPrice !== 0 || this.filters.maxPrice !== 5000) {
        this.applyClientFilters();
      }
    } catch (error) {
      console.error('Lỗi khi khởi tạo dữ liệu:', error);
      this.catalogProducts = [...this.allProducts]; // Fallback nếu có lỗi
    }
  },
};
</script>

<style lang="scss" scoped>
.catalog-container {
  width: 100%;
  
  .content-column {
    width: 100%;
    padding-left: 20px; /* Increase padding from 10px to 20px to match contact page spacing */
    
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
        
        .products-container {
          flex: 1;
          
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
          }
          
          &.list {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
        }
        
        .filter-sidebar {
          width: 280px;
          margin-left: 20px;
          
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

    .product-options {
      position: absolute;
      right: 0;
      top: 5%;
      opacity: 0;
      transition: 0.3s;
      > div {
        margin-bottom: 12px;
        font-size: 17px;
        color: #2230409e;
        cursor: pointer;
        i {
          pointer-events: none;
        }
      }
      .fav {
        cursor: pointer;
        i {
          pointer-events: none;
        }
      }
      .compare {
        cursor: pointer;
        i {
          pointer-events: none;
        }
      }
    }
    .img-holder {
      .first {
        position: absolute;
        transition: 0.5s;
      }
    }
    .card-body {
      .card-text {
        margin: 5px 0;
        font-size: 15px;
      }
      .price {
        margin-bottom: 5px;
        font-size: 18px;
        .price-num {
          text-decoration: line-through;
          color: grey;
          font-size: 15px;
        }
      }
      .buy {
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
        .add-product {
          color: var(--bg-color);
          border: none;
          font-weight: 500;
          background-color: #e3e3e3;
          padding: 10px;
          border-radius: 6px;
          transition: 0.3s;
          width: 100%;
        }
      }
    }
    .discount {
      position: absolute;
      top: 10px;
      left: 15px;
      color: red;
    }
    &:hover {
      .buy {
        .add-product {
          background-color: var(--yellow);
        }
      }
      .product-options {
        opacity: 1;
        right: 5%;
      }
      .img-holder {
        .first {
          opacity: 0;
        }
      }
    }
  }
}
</style>
