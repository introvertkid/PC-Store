<template>
  <div class="shipping-method">
    <h3>Shipping Method</h3>
    <div class="shipping-options">
      <div class="shipping-option">
        <label>
          <input
            type="radio"
            name="shipping"
            value="standard"
            v-model="selectedMethod"
            @change="updateShippingMethod"
          />
          <span class="shipping-info">
            <span class="name">Standard Shipping (5-7 business days)</span>
            <span class="price">{{ formatPrice(standardPrice) }}</span>
          </span>
        </label>
      </div>
      <div class="shipping-option">
        <label>
          <input
            type="radio"
            name="shipping"
            value="express"
            v-model="selectedMethod"
            @change="updateShippingMethod"
          />
          <span class="shipping-info">
            <span class="name">Express Shipping (2-3 business days)</span>
            <span class="price">{{ formatPrice(expressPrice) }}</span>
          </span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { formatPrice } from "@/utils/currency.js";

export default {
  name: "ShippingForm",

  data() {
    return {
      selectedMethod: "standard",
      standardPrice: 10,
      expressPrice: 25,
    };
  },

  watch: {
    selectedMethod(newMethod) {
      this.$emit("method-change", {
        method: newMethod,
        price:
          newMethod === "standard" ? this.standardPrice : this.expressPrice,
      });
    },
  },

  created() {
    // Emit initial shipping method and price
    this.$emit("method-change", {
      method: this.selectedMethod,
      price: this.standardPrice,
    });
  },

  methods: {
    formatPrice,
    updateShippingMethod() {
      this.$emit("method-change", {
        method: this.selectedMethod,
        price:
          this.selectedMethod === "standard"
            ? this.standardPrice
            : this.expressPrice,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.shipping-method {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);

  h3 {
    font-size: 18px;
    margin-bottom: 20px;
    font-weight: 500;
    color: #333;
    position: relative;
    padding-bottom: 10px;

    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50px;
      height: 2px;
      background-color: var(--yellow);
    }
  }
}

.shipping-options {
  .shipping-option {
    margin-bottom: 15px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 6px;
    transition: all 0.2s ease;
    background-color: white;

    &:hover {
      border-color: var(--yellow);
    }

    &:has(input:checked) {
      border-color: var(--yellow);
      background-color: rgba(255, 215, 0, 0.05);
    }

    input[type="radio"] {
      accent-color: var(--yellow);
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    label {
      margin-left: 10px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      font-weight: 500;

      .price {
        margin-left: 10px;
        font-weight: 600;
        color: #333;
      }

      .time {
        margin-left: 5px;
        color: #666;
        font-size: 14px;
      }
    }
  }
}
</style>
