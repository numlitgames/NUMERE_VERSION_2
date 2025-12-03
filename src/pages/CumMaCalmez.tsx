import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ZoomControls from "@/components/educational/ZoomControls";
import Timer from "@/components/educational/Timer";
import { Home, Info, Globe } from "lucide-react";
import SpinningWheel from "@/components/educational/SpinningWheel";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import numLitLogo from "@/assets/numlit-logo-header.png";

// Translations for 16 languages
const translations = {
  ar: {
    flag: "🇸🇦", name: "العربية",
    title: "كيف أهدأ ✨",
    subtitle: "تعلم تقنيات الاسترخاء من خلال عجلة الهدوء",
    instructions: "التعليمات",
    howToPlayTitle: "كيفية اللعب",
    howToPlay: "أدر العجلة واتبع النشاط المقترح للهدوء.",
    back: "العودة",
    language: "اللغة",
    wheelResult: "النتيجة",
    spinWheel: "أدر العجلة",
    techniques: {
      walk: "أذهب في نزهة",
      window: "أنظر من النافذة",
      friend: "أتحدث مع صديق",
      draw: "أرسم أو أحيك",
      write: "أكتب عن المشكلة",
      music: "أستمع للموسيقى",
      puzzle: "أحل لغزًا",
      smell: "أشم شيئًا عطرًا",
      count: "أعد حتى 20",
      breathe: "أتنفس بعمق"
    }
  },
  bg: {
    flag: "🇧🇬", name: "Български",
    title: "Как се успокоявам ✨",
    subtitle: "Научи техники за релаксация чрез колелото на спокойствието",
    instructions: "Инструкции",
    howToPlayTitle: "Как да играете",
    howToPlay: "Завъртете колелото и следвайте предложената дейност за успокояване.",
    back: "Назад",
    language: "Език",
    wheelResult: "Резултат",
    spinWheel: "Завърти колелото",
    techniques: {
      walk: "Разхождам се",
      window: "Гледам през прозореца",
      friend: "Говоря с приятел",
      draw: "Рисувам или оцветявам",
      write: "Пиша за проблема",
      music: "Слушам музика",
      puzzle: "Правя пъзел",
      smell: "Помирисвам нещо ароматно",
      count: "Броя до 20",
      breathe: "Дишам дълбоко"
    }
  },
  cs: {
    flag: "🇨🇿", name: "Čeština",
    title: "Jak se uklidním ✨",
    subtitle: "Nauč se relaxační techniky pomocí kola klidu",
    instructions: "Instrukce",
    howToPlayTitle: "Jak hrát",
    howToPlay: "Roztočte kolo a následujte navrhovanou aktivitu pro uklidnění.",
    back: "Zpět",
    language: "Jazyk",
    wheelResult: "Výsledek",
    spinWheel: "Roztočit kolo",
    techniques: {
      walk: "Jdu na procházku",
      window: "Dívám se z okna",
      friend: "Mluvím s kamarádem",
      draw: "Kreslím nebo maluji",
      write: "Píšu o problému",
      music: "Poslouchám hudbu",
      puzzle: "Skládám puzzle",
      smell: "Čichám k něčemu vonnému",
      count: "Počítám do 20",
      breathe: "Dýchám zhluboka"
    }
  },
  de: {
    flag: "🇩🇪", name: "Deutsch",
    title: "Wie ich mich beruhige ✨",
    subtitle: "Lerne Entspannungstechniken mit dem Ruhe-Rad",
    instructions: "Anweisungen",
    howToPlayTitle: "Wie man spielt",
    howToPlay: "Drehen Sie das Rad und folgen Sie der vorgeschlagenen Aktivität zur Beruhigung.",
    back: "Zurück",
    language: "Sprache",
    wheelResult: "Ergebnis",
    spinWheel: "Rad drehen",
    techniques: {
      walk: "Ich mache einen Spaziergang",
      window: "Ich schaue aus dem Fenster",
      friend: "Ich spreche mit einem Freund",
      draw: "Ich zeichne oder male",
      write: "Ich schreibe über das Problem",
      music: "Ich höre Musik",
      puzzle: "Ich mache ein Puzzle",
      smell: "Ich rieche etwas Duftendes",
      count: "Ich zähle bis 20",
      breathe: "Ich atme tief durch"
    }
  },
  en: {
    flag: "🇺🇸", name: "English",
    title: "How I Calm Down ✨",
    subtitle: "Learn relaxation techniques through the calming wheel",
    instructions: "Instructions",
    howToPlayTitle: "How to play",
    howToPlay: "Spin the wheel and follow the suggested activity to calm down.",
    back: "Back",
    language: "Language",
    wheelResult: "Result",
    spinWheel: "Spin wheel",
    techniques: {
      walk: "I go for a walk",
      window: "I look out the window",
      friend: "I talk to a friend",
      draw: "I draw or paint",
      write: "I write about the problem",
      music: "I listen to music",
      puzzle: "I do a puzzle",
      smell: "I smell something fragrant",
      count: "I count to 20",
      breathe: "I breathe deeply"
    }
  },
  es: {
    flag: "🇪🇸", name: "Español",
    title: "Cómo me calmo ✨",
    subtitle: "Aprende técnicas de relajación con la ruleta de la calma",
    instructions: "Instrucciones",
    howToPlayTitle: "Cómo jugar",
    howToPlay: "Gira la ruleta y sigue la actividad sugerida para calmarte.",
    back: "Atrás",
    language: "Idioma",
    wheelResult: "Resultado",
    spinWheel: "Girar ruleta",
    techniques: {
      walk: "Doy un paseo",
      window: "Miro por la ventana",
      friend: "Hablo con un amigo",
      draw: "Dibujo o pinto",
      write: "Escribo sobre el problema",
      music: "Escucho música",
      puzzle: "Hago un puzzle",
      smell: "Huelo algo perfumado",
      count: "Cuento hasta 20",
      breathe: "Respiro profundamente"
    }
  },
  fr: {
    flag: "🇫🇷", name: "Français",
    title: "Comment je me calme ✨",
    subtitle: "Apprends des techniques de relaxation avec la roue du calme",
    instructions: "Instructions",
    howToPlayTitle: "Comment jouer",
    howToPlay: "Tournez la roue et suivez l'activité suggérée pour vous calmer.",
    back: "Retour",
    language: "Langue",
    wheelResult: "Résultat",
    spinWheel: "Tourner la roue",
    techniques: {
      walk: "Je fais une promenade",
      window: "Je regarde par la fenêtre",
      friend: "Je parle à un ami",
      draw: "Je dessine ou je peins",
      write: "J'écris sur le problème",
      music: "J'écoute de la musique",
      puzzle: "Je fais un puzzle",
      smell: "Je sens quelque chose de parfumé",
      count: "Je compte jusqu'à 20",
      breathe: "Je respire profondément"
    }
  },
  hi: {
    flag: "🇮🇳", name: "हिंदी",
    title: "मैं कैसे शांत होता हूं ✨",
    subtitle: "शांति के पहिये से विश्राम तकनीक सीखें",
    instructions: "निर्देश",
    howToPlayTitle: "कैसे खेलें",
    howToPlay: "पहिया घुमाएं और शांत होने के लिए सुझाई गई गतिविधि का पालन करें।",
    back: "वापस",
    language: "भाषा",
    wheelResult: "परिणाम",
    spinWheel: "पहिया घुमाओ",
    techniques: {
      walk: "मैं टहलने जाता हूं",
      window: "मैं खिड़की से बाहर देखता हूं",
      friend: "मैं एक दोस्त से बात करता हूं",
      draw: "मैं चित्र बनाता हूं",
      write: "मैं समस्या के बारे में लिखता हूं",
      music: "मैं संगीत सुनता हूं",
      puzzle: "मैं पहेली बनाता हूं",
      smell: "मैं कुछ सुगंधित सूंघता हूं",
      count: "मैं 20 तक गिनता हूं",
      breathe: "मैं गहरी सांस लेता हूं"
    }
  },
  hu: {
    flag: "🇭🇺", name: "Magyar",
    title: "Hogyan nyugszom meg ✨",
    subtitle: "Tanulj relaxációs technikákat a nyugalom kerekével",
    instructions: "Utasítások",
    howToPlayTitle: "Hogyan kell játszani",
    howToPlay: "Pörgesse meg a kereket és kövesse a javasolt tevékenységet a megnyugváshoz.",
    back: "Vissza",
    language: "Nyelv",
    wheelResult: "Eredmény",
    spinWheel: "Kerék pörgetése",
    techniques: {
      walk: "Sétálok egyet",
      window: "Kinézek az ablakon",
      friend: "Beszélek egy barátommal",
      draw: "Rajzolok vagy festek",
      write: "Írok a problémáról",
      music: "Zenét hallgatok",
      puzzle: "Kirakózom",
      smell: "Szagolok valami illatosat",
      count: "Számolok 20-ig",
      breathe: "Mélyen lélegzem"
    }
  },
  it: {
    flag: "🇮🇹", name: "Italiano",
    title: "Come mi calmo ✨",
    subtitle: "Impara tecniche di rilassamento con la ruota della calma",
    instructions: "Istruzioni",
    howToPlayTitle: "Come giocare",
    howToPlay: "Gira la ruota e segui l'attività suggerita per calmarti.",
    back: "Indietro",
    language: "Lingua",
    wheelResult: "Risultato",
    spinWheel: "Gira la ruota",
    techniques: {
      walk: "Faccio una passeggiata",
      window: "Guardo fuori dalla finestra",
      friend: "Parlo con un amico",
      draw: "Disegno o dipingo",
      write: "Scrivo del problema",
      music: "Ascolto musica",
      puzzle: "Faccio un puzzle",
      smell: "Annuso qualcosa di profumato",
      count: "Conto fino a 20",
      breathe: "Respiro profondamente"
    }
  },
  ja: {
    flag: "🇯🇵", name: "日本語",
    title: "落ち着く方法 ✨",
    subtitle: "落ち着きのホイールでリラクゼーション技術を学ぶ",
    instructions: "説明書",
    howToPlayTitle: "遊び方",
    howToPlay: "ホイールを回して、落ち着くための提案されたアクティビティに従ってください。",
    back: "戻る",
    language: "言語",
    wheelResult: "結果",
    spinWheel: "ホイールを回す",
    techniques: {
      walk: "散歩に行く",
      window: "窓の外を見る",
      friend: "友達と話す",
      draw: "絵を描く",
      write: "問題について書く",
      music: "音楽を聴く",
      puzzle: "パズルをする",
      smell: "香りをかぐ",
      count: "20まで数える",
      breathe: "深呼吸をする"
    }
  },
  pl: {
    flag: "🇵🇱", name: "Polski",
    title: "Jak się uspokajam ✨",
    subtitle: "Naucz się technik relaksacyjnych z kołem spokoju",
    instructions: "Instrukcje",
    howToPlayTitle: "Jak grać",
    howToPlay: "Zakręć kołem i wykonaj zaproponowaną czynność, aby się uspokoić.",
    back: "Wstecz",
    language: "Język",
    wheelResult: "Wynik",
    spinWheel: "Zakręć kołem",
    techniques: {
      walk: "Idę na spacer",
      window: "Patrzę przez okno",
      friend: "Rozmawiam z przyjacielem",
      draw: "Rysuję lub maluję",
      write: "Piszę o problemie",
      music: "Słucham muzyki",
      puzzle: "Układam puzzle",
      smell: "Wącham coś pachnącego",
      count: "Liczę do 20",
      breathe: "Oddycham głęboko"
    }
  },
  ro: {
    flag: "🇷🇴", name: "Română",
    title: "Cum mă calmez ✨",
    subtitle: "Învață tehnici de relaxare prin ruleta calmării",
    instructions: "Instrucțiuni",
    howToPlayTitle: "Cum se joacă",
    howToPlay: "Rotește ruleta și urmează activitatea sugerată pentru a te calma.",
    back: "Înapoi",
    language: "Limbă",
    wheelResult: "Rezultat",
    spinWheel: "Rotește ruleta",
    techniques: {
      walk: "Fac o plimbare",
      window: "Privesc pe fereastră",
      friend: "Vorbesc cu un prieten",
      draw: "Desenez sau pictez",
      write: "Scriu despre problemă",
      music: "Ascult muzică",
      puzzle: "Fac un puzzle",
      smell: "Miros ceva parfumat",
      count: "Număr până la 20",
      breathe: "Respir adânc"
    }
  },
  ru: {
    flag: "🇷🇺", name: "Русский",
    title: "Как я успокаиваюсь ✨",
    subtitle: "Изучи техники релаксации с колесом спокойствия",
    instructions: "Инструкции",
    howToPlayTitle: "Как играть",
    howToPlay: "Крутите колесо и следуйте предложенному действию для успокоения.",
    back: "Назад",
    language: "Язык",
    wheelResult: "Результат",
    spinWheel: "Крутить колесо",
    techniques: {
      walk: "Иду на прогулку",
      window: "Смотрю в окно",
      friend: "Разговариваю с другом",
      draw: "Рисую или раскрашиваю",
      write: "Пишу о проблеме",
      music: "Слушаю музыку",
      puzzle: "Собираю пазл",
      smell: "Нюхаю что-то ароматное",
      count: "Считаю до 20",
      breathe: "Глубоко дышу"
    }
  },
  tr: {
    flag: "🇹🇷", name: "Türkçe",
    title: "Nasıl sakinleşirim ✨",
    subtitle: "Sakinlik çarkı ile rahatlama tekniklerini öğren",
    instructions: "Talimatlar",
    howToPlayTitle: "Nasıl oynanır",
    howToPlay: "Çarkı çevirin ve sakinleşmek için önerilen aktiviteyi takip edin.",
    back: "Geri",
    language: "Dil",
    wheelResult: "Sonuç",
    spinWheel: "Çarkı çevir",
    techniques: {
      walk: "Yürüyüşe çıkarım",
      window: "Pencereden dışarı bakarım",
      friend: "Bir arkadaşımla konuşurum",
      draw: "Çizerim veya boyarım",
      write: "Sorun hakkında yazarım",
      music: "Müzik dinlerim",
      puzzle: "Bulmaca yaparım",
      smell: "Hoş kokulu bir şey koklarım",
      count: "20'ye kadar sayarım",
      breathe: "Derin nefes alırım"
    }
  },
  zh: {
    flag: "🇨🇳", name: "中文",
    title: "我如何平静 ✨",
    subtitle: "通过平静轮学习放松技巧",
    instructions: "说明",
    howToPlayTitle: "如何玩",
    howToPlay: "转动轮子，按照建议的活动来平静下来。",
    back: "返回",
    language: "语言",
    wheelResult: "结果",
    spinWheel: "转动轮子",
    techniques: {
      walk: "我去散步",
      window: "我看窗外",
      friend: "我和朋友聊天",
      draw: "我画画",
      write: "我写下问题",
      music: "我听音乐",
      puzzle: "我做拼图",
      smell: "我闻香味",
      count: "我数到20",
      breathe: "我深呼吸"
    }
  }
};

type LanguageKey = keyof typeof translations;
const languageKeys = Object.keys(translations) as LanguageKey[];

// Calming wheel colors - pastel, soothing colors
const sectorColors = [
  '#FF69B4', // Hot Pink - walk
  '#87CEEB', // Sky Blue - window
  '#90EE90', // Light Green - friend
  '#FFFACD', // Lemon Chiffon - draw
  '#FFD700', // Gold - write
  '#FFDAB9', // Peach Puff - music
  '#9370DB', // Medium Purple - puzzle
  '#98FB98', // Pale Green - smell
  '#FFB6C1', // Light Pink - count
  '#ADD8E6', // Light Blue - breathe
];

export default function CumMaCalmez() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<LanguageKey>('ro');
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [zoom, setZoom] = useState(100);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentResultId, setCurrentResultId] = useState<string | null>(null);

  const t = translations[language];

  // Generate wheel sectors from translations
  const wheelSectors = [
    { id: 'walk', text: t.techniques.walk, color: sectorColors[0] },
    { id: 'window', text: t.techniques.window, color: sectorColors[1] },
    { id: 'friend', text: t.techniques.friend, color: sectorColors[2] },
    { id: 'draw', text: t.techniques.draw, color: sectorColors[3] },
    { id: 'write', text: t.techniques.write, color: sectorColors[4] },
    { id: 'music', text: t.techniques.music, color: sectorColors[5] },
    { id: 'puzzle', text: t.techniques.puzzle, color: sectorColors[6] },
    { id: 'smell', text: t.techniques.smell, color: sectorColors[7] },
    { id: 'count', text: t.techniques.count, color: sectorColors[8] },
    { id: 'breathe', text: t.techniques.breathe, color: sectorColors[9] },
  ];

  const handleWheelResult = (sector: typeof wheelSectors[0]) => {
    setCurrentResultId(sector.id);
    toast.success(`${t.wheelResult}: ${t.techniques[sector.id as keyof typeof t.techniques]}`);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        {/* Sidebar */}
        <Sidebar 
          className="border-r bg-background/95 backdrop-blur-sm"
          style={{ width: `${sidebarWidth}px`, minWidth: `${sidebarWidth}px` }}
        >
          <SidebarContent>
            {/* Language Selector */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/80 mb-1 uppercase tracking-wide">
                <Globe className="w-3 h-3 inline mr-1" />
                {t.language}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="p-2">
                  <Select value={language} onValueChange={(value: LanguageKey) => setLanguage(value)}>
                    <SelectTrigger className="w-full h-9 bg-green-50 border-2 border-green-400 text-green-700 font-medium rounded-md hover:bg-green-100">
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

            {/* Instructions */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/80 mb-1 uppercase tracking-wide">
                {t.instructions}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="p-2 text-sm text-muted-foreground">
                  {t.howToPlay}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Techniques List Preview */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/80 mb-1 uppercase tracking-wide">
                {t.instructions}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="p-2 space-y-1">
                  {wheelSectors.map((sector, index) => (
                    <div 
                      key={sector.id}
                      className="flex items-center gap-2 text-xs"
                    >
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: sector.color }}
                      />
                      <span className="truncate">{sector.text}</span>
                    </div>
                  ))}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Home Button */}
            <SidebarGroup className="mt-auto">
              <SidebarGroupContent>
                <div className="p-2">
                  <Button 
                    variant="outline" 
                    className="w-full h-10 bg-purple-50 border-2 border-purple-400 text-purple-700 font-medium hover:bg-purple-100"
                    onClick={() => navigate('/')}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    {t.back}
                  </Button>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          {/* Resize Handle */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-1 bg-border hover:bg-primary/50 cursor-col-resize transition-colors"
            onMouseDown={(e) => {
              e.preventDefault();
              const startX = e.clientX;
              const startWidth = sidebarWidth;
              
              const handleMouseMove = (e: MouseEvent) => {
                const diff = e.clientX - startX;
                const newWidth = Math.max(200, Math.min(400, startWidth + diff));
                setSidebarWidth(newWidth);
              };
              
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          />
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Sticky Header */}
          <header className="sticky top-0 z-40 flex items-center justify-between h-12 px-4 border-b bg-background/95 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="h-8 w-8" />
              <img src={numLitLogo} alt="NumLit" className="h-6 w-auto" />
              <h1 className="text-lg font-bold text-primary hidden sm:block">{t.title}</h1>
            </div>

            <div className="flex items-center gap-2">
              <ZoomControls zoom={zoom} onZoomChange={setZoom} className="hidden md:flex" />
              <Timer 
                isRunning={isTimerRunning}
                className="hidden sm:flex"
              />
              
              {/* Instructions Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Info className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t.howToPlayTitle}</DialogTitle>
                    <DialogDescription>{t.howToPlay}</DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              {/* Home Button */}
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => navigate('/')}
              >
                <Home className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Main Game Area */}
          <main 
            className="flex-1 overflow-auto p-4 md:p-6"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">{t.title}</h2>
                <p className="text-muted-foreground">{t.subtitle}</p>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
                {/* Spinning Wheel */}
                <div className="flex-shrink-0">
                  <SpinningWheel
                    sectors={wheelSectors}
                    onResult={handleWheelResult}
                    className="max-w-[500px]"
                  />
                </div>

                {/* Result Card */}
                {currentResultId && (
                  <Card className="w-full max-w-sm bg-gradient-to-br from-white to-pink-50 border-2 border-pink-200 shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-center text-pink-600">
                        {t.wheelResult}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <p className="text-xl font-semibold text-gray-800 mb-4">
                          {t.techniques[currentResultId as keyof typeof t.techniques]}
                        </p>
                        <div className="text-6xl mb-4">
                          {currentResultId === 'walk' && '🚶'}
                          {currentResultId === 'window' && '🪟'}
                          {currentResultId === 'friend' && '👥'}
                          {currentResultId === 'draw' && '🎨'}
                          {currentResultId === 'write' && '✍️'}
                          {currentResultId === 'music' && '🎵'}
                          {currentResultId === 'puzzle' && '🧩'}
                          {currentResultId === 'smell' && '🌸'}
                          {currentResultId === 'count' && '🔢'}
                          {currentResultId === 'breathe' && '🌬️'}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {t.howToPlay}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
