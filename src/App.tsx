/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  RotateCcw, 
  Play, 
  Clock, 
  Zap, 
  Info,
  ChevronRight,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useGameLogic } from './hooks/useGameLogic';
import { GameMode } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const { state, initGame, toggleBlock } = useGameLogic();
  const [showMenu, setShowMenu] = useState(true);
  const [showHowTo, setShowHowTo] = useState(false);

  const handleStart = (mode: GameMode) => {
    initGame(mode);
    setShowMenu(false);
  };

  const handleRestart = () => {
    initGame(state.mode);
  };

  // Grid dimensions for rendering
  const GRID_WIDTH = 7;
  const GRID_HEIGHT = 8;
  const CELL_SIZE_X = 48;
  const CELL_SIZE_Y = 68;

  return (
    <div className="min-h-screen bg-[#fdfaf1] text-[#5d4037] font-ghibli selection:bg-emerald-100 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Ghibli Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#e0f2f1] via-[#fdfaf1] to-[#f1f8e9]" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#81c784] rounded-full blur-[120px] opacity-30" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#4fc3f7] rounded-full blur-[120px] opacity-20" />
      </div>

      <AnimatePresence mode="wait">
        {showMenu ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 max-w-md w-full ghibli-card p-8"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#f1f8e9] text-[#2e7d32] rounded-full mb-4 shadow-inner border-2 border-[#81c784]/30">
                <Zap size={40} fill="currentColor" />
              </div>
              <h1 className="text-5xl font-black tracking-tight text-[#3e2723] mb-2 font-serif-ghibli">
                数字爆发
              </h1>
              <p className="text-[#8d6e63] font-bold text-xl">精通数学，消除方块。</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleStart('classic')}
                className="group w-full flex items-center justify-between p-6 bg-[#5d4037] text-[#fffef9] rounded-3xl hover:bg-[#4e342e] transition-all active:translate-y-1 shadow-[0_6px_0_0_rgba(0,0,0,0.2)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Zap size={24} />
                  </div>
                  <div className="text-left">
                    <div className="font-black text-2xl">经典模式</div>
                    <div className="text-sm text-[#d7ccc8]">每次成功消除后新增一行</div>
                  </div>
                </div>
                <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={() => handleStart('time')}
                className="group w-full flex items-center justify-between p-6 bg-[#fffef9] border-4 border-[#8b7355]/20 text-[#5d4037] rounded-3xl hover:border-[#81c784] hover:text-[#2e7d32] transition-all active:translate-y-1 shadow-[0_6px_0_0_rgba(139,115,85,0.1)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#f1f8e9] rounded-2xl flex items-center justify-center group-hover:bg-[#e8f5e9]">
                    <Clock size={24} />
                  </div>
                  <div className="text-left">
                    <div className="font-black text-2xl">计时挑战</div>
                    <div className="text-sm text-[#8d6e63]">与不断上升的方块赛跑</div>
                  </div>
                </div>
                <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-[#8b7355]/10 flex items-center justify-between text-[#8d6e63] text-lg font-bold">
              <div className="flex items-center gap-2">
                <Trophy size={20} />
                <span>最高分: {state.highScore}</span>
              </div>
              <button 
                onClick={() => setShowHowTo(true)}
                className="hover:text-[#5d4037] flex items-center gap-1"
              >
                <Info size={20} />
                <span>玩法说明</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 flex flex-col items-center w-full max-w-2xl"
          >
            {/* Game Header */}
            <div className="w-full flex items-center justify-between mb-6 px-4">
              <div className="flex flex-col">
                <span className="text-sm font-black text-[#8d6e63] uppercase tracking-widest">得分</span>
                <span className="text-3xl font-black text-[#3e2723]">{state.score}</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-sm font-black text-[#8d6e63] uppercase tracking-widest mb-1">目标</span>
                <div className="relative">
                  <div className="text-6xl font-black text-[#2e7d32] tabular-nums font-serif-ghibli drop-shadow-sm">
                    {state.targetSum}
                  </div>
                  {state.currentSum > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "absolute -bottom-6 left-1/2 -translate-x-1/2 text-lg font-black px-3 py-0.5 rounded-full border-2",
                        state.currentSum > state.targetSum 
                          ? "bg-[#ffebee] text-[#c62828] border-[#ef9a9a]" 
                          : "bg-[#e8f5e9] text-[#2e7d32] border-[#a5d6a7]"
                      )}
                    >
                      {state.currentSum}
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {state.mode === 'time' && (
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-black text-[#8d6e63] uppercase tracking-widest">时间</span>
                    <span className={cn(
                      "text-2xl font-black tabular-nums",
                      state.timeLeft < 5 ? "text-[#c62828] animate-pulse" : "text-[#3e2723]"
                    )}>
                      {state.timeLeft}秒
                    </span>
                  </div>
                )}
                <button
                  onClick={() => setShowMenu(true)}
                  className="p-3 hover:bg-[#8b7355]/10 rounded-2xl transition-colors text-[#8d6e63]"
                >
                  <RotateCcw size={24} />
                </button>
              </div>
            </div>

            {/* Game Board Container */}
            <div className="relative ghibli-card p-4">
              <div 
                className="relative overflow-hidden rounded-2xl bg-[#fffef9] border-2 border-[#8b7355]/10 shadow-inner"
                style={{
                  width: Math.min(window.innerWidth - 48, GRID_WIDTH * CELL_SIZE_X),
                  height: GRID_HEIGHT * CELL_SIZE_Y,
                }}
              >
                {/* Grid Lines (Subtle) */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
                  {Array.from({ length: GRID_WIDTH }).map((_, i) => (
                    <div key={`v-${i}`} className="absolute top-0 bottom-0 border-r-2 border-[#8b7355]" style={{ left: (i + 1) * CELL_SIZE_X }} />
                  ))}
                  {Array.from({ length: GRID_HEIGHT }).map((_, i) => (
                    <div key={`h-${i}`} className="absolute left-0 right-0 border-b-2 border-[#8b7355]" style={{ top: (i + 1) * CELL_SIZE_Y }} />
                  ))}
                </div>

                {/* Blocks */}
                <AnimatePresence>
                  {state.blocks.map((block) => (
                    <motion.button
                      key={block.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1,
                        x: block.x * CELL_SIZE_X,
                        y: (GRID_HEIGHT - 1 - block.y) * CELL_SIZE_Y,
                      }}
                      exit={{ scale: 0, opacity: 0, transition: { duration: 0.1 } }}
                      transition={{ 
                        x: { type: 'spring', stiffness: 300, damping: 30 },
                        y: { type: 'spring', stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                        scale: { duration: 0.2 }
                      }}
                      onClick={() => toggleBlock(block.id)}
                      className={cn(
                        "absolute w-[44px] h-[64px] m-[2px] rounded-full flex items-center justify-center text-2xl font-black transition-colors duration-200 border-2 shadow-sm",
                        block.isSelected 
                          ? "bg-[#1a1a1a] text-[#fffef9] border-[#1a1a1a] z-10" 
                          : cn(
                              "bg-[#fffef9]",
                              block.value === 1 && "text-[#e57373] border-[#ffcdd2]",
                              block.value === 2 && "text-[#fb8c00] border-[#ffe0b2]",
                              block.value === 3 && "text-[#fbc02d] border-[#fff9c4]",
                              block.value === 4 && "text-[#4caf50] border-[#c8e6c9]",
                              block.value === 5 && "text-[#00acc1] border-[#b2ebf2]",
                              block.value === 6 && "text-[#1e88e5] border-[#bbdefb]",
                              block.value === 7 && "text-[#5e35b1] border-[#d1c4e9]",
                              block.value === 8 && "text-[#8e24aa] border-[#e1bee7]",
                              block.value === 9 && "text-[#d81b60] border-[#f8bbd0]"
                            )
                      )}
                    >
                      {block.value}
                    </motion.button>
                  ))}
                </AnimatePresence>

                {/* Warning Line */}
                <div className="absolute left-0 right-0 h-1 bg-[#c62828]/10 border-t-2 border-dashed border-[#c62828]/30 pointer-events-none" style={{ top: CELL_SIZE_Y }} />
              </div>

              {/* Game Over Overlay */}
              <AnimatePresence>
                {state.gameOver && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-50 bg-[#fffef9]/95 backdrop-blur-sm rounded-[2rem] flex flex-col items-center justify-center p-8 text-center"
                  >
                    <div className="w-24 h-24 bg-[#ffebee] text-[#c62828] rounded-full flex items-center justify-center mb-6 border-4 border-[#ef9a9a]/30">
                      <XCircle size={64} />
                    </div>
                    <h2 className="text-4xl font-black text-[#3e2723] mb-2 font-serif-ghibli">游戏结束</h2>
                    <p className="text-[#8d6e63] mb-8 text-xl font-bold">方块触顶了！你的得分：<span className="text-[#3e2723]">{state.score}</span></p>
                    
                    <div className="flex gap-4 w-full">
                      <button
                        onClick={handleRestart}
                        className="flex-1 ghibli-btn flex items-center justify-center gap-2 text-xl"
                      >
                        <RotateCcw size={24} />
                        再试一次
                      </button>
                      <button
                        onClick={() => setShowMenu(true)}
                        className="flex-1 py-4 bg-[#fffef9] border-4 border-[#8b7355]/20 text-[#5d4037] rounded-2xl font-black text-xl hover:border-[#8b7355]/40 transition-all active:translate-y-1"
                      >
                        主菜单
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Controls / Info */}
            <div className="mt-8 flex flex-wrap justify-center items-center gap-4 text-[#8d6e63] text-lg font-bold">
              <div className="flex items-center gap-2 px-6 py-2 bg-[#fffef9] rounded-full shadow-sm border-2 border-[#8b7355]/10">
                <div className="w-3 h-3 rounded-full bg-[#2e7d32]" />
                <span>选择数字以达到目标和</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-2 bg-[#fffef9] rounded-full shadow-sm border-2 border-[#8b7355]/10">
                <AlertCircle size={20} />
                <span>不要让方块碰到顶部</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How To Play Modal */}
      <AnimatePresence>
        {showHowTo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#3e2723]/40 backdrop-blur-md"
            onClick={() => setShowHowTo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#fffef9] rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-4 border-[#8b7355]/20"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-4xl font-black text-[#3e2723] mb-8 font-serif-ghibli">玩法说明</h2>
              
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-[#e8f5e9] text-[#2e7d32] rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-2xl border-2 border-[#a5d6a7]">1</div>
                  <p className="text-[#5d4037] leading-relaxed text-xl font-bold">
                    点击方块累加数值。匹配屏幕上方显示的<span className="text-[#2e7d32]">目标和</span>。
                  </p>
                </div>
                
                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-[#e8f5e9] text-[#2e7d32] rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-2xl border-2 border-[#a5d6a7]">2</div>
                  <p className="text-[#5d4037] leading-relaxed text-xl font-bold">
                    在<span className="text-[#3e2723]">经典模式</span>中，每次成功匹配后都会新增一行。
                  </p>
                </div>

                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-[#e8f5e9] text-[#2e7d32] rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-2xl border-2 border-[#a5d6a7]">3</div>
                  <p className="text-[#5d4037] leading-relaxed text-xl font-bold">
                    在<span className="text-[#3e2723]">计时挑战</span>中，倒计时结束时会自动新增一行。
                  </p>
                </div>

                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-[#ffebee] text-[#c62828] rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-2xl border-2 border-[#ef9a9a]">!</div>
                  <p className="text-[#5d4037] leading-relaxed font-black text-xl">
                    不要让方块堆积到最顶端，否则游戏结束！
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowHowTo(false)}
                className="w-full mt-10 ghibli-btn text-2xl py-5"
              >
                明白了！
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
