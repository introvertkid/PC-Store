<template>
  <div class="billing-info">
    <h3>Billing Details</h3>
    <div class="form-group">
      <div class="form-row">
        <div class="form-col">
          <label for="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            v-model="billingData.firstName"
            @blur="validateField('firstName')"
            :class="{ 'invalid-input': formErrors.firstName }"
            required
          />
          <div class="error-message" v-if="formErrors.firstName">
            {{ formErrors.firstName }}
          </div>
        </div>
        <div class="form-col">
          <label for="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            v-model="billingData.lastName"
            @blur="validateField('lastName')"
            :class="{ 'invalid-input': formErrors.lastName }"
            required
          />
          <div class="error-message" v-if="formErrors.lastName">
            {{ formErrors.lastName }}
          </div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-col full">
          <label for="address">Address *</label>
          <input
            type="text"
            id="address"
            v-model="billingData.address"
            @blur="validateField('address')"
            :class="{ 'invalid-input': formErrors.address }"
            required
          />
          <div class="error-message" v-if="formErrors.address">
            {{ formErrors.address }}
          </div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-col">
          <label for="city">City / Town *</label>
          <input
            type="text"
            id="city"
            v-model="billingData.city"
            @blur="validateField('city')"
            :class="{ 'invalid-input': formErrors.city }"
            required
          />
          <div class="error-message" v-if="formErrors.city">
            {{ formErrors.city }}
          </div>
        </div>
        <div class="form-col">
          <label for="postalCode">Postal Code *</label>
          <input
            type="text"
            id="postalCode"
            v-model="billingData.postalCode"
            @blur="validateField('postalCode')"
            :class="{ 'invalid-input': formErrors.postalCode }"
            required
          />
          <div class="error-message" v-if="formErrors.postalCode">
            {{ formErrors.postalCode }}
          </div>
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
              :placeholder="billingData.country || 'Search country...'"
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
                <div
                  v-if="filteredCountries.length === 0"
                  class="dropdown-item no-results"
                >
                  No countries found
                </div>
              </div>
            </div>
            <div class="error-message" v-if="formErrors.country">
              {{ formErrors.country }}
            </div>
          </div>
        </div>
        <div class="form-col">
          <label for="phone">Phone *</label>
          <input
            type="tel"
            id="phone"
            v-model="billingData.phone"
            @blur="validateField('phone')"
            :class="{ 'invalid-input': formErrors.phone }"
            required
          />
          <div class="error-message" v-if="formErrors.phone">
            {{ formErrors.phone }}
          </div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-col full">
          <label for="email">Email Address *</label>
          <input
            type="email"
            id="email"
            v-model="billingData.email"
            @blur="validateField('email')"
            :class="{ 'invalid-input': formErrors.email }"
            required
          />
          <div class="error-message" v-if="formErrors.email">
            {{ formErrors.email }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { countries } from "@/constants/countries";

export default {
  name: "BillingForm",

  data() {
    return {
      billingData: {
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
        email: "",
      },
      formErrors: {
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
        email: "",
      },
      countrySearch: "",
      showCountryDropdown: false,
      filteredCountries: [...countries],
      countries,
    };
  },

  methods: {
    validateField(field) {
      switch (field) {
        case "firstName":
          this.formErrors.firstName = this.billingData.firstName
            ? ""
            : "First name is required";
          break;
        case "lastName":
          this.formErrors.lastName = this.billingData.lastName
            ? ""
            : "Last name is required";
          break;
        case "address":
          this.formErrors.address = this.billingData.address
            ? ""
            : "Address is required";
          break;
        case "city":
          this.formErrors.city = this.billingData.city
            ? ""
            : "City is required";
          break;
        case "postalCode":
          this.formErrors.postalCode = this.billingData.postalCode
            ? ""
            : "Postal code is required";
          break;
        case "country":
          this.formErrors.country = this.billingData.country
            ? ""
            : "Country is required";
          break;
        case "phone":
          if (!this.billingData.phone) {
            this.formErrors.phone = "Phone number is required";
          } else if (
            !/^\d{10,15}$/.test(this.billingData.phone.replace(/\D/g, ""))
          ) {
            this.formErrors.phone = "Please enter a valid phone number";
          } else {
            this.formErrors.phone = "";
          }
          break;
        case "email":
          if (!this.billingData.email) {
            this.formErrors.email = "Email is required";
          } else if (
            !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
              this.billingData.email
            )
          ) {
            this.formErrors.email = "Please enter a valid email address";
          } else {
            this.formErrors.email = "";
          }
          break;
      }
      this.$emit("validation-change", this.isValid);
    },

    countrySearchHandler() {
      this.filteredCountries = this.countries.filter((country) =>
        country.toLowerCase().includes(this.countrySearch.toLowerCase())
      );
    },

    selectCountry(country) {
      this.billingData.country = country;
      this.countrySearch = "";
      this.showCountryDropdown = false;
      this.validateField("country");
    },

    validateAllFields() {
      Object.keys(this.billingData).forEach((field) =>
        this.validateField(field)
      );
      return this.isValid;
    },

    getBillingData() {
      return this.billingData;
    },
  },

  computed: {
    isValid() {
      return (
        !Object.values(this.formErrors).some((error) => error !== "") &&
        Object.values(this.billingData).every((value) => value !== "")
      );
    },
  },

  mounted() {
    document.addEventListener("click", this.closeDropdown);
  },
};
</script>

<style lang="scss" scoped>
.billing-info {
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
          box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.15);
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

.searchable-select {
  position: relative;

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
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

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
</style>
