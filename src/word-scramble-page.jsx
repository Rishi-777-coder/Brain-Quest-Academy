import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import "./word-scramble-page.css";

// Word type definition
const wordList = [
  // Science Words
  { word: "ATOM", hint: "The basic unit of matter", category: "science", difficulty: "easy" },
  { word: "CELL", hint: "The basic structural unit of all organisms", category: "science", difficulty: "easy" },
  { word: "ENERGY", hint: "The ability to do work", category: "science", difficulty: "easy" },
  { word: "MOLECULE", hint: "A group of atoms bonded together", category: "science", difficulty: "medium" },
  {
    word: "GRAVITY",
    hint: "The force that attracts objects toward each other",
    category: "science",
    difficulty: "medium",
  },
  { word: "PHOTOSYNTHESIS", hint: "Process by which plants make food", category: "science", difficulty: "hard" },
  { word: "ECOSYSTEM", hint: "A community of living organisms", category: "science", difficulty: "medium" },
  { word: "EVOLUTION", hint: "The process of development and change", category: "science", difficulty: "medium" },

  // Math Words
  { word: "ADDITION", hint: "The process of combining numbers", category: "math", difficulty: "easy" },
  { word: "FRACTION", hint: "A part of a whole", category: "math", difficulty: "easy" },
  { word: "GEOMETRY", hint: "The study of shapes and sizes", category: "math", difficulty: "medium" },
  { word: "EQUATION", hint: "A statement that two expressions are equal", category: "math", difficulty: "medium" },
  {
    word: "ALGEBRA",
    hint: "Branch of math using letters to represent numbers",
    category: "math",
    difficulty: "medium",
  },
  { word: "CALCULUS", hint: "The study of continuous change", category: "math", difficulty: "hard" },
  { word: "PROBABILITY", hint: "The likelihood of an event occurring", category: "math", difficulty: "hard" },
  { word: "TRIGONOMETRY", hint: "The study of triangles and angles", category: "math", difficulty: "hard" },

  // History Words
  { word: "ANCIENT", hint: "Belonging to the very distant past", category: "history", difficulty: "easy" },
  { word: "EMPIRE", hint: "A group of countries ruled by one leader", category: "history", difficulty: "easy" },
  { word: "REVOLUTION", hint: "A forcible overthrow of a government", category: "history", difficulty: "medium" },
  { word: "ARTIFACT", hint: "An object made by humans in the past", category: "history", difficulty: "medium" },
  { word: "CIVILIZATION", hint: "An advanced state of human society", category: "history", difficulty: "medium" },
  {
    word: "ARCHAEOLOGY",
    hint: "The study of human history through excavation",
    category: "history",
    difficulty: "hard",
  },
  { word: "RENAISSANCE", hint: "A period of European cultural rebirth", category: "history", difficulty: "hard" },
  { word: "MONARCHY", hint: "A form of government with a king or queen", category: "history", difficulty: "medium" },

  // Geography Words
  { word: "CONTINENT", hint: "One of Earth's seven main land masses", category: "geography", difficulty: "easy" },
  {
    word: "MOUNTAIN",
    hint: "A large natural elevation of the earth's surface",
    category: "geography",
    difficulty: "easy",
  },
  {
    word: "PENINSULA",
    hint: "A piece of land almost surrounded by water",
    category: "geography",
    difficulty: "medium",
  },
  { word: "LATITUDE", hint: "The distance north or south of the equator", category: "geography", difficulty: "medium" },
  { word: "CLIMATE", hint: "The weather conditions in an area", category: "geography", difficulty: "medium" },
  { word: "ARCHIPELAGO", hint: "A group of islands", category: "geography", difficulty: "hard" },
  {
    word: "TOPOGRAPHY",
    hint: "The arrangement of the natural features of an area",
    category: "geography",
    difficulty: "hard",
  },
  { word: "CARTOGRAPHY", hint: "The science of making maps", category: "geography", difficulty: "hard" },

  // Literature Words
  { word: "NOVEL", hint: "A long fictional story", category: "literature", difficulty: "easy" },
  { word: "POETRY", hint: "Literary work with rhythm and often rhyme", category: "literature", difficulty: "easy" },
  {
    word: "METAPHOR",
    hint: "A figure of speech making an implied comparison",
    category: "literature",
    difficulty: "medium",
  },
  { word: "PROTAGONIST", hint: "The main character in a story", category: "literature", difficulty: "medium" },
  { word: "NARRATIVE", hint: "A spoken or written account of events", category: "literature", difficulty: "medium" },
  {
    word: "ALLITERATION",
    hint: "The occurrence of the same letter at the beginning of words",
    category: "literature",
    difficulty: "hard",
  },
  {
    word: "ONOMATOPOEIA",
    hint: "A word that imitates the sound it represents",
    category: "literature",
    difficulty: "hard",
  },
  {
    word: "FORESHADOWING",
    hint: "A warning or indication of a future event in a story",
    category: "literature",
    difficulty: "hard",
  },
];

// Custom Button Component
const Button = ({ children, onClick, variant = "primary", disabled = false, className = "" }) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`button ${variant === "outline" ? "button-outline" : "button-primary"} ${className} ${disabled ? "button-disabled" : ""}`}
    >
      {children}
    </button>
  );
};

// Dialog Component
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

// Input Component
const Input = React.forwardRef(({ value, onChange, placeholder, onKeyDown, className = "" }, ref) => {
  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
      className={`input ${className}`}
    />
  );
});
Input.displayName = "Input";

// Label Component
const Label = ({ htmlFor, children, className = "" }) => {
  return (
    <label htmlFor={htmlFor} className={`label ${className}`}>
      {children}
    </label>
  );
};

// Progress Component
const Progress = ({ value, className = "" }) => {
  return (
    <div className={`progress-container ${className}`}>
      <div className="progress-bar" style={{ width: `${value}%` }}></div>
    </div>
  );
};

// Select Component
const Select = ({ children, onValueChange, defaultValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  
  return (
    <div className="select-container">
      <div className="select-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
        <span className="select-caret">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="select-content">
          {React.Children.map(children, child => 
            React.cloneElement(child, { 
              onClick: (val) => {
                setValue(val);
                onValueChange(val);
                setIsOpen(false);
              }
            })
          )}
        </div>
      )}
    </div>
  );
};

// SelectItem Component
const SelectItem = ({ value, children, onClick }) => {
  return (
    <div className="select-item" onClick={() => onClick(value)}>
      {children}
    </div>
  );
};

function WordScrambleGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [category, setCategory] = useState("mixed");
  const [difficulty, setDifficulty] = useState("mixed");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [gameWords, setGameWords] = useState([]);
  const [scrambledWord, setScrambledWord] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const timerRef = useRef(null);
  const confettiCanvasRef = useRef(null);
  const inputRef = useRef(null);

  // Scramble a word
  const scrambleWord = (word) => {
    const wordArray = word.split("");

    // Shuffle the array
    for (let i = wordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }

    // Make sure the scrambled word is different from the original
    const scrambled = wordArray.join("");
    if (scrambled === word) {
      return scrambleWord(word);
    }

    return scrambled;
  };

  // Filter words based on category and difficulty
  const filterWords = (category, difficulty) => {
    let filteredWords = [...wordList];

    // Filter by category
    if (category !== "mixed") {
      filteredWords = filteredWords.filter((word) => word.category === category);
    }

    // Filter by difficulty
    if (difficulty !== "mixed") {
      filteredWords = filteredWords.filter((word) => word.difficulty === difficulty);
    }

    // Shuffle the array
    for (let i = filteredWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filteredWords[i], filteredWords[j]] = [filteredWords[j], filteredWords[i]];
    }

    // Take the first 10 words or fewer if not enough
    return filteredWords.slice(0, 10);
  };

  // Start the game
  const startGame = () => {
    const words = filterWords(category, difficulty);
    setGameWords(words);
    setCurrentWordIndex(0);
    setScore(0);
    setGameStarted(true);
    setGameOver(false);

    if (words.length > 0) {
      setScrambledWord(scrambleWord(words[0].word));
      startTimer(words[0].difficulty);
    } else {
      // No words available for the selected filters
      alert("No words available for the selected category and difficulty. Please try different settings.");
      setGameStarted(false);
    }
  };

  // Start timer based on word difficulty
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
    const currentWord = gameWords[currentWordIndex];

    // Check if answer is correct (case insensitive)
    const isAnswerCorrect = userAnswer.toUpperCase().trim() === currentWord.word;

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

  // Move to next word
  const nextWord = () => {
    setShowResult(false);
    setUserAnswer("");
    setShowHint(false);

    if (currentWordIndex < gameWords.length - 1) {
      const nextIndex = currentWordIndex + 1;
      setCurrentWordIndex(nextIndex);
      setScrambledWord(scrambleWord(gameWords[nextIndex].word));

      // Start timer for next word
      startTimer(gameWords[nextIndex].difficulty);

      // Focus on input
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
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

  // Current word
  const currentWord = gameWords[currentWordIndex];

  const getTimeClass = () => {
    if (timeLeft > 20) return "time-high";
    if (timeLeft > 10) return "time-medium";
    return "time-low";
  };

  const getDifficultyClass = () => {
    if (!currentWord) return "";
    switch (currentWord.difficulty) {
      case "easy": return "difficulty-easy";
      case "medium": return "difficulty-medium";
      case "hard": return "difficulty-hard";
      default: return "";
    }
  };

  return (
    <div className="app-container">
      <div className="app-content">
        <h1 className="app-title">Word Scramble</h1>

        {!gameStarted ? (
          <div className="game-setup">
            <h2 className="setup-title">Word Scramble Challenge</h2>

            <div className="setup-content">
              <p className="setup-description">
                Unscramble words from various subjects to improve your vocabulary and spelling skills.
              </p>

              <div className="setup-field">
                <Label htmlFor="category" className="field-label">
                  Category
                </Label>
                <Select onValueChange={(value) => setCategory(value)} defaultValue="mixed">
                  <SelectItem value="mixed">Mixed</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="math">Math</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="geography">Geography</SelectItem>
                  <SelectItem value="literature">Literature</SelectItem>
                </Select>
              </div>

              <div className="setup-field">
                <Label htmlFor="difficulty" className="field-label">
                  Difficulty
                </Label>
                <Select onValueChange={(value) => setDifficulty(value)} defaultValue="mixed">
                  <SelectItem value="mixed">Mixed</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </Select>
              </div>

              <div className="how-to-play">
                <h3 className="howto-title">How to Play:</h3>
                <ul className="howto-list">
                  <li>Unscramble the letters to form a word</li>
                  <li>Type your answer before the timer runs out</li>
                  <li>Use hints if you're stuck</li>
                  <li>Score points for each correct answer</li>
                  <li>Complete all words to finish the game</li>
                </ul>
              </div>

              <Button onClick={startGame} className="start-button">
                Start Game
              </Button>
            </div>
          </div>
        ) : (
          <div className="game-area">
            {!gameOver ? (
              <div className="game-board">
                <div className="game-header">
                  <div className="game-progress">
                    Word {currentWordIndex + 1} of {gameWords.length}
                  </div>
                  <div className="game-score">
                    Score: {score}/{gameWords.length}
                  </div>
                </div>

                <div className="timer-container">
                  <div className="timer-header">
                    <div className="timer-label">Time Remaining</div>
                    <div className={`timer-value ${getTimeClass()}`}>
                      {timeLeft} seconds
                    </div>
                  </div>
                  <Progress
                    value={
                      (timeLeft /
                        (currentWord?.difficulty === "easy" ? 30 : currentWord?.difficulty === "medium" ? 45 : 60)) *
                      100
                    }
                    className="timer-progress"
                  />
                </div>

                <div className="word-container">
                  <div className="word-header">
                    <h2 className="word-title">Scrambled Word</h2>
                    <div className="word-tags">
                      <div className={`word-difficulty ${getDifficultyClass()}`}>
                        {currentWord?.difficulty}
                      </div>
                      <div className="word-category">
                        {currentWord?.category}
                      </div>
                    </div>
                  </div>

                  <div className="scrambled-word">
                    <div className="letter-container">
                      {scrambledWord.split("").map((letter, index) => (
                        <div
                          key={index}
                          className="letter-box"
                        >
                          {letter}
                        </div>
                      ))}
                    </div>
                  </div>

                  {showHint && (
                    <div className="hint-container">
                      <p className="hint-text">
                        <span className="hint-label">Hint:</span> {currentWord?.hint}
                      </p>
                    </div>
                  )}
                </div>

                <div className="answer-section">
                  <div className="answer-field">
                    <Label htmlFor="answer" className="answer-label">
                      Your Answer
                    </Label>
                    <Input
                      ref={inputRef}
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSubmit();
                        }
                      }}
                    />
                  </div>

                  <div className="answer-actions">
                    <Button
                      variant="outline"
                      onClick={() => setShowHint(true)}
                      disabled={showHint}
                      className="hint-button"
                    >
                      Show Hint
                    </Button>
                    <Button onClick={handleSubmit} className="submit-button">Submit Answer</Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="game-over">
                <h2 className="gameover-title">Game Complete!</h2>

                <div className="final-score">
                  {score}/{gameWords.length}
                </div>

                <p className="score-message">
                  {score === gameWords.length
                    ? "Perfect score! You're a word master!"
                    : score >= gameWords.length / 2
                      ? "Great job! You unscrambled most of the words!"
                      : "Nice try! Practice makes perfect!"}
                </p>

                <div className="gameover-actions">
                  <Button onClick={startGame} className="play-again">Play Again</Button>
                  <a href="/" className="home-link">
                    <Button variant="outline" className="home-button">
                      Back to Home
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Result Dialog */}
        <Dialog open={showResult} onOpenChange={setShowResult}>
          <div className="result-dialog">
            {isCorrect ? (
              <>
                <div className="result-emoji">🎉</div>
                <h3 className="result-correct">Correct!</h3>
                <p className="result-message">Well done! You unscrambled the word.</p>
              </>
            ) : (
              <>
                <div className="result-emoji">😢</div>
                <h3 className="result-incorrect">
                  {timeLeft === 0 ? "Time's Up!" : "Incorrect!"}
                </h3>
                <p className="result-prompt">The correct word was:</p>
                <p className="result-answer">{currentWord?.word}</p>
              </>
            )}
            <Button onClick={nextWord} className="next-button">
              {currentWordIndex < gameWords.length - 1 ? "Next Word" : "See Results"}
            </Button>
          </div>
        </Dialog>

        {/* Hidden canvas for confetti */}
        <canvas ref={confettiCanvasRef} className="confetti-canvas" />
      </div>
    </div>
  );
}

export default WordScrambleGame;