 /*jshint esversion: 6*/


 let socket = null;
 let singlePlayer = true;
 let firstSetup = true;
 let compatableBrowser = false;
 let bomber = 14;
 let totalPoints = 0;
 let temp_total = 0;
 let thisPlayer = "";
 let isChallenger = false;
 let challengeEnabled = false;
 let challengeSetsCount = 0;
 let challengerCellsPicked = [];
 let gameID = "";
 let secondPlayer = "";
 let challengerPoints = 0;
 let player1Name = "";
 let isPreserve = false;


 if (Modernizr.queryselector) {
     let allclasses = document.querySelector("html").getAttribute("class").trim();
     console.log(allclasses);
     if (allclasses.includes("no-cssanimations") || allclasses.includes("no-arrow") || allclasses.includes("no-promises") || allclasses.includes("no-classlist") || allclasses.includes("no-opacity") || allclasses.includes("no-csstransforms") || allclasses.includes("no-fetch") || allclasses.includes("no-json") || allclasses.includes("no-localstorage") || allclasses.includes("no-templatestrings") || allclasses.includes("no-mediaqueries") || allclasses.includes("no-csstransforms3d") ) {
         alert("Sorry, your browser does not support some features.\n Please use the latest version Google Chrome");
     } else {
         compatableBrowser = true;
         if (localStorage.getItem("refresher")) {
             let cache = JSON.parse(localStorage.getItem("refresher"));
             gameID = cache.id;
             thisPlayer = cache.name;
             challengerPoints = parseInt(cache.pl1score);
             temp_total = parseInt(cache.pl2score);             
             localStorage.clear();
             singlePlayer = false;           
            
             if (cache.player == "two") {
                 isChallenger = false;
                 socketHandlers("join", { name: thisPlayer, id: gameID });
             } else {                 
                 isPreserve = true;
                 socketHandlers("create", { name: thisPlayer, preserve: true, id: gameID });
             }


         } else {
             
             if (window.location.href.includes("playgame?gameid=")) {
                 let hashid = window.location.href.split("?gameid=");
                 if (hashid.length == 2 && hashid[1].length == 9 && hashid[1].indexOf(".") == 4) {
                     document.getElementById("joinoraccept").style.display = "block";
                     document.getElementById("oneplayer").parentNode.style.display = "none";
                     document.getElementById("acceptBlock").style.display = "block";
                     document.getElementById("acceptID").value = hashid[1];
                     document.getElementById("createBtn").remove();
                     document.getElementById("joinBtn").remove();
                     document.querySelector("#joinoraccept span").remove();
                     singlePlayer = false;

                 }
             }
         }
     }

 } else {
     alert("Sorry, you are using an outdated browser");
 }

 const oneplayerBtn = document.getElementById("oneplayer");
 const twoplayerBtn = document.getElementById("twoplayer");
 const joinBtn = document.getElementById("joinBtn");
 const readyBtn = document.getElementById("readyBtn");
 const createBtn = document.getElementById("createBtn");
 const anotherReqBtn = document.getElementById("anotherYes");
 const declineBtn = document.getElementById("anotherNo");

 oneplayerBtn.addEventListener("click", function(e) {
     randomizer(11, null);
     document.getElementById("playmode").remove();
     document.getElementById("gametable").classList.remove("show-none");
 });

 twoplayerBtn.addEventListener("click", function(e) {
     document.getElementById("joinoraccept").style.display = "block";
     document.getElementById("oneplayer").parentNode.style.display = "none";
     singlePlayer = false;
 });

 anotherReqBtn.addEventListener("click", function() {
     if (isChallenger) {
         document.getElementById("anotherYes").remove();
         document.getElementById("anotherNo").remove();
         socket.emit('acceptRequest', { id: gameID });
         localStorage.setItem("refresher", JSON.stringify({ id: gameID, name: thisPlayer, player: "one", pl1score: challengerPoints, pl2score: totalPoints + temp_total }));
         setTimeout(function() { window.location.reload(); }, 2000);
     } else {
         socket.emit('reqestChallenge', { id: gameID });
         document.querySelector("#anotherGameOpt h4").innerText = "Waiting to accept...";
         document.getElementById("anotherYes").remove();
         document.getElementById("anotherNo").remove();
     }

 });

 declineBtn.addEventListener("click", function() {
     if (window.location.href.includes("playgame?gameid=")) {
         let base = window.location.href.split("?gameid=");
         window.location.href = base[0];
     } else {
         window.location.reload();
     }
 });

 if (joinBtn && createBtn) {
     joinBtn.addEventListener("click", function() {
         document.getElementById("acceptBlock").style.display = "block";
     });

     createBtn.addEventListener("click", function() {
         let name = document.getElementById("username").value.toLowercase().trim();
         let pattern = new RegExp("^([a-zA-Z0-9_]){2,20}$");
         if (pattern.test(name)) {
             socketHandlers("create", { name: name, preserve: false, id: null });
         } else {
             alert("Enter a valid User Name");
         }
     });
 }


 readyBtn.addEventListener("click", function() {
     let acceptID = document.getElementById("acceptID").value.trim();
     let name = document.getElementById("username").value.toLowercase().trim();
     let pattern = new RegExp("^([a-zA-Z0-9_]){2,20}$");
     if (pattern.test(name)) {
         if (acceptID.length == 9 && acceptID.includes(".")) {
             let id = acceptID.split(".");
             if (id.length == 2 && id[0].length == 4 && id[1].length == 4) {
                 socketHandlers("join", { name: name, id: acceptID });
             } else {
                 alert("Invalid ID");
             }
         } else {
             alert("Invalid ID");
         }
     } else {
         alert("Enter a valid User Name");
     }

 });



 const soundCheck = {
     count: 0,
     isLoad: function() {
         this.count++;
         if (this.count == 3 && compatableBrowser) {
             if (document.getElementById("playmode")) {
                 document.getElementById("playmode").classList.remove("show-none");
             }

         }
     }
 };


 const pointsSound = new Howl({
     src: ['assets/points.mp3', 'assets/points.wav']
 });
 const missoutSound = new Howl({
     src: ['assets/missout.mp3', 'assets/missout.wav']
 });
 const bombSound = new Howl({
     src: ['assets/bombsound.mp3', 'assets/bombsound.wav']
 });

 pointsSound.once('load', function() {
     soundCheck.isLoad();
 });
 missoutSound.once('load', function() {
     soundCheck.isLoad();
 });
 bombSound.once('load', function() {
     soundCheck.isLoad();
 });




 const shrinkRemaining = () => {
     if (!singlePlayer) {
         challengerPoints = challengerPoints + 5;
         document.getElementById("challengerInfo").innerHTML = `<b>Game Over!</b><br/>
    Your Score: ${totalPoints+temp_total}, ${player1Name}'s score: ${challengerPoints}`;
     } else {
         document.querySelector("#gameover span").innerText = `Game Over!
    You Scored ${totalPoints} points`;
     }


     let remainingElts = document.querySelectorAll("#gametable p");
     remainingElts.forEach(function(e) {
         if (!e.getAttribute("class").includes("disappear") && !e.getAttribute("class").includes("apply-shake")) {
             e.addEventListener("animationend", function(el) {
                 el.target.style.opacity = 0;
                 document.getElementById("gameover").style.display = "block";
                 document.getElementById("points").style.opacity = 0;
             }, false);
             e.classList.add("implode");
         }
     });

 };

 const gameState = {
     getPoints: function(e) {
         e.classList.add("greenbox");
         totalPoints++;
         document.querySelector("#points span").innerText = totalPoints + temp_total;
         pointsSound.play();
         e.setAttribute("data-active", "off");

     },
     bombed: function(e) {
         e.addEventListener("animationend", function() {
             e.style.opacity = 0;
         }, false);
         e.classList.add("apply-shake", "redbomb");
         bombSound.play();
         shrinkRemaining();
         e.setAttribute("data-active", "off");
     },
     missed: function(e) {
         e.addEventListener("animationend", function() {
             e.style.opacity = 0;
         }, false);
         e.classList.add("disappear");
         missoutSound.play();
     }

 };

 const bindCellEvents = () => {
     const cells = document.querySelectorAll("#gametable p");
     if (isChallenger) {
         challengeEnabled = true;
         document.getElementById("challengerInfo").innerHTML = "Pick any <span>10 balls</span> to make them Green.<br/>The last one you pick will be the Bomber Ball";
     }
     cells.forEach(function(elem) {
         elem.addEventListener("click", function(e) {
             let thisElt = e.target;
             if (isChallenger && challengeEnabled) {
                 if (!thisElt.classList.contains("marked")) {
                     if (challengeSetsCount < 11) {
                         challengeSetsCount++;
                         challengerCellsPicked.push(parseInt(thisElt.getAttribute("id").split("cell")[1]));
                         if (challengeSetsCount == 10) {
                             thisElt.classList.add("greenbox", "marked");
                             document.getElementById("challengerInfo").innerHTML = `Good. Now pick the final<br/> <span>Bomber Ball</span>`;
                         } else if (challengeSetsCount == 11) {
                             thisElt.classList.add("redbomb", "marked");
                             challengeEnabled = false;
                             socket.emit('cellsPicked', { cells: challengerCellsPicked, id: gameID, preserve: isPreserve });
                             let gidurl = window.location.href + "?gameid=" + gameID;
                             if (!isPreserve) {
                                 document.getElementById("challengerInfo").innerHTML = `Your Challenge is ready! <br/>Share the <b>Game ID</b> with the person who will play your challenge.<br/><span class="link-game">${gidurl}</span>`;
                                 let inner = document.getElementById("chgID").innerHTML;
                                 document.getElementById("chgID").innerHTML = `${inner} / <span>Game ID: ${gameID}</span>`;
                             }
                             isPreserve = false;

                         } else {
                             thisElt.classList.add("greenbox", "marked");
                             document.getElementById("challengerInfo").innerHTML = `Pick <span>${10-challengeSetsCount}</span> more balls`;
                         }
                     }
                 }
             }
             if (!isChallenger) {
                 let _num = parseInt(thisElt.getAttribute("id").split("cell")[1]);
                 if (thisElt.getAttribute("data-active") == "on") {
                     if (bomber === _num) {
                         gameState.bombed(thisElt);
                         if (!singlePlayer) {
                             socket.emit('bombPick', { cell: _num, id: gameID });
                             //challengerPoints = challengerPoints + 5;
                             document.getElementById("anotherGameOpt").classList.remove("show-none");
                             document.getElementById("anotherGameOpt").classList.add("tweenDown");
                             document.querySelector("#anotherGameOpt h4").innerText = "Do you want to take another Challenge?";
                         }

                     } else {
                         gameState.getPoints(thisElt);
                         if (!singlePlayer) {
                             if (totalPoints == 10) {
                                 bomber = 1000;
                                 document.getElementById("anotherGameOpt").classList.remove("show-none");
                                 document.getElementById("anotherGameOpt").classList.add("tweenDown");
                                 document.getElementById("challengerInfo").innerHTML = `Great! You got all 10 Right!<br/>
                                    Your Score: ${totalPoints+temp_total}, ${player1Name}'s score: ${challengerPoints}`;
                                 document.querySelector("#anotherGameOpt h4").innerText = "Do you want to take another Challenge?";

                             }
                             socket.emit('correctPick', { cell: _num, id: gameID });
                         }

                     }

                 } else if (thisElt.getAttribute("data-active") != "off") {
                     gameState.missed(thisElt);
                     if (!singlePlayer) {
                         socket.emit('wrongPick', { cell: _num, id: gameID });
                     }

                 }
             }

         });

     });
 };

 const initRandomCells = (rand) => {
     for (let i in rand) {
         let tabcell = "cell" + rand[i];
         document.getElementById(tabcell).setAttribute("data-active", "on");
     }

 };


 const randomizer = (n, arr) => {
     let rndm = [];
     if (arr == null) {
         let nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
         for (let z = 0; z < n; z++) {
             let rnd_pos = Math.floor(Math.random() * nums.length);
             rndm.push(nums[rnd_pos]);
             nums.splice(rnd_pos, 1);
         }
         bomber = rndm[Math.floor(Math.random() * rndm.length)];
     } else {
         rndm = arr.slice(0);
         bomber = arr.pop();
     }

     initRandomCells(rndm);
     bindCellEvents();
 };

 /* const autohideStatus = () => {
      setTimeout(function() {
          document.getElementById("statusMsg").innerHTML = "";
          document.getElementById("statusMsg").style.opacity = 0;
      }, 4000);
  };*/

 const watchReview = (status, num) => {
     if (status == "correct") {
         let tabcell = "cell" + num;
         document.getElementById(tabcell).classList.add("zoom");
         totalPoints++;
         document.getElementById("challengerInfo").innerHTML = `<b>${secondPlayer}</b> has scored <b>${totalPoints+temp_total}</b> points`;
         pointsSound.play();
     }
     if (status == "wrong") {
         let tabcell = "cell" + num;
         let c = document.getElementById(tabcell);
         c.addEventListener("animationend", function() {
             c.style.opacity = 0;
         }, false);
         c.classList.add("disappear");
     }
     if (status == "bomb") {
         let tabcell = "cell" + num;
         document.getElementById(tabcell).classList.add("apply-shake");
         bombSound.play();
         challengerPoints = challengerPoints + 5;
         document.getElementById("challengerInfo").innerHTML = `<b>${secondPlayer}</b> is Bombed!<br/>
         <b>Your score: ${challengerPoints}</b>, ${secondPlayer}'s score: <b>${totalPoints+temp_total}</b> `;
     }
 };



 // Listen for events

 function socketHandlers(type, vals) {
     if (socket == null) {
         socket = io();
     }
     document.getElementById("gametable").classList.remove("align-items-center");
     if (type == "create") {
         socket.emit('createRoom', {
             player1: vals.name,
             preserveReload: vals.preserve,
             id: vals.id
         });
     } else {         
         socket.emit('joinRoom', {
             player2: vals.name,
             id: vals.id
         });
     }

     socket.on("objectDebug", function(d) {
         if(d.alert){
            alert(d.msg);
         }else{
            console.log(d);
         }
         
     });


     if (firstSetup) {
         socket.on('roomcreated', function(data) {
             document.getElementById("chgID").innerHTML = `<b>Players:</b> ${data.player}`;
             thisPlayer = data.player;
             document.getElementById("playmode").remove();
             document.getElementById("gametable").classList.remove("show-none");
             document.getElementById("GameHeader").classList.remove("show-none");
             document.querySelector("#points div").innerHTML = "";
             document.getElementById("gametable").classList.remove("align-items-center");
             document.getElementById("gametable").style.marginTop = "30px";
             isChallenger = true;
             gameID = data.id;
             bindCellEvents();
             alert("CREATED!!");

         });

         socket.on('joined', function(data) {
             document.getElementById("chgID").innerHTML = `<b>Players:</b> ${data.players[0].name}, ${data.players[1].name} / <span>Game ID: ${data.id}</span> `;
             thisPlayer = data.players[1].name;
             document.getElementById("playmode").remove();
             document.getElementById("gametable").classList.remove("show-none");
             document.getElementById("GameHeader").classList.remove("show-none");
             document.getElementById("gametable").classList.remove("align-items-center");
             document.getElementById("gametable").style.marginTop = "30px";
             document.querySelector("#points span").innerText = temp_total;
             isChallenger = false;
             gameID = data.id;
             player1Name = data.players[0].name;
             randomizer(0, data.cells);

         });

         socket.on('player2in', function(data) {
             document.getElementById("chgID").innerHTML = `<b>Players:</b> ${data.players[0].name}, ${data.players[1].name} / <span>Game ID: ${data.id}</span> `;
             //document.getElementById("statusMsg").innerHTML = `<b>${data.players[1].name}</b> has accepted your challenge`;
             //document.getElementById("statusMsg").style.opacity = 1;
             document.getElementById("challengerInfo").innerHTML = `<b>${data.players[1].name}</b> has accepted your challenge`;
             secondPlayer = data.players[1].name;
             //autohideStatus();
         });


         socket.on('player2CellPicked', function(data) {
             if (totalPoints == 0) {
                 document.getElementById("challengerInfo").innerHTML = `<b>${secondPlayer}</b> has started playing....`;
                 document.querySelector("#points div").innerHTML = "";
             }
             watchReview(data.state, data.cell);

         });

         socket.on('ChlngReqFromPlayer2', function(data) {
             document.getElementById("anotherGameOpt").classList.remove("show-none");
             document.getElementById("anotherGameOpt").classList.add("tweenDown");
             document.querySelector("#anotherGameOpt h4").innerHTML = `<b>${secondPlayer}</b> likes to try another Challenge from you`;
             document.getElementById("anotherYes").innerText = "Accept";
             document.getElementById("anotherNo").innerText = "Decline";
         });

         socket.on('Player2Refresh', function(data) {
             document.querySelector("#anotherGameOpt h4").innerText = "Your challenge will load now...";
             localStorage.setItem("refresher", JSON.stringify({ id: gameID, name: thisPlayer, player: "two", pl1score: challengerPoints, pl2score: totalPoints + temp_total }));
             setTimeout(function() { window.location.reload(); }, 2000);
         });

         socket.on('replayReqAccepted', function(data) {
             document.querySelector("#anotherGameOpt h4").innerHTML = `<b>${data.players[0].name}</b> is now preparing, please wait...`;

         });

         socket.on('duplicateName', function() {
             firstSetup = false;
             alert("Choose a different user name");

         });

         socket.on('playerfull', function() {
             firstSetup = false;
             alert("Sorry, someone has already accepted this Challenge");

         });

         socket.on('noplayer', function() {
             firstSetup = false;
             alert("Sorry, Your challenger has left the Game. This challenge has expired");

         });
         socket.on('errorID', function(data) {
             firstSetup = false;
             if (data.error) {
                 alert(data.error);
             } else {
                 alert(data);
             }

         });

         socket.on('playergone', function(data) {
             document.getElementById("chgID").innerHTML = `<b>Players:</b> ${thisPlayer} / <span>Game ID: ${data.id} </span>`;
             document.getElementById("gametable").remove();
             document.getElementById("anotherGameOpt").remove();

             if (isChallenger) {
                 alert(data.name + " has left the game");
             } else {                
                 alert("Sorry, Your challenger has left the Game. This challenge has expired");
             }
             
         });

         socket.on('disconnected', function(data) {
             //console.log(data.id + " disconnected");
         });
     }

 }