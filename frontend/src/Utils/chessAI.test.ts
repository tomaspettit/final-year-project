import { getBestAIMove } from './chessAI';
import { Chess } from 'chess.js';

describe('AI Move Generation', () => {
  it('should return a legal move for the starting position', () => {
    const chess = new Chess();
    const move = getBestAIMove(chess.fen(), 2);
    expect(move).not.toBeNull();
    if (move) {
      expect(chess.moves({ verbose: true }).some(m => m.san === move.san)).toBe(true);
    }
  });

  it('should return null if the game is over', () => {
    const chess = new Chess('8/8/8/8/8/8/8/K6k w - - 0 1'); // Stalemate
    const move = getBestAIMove(chess.fen(), 2);
    expect(move).toBeNull();
  });

  it('should not throw for checkmate positions', () => {
    const chess = new Chess('7k/5Q2/7K/8/8/8/8/8 b - - 0 1'); // Black is checkmated
    expect(() => getBestAIMove(chess.fen(), 2)).not.toThrow();
  });
});
