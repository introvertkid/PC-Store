<template>
  <div class="checkout-view">
    <h2 class="header">Checkout</h2>
    <div class="checkout-content">
      <div class="checkout-info">
        <div class="billing-info">
          <h3>Billing Details</h3>
          <div class="form-group">
            <div class="form-row">
              <div class="form-col">
                <label for="firstName">First Name *</label>
                <input 
                  type="text" 
                  id="firstName" 
                  v-model="billingInfo.firstName" 
                  @blur="validateField('firstName')"
                  :class="{ 'invalid-input': formErrors.firstName }"
                  required 
                />
                <div class="error-message" v-if="formErrors.firstName">{{ formErrors.firstName }}</div>
              </div>
              <div class="form-col">
                <label for="lastName">Last Name *</label>
                <input 
                  type="text" 
                  id="lastName" 
                  v-model="billingInfo.lastName" 
                  @blur="validateField('lastName')"
                  :class="{ 'invalid-input': formErrors.lastName }"
                  required 
                />
                <div class="error-message" v-if="formErrors.lastName">{{ formErrors.lastName }}</div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-col full">
                <label for="address">Address *</label>
                <input 
                  type="text" 
                  id="address" 
                  v-model="billingInfo.address" 
                  @blur="validateField('address')"
                  :class="{ 'invalid-input': formErrors.address }"
                  required 
                />
                <div class="error-message" v-if="formErrors.address">{{ formErrors.address }}</div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-col">
                <label for="city">City / Town *</label>
                <input 
                  type="text" 
                  id="city" 
                  v-model="billingInfo.city" 
                  @blur="validateField('city')"
                  :class="{ 'invalid-input': formErrors.city }"
                  required 
                />
                <div class="error-message" v-if="formErrors.city">{{ formErrors.city }}</div>
              </div>
              <div class="form-col">
                <label for="postalCode">Postal Code *</label>
                <input 
                  type="text" 
                  id="postalCode" 
                  v-model="billingInfo.postalCode" 
                  @blur="validateField('postalCode')"
                  :class="{ 'invalid-input': formErrors.postalCode }"
                  required 
                />
                <div class="error-message" v-if="formErrors.postalCode">{{ formErrors.postalCode }}</div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-col">
                <label for="countrySearch">Country *</label>
                <div class="searchable-select">
                  <input 
                    type="text" 
                    id="countrySearch" 
                    v-model="countrySearch" 
                    @focus="showCountryDropdown = true"
                    @blur="validateField('country')"
                    @input="countrySearchHandler"
                    :class="{ 'invalid-input': formErrors.country }"
                    :placeholder="billingInfo.country || 'Search country...'" 
                  />
                  <div class="dropdown-container" v-show="showCountryDropdown">
                    <div class="dropdown-list">
                      <div 
                        v-for="country in filteredCountries" 
                        :key="country" 
                        class="dropdown-item"
                        @click="selectCountry(country)"
                      >
                        {{ country }}
                      </div>
                      <div v-if="filteredCountries.length === 0" class="dropdown-item no-results">
                        No countries found
                      </div>
                    </div>
                  </div>
                  <div class="error-message" v-if="formErrors.country">{{ formErrors.country }}</div>
                </div>
              </div>
              <div class="form-col">
                <label for="phone">Phone *</label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="billingInfo.phone" 
                  @blur="validateField('phone')"
                  :class="{ 'invalid-input': formErrors.phone }"
                  required 
                />
                <div class="error-message" v-if="formErrors.phone">{{ formErrors.phone }}</div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-col full">
                <label for="email">Email Address *</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="billingInfo.email" 
                  @blur="validateField('email')" 
                  :class="{ 'invalid-input': formErrors.email }"
                  required 
                />
                <div class="error-message" v-if="formErrors.email">{{ formErrors.email }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="shipping-method">
          <h3>Shipping Method</h3>
          <div class="shipping-options">
            <div class="shipping-option">
              <input type="radio" id="standard" value="standard" v-model="shippingMethod" />
              <label for="standard">
                <span class="name">Standard Shipping</span>
                <span class="price">$10.00</span>
                <span class="time">(3-7 business days)</span>
              </label>
            </div>
            <div class="shipping-option">
              <input type="radio" id="express" value="express" v-model="shippingMethod" />
              <label for="express">
                <span class="name">Express Shipping</span>
                <span class="price">$25.00</span>
                <span class="time">(1-3 business days)</span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="payment-method">
          <h3>Payment Method</h3>
          <div class="payment-options">
            <div class="payment-option">
              <input type="radio" id="creditCard" value="creditCard" v-model="paymentMethod" />
              <label for="creditCard">Credit / Debit Card</label>
              <div class="payment-details" v-if="paymentMethod === 'creditCard'">
                <div class="form-row">
                  <div class="form-col full">
                    <label for="cardNumber">Card Number *</label>
                    <input 
                      type="text" 
                      id="cardNumber" 
                      v-model="paymentInfo.cardNumber" 
                      @blur="validateField('cardNumber')"
                      :class="{ 'invalid-input': cardErrors.cardNumber }"
                      required 
                      placeholder="1234 5678 9012 3456" 
                    />
                    <div class="error-message" v-if="cardErrors.cardNumber">{{ cardErrors.cardNumber }}</div>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-col">
                    <label for="cardName">Name on Card *</label>
                    <input 
                      type="text" 
                      id="cardName" 
                      v-model="paymentInfo.cardName" 
                      @blur="validateField('cardName')"
                      :class="{ 'invalid-input': cardErrors.cardName }"
                      required 
                    />
                    <div class="error-message" v-if="cardErrors.cardName">{{ cardErrors.cardName }}</div>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-col">
                    <label for="expiry">Expiry Date *</label>
                    <input 
                      type="text" 
                      id="expiry" 
                      v-model="paymentInfo.expiry" 
                      @blur="validateField('expiry')"
                      :class="{ 'invalid-input': cardErrors.expiry }"
                      required 
                      placeholder="MM/YY" 
                    />
                    <div class="error-message" v-if="cardErrors.expiry">{{ cardErrors.expiry }}</div>
                  </div>
                  <div class="form-col">
                    <label for="cvv">Security Code (CVV) *</label>
                    <input 
                      type="text" 
                      id="cvv" 
                      v-model="paymentInfo.cvv" 
                      @blur="validateField('cvv')"
                      :class="{ 'invalid-input': cardErrors.cvv }"
                      required 
                      placeholder="123" 
                    />
                    <div class="error-message" v-if="cardErrors.cvv">{{ cardErrors.cvv }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="payment-option">
              <input type="radio" id="paypal" value="paypal" v-model="paymentMethod" />
              <label for="paypal">PayPal</label>
              <div class="payment-details" v-if="paymentMethod === 'paypal'">
                <p>You will be redirected to PayPal to complete your payment.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="order-summary">
        <h3>Order Summary</h3>
        <div class="summary-items">
          <div class="item" v-for="(product, i) in cart" :key="product.id">
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
          <button class="place-order" @click="placeOrder" :disabled="!isFormValid">
            Place Order
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      billingInfo: {
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
        email: ""
      },
      formErrors: {
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
        email: ""
      },
      shippingMethod: "standard",
      paymentMethod: "creditCard",
      paymentInfo: {
        cardNumber: "",
        cardName: "",
        expiry: "",
        cvv: ""
      },
      cardErrors: {
        cardNumber: "",
        cardName: "",
        expiry: "",
        cvv: ""
      },
      taxRate: 8,
      countries: [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua & Barbuda", "Argentina", "Armenia", "Australia", "Austria", 
        "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", 
        "Bolivia", "Bosnia & Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", 
        "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", 
        "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", 
        "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", 
        "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", 
        "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", 
        "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", 
        "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", 
        "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", 
        "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", 
        "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", 
        "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", 
        "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts & Nevis", "Saint Lucia", "Saint Vincent & the Grenadines", "Samoa", 
        "San Marino", "Sao Tome & Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", 
        "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", 
        "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", 
        "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", 
        "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
      ],
      countrySearch: "",
      showCountryDropdown: false,
      filteredCountries: []
    };
  },
  computed: {
    ...mapState(["cart"]),
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
    shippingCost() {
      return this.shippingMethod === "standard" ? 10 : 25;
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
    },
    isFormValid() {
      // Kiểm tra tất cả form errors
      return !Object.values(this.formErrors).some(error => error !== "") &&
        this.billingInfo.firstName &&
        this.billingInfo.lastName &&
        this.billingInfo.address &&
        this.billingInfo.city &&
        this.billingInfo.postalCode &&
        this.billingInfo.country &&
        this.billingInfo.phone &&
        this.billingInfo.email &&
        this.validatePaymentInfo();
    }
  },
  methods: {
    calculatePrice(product) {
      return Math.floor(product.price - (product.price * product.discount) / 100) * product.count;
    },
    countrySearchHandler() {
      this.filteredCountries = this.countries.filter(country => 
        country.toLowerCase().includes(this.countrySearch.toLowerCase())
      );
    },
    selectCountry(country) {
      this.billingInfo.country = country;
      this.countrySearch = "";
      this.showCountryDropdown = false;
      this.validateField('country');
    },
    closeDropdown(e) {
      if (!e.target.closest('.searchable-select')) {
        this.showCountryDropdown = false;
      }
    },
    validateField(field) {
      switch(field) {
        case 'firstName':
          this.formErrors.firstName = this.billingInfo.firstName ? "" : "First name is required";
          break;
        case 'lastName':
          this.formErrors.lastName = this.billingInfo.lastName ? "" : "Last name is required";
          break;
        case 'address':
          this.formErrors.address = this.billingInfo.address ? "" : "Address is required";
          break;
        case 'city':
          this.formErrors.city = this.billingInfo.city ? "" : "City is required";
          break;
        case 'postalCode':
          this.formErrors.postalCode = this.billingInfo.postalCode ? "" : "Postal code is required";
          break;
        case 'country':
          this.formErrors.country = this.billingInfo.country ? "" : "Country is required";
          break;
        case 'phone':
          if (!this.billingInfo.phone) {
            this.formErrors.phone = "Phone number is required";
          } else if (!/^\d{10,15}$/.test(this.billingInfo.phone.replace(/\D/g, ''))) {
            this.formErrors.phone = "Please enter a valid phone number";
          } else {
            this.formErrors.phone = "";
          }
          break;
        case 'email':
          if (!this.billingInfo.email) {
            this.formErrors.email = "Email is required";
          } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.billingInfo.email)) {
            this.formErrors.email = "Please enter a valid email address";
          } else {
            this.formErrors.email = "";
          }
          break;
        case 'cardNumber':
          if (this.paymentMethod === 'creditCard') {
            if (!this.paymentInfo.cardNumber) {
              this.cardErrors.cardNumber = "Card number is required";
            } else if (!/^\d{16}$/.test(this.paymentInfo.cardNumber.replace(/\D/g, ''))) {
              this.cardErrors.cardNumber = "Please enter a valid 16-digit card number";
            } else {
              this.cardErrors.cardNumber = "";
            }
          }
          break;
        case 'cardName':
          if (this.paymentMethod === 'creditCard') {
            this.cardErrors.cardName = this.paymentInfo.cardName ? "" : "Name on card is required";
          }
          break;
        case 'expiry':
          if (this.paymentMethod === 'creditCard') {
            if (!this.paymentInfo.expiry) {
              this.cardErrors.expiry = "Expiry date is required";
            } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(this.paymentInfo.expiry)) {
              this.cardErrors.expiry = "Please enter a valid date (MM/YY)";
            } else {
              this.cardErrors.expiry = "";
            }
          }
          break;
        case 'cvv':
          if (this.paymentMethod === 'creditCard') {
            if (!this.paymentInfo.cvv) {
              this.cardErrors.cvv = "CVV is required";
            } else if (!/^\d{3,4}$/.test(this.paymentInfo.cvv)) {
              this.cardErrors.cvv = "Please enter a valid CVV";
            } else {
              this.cardErrors.cvv = "";
            }
          }
          break;
      }
    },
    validateAllFields() {
      // Validate all billing fields
      this.validateField('firstName');
      this.validateField('lastName');
      this.validateField('address');
      this.validateField('city');
      this.validateField('postalCode');
      this.validateField('country');
      this.validateField('phone');
      this.validateField('email');
      
      // Validate payment fields if credit card is selected
      if (this.paymentMethod === 'creditCard') {
        this.validateField('cardNumber');
        this.validateField('cardName');
        this.validateField('expiry');
        this.validateField('cvv');
      }
      
      return !Object.values(this.formErrors).some(error => error !== "") && 
             (this.paymentMethod !== 'creditCard' || !Object.values(this.cardErrors).some(error => error !== ""));
    },
    validatePaymentInfo() {
      if (this.paymentMethod === 'creditCard') {
        return this.paymentInfo.cardNumber && 
               this.paymentInfo.cardName && 
               this.paymentInfo.expiry && 
               this.paymentInfo.cvv;
      }
      return true;
    },
    placeOrder() {
      // Validate all fields before submitting
      if (!this.validateAllFields()) {
        alert("Please complete all required fields correctly");
        return;
      }
      
      // Create order object
      const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        billingInfo: this.billingInfo,
        shippingMethod: this.shippingMethod,
        paymentMethod: this.paymentMethod,
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
    this.filteredCountries = [...this.countries]; // Initialize filtered countries
  },
  mounted() {
    // Close dropdown when clicking outside
    document.addEventListener('click', this.closeDropdown);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeDropdown);
  }
}
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
      
      .billing-info,
      .shipping-method,
      .payment-method {
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 25px;
        margin-bottom: 20px;
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
      }
      
      .form-group {
        .form-row {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
          
          @media (max-width: 767px) {
            flex-direction: column;
            gap: 10px;
          }
          
          .form-col {
            flex: 1;
            
            &.full {
              flex: 0 0 100%;
            }
            
            label {
              display: block;
              margin-bottom: 8px;
              font-size: 14px;
              font-weight: 500;
              color: #444;
            }
            
            input, select {
              width: 100%;
              padding: 12px;
              border: 1px solid #ddd;
              border-radius: 6px;
              font-size: 14px;
              background-color: white;
              transition: all 0.2s ease;
              
              &:focus {
                outline: none;
                border-color: var(--yellow);
                box-shadow: 0 0 0 3px rgba(255,215,0,0.15);
              }
              
              &.invalid-input {
                border-color: #e53935;
                background-color: rgba(229, 57, 53, 0.05);
              }
            }
            
            .error-message {
              color: #e53935;
              font-size: 12px;
              margin-top: 5px;
              font-weight: 500;
            }
            
            .searchable-select {
              position: relative;
              
              input {
                width: 100%;
                padding: 12px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 14px;
                background-color: white;
                transition: all 0.2s ease;
                
                &:focus {
                  outline: none;
                  border-color: var(--yellow);
                  box-shadow: 0 0 0 3px rgba(255,215,0,0.15);
                }
                
                &.invalid-input {
                  border-color: #e53935;
                  background-color: rgba(229, 57, 53, 0.05);
                }
              }
              
              .dropdown-container {
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                max-height: 250px;
                overflow-y: auto;
                background-color: white;
                border: 1px solid #ddd;
                border-radius: 0 0 6px 6px;
                z-index: 100;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                
                .dropdown-list {
                  .dropdown-item {
                    padding: 10px 15px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    
                    &:hover {
                      background-color: #f5f5f5;
                    }
                    
                    &.no-results {
                      font-style: italic;
                      color: #999;
                      cursor: default;
                    }
                  }
                }
              }
            }
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
            background-color: rgba(255,215,0,0.05);
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
      
      .payment-options {
        .payment-option {
          margin-bottom: 15px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          transition: all 0.2s ease;
          background-color: white;
          
          &:hover {
            border-color: var(--yellow);
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          }
          
          &:has(input:checked) {
            border-color: var(--yellow);
            background-color: rgba(255,215,0,0.05);
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
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
            font-size: 15px;
          }
          
          .payment-details {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            
            p {
              color: #666;
              font-size: 14px;
            }
            
            .form-row {
              display: flex;
              gap: 15px;
              margin-bottom: 15px;
              
              @media (max-width: 767px) {
                flex-direction: column;
                gap: 10px;
              }
              
              .form-col {
                flex: 1;
                
                &.full {
                  flex: 0 0 100%;
                }
                
                label {
                  display: block;
                  margin-bottom: 8px;
                  font-size: 14px;
                  font-weight: 500;
                  color: #444;
                  
                  &::after {
                    content: " *";
                    color: #e53935;
                  }
                }
                
                input {
                  width: 100%;
                  padding: 14px;
                  border: 1px solid #ddd;
                  border-radius: 6px;
                  font-size: 14px;
                  transition: all 0.2s ease;
                  background-color: #fff;
                  
                  &::placeholder {
                    color: #aaa;
                  }
                  
                  &:focus {
                    outline: none;
                    border-color: var(--yellow);
                    box-shadow: 0 0 0 3px rgba(255,215,0,0.15);
                  }
                }
              }
            }
          }
        }
      }
    }
    
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
  }
}
</style> 