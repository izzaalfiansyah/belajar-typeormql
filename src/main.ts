import Vue, { provide } from "vue";
import App from "./App.vue";
import { vuetify } from "./plugins/vuetify";
import { router } from "./plugins/routes";
import { store } from "./plugins/store";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { apollo } from "./plugins/apollo";

import "virtual:uno.css";

new Vue({
  setup() {
    provide(DefaultApolloClient, apollo);
  },
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
