<template>
  <div class="search-results">
    <h2>Search Results for "{{ query }}"</h2>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <div v-if="results.length" class="results-grid">
      <div v-for="product in results" :key="product.id" class="product-card">
        <!-- Display product information here -->
        <img :src="product.image_url" :alt="product.name" />
        <h3>{{ product.name }}</h3>
        <p>{{ product.price }}</p>
      </div>
    </div>
    <div v-else-if="!loading && !error">
      <p>No results found.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

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
      } catch (err) {
        this.error = "Failed to fetch search results.";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.search-results {
  padding: 20px;
}
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}
.product-card {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}
.product-card img {
  max-width: 100%;
  height: auto;
}
</style>
