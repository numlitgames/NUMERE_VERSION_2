import { useState, useEffect } from 'react';
import { seasons, months, getTranslation, getSeasonById, getMonthById } from '@/lib/timeData';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import ComposedMonthWheel from './ComposedMonthWheel';
import SeasonWheelSVG from './SeasonWheelSVG';

// Visual offset applied ONLY to month labels in ComposedMonthWheel (for visual alignment)
const VISUAL_ANGLE_OFFSET = 50;
const POINTER_ANGLE = 90; // Red arrow position (right side)

// Normalize angle to 0-360 range
const normalize = (angle: number): number => ((angle % 360) + 360) % 360;

// SIMPLIFIED MONTH DETECTION - Based on real SVG slice positions (0°, 30°, 60°...)
// January (id=1): 0°-30°, center at 15°
// February (id=2): 30°-60°, center at 45°
// March (id=3): 60°-90°, center at 75°
// ... etc
const detectMonthSimple = (rotation: number): number => {
  const normalizedRotation = normalize(rotation);
  // What angle from the wheel content is currently under the pointer?
  const angleAtPointer = normalize(POINTER_ANGLE - normalizedRotation);
  
  // Each month spans 30°, centered at 15°, 45°, 75°, etc.
  // Adding 15° shifts boundaries to month centers for better rounding
  const monthId = Math.floor((angleAtPointer + 15) / 30) + 1;
  
  // Wrap to 1-12 range
  return ((monthId - 1) % 12) + 1;
};

interface SeasonWheelProps {
  selectedSeason: string | null;
  onSeasonSelect: (seasonId: string) => void;
  onMonthSelect?: (monthId: number) => void;
  mode: 'season' | 'month';
  lang: string;
  isSpinning?: boolean;
  onSpinComplete?: () => void;
}

export default function SeasonWheel({ 
  selectedSeason, 
  onSeasonSelect,
  onMonthSelect,
  mode,
  lang,
  isSpinning = false,
  onSpinComplete
}: SeasonWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [currentMonth, setCurrentMonth] = useState<number | null>(null);

  const handleSpin = () => {
    console.log('🎮 Spin button clicked, spinning:', spinning);
    
    if (spinning) {
      console.warn('⚠️ Already spinning, ignoring click');
      return;
    }
    
    console.log('✅ Spin started');
    
    setSpinning(true);
    
    let targetAngle = 0;
    let resultMessage = '';
    
    if (mode === 'season') {
      const randomSeason = seasons[Math.floor(Math.random() * seasons.length)];
      // Centers of each season sector relative to the SVG coordinate system
      // 0°=top, 90°=right (pointer), 180°=bottom, 270°=left
      const seasonCenters: Record<string, number> = { winter: 0, spring: 90, summer: 180, autumn: 270 };
      const center = seasonCenters[randomSeason.id] ?? 90;

      // Compute final normalized angle so that the chosen season center sits under the pointer
      const targetFinalAngle = normalize(POINTER_ANGLE - center);
      const current = normalize(rotation);
      let angleDifference = targetFinalAngle - current;
      if (angleDifference < 0) angleDifference += 360;

      resultMessage = `${randomSeason.t[lang] || randomSeason.t.ro}!`;

      // Add 3–5 full rotations plus the relative difference
      const spins = 3 + Math.random() * 2;
      const targetRotation = rotation + 360 * spins + angleDifference;

      animateWheel(targetRotation, () => {
        try {
          onSeasonSelect(randomSeason.id);
          toast.success(resultMessage);
        } finally {
          // spinning state is reset in animateWheel
        }
      });
    } else {
      // Random month selection
      const randomMonth = months[Math.floor(Math.random() * months.length)];
      
      // SIMPLIFIED: Calculate month center based on real SVG slice positions
      // Month 1 (Ianuarie): 0°-30°, center at 15°
      // Month 2 (Februarie): 30°-60°, center at 45°
      // Month 3 (Martie): 60°-90°, center at 75°... etc.
      const targetMonthCenter = (randomMonth.id - 1) * 30 + 15;
      
      // Calculate target rotation so that targetMonthCenter aligns with pointer (90°)
      const targetFinalAngle = normalize(POINTER_ANGLE - targetMonthCenter);
      
      // Calculate angle difference from current position
      const currentNormalizedAngle = normalize(rotation);
      let angleDifference = targetFinalAngle - currentNormalizedAngle;
      
      // Adjust to always rotate in the positive direction (clockwise)
      if (angleDifference < 0) {
        angleDifference += 360;
      }
      
      resultMessage = `${randomMonth.t[lang] || randomMonth.t.ro}!`;
      
      // Add 3-5 full rotations plus the relative difference
      const spins = 3 + Math.random() * 2;
      const targetRotation = rotation + (360 * spins) + angleDifference;
      
      animateWheel(targetRotation, () => {
        // Detect actual month from final rotation using simplified method
        const actualMonthId = detectMonthSimple(targetRotation);
        const actualMonth = getMonthById(actualMonthId);
        
        console.debug('🎯 Month Detection:', {
          targetMonth: `${randomMonth.t.ro} (ID: ${randomMonth.id})`,
          targetCenter: targetMonthCenter.toFixed(1) + '°',
          finalRotation: normalize(targetRotation).toFixed(1) + '°',
          angleAtPointer: normalize(POINTER_ANGLE - normalize(targetRotation)).toFixed(1) + '°',
          detectedMonth: `${actualMonth?.t.ro} (ID: ${actualMonthId})`,
          match: actualMonthId === randomMonth.id ? '✅' : '❌'
        });
        
        if (onMonthSelect) {
          onMonthSelect(actualMonthId);
        }
        toast.success(`${actualMonth?.t[lang] || actualMonth?.t.ro}!`);
      });
    }
  };
  
  const animateWheel = (targetRotation: number, onComplete: () => void) => {
    const duration = 3000;
    const startTime = Date.now();
    const startRotation = rotation;
    
    // Safety timeout - force unlock after 5 seconds
    const safetyTimeout = setTimeout(() => {
      setSpinning(false);
      console.warn('⚠️ Animation timeout - force unlocking button');
    }, 5000);
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + (targetRotation - startRotation) * easeOut;
      
      setRotation(currentRotation);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        clearTimeout(safetyTimeout);
        setSpinning(false);
        setRotation(targetRotation % 360);
        
        try {
          onComplete();
          onSpinComplete?.();
        } catch (error) {
          console.error('❌ Error in spin complete callback:', error);
        }
      }
    };
    
    animate();
  };

  // Detectare în timp real a lunii indicate de săgeată
  useEffect(() => {
    if (mode === 'month') {
      const detectedMonth = detectMonthSimple(rotation);
      setCurrentMonth(detectedMonth);
      // Trimit luna detectată la parent pentru sincronizare
      if (onMonthSelect) {
        onMonthSelect(detectedMonth);
      }
    }
  }, [rotation, mode, onMonthSelect]);

  // Cleanup: unlock button if component unmounts during spin
  useEffect(() => {
    return () => {
      setSpinning(false);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Wheel container */}
      <div className="relative">
        {/* Rotating wheel */}
        <div className="relative w-[500px] h-[500px]">
          {mode === 'month' ? (
            <ComposedMonthWheel 
              rotation={rotation}
              size={500}
              className="drop-shadow-2xl"
              showLabels={showLabels}
              language={lang as 'ro' | 'en'}
              angleOffset={VISUAL_ANGLE_OFFSET}
            />
          ) : (
            <SeasonWheelSVG
              rotation={rotation}
              size={500}
              language={lang as 'ro' | 'en'}
              className="drop-shadow-2xl"
            />
          )}
        </div>
      </div>

      {/* Spin button */}
        <Button 
          onClick={handleSpin}
          disabled={spinning}
          size="lg"
          className="gap-2 text-lg px-8 py-6 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 disabled:opacity-50"
        >
          <RefreshCw className={cn("h-6 w-6", spinning && "animate-spin")} />
          {getTranslation('ui', 'spin_wheel', lang)}
        </Button>

      {/* Banner afișare lună indicată în timp real */}
      {mode === 'month' && currentMonth && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-xl px-8 py-4 transition-all duration-300 animate-fade-in">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider opacity-90">
              {getTranslation('ui', 'selected_month', lang)}
            </p>
            <p className="text-3xl font-bold mt-1">
              {months.find(m => m.id === currentMonth)?.t[lang] || 
               months.find(m => m.id === currentMonth)?.t.ro || ''}
            </p>
          </div>
        </div>
      )}

      {/* Labels toggle (only in month mode) */}
      {mode === 'month' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowLabels(!showLabels)}
        >
          {showLabels ? 'Ascunde etichete' : 'Arată etichete'}
        </Button>
      )}
    </div>
  );
}
