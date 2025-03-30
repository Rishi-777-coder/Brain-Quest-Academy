import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./home.css";
import {
  BookOpen,
  Brain,
  Calculator,
  ChevronRight,
  Code,
  Gamepad2,
  Lightbulb,
  X,
  Microscope,
} from "lucide-react";

const HomePage = () => {
  const [showHiddenGame, setShowHiddenGame] = useState(false);
  const [hiddenGameConcept, setHiddenGameConcept] = useState("");
  const [hiddenGameVisible, setHiddenGameVisible] = useState(false);

  const educationalConcepts = [
    { term: "Algorithm", definition: "A step-by-step procedure for solving a problem or accomplishing a task." },
    { term: "Photosynthesis", definition: "The process by which green plants convert sunlight into energy." },
    { term: "Pythagorean Theorem", definition: "In a right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides." },
    { term: "Mitochondria", definition: "The powerhouse of the cell, responsible for producing energy." },
    { term: "Newton's Third Law", definition: "For every action, there is an equal and opposite reaction." },
    { term: "Osmosis", definition: "The movement of water molecules across a semipermeable membrane." },
  ];

  useEffect(() => {
    const randomChance = Math.random();
    if (randomChance < 0.2) {
      const randomConcept = educationalConcepts[Math.floor(Math.random() * educationalConcepts.length)];
      setHiddenGameConcept(randomConcept);
      setShowHiddenGame(true);
      setHiddenGameVisible(true);

      const timer = setTimeout(() => {
        setHiddenGameVisible(false);
        setTimeout(() => setShowHiddenGame(false), 500);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="homepage">
      <div className="container">
        <header className="header">
          <h1>BrainQuest Academy</h1>
          <p>Explore interactive educational games designed to make learning engaging and fun</p>
        </header>

        <div className="game-grid">
          <GameCard title="Knowledge Ladder" description="Climb the ladder by answering questions correctly, but watch out for wrong answers!" icon={<Gamepad2 className="icon" />} href="/quiz-ladder" active={true} />
          <GameCard title="Brain Teasers" description="Solve challenging riddles and puzzles before time runs out" icon={<Lightbulb className="icon" />} href="/riddles" active={true} />
          <GameCard title="Concept Match" description="Match definitions with terms and shortcuts across different subjects" icon={<Brain className="icon" />} href="/memory-match" active={true} />
          <GameCard title="Logic Grid" description="Test your logical thinking with different difficulty levels of Sudoku puzzles" icon={<BookOpen className="icon" />} href="/sudoku" active={true} />
          <GameCard title="Code Breaker" description="Solve computer science puzzles and learn programming concepts" icon={<Code className="icon" />} href="/code-breaker" active={true} />
          <GameCard title="Math Mastery" description="Solve math problems including calculus concepts like integration and differentiation" icon={<Calculator className="icon" />} href="/math-ninja" active={true} />
          <GameCard title="Biology Quest" description="Explore biological concepts through case studies and knowledge challenges" icon={<Microscope className="icon" />} href="/biology-quest" active={true} />
        </div>

        {showHiddenGame && (
          <div className={`hidden-game ${hiddenGameVisible ? "visible" : "hidden"}`}>
            <div className="hidden-game-content">
              <div className="hidden-game-header">
                <h3>Quick Knowledge Burst!</h3>
                <button onClick={() => { setHiddenGameVisible(false); setTimeout(() => setShowHiddenGame(false), 500); }}>
                  <X className="close-icon" />
                </button>
              </div>
              <div className="hidden-game-body">
                <h4>{hiddenGameConcept.term}</h4>
                <p>{hiddenGameConcept.definition}</p>
              </div>
              <div className="hidden-game-footer">
                This knowledge burst will disappear in a few seconds!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const GameCard = ({ title, description, icon, href, active }) => {
  return (
    <div className="game-card">
      <div className="game-card-content">
        <div className="game-card-header">
          {icon}
          <h3>{title}</h3>
        </div>
        <p>{description}</p>
        <div className="game-card-buttons">
          {active ? (
            <Link to={href} className="play-button">
              Play <ChevronRight className="chevron-icon" />
            </Link>
          ) : (
            <button disabled>Coming Soon</button>
          )}
          <Link to={active ? `${href}-info` : "#"} className={`preview-button ${!active ? "disabled" : ""}`}>
            Preview
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;