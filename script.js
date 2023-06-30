function GameBoard() {
  //create array for the board of tictactoe
  const board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  //function to provide the tictactoe board
  const getBoard = () => board;

  const dropMarker = (column, row, marker) => {
    board[row][column] = marker;
  };

  //return methods of the module
  return {
    getBoard,
    dropMarker,
  };
}

//module which controls the overall gameplay
function GameController(player1 = "Player 1", marker1 = "X", player2 = "Player 2", marker2 = "O") {
  const board = GameBoard();

  //array of objects which stores players name and the marker they choose to play with
  const players = [
    {
      playerName: player1,
      marker: marker1,
    },
    {
      playerName: player2,
      marker: marker2,
    },
  ];

  //get player from the marker
  const getPlayer = (mark) => {
    if (mark === players[0].marker) return players[1].playerName;
    else return players[0].playerName;
  };

  //variable that stores the record of which player turn it is
  let activePlayer = players[1];

  //function to switch the turn of the player
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  //function to provide active player
  const getActivePlayer = () => activePlayer;

  //function to check the winner of the game
  const checkWinner = () => {
    const playBoard = board.getBoard();

    //for rows
    for (let row = 0; row < 3; row++) {
      if (playBoard[row][0] === playBoard[row][1] && playBoard[row][1] === playBoard[row][2] && playBoard[row][0] != "") {
        return { win: true, player: getPlayer(playBoard[row][0]) };
      }
    }

    //for columns
    for (let column = 0; column < 3; column++) {
      if (playBoard[0][column] === playBoard[1][column] && playBoard[1][column] === playBoard[2][column] && playBoard[0][column] != "") {
        return { win: true, player: getPlayer(playBoard[0][column]) };
      }
    }

    //for diagonals
    if (playBoard[0][0] === playBoard[1][1] && playBoard[1][1] === playBoard[2][2] && playBoard[0][0] != "") {
      return { win: true, player: getPlayer(playBoard[0][0]) };
    }

    if (playBoard[0][2] === playBoard[1][1] && playBoard[1][1] === playBoard[2][0] && playBoard[0][2] != "") {
      return { win: true, player: getPlayer(playBoard[0][2]) };
    }

    //No Winner
    if (isBoardFull()) {
      return { win: true, player: "Draw" };
    }

    function isBoardFull() {
      let count = 0;
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          if (playBoard[row][col] === "") {
            count++;
          }
        }
      }
      if (count === 0) return true;
      else return false;
    }
  };

  const playRound = (row, column) => {
    board.dropMarker(column, row, getActivePlayer().marker);
    switchPlayerTurn();
  };

  const clearBoard = (board) => {
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        board[row][column] = "";
      }
    }
  };

  return {
    getActivePlayer,
    checkWinner,
    playRound,
    clearBoard,
    getBoard: board.getBoard,
    players,
  };
}

const ScreenController = (() => {
  const gameMode = document.querySelector("#vsPlayerBtn");
  const preGameUI = document.querySelector(".pre-game-interface");
  const gameUI = document.querySelector(".game-interface");
  const playerUI = document.querySelector(".player-selection-interface");
  const returnToPreGame = document.querySelector("#return");
  const playAgain = document.querySelector("#replay");
  const winnerDisplay = document.querySelector(".game-result");
  const playbtn = document.querySelector("#play");
  const inputs = document.querySelectorAll("input");
  let activePlayer1 = document.querySelector(".player1");
  let activePlayer2 = document.querySelector(".player2");

  let player1 = "",
    marker1 = "",
    player2 = "",
    marker2 = "";

  let game, board, activePlayer;
  gameMode.addEventListener("click", (e) => {
    preGameUI.classList.add("pre-game-display");
    playerUI.classList.remove("player-selection-display");
  });

  playbtn.addEventListener("click", (e) => {
    player1 = inputs[0].value;
    player2 = inputs[3].value;
    marker1 = inputs[1].checked ? inputs[1].value : inputs[2].value;
    marker2 = inputs[4].checked ? inputs[4].value : inputs[5].value;

    if (player1 !== "" || player2 !== "") {
      activePlayer1.textContent = player1;
      activePlayer2.textContent = player2;
    } else {
      activePlayer1.textContent = "Player 1";
      activePlayer2.textContent = "Player 2";
    }

    if (player1 === "" || player2 === "") {
      game = GameController();
    } else game = GameController(player1, marker1, player2, marker2);

    board = game.getBoard();

    playerUI.classList.add("player-selection-display");
    gameUI.classList.remove("game-display");
  });

  returnToPreGame.addEventListener("click", (e) => {
    preGameUI.classList.remove("pre-game-display");
    gameUI.classList.add("game-display");
    inputs[0].value = "";
    inputs[3].value = "";
    clearScreen(e);
  });

  const columns = document.querySelectorAll("td");

  function clickHandler(event) {
    const col = parseInt(event.target.dataset.col);
    const rowNode = event.target.parentNode;
    const row = parseInt(rowNode.dataset.row);

    if (board[row][col] === "") {
      game.playRound(row, col);

      this.textContent = game.getActivePlayer().marker;

      activePlayer1.classList.toggle("active");
      activePlayer2.classList.toggle("active");

      let winner = game.checkWinner();

      if (winner != undefined && winner.win) {
        if (winner.player !== "Draw") {
          winnerDisplay.textContent = `${winner.player} Wins the Game`;
          activePlayer1.classList.remove("active");
          activePlayer2.classList.remove("active");
        }
        if (winner.player === "Draw") {
          winnerDisplay.textContent = `Match is Draw`;
        }
        columns.forEach((column) => {
          column.removeEventListener("click", clickHandler);
        });
      }
    }
  }

  function clearScreen(event) {
    game.clearBoard(board);
    winnerDisplay.textContent = "";
    activePlayer1.classList.add("active");
    columns.forEach((column) => {
      column.textContent = "";
    });
    columns.forEach((column) => {
      column.addEventListener("click", clickHandler);
    });
  }

  columns.forEach((column) => {
    column.addEventListener("click", clickHandler);
  });

  playAgain.addEventListener("click", clearScreen);
})();
