import type { Move } from '../Types/chess';
import { Card, LinearProgress } from '@mui/material';
import { Target, Zap } from 'lucide-react';

interface AccuracyStatsProps {
  moves: Move[];
}

const AccuracyStats: React.FC<AccuracyStatsProps> = ({ moves }) => {
  const movesWithAccuracy = moves.filter(m => m.accuracy !== undefined);
  
  if (movesWithAccuracy.length === 0) {
    return null;
  }
  
  // Calculate statistics
  const avgAccuracy = Math.round(
    movesWithAccuracy.reduce((sum, m) => sum + (m.accuracy || 0), 0) / movesWithAccuracy.length
  );
  
  const excellentMoves = movesWithAccuracy.filter(m => m.accuracyClass === 'excellent').length;
  const goodMoves = movesWithAccuracy.filter(m => m.accuracyClass === 'good').length;
  const inaccuracies = movesWithAccuracy.filter(m => m.accuracyClass === 'inaccuracy').length;
  const mistakes = movesWithAccuracy.filter(m => m.accuracyClass === 'mistake').length;
  const blunders = movesWithAccuracy.filter(m => m.accuracyClass === 'blunder').length;
  
  const bestMove = movesWithAccuracy.reduce((best, move) => 
    (move.accuracy || 0) > (best.accuracy || 0) ? move : best
  , movesWithAccuracy[0]);
  
  return (
    <Card className="p-4 bg-card border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-primary" />
        <h3>Accuracy Stats</h3>
      </div>
      
      <div className="space-y-4">
        {/* Overall Accuracy */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Overall Accuracy</span>
            <span className="text-sm">{avgAccuracy}%</span>
          </div>
          <LinearProgress value={avgAccuracy} className="h-2" />
        </div>
        
        {/* Move Breakdown */}
        <div className="space-y-2">
          <div className="text-sm">Move Quality</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {excellentMoves > 0 && (
              <div className="flex justify-between">
                <span className="text-green-600">Excellent</span>
                <span>{excellentMoves}</span>
              </div>
            )}
            {goodMoves > 0 && (
              <div className="flex justify-between">
                <span className="text-blue-600">Good</span>
                <span>{goodMoves}</span>
              </div>
            )}
            {inaccuracies > 0 && (
              <div className="flex justify-between">
                <span className="text-yellow-600">Inaccuracies</span>
                <span>{inaccuracies}</span>
              </div>
            )}
            {mistakes > 0 && (
              <div className="flex justify-between">
                <span className="text-orange-600">Mistakes</span>
                <span>{mistakes}</span>
              </div>
            )}
            {blunders > 0 && (
              <div className="flex justify-between">
                <span className="text-red-600">Blunders</span>
                <span>{blunders}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Best Move */}
        {bestMove && (
          <div className="pt-2 border-t border-border">
            <div className="flex items-center gap-1 text-sm mb-1">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span>Best Move</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {bestMove.notation} ({bestMove.accuracy}%)
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AccuracyStats;
