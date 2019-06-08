 /*jshint esversion: 6*/


 let socket = null;
 let singlePlayer = true;
 let firstSetup = true;
 let compatableBrowser = false;
 let bomber = 14;
 let totalPoints = 0;
 let thisPlayer = "";
 let isChallenger = false;
 let challengeEnabled = false;
 let challengeSetsCount = 0;
 let challengerCellsPicked = [];
 let gameID = "";
 let secondPlayer = "";


 if (Modernizr.queryselector) {
     let allclasses = document.querySelector("html").getAttribute("class").trim();
     if (allclasses.includes("no-cssanimations") || allclasses.includes("no-arrow") || allclasses.includes("no-promises") || allclasses.includes("no-classlist") || allclasses.includes("no-opacity") || allclasses.includes("no-csstransforms") || allclasses.includes("no-fetch") || allclasses.includes("no-json")) {
         alert("Sorry, your browser does not support some features.\n Please use the latest version Google Chrome");
     } else {
         compatableBrowser = true;
     }

 } else {
     alert("Sorry, you are using an outdated browser");
 }

 const oneplayerBtn = document.getElementById("oneplayer");
 const twoplayerBtn = document.getElementById("twoplayer");
 const joinBtn = document.getElementById("joinBtn");
 const readyBtn = document.getElementById("readyBtn");
 const createBtn = document.getElementById("createBtn");

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


 joinBtn.addEventListener("click", function() {
     document.getElementById("acceptBlock").style.display = "block";
 });

 createBtn.addEventListener("click", function() {
     let name = document.getElementById("username").value.trim();
     let pattern = new RegExp("^([a-zA-Z0-9_]){2,20}$");
     if (pattern.test(name)) {
         socketHandlers("create", { name: name });
     } else {
         alert("Enter a valid User Name");
     }
 });

 readyBtn.addEventListener("click", function() {
     let acceptID = document.getElementById("acceptID").value.trim();
     let name = document.getElementById("username").value.trim();
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
             document.getElementById("playmode").classList.remove("show-none");
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
     let remainingElts = document.querySelectorAll("#gametable p");
     document.querySelector("#gameover span").innerText = `Game Over!
    You Scored ${totalPoints} points`;
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
         document.querySelector("#points span").innerText = totalPoints;
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
                         if (challengeSetsCount == 10) {
                             challengerCellsPicked.push(parseInt(thisElt.getAttribute("id").split("cell")[1]));
                             thisElt.classList.add("greenbox");
                             thisElt.classList.add("marked");
                             document.getElementById("challengerInfo").innerHTML = `Good. Now pick the final <span>Bomber Ball</span>`;
                         } else if (challengeSetsCount == 11) {
                             challengerCellsPicked.push(parseInt(thisElt.getAttribute("id").split("cell")[1]));
                             thisElt.classList.add("redbomb");
                             thisElt.classList.add("marked");
                             challengeEnabled = false;
                             socket.emit('cellsPicked', { cells: challengerCellsPicked, id: gameID });
                             document.getElementById("challengerInfo").innerHTML = `Congrats! Your Challenge is ready. <br/>Share the <b>Game ID</b> with the person who will play your challenge.`;
                         } else {
                             challengerCellsPicked.push(parseInt(thisElt.getAttribute("id").split("cell")[1]));
                             thisElt.classList.add("greenbox");
                             thisElt.classList.add("marked");
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
                         if(!singlePlayer){
                            socket.emit('bombPick', { cell: _num, id: gameID });
                         }
                         
                     } else {
                         gameState.getPoints(thisElt);
                         if(!singlePlayer){
                            socket.emit('correctPick', { cell: _num, id: gameID });
                         }
                         
                     }

                 } else if (thisElt.getAttribute("data-active") != "off") {
                     gameState.missed(thisElt);
                     if(!singlePlayer){
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

 const autohideStatus = () => {
     setTimeout(function() {
         document.getElementById("statusMsg").innerHTML = "";
         document.getElementById("statusMsg").style.opacity = 0;
     }, 6000);
 };

 const watchReview = (status, num) => {
     if (status == "correct") {
         let tabcell = "cell" + num;
         document.getElementById(tabcell).classList.add("zoom");
         totalPoints++;
         document.querySelector("#points span").innerText = totalPoints;
         pointsSound.play();
     }
     if (status == "wrong") {
         let tabcell = "cell" + num;
         document.getElementById(tabcell).classList.add("disappear");
     }
     if (status == "bomb") {
         let tabcell = "cell" + num;         
         document.getElementById(tabcell).classList.add("apply-shake");
         bombSound.play();
     }
 };



 // Listen for events

 function socketHandlers(type, vals) {
     if (socket == null) {
         socket = io();
     }

     if (type == "create") {
         socket.emit('createRoom', {
             player1: vals.name
         });
     } else {
         socket.emit('joinRoom', {
             player2: vals.name,
             id: vals.id
         });
     }

     /*socket.on("objectDebug", function(d) {
         console.log(d);
     });
    */

     if (firstSetup) {
         socket.on('roomcreated', function(data) {
             document.getElementById("chgID").innerHTML = `Player: ${data.player} / <b>Game ID: ${data.id} </b>`;
             thisPlayer = document.getElementById("username").value;
             document.getElementById("playmode").remove();
             document.getElementById("gametable").classList.remove("show-none");
             document.getElementById("GameHeader").classList.remove("show-none");
             isChallenger = true;
             gameID = data.id;
             bindCellEvents();

         });

         socket.on('joined', function(data) {
             document.getElementById("chgID").innerHTML = `<b>Players:</b> ${data.players[0].name}, ${data.players[1].name} / <b>Game ID:</b> ${data.id} `;
             thisPlayer = document.getElementById("username").value;
             document.getElementById("playmode").remove();
             document.getElementById("gametable").classList.remove("show-none");
             document.getElementById("GameHeader").classList.remove("show-none");
             isChallenger = false;
             gameID = data.id;
             randomizer(0, data.cells);

         });

         socket.on('player2in', function(data) {
             document.getElementById("chgID").innerHTML = `<b>Players:</b> ${data.players[0].name}, ${data.players[1].name} / <b>Game ID:</b> ${data.id} `;
             document.getElementById("statusMsg").innerHTML = `<b>${data.players[1].name}</b> has accepted your challenge`;
             document.getElementById("statusMsg").style.opacity = 1;
             secondPlayer = data.players[1].name;
             autohideStatus();
         });


         socket.on('player2CellPicked', function(data) {
             watchReview(data.state, data.cell);
             document.getElementById("challengerInfo").innerHTML = `<b>${secondPlayer}</b> has started playing`;
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
                 console.log(data.rooms);
                 alert(data.error);
             } else {
                 alert(data);
             }

         });

         socket.on('playergone', function(data) {
             document.getElementById("chgID").innerHTML = `<b>Players:</b> ${thisPlayer} / <b>Game ID:</b> ${data.id} `;
             if (isChallenger) {
                 alert(data.name + " has left the game");
             } else {
                 document.getElementById("gametable").remove();
                 alert("Sorry, Your challenger has left the Game. This challenge has expired");
             }

         });

         socket.on('disconnected', function(data) {
             console.log(data.id + " disconnected");
         });
     }


 }