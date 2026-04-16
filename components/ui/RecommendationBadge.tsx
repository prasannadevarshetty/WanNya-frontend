import { Info } from "lucide-react";

interface RecommendationBadgeProps {
  reasons: string[];
  score: number;
}

export function RecommendationBadge({ reasons, score }: RecommendationBadgeProps) {
  if (score >= 0.7) {
    return (
      <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
        <Info size={12} />
        <span>Perfect match</span>
      </div>
    );
  }
  
  if (reasons.length > 0 && reasons[0] !== 'No pet preferences set') {
    return (
      <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
        <Info size={12} />
        <span>{reasons[0]}</span>
      </div>
    );
  }
  
  return null;
}
