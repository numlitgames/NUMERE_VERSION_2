import React, { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ZoomControls from "@/components/educational/ZoomControls";
import Timer from "@/components/educational/Timer";
import VerticalSelector from "@/components/educational/VerticalSelector";
import { Home, Info, Keyboard } from "lucide-react";
import LiteracyKeyboard from "@/components/educational/LiteracyKeyboard";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Canvas as FabricCanvas, FabricText, Shadow } from "fabric";
import numLitLogo from "@/assets/numlit-logo-header.png";
import { WritingDirectionManager } from "@/utils/writingDirection";
import { svgLetterComponents } from "@/components/educational/svg-letters";

// Import letter tracing images
import AImage from "@/assets/letters/A.png";
import ĂImage from "@/assets/letters/Ă.png";
import ÂImage from "@/assets/letters/Â.png";
import BImage from "@/assets/letters/B.png";
import CImage from "@/assets/letters/C.png";
import DImage from "@/assets/letters/D.png";
import EImage from "@/assets/letters/E.png";
import FImage from "@/assets/letters/F.png";
import GImage from "@/assets/letters/G.png";
import HImage from "@/assets/letters/H.png";
import IImage from "@/assets/letters/I.png";
import ÎImage from "@/assets/letters/Î.png";
import JImage from "@/assets/letters/J.png";
import KImage from "@/assets/letters/K.png";
import LImage from "@/assets/letters/L.png";
import MImage from "@/assets/letters/M.png";
import NImage from "@/assets/letters/N.png";
import OImage from "@/assets/letters/O.png";
import PImage from "@/assets/letters/P.png";
import QImage from "@/assets/letters/Q.png";
import RImage from "@/assets/letters/R.png";
import SImage from "@/assets/letters/S.png";
import ȘImage from "@/assets/letters/Ș.png";
import TImage from "@/assets/letters/T.png";
import ȚImage from "@/assets/letters/Ț.png";
import UImage from "@/assets/letters/U.png";
import VImage from "@/assets/letters/V.png";
import WImage from "@/assets/letters/W.png";
import XImage from "@/assets/letters/X.png";
import YImage from "@/assets/letters/Y.png";
import ZImage from "@/assets/letters/Z.png";

// Letter images mapping
const letterImages: Record<string, string> = {
  'A': AImage, 'Ă': ĂImage, 'Â': ÂImage, 'B': BImage, 'C': CImage, 'D': DImage,
  'E': EImage, 'F': FImage, 'G': GImage, 'H': HImage, 'I': IImage, 'Î': ÎImage,
  'J': JImage, 'K': KImage, 'L': LImage, 'M': MImage, 'N': NImage, 'O': OImage,
  'P': PImage, 'Q': QImage, 'R': RImage, 'S': SImage, 'Ș': ȘImage, 'T': TImage,
  'Ț': ȚImage, 'U': UImage, 'V': VImage, 'W': WImage, 'X': XImage, 'Y': YImage, 'Z': ZImage
};

// Function to get image for a letter
const getLetterImage = (letter: string): string | null => {
  const upperLetter = letter.toUpperCase();
  return letterImages[upperLetter] || null;
};

// Function to get SVG component for a letter
const getSVGComponent = (letter: string) => {
  return svgLetterComponents[letter as keyof typeof svgLetterComponents] || null;
};

// Complete translations for all 16 supported languages
const translations = {
  ar: { flag: "🇸🇦", name: "العربية", title: "لوحة تفاعلية ✨", subtitle: "تطوير مهارات القراءة والكتابة", slogan: "تدريب العقل", instructions: "التعليمات", howToPlayTitle: "كيفية اللعب", howToPlay: "اختر حرفًا وطور مهارات القراءة والكتابة من خلال اللوحة التفاعلية.", back: "العودة", language: "اللغة", letterLabel: "اختر الحرف", letters: "أبتثجحخدذرزسشصضطظعغفقكلمنهوي", canvasControls: "تحكم اللوحة", keyboard: "لوحة المفاتيح", clear: "مسح", save: "حفظ", hide: "إخفاء", undo: "تراجع", letterAdded: "تمت إضافة الحرف", canvasCleared: "تم مسح اللوحة", lastObjectRemoved: "تم حذف العنصر الأخير", canvasSaved: "تم حفظ اللوحة", emptySlot: "فتحة فارغة" },
  bg: { flag: "🇧🇬", name: "Български", title: "Интерактивна Дъска ✨", subtitle: "Развивайте умения за четене и писане", slogan: "Тренирайте Ума", instructions: "Инструкции", howToPlayTitle: "Как да играете", howToPlay: "Изберете буква и развийте умения за четене и писане чрез интерактивната дъска.", back: "Назад", language: "Език", letterLabel: "Изберете буква", letters: "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЬЮЯ", canvasControls: "Контроли на платното", keyboard: "Клавиатура", clear: "Изчисти", save: "Запази", hide: "Скрий", undo: "Отмени", letterAdded: "Буквата е добавена", canvasCleared: "Платното е изчистено", lastObjectRemoved: "Последният обект е премахнат", canvasSaved: "Платното е запазено", emptySlot: "Празен слот" },
  cs: { flag: "🇨🇿", name: "Čeština", title: "Interaktivní Tabule ✨", subtitle: "Rozvíjejte dovednosti čtení a psaní", slogan: "Trénujte Mozek", instructions: "Instrukce", howToPlayTitle: "Jak hrát", howToPlay: "Vyberte písmeno a rozvíjejte dovednosti čtení a psaní prostřednictvím interaktivní tabule.", back: "Zpět", language: "Jazyk", letterLabel: "Vyberte písmeno", letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", canvasControls: "Ovládání plátna", keyboard: "Klávesnice", clear: "Vymazat", save: "Uložit", hide: "Skrýt", undo: "Zpět", letterAdded: "Písmeno přidáno", canvasCleared: "Plátno vymazáno", lastObjectRemoved: "Poslední objekt odstraněn", canvasSaved: "Plátno uloženo", emptySlot: "Prázdný slot" },
  de: { flag: "🇩🇪", name: "Deutsch", title: "Interaktive Tafel ✨", subtitle: "Entwickeln Sie Lese- und Schreibfähigkeiten", slogan: "Trainiere das Gehirn", instructions: "Anweisungen", howToPlayTitle: "Wie man spielt", howToPlay: "Wählen Sie einen Buchstaben und entwickeln Sie Lese- und Schreibfähigkeiten durch die interaktive Tafel.", back: "Zurück", language: "Sprache", letterLabel: "Buchstaben wählen", letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", canvasControls: "Leinwand-Steuerung", keyboard: "Tastatur", clear: "Löschen", save: "Speichern", hide: "Verstecken", undo: "Rückgängig", letterAdded: "Buchstabe hinzugefügt", canvasCleared: "Leinwand gelöscht", lastObjectRemoved: "Letztes Objekt entfernt", canvasSaved: "Leinwand gespeichert", emptySlot: "Leerer Platz" },
  en: { flag: "🇺🇸", name: "English", title: "Interactive Board ✨", subtitle: "Develop reading and writing skills", slogan: "Train the Brain", instructions: "Instructions", howToPlayTitle: "How to play", howToPlay: "Choose a letter and develop reading and writing skills through the interactive board.", back: "Back", language: "Language", letterLabel: "Choose letter", letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", canvasControls: "Canvas Controls", keyboard: "Keyboard", clear: "Clear", save: "Save", hide: "Hide", undo: "Undo", letterAdded: "Letter added", canvasCleared: "Canvas cleared", lastObjectRemoved: "Last object removed", canvasSaved: "Canvas saved", emptySlot: "Empty slot" },
  es: { flag: "🇪🇸", name: "Español", title: "Pizarra Interactiva ✨", subtitle: "Desarrolla habilidades de lectura y escritura", slogan: "Entrena la Mente", instructions: "Instrucciones", howToPlayTitle: "Cómo jugar", howToPlay: "Elige una letra y desarrolla habilidades de lectura y escritura a través de la pizarra interactiva.", back: "Atrás", language: "Idioma", letterLabel: "Elegir letra", letters: "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ", canvasControls: "Controles del lienzo", keyboard: "Teclado", clear: "Limpiar", save: "Guardar", hide: "Ocultar", undo: "Deshacer", letterAdded: "Letra añadida", canvasCleared: "Lienzo limpiado", lastObjectRemoved: "Último objeto eliminado", canvasSaved: "Lienzo guardado", emptySlot: "Ranura vacía" },
  fr: { flag: "🇫🇷", name: "Français", title: "Tableau Interactif ✨", subtitle: "Développez les compétences de lecture et d'écriture", slogan: "Entraînez le Cerveau", instructions: "Instructions", howToPlayTitle: "Comment jouer", howToPlay: "Choisissez une lettre et développez les compétences de lecture et d'écriture grâce au tableau interactif.", back: "Retour", language: "Langue", letterLabel: "Choisir la lettre", letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", canvasControls: "Contrôles du canevas", keyboard: "Clavier", clear: "Effacer", save: "Sauvegarder", hide: "Masquer", undo: "Annuler", letterAdded: "Lettre ajoutée", canvasCleared: "Canevas effacé", lastObjectRemoved: "Dernier objet supprimé", canvasSaved: "Canevas sauvegardé", emptySlot: "Emplacement vide" },
  hi: { flag: "🇮🇳", name: "हिंदी", title: "इंटरैक्टिव बोर्ड ✨", subtitle: "पढ़ने और लिखने के कौशल विकसित करें", slogan: "मस्तिष्क को प्रशिक्षित करें", instructions: "निर्देश", howToPlayTitle: "कैसे खेलें", howToPlay: "एक अक्षर चुनें और इंटरैक्टिव बोर्ड के माध्यम से पढ़ने और लिखने के कौशल विकसित करें।", back: "वापस", language: "भाषा", letterLabel: "अक्षर चुनें", letters: "अआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह", canvasControls: "कैनवास नियंत्रण", keyboard: "कीबोर्ड", clear: "साफ़ करें", save: "सहेजें", hide: "छिपाएं", undo: "पूर्ववत करें", letterAdded: "अक्षर जोड़ा गया", canvasCleared: "कैनवास साफ़ किया गया", lastObjectRemoved: "अंतिम वस्तु हटाई गई", canvasSaved: "कैनवास सहेजा गया", emptySlot: "खाली स्लॉट" },
  hu: { flag: "🇭🇺", name: "Magyar", title: "Interaktív Tábla ✨", subtitle: "Fejlessze az olvasási és írási készségeket", slogan: "Edzze az Agyat", instructions: "Utasítások", howToPlayTitle: "Hogyan kell játszani", howToPlay: "Válasszon egy betűt és fejlessze az olvasási és írási készségeket az interaktív táblán keresztül.", back: "Vissza", language: "Nyelv", letterLabel: "Betű választása", letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", canvasControls: "Vászon vezérlők", keyboard: "Billentyűzet", clear: "Törlés", save: "Mentés", hide: "Elrejtés", undo: "Visszavonás", letterAdded: "Betű hozzáadva", canvasCleared: "Vászon törölve", lastObjectRemoved: "Utolsó objektum eltávolítva", canvasSaved: "Vászon mentve", emptySlot: "Üres hely" },
  it: { flag: "🇮🇹", name: "Italiano", title: "Lavagna Interattiva ✨", subtitle: "Sviluppa le capacità di lettura e scrittura", slogan: "Allena il Cervello", instructions: "Istruzioni", howToPlayTitle: "Come giocare", howToPlay: "Scegli una lettera e sviluppa le capacità di lettura e scrittura attraverso la lavagna interattiva.", back: "Indietro", language: "Lingua", letterLabel: "Scegli lettera", letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", canvasControls: "Controlli canvas", keyboard: "Tastiera", clear: "Cancella", save: "Salva", hide: "Nascondi", undo: "Annulla", letterAdded: "Lettera aggiunta", canvasCleared: "Canvas cancellato", lastObjectRemoved: "Ultimo oggetto rimosso", canvasSaved: "Canvas salvato", emptySlot: "Slot vuoto" },
  ja: { flag: "🇯🇵", name: "日本語", title: "インタラクティブボード ✨", subtitle: "読み書きスキルを開発", slogan: "脳をトレーニング", instructions: "説明", howToPlayTitle: "プレイ方法", howToPlay: "文字を選択し、インタラクティブボードを通じて読み書きスキルを開発します。", back: "戻る", language: "言語", letterLabel: "文字を選択", letters: "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん", canvasControls: "キャンバスコントロール", keyboard: "キーボード", clear: "クリア", save: "保存", hide: "非表示", undo: "元に戻す", letterAdded: "文字が追加されました", canvasCleared: "キャンバスがクリアされました", lastObjectRemoved: "最後のオブジェクトが削除されました", canvasSaved: "キャンバスが保存されました", emptySlot: "空のスロット" },
  pl: { flag: "🇵🇱", name: "Polski", title: "Interaktywna Tablica ✨", subtitle: "Rozwijaj umiejętności czytania i pisania", slogan: "Trenuj Mózg", instructions: "Instrukcje", howToPlayTitle: "Jak grać", howToPlay: "Wybierz literę i rozwijaj umiejętności czytania i pisania przez interaktywną tablicę.", back: "Wróć", language: "Język", letterLabel: "Wybierz literę", letters: "AĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUVWXYZŹŻ", canvasControls: "Kontrolki płótna", keyboard: "Klawiatura", clear: "Wyczyść", save: "Zapisz", hide: "Ukryj", undo: "Cofnij", letterAdded: "Litera dodana", canvasCleared: "Płótno wyczyszczone", lastObjectRemoved: "Ostatni obiekt usunięty", canvasSaved: "Płótno zapisane", emptySlot: "Pusty slot" },
  ro: { flag: "🇷🇴", name: "Română", title: "Tabla Interactivă ✨", subtitle: "Dezvoltă abilități de citire și scriere", slogan: "Antrenează Mintea", instructions: "Instrucțiuni", howToPlayTitle: "Cum se joacă", howToPlay: "Alege o literă și dezvoltă abilitățile de citire și scriere prin tabla interactivă.", back: "Înapoi", language: "Limbă", letterLabel: "Alege litera", letters: "AĂÂBCDEFGHIÎJKLMNOPQRSȘTȚUVWXYZaăâbcdefghiîjklmnopqrsștțuvwxyz", canvasControls: "Controale Canvas", keyboard: "Tastatură", clear: "Curăță", save: "Salvează", hide: "Ascunde", undo: "Anulează", letterAdded: "Literă adăugată", canvasCleared: "Canvas șters", lastObjectRemoved: "Ultimul obiect șters", canvasSaved: "Canvas salvat", emptySlot: "Slot gol" },
  ru: { flag: "🇷🇺", name: "Русский", title: "Интерактивная Доска ✨", subtitle: "Развивайте навыки чтения и письма", slogan: "Тренируйте Мозг", instructions: "Инструкции", howToPlayTitle: "Как играть", howToPlay: "Выберите букву и развивайте навыки чтения и письма через интерактивную доску.", back: "Назад", language: "Язык", letterLabel: "Выберите букву", letters: "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ", canvasControls: "Управление холстом", keyboard: "Клавиатура", clear: "Очистить", save: "Сохранить", hide: "Скрыть", undo: "Отменить", letterAdded: "Буква добавлена", canvasCleared: "Холст очищен", lastObjectRemoved: "Последний объект удален", canvasSaved: "Холст сохранен", emptySlot: "Пустой слот" },
  tr: { flag: "🇹🇷", name: "Türkçe", title: "Etkileşimli Tahta ✨", subtitle: "Okuma ve yazma becerilerini geliştir", slogan: "Beyni Eğit", instructions: "Talimatlar", howToPlayTitle: "Nasıl oynanır", howToPlay: "Bir harf seçin ve etkileşimli tahta aracılığıyla okuma ve yazma becerilerini geliştirin.", back: "Geri", language: "Dil", letterLabel: "Harf seçin", letters: "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ", canvasControls: "Tuval Kontrolleri", keyboard: "Klavye", clear: "Temizle", save: "Kaydet", hide: "Gizle", undo: "Geri Al", letterAdded: "Harf eklendi", canvasCleared: "Tuval temizlendi", lastObjectRemoved: "Son nesne kaldırıldı", canvasSaved: "Tuval kaydedildi", emptySlot: "Boş yuva" },
  zh: { flag: "🇨🇳", name: "中文", title: "互动板 ✨", subtitle: "发展阅读和写作技能", slogan: "训练大脑", instructions: "说明", howToPlayTitle: "如何玩", howToPlay: "选择一个字母，通过互动板发展阅读和写作技能。", back: "返回", language: "语言", letterLabel: "选择字母", letters: "abcdefghijklmnopqrstuvwxyz", canvasControls: "画布控制", keyboard: "键盘", clear: "清除", save: "保存", hide: "隐藏", undo: "撤销", letterAdded: "字母已添加", canvasCleared: "画布已清除", lastObjectRemoved: "最后一个对象已删除", canvasSaved: "画布已保存", emptySlot: "空槽" }
};

type LanguageKey = keyof typeof translations;
const languageKeys: LanguageKey[] = ['ro', 'en', 'de', 'fr', 'es', 'it', 'pl', 'ru', 'bg', 'cs', 'hu', 'tr', 'ar', 'hi', 'ja', 'zh'];

const TablaInteractiva = () => {
  const navigate = useNavigate();
  
  // State management
  const [language, setLanguage] = useState<LanguageKey>('ro');
  const [selectedLetter, setSelectedLetter] = useState<string>('A');
  const [zoom, setZoom] = useState(100);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [letterPosition, setLetterPosition] = useState({ x: 20, y: 20 });
  const [writingDirectionManager, setWritingDirectionManager] = useState<WritingDirectionManager | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  
  const letterWidth = 80;
  const letterHeight = 80;
  const lineSpacing = 100;
  const maxWidth = 700;
  
  // Get current translations
  const t = translations[language];
  
  // Available letters for current language
  const availableLetters = useMemo(() => {
    return t.letters.split('');
  }, [t.letters]);

  // Vowel detection for outline coloring
  const vowelsSet = useMemo(() => {
    switch (language) {
      case 'ro': return new Set(['A','Ă','Â','E','I','Î','O','U']);
      case 'bg': return new Set(['А','Е','И','О','У','Ъ','Ю','Я']);
      case 'ru': return new Set(['А','Е','Ё','И','О','У','Ы','Э','Ю','Я']);
      case 'ar': return new Set(['ا','و','ي']);
      case 'hi': return new Set(['अ','आ','इ','ई','उ','ऊ','ए','ऐ','ओ','औ']);
      case 'ja': return new Set(['あ','い','う','え','お']);
      default: return new Set(['A','E','I','O','U','Y']);
    }
  }, [language]);
  
  const isVowel = (letter: string) => vowelsSet.has(letter) || vowelsSet.has(letter.toUpperCase());

  // Initialize canvas with full viewport size
  useEffect(() => {
    if (!canvasRef.current) return;

    const width = window.innerWidth - (sidebarWidth || 300);
    const height = window.innerHeight - 48;

    const canvas = new FabricCanvas(canvasRef.current, {
      width,
      height,
      backgroundColor: "#ffffff",
      selection: true,
    });

    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    canvas.setZoom(1);

    canvas.set({
      borderColor: '#2563eb',
      cornerColor: '#2563eb',
      cornerSize: 12,
      transparentCorners: false,
      cornerStyle: 'circle',
      borderScaleFactor: 2,
    });

    if (debugMode) {
      for (let i = 0; i < width; i += 50) {
        const line = new FabricText('|', {
          left: i, top: 0, fontSize: 8, fill: '#ff0000', selectable: false, evented: false,
        });
        canvas.add(line);
      }
      for (let i = 0; i < height; i += 50) {
        const line = new FabricText('-', {
          left: 0, top: i, fontSize: 8, fill: '#ff0000', selectable: false, evented: false,
        });
        canvas.add(line);
      }
      const crosshair = new FabricText('+', {
        left: 20, top: 20, fontSize: 20, fill: '#ff0000', selectable: false, evented: false,
      });
      canvas.add(crosshair);
    }

    canvas.on('mouse:down', (opt) => {
      if (debugMode) {
        const pointer = canvas.getViewportPoint(opt.e);
        console.log('Canvas click at:', pointer.x, pointer.y);
      }
    });

    setFabricCanvas(canvas);

    const handleResize = () => {
      const newWidth = window.innerWidth - (sidebarWidth || 300);
      const newHeight = window.innerHeight - 48;
      canvas.setDimensions({ width: newWidth, height: newHeight });
      canvas.renderAll();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, [sidebarWidth, debugMode]);

  // Initialize WritingDirectionManager
  useEffect(() => {
    if (!fabricCanvas) return;

    const canvasWidth = fabricCanvas.getWidth();
    const canvasHeight = fabricCanvas.getHeight();
    
    const manager = new WritingDirectionManager(canvasWidth, canvasHeight, language, 60);
    setWritingDirectionManager(manager);
  }, [fabricCanvas, language]);

  // Reset letter when language changes
  useEffect(() => {
    setSelectedLetter(availableLetters[0] || 'A');
  }, [language, availableLetters]);

  const handleKeyboardToggle = () => {
    setShowKeyboard(!showKeyboard);
  };

  const handleKeyPress = (key: string) => {
    if (!fabricCanvas) return;

    const displayKey = key === ' ' ? '␣' : key;
    
    let position;
    if (writingDirectionManager) {
      position = writingDirectionManager.getNextLetterPosition();
    } else {
      position = { x: letterPosition.x, y: letterPosition.y };
      updateLetterPosition();
    }
    
    const canvasWidth = fabricCanvas.getWidth();
    const canvasHeight = fabricCanvas.getHeight();
    position.x = Math.max(10, Math.min(position.x, canvasWidth - 100));
    position.y = Math.max(10, Math.min(position.y, canvasHeight - 100));
    
    const letterColor = isVowel(key) ? '#1d4ed8' : '#dc2626';
    
    const text = new FabricText(displayKey, {
      left: position.x,
      top: position.y,
      fontSize: 72,
      fill: letterColor,
      stroke: '#111111',
      strokeWidth: 3,
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      paintFirst: 'stroke',
      strokeUniform: true,
      shadow: new Shadow({
        color: 'rgba(0,0,0,0.35)',
        blur: 4,
        offsetX: 2,
        offsetY: 2,
      }),
      selectable: true,
      evented: true,
      hasControls: true,
      hasBorders: true,
      lockRotation: false,
      cornerStyle: 'circle',
      cornerColor: letterColor,
      borderColor: letterColor,
      cornerSize: 8,
      transparentCorners: false
    });
    
    fabricCanvas.add(text);
    fabricCanvas.bringObjectToFront(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.requestRenderAll();
    
    toast.info(`${t.letterAdded}: ${displayKey}`);
  };

  const updateLetterPosition = () => {
    setLetterPosition(prev => {
      let newX = prev.x + letterWidth + 10;
      let newY = prev.y;
      
      if (newX + letterWidth > maxWidth) {
        newX = 20;
        newY = prev.y + lineSpacing;
      }
      
      return { x: newX, y: newY };
    });
  };

  const handleClearCanvas = () => {
    if (fabricCanvas) {
      fabricCanvas.clear();
      fabricCanvas.backgroundColor = "#ffffff";
      fabricCanvas.renderAll();
      toast.success(t.canvasCleared);
    }
  };

  const handleUndo = () => {
    if (fabricCanvas) {
      const objects = fabricCanvas.getObjects();
      if (objects.length > 0) {
        fabricCanvas.remove(objects[objects.length - 1]);
        fabricCanvas.renderAll();
        toast.info(t.lastObjectRemoved);
      }
    }
  };

  const handleSave = () => {
    if (fabricCanvas) {
      const dataURL = fabricCanvas.toDataURL({ 
        format: 'png', 
        quality: 1,
        multiplier: 1
      });
      const link = document.createElement('a');
      link.download = 'tabla-interactiva.png';
      link.href = dataURL;
      link.click();
      toast.success(t.canvasSaved);
    }
  };

  const renderSidebarContent = () => (
    <div className="relative bg-gradient-to-b from-background to-muted/30 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-2">
        {/* Language Selector */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/80 mb-1 uppercase tracking-wide">
            {t.language}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="p-1">
              <Select value={language} onValueChange={(value: LanguageKey) => setLanguage(value)}>
                <SelectTrigger 
                  className="w-full h-8 bg-green-50 border-2 border-green-400 text-green-700 font-medium rounded-md hover:bg-green-100 focus:ring-2 focus:ring-green-400 focus:ring-offset-1 text-sm px-2"
                  style={{ minWidth: `${Math.max(120, sidebarWidth - 40)}px` }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto bg-white z-50">
                  {languageKeys.map((lang) => (
                    <SelectItem key={lang} value={lang} className="flex items-center gap-2">
                      <span className="text-lg">{translations[lang].flag}</span>
                      <span>{translations[lang].name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Letter Selector */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/80 mb-1 uppercase tracking-wide">
            {t.letterLabel}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="p-1">
              <div className="mb-2 flex items-center gap-1">
                <VerticalSelector
                  value={selectedLetter ? availableLetters.indexOf(selectedLetter) + 1 : 0}
                  min={0}
                  max={availableLetters.length}
                  onChange={(index) => {
                    if (index === 0) {
                      setSelectedLetter('');
                    } else {
                      setSelectedLetter(availableLetters[index - 1]);
                    }
                  }}
                  outlineColor={selectedLetter ? (isVowel(selectedLetter) ? '#3b82f6' : '#ef4444') : '#000000'}
                  className="flex-shrink-0 scale-90 -ml-1"
                />
                <div className="w-10 h-8 rounded border-2 bg-white flex items-center justify-center font-bold text-xl" 
                     style={{ 
                       borderColor: selectedLetter ? (isVowel(selectedLetter) ? '#3b82f6' : '#ef4444') : '#9ca3af',
                       color: selectedLetter ? (isVowel(selectedLetter) ? '#3b82f6' : '#ef4444') : '#9ca3af'
                     }}>
                  {selectedLetter || '?'}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1 max-h-32 overflow-y-auto">
                {[null, ...availableLetters].map((letter, index) => (
                  letter === null ? (
                    <div
                      key="empty-slot"
                      className="h-7 border-2 border-gray-300 rounded-md bg-white/40"
                      title={t.emptySlot}
                    />
                  ) : (
                    <Button
                      key={`${letter}-${index}`}
                      variant="outline"
                      className={`h-7 text-[11px] font-bold bg-white px-0 min-w-0 ${isVowel(letter) ? 'border-blue-500' : 'border-red-500'} ${selectedLetter === letter ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => { setSelectedLetter(letter); handleKeyPress(letter); }}
                    >
                      {letter}
                    </Button>
                  )
                ))}
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Canvas Controls */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/80 mb-1 uppercase tracking-wide">
            {t.canvasControls}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="p-1 space-y-1">
              <Button
                onClick={() => setDebugMode(!debugMode)}
                variant="outline"
                size="sm"
                className="w-full h-8 text-sm"
              >
                {debugMode ? "✓ Debug" : "Debug"}
              </Button>
              <Button
                onClick={handleClearCanvas}
                variant="outline"
                size="sm"
                className="w-full h-8 text-sm"
              >
                {t.clear}
              </Button>
              <Button
                onClick={handleUndo}
                variant="outline"
                size="sm"
                className="w-full h-8 text-sm"
              >
                {t.undo}
              </Button>
              <Button
                onClick={handleSave}
                variant="outline"
                size="sm"
                className="w-full h-8 text-sm"
              >
                {t.save}
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Keyboard Toggle */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/80 mb-1 uppercase tracking-wide">
            {t.keyboard}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="p-1">
              <Button
                onClick={handleKeyboardToggle}
                variant={showKeyboard ? "default" : "outline"}
                size="sm"
                className={`w-full justify-start gap-2 h-8 text-sm ${
                  showKeyboard 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-background/50 hover:bg-background/80"
                }`}
                style={{ minWidth: `${Math.max(120, sidebarWidth - 40)}px` }}
              >
                <Keyboard className="w-4 h-4" />
                <span className="truncate">{showKeyboard ? t.hide : t.keyboard}</span>
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </div>
      
      {/* Resize Handle */}
      <div 
        className="w-1 bg-border hover:bg-primary/50 cursor-col-resize transition-colors group relative"
        onMouseDown={(e) => {
          e.preventDefault();
          const startX = e.clientX;
          const startWidth = sidebarWidth;
          
          const handleMouseMove = (e: MouseEvent) => {
            const diff = e.clientX - startX;
            const newWidth = Math.max(200, Math.min(600, startWidth + diff));
            setSidebarWidth(newWidth);
          };
          
          const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
          };
          
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        }}
      >
        <div className="absolute inset-y-0 -left-1 -right-1 bg-transparent" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-muted-foreground/30 rounded group-hover:bg-primary/70 transition-colors" />
      </div>
    </div>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <Sidebar 
          className="border-r"
          style={{ width: sidebarWidth }}
        >
          <SidebarContent>
            {renderSidebarContent()}
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-background/95 backdrop-blur-sm border-b border-border/40 p-3 h-12">
            <div className="flex justify-between items-center h-full">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="hover:bg-muted h-6 w-6" />
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <img 
                      src={numLitLogo}
                      alt="NumLit Logo" 
                      className="h-6 w-auto object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-primary">{t.title}</h2>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/')}
                  className="ml-2 h-6 px-2"
                  title="Înapoi la meniul principal"
                >
                  <Home className="w-3 h-3" />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Info className="w-4 h-4" />
                      {t.instructions}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-white z-[60]">
                    <DialogHeader>
                      <DialogTitle className="text-center text-xl">{t.howToPlayTitle}</DialogTitle>
                      <DialogDescription className="text-center text-muted-foreground">
                        {t.howToPlay}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex items-center gap-4">
                <Timer 
                  isRunning={isTimerRunning}
                  className="scale-75 sm:scale-100"
                />
                <ZoomControls 
                  zoom={zoom} 
                  onZoomChange={setZoom}
                  className="hidden sm:flex"
                />
              </div>
            </div>
          </div>

          {/* Main Content - Full-screen Canvas */}
          <div className="relative flex-1 flex flex-col h-full">
            <div className="flex-1 relative bg-white overflow-hidden">
              <canvas 
                ref={canvasRef}
                className="block z-0"
                style={{ 
                  width: '100%',
                  height: '100%',
                  touchAction: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Literacy Keyboard Overlay */}
        {showKeyboard && (
          <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-auto max-h-64">
            <LiteracyKeyboard
              onKeyPress={handleKeyPress}
              onClose={() => setShowKeyboard(false)}
              selectedLanguage={language}
              onLanguageChange={(lang) => setLanguage(lang as LanguageKey)}
              currentLanguage={language}
              className="border-t-4 border-primary/20 bg-white/95 backdrop-blur-sm shadow-2xl"
            />
          </div>
        )}
      </div>
    </SidebarProvider>
  );
};

export default TablaInteractiva;
