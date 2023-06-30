function GameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;
  const dropMarker = (column, rows, marker) => {
    const availableCells = board.filter((row) => row[column].getValue() === "").map((row) => row[column]);
    if (!availableCells.length) return;

    board[rows][column].addMarker(marker);
  };

  return { getBoard, dropMarker };
}

function Cell() {
  let value = "";
  const addMarker = (marker) => {
    value = marker;
  };
  const getValue = () => value;
  return {
    addMarker,
    getValue,
  };
}

function GameController(playerOneName = "Player One", playerTwoName = "player Two") {
  const players = [
    {
      name: playerOneName,
      marker: "X",
    },
    {
      name: playerTwoName,
      marker: "O",
    },
  ];

  const board = GameBoard();

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const playRound = (rows, column) => {
    board.dropMarker(column, rows, getActivePlayer().marker);
    switchPlayerTurn();
  };
  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
  };
}

const ScreenController = (() => {
  const gameMode = document.querySelector("#vsPlayerBtn");
  const preGameUI = document.querySelector(".pre-game-interface");
  const gameUI = document.querySelector(".game-interface");
  const returnToPreGame = document.querySelector("#return");
  const playAgain = documnent.querySelector("#replay");
  const columns = document.querySelectorAll("td");
  const game = GameController();
  const board = game.getBoard();
  const activePlayer = game.getActivePlayer();

  gameMode.addEventListener("click", (e) => {
    preGameUI.classList.add("pre-game-display");
    gameUI.classList.remove("game-display");
  });

  returnToPreGame.addEventListener("click", (e) => {
    preGameUI.classList.remove("pre-game-display");
    gameUI.classList.add("game-display");
  });

  function clickHandler(event) {
    const selectedColumn = event.target.dataset.index;
    const rowNode = event.target.parentNode;
    const row = rowNode.dataset.value;
    game.playRound(row, selectedColumn);

    columns.textContent = activePlayer.marker;
  }

  function clearScreen(event) {
    columns.forEach((column) => {
      column.textContent = "";
    });
  }

  columns.forEach((column) => {
    column.addEventListener("click", clickHandler);
  });
})();
