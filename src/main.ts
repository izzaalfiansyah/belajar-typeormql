import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { router } from "./routes";
import { store } from "./store";

import "virtual:uno.css";

new Vue({
  render: (h) => h(App),
  vuetify,
  router,
  store,
}).$mount("#app");
