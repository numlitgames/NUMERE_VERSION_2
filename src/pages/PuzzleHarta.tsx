import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarProvider } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Map, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ShopPromoBox from "@/components/educational/ShopPromoBox";

const languages = {
  ro: { flag: "🇷🇴", name: "Română" },
  en: { flag: "🇬🇧", name: "English" },
  de: { flag: "🇩🇪", name: "Deutsch" },
  fr: { flag: "🇫🇷", name: "Français" },
  es: { flag: "🇪🇸", name: "Español" },
  it: { flag: "🇮🇹", name: "Italiano" },
  hu: { flag: "🇭🇺", name: "Magyar" },
  cs: { flag: "🇨🇿", name: "Čeština" },
  pl: { flag: "🇵🇱", name: "Polski" },
  bg: { flag: "🇧🇬", name: "Български" },
  ru: { flag: "🇷🇺", name: "Русский" },
  ar: { flag: "🇸🇦", name: "العربية" },
  pt: { flag: "🇵🇹", name: "Português" },
  tr: { flag: "🇹🇷", name: "Türkçe" },
  el: { flag: "🇬🇷", name: "Ελληνικά" },
  ja: { flag: "🇯🇵", name: "日本語" }
};

const gameLevels = ['1', '2', '3'];

const translations = {
  language: {
    ro: "Limbă", en: "Language", de: "Sprache", fr: "Langue",
    es: "Idioma", it: "Lingua", hu: "Nyelv", cs: "Jazyk",
    pl: "Język", bg: "Език", ru: "Язык", ar: "لغة",
    pt: "Idioma", tr: "Dil", el: "Γλώσσα", ja: "言語"
  },
  level: {
    ro: "Nivel", en: "Level", de: "Stufe", fr: "Niveau",
    es: "Nivel", it: "Livello", hu: "Szint", cs: "Úroveň",
    pl: "Poziom", bg: "Ниво", ru: "Уровень", ar: "مستوى",
    pt: "Nível", tr: "Seviye", el: "Επίπεδο", ja: "レベル"
  },
  gameTitle: {
    ro: "Puzzle Hartă", en: "Map Puzzle", de: "Karten-Puzzle", fr: "Puzzle Carte",
    es: "Puzzle de Mapa", it: "Puzzle Mappa", hu: "Térkép Puzzle", cs: "Mapové Puzzle",
    pl: "Puzzle Mapy", bg: "Пъзел с Карта", ru: "Пазл с Картой", ar: "لغز الخريطة",
    pt: "Quebra-Cabeça de Mapa", tr: "Harita Bulmacası", el: "Παζλ Χάρτη", ja: "地図パズル"
  }
};

export default function PuzzleHarta() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('ro');
  const [selectedLevel, setSelectedLevel] = useState('1');
  const [score, setScore] = useState(0);

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

        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate('/')}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <Home className="h-5 w-5 text-purple-600" />
                </Button>
                <div className="flex items-center gap-3">
                  <Map className="h-8 w-8 text-purple-600" />
                  <h1 className="text-2xl font-bold text-gray-800">
                    {translations.gameTitle[lang as keyof typeof translations.gameTitle]}
                  </h1>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Scor: {score}
              </Badge>
            </div>
          </header>

          <main className="flex-1 bg-gradient-to-br from-purple-50 to-pink-50 p-4">
            <div className="max-w-6xl mx-auto">
              <Card className="border-2 border-purple-300">
                <CardHeader>
                  <CardTitle className="text-2xl text-purple-700">
                    Jocul va fi disponibil în curând!
                  </CardTitle>
                  <CardDescription>
                    Pregătim pentru tine un puzzle interactiv al hărții mondiale. Învață geografía distrându-te!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">🧩 Puzzle Interactiv</h3>
                      <p className="text-sm text-muted-foreground">
                        Asamblează piese pentru a forma harta lumii
                      </p>
                    </div>
                    <div className="p-4 bg-pink-50 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">🎮 Niveluri de Dificultate</h3>
                      <p className="text-sm text-muted-foreground">
                        De la ușor la expert, potrivit pentru toate vârstele
                      </p>
                    </div>
                    <div className="p-4 bg-violet-50 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">🗺️ Regiuni Diverse</h3>
                      <p className="text-sm text-muted-foreground">
                        Europa, Asia, Africa, America și multe altele
                      </p>
                    </div>
                    <div className="p-4 bg-fuchsia-50 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">⏱️ Provocări pe Timp</h3>
                      <p className="text-sm text-muted-foreground">
                        Testează-ți viteza și precizia
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
