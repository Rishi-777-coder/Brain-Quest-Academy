import React, { useState, useEffect, useRef } from "react";
import "./sudoku-page.css";
import confetti from "canvas-confetti";

function SudokuGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [board, setBoard] = useState([]);
  const [originalBoard, setOriginalBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [gameWon, setGameWon] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [notes, setNotes] = useState(false);
  const [cellNotes, setCellNotes] = useState({});
  const [mistakes, setMistakes] = useState(0);
  const [timer, setTimer] = useState(0);

  const confettiCanvasRef = useRef(null);
  const timerRef = useRef(null);

  // Generate a solved Sudoku board
  const generateSolvedBoard = () => {
    // This is a simplified version - in a real game, you'd use a more sophisticated algorithm
    const validBoard = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ];

    return validBoard;
  };

  // Create a puzzle by removing numbers from the solved board
  const createPuzzle = (solvedBoard, difficulty) => {
    // Clone the solved board
    const puzzle = solvedBoard.map((row) => [...row]);

    // Determine how many cells to remove based on difficulty
    let cellsToRemove;
    switch (difficulty) {
      case "easy":
        cellsToRemove = 30;
        break;
      case "medium":
        cellsToRemove = 45;
        break;
      case "hard":
        cellsToRemove = 55;
        break;
      default:
        cellsToRemove = 30;
    }

    // Randomly remove cells
    let removed = 0;
    while (removed < cellsToRemove) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);

      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = 0;
        removed++;
      }
    }

    return puzzle;
  };

  // Start a new game
  const startGame = () => {
    const solvedBoard = generateSolvedBoard();
    const puzzle = createPuzzle(solvedBoard, difficulty);

    setBoard(puzzle.map((row) => [...row]));
    setOriginalBoard(puzzle.map((row) => [...row]));
    setSelectedCell(null);
    setGameWon(false);
    setGameStarted(true);
    setMistakes(0);
    setTimer(0);
    setCellNotes({});

    // Start timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  // Handle cell click
  const handleCellClick = (row, col) => {
    if (originalBoard[row][col] === 0) {
      setSelectedCell([row, col]);
    }
  };

  // Handle number input
  const handleNumberInput = (num) => {
    if (!selectedCell) return;

    const [row, col] = selectedCell;

    if (originalBoard[row][col] !== 0) return;

    if (notes) {
      // Handle notes mode
      const cellKey = `${row}-${col}`;
      const currentNotes = cellNotes[cellKey] || [];

      // Toggle the number in notes
      const newNotes = currentNotes.includes(num)
        ? currentNotes.filter((n) => n !== num)
        : [...currentNotes, num];

      setCellNotes({
        ...cellNotes,
        [cellKey]: newNotes,
      });
    } else {
      // Regular number input
      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = num;
      setBoard(newBoard);

      // Clear notes for this cell
      const cellKey = `${row}-${col}`;
      if (cellNotes[cellKey]) {
        const newCellNotes = { ...cellNotes };
        delete newCellNotes[cellKey];
        setCellNotes(newCellNotes);
      }

      // Check if the move is valid
      const solvedBoard = generateSolvedBoard();
      if (solvedBoard[row][col] !== num) {
        setMistakes(mistakes + 1);
      }

      // Check if the board is solved
      checkBoardSolved(newBoard);
    }
  };

  // Clear the selected cell
  const clearCell = () => {
    if (!selectedCell) return;

    const [row, col] = selectedCell;

    if (originalBoard[row][col] !== 0) return;

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = 0;
    setBoard(newBoard);

    // Clear notes for this cell
    const cellKey = `${row}-${col}`;
    if (cellNotes[cellKey]) {
      const newCellNotes = { ...cellNotes };
      delete newCellNotes[cellKey];
      setCellNotes(newCellNotes);
    }
  };

  // Check if the board is solved
  const checkBoardSolved = (currentBoard) => {
    // Check if all cells are filled
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (currentBoard[row][col] === 0) {
          return false;
        }
      }
    }

    // Check if the solution is correct
    // For simplicity, we'll compare with the solved board
    const solvedBoard = generateSolvedBoard();

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (currentBoard[row][col] !== solvedBoard[row][col]) {
          return false;
        }
      }
    }

    // Board is solved
    setGameWon(true);
    setShowResult(true);

    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Trigger confetti
    if (confettiCanvasRef.current) {
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    return true;
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const getMistakeClass = () => {
    if (mistakes < 3) return "mistake-low";
    if (mistakes < 6) return "mistake-medium";
    return "mistake-high";
  };

  return (
    <div className="sudoku-container">
      <div className="sudoku-content">
        <h1 className="sudoku-title">Sudoku Challenge</h1>

        {!gameStarted ? (
          <div className="welcome-container">
            <h2 className="welcome-title">Sudoku Challenge</h2>

            <div className="welcome-content">
              <p className="welcome-description">
                Test your logical thinking with a game of Sudoku. Fill the grid so that every row, column, and 3×3 box
                contains the digits 1-9.
              </p>

              <div className="difficulty-selector">
                <label htmlFor="difficulty" className="difficulty-label">
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  className="difficulty-select"
                  onChange={(e) => setDifficulty(e.target.value)}
                  defaultValue="easy"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="how-to-play">
                <h3 className="how-to-play-title">How to Play:</h3>
                <ul className="how-to-play-list">
                  <li>Fill each empty cell with a number from 1-9</li>
                  <li>Each row must contain all digits from 1-9</li>
                  <li>Each column must contain all digits from 1-9</li>
                  <li>Each 3×3 box must contain all digits from 1-9</li>
                  <li>Use notes to keep track of possibilities</li>
                </ul>
              </div>

              <button onClick={startGame} className="start-button">
                Start Game
              </button>
            </div>
          </div>
        ) : (
          <div className="game-container">
            <div className="game-panel">
              <div className="game-info">
                <div className="game-stat">
                  <span className="stat-label">Time: </span>
                  <span className="stat-value">{formatTime(timer)}</span>
                </div>
                <div className="game-stat">
                  <span className="stat-label">Mistakes: </span>
                  <span className={`stat-value ${getMistakeClass()}`}>
                    {mistakes}
                  </span>
                </div>
                <div className="game-controls">
                  <button
                    className={`notes-button ${notes ? "notes-active" : ""}`}
                    onClick={() => setNotes(!notes)}
                  >
                    Notes {notes ? "On" : "Off"}
                  </button>
                </div>
              </div>

              <div className="sudoku-grid">
                {board.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const isOriginal = originalBoard[rowIndex][colIndex] !== 0;
                    const isSelected = selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex;
                    const cellKey = `${rowIndex}-${colIndex}`;
                    const cellNotesList = cellNotes[cellKey] || [];

                    // Determine box borders
                    const isTopEdge = rowIndex % 3 === 0;
                    const isLeftEdge = colIndex % 3 === 0;
                    const isRightEdge = colIndex % 3 === 2;
                    const isBottomEdge = rowIndex % 3 === 2;

                    let cellClass = "sudoku-cell";
                    if (isOriginal) cellClass += " original-cell";
                    if (isSelected) cellClass += " selected-cell";
                    if (isTopEdge) cellClass += " top-edge";
                    if (isLeftEdge) cellClass += " left-edge";
                    if (isRightEdge) cellClass += " right-edge";
                    if (isBottomEdge) cellClass += " bottom-edge";

                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={cellClass}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                      >
                        {cell !== 0 ? (
                          <span className="cell-value">{cell}</span>
                        ) : cellNotesList.length > 0 ? (
                          <div className="notes-grid">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                              <div key={num} className="note-cell">
                                {cellNotesList.includes(num) && (
                                  <span className="note-value">{num}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="number-pad">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    className="number-button"
                    onClick={() => handleNumberInput(num)}
                    disabled={!selectedCell}
                  >
                    {num}
                  </button>
                ))}
                <button
                  className="clear-button"
                  onClick={clearCell}
                  disabled={!selectedCell}
                >
                  Clear
                </button>
              </div>

              <div className="game-actions">
                <button
                  className="new-game-button"
                  onClick={() => {
                    if (timerRef.current) {
                      clearInterval(timerRef.current);
                    }
                    setGameStarted(false);
                  }}
                >
                  New Game
                </button>
                <a href="/" className="back-link">
                  <button className="back-button">
                    Back to Home
                  </button>
                </a>
              </div>
            </div>
          </div>
        )}

        {showResult && (
          <div className="result-overlay" onClick={() => setShowResult(false)}>
            <div className="result-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="result-content">
                <div className="result-emoji">🎉</div>
                <h3 className="result-title">Puzzle Solved!</h3>
                <p className="result-message">
                  You completed the {difficulty} puzzle in {formatTime(timer)} with {mistakes} mistakes.
                </p>

                <div className="result-actions">
                  <button className="play-again-button" onClick={startGame}>Play Again</button>
                  <a href="/" className="home-link">
                    <button className="home-button">Back to Home</button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hidden canvas for confetti */}
        <canvas ref={confettiCanvasRef} className="confetti-canvas" />
      </div>
    </div>
  );
}

export default SudokuGame;