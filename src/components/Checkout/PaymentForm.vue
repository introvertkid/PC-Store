<template>
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
</template>

<script>
export default {
  name: 'PaymentForm',
  
  data() {
    return {
      paymentMethod: 'creditCard',
      paymentInfo: {
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvv: ''
      },
      cardErrors: {
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvv: ''
      }
    };
  },

  methods: {
    validateField(field) {
      if (this.paymentMethod === 'creditCard') {
        switch(field) {
          case 'cardNumber':
            if (!this.paymentInfo.cardNumber) {
              this.cardErrors.cardNumber = "Card number is required";
            } else if (!/^\d{16}$/.test(this.paymentInfo.cardNumber.replace(/\D/g, ''))) {
              this.cardErrors.cardNumber = "Please enter a valid 16-digit card number";
            } else {
              this.cardErrors.cardNumber = "";
            }
            break;
          case 'cardName':
            this.cardErrors.cardName = this.paymentInfo.cardName ? "" : "Name on card is required";
            break;
          case 'expiry':
            if (!this.paymentInfo.expiry) {
              this.cardErrors.expiry = "Expiry date is required";
            } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(this.paymentInfo.expiry)) {
              this.cardErrors.expiry = "Please enter a valid date (MM/YY)";
            } else {
              this.cardErrors.expiry = "";
            }
            break;
          case 'cvv':
            if (!this.paymentInfo.cvv) {
              this.cardErrors.cvv = "CVV is required";
            } else if (!/^\d{3,4}$/.test(this.paymentInfo.cvv)) {
              this.cardErrors.cvv = "Please enter a valid CVV";
            } else {
              this.cardErrors.cvv = "";
            }
            break;
        }
      }
      this.$emit('validation-change', this.isValid);
    },

    validateAllFields() {
      if (this.paymentMethod === 'creditCard') {
        ['cardNumber', 'cardName', 'expiry', 'cvv'].forEach(field => this.validateField(field));
      }
      return this.isValid;
    },

    getPaymentData() {
      return {
        method: this.paymentMethod,
        info: this.paymentMethod === 'creditCard' ? this.paymentInfo : null
      };
    }
  },

  computed: {
    isValid() {
      if (this.paymentMethod === 'creditCard') {
        return !Object.values(this.cardErrors).some(error => error !== "") &&
          Object.values(this.paymentInfo).every(value => value !== "");
      }
      return true;
    }
  },

  watch: {
    paymentMethod(newMethod) {
      if (newMethod === 'creditCard') {
        this.$nextTick(() => {
          this.validateAllFields();
        });
      }
      this.$emit('method-change', newMethod);
    }
  }
};
</script>

<style lang="scss" scoped>
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
        }
      }
    }
  }
}
</style> 