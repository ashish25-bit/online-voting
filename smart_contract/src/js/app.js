App = {
  web3Provider: null,
  contracts: {},
  account: "0x0",

  init: async function () {
    if (window.ethereum) {
      await ethereum.enable();
    }

    return await App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== "undefined") {
      App.web3Provider = web3.currentProvider;
    }

    else {
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:7545"
      );
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Election.json", (election) => {
      App.contracts.Election = TruffleContract(election);
      App.contracts.Election.setProvider(App.web3Provider);
      return App.render();
    });
  },

  render: function () {
    let electionInstance;

    web3.eth.getCoinbase((err, account) => {
      if (err === null) {
        App.account = account;
        console.log(account);
      }
    });

    App.contracts.Election.deployed()
      .then((i) => {
        electionInstance = i;
        return electionInstance.candidateCount();
      })
      .then((cc) => {
        console.log(cc.toNumber());
      });
  },
};

window.addEventListener("load", function () {
  App.init();
});
