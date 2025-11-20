import { seasons } from '@/lib/timeData';

interface SeasonWheelSVGProps {
  rotation: number;
  size?: number;
  className?: string;
  language?: 'ro' | 'en';
}

export default function SeasonWheelSVG({ 
  rotation, 
  size = 500, 
  className = '',
  language = 'ro' 
}: SeasonWheelSVGProps) {
  const centerX = 250;
  const centerY = 250;
  const outerRadius = 240;
  const middleRadius = 180;
  const innerRadius = 120;
  const textRadius = outerRadius - 42;

  // Create path for a sector (90 degrees)
  const createSectorPath = (startAngle: number, endAngle: number, radius: number): string => {
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
  };

  // Create arc path for text (no center point, just the arc)
  const createArcPath = (startAngle: number, endAngle: number, radius: number): string => {
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    return `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`;
  };

  // Get season data with colors
  const springData = seasons.find(s => s.id === 'spring');
  const summerData = seasons.find(s => s.id === 'summer');
  const autumnData = seasons.find(s => s.id === 'autumn');
  const winterData = seasons.find(s => s.id === 'winter');

  return (
    <svg 
      viewBox="0 0 500 500" 
      width={size} 
      height={size}
      className={className}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <defs>
        {/* Gradients for each season */}
        <linearGradient id="springGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b4d77e" />
          <stop offset="100%" stopColor="#5fb878" />
        </linearGradient>
        <linearGradient id="summerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4e88c" />
          <stop offset="100%" stopColor="#f9c74f" />
        </linearGradient>
        <linearGradient id="autumnGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f39c4d" />
          <stop offset="100%" stopColor="#d97e4d" />
        </linearGradient>
        <linearGradient id="winterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a0d3da" />
          <stop offset="100%" stopColor="#7eb8c4" />
        </linearGradient>
      </defs>

      {/* Background circle */}
      <circle cx={centerX} cy={centerY} r={outerRadius} fill="#fff" stroke="#ddd" strokeWidth="2"/>

      {/* Autumn sector - 180° to 270° (top-left) */}
      <path d={createSectorPath(180, 270, outerRadius)} fill="url(#autumnGradient)" stroke="#fff" strokeWidth="3"/>
      
      {/* Winter sector - 270° to 360° (top-right) */}
      <path d={createSectorPath(270, 360, outerRadius)} fill="url(#winterGradient)" stroke="#fff" strokeWidth="3"/>
      
      {/* Spring sector - 0° to 90° (bottom-right) */}
      <path d={createSectorPath(0, 90, outerRadius)} fill="url(#springGradient)" stroke="#fff" strokeWidth="3"/>
      
      {/* Summer sector - 90° to 180° (bottom-left) */}
      <path d={createSectorPath(90, 180, outerRadius)} fill="url(#summerGradient)" stroke="#fff" strokeWidth="3"/>

      {/* Concentric circles */}
      <circle cx={centerX} cy={centerY} r={middleRadius} fill="none" stroke="#fff" strokeWidth="3"/>
      <circle cx={centerX} cy={centerY} r={innerRadius} fill="none" stroke="#fff" strokeWidth="3"/>
      <circle cx={centerX} cy={centerY} r={60} fill="#fff" stroke="#ddd" strokeWidth="2"/>

      {/* Season icons - simplified SVG illustrations */}
      {/* Autumn - Leaves (225°, bottom-left) */}
      <g transform={`translate(${centerX - 106}, ${centerY + 106}) rotate(-90)`}>
        <ellipse cx="-5" cy="-8" rx="8" ry="12" fill="#d97e4d" transform="rotate(-30 -5 -8)"/>
        <ellipse cx="5" cy="-5" rx="8" ry="12" fill="#f39c4d" transform="rotate(30 5 -5)"/>
        <ellipse cx="0" cy="8" rx="8" ry="12" fill="#8b4513" transform="rotate(0 0 8)"/>
        <line x1="0" y1="-12" x2="0" y2="12" stroke="#654321" strokeWidth="2"/>
      </g>

      {/* Winter - Snowflake (315°, top-left) */}
      <g transform={`translate(${centerX - 106}, ${centerY - 106}) rotate(-90)`}>
        <line x1="0" y1="-15" x2="0" y2="15" stroke="#fff" strokeWidth="3"/>
        <line x1="-15" y1="0" x2="15" y2="0" stroke="#fff" strokeWidth="3"/>
        <line x1="-11" y1="-11" x2="11" y2="11" stroke="#fff" strokeWidth="3"/>
        <line x1="-11" y1="11" x2="11" y2="-11" stroke="#fff" strokeWidth="3"/>
        {/* Snowflake decorations */}
        <line x1="0" y1="-15" x2="-3" y2="-12" stroke="#fff" strokeWidth="2"/>
        <line x1="0" y1="-15" x2="3" y2="-12" stroke="#fff" strokeWidth="2"/>
        <line x1="0" y1="15" x2="-3" y2="12" stroke="#fff" strokeWidth="2"/>
        <line x1="0" y1="15" x2="3" y2="12" stroke="#fff" strokeWidth="2"/>
      </g>

      {/* Spring - Flower (45°, top-right) */}
      <g transform={`translate(${centerX + 106}, ${centerY - 106}) rotate(-90)`}>
        <circle cx="0" cy="0" r="8" fill="#fff" />
        <circle cx="0" cy="-12" r="6" fill="#ff69b4" />
        <circle cx="12" cy="0" r="6" fill="#ff69b4" />
        <circle cx="0" cy="12" r="6" fill="#ff69b4" />
        <circle cx="-12" cy="0" r="6" fill="#ff69b4" />
        <line x1="0" y1="0" x2="0" y2="30" stroke="#5fb878" strokeWidth="2"/>
        <path d="M -5,15 Q -8,20 -10,18" fill="none" stroke="#5fb878" strokeWidth="2"/>
      </g>

      {/* Summer - Sun (135°, bottom-right) */}
      <g transform={`translate(${centerX + 106}, ${centerY + 106}) rotate(-90)`}>
        <circle cx="0" cy="0" r="15" fill="#ffd700" stroke="#ff8c00" strokeWidth="2"/>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = angle * Math.PI / 180;
          return (
            <line
              key={angle}
              x1={20 * Math.cos(rad)}
              y1={20 * Math.sin(rad)}
              x2={28 * Math.cos(rad)}
              y2={28 * Math.sin(rad)}
              stroke="#ffd700"
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* Season names - curved text */}
      <defs>
        <path id="autumnArc" d={createArcPath(180, 270, textRadius)} fill="none"/>
        <path id="winterArc" d={createArcPath(270, 360, textRadius)} fill="none"/>
        <path id="springArc" d={createArcPath(0, 90, textRadius)} fill="none"/>
        <path id="summerArc" d={createArcPath(90, 180, textRadius)} fill="none"/>
      </defs>

      <text fill="#5c2e0a" fontSize="36" fontWeight="bold" textAnchor="middle" style={{ paintOrder: 'stroke', stroke: '#fff', strokeWidth: 3 }}>
        <textPath href="#autumnArc" startOffset="50%">
          {autumnData?.t[language] || 'AUTUMN'}
        </textPath>
      </text>
      <text fill="#2d5a66" fontSize="36" fontWeight="bold" textAnchor="middle" style={{ paintOrder: 'stroke', stroke: '#fff', strokeWidth: 3 }}>
        <textPath href="#winterArc" startOffset="50%">
          {winterData?.t[language] || 'WINTER'}
        </textPath>
      </text>
      <text fill="#2d5016" fontSize="36" fontWeight="bold" textAnchor="middle" style={{ paintOrder: 'stroke', stroke: '#fff', strokeWidth: 3 }}>
        <textPath href="#springArc" startOffset="50%">
          {springData?.t[language] || 'SPRING'}
        </textPath>
      </text>
      <text fill="#8b5a00" fontSize="36" fontWeight="bold" textAnchor="middle" style={{ paintOrder: 'stroke', stroke: '#fff', strokeWidth: 3 }}>
        <textPath href="#summerArc" startOffset="50%">
          {summerData?.t[language] || 'SUMMER'}
        </textPath>
      </text>

      {/* Center decoration */}
      <circle cx={centerX} cy={centerY} r="50" fill="#fff" stroke="#ccc" strokeWidth="2"/>
      <text 
        x={centerX} 
        y={centerY + 8} 
        textAnchor="middle" 
        fontSize="24" 
        fontWeight="bold"
        fill="hsl(var(--primary))"
      >
        {language === 'ro' ? 'ANOTIMPURI' : 'SEASONS'}
      </text>
    </svg>
  );
}
