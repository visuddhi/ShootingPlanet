var account;
var accounts;

App = {
  web3Provider: null,
  contracts: {},

  init: async function() {

    
    // Load fighters
    $.getJSON('../fighters.json', function(data) {
      var fightersRow = $('#fightersRow');
      var fighterTemplate = $('#fighterTemplate');

      for (i = 0; i < data.length; i ++) {
        fighterTemplate.find('.panel-title').text(data[i].name);
        fighterTemplate.find('img').attr('src', data[i].picture);
        fighterTemplate.find('.fighterID').text(data[i].id);
        fighterTemplate.find('.creator').text(data[i].creator);
        fighterTemplate.find('.price').text(data[i].price);
        fighterTemplate.find('.ETHaddress').text(data[i].address);
        fightersRow.append(fighterTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
  // Modern dapp browsers...
  if (window.ethereum) {
       App.web3Provider = window.ethereum;
    try {
    // Request account access
      await window.ethereum.enable();
    } catch (error) {
      // User denied account access...
      console.error("User denied account access")
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    App.web3Provider = window.web3.currentProvider;
  }
  // If no injected web3 instance is detected, fall back to Ganache
  else {
    App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
  }
  web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    var self = this;

    // Instantiate Adoption with truffle-contract
    $.getJSON('Adoption.json', function(data) {
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);
      App.contracts.Adoption.setProvider(App.web3Provider);
      // Return current available fighters
      return App.markAdopted();
    });

    // Instantiate MetaCoin with truffle-contract
    $.getJSON('MetaCoin.json', function(data) {
      var MetaCoinArtifact = data;
      App.contracts.MetaCoin = TruffleContract(MetaCoinArtifact);
      App.contracts.MetaCoin.setProvider(App.web3Provider);
    });

    web3.eth.getAccounts(function(error, accs) {
      if (error) {
         console.log(error);
      }
      accounts = accs;
      account = accounts[0];
      self.refreshBalance();
    });



    return App.bindEvents();
  },

  bindEvents: function() {
   // $(document).on('click', '.send', App.transaction);
    $(document).on('click', '.btn-unlock', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance) {
    adoptionInstance = instance;

    return adoptionInstance.getAdopters.call();
  }).then(function(adopters) {
    //console.log(adopters);
    for (i = 0; i < adopters.length; i++) {
      if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
         $('.panel-fighter').eq(i).find('button').text('Sold').attr('disabled', true);
      }
      // Only for debugging purpose
      //$('.panel-fighter').eq(i).find('button').text('Buy').attr('disabled', false);
   }
   return adoptionInstance.IsAdressMatch.call();
      
  }).then(function(IfMatch) {
    //console.log(IfMatch);
    for (i = 1; i < 15; i++) {
      if (IfMatch[i] == true) {
        document.getElementById("SelectedFighter").options.add(new Option($('.panel-title').eq(i).text(),i));
       }
    }
  }
  
  ).catch(function(err) {
    console.log(err.message);
  });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var self = this;

    var fighterID = parseInt($(self).parent().find(".fighterID").text());

    var adoptionInstance;

    App.contracts.MetaCoin.deployed().then(function() {
    var amount = parseInt($(self).parent().find(".price").text());
    var receiver = $(self).parent().find(".ETHaddress").text()
    return App.transaction(amount,receiver,fighterID);
   });

   
  },

  transaction : function(amount,receiver,fighterID){
    var self = this;

    this.setStatus("Transaction in progress...");

    var meta;

    App.contracts.MetaCoin.deployed().then(function(instance){
        meta = instance;
      if (amount  < parseInt(document.getElementById("balance").innerHTML) )
      {
        meta.sendCoin(receiver, amount, {from : account});
        self.setStatus("Transaction complete!"+"to"+receiver+".Total amount: "+amount);
        App.refreshBalance();
        App.contracts.Adoption.deployed().then(function(instance) {
          adoptionInstance = instance;
          return adoptionInstance.adopt(fighterID);
         }).then(function() {
            return App.markAdopted();
           
          }).catch(function(err) {
            console.log(err.message);
          });
      }
      if (amount  > parseInt(document.getElementById("balance").innerHTML) )
      {
        self.setStatus("Insufficient balance. Transacation incomplete.");
      }
    }).catch(function(e){
        console.log(e.message);
        self.setStatus("Error in the trasaction!");
    });
},

  refreshBalance : function(){
    var self = this;
    
    var meta;
    App.contracts.MetaCoin.deployed().then(function(instance){
        meta = instance;
        return meta.getBalance.call(account,{from: account});
    }).then(function(value){
        var balance_element = document.getElementById("balance");
        balance_element.innerHTML = value.valueOf();
    }).catch(function(e){
        console.log(e);
        self.setStatus("Error in getting latest the balance!");
    });
},

setStatus: function (message){
  var status = document.getElementById("status");
  status.innerHTML = message;
}



};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
