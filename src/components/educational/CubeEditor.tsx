import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { X, Save, Plus, Box } from 'lucide-react';

interface CubeFace {
  id: string;
  text: string;
  color: string;
}

interface SavedCube {
  id: string;
  name: string;
  faces: CubeFace[];
  createdAt: Date;
}

interface CubeEditorProps {
  faces: CubeFace[];
  onFacesChange: (faces: CubeFace[]) => void;
  onSave: (name: string, faces: CubeFace[]) => void;
  onLoad: (cube: SavedCube) => void;
  savedCubes: SavedCube[];
  translations: {
    face?: string;
    faceCount?: string;
    faceTexts?: string;
    enterText?: string;
    saveCube?: string;
    cubeName?: string;
    enterName?: string;
    save?: string;
    cancel?: string;
    savedCubes?: string;
    newCube?: string;
    // Cube face texts
    cubeFaceCompare?: string;
    cubeFaceDescribe?: string;
    cubeFaceAssociate?: string;
    cubeFaceExplain?: string;
    cubeFaceAnalyze?: string;
    cubeFaceApply?: string;
    // Polyhedron names
    tetrahedron?: string;
    cubeShape?: string;
    octahedron?: string;
    decahedron?: string;
    dodecahedron?: string;
  };
}

// Culori specifice pentru fiecare tip de poliedru
const colorSets: Record<number, string[]> = {
  4: [ // Tetraedru - Roșu, Galben, Verde, Albastru
    '#EF4444', '#EAB308', '#22C55E', '#3B82F6'
  ],
  6: [ // Cub - Metoda Cubului standard (conform imaginii)
    '#DC2626', // Roșu - COMPARĂ
    '#2563EB', // Albastru - DESCRIE
    '#16A34A', // Verde - ASOCIAZĂ
    '#EA580C', // Portocaliu - EXPLICĂ
    '#EAB308', // Galben - ANALIZEAZĂ
    '#F3F4F6'  // Alb/Gri deschis - APLICĂ
  ],
  8: [ // Octaedru - ROGVAIV + Negru
    '#FF0000', '#FF7F00', '#FFFF00', '#00FF00',
    '#0000FF', '#4B0082', '#9400D3', '#000000'
  ],
  10: [ // Decaedru - Culori RigletaNumLit
    '#d51818', '#ed0000', '#ed7300', '#ff7200',
    '#cfd518', '#e5ed00', '#00c32e', '#0131b4',
    '#241178', '#791cf8'
  ],
  12: [ // Dodecaedru - 10 fețe RigletaNumLit + Alb + Negru
    '#d51818', '#ed0000', '#ed7300', '#ff7200',
    '#cfd518', '#e5ed00', '#00c32e', '#0131b4',
    '#241178', '#791cf8', '#FFFFFF', '#000000'
  ]
};

// Valid face counts for different polyhedra
const validFaceCounts = [4, 6, 8, 10, 12];

// Function to get default texts based on translations
const getDefaultTexts = (translations: CubeEditorProps['translations']): Record<number, string[]> => ({
  4: [
    `${translations.face || 'Face'} 1`, 
    `${translations.face || 'Face'} 2`, 
    `${translations.face || 'Face'} 3`, 
    `${translations.face || 'Face'} 4`
  ],
  6: [
    translations.cubeFaceCompare || 'COMPARE',
    translations.cubeFaceDescribe || 'DESCRIBE',
    translations.cubeFaceAssociate || 'ASSOCIATE',
    translations.cubeFaceExplain || 'EXPLAIN',
    translations.cubeFaceAnalyze || 'ANALYZE',
    translations.cubeFaceApply || 'APPLY'
  ],
  8: ['1', '2', '3', '4', '5', '6', '7', '8'],
  10: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  12: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
});

// Function to get polyhedron name based on translations
const getPolyhedronNameFromTranslations = (count: number, translations: CubeEditorProps['translations']): string => {
  switch (count) {
    case 4: return translations.tetrahedron || 'Tetrahedron';
    case 6: return translations.cubeShape || 'Cube';
    case 8: return translations.octahedron || 'Octahedron';
    case 10: return translations.decahedron || 'Decahedron';
    case 12: return translations.dodecahedron || 'Dodecahedron';
    default: return translations.cubeShape || 'Cube';
  }
};

export default function CubeEditor({ 
  faces, 
  onFacesChange, 
  onSave, 
  onLoad, 
  savedCubes,
  translations 
}: CubeEditorProps) {
  const [faceCount, setFaceCount] = useState(faces.length || 6);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [saveName, setSaveName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const updateFaceCount = (count: number) => {
    setFaceCount(count);
    const timestamp = Date.now();
    const colors = colorSets[count] || colorSets[6];
    const defaultTexts = getDefaultTexts(translations);
    const texts = defaultTexts[count] || defaultTexts[6];
    const newFaces: CubeFace[] = [];
    
    for (let i = 0; i < count; i++) {
      newFaces.push({
        id: `face-${timestamp}-${i}`,
        text: texts[i] || `${translations.face || 'Face'} ${i + 1}`,
        color: colors[i % colors.length]
      });
    }
    
    onFacesChange(newFaces);
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditText(faces[index].text);
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      const newFaces = [...faces];
      newFaces[editingIndex] = {
        ...newFaces[editingIndex],
        text: editText
      };
      onFacesChange(newFaces);
      setEditingIndex(null);
      setEditText('');
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditText('');
  };

  const updateFaceColor = (index: number, color: string) => {
    const newFaces = [...faces];
    newFaces[index] = {
      ...newFaces[index],
      color: color
    };
    onFacesChange(newFaces);
  };

  const handleSave = () => {
    if (saveName.trim()) {
      onSave(saveName.trim(), faces);
      setSaveName('');
      setShowSaveDialog(false);
    }
  };

  const newCube = () => {
    const timestamp = Date.now();
    const colors = colorSets[faceCount] || colorSets[6];
    const defaultTexts = getDefaultTexts(translations);
    const texts = defaultTexts[faceCount] || defaultTexts[6];
    const newFaces: CubeFace[] = [];
    
    for (let i = 0; i < faceCount; i++) {
      newFaces.push({
        id: `face-${timestamp}-${i}`,
        text: texts[i] || `${translations.face || 'Face'} ${i + 1}`,
        color: colors[i % colors.length]
      });
    }
    onFacesChange(newFaces);
  };

  const getPolyhedronName = (count: number): string => {
    return getPolyhedronNameFromTranslations(count, translations);
  };

  return (
    <div className="space-y-4">
      {/* Face Count Selector */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Box className="w-4 h-4" />
          {translations.faceCount || 'Number of Faces'}
        </Label>
        <div className="flex gap-2 flex-wrap">
          {validFaceCounts.map((count) => (
            <Button
              key={count}
              variant={faceCount === count ? "default" : "outline"}
              size="sm"
              onClick={() => updateFaceCount(count)}
              className="flex-1 min-w-[60px]"
            >
              <div className="flex flex-col items-center">
                <span className="font-bold">{count}</span>
                <span className="text-[10px] opacity-70">{getPolyhedronName(count)}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Face Text Editors */}
      <div className="space-y-2">
        <Label>{translations.faceTexts || 'Face Texts'}</Label>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {faces.map((face, index) => (
            <div key={face.id} className="flex items-center gap-2">
              <input
                type="color"
                value={face.color}
                onChange={(e) => updateFaceColor(index, e.target.value)}
                className="w-6 h-6 rounded cursor-pointer border-0 flex-shrink-0 p-0"
                style={{ backgroundColor: face.color }}
              />
              
              {editingIndex === index ? (
                <div className="flex-1 flex gap-2">
                  <Textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 min-h-[80px] resize-none"
                    placeholder={translations.enterText || 'Enter text'}
                  />
                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      onClick={saveEdit}
                      className="px-2"
                    >
                      ✓
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={cancelEdit}
                      className="px-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="flex-1 text-left justify-start h-auto py-2 px-3"
                  onClick={() => startEditing(index)}
                >
                  <span className="truncate">{face.text}</span>
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex-1">
              <Save className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{translations.saveCube || 'Save Cube'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{translations.cubeName || 'Cube Name'}</Label>
                <Input
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder={translations.enterName || 'Enter name'}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  {translations.cancel || 'Cancel'}
                </Button>
                <Button onClick={handleSave} disabled={!saveName.trim()}>
                  {translations.save || 'Save'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button size="sm" onClick={newCube} className="flex-1">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Saved Cubes List */}
      {savedCubes.length > 0 && (
        <div className="space-y-2">
          <Label>{translations.savedCubes || 'Saved Cubes'}</Label>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {savedCubes.map((cube) => (
              <Button
                key={cube.id}
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => onLoad(cube)}
              >
                <Box className="h-3 w-3 mr-2" />
                {cube.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
