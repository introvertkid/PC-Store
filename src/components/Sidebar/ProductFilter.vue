<template>
  <div class="product-filter">
    <h4>Lọc Sản Phẩm</h4>
    <!-- Price Range Filter -->
    <div class="filter-group">
      <h5>Khoảng Giá</h5>
      <div class="price-range">
        <div class="slider-container">
          <input
            type="range"
            min="0"
            max="20000000"
            step="1000000"
            v-model="minPrice"
            class="price-slider"
          />
          <input
            type="range"
            min="0"
            max="20000000"
            step="1000000"
            v-model="maxPrice"
            class="price-slider"
          />
        </div>
        <div class="price-inputs">
          <div class="price-input">
            <input type="number" v-model="minPrice" min="0" max="20000000" />
            <span>₫</span>
          </div>
          <span>-</span>
          <div class="price-input">
            <input type="number" v-model="maxPrice" min="0" max="20000000" />
            <span>₫</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Popularity Filter -->
    <div class="filter-group">
      <h5>Sắp Xếp Theo</h5>
      <div class="filter-options">
        <label class="filter-option">
          <input type="radio" name="sort" value="popular" v-model="sortBy" />
          <span>Phổ biến nhất</span>
        </label>
        <label class="filter-option">
          <input type="radio" name="sort" value="new" v-model="sortBy" />
          <span>Hàng mới</span>
        </label>
        <label class="filter-option">
          <input type="radio" name="sort" value="priceAsc" v-model="sortBy" />
          <span>Giá: Thấp đến Cao</span>
        </label>
        <label class="filter-option">
          <input type="radio" name="sort" value="priceDesc" v-model="sortBy" />
          <span>Giá: Cao đến Thấp</span>
        </label>
      </div>
    </div>

    <!-- User Needs Filter -->
    <div class="filter-group">
      <h5>Nhu Cầu Sử Dụng</h5>
      <div class="filter-options">
        <label class="filter-option">
          <input type="checkbox" value="gaming" v-model="userNeeds" />
          <span>Gaming</span>
        </label>
        <label class="filter-option">
          <input type="checkbox" value="office" v-model="userNeeds" />
          <span>Văn phòng</span>
        </label>
        <label class="filter-option">
          <input type="checkbox" value="design" v-model="userNeeds" />
          <span>Thiết kế đồ họa</span>
        </label>
        <label class="filter-option">
          <input type="checkbox" value="programming" v-model="userNeeds" />
          <span>Lập trình</span>
        </label>
        <label class="filter-option">
          <input type="checkbox" value="multimedia" v-model="userNeeds" />
          <span>Giải trí đa phương tiện</span>
        </label>
      </div>
    </div>

    <!-- Rating Filter -->
    <div class="filter-group">
      <h5>Đánh Giá</h5>
      <div class="filter-options">
        <label class="filter-option rating-option" @click="setMinRating(5)">
          <div class="stars">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
          </div>
          <span>Chỉ 5 sao</span>
        </label>
        <label class="filter-option rating-option" @click="setMinRating(4)">
          <div class="stars">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-regular fa-star"></i>
          </div>
          <span>4 sao trở lên</span>
        </label>
        <label class="filter-option rating-option" @click="setMinRating(3)">
          <div class="stars">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-regular fa-star"></i>
            <i class="fa-regular fa-star"></i>
          </div>
          <span>3 sao trở lên</span>
        </label>
      </div>
    </div>

    <!-- Apply Filters Button -->
    <button class="apply-filters-btn" @click="applyFilters">
      Áp Dụng Bộ Lọc
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      minPrice: 0,
      maxPrice: 20000000,
      sortBy: "popular",
      userNeeds: [],
      minRating: 0,
    };
  },
  methods: {
    setMinRating(rating) {
      this.minRating = rating;
    },
    formatPrice(price) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    },
    applyFilters() {
      const filters = {
        minPrice: this.minPrice,
        maxPrice: this.maxPrice,
        sortBy: this.sortBy,
        userNeeds: this.userNeeds,
        minRating: this.minRating,
      };
      this.$emit("filter-applied", filters);
      // Cập nhật URL query parameters
      this.$router.push({
        query: {
          ...this.$route.query,
          minPrice: this.minPrice,
          maxPrice: this.maxPrice,
          sortBy: this.sortBy,
          userNeeds: this.userNeeds.join(","),
          minRating: this.minRating,
        },
      });
    },
  },
  mounted() {
    // Khôi phục trạng thái filter từ URL nếu có
    const query = this.$route.query;
    if (query.minPrice) this.minPrice = parseInt(query.minPrice);
    if (query.maxPrice) this.maxPrice = parseInt(query.maxPrice);
    if (query.sortBy) this.sortBy = query.sortBy;
    if (query.userNeeds) this.userNeeds = query.userNeeds.split(",");
    if (query.minRating) this.minRating = parseInt(query.minRating);
  },
};
</script>

<style lang="scss" scoped>
.product-filter {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  min-width: 280px;

  h4 {
    font-size: 18px;
    margin-bottom: 15px;
    color: #333;
  }

  .filter-group {
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;

    &:last-child {
      border-bottom: none;
    }

    h5 {
      font-size: 16px;
      margin-bottom: 10px;
      color: #555;
    }
  }

  .price-range {
    .slider-container {
      position: relative;
      height: 30px;
      margin-bottom: 10px;

      .price-slider {
        position: absolute;
        width: 100%;
        height: 5px;
        background: #ddd;
        top: 50%;
        transform: translateY(-50%);
        appearance: none;
        pointer-events: none;

        &::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--yellow);
          cursor: pointer;
          pointer-events: auto;
          border: 2px solid #fff;
        }
      }
    }

    .price-inputs {
      display: flex;
      align-items: center;
      gap: 8px;

      .price-input {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 3px 8px;

        input {
          width: 100%;
          min-width: 0;
          border: none;
          outline: none;
          padding: 0;
          text-align: right;
          font-size: 13px;
        }

        span {
          color: #666;
          margin-left: 3px;
          font-weight: 500;
          white-space: nowrap;
        }
      }

      > span {
        color: #666;
      }
    }
  }

  .filter-options {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .filter-option {
      display: flex;
      align-items: center;
      cursor: pointer;

      input {
        margin-right: 8px;
      }

      &.rating-option {
        .stars {
          margin-right: 8px;
          i {
            color: var(--yellow);
            font-size: 14px;
          }
        }
      }
    }
  }

  .apply-filters-btn {
    background-color: var(--yellow);
    color: #000;
    border: none;
    border-radius: 4px;
    padding: 10px 15px;
    font-weight: 500;
    width: 100%;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      opacity: 0.9;
    }
  }
}
</style>
