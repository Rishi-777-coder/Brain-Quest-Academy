// QuizLadderInfo.jsx
import React from "react";
import { Link } from "react-router-dom"; // Using react-router instead of next/link
import "./quiz-ladder-info-page.css"
function QuizLadderInfo() {
  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Quiz Ladder Game</h1>
        
        <img
          src="/placeholder.svg?height=300&width=600"
          alt="Quiz Ladder Game Preview"
          className="preview-image"
        />
        
        <div className="content">
          <section>
            <h2 className="section-title">Game Overview</h2>
            <p className="description">
              Quiz Ladder is an educational twist on the classic Snakes and Ladders game. Players roll a dice to move
              along the board, but instead of snakes and ladders, they encounter question boxes. Answering correctly
              helps you climb up, while wrong answers make you slide down!
            </p>
          </section>
          
          <section>
            <h2 className="section-title">How to Play</h2>
            <ul className="list">
              <li>Take turns rolling the dice to move your player token along the board</li>
              <li>When you land on a question box (marked with ❓), you must answer a multiple-choice question</li>
              <li>Correct answers let you advance additional spaces (like climbing a ladder)</li>
              <li>Wrong answers make you fall back (like sliding down a snake)</li>
              <li>The number of spaces you advance or fall back depends on the difficulty of the question</li>
              <li>The first player to reach position 100 wins the game!</li>
            </ul>
          </section>
          
          <section>
            <h2 className="section-title">Educational Benefits</h2>
            <ul className="list">
              <li>Reinforces knowledge across various subjects</li>
              <li>Makes learning fun through gamification</li>
              <li>Encourages friendly competition</li>
              <li>Suitable for players of all ages</li>
              <li>Questions vary in difficulty to challenge different skill levels</li>
            </ul>
          </section>
          
          <div className="button-container">
            <Link to="/games/quiz-ladder">
              <button className="play-button">
                Play Now
              </button>
            </Link>
          </div>
          
          <div className="back-link">
            <Link to="/" className="home-link">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizLadderInfo;