<template>
  <div id="app">
    <div>
      <img alt="Vue logo" src="./assets/logo.png" />
      <p>{{ walletAddress }}</p>
      <p>所持数は {{ howmany }} TCKMです。</p>
    </div>
    <div v-if="load">
      <div v-if="howmany > 0">
        この文章はトークンを所持している人のみ表示されます。
      </div>
      <div v-else>
        この文章はトークンを所持していない人のみ表示されます。
      </div>
    </div>
  </div>
</template>

<script>
import Web3 from "web3";

export default {
  name: "App",
  components: {},
  data: () => ({
    walletAddress: null,
    howmany: null,
    load: false,
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
    const web3 = new Web3();
    web3.setProvider(
      new web3.providers.HttpProvider(
        "https://ropsten.infura.io/v3/674fa8842b484b24987e1267a15f06cc"
      )
    );
    const WALLET_ADDRESS = this.walletAddress;
    const CONTRACT_ADDRESS = "0xc2fdf34114fccB32dF11f0852F61b9165Ec872fF";
    let minABI = [
      {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [{ name: "", type: "uint8" }],
        type: "function",
      },
    ];
    const contract = new web3.eth.Contract(minABI, CONTRACT_ADDRESS);
    contract.methods
      .balanceOf(WALLET_ADDRESS)
      .call()
      .then((res) => {
        contract.methods
          .decimals()
          .call()
          .then((hes) => {
            console.log(hes);
            console.log(res / 10 ** hes);
            this.howmany = res / 10 ** hes;
            this.load = true;
          });
      });
  },
  methods: {
    handleEthereum: () => {
      const { ethereum } = window;
      if (ethereum && ethereum.isMetaMask) {
        // console.log("Ethereum successfully detected!");
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
