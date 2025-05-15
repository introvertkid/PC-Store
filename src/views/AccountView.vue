<template>
  <div class="account">
    <h2 v-if="isLoggedIn">Welcome, {{ user.name }}</h2>
    <div v-if="isLoggedIn" class="profile">
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Joined:</strong> {{ user.joinedDate }}</p>
      <button @click="logout">Logout</button>
    </div>

    <div v-else>
      <h2>Profile Page</h2>
      <div class="login" v-if="currentStep === 'login'">
        <h4>Login</h4>
        <form @submit.prevent="handleLogin">
          <div class="form-floating first">
            <input
              class="form-control"
              type="email"
              placeholder=" "
              v-model="loginForm.email"
              required
            />
            <label>Email</label>
          </div>
          <div class="form-floating">
            <input
              class="form-control"
              type="password"
              placeholder=" "
              v-model="loginForm.password"
              required
            />
            <label>Password</label>
          </div>
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <span class="forgot-pw" @click="showForgotPassword"
            >Forgot Password?</span
          >
          <input
            class="submit"
            type="submit"
            value="LOGIN"
            :disabled="isLoading"
          />
          <p class="create-acc">
            Don't have an account?
            <router-link to="/sign-up" class="sign-up">Sign up</router-link>
          </p>
        </form>
      </div>

      <div class="login" v-if="currentStep === 'forgotPassword'">
        <h4>Forgot Password</h4>
        <form @submit.prevent="handleForgotPassword">
          <div class="form-floating first">
            <input
              class="form-control"
              type="email"
              placeholder=" "
              v-model="forgotPasswordForm.email"
              required
            />
            <label>Email</label>
          </div>
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <div class="form-actions">
            <button
              class="back-btn"
              type="button"
              @click="currentStep = 'login'"
            >
              Back
            </button>
            <input
              class="submit"
              type="submit"
              value="SEND CODE"
              :disabled="isLoading"
            />
          </div>
        </form>
      </div>

      <div class="login" v-if="currentStep === 'verifyCode'">
        <h4>Verification Code</h4>
        <p class="info-text">
          Please enter the 6-digit code sent to your email
        </p>
        <form @submit.prevent="handleVerifyCode">
          <div class="verification-code">
            <input
              v-for="(digit, index) in 6"
              :key="index"
              class="code-input"
              type="text"
              maxlength="1"
              v-model="verificationForm.code[index]"
              @input="focusNextInput(index)"
              @keydown.delete="handleBackspace(index, $event)"
              ref="codeInputs"
              pattern="[0-9]"
              inputmode="numeric"
              required
            />
          </div>
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <div class="resend-code">
            <span v-if="resendTimeout > 0"
              >Resend code in {{ resendTimeout }}s</span
            >
            <span v-else class="resend-link" @click="handleForgotPassword"
              >Resend code</span
            >
          </div>
          <div class="form-actions">
            <button
              class="back-btn"
              type="button"
              @click="currentStep = 'forgotPassword'"
            >
              Back
            </button>
            <input
              class="submit"
              type="submit"
              value="VERIFY"
              :disabled="isLoading || !isCodeComplete"
            />
          </div>
        </form>
      </div>

      <div class="login" v-if="currentStep === 'resetPassword'">
        <h4>Reset Password</h4>
        <form @submit.prevent="handleResetPassword">
          <div class="form-floating first">
            <input
              class="form-control"
              type="password"
              placeholder=" "
              v-model="resetPasswordForm.password"
              required
              minlength="8"
            />
            <label>New Password</label>
          </div>
          <div class="form-floating">
            <input
              class="form-control"
              type="password"
              placeholder=" "
              v-model="resetPasswordForm.confirmPassword"
              required
              minlength="8"
            />
            <label>Confirm Password</label>
          </div>
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <div class="form-actions">
            <button
              class="back-btn"
              type="button"
              @click="currentStep = 'verifyCode'"
            >
              Back
            </button>
            <input
              class="submit"
              type="submit"
              value="RESET PASSWORD"
              :disabled="isLoading"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      currentStep: "login",
      loginForm: {
        email: "",
        password: "",
      },
      forgotPasswordForm: {
        email: "",
      },
      verificationForm: {
        code: ["", "", "", "", "", ""],
      },
      resetPasswordForm: {
        password: "",
        confirmPassword: "",
      },
      isLoading: false,
      errorMessage: "",
      resendTimeout: 0,
      resendTimer: null,
    };
  },
  computed: {
    isCodeComplete() {
      return this.verificationForm.code.every((digit) => digit !== "");
    },
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    },
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    async handleLogin() {
      try {
        this.isLoading = true;
        this.errorMessage = "";

        const response = await axios.post(
          "/api/customers/login",
          this.loginForm
        );

        if (response.data.success) {
          localStorage.setItem("user", JSON.stringify(response.data.customer));
          this.$store.dispatch("login", response.data.customer); // Cập nhật trạng thái đăng nhập
          this.$router.push("/profile-page");
        } else {
          this.errorMessage =
            response.data.message || "An error occurred while connecting.";
        }
      } catch (error) {
        console.error("Connection error:", error);
        if (error.response?.status === 401) {
          this.errorMessage = "Incorrect email or password.";
        } else {
          this.errorMessage =
            error.response?.data?.message ||
            "An error occurred while connecting.";
        }
      } finally {
        this.isLoading = false;
      }
    },
    showForgotPassword() {
      this.currentStep = "forgotPassword";
      this.errorMessage = "";
    },
    async handleForgotPassword() {
      try {
        this.isLoading = true;
        this.errorMessage = "";

        const response = await axios.post("/api/customers/forgotPassword", {
          email: this.forgotPasswordForm.email,
        });

        if (response.data.success) {
          this.currentStep = "verifyCode";
          this.startResendTimeout();
        } else {
          this.errorMessage =
            response.data.message || "Failed to send verification code.";
        }
      } catch (error) {
        console.error("Forgot password error:", error);
        this.errorMessage =
          error.response?.data?.message ||
          "An error occurred while processing your request.";
      } finally {
        this.isLoading = false;
      }
    },
    startResendTimeout() {
      this.resendTimeout = 60;
      clearInterval(this.resendTimer);
      this.resendTimer = setInterval(() => {
        if (this.resendTimeout > 0) {
          this.resendTimeout--;
        } else {
          clearInterval(this.resendTimer);
        }
      }, 1000);
    },
    focusNextInput(index) {
      this.verificationForm.code[index] = this.verificationForm.code[
        index
      ].replace(/[^0-9]/g, "");

      if (this.verificationForm.code[index] && index < 5) {
        this.$refs.codeInputs[index + 1].focus();
      }
    },
    handleBackspace(index, event) {
      if (
        event.key === "Backspace" &&
        !this.verificationForm.code[index] &&
        index > 0
      ) {
        this.$refs.codeInputs[index - 1].focus();
      }
    },
    async handleVerifyCode() {
      try {
        this.isLoading = true;
        this.errorMessage = "";

        const verificationCode = this.verificationForm.code.join("");

        const response = await axios.post("/api/customers/verifyCode", {
          email: this.forgotPasswordForm.email,
          code: verificationCode,
        });

        if (response.data.success) {
          this.currentStep = "resetPassword";
        } else {
          this.errorMessage =
            response.data.message || "Invalid verification code.";
        }
      } catch (error) {
        console.error("Verification error:", error);
        this.errorMessage =
          error.response?.data?.message ||
          "An error occurred while verifying the code.";
      } finally {
        this.isLoading = false;
      }
    },
    async handleResetPassword() {
      if (
        this.resetPasswordForm.password !==
        this.resetPasswordForm.confirmPassword
      ) {
        this.errorMessage = "Passwords do not match.";
        return;
      }

      try {
        this.isLoading = true;
        this.errorMessage = "";

        const response = await axios.post("/api/customers/resetPassword", {
          email: this.forgotPasswordForm.email,
          password: this.resetPasswordForm.password,
        });

        if (response.data.success) {
          this.errorMessage = "";

          this.resetPasswordForm.password = "";
          this.resetPasswordForm.confirmPassword = "";
          this.currentStep = "login";
        } else {
          this.errorMessage =
            response.data.message || "Failed to reset password.";
        }
      } catch (error) {
        console.error("Password reset error:", error);
        this.errorMessage =
          error.response?.data?.message ||
          "An error occurred while resetting your password.";
      } finally {
        this.isLoading = false;
      }
    },
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/");
    },
  },
  beforeUnmount() {
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
    }
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
  .login {
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
    }
    .info-text {
      text-align: center;
      margin-bottom: 20px;
      color: #666;
    }
    .form-floating {
      &.first {
        margin-bottom: 25px;
      }
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
    .error-message {
      color: red;
      margin-top: 10px;
      text-align: center;
    }
    .forgot-pw {
      cursor: pointer;
      margin-top: 10px;
      display: inline-block;
      &:hover {
        color: var(--yellow);
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
    .create-acc {
      margin-top: 15px;
      margin-bottom: 0;
      text-align: center;
      .sign-up {
        cursor: pointer;
        &:hover {
          color: var(--yellow);
        }
      }
    }
    .verification-code {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin: 20px 0;

      .code-input {
        width: 40px;
        height: 50px;
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: rgb(232, 240, 254);

        &:focus {
          outline: none;
          border-color: var(--yellow);
        }
      }
    }
    .resend-code {
      text-align: center;
      margin-top: 15px;
      font-size: 14px;

      .resend-link {
        color: var(--yellow);
        cursor: pointer;
        text-decoration: underline;
      }
    }
    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 25px;

      .back-btn {
        flex: 1;
        padding: 15px 20px;
        border: none;
        border-radius: 6px;
        background-color: #eee;
        transition: 0.3s;

        &:hover {
          background-color: #ddd;
        }
      }

      .submit {
        flex: 2;
        margin-top: 0;
      }
    }
  }
  @media (max-width: 1199px) {
    flex-direction: column-reverse;
    padding: 30px 0;
  }
}
</style>
