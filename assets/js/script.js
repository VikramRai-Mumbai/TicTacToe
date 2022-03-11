var origBoard;
const humanPlayer = 'O';
const compPlayer = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');

startGame();
function startGame() {

	if (localStorage.scoreX) {
		scoreX = localStorage.scoreX;
		document.getElementById("computer-score").innerHTML = scoreX;
	  } else {
		localStorage.scoreX = 0;
		document.getElementById("computer-score").innerHTML = localStorage.scoreX;
	  }
	  if (localStorage.scoreO) {
		scoreO = localStorage.scoreO;
		document.getElementById("human-score").innerHTML = localStorage.scoreO;
	  } else {
		localStorage.scoreO = 0;
		document.getElementById("human-score").innerHTML = localStorage.scoreO;
	  }
	  if (localStorage.scoreTie) {
		scoreTie = localStorage.scoreTie;
		document.getElementById("tie-score").innerHTML = localStorage.scoreTie;
	  } else {
		localStorage.scoreTie = 0;
		document.getElementById("tie-score").innerHTML = localStorage.scoreTie;
	  }
	  if (localStorage.scoreHighest) {
		 if(localStorage.scoreX>localStorage.scoreHighest){localStorage.scoreHighest = localStorage.scoreX;}
		 if(localStorage.scoreO>localStorage.scoreHighest){localStorage.scoreHighest = localStorage.scoreO;}
		scoreHighest = localStorage.scoreHighest;
		document.getElementById("highest-score").innerHTML = localStorage.scoreHighest;
	  } else {
		localStorage.scoreHighest = 0;
		document.getElementById("highest-score").innerHTML = localStorage.scoreHighest;
	  }


	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());	//Initialize Board array with 0-8 number 
	game_start();
	console.log(cells);
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');	//Remove Background Color after Game over
		cells[i].addEventListener('click', turnClick, false);
	}
	//document.querySelector(".score_cal").style.display = "none";	//Hide Score Board
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, humanPlayer)	//Turn of Human Player
		if (!checkWin(origBoard, humanPlayer) && !checkTie()) turn(bestSpot(), compPlayer);	//Turn of Computer
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	play_audio();
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)	// If game is Won call the Gameover function with gamewon as argument
}


 
  if (localStorage.scoreTie) {
	scoreTie = localStorage.scoreTie;
	document.getElementById("tie-score").innerHTML = localStorage.scoreTie;
  } else {
	localStorage.scoreTie = 0;
	document.getElementById("tie-score").innerHTML = 0;
  }
  
    if (typeof Storage !== "undefined") {
    if (localStorage.scoreO) {
      localStorage.scoreO = Number(localStorage.scoreO) + 1;
    } else {
      localStorage.scoreO = 1;
    }
    document.getElementById("human-score").innerHTML = localStorage.scoreO;
  }



function checkWin(board, player) {

	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;

}

function gameOver(gameWon) {

	for (let index of winCombos[gameWon.index]) {	//Highlight the Winning Indexes
		document.getElementById(index).style.backgroundColor =
			gameWon.player == humanPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {	// Remove the Event Listener
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == humanPlayer ? "You win!" : "You lose."); 	//Declare Winner
}


// declare who is winner
function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";		//Display the Winner without Text
	if(who==="You win!")	// Increment the counter of Winner
	{
		if (localStorage.scoreO) {
			localStorage.scoreO = Number(localStorage.scoreO) + 1;
		  } else {
			localStorage.scoreO = 1;
		  }
		  if (localStorage.scoreHighest) {
			if(localStorage.scoreX>localStorage.scoreHighest){localStorage.scoreHighest = localStorage.scoreX;}
			if(localStorage.scoreO>localStorage.scoreHighest){localStorage.scoreHighest = localStorage.scoreO;}
		   scoreHighest = localStorage.scoreHighest;
		   document.getElementById("highest-score").innerHTML = localStorage.scoreHighest;
		 } else {
		   localStorage.scoreHighest = 0;
		   document.getElementById("highest-score").innerHTML = localStorage.scoreHighest;
		 }
	play_win();
	}
	else if(who=="You lose.")
	{
		if (localStorage.scoreX) {
			localStorage.scoreX = Number(localStorage.scoreX) + 1;
		  } else {
			localStorage.scoreX = 1;
		  }
		  if (localStorage.scoreHighest) {
			if(localStorage.scoreX>localStorage.scoreHighest){localStorage.scoreHighest = localStorage.scoreX;}
			if(localStorage.scoreO>localStorage.scoreHighest){localStorage.scoreHighest = localStorage.scoreO;}
		   scoreHighest = localStorage.scoreHighest;
		   document.getElementById("highest-score").innerHTML = localStorage.scoreHighest;
		 } else {
		   localStorage.scoreHighest = 0;
		   document.getElementById("highest-score").innerHTML = localStorage.scoreHighest;
		 }
	
	play_win();
	}
	else 
	{
		if (localStorage.scoreTie) {
			localStorage.scoreTie = Number(localStorage.scoreTie) + 1;
		  } else {
			localStorage.scoreTie = 1;
		  }

	game_tie();
	}
	document.getElementById("computer-score").innerText = localStorage.scoreX;
	document.getElementById("human-score").innerText = localStorage.scoreO;
	document.getElementById("tie-score").innerText = localStorage.scoreTie;
	
	if(document.querySelector(".endgame").style.display){
		document.querySelector(".score_cal").style.display = "block"; 	//Display Score Board
	}
	document.querySelector(".endgame .text").innerText = who;	//Display the Winnner with Text
	
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');		//Find the Empty squares
}

function bestSpot() {
	return minimax(origBoard, compPlayer).index;		//Returns the an Object with index as property
}

function checkTie() {
	if (emptySquares().length == 0) {	//Check if there is any empty square left or not
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";	//If game is scoreTie then fill the background with green
			cells[i].removeEventListener('click', turnClick, false);	//Remove the Event Listener
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, humanPlayer)) {	//Check for terminal State
		return {score: -10};
	} else if (checkWin(newBoard, compPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	//console.log("Available Spots Length :"+availSpots.length);
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == compPlayer) {
			var result = minimax(newBoard, humanPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, compPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === compPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}

function newGame() {
	
	if (localStorage.scoreO) {
	  localStorage.removeItem("scoreO");
	  document.getElementById("human-score").innerHTML == 0;
	}
	if (localStorage.scoreX) {
	  localStorage.removeItem("scoreX");
	  document.getElementById("computer-score").innerHTML == 0;
	}
	if (localStorage.scoreTie) {
		localStorage.removeItem("scoreTie");
		document.getElementById("tie-score").innerHTML == 0;
	  }
	  if (localStorage.scoreHighest) {
		localStorage.removeItem("scoreHighest");
		document.getElementById("highest-score").innerHTML == 0;
	  }
	location.reload();
  }


function play_audio(){

	let audio=new Audio('./assets/music/click3.wav');
	audio.volume = 0.5;
	audio.play();
	}
	function play_win(){
	
		let audio=new Audio('./assets/music/Tada-sound.mp3');
		audio.volume = 0.2;
		audio.play();
		}
		function game_start(){
	
			let audio=new Audio('./assets/music/start_new.wav');
			audio.volume = 0.2;
			audio.play();
			}
			function game_tie(){
	
				let audio=new Audio('./assets/music/tie.mp3');
				audio.play();
				}

	
				
					  
					 
				
					
				  