<template>
  <div class="checkout-view">
    <h2 class="header">Checkout</h2>
    <div class="checkout-content">
      <div class="checkout-info">
        <BillingForm 
          ref="billingForm"
          @validation-change="updateFormValidity"
        />
        
        <ShippingForm
          @method-change="updateShipping"
        />
        
        <PaymentForm
          ref="paymentForm"
          @validation-change="updateFormValidity"
          @method-change="updatePaymentMethod"
        />
      </div>
      
      <OrderSummary
        :cart="cart"
        :shipping-cost="shippingCost"
        :is-valid="isFormValid"
        @place-order="placeOrder"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import BillingForm from "@/components/Checkout/BillingForm.vue";
import ShippingForm from "@/components/Checkout/ShippingForm.vue";
import PaymentForm from "@/components/Checkout/PaymentForm.vue";
import OrderSummary from "@/components/Checkout/OrderSummary.vue";

export default {
  name: 'CheckoutView',
  
  components: {
    BillingForm,
    ShippingForm,
    PaymentForm,
    OrderSummary
  },

  data() {
    return {
      shippingCost: 10,
      paymentMethod: 'creditCard',
      isFormValid: false
    };
  },

  computed: {
    ...mapState(["cart"])
  },

  methods: {
    updateShipping(shippingData) {
      this.shippingCost = shippingData.price;
    },

    updatePaymentMethod(method) {
      this.paymentMethod = method;
      this.$nextTick(() => {
        this.updateFormValidity();
      });
    },

    updateFormValidity() {
      const billingValid = this.$refs.billingForm?.isValid ?? false;
      const paymentValid = this.$refs.paymentForm?.isValid ?? true;
      this.isFormValid = billingValid && paymentValid;
    },

    placeOrder() {
      // Validate all fields before submitting
      const billingValid = this.$refs.billingForm.validateAllFields();
      const paymentValid = this.paymentMethod === 'creditCard' ? 
        this.$refs.paymentForm.validateAllFields() : true;

      if (!billingValid || !paymentValid) {
        alert("Please complete all required fields correctly");
        return;
      }

      // Get form data
      const billingData = this.$refs.billingForm.getBillingData();
      const paymentData = this.paymentMethod === 'creditCard' ? 
        this.$refs.paymentForm.getPaymentData() : { method: 'paypal' };
      
      // Create order object
      const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        billingInfo: billingData,
        shippingMethod: this.shippingMethod,
        paymentMethod: paymentData,
        items: this.cart,
        subtotal: this.subtotal,
        shippingCost: this.shippingCost,
        taxAmount: this.taxAmount,
        total: this.orderTotal
      };
      
      // Save order to localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      // Clear cart
      localStorage.setItem('cart', JSON.stringify([]));
      this.$store.commit('totalCart');
      
      // Redirect to order confirmation page
      this.$router.push({ 
        name: 'orderConfirmation',
        params: { orderId: order.id }
      });
    }
  },

  created() {
    // Redirect to home if cart is empty or null
    if (!this.cart || this.cart.length === 0) {
      this.$router.push({ name: 'home' });
    }
  }
};
</script>

<style lang="scss" scoped>
.checkout-view {
  padding: 30px 15px;
  color: var(--bg-color);
  
  .header {
    margin-bottom: 40px;
    font-size: 22px;
  }
  
  .checkout-content {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    
    @media (max-width: 991px) {
      flex-direction: column;
    }
    
    .checkout-info {
      flex: 2;
      min-width: 300px;
    }
  }
}
</style> 