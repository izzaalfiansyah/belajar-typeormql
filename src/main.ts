import Vue, { provide } from "vue";
import App from "./App.vue";
import { vuetify } from "./plugins/vuetify";
import { router } from "./plugins/routes";
import { store } from "./plugins/store";

import "virtual:uno.css";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { apollo } from "./plugins/apollo";

new Vue({
  setup() {
    provide(DefaultApolloClient, apollo);
  },
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
