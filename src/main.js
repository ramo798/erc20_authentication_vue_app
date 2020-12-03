import Vue from "vue";
import App from "./App.vue";
// import Web3 from "web3";

// Vue.use(Web3);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
