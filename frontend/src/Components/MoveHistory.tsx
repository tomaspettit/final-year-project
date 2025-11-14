import type { Move } from '../Types/chess';
import { Badge } from '@mui/material';

interface MoveHistoryProps {
  moves: Move[];
}

const getAccuracyColor = (accuracyClass?: string) => {
  switch (accuracyClass) {
    case 'excellent':
      return 'bg-green-500/10 text-green-600 border-green-500/20';
    case 'good':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    case 'inaccuracy':
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    case 'mistake':
      return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
    case 'blunder':
      return 'bg-red-500/10 text-red-600 border-red-500/20';
    default:
      return '';
  }
};

const getAccuracyLabel = (accuracyClass?: string) => {
  switch (accuracyClass) {
    case 'excellent':
      return 'Excellent';
    case 'good':
      return 'Good';
    case 'inaccuracy':
      return 'Inaccuracy';
    case 'mistake':
      return 'Mistake';
    case 'blunder':
      return 'Blunder';
    default:
      return '';
  }
};

const MoveHistory: React.FC<MoveHistoryProps> = ({ moves }) => {
  const movePairs: Array<{ white: Move; black?: Move }> = [];
  
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      white: moves[i],
      black: moves[i + 1]
    });
  }
  
  // Calculate average accuracy
  const movesWithAccuracy = moves.filter(m => m.accuracy !== undefined);
  const avgAccuracy = movesWithAccuracy.length > 0
    ? Math.round(movesWithAccuracy.reduce((sum, m) => sum + (m.accuracy || 0), 0) / movesWithAccuracy.length)
    : null;
  
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3>Move History</h3>
        {avgAccuracy !== null && (
          <div className="text-sm text-muted-foreground">
            Avg: {avgAccuracy}%
          </div>
        )}
      </div>
        {movePairs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No moves yet</p>
        ) : (
          <div className="space-y-1">
            {movePairs.map((pair, index) => (
              <div key={index} className="flex gap-2 text-sm items-center">
                <span className="text-muted-foreground w-8">{index + 1}.</span>
                <div className="flex-1 flex items-center gap-1">
                  <span>{pair.white.notation}</span>
                  {pair.white.accuracyClass && (
                    <Badge 
                      className={`text-xs px-1 py-0 h-4 ${getAccuracyColor(pair.white.accuracyClass)}`}
                    >
                      {getAccuracyLabel(pair.white.accuracyClass)}
                    </Badge>
                  )}
                </div>
                {pair.black && (
                  <div className="flex-1 flex items-center gap-1">
                    <span>{pair.black.notation}</span>
                    {pair.black.accuracyClass && (
                      <Badge 
                        className={`text-xs px-1 py-0 h-4 ${getAccuracyColor(pair.black.accuracyClass)}`}
                      >
                        {getAccuracyLabel(pair.black.accuracyClass)}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

export default MoveHistory;