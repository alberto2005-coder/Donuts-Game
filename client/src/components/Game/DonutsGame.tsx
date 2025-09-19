import React, { useEffect } from "react";
import { useDonutsGame } from "@/lib/stores/useDonutsGame";
import { useAudio } from "@/lib/stores/useAudio";
import GameBoard from "./GameBoard";
import GameUI from "./GameUI";
import VictoryModal from "./VictoryModal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DonutsGame: React.FC = () => {
  const { 
    gameState, 
    currentPlayer, 
    winner, 
    initializeGame, 
    resetGame,
    isGameOver,
    gameMode,
    aiPlayer,
    isAiThinking,
    makeAiMove
  } = useDonutsGame();
  
  const { toggleMute, isMuted } = useAudio();

  useEffect(() => {
    // Initialize the game when component mounts
    initializeGame();
  }, [initializeGame]);

  // Trigger AI moves when it's the AI's turn
  useEffect(() => {
    const shouldMakeAiMove = 
      gameMode === 'human-vs-ai' && 
      currentPlayer === aiPlayer && 
      !isGameOver && 
      !isAiThinking &&
      gameState.board;
    
    if (shouldMakeAiMove) {
      // Add a small delay to make the AI move feel more natural
      const timer = setTimeout(() => {
        makeAiMove();
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [gameMode, currentPlayer, aiPlayer, isGameOver, isAiThinking, gameState.board, makeAiMove]);

  const handleNewGame = () => {
    resetGame();
    initializeGame();
  };

  if (!gameState.board) {
    return (
      <Card className="p-8 max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-amber-800 mb-4">🍩 Donuts 🍩</h1>
          <p className="text-gray-600 mb-6">A tactical board game by Bruno Cathala</p>
          <Button onClick={initializeGame} size="lg">
            Start New Game
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="p-6">
        {/* Game Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-amber-800 mb-2">🍩 Donuts 🍩</h1>
          <p className="text-gray-600">Tactical placement game for 2 players</p>
        </div>

        {/* Game Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button onClick={handleNewGame} variant="outline">
              New Game
            </Button>
            <Button onClick={toggleMute} variant="outline">
              {isMuted ? "🔇 Unmute" : "🔊 Mute"}
            </Button>
          </div>
          
          {!isGameOver && (
            <div className="text-lg font-semibold">
              Current Player: 
              <span className={`ml-2 px-3 py-1 rounded-full text-white ${
                currentPlayer === 'vanilla' 
                  ? 'bg-yellow-400' 
                  : 'bg-amber-700'
              }`}>
                {currentPlayer === 'vanilla' ? '🍩 Vanilla' : '🍫 Chocolate'}
              </span>
            </div>
          )}
        </div>

        {/* Game Board */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <GameBoard />
          </div>
          
          <div className="lg:w-80">
            <GameUI />
          </div>
        </div>

        {/* Victory Modal */}
        {winner && <VictoryModal />}
      </Card>
    </div>
  );
};

export default DonutsGame;
