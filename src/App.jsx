import { Routes, Route } from 'react-router-dom';
import './App.css';

// Import all JSX components
import Home from './home';

// Game pages/components
import BiologyQuestInfo from './biology-quest-info-page';
import BiologyQuest from './biology-quest-page';
import CodeBreaker from './code-breaker-page';
import MathNinja from './math-ninja-page';
import MemoryMatch from './memory-match-page';
import QuizLadderInfo from './quiz-ladder-info-page';
import QuizLadder from './quiz-ladder-page';
import Riddles from './riddles-page';
import Sudoku from './sudoku-page';
import WordScramble from './word-scramble-page';

function App() {
  return (
    <div className="app-container">
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<Home />} />

        {/* Game Routes */}
        <Route path="/biology-quest-info" element={<BiologyQuestInfo />} />
        <Route path="/biology-quest" element={<BiologyQuest />} />
        <Route path="/code-breaker" element={<CodeBreaker />} />
        <Route path="/math-ninja" element={<MathNinja />} />
        <Route path="/memory-match" element={<MemoryMatch />} />
        <Route path="/quiz-ladder-info" element={<QuizLadderInfo />} />
        <Route path="/quiz-ladder" element={<QuizLadder />} />
        <Route path="/riddles" element={<Riddles />} />
        <Route path="/sudoku" element={<Sudoku />} />
        <Route path="/word-scramble" element={<WordScramble />} />
      </Routes>
    </div>
  );
}

export default App;
