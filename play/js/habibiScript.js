document.addEventListener('DOMContentLoaded', function() {
  // Do after the document fully loaded
});
// ===============================================================
// ================== SHOW/HIDE PAGES - ADMIN ====================
// ===============================================================
var adminCPItems = document.querySelector('.admin-cp-items');
var adminCPBtn = document.querySelector('.admin-cp-button');
adminCPBtn.addEventListener('click', function(){ adminCPItems.classList.toggle('hidden'); }, false);



// ---------------------- Pages ---------------------- //

// ------- AUTH / METAMASK (NOUVEAU) ------- //
var pageAuth = document.getElementById('pageAuth');
var connectWalletBtn = document.getElementById('connectWalletBtn');
var authStatusText = document.getElementById('authStatusText');
var installHint = document.getElementById('installHint');
var connectedInfo = document.getElementById('connectedInfo');
var connectedAddress = document.getElementById('connectedAddress');

// On réutilise les IDs existants si déjà déclarés dans ton script
var pageGameMenu = window.pageGameMenu || document.getElementById('pageGameMenu');
var pageSplash   = window.pageSplash   || document.getElementById('pageSplash');

function show(el){ if(el) el.style.display = 'block'; }
function hide(el){ if(el) el.style.display = 'none'; }

var auth = {
  address: null,
  hasProvider: function(){ return typeof window.ethereum !== 'undefined'; },

  showAuthPage: function(msg){
    if (msg && authStatusText) authStatusText.textContent = msg;
    show(pageAuth); 
    hide(pageGameMenu);
  },

  showMenu: function(){
    hide(pageAuth);
    show(pageGameMenu);
  },

setConnectedUI: function(addr){
  if (!connectedInfo || !connectedAddress) return;

  connectedAddress.textContent = addr.slice(0,6) + "..." + addr.slice(-4);
  connectedInfo.style.display = 'block';

  // >>> ICI <<<
  var menuWallet = document.getElementById('menuWallet');
  var menuWalletChip = document.getElementById('menuWalletChip');
  if (menuWallet) menuWallet.textContent = connectedAddress.textContent;
  if (menuWalletChip) menuWalletChip.style.display = 'block';

  if (authStatusText) authStatusText.textContent = 'Connected';
  if (installHint) installHint.style.display = 'none';
  if (connectWalletBtn){ connectWalletBtn.textContent = 'Connected'; connectWalletBtn.disabled = true; }
},


clearConnectedUI: function(){
  if (connectedInfo) connectedInfo.style.display = 'none';
  if (connectedAddress) connectedAddress.textContent = '';

  var menuWallet = document.getElementById('menuWallet');
  var menuWalletChip = document.getElementById('menuWalletChip');
  if (menuWallet) menuWallet.textContent = '';
  if (menuWalletChip) menuWalletChip.style.display = 'none';

  if (authStatusText) authStatusText.textContent = 'Please connect with MetaMask to continue.';
  if (installHint) installHint.style.display = 'none';
  if (connectWalletBtn){ connectWalletBtn.textContent = 'Connect with MetaMask'; connectWalletBtn.disabled = false; }
},



  connect: async function(){
    if (!auth.hasProvider()){
      if (installHint) installHint.style.display = 'block';
      auth.showAuthPage("MetaMask not detected. Please install it to continue.");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method:'eth_requestAccounts' });
      if (accounts && accounts.length){
        auth.address = accounts[0];
        auth.setConnectedUI(auth.address);
        auth.showMenu();
      } else {
        auth.clearConnectedUI();
        auth.showAuthPage("Please connect a wallet to continue.");
      }
    } catch (e){
      auth.clearConnectedUI();
      auth.showAuthPage("Connection was rejected. Please try again.");
    }
  },

  checkExisting: async function(){
    if (!auth.hasProvider()){
      if (installHint) installHint.style.display = 'block';
      auth.showAuthPage("MetaMask not detected. Please install it to continue.");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method:'eth_accounts' });
      if (accounts && accounts.length){
        auth.address = accounts[0];
        auth.setConnectedUI(auth.address);
        auth.showMenu();
      } else {
        auth.clearConnectedUI();
        auth.showAuthPage("Please connect with MetaMask to continue.");
      }
    } catch(e){
      auth.showAuthPage("Unable to verify wallet. Please try connecting.");
    }
  },

  listen: function(){
    if (!auth.hasProvider()) return;
    window.ethereum.on('accountsChanged', function(accounts){
      if (accounts && accounts.length){
        auth.address = accounts[0];
        auth.setConnectedUI(auth.address);
        auth.showMenu();
      } else {
        auth.address = null;
        auth.clearConnectedUI();
        auth.showAuthPage("Wallet disconnected. Please connect to continue.");
      }
    });
  }
};

if (connectWalletBtn){
  connectWalletBtn.addEventListener('click', function(){
    auth.connect();
  });
}


// --- Reward UI ---
var rewardSection   = document.getElementById('rewardSection');
var rewardInfo      = document.getElementById('rewardInfo');
var rewardPointsEl  = document.getElementById('rewardPoints');
var claimRewardBtn  = document.getElementById('claim-reward-btn');
var rewardStatus    = document.getElementById('rewardStatus');

// --- État reward ---
var mustClaimBeforeSubmit = false; // on force le "claim" avant submit si top1
var hasClaimed = false;            // passe à true quand claim OK


var menuWallet = document.getElementById('menuWallet');
if (menuWallet) menuWallet.textContent = connectedAddress.textContent;

// Splash Page
var pageSplash = document.querySelector('#pageSplash');
// --
var splashScreenTxt = document.querySelector('#splashScreenTxt');
var splashScreenLogo = document.querySelector('#splashScreenLogo');


// Play Delay Page
var pagePlayDelay = document.querySelector('#pagePlayDelay');
// --
var palyDelayCont = document.querySelector('#palyDelayCont');
var playDelayNum = document.querySelector('#playDelayNum');


// Play Area Page
var pagePlayArea = document.querySelector('#pagePlayArea');
// --
var gmStatsTimeProgress = document.querySelector('#gmStatsTimeProgress');
var gmStatsPauseBtn = document.querySelector('#gmStatsPauseBtn');
var gmStatsScore = document.querySelector('#gmStatsScore');
var gmStatsLvlNumb = document.querySelector('#gmStatsLvlNumb');
var gameSpace = document.querySelector('#gameSpace');
var gmStatsCurrentTapCount = document.querySelector('#gmStatsCurrentTapCount');
var gmStatsTotalTapCount = document.querySelector('#gmStatsTotalTapCount');

// Game Menu Page
var pageGameMenu = document.querySelector('#pageGameMenu');
// --
var newGameBtn = document.querySelector('#newGameBtn');
var highScoresBtn = document.querySelector('#highScoresBtn');
var aboutBtn = document.querySelector('#aboutBtn');

// Tutorial Page
var pageTutorial = document.querySelector('#pageTutorial');
// --
var tutPgStartGameBtn = document.querySelector('#tutPgStartGameBtn');


// Pause Menu Page
var pagePauseMenu = document.querySelector('#pagePauseMenu');
// --
var lvlPausedScore = document.querySelector('#lvlPausedScore');
var pmRstrtLvlBtn = document.querySelector('#pmRstrtLvlBtn');
var pmCntnuGmBtn = document.querySelector('#pmCntnuGmBtn');


// --
var lvlPssdTitle = document.querySelector('#lvlPssdTtl');
var lvlPssdScore = document.querySelector('#lvlPssdScore');
var lvlPssdBonusScore = document.querySelector('#lvlPssdBonusScore');
var lvlPssdContinueNextLvlBtn = document.querySelector('#lvlPssdContinueNextLvlBtn');


// You lost page
var pageYouLost = document.querySelector('#pageYouLost');
// --
var gameOverScore = document.querySelector('#game-over-score');
var lvlLostBestScore = document.querySelector('#lvlLostBestScore');
var lvlLostTtl = document.querySelector('#lvlLostTtl');
var lvlLostTryAgainBtn = document.querySelector('#lvlLostTryAgainBtn');
var lvlLostIcon = document.querySelector('#lvlLostIcon');


// High Score Page
var pageHighScore = document.querySelector('#pageHighScore');
// --
var lvlLostNewHighScore = document.querySelector('#lvlLostNewHighScore');


// About Page
var pageAbout = document.querySelector('#pageAbout');
// --
var abtPageBackBtn = document.querySelector('#abtPageBackBtn');


// ------- Show Hide Pages Control Panel ------- //
var playDelayPageToggle = document.getElementById('playDelayPageToggle');
var playAreaPageToggle = document.getElementById('playAreaPageToggle');
var gameMenuPageToggle = document.getElementById('gameMenuPageToggle');
var tutorialPageToggle = document.getElementById('tutorialPageToggle');
var pauseMenuPageToggle = document.getElementById('pauseMenuPageToggle');
var youLostPageToggle = document.getElementById('youLostPageToggle');
var highScorePageToggle = document.getElementById('highScorePageToggle');
var aboutPageToggle = document.getElementById('aboutPageToggle');
var splashPageToggle = document.getElementById('splashPageToggle');

var pagesTogglesArray = [
  playAreaPageToggle, gameMenuPageToggle, tutorialPageToggle, playDelayPageToggle,
  pauseMenuPageToggle,
  youLostPageToggle, highScorePageToggle, aboutPageToggle, splashPageToggle
]
var pagesArray = [
  pagePlayArea, pageGameMenu, pageTutorial, pagePlayDelay,
  pagePauseMenu,
  pageYouLost, pageHighScore, pageAbout, pageSplash
]

// show/hide pages if the checkbox is checked
togglePage = function(pageToggle, page) {
  if (pageToggle.checked) {
    toolsBox.showPage(page);
  } else {
    toolsBox.hidePage(page);
  }
}

// on click event to all toggles on the page to show/hide pages
for (var i = 0; i < pagesTogglesArray.length; i++) {
  pagesTogglesArray[i].addEventListener('click', function(){
    for (var i = 0; i < pagesTogglesArray.length; i++) {
      togglePage(pagesTogglesArray[i], pagesArray[i]);
    }
  }, false);
}
// ===============================================================
// ===============================================================


// ------------- GENERAL FUNCTIONS ------------- //
toolsBox = {
  generateUUID: function() { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  },

  delay: function(fun, delayTime) {
    var delayAction = setTimeout(fun, delayTime);
  },
  gnrtRndmNum: function(minNumb, maxNumb) { // generate random number in range
    return Math.floor(Math.random() * (maxNumb - minNumb + 1)) + minNumb;
  },
  showPage: function(page) {
    page.style.display = "block";
  },
  hidePage: function(page) {
    page.style.display = "none";
  },
  hideSplashScreen: function(){
    if (typeof splashScreenTxt !== 'undefined' && splashScreenTxt) splashScreenTxt.classList.add('fadeOut-animation');
    if (typeof splashScreenLogo !== 'undefined' && splashScreenLogo) splashScreenLogo.classList.add('fadeOut-animation');

    setTimeout(function(){
      hide(pageSplash);
      auth.showAuthPage();
      auth.checkExisting();
      auth.listen();
    }, 1500);
  },
  onClickNTouchstart: function(element, fun) { // add click and touchstart event listeners
    element.addEventListener('click', fun, false);
    element.addEventListener('touchstart', fun, false);
  },
  toggleAnimation: function(element, animationClass) { // add animation class and remove it when it's done (to enable repeating it)
    element.classList.add(animationClass);
    element.addEventListener('animationend', function() {
      element.classList.remove(animationClass);
    }, false);
  },
  windowSize: { // get the size of the page
    width: window.innerWidth || document.body.clientWidth,
    height: window.innerHeight || document.body.clientHeight
  },
  pagePlayDelay: {
    updateNumber: function() {
      toolsBox.toggleAnimation(playDelayNum, 'grow-animation');
      playDelayNum.innerHTML = parseInt(playDelayNum.innerHTML, 10) - 1;
    },
    start: function() { // start counting down
      toolsBox.toggleAnimation(playDelayNum, 'grow-animation');
      var timer = setInterval(function(){
        if (playDelayNum.innerHTML > 1) {
          audioPool.playSound(delayCount);
          toolsBox.pagePlayDelay.updateNumber();
        } else {
          clearInterval(timer);
          toolsBox.hidePage(pagePlayDelay);
          playDelayNum.innerHTML = 3;
        }
      },500);
    }
  },
  
 
}

const API_BASE = window.location.origin;


/*async function isTopScore(currentScore){
  try {
    const res = await fetch(`${API_BASE}/api/scores`, { method: "GET" });
    if (!res.ok) return false;

    const list = await res.json();
    if (!Array.isArray(list) || list.length === 0) {
      // Aucun score existant → tu es forcément top1
      return true;
    }

    // Cherche le max des scores existants
    let max = -Infinity;
    for (const s of list) {
      if (typeof s.score === "number" && s.score > max) max = s.score;
    }
    // Si ton score >= meilleur score actuel → gagnant
    return currentScore >= max;
  } catch(e){
    console.error("isTopScore() failed", e);
    return false;
  }
}*/

function shortAddr(addr){
  return addr ? addr.slice(0,6) + "..." + addr.slice(-4) : "";
}

async function claimReward(points){
  if (!window.ethereum) {
    throw new Error("MetaMask not available");
  }

  let recipient = auth && auth.address ? auth.address : null;
  if (!recipient) {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    recipient = (accounts && accounts[0]) || null;
  }
  if (!recipient) {
    throw new Error("No wallet connected");
  }

  // Log utile pour debug
    console.log("---------------------")
    console.log("Claiming reward:", { points, recipient });
    console.log("---------------------")

  // TODO: Remplacer ce placeholder par TON appel ABI:
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  console.log("Using address:", address);

  const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function submitScore(uint256 _points, string _levelId)"
  ];

  const contract = new ethers.Contract("0xcB00640bAE4f04af65913A89bD3Baf55533226DA", 
  ERC20_ABI, signer);

  console.log("Contract connected:", contract);

  console.log("recipient: " + recipient)
  console.log("points: " + points)

  const rewardAmount = await contract.submitScore(points, "level_1");
  console.log("Reward transaction sent:", rewardAmount);

  return Promise.resolve({ recipient });
}

function setLoseScreenTheme(isWin) {
  // Texte + icône
  if (isWin) {
    lvlLostTtl.textContent = "";
    // optionnel: si tu as une classe d’icône “trophy-icon”, décommente:
    // lvlLostIcon.classList.remove('you-lost-icon'); 
    // lvlLostIcon.classList.add('trophy-icon');
  } else {
    lvlLostTtl.textContent = "You Lost";
    // lvlLostIcon.classList.remove('trophy-icon');
    // lvlLostIcon.classList.add('you-lost-icon');
  }

  // Couleurs de fond
  // On enlève le rouge par défaut et on applique un vert (inline) si win.
  pageYouLost.classList.remove('rd-grdnt-bg');
  pageYouLost.classList.remove('blu-grdnt-bg'); // au cas où
  if (isWin) {
    // joli dégradé vert (ne dépend pas de ton CSS)
    pageYouLost.style.background = 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)';
  } else {
    // retour au style d’origine
    pageYouLost.style.background = '';
    pageYouLost.classList.add('rd-grdnt-bg');
  }
}

function resetRewardUI() {
  hasClaimed = false;
  mustClaimBeforeSubmit = false;
  if (rewardSection) rewardSection.style.display = 'none';
  if (rewardPointsEl) rewardPointsEl.textContent = '';
  if (rewardStatus) rewardStatus.textContent = '';
  $('#sbmt-score').attr('disabled', false).addClass('btn-blue');
}

async function endGameRewardFlow(){
  resetRewardUI(); // clean par défaut

  // Si pas de wallet (sécurité), pas de section reward ni de thème win
  if (!auth || !auth.address) {
    setLoseScreenTheme(false);
    return;
  }

  const score = gameEngine.score;
  //const top1  = await isTopScore(score);

  //if (top1) {
    mustClaimBeforeSubmit = true;

    // Thème VERT = victoire
    setLoseScreenTheme(true);

    if (rewardPointsEl) rewardPointsEl.textContent = String(score);
    if (rewardSection)  rewardSection.style.display = 'block';

    // Désactive le submit tant que pas "claim"
    $('#sbmt-score').attr('disabled', true).removeClass('btn-blue');

    if (claimRewardBtn) {
      claimRewardBtn.disabled = false;
      claimRewardBtn.onclick = async function(){
        if (!auth.address){
          if (rewardStatus) rewardStatus.textContent = 'Please connect MetaMask first.';
          return;
        }
        try {
          claimRewardBtn.disabled = true;
          if (rewardStatus) rewardStatus.textContent = 'Sending reward...';

          const { recipient } = await claimReward(score);

          hasClaimed = true;
          if (rewardStatus) rewardStatus.textContent = `Reward sent to ${shortAddr(recipient)} ✔`;
          $('#sbmt-score').attr('disabled', false).addClass('btn-blue');
          await new Promise(r => setTimeout(r, 3000)); // pause 10s
          location.reload(); 
        } catch(err){
          console.error('claimReward failed:', err);
          if (rewardStatus) rewardStatus.textContent = 'Failed to send reward. Try again.';
          claimRewardBtn.disabled = false;
        }
      };
    }
  /*} else {
    // Pas top1 → thème rouge classique + submit actif
    setLoseScreenTheme(false);
    $('#sbmt-score').attr('disabled', false).addClass('btn-blue');
  }*/
}




// ----------------------------------------------------------------- //
// -------------------- Tappable Circle Object -------------------- //

var circlesEngine = {
  create: function() {
    var element = document.createElement('div');
    element.id = toolsBox.generateUUID();

    setTimeout(function(){
      circlesEngine.remove(element, true);
    }, (gameEngine.circleDespawnTime));

    element.setAttribute('class', 'tpbl-circle c-blue good-circle');
    gameSpace.appendChild(element);
    toolsBox.onClickNTouchstart(element, function(){ // on click & touch start function
      gameEngine.goodCircleTap();
      gameEngine.updateCircleDespawnTime();
      circlesEngine.remove(element, false);
    });

    return element;
  },

  remove: function(circle, timePenalty)
  {
    if(circle != null && circle.parentNode != null)
    {
      circle.parentNode.removeChild(circle);
      circlesPosition[defaultGameValues.circle - 1].timeDespawn = Date.now();

      if(timePenalty === true && circle.className.includes(gameEngine.circleType.good))
      {

        gameEngine.resetCircleDespawnTime();
        gameEngine.resetBonusScore();
        gameEngine.lostLife();
      }

      circlesEngine.add();
     }
  },

  destroy: function(circle){ // destroy all the circles of a specific type
    // Convert the Node List into in Array and delete all the items in it
    Array.from(circle).forEach(function(element){
      element.parentNode.removeChild(element);
    });
  },

  setPosition: function(circle){ 
    circle.style.left = circlesPosition[defaultGameValues.circle].x;
    circle.style.top = circlesPosition[defaultGameValues.circle].y;
    circlesPosition[defaultGameValues.circle].timeSpawn = Date.now();
    defaultGameValues.circle++;
  },

  add: function() { // Add circles to the game space
    if(gameEngine.currentlyPlaying)
    {
      circle = circlesEngine.create();
      circlesEngine.setPosition(circle);
      circlesEngine.addWithDelay(i, circle); // add CSS animation class with delay
    }
  },

  addWithDelay: function(i, circle) { // add CSS class with delay
    setTimeout(function() {
      circle.classList.add('grow-animation');
      audioPool.playSound(circleAppear);
    }, i*50); // delay each using the index (i) * 50ms
  }
}


var circlesPosition = [
  { x:"555px", y:"138px", timeSpawn:null, timeDespawn:null},
  { x:"140px", y:"168px", timeSpawn:null, timeDespawn:null},
  { x:"344px", y:"391px", timeSpawn:null, timeDespawn:null},
  { x:"441px", y:"98px", timeSpawn:null, timeDespawn:null},
  { x:"85px", y:"112px", timeSpawn:null, timeDespawn:null},
  { x:"199px", y:"462px", timeSpawn:null, timeDespawn:null},
  { x:"490px", y:"400px", timeSpawn:null, timeDespawn:null},
  { x:"138px", y:"513px", timeSpawn:null, timeDespawn:null},
  { x:"534px", y:"70px", timeSpawn:null, timeDespawn:null},
  { x:"212px", y:"453px", timeSpawn:null, timeDespawn:null},
  { x:"178px", y:"343px", timeSpawn:null, timeDespawn:null},
  { x:"484px", y:"164px", timeSpawn:null, timeDespawn:null},
  { x:"104px", y:"170px", timeSpawn:null, timeDespawn:null},
  { x:"218px", y:"62px", timeSpawn:null, timeDespawn:null},
  { x:"262px", y:"341px", timeSpawn:null, timeDespawn:null},
  { x:"90px", y:"527px", timeSpawn:null, timeDespawn:null},
  { x:"239px", y:"526px", timeSpawn:null, timeDespawn:null},
  { x:"350px", y:"522px", timeSpawn:null, timeDespawn:null},
  { x:"62px", y:"318px", timeSpawn:null, timeDespawn:null},
  { x:"50px", y:"443px", timeSpawn:null, timeDespawn:null},
  { x:"293px", y:"522px", timeSpawn:null, timeDespawn:null},
  { x:"69px", y:"349px", timeSpawn:null, timeDespawn:null},
  { x:"191px", y:"450px", timeSpawn:null, timeDespawn:null},
  { x:"282px", y:"59px", timeSpawn:null, timeDespawn:null},
  { x:"123px", y:"523px", timeSpawn:null, timeDespawn:null},
  { x:"156px", y:"313px", timeSpawn:null, timeDespawn:null},
  { x:"236px", y:"309px", timeSpawn:null, timeDespawn:null},
  { x:"333px", y:"129px", timeSpawn:null, timeDespawn:null},
  { x:"388px", y:"502px", timeSpawn:null, timeDespawn:null},
  { x:"283px", y:"237px", timeSpawn:null, timeDespawn:null},
  { x:"200px", y:"449px", timeSpawn:null, timeDespawn:null},
  { x:"312px", y:"206px", timeSpawn:null, timeDespawn:null},
  { x:"413px", y:"102px", timeSpawn:null, timeDespawn:null},
  { x:"536px", y:"500px", timeSpawn:null, timeDespawn:null},
  { x:"173px", y:"234px", timeSpawn:null, timeDespawn:null},
  { x:"331px", y:"105px", timeSpawn:null, timeDespawn:null},
  { x:"479px", y:"394px", timeSpawn:null, timeDespawn:null},
  { x:"524px", y:"445px", timeSpawn:null, timeDespawn:null},
  { x:"438px", y:"77px", timeSpawn:null, timeDespawn:null},
  { x:"305px", y:"107px", timeSpawn:null, timeDespawn:null},
  { x:"439px", y:"352px", timeSpawn:null, timeDespawn:null},
  { x:"132px", y:"306px", timeSpawn:null, timeDespawn:null},
  { x:"540px", y:"421px", timeSpawn:null, timeDespawn:null},
  { x:"248px", y:"286px", timeSpawn:null, timeDespawn:null},
  { x:"516px", y:"222px", timeSpawn:null, timeDespawn:null},
  { x:"499px", y:"437px", timeSpawn:null, timeDespawn:null},
  { x:"415px", y:"143px", timeSpawn:null, timeDespawn:null},
  { x:"47px", y:"100px", timeSpawn:null, timeDespawn:null},
  { x:"541px", y:"349px", timeSpawn:null, timeDespawn:null},
  { x:"306px", y:"392px", timeSpawn:null, timeDespawn:null},
  { x:"97px", y:"445px", timeSpawn:null, timeDespawn:null},
  { x:"307px", y:"494px", timeSpawn:null, timeDespawn:null},
  { x:"198px", y:"212px", timeSpawn:null, timeDespawn:null},
  { x:"140px", y:"214px", timeSpawn:null, timeDespawn:null},
  { x:"476px", y:"482px", timeSpawn:null, timeDespawn:null},
  { x:"287px", y:"527px", timeSpawn:null, timeDespawn:null},
  { x:"573px", y:"98px", timeSpawn:null, timeDespawn:null},
  { x:"166px", y:"522px", timeSpawn:null, timeDespawn:null},
  { x:"202px", y:"351px", timeSpawn:null, timeDespawn:null},
  { x:"581px", y:"44px", timeSpawn:null, timeDespawn:null},
  { x:"420px", y:"472px", timeSpawn:null, timeDespawn:null},
  { x:"503px", y:"219px", timeSpawn:null, timeDespawn:null},
  { x:"485px", y:"283px", timeSpawn:null, timeDespawn:null},
  { x:"517px", y:"192px", timeSpawn:null, timeDespawn:null},
  { x:"172px", y:"230px", timeSpawn:null, timeDespawn:null},
  { x:"154px", y:"347px", timeSpawn:null, timeDespawn:null},
  { x:"303px", y:"254px", timeSpawn:null, timeDespawn:null},
  { x:"455px", y:"336px", timeSpawn:null, timeDespawn:null},
  { x:"274px", y:"334px", timeSpawn:null, timeDespawn:null},
  { x:"546px", y:"455px", timeSpawn:null, timeDespawn:null},
  { x:"52px", y:"99px", timeSpawn:null, timeDespawn:null},
  { x:"64px", y:"348px", timeSpawn:null, timeDespawn:null},
  { x:"50px", y:"388px", timeSpawn:null, timeDespawn:null},
  { x:"429px", y:"348px", timeSpawn:null, timeDespawn:null},
  { x:"460px", y:"496px", timeSpawn:null, timeDespawn:null},
  { x:"212px", y:"120px", timeSpawn:null, timeDespawn:null},
  { x:"309px", y:"479px", timeSpawn:null, timeDespawn:null},
  { x:"507px", y:"350px", timeSpawn:null, timeDespawn:null},
  { x:"469px", y:"517px", timeSpawn:null, timeDespawn:null},
  { x:"99px", y:"352px", timeSpawn:null, timeDespawn:null},
  { x:"100px", y:"453px", timeSpawn:null, timeDespawn:null},
  { x:"107px", y:"108px", timeSpawn:null, timeDespawn:null},
  { x:"173px", y:"359px", timeSpawn:null, timeDespawn:null},
  { x:"450px", y:"273px", timeSpawn:null, timeDespawn:null},
  { x:"590px", y:"251px", timeSpawn:null, timeDespawn:null},
  { x:"98px", y:"466px", timeSpawn:null, timeDespawn:null},
  { x:"284px", y:"116px", timeSpawn:null, timeDespawn:null},
  { x:"580px", y:"101px", timeSpawn:null, timeDespawn:null},
  { x:"446px", y:"402px", timeSpawn:null, timeDespawn:null},
  { x:"419px", y:"276px", timeSpawn:null, timeDespawn:null},
  { x:"420px", y:"496px", timeSpawn:null, timeDespawn:null},
  { x:"570px", y:"273px", timeSpawn:null, timeDespawn:null},
  { x:"77px", y:"85px", timeSpawn:null, timeDespawn:null},
  { x:"533px", y:"452px", timeSpawn:null, timeDespawn:null},
  { x:"54px", y:"480px", timeSpawn:null, timeDespawn:null},
  { x:"551px", y:"453px", timeSpawn:null, timeDespawn:null},
  { x:"109px", y:"402px", timeSpawn:null, timeDespawn:null},
  { x:"374px", y:"162px",  timeSpawn:null, timeDespawn:null}
]

// ----------------------------------------------------------------- //
// ---------------- End of / Tappable Circle Object ---------------- //
// ----------------------------------------------------------------- //

// ---------------------- Game Engine Object ---------------------- //
var defaultGameValues = {
  score:0,
  life: 3,
  circle: 0,
  circleDespawnTime: 2000
}

var gameEngine = { 
  
  circleDespawnTime : 2000,
  currentlyPlaying: false,
  life:3,
  circleType: {
    good: "good-circle",
    evil:"evil-circle"
  },
  chanceToHaveGoodCircle: 0.25,
  timePenalty: 8,
  score: 0,
  goodCirclesCount: 2,
  evilCirclesCount: 5,
  highestScore: 0,
  bonusScore: 0,

  spawnCircle: function(){
    var circleType = ".evil-circle";

      if(Math.random() <= gameEngine.chanceToHaveGoodCircle)
      {
        circleType = ".good-circle"
      }

      return circleType;
  },
  updateScore: function(amount) { //add amount to score
    if(amount < 0)
    {
      document.getElementById("gmStatsScore").innerHTML = "0";
      gameEngine.lostLife();
    }
    else
    {
      gameEngine.score = amount;
      gmStatsScore.innerHTML = gameEngine.score;
    }
  },
  lostLife: function()
  {
    if(gameEngine.life <= 0)
   {
     gameEngine.gameOver();
   }
    gameEngine.life--;
    document.getElementById("gmStatsCurrentLife").innerHTML = gameEngine.life;
  },

  updateCircleDespawnTime()
  {
    gameEngine.circleDespawnTime = defaultGameValues.circleDespawnTime - (gameEngine.bonusScore * 100);
  },

  resetCircleDespawnTime()
  {
    gameEngine.circleDespawnTime = defaultGameValues.circleDespawnTime;
  },

  updateBonusScore: function() {
    gameEngine.bonusScore++;
    document.getElementById("gmStatsBonus").innerHTML = gameEngine.bonusScore;
  },

  resetBonusScore: function(){
    gameEngine.bonusScore = 0;
    document.getElementById("gmStatsBonus").innerHTML = gameEngine.bonusScore;
  },
  
  resetSubmitScoreButton : function(){
    $('#sbmt-score').removeAttr("disabled");
    $('#sbmt-score').addClass("btn-blue");
  },

  resetCirclesPositionArray: function()
  {
    circlesPosition.forEach(circlePosition => {
      circlePosition.timeSpawn = null;
      circlePosition.timeDespawn = null;
    });
  },
  resetLife: function()
  {
    document.getElementById("gmStatsCurrentLife").innerHTML = "3";
    gameEngine.life = defaultGameValues.life;
  },

  reset: function() { // reset the level values from the levels engine to start a new game
    gameEngine.resetSubmitScoreButton();
    gameEngine.resetCirclesPositionArray();
    gameEngine.updateScore(defaultGameValues.score);
    gameEngine.resetLife();
    defaultGameValues.circle = 0;
    gameEngine.goodCirclesCount = defaultGameValues.goodCirclesCount;
    gameEngine.evilCirclesCount = defaultGameValues.evilCirclesCount;
  },
  start: function() {
    gameEngine.currentlyPlaying = true;
    // Inatial level setup & adding data to the game engine
    gameEngine.updateScore(gameEngine.score);
    gameEngine.goodCirclesCount = gameEngine.goodCirclesCount;
    gameEngine.evilCirclesCount = gameEngine.evilCirclesCount;
    
    console.log('Game Started! 🏁');
    // adding circles to the game space
    circlesEngine.add();
  },
  goodCircleTap: function() {
    var pts = (gameEngine.bonusScore === 0 ) ? 10 : gameEngine.bonusScore *10;
    gameEngine.updateBonusScore();
    gameEngine.updateScore(gameEngine.score + pts);
  },
  evilCircleTap: function() {
    gameEngine.resetBonusScore();
    gameEngine.updateScore(gameEngine.score-10);
    gameEngine.lostLife();
  },
  
  stop: function() { // stop the game and reset level values
    gameEngine.currentlyPlaying = false;
    console.log('game STOPPED!');
  },

  gameLost: function() {
    audioPool.playSound(levelLost);
    gameOverScore.innerHTML = gameEngine.score;
    toolsBox.hidePage(pagePlayArea);
    toolsBox.showPage(pageYouLost);
    gameEngine.stop();
endGameRewardFlow();

  },

  gameOver: function() { // tapping a red circle
    gameEngine.currentlyPlaying = false;
    console.log('You lost! 🐜');
    lvlLostTtl.innerHTML = "You Lost";
    if (lvlLostIcon.classList.contains('times-up-icon')) {
      lvlLostIcon.classList.remove('times-up-icon');
      lvlLostIcon.classList.add('you-lost-icon');
    }
    gameEngine.gameLost();
  },

  showBonusScore: function() {
    console.log('You got '
    + Math.round(timeEngine.timeLeft) * 10
    + " extra score because you finished "
    + timeEngine.timeLeft
    + " seconds before the time!" );
    gameEngine.updateBonusScore(Math.round(timeEngine.timeLeft, 10) * 10);
    if (gameEngine.bonusScore > 0) { // if theere is some bonus score show it on level passed page
      lvlPssdBonusScore.innerHTML = "Bonus +" + gameEngine.bonusScore;
    }
    gameEngine.score += gameEngine.bonusScore; // add the bonus score to the game score
  }
}

$("#sbmt-score").off('click').on('click', async function(){
  // Bloque si on exige le claim et qu'il n'a pas été fait
  if (mustClaimBeforeSubmit && !hasClaimed) {
    if (rewardStatus) rewardStatus.textContent = 'Please click "Send reward to wallet" first.';
    return;
  }

  showPopup();
  disableButton(this);

  const playerName = $("#name").val().trim() === "" ? "Undefined" : $("#name").val().trim();
  const clickedCirclesTime = collectClickedCirclesTime();

  try {
    const res = await fetch(`${API_BASE}/api/scores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        player: playerName,
        score: gameEngine.score,
        circleTime: clickedCirclesTime
      })
    });
    if (!res.ok) {
      console.log("Failed to save score", res.status);
    }
  } catch (e) {
    console.error("Error saving score", e);
  }
});



// -------------------------------------------- //
// ---------------- Audio Pool --------------- //

var audioPool = {
  sounds: [
    circleAppear = { sound: "circleAppear", preaload: true, volume: 1, loop: false },
    touchBlue = { sound: "touchBlue", preaload: true, volume: 0.5, loop: false },
    touchRed = { sound: "touchRed", preaload: true, volume: 1, loop: false },
    levelPassed = { sound: "levelPassed", preload: true, volume: 1, loop: false },
    levelLost = { sound: "levelLost", preload: true, volume: 1, loop: false },
    buttonTap = { sound: "buttonTap", preload: true, volume: 1, loop: false },
    delayCount = { sound: "delayCount", preload: true, volume: 1, loop: false },
    timeAlmostUp = { sound: "timeAlmostUp", preload: true, volume: 0.5, loop: true }
  ],
  createAudioPlayer: function(element) {
    element.audioPlayer = document.createElement('audio');

    mp3Source = document.createElement('source');
    oggSource = document.createElement('source');

    // Get the name of the sounds from the object inside the array
    mp3Link = "sounds/mp3/" + element.sound + ".mp3";
    oggLink = "sounds/ogg/" + element.sound + ".ogg";

    // Setting the attributes for the source elemnts
    mp3Source.setAttribute('type', 'audio/mpeg');
    oggSource.setAttribute('type','audio/ogg');
    mp3Source.setAttribute('src', mp3Link);
    oggSource.setAttribute('src', oggLink);

    // Appending the sources to the player, and appending the player to the page
    element.audioPlayer.appendChild(mp3Source);
    element.audioPlayer.appendChild(oggSource);
    document.body.appendChild(element.audioPlayer);

    element.audioPlayer.volume = element.volume; // setting the volume

    if (element.preload) {
      element.audioPlayer.load(); // preload the sound
    }
    if (element.loop) { // repeat sound
      element.audioPlayer.loop = true;
    }
  },
  addSounds: function() {
    // Create a player for each  sound
    for (var i = 0; i < audioPool.sounds.length; i++) {
      audioPool.createAudioPlayer(audioPool.sounds[i]);
    }
  },
  playSound: function(soundName) {
    soundName.audioPlayer.currentTime = 0;
    soundName.audioPlayer.play();
  },
  stopSound: function(soundName) {
    soundName.audioPlayer.pause();
    soundName.audioPlayer.currentTime = 0;
  }
}

audioPool.addSounds(); // Add sounds to the page in separate audio players


// ------------------ Buttons ------------------ //
// Stop the rubber effect on iOS
document.ontouchmove = function(e) {
  e.preventDefault();
}


// Tutorial Page Buttons
// -- Start game Button
toolsBox.onClickNTouchstart(tutPgStartGameBtn, function(){
  audioPool.playSound(buttonTap);
  gameEngine.stop(); // Reset the levels and time

  toolsBox.hidePage(pageTutorial);
  toolsBox.showPage(pagePlayDelay); // Show the 1.5 seconds delay page
  toolsBox.pagePlayDelay.start(); // Start the count down

  toolsBox.delay( function() {
    toolsBox.showPage(pagePlayArea)
  }, 1000);
  toolsBox.delay(gameEngine.start, 1500); // Delay starting the level until the countdown is finished
});

// Lost Page Buttons
// -- Try again button
$("#lvlLostTryAgainBtn").off('click').on('click', function () {
  audioPool.playSound(buttonTap);

  // reset Reward + thème rouge par défaut
  resetRewardUI();
  setLoseScreenTheme(false);

  toolsBox.hidePage(pageYouLost);
  toolsBox.showPage(pageGameMenu);
  gameEngine.stop();
  gameEngine.reset();
});


// Pause Menue Buttons
// -- Restart button
toolsBox.onClickNTouchstart(pmRstrtLvlBtn, function() {
  audioPool.playSound(buttonTap);
  toolsBox.showPage(pageGameMenu);
  toolsBox.hidePage(pagePauseMenu);
  gameEngine.stop();
});
// -- Continue button
toolsBox.onClickNTouchstart(pmCntnuGmBtn, function() {
  audioPool.playSound(buttonTap);
  toolsBox.showPage(pagePlayArea);
  toolsBox.hidePage(pagePauseMenu);
  gameEngine.resume();
});

// About Page Buttons
// -- Back Button
abtPageBackBtn.addEventListener('click', function() {
  audioPool.playSound(buttonTap);
  toolsBox.showPage(pageGameMenu);
  toolsBox.hidePage(pageAbout);
  toolsBox.pageAbout.stopMovingCredits(); // stop animating the credits in the about page
}, false);

// Game Menu Buttons
// -- New Game Button
newGameBtn.addEventListener('click', function() {
  audioPool.playSound(buttonTap);
  toolsBox.showPage(pageTutorial);
  toolsBox.hidePage(pageGameMenu);
}, false);
// -- About Button
aboutBtn.addEventListener('click', function() {
  audioPool.playSound(buttonTap);
  toolsBox.showPage(pageAbout);
  toolsBox.hidePage(pageGameMenu);
}, false);




// Hide Splash Screen when everything is loaded
toolsBox.hideSplashScreen();



/*****************************************************************************************************************************/
/*  Local API (SQLite) integration  *****************************************************************************************/
/*****************************************************************************************************************************/

function disableButton(button)
{
    $(button).attr("disabled", true);
    $(button).removeClass("btn-blue");
}

function showPopup()
{
    $(".popupInfo").fadeIn("slow");
    setTimeout(() => {
        $(".popupInfo").fadeOut("slow");
    }, 2000);
}

function collectClickedCirclesTime() {
  const times = [];
  for (var i=0; i <= defaultGameValues.circle; i++) {
    if (circlesPosition[i].timeDespawn != null && circlesPosition[i].timeSpawn != null) {
      times[i] = circlesPosition[i].timeDespawn - circlesPosition[i].timeSpawn;
    }
  }
  return times;
}

$("#lvlLostTryAgainBtn").click(function(){
  gameEngine.reset();
});

$("#highScoresBtn").click(async function(){
  $("#highscoreList").empty();
  $("#pageGameMenu").hide();
  $("#pageHighscore").show();
  await Get50BestResults();
});

$("#backtohighscore").click(function(){
  $("#pageHighscoreAudit").hide();
  $("#pageHighscore").show();
  $("#circleClicked").empty();
});

$("#backtomenu").click(function(){
  $("#pageHighscore").hide();
  $("#highscoreList").empty();
  $("#pageGameMenu").show();
});

async function Get50BestResults() {
  $('#highscoreList').empty();
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    console.log("Using address:", address);

    const SCORES_ABI = [
      "function getTopScores() view returns (tuple(address player, uint256 points, uint256 date, string levelId)[] memory)"
    ,];

    // On se connecte au contrat avec le provider
    const contract = new ethers.Contract(
      "0xcB00640bAE4f04af65913A89bD3Baf55533226DA",
      SCORES_ABI,
      provider
    );

    // Récupère tous les scores du joueur
    const scores = await contract.getTopScores();
    scores.forEach((s, i) => {
    const player = s[0]; // adresse du joueur
    const points = Number(s[1]); // points en nombre
    const timestamp = Number(s[2]); // timestamp brut
    const levelId = s[3]; // string levelId
    const date = new Date(timestamp * 1000); // conversion en date lisible

    console.log(`(${i}) Player: ${player}, Points: ${points}, Date: ${date}, Level: ${levelId}`);
      // Affichage simple dans le HTML
      $("#highscoreList").append(`
        <li class='highscoreitem'>
          <p class="firstitem">${date.toLocaleString()}</p>
          <p class="seconditem">${player.slice(0,6)+"..."+player.slice(-4)}</p>
          <p class="thirditem">${points}</p>
        </li>
      `);

      console.log(`Score #${i + 1}:`, { points, date, levelId });
    });
  } catch (e) {
    console.error("Error loading scores", e);
    $("#highscoreList").append(`<li><p class="firstitem">Erreur lors du chargement des scores</p></li>`);
  }
}


/*async function Get50BestResults()
{
  $('#highscoreList').empty();
  try {
    //const res = await fetch(`${API_BASE}/api/scores`, { method: "GET" });
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  console.log("Using address:", address);

  const SCORES_ABI = [
  "function getScores(address player) view returns (tuple(uint256 points, uint256 date, string levelId)[] memory)"
  ];

  const contract = new ethers.Contract("0x66fb17989373fd4fe4c3cfecd905be272894ce25", 
  SCORES_ABI, provider);

  const res = await contract.getScores(address);

    //if (res.ok) {
      //const list = await res.json();
      res.forEach(elem => {
        console.log("Score entry:", elem);
        try {
          const date = new Date(elem.createdAt);
          const player = elem.player;
          const score = elem.score;
          $("#highscoreList").append(`<li id="${elem.id}" class='highscoreitem'><p class="firstitem">${date.toLocaleString()}<p class="seconditem">${player}<p class="thirditem">${score}</p></p></p</li>`);
        } catch (error) {
          console.log("bad score entry.");
        }
      });
    //}
  } catch (e) {
    console.error("Error loading scores", e);
  }
}*/

$(document).on("click", ".highscoreitem", async function(){
  $('#circleClicked').empty();
  $("#pageHighscore").hide();
  $("#pageHighscoreAudit").show();

  const id = $(this).attr('id');
  try {
    const res = await fetch(`${API_BASE}/api/scores/${id}`, { method: "GET" });
    if (res.ok) {
      const json = await res.json();
      const circleClicked = Array.isArray(json.circleTime) ? json.circleTime : [];
      const totalPoints = json.score;
      let totalClicked = 0;
      let totalPlayed = 0;
      let totalSecs = 0;
      let fastestTime = 99999999;

      circleClicked.forEach(function(ms, index){
        const sec = parseFloat(ms) / 1000;
        if (Number.isFinite(sec) && sec < 2000) {
          totalClicked++;
          totalSecs += sec;
        }
        if (sec < fastestTime) fastestTime = sec;

        totalPlayed++;
        $("#circleClicked").append(`<li><p class="firstitem">circle${index} <p class="thirditem">${Number.isFinite(sec) ? sec.toFixed(3) : "--"} sec</p></p</li>`);
      });

      $("#points").text(totalPoints);
      $("#total").text(totalClicked);
      $("#fastest").text((Number.isFinite(fastestTime) ? fastestTime.toFixed(3) : "--") + " SEC");
      $("#average").text(totalClicked > 0 ? parseFloat((totalSecs / totalClicked)).toFixed(3) + " SEC" : "-.--- SEC");
    } else {
      console.log("Score not found");
    }
  } catch (e) {
    console.error("Error loading score details", e);
  }
});

$(document).ready(async function(){
  await Get50BestResults();
})