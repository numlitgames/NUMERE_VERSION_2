import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Volume2, Check, X, Trophy, Shuffle, ChevronLeft, ChevronRight, Info, Play, Pause, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { byCategory, WordEntry } from "@/lib/loadWords";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarProvider } from "@/components/ui/sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useI18n from "@/components/i18n/useI18n";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ZoomControls from "@/components/educational/ZoomControls";
import Timer from "@/components/educational/Timer";
import numLitLogo from "@/assets/numlit-logo.png";

const languages = [
  { code: 'ar', flag: '🇸🇦', name: 'العربية' },
  { code: 'bg', flag: '🇧🇬', name: 'Български' },
  { code: 'cz', flag: '🇨🇿', name: 'Čeština' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'it', flag: '🇮🇹', name: 'Italiano' },
  { code: 'hu', flag: '🇭🇺', name: 'Magyar' },
  { code: 'nl', flag: '🇳🇱', name: 'Nederlands' },
  { code: 'pl', flag: '🇵🇱', name: 'Polski' },
  { code: 'pt', flag: '🇵🇹', name: 'Português' },
  { code: 'ro', flag: '🇷🇴', name: 'Română' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
  { code: 'tr', flag: '🇹🇷', name: 'Türkçe' }
];

// Obiecte specifice pentru fiecare culoare ROGVAIV
const colorSpecificObjects = {
  red: [
    { id: 'apple', name: { ro: 'măr', en: 'apple', de: 'Apfel', fr: 'pomme', es: 'manzana', it: 'mela', pt: 'maçã', ru: 'яблоко', pl: 'jabłko', cz: 'jablko', hu: 'alma', bg: 'ябълка', tr: 'elma', nl: 'appel', ar: 'تفاحة' }, image: '/images/fruits/fruit_apple_001.png', emoji: '🍎' },
    { id: 'strawberry', name: { ro: 'căpșună', en: 'strawberry', de: 'Erdbeere', fr: 'fraise', es: 'fresa', it: 'fragola', pt: 'morango', ru: 'клубника', pl: 'truskawka', cz: 'jahoda', hu: 'eper', bg: 'ягода', tr: 'çilek', nl: 'aardbei', ar: 'فراولة' }, image: '/images/fruits/fruit_strawberry_004.png', emoji: '🍓' },
    { id: 'heart', name: { ro: 'inimă', en: 'heart', de: 'Herz', fr: 'cœur', es: 'corazón', it: 'cuore', pt: 'coração', ru: 'сердце', pl: 'serce', cz: 'srdce', hu: 'szív', bg: 'сърце', tr: 'kalp', nl: 'hart', ar: 'قلب' }, emoji: '❤️', useEmoji: true }
  ],
  orange: [
    { id: 'orange', name: { ro: 'portocală', en: 'orange', de: 'Orange', fr: 'orange', es: 'naranja', it: 'arancia', pt: 'laranja', ru: 'апельсин', pl: 'pomarańcza', cz: 'pomeranč', hu: 'narancs', bg: 'портокал', tr: 'portakal', nl: 'sinaasappel', ar: 'برتقالة' }, image: '/images/fruits/fruit_orange_001.png', emoji: '🍊' },
    { id: 'pumpkin', name: { ro: 'dovleac', en: 'pumpkin', de: 'Kürbis', fr: 'citrouille', es: 'calabaza', it: 'zucca', pt: 'abóbora', ru: 'тыква', pl: 'dynia', cz: 'dýně', hu: 'sütőtök', bg: 'тиква', tr: 'balkabağı', nl: 'pompoen', ar: 'يقطين' }, emoji: '🎃', useEmoji: true },
    { id: 'carrot', name: { ro: 'morcov', en: 'carrot', de: 'Karotte', fr: 'carotte', es: 'zanahoria', it: 'carota', pt: 'cenoura', ru: 'морковь', pl: 'marchew', cz: 'mrkev', hu: 'sárgarépa', bg: 'морков', tr: 'havuç', nl: 'wortel', ar: 'جزرة' }, image: '/images/vegetables/vegetable_carrot_001.png', emoji: '🥕' }
  ],
  yellow: [
    { id: 'sun', name: { ro: 'soare', en: 'sun', de: 'Sonne', fr: 'soleil', es: 'sol', it: 'sole', pt: 'sol', ru: 'солнце', pl: 'słońce', cz: 'slunce', hu: 'nap', bg: 'слънце', tr: 'güneş', nl: 'zon', ar: 'شمس' }, image: '/images/nature/nature_sun_003.png', emoji: '☀️' },
    { id: 'banana', name: { ro: 'banană', en: 'banana', de: 'Banane', fr: 'banane', es: 'plátano', it: 'banana', pt: 'banana', ru: 'банан', pl: 'banan', cz: 'banán', hu: 'banán', bg: 'банан', tr: 'muz', nl: 'banaan', ar: 'موز' }, image: '/images/fruits/fruit_banana_001.png', emoji: '🍌' },
    { id: 'lemon', name: { ro: 'lămâie', en: 'lemon', de: 'Zitrone', fr: 'citron', es: 'limón', it: 'limone', pt: 'limão', ru: 'лимон', pl: 'cytryna', cz: 'citron', hu: 'citrom', bg: 'лимон', tr: 'limon', nl: 'citroen', ar: 'ليمون' }, emoji: '🍋', useEmoji: true }
  ],
  green: [
    { id: 'forest', name: { ro: 'pădure', en: 'forest', de: 'Wald', fr: 'forêt', es: 'bosque', it: 'foresta', pt: 'floresta', ru: 'лес', pl: 'las', cz: 'les', hu: 'erdő', bg: 'гора', tr: 'orman', nl: 'bos', ar: 'غابة' }, emoji: '🌲', useEmoji: true },
    { id: 'grass', name: { ro: 'iarbă', en: 'grass', de: 'Gras', fr: 'herbe', es: 'hierba', it: 'erba', pt: 'grama', ru: 'трава', pl: 'trawa', cz: 'tráva', hu: 'fű', bg: 'трева', tr: 'çim', nl: 'gras', ar: 'عشب' }, emoji: '🌿', useEmoji: true },
    { id: 'cucumber', name: { ro: 'castravete', en: 'cucumber', de: 'Gurke', fr: 'concombre', es: 'pepino', it: 'cetriolo', pt: 'pepino', ru: 'огурец', pl: 'ogórek', cz: 'okurka', hu: 'uborka', bg: 'краставица', tr: 'salatalık', nl: 'komkommer', ar: 'خيار' }, image: '/images/vegetables/vegetable_cucumber_005.png', emoji: '🥒' }
  ],
  blue: [
    { id: 'sea', name: { ro: 'mare', en: 'sea', de: 'Meer', fr: 'mer', es: 'mar', it: 'mare', pt: 'mar', ru: 'море', pl: 'morze', cz: 'moře', hu: 'tenger', bg: 'море', tr: 'deniz', nl: 'zee', ar: 'بحر' }, emoji: '🌊', useEmoji: true },
    { id: 'sky', name: { ro: 'cer', en: 'sky', de: 'Himmel', fr: 'ciel', es: 'cielo', it: 'cielo', pt: 'céu', ru: 'небо', pl: 'niebo', cz: 'nebe', hu: 'ég', bg: 'небе', tr: 'gökyüzü', nl: 'lucht', ar: 'سماء' }, emoji: '☁️', useEmoji: true },
    { id: 'pool', name: { ro: 'piscină', en: 'pool', de: 'Schwimmbad', fr: 'piscine', es: 'piscina', it: 'piscina', pt: 'piscina', ru: 'бассейн', pl: 'basen', cz: 'bazén', hu: 'medence', bg: 'басейн', tr: 'havuz', nl: 'zwembad', ar: 'مسبح' }, emoji: '🏊', useEmoji: true }
  ],
  indigo: [
    { id: 'grapes', name: { ro: 'struguri', en: 'grapes', de: 'Trauben', fr: 'raisins', es: 'uvas', it: 'uva', pt: 'uvas', ru: 'виноград', pl: 'winogrona', cz: 'hrozny', hu: 'szőlő', bg: 'грозде', tr: 'üzüm', nl: 'druiven', ar: 'عنب' }, image: '/images/fruits/fruit_grapes_005.png', emoji: '🍇' },
    { id: 'night', name: { ro: 'noapte', en: 'night', de: 'Nacht', fr: 'nuit', es: 'noche', it: 'notte', pt: 'noite', ru: 'ночь', pl: 'noc', cz: 'noc', hu: 'éjszaka', bg: 'нощ', tr: 'gece', nl: 'nacht', ar: 'ليل' }, emoji: '🌙', useEmoji: true },
    { id: 'jeans', name: { ro: 'blugi', en: 'jeans', de: 'Jeans', fr: 'jean', es: 'vaqueros', it: 'jeans', pt: 'calça jeans', ru: 'джинсы', pl: 'dżinsy', cz: 'džíny', hu: 'farmer', bg: 'дънки', tr: 'kot pantolon', nl: 'spijkerbroek', ar: 'جينز' }, emoji: '👖', useEmoji: true }
  ],
  violet: [
    { id: 'eggplant', name: { ro: 'vânătă', en: 'eggplant', de: 'Aubergine', fr: 'aubergine', es: 'berenjena', it: 'melanzana', pt: 'berinjela', ru: 'баклажан', pl: 'bakłażan', cz: 'lilek', hu: 'padlizsán', bg: 'патладжан', tr: 'patlıcan', nl: 'aubergine', ar: 'باذنجان' }, emoji: '🍆', useEmoji: true },
    { id: 'flower', name: { ro: 'floare', en: 'flower', de: 'Blume', fr: 'fleur', es: 'flor', it: 'fiore', pt: 'flor', ru: 'цветок', pl: 'kwiat', cz: 'květina', hu: 'virág', bg: 'цвете', tr: 'çiçek', nl: 'bloem', ar: 'زهرة' }, image: '/images/nature/nature_flower_002.png', emoji: '🌸' },
    { id: 'butterfly', name: { ro: 'fluture', en: 'butterfly', de: 'Schmetterling', fr: 'papillon', es: 'mariposa', it: 'farfalla', pt: 'borboleta', ru: 'бабочка', pl: 'motyl', cz: 'motýl', hu: 'pillangó', bg: 'пеперуда', tr: 'kelebek', nl: 'vlinder', ar: 'فراشة' }, image: '/images/insects/insect_butterfly_001.png', emoji: '🦋' }
  ]
};

const colorMixing = {
  // Combinații primare (cele originale corecte)
  'red+yellow': { 
    result: 'orange', 
    name: { ro: 'portocaliu', en: 'orange', de: 'Orange', fr: 'orange', es: 'naranja', it: 'arancione', pt: 'laranja', ru: 'оранжевый', pl: 'pomarańczowy', cz: 'oranžový', hu: 'narancs', bg: 'оранжев', tr: 'turuncu', nl: 'oranje', ar: 'برتقالي' } 
  },
  'yellow+blue': { 
    result: 'green', 
    name: { ro: 'verde', en: 'green', de: 'Grün', fr: 'vert', es: 'verde', it: 'verde', pt: 'verde', ru: 'зелёный', pl: 'zielony', cz: 'zelený', hu: 'zöld', bg: 'зелен', tr: 'yeşil', nl: 'groen', ar: 'أخضر' } 
  },
  'red+blue': { 
    result: 'violet', 
    name: { ro: 'violet', en: 'violet', de: 'Violett', fr: 'violet', es: 'violeta', it: 'viola', pt: 'violeta', ru: 'фиолетовый', pl: 'fioletowy', cz: 'fialový', hu: 'lila', bg: 'виолетов', tr: 'mor', nl: 'violet', ar: 'بنفسجي' } 
  },
  
  // Combinații noi cerute de utilizator (realiste)
  'red+green': { 
    result: 'dark-brown', 
    name: { ro: 'maro închis', en: 'dark brown', de: 'Dunkelbraun', fr: 'marron foncé', es: 'marrón oscuro', it: 'marrone scuro', pt: 'marrom escuro', ru: 'тёмно-коричневый', pl: 'ciemnobrązowy', cz: 'tmavě hnědý', hu: 'sötétbarna', bg: 'тъмнокафяв', tr: 'koyu kahverengi', nl: 'donkerbruin', ar: 'بني غامق' } 
  },
  'orange+blue': { 
    result: 'brown', 
    name: { ro: 'maroniu', en: 'brown', de: 'Braun', fr: 'marron', es: 'marrón', it: 'marrone', pt: 'marrom', ru: 'коричневый', pl: 'brązowy', cz: 'hnědý', hu: 'barna', bg: 'кафяв', tr: 'kahverengi', nl: 'bruin', ar: 'بني' } 
  },
  'green+blue': { 
    result: 'turquoise', 
    name: { ro: 'turcoaz', en: 'turquoise', de: 'Türkis', fr: 'turquoise', es: 'turquesa', it: 'turchese', pt: 'turquesa', ru: 'бирюзовый', pl: 'turkusowy', cz: 'tyrkysový', hu: 'türkiz', bg: 'тюркоаз', tr: 'turkuaz', nl: 'turquoise', ar: 'فيروزي' } 
  },
  
  // Combinații cu portocaliu (cu restul culorilor)
  'red+orange': { result: 'red', name: { ro: 'roșu', en: 'red', de: 'Rot', fr: 'rouge', es: 'rojo', it: 'rosso', pt: 'vermelho', ru: 'красный', pl: 'czerwony', cz: 'červený', hu: 'piros', bg: 'червен', tr: 'kırmızı', nl: 'rood', ar: 'أحمر' } },
  'orange+yellow': { result: 'orange', name: { ro: 'portocaliu', en: 'orange', de: 'Orange', fr: 'orange', es: 'naranja', it: 'arancione', pt: 'laranja', ru: 'оранжевый', pl: 'pomarańczowy', cz: 'oranžový', hu: 'narancs', bg: 'оранжев', tr: 'turuncu', nl: 'oranje', ar: 'برتقالي' } },
  'orange+green': { result: 'yellow', name: { ro: 'galben', en: 'yellow', de: 'Gelb', fr: 'jaune', es: 'amarillo', it: 'giallo', pt: 'amarelo', ru: 'жёлтый', pl: 'żółty', cz: 'žlutý', hu: 'sárga', bg: 'жълт', tr: 'sarı', nl: 'geel', ar: 'أصفر' } },
  'orange+indigo': { result: 'violet', name: { ro: 'violet', en: 'violet', de: 'Violett', fr: 'violet', es: 'violeta', it: 'viola', pt: 'violeta', ru: 'фиолетовый', pl: 'fioletowy', cz: 'fialový', hu: 'lila', bg: 'виолетов', tr: 'mor', nl: 'violet', ar: 'بنفسجي' } },
  'orange+violet': { result: 'red', name: { ro: 'roșu', en: 'red', de: 'Rot', fr: 'rouge', es: 'rojo', it: 'rosso', pt: 'vermelho', ru: 'красный', pl: 'czerwony', cz: 'červený', hu: 'piros', bg: 'червен', tr: 'kırmızı', nl: 'rood', ar: 'أحمر' } },
  
  // Combinații cu verde (cu restul culorilor)
  'yellow+green': { result: 'green', name: { ro: 'verde', en: 'green', de: 'Grün', fr: 'vert', es: 'verde', it: 'verde', pt: 'verde', ru: 'зелёный', pl: 'zielony', cz: 'zelený', hu: 'zöld', bg: 'зелен', tr: 'yeşil', nl: 'groen', ar: 'أخضر' } },
  'green+indigo': { result: 'blue', name: { ro: 'albastru', en: 'blue', de: 'Blau', fr: 'bleu', es: 'azul', it: 'blu', pt: 'azul', ru: 'синий', pl: 'niebieski', cz: 'modrý', hu: 'kék', bg: 'син', tr: 'mavi', nl: 'blauw', ar: 'أزرق' } },
  'green+violet': { result: 'indigo', name: { ro: 'indigo', en: 'indigo', de: 'Indigo', fr: 'indigo', es: 'índigo', it: 'indaco', pt: 'índigo', ru: 'индиго', pl: 'indygo', cz: 'indigo', hu: 'indigó', bg: 'индиго', tr: 'çivit mavisi', nl: 'indigo', ar: 'نيلي' } },
  
  // Combinații cu indigo
  'red+indigo': { result: 'violet', name: { ro: 'violet', en: 'violet', de: 'Violett', fr: 'violet', es: 'violeta', it: 'viola', pt: 'violeta', ru: 'фиолетовый', pl: 'fioletowy', cz: 'fialový', hu: 'lila', bg: 'виолетов', tr: 'mor', nl: 'violet', ar: 'بنفسجي' } },
  'yellow+indigo': { result: 'green', name: { ro: 'verde', en: 'green', de: 'Grün', fr: 'vert', es: 'verde', it: 'verde', pt: 'verde', ru: 'зелёный', pl: 'zielony', cz: 'zelený', hu: 'zöld', bg: 'зелен', tr: 'yeşil', nl: 'groen', ar: 'أخضر' } },
  'blue+indigo': { result: 'indigo', name: { ro: 'indigo', en: 'indigo', de: 'Indigo', fr: 'indigo', es: 'índigo', it: 'indaco', pt: 'índigo', ru: 'индиго', pl: 'indygo', cz: 'indigo', hu: 'indigó', bg: 'индиго', tr: 'çivit mavisi', nl: 'indigo', ar: 'نيلي' } },
  'indigo+violet': { result: 'violet', name: { ro: 'violet', en: 'violet', de: 'Violett', fr: 'violet', es: 'violeta', it: 'viola', pt: 'violeta', ru: 'фиолетовый', pl: 'fioletowy', cz: 'fialový', hu: 'lila', bg: 'виолетов', tr: 'mor', nl: 'violet', ar: 'بنفسجي' } },
  
  // Combinații cu violet
  'red+violet': { result: 'red', name: { ro: 'roșu', en: 'red', de: 'Rot', fr: 'rouge', es: 'rojo', it: 'rosso', pt: 'vermelho', ru: 'красный', pl: 'czerwony', cz: 'červený', hu: 'piros', bg: 'червен', tr: 'kırmızı', nl: 'rood', ar: 'أحمر' } },
  'yellow+violet': { result: 'orange', name: { ro: 'portocaliu', en: 'orange', de: 'Orange', fr: 'orange', es: 'naranja', it: 'arancione', pt: 'laranja', ru: 'оранжевый', pl: 'pomarańczowy', cz: 'oranžový', hu: 'narancs', bg: 'оранжев', tr: 'turuncu', nl: 'oranje', ar: 'برتقالي' } },
  'blue+violet': { result: 'violet', name: { ro: 'violet', en: 'violet', de: 'Violett', fr: 'violet', es: 'violeta', it: 'viola', pt: 'violeta', ru: 'фиолетовый', pl: 'fioletowy', cz: 'fialový', hu: 'lila', bg: 'виолетов', tr: 'mor', nl: 'violet', ar: 'بنفسجي' } }
};

const primaryColors = ['red', 'yellow', 'blue'];

const gameTranslations: Record<string, any> = {
  ro: {
    title: "Învață Culorile ROGVAIV",
    back: "Acasă",
    language: "Limbă",
    gameMode: "Mod Joc",
    learn: "Învață",
    quiz: "Quiz",
    progress: "Progres",
    instructions: "Instrucțiuni",
    howToPlay: "Cum să joci",
    learningModeDesc: "Explorează culorile ROGVAIV în ordine. Folosește butoanele de navigare pentru a trece prin culori.",
    quizModeDesc: "Testează-ți cunoștințele! Alege culoarea corectă din cele trei opțiuni afișate.",
    previous: "Precedenta",
    next: "Următoarea",
    random: "Aleatoriu",
    listen: "Ascultă",
    score: "Scor",
    whatColorIs: "Ce culoare este aceasta?",
    correct: "Corect! Bravo! 🎉",
    tryAgain: "Încearcă din nou! 💪",
    level: "Nivel",
    level1: "Învăț culorile",
    level2: "Alege culoarea",
    level3: "Combin culori",
    dragColorHere: "Trage culoarea aici",
    dragColorToObject: "Trage culoarea corectă peste obiect",
    wellDone: "Bravo! Ai colorat corect!",
    tryAnotherColor: "Încearcă altă culoare",
    mixColors: "Amestecă culorile",
    whatColorDoYouGet: "Ce culoare obții?",
    primary: "Culori primare",
    secondary: "Culori secundare",
    mixInstruction: "Apasă pe două culori pentru a le amesteca",
    reset: "Resetează",
    congratulations: "Felicitări! Ai terminat!",
    dragColorToCanvas: "Trage 2 culori în zona de mai jos",
    dropHere: "Trage culorile aici",
    dragTwoColorsToSquares: "Trage 2 culori în pătratele de mai jos",
    overlapAndDiscover: "Suprapune pătratele și află culoarea corectă!",
    shuffleColors: "Amestecă culorile"
  },
  en: {
    title: "Learn ROYGBIV Colors",
    back: "Home",
    language: "Language",
    gameMode: "Game Mode",
    learn: "Learn",
    quiz: "Quiz",
    progress: "Progress",
    instructions: "Instructions",
    howToPlay: "How to play",
    learningModeDesc: "Explore ROYGBIV colors in order. Use navigation buttons to go through colors.",
    quizModeDesc: "Test your knowledge! Choose the correct color from the three options displayed.",
    previous: "Previous",
    next: "Next",
    random: "Random",
    listen: "Listen",
    score: "Score",
    whatColorIs: "What color is this?",
    correct: "Correct! Great job! 🎉",
    tryAgain: "Try again! 💪",
    level: "Level",
    level1: "Learn colors",
    level2: "Choose color",
    level3: "Mix colors",
    dragColorHere: "Drag color here",
    dragColorToObject: "Drag the correct color to the object",
    wellDone: "Well done! Colored correctly!",
    tryAnotherColor: "Try another color",
    mixColors: "Mix colors",
    whatColorDoYouGet: "What color do you get?",
    primary: "Primary colors",
    secondary: "Secondary colors",
    mixInstruction: "Click on two colors to mix them",
    reset: "Reset",
    congratulations: "Congratulations! You finished!",
    dragColorToCanvas: "Drag 2 colors to the area below",
    dropHere: "Drag colors here",
    dragTwoColorsToSquares: "Drag 2 colors into the squares below",
    overlapAndDiscover: "Overlap the squares and discover the correct color!",
    shuffleColors: "Shuffle colors"
  },
  de: {
    title: "Lerne ROYGBIV Farben",
    back: "Startseite",
    language: "Sprache",
    gameMode: "Spielmodus",
    learn: "Lernen",
    quiz: "Quiz",
    progress: "Fortschritt",
    instructions: "Anleitung",
    howToPlay: "Wie man spielt",
    learningModeDesc: "Erkunde ROYGBIV-Farben in Reihenfolge. Verwende die Navigationstasten, um durch die Farben zu gehen.",
    quizModeDesc: "Teste dein Wissen! Wähle die richtige Farbe aus den drei angezeigten Optionen.",
    previous: "Vorherige",
    next: "Nächste",
    random: "Zufällig",
    listen: "Hören",
    score: "Punktzahl",
    whatColorIs: "Welche Farbe ist das?",
    correct: "Richtig! Großartig! 🎉",
    tryAgain: "Versuche es nochmal! 💪",
    level: "Stufe",
    level1: "Farben lernen",
    level2: "Farbe wählen",
    level3: "Farben mischen",
    dragColorHere: "Farbe hierher ziehen",
    dragColorToObject: "Ziehe die richtige Farbe auf das Objekt",
    wellDone: "Gut gemacht! Richtig gefärbt!",
    tryAnotherColor: "Versuche eine andere Farbe",
    mixColors: "Farben mischen",
    whatColorDoYouGet: "Welche Farbe bekommst du?",
    primary: "Primärfarben",
    secondary: "Sekundärfarben",
    mixInstruction: "Klicke auf zwei Farben, um sie zu mischen",
    reset: "Zurücksetzen",
    congratulations: "Herzlichen Glückwunsch! Du hast es geschafft!",
    dragColorToCanvas: "Ziehe 2 Farben in den Bereich unten",
    dropHere: "Ziehe Farben hierher",
    dragTwoColorsToSquares: "Ziehe 2 Farben in die Quadrate unten",
    overlapAndDiscover: "Überlappen Sie die Quadrate und entdecken Sie die richtige Farbe!",
    shuffleColors: "Farben mischen"
  },
  fr: {
    title: "Apprendre les Couleurs ROYGBIV",
    back: "Accueil",
    language: "Langue",
    gameMode: "Mode de Jeu",
    learn: "Apprendre",
    quiz: "Quiz",
    progress: "Progrès",
    instructions: "Instructions",
    howToPlay: "Comment jouer",
    learningModeDesc: "Explorez les couleurs ROYGBIV dans l'ordre. Utilisez les boutons de navigation pour parcourir les couleurs.",
    quizModeDesc: "Testez vos connaissances! Choisissez la bonne couleur parmi les trois options affichées.",
    previous: "Précédent",
    next: "Suivant",
    random: "Aléatoire",
    listen: "Écouter",
    score: "Score",
    whatColorIs: "Quelle couleur est-ce?",
    correct: "Correct! Bravo! 🎉",
    tryAgain: "Réessayez! 💪",
    level: "Niveau",
    level1: "Apprendre les couleurs",
    level2: "Choisir la couleur",
    level3: "Mélanger les couleurs",
    dragColorHere: "Faites glisser la couleur ici",
    dragColorToObject: "Faites glisser la bonne couleur sur l'objet",
    wellDone: "Bien joué! Coloré correctement!",
    tryAnotherColor: "Essayez une autre couleur",
    mixColors: "Mélanger les couleurs",
    whatColorDoYouGet: "Quelle couleur obtenez-vous?",
    primary: "Couleurs primaires",
    secondary: "Couleurs secondaires",
    mixInstruction: "Cliquez sur deux couleurs pour les mélanger",
    reset: "Réinitialiser",
    congratulations: "Félicitations! Vous avez terminé!",
    dragColorToCanvas: "Faites glisser 2 couleurs vers la zone ci-dessous",
    dropHere: "Déposez les couleurs ici",
    dragTwoColorsToSquares: "Faites glisser 2 couleurs dans les carrés ci-dessous",
    overlapAndDiscover: "Superposez les carrés et découvrez la bonne couleur!",
    shuffleColors: "Mélanger les couleurs"
  },
  es: {
    title: "Aprender Colores ROYGBIV",
    back: "Inicio",
    language: "Idioma",
    gameMode: "Modo de Juego",
    learn: "Aprender",
    quiz: "Quiz",
    progress: "Progreso",
    instructions: "Instrucciones",
    howToPlay: "Cómo jugar",
    learningModeDesc: "Explora los colores ROYGBIV en orden. Usa los botones de navegación para recorrer los colores.",
    quizModeDesc: "¡Pon a prueba tus conocimientos! Elige el color correcto de las tres opciones mostradas.",
    previous: "Anterior",
    next: "Siguiente",
    random: "Aleatorio",
    listen: "Escuchar",
    score: "Puntuación",
    whatColorIs: "¿Qué color es este?",
    correct: "¡Correcto! ¡Bravo! 🎉",
    tryAgain: "¡Inténtalo de nuevo! 💪",
    level: "Nivel",
    level1: "Aprender colores",
    level2: "Elegir color",
    level3: "Mezclar colores",
    dragColorHere: "Arrastra el color aquí",
    dragColorToObject: "Arrastra el color correcto sobre el objeto",
    wellDone: "¡Bien hecho! ¡Coloreado correctamente!",
    tryAnotherColor: "Prueba otro color",
    mixColors: "Mezclar colores",
    whatColorDoYouGet: "¿Qué color obtienes?",
    primary: "Colores primarios",
    secondary: "Colores secundarios",
    mixInstruction: "Haz clic en dos colores para mezclarlos",
    reset: "Restablecer",
    congratulations: "¡Felicitaciones! ¡Has terminado!",
    dragColorToCanvas: "Arrastra 2 colores al área de abajo",
    dropHere: "Arrastra los colores aquí",
    dragTwoColorsToSquares: "Arrastra 2 colores a los cuadrados de abajo",
    overlapAndDiscover: "Superpón los cuadrados y descubre el color correcto!",
    shuffleColors: "Mezclar colores"
  },
  it: {
    title: "Impara i Colori ROYGBIV",
    back: "Home",
    language: "Lingua",
    gameMode: "Modalità di Gioco",
    learn: "Impara",
    quiz: "Quiz",
    progress: "Progresso",
    instructions: "Istruzioni",
    howToPlay: "Come giocare",
    learningModeDesc: "Esplora i colori ROYGBIV in ordine. Usa i pulsanti di navigazione per passare attraverso i colori.",
    quizModeDesc: "Metti alla prova le tue conoscenze! Scegli il colore corretto tra le tre opzioni visualizzate.",
    previous: "Precedente",
    next: "Successivo",
    random: "Casuale",
    listen: "Ascolta",
    score: "Punteggio",
    whatColorIs: "Che colore è questo?",
    correct: "Corretto! Ottimo lavoro! 🎉",
    tryAgain: "Riprova! 💪",
    level: "Livello",
    level1: "Impara i colori",
    level2: "Scegli il colore",
    level3: "Mescola i colori",
    dragColorHere: "Trascina il colore qui",
    dragColorToObject: "Trascina il colore corretto sull'oggetto",
    wellDone: "Ben fatto! Colorato correttamente!",
    tryAnotherColor: "Prova un altro colore",
    mixColors: "Mescola i colori",
    whatColorDoYouGet: "Che colore ottieni?",
    primary: "Colori primari",
    secondary: "Colori secondari",
    mixInstruction: "Fai clic su due colori per mescolarli",
    reset: "Reimposta",
    congratulations: "Congratulazioni! Hai finito!",
    dragColorToCanvas: "Trascina 2 colori nell'area sottostante",
    dropHere: "Trascina i colori qui",
    dragTwoColorsToSquares: "Trascina 2 colori nei quadrati qui sotto",
    overlapAndDiscover: "Sovrapponi i quadrati e scopri il colore corretto!",
    shuffleColors: "Mescola i colori"
  },
  pt: {
    title: "Aprenda as Cores ROYGBIV",
    back: "Início",
    language: "Idioma",
    gameMode: "Modo de Jogo",
    learn: "Aprender",
    quiz: "Quiz",
    progress: "Progresso",
    instructions: "Instruções",
    howToPlay: "Como jogar",
    learningModeDesc: "Explore as cores ROYGBIV em ordem. Use os botões de navegação para percorrer as cores.",
    quizModeDesc: "Teste seus conhecimentos! Escolha a cor correta entre as três opções exibidas.",
    previous: "Anterior",
    next: "Próximo",
    random: "Aleatório",
    listen: "Ouvir",
    score: "Pontuação",
    whatColorIs: "Que cor é esta?",
    correct: "Correto! Ótimo trabalho! 🎉",
    tryAgain: "Tente novamente! 💪",
    level: "Nível",
    level1: "Aprender cores",
    level2: "Escolher cor",
    level3: "Misturar cores",
    dragColorHere: "Arraste a cor aqui",
    dragColorToObject: "Arraste a cor correta para o objeto",
    wellDone: "Muito bem! Colorido corretamente!",
    tryAnotherColor: "Tente outra cor",
    mixColors: "Misturar cores",
    whatColorDoYouGet: "Que cor você obtém?",
    primary: "Cores primárias",
    secondary: "Cores secundárias",
    mixInstruction: "Clique em duas cores para misturá-las",
    reset: "Redefinir",
    congratulations: "Parabéns! Você terminou!",
    dragColorToCanvas: "Arraste 2 cores para a área abaixo",
    dropHere: "Arraste as cores aqui",
    dragTwoColorsToSquares: "Arraste 2 cores para os quadrados abaixo",
    overlapAndDiscover: "Sobreponha os quadrados e descubra a cor correta!",
    shuffleColors: "Misturar cores"
  },
  ru: {
    title: "Изучай Цвета ROYGBIV",
    back: "Главная",
    language: "Язык",
    gameMode: "Режим Игры",
    learn: "Учить",
    quiz: "Викторина",
    progress: "Прогресс",
    instructions: "Инструкции",
    howToPlay: "Как играть",
    learningModeDesc: "Изучайте цвета ROYGBIV по порядку. Используйте кнопки навигации для перехода между цветами.",
    quizModeDesc: "Проверьте свои знания! Выберите правильный цвет из трех предложенных вариантов.",
    previous: "Предыдущий",
    next: "Следующий",
    random: "Случайный",
    listen: "Слушать",
    score: "Счёт",
    whatColorIs: "Какой это цвет?",
    correct: "Правильно! Отличная работа! 🎉",
    tryAgain: "Попробуйте ещё! 💪",
    level: "Уровень",
    level1: "Учу цвета",
    level2: "Выбираю цвет",
    level3: "Смешиваю цвета",
    dragColorHere: "Перетащите цвет сюда",
    dragColorToObject: "Перетащите правильный цвет на объект",
    wellDone: "Отлично! Раскрашено правильно!",
    tryAnotherColor: "Попробуйте другой цвет",
    mixColors: "Смешивайте цвета",
    whatColorDoYouGet: "Какой цвет получается?",
    primary: "Основные цвета",
    secondary: "Вторичные цвета",
    mixInstruction: "Нажмите на два цвета, чтобы смешать их",
    reset: "Сбросить",
    congratulations: "Поздравляем! Вы закончили!",
    dragColorToCanvas: "Перетащите 2 цвета в область ниже",
    dropHere: "Перетащите цвета сюда",
    dragTwoColorsToSquares: "Перетащите 2 цвета в квадраты ниже",
    overlapAndDiscover: "Наложите квадраты и найдите правильный цвет!",
    shuffleColors: "Перемешать цвета"
  },
  pl: {
    title: "Ucz się Kolorów ROYGBIV",
    back: "Start",
    language: "Język",
    gameMode: "Tryb Gry",
    learn: "Ucz się",
    quiz: "Quiz",
    progress: "Postęp",
    instructions: "Instrukcje",
    howToPlay: "Jak grać",
    learningModeDesc: "Odkrywaj kolory ROYGBIV w kolejności. Użyj przycisków nawigacji, aby przejść przez kolory.",
    quizModeDesc: "Sprawdź swoją wiedzę! Wybierz właściwy kolor spośród trzech wyświetlonych opcji.",
    previous: "Poprzedni",
    next: "Następny",
    random: "Losowy",
    listen: "Słuchaj",
    score: "Wynik",
    whatColorIs: "Jaki to kolor?",
    correct: "Poprawnie! Świetna robota! 🎉",
    tryAgain: "Spróbuj ponownie! 💪",
    level: "Poziom",
    level1: "Uczę się kolorów",
    level2: "Wybieram kolor",
    level3: "Mieszam kolory",
    dragColorHere: "Przeciągnij kolor tutaj",
    dragColorToObject: "Przeciągnij właściwy kolor na obiekt",
    wellDone: "Świetnie! Pokolorowane prawidłowo!",
    tryAnotherColor: "Spróbuj innego koloru",
    mixColors: "Mieszaj kolory",
    whatColorDoYouGet: "Jaki kolor otrzymujesz?",
    primary: "Kolory podstawowe",
    secondary: "Kolory wtórne",
    mixInstruction: "Kliknij dwa kolory, aby je zmieszać",
    reset: "Resetuj",
    congratulations: "Gratulacje! Ukończyłeś!",
    dragColorToCanvas: "Przeciągnij 2 kolory do obszaru poniżej",
    dropHere: "Przeciągnij kolory tutaj",
    dragTwoColorsToSquares: "Przeciągnij 2 kolory do kwadratów poniżej",
    overlapAndDiscover: "Nałóż kwadraty i odkryj prawidłowy kolor!",
    shuffleColors: "Wymieszaj kolory"
  },
  cz: {
    title: "Uč se Barvy ROYGBIV",
    back: "Domů",
    language: "Jazyk",
    gameMode: "Herní Režim",
    learn: "Učit se",
    quiz: "Kvíz",
    progress: "Pokrok",
    instructions: "Instrukce",
    howToPlay: "Jak hrát",
    learningModeDesc: "Prozkoumejte barvy ROYGBIV v pořadí. Použijte navigační tlačítka k procházení barev.",
    quizModeDesc: "Otestujte své znalosti! Vyberte správnou barvu ze tří zobrazených možností.",
    previous: "Předchozí",
    next: "Další",
    random: "Náhodný",
    listen: "Poslouchat",
    score: "Skóre",
    whatColorIs: "Jaká je to barva?",
    correct: "Správně! Skvělá práce! 🎉",
    tryAgain: "Zkuste to znovu! 💪",
    level: "Úroveň",
    level1: "Učím se barvy",
    level2: "Vyber barvu",
    level3: "Míchám barvy",
    dragColorHere: "Přetáhněte barvu sem",
    dragColorToObject: "Přetáhněte správnou barvu na objekt",
    wellDone: "Skvěle! Správně obarveno!",
    tryAnotherColor: "Zkuste jinou barvu",
    mixColors: "Míchejte barvy",
    whatColorDoYouGet: "Jakou barvu získáte?",
    primary: "Primární barvy",
    secondary: "Sekundární barvy",
    mixInstruction: "Klikněte na dvě barvy a smíchejte je",
    reset: "Resetovat",
    congratulations: "Gratulujeme! Dokončili jste!",
    dragColorToCanvas: "Přetáhněte 2 barvy do oblasti níže",
    dropHere: "Přetáhněte barvy sem",
    dragTwoColorsToSquares: "Přetáhněte 2 barvy do čtverců níže",
    overlapAndDiscover: "Překryjte čtverce a objevte správnou barvu!",
    shuffleColors: "Zamíchat barvy"
  },
  hu: {
    title: "Tanuld a ROYGBIV Színeket",
    back: "Kezdőlap",
    language: "Nyelv",
    gameMode: "Játék Mód",
    learn: "Tanulás",
    quiz: "Kvíz",
    progress: "Haladás",
    instructions: "Utasítások",
    howToPlay: "Hogyan kell játszani",
    learningModeDesc: "Fedezd fel a ROYGBIV színeket sorrendben. Használd a navigációs gombokat a színek közötti mozgáshoz.",
    quizModeDesc: "Teszteld a tudásodat! Válaszd ki a helyes színt a három megjelenített lehetőség közül.",
    previous: "Előző",
    next: "Következő",
    random: "Véletlenszerű",
    listen: "Hallgass",
    score: "Pontszám",
    whatColorIs: "Milyen szín ez?",
    correct: "Helyes! Nagyszerű munka! 🎉",
    tryAgain: "Próbáld újra! 💪",
    level: "Szint",
    level1: "Tanulom a színeket",
    level2: "Válaszd ki a színt",
    level3: "Keverem a színeket",
    dragColorHere: "Húzd ide a színt",
    dragColorToObject: "Húzd a helyes színt az objektumra",
    wellDone: "Nagyszerű! Helyesen kiszíneztél!",
    tryAnotherColor: "Próbálj másik színt",
    mixColors: "Keverd a színeket",
    whatColorDoYouGet: "Milyen színt kapsz?",
    primary: "Elsődleges színek",
    secondary: "Másodlagos színek",
    mixInstruction: "Kattints két színre a keveréshez",
    reset: "Visszaállítás",
    congratulations: "Gratulálunk! Befejezted!",
    dragColorToCanvas: "Húzz 2 színt az alábbi területre",
    dropHere: "Húzd ide a színeket",
    dragTwoColorsToSquares: "Húzz 2 színt az alábbi négyzetekbe",
    overlapAndDiscover: "Fedd át a négyzeteket és fedezd fel a helyes színt!",
    shuffleColors: "Színek keverése"
  },
  bg: {
    title: "Научи Цветовете ROYGBIV",
    back: "Начало",
    language: "Език",
    gameMode: "Режим на Игра",
    learn: "Учене",
    quiz: "Тест",
    progress: "Прогрес",
    instructions: "Инструкции",
    howToPlay: "Как да играете",
    learningModeDesc: "Разгледайте цветовете ROYGBIV по ред. Използвайте бутоните за навигация, за да преминете през цветовете.",
    quizModeDesc: "Проверете знанията си! Изберете правилния цвят от трите показани опции.",
    previous: "Предишен",
    next: "Следващ",
    random: "Случаен",
    listen: "Слушай",
    score: "Резултат",
    whatColorIs: "Какъв цвят е това?",
    correct: "Правилно! Страхотна работа! 🎉",
    tryAgain: "Опитай отново! 💪",
    level: "Ниво",
    level1: "Уча цветовете",
    level2: "Избирам цвят",
    level3: "Смесвам цветове",
    dragColorHere: "Плъзнете цвета тук",
    dragColorToObject: "Плъзнете правилния цвят върху обекта",
    wellDone: "Чудесно! Оцветено правилно!",
    tryAnotherColor: "Опитайте друг цвят",
    mixColors: "Смесвайте цветове",
    whatColorDoYouGet: "Какъв цвят получавате?",
    primary: "Основни цветове",
    secondary: "Вторични цветове",
    mixInstruction: "Кликнете на два цвята, за да ги смесите",
    reset: "Нулиране",
    congratulations: "Поздравления! Завършихте!",
    dragColorToCanvas: "Плъзнете 2 цвята в областта отдолу",
    dropHere: "Плъзнете цветовете тук",
    dragTwoColorsToSquares: "Плъзнете 2 цвята в квадратите по-долу",
    overlapAndDiscover: "Припокрийте квадратите и открийте правилния цвят!",
    shuffleColors: "Размесване на цветове"
  },
  tr: {
    title: "ROYGBIV Renklerini Öğren",
    back: "Ana Sayfa",
    language: "Dil",
    gameMode: "Oyun Modu",
    learn: "Öğren",
    quiz: "Test",
    progress: "İlerleme",
    instructions: "Talimatlar",
    howToPlay: "Nasıl oynanır",
    learningModeDesc: "ROYGBIV renklerini sırayla keşfedin. Renkler arasında gezinmek için navigasyon düğmelerini kullanın.",
    quizModeDesc: "Bilginizi test edin! Gösterilen üç seçenek arasından doğru rengi seçin.",
    previous: "Önceki",
    next: "Sonraki",
    random: "Rastgele",
    listen: "Dinle",
    score: "Puan",
    whatColorIs: "Bu hangi renk?",
    correct: "Doğru! Harika iş! 🎉",
    tryAgain: "Tekrar deneyin! 💪",
    level: "Seviye",
    level1: "Renkleri öğreniyorum",
    level2: "Renk seç",
    level3: "Renkleri karıştır",
    dragColorHere: "Rengi buraya sürükleyin",
    dragColorToObject: "Doğru rengi nesnenin üzerine sürükleyin",
    wellDone: "Aferin! Doğru renklendirdin!",
    tryAnotherColor: "Başka renk deneyin",
    mixColors: "Renkleri karıştırın",
    whatColorDoYouGet: "Hangi rengi elde edersiniz?",
    primary: "Birincil renkler",
    secondary: "İkincil renkler",
    mixInstruction: "Karıştırmak için iki renge tıklayın",
    reset: "Sıfırla",
    congratulations: "Tebrikler! Bitirdin!",
    dragColorToCanvas: "2 rengi aşağıdaki alana sürükleyin",
    dropHere: "Renkleri buraya sürükleyin",
    dragTwoColorsToSquares: "Aşağıdaki karelere 2 renk sürükleyin",
    overlapAndDiscover: "Kareleri üst üste getirin ve doğru rengi keşfedin!",
    shuffleColors: "Renkleri karıştır"
  },
  nl: {
    title: "Leer ROYGBIV Kleuren",
    back: "Home",
    language: "Taal",
    gameMode: "Spelmodus",
    learn: "Leren",
    quiz: "Quiz",
    progress: "Voortgang",
    instructions: "Instructies",
    howToPlay: "Hoe te spelen",
    learningModeDesc: "Verken ROYGBIV-kleuren op volgorde. Gebruik de navigatieknoppen om door de kleuren te bladeren.",
    quizModeDesc: "Test je kennis! Kies de juiste kleur uit de drie weergegeven opties.",
    previous: "Vorige",
    next: "Volgende",
    random: "Willekeurig",
    listen: "Luisteren",
    score: "Score",
    whatColorIs: "Welke kleur is dit?",
    correct: "Juist! Goed gedaan! 🎉",
    tryAgain: "Probeer opnieuw! 💪",
    level: "Niveau",
    level1: "Kleuren leren",
    level2: "Kies kleur",
    level3: "Kleuren mengen",
    dragColorHere: "Sleep de kleur hierheen",
    dragColorToObject: "Sleep de juiste kleur naar het object",
    wellDone: "Goed gedaan! Correct ingekleurd!",
    tryAnotherColor: "Probeer een andere kleur",
    mixColors: "Kleuren mengen",
    whatColorDoYouGet: "Welke kleur krijg je?",
    primary: "Primaire kleuren",
    secondary: "Secundaire kleuren",
    mixInstruction: "Klik op twee kleuren om ze te mengen",
    reset: "Resetten",
    congratulations: "Gefeliciteerd! Je bent klaar!",
    dragColorToCanvas: "Sleep 2 kleuren naar het gebied hieronder",
    dropHere: "Sleep kleuren hier",
    dragTwoColorsToSquares: "Sleep 2 kleuren naar de vierkanten hieronder",
    overlapAndDiscover: "Overlap de vierkanten en ontdek de juiste kleur!",
    shuffleColors: "Kleuren mengen"
  },
  ar: {
    title: "تعلم ألوان قوس قزح",
    back: "الصفحة الرئيسية",
    language: "اللغة",
    gameMode: "وضع اللعبة",
    learn: "تعلم",
    quiz: "اختبار",
    progress: "التقدم",
    instructions: "التعليمات",
    howToPlay: "كيفية اللعب",
    learningModeDesc: "استكشف ألوان قوس قزح بالترتيب. استخدم أزرار التنقل للانتقال عبر الألوان.",
    quizModeDesc: "اختبر معرفتك! اختر اللون الصحيح من بين الخيارات الثلاثة المعروضة.",
    previous: "السابق",
    next: "التالي",
    random: "عشوائي",
    listen: "استمع",
    score: "النتيجة",
    whatColorIs: "ما هذا اللون؟",
    correct: "صحيح! عمل رائع! 🎉",
    tryAgain: "حاول مرة أخرى! 💪",
    level: "مستوى",
    level1: "تعلم الألوان",
    level2: "اختر اللون",
    level3: "امزج الألوان",
    dragColorHere: "اسحب اللون هنا",
    dragColorToObject: "اسحب اللون الصحيح إلى الكائن",
    wellDone: "أحسنت! تلوين صحيح!",
    tryAnotherColor: "جرب لونًا آخر",
    mixColors: "امزج الألوان",
    whatColorDoYouGet: "ما اللون الذي تحصل عليه؟",
    primary: "الألوان الأساسية",
    secondary: "الألوان الثانوية",
    mixInstruction: "انقر على لونين لمزجهما",
    reset: "إعادة تعيين",
    congratulations: "مبروك! لقد انتهيت!",
    dragColorToCanvas: "اسحب لونين إلى المنطقة أدناه",
    dropHere: "اسحب الألوان هنا",
    dragTwoColorsToSquares: "اسحب لونين إلى المربعات أدناه",
    overlapAndDiscover: "اجعل المربعات تتداخل واكتشف اللون الصحيح!",
    shuffleColors: "خلط الألوان"
  }
};

type Level = 1 | 2 | 3;
type GameMode = 'learning' | 'dragDrop' | 'colorMix' | 'quiz';

export default function Culori() {
  const navigate = useNavigate();
  const [gameMode, setGameMode] = useState<GameMode>('learning');
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<WordEntry | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizOptions, setQuizOptions] = useState<typeof colorWords>([]);
  const [zoom, setZoom] = useState(100);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState('ro');
  const [currentLevel, setCurrentLevel] = useState<Level>(1);
  const [draggedColor, setDraggedColor] = useState<string | null>(null);
  const [coloredObjects, setColoredObjects] = useState<Record<string, boolean>>({});
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [mixResult, setMixResult] = useState<string | null>(null);
  const [mixedObjects, setMixedObjects] = useState<Array<{
    object: any;
    correctColor: string;
  }>>([]);
  const [isMixedMode, setIsMixedMode] = useState(false);
  
  // State-uri noi pentru drag & drop în canvas (Level 3) - 2 pătrate predefinite
  const [square1, setSquare1] = useState<{ color: string | null; position: { x: number; y: number } }>({
    color: null,
    position: { x: 40, y: 100 }
  });
  const [square2, setSquare2] = useState<{ color: string | null; position: { x: number; y: number } }>({
    color: null,
    position: { x: 260, y: 100 }
  });
  const [draggingSquare, setDraggingSquare] = useState<'square1' | 'square2' | null>(null);
  const [level3QuizOptions, setLevel3QuizOptions] = useState<Array<{
    color1: string;
    color2: string;
    result: string;
    isCorrect: boolean;
  }>>([]);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [showMixFeedback, setShowMixFeedback] = useState(false);
  
  const { dir } = useI18n(currentLanguage);
  
  // Filtrăm culorile ROGVAIV în ordinea curcubeului
  const allColors = byCategory("colors");
  const colorOrder = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
  const colorWords = colorOrder
    .map(slug => allColors.find(c => c.slug === slug))
    .filter(Boolean) as WordEntry[];

  useEffect(() => {
    if (gameMode === 'quiz' && colorWords.length > 0) {
      generateQuizOptions();
    }
  }, [gameMode, currentColorIndex]);

  useEffect(() => {
    // Resetăm modul mixat când schimbăm nivelul
    setIsMixedMode(false);
    setMixedObjects([]);
    setColoredObjects({});
  }, [currentLevel]);

  const generateQuizOptions = () => {
    const currentColor = colorWords[currentColorIndex];
    const otherColors = colorWords.filter((_, idx) => idx !== currentColorIndex);
    const shuffled = [...otherColors].sort(() => Math.random() - 0.5);
    const options = [currentColor, ...shuffled.slice(0, 2)].sort(() => Math.random() - 0.5);
    setQuizOptions(options);
  };

  const playAudio = (colorId: string) => {
    const color = colorWords.find(c => c.id === colorId);
    if (!color) return;

    // Încercăm să redăm audio-ul în limba curentă
    if (color.audio?.[currentLanguage]) {
      const audio = new Audio(color.audio[currentLanguage]);
      audio.play().catch(() => {
        // Dacă fișierul audio nu există, folosim Web Speech API
        speakColorName(color.t[currentLanguage] || color.t.ro);
      });
    } else {
      // Dacă nu există câmp audio, folosim Web Speech API
      speakColorName(color.t[currentLanguage] || color.t.ro);
    }
  };

  const speakColorName = (colorName: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(colorName);
      const langMap: Record<string, string> = {
        ro: 'ro-RO', en: 'en-US', de: 'de-DE', fr: 'fr-FR', es: 'es-ES',
        it: 'it-IT', pt: 'pt-PT', ru: 'ru-RU', pl: 'pl-PL', cz: 'cs-CZ',
        hu: 'hu-HU', bg: 'bg-BG', tr: 'tr-TR', ar: 'ar-SA', nl: 'nl-NL'
      };
      utterance.lang = langMap[currentLanguage] || 'ro-RO';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNext = () => {
    if (currentColorIndex < colorWords.length - 1) {
      setCurrentColorIndex(currentColorIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setCurrentColorIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentColorIndex > 0) {
      setCurrentColorIndex(currentColorIndex - 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handleShuffle = () => {
    const randomIndex = Math.floor(Math.random() * colorWords.length);
    setCurrentColorIndex(randomIndex);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const handleQuizAnswer = (option: WordEntry) => {
    if (showFeedback) return;
    
    setSelectedAnswer(option);
    setShowFeedback(true);
    setTotalQuestions(totalQuestions + 1);

    const isCorrect = option.id === colorWords[currentColorIndex].id;
    if (isCorrect) {
      setScore(score + 1);
      toast.success(gameTranslations[currentLanguage]?.correct || "Corect! Bravo! 🎉", {
        duration: 2000,
      });
      playAudio(option.id);
      setTimeout(() => {
        handleNext();
      }, 1500);
    } else {
      toast.error(gameTranslations[currentLanguage]?.tryAgain || "Încearcă din nou! 💪", {
        duration: 2000,
      });
    }
  };

  const currentColor = colorWords[currentColorIndex];

  const getColorHex = (slug: string): string => {
    const colorMap: Record<string, string> = {
      red: '#FF0000',
      orange: '#FF7F00',
      yellow: '#FFFF00',
      green: '#00FF00',
      blue: '#0000FF',
      indigo: '#4B0082',
      violet: '#9400D3',
      // Culori secundare pentru mixare
      'dark-brown': '#5C4033',  // Maro închis (Roșu + Verde)
      'brown': '#8B6F47',       // Maroniu (Portocaliu + Albastru)
      'turquoise': '#40E0D0'    // Turcoaz (Verde + Albastru)
    };
    return colorMap[slug] || '#000000';
  };

  const generateMixQuizOptions = (square1Color: string, square2Color: string) => {
    const mixKey1 = `${square1Color}+${square2Color}`;
    const mixKey2 = `${square2Color}+${square1Color}`;
    const correctMix = colorMixing[mixKey1 as keyof typeof colorMixing] || colorMixing[mixKey2 as keyof typeof colorMixing];
    
    if (!correctMix) {
      console.warn(`Combinație nemapată: ${square1Color} + ${square2Color}`);
      return [];
    }
    
    // Toate culorile ROGVAIV + culorile secundare (maro, turcoaz)
    const allColors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'brown', 'dark-brown', 'turquoise'];
    const wrongColors = allColors.filter(c => 
      c !== correctMix.result && 
      c !== square1Color && 
      c !== square2Color
    );
    const wrongColor = wrongColors[Math.floor(Math.random() * wrongColors.length)];
    
    const options = [
      { color1: square1Color, color2: square2Color, result: correctMix.result, isCorrect: true },
      { color1: square1Color, color2: square2Color, result: wrongColor, isCorrect: false }
    ];
    
    return options.sort(() => Math.random() - 0.5);
  };

  const handleShuffleColors = () => {
    // Selectăm aleatoriu 2-3 culori diferite din ROGVAIV
    const numColors = Math.random() > 0.5 ? 3 : 2; // 50% șanse pentru 2 sau 3 culori
    const availableColors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
    const selectedColorSlugs: string[] = [];
    
    // Selectăm culori unice aleatorii
    while (selectedColorSlugs.length < numColors) {
      const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
      if (!selectedColorSlugs.includes(randomColor)) {
        selectedColorSlugs.push(randomColor);
      }
    }
    
    // Pentru fiecare culoare selectată, alegem aleatoriu un obiect
    const mixedArray: Array<{ object: any; correctColor: string }> = [];
    selectedColorSlugs.forEach(colorSlug => {
      const objectsForColor = colorSpecificObjects[colorSlug as keyof typeof colorSpecificObjects] || [];
      if (objectsForColor.length > 0) {
        const randomObject = objectsForColor[Math.floor(Math.random() * objectsForColor.length)];
        mixedArray.push({
          object: { ...randomObject, id: `${randomObject.id}_${colorSlug}` }, // ID unic pentru fiecare
          correctColor: colorSlug
        });
      }
    });
    
    // Shuffle-uim array-ul pentru ordine aleatorie
    const shuffledArray = mixedArray.sort(() => Math.random() - 0.5);
    
    setMixedObjects(shuffledArray);
    setIsMixedMode(true);
    setColoredObjects({}); // Resetăm obiectele colorate
    
    toast.success(
      gameTranslations[currentLanguage]?.shuffleColors || 'Amestecă culorile',
      { duration: 2000 }
    );
  };

  const renderLevel2 = () => {
    const currentColor = colorWords[currentColorIndex];
    
    // Dacă suntem în modul mixat, folosim obiectele mixate
    const objects = isMixedMode 
      ? mixedObjects.map(item => item.object)
      : (colorSpecificObjects[currentColor.slug as keyof typeof colorSpecificObjects] || []);
    
    const handleDragStart = (e: React.DragEvent, colorSlug: string, colorHex: string) => {
      e.dataTransfer.setData('colorSlug', colorSlug);
      e.dataTransfer.setData('colorHex', colorHex);
      setDraggedColor(colorSlug);
    };
    
    const handleDragEnd = () => setDraggedColor(null);
    
    const handleDropOnObject = (e: React.DragEvent, objectId: string, correctColorSlug: string) => {
      e.preventDefault();
      const droppedColorSlug = e.dataTransfer.getData('colorSlug');
      
      // În modul mixat, verificăm culoarea specifică obiectului
      const actualCorrectColor = isMixedMode 
        ? mixedObjects.find(item => item.object.id === objectId)?.correctColor 
        : correctColorSlug;
      
      if (droppedColorSlug === actualCorrectColor) {
        setColoredObjects(prev => ({ ...prev, [objectId]: true }));
        
        // Găsim obiectul pentru a afișa numele
        const object = objects.find(obj => obj.id === objectId);
        const droppedColor = colorWords.find(c => c.slug === droppedColorSlug);
        
        if (object && droppedColor) {
          const objectName = object.name[currentLanguage] || object.name.ro;
          const colorName = droppedColor.t[currentLanguage] || droppedColor.t.ro;
          speakColorName(`${gameTranslations[currentLanguage]?.wellDone || 'Bravo!'} ${objectName} ${colorName}!`);
        }
        toast.success(gameTranslations[currentLanguage]?.wellDone || 'Bravo!', { duration: 2000 });
        
        const allColored = objects.every(obj => coloredObjects[obj.id] || obj.id === objectId);
        if (allColored) {
          setTimeout(() => {
            if (isMixedMode) {
              // În modul mixat, generăm un nou mix
              handleShuffleColors();
            } else {
              // În modul normal, trecem la următoarea culoare
              if (currentColorIndex < colorWords.length - 1) {
                setCurrentColorIndex(currentColorIndex + 1);
                setColoredObjects({});
              } else {
                toast.success('🎉 ' + (gameTranslations[currentLanguage]?.congratulations || 'Felicitări!'));
              }
            }
          }, 1500);
        }
      } else {
        toast.error(gameTranslations[currentLanguage]?.tryAnotherColor || 'Încearcă altă culoare', { duration: 1500 });
      }
    };
    
    return (
      <div className="space-y-6">
        <Card className="shadow-lg border-4 border-purple-300">
          <CardContent className="p-6">
            <h3 className="text-2xl font-black text-purple-700 mb-4 text-center">
              {gameTranslations[currentLanguage]?.dragColorToObject || 'Trage culoarea corectă'}
            </h3>
            <div className="flex justify-center gap-3 flex-wrap">
              {colorWords.map((color) => (
                <div
                  key={color.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, color.slug, color.img)}
                  onDragEnd={handleDragEnd}
                  className={`w-20 h-20 rounded-2xl cursor-move transition-all shadow-lg hover:scale-110 flex items-center justify-center text-xs font-black text-white ${draggedColor === color.slug && 'opacity-50'}`}
                  style={{ backgroundColor: getColorHex(color.slug) }}
                >
                  {(color.t[currentLanguage] || color.t.ro).charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Buton Combină Culori */}
        <div className="flex justify-center">
          <Button
            onClick={handleShuffleColors}
            variant="default"
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <Shuffle className="mr-2 h-6 w-6" />
            {gameTranslations[currentLanguage]?.shuffleColors || 'Amestecă culorile'}
          </Button>
        </div>
        
        <Card className="shadow-lg border-4 border-green-300">
          <CardContent className="p-8">
            <h3 className="text-3xl font-black text-green-700 mb-6 text-center">
              {isMixedMode 
                ? (gameTranslations[currentLanguage]?.mixColors || 'Amestecă culorile')
                : (currentColor.t[currentLanguage] || currentColor.t.ro).toUpperCase()}
            </h3>
            <div className="grid grid-cols-3 gap-6">
              {objects.map((object) => {
                const isColored = coloredObjects[object.id];
                return (
                  <div
                    key={object.id}
                    onDrop={(e) => handleDropOnObject(
                      e, 
                      object.id, 
                      isMixedMode 
                        ? (mixedObjects.find(item => item.object.id === object.id)?.correctColor || currentColor.slug)
                        : currentColor.slug
                    )}
                    onDragOver={(e) => e.preventDefault()}
                    className={`relative bg-white rounded-3xl p-6 border-4 transition-all ${isColored ? 'border-green-500 shadow-xl' : 'border-gray-300 border-dashed hover:border-purple-400'}`}
                  >
                    <div className="flex items-center justify-center h-32 mb-3">
                      {object.useEmoji ? (
                        <div className="text-8xl" style={{ filter: isColored ? 'none' : 'grayscale(100%)', opacity: isColored ? 1 : 0.4 }}>
                          {object.emoji}
                        </div>
                      ) : (
                        <img src={object.image} alt={object.name[currentLanguage] || object.name.ro} className="w-full h-full object-contain" style={{ filter: isColored ? 'none' : 'grayscale(100%)', opacity: isColored ? 1 : 0.4 }} />
                      )}
                    </div>
                    <p className="text-center font-black text-lg text-gray-700">{object.name[currentLanguage] || object.name.ro}</p>
                    {isColored && <div className="absolute top-2 right-2 bg-green-500 rounded-full p-2"><Check className="w-6 h-6 text-white" /></div>}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderLevel3 = () => {
    const handleColorDragStart = (e: React.DragEvent, colorSlug: string) => {
      e.dataTransfer.setData('colorSlug', colorSlug);
      e.dataTransfer.effectAllowed = 'copy';
    };
    
    const handleDropColorOnSquare = (e: React.DragEvent, squareId: 'square1' | 'square2') => {
      e.preventDefault();
      e.stopPropagation();
      const colorSlug = e.dataTransfer.getData('colorSlug');
      
      if (!colorSlug) return;
      
      if (squareId === 'square1' && !square1.color) {
        setSquare1(prev => ({ ...prev, color: colorSlug }));
        speakColorName(colorWords.find(c => c.slug === colorSlug)?.t[currentLanguage] || '');
      } else if (squareId === 'square2' && !square2.color) {
        setSquare2(prev => ({ ...prev, color: colorSlug }));
        speakColorName(colorWords.find(c => c.slug === colorSlug)?.t[currentLanguage] || '');
      }
      
      // Generează quiz când ambele pătrate au culori
      const updatedSquare1 = squareId === 'square1' ? colorSlug : square1.color;
      const updatedSquare2 = squareId === 'square2' ? colorSlug : square2.color;
      
      if (updatedSquare1 && updatedSquare2) {
        const options = generateMixQuizOptions(updatedSquare1, updatedSquare2);
        setLevel3QuizOptions(options);
      }
    };
    
    const handleSquareMouseDown = (e: React.MouseEvent, squareId: 'square1' | 'square2') => {
      const square = squareId === 'square1' ? square1 : square2;
      if (!square.color) return;
      
      setDraggingSquare(squareId);
      
      const handleMouseMove = (moveEvent: MouseEvent) => {
        const canvas = document.getElementById('mix-canvas');
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = moveEvent.clientX - rect.left - 100;
        const y = moveEvent.clientY - rect.top - 100;
        
        const boundedX = Math.max(0, Math.min(x, 300)); // 500 - 200 = 300
        const boundedY = Math.max(0, Math.min(y, 200)); // 400 - 200 = 200
        
        if (squareId === 'square1') {
          setSquare1(prev => ({ ...prev, position: { x: boundedX, y: boundedY } }));
        } else {
          setSquare2(prev => ({ ...prev, position: { x: boundedX, y: boundedY } }));
        }
      };
      
      const handleMouseUp = () => {
        setDraggingSquare(null);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };
    
    const getIntersection = () => {
      if (!square1.color || !square2.color) return null;
      
      const s1 = {
        x1: square1.position.x,
        y1: square1.position.y,
        x2: square1.position.x + 200,
        y2: square1.position.y + 200
      };
      
      const s2 = {
        x1: square2.position.x,
        y1: square2.position.y,
        x2: square2.position.x + 200,
        y2: square2.position.y + 200
      };
      
      const hasOverlap = !(s1.x2 < s2.x1 || s2.x2 < s1.x1 || s1.y2 < s2.y1 || s2.y2 < s1.y1);
      
      if (!hasOverlap) return null;
      
      const mixKey1 = `${square1.color}+${square2.color}`;
      const mixKey2 = `${square2.color}+${square1.color}`;
      const mixResult = colorMixing[mixKey1 as keyof typeof colorMixing] || 
                        colorMixing[mixKey2 as keyof typeof colorMixing];
      
      if (!mixResult) return null;
      
      return {
        x: Math.max(s1.x1, s2.x1),
        y: Math.max(s1.y1, s2.y1),
        width: Math.min(s1.x2, s2.x2) - Math.max(s1.x1, s2.x1),
        height: Math.min(s1.y2, s2.y2) - Math.max(s1.y1, s2.y1),
        color: getColorHex(mixResult.result)
      };
    };
    
    const handleQuizAnswer = (optionIndex: number) => {
      setSelectedQuizAnswer(optionIndex);
      const isCorrect = level3QuizOptions[optionIndex].isCorrect;
      
      if (isCorrect) {
        const resultColor = level3QuizOptions[optionIndex].result;
        const colorName = colorWords.find(c => c.slug === resultColor)?.t[currentLanguage] || '';
        
        speakColorName(`${gameTranslations[currentLanguage]?.wellDone || 'Bravo!'} ${colorName}!`);
        toast.success(gameTranslations[currentLanguage]?.wellDone || 'Corect! Bravo!', { duration: 2000 });
        
        setTimeout(() => {
          setSquare1({ color: null, position: { x: 40, y: 100 } });
          setSquare2({ color: null, position: { x: 260, y: 100 } });
          setLevel3QuizOptions([]);
          setSelectedQuizAnswer(null);
          setShowMixFeedback(false);
        }, 2000);
      } else {
        toast.error(gameTranslations[currentLanguage]?.tryAgain || 'Încearcă din nou!', { duration: 1500 });
      }
      
      setShowMixFeedback(true);
    };
    
    const intersection = getIntersection();
    
    return (
      <div className="space-y-6">
        <Card className="shadow-lg border-2 border-gray-200">
          <CardContent className="p-4">
            <h2 className="text-2xl font-black text-purple-700 mb-3 text-center">
              {gameTranslations[currentLanguage]?.level3 || 'Combin Culori'}
            </h2>
            
            {/* ZONA 1: Paletă ROGVAIV */}
            <div className="mb-3">
              <div className="flex justify-center gap-3 flex-wrap">
                {colorWords.map((color) => (
                  <div
                    key={color.id}
                    draggable
                    onDragStart={(e) => handleColorDragStart(e, color.slug)}
                    className="w-16 h-16 rounded-xl cursor-move shadow-md hover:scale-110 transition-all border-3 border-white flex items-center justify-center"
                    style={{ backgroundColor: getColorHex(color.slug) }}
                  >
                    <span className="text-xs font-black text-white drop-shadow-lg">
                      {(color.t[currentLanguage] || color.t.ro).charAt(0).toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm font-bold text-gray-600 mt-3">
                {gameTranslations[currentLanguage]?.dragTwoColorsToSquares || 'Trage 2 culori în pătratele de mai jos'}
              </p>
            </div>
            
            {/* ZONA 2: Container Flexbox pentru Canvas + Quiz */}
            <div className="flex gap-4 items-start justify-center mb-3">
              {/* Canvas cu pătrate */}
              <div 
                id="mix-canvas"
                className="relative bg-gray-100 rounded-xl border-3 border-gray-400 flex-shrink-0"
                style={{ width: '500px', height: '400px' }}
              >
              {/* Pătrat 1 - PREDEFINIT */}
              <div
                onDrop={(e) => handleDropColorOnSquare(e, 'square1')}
                onDragOver={(e) => e.preventDefault()}
                onMouseDown={(e) => handleSquareMouseDown(e, 'square1')}
                className={cn(
                  "absolute w-[200px] h-[200px] rounded-xl transition-all",
                  square1.color 
                    ? "shadow-xl cursor-move border-4 border-white" 
                    : "border-4 border-dashed border-gray-400 bg-white/50 cursor-default"
                )}
                style={{
                  left: `${square1.position.x}px`,
                  top: `${square1.position.y}px`,
                  backgroundColor: square1.color ? getColorHex(square1.color) : 'transparent',
                  zIndex: draggingSquare === 'square1' ? 10 : 1
                }}
              >
                {!square1.color && (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl text-gray-400 font-black">1</span>
                  </div>
                )}
              </div>
              
              {/* Pătrat 2 - PREDEFINIT */}
              <div
                onDrop={(e) => handleDropColorOnSquare(e, 'square2')}
                onDragOver={(e) => e.preventDefault()}
                onMouseDown={(e) => handleSquareMouseDown(e, 'square2')}
                className={cn(
                  "absolute w-[200px] h-[200px] rounded-xl transition-all",
                  square2.color 
                    ? "shadow-xl cursor-move border-4 border-white" 
                    : "border-4 border-dashed border-gray-400 bg-white/50 cursor-default"
                )}
                style={{
                  left: `${square2.position.x}px`,
                  top: `${square2.position.y}px`,
                  backgroundColor: square2.color ? getColorHex(square2.color) : 'transparent',
                  zIndex: draggingSquare === 'square2' ? 10 : 2
                }}
              >
                {!square2.color && (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl text-gray-400 font-black">2</span>
                  </div>
                )}
              </div>
              
              {/* Intersecție - CULOARE MIXTĂ */}
              {intersection && (
                <div
                  className="absolute rounded-lg border-4 border-yellow-400 shadow-2xl animate-pulse pointer-events-none flex items-center justify-center"
                  style={{
                    left: `${intersection.x}px`,
                    top: `${intersection.y}px`,
                    width: `${intersection.width}px`,
                    height: `${intersection.height}px`,
                    backgroundColor: intersection.color,
                    zIndex: 20
                  }}
                >
                  <Sparkles className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
              )}
            </div>
            
            {/* ZONA 3: Quiz - Side by Side cu Canvas */}
            {level3QuizOptions.length === 2 && (
              <div className="flex flex-col gap-3 flex-shrink-0" style={{ width: '350px' }}>
                <h3 className="text-lg font-black text-center text-green-700">
                  {gameTranslations[currentLanguage]?.whatColorDoYouGet || 'Ce culoare obții?'}
                </h3>
                
                <div className="space-y-3">
                  {level3QuizOptions.map((option, index) => {
                    const isSelected = selectedQuizAnswer === index;
                    const showResult = showMixFeedback && isSelected;
                    const resultColor = colorWords.find(c => c.slug === option.result);
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleQuizAnswer(index)}
                        disabled={showMixFeedback}
                        className={cn(
                          "w-full p-3 rounded-xl border-3 transition-all shadow-md flex flex-col items-center gap-2",
                          isSelected && option.isCorrect && showResult && "border-green-500 bg-green-50",
                          isSelected && !option.isCorrect && showResult && "border-red-500 bg-red-50",
                          !isSelected && "border-gray-300 hover:border-purple-400 hover:scale-105"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg shadow-sm" style={{ backgroundColor: getColorHex(option.color1) }} />
                          <span className="text-xl font-black text-gray-600">+</span>
                          <div className="w-10 h-10 rounded-lg shadow-sm" style={{ backgroundColor: getColorHex(option.color2) }} />
                          <span className="text-xl font-black text-gray-600">=</span>
                          <div className="w-12 h-12 rounded-lg shadow-md border-2 border-white" style={{ backgroundColor: getColorHex(option.result) }} />
                        </div>
                        
                        <p className="text-base font-black text-gray-700">
                          {resultColor?.t[currentLanguage] || resultColor?.t.ro}
                        </p>
                        
                        {showResult && (
                          <span className="text-sm font-black">
                            {option.isCorrect ? '✅' : '❌'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {intersection && (
                  <div className="text-center p-2 bg-yellow-100 rounded-lg border-2 border-yellow-400">
                    <p className="text-sm font-black text-yellow-800 flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Suprapuse corect!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
            
            {/* Text instructiv */}
            <p className="text-center text-lg font-black text-purple-700 mt-4">
              {gameTranslations[currentLanguage]?.overlapAndDiscover || 'Suprapune pătratele și află culoarea corectă!'}
            </p>
            
            {/* Buton Reset */}
            <div className="flex justify-center mt-2">
              <Button
                onClick={() => {
                  setSquare1({ color: null, position: { x: 40, y: 100 } });
                  setSquare2({ color: null, position: { x: 260, y: 100 } });
                  setLevel3QuizOptions([]);
                  setSelectedQuizAnswer(null);
                  setShowMixFeedback(false);
                }}
                variant="outline"
                size="lg"
                className="font-black"
              >
                <Shuffle className="w-5 h-5 mr-2" />
                {gameTranslations[currentLanguage]?.reset || 'Resetează'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderLearningMode = () => (
    <div className="space-y-4 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-3">{gameTranslations[currentLanguage]?.title || 'Învață Culorile ROGVAIV'}</h2>
      
      <div className="flex justify-center mb-4">
        <div className="bg-purple-50 p-6 rounded-3xl border-4 border-purple-200 shadow-xl">
          <img 
            src={currentColor?.img} 
            alt={currentColor?.t.ro}
            className="w-80 h-80 object-contain rounded-2xl"
          />
        </div>
      </div>
      
        <div className="space-y-3 bg-purple-50 p-4 rounded-2xl border-4 border-purple-200">
          <h3 className="text-5xl font-bold text-purple-700">
          {(currentColor?.t[currentLanguage] || currentColor?.t.ro).toUpperCase()}
        </h3>
        
        <Button 
          onClick={() => playAudio(currentColor?.id)}
          size="lg"
          className="flex items-center gap-2 text-lg px-6 py-4 bg-white text-purple-600 hover:bg-purple-50 shadow-xl"
        >
          <Volume2 className="w-6 h-6" />
          {gameTranslations[currentLanguage]?.listen || 'Ascultă'}
        </Button>
      </div>
      
      <div className="flex justify-center gap-4">
        <Button
          onClick={handlePrevious}
          disabled={currentColorIndex === 0}
          size="lg"
          className="bg-purple-500 hover:bg-purple-600 text-white border-2 border-purple-600 disabled:opacity-50 gap-2"
        >
          <ChevronLeft className="w-6 h-6" />
          {gameTranslations[currentLanguage]?.previous || 'Precedenta'}
        </Button>
        
        <Button 
          onClick={handleShuffle}
          size="lg"
          className="bg-purple-500 hover:bg-purple-600 text-white border-2 border-purple-600 gap-2"
        >
          <Shuffle className="w-5 h-5" />
          {gameTranslations[currentLanguage]?.random || 'Aleatoriu'}
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={currentColorIndex === colorWords.length - 1}
          size="lg"
          className="bg-purple-500 hover:bg-purple-600 text-white border-2 border-purple-600 disabled:opacity-50 gap-2"
        >
          {gameTranslations[currentLanguage]?.next || 'Următoarea'}
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );

  const renderQuizMode = () => (
    <div className="space-y-4 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-3">{gameTranslations[currentLanguage]?.quiz || 'Quiz'} {gameTranslations[currentLanguage]?.title || 'Culori ROGVAIV'}</h2>
      <div className="flex items-center justify-center gap-3 text-2xl font-bold">
        <Trophy className="w-8 h-8 text-yellow-500" />
        <span className="text-purple-700 bg-purple-50 px-8 py-3 rounded-full border-2 border-purple-300">
          {gameTranslations[currentLanguage]?.score || 'Scor'}: {score} / {totalQuestions}
        </span>
      </div>

      <div className="flex justify-center">
        <img
          src={currentColor?.img}
          alt="Ghicește culoarea"
          className="w-60 h-60 object-contain rounded-2xl shadow-2xl border-4 border-white/50 backdrop-blur-sm"
        />
      </div>

      <h3 className="text-2xl font-bold text-purple-700 bg-purple-50 p-4 rounded-2xl border-2 border-purple-300">
        {gameTranslations[currentLanguage]?.whatColorIs || 'Ce culoare este aceasta?'}
      </h3>

      <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
        {quizOptions.map((option) => {
          const isSelected = selectedAnswer?.id === option.id;
          const isCorrect = option.id === currentColor.id;
          const showResult = showFeedback && isSelected;

          return (
            <Button
              key={option.id}
              onClick={() => handleQuizAnswer(option)}
              disabled={showFeedback}
              size="lg"
              className={`text-xl py-7 ${
                showResult
                  ? isCorrect
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-purple-500 hover:bg-purple-600 text-white border-2 border-purple-600'
              }`}
            >
              {(option.t[currentLanguage] || option.t.ro).toUpperCase()}
              {showResult && (
                <span className="absolute right-4">
                  {isCorrect ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white" dir={dir}>
        {/* Sidebar */}
        <Sidebar className="w-32 border-r-2 border-primary/20">
          <div className="p-1.5 border-b border-primary/20">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="w-full justify-start text-primary hover:bg-primary/10 font-black h-8 text-xs"
            >
              <Home className="w-3 h-3 mr-1" />
              {gameTranslations[currentLanguage]?.back || 'Acasă'}
            </Button>
          </div>

          <SidebarContent className="p-1.5 space-y-2">
            {/* Language Selector */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-black text-primary border border-green-400 rounded p-1 text-center bg-green-50">
                {gameTranslations[currentLanguage]?.language || 'Limbă'}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
                  <SelectTrigger className="h-6 text-xs font-black">
                    <SelectValue>
                      {languages.find(l => l.code === currentLanguage)?.flag} {languages.find(l => l.code === currentLanguage)?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code} className="text-xs">
                        {lang.flag} {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Level Selector */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-black text-primary border border-blue-400 rounded p-1 text-center bg-blue-50">
                {gameTranslations[currentLanguage]?.level || 'Nivel'}
              </SidebarGroupLabel>
              <SidebarGroupContent className="space-y-1">
                <Button
                  variant={currentLevel === 1 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setCurrentLevel(1);
                    setGameMode('learning');
                    setColoredObjects({});
                    setSelectedColors([]);
                    setMixResult(null);
                  }}
                  className="w-full font-black h-6 text-xs"
                >
                  1️⃣ {gameTranslations[currentLanguage]?.level1 || 'Învăț'}
                </Button>
                <Button
                  variant={currentLevel === 2 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setCurrentLevel(2);
                    setGameMode('dragDrop');
                    setColoredObjects({});
                    setSelectedColors([]);
                    setMixResult(null);
                  }}
                  className="w-full font-black h-6 text-xs"
                >
                  2️⃣ {gameTranslations[currentLanguage]?.level2 || 'Aleg'}
                </Button>
                <Button
                  variant={currentLevel === 3 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setCurrentLevel(3);
                    setGameMode('colorMix');
                    setColoredObjects({});
                    setSelectedColors([]);
                    setMixResult(null);
                  }}
                  className="w-full font-black h-6 text-xs"
                >
                  3️⃣ {gameTranslations[currentLanguage]?.level3 || 'Combin'}
                </Button>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Game Mode Selector - doar pentru Nivel 1 */}
            {currentLevel === 1 && (
              <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-black text-primary border border-purple-400 rounded p-1 text-center bg-purple-50">
                {gameTranslations[currentLanguage]?.gameMode || 'Mod Joc'}
              </SidebarGroupLabel>
              <SidebarGroupContent className="space-y-1">
                <Button
                  variant={gameMode === 'learning' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setGameMode('learning');
                    setSelectedAnswer(null);
                    setShowFeedback(false);
                  }}
                  className="w-full font-black h-6 text-xs"
                >
                  {gameTranslations[currentLanguage]?.learn || 'Învață'}
                </Button>
                <Button
                  variant={gameMode === 'quiz' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setGameMode('quiz');
                    setSelectedAnswer(null);
                    setShowFeedback(false);
                    generateQuizOptions();
                  }}
                  className="w-full font-black h-6 text-xs"
                >
                  {gameTranslations[currentLanguage]?.quiz || 'Quiz'}
                </Button>
              </SidebarGroupContent>
              </SidebarGroup>
            )}

            {/* Progress Indicator în sidebar */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-black text-primary border border-green-400 rounded p-1 text-center bg-green-50">
                {gameTranslations[currentLanguage]?.progress || 'Progres'}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="text-xs font-black text-center text-gray-600">
                  {currentColorIndex + 1}/{colorWords.length}
                </div>
                <div className="flex justify-center gap-1 mt-2">
                  {colorWords.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-all duration-300 border border-purple-300 ${
                        idx === currentColorIndex
                          ? 'bg-purple-500 scale-125'
                          : 'bg-purple-100'
                      }`}
                    />
                  ))}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b-2 border-primary/20 p-3 -ml-32">
            <div className="flex items-center justify-between w-full">
              {/* Left side - NumLit Logo */}
              <div className="flex items-center gap-3 -ml-32 pl-32">
                <img src={numLitLogo} alt="NumLit" className="h-10 w-auto" />
                <div className="h-8 w-px bg-primary/30"></div>
                <h1 className="text-lg font-black text-primary">
                  {gameTranslations[currentLanguage]?.title || 'Învață Culorile ROGVAIV'}
                </h1>
              </div>

              {/* Center - Controls */}
              <div className="flex items-center gap-3">
                {/* Instructions */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="font-black h-8 text-xs">
                      <Info className="w-3 h-3 mr-1.5" />
                      {gameTranslations[currentLanguage]?.instructions || 'Instrucțiuni'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="font-black">{gameTranslations[currentLanguage]?.howToPlay || 'Cum să joci'}</DialogTitle>
                      <DialogDescription>
                        <div className="space-y-4 text-sm">
                          <p><strong>{gameTranslations[currentLanguage]?.learn || 'Mod Învățare'}:</strong> {gameTranslations[currentLanguage]?.learningModeDesc || 'Explorează culorile ROGVAIV în ordine.'}</p>
                          <p><strong>{gameTranslations[currentLanguage]?.quiz || 'Mod Quiz'}:</strong> {gameTranslations[currentLanguage]?.quizModeDesc || 'Testează-ți cunoștințele!'}</p>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>

                {/* Score Display */}
                {gameMode === 'quiz' && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 rounded-lg border border-purple-200">
                    <Trophy className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-black text-purple-700">{score}/{totalQuestions}</span>
                  </div>
                )}

                {/* Zoom Controls */}
                <ZoomControls
                  zoom={zoom}
                  onZoomChange={setZoom}
                  className="bg-white"
                />

                {/* Timer */}
                <Timer
                  isRunning={isTimerRunning}
                  onTimeUpdate={setCurrentTime}
                  className="bg-white"
                />
              </div>

              {/* Right side - Timer Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="font-black h-8 text-xs"
                >
                  {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </Button>
              </div>
            </div>
          </header>

          {/* Game Content */}
          <main className="flex-1 p-6" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left', width: `${(100 / zoom) * 100}%`, height: `${(100 / zoom) * 100}%` }}>
            <div className="max-w-6xl mx-auto">
              {currentLevel === 1 && gameMode === 'learning' && renderLearningMode()}
              {currentLevel === 1 && gameMode === 'quiz' && renderQuizMode()}
              {currentLevel === 2 && renderLevel2()}
              {currentLevel === 3 && renderLevel3()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
