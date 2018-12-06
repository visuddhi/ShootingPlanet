var ui = {};

ui.navigation = `
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#">Menu</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
    <div class="navbar-nav">
            <a class="nav-item nav-link" href="#" id="PlayGame" onclick="loadGame()">Play Game<span class="sr-only">(current)</span></a>
            <a class="nav-item nav-link" href="#" id="FighterShop" onclick="loadShop()">Market</a>
            <a class="nav-item nav-link" href="#" id="ChooseFighter" onclick="loadFighter()">Select Fighter</a>
            <a class="nav-item nav-link" href="#" id="SellFighter" onclick="loadSale()">DIY Fighter</a>
    </div>
  </div>
</nav>
`;

var target1     = document.getElementById('target1');
var target2     = document.getElementById('target2');
var target3     = document.getElementById('target3');
var target4     = document.getElementById('target4');
var navigation = document.getElementById('navigation');
navigation.innerHTML += ui.navigation;


var activeNavButton;

var loadGame = function(){
    target1.style.display = "";
    target2.style.display = "none";
    target3.style.display = "none";
    target4.style.display = "none";
};

var loadShop = function(){
    target2.style.display = "";
    target1.style.display = "none";
    target3.style.display = "none";
    target4.style.display = "none";
};

var loadFighter = function(){
    target3.style.display = "";
    target2.style.display = "none";
    target1.style.display = "none";
    target4.style.display = "none";
};

var loadSale = function(){
    target4.style.display = "";
    target1.style.display = "none";
    target2.style.display = "none";
    target3.style.display = "none";
};


