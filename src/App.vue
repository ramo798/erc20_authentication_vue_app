<template>
  <div id="app">
    <div>
      <img alt="Vue logo" src="./assets/logo.png" />
      <p>{{ walletAddress }}</p>
      <p>所持数は {{ howmany }} TCKMです。</p>
    </div>
    <div v-if="load">
      <div v-if="howmany > 0">
        <p>HELLO,WORLD!</p>
      </div>
      <div v-else>
        <p>You dont have token.</p>
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
    sec_load: false,
  }),
  mounted() {
    if (window.ethereum) {
      this.getAccount().then((res) => {
        this.walletAddress = res;
        this.getTokenBalance(res)
          .then((res) => {
            this.howmany = res;
          })
          .finally(() => {
            this.load = true;
          });
      });
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
        // console.log("Ethereum successfully detected!");
        console.log(ethereum.selectedAddress);
        const myaddress = ethereum.selectedAddress;
        return myaddress;
      } else {
        console.log("Please install MetaMask!");
      }
    },
    getAccount: async function() {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      // console.log(accounts);
      return accounts[0];
    },
    getTokenBalance: (address) => {
      const web3 = new Web3();
      web3.setProvider(
        new web3.providers.HttpProvider(
          "https://ropsten.infura.io/v3/674fa8842b484b24987e1267a15f06cc"
        )
      );
      const WALLET_ADDRESS = address;
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

      var balance_result = contract.methods
        .balanceOf(WALLET_ADDRESS)
        .call()
        .then((res) => {
          var balance = contract.methods
            .decimals()
            .call()
            .then((decimal) => {
              return res / 10 ** decimal;
            });
          return balance;
        })
        .then((balance) => {
          return balance;
        });
      return balance_result;
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
