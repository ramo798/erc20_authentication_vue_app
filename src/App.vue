<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <p>{{ walletAddress }}</p>
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    HelloWorld,
  },
  data: () => ({
    walletAddress: null,
  }),
  mounted() {
    if (window.ethereum) {
      this.walletAddress = this.handleEthereum();
    } else {
      window.addEventListener("ethereum#initialized", this.handleEthereum, {
        once: true,
      });
      setTimeout(this.handleEthereum, 3000);
    }
  },
  methods: {
    handleEthereum: () => {
      const { ethereum } = window;
      if (ethereum && ethereum.isMetaMask) {
        console.log("Ethereum successfully detected!");
        console.log(ethereum.selectedAddress);
        const myaddress = ethereum.selectedAddress;
        return myaddress;
      } else {
        console.log("Please install MetaMask!");
      }
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
