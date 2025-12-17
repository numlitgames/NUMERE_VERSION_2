import { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Dice1 } from 'lucide-react';
import * as THREE from 'three';

interface CubeFace {
  id: string;
  text: string;
  color: string;
}

interface SpinningCubeProps {
  faces: CubeFace[];
  onResult: (face: CubeFace) => void;
  className?: string;
  translations?: {
    throwCube?: string;
    spinning?: string;
  };
}

// Helper pentru contrast text (alb sau negru)
const getContrastColor = (hexColor: string): string => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

// Calculează centrele și normalele fețelor pentru a poziționa textul
const getFaceCentersAndNormals = (faceCount: number, size: number): { position: [number, number, number]; normal: [number, number, number] }[] => {
  const results: { position: [number, number, number]; normal: [number, number, number] }[] = [];
  
  switch (faceCount) {
    case 4: { // Tetraedru
      // Vârfurile tetraedrului normalizat (din THREE.TetrahedronGeometry)
      const a = size / Math.sqrt(3);
      const vertices = [
        [a, a, a], [a, -a, -a], [-a, a, -a], [-a, -a, a]
      ];
      // Fețele: fiecare față e un triunghi format din 3 vârfuri
      const faceIndices = [
        [0, 1, 2], [0, 3, 1], [0, 2, 3], [1, 3, 2]
      ];
      faceIndices.forEach(([i1, i2, i3]) => {
        const v1 = vertices[i1], v2 = vertices[i2], v3 = vertices[i3];
        const center: [number, number, number] = [
          (v1[0] + v2[0] + v3[0]) / 3,
          (v1[1] + v2[1] + v3[1]) / 3,
          (v1[2] + v2[2] + v3[2]) / 3
        ];
        // Normala = centrul normalizat (punctează spre exterior)
        const len = Math.sqrt(center[0]**2 + center[1]**2 + center[2]**2);
        const normal: [number, number, number] = [center[0]/len, center[1]/len, center[2]/len];
        // Puțin mai departe de suprafață pentru text
        results.push({
          position: [center[0] * 1.15, center[1] * 1.15, center[2] * 1.15],
          normal
        });
      });
      break;
    }
    case 8: { // Octaedru
      // Octaedrul are vârfuri pe axe: ±size pe X, Y, Z
      // Fiecare față e un triunghi cu un vertex de pe fiecare axă
      const s = size;
      const faceNormals: [number, number, number][] = [
        [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
        [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]
      ];
      faceNormals.forEach(n => {
        const len = Math.sqrt(n[0]**2 + n[1]**2 + n[2]**2);
        const normal: [number, number, number] = [n[0]/len, n[1]/len, n[2]/len];
        const dist = s * 0.58; // Distanța de la centru la centrul feței
        results.push({
          position: [normal[0] * dist * 1.15, normal[1] * dist * 1.15, normal[2] * dist * 1.15],
          normal
        });
      });
      break;
    }
    case 10: { // Dipyramidă pentagonală
      const topY = size;
      const bottomY = -size;
      const midRadius = size * 0.9;
      
      // Calculăm cele 5 vârfuri ale pentagonului la ecuator
      const pentagonVertices: [number, number, number][] = [];
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        pentagonVertices.push([
          midRadius * Math.cos(angle),
          0,
          midRadius * Math.sin(angle)
        ]);
      }
      
      // 5 fețe superioare
      for (let i = 0; i < 5; i++) {
        const next = (i + 1) % 5;
        const v1 = [0, topY, 0];
        const v2 = pentagonVertices[i];
        const v3 = pentagonVertices[next];
        const center: [number, number, number] = [
          (v1[0] + v2[0] + v3[0]) / 3,
          (v1[1] + v2[1] + v3[1]) / 3,
          (v1[2] + v2[2] + v3[2]) / 3
        ];
        const len = Math.sqrt(center[0]**2 + center[1]**2 + center[2]**2);
        const normal: [number, number, number] = [center[0]/len, center[1]/len, center[2]/len];
        results.push({
          position: [center[0] * 1.2, center[1] * 1.2, center[2] * 1.2],
          normal
        });
      }
      
      // 5 fețe inferioare
      for (let i = 0; i < 5; i++) {
        const next = (i + 1) % 5;
        const v1 = pentagonVertices[i];
        const v2 = [0, bottomY, 0];
        const v3 = pentagonVertices[next];
        const center: [number, number, number] = [
          (v1[0] + v2[0] + v3[0]) / 3,
          (v1[1] + v2[1] + v3[1]) / 3,
          (v1[2] + v2[2] + v3[2]) / 3
        ];
        const len = Math.sqrt(center[0]**2 + center[1]**2 + center[2]**2);
        const normal: [number, number, number] = [center[0]/len, center[1]/len, center[2]/len];
        results.push({
          position: [center[0] * 1.2, center[1] * 1.2, center[2] * 1.2],
          normal
        });
      }
      break;
    }
    case 12: { // Dodecaedru
      // Dodecaedrul are 12 fețe pentagonale
      // Folosim normalele fețelor calculate geometric
      const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
      const s = size * 0.6;
      
      // Normalele celor 12 fețe ale dodecaedrului
      const faceNormals: [number, number, number][] = [
        [0, 1, phi], [0, 1, -phi], [0, -1, phi], [0, -1, -phi],
        [1, phi, 0], [1, -phi, 0], [-1, phi, 0], [-1, -phi, 0],
        [phi, 0, 1], [phi, 0, -1], [-phi, 0, 1], [-phi, 0, -1]
      ];
      
      faceNormals.forEach(n => {
        const len = Math.sqrt(n[0]**2 + n[1]**2 + n[2]**2);
        const normal: [number, number, number] = [n[0]/len, n[1]/len, n[2]/len];
        const dist = s * 1.9; // Distanța de la centru la centrul feței pentagonale
        results.push({
          position: [normal[0] * dist, normal[1] * dist, normal[2] * dist],
          normal
        });
      });
      break;
    }
  }
  
  return results;
};

// Calculează rotația Euler pentru ca textul să "privească" spre exterior
const calculateLookAtRotation = (normal: [number, number, number]): [number, number, number] => {
  const [nx, ny, nz] = normal;
  const rotY = Math.atan2(nx, nz);
  const rotX = Math.asin(-ny);
  return [rotX, rotY, 0];
};

// Dimensiunea fontului în funcție de geometrie
const getFontSize = (faceCount: number, isNumber: boolean): number => {
  const sizes: Record<number, number> = {
    4: isNumber ? 1.4 : 0.45,
    6: isNumber ? 1.8 : 0.5,
    8: isNumber ? 1.1 : 0.35,
    10: isNumber ? 0.9 : 0.3,
    12: isNumber ? 0.7 : 0.25
  };
  return sizes[faceCount] || 1.0;
};

// Creează geometrie Dipramidă Pentagonală (10 fețe triunghiulare)
const createPentagonalDipyramid = (radius: number): THREE.BufferGeometry => {
  const geometry = new THREE.BufferGeometry();
  
  // 7 vârfuri: 1 sus, 5 la ecuator, 1 jos
  const topY = radius;
  const bottomY = -radius;
  const midRadius = radius * 0.9;
  
  // Calculăm cele 5 vârfuri ale pentagonului la ecuator
  const pentagonVertices: [number, number, number][] = [];
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    pentagonVertices.push([
      midRadius * Math.cos(angle),
      0,
      midRadius * Math.sin(angle)
    ]);
  }
  
  const vertices: number[] = [];
  
  // 5 fețe superioare (vârf sus + pentagon)
  for (let i = 0; i < 5; i++) {
    const next = (i + 1) % 5;
    vertices.push(
      0, topY, 0,
      pentagonVertices[i][0], pentagonVertices[i][1], pentagonVertices[i][2],
      pentagonVertices[next][0], pentagonVertices[next][1], pentagonVertices[next][2]
    );
  }
  
  // 5 fețe inferioare (pentagon + vârf jos)
  for (let i = 0; i < 5; i++) {
    const next = (i + 1) % 5;
    vertices.push(
      pentagonVertices[i][0], pentagonVertices[i][1], pentagonVertices[i][2],
      0, bottomY, 0,
      pentagonVertices[next][0], pentagonVertices[next][1], pentagonVertices[next][2]
    );
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  
  return geometry;
};

// Componentă pentru poliedrul care se rotește
function RotatingPolyhedron({
  faces, 
  isSpinning, 
  targetRotation, 
  onSpinComplete 
}: { 
  faces: CubeFace[];
  isSpinning: boolean;
  targetRotation: [number, number, number];
  onSpinComplete: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [currentRotation, setCurrentRotation] = useState<[number, number, number]>([0, 0, 0]);
  const startTime = useRef<number>(0);
  const startRotation = useRef<[number, number, number]>([0, 0, 0]);
  const duration = 3000;
  const faceCount = faces.length;
  const size = 4.5;

  // Poziții text pentru cele 6 fețe ale cubului
  const textPositions: { position: [number, number, number]; rotation: [number, number, number] }[] = useMemo(() => {
    const offset = size / 2 + 0.02;
    return [
      { position: [offset, 0, 0], rotation: [0, Math.PI / 2, 0] },      // +X dreapta
      { position: [-offset, 0, 0], rotation: [0, -Math.PI / 2, 0] },    // -X stânga
      { position: [0, offset, 0], rotation: [-Math.PI / 2, 0, 0] },     // +Y sus
      { position: [0, -offset, 0], rotation: [Math.PI / 2, 0, 0] },     // -Y jos
      { position: [0, 0, offset], rotation: [0, 0, 0] },                // +Z față
      { position: [0, 0, -offset], rotation: [0, Math.PI, 0] },         // -Z spate
    ];
  }, [size]);

  useEffect(() => {
    if (isSpinning) {
      startTime.current = Date.now();
      if (meshRef.current) {
        startRotation.current = [
          meshRef.current.rotation.x,
          meshRef.current.rotation.y,
          meshRef.current.rotation.z
        ];
      }
    }
  }, [isSpinning]);

  useFrame(() => {
    if (!meshRef.current || !isSpinning) return;

    const elapsed = Date.now() - startTime.current;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease-out cubic)
    const easeOut = 1 - Math.pow(1 - progress, 3);

    // Interpolează rotația de la poziția de start
    meshRef.current.rotation.x = startRotation.current[0] + (targetRotation[0] - startRotation.current[0]) * easeOut;
    meshRef.current.rotation.y = startRotation.current[1] + (targetRotation[1] - startRotation.current[1]) * easeOut;
    meshRef.current.rotation.z = startRotation.current[2] + (targetRotation[2] - startRotation.current[2]) * easeOut;

    if (progress >= 1) {
      setCurrentRotation(targetRotation);
      onSpinComplete();
    }
  });

  // Geometrie memoizată pentru non-cub
  const nonCubeGeometry = useMemo(() => {
    if (faceCount === 6) return null;
    
    let geometry: THREE.BufferGeometry;
    switch (faceCount) {
      case 4:
        geometry = new THREE.TetrahedronGeometry(size);
        break;
      case 8:
        geometry = new THREE.OctahedronGeometry(size);
        break;
      case 10:
        geometry = createPentagonalDipyramid(size);
        break;
      case 12:
        geometry = new THREE.DodecahedronGeometry(size);
        break;
      default:
        geometry = new THREE.TetrahedronGeometry(size);
    }
    
    // Adaugă culori per vertex
    const positionAttribute = geometry.getAttribute('position');
    const colors = new Float32Array(positionAttribute.count * 3);
    const verticesPerFace = positionAttribute.count / faceCount;
    
    for (let i = 0; i < positionAttribute.count; i++) {
      const faceIndex = Math.floor(i / verticesPerFace) % faceCount;
      const color = new THREE.Color(faces[faceIndex]?.color || '#4ECDC4');
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, [faceCount, faces]);

  // Calculează pozițiile textului pentru poliedre non-cub (trebuie apelat înainte de return!)
  const faceData = useMemo(() => getFaceCentersAndNormals(faceCount, size), [faceCount, size]);

  // Render declarativ pentru cub cu 6 fețe + text
  if (faceCount === 6) {
    return (
      <group ref={meshRef}>
        {/* Cubul */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[size, size, size]} />
          <meshStandardMaterial attach="material-0" color={faces[0]?.color || '#DC2626'} roughness={0.3} metalness={0.2} />
          <meshStandardMaterial attach="material-1" color={faces[1]?.color || '#2563EB'} roughness={0.3} metalness={0.2} />
          <meshStandardMaterial attach="material-2" color={faces[2]?.color || '#16A34A'} roughness={0.3} metalness={0.2} />
          <meshStandardMaterial attach="material-3" color={faces[3]?.color || '#EA580C'} roughness={0.3} metalness={0.2} />
          <meshStandardMaterial attach="material-4" color={faces[4]?.color || '#EAB308'} roughness={0.3} metalness={0.2} />
          <meshStandardMaterial attach="material-5" color={faces[5]?.color || '#F3F4F6'} roughness={0.3} metalness={0.2} />
        </mesh>
        
        {/* Textele pe fiecare față */}
        {faces.map((face, index) => {
          const isNumber = face.text.length <= 2 && /^\d+$/.test(face.text);
          const isDiceDot = /^[⚀⚁⚂⚃⚄⚅]$/.test(face.text);
          
          // Dimensiuni optimizate pentru fiecare tip de text (puncte zar 50% mai mari)
          const fontSize = isDiceDot ? 3.75 : (isNumber ? 1.8 : 0.5);
          const outlineWidth = isDiceDot ? 0.1 : (isNumber ? 0.06 : 0.02);
          
          return (
            <Text
              key={face.id}
              position={textPositions[index].position}
              rotation={textPositions[index].rotation}
              fontSize={fontSize}
              color={isDiceDot ? '#FFFFFF' : getContrastColor(face.color)}
              anchorX="center"
              anchorY="middle"
              maxWidth={4}
              textAlign="center"
              outlineWidth={outlineWidth}
              outlineColor="#000000"
              fontWeight={isNumber || isDiceDot ? 'bold' : 'normal'}
            >
              {face.text}
            </Text>
          );
        })}
      </group>
    );
  }

  // Render pentru alte poliedre (4, 8, 10, 12 fețe)
  return (
    <group ref={meshRef}>
      <mesh geometry={nonCubeGeometry!} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.3} metalness={0.2} />
      </mesh>
      
      {/* Textele/Numerele pe fiecare față */}
      {faces.map((face, index) => {
        const faceInfo = faceData[index];
        if (!faceInfo) return null;
        
        const isNumber = face.text.length <= 2 && /^\d+$/.test(face.text);
        const lookAtRotation = calculateLookAtRotation(faceInfo.normal);
        
        return (
          <Text
            key={face.id}
            position={faceInfo.position}
            rotation={lookAtRotation}
            fontSize={getFontSize(faceCount, isNumber)}
            color={getContrastColor(face.color)}
            anchorX="center"
            anchorY="middle"
            outlineWidth={isNumber ? 0.04 : 0.01}
            outlineColor="#000000"
            fontWeight={isNumber ? 'bold' : 'normal'}
          >
            {face.text}
          </Text>
        );
      })}
    </group>
  );
}

export default function SpinningCube({ faces, onResult, className = '', translations }: SpinningCubeProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [targetRotation, setTargetRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [lastResult, setLastResult] = useState<CubeFace | null>(null);
  const [showingResult, setShowingResult] = useState(false);

  // Rotații exacte pentru a aduce fiecare față a cubului în fața camerei
  // BoxGeometry fețele: 0=+X, 1=-X, 2=+Y, 3=-Y, 4=+Z, 5=-Z
  const faceRotations: [number, number, number][] = [
    [0, -Math.PI / 2, 0],     // Face 0 (+X) - Y -90° aduce +X în față
    [0, Math.PI / 2, 0],      // Face 1 (-X) - Y +90° aduce -X în față
    [Math.PI / 2, 0, 0],      // Face 2 (+Y) - X +90° aduce +Y în față
    [-Math.PI / 2, 0, 0],     // Face 3 (-Y) - X -90° aduce -Y în față
    [0, 0, 0],                // Face 4 (+Z) - deja în față
    [0, Math.PI, 0],          // Face 5 (-Z) - Y 180°
  ];

  const spinCube = () => {
    if (isSpinning || faces.length === 0) return;

    setIsSpinning(true);
    setLastResult(null);
    setShowingResult(false);

    // 1. Selectează fața câștigătoare PRIMA
    const selectedIndex = Math.floor(Math.random() * faces.length);
    const selectedFace = faces[selectedIndex];

    // 2. Obține rotația exactă pentru această față (pentru cub cu 6 fețe)
    const faceCount = faces.length;
    let finalFaceRotation: [number, number, number] = [0, 0, 0];
    
    if (faceCount === 6) {
      finalFaceRotation = faceRotations[selectedIndex];
    } else {
      // Pentru alte geometrii, folosim o rotație aleatorie
      finalFaceRotation = [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ];
    }

    // 3. Adaugă rotații spectaculoase + rotația finală exactă
    const spins = 3 + Math.floor(Math.random() * 3); // 3-5 rotații complete
    
    const newTargetRotation: [number, number, number] = [
      finalFaceRotation[0],                          // X exact - fără spins
      spins * Math.PI * 2 + finalFaceRotation[1],   // Y cu spins orizontale
      finalFaceRotation[2],
    ];

    setTargetRotation(newTargetRotation);

    // 4. Setează rezultatul după animație
    setTimeout(() => {
      setLastResult(selectedFace);
      setShowingResult(true);
      onResult(selectedFace);
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex gap-4 w-full">
        {/* Canvas - partea stângă, mai mare */}
        <div className="flex-1 h-[500px] bg-gradient-to-b from-background to-muted rounded-xl border-2 border-border shadow-lg">
          <Canvas
            camera={{ position: [0, 0, 12], fov: 50 }}
            shadows
          >
            <ambientLight intensity={0.6} />
            <directionalLight 
              position={[10, 10, 5]} 
              intensity={1} 
              castShadow
            />
            <pointLight position={[-10, -10, -5]} intensity={0.5} />
            
            <RotatingPolyhedron
              faces={faces}
              isSpinning={isSpinning}
              targetRotation={targetRotation}
              onSpinComplete={() => {}}
            />
            
            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
              autoRotate={!isSpinning && !showingResult}
              autoRotateSpeed={2}
            />
          </Canvas>
        </div>

        {/* Controale - partea dreaptă */}
        <div className="w-64 flex flex-col gap-4">
          {/* Card rezultat */}
          {lastResult && (
            <div 
              className="p-4 rounded-xl border-2 text-center font-bold text-lg shadow-md animate-fade-in"
              style={{ 
                backgroundColor: lastResult.color + '30',
                borderColor: lastResult.color,
                color: lastResult.color
              }}
            >
              {/* Conversie puncte zar în cifre arabe */}
              {{'⚀': '1', '⚁': '2', '⚂': '3', '⚃': '4', '⚄': '5', '⚅': '6'}[lastResult.text] || lastResult.text}
            </div>
          )}

          {/* Buton */}
          <Button
            onClick={spinCube}
            disabled={isSpinning}
            size="lg"
            className="gap-2 w-full"
          >
            <Dice1 className="h-5 w-5" />
            {isSpinning 
              ? (translations?.spinning || 'Se rotește...') 
              : (translations?.throwCube || 'Aruncă cubul')}
          </Button>
        </div>
      </div>
    </div>
  );
}
