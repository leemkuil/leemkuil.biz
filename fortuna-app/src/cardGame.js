import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { motion, AnimatePresence } from 'framer-motion';

const GAME_MODES = {
  THREE_CARD: {
    id: 'THREE_CARD',
    name: 'Three Card',
    cardsToSelect: 3,
    // These positions are likely illustrative and overridden by calculations,
    // but keep them in mind if you have static position needs
    positions: [
      { x: -200, y: 400, rotate: 0 },
      { x: 0, y: 400, rotate: 0 },
      { x: 200, y: 400, rotate: 0 }
    ]
  }
  // Add other game modes if needed
};

// Helper function to get responsive card dimensions
const getCardDimensions = () => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let cardWidth = 150; // Default desktop width
  let cardHeight = 250; // Default desktop height

  // Adjust card size for smaller screens
  if (viewportWidth < 768) {
    cardWidth = 100; // Smaller width for mobile
    cardHeight = 170; // Proportionate height for mobile
  } else if (viewportWidth < 1024) { // For tablets
    cardWidth = 120;
    cardHeight = 200;
  }

  return { cardWidth, cardHeight, viewportWidth, viewportHeight };
};

const useCardGame = (cardsData) => {
  const [allCards, setAllCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectionComplete, setSelectionComplete] = useState(false);
  const [gameMode, setGameMode] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [showSummaries, setShowSummaries] = useState(false);

  // Use state for card dimensions to re-calculate on resize
  const [cardDims, setCardDims] = useState(getCardDimensions());

  // Update card dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      setCardDims(getCardDimensions());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { cardWidth, cardHeight, viewportWidth, viewportHeight } = cardDims; // Destructure for easier access

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const calculateFanPositions = useCallback((count) => {
    const radius = Math.min(500, viewportWidth * 0.7);
    const arcAngle = Math.min(90, 15 * count); // Max 90 degrees fan
    const startAngle = -arcAngle / 2;

    // Calculate the total width of the fan to center it
    const positions = Array(count).fill(0).map((_, i) => {
      const angle = startAngle + (i * arcAngle / (count - 1 || 1)); // Prevent division by zero if count is 1
      const radian = angle * (Math.PI / 180);

      // Raw X position based on angle
      const rawX = radius * Math.sin(radian);
      // Raw Y position based on angle, adjusted so base of fan is at a consistent Y
      const rawY = radius * (1 - Math.cos(radian));

      return { x: rawX, y: rawY, rotate: angle };
    });

    // Find min and max X to calculate total fan width
    const minX = Math.min(...positions.map(p => p.x));
    const maxX = Math.max(...positions.map(p => p.x));
    const fanTotalWidth = maxX - minX + cardWidth; // Add card width to total span

    // Calculate offset to center the fan horizontally
    const offsetX = (viewportWidth - fanTotalWidth) / 2 - minX;

    // Adjust Y position to place fan lower on the screen for better visibility
    // This value might need tweaking based on your design
    const fanBaseY = viewportHeight * 0.4; // Place fan around 65% down the viewport

    return positions.map(pos => ({
      x: pos.x + offsetX,
      y: fanBaseY + pos.y, // Add base Y to the calculated Y
      rotate: pos.rotate
    }));
  }, [viewportWidth, viewportHeight, cardWidth]); // Depend on dims for re-calculation


  const getSelectedCardPositions = useCallback((count) => {
    // Dynamically adjust spacing based on viewport width
    const minSpacing = 20;
    const maxSpacing = 100; // Max spacing for larger screens
    const calculatedSpacing = (viewportWidth - (cardWidth * count)) / (count + 1);
    const spacing = Math.min(maxSpacing, Math.max(minSpacing, calculatedSpacing));

    const totalWidth = (count * cardWidth) + ((count - 1) * spacing);
    const startX = (viewportWidth - totalWidth) / 2; // Always center

    // Adjust Y position for selected cards, higher up
    const selectedCardsY = viewportHeight * 0.35; // Place selected cards around 35% down

    return Array(count).fill(0).map((_, index) => ({
      x: startX + (index * (cardWidth + spacing)),
      y: selectedCardsY,
      rotate: 0,
      scale: 1.0
    }));
  }, [viewportWidth, viewportHeight, cardWidth]); // Depend on dims for re-calculation


  const initializeGame = useCallback((mode) => {
    const shuffledCards = shuffleArray(cardsData.cards);
    const fanPositions = calculateFanPositions(shuffledCards.length);

    setAllCards(shuffledCards.map((card, index) => ({
      ...card,
      id: index, // Ensure unique ID
      isFlipped: false,
      position: fanPositions[index],
      status: 'inFan',
      isSelectable: true,
      opacity: 1,
      selectionIndex: -1
    })));

    setSelectedCards([]);
    setSelectionComplete(false);
    setGameMode(mode);
    setRevealed(false);
    setShowSummaries(false);
  }, [cardsData.cards, calculateFanPositions]); // Add dependencies for useCallback

  // Effect to initialize game when component mounts or game mode changes
  useEffect(() => {
    // Only initialize if gameMode is set (e.g., after user selects mode)
    // Or if you want to auto-start with THREE_CARD
    if (!gameMode) {
      initializeGame(GAME_MODES.THREE_CARD); // Auto-start with three card mode
    }
  }, [gameMode, initializeGame]); // Depend on gameMode and initializeGame

  useEffect(() => {
    if (gameMode && selectedCards.length === gameMode.cardsToSelect && !selectionComplete) {
      setSelectionComplete(true);
    }
  }, [selectedCards, selectionComplete, gameMode]);

  const handleCardClick = (clickedId) => {
    if (!gameMode ||
        selectedCards.length >= gameMode.cardsToSelect ||
        !allCards.find(c => c.id === clickedId)?.isSelectable) {
      return;
    }

    const clickedCard = allCards.find(card => card.id === clickedId);
    const newSelectedCards = [...selectedCards, {
      ...clickedCard,
      selectionIndex: selectedCards.length // Track selection order
    }];

    // Get positions for the *new* set of selected cards
    const currentSelectedPositions = getSelectedCardPositions(newSelectedCards.length);

    setAllCards(prevCards =>
      prevCards.map(card => {
        if (card.id === clickedId) {
          const newIndex = newSelectedCards.length - 1; // Index in the newSelectedCards array
          return {
            ...card,
            status: 'selected',
            isSelectable: false,
            position: currentSelectedPositions[newIndex], // Use the dynamically calculated position
            scale: 1.0,
            opacity: 1,
            selectionIndex: newSelectedCards.length - 1 // Store selection order
          };
        } else if (card.status === 'inFan' && newSelectedCards.length === gameMode.cardsToSelect) {
          // Fade out unselected cards in fan once selection is complete
          return { ...card, opacity: 0 };
        }
        return card;
      })
    );

    setSelectedCards(newSelectedCards);

    // If selection is complete, initiate reveal after a short delay
    if (newSelectedCards.length === gameMode.cardsToSelect) {
      setTimeout(() => {
        revealCards();
      }, 500); // Small delay before revealing
    }
  };


  const revealCards = useCallback(() => {
    setShowSummaries(false);

    // Step 1: Mark selected cards as 'revealing' and fade out fan cards
    setAllCards(prevCards =>
      prevCards.map(card => {
        if (card.status === 'selected') {
          return { ...card, status: 'revealing', opacity: 1 };
        }
        // Ensure fan cards that are not selected fade out
        if (card.status === 'inFan' && !selectedCards.some(sc => sc.id === card.id)) {
          return { ...card, opacity: 0 };
        }
        return card;
      })
    );

    // After fade out completes (or instantly for selected cards), move cards to final position
    setTimeout(() => {
      // Sort by original selection order to maintain positions during reveal
      const sortedCardsForReveal = [...selectedCards].sort((a, b) => a.selectionIndex - b.selectionIndex);

      setAllCards(prevCards => {
        const revealingCards = prevCards
          .filter(card => card.status === 'revealing')
          .sort((a, b) => a.selectionIndex - b.selectionIndex); // Re-sort to match selection order

        const cardCount = revealingCards.length;

        // Calculate final reveal positions, centered
        const finalCardWidth = cardWidth * 1.5; // Final revealed card scale (1.5)
        const minRevealSpacing = 20;
        const calculatedRevealSpacing = (viewportWidth - (finalCardWidth * cardCount)) / (cardCount + 1);
        const revealSpacing = Math.max(minRevealSpacing, calculatedRevealSpacing);

        const totalRevealWidth = (cardCount * finalCardWidth) + ((cardCount - 1) * revealSpacing);
        const startRevealX = (viewportWidth - totalRevealWidth) / 2;

        const revealedCardsY = viewportHeight * 0.15; // Position revealed cards higher on screen

        return prevCards.map(card => {
          if (card.status === 'revealing') {
            const index = revealingCards.findIndex(c => c.id === card.id);
            return {
              ...card,
              position: {
                x: Math.max(20, Math.min(
                  viewportWidth - finalCardWidth - 20, // Ensure not off-screen
                  startRevealX + (index * (finalCardWidth + revealSpacing))
                )),
                y: revealedCardsY, // Dynamic Y position
                rotate: 0
              },
              scale: 1.5, // Scale up for final revealed state
              isFlipped: false, // Ensure not yet flipped
              status: 'moving',
              opacity: 1 // Ensure visible
            };
          }
          return card;
        });
      });

      // After move completes, flip cards one by one in selection order
      sortedCardsForReveal.forEach((card, index) => {
        setTimeout(() => {
          setAllCards(prevCards =>
            prevCards.map(c =>
              c.id === card.id
                ? { ...c, isFlipped: true, status: 'revealed' }
                : c
            )
          );
        }, 750 + (index * 500)); // Delay for movement + sequential flip
      });

      // Show summaries after all cards are flipped
      setTimeout(() => {
        setRevealed(true);
        setShowSummaries(true);
      }, 750 + (sortedCardsForReveal.length * 500));
    }, 300); // Delay for initial fan fade out
  }, [viewportWidth, viewportHeight, cardWidth, selectedCards]); // Depend on dims and selectedCards


  const resetGame = useCallback(() => {
    initializeGame(gameMode || GAME_MODES.THREE_CARD); // Re-initialize with current mode or default
  }, [initializeGame, gameMode]); // Depend on initializeGame and gameMode

  return {
    allCards,
    selectedCards,
    selectionComplete,
    gameMode,
    revealed,
    showSummaries,
    cardBackImage: cardsData.cardBackImage.path,
    cardWidth, // Expose dynamic cardWidth
    cardHeight, // Expose dynamic cardHeight
    initializeGame,
    handleCardClick,
    revealCards,
    resetGame
  };
};

const CardGameUI = ({
  allCards,
  onCardClick,
  cardBackImage,
  cardWidth,
  cardHeight,
  revealed,
  showSummaries
}) => {
  const getSummaryStyle = useCallback((card) => {
    const cardScale = card.scale || 1;
    const actualCardWidth = cardWidth * cardScale;
    const actualCardHeight = cardHeight * cardScale;
    let summaryOffsetX = actualCardWidth / 2;
    let summaryOffsetY = actualCardHeight * 0.45;

    if (card.status === 'revealed') {
      summaryOffsetY = actualCardHeight * 0.6;
    }
    const summaryWidth = actualCardWidth * 0.8;

    return {
      left: `${card.position.x + summaryOffsetX}px`,
      top: `${card.position.y + summaryOffsetY}px`,
      width: `${summaryWidth}px`,
      
      zIndex: card.status === 'revealed' ? 40 : 35,
    };
  }, [cardWidth, cardHeight]);

  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      width: '100%',
      overflow: 'hidden', /* This clips anything outside, so positions must be correct */
      margin: '0 auto',
      boxSizing: 'border-box'
      /* Padding removed to prevent coordinate conflicts */
    }}>
      <AnimatePresence>
        {allCards.map((card) => (
          <React.Fragment key={card.id}>
            <motion.div
              style={{
                position: 'absolute',
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                backgroundImage: `url(${card.isFlipped ? card.path : cardBackImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                transformOrigin: 'center',
                cursor: card.isSelectable ? 'pointer' : 'default',
                zIndex: card.status === 'revealed' ? 30 :
                        card.status === 'moving' ? 25 :
                        card.status === 'revealing' ? 20 :
                        card.status === 'selected' ? 15 : 10,
                opacity: card.opacity ?? 1
              }}
              /* FIX: Replace initial={false} with an explicit animation state */
              initial={{ opacity: 0, y: window.innerHeight }}
              animate={{
                x: card.position.x,
                y: card.position.y,
                rotate: card.position.rotate || 0,
                scale: card.scale || 1,
                opacity: card.opacity ?? 1
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 200,
                /* Stagger the initial animation of each card */
                delay: (card.id % 20) * 0.05,
              }}
              whileHover={card.status === 'inFan' && card.isSelectable ? {
                y: card.position.y - 20,
                scale: 1.05,
                boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                transition: { duration: 0.2 }
              } : undefined}
              onClick={() => card.isSelectable && onCardClick(card.id)}
            />

            {showSummaries && card.isFlipped && (
    <motion.div
        initial="entering"
        animate="entered"
        
        /* ==================== FIX STARTS HERE ==================== */
        variants={{
            entering: { opacity: 0, transform: 'translateX(-50%) translateY(20px)' },
            entered: { opacity: 1, transform: 'translateX(-50%) translateY(0px)' }
        }}
        /* ===================== FIX ENDS HERE ===================== */

        transition={{ delay: 0.3 }}
        className="card-summary"
        style={getSummaryStyle(card)}
    >
        {card.summary}
    </motion.div>
)}
          </React.Fragment>
        ))}
      </AnimatePresence>
    </div>
  );
};

export { useCardGame, CardGameUI, GAME_MODES };