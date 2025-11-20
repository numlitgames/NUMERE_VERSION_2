import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarProvider } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { Sun, Moon, TreePine, Home, Play, RotateCw, Info, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "@/components/educational/ProgressBar";
import Timer from "@/components/educational/Timer";
import ShopPromoBox from "@/components/educational/ShopPromoBox";
import numLitLogo from "@/assets/numlit-logo.png";

const languages = {
  ro: { flag: "🇷🇴", name: "Română" }, en: { flag: "🇬🇧", name: "English" },
  de: { flag: "🇩🇪", name: "Deutsch" }, fr: { flag: "🇫🇷", name: "Français" },
  es: { flag: "🇪🇸", name: "Español" }, it: { flag: "🇮🇹", name: "Italiano" },
  hu: { flag: "🇭🇺", name: "Magyar" }, cs: { flag: "🇨🇿", name: "Čeština" },
  pl: { flag: "🇵🇱", name: "Polski" }, bg: { flag: "🇧🇬", name: "Български" },
  ru: { flag: "🇷🇺", name: "Русский" }, ar: { flag: "🇸🇦", name: "العربية" },
  pt: { flag: "🇵🇹", name: "Português" }, tr: { flag: "🇹🇷", name: "Türkçe" },
  el: { flag: "🇬🇷", name: "Ελληνικά" }, ja: { flag: "🇯🇵", name: "日本語" }
};

const gameLevels = ['1', '2', '3'];
const translations = {
  language: { ro: "Limbă", en: "Language", de: "Sprache", fr: "Langue", es: "Idioma", it: "Lingua", hu: "Nyelv", cs: "Jazyk", pl: "Język", bg: "Език", ru: "Язык", ar: "لغة", pt: "Idioma", tr: "Dil", el: "Γλώσσα", ja: "言語" },
  level: { ro: "Nivel", en: "Level", de: "Stufe", fr: "Niveau", es: "Nivel", it: "Livello", hu: "Szint", cs: "Úroveň", pl: "Poziom", bg: "Ниво", ru: "Уровень", ar: "مستوى", pt: "Nível", tr: "Seviye", el: "Επίπεδο", ja: "レベル" },
  gameTitle: { ro: "Orientare Naturală", en: "Natural Orientation", de: "Natürliche Orientierung", fr: "Orientation Naturelle", es: "Orientación Natural", it: "Orientamento Naturale", hu: "Természetes Tájékozódás", cs: "Přírodní Orientace", pl: "Orientacja Naturalna", bg: "Естествена Ориентация", ru: "Естественная Ориентация", ar: "التوجيه الطبيعي", pt: "Orientação Natural", tr: "Doğal Yönelim", el: "Φυσικός Προσανατολισμός", ja: "自然のオリエンテーション" }
};

interface Question {
  id: string;
  scene: 'zi' | 'noapte' | 'padure';
  prompt: string;
  options: string[];
  answer: string;
  explain: string;
}

const questions: Question[] = [
  {
    id: "q1",
    scene: "zi",
    prompt: "Dimineața, Soarele este în dreapta ta. În ce direcție privești?",
    options: ["N", "S", "E", "V"],
    answer: "S",
    explain: "Dimineața, Soarele este la Est. Dacă e în dreapta ta, privești spre Sud."
  },
  {
    id: "q2",
    scene: "zi",
    prompt: "La prânz, în emisfera nordică, umbra e cea mai scurtă și cade spre Nord. În ce parte este Soarele?",
    options: ["Nord", "Sud", "Est", "Vest"],
    answer: "Sud",
    explain: "La prânz, Soarele este aproximativ spre Sud (pentru emisfera nordică)."
  },
  {
    id: "q3",
    scene: "noapte",
    prompt: "Găsești Steaua Polară. Ce direcție indică?",
    options: ["Nord", "Sud", "Est", "Vest"],
    answer: "Nord",
    explain: "Steaua Polară indică aproape exact Nordul."
  },
  {
    id: "q4",
    scene: "padure",
    prompt: "Pe copaci, mușchiul e mai abundent pe o parte. În climatul temperat din România, care e de obicei acea parte?",
    options: ["Sud", "Nord", "Est", "Vest"],
    answer: "Nord",
    explain: "De obicei, partea nordică e mai umedă și mai umbrită, favorizând mușchiul."
  },
  {
    id: "q5",
    scene: "zi",
    prompt: "Soarele apune în stânga ta. În ce direcție privești?",
    options: ["Nord", "Sud", "Est", "Vest"],
    answer: "Nord",
    explain: "Apusul e spre Vest; dacă Vestul e la stânga, privești spre Nord."
  }
];

const OrientareNaturala = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState('ro');
  const [selectedLevel, setSelectedLevel] = useState('1');
  const [status, setStatus] = useState<'menu' | 'question' | 'feedback' | 'end'>('menu');
  const [score, setScore] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [timerPerQ, setTimerPerQ] = useState(30);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if (status === 'question' && timerPerQ > 0) {
      const interval = setInterval(() => {
        setTimerPerQ(prev => {
          if (prev <= 1) {
            setLastCorrect(false);
            setExplanation("Timpul a expirat. Ține minte indiciile naturale pentru orientare.");
            setStatus('feedback');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status, timerPerQ]);

  const startGame = () => {
    setScore(0);
    setQIndex(0);
    setTimerPerQ(30);
    setStatus('question');
  };

  const handleAnswer = (choice: string) => {
    const q = questions[qIndex];
    const isCorrect = choice === q.answer;
    
    setUserAnswer(choice);
    setLastCorrect(isCorrect);
    setExplanation(q.explain);
    
    if (isCorrect) {
      setScore(prev => prev + 10);
    }
    
    setStatus('feedback');
  };

  const nextQuestion = () => {
    const nextIndex = qIndex + 1;
    if (nextIndex >= questions.length) {
      setStatus('end');
    } else {
      setQIndex(nextIndex);
      setTimerPerQ(30);
      setStatus('question');
    }
  };

  const getSceneIcon = (scene: string) => {
    switch (scene) {
      case 'zi': return <Sun className="w-16 h-16 text-amber-500" />;
      case 'noapte': return <Moon className="w-16 h-16 text-indigo-400" />;
      case 'padure': return <TreePine className="w-16 h-16 text-emerald-600" />;
      default: return null;
    }
  };

  const getSceneGradient = (scene: string) => {
    switch (scene) {
      case 'zi': return 'from-sky-100 to-amber-50';
      case 'noapte': return 'from-indigo-900 to-purple-900';
      case 'padure': return 'from-emerald-100 to-green-200';
      default: return 'from-slate-100 to-slate-200';
    }
  };

  if (status === 'menu') {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <Sidebar className="w-44">
            <SidebarContent>
              <SidebarGroup className="mt-4">
                <SidebarGroupContent>
                  <div className="bg-green-50 border-2 border-green-300 rounded-lg p-1">
                    <div className="bg-white border-2 border-green-400 rounded-lg p-1 mb-1">
                      <div className="text-sm font-bold text-green-600 text-center">
                        {translations.language[lang as keyof typeof translations.language] || "Limbă"}
                      </div>
                    </div>
                    <Select value={lang} onValueChange={setLang}>
                      <SelectTrigger className="w-full h-6 text-xs border-green-300 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50 max-h-60 overflow-y-auto">
                        {Object.entries(languages).map(([code, { flag, name }]) => (
                          <SelectItem key={code} value={code} className="text-sm">
                            <span className="flex items-center gap-2">
                              <span>{flag}</span>
                              <span>{name}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarGroup className="mt-1">
                <SidebarGroupContent>
                  <div className="bg-violet-50 border-2 border-violet-300 rounded-lg p-1">
                    <div className="bg-white border-2 border-violet-400 rounded-lg p-1 mb-1">
                      <div className="text-sm font-bold text-violet-600 text-center">
                        {translations.level[lang as keyof typeof translations.level] || "Nivel"}
                      </div>
                    </div>
                    <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                      <SelectTrigger className="w-full h-6 text-xs border-violet-300 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        {gameLevels.map((lvl) => (
                          <SelectItem key={lvl} value={lvl} className="text-sm">
                            {translations.level[lang as keyof typeof translations.level]} {lvl}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
              <div className="mt-auto p-4">
                <ShopPromoBox language={lang} />
              </div>
            </SidebarContent>
          </Sidebar>
          <div className="flex-1 bg-gradient-to-b from-sky-50 to-blue-100 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full p-8 text-center space-y-6">
              <div className="flex justify-center gap-4">
                <Sun className="w-16 h-16 text-amber-500" />
                <Moon className="w-16 h-16 text-indigo-400" />
                <TreePine className="w-16 h-16 text-emerald-600" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">Orientare fără busolă</h1>
              <p className="text-muted-foreground text-lg">
                Descoperă cum să te orientezi folosind Soarele, stelele și indicii naturale!
              </p>
              <div className="space-y-3">
                <Button onClick={startGame} size="lg" className="w-full">
                  <Play className="mr-2" /> Start (mod clasic)
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                  onClick={() => toast.info("Alege direcția corectă folosind indicii naturale (Soarele, stelele, mușchiul, umbra). Ai timp limitat pentru fiecare întrebare.")}
                >
                  Instrucțiuni
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (status === 'question') {
    const q = questions[qIndex];
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <Sidebar className="w-44">
            <SidebarContent>
              <SidebarGroup className="mt-4">
                <SidebarGroupContent>
                  <div className="bg-green-50 border-2 border-green-300 rounded-lg p-1">
                    <div className="bg-white border-2 border-green-400 rounded-lg p-1 mb-1">
                      <div className="text-sm font-bold text-green-600 text-center">
                        {translations.language[lang as keyof typeof translations.language] || "Limbă"}
                      </div>
                    </div>
                    <Select value={lang} onValueChange={setLang}>
                      <SelectTrigger className="w-full h-6 text-xs border-green-300 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50 max-h-60 overflow-y-auto">
                        {Object.entries(languages).map(([code, { flag, name }]) => (
                          <SelectItem key={code} value={code} className="text-sm">
                            <span className="flex items-center gap-2">
                              <span>{flag}</span>
                              <span>{name}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarGroup className="mt-1">
                <SidebarGroupContent>
                  <div className="bg-violet-50 border-2 border-violet-300 rounded-lg p-1">
                    <div className="bg-white border-2 border-violet-400 rounded-lg p-1 mb-1">
                      <div className="text-sm font-bold text-violet-600 text-center">
                        {translations.level[lang as keyof typeof translations.level] || "Nivel"}
                      </div>
                    </div>
                    <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                      <SelectTrigger className="w-full h-6 text-xs border-violet-300 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        {gameLevels.map((lvl) => (
                          <SelectItem key={lvl} value={lvl} className="text-sm">
                            {translations.level[lang as keyof typeof translations.level]} {lvl}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
              <div className="mt-auto p-4">
                <ShopPromoBox language={lang} />
              </div>
            </SidebarContent>
          </Sidebar>
          <div className={`flex-1 flex flex-col bg-gradient-to-b ${getSceneGradient(q.scene)} ${q.scene === 'noapte' ? 'text-white' : ''}`}>
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-30">
              <ProgressBar 
                current={qIndex} 
                total={questions.length}
                showCelebration={false}
              />
            </div>
            <div className={`sticky top-0 z-20 border-b ${q.scene === 'noapte' ? 'bg-indigo-950/95 border-indigo-700' : 'bg-white/95'} backdrop-blur shadow-sm`}>
              <div className="flex h-16 items-center px-6 justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate('/')}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <Home className="h-5 w-5 text-green-600" />
                  </Button>
                  <img 
                    src={numLitLogo}
                    alt="NumLit Logo" 
                    className="h-10 w-auto object-contain"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <h1 className={`text-xl font-bold ${q.scene === 'noapte' ? 'text-yellow-400' : 'text-blue-700'}`}>
                    {translations.gameTitle[lang as keyof typeof translations.gameTitle]}
                  </h1>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Info className="w-4 h-4" />
                        Instrucțiuni
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Cum să te orientezi fără busolă</DialogTitle>
                        <DialogDescription>
                          Învață să folosești indicii naturale pentru orientare
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 p-4">
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h4 className="font-bold text-yellow-800 mb-2">☀️ Soarele</h4>
                          <p className="text-yellow-700">
                            Dimineața Soarele răsare aproximativ spre Est, iar seara apune spre Vest. 
                            La prânz (în emisfera nordică) e spre Sud.
                          </p>
                        </div>
                        <div className="bg-indigo-50 p-4 rounded-lg">
                          <h4 className="font-bold text-indigo-800 mb-2">🌟 Stelele</h4>
                          <p className="text-indigo-700">
                            Steaua Polară indică Nordul. O găsești prelungind latura mare a Ursului Mare.
                          </p>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-lg">
                          <h4 className="font-bold text-emerald-800 mb-2">🌲 Indicii naturale</h4>
                          <p className="text-emerald-700">
                            Mușchiul crește mai des spre Nord (partea mai umedă și umbrită). 
                            Coroana copacilor e mai deasă spre Sud (prinde mai multă lumină).
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex items-center gap-4">
                  <Timer displayValue={timerPerQ} />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    title={soundEnabled ? "Dezactivează sunetul" : "Activează sunetul"}
                  >
                    {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <Card className={`max-w-3xl w-full p-8 ${q.scene === 'noapte' ? 'bg-indigo-900/80 text-white border-indigo-600' : 'bg-white/90'}`}>
                <div className="flex flex-col items-center gap-6">
                  <div className="flex items-center gap-4">
                    {getSceneIcon(q.scene)}
                    <h2 className={`text-2xl font-bold ${q.scene === 'noapte' ? 'text-yellow-300' : 'text-foreground'}`}>
                      Întrebarea {qIndex + 1} din {questions.length}
                    </h2>
                  </div>
                  <p className={`text-xl text-center ${q.scene === 'noapte' ? 'text-white' : 'text-gray-700'}`}>
                    {q.prompt}
                  </p>
                  <div className="grid grid-cols-2 gap-4 w-full mt-4">
                    {q.options.map((opt) => (
                      <Button
                        key={opt}
                        onClick={() => handleAnswer(opt)}
                        size="lg"
                        variant={q.scene === 'noapte' ? 'secondary' : 'outline'}
                        className={`text-lg h-16 ${q.scene === 'noapte' ? 'bg-indigo-700 hover:bg-indigo-600 text-white border-indigo-500' : ''}`}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (status === 'feedback') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 text-center space-y-6">
          <h2 className={`text-3xl font-bold ${lastCorrect ? 'text-green-600' : 'text-orange-600'}`}>
            {lastCorrect ? '✓ Corect!' : '✗ Nu chiar…'}
          </h2>
          <p className="text-lg text-foreground">{explanation}</p>
          {lastCorrect && (
            <p className="text-2xl font-semibold text-primary">+10 puncte</p>
          )}
          <Button onClick={nextQuestion} size="lg" className="w-full">
            Continuă
          </Button>
        </Card>
      </div>
    );
  }

  if (status === 'end') {
    const maxScore = questions.length * 10;
    const percentage = (score / maxScore) * 100;
    let message = "";
    if (percentage >= 80) message = "Excelent! Ești un adevărat explorator!";
    else if (percentage >= 60) message = "Foarte bine! Mai exersează puțin.";
    else if (percentage >= 40) message = "Bine! Continuă să învăți.";
    else message = "Încearcă din nou! Poți mai bine!";

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Rezultate</h2>
          <div className="space-y-2">
            <p className="text-4xl font-bold text-primary">{score} / {maxScore}</p>
            <p className="text-lg text-muted-foreground">{message}</p>
          </div>
          <div className="space-y-3">
            <Button onClick={startGame} size="lg" className="w-full">
              <RotateCw className="mr-2" /> Reia
            </Button>
            <Button variant="outline" size="lg" className="w-full" onClick={() => setStatus('menu')}>
              <Home className="mr-2" /> Meniu
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return null;
};

export default OrientareNaturala;
