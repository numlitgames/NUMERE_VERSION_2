import { Button } from '@/components/ui/button';
import { Thermometer, Cloud, Shirt } from 'lucide-react';
import SeasonWheel from './SeasonWheel';
import { getTranslation } from '@/lib/timeData';

interface SeasonActivitiesProps {
  selectedSeason: string | null;
  onSeasonSelect: (seasonId: string) => void;
  onSpinComplete: () => void;
  isSpinning: boolean;
  lang: string;
}

const quizButtons = [
  { id: 'temperature' as const, icon: Thermometer, labelKey: 'temperature_label' },
  { id: 'weather' as const, icon: Cloud, labelKey: 'weather_label' },
  { id: 'clothing' as const, icon: Shirt, labelKey: 'clothing_label' }
];

export default function SeasonActivities({
  selectedSeason,
  onSeasonSelect,
  onSpinComplete,
  isSpinning,
  lang
}: SeasonActivitiesProps) {
  return (
    <div className="space-y-3">
      {/* Season Wheel */}
      <SeasonWheel
        selectedSeason={selectedSeason}
        onSeasonSelect={onSeasonSelect}
        onSpinComplete={onSpinComplete}
        mode="season"
        lang={lang}
        isSpinning={isSpinning}
      />

      {/* Visual Indicator Buttons */}
      {selectedSeason && (
        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
          {quizButtons.map(({ id, icon: Icon, labelKey }) => (
            <Button
              key={id}
              variant="outline"
              size="sm"
              disabled={!selectedSeason}
              className="h-10 text-xs font-semibold cursor-default"
              title={getTranslation('ui', labelKey, lang)}
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
