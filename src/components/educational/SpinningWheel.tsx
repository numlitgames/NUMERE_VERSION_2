import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface WheelSector {
  id: string;
  text: string;
  color: string;
}

interface SpinningWheelProps {
  sectors: WheelSector[];
  onResult: (sector: WheelSector) => void;
  className?: string;
}

export default function SpinningWheel({ sectors, onResult, className }: SpinningWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);

  const size = 600;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = Math.min(centerX, centerY) - 20;

  // Create sector path for filled area
  const createSectorPath = (startAngle: number, endAngle: number, r: number): string => {
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    const x1 = centerX + r * Math.cos(startRad);
    const y1 = centerY + r * Math.sin(startRad);
    const x2 = centerX + r * Math.cos(endRad);
    const y2 = centerY + r * Math.sin(endRad);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  // Create arc path for curved text
  const createArcPath = (startAngle: number, endAngle: number, r: number): string => {
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    const x1 = centerX + r * Math.cos(startRad);
    const y1 = centerY + r * Math.sin(startRad);
    const x2 = centerX + r * Math.cos(endRad);
    const y2 = centerY + r * Math.sin(endRad);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  const spinWheel = () => {
    if (isSpinning || sectors.length === 0) return;

    setIsSpinning(true);
    const minSpins = 3;
    const maxSpins = 6;
    const spins = minSpins + Math.random() * (maxSpins - minSpins);
    const totalRotation = spins * 360 + Math.random() * 360;
    
    let start: number | null = null;
    const duration = 3000; // 3 seconds

    const animate = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for realistic spin
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const rotation = currentRotation + totalRotation * easeOut;
      
      setCurrentRotation(rotation);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        
        // Calculate which sector was selected
        // Pointer-ul este la 90° (dreapta), deci adăugăm offset-ul
        const pointerAngle = 90;
        const sectorAngle = 360 / sectors.length;
        const normalizedRotation = (360 - (rotation % 360) + pointerAngle) % 360;
        const selectedIndex = Math.floor(normalizedRotation / sectorAngle);
        const selectedSector = sectors[selectedIndex];
        
        if (selectedSector) {
          onResult(selectedSector);
        }
      }
    };

    requestAnimationFrame(animate);
  };

  if (sectors.length === 0) {
    return <div className={className}>No sectors defined</div>;
  }

  const sectorAngle = 360 / sectors.length;
  const textRadius = radius * 0.7;

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="border-2 border-muted rounded-full"
        style={{ maxWidth: '100%', height: 'auto' }}
      >
        <defs>
          {/* Create arc paths for curved text */}
          {sectors.map((sector, index) => {
            const startAngle = sectorAngle * index;
            const endAngle = sectorAngle * (index + 1);
            return (
              <path
                key={`arc-${index}`}
                id={`textArc-${index}`}
                d={createArcPath(startAngle, endAngle, textRadius)}
                fill="none"
              />
            );
          })}
        </defs>

        {/* Rotating group */}
        <g
          style={{
            transform: `rotate(${currentRotation}deg)`,
            transformOrigin: 'center',
            transition: isSpinning ? 'none' : 'transform 0.1s ease-out',
          }}
        >
          {sectors.map((sector, index) => {
            const startAngle = sectorAngle * index;
            const endAngle = sectorAngle * (index + 1);
            const textColor = sector.color === '#ffffff' ? '#000000' : '#ffffff';

            return (
              <g key={sector.id}>
                {/* Sector shape */}
                <path
                  d={createSectorPath(startAngle, endAngle, radius)}
                  fill={sector.color}
                  stroke="#ffffff"
                  strokeWidth="3"
                />

                {/* Curved text on arc */}
                <text
                  fill={textColor}
                  fontSize="18"
                  fontWeight="bold"
                  fontFamily="Arial, sans-serif"
                  textAnchor="middle"
                  style={{
                    paintOrder: 'stroke',
                    stroke: 'rgba(0,0,0,0.4)',
                    strokeWidth: 2,
                    strokeLinejoin: 'round',
                  }}
                >
                  <textPath href={`#textArc-${index}`} startOffset="50%">
                    {sector.text}
                  </textPath>
                </text>
              </g>
            );
          })}
        </g>

        {/* Pointer (indicator) - does not rotate */}
        <polygon
          points={`${centerX + radius - 15},${centerY} ${centerX + radius + 15},${centerY - 12} ${centerX + radius + 15},${centerY + 12}`}
          fill="#333333"
          stroke="#ffffff"
          strokeWidth="2"
        />

        {/* Center circle decoration */}
        <circle
          cx={centerX}
          cy={centerY}
          r={40}
          fill="#ffffff"
          stroke="#cccccc"
          strokeWidth="3"
        />
      </svg>

      <Button
        onClick={spinWheel}
        disabled={isSpinning || sectors.length === 0}
        className="flex items-center gap-2"
        size="lg"
      >
        <RotateCcw className={`h-5 w-5 ${isSpinning ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
}
