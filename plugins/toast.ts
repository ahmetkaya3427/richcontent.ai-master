import VueToastification, { useToast } from "vue-toastification";
import "@/assets/sneat/vendor/css/core.css";
import "@/assets/sneat/vendor/css/theme-default.css";
import "@/assets/sneat/css/demo.css";
import "@/assets/sneat/vendor/fonts/boxicons.css";
import "vue-toastification/dist/index.css";
import "@/assets/index.scss";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueToastification, {
    position: "bottom-right",
    timeout: 5000,
    draggable: true,
    draggablePercent: 0.6,
    hideProgressBar: true,
    icon: false,
    rtl: false,
    closeButton: false,
  });

  const toast = useToast();

  return {
    provide: { toast },
  };
});
