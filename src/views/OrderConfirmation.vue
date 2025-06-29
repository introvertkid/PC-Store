<template>
  <div class="order-confirmation">
    <div class="container" v-if="order">
      <div class="success-message">
        <div class="icon">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <h2>Thank You For Your Order!</h2>
        <p>Your order has been placed and is being processed.</p>
      </div>

      <div class="order-details">
        <div class="order-info">
          <h3>Order Information</h3>
          <div class="info-row">
            <span class="label">Order Number:</span>
            <span class="value">#{{ order.id }}</span>
          </div>
          <div class="info-row">
            <span class="label">Order Date:</span>
            <span class="value">{{ formatDate(order.date) }}</span>
          </div>
          <div class="info-row">
            <span class="label">Payment Method:</span>
            <span class="value">{{
              formatPaymentMethod(order.paymentMethod)
            }}</span>
          </div>
          <div class="info-row">
            <span class="label">Shipping Method:</span>
            <span class="value">{{
              formatShippingMethod(order.shippingMethod)
            }}</span>
          </div>
        </div>

        <div class="order-address">
          <h3>Shipping Address</h3>
          <div class="address">
            <p>
              {{ order.billingInfo.firstName }} {{ order.billingInfo.lastName }}
            </p>
            <p>{{ order.billingInfo.address }}</p>
            <p>
              {{ order.billingInfo.city }}, {{ order.billingInfo.postalCode }}
            </p>
            <p>{{ order.billingInfo.country }}</p>
            <p>{{ order.billingInfo.phone }}</p>
            <p>{{ order.billingInfo.email }}</p>
          </div>
        </div>
      </div>

      <div class="order-summary">
        <h3>Order Summary</h3>
        <div class="order-items">
          <div class="item-header">
            <div class="product">Product</div>
            <div class="price">Price</div>
            <div class="quantity">Quantity</div>
            <div class="total">Total</div>
          </div>
          <div class="item" v-for="(product, i) in order.items" :key="i">
            <div class="product">
              <div class="img">
                <img :src="product.firstImg" :alt="product.title" />
              </div>
              <div class="name">{{ product.title }}</div>
            </div>
            <div class="price">{{ formatPrice(calculatePrice(product)) }}</div>
            <div class="quantity">{{ product.count }}</div>
            <div class="total">
              {{ formatPrice(calculatePrice(product) * product.count) }}
            </div>
          </div>
        </div>

        <div class="order-totals">
          <div class="total-row">
            <span class="label">Subtotal:</span>
            <span class="value">{{ formatPrice(order.subtotal) }}</span>
          </div>
          <div class="total-row">
            <span class="label">Shipping:</span>
            <span class="value">{{ formatPrice(order.shippingCost) }}</span>
          </div>
          <div class="total-row">
            <span class="label">Tax:</span>
            <span class="value">{{ formatPrice(order.taxAmount) }}</span>
          </div>
          <div class="total-row grand-total">
            <span class="label">Grand Total:</span>
            <span class="value">{{ formatPrice(order.total) }}</span>
          </div>
        </div>
      </div>

      <div class="actions">
        <router-link to="/catalog" class="btn">Continue Shopping</router-link>
      </div>
    </div>

    <div class="not-found" v-else>
      <h2>Order Not Found</h2>
      <p>We couldn't find the order you're looking for.</p>
      <router-link to="/catalog" class="btn">Continue Shopping</router-link>
    </div>
  </div>
</template>

<script>
import { formatPrice } from "@/utils/currency.js";

export default {
  data() {
    return {
      order: null,
    };
  },
  mounted() {
    const orderId = parseInt(this.$route.params.orderId);
    if (orderId) {
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      this.order = orders.find((order) => order.id === orderId);
    }
  },
  methods: {
    formatPrice,
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    formatPaymentMethod(method) {
      if (method === "creditCard") {
        return "Credit/Debit Card";
      } else if (method === "paypal") {
        return "PayPal";
      }
      return method;
    },
    formatShippingMethod(method) {
      if (method === "standard") {
        return "Standard Shipping (3-7 business days)";
      } else if (method === "express") {
        return "Express Shipping (1-3 business days)";
      }
      return method;
    },
    calculatePrice(product) {
      if (
        !product ||
        typeof product.price !== "number" ||
        typeof product.discount !== "number"
      ) {
        return 0;
      }
      return Math.floor(
        product.price - (product.price * product.discount) / 100
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.order-confirmation {
  padding: 30px 15px;
  color: var(--bg-color);

  .container {
    max-width: 900px;
    margin: 0 auto;
  }

  .success-message {
    text-align: center;
    margin-bottom: 40px;

    .icon {
      font-size: 60px;
      color: #4caf50;
      margin-bottom: 20px;
    }

    h2 {
      font-size: 28px;
      margin-bottom: 10px;
    }

    p {
      font-size: 16px;
      color: #666;
    }
  }

  .order-details {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    margin-bottom: 30px;

    .order-info,
    .order-address {
      flex: 1;
      min-width: 250px;
      background-color: #f9f9f9;
      border-radius: 6px;
      padding: 20px;

      h3 {
        font-size: 18px;
        margin-bottom: 20px;
        font-weight: 500;
      }

      .info-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;

        .label {
          font-weight: 500;
        }
      }

      .address {
        p {
          margin-bottom: 5px;
        }
      }
    }
  }

  .order-summary {
    background-color: #f9f9f9;
    border-radius: 6px;
    padding: 20px;
    margin-bottom: 30px;

    h3 {
      font-size: 18px;
      margin-bottom: 20px;
      font-weight: 500;
    }

    .order-items {
      margin-bottom: 20px;

      .item-header {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        padding: 10px 0;
        font-weight: 500;
        border-bottom: 1px solid #ddd;

        @media (max-width: 767px) {
          display: none;
        }
      }

      .item {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        padding: 15px 0;
        border-bottom: 1px solid #eee;

        @media (max-width: 767px) {
          grid-template-columns: 1fr;
          gap: 10px;

          .price::before {
            content: "Price: ";
            font-weight: 500;
          }

          .quantity::before {
            content: "Quantity: ";
            font-weight: 500;
          }

          .total::before {
            content: "Total: ";
            font-weight: 500;
          }
        }

        .product {
          display: flex;
          align-items: center;

          .img {
            width: 60px;
            height: 60px;
            margin-right: 15px;

            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }

          .name {
            font-weight: 500;
          }
        }
      }
    }

    .order-totals {
      padding-top: 20px;

      .total-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;

        &.grand-total {
          font-weight: 700;
          font-size: 18px;
          padding-top: 10px;
          margin-top: 10px;
          border-top: 1px solid #ddd;
        }
      }
    }
  }

  .actions {
    text-align: center;
    margin-top: 40px;

    .btn {
      background-color: var(--bg-color);
      color: var(--yellow);
      padding: 12px 25px;
      border-radius: 6px;
      font-weight: 500;
      display: inline-block;

      &:hover {
        background-color: #000;
      }
    }
  }

  .not-found {
    text-align: center;
    padding: 50px 0;

    h2 {
      font-size: 24px;
      margin-bottom: 15px;
    }

    p {
      margin-bottom: 30px;
      color: #666;
    }

    .btn {
      background-color: var(--bg-color);
      color: var(--yellow);
      padding: 12px 25px;
      border-radius: 6px;
      font-weight: 500;
      display: inline-block;

      &:hover {
        background-color: #000;
      }
    }
  }
}
</style>
