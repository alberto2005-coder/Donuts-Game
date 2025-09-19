import React from "react";
import { useDonutsGame } from "@/lib/stores/useDonutsGame";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";


const GameUI: React.FC = () => {
  const { 
    gameState, 
    currentPlayer, 
    winner, 
    isGameOver,
    requiredDirection
  } = useDonutsGame();

  const vanillaPieces = gameState.pieceCount?.vanilla || 0;
  const chocolatePieces = gameState.pieceCount?.chocolate || 0;
  const totalVanilla = 15;
  const totalChocolate = 15;

  return (
    <div className="space-y-4">
      {/* Game Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Game Status</CardTitle>
        </CardHeader>
        <CardContent>
          {isGameOver ? (
            <div className="text-center">
              <div className="text-xl font-bold text-green-600 mb-2">
                🎉 Game Over! 🎉
              </div>
              {winner && (
                <div className={`px-4 py-2 rounded-full text-white font-semibold ${
                  winner === 'vanilla' ? 'bg-yellow-400' : 'bg-amber-700'
                }`}>
                  {winner === 'vanilla' ? '🍩 Vanilla' : '🍫 Chocolate'} Wins!
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Current Turn</div>
                <div className={`px-3 py-1 rounded-full text-white font-semibold ${
                  currentPlayer === 'vanilla' ? 'bg-yellow-400' : 'bg-amber-700'
                }`}>
                  {currentPlayer === 'vanilla' ? '🍩 Vanilla' : '🍫 Chocolate'}
                </div>
              </div>
              
              {requiredDirection && (
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Required Direction</div>
                  <Badge variant="outline" className="capitalize">
                    {requiredDirection.replace('-', ' ')}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Piece Count */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pieces on Board</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                <span>Vanilla</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">{vanillaPieces}</div>
                <div className="text-xs text-gray-500">
                  {totalVanilla - vanillaPieces} remaining
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-700 rounded-full"></div>
                <span>Chocolate</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">{chocolatePieces}</div>
                <div className="text-xs text-gray-500">
                  {totalChocolate - chocolatePieces} remaining
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      
    </div>
  );
};

export default GameUI;
