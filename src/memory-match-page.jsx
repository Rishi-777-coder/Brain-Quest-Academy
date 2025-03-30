import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import "./memory-match-page.css";

// Card type definitions
// Type definitions are removed as they're TypeScript specific

const difficultySettings = {
  easy: { pairs: 6, time: 60 },
  medium: { pairs: 8, time: 90 },
  hard: { pairs: 12, time: 120 },
};

// Card pairs with terms and definitions across different subjects
const cardPairs = [
  // Math
  { term: "Derivative", definition: "Rate of change of a function with respect to a variable", subject: "Math" },
  { term: "Integral", definition: "Accumulation of quantities described by a function", subject: "Math" },
  { term: "Pythagorean Theorem", definition: "a² + b² = c²", subject: "Math" },
  { term: "Quadratic Formula", definition: "x = (-b ± √(b² - 4ac)) / 2a", subject: "Math" },
  { term: "Vector", definition: "Quantity with magnitude and direction", subject: "Math" },
  { term: "Matrix", definition: "Rectangular array of numbers arranged in rows and columns", subject: "Math" },

  // Science
  {
    term: "Photosynthesis",
    definition: "Process by which plants convert light energy to chemical energy",
    subject: "Science",
  },
  { term: "Mitochondria", definition: "Powerhouse of the cell", subject: "Science" },
  {
    term: "Newton's 3rd Law",
    definition: "For every action, there is an equal and opposite reaction",
    subject: "Science",
  },
  { term: "Periodic Table", definition: "Tabular arrangement of chemical elements", subject: "Science" },
  { term: "DNA", definition: "Molecule carrying genetic instructions for development", subject: "Science" },
  { term: "Gravity", definition: "Force that attracts objects with mass toward each other", subject: "Science" },

  // Computer Science
  { term: "Algorithm", definition: "Step-by-step procedure for solving a problem", subject: "CS" },
  { term: "Variable", definition: "Named storage location for data", subject: "CS" },
  { term: "Function", definition: "Block of code designed to perform a specific task", subject: "CS" },
  { term: "Array", definition: "Collection of elements stored at contiguous memory locations", subject: "CS" },
  { term: "Loop", definition: "Control structure that repeats a sequence of instructions", subject: "CS" },
  { term: "Boolean", definition: "Data type with two possible values: true or false", subject: "CS" },

  // Language Arts
  { term: "Metaphor", definition: "Figure of speech making an implied comparison", subject: "Language" },
  { term: "Alliteration", definition: "Repetition of consonant sounds at the beginning of words", subject: "Language" },
  { term: "Protagonist", definition: "Main character in a story", subject: "Language" },
  { term: "Simile", definition: "Comparison using 'like' or 'as'", subject: "Language" },
  { term: "Irony", definition: "Contrast between expectation and reality", subject: "Language" },
  { term: "Onomatopoeia", definition: "Word that phonetically imitates the sound it describes", subject: "Language" },

  // Keyboard Shortcuts
  { term: "Ctrl+C", definition: "Copy selected text or item", subject: "Shortcuts" },
  { term: "Ctrl+V", definition: "Paste copied text or item", subject: "Shortcuts" },
  { term: "Ctrl+Z", definition: "Undo last action", subject: "Shortcuts" },
  { term: "Ctrl+A", definition: "Select all items", subject: "Shortcuts" },
  { term: "Ctrl+F", definition: "Find text in document", subject: "Shortcuts" },
  { term: "Alt+Tab", definition: "Switch between open applications", subject: "Shortcuts" },
];

function MemoryMatchGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const timerRef = useRef(null);
  const confettiCanvasRef = useRef(null);
  const canFlip = useRef(true);

  // Generate cards based on difficulty
  const generateCards = (difficultyLevel) => {
    const { pairs } = difficultySettings[difficultyLevel];

    // Shuffle and select card pairs
    const selectedPairs = [...cardPairs].sort(() => Math.random() - 0.5).slice(0, pairs);

    // Create cards from pairs
    const newCards = [];
    selectedPairs.forEach((pair, index) => {
      // Term card
      newCards.push({
        id: index * 2,
        content: pair.term,
        type: "term",
        matchId: index,
        matched: false,
        flipped: false,
      });

      // Definition card
      newCards.push({
        id: index * 2 + 1,
        content: pair.definition,
        type: "definition",
        matchId: index,
        matched: false,
        flipped: false,
      });
    });

    // Shuffle cards
    return newCards.sort(() => Math.random() - 0.5);
  };

  // Start the game
  const startGame = () => {
    const newCards = generateCards(difficulty);
    setCards(newCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTimeLeft(difficultySettings[difficulty].time);
    setGameStarted(true);
    setGameOver(false);
    setGameWon(false);

    // Start timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up
          clearInterval(timerRef.current);
          setGameOver(true);
          setShowResult(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle card click
  const handleCardClick = (id) => {
    // Prevent clicking if animation is in progress or card is already matched/flipped
    if (!canFlip.current || flippedCards.length >= 2) return;

    const clickedCard = cards.find((card) => card.id === id);
    if (!clickedCard || clickedCard.matched || flippedCards.includes(id)) return;

    // Flip the card
    const newCards = cards.map((card) => (card.id === id ? { ...card, flipped: true } : card));
    setCards(newCards);

    // Add to flipped cards
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    // Check for match if two cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);

      const [firstId, secondId] = newFlippedCards;
      const firstCard = newCards.find((card) => card.id === firstId);
      const secondCard = newCards.find((card) => card.id === secondId);

      if (firstCard?.matchId === secondCard?.matchId) {
        // Match found
        const updatedCards = newCards.map((card) =>
          card.id === firstId || card.id === secondId ? { ...card, matched: true } : card
        );
        setCards(updatedCards);
        setFlippedCards([]);
        setMatchedPairs(matchedPairs + 1);

        // Check if all pairs are matched
        if (matchedPairs + 1 === difficultySettings[difficulty].pairs) {
          // Game won
          setGameWon(true);
          setGameOver(true);
          setShowResult(true);

          // Clear timer
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
        }
      } else {
        // No match, flip cards back after a delay
        canFlip.current = false;
        setTimeout(() => {
          setCards(newCards.map((card) => (newFlippedCards.includes(card.id) ? { ...card, flipped: false } : card)));
          setFlippedCards([]);
          canFlip.current = true;
        }, 1000);
      }
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Get card background color based on type
  const getCardColor = (card) => {
    if (!card.flipped && !card.matched) return "card-back";
    if (card.type === "term") return "card-term";
    return "card-definition";
  };

  // Get time-based class
  const getTimeClass = () => {
    if (timeLeft > 30) return "time-good";
    if (timeLeft > 15) return "time-warning";
    return "time-danger";
  };

  // Handle difficulty change
  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  // Get grid class based on difficulty
  const getGridClass = () => {
    if (difficulty === "easy") return "grid-easy";
    if (difficulty === "medium") return "grid-medium";
    return "grid-hard";
  };

  // Close result dialog
  const closeDialog = () => {
    setShowResult(false);
  };

  return (
    <div className="memory-game">
      <div className="container">
        <div className="header">
          <h1>Concept Match</h1>
          <button className="btn-outline" onClick={() => window.location.href = "/"}>
            <span className="home-icon">🏠</span>
            Back to Home
          </button>
        </div>

        {!gameStarted ? (
          <div className="welcome-card">
            <h2>Concept Match Challenge</h2>

            <div className="welcome-content">
              <p>
                Test your memory by matching terms with their definitions across different subjects. Choose your
                difficulty level to begin.
              </p>

              <div className="difficulty-selector">
                <label htmlFor="difficulty">Difficulty Level</label>
                <select 
                  id="difficulty" 
                  value={difficulty} 
                  onChange={handleDifficultyChange}
                >
                  <option value="easy">Easy (6 pairs)</option>
                  <option value="medium">Medium (8 pairs)</option>
                  <option value="hard">Hard (12 pairs)</option>
                </select>
              </div>

              <div className="how-to-play">
                <h3>How to Play:</h3>
                <ul>
                  <li>Click on cards to flip them</li>
                  <li>Match terms with their definitions</li>
                  <li>Find all matching pairs before time runs out</li>
                  <li>Remember card positions to make fewer moves</li>
                </ul>
              </div>

              <button className="btn-primary" onClick={startGame}>
                Start Game
              </button>
            </div>
          </div>
        ) : (
          <div className="game-board">
            <div className="game-info">
              <div className="stats-container">
                <div className="stat-box">
                  <span className="stat-label">Time: </span>
                  <span className={`stat-value ${getTimeClass()}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Moves: </span>
                  <span className="stat-value">{moves}</span>
                </div>
              </div>
              <div className="stat-box">
                <span className="stat-label">Pairs: </span>
                <span className="stat-value">
                  {matchedPairs}/{difficultySettings[difficulty].pairs}
                </span>
              </div>
            </div>

            <div className={`cards-grid ${getGridClass()}`}>
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`card-container ${card.matched ? "matched" : ""}`}
                  onClick={() => !gameOver && handleCardClick(card.id)}
                >
                  <div
                    className={`card ${card.flipped || card.matched ? "flipped" : ""}`}
                  >
                    {/* Card Back */}
                    <div className="card-face card-back">
                      <span>?</span>
                    </div>

                    {/* Card Front */}
                    <div className={`card-face card-front ${getCardColor(card)}`}>
                      <span className="card-content">
                        {card.content}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Result Dialog */}
        {showResult && (
          <div className="modal-overlay" onClick={closeDialog}>
            <div className="result-dialog" onClick={e => e.stopPropagation()}>
              {gameWon ? (
                <>
                  <div className="result-emoji">🎉</div>
                  <h3 className="result-title win">You Win!</h3>
                  <p className="result-message">
                    You found all pairs in {moves} moves with {formatTime(timeLeft)} remaining!
                  </p>
                </>
              ) : (
                <>
                  <div className="result-emoji">⏰</div>
                  <h3 className="result-title lose">Time's Up!</h3>
                  <p className="result-message">
                    You found {matchedPairs} out of {difficultySettings[difficulty].pairs} pairs.
                  </p>
                </>
              )}

              <div className="result-actions">
                <button className="btn-primary" onClick={startGame}>
                  Play Again
                </button>
                <button className="btn-outline" onClick={() => window.location.href = "/"}>
                  Back to Home
                </button>
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

export default MemoryMatchGame;