<template>
  <div class="order-summary">
    <h3>Order Summary</h3>
    <div class="summary-items">
      <div class="item" v-for="product in cart" :key="product.id">
        <div class="product-info">
          <div class="img">
            <img :src="product.firstImg" :alt="product.title" />
          </div>
          <div class="details">
            <div class="name">{{ product.title }}</div>
            <div class="qty">Qty: {{ product.count }}</div>
          </div>
        </div>
        <div class="price">${{ calculatePrice(product).toFixed(2) }}</div>
      </div>
    </div>
    <div class="summary-total">
      <div class="line subtotal">
        <span>Subtotal</span>
        <span>${{ subtotal }}</span>
      </div>
      <div class="line shipping">
        <span>Shipping</span>
        <span>${{ shippingCost }}</span>
      </div>
      <div class="line tax">
        <span>Tax ({{ taxRate }}%)</span>
        <span>${{ taxAmount }}</span>
      </div>
      <div class="line total">
        <span>Total</span>
        <span>${{ orderTotal }}</span>
      </div>
    </div>
    <div class="summary-action">
      <button class="place-order" @click="$emit('place-order')" :disabled="!isValid">
        Place Order
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderSummary',
  
  props: {
    cart: {
      type: Array,
      required: true
    },
    shippingCost: {
      type: Number,
      required: true
    },
    isValid: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      taxRate: 8
    };
  },

  computed: {
    subtotal() {
      if (!this.cart || this.cart.length === 0) {
        return '0.00';
      }
      
      return this.cart
        .reduce(
          (total, product) => 
            total + this.calculatePrice(product),
          0
        )
        .toFixed(2);
    },

    taxAmount() {
      return ((parseFloat(this.subtotal) * this.taxRate) / 100).toFixed(2);
    },

    orderTotal() {
      return (
        parseFloat(this.subtotal) +
        parseFloat(this.shippingCost) +
        parseFloat(this.taxAmount)
      ).toFixed(2);
    }
  },

  methods: {
    calculatePrice(product) {
      return Math.floor(product.price - (product.price * product.discount) / 100) * product.count;
    }
  }
};
</script>

<style lang="scss" scoped>
.order-summary {
  flex: 1;
  min-width: 300px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 25px;
  align-self: flex-start;
  position: sticky;
  top: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);

  h3 {
    font-size: 18px;
    margin-bottom: 20px;
    font-weight: 500;
    color: #333;
    position: relative;
    padding-bottom: 10px;

    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50px;
      height: 2px;
      background-color: var(--yellow);
    }
  }

  .summary-items {
    margin-bottom: 20px;
    max-height: 300px;
    overflow-y: auto;

    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #eee;

      .product-info {
        display: flex;
        align-items: center;

        .img {
          width: 50px;
          height: 50px;
          margin-right: 10px;
          border-radius: 4px;
          overflow: hidden;
          background-color: white;
          padding: 2px;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }

        .details {
          .name {
            font-weight: 500;
            margin-bottom: 5px;
          }

          .qty {
            font-size: 14px;
            color: #666;
          }
        }
      }

      .price {
        font-weight: 500;
      }
    }
  }

  .summary-total {
    margin-bottom: 25px;
    padding: 15px;
    background-color: white;
    border-radius: 6px;

    .line {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;

      &.total {
        font-weight: 700;
        font-size: 18px;
        padding-top: 12px;
        margin-top: 12px;
        border-top: 1px solid #ddd;
        color: #333;
      }
    }
  }

  .summary-action {
    .place-order {
      width: 100%;
      padding: 16px;
      background-color: var(--bg-color);
      color: var(--yellow);
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      &:hover:not(:disabled) {
        background-color: #000;
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      }

      &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }
    }
  }
}
</style> 