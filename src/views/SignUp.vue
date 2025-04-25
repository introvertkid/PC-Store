<template>
  <div class="account">
    <h2>Sign Up Page</h2>
    <div class="signup">
      <h4>Create Account</h4>
      <form @submit.prevent="handleSignUp">
        <div class="name">
          <div class="form-floating first">
            <input
              class="form-control"
              type="text"
              placeholder=" "
              v-model="customer.firstName"
              required
            />
            <label>First Name</label>
          </div>
          <div class="form-floating">
            <input
              class="form-control"
              type="text"
              placeholder=" "
              v-model="customer.lastName"
              required
            />
            <label>Last Name</label>
          </div>
        </div>

        <div class="form-floating">
          <input
            class="form-control"
            type="email"
            placeholder=" "
            v-model="customer.email"
            required
          />
          <label>Email</label>
        </div>
        <div class="form-floating">
          <input
            class="form-control"
            type="password"
            placeholder=" "
            v-model="customer.password"
            required
          />
          <label>Password</label>
        </div>
        <div class="form-floating">
          <input
            class="form-control"
            type="tel"
            placeholder=" "
            pattern="[0-9]{10}"
            v-model="customer.phoneNumber"
            required
          />
          <label>Phone Number</label>
        </div>

        <input
          class="submit"
          type="submit"
          value="SIGN UP"
          :disabled="isSubmitting"
        />
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p class="login">
          Already have an account?
          <router-link to="/profile-page" class="tologin">Login</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      customer: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
      },
      isSubmitting: false,
      errorMessage: "",
    };
  },
  methods: {
    async handleSignUp() {
      try {
        this.isSubmitting = true;
        this.errorMessage = "";

        const response = await axios.post(
          "/api/customers/signup",
          this.customer
        );

        if (response.data.success) {
          this.$router.push("/profile-page");
        } else {
          this.errorMessage =
            response.data.message || "An error occurred during registration.";
        }
      } catch (error) {
        console.error("Registration error:", error);
        this.errorMessage =
          error.response?.data?.message ||
          "An error occurred during registration.";
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.account {
  flex: 1;
  padding: 30px 15px;
  @media (max-width: 1199px) {
    width: 100%;
    padding: 30px 0;
  }
  h2 {
    font-size: 24px;
  }
  .signup {
    max-width: 55%;
    margin: 50px auto;
    background-color: white;
    padding: 30px;
    border-radius: 6px;
    @media (max-width: 1199px) {
      max-width: 100%;
    }
    h4 {
      text-align: center;
      font-size: 22px;
      margin-bottom: 25px;
    }
    .name {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 25px;
      @media (max-width: 576px) {
        grid-template-columns: 1fr;
      }
    }
    .form-floating {
      margin-bottom: 25px;
      .form-control {
        height: 44px;
        background-color: rgb(232, 240, 254);
        &:focus {
          border-color: #ced4da;
          box-shadow: none;
        }
      }
      label {
        color: grey;
        padding: 10px;
      }
    }
    .submit {
      display: block;
      margin: auto;
      margin-top: 25px;
      border: none;
      padding: 15px 20px;
      border-radius: 6px;
      background-color: rgb(232, 240, 254);
      transition: 0.3s;
      width: 100%;
      &:hover {
        background-color: var(--yellow);
      }
      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }
    .error-message {
      color: red;
      text-align: center;
      margin-top: 10px;
    }
    .login {
      margin-top: 15px;
      margin-bottom: 0;
      text-align: center;
      .tologin {
        cursor: pointer;
        &:hover {
          color: var(--yellow);
        }
      }
    }
  }
}
</style>
