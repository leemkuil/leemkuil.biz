import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GAME_MODES = {
  THREE_CARD: {
    id: 'THREE_CARD',
    name: 'Three Card',
    cardsToSelect: 3,
    positions: [
      { x: -200, y: 400, rotate: 0 },
      { x: 0, y: 400, rotate: 0 },
      { x: 200, y: 400, rotate: 0 }
    ]
  }
};

const useCardGame = (cardsData) => {
  const [allCards, setAllCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectionComplete, setSelectionComplete] = useState(false);
  const [gameMode, setGameMode] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [showSummaries, setShowSummaries] = useState(false);
  const cardWidth = 150;

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const calculateFanPositions = (count) => {
    const viewportWidth = window.innerWidth || 1200;
    const radius = Math.min(500, viewportWidth * 0.7);
    const arcAngle = Math.min(90, 15 * count);
    const startAngle = -arcAngle / 2;
    const endAngle = arcAngle / 2;
    
    const leftCardX = radius * Math.sin(startAngle * Math.PI / 180);
    const rightCardX = radius * Math.sin(endAngle * Math.PI / 180);
    const fanWidth = rightCardX - leftCardX + cardWidth;
    const centerOffset = (viewportWidth - fanWidth) / 2.25 - leftCardX;
    
    return Array(count).fill(0).map((_, i) => {
      const angle = startAngle + (i * arcAngle / (count - 1));
      const radian = angle * (Math.PI / 180);
      
      return {
        x: centerOffset + radius * Math.sin(radian),
        y: radius * (1 - Math.cos(radian)),
        rotate: angle
      };
    });
  };

  const getSelectedCardPositions = (count) => {
    const viewportWidth = window.innerWidth || 1200;
    const spacing = Math.min(100, Math.max(20, (viewportWidth - (cardWidth * count)) / (count + 1)));
    const totalWidth = (count * cardWidth) + ((count - 1) * spacing);
    const startX = (viewportWidth - totalWidth) / 3;

    return Array(count).fill(0).map((_, index) => ({
      x: startX + (index * (cardWidth + spacing)),
      y: 350,
      rotate: 0,
      scale: 1.0
    }));
  };

  const initializeGame = (mode) => {
    const shuffledCards = shuffleArray(cardsData.cards);
    const fanPositions = calculateFanPositions(shuffledCards.length);
    
    setAllCards(shuffledCards.map((card, index) => ({
      ...card,
      id: index,
      isFlipped: false,
      position: fanPositions[index],
      status: 'inFan',
      isSelectable: true,
      opacity: 1,
      selectionIndex: -1 // Initialize selection index
    })));
    
    setSelectedCards([]);
    setSelectionComplete(false);
    setGameMode(mode);
    setRevealed(false);
    setShowSummaries(false);
  };

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
    const selectedPositions = getSelectedCardPositions(newSelectedCards.length);
    
    setAllCards(prevCards => 
      prevCards.map(card => 
        card.id === clickedId 
          ? { 
              ...card, 
              status: 'selected', 
              isSelectable: false,
              position: selectedPositions[newSelectedCards.length - 1],
              scale: 1.0,
              opacity: 1,
              selectionIndex: selectedCards.length // Store selection order
            } 
          : card
      )
    );
    
    setSelectedCards(newSelectedCards);

    if (newSelectedCards.length === gameMode.cardsToSelect) {
      setTimeout(() => {
        revealCards();
      }, 500);
    }
  };

  const revealCards = () => {
    setShowSummaries(false);

    // Mark selected cards as 'revealing' and fade out fan cards
    setAllCards(prevCards => 
      prevCards.map(card => {
        if (card.status === 'selected') {
          return { ...card, status: 'revealing', opacity: 1 };
        }
        if (card.status === 'inFan') {
          return { ...card, opacity: 0 };
        }
        return card;
      })
    );

    // After fade out completes, move cards to final position first
    setTimeout(() => {
      // Sort by original selection order to maintain positions
      const sortedCards = [...selectedCards].sort((a, b) => a.selectionIndex - b.selectionIndex);

      setAllCards(prevCards => {
        const revealingCards = prevCards
          .filter(card => card.status === 'revealing')
          .sort((a, b) => a.selectionIndex - b.selectionIndex);

        const cardCount = revealingCards.length;
        const viewportWidth = window.innerWidth || 1200;
        
        const spacing = Math.min(100, Math.max(20, (viewportWidth - (cardWidth * cardCount)) / (cardCount + 1)));
        const totalWidth = (cardCount * cardWidth) + ((cardCount - 1) * spacing);
        const startX = (viewportWidth - totalWidth) / 2;
        
        return prevCards.map(card => {
          if (card.status === 'revealing') {
            const index = revealingCards.findIndex(c => c.id === card.id);
            return {
              ...card,
              position: { 
                x: Math.max(20, Math.min(
                  viewportWidth - cardWidth - 20,
                  startX + (index * (cardWidth + spacing))
                )),
                y: 100,
                rotate: 0 
              },
              scale: 1.5,
              isFlipped: false,
              status: 'moving',
              opacity: 1
            };
          }
          return card;
        });
      });

      // After move completes, flip cards one by one in selection order
      sortedCards.forEach((card, index) => {
        setTimeout(() => {
          setAllCards(prevCards => 
            prevCards.map(c => 
              c.id === card.id 
                ? { ...c, isFlipped: true, status: 'revealed' } 
                : c
            )
          );
        }, 750 + (index * 500));
      });

      // Show summaries after all cards are flipped
      setTimeout(() => {
        setRevealed(true);
        setShowSummaries(true);
      }, 750 + (sortedCards.length * 500));
    }, 300);
  };

  return {
    allCards,
    selectedCards,
    selectionComplete,
    gameMode,
    revealed,
    showSummaries,
    cardBackImage: cardsData.cardBackImage.path,
    cardWidth,
    initializeGame,
    handleCardClick,
    revealCards,
    resetGame: initializeGame
  };
};

const CardGameUI = ({ 
  allCards, 
  onCardClick, 
  cardBackImage,
  cardWidth = 150,
  cardHeight = 250,
  revealed,
  showSummaries
}) => {
  return (
    <div style={{ 
      position: 'relative',
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      margin: '0 auto',
      padding: '20px',
      boxSizing: 'border-box'
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
              initial={false}
              animate={{
                x: card.position.x,
                y: card.position.y,
                rotate: card.position.rotate || 0,
                scale: card.scale || 1,
                opacity: card.opacity ?? 1
              }}
              exit={{ opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                mass: 0.5,
                opacity: { duration: 0.3 }
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
  variants={{
    entering: { opacity: 0, y: 20 },
    entered: { opacity: 1, y: 0 }
  }}
  transition={{ delay: 0.3 }}
  className="card-summary"
  style={{
    left: `${card.position.x + cardWidth - 135}px`,
    top: `${card.position.y + cardHeight + 100}px`,
    width: `${cardWidth}px`
  }}
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