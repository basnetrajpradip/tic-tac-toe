function ScreenController() {
  const gameMode = document.querySelector("#vsPlayerBtn");
  const preGameUI = document.querySelector(".pre-game-interface");
  const gameUI = document.querySelector(".game-interface");
  const returnToPreGame = document.querySelector("#return");
  gameMode.addEventListener("click", (e) => {
    preGameUI.classList.add("pre-game-display");
    gameUI.classList.remove("game-display");
  });

  returnToPreGame.addEventListener("click", (e) => {
    preGameUI.classList.remove("pre-game-display");
    gameUI.classList.add("game-display");
  });
}

ScreenController();
