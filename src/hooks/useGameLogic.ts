import { useState, useEffect, useCallback, useRef } from 'react';
import { Block, GameMode, GameState } from '../types';
import confetti from 'canvas-confetti';

const GRID_WIDTH = 7;
const GRID_HEIGHT = 8;
const INITIAL_ROWS = 4;
const TIME_LIMIT = 15; // seconds per round in time mode

export const useGameLogic = () => {
  const [state, setState] = useState<GameState>({
    blocks: [],
    targetSum: 0,
    currentSum: 0,
    score: 0,
    highScore: parseInt(localStorage.getItem('sumburst-highscore') || '0'),
    gameOver: false,
    mode: 'classic',
    timeLeft: TIME_LIMIT,
    level: 1,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateTarget = useCallback(() => {
    return Math.floor(Math.random() * 15) + 10; // 10 to 25
  }, []);

  const createRow = useCallback((y: number): Block[] => {
    return Array.from({ length: GRID_WIDTH }).map((_, x) => ({
      id: Math.random().toString(36).substr(2, 9),
      value: Math.floor(Math.random() * 9) + 1,
      x,
      y,
      isSelected: false,
    }));
  }, []);

  const initGame = useCallback((mode: GameMode) => {
    const initialBlocks: Block[] = [];
    for (let y = 0; y < INITIAL_ROWS; y++) {
      initialBlocks.push(...createRow(y));
    }

    setState(prev => ({
      ...prev,
      blocks: initialBlocks,
      targetSum: Math.floor(Math.random() * 15) + 10,
      currentSum: 0,
      score: 0,
      gameOver: false,
      mode,
      timeLeft: TIME_LIMIT,
      level: 1,
    }));
  }, [createRow]);

  const addNewRow = useCallback(() => {
    setState(prev => {
      const isFull = prev.blocks.some(b => b.y >= GRID_HEIGHT - 1);
      if (isFull) {
        return { ...prev, gameOver: true };
      }

      const shiftedBlocks = prev.blocks.map(b => ({ ...b, y: b.y + 1 }));
      const newRow = createRow(0);
      
      return {
        ...prev,
        blocks: [...shiftedBlocks, ...newRow],
        timeLeft: TIME_LIMIT,
      };
    });
  }, [createRow]);

  const toggleBlock = useCallback((id: string) => {
    setState(prev => {
      if (prev.gameOver) return prev;

      const newBlocks = prev.blocks.map(b => 
        b.id === id ? { ...b, isSelected: !b.isSelected } : b
      );
      
      const selectedBlocks = newBlocks.filter(b => b.isSelected);
      const newSum = selectedBlocks.reduce((acc, b) => acc + b.value, 0);

      if (newSum === prev.targetSum) {
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#6ee7b7']
        });

        const remainingBlocks = newBlocks.filter(b => !b.isSelected);
        const nextTarget = generateTarget();
        const newScore = prev.score + (selectedBlocks.length * 10) * prev.level;
        
        if (newScore > prev.highScore) {
          localStorage.setItem('sumburst-highscore', newScore.toString());
        }

        const nextState = {
          ...prev,
          blocks: remainingBlocks,
          currentSum: 0,
          targetSum: nextTarget,
          score: newScore,
          highScore: Math.max(newScore, prev.highScore),
          timeLeft: prev.mode === 'time' ? TIME_LIMIT : prev.timeLeft,
        };

        if (prev.mode === 'classic') {
          // Add row logic
          const isFull = remainingBlocks.some(b => b.y >= GRID_HEIGHT - 1);
          if (isFull) return { ...nextState, gameOver: true };

          const shifted = remainingBlocks.map(b => ({ ...b, y: b.y + 1 }));
          const newRow = createRow(0);

          return {
            ...nextState,
            blocks: [...shifted, ...newRow],
          };
        }

        return nextState;
      } else if (newSum > prev.targetSum) {
        return {
          ...prev,
          blocks: prev.blocks.map(b => ({ ...b, isSelected: false })),
          currentSum: 0,
        };
      }

      return {
        ...prev,
        blocks: newBlocks,
        currentSum: newSum,
      };
    });
  }, [generateTarget, createRow]);

  useEffect(() => {
    if (state.mode === 'time' && !state.gameOver) {
      timerRef.current = setInterval(() => {
        setState(prev => {
          if (prev.timeLeft <= 1) {
            const isFull = prev.blocks.some(b => b.y >= GRID_HEIGHT - 1);
            if (isFull) return { ...prev, gameOver: true, timeLeft: 0 };

            const shifted = prev.blocks.map(b => ({ ...b, y: b.y + 1 }));
            const newRow = createRow(0);

            return {
              ...prev,
              blocks: [...shifted, ...newRow],
              timeLeft: TIME_LIMIT,
            };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.mode, state.gameOver, createRow]);

  return {
    state,
    initGame,
    toggleBlock,
    addNewRow,
  };
};
