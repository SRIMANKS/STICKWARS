const roll = document.querySelector("#roll");
const kill = document.querySelector("#kill");
const number = document.querySelector("#number");
const p1 = document.querySelector(".score1");
const p2 = document.querySelector(".score2");
const score1 = document.querySelector("#score1");
const score2 = document.querySelector("#score2");
const boxes = document.querySelectorAll(".box");
const boxes1 = document.querySelectorAll(".player1");
const boxes2 = document.querySelectorAll(".player2");
const message = document.querySelector("#message");
const restart = document.querySelector("#restart");
const gameovercard = document.querySelector(".gameover");
const howtoplay = document.querySelector(".howtoplay");
const tossbutton = document.querySelector("#toss");
const round = document.querySelector("#round");
const winner = document.querySelector("#winner");

class player {
  constructor(listofbox, name, score) {
    this.name = name;
    this.score = score;
    this.listofboxes = listofbox;
    this.posval = [0, 0, 0, 0, 0];
    this.points = 0;
  }
  updateScore(s) {
    this.score.innerHTML = s;
  }
}
var player1 = new player(boxes1, p1, score1);
var player2 = new player(boxes2, p2, score2);
var clicked = false;
var cankill = false;
var roundnumber = 1;
var turncount = 0;

imagelist = [];
imagelist[0] = "stickman/part1.png";
imagelist[1] = "stickman/part2.png";
imagelist[2] = "stickman/part3.png";
imagelist[3] = "stickman/part4.png";
imagelist[4] = "stickman/part5.png";

var press = new Audio("/sounds/press.wav");
var killsound = new Audio("/sounds/kill.wav");
var miss = new Audio("/sounds/miss.wav");
var success = new Audio("/sounds/success.wav");
var click = new Audio("/sounds/click.wav");
function toss() {
  var random = Math.floor(Math.random() * 10);
  console.log(random);
  if (random < 5) {
    currentplayer = player1;
    oppsiteplayer = player2;
  } else {
    currentplayer = player2;
    oppsiteplayer = player1;
  }
  currentplayer.name.classList.add("active");
  oppsiteplayer.name.classList.remove("active");
}

function gameover() {
  if (player1.points > player2.points) {
    winner.innerHTML = `player 1 wins with score : ${player1.points}`;
  } else if (player1.points < player2.points) {
    winner.innerHTML = `player 2 wins with score : ${player2.points}`;
  } else {
    winner.innerHTML = `draw`;
  }
  gameovercard.style.display = "flex";
  success.play();
}

function changeplayer() {
  if (turncount == 0) {
    turncount++;
  } else if (turncount == 1) {
    turncount--;
    roundnumber++;
  }
  round.innerHTML = `Round: ${roundnumber}`;

  console.log(roundnumber);
  if (roundnumber <= 30) {
    if (currentplayer == player1) {
      currentplayer = player2;
      oppsiteplayer = player1;
    } else {
      currentplayer = player1;
      oppsiteplayer = player2;
    }
    currentplayer.name.classList.toggle("active");
    oppsiteplayer.name.classList.toggle("active");
  } else {
    gameover();
  }
}

roll.addEventListener("click", () => {
  roll.classList.add("clicked");
  if (!clicked) {
    press.play();
    clicked = true;
    console.log("clicked");
    number.style.opacity = "0";
    setTimeout(() => {
      num = Math.floor(Math.random() * 5) + 1;
      number.style.opacity = "1";
      number.innerHTML = num;
      console.log(num);
      console.log(currentplayer);
      if (currentplayer.posval[num - 1] < 5) {
        if (currentplayer.name === p2 && currentplayer.posval[num - 1] === 4) {
          console.log("right");
          currentplayer.listofboxes[num - 1].style.backgroundImage =
            "url(stickman/rpart5.png)";
        } else {
          currentplayer.listofboxes[num - 1].style.backgroundImage = `url(${
            imagelist[currentplayer.posval[num - 1]]
          })`;
        }
        currentplayer.posval[num - 1]++;
        currentplayer.points++;
        currentplayer.updateScore(currentplayer.points);
        changeplayer();
        cankill = false;
        message.innerHTML = "";
      } else {
        cankill = true;
        message.innerHTML = "kill or roll ?";
      }
      clicked = false;
      roll.classList.remove("clicked");
    }, 900);
  }
});

kill.addEventListener("click", () => {
  if (cankill) {
    click.play();
    clicked = true;
    kill.classList.add("clicked");
    number.style.opacity = "0";
    setTimeout(() => {
      message.innerHTML = "choose box to shoot";
      oppsiteplayer.listofboxes.forEach((e) => {
        e.style.backgroundColor = "crimson";
      });
      kill.classList.remove("clicked");
    }, 900);
  } else {
    message.innerHTML = "cannot kill";
  }
});

boxes.forEach((b, i) => {
  b.addEventListener("click", () => {
    if (cankill) {
      console.log(b, i);
      var missed = Math.floor(Math.random() * 2);
      console.log(`miss : ${miss}`);
      if (missed < 1) {
        if (i % 2 == 0 && oppsiteplayer == player1) {
          b.style.backgroundImage = "none";
          player1.posval[i / 2] = 0;
          console.log(player1.posval);
          cankill = false;
          clicked = false;
          killsound.play();
          oppsiteplayer.listofboxes.forEach((e) => {
            e.style.backgroundColor = "#efefef";
          });
          oppsiteplayer.points -= 5;
          oppsiteplayer.updateScore(oppsiteplayer.points);
          currentplayer.points++;
          currentplayer.updateScore(currentplayer.points);
          changeplayer();
          console.log("player changed.");
        }
        if (i % 2 !== 0 && oppsiteplayer == player2) {
          b.style.backgroundImage = "none";
          player2.posval[(i - 1) / 2] = 0;
          console.log(player2.posval);
          cankill = false;
          clicked = false;
          killsound.play();
          oppsiteplayer.listofboxes.forEach((e) => {
            e.style.backgroundColor = "#efefef";
          });
          oppsiteplayer.points -= 5;
          oppsiteplayer.updateScore(oppsiteplayer.points);
          currentplayer.points++;
          currentplayer.updateScore(currentplayer.points);
          changeplayer();
          console.log("player changed.");
        }
        message.innerHTML = "";
      } else {
        miss.play();
        message.innerHTML = "missed";
        cankill = false;
        clicked = false;
        oppsiteplayer.listofboxes.forEach((e) => {
          e.style.backgroundColor = "#efefef";
        });
        changeplayer();
      }
      roll.classList.remove("clicked");
    }
  });
});

restart.addEventListener("click", () => {
  restart.classList.add("clicked");
  click.play();
  setTimeout(() => {
    gameovercard.style.display = "none";
    player1.posval = [0, 0, 0, 0, 0];
    player2.posval = [0, 0, 0, 0, 0];
    player1.points = 0;
    player2.points = 0;
    player1.updateScore(player1.points);
    player2.updateScore(player2.points);
    number.innerHTML = "";

    player1.listofboxes.forEach((e) => {
      e.style.backgroundImage = "none";
    });
    player2.listofboxes.forEach((e) => {
      e.style.backgroundImage = "none";
    });
    player1.name.classList.remove("active");
    player2.name.classList.remove("active");
    console.log(player1);
    roundnumber = 1;
    message.innerHTML = "";
    roll.classList.remove("clicked");
    gameovercard.style.display = "none";
    howtoplay.style.display = "flex";
    restart.classList.remove("clicked");
  }, 900);
});

tossbutton.addEventListener("click", () => {
  tossbutton.classList.add("clicked");
  click.play();
  setTimeout(() => {
    howtoplay.style.display = "none";
    tossbutton.classList.remove("clicked");
    toss();
  }, 900);
});
