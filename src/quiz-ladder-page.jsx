// KnowledgeLadder.jsx
import React, { useState, useRef, useEffect } from "react";
import "./quiz-ladder-page.css";
import confetti from "canvas-confetti";

// Define types
const playerColors = ["player-indigo", "player-rose", "player-emerald", "player-amber", "player-purple"];

// Sample questions
const sampleQuestions = [
  // Computer Science Questions
  {
    id: 1,
    text: "What does CPU stand for?",
    options: [
      "Central Processing Unit",
      "Computer Personal Unit",
      "Central Process Utility",
      "Central Processor Utility",
    ],
    correctAnswer: 0,
    difficulty: "easy",
    subject: "cs",
  },
  {
    id: 2,
    text: "Which of these is NOT a programming language?",
    options: ["Java", "Python", "HTML", "Photoshop"],
    correctAnswer: 3,
    difficulty: "easy",
    subject: "cs",
  },
  {
    id: 3,
    text: "What is the binary representation of the decimal number 10?",
    options: ["1010", "1000", "1100", "1001"],
    correctAnswer: 0,
    difficulty: "medium",
    subject: "cs",
  },
  {
    id: 4,
    text: "What does HTTP stand for?",
    options: [
      "HyperText Transfer Protocol",
      "High Tech Transfer Protocol",
      "Hyperlink Text Transfer Protocol",
      "HyperText Transmission Protocol",
    ],
    correctAnswer: 0,
    difficulty: "medium",
    subject: "cs",
  },
  {
    id: 5,
    text: "Which data structure operates on a Last-In-First-Out (LIFO) principle?",
    options: ["Queue", "Stack", "Linked List", "Tree"],
    correctAnswer: 1,
    difficulty: "hard",
    subject: "cs",
  },

  // Math Questions
  {
    id: 6,
    text: "What is the value of π (pi) to two decimal places?",
    options: ["3.14", "3.41", "3.12", "3.16"],
    correctAnswer: 0,
    difficulty: "easy",
    subject: "math",
  },
  {
    id: 7,
    text: "What is the derivative of x²?",
    options: ["2x", "x²", "2", "x"],
    correctAnswer: 0,
    difficulty: "medium",
    subject: "math",
  },
  {
    id: 8,
    text: "If x + 3 = 8, what is the value of x?",
    options: ["3", "5", "8", "11"],
    correctAnswer: 1,
    difficulty: "easy",
    subject: "math",
  },
  {
    id: 9,
    text: "What is the integral of 2x?",
    options: ["x² + C", "2x² + C", "x² / 2 + C", "2x + C"],
    correctAnswer: 0,
    difficulty: "medium",
    subject: "math",
  },
  {
    id: 10,
    text: "What is the derivative of sin(x)?",
    options: ["cos(x)", "-sin(x)", "tan(x)", "-cos(x)"],
    correctAnswer: 0,
    difficulty: "hard",
    subject: "math",
  },
  // General Knowledge Questions
  {
    id: 13,
    text: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    correctAnswer: 1,
    difficulty: "easy",
    subject: "gk",
  },
  {
    id: 14,
    text: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    difficulty: "easy",
    subject: "gk",
  },
  // Biology Questions
  {
    id: 18,
    text: "What is the largest organ in the human body?",
    options: ["Heart", "Brain", "Liver", "Skin"],
    correctAnswer: 3,
    difficulty: "easy",
    subject: "bio",
  },
  // History Questions
  {
    id: 24,
    text: "Who was the first President of the United States?",
    options: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "John Adams"],
    correctAnswer: 1,
    difficulty: "easy",
    subject: "history",
  },
  // Science Questions
  {
    id: 28,
    text: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
    difficulty: "medium",
    subject: "science",
  }
];

// Dice components
const Dice1 = () => <div className="dice">⚀</div>;
const Dice2 = () => <div className="dice">⚁</div>;
const Dice3 = () => <div className="dice">⚂</div>;
const Dice4 = () => <div className="dice">⚃</div>;
const Dice5 = () => <div className="dice">⚄</div>;
const Dice6 = () => <div className="dice">⚅</div>;
const Home = () => <div className="home-icon">🏠</div>;

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div className="dialog-overlay" onClick={() => onOpenChange(false)}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children, className }) => {
  return <div className={`dialog-content-inner ${className || ""}`}>{children}</div>;
};

const DialogHeader = ({ children }) => <div className="dialog-header">{children}</div>;
const DialogTitle = ({ children }) => <h2 className="dialog-title">{children}</h2>;
const DialogDescription = ({ children }) => <p className="dialog-description">{children}</p>;

const Button = ({ children, onClick, disabled, className }) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={`button ${className || ""} ${disabled ? "button-disabled" : ""}`}
    >
      {children}
    </button>
  );
};

const Input = ({ value, onChange, placeholder, className }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`input ${className || ""}`}
    />
  );
};

const Label = ({ children, htmlFor, className }) => {
  return (
    <label htmlFor={htmlFor} className={`label ${className || ""}`}>
      {children}
    </label>
  );
};

const Select = ({ onValueChange, defaultValue, children }) => {
  return (
    <select 
      onChange={(e) => onValueChange(e.target.value)} 
      defaultValue={defaultValue}
      className="select"
    >
      {children}
    </select>
  );
};

const SelectTrigger = ({ children, className }) => {
  return <div className={`select-trigger ${className || ""}`}>{children}</div>;
};

const SelectValue = ({ placeholder }) => {
  return <span className="select-value">{placeholder}</span>;
};

const SelectContent = ({ children, className }) => {
  return <div className={`select-content ${className || ""}`}>{children}</div>;
};

const SelectItem = ({ value, children }) => {
  return <option value={value}>{children}</option>;
};

function KnowledgeLadderGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerSetup, setPlayerSetup] = useState(true);
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState(["Player 1", "Player 2"]);
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [questionBoxes, setQuestionBoxes] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [resultEmoji, setResultEmoji] = useState("");
  const [singlePlayerMode, setSinglePlayerMode] = useState(false);
  const [botThinking, setBotThinking] = useState(false);

  const confettiCanvasRef = useRef(null);

  // Handle player count change
  const handlePlayerCountChange = (value) => {
    const count = Number.parseInt(value);
    setPlayerCount(count);

    // Update player names array
    const newNames = [...playerNames];
    if (count > playerNames.length) {
      // Add more players
      for (let i = playerNames.length; i < count; i++) {
        newNames.push(`Player ${i + 1}`);
      }
    } else {
      // Remove excess players
      newNames.splice(count);
    }
    setPlayerNames(newNames);
  };

  // Handle player name change
  const handlePlayerNameChange = (index, name) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  // Handle single player mode toggle
  const handleSinglePlayerModeChange = (value) => {
    setSinglePlayerMode(value === "true");
  };

  // Start the game
  const startGame = () => {
    // Create players
    const gamePlayers = [];

    if (singlePlayerMode) {
      // Single player + bot
      gamePlayers.push({
        id: 1,
        name: playerNames[0] || "Player 1",
        position: 0,
        color: playerColors[0],
        isBot: false,
      });

      // Add bots
      for (let i = 1; i < playerCount; i++) {
        gamePlayers.push({
          id: i + 1,
          name: `Bot ${i}`,
          position: 0,
          color: playerColors[i],
          isBot: true,
        });
      }
    } else {
      // Multiple human players
      for (let i = 0; i < playerCount; i++) {
        gamePlayers.push({
          id: i + 1,
          name: playerNames[i] || `Player ${i + 1}`,
          position: 0,
          color: playerColors[i],
          isBot: false,
        });
      }
    }

    setPlayers(gamePlayers);
    setPlayerSetup(false);
    setGameStarted(true);

    // Generate question boxes
    generateQuestionBoxes();
  };

  // Generate question boxes (about 40% of the board)
  const generateQuestionBoxes = () => {
    const boxes = [];
    const totalBoxes = 100;
    const questionCount = 40; // 40% of boxes have questions

    // Create an array of positions (excluding start and finish)
    const positions = Array.from({ length: totalBoxes - 2 }, (_, i) => i + 1);

    // Shuffle the array
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    // Take the first questionCount positions
    const questionPositions = positions.slice(0, questionCount);

    // Create question boxes
    questionPositions.forEach((position, index) => {
      boxes.push({
        position,
        question: sampleQuestions[index % sampleQuestions.length],
      });
    });

    setQuestionBoxes(boxes);
  };

  const rollDice = () => {
    if (isRolling || showQuestion || botThinking) return;

    setIsRolling(true);

    // Simulate dice rolling animation
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
    }, 100);

    // Stop rolling after 1 second
    setTimeout(() => {
      clearInterval(rollInterval);
      const finalValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(finalValue);
      movePlayer(finalValue);
      setIsRolling(false);
    }, 1000);
  };

  const movePlayer = (steps) => {
    const currentPlayer = players[currentPlayerIndex];
    let newPosition = currentPlayer.position + steps;

    // Ensure position doesn't exceed 100
    if (newPosition > 100) {
      newPosition = 100;
    }

    // Update player position
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex] = {
      ...currentPlayer,
      position: newPosition,
    };
    setPlayers(updatedPlayers);

    // Check if player landed on a question box
    const questionBox = questionBoxes.find((box) => box.position === newPosition);
    if (questionBox) {
      setCurrentQuestion(questionBox.question);
      setShowQuestion(true);

      // If it's a bot, automatically answer after a delay
      if (currentPlayer.isBot) {
        setBotThinking(true);

        // Bot has 60-80% chance to answer correctly (improved bot logic)
        const botSkillLevel = 0.6 + Math.random() * 0.2;
        const isCorrect = Math.random() < botSkillLevel;

        // Bot takes 2-4 seconds to "think" before answering
        const thinkingTime = 2000 + Math.random() * 2000;

        setTimeout(() => {
          handleBotAnswer(isCorrect, questionBox.question);
          setBotThinking(false);
        }, thinkingTime);
      }
    } else {
      // Move to next player if no question
      nextPlayer();
    }

    // Check if game is over
    if (newPosition === 100) {
      setGameOver(true);
      setWinner(currentPlayer);
    }
  };

  const handleBotAnswer = (isCorrect, question) => {
    const currentPlayer = players[currentPlayerIndex];
    const updatedPlayers = [...players];

    if (isCorrect) {
      // Correct answer - advance based on difficulty
      let advanceSteps = 0;
      switch (question.difficulty) {
        case "easy":
          advanceSteps = 3;
          break;
        case "medium":
          advanceSteps = 5;
          break;
        case "hard":
          advanceSteps = 8;
          break;
      }

      let newPosition = currentPlayer.position + advanceSteps;
      if (newPosition > 100) newPosition = 100;

      updatedPlayers[currentPlayerIndex] = {
        ...currentPlayer,
        position: newPosition,
      };

      setResultMessage(`${currentPlayer.name} answered correctly! Advanced ${advanceSteps} spaces.`);
      setResultEmoji("🎉");

      // Trigger confetti
      if (confettiCanvasRef.current) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } else {
      // Wrong answer - fall back based on difficulty
      let fallbackSteps = 0;
      switch (question.difficulty) {
        case "easy":
          fallbackSteps = 2;
          break;
        case "medium":
          fallbackSteps = 4;
          break;
        case "hard":
          fallbackSteps = 6;
          break;
      }

      let newPosition = currentPlayer.position - fallbackSteps;
      if (newPosition < 0) newPosition = 0;

      updatedPlayers[currentPlayerIndex] = {
        ...currentPlayer,
        position: newPosition,
      };

      setResultMessage(`${currentPlayer.name} answered incorrectly! Fell back ${fallbackSteps} spaces.`);
      setResultEmoji("😢");
    }

    setPlayers(updatedPlayers);
    setShowQuestion(false);
    setShowResult(true);

    // Check if game is over after answering
    if (updatedPlayers[currentPlayerIndex].position === 100) {
      setGameOver(true);
      setWinner(updatedPlayers[currentPlayerIndex]);
    }
  };

  const nextPlayer = () => {
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);

    // If next player is a bot, automatically roll dice after a delay
    if (players[(currentPlayerIndex + 1) % players.length]?.isBot) {
      setTimeout(() => {
        rollDice();
      }, 1500);
    }
  };

  const handleAnswerSelection = (selectedIndex) => {
    if (!currentQuestion) return;

    const isCorrect = selectedIndex === currentQuestion.correctAnswer;
    const currentPlayer = players[currentPlayerIndex];
    const updatedPlayers = [...players];

    if (isCorrect) {
      // Correct answer - advance based on difficulty
      let advanceSteps = 0;
      switch (currentQuestion.difficulty) {
        case "easy":
          advanceSteps = 3;
          break;
        case "medium":
          advanceSteps = 5;
          break;
        case "hard":
          advanceSteps = 8;
          break;
      }

      let newPosition = currentPlayer.position + advanceSteps;
      if (newPosition > 100) newPosition = 100;

      updatedPlayers[currentPlayerIndex] = {
        ...currentPlayer,
        position: newPosition,
      };

      setResultMessage(`Correct! You advance ${advanceSteps} spaces.`);
      setResultEmoji("🎉");

      // Trigger confetti
      if (confettiCanvasRef.current) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } else {
      // Wrong answer - fall back based on difficulty
      let fallbackSteps = 0;
      switch (currentQuestion.difficulty) {
        case "easy":
          fallbackSteps = 2;
          break;
        case "medium":
          fallbackSteps = 4;
          break;
        case "hard":
          fallbackSteps = 6;
          break;
      }

      let newPosition = currentPlayer.position - fallbackSteps;
      if (newPosition < 0) newPosition = 0;

      updatedPlayers[currentPlayerIndex] = {
        ...currentPlayer,
        position: newPosition,
      };

      setResultMessage(`Wrong! You fall back ${fallbackSteps} spaces.`);
      setResultEmoji("😢");
    }

    setPlayers(updatedPlayers);
    setShowQuestion(false);
    setShowResult(true);

    // Check if game is over after answering
    if (updatedPlayers[currentPlayerIndex].position === 100) {
      setGameOver(true);
      setWinner(updatedPlayers[currentPlayerIndex]);
    }
  };

  const closeResultDialog = () => {
    setShowResult(false);
    setCurrentQuestion(null);

    // Move to next player if game is not over
    if (!gameOver) {
      nextPlayer();
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setPlayerSetup(true);
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setDiceValue(null);
    setIsRolling(false);
    setCurrentQuestion(null);
    setShowQuestion(false);
    setGameOver(false);
    setWinner(null);
    setShowResult(false);
    setBotThinking(false);
  };

  // Render dice based on current value
  const renderDice = () => {
    if (diceValue === null) return null;

    const diceIcons = [
      <Dice1 key={1} />,
      <Dice2 key={2} />,
      <Dice3 key={3} />,
      <Dice4 key={4} />,
      <Dice5 key={5} />,
      <Dice6 key={6} />,
    ];

    return diceIcons[diceValue - 1];
  };

  // Generate the game board
  const renderBoard = () => {
    const board = [];
    const totalRows = 10;
    const totalCols = 10;

    for (let row = 0; row < totalRows; row++) {
      const rowCells = [];

      for (let col = 0; col < totalCols; col++) {
        // Calculate position based on row and column
        // Start from bottom-left corner (as requested)
        let position;
        if (row % 2 === 0) {
          // Even rows go left to right
          position = (totalRows - row) * totalCols - col;
        } else {
          // Odd rows go right to left
          position = (totalRows - row - 1) * totalCols + col + 1;
        }

        // Check if any player is on this position
        const playersOnCell = players.filter((player) => player.position === position);

        // Check if this is a question box
        const isQuestionBox = questionBoxes.some((box) => box.position === position);

        const cellClasses = [
          "board-cell",
          position % 2 === 0 ? "board-cell-even" : "board-cell-odd",
          isQuestionBox ? "question-cell" : "",
          position === 100 ? "finish-cell" : "",
          position === 1 ? "start-cell" : "",
        ].filter(Boolean).join(" ");

        rowCells.push(
          <div key={`${row}-${col}`} className={cellClasses}>
            <span className="cell-number">{position}</span>
            {isQuestionBox && <span className="cell-icon">❓</span>}
            {position === 100 && <span className="cell-icon">🏆</span>}
            {position === 1 && <span className="cell-icon">🚩</span>}
            <div className="player-tokens">
              {playersOnCell.map((player) => (
                <div
                  key={player.id}
                  className={`player-token ${player.color}`}
                  title={player.name}
                />
              ))}
            </div>
          </div>
        );
      }

      board.push(
        <div key={row} className="board-row">
          {rowCells}
        </div>
      );
    }

    return board;
  };

  // Render player setup screen
  const renderPlayerSetup = () => {
    return (
      <div className="setup-container">
        <h2 className="setup-title">Game Setup</h2>

        <div className="setup-form">
          <div className="form-group">
            <Label htmlFor="playerMode" className="form-label">
              Game Mode
            </Label>
            <Select onValueChange={handleSinglePlayerModeChange} defaultValue="false">
              <SelectItem value="false">Multiplayer</SelectItem>
              <SelectItem value="true">Single Player with Bots</SelectItem>
            </Select>
          </div>

          <div className="form-group">
            <Label htmlFor="playerCount" className="form-label">
              Number of Players
            </Label>
            <Select onValueChange={handlePlayerCountChange} defaultValue="2">
              <SelectItem value="2">2 Players</SelectItem>
              <SelectItem value="3">3 Players</SelectItem>
              <SelectItem value="4">4 Players</SelectItem>
              <SelectItem value="5">5 Players</SelectItem>
            </Select>
          </div>

          <div className="form-group">
            <Label className="form-label">Player Names</Label>
            {playerNames.map((name, index) => (
              <div key={index} className="player-name-input">
                <Input
                  value={name}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  placeholder={`Player ${index + 1} name`}
                />
              </div>
            ))}
          </div>

          <Button onClick={startGame} className="start-button">
            Start Game
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="game-container">
      <div className="game-content">
        <div className="game-header">
          <h1 className="game-title">Knowledge Ladder</h1>
          <button className="home-button">
            <Home /> Back to Home
          </button>
        </div>

        {!gameStarted ? (
          renderPlayerSetup()
        ) : (
          <div className="game-layout">
            <div className="board-container">
              <div className="game-board">
                {renderBoard()}
              </div>
            </div>

            <div className="game-sidebar">
              <div className="game-controls">
                <h2 className="sidebar-title">Game Controls</h2>

                <div className="turn-info">
                  <div className="current-player">
                    <h3 className="player-label">Current Turn</h3>
                    <div className="player-info">
                      <div className={`player-indicator ${players[currentPlayerIndex]?.color}`}></div>
                      <span>{players[currentPlayerIndex]?.name}</span>
                      {players[currentPlayerIndex]?.isBot && <span className="bot-label">(Bot)</span>}
                    </div>
                  </div>

                  <div className="dice-container">
                    <div className="dice-display">
                      {botThinking ? <div className="bot-thinking">Bot thinking...</div> : renderDice()}
                    </div>
                    <Button
                      onClick={rollDice}
                      disabled={
                        isRolling || showQuestion || gameOver || players[currentPlayerIndex]?.isBot || botThinking
                      }
                      className="roll-button"
                    >
                      {isRolling ? "Rolling..." : "Roll Dice"}
                    </Button>
                  </div>
                </div>

                <div className="player-stats">
                  {players.map((player) => (
                    <div key={player.id} className="player-card">
                      <div className="player-card-header">
                        <div className={`player-indicator ${player.color}`}></div>
                        <span className="player-name">{player.name}</span>
                        {player.isBot && <span className="bot-label">(Bot)</span>}
                      </div>
                      <div className="player-position">Position: {player.position}</div>
                    </div>
                  ))}
                </div>

                {gameOver && (
                  <div className="game-over">
                    <h3 className="game-over-title">Game Over!</h3>
                    <p className="winner-message">{winner?.name} wins!</p>
                    <Button onClick={resetGame} className="play-again-button">
                      Play Again
                    </Button>
                  </div>
                )}
              </div>

              <div className="how-to-play">
                <h2 className="sidebar-title">How to Play</h2>
                <ul className="instructions-list">
                  <li>Roll the dice to move your player</li>
                  <li>Land on a question box (❓) to answer a question</li>
                  <li>Correct answers let you advance further</li>
                  <li>Wrong answers make you fall back</li>
                  <li>First player to reach position 100 wins!</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Question Dialog */}
        <Dialog open={showQuestion} onOpenChange={setShowQuestion}>
          <DialogContent className="question-dialog">
            <DialogHeader>
              <DialogTitle>Question</DialogTitle>
              <DialogDescription>
                Subject: {currentQuestion?.subject.toUpperCase()} | Difficulty: {currentQuestion?.difficulty}
              </DialogDescription>
            </DialogHeader>

            <div className="question-content">
              <h3 className="question-text">{currentQuestion?.text}</h3>
              <div className="options-container">
                {currentQuestion?.options.map((option, index) => (
                  <Button
                    key={index}
                    className="option-button"
                    onClick={() => handleAnswerSelection(index)}
                    disabled={players[currentPlayerIndex]?.isBot}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Result Dialog */}
        <Dialog open={showResult} onOpenChange={setShowResult}>
          <DialogContent className="result-dialog">
            <div className="result-content">
              <div className="result-emoji">{resultEmoji}</div>
              <h3 className="result-message">{resultMessage}</h3>
              <Button onClick={closeResultDialog} className="continue-button">
                Continue
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Hidden canvas for confetti */}
        <canvas ref={confettiCanvasRef} className="confetti-canvas" />
      </div>
    </div>
  );
}

export default KnowledgeLadderGame;