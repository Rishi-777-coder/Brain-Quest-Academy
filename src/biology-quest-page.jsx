import React, { useState, useRef } from "react";
import confetti from "canvas-confetti";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Home } from "lucide-react";

// Define types
// Player type
// Question type
// QuestionBox type

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
  {
    id: 11,
    text: "What is the integral of e^x?",
    options: ["e^x + C", "xe^x + C", "e^x/x + C", "ln(x) + C"],
    correctAnswer: 0,
    difficulty: "hard",
    subject: "math",
  },
  {
    id: 12,
    text: "What is the derivative of ln(x)?",
    options: ["1/x", "x", "ln(x)/x", "e^x"],
    correctAnswer: 0,
    difficulty: "medium",
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
  {
    id: 15,
    text: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
    correctAnswer: 1,
    difficulty: "medium",
    subject: "gk",
  },
  {
    id: 16,
    text: "Which country has the largest population?",
    options: ["India", "United States", "China", "Russia"],
    correctAnswer: 2,
    difficulty: "medium",
    subject: "gk",
  },
  {
    id: 17,
    text: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctAnswer: 1,
    difficulty: "medium",
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
  {
    id: 19,
    text: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
    correctAnswer: 1,
    difficulty: "easy",
    subject: "bio",
  },
  {
    id: 20,
    text: "Which of these is NOT a type of blood cell?",
    options: ["Red blood cell", "White blood cell", "Platelet", "Neuron"],
    correctAnswer: 3,
    difficulty: "medium",
    subject: "bio",
  },
  {
    id: 21,
    text: "What is the process by which plants make their own food?",
    options: ["Respiration", "Photosynthesis", "Digestion", "Excretion"],
    correctAnswer: 1,
    difficulty: "medium",
    subject: "bio",
  },
  {
    id: 22,
    text: "Which of these is NOT a part of the digestive system?",
    options: ["Stomach", "Small Intestine", "Liver", "Lungs"],
    correctAnswer: 3,
    difficulty: "hard",
    subject: "bio",
  },

  // History Questions
  {
    id: 23,
    text: "In which year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctAnswer: 2,
    difficulty: "medium",
    subject: "history",
  },
  {
    id: 24,
    text: "Who was the first President of the United States?",
    options: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "John Adams"],
    correctAnswer: 1,
    difficulty: "easy",
    subject: "history",
  },
  {
    id: 25,
    text: "Which ancient civilization built the pyramids?",
    options: ["Romans", "Greeks", "Egyptians", "Mayans"],
    correctAnswer: 2,
    difficulty: "easy",
    subject: "history",
  },
  {
    id: 26,
    text: "Who was the first person to step on the moon?",
    options: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "John Glenn"],
    correctAnswer: 1,
    difficulty: "medium",
    subject: "history",
  },
  {
    id: 27,
    text: "Which empire was ruled by Genghis Khan?",
    options: ["Roman Empire", "Ottoman Empire", "Mongol Empire", "Byzantine Empire"],
    correctAnswer: 2,
    difficulty: "hard",
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
  },
  {
    id: 29,
    text: "What is the hardest natural substance on Earth?",
    options: ["Gold", "Iron", "Diamond", "Platinum"],
    correctAnswer: 2,
    difficulty: "medium",
    subject: "science",
  },
  {
    id: 30,
    text: "Which of these is NOT a state of matter?",
    options: ["Solid", "Liquid", "Gas", "Energy"],
    correctAnswer: 3,
    difficulty: "easy",
    subject: "science",
  },
  {
    id: 31,
    text: "What is the speed of light approximately?",
    options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "1,000,000 km/s"],
    correctAnswer: 0,
    difficulty: "hard",
    subject: "science",
  },
  {
    id: 32,
    text: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
    correctAnswer: 1,
    difficulty: "easy",
    subject: "science",
  },
];

// Helper function to combine classNames
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

// Toast notification component
const Toast = ({ message }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-indigo-900 text-white py-2 px-4 rounded-lg shadow-lg">
      {message}
    </div>
  );
};

function QuizLadderGame() {
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
  const [toast, setToast] = useState({ show: false, message: "" });

  const confettiCanvasRef = useRef(null);

  const playerColors = ["bg-indigo-500", "bg-rose-500", "bg-emerald-500", "bg-amber-500", "bg-purple-500"];

  // Handle player count change
  const handlePlayerCountChange = (e) => {
    const count = Number.parseInt(e.target.value);
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
  const handleSinglePlayerModeChange = (e) => {
    setSinglePlayerMode(e.target.value === "true");
  };

  // Show toast message
  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
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
      <Dice1 key={1} className="w-12 h-12" />,
      <Dice2 key={2} className="w-12 h-12" />,
      <Dice3 key={3} className="w-12 h-12" />,
      <Dice4 key={4} className="w-12 h-12" />,
      <Dice5 key={5} className="w-12 h-12" />,
      <Dice6 key={6} className="w-12 h-12" />,
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

        rowCells.push(
          <div
            key={`${row}-${col}`}
            className={cn(
              "border border-indigo-800/30 flex flex-col items-center justify-center relative",
              position % 2 === 0 ? "bg-indigo-950/50" : "bg-indigo-900/50",
              isQuestionBox ? "bg-amber-900/30" : "",
              position === 100 ? "bg-emerald-900/50" : "",
              position === 1 ? "bg-indigo-700/50" : ""
            )}
            style={{ height: "60px" }}
          >
            <span className="text-xs absolute top-1 left-1 text-indigo-400">{position}</span>
            {isQuestionBox && <span className="text-lg">❓</span>}
            {position === 100 && <span className="text-lg">🏆</span>}
            {position === 1 && <span className="text-lg">🚩</span>}
            <div className="flex gap-1 mt-1">
              {playersOnCell.map((player) => (
                <div
                  key={player.id}
                  className={cn("w-4 h-4 rounded-full", player.color)}
                  title={player.name}
                  style={{ animation: "scale-in 0.3s ease-out" }}
                />
              ))}
            </div>
          </div>
        );
      }

      board.push(
        <div key={row} className="grid grid-cols-10">
          {rowCells}
        </div>
      );
    }

    return board;
  };

  // Render player setup screen
  const renderPlayerSetup = () => {
    return (
      <div className="bg-indigo-900/50 rounded-xl shadow-lg p-8 max-w-md mx-auto border border-indigo-800/50">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-200">Game Setup</h2>

        <div className="space-y-6">
          <div>
            <label htmlFor="playerMode" className="text-indigo-300 mb-2 block">
              Game Mode
            </label>
            <select
              id="playerMode"
              onChange={handleSinglePlayerModeChange}
              defaultValue="false"
              className="bg-indigo-950 border-indigo-700 text-white p-2 rounded w-full"
            >
              <option value="false">Multiplayer</option>
              <option value="true">Single Player with Bots</option>
            </select>
          </div>

          <div>
            <label htmlFor="playerCount" className="text-indigo-300 mb-2 block">
              Number of Players
            </label>
            <select
              id="playerCount"
              onChange={handlePlayerCountChange}
              defaultValue="2"
              className="bg-indigo-950 border-indigo-700 text-white p-2 rounded w-full"
            >
              <option value="2">2 Players</option>
              <option value="3">3 Players</option>
              <option value="4">4 Players</option>
              <option value="5">5 Players</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="text-indigo-300 block">Player Names</label>
            {playerNames.map((name, index) => (
              <div key={index}>
                <input
                  value={name}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  placeholder={`Player ${index + 1} name`}
                  className="bg-indigo-950 border-indigo-700 text-white p-2 rounded w-full"
                />
              </div>
            ))}
          </div>

          <button 
            onClick={startGame} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  };

  // Question Dialog Component
  const QuestionDialog = ({ open, onClose }) => {
    if (!open) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-indigo-900 text-white border-indigo-700 p-6 rounded-lg max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-indigo-200">Question</h2>
              <p className="text-indigo-400">
                Subject: {currentQuestion?.subject.toUpperCase()} | Difficulty: {currentQuestion?.difficulty}
              </p>
            </div>
          </div>

          <div className="py-4">
            <h3 className="text-lg font-medium mb-4 text-indigo-100">{currentQuestion?.text}</h3>
            <div className="grid gap-3">
              {currentQuestion?.options.map((option, index) => (
                <button
                  key={index}
                  className="justify-start text-left h-auto py-3 px-4 border border-indigo-700 hover:bg-indigo-800 text-indigo-200 rounded"
                  onClick={() => handleAnswerSelection(index)}
                  disabled={players[currentPlayerIndex]?.isBot}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Result Dialog Component
  const ResultDialog = ({ open, onClose }) => {
    if (!open) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-indigo-900 text-white border-indigo-700 p-6 rounded-lg max-w-md w-full">
          <div className="py-6 text-center">
            <div className="text-6xl mb-4">{resultEmoji}</div>
            <h3 className="text-xl font-bold mb-4 text-indigo-200">{resultMessage}</h3>
            <button 
              onClick={closeResultDialog} 
              className="bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded text-white"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-200">Knowledge Ladder</h1>
          <a href="/">
            <button className="border border-indigo-700 text-indigo-300 hover:bg-indigo-800 py-1 px-3 rounded text-sm flex items-center">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </button>
          </a>
        </div>

        {!gameStarted ? (
          renderPlayerSetup()
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-indigo-900/30 rounded-xl shadow-lg p-4 overflow-auto border border-indigo-800/30">
                {renderBoard()}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-indigo-900/50 rounded-xl shadow-lg p-6 border border-indigo-800/50">
                <h2 className="text-xl font-bold mb-4 text-indigo-200">Game Controls</h2>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-indigo-300">Current Turn</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={cn("w-4 h-4 rounded-full", players[currentPlayerIndex]?.color)} />
                      <span>{players[currentPlayerIndex]?.name}</span>
                      {players[currentPlayerIndex]?.isBot && <span className="text-xs text-indigo-400">(Bot)</span>}
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="border-2 border-indigo-700 rounded-lg p-2 mb-2 min-h-[60px] flex items-center justify-center bg-indigo-950">
                      {botThinking ? <div className="text-sm text-indigo-400">Bot thinking...</div> : renderDice()}
                    </div>
                    <button
                      onClick={rollDice}
                      disabled={
                        isRolling || showQuestion || gameOver || players[currentPlayerIndex]?.isBot || botThinking
                      }
                      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900/50 py-2 px-4 rounded text-white"
                    >
                      {isRolling ? "Rolling..." : "Roll Dice"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {players.map((player) => (
                    <div key={player.id} className="bg-indigo-950 rounded-lg p-3 border border-indigo-800/50">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={cn("w-4 h-4 rounded-full", player.color)} />
                        <span className="font-medium">{player.name}</span>
                        {player.isBot && <span className="text-xs text-indigo-400">(Bot)</span>}
                      </div>
                      <div className="text-indigo-300">Position: {player.position}</div>
                    </div>
                  ))}
                </div>

                {gameOver && (
                  <div className="mt-6 text-center">
                    <h3 className="text-xl font-bold text-emerald-400 mb-2">Game Over!</h3>
                    <p className="mb-4">{winner?.name} wins!</p>
                    <button onClick={resetGame} className="bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded text-white">
                      Play Again
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-indigo-900/50 rounded-xl shadow-lg p-6 border border-indigo-800/50">
                <h2 className="text-xl font-bold mb-2 text-indigo-200">How to Play</h2>
                <ul className="list-disc pl-5 space-y-1 text-sm text-indigo-300">
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

        {/* Question and Result Dialogs */}
        <QuestionDialog open={showQuestion} onClose={() => setShowQuestion(false)} />
        <ResultDialog open={showResult} onClose={() => setShowResult(false)} />

        {/* Toast notification */}
        {toast.show && <Toast message={toast.message} />}

        {/* Hidden canvas for confetti */}
        <canvas ref={confettiCanvasRef} className="fixed pointer-events-none inset-0 z-50 opacity-70" />
      </div>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes scale-in {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default QuizLadderGame;