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
function GameController(player1 = "Ram", marker1 = "X", player2 = "Hari", marker2 = "O") {
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
  let activePlayer = players[0];

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
  };
}

const ScreenController = (() => {
  const gameMode = document.querySelector("#vsPlayerBtn");
  const preGameUI = document.querySelector(".pre-game-interface");
  const gameUI = document.querySelector(".game-interface");
  const returnToPreGame = document.querySelector("#return");
  const playAgain = document.querySelector("#replay");
  const winnerDisplay = document.querySelector(".game-result");

  gameMode.addEventListener("click", (e) => {
    preGameUI.classList.add("pre-game-display");
    gameUI.classList.remove("game-display");
  });

  returnToPreGame.addEventListener("click", (e) => {
    preGameUI.classList.remove("pre-game-display");
    gameUI.classList.add("game-display");
    clearScreen(e);
  });

  const game = GameController();
  const board = game.getBoard();
  const activePlayer = game.getActivePlayer();
  const columns = document.querySelectorAll("td");

  function clickHandler(event) {
    const col = parseInt(event.target.dataset.col);
    const rowNode = event.target.parentNode;
    const row = parseInt(rowNode.dataset.row);

    if (board[row][col] === "") {
      game.playRound(row, col);

      this.textContent = game.getActivePlayer().marker;

      let winner = game.checkWinner();
      console.log(winner);

      if (winner != undefined && winner.win) {
        if (winner.player !== "Draw") {
          winnerDisplay.textContent = `${winner.player} Wins the Game`;
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
