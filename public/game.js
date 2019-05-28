let socket = io();
/* var btn = document.getElementById("btn");*/
let cells = document.querySelectorAll("p");
let currentElt;
let singlePlayer = true;
let rndm = [];
let bomber = 14;
let cellsLoop = 0;
let totalPoints = 0;

/*const pointsSound = new Audio("points.mp3");
const missoutSound = new Audio("missout.mp3");
const bombSound = new Audio("bombsound.mp3");*/

const pointsSound = new Howl({
  src: ['points.mp3', 'points.wav']
});
const missoutSound = new Howl({
  src: ['missout.mp3', 'missout.wav']
});
const bombSound = new Howl({
  src: ['bombsound.mp3', 'bombsound.wav']
});

if (Modernizr.queryselector) {
    let allclasses = document.querySelector("html").getAttribute("class").trim();
    if(allclasses.includes("no-")){
        alert("Please upgrade your browser to Google Chrome");
        alert(allclasses)
    }
   console.log(allclasses);

}else{
    alert("To play this game, you must have latest version of Google Chrome browser")
}

const vaporizeRemaining = () => {
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
            e.classList.add("implode")
        }

    })


}

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
            currentElt = e.target;
            socket.emit('tapped', { msg: "" });
            if (e.target.getAttribute("data-active") == "on") {
                if (bomber === parseInt(e.target.getAttribute("id").split("cell")[1])) {
                    e.target.classList.add("apply-shake", "redbomb");
                    bombSound.play();
                    vaporizeRemaining();

                } else {
                    e.target.style.background = "url(images/box-green.png) center no-repeat";
                    totalPoints++;
                    document.querySelector("#points span").innerText = totalPoints;                    
                    pointsSound.play();
                    
                    
                }
                e.target.setAttribute("data-active", "off");


            } else if (e.target.getAttribute("data-active") != "off") {
                e.target.addEventListener("animationend", function(e) {
                    e.target.style.opacity = 0
                }, false);
                e.target.classList.add("disappear");
                missoutSound.play();
                /*if(pointsSound.paused){
                        pointsSound.play(1);
                    }else{
                        pointsSound.play(1);
                    }*/

            }

        });

    });
}


const randomizer = (n) => {
    let nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
    for (let z = 0; z < n; z++) {
        let rnd_pos = Math.floor(Math.random() * nums.length);
        rndm.push(nums[rnd_pos]);
        nums.splice(rnd_pos, 1)
    }
    bomber = rndm[Math.floor(Math.random() * rndm.length)];
    console.log(bomber);
    initRandomCells();
}


randomizer(10);





/*  btn.addEventListener('click', function() {
      socket.emit('chatmsg', {
          message: document.getElementById("txtmsg").value
      });

  });*/

// Listen for events
socket.on('hellofromserver', function(data) {
    document.getElementById("servertext").innerText = `${data.id} received "${data.msg}"`;
});

socket.on('tapReceived', function() {

    //currentElt.style.background = "url(images/box-green.png)"

});

socket.on('disconnected', function(data) {
    document.getElementById("servertext").innerText = `${data.id} is disconnected"`;
});