import { Link } from "react-router-dom";
// import { Button } from "../components/ui/button";
import { Microscope, Home, Brain, Dna, Leaf, FlaskRoundIcon as Flask } from "lucide-react";
import "./biology-quest-info-page.css";

export default function BiologyQuestInfo() {
  return (
    <div className="min-h-screen bg-gradient main-container">
      <div className="container">
        <div className="header">
          <h1 className="title">Biology Quest</h1>
          <Link href="/">
            <Button variant="outline" size="sm" className="back-button">
              <Home className="icon-small" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="content-card">
          <div className="icon-container">
            <Microscope className="hero-icon" />
          </div>

          <h2 className="subtitle">Biology Quest Challenge</h2>

          <div className="sections">
            <section>
              <h3 className="section-title">
                <Brain className="section-icon" />
                Game Overview
              </h3>
              <p className="section-text">
                Biology Quest is an educational game designed to test and expand your knowledge of biological concepts
                across various difficulty levels. From cell biology to ecology, genetics to physiology, this game covers
                a wide range of topics to challenge students from middle school through undergraduate levels.
              </p>
            </section>

            <section>
              <h3 className="section-title">
                <Dna className="section-icon" />
                Academic Levels
              </h3>
              <div className="card-grid-3">
                <div className="level-card">
                  <h4 className="level-title">Middle School</h4>
                  <p className="level-text">
                    For 8th-10th grade students. Covers basic biological concepts with straightforward questions and
                    clear explanations.
                  </p>
                </div>
                <div className="level-card">
                  <h4 className="level-title">High School</h4>
                  <p className="level-text">
                    For 11th-12th grade students. Includes more complex topics and requires deeper understanding of
                    biological processes.
                  </p>
                </div>
                <div className="level-card">
                  <h4 className="level-title">Undergraduate</h4>
                  <p className="level-text">
                    College-level biology questions covering advanced topics and requiring application of concepts to
                    solve problems.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="section-title">
                <Leaf className="section-icon" />
                Question Types
              </h3>
              <div className="card-grid-2">
                <div className="level-card">
                  <h4 className="level-title">Knowledge Questions</h4>
                  <p className="level-text">
                    Test your understanding of fundamental biological concepts, terminology, and processes across
                    various topics.
                  </p>
                </div>
                <div className="level-card">
                  <h4 className="level-title">Case-Based Scenarios</h4>
                  <p className="level-text">
                    Apply your knowledge to real-world biological problems and scenarios, requiring critical thinking
                    and analysis.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="section-title">
                <Flask className="section-icon" />
                How to Play
              </h3>
              <ul className="list">
                <li>Select your academic level before starting the game</li>
                <li>Answer multiple-choice questions before the timer runs out</li>
                <li>Use hints when needed, but be aware they reduce your potential score</li>
                <li>Learn from detailed explanations after each question</li>
                <li>Track your progress and aim to improve your score with each game</li>
                <li>Higher difficulty levels offer more challenging questions but higher point values</li>
              </ul>
            </section>

            <section>
              <h3 className="section-title">Educational Benefits</h3>
              <ul className="list">
                <li>Reinforces key biological concepts across various topics</li>
                <li>Develops critical thinking skills through case-based scenarios</li>
                <li>Provides immediate feedback and detailed explanations</li>
                <li>Adapts to different academic levels for appropriate challenge</li>
                <li>Makes learning biology engaging and interactive</li>
                <li>Prepares students for exams and assessments</li>
              </ul>
            </section>

            <div className="button-container">
              <Link href="/games/biology-quest">
                <Button size="lg" className="play-button">
                  Play Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}