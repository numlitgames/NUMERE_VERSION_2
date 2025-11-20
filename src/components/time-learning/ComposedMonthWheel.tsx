import { months as monthsData } from '@/lib/timeData';

interface ComposedMonthWheelProps {
  rotation: number;
  size?: number;
  className?: string;
  showLabels?: boolean;
  language?: string; // Acceptă toate cele 16 limbi
  angleOffset?: number; // Offset in degrees for label alignment testing (e.g., 0, 15, -15)
  labelRadiusMultiplier?: number; // Radius multiplier for label positioning (default 0.98 for tangency with artwork)
}

const monthSectors = [
  { id: 1, name: 'ianuarie' },
  { id: 2, name: 'februarie' },
  { id: 3, name: 'martie' },
  { id: 4, name: 'aprilie' },
  { id: 5, name: 'mai' },
  { id: 6, name: 'iunie' },
  { id: 7, name: 'iulie' },
  { id: 8, name: 'august' },
  { id: 9, name: 'septembrie' },
  { id: 10, name: 'octombrie' },
  { id: 11, name: 'noiembrie' },
  { id: 12, name: 'decembrie' },
];

// Generează dinamic abrevieri pentru toate limbile din time-learning.json
const getMonthAbbreviation = (monthId: number, lang: string): string => {
  const month = monthsData.find(m => m.id === monthId);
  if (!month) return '';
  
  // Folosește limba cerută sau fallback la română
  const fullName = month.t[lang] || month.t.ro || '';
  
  // Pentru limbi CJK (chineze/japoneze) și arabă, returnează numele complet
  if (['ja', 'zh', 'ar'].includes(lang)) {
    return fullName;
  }
  
  // Pentru limbi europene, returnează primele 3 caractere
  return fullName.substring(0, 3);
};

// Dynamically import all month slice SVGs
const svgModules = import.meta.glob<{ default: string }>(
  '/src/assets/month-slices/month-*.svg',
  { eager: true }
);

// Sort and structure the month slices
const monthSlices = Object.entries(svgModules)
  .map(([path, module]) => {
    const match = path.match(/month-(\d+)\.svg$/);
    return {
      id: match ? parseInt(match[1], 10) : 0,
      url: module.default
    };
  })
  .filter(slice => slice.id > 0)
  .sort((a, b) => a.id - b.id);

export default function ComposedMonthWheel({
  rotation,
  size = 500,
  className = '',
  showLabels = false,
  language = 'ro',
  angleOffset = 0,
  labelRadiusMultiplier = 0.98,
}: ComposedMonthWheelProps) {
  const cx = size / 2;
  const cy = size / 2;
  const labelRadius = (size / 2) * labelRadiusMultiplier; // Labels positioned on outer circle, calibrated to be tangent with month-name ring (~5px gap)

  // Dominant colors for each month from SVG segments
  const monthColors = [
    '#a0d3da', // Ianuarie - light blue (winter)
    '#a0d3da', // Februarie - light blue (winter)
    '#2d7a4c', // Martie - dark green (spring)
    '#5fb878', // Aprilie - medium green (spring)
    '#b4d77e', // Mai - light green/yellow (spring)
    '#f4e88c', // Iunie - light yellow (summer)
    '#f9c74f', // Iulie - yellow/orange (summer)
    '#f39c4d', // August - orange (summer)
    '#e67e4d', // Septembrie - dark orange (autumn)
    '#d97e4d', // Octombrie - brown/orange (autumn)
    '#c97e4d', // Noiembrie - brown (autumn)
    '#a0d3da', // Decembrie - light blue (winter)
  ];

  const renderLabel = (month: typeof monthSectors[0]) => {
    // HORIZONTAL TEXT LAYOUT: Labels positioned on outer circle
    // Each label remains horizontal (readable left-to-right) regardless of wheel rotation
    // Formula: angleCenter = (month.id - 1) * 30 + angleOffset
    // Test with angleOffset: 0° (edges), +15° (centers), -15° (alternative)
    const angleCenter = (month.id - 1) * 30 + angleOffset;
    const angleRad = ((angleCenter - 90) * Math.PI) / 180; // -90 because 0° is at 3 o'clock mathematically
    
    const x = cx + labelRadius * Math.cos(angleRad);
    const y = cy + labelRadius * Math.sin(angleRad);
    
    const label = getMonthAbbreviation(month.id, language);
    const color = monthColors[month.id - 1];
    
    // HORIZONTAL ROTATION: Counter-rotate to keep text always horizontal
    // Text remains readable (left-to-right) as wheel spins
    const textRotation = -rotation;
    
    return (
      <text
        key={month.id}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="font-bold select-none"
        style={{
          fill: color,
          fontSize: `${size * 0.038}px`,
          fontWeight: 800,
          transform: `rotate(${textRotation}deg)`,
          transformOrigin: `${x}px ${y}px`,
          textShadow: `-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 0 4px rgba(255,255,255,0.8)`,
          WebkitTextStroke: '0.5px rgba(255,255,255,0.5)',
        }}
      >
        {label}
      </text>
    );
  };

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center',
        transition: 'transform 0.1s linear',
        willChange: 'transform',
      }}
    >
      {/* Layer 1: All month slice SVGs stacked */}
      {monthSlices.map(slice => (
        <img
          key={slice.id}
          src={slice.url}
          alt={`Luna ${slice.id}`}
          className="absolute inset-0 w-full h-full select-none pointer-events-none"
          style={{ objectFit: 'contain' }}
          draggable={false}
        />
      ))}

      {/* Layer 2: Labels (if enabled) */}
      {showLabels && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          {monthSectors.map(month => renderLabel(month))}
        </svg>
      )}
    </div>
  );
}
