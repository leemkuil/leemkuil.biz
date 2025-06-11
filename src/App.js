import { useState, useEffect } from 'react';
import cardData from './cardData';
import { useCardGame, CardGameUI, GAME_MODES } from './cardGame';
import { generateInterpretation } from './services/deepseekApi';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [interpretation, setInterpretation] = useState(null);
  const [interpretationError, setInterpretationError] = useState(null);
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);

  const {
    allCards,
    selectedCards,
    initializeGame,
    handleCardClick,
    revealCards,
    selectionComplete,
    revealed,
    showSummaries,
    cardBackImage,
    cardWidth
  } = useCardGame(cardData);

  useEffect(() => {
    if (selectionComplete && !revealed) {
      const timer = setTimeout(() => {
        revealCards();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectionComplete, revealed, revealCards]);

  const handleInterpret = async () => {
    if (selectedCards.length !== 3) {
      setInterpretationError('Please select exactly 3 cards for interpretation');
      return;
    }

    setIsInterpreting(true);
    setInterpretation(null);
    setInterpretationError(null);
    setShowInterpretation(true);

    try {
      const result = await generateInterpretation(selectedCards);
      setInterpretation(result);
    } catch (error) {
      console.error('Interpretation error:', error);
      setInterpretationError(error.message || 'Failed to generate interpretation');
    } finally {
      setIsInterpreting(false);
    }
  };

 useEffect(() => {
  if (interpretation) {
    setDisplayedText('');
    setTypingIndex(0);
  }
}, [interpretation]);

useEffect(() => {
  if (!interpretation || typingIndex >= interpretation.length) return;

  const timeout = setTimeout(() => {
    setDisplayedText(prev => prev + interpretation[typingIndex]);
    setTypingIndex(prev => prev + 1);
  }, 25);

  return () => clearTimeout(timeout);
}, [typingIndex, interpretation]);

  const startGame = () => {
    setGameStarted(true);
    initializeGame(GAME_MODES.THREE_CARD);
    setInterpretation(null);
    setInterpretationError(null);
    setShowInterpretation(false);
  };

  if (!gameStarted) {
    return (
      <div className="home-screen">
        <h1 className="home-title">Fortuna</h1>
        <button className="start-button" onClick={startGame}>
          Begin
        </button>
      </div>
    );
  }

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <CardGameUI 
        allCards={allCards}
        onCardClick={handleCardClick}
        cardBackImage={cardBackImage}
        cardWidth={cardWidth}
        selectionComplete={selectionComplete}
        revealed={revealed}
        showSummaries={showSummaries}
        style={{ marginBottom: '-50px' }} // Pull cards up
      />
      <div className = 'back-button'>
        <a href="">Back</a>
      </div>
      <div className = 'instructions'>
        {!selectionComplete &&(
        <h2>Draw Three Cards</h2>)}
      </div>

      {/* Combined Interpretation Section */}
      <div className="interpretation-section">
        {/* Interpret Button */}
        {showSummaries && !interpretation && (
          <button
            className={`interpret-button ${isInterpreting ? 'interpreting' : ''}`}
            onClick={handleInterpret}
            disabled={isInterpreting}
          >
            {isInterpreting ? 'Reading the cards' : 'Interpret'}
          </button>
        )}

        {/* Interpretation Results */}
        {showInterpretation && (interpretation || interpretationError) && (
          <div className="interpretation-container">
            {isInterpreting && (
              <div className="interpreting-message">
                <p>Consulting the cards...</p>
              </div>
            )}

            {interpretationError && (
              <div className="error-message">{interpretationError}</div>
            )}

            {interpretation && (
              <div>
                <h3 className="interpretation-title">Your Reading</h3>
                <div className="interpretation-content typewriter">{displayedText}</div>
              </div>
            )}
          </div>
        )}
      </div>

      
    </div>
  );
}

export default App;