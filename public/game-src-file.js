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
 let countDownInterval;
 let countDownCount = 25;
 let pl2Puzz = {};


 if (Modernizr.queryselector) {
     let allclasses = document.querySelector("html").getAttribute("class");
     console.log(allclasses);

     const featurelist = ["no-cssanimations", "no-arrow", "no-classList", "no-opacity", "no-csstransforms", "no-json", "no-localstorage", "no-templatestrings", "no-mediaqueries", "no-csstransforms3d", "no-flexbox", "no-boxshadow", "no-borderradius", "no-placeholder", "no-rgba", "no-cssgradients"];
     let feature = true;

     for (let i in featurelist) {
         if (allclasses.includes(featurelist[i])) {
             feature = false;
             break;
         }
     }

     if (feature) {
         compatableBrowser = true;
         if (localStorage.getItem("refresher")) {
             document.querySelector(".container").classList.remove("show-none");
             let cache = JSON.parse(localStorage.getItem("refresher"));
             gameID = cache.id;
             thisPlayer = cache.name;
             challengerPoints = parseInt(cache.pl1score);
             temp_total = parseInt(cache.pl2score);
             localStorage.clear();
             singlePlayer = false;

             if (cache.player == "two") {
                 isChallenger = false;
                 socketHandlers("join", { name: thisPlayer, id: gameID, preserve: false });
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
                     document.getElementById("twoplayer").innerText = "Welcome Player-2";
                     singlePlayer = false;

                 }
             }
         }

     } else {
         alert("Sorry, your browser does not support some features.\n Please view this page on the latest version Google Chrome");
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
 const puzzTry = document.getElementById("trytest");
 const puzzSkip = document.getElementById("skiptest");
 const msgIconBtn = document.getElementById("msgicon");

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
         setTimeout(function() { window.location.reload(); }, 1000);
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
         let name = document.getElementById("username").value.toLowerCase().trim();
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
     let name = document.getElementById("username").value.toLowerCase().trim();
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

 puzzTry.addEventListener("click", function() {
     if (isChallenger) {
         socket.emit('getWord', { player: "one" });
     } else {
         socket.emit('getWord', { player: "two", id: gameID });
         scrambleValidate();
     }
 });

 puzzSkip.addEventListener("click", function() {
     if (isChallenger) {
         emitPuzzle({ set: false });
     } else {
         document.getElementById("puzword").classList.add("show-none");
         document.getElementById("puzword").classList.remove("puzzTween");
         msgIconBtn.style.display = "block";
     }

 });

 msgIconBtn.addEventListener("click", function() {
     msgIconBtn.style.display = "none";
     document.getElementById("puzword").classList.remove("show-none");
     document.getElementById("plIntroMsg").innerHTML = `<b>${player1Name}</b> has given you a Scrambled Word to solve in <b>25 Seconds</b>. If you get it correct, you will gain all the 10 points and also escape the Red Bomb`;

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


     let remainingElts = document.querySelectorAll("#gametable .row p");
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
     const cells = document.querySelectorAll("#gametable .row p");
     if (isChallenger) {
         challengeEnabled = true;
         document.getElementById("challengerInfo").innerHTML = "Pick any <span>10 balls</span> to make them Green. The last one you pick will be the Bomber Ball";
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
                             document.getElementById("challengerInfo").innerHTML = `You are almost Done!`;
                             setTimeout(function() {
                                 document.getElementById("puzword").classList.remove("show-none");
                                 document.getElementById("puzword").classList.add("puzzTween");
                             }, 500);

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
                             document.getElementById("msgicon").remove();
                             document.getElementById("puzword").remove();
                             document.getElementById("anotherGameOpt").classList.remove("show-none");
                             document.getElementById("anotherGameOpt").classList.add("tweenDown");
                             document.querySelector("#anotherGameOpt h4").innerText = "Add more points to your score? Ask for a Challenge.";
                         }

                     } else {
                         gameState.getPoints(thisElt);
                         if (!singlePlayer) {
                             if (totalPoints == 9) {
                                 document.getElementById("msgicon").remove();
                                 document.getElementById("puzword").remove();

                             }
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

 const emitPuzzle = (ob) => {
     document.getElementById("puzword").remove();
     socket.emit('cellsPicked', { cells: challengerCellsPicked, id: gameID, preserve: isPreserve, puzz: ob });
     let gidurl = window.location.href + "?gameid=" + gameID;
     if (isPreserve) {
         document.getElementById("challengerInfo").innerHTML = `Your Challenge delivered to <b>${secondPlayer}</b>`;
     } else {
         document.getElementById("challengerInfo").innerHTML = `Challenge Ready! <br/>Share this <b>Game ID</b> with the person who will play your challenge.<br/><a href="${gidurl}"><span class="link-game">${gidurl}</span></a>`;
     }
     let inner = document.getElementById("chgID").innerHTML;
     document.getElementById("chgID").innerHTML = `${inner} / <span>Game ID: ${gameID}</span>`;
 };

 const pl2PuzzleFail = () => {
     document.getElementById("puzword").remove();
     const pcells = document.querySelectorAll("#gametable .row p");
     pcells.forEach(function(elm) {
         if (elm.getAttribute("data-active") == "on") {
             elm.setAttribute("data-active", "off");
         }
     });
     let bmbCell = "cell" + bomber;
     document.getElementById(bmbCell).classList.add("redbomb");
     bomber = 1000;
     document.getElementById("anotherGameOpt").classList.remove("show-none");
     document.getElementById("anotherGameOpt").classList.add("tweenDown");
     document.querySelector("#anotherGameOpt h4").innerText = "Add more points to your score? Ask for a Challenge.";
     document.getElementById("challengerInfo").innerHTML = `Better Luck next time`;
     socket.emit("puzzleFailed", { id: gameID });

 };

 const escapeRedBomb = () => {
     const pcells = document.querySelectorAll("#gametable .row p");
     pcells.forEach(function(elm) {
         if (elm.getAttribute("data-active") == "on") {
             let clss = elm.getAttribute("class");
             if (!clss.includes("redbomb") && !clss.includes("greenbox") && !clss.includes("disappear")) {
                 elm.classList.add("greenbox");
                 elm.setAttribute("data-active", "off");
             }
         }
     });
     let bmbCell = "cell" + bomber;
     document.getElementById(bmbCell).style.opacity = 0.4;
     bomber = 1000;
     totalPoints = 10;
     document.querySelector("#points span").innerText = totalPoints + temp_total;
     pointsSound.play();
     document.getElementById("anotherGameOpt").classList.remove("show-none");
     document.getElementById("anotherGameOpt").classList.add("tweenDown");
     document.getElementById("challengerInfo").innerHTML = `You gained 10 points and escaped the Red Bomb<br/>
                                    Your Score: ${totalPoints+temp_total}, ${player1Name}'s score: ${challengerPoints}`;
     document.querySelector("#anotherGameOpt h4").innerText = "Do you want to take another Challenge?";
     socket.emit("puzzleBombClear", { id: gameID });

 };

 const refreshScr = (e) => {
     document.getElementById("refreshScramble").removeEventListener("click", refreshScr);
     clearInterval(countDownInterval);
     countDownCount = 25;
     let p_letters = document.querySelectorAll("#puzword div span");
     p_letters.forEach(function(sp) {
         sp.remove();
     });

     socket.emit('getWord', { player: "one" });

 };

 const scrambleValidate = (w) => {
     let new_w = [];
     if (isChallenger) {
         let word = w.word.split("");
         for (let j = 0; j < w.word.length; j++) {
             let pos = Math.floor(Math.random() * word.length);
             new_w.push(word[pos]);
             word.splice(pos, 1);
         }

     }

     let _word = isChallenger ? stringCodeMixer("plain", w.word) : pl2Puzz.word;
     let _scramb = isChallenger ? new_w : pl2Puzz.scramb.split("");


     document.getElementById("thetimer").style.display = "block";
     document.getElementById("thetimer").innerText = countDownCount;

     countDownInterval = setInterval(function() {
         countDownCount--;
         document.getElementById("thetimer").innerText = countDownCount;
         if (countDownCount == 15) {
             document.getElementById("refreshScramble").remove();
             document.getElementById("temp_or").remove();

         }
         if (countDownCount == 0) {
             document.getElementById("thetimer").remove();
             document.querySelector("#puzword div").remove();
             clearInterval(countDownInterval);
             if (isChallenger) {
                 emitPuzzle({ set: false });
             } else {
                 pl2PuzzleFail();
             }

         }
     }, 1000);

     if (document.getElementById("trytest")) {
         document.getElementById("trytest").remove();
         document.getElementById("skiptest").remove();
     }

     if (isChallenger) {
         document.querySelector("#puzword p").innerHTML = `Arrange the letters in <b>correct order</b> <span id="temp_or">or</span> <span id="refreshScramble">Try another?</span><br/><br/>
                <span id="txtsequence"></span>`;
         document.getElementById("refreshScramble").addEventListener("click", refreshScr);
     } else {
         document.querySelector("#puzword p").innerHTML = `Arrange the letters in <b>correct order</b> <br/><br/>
                <span id="txtsequence"></span>`;
     }


     document.getElementById("puzword").setAttribute("data-pzw", _word);
     document.querySelector("#puzword div").innerHTML = `<span>${_scramb[0]}</span><span>${_scramb[1]}</span><span>${_scramb[2]}</span><span>${_scramb[3]}</span><span>${_scramb[4]}</span><span>${_scramb[5]}</span><span>${_scramb[6]}</span>`;
     document.getElementById("puzword").setAttribute("data-scramb", String(_scramb.join("")));
     let p_letters = document.querySelectorAll("#puzword div span");

     p_letters.forEach(function(sp) {
         sp.addEventListener("click", function(el) {
             if (document.getElementById("refreshScramble")) {
                 document.getElementById("refreshScramble").remove();
                 document.getElementById("temp_or").remove();
             }
             let picky = document.getElementById("puzword").getAttribute("data-picktxt");
             let _txt = `${picky}${el.target.innerText}`;
             document.getElementById("txtsequence").style.opacity = 1;
             document.getElementById("puzword").setAttribute("data-picktxt", _txt);
             document.getElementById("txtsequence").innerText = _txt;
             el.target.remove();

             if (_txt.length == 7) {
                 //let _right = window.atob(document.getElementById("puzword").getAttribute("data-pzw"));
                 let _right = stringCodeMixer("encoded", document.getElementById("puzword").getAttribute("data-pzw"));
                 if (_txt == _right) {
                     clearInterval(countDownInterval);
                     document.querySelector("#puzword p").innerHTML = `<b>You got it right :)</b>`;
                     setTimeout(function() {
                         if (isChallenger) {
                             emitPuzzle({
                                 set: true,
                                 scramb: document.getElementById("puzword").getAttribute("data-scramb"),
                                 word: document.getElementById("puzword").getAttribute("data-pzw")
                             });
                         } else {
                             escapeRedBomb();
                         }

                         document.getElementById("thetimer").remove();
                     }, 3000);
                 } else {
                     clearInterval(countDownInterval);
                     document.querySelector("#puzword p").innerHTML = `Sorry, the correct word is <b>${_right}</b>`;
                     setTimeout(function() {
                         if (isChallenger) {
                             emitPuzzle({ set: false });
                         } else {
                             pl2PuzzleFail();
                         }
                         document.getElementById("thetimer").remove();
                     }, 5000);
                 }
             }

         });
     });
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


 const stringCodeMixer = (type, str) => {
     let replc = { a: "n", s: "d", b: "k", o: "x", p: "v", v: "p", h: "t", P: "i", j: "y", z: "O", g: "Q", x: "o", G: "c", y: "j", n: "a", t: "h", k: "b", O: "z", Q: "g", c: "G", d: "s", i: "P" };
     let rx = ["Ma_X_iM", "piX_Xel", "_BrOxxO_"];

     let _obj = {
         looper: function(txtArr) {
             let _arr = [];
             txtArr.forEach(function(v) {
                 if (replc[v]) {
                     _arr.push(replc[v]);
                 } else {
                     _arr.push(v);
                 }
             });
             return String(_arr.join(""));
         }
     };

     if (type == "plain") {
         let _txt = window.btoa(str);
         let txtArr = _txt.split("");
         let mxd = _obj.looper(txtArr);
         let coded = mxd.split("=").join(rx[Math.floor(Math.random() * 3)]);
         return coded;
     } else {
         let _txt = str;
         if (str.includes(rx[0]) || str.includes(rx[1]) || str.includes(rx[2])) {
             _txt = String(_txt.split(rx[0]).join("="));
             _txt = String(_txt.split(rx[1]).join("="));
             _txt = String(_txt.split(rx[2]).join("="));
         }
         let text = _obj.looper(_txt.split(""));
         return window.atob(text);
     }

 };



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
         if (d.alert) {
             alert(d.msg);
         } else {
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
             document.getElementById("challengerInfo").innerHTML = `<span>${data.players[0].name}</span> has hidden <span>10</span> Green balls, and<br/> <span>1</span> Red ball among these. <br/><span class="sm-txt">(Green gets you points, Red will end the game)</span>`;
             if (data.puzzler.set) {
                 pl2Puzz = data.puzzler;
                 document.getElementById("msgicon").style.display = "block";
             }

             isChallenger = false;
             gameID = data.id;
             player1Name = data.players[0].name;
             randomizer(0, data.cells);

         });

         socket.on('player2in', function(data) {
             document.getElementById("chgID").innerHTML = `<b>Players:</b> ${data.players[0].name}, ${data.players[1].name} / <span>Game ID: ${data.id}</span> `;
             document.getElementById("challengerInfo").innerHTML = `<b>${data.players[1].name}</b> has accepted your challenge`;
             secondPlayer = data.players[1].name;

         });

         socket.on('p2PuzzPlay', function(data) {
             document.getElementById("challengerInfo").innerHTML = `<b>${data.player}</b> is now playing the Word Scramble...`;
         });

         socket.on('p2PuzzleFailed', function(data) {
             challengerPoints = challengerPoints + 5 + (10 - totalPoints);
             document.getElementById("challengerInfo").innerHTML = `<b>${secondPlayer}</b> failed at Word Scramble.<br/>
             You get ${10- totalPoints} bonus points + 5 <br/>
             <b>Your score: ${challengerPoints}</b>, ${secondPlayer}'s score: <b>${totalPoints+temp_total}</b>`;
         });

         socket.on('puzzBombCleared', function(data) {
             totalPoints = 10;
             document.getElementById("challengerInfo").innerHTML = `<b>${secondPlayer}</b> cleared Word Scramble and gets <b>10 Points</b><br/>
                <b>Your score: ${challengerPoints}</b>, ${secondPlayer}'s score: <b>${totalPoints+temp_total}</b>
             `;

             const xcells = document.querySelectorAll("#gametable .row p.marked");
             xcells.forEach(function(elm) {
                 let clss = elm.getAttribute("class");
                 if (clss.includes("greenbox")) {
                     elm.classList.add("zoom");
                 }
             });
             pointsSound.play();
         });

         socket.on('wordPicked', function(w) {
             scrambleValidate(w);
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
             setTimeout(function() { window.location.reload(); }, 1000);
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
             
             if (window.location.href.includes("playgame?gameid=")) {
                 let base = window.location.href.split("?gameid=");
                 window.location.href = base[0];
             } else {
                 window.location.reload();
             }

         });

         socket.on('disconnected', function(data) {
             //console.log(data.id + " disconnected");
         });
     }

 }

 setTimeout(function() {

     let myscripts = document.querySelectorAll("script");
     let ad_found = false;
     myscripts.forEach(function(s) {
         if (!s.src.includes("socket.io.js") && !s.src.includes("howler.min.js") && !s.src.includes("modernizr-custom.js") && !s.src.includes("game.js")) {
             ad_found = true;
         }
     });

     if (ad_found) {
         document.body.innerHTML = "<h4>Server is too busy.</h4> <p>This may be due to several bulk requests from your ISP (or similar) to this page with low bandwidth.</p> <p>Please visit again after sometime, or we recommend you to <b>try from a different ISP (Wifi or 3G/4G)</b></p>";
         document.body.style.padding = "20px";

     } else {
         document.querySelector(".container").classList.remove("show-none");
     }

 }, 2000);