import { createRouter, createWebHistory } from "vue-router";

const routes = [
  // Navbar Links
  {
    name: "home",
    path: "/",
    component: () => import("@/views/HomeView"),
    meta: {
      title: "Electbox - ELECTBOX",
    },
  },
  {
    name: "catalog",
    path: "/catalog",
    component: () => import("@/views/CatalogView.vue"),
    meta: {
      title: "Electbox - Catalog",
    },
  },
  {
    name: "contact",
    path: "/contact",
    component: () => import("@/views/ContactView.vue"),
    meta: {
      title: "Electbox - Contact Us",
    },
  },
  // Blog Routes
  {
    name: "blog",
    path: "/blog",
    component: () => import("@/views/BlogView.vue"),
    meta: {
      title: "Electbox - Blog",
    },
  },
  {
    name: "blog-page",
    path: "/blog/:id/:description",
    component: () => import("@/components/Blog/BlogPage"),
    meta: {
      title: "Electbox - BLOG",
    },
  },
  {
    name: "search",
    path: "/search",
    component: () => import("@/views/SearchView.vue"),
    props: (route) => ({ query: route.query.q }),
    meta: {
      title: "Electbox - Search",
    },
  },
  // Middle Navbar Icon Components
  {
    name: "cart",
    path: "/My-Cart",
    component: () => import("@/views/MyCart.vue"),
    meta: {
      title: "Electbox - My Cart",
    },
  },
  // Checkout & Order Confirmation Routes
  {
    name: "checkout",
    path: "/checkout",
    component: () => import("@/views/CheckoutView.vue"),
    meta: {
      title: "Electbox - Checkout",
    },
  },
  {
    name: "orderConfirmation",
    path: "/order-confirmation/:orderId",
    component: () => import("@/views/OrderConfirmation.vue"),
    meta: {
      title: "Electbox - Order Confirmation",
    },
  },
  {
    name: "profile",
    path: "/profile",
    component: () => import("@/views/AccountView.vue"),
    meta: {
      title: "Electbox - Login Account",
    },
  },
  {
    name: "profile-page",
    path: "/profile-page",
    component: () => import("@/views/AccountView.vue"),
    meta: {
      title: "Electbox - Profile",
    },
  },
  {
    name: "sign-up",
    path: "/sign-up",
    component: () => import("@/views/SignUp.vue"),
    meta: {
      title: "Electbox - Register Account",
    },
  },
  {
    name: "wishlist",
    path: "/wishlist",
    component: () => import("@/components/Wishlist/WishlistView.vue"),
    meta: {
      title: "Electbox - Wishlist",
    },
  },
  {
    name: "compare",
    path: "/compare",
    component: () => import("@/components/Compare/CompareView.vue"),
    meta: {
      title: "Electbox - Comparison",
    },
  },
  {
    name: "product",
    path: "/product/:id/:description",
    component: () => import("@/views/ProductDetails.vue"),
    meta: {
      title: "Electbox - Product Details",
    },
  },
  // Start Footer Links Till the end
  {
    name: "footer-link",
    path: "/informations/:name",
    component: () => import("@/components/Footer/DynamicLinks"),
    meta: {
      title: "Electbox - Informations",
    },
  },
  // 404 Page
  {
    name: "NotFound",
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/NotFound"),
    meta: {
      title: "404-NotFound",
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  // always scroll to top
  scrollBehavior() {
    return { top: 0 };
  },
});
// Change The Page Title Dynamically
router.beforeEach((to) => {
  document.title = to.meta.title;
});

export default router;
