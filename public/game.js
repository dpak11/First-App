 /*jshint esversion: 6*/


 let socket = null;
 /* var btn = document.getElementById("btn");*/
 const cells = document.querySelectorAll("p");
 let singlePlayer = true;
 let rndm = [];
 let bomber = 14;
 let totalPoints = 0;
 let compatableBrowser = false;

const soundCheck = {
    count: 0,
    isLoad: function(){
        this.count++;
        if(this.count == 3 && compatableBrowser){
           socketHandlers();
           randomizer(10); 
           console.log("all sounds loaded")
        }
    }

}
 

 const pointsSound = new Howl({
     src: ['points.mp3', 'points.wav']
 });
 const missoutSound = new Howl({
     src: ['missout.mp3', 'missout.wav']
 });
 const bombSound = new Howl({
     src: ['bombsound.mp3', 'bombsound.wav']
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
     let remainingElts = document.querySelectorAll("p");
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

 const initRandomCells = () => {
     for (let i in rndm) {
         let tabcell = "cell" + rndm[i];
         document.getElementById(tabcell).style.opacity = 1;
         document.getElementById(tabcell).setAttribute("data-active", "on");
     }

     // Bind Events

     cells.forEach(function(elem) {
         elem.addEventListener("click", function(e) {
             e.preventDefault();
             socket.emit('tapped', { msg: "" });
             if (e.target.getAttribute("data-active") == "on") {
                 if (bomber === parseInt(e.target.getAttribute("id").split("cell")[1])) {
                     e.target.addEventListener("animationend", function(e) {
                         e.target.style.opacity = 0;
                     }, false);
                     e.target.classList.add("apply-shake", "redbomb");
                     bombSound.play();
                     shrinkRemaining();

                 } else {
                     e.target.style.background = "url(images/box-green.png) center no-repeat";
                     totalPoints++;
                     document.querySelector("#points span").innerText = totalPoints;
                     pointsSound.play();

                 }
                 e.target.setAttribute("data-active", "off");


             } else if (e.target.getAttribute("data-active") != "off") {
                 e.target.addEventListener("animationend", function(e) {
                     e.target.style.opacity = 0;
                 }, false);
                 e.target.classList.add("disappear");
                 missoutSound.play();


             }

         });

     });
 };


 const randomizer = (n) => {
     let nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
     for (let z = 0; z < n; z++) {
         let rnd_pos = Math.floor(Math.random() * nums.length);
         rndm.push(nums[rnd_pos]);
         nums.splice(rnd_pos, 1);
     }
     bomber = rndm[Math.floor(Math.random() * rndm.length)];
     console.log(bomber);
     initRandomCells();
 };

 if (Modernizr.queryselector) {
     let allclasses = document.querySelector("html").getAttribute("class").trim();
     if (allclasses.includes("no-cssanimations") || allclasses.includes("no-arrow") || allclasses.includes("no-promises") || allclasses.includes("no-classlist") || allclasses.includes("no-opacity") || allclasses.includes("no-csstransforms") || allclasses.includes("no-fetch") || allclasses.includes("no-json")) {
         alert("Sorry, your browser does not support some features.\n Please upgrade to the latest version Google Chrome");
     } else {
         compatableBrowser = true;
     }
     console.log(allclasses);

 } else {
     alert("Sorry, you are using an outdated browser");
 }








 /*  btn.addEventListener('click', function() {
       socket.emit('chatmsg', {
           message: document.getElementById("txtmsg").value
       });

   });*/

 // Listen for events

 function socketHandlers() {
     socket = io();
     socket.on('hellofromserver', function(data) {
         document.getElementById("servertext").innerText = `${data.id} received "${data.msg}"`;
     });

     socket.on('tapReceived', function() {

        

     });

     socket.on('disconnected', function(data) {
         document.getElementById("servertext").innerText = `${data.id} is disconnected"`;
     });

 }