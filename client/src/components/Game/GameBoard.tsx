import React, { useRef, useEffect, useCallback } from "react";
import { useDonutsGame } from "@/lib/stores/useDonutsGame";
import { useAudio } from "@/lib/stores/useAudio";
import { DonutsLogic } from "@/lib/gameLogic/DonutsLogic";

const GameBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { 
    gameState, 
    currentPlayer, 
    placePiece, 
    isGameOver,
    lastPlacedPosition,
    requiredDirection 
  } = useDonutsGame();
  
  const { playHit } = useAudio();

  const CELL_SIZE = 60;
  const BOARD_SIZE = 6;
  const CANVAS_SIZE = CELL_SIZE * BOARD_SIZE;

  // Draw the game board
  const drawBoard = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!gameState.board) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Draw grid background
    ctx.fillStyle = '#f3e8ff';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid lines and tiles
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const x = col * CELL_SIZE;
        const y = row * CELL_SIZE;
        
        // Draw cell border
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
        
        // Highlight tile boundaries (every 3 cells)
        if (col % 3 === 0 || row % 3 === 0) {
          ctx.strokeStyle = '#6d28d9';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
        }
        
        // Draw direction line
        const direction = gameState.board[row][col].direction;
        ctx.strokeStyle = '#7c3aed';
        ctx.lineWidth = 2;
        
        const centerX = x + CELL_SIZE / 2;
        const centerY = y + CELL_SIZE / 2;
        const lineLength = CELL_SIZE * 0.3;
        
        ctx.beginPath();
        switch (direction) {
          case 'horizontal':
            ctx.moveTo(centerX - lineLength, centerY);
            ctx.lineTo(centerX + lineLength, centerY);
            break;
          case 'vertical':
            ctx.moveTo(centerX, centerY - lineLength);
            ctx.lineTo(centerX, centerY + lineLength);
            break;
          case 'diagonal-down':
            ctx.moveTo(centerX - lineLength, centerY - lineLength);
            ctx.lineTo(centerX + lineLength, centerY + lineLength);
            break;
          case 'diagonal-up':
            ctx.moveTo(centerX - lineLength, centerY + lineLength);
            ctx.lineTo(centerX + lineLength, centerY - lineLength);
            break;
        }
        ctx.stroke();
        
        // Draw piece if present
        const piece = gameState.board[row][col].piece;
        if (piece) {
          const pieceX = centerX;
          const pieceY = centerY;
          const radius = CELL_SIZE * 0.35;
          
          // Draw donut
          ctx.fillStyle = piece === 'vanilla' ? '#fbbf24' : '#92400e';
          ctx.beginPath();
          ctx.arc(pieceX, pieceY, radius, 0, 2 * Math.PI);
          ctx.fill();
          
          // Draw donut hole
          ctx.fillStyle = '#f3e8ff';
          ctx.beginPath();
          ctx.arc(pieceX, pieceY, radius * 0.4, 0, 2 * Math.PI);
          ctx.fill();
          
          // Add border
          ctx.strokeStyle = piece === 'vanilla' ? '#d97706' : '#451a03';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(pieceX, pieceY, radius, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    }

    // Highlight valid moves if a direction is required
    if (requiredDirection && lastPlacedPosition && !isGameOver) {
      const validMoves = DonutsLogic.getValidMoves(
        gameState.board,
        lastPlacedPosition,
        requiredDirection
      );
      
      validMoves.forEach(({ row, col }) => {
        const x = col * CELL_SIZE;
        const y = row * CELL_SIZE;
        
        ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        
        ctx.strokeStyle = '#16a34a';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
      });
    }

    // Highlight last placed piece
    if (lastPlacedPosition) {
      const x = lastPlacedPosition.col * CELL_SIZE;
      const y = lastPlacedPosition.row * CELL_SIZE;
      
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
    }
  }, [gameState.board, requiredDirection, lastPlacedPosition, isGameOver]);

  // Handle canvas click
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isGameOver || !gameState.board) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);
    
    if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
      const success = placePiece(row, col);
      if (success) {
        playHit();
      }
    }
  }, [isGameOver, gameState.board, placePiece, playHit]);

  // Redraw canvas when game state changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawBoard(ctx);
  }, [drawBoard]);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="border-2 border-amber-300 rounded-lg shadow-lg cursor-pointer bg-white"
        onClick={handleCanvasClick}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      
      {requiredDirection && !isGameOver && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Must place in <span className="font-semibold text-amber-700">{requiredDirection}</span> direction
          </p>
          <p className="text-xs text-gray-500">
            (Green highlighted squares show valid moves)
          </p>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
