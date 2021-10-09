import { createApp } from "vue";
import App from "./App.vue";
import { vMask } from "@/vMask";
createApp(App)
    .directive("mask", vMask)
    .mount("#app");
