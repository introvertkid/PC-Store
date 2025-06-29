<template>
  <div class="search-view-container">
    <div class="content-column">
      <div class="all-products-section">
        <div class="products-header">
          <h2>Search Results for "{{ query }}"</h2>
        </div>

        <div v-if="loading" class="loading-indicator">Loading...</div>
        <div v-if="error" class="error-message">{{ error }}</div>

        <div v-if="results.length" class="products-section">
          <div class="products-container grid">
            <div
              class="product"
              v-for="product in results"
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
                  <p class="card-text">
                    {{ product.productname }}
                  </p>
                  <div class="price">
                    <span style="font-weight: bold">
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
                  </div>
                </div>
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
        </div>
        <div v-else-if="!loading && !error" class="no-results">
          <p>No results found.</p>
        </div>
      </div>
    </div>
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
                <button data-bs-dismiss="modal" aria-label="Close">
                  View My Cart ({{ this.$store.state.cartTotal }})
                </button>
              </router-link>
              <router-link class="checkout" to="/checkout">
                <button data-bs-dismiss="modal" aria-label="Close">
                  Checkout
                </button>
              </router-link>
            </div>
            <div class="continue">
              <router-link to="/catalog">
                <button data-bs-dismiss="modal" aria-label="Close">
                  Continue Shopping
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "SearchView",
  props: {
    query: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      results: [],
      loading: true,
      error: null,
    };
  },
  computed: {
    ...mapState(["fav", "cart", "compare"]),
  },
  watch: {
    query: {
      immediate: true,
      handler(newQuery) {
        this.fetchResults(newQuery);
      },
    },
  },
  methods: {
    async fetchResults(query) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(
          `http://localhost:3000/api/search?query=${query}`
        );
        this.results = response.data;
        this.updateProductsState();
      } catch (err) {
        this.error = "Failed to fetch search results.";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    updateProductsState() {
      this.results.forEach((product) => {
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
    },
    formatPrice(price) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    },
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
      }
      this.setCartToLS();
      this.$store.commit("totalCart");
    },
    setCartToLS() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    checkCartLS() {
      if (localStorage.getItem("cart")) {
        this.$store.state.cart = JSON.parse(localStorage.getItem("cart"));
      }
    },
    addToFav(product) {
      if (!this.fav.some((item) => item.id === product.id)) {
        this.fav.push(product);
        this.setFavToLS();
        this.$store.commit("totalFav");
      }
    },
    deleteFav(product) {
      const index = this.fav.findIndex((item) => item.id === product.id);
      if (index !== -1) {
        this.fav.splice(index, 1);
        this.setFavToLS();
        this.$store.commit("totalFav");
      }
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
    checkFavLS() {
      if (localStorage.getItem("fav")) {
        this.$store.state.fav = JSON.parse(localStorage.getItem("fav"));
      }
    },
    addToCompare(product) {
      if (!this.compare.some((item) => item.id === product.id)) {
        this.compare.push(product);
        this.setCompareToLS();
        this.$store.commit("totalCompare");
      }
    },
    deleteCompare(product) {
      const index = this.compare.findIndex((item) => item.id === product.id);
      if (index !== -1) {
        this.compare.splice(index, 1);
        this.setCompareToLS();
        this.$store.commit("totalCompare");
      }
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
    checkCompareLS() {
      if (localStorage.getItem("compare")) {
        this.$store.state.compare = JSON.parse(localStorage.getItem("compare"));
      }
    },
  },
  mounted() {
    this.checkCartLS();
    this.checkFavLS();
    this.checkCompareLS();
  },
};
</script>

<style lang="scss" scoped>
// Copy styles from CatalogView.vue, excluding filter-sidebar
.search-view-container {
  width: 100%;
  padding: 20px;
}

.content-column {
  width: 100%;
  margin: 0 auto;
  max-width: 1200px; // Or your desired max-width
}

.all-products-section {
  width: 100%;
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    font-size: 24px;
    margin-bottom: 0;
  }
}

.products-section {
  display: flex;
  gap: 20px;
}

.products-container {
  flex: 1;

  &.grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr); // Changed to 4 columns
    gap: 20px;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (max-width: 991px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 767px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }
}

.loading-indicator,
.error-message,
.no-results {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

// Copied .product styles from CatalogView.vue
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
      }
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

// Modal styles
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
</style>
