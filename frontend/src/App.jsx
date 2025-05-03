import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    // console.log('handleClick', i);
    onPlay(i);
    return;
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [prevClick, setPrevClick] = useState(null);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(i) {
    if (calculateWinner(currentSquares)) {
      return;
    }
    const nextSquares = currentSquares.slice();
    if (currentMove < 6) {
      if (currentSquares[i]) {
        return;
      }
      nextSquares[i] = xIsNext? 'X' : 'O';
    } else if (prevClick !== null) {
      const prev = prevClick;
      setPrevClick(null);
      if (!isValidMove(prev, i, currentSquares, xIsNext)) {
        return;
      }
      nextSquares[i] = xIsNext ? 'X' : 'O';
      nextSquares[prev] = null;
    } else {
      setPrevClick(i);
      return;
    }

    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function isValidMove(source, dest, squares, xIsNext) {
  // console.log(source, dest);
  const adjacentSquares = [
    [false, true,  false,
     true,  true,  false, 
     false, false, false],
    [true,  false, true,  
     true,  true,  true,  
     false, false, false],
    [false, true,  false, 
     false, true,  true,  
     false, false, false],
    [true,  true,  false,
     false, true,  false,
     true,  true,  false],
    [true,  true,  true,
     true,  false, true,  
     true,  true,  true ],
    [false, true,  true,  
     false, true,  false, 
     false, true,  true ],
    [false, false, false, 
     true,  true,  false, 
     false, true,  false],
    [false, false, false, 
     true,  true,  true,  
     true,  false, true ],
    [false, false, false, 
     false, true,  true,  
     false, true,  false],
  ]

  const currentPiece = xIsNext ? 'X' : 'O';
  
  if (squares[source] !== currentPiece || squares[dest]) {
    // console.log('false check 1');
    return false;
  }
  
  if (!adjacentSquares[source][dest]) {
    // console.log('false check 2');
    return false;
  }
  
  const nextSquares = squares.slice();
  nextSquares[dest] = squares[source];
  nextSquares[source] = null;
  if (squares[4] === currentPiece && source !== 4 && !calculateWinner(nextSquares)) {
    // console.log('false check 3');
    return false;
  }
  return true;
}