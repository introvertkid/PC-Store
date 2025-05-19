<template>
  <div class="dropdown">
    <button
      class="btn btn-primary collapsed"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#collapseExample"
      aria-expanded="true"
      aria-controls="collapseExample"
    >
      SHOP BY CATEGORIES <i class="fa-solid fa-angle-up arrow-up"></i>
    </button>
    <div
      :class="`${
        this.$route.name === 'blog' || this.$route.name === 'blog-page'
          ? 'collapse holder'
          : 'collapse show holder'
      } ${this.$route.name === 'catalog' ? 'catalog-holder' : ''}`"
      id="collapseExample"
    >
      <div class="card card-body">
        <ul>
          <li
            v-for="(category, index) in categories"
            :key="index"
            @click="selectCategory(category)"
            :class="{ active: selectedCategoryId === category.id }"
          >
            <a>{{ category.name }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
export default {
  data() {
    return {
      categories: [
        { id: 1, name: "Computers & Laptops" },
        { id: 2, name: "Monitors & Displays" },
        { id: 3, name: "Printers & Scanners" },
        { id: 4, name: "Storage & Memory" },
        { id: 5, name: "Networking Equipment" },
        { id: 6, name: "Computer Accessories" },
        { id: 7, name: "Software & Security" },
        { id: 8, name: "Computer Parts" },
        { id: 9, name: "Peripherals" },
        { id: 10, name: "Smart Devices" },
      ],
      selectedCategoryId: null,
    };
  },
  computed: {
    isElectboxCatalogPage() {
      // Check if we're on the electbox catalog page (based on screenshot)
      return window.location.href.includes("electbox");
    },
  },
  methods: {
    // This method would fetch categories from the API in a real implementation
    fetchCategories() {
      // In a real application, this would be an API call:
      // axios.get('/api/categories')
      //   .then(response => {
      //     this.categories = response.data;
      //   })
      //   .catch(error => {
      //     console.error('Error fetching categories:', error);
      //   });
      // For now, we're using the hardcoded categories in data()
    },
    // Handle category selection
    selectCategory(category) {
      this.selectedCategoryId = category.id;
      // Emit an event that parent components can listen to
      this.$emit("category-selected", category);
      // Navigate to the products page with the selected category as a parameter
      // This assumes you have a route named 'catalog' that can accept a query parameter
      this.$router.push({
        name: "catalog",
        query: { category: category.id },
      });
    },
  },
  mounted() {
    // Initialize dropdown toggle behavior
    $(".dropdown button").on("click", () => {
      $("button i").toggleClass("arrow-up");
    });

    // Fetch categories when component is mounted
    this.fetchCategories();

    // Set the selected category based on the URL query parameter, if present
    if (this.$route.query.category) {
      this.selectedCategoryId = parseInt(this.$route.query.category);
    }
  },
};
</script>

<style lang="scss" scoped>
.dropdown {
  width: 100%;
  margin-bottom: 20px;
  max-width: 260px;
  
  button {
    width: 100%;
    font-size: 14px;
    color: black;
    background-color: var(--yellow);
    border: none;
    margin-top: 0;
    padding: 15px;
    font-weight: 500;
    border-radius: 6px 6px 0 0;
    text-align: left;
    position: relative;
    z-index: 101;
    i {
      float: right;
      transition: 0.3s;
      &.arrow-up {
        transform: rotate(180deg);
      }
    }
    &:hover {
      background-color: var(--yellow);
    }
    &:not(.collapsed) {
      background-color: var(--yellow) !important;
      border-radius: 6px 6px 0 0 !important;
    }
  }

  &.catalog-page-dropdown {
    button {
      margin-top: 0;
      border-radius: 6px 6px 0 0;
    }
  }

  .holder {
    transition: 0.8s;
    border-radius: 0 0 10px 10px;
    background-color: white;
    position: relative;
    z-index: 100;
    width: 100%;
    margin-top: -1px;

    &.catalog-holder {
      position: relative !important;
      left: 0 !important;
      width: 100% !important;
      max-width: 100%;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .card-body {
      margin-top: -20px;
      margin-bottom: 25px;
      border: none;
      padding: 20px 30px;
      ul {
        li {
          padding: 10px 0;
          border-bottom: 1px solid #d9d9d9;
          cursor: pointer;
          &:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }
          &:hover {
            a {
              color: var(--yellow);
            }
          }
          &.active a {
            color: var(--yellow);
            font-weight: 600;
          }
          a {
            color: #4c4c4c;
          }
        }
      }
    }
  }
  @media (max-width: 1199px) {
    max-width: 100%;
    
    button {
      margin-top: 0;
      border-radius: 0;
    }
    .holder {
      .card-body {
        margin-top: 0;
      }
    }
  }
}
</style>
