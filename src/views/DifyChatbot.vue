<template>
  <div></div>
</template>

<script>
export default {
  name: "DifyChatbot",
  mounted() {
    // Inject chatbot config
    const configScript = document.createElement("script");
    configScript.innerHTML = `
      window.difyChatbotConfig = {
        token: 'V50D1DZ2D0d37aFJ',
        baseUrl: 'http://localhost'
      };
    `;
    document.head.appendChild(configScript);

    // Load chatbot script
    const chatbotScript = document.createElement("script");
    chatbotScript.src = "http://localhost/embed.min.js";
    chatbotScript.id = "V50D1DZ2D0d37aFJ";
    chatbotScript.defer = true;
    document.head.appendChild(chatbotScript);

    // Add custom style
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
      #dify-chatbot-bubble-button {
        background-color: #1C64F2 !important;
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        z-index: 9999 !important;
      }
      #dify-chatbot-bubble-window {
        width: 24rem !important;
        height: 40rem !important;
        position: fixed !important;
        bottom: 80px !important;
        right: 20px !important;
        z-index: 9998 !important;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2) !important;
        border-radius: 1rem !important;
        overflow: hidden !important;
      }
    `;
    document.head.appendChild(styleTag);
  },
};
</script>
