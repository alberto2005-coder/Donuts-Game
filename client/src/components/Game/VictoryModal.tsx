import React, { useEffect } from "react";
import { useDonutsGame } from "@/lib/stores/useDonutsGame";
import { useAudio } from "@/lib/stores/useAudio";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const VictoryModal: React.FC = () => {
  const { winner, resetGame, initializeGame, moveHistory, victoryLine } = useDonutsGame();
  const { playSuccess } = useAudio();

  useEffect(() => {
    if (winner) {
      playSuccess();
    }
  }, [winner, playSuccess]);

  const handleNewGame = () => {
    resetGame();
    initializeGame();
  };

  const getVictoryDetails = () => {
    if (!winner || !victoryLine) return null;

    const direction = victoryLine.direction;
    const totalMoves = moveHistory.length;
    const winnerMoves = moveHistory.filter(move => move.player === winner).length;

    return {
      direction,
      totalMoves,
      winnerMoves,
      efficiency: Math.round((winnerMoves / totalMoves) * 100)
    };
  };

  const details = getVictoryDetails();

  return (
    <Dialog open={!!winner} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            🎉 Victory! 🎉
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4">
          <div className={`text-6xl mb-4`}>
            {winner === 'vanilla' ? '🍩' : '🍫'}
          </div>
          
          <div className={`inline-block px-6 py-3 rounded-full text-white text-xl font-bold ${
            winner === 'vanilla' ? 'bg-yellow-400' : 'bg-amber-700'
          }`}>
            {winner === 'vanilla' ? 'Vanilla' : 'Chocolate'} Wins!
          </div>

          {details && (
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-center gap-4">
                <Badge variant="outline">
                  Victory: {details.direction.replace('-', ' ')} line
                </Badge>
                <Badge variant="outline">
                  {details.totalMoves} total moves
                </Badge>
              </div>
              <div className="text-xs">
                Won in {details.winnerMoves} moves ({details.efficiency}% efficiency)
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <div className="font-semibold mb-1">Victory achieved by:</div>
            <div>Aligning 5 donuts in a row</div>
          </div>
        </div>

        <DialogFooter className="flex justify-center gap-2">
          <Button onClick={handleNewGame} size="lg" className="w-full">
            Play Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VictoryModal;
