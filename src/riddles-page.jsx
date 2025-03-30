import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import "./riddles-page.css";

const riddles = [
  {
    id: 1,
    question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
    answer: "echo",
    difficulty: "medium",
    hint: "You can hear me in the mountains",
  },
  {
    id: 2,
    question: "The more you take, the more you leave behind. What am I?",
    answer: "footsteps",
    difficulty: "medium",
    hint: "Think about walking",
  },
  {
    id: 3,
    question: "What has keys but no locks, space but no room, and you can enter but not go in?",
    answer: "keyboard",
    difficulty: "medium",
    hint: "You're using one right now",
  },
  {
    id: 4,
    question: "I'm tall when I'm young, and I'm short when I'm old. What am I?",
    answer: "candle",
    difficulty: "easy",
    hint: "I provide light",
  },
  {
    id: 5,
    question: "What is always in front of you but can't be seen?",
    answer: "future",
    difficulty: "medium",
    hint: "It's related to time",
  },
  {
    id: 6,
    question: "What can you break, even if you never pick it up or touch it?",
    answer: "promise",
    difficulty: "medium",
    hint: "It's something you give to someone",
  },
  {
    id: 7,
    question: "What has a head and a tail, but no body?",
    answer: "coin",
    difficulty: "easy",
    hint: "It's in your pocket",
  },
  {
    id: 8,
    question: "What has many keys but can't open a single lock?",
    answer: "piano",
    difficulty: "easy",
    hint: "It's a musical instrument",
  },
  {
    id: 9,
    question: "What gets wet while drying?",
    answer: "towel",
    difficulty: "easy",
    hint: "You use it after a shower",
  },
  {
    id: 10,
    question:
      "The person who makes it, sells it. The person who buys it, never uses it. The person who uses it, never sees it. What is it?",
    answer: "coffin",
    difficulty: "hard",
    hint: "It's used after death",
  },
  {
    id: 11,
    question: "What has a neck but no head?",
    answer: "bottle",
    difficulty: "easy",
    hint: "You drink from it",
  },
  {
    id: 12,
    question: "What can travel around the world while staying in a corner?",
    answer: "stamp",
    difficulty: "medium",
    hint: "It's used for mail",
  },
  {
    id: 13,
    question: "What has 13 hearts but no other organs?",
    answer: "deck of cards",
    difficulty: "medium",
    hint: "You play games with it",
  },
  {
    id: 14,
    question:
      "What can run but never walks, has a mouth but never talks, has a head but never weeps, has a bed but never sleeps?",
    answer: "river",
    difficulty: "hard",
    hint: "It's a natural water formation",
  },
  {
    id: 15,
    question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
    answer: "map",
    difficulty: "medium",
    hint: "It helps you navigate",
  },
];

function RiddlesGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameRiddles, setGameRiddles] = useState([]);

  const timerRef = useRef(null);
  const confettiCanvasRef = useRef(null);
  const inputRef = useRef(null);

  // Start the game
  const startGame = () => {
    // Shuffle and select 10 riddles
    const shuffledRiddles = [...riddles].sort(() => Math.random() - 0.5).slice(0, 10);
    setGameRiddles(shuffledRiddles);
    setGameStarted(true);
    setCurrentRiddleIndex(0);
    setScore(0);
    setGameOver(false);

    // Set timer based on first riddle difficulty
    startTimer(shuffledRiddles[0].difficulty);
  };

  // Start timer based on riddle difficulty
  const startTimer = (difficulty) => {
    let seconds = 0;

    switch (difficulty) {
      case "easy":
        seconds = 30;
        break;
      case "medium":
        seconds = 45;
        break;
      case "hard":
        seconds = 60;
        break;
      default:
        seconds = 30;
    }

    setTimeLeft(seconds);

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Start new timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle time up
  const handleTimeUp = () => {
    setShowResult(true);
    setIsCorrect(false);
  };

  // Handle answer submission
  const handleSubmit = () => {
    const currentRiddle = gameRiddles[currentRiddleIndex];

    // Check if answer is correct (case insensitive)
    const isAnswerCorrect = userAnswer.toLowerCase().trim() === currentRiddle.answer.toLowerCase();

    setIsCorrect(isAnswerCorrect);
    setShowResult(true);

    if (isAnswerCorrect) {
      setScore(score + 1);

      // Trigger confetti for correct answer
      if (confettiCanvasRef.current) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Move to next riddle
  const nextRiddle = () => {
    setShowResult(false);
    setUserAnswer("");
    setShowHint(false);

    if (currentRiddleIndex < gameRiddles.length - 1) {
      const nextIndex = currentRiddleIndex + 1;
      setCurrentRiddleIndex(nextIndex);

      // Start timer for next riddle
      startTimer(gameRiddles[nextIndex].difficulty);

      // Focus on input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      // Game completed
      setGameOver(true);
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

  // Get current riddle
  const currentRiddle = gameRiddles[currentRiddleIndex];

  // Calculate progress percentage for timer
  const getProgressPercentage = () => {
    if (!currentRiddle) return 0;
    
    const maxTime = 
      currentRiddle.difficulty === "easy" ? 30 : 
      currentRiddle.difficulty === "medium" ? 45 : 60;
    
    return (timeLeft / maxTime) * 100;
  };
  
  // Get color classes based on time left
  const getTimeColorClass = () => {
    if (timeLeft > 20) return "time-green";
    if (timeLeft > 10) return "time-yellow";
    return "time-red";
  };
  
  // Get difficulty color class
  const getDifficultyColorClass = (difficulty) => {
    if (difficulty === "easy") return "difficulty-easy";
    if (difficulty === "medium") return "difficulty-medium";
    return "difficulty-hard";
  };

  return (
    <div className="riddles-game">
      <div className="container">
        <h1 className="game-title">Riddles Challenge</h1>

        {!gameStarted ? (
          <div className="welcome-card">
            <h2 className="welcome-title">
              Welcome to Riddles Challenge!
            </h2>

            <div className="welcome-content">
              <p className="welcome-description">
                Test your problem-solving skills with 10 challenging riddles. Each riddle has a time limit based on its
                difficulty.
              </p>

              <div className="how-to-play">
                <h3 className="how-to-play-title">How to Play:</h3>
                <ul className="how-to-play-list">
                  <li>Read each riddle carefully</li>
                  <li>Type your answer before the timer runs out</li>
                  <li>Use hints if you're stuck (but try without first!)</li>
                  <li>Score points for each correct answer</li>
                  <li>Complete all 10 riddles to finish the game</li>
                </ul>
              </div>

              <div className="difficulty-grid">
                <div className="difficulty-easy">
                  <div className="difficulty-label">Easy</div>
                  <div>30 seconds</div>
                </div>
                <div className="difficulty-medium">
                  <div className="difficulty-label">Medium</div>
                  <div>45 seconds</div>
                </div>
                <div className="difficulty-hard">
                  <div className="difficulty-label">Hard</div>
                  <div>60 seconds</div>
                </div>
              </div>

              <button className="button start-button" onClick={startGame}>
                Start Game
              </button>
            </div>
          </div>
        ) : (
          <div className="game-container">
            {!gameOver ? (
              <div className="game-card">
                <div className="game-header">
                  <div className="game-progress">
                    Riddle {currentRiddleIndex + 1} of {gameRiddles.length}
                  </div>
                  <div className="game-score">
                    Score: {score}/{gameRiddles.length}
                  </div>
                </div>

                <div className="timer-container">
                  <div className="timer-header">
                    <div className="timer-label">Time Remaining</div>
                    <div className={`timer-value ${getTimeColorClass()}`}>
                      {timeLeft} seconds
                    </div>
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                </div>

                <div className="riddle-container">
                  <div className="riddle-header">
                    <h2 className="riddle-title">Riddle</h2>
                    {currentRiddle && (
                      <div className={`difficulty-badge ${getDifficultyColorClass(currentRiddle.difficulty)}`}>
                        {currentRiddle.difficulty}
                      </div>
                    )}
                  </div>
                  <p className="riddle-question">{currentRiddle?.question}</p>

                  {showHint && (
                    <div className="hint-container">
                      <p className="hint-text">
                        <span className="hint-label">Hint:</span> {currentRiddle?.hint}
                      </p>
                    </div>
                  )}
                </div>

                <div className="answer-container">
                  <div className="input-group">
                    <label htmlFor="answer" className="input-label">
                      Your Answer
                    </label>
                    <input
                      ref={inputRef}
                      id="answer"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      className="input-field"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSubmit();
                        }
                      }}
                    />
                  </div>

                  <div className="button-group">
                    <button
                      className="button outline-button"
                      onClick={() => setShowHint(true)}
                      disabled={showHint}
                    >
                      Show Hint
                    </button>
                    <button className="button primary-button" onClick={handleSubmit}>
                      Submit Answer
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="results-card">
                <h2 className="results-title">Game Complete!</h2>

                <div className="results-score">
                  {score}/{gameRiddles.length}
                </div>

                <p className="results-message">
                  {score === gameRiddles.length
                    ? "Perfect score! You're a riddle master!"
                    : score >= gameRiddles.length / 2
                      ? "Great job! You solved most of the riddles!"
                      : "Nice try! Practice makes perfect!"}
                </p>

                <div className="results-buttons">
                  <button className="button primary-button" onClick={startGame}>Play Again</button>
                  <a href="/" className="button outline-button">
                    Back to Home
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Result Dialog */}
        {showResult && (
          <div className="dialog-overlay" onClick={() => setShowResult(false)}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
              <div className="dialog-body">
                {isCorrect ? (
                  <>
                    <div className="result-emoji">🎉</div>
                    <h3 className="result-title correct">Correct!</h3>
                    <p className="result-message">Well done! You solved the riddle.</p>
                  </>
                ) : (
                  <>
                    <div className="result-emoji">😢</div>
                    <h3 className="result-title incorrect">
                      {timeLeft === 0 ? "Time's Up!" : "Incorrect!"}
                    </h3>
                    <p className="result-prompt">The correct answer was:</p>
                    <p className="result-answer">{currentRiddle?.answer}</p>
                  </>
                )}
                <button className="button primary-button" onClick={nextRiddle}>
                  {currentRiddleIndex < gameRiddles.length - 1 ? "Next Riddle" : "See Results"}
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

export default RiddlesGame;