import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Globe, Home, Info, Sparkles, MapPin, Languages, Mountain, Users, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "@/components/educational/ProgressBar";
import LifeSystem from "@/components/educational/LifeSystem";
import ShopPromoBox from "@/components/educational/ShopPromoBox";
import numLitLogo from "@/assets/numlit-logo.png";
import { cn } from "@/lib/utils";

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
  continent: { ro: "Continent", en: "Continent", de: "Kontinent", fr: "Continent", es: "Continente", it: "Continente", hu: "Kontinens", cs: "Kontinent", pl: "Kontynent", bg: "Континент", ru: "Континент", ar: "قارة", pt: "Continente", tr: "Kıta", el: "Ήπειρος", ja: "大陸" },
  gameMode: { ro: "Mod Joc", en: "Game Mode", de: "Spielmodus", fr: "Mode de Jeu", es: "Modo de Juego", it: "Modalità di Gioco", hu: "Játék Mód", cs: "Herní Režim", pl: "Tryb Gry", bg: "Режим на Играта", ru: "Режим Игры", ar: "وضع اللعبة", pt: "Modo de Jogo", tr: "Oyun Modu", el: "Λειτουργία Παιχνιδιού", ja: "ゲームモード" },
  gameTitle: { ro: "Harta în Ceață", en: "Fog of Geography", de: "Nebel der Geographie", fr: "Brouillard de Géographie", es: "Niebla de Geografía", it: "Nebbia della Geografia", hu: "Földrajz Köd", cs: "Mlha Geografie", pl: "Mgła Geografii", bg: "Мъгла на Географията", ru: "Туман Географии", ar: "ضباب الجغرافيا", pt: "Nevoeiro da Geografia", tr: "Coğrafya Sisi", el: "Ομίχλη Γεωγραφίας", ja: "地理の霧" },
  backHome: { ro: "Înapoi Acasă", en: "Back Home", de: "Zurück", fr: "Retour", es: "Volver", it: "Torna", hu: "Vissza", cs: "Zpět", pl: "Powrót", bg: "Назад", ru: "Назад", ar: "عودة", pt: "Voltar", tr: "Geri", el: "Πίσω", ja: "戻る" },
  instructions: { ro: "Instrucțiuni", en: "Instructions", de: "Anleitung", fr: "Instructions", es: "Instrucciones", it: "Istruzioni", hu: "Utasítások", cs: "Instrukce", pl: "Instrukcje", bg: "Инструкции", ru: "Инструкции", ar: "تعليمات", pt: "Instruções", tr: "Talimatlar", el: "Οδηγίες", ja: "説明" },
  howToPlay: { ro: "Cum se joacă", en: "How to Play", de: "Spielanleitung", fr: "Comment Jouer", es: "Cómo Jugar", it: "Come Giocare", hu: "Hogyan Játszható", cs: "Jak Hrát", pl: "Jak Grać", bg: "Как да Играя", ru: "Как Играть", ar: "كيف تلعب", pt: "Como Jogar", tr: "Nasıl Oynanır", el: "Πώς να Παίξετε", ja: "遊び方" },
  objective: { ro: "🎯 Obiectiv", en: "🎯 Objective", de: "🎯 Ziel", fr: "🎯 Objectif", es: "🎯 Objetivo", it: "🎯 Obiettivo", hu: "🎯 Cél", cs: "🎯 Cíl", pl: "🎯 Cel", bg: "🎯 Цел", ru: "🎯 Цель", ar: "🎯 الهدف", pt: "🎯 Objetivo", tr: "🎯 Hedef", el: "🎯 Στόχος", ja: "🎯 目標" },
  objectiveText: { ro: "Degajează ceața de pe hartă ghicind țările din indicii! Primești 5 indicii progresive: capitala, limba, relieful, vecinii și o imagine blurată. Cu cât ghicești mai repede, cu atât mai multe puncte!", en: "Clear the fog from the map by guessing countries from clues! You get 5 progressive hints: capital, language, relief, neighbors, and a blurred image. The faster you guess, the more points!", de: "Lüfte den Nebel von der Karte, indem du Länder aus Hinweisen errätst! Du erhältst 5 progressive Hinweise: Hauptstadt, Sprache, Relief, Nachbarn und ein verschwommenes Bild. Je schneller du rätst, desto mehr Punkte!", fr: "Dissipez le brouillard de la carte en devinant les pays à partir d'indices! Vous obtenez 5 indices progressifs: capitale, langue, relief, voisins et une image floue. Plus vous devinez rapidement, plus vous gagnez de points!", es: "¡Despeja la niebla del mapa adivinando países a partir de pistas! Obtienes 5 pistas progresivas: capital, idioma, relieve, vecinos y una imagen borrosa. ¡Cuanto más rápido adivines, más puntos!", it: "Cancella la nebbia dalla mappa indovinando i paesi dagli indizi! Ricevi 5 suggerimenti progressivi: capitale, lingua, rilievo, vicini e un'immagine sfocata. Più velocemente indovini, più punti!", hu: "Távolítsd el a ködöt a térképről országok kitalálásával! 5 progresszív tippet kapsz: főváros, nyelv, domborzat, szomszédok és egy elmosódott kép. Minél gyorsabban találsz, annál több pontot!", cs: "Odstraňte mlhu z mapy hádáním zemí z nápověd! Dostanete 5 postupných nápověd: hlavní město, jazyk, reliéf, sousedé a rozmazaný obrázek. Čím rychleji hádáte, tím více bodů!", pl: "Usuń mgłę z mapy, odgadując kraje z podpowiedzi! Otrzymujesz 5 progresywnych wskazówek: stolica, język, rzeźba terenu, sąsiedzi i rozmyte zdjęcie. Im szybciej zgadniesz, tym więcej punktów!", bg: "Изчистете мъглата от картата, като познавате държави от подсказки! Получавате 5 прогресивни подсказки: столица, език, релеф, съседи и размазана снимка. Колкото по-бързо познаете, толкова повече точки!", ru: "Очистите туман с карты, угадывая страны по подсказкам! Вы получаете 5 прогрессивных подсказок: столица, язык, рельеф, соседи и размытое изображение. Чем быстрее угадаете, тем больше очков!", ar: "قم بإزالة الضباب من الخريطة عن طريق تخمين البلدان من الأدلة! تحصل على 5 تلميحات تدريجية: العاصمة واللغة والتضاريس والجيران وصورة غير واضحة. كلما خمنت أسرع، زادت النقاط!", pt: "Limpe o nevoeiro do mapa adivinhando países a partir de pistas! Você recebe 5 dicas progressivas: capital, idioma, relevo, vizinhos e uma imagem desfocada. Quanto mais rápido você adivinhar, mais pontos!", tr: "İpuçlarından ülkeleri tahmin ederek haritadaki sisi temizleyin! 5 aşamalı ipucu alırsınız: başkent, dil, rölyef, komşular ve bulanık bir görüntü. Ne kadar hızlı tahmin ederseniz, o kadar çok puan!", el: "Καθαρίστε την ομίχλη από το χάρτη μαντεύοντας χώρες από ενδείξεις! Λαμβάνετε 5 προοδευτικές υποδείξεις: πρωτεύουσα, γλώσσα, ανάγλυφο, γείτονες και μια θολή εικόνα. Όσο πιο γρήγορα μαντεύετε, τόσο περισσότεροι πόντοι!", ja: "ヒントから国を推測して地図から霧を取り除きましょう！5つの段階的なヒントがあります：首都、言語、地形、隣国、ぼやけた画像。早く推測するほど、より多くのポイント！" },
  modes: { ro: "🎮 Moduri de Joc", en: "🎮 Game Modes", de: "🎮 Spielmodi", fr: "🎮 Modes de Jeu", es: "🎮 Modos de Juego", it: "🎮 Modalità", hu: "🎮 Játékmódok", cs: "🎮 Herní Režimy", pl: "🎮 Tryby Gry", bg: "🎮 Режими на Играта", ru: "🎮 Режимы Игры", ar: "🎮 أوضاع اللعبة", pt: "🎮 Modos de Jogo", tr: "🎮 Oyun Modları", el: "🎮 Τρόποι Παιχνιδιού", ja: "🎮 ゲームモード" },
  normalMode: { ro: "Normal: 10 țări, 5 minute", en: "Normal: 10 countries, 5 minutes", de: "Normal: 10 Länder, 5 Minuten", fr: "Normal: 10 pays, 5 minutes", es: "Normal: 10 países, 5 minutos", it: "Normale: 10 paesi, 5 minuti", hu: "Normál: 10 ország, 5 perc", cs: "Normální: 10 zemí, 5 minut", pl: "Normalny: 10 krajów, 5 minut", bg: "Нормален: 10 държави, 5 минути", ru: "Обычный: 10 стран, 5 минут", ar: "عادي: 10 دول، 5 دقائق", pt: "Normal: 10 países, 5 minutos", tr: "Normal: 10 ülke, 5 dakika", el: "Κανονικό: 10 χώρες, 5 λεπτά", ja: "ノーマル：10カ国、5分" },
  bossMode: { ro: "Boss: 20 țări speedrun, 90 secunde!", en: "Boss: 20 countries speedrun, 90 seconds!", de: "Boss: 20 Länder Speedrun, 90 Sekunden!", fr: "Boss: 20 pays speedrun, 90 secondes!", es: "Boss: 20 países speedrun, ¡90 segundos!", it: "Boss: 20 paesi speedrun, 90 secondi!", hu: "Boss: 20 ország speedrun, 90 másodperc!", cs: "Boss: 20 zemí speedrun, 90 sekund!", pl: "Boss: 20 krajów speedrun, 90 sekund!", bg: "Бос: 20 държави speedrun, 90 секунди!", ru: "Босс: 20 стран спидран, 90 секунд!", ar: "بوس: 20 دولة سريعة، 90 ثانية!", pt: "Chefe: 20 países speedrun, 90 segundos!", tr: "Patron: 20 ülke hızlı koşu, 90 saniye!", el: "Αφεντικό: 20 χώρες speedrun, 90 δευτερόλεπτα!", ja: "ボス：20カ国スピードラン、90秒！" },
  quizMode: { ro: "Quiz: 3 nivele de dificultate", en: "Quiz: 3 difficulty levels", de: "Quiz: 3 Schwierigkeitsgrade", fr: "Quiz: 3 niveaux de difficulté", es: "Quiz: 3 niveles de dificultad", it: "Quiz: 3 livelli di difficoltà", hu: "Kvíz: 3 nehézségi szint", cs: "Kvíz: 3 úrovně obtížnosti", pl: "Quiz: 3 poziomy trudności", bg: "Тест: 3 нива на трудност", ru: "Викторина: 3 уровня сложности", ar: "اختبار: 3 مستويات صعوبة", pt: "Quiz: 3 níveis de dificuldade", tr: "Test: 3 zorluk seviyesi", el: "Κουίζ: 3 επίπεδα δυσκολίας", ja: "クイズ：3つの難易度レベル" },
  clues: { ro: "📝 Indicii", en: "📝 Clues", de: "📝 Hinweise", fr: "📝 Indices", es: "📝 Pistas", it: "📝 Indizi", hu: "📝 Tippek", cs: "📝 Nápovědy", pl: "📝 Wskazówki", bg: "📝 Подсказки", ru: "📝 Подсказки", ar: "📝 أدلة", pt: "📝 Pistas", tr: "📝 İpuçları", el: "📝 Ενδείξεις", ja: "📝 ヒント" },
  capital: { ro: "Capitala:", en: "Capital:", de: "Hauptstadt:", fr: "Capitale:", es: "Capital:", it: "Capitale:", hu: "Főváros:", cs: "Hlavní město:", pl: "Stolica:", bg: "Столица:", ru: "Столица:", ar: "العاصمة:", pt: "Capital:", tr: "Başkent:", el: "Πρωτεύουσα:", ja: "首都：" },
  language_label: { ro: "Limba:", en: "Language:", de: "Sprache:", fr: "Langue:", es: "Idioma:", it: "Lingua:", hu: "Nyelv:", cs: "Jazyk:", pl: "Język:", bg: "Език:", ru: "Язык:", ar: "اللغة:", pt: "Idioma:", tr: "Dil:", el: "Γλώσσα:", ja: "言語：" },
  relief: { ro: "Relief:", en: "Relief:", de: "Relief:", fr: "Relief:", es: "Relieve:", it: "Rilievo:", hu: "Domborzat:", cs: "Reliéf:", pl: "Rzeźba:", bg: "Релеф:", ru: "Рельеф:", ar: "التضاريس:", pt: "Relevo:", tr: "Rölyef:", el: "Ανάγλυφο:", ja: "地形：" },
  neighbors: { ro: "Vecini:", en: "Neighbors:", de: "Nachbarn:", fr: "Voisins:", es: "Vecinos:", it: "Vicini:", hu: "Szomszédok:", cs: "Sousedé:", pl: "Sąsiedzi:", bg: "Съседи:", ru: "Соседи:", ar: "الجيران:", pt: "Vizinhos:", tr: "Komşular:", el: "Γείτονες:", ja: "隣国：" },
  yourAnswer: { ro: "Scrie numele țării:", en: "Enter country name:", de: "Ländername eingeben:", fr: "Entrez le nom du pays:", es: "Ingrese el nombre del país:", it: "Inserisci il nome del paese:", hu: "Írja be az ország nevét:", cs: "Zadejte název země:", pl: "Wpisz nazwę kraju:", bg: "Въведете име на държава:", ru: "Введите название страны:", ar: "أدخل اسم الدولة:", pt: "Digite o nome do país:", tr: "Ülke adını girin:", el: "Εισάγετε όνομα χώρας:", ja: "国名を入力：" },
  submit: { ro: "Trimite", en: "Submit", de: "Senden", fr: "Soumettre", es: "Enviar", it: "Invia", hu: "Küldés", cs: "Odeslat", pl: "Wyślij", bg: "Изпрати", ru: "Отправить", ar: "إرسال", pt: "Enviar", tr: "Gönder", el: "Υποβολή", ja: "送信" },
  nextClue: { ro: "Indiciu Următor", en: "Next Clue", de: "Nächster Hinweis", fr: "Indice Suivant", es: "Siguiente Pista", it: "Prossimo Indizio", hu: "Következő Tipp", cs: "Další Nápověda", pl: "Następna Wskazówka", bg: "Следваща Подсказка", ru: "Следующая Подсказка", ar: "الدليل التالي", pt: "Próxima Pista", tr: "Sonraki İpucu", el: "Επόμενη Ένδειξη", ja: "次のヒント" },
  startGame: { ro: "Începe Jocul", en: "Start Game", de: "Spiel Starten", fr: "Commencer", es: "Comenzar", it: "Inizia", hu: "Kezdés", cs: "Začít Hru", pl: "Rozpocznij", bg: "Започни", ru: "Начать", ar: "ابدأ", pt: "Começar", tr: "Başla", el: "Έναρξη", ja: "開始" },
  continents: {
    europe: { ro: "Europa", en: "Europe", de: "Europa", fr: "Europe", es: "Europa", it: "Europa", hu: "Európa", cs: "Evropa", pl: "Europa", bg: "Европа", ru: "Европа", ar: "أوروبا", pt: "Europa", tr: "Avrupa", el: "Ευρώπη", ja: "ヨーロッパ" },
    asia: { ro: "Asia", en: "Asia", de: "Asien", fr: "Asie", es: "Asia", it: "Asia", hu: "Ázsia", cs: "Asie", pl: "Azja", bg: "Азия", ru: "Азия", ar: "آسيا", pt: "Ásia", tr: "Asya", el: "Ασία", ja: "アジア" },
    africa: { ro: "Africa", en: "Africa", de: "Afrika", fr: "Afrique", es: "África", it: "Africa", hu: "Afrika", cs: "Afrika", pl: "Afryka", bg: "Африка", ru: "Африка", ar: "أفريقيا", pt: "África", tr: "Afrika", el: "Αφρική", ja: "アフリカ" },
    northAmerica: { ro: "America de Nord", en: "North America", de: "Nordamerika", fr: "Amérique du Nord", es: "América del Norte", it: "Nord America", hu: "Észak-Amerika", cs: "Severní Amerika", pl: "Ameryka Północna", bg: "Северна Америка", ru: "Северная Америка", ar: "أمريكا الشمالية", pt: "América do Norte", tr: "Kuzey Amerika", el: "Βόρεια Αμερική", ja: "北米" },
    southAmerica: { ro: "America de Sud", en: "South America", de: "Südamerika", fr: "Amérique du Sud", es: "América del Sur", it: "Sud America", hu: "Dél-Amerika", cs: "Jižní Amerika", pl: "Ameryka Południowa", bg: "Южна Америка", ru: "Южная Америка", ar: "أمريكا الجنوبية", pt: "América do Sul", tr: "Güney Amerika", el: "Νότια Αμερική", ja: "南米" },
    oceania: { ro: "Oceania", en: "Oceania", de: "Ozeanien", fr: "Océanie", es: "Oceanía", it: "Oceania", hu: "Óceánia", cs: "Oceánie", pl: "Oceania", bg: "Океания", ru: "Океания", ar: "أوقيانوسيا", pt: "Oceania", tr: "Okyanusya", el: "Ωκεανία", ja: "オセアニア" }
  },
  encouragements: {
    correct1: { ro: "🎉 Excelent! Ești un adevărat explorator!", en: "🎉 Excellent! You're a true explorer!", de: "🎉 Ausgezeichnet! Du bist ein echter Entdecker!", fr: "🎉 Excellent! Vous êtes un vrai explorateur!", es: "¡Excelente! ¡Eres un verdadero explorador!", it: "🎉 Eccellente! Sei un vero esploratore!", hu: "🎉 Kiváló! Igazi felfedező vagy!", cs: "🎉 Skvělé! Jste pravý průzkumník!", pl: "🎉 Wspaniale! Jesteś prawdziwym odkrywcą!", bg: "🎉 Отлично! Ти си истински изследовател!", ru: "🎉 Отлично! Вы настоящий исследователь!", ar: "🎉 ممتاز! أنت مستكشف حقيقي!", pt: "🎉 Excelente! Você é um verdadeiro explorador!", tr: "🎉 Mükemmel! Gerçek bir kaşifsin!", el: "🎉 Εξαιρετικό! Είστε αληθινός εξερευνητής!", ja: "🎉 素晴らしい！あなたは真の探検家です！" },
    correct2: { ro: "⭐ Bravo! Cunoștințe geografice de top!", en: "⭐ Bravo! Top geographical knowledge!", de: "⭐ Bravo! Top geografisches Wissen!", fr: "⭐ Bravo! Connaissances géographiques au top!", es: "¡Bravo! ¡Conocimientos geográficos de primer nivel!", it: "⭐ Bravo! Conoscenze geografiche al top!", hu: "⭐ Bravó! Kiváló földrajzi tudás!", cs: "⭐ Bravo! Skvělé geografické znalosti!", pl: "⭐ Brawo! Najwyższa wiedza geograficzna!", bg: "⭐ Браво! Топ географски познания!", ru: "⭐ Браво! Отличные географические знания!", ar: "⭐ برافو! معرفة جغرافية من الدرجة الأولى!", pt: "⭐ Bravo! Conhecimento geográfico de primeira!", tr: "⭐ Bravo! En iyi coğrafi bilgi!", el: "⭐ Μπράβο! Κορυφαία γεωγραφική γνώση!", ja: "⭐ ブラボー！最高の地理知識！" },
    correct3: { ro: "🌟 Fantastic! Harta se dezvăluie!", en: "🌟 Fantastic! The map is revealed!", de: "🌟 Fantastisch! Die Karte wird enthüllt!", fr: "🌟 Fantastique! La carte se révèle!", es: "¡Fantástico! ¡El mapa se revela!", it: "🌟 Fantastico! La mappa si rivela!", hu: "🌟 Fantasztikus! A térkép felfedődik!", cs: "🌟 Fantastické! Mapa se odhaluje!", pl: "🌟 Fantastycznie! Mapa się ujawnia!", bg: "🌟 Фантастично! Картата се разкрива!", ru: "🌟 Фантастика! Карта раскрывается!", ar: "🌟 رائع! الخريطة تتكشف!", pt: "🌟 Fantástico! O mapa se revela!", tr: "🌟 Harika! Harita ortaya çıkıyor!", el: "🌟 Φανταστικό! Ο χάρτης αποκαλύπτεται!", ja: "🌟 素晴らしい！地図が明らかに！" },
    wrong: { ro: "💡 Aproape! Încearcă din nou sau cere un indiciu.", en: "💡 Almost! Try again or ask for a clue.", de: "💡 Fast! Versuche es nochmal oder frage nach einem Hinweis.", fr: "💡 Presque! Réessayez ou demandez un indice.", es: "¡Casi! Inténtalo de nuevo o pide una pista.", it: "💡 Quasi! Riprova o chiedi un indizio.", hu: "💡 Majdnem! Próbáld újra vagy kérj tippet.", cs: "💡 Skoro! Zkuste to znovu nebo požádejte o nápovědu.", pl: "💡 Prawie! Spróbuj ponownie lub poproś o wskazówkę.", bg: "💡 Почти! Опитай отново или поискай подсказка.", ru: "💡 Почти! Попробуйте снова або попросите подсказку.", ar: "💡 تقريبا! حاول مرة أخرى أو اطلب دليلاً.", pt: "💡 Quase! Tente novamente ou peça uma dica.", tr: "💡 Neredeyse! Tekrar deneyin veya ipucu isteyin.", el: "💡 Σχεδόν! Δοκιμάστε ξανά ή ζητήστε ένδειξη.", ja: "💡 惜しい！もう一度試すかヒントを求めてください。" }
  },
  congratulations: { ro: "Felicitări! Scor final:", en: "Congratulations! Final score:", de: "Glückwunsch! Endpunktzahl:", fr: "Félicitations! Score final:", es: "¡Felicitaciones! Puntuación final:", it: "Congratulazioni! Punteggio finale:", hu: "Gratulálok! Végső pontszám:", cs: "Gratulujeme! Konečné skóre:", pl: "Gratulacje! Wynik końcowy:", bg: "Поздравления! Краен резултат:", ru: "Поздравляем! Финальный счет:", ar: "تهانينا! النتيجة النهائية:", pt: "Parabéns! Pontuação final:", tr: "Tebrikler! Son skor:", el: "Συγχαρητήρια! Τελική βαθμολογία:", ja: "おめでとう！最終スコア：" }
};

type Continent = 'europe' | 'asia' | 'africa' | 'northAmerica' | 'southAmerica' | 'oceania';
type GameMode = 'normal' | 'boss' | 'quiz';

interface Country {
  name: { [key: string]: string };
  capital: { [key: string]: string };
  language: { [key: string]: string };
  relief: { [key: string]: string };
  neighbors: { [key: string]: string[] };
  flag: string;
  population: string;
  x: number;
  y: number;
  path: string;
  silhouette: string;
}

const countriesData: Record<Continent, Country[]> = {
  europe: [
    {
      name: { ro: "România", en: "Romania", de: "Rumänien", fr: "Roumanie", es: "Rumania", it: "Romania", hu: "Románia", cs: "Rumunsko", pl: "Rumunia", bg: "Румъния", ru: "Румыния", ar: "رومانيا", pt: "Romênia", tr: "Romanya", el: "Ρουμανία", ja: "ルーマニア" },
      capital: { ro: "București", en: "Bucharest", de: "Bukarest", fr: "Bucarest", es: "Bucarest", it: "Bucarest", hu: "Bukarest", cs: "Bukurešť", pl: "Bukareszt", bg: "Букурещ", ru: "Бухарест", ar: "بوخارست", pt: "Bucareste", tr: "Bükreş", el: "Βουκουρέστι", ja: "ブカレスト" },
      language: { ro: "Română", en: "Romanian", de: "Rumänisch", fr: "Roumain", es: "Rumano", it: "Rumeno", hu: "Román", cs: "Rumunština", pl: "Rumuński", bg: "Румънски", ru: "Румынский", ar: "الرومانية", pt: "Romeno", tr: "Rumence", el: "Ρουμανικά", ja: "ルーマニア語" },
      relief: { ro: "Munți Carpați, Câmpia Dunării", en: "Carpathian Mountains, Danube Plain", de: "Karpaten, Donauebene", fr: "Carpates, Plaine du Danube", es: "Cárpatos, Llanura del Danubio", it: "Carpazi, Pianura del Danubio", hu: "Kárpátok, Duna-síkság", cs: "Karpaty, Dunajská nížina", pl: "Karpaty, Nizina Dunaju", bg: "Карпати, Дунавска равнина", ru: "Карпаты, Дунайская равнина", ar: "جبال الكاربات، سهل الدانوب", pt: "Cárpatos, Planície do Danúbio", tr: "Karpat Dağları, Tuna Ovası", el: "Καρπάθια Όρη, Πεδιάδα του Δούναβη", ja: "カルパティア山脈、ドナウ平野" },
      neighbors: { ro: ["Ungaria", "Serbia", "Bulgaria", "Ucraina", "Moldova"], en: ["Hungary", "Serbia", "Bulgaria", "Ukraine", "Moldova"], de: ["Ungarn", "Serbien", "Bulgarien", "Ukraine", "Moldawien"], fr: ["Hongrie", "Serbie", "Bulgarie", "Ukraine", "Moldavie"], es: ["Hungría", "Serbia", "Bulgaria", "Ucrania", "Moldavia"], it: ["Ungheria", "Serbia", "Bulgaria", "Ucraina", "Moldavia"], hu: ["Magyarország", "Szerbia", "Bulgária", "Ukrajna", "Moldova"], cs: ["Maďarsko", "Srbsko", "Bulharsko", "Ukrajina", "Moldavsko"], pl: ["Węgry", "Serbia", "Bułgaria", "Ukraina", "Mołdawia"], bg: ["Унгария", "Сърбия", "България", "Украйна", "Молдова"], ru: ["Венгрия", "Сербия", "Болгария", "Украина", "Молдова"], ar: ["المجر", "صربيا", "بلغاريا", "أوكرانيا", "مولدوفا"], pt: ["Hungria", "Sérvia", "Bulgária", "Ucrânia", "Moldávia"], tr: ["Macaristan", "Sırbistan", "Bulgaristan", "Ukrayna", "Moldova"], el: ["Ουγγαρία", "Σερβία", "Βουλγαρία", "Ουκρανία", "Μολδαβία"], ja: ["ハンガリー", "セルビア", "ブルガリア", "ウクライナ", "モルドバ"] },
      flag: "🇷🇴",
      population: "19M",
      x: 520,
      y: 280,
      path: "M495,260 L510,255 L530,258 L545,265 L555,275 L555,290 L550,305 L535,310 L520,308 L500,300 L490,285 L490,270 Z",
      silhouette: "M30,15 L42,12 L58,14 L68,20 L72,30 L72,42 L68,52 L58,56 L45,54 L32,48 L28,38 L28,25 Z"
    },
    {
      name: { ro: "Franța", en: "France", de: "Frankreich", fr: "France", es: "Francia", it: "Francia", hu: "Franciaország", cs: "Francie", pl: "Francja", bg: "Франция", ru: "Франция", ar: "فرنسا", pt: "França", tr: "Fransa", el: "Γαλλία", ja: "フランス" },
      capital: { ro: "Paris", en: "Paris", de: "Paris", fr: "Paris", es: "París", it: "Parigi", hu: "Párizs", cs: "Paříž", pl: "Paryż", bg: "Париж", ru: "Париж", ar: "باريس", pt: "Paris", tr: "Paris", el: "Παρίσι", ja: "パリ" },
      language: { ro: "Franceză", en: "French", de: "Französisch", fr: "Français", es: "Francés", it: "Francese", hu: "Francia", cs: "Francouzština", pl: "Francuski", bg: "Френски", ru: "Французский", ar: "الفرنسية", pt: "Francês", tr: "Fransızca", el: "Γαλλικά", ja: "フランス語" },
      relief: { ro: "Munții Alpi, Pirinei, Câmpia Pariziană", en: "Alps, Pyrenees, Paris Basin", de: "Alpen, Pyrenäen, Pariser Becken", fr: "Alpes, Pyrénées, Bassin Parisien", es: "Alpes, Pirineos, Cuenca de París", it: "Alpi, Pirenei, Bacino di Parigi", hu: "Alpok, Pireneusok, Párizsi-medence", cs: "Alpy, Pyreneje, Pařížská pánev", pl: "Alpy, Pireneje, Basen Paryski", bg: "Алпи, Пиренеи, Парижки басейн", ru: "Альпы, Пиренеи, Парижский бассейн", ar: "جبال الألب، البرانس، حوض باريس", pt: "Alpes, Pirenéus, Bacia de Paris", tr: "Alpler, Pireneler, Paris Havzası", el: "Άλπεις, Πυρηναία, Λεκάνη των Παρισίων", ja: "アルプス山脈、ピレネー山脈、パリ盆地" },
      neighbors: { ro: ["Spania", "Belgia", "Germania", "Italia", "Elveția"], en: ["Spain", "Belgium", "Germany", "Italy", "Switzerland"], de: ["Spanien", "Belgien", "Deutschland", "Italien", "Schweiz"], fr: ["Espagne", "Belgique", "Allemagne", "Italie", "Suisse"], es: ["España", "Bélgica", "Alemania", "Italia", "Suiza"], it: ["Spagna", "Belgio", "Germania", "Italia", "Svizzera"], hu: ["Spanyolország", "Belgium", "Németország", "Olaszország", "Svájc"], cs: ["Španělsko", "Belgie", "Německo", "Itálie", "Švýcarsko"], pl: ["Hiszpania", "Belgia", "Niemcy", "Włochy", "Szwajcaria"], bg: ["Испания", "Белгия", "Германия", "Италия", "Швейцария"], ru: ["Испания", "Бельгия", "Германия", "Италия", "Швейцария"], ar: ["إسبانيا", "بلجيكا", "ألمانيا", "إيطاليا", "سويسرا"], pt: ["Espanha", "Bélgica", "Alemanha", "Itália", "Suíça"], tr: ["İspanya", "Belçika", "Almanya", "İtalya", "İsviçre"], el: ["Ισπανία", "Βέλγιο", "Γερμανία", "Ιταλία", "Ελβετία"], ja: ["スペイン", "ベルギー", "ドイツ", "イタリア", "スイス"] },
      flag: "🇫🇷",
      population: "67M",
      x: 280,
      y: 260,
      path: "M260,230 L275,225 L295,230 L305,245 L310,265 L305,285 L290,295 L275,298 L255,290 L245,270 L250,245 Z",
      silhouette: "M25,10 L38,8 L52,12 L58,25 L60,38 L56,50 L45,56 L32,58 L20,52 L15,38 L18,22 Z"
    },
    {
      name: { ro: "Germania", en: "Germany", de: "Deutschland", fr: "Allemagne", es: "Alemania", it: "Germania", hu: "Németország", cs: "Německo", pl: "Niemcy", bg: "Германия", ru: "Германия", ar: "ألمانيا", pt: "Alemanha", tr: "Almanya", el: "Γερμανία", ja: "ドイツ" },
      capital: { ro: "Berlin", en: "Berlin", de: "Berlin", fr: "Berlin", es: "Berlín", it: "Berlino", hu: "Berlin", cs: "Berlín", pl: "Berlin", bg: "Берлин", ru: "Берлин", ar: "برلين", pt: "Berlim", tr: "Berlin", el: "Βερολίνο", ja: "ベルリン" },
      language: { ro: "Germană", en: "German", de: "Deutsch", fr: "Allemand", es: "Alemán", it: "Tedesco", hu: "Német", cs: "Němčina", pl: "Niemiecki", bg: "Немски", ru: "Немецкий", ar: "الألمانية", pt: "Alemão", tr: "Almanca", el: "Γερμανικά", ja: "ドイツ語" },
      relief: { ro: "Câmpia Nord-Europeană, Munții Alpi", en: "North European Plain, Alps", de: "Norddeutsche Tiefebene, Alpen", fr: "Plaine d'Europe du Nord, Alpes", es: "Llanura del Norte de Europa, Alpes", it: "Pianura del Nord Europa, Alpi", hu: "Észak-európai-síkság, Alpok", cs: "Severoevropská nížina, Alpy", pl: "Nizina Północnoeuropejska, Alpy", bg: "Северноевропейска равнина, Алпи", ru: "Северо-Европейская равнина, Альпы", ar: "سهل شمال أوروبا، جبال الألب", pt: "Planície da Europa do Norte, Alpes", tr: "Kuzey Avrupa Ovası, Alpler", el: "Πεδιάδα Βόρειας Ευρώπης, Άλπεις", ja: "北ヨーロッパ平野、アルプス山脈" },
      neighbors: { ro: ["Franța", "Polonia", "Cehia", "Austria", "Danemarca"], en: ["France", "Poland", "Czech Republic", "Austria", "Denmark"], de: ["Frankreich", "Polen", "Tschechien", "Österreich", "Dänemark"], fr: ["France", "Pologne", "République tchèque", "Autriche", "Danemark"], es: ["Francia", "Polonia", "República Checa", "Austria", "Dinamarca"], it: ["Francia", "Polonia", "Repubblica Ceca", "Austria", "Danimarca"], hu: ["Franciaország", "Lengyelország", "Csehország", "Ausztria", "Dánia"], cs: ["Francie", "Polsko", "Česko", "Rakousko", "Dánsko"], pl: ["Francja", "Polska", "Czechy", "Austria", "Dania"], bg: ["Франция", "Полша", "Чехия", "Австрия", "Дания"], ru: ["Франция", "Польша", "Чехия", "Австрия", "Дания"], ar: ["فرنسا", "بولندا", "جمهورية التشيك", "النمسا", "الدنمارك"], pt: ["França", "Polônia", "República Tcheca", "Áustria", "Dinamarca"], tr: ["Fransa", "Polonya", "Çek Cumhuriyeti", "Avusturya", "Danimarka"], el: ["Γαλλία", "Πολωνία", "Τσεχία", "Αυστρία", "Δανία"], ja: ["フランス", "ポーランド", "チェコ共和国", "オーストリア", "デンマーク"] },
      flag: "🇩🇪",
      population: "83M",
      x: 380,
      y: 230,
      path: "M360,200 L375,195 L395,198 L410,205 L415,220 L410,240 L400,255 L385,260 L370,258 L355,245 L352,225 Z",
      silhouette: "M28,8 L40,5 L55,7 L65,12 L68,22 L65,38 L58,48 L45,52 L32,50 L22,40 L20,22 Z"
    },
    {
      name: { ro: "Italia", en: "Italy", de: "Italien", fr: "Italie", es: "Italia", it: "Italia", hu: "Olaszország", cs: "Itálie", pl: "Włochy", bg: "Италия", ru: "Италия", ar: "إيطاليا", pt: "Itália", tr: "İtalya", el: "Ιταλία", ja: "イタリア" },
      capital: { ro: "Roma", en: "Rome", de: "Rom", fr: "Rome", es: "Roma", it: "Roma", hu: "Róma", cs: "Řím", pl: "Rzym", bg: "Рим", ru: "Рим", ar: "روما", pt: "Roma", tr: "Roma", el: "Ρώμη", ja: "ローマ" },
      language: { ro: "Italiană", en: "Italian", de: "Italienisch", fr: "Italien", es: "Italiano", it: "Italiano", hu: "Olasz", cs: "Italština", pl: "Włoski", bg: "Италиански", ru: "Итальянский", ar: "الإيطالية", pt: "Italiano", tr: "İtalyanca", el: "Ιταλικά", ja: "イタリア語" },
      relief: { ro: "Munții Alpi, Apenini, Câmpia Padului", en: "Alps, Apennines, Po Valley", de: "Alpen, Apennin, Po-Ebene", fr: "Alpes, Apennins, Plaine du Pô", es: "Alpes, Apeninos, Llanura del Po", it: "Alpi, Appennini, Pianura Padana", hu: "Alpok, Appeninek, Pó-síkság", cs: "Alpy, Apeniny, Pádská nížina", pl: "Alpy, Apeniny, Nizina Padańska", bg: "Алпи, Апенини, Падска равнина", ru: "Альпы, Апеннины, Паданская равнина", ar: "جبال الألب، جبال الأبينيني، سهل بو", pt: "Alpes, Apeninos, Planície do Pó", tr: "Alpler, Apennin Dağları, Po Ovası", el: "Άλπεις, Απέννινα, Κοιλάδα του Πάδου", ja: "アルプス山脈、アペニン山脈、ポー平野" },
      neighbors: { ro: ["Franța", "Elveția", "Austria", "Slovenia"], en: ["France", "Switzerland", "Austria", "Slovenia"], de: ["Frankreich", "Schweiz", "Österreich", "Slowenien"], fr: ["France", "Suisse", "Autriche", "Slovénie"], es: ["Francia", "Suiza", "Austria", "Eslovenia"], it: ["Francia", "Svizzera", "Austria", "Slovenia"], hu: ["Franciaország", "Svájc", "Ausztria", "Szlovénia"], cs: ["Francie", "Švýcarsko", "Rakousko", "Slovinsko"], pl: ["Francja", "Szwajcaria", "Austria", "Słowenia"], bg: ["Франция", "Швейцария", "Австрия", "Словения"], ru: ["Франция", "Швейцария", "Австрия", "Словения"], ar: ["فرنسا", "سويسرا", "النمسا", "سلوفينيا"], pt: ["França", "Suíça", "Áustria", "Eslovênia"], tr: ["Fransa", "İsviçre", "Avusturya", "Slovenya"], el: ["Γαλλία", "Ελβετία", "Αυστρία", "Σλοβενία"], ja: ["フランス", "スイス", "オーストリア", "スロベニア"] },
      flag: "🇮🇹",
      population: "60M",
      x: 400,
      y: 300,
      path: "M395,265 L405,260 L415,265 L420,275 L425,295 L420,325 L415,345 L410,358 L405,350 L400,330 L395,310 L390,285 L388,270 Z",
      silhouette: "M42,20 L50,16 L58,20 L62,28 L66,42 L62,60 L58,72 L54,80 L50,74 L46,58 L42,42 L40,30 Z"
    },
    {
      name: { ro: "Spania", en: "Spain", de: "Spanien", fr: "Espagne", es: "España", it: "Spagna", hu: "Spanyolország", cs: "Španělsko", pl: "Hiszpania", bg: "Испания", ru: "Испания", ar: "إسبانيا", pt: "Espanha", tr: "İspanya", el: "Ισπανία", ja: "スペイン" },
      capital: { ro: "Madrid", en: "Madrid", de: "Madrid", fr: "Madrid", es: "Madrid", it: "Madrid", hu: "Madrid", cs: "Madrid", pl: "Madryt", bg: "Мадрид", ru: "Мадрид", ar: "مدريد", pt: "Madrid", tr: "Madrid", el: "Μαδρίτη", ja: "マドリード" },
      language: { ro: "Spaniolă", en: "Spanish", de: "Spanisch", fr: "Espagnol", es: "Español", it: "Spagnolo", hu: "Spanyol", cs: "Španělština", pl: "Hiszpański", bg: "Испански", ru: "Испанский", ar: "الإسبانية", pt: "Espanhol", tr: "İspanyolca", el: "Ισπανικά", ja: "スペイン語" },
      relief: { ro: "Platoul Meseta, Munții Pirinei", en: "Meseta Plateau, Pyrenees", de: "Meseta-Hochebene, Pyrenäen", fr: "Plateau de la Meseta, Pyrénées", es: "Meseta, Pirineos", it: "Altopiano della Meseta, Pirenei", hu: "Meseta-fennsík, Pireneusok", cs: "Meseta plošina, Pyreneje", pl: "Płaskowyż Meseta, Pireneje", bg: "Плато Месета, Пиренеи", ru: "Плато Месета, Пиренеи", ar: "هضبة ميسيتا، جبال البرانس", pt: "Planalto da Meseta, Pirenéus", tr: "Meseta Platosu, Pireneler", el: "Οροπέδιο Μεσέτα, Πυρηναία", ja: "メセタ高原、ピレネー山脈" },
      neighbors: { ro: ["Franța", "Portugalia"], en: ["France", "Portugal"], de: ["Frankreich", "Portugal"], fr: ["France", "Portugal"], es: ["Francia", "Portugal"], it: ["Francia", "Portogallo"], hu: ["Franciaország", "Portugália"], cs: ["Francie", "Portugalsko"], pl: ["Francja", "Portugalia"], bg: ["Франция", "Португалия"], ru: ["Франция", "Португалия"], ar: ["فرنسا", "البرتغال"], pt: ["França", "Portugal"], tr: ["Fransa", "Portekiz"], el: ["Γαλλία", "Πορτογαλία"], ja: ["フランス", "ポルトガル"] },
      flag: "🇪🇸",
      population: "47M",
      x: 180,
      y: 320,
      path: "M150,295 L170,290 L195,295 L215,305 L220,325 L215,345 L195,355 L170,355 L150,345 L145,325 L145,310 Z",
      silhouette: "M12,30 L25,26 L42,30 L55,38 L58,50 L55,62 L42,68 L25,68 L12,62 L8,50 L8,40 Z"
    }
  ],
  asia: [
    {
      name: { ro: "Japonia", en: "Japan", de: "Japan", fr: "Japon", es: "Japón", it: "Giappone", hu: "Japán", cs: "Japonsko", pl: "Japonia", bg: "Япония", ru: "Япония", ar: "اليابان", pt: "Japão", tr: "Japonya", el: "Ιαπωνία", ja: "日本" },
      capital: { ro: "Tokyo", en: "Tokyo", de: "Tokio", fr: "Tokyo", es: "Tokio", it: "Tokyo", hu: "Tokió", cs: "Tokio", pl: "Tokio", bg: "Токио", ru: "Токио", ar: "طوكيو", pt: "Tóquio", tr: "Tokyo", el: "Τόκιο", ja: "東京" },
      language: { ro: "Japoneză", en: "Japanese", de: "Japanisch", fr: "Japonais", es: "Japonés", it: "Giapponese", hu: "Japán", cs: "Japonština", pl: "Japoński", bg: "Японски", ru: "Японский", ar: "اليابانية", pt: "Japonês", tr: "Japonca", el: "Ιαπωνικά", ja: "日本語" },
      relief: { ro: "Insule muntoase, Muntele Fuji", en: "Mountainous islands, Mount Fuji", de: "Bergige Inseln, Berg Fuji", fr: "Îles montagneuses, Mont Fuji", es: "Islas montañosas, Monte Fuji", it: "Isole montuose, Monte Fuji", hu: "Hegyes szigetek, Fuji-hegy", cs: "Hornaté ostrovy, Hora Fuji", pl: "Górzyst wyspy, Góra Fuji", bg: "Планински острови, Планината Фуджи", ru: "Горные острова, Гора Фудзи", ar: "جزر جبلية، جبل فوجي", pt: "Ilhas montanhosas, Monte Fuji", tr: "Dağlık adalar, Fuji Dağı", el: "Ορεινά νησιά, Όρος Φούτζι", ja: "山岳島、富士山" },
      neighbors: { ro: ["fără vecini continentali"], en: ["no continental neighbors"], de: ["keine Festlandnachbarn"], fr: ["pas de voisins continentaux"], es: ["sin vecinos continentales"], it: ["senza vicini continentali"], hu: ["kontinentális szomszédok nélkül"], cs: ["žádní kontinentální sousedé"], pl: ["bez sąsiadów kontynentalnych"], bg: ["без континентални съседи"], ru: ["нет континентальных соседей"], ar: ["لا يوجد جيران قاريون"], pt: ["sem vizinhos continentais"], tr: ["kıtasal komşusu yok"], el: ["χωρίς ηπειρωτικούς γείτονες"], ja: ["大陸の隣国なし"] },
      flag: "🇯🇵",
      population: "126M",
      x: 680,
      y: 240,
      path: "M665,215 L675,210 L690,215 L700,225 L705,245 L700,270 L690,280 L680,275 L670,260 L665,240 Z",
      silhouette: "M20,8 L28,5 L40,8 L50,15 L54,28 L50,45 L40,52 L30,48 L22,38 L20,22 Z"
    },
    {
      name: { ro: "China", en: "China", de: "China", fr: "Chine", es: "China", it: "Cina", hu: "Kína", cs: "Čína", pl: "Chiny", bg: "Китай", ru: "Китай", ar: "الصين", pt: "China", tr: "Çin", el: "Κίνα", ja: "中国" },
      capital: { ro: "Beijing", en: "Beijing", de: "Peking", fr: "Pékin", es: "Pekín", it: "Pechino", hu: "Peking", cs: "Peking", pl: "Pekin", bg: "Пекин", ru: "Пекин", ar: "بكين", pt: "Pequim", tr: "Pekin", el: "Πεκίνο", ja: "北京" },
      language: { ro: "Chineză (Mandarin)", en: "Chinese (Mandarin)", de: "Chinesisch (Mandarin)", fr: "Chinois (Mandarin)", es: "Chino (Mandarín)", it: "Cinese (Mandarino)", hu: "Kínai (Mandarin)", cs: "Čínština (Mandarínština)", pl: "Chiński (Mandaryński)", bg: "Китайски (Мандарин)", ru: "Китайский (Мандарин)", ar: "الصينية (الماندرين)", pt: "Chinês (Mandarim)", tr: "Çince (Mandarin)", el: "Κινεζικά (Μανδαρινικά)", ja: "中国語（標準語）" },
      relief: { ro: "Platoul Tibet, Deșertul Gobi, Câmpii", en: "Tibetan Plateau, Gobi Desert, Plains", de: "Tibetisches Hochland, Wüste Gobi, Ebenen", fr: "Plateau tibétain, Désert de Gobi, Plaines", es: "Meseta tibetana, Desierto de Gobi, Llanuras", it: "Altopiano tibetano, Deserto del Gobi, Pianure", hu: "Tibeti-fennsík, Góbi-sivatag, Síkságok", cs: "Tibetská plošina, Poušť Gobi, Nížiny", pl: "Wyżyna Tybetańska, Pustynia Gobi, Niziny", bg: "Тибетско плато, пустиня Гоби, Равнини", ru: "Тибетское нагорье, Пустыня Гоби, Равнины", ar: "هضبة التبت، صحراء جوبي، السهول", pt: "Planalto Tibetano, Deserto de Gobi, Planícies", tr: "Tibet Platosu, Gobi Çölü, Ovalar", el: "Οροπέδιο του Θιβέτ, Έρημος Γκόμπι, Πεδιάδες", ja: "チベット高原、ゴビ砂漠、平野" },
      neighbors: { ro: ["Rusia", "India", "Mongolia", "Kazahstan", "Vietnam"], en: ["Russia", "India", "Mongolia", "Kazakhstan", "Vietnam"], de: ["Russland", "Indien", "Mongolei", "Kasachstan", "Vietnam"], fr: ["Russie", "Inde", "Mongolie", "Kazakhstan", "Vietnam"], es: ["Rusia", "India", "Mongolia", "Kazajstán", "Vietnam"], it: ["Russia", "India", "Mongolia", "Kazakistan", "Vietnam"], hu: ["Oroszország", "India", "Mongólia", "Kazahsztán", "Vietnám"], cs: ["Rusko", "Indie", "Mongolsko", "Kazachstán", "Vietnam"], pl: ["Rosja", "Indie", "Mongolia", "Kazachstan", "Wietnam"], bg: ["Русия", "Индия", "Монголия", "Казахстан", "Виетнам"], ru: ["Россия", "Индия", "Монголия", "Казахстан", "Вьетнам"], ar: ["روسيا", "الهند", "منغوليا", "كازاخستان", "فيتنام"], pt: ["Rússia", "Índia", "Mongólia", "Cazaquistão", "Vietnã"], tr: ["Rusya", "Hindistan", "Moğolistan", "Kazakistan", "Vietnam"], el: ["Ρωσία", "Ινδία", "Μογγολία", "Καζακστάν", "Βιετνάμ"], ja: ["ロシア", "インド", "モンゴル", "カザフスタン", "ベトナム"] },
      flag: "🇨🇳",
      population: "1.4B",
      x: 620,
      y: 250,
      path: "M590,220 L610,215 L640,225 L660,240 L665,260 L655,280 L635,290 L610,285 L590,270 L585,245 Z",
      silhouette: "M25,10 L38,8 L55,14 L68,22 L70,35 L64,48 L50,54 L35,50 L25,42 L22,25 Z"
    },
    {
      name: { ro: "India", en: "India", de: "Indien", fr: "Inde", es: "India", it: "India", hu: "India", cs: "Indie", pl: "Indie", bg: "Индия", ru: "Индия", ar: "الهند", pt: "Índia", tr: "Hindistan", el: "Ινδία", ja: "インド" },
      capital: { ro: "New Delhi", en: "New Delhi", de: "Neu-Delhi", fr: "New Delhi", es: "Nueva Delhi", it: "Nuova Delhi", hu: "Újdelhi", cs: "Nové Dillí", pl: "Nowe Delhi", bg: "Ню Делхи", ru: "Нью-Дели", ar: "نيودلهي", pt: "Nova Délhi", tr: "Yeni Delhi", el: "Νέο Δελχί", ja: "ニューデリー" },
      language: { ro: "Hindi, Engleză", en: "Hindi, English", de: "Hindi, Englisch", fr: "Hindi, Anglais", es: "Hindi, Inglés", it: "Hindi, Inglese", hu: "Hindi, Angol", cs: "Hindština, Angličtina", pl: "Hindi, Angielski", bg: "Хинди, Английски", ru: "Хинди, Английский", ar: "الهندية، الإنجليزية", pt: "Hindi, Inglês", tr: "Hintçe, İngilizce", el: "Χίντι, Αγγλικά", ja: "ヒンディー語、英語" },
      relief: { ro: "Munții Himalaya, Platoul Deccan", en: "Himalayas, Deccan Plateau", de: "Himalaya, Dekkan-Hochland", fr: "Himalaya, Plateau du Deccan", es: "Himalaya, Meseta del Decán", it: "Himalaya, Altopiano del Deccan", hu: "Himalája, Dekkán-fennsík", cs: "Himálaj, Dekánská plošina", pl: "Himalaje, Płaskowyż Dekanu", bg: "Хималаи, Плато Декан", ru: "Гималаи, Плато Декан", ar: "جبال الهيمالايا، هضبة الدكن", pt: "Himalaias, Planalto do Decão", tr: "Himalayalar, Deccan Platosu", el: "Ιμαλάια, Οροπέδιο Ντεκάν", ja: "ヒマラヤ山脈、デカン高原" },
      neighbors: { ro: ["Pakistan", "China", "Nepal", "Bangladesh", "Myanmar"], en: ["Pakistan", "China", "Nepal", "Bangladesh", "Myanmar"], de: ["Pakistan", "China", "Nepal", "Bangladesch", "Myanmar"], fr: ["Pakistan", "Chine", "Népal", "Bangladesh", "Myanmar"], es: ["Pakistán", "China", "Nepal", "Bangladés", "Myanmar"], it: ["Pakistan", "Cina", "Nepal", "Bangladesh", "Myanmar"], hu: ["Pakisztán", "Kína", "Nepál", "Banglades", "Mianmar"], cs: ["Pákistán", "Čína", "Nepál", "Bangladéš", "Myanmar"], pl: ["Pakistan", "Chiny", "Nepal", "Bangladesz", "Myanmar"], bg: ["Пакистан", "Китай", "Непал", "Бангладеш", "Мианмар"], ru: ["Пакистан", "Китай", "Непал", "Бангладеш", "Мьянма"], ar: ["باكستان", "الصين", "نيبال", "بنغلاديش", "ميانمار"], pt: ["Paquistão", "China", "Nepal", "Bangladesh", "Myanmar"], tr: ["Pakistan", "Çin", "Nepal", "Bangladeş", "Myanmar"], el: ["Πακιστάν", "Κίνα", "Νεπάλ", "Μπαγκλαντές", "Μιανμάρ"], ja: ["パキスタン", "中国", "ネパール", "バングラデシュ", "ミャンマー"] },
      flag: "🇮🇳",
      population: "1.4B",
      x: 580,
      y: 300,
      path: "M560,270 L575,265 L590,275 L600,295 L595,320 L580,335 L565,330 L555,310 L555,285 Z",
      silhouette: "M28,18 L38,15 L48,22 L54,35 L52,50 L42,60 L32,56 L26,42 L26,28 Z"
    }
  ],
  africa: [
    {
      name: { ro: "Egipt", en: "Egypt", de: "Ägypten", fr: "Égypte", es: "Egipto", it: "Egitto", hu: "Egyiptom", cs: "Egypt", pl: "Egipt", bg: "Египет", ru: "Египет", ar: "مصر", pt: "Egito", tr: "Mısır", el: "Αίγυπτος", ja: "エジプト" },
      capital: { ro: "Cairo", en: "Cairo", de: "Kairo", fr: "Le Caire", es: "El Cairo", it: "Il Cairo", hu: "Kairó", cs: "Káhira", pl: "Kair", bg: "Кайро", ru: "Каир", ar: "القاهرة", pt: "Cairo", tr: "Kahire", el: "Κάιρο", ja: "カイロ" },
      language: { ro: "Arabă", en: "Arabic", de: "Arabisch", fr: "Arabe", es: "Árabe", it: "Arabo", hu: "Arab", cs: "Arabština", pl: "Arabski", bg: "Арабски", ru: "Арабский", ar: "العربية", pt: "Árabe", tr: "Arapça", el: "Αραβικά", ja: "アラビア語" },
      relief: { ro: "Deșertul Sahara, Delta Nilului", en: "Sahara Desert, Nile Delta", de: "Sahara, Nildelta", fr: "Désert du Sahara, Delta du Nil", es: "Desierto del Sahara, Delta del Nilo", it: "Deserto del Sahara, Delta del Nilo", hu: "Szahara, Nílus-delta", cs: "Sahara, Delta Nilu", pl: "Pustynia Sahara, Delta Nilu", bg: "Сахара, Делтата на Нил", ru: "Сахара, Дельта Нила", ar: "الصحراء الكبرى، دلتا النيل", pt: "Deserto do Saara, Delta do Nilo", tr: "Sahra Çölü, Nil Deltası", el: "Σαχάρα, Δέλτα του Νείλου", ja: "サハラ砂漠、ナイルデルタ" },
      neighbors: { ro: ["Libia", "Sudan", "Israel"], en: ["Libya", "Sudan", "Israel"], de: ["Libyen", "Sudan", "Israel"], fr: ["Libye", "Soudan", "Israël"], es: ["Libia", "Sudán", "Israel"], it: ["Libia", "Sudan", "Israele"], hu: ["Líbia", "Szudán", "Izrael"], cs: ["Libye", "Súdán", "Izrael"], pl: ["Libia", "Sudan", "Izrael"], bg: ["Либия", "Судан", "Израел"], ru: ["Ливия", "Судан", "Израиль"], ar: ["ليبيا", "السودان", "إسرائيل"], pt: ["Líbia", "Sudão", "Israel"], tr: ["Libya", "Sudan", "İsrail"], el: ["Λιβύη", "Σουδάν", "Ισραήλ"], ja: ["リビア", "スーダン", "イスラエル"] },
      flag: "🇪🇬",
      population: "102M",
      x: 500,
      y: 310,
      path: "M480,290 L495,285 L515,290 L525,305 L525,325 L515,340 L495,345 L480,340 L475,320 Z",
      silhouette: "M30,20 L42,16 L56,20 L64,30 L64,45 L56,56 L42,60 L30,56 L26,42 Z"
    },
    {
      name: { ro: "Africa de Sud", en: "South Africa", de: "Südafrika", fr: "Afrique du Sud", es: "Sudáfrica", it: "Sudafrica", hu: "Dél-Afrika", cs: "Jižní Afrika", pl: "Republika Południowej Afryki", bg: "Южна Африка", ru: "Южная Африка", ar: "جنوب أفريقيا", pt: "África do Sul", tr: "Güney Afrika", el: "Νότια Αφρική", ja: "南アフリカ" },
      capital: { ro: "Pretoria/Cape Town", en: "Pretoria/Cape Town", de: "Pretoria/Kapstadt", fr: "Pretoria/Le Cap", es: "Pretoria/Ciudad del Cabo", it: "Pretoria/Città del Capo", hu: "Pretoria/Fokváros", cs: "Pretoria/Kapské Město", pl: "Pretoria/Kapsztad", bg: "Претория/Кейптаун", ru: "Претория/Кейптаун", ar: "بريتوريا/كيب تاون", pt: "Pretória/Cidade do Cabo", tr: "Pretoria/Cape Town", el: "Πρετόρια/Κέιπ Τάουν", ja: "プレトリア/ケープタウン" },
      language: { ro: "Engleză, Afrikaans, Zulu", en: "English, Afrikaans, Zulu", de: "Englisch, Afrikaans, Zulu", fr: "Anglais, Afrikaans, Zoulou", es: "Inglés, Afrikáans, Zulú", it: "Inglese, Afrikaans, Zulu", hu: "Angol, Afrikaans, Zulu", cs: "Angličtina, Afrikánština, Zulu", pl: "Angielski, Afrikaans, Zulu", bg: "Английски, Африканс, Зулу", ru: "Английский, Африкаанс, Зулу", ar: "الإنجليزية، الأفريكانية، الزولو", pt: "Inglês, Africâner, Zulu", tr: "İngilizce, Afrikanca, Zulu", el: "Αγγλικά, Αφρικάανς, Ζουλού", ja: "英語、アフリカーンス語、ズールー語" },
      relief: { ro: "Platoul Înalt, Munții Drakensberg", en: "High Plateau, Drakensberg Mountains", de: "Hochplateau, Drakensberge", fr: "Haut Plateau, Monts Drakensberg", es: "Meseta Alta, Montes Drakensberg", it: "Alto Altopiano, Monti Drakensberg", hu: "Magas-fennsík, Drakensberg-hegység", cs: "Vysoká plošina, Dračí hory", pl: "Wysoki Płaskowyż, Góry Smocze", bg: "Високо плато, Планините Дракенсберг", ru: "Высокое плато, Драконовы горы", ar: "الهضبة العالية، جبال دراكنزبرج", pt: "Planalto Alto, Montes Drakensberg", tr: "Yüksek Plato, Drakensberg Dağları", el: "Υψηλό Οροπέδιο, Όρη Ντράκενσμπεργκ", ja: "高原、ドラケンスバーグ山脈" },
      neighbors: { ro: ["Namibia", "Botswana", "Zimbabwe", "Mozambic"], en: ["Namibia", "Botswana", "Zimbabwe", "Mozambique"], de: ["Namibia", "Botswana", "Simbabwe", "Mosambik"], fr: ["Namibie", "Botswana", "Zimbabwe", "Mozambique"], es: ["Namibia", "Botsuana", "Zimbabue", "Mozambique"], it: ["Namibia", "Botswana", "Zimbabwe", "Mozambico"], hu: ["Namíbia", "Botswana", "Zimbabwe", "Mozambik"], cs: ["Namibie", "Botswana", "Zimbabwe", "Mosambik"], pl: ["Namibia", "Botswana", "Zimbabwe", "Mozambik"], bg: ["Намибия", "Ботсвана", "Зимбабве", "Мозамбик"], ru: ["Намибия", "Ботсвана", "Зимбабве", "Мозамбик"], ar: ["ناميبيا", "بوتسوانا", "زيمبابوي", "موزمبيق"], pt: ["Namíbia", "Botsuana", "Zimbábue", "Moçambique"], tr: ["Namibya", "Botsvana", "Zimbabve", "Mozambik"], el: ["Ναμίμπια", "Μποτσουάνα", "Ζιμπάμπουε", "Μοζαμβίκη"], ja: ["ナミビア", "ボツワナ", "ジンバブエ", "モザンビーク"] },
      flag: "🇿🇦",
      population: "59M",
      x: 480,
      y: 420,
      path: "M465,400 L480,395 L495,400 L505,415 L505,435 L495,448 L480,450 L465,445 L460,425 Z",
      silhouette: "M28,32 L38,28 L48,32 L54,42 L54,56 L48,66 L38,68 L28,64 L25,50 Z"
    }
  ],
  northAmerica: [
    {
      name: { ro: "SUA", en: "USA", de: "USA", fr: "États-Unis", es: "EE.UU.", it: "USA", hu: "USA", cs: "USA", pl: "USA", bg: "САЩ", ru: "США", ar: "الولايات المتحدة", pt: "EUA", tr: "ABD", el: "ΗΠΑ", ja: "アメリカ" },
      capital: { ro: "Washington D.C.", en: "Washington D.C.", de: "Washington D.C.", fr: "Washington D.C.", es: "Washington D.C.", it: "Washington D.C.", hu: "Washington D.C.", cs: "Washington D.C.", pl: "Waszyngton", bg: "Вашингтон", ru: "Вашингтон", ar: "واشنطن العاصمة", pt: "Washington D.C.", tr: "Washington D.C.", el: "Ουάσινγκτον", ja: "ワシントンD.C." },
      language: { ro: "Engleză", en: "English", de: "Englisch", fr: "Anglais", es: "Inglés", it: "Inglese", hu: "Angol", cs: "Angličtina", pl: "Angielski", bg: "Английски", ru: "Английский", ar: "الإنجليزية", pt: "Inglês", tr: "İngilizce", el: "Αγγλικά", ja: "英語" },
      relief: { ro: "Munții Stâncoși, Marile Câmpii, Appalaches", en: "Rocky Mountains, Great Plains, Appalachians", de: "Rocky Mountains, Great Plains, Appalachen", fr: "Montagnes Rocheuses, Grandes Plaines, Appalaches", es: "Montañas Rocosas, Grandes Llanuras, Apalaches", it: "Montagne Rocciose, Grandi Pianure, Appalachi", hu: "Sziklás-hegység, Nagy-síkság, Appalache-hegység", cs: "Skalnaté hory, Velké pláně, Apalačské hory", pl: "Góry Skaliste, Wielkie Równiny, Appalachy", bg: "Скалисти планини, Големи равнини, Апалачи", ru: "Скалистые горы, Великие равнины, Аппалачи", ar: "جبال روكي، السهول الكبرى، جبال الأبالاش", pt: "Montanhas Rochosas, Grandes Planícies, Apalaches", tr: "Rocky Dağları, Büyük Ovalar, Appalachian Dağları", el: "Βραχώδη Όρη, Μεγάλες Πεδιάδες, Απαλάχια", ja: "ロッキー山脈、グレートプレーンズ、アパラチア山脈" },
      neighbors: { ro: ["Canada", "Mexic"], en: ["Canada", "Mexico"], de: ["Kanada", "Mexiko"], fr: ["Canada", "Mexique"], es: ["Canadá", "México"], it: ["Canada", "Messico"], hu: ["Kanada", "Mexikó"], cs: ["Kanada", "Mexiko"], pl: ["Kanada", "Meksyk"], bg: ["Канада", "Мексико"], ru: ["Канада", "Мексика"], ar: ["كندا", "المكسيك"], pt: ["Canadá", "México"], tr: ["Kanada", "Meksika"], el: ["Καναδάς", "Μεξικό"], ja: ["カナダ", "メキシコ"] },
      flag: "🇺🇸",
      population: "331M",
      x: 180,
      y: 260,
      path: "M140,230 L165,225 L195,235 L215,250 L220,275 L210,295 L185,305 L160,300 L140,285 L135,255 Z",
      silhouette: "M15,18 L28,15 L45,22 L58,32 L62,45 L55,58 L38,64 L25,60 L15,50 L12,32 Z"
    },
    {
      name: { ro: "Canada", en: "Canada", de: "Kanada", fr: "Canada", es: "Canadá", it: "Canada", hu: "Kanada", cs: "Kanada", pl: "Kanada", bg: "Канада", ru: "Канада", ar: "كندا", pt: "Canadá", tr: "Kanada", el: "Καναδάς", ja: "カナダ" },
      capital: { ro: "Ottawa", en: "Ottawa", de: "Ottawa", fr: "Ottawa", es: "Ottawa", it: "Ottawa", hu: "Ottawa", cs: "Ottawa", pl: "Ottawa", bg: "Отава", ru: "Оттава", ar: "أوتاوا", pt: "Ottawa", tr: "Ottawa", el: "Οτάβα", ja: "オタワ" },
      language: { ro: "Engleză, Franceză", en: "English, French", de: "Englisch, Französisch", fr: "Anglais, Français", es: "Inglés, Francés", it: "Inglese, Francese", hu: "Angol, Francia", cs: "Angličtina, Francouzština", pl: "Angielski, Francuski", bg: "Английски, Френски", ru: "Английский, Французский", ar: "الإنجليزية، الفرنسية", pt: "Inglês, Francês", tr: "İngilizce, Fransızca", el: "Αγγλικά, Γαλλικά", ja: "英語、フランス語" },
      relief: { ro: "Munții Stâncoși, Câmpiile Centrale, Scutul Canadian", en: "Rocky Mountains, Central Plains, Canadian Shield", de: "Rocky Mountains, Zentrale Ebenen, Kanadischer Schild", fr: "Montagnes Rocheuses, Plaines Centrales, Bouclier canadien", es: "Montañas Rocosas, Llanuras Centrales, Escudo Canadiense", it: "Montagne Rocciose, Pianure Centrali, Scudo Canadese", hu: "Sziklás-hegység, Központi-síkság, Kanadai-pajzs", cs: "Skalnaté hory, Centrální pláně, Kanadský štít", pl: "Góry Skaliste, Równiny Centralne, Tarcza Kanadyjska", bg: "Скалисти планини, Централни равнини, Канадски щит", ru: "Скалистые горы, Центральные равнины, Канадский щит", ar: "جبال روكي، السهول المركزية، الدرع الكندي", pt: "Montanhas Rochosas, Planícies Centrais, Escudo Canadense", tr: "Rocky Dağları, Merkezi Ovalar, Kanada Kalkanı", el: "Βραχώδη Όρη, Κεντρικές Πεδ��άδες, Καναδική Ασπίδα", ja: "ロッキー山脈、中央平野、カナダ楯状地" },
      neighbors: { ro: ["SUA"], en: ["USA"], de: ["USA"], fr: ["États-Unis"], es: ["EE.UU."], it: ["USA"], hu: ["USA"], cs: ["USA"], pl: ["USA"], bg: ["САЩ"], ru: ["США"], ar: ["الولايات المتحدة"], pt: ["EUA"], tr: ["ABD"], el: ["ΗΠΑ"], ja: ["アメリカ"] },
      flag: "🇨🇦",
      population: "38M",
      x: 180,
      y: 180,
      path: "M135,150 L165,145 L195,155 L220,170 L225,190 L215,210 L190,220 L160,215 L140,200 L130,175 Z",
      silhouette: "M12,8 L28,5 L45,12 L62,22 L66,35 L58,48 L40,55 L25,52 L15,42 L10,25 Z"
    }
  ],
  southAmerica: [
    {
      name: { ro: "Brazilia", en: "Brazil", de: "Brasilien", fr: "Brésil", es: "Brasil", it: "Brasile", hu: "Brazília", cs: "Brazílie", pl: "Brazylia", bg: "Бразилия", ru: "Бразилия", ar: "البرازيل", pt: "Brasil", tr: "Brezilya", el: "Βραζιλία", ja: "ブラジル" },
      capital: { ro: "Brasília", en: "Brasília", de: "Brasília", fr: "Brasília", es: "Brasilia", it: "Brasília", hu: "Brasília", cs: "Brasília", pl: "Brasília", bg: "Бразилия", ru: "Бразилиа", ar: "برازيليا", pt: "Brasília", tr: "Brasília", el: "Μπραζίλια", ja: "ブラジリア" },
      language: { ro: "Portugheză", en: "Portuguese", de: "Portugiesisch", fr: "Portugais", es: "Portugués", it: "Portoghese", hu: "Portugál", cs: "Portugalština", pl: "Portugalski", bg: "Португалски", ru: "Португальский", ar: "البرتغالية", pt: "Português", tr: "Portekizce", el: "Πορτογαλικά", ja: "ポルトガル語" },
      relief: { ro: "Pădurea Amazoniană, Platoul Braziliei", en: "Amazon Rainforest, Brazilian Plateau", de: "Amazonas-Regenwald, Brasilianisches Hochland", fr: "Forêt amazonienne, Plateau brésilien", es: "Selva amazónica, Meseta brasileña", it: "Foresta amazzonica, Altopiano brasiliano", hu: "Amazonas-esőerdő, Brazil-fennsík", cs: "Amazonský prales, Brazilská plošina", pl: "Las Amazoński, Wyżyna Brazylijska", bg: "Амазонска гора, Бразилско плато", ru: "Амазонские леса, Бразильское плоскогорье", ar: "غابات الأمازون، هضبة البرازيل", pt: "Floresta Amazônica, Planalto Brasileiro", tr: "Amazon Yağmur Ormanları, Brezilya Platosu", el: "Τροπικό Δάσος του Αμαζονίου, Οροπέδιο της Βραζιλίας", ja: "アマゾン熱帯雨林、ブラジル高原" },
      neighbors: { ro: ["Argentina", "Peru", "Columbia", "Venezuela", "Guyana"], en: ["Argentina", "Peru", "Colombia", "Venezuela", "Guyana"], de: ["Argentinien", "Peru", "Kolumbien", "Venezuela", "Guyana"], fr: ["Argentine", "Pérou", "Colombie", "Venezuela", "Guyana"], es: ["Argentina", "Perú", "Colombia", "Venezuela", "Guyana"], it: ["Argentina", "Perù", "Colombia", "Venezuela", "Guyana"], hu: ["Argentína", "Peru", "Kolumbia", "Venezuela", "Guyana"], cs: ["Argentina", "Peru", "Kolumbie", "Venezuela", "Guyana"], pl: ["Argentyna", "Peru", "Kolumbia", "Wenezuela", "Gujana"], bg: ["Аржентина", "Перу", "Колумбия", "Венецуела", "Гвиана"], ru: ["Аргентина", "Перу", "Колумбия", "Венесуэла", "Гайана"], ar: ["الأرجنتين", "بيرو", "كولومبيا", "فنزويلا", "غيانا"], pt: ["Argentina", "Peru", "Colômbia", "Venezuela", "Guiana"], tr: ["Arjantin", "Peru", "Kolombiya", "Venezuela", "Guyana"], el: ["Αργεντινή", "Περού", "Κολομβία", "Βενεζουέλα", "Γουιάνα"], ja: ["アルゼンチン", "ペルー", "コロンビア", "ベネズエラ", "ガイアナ"] },
      flag: "🇧🇷",
      population: "212M",
      x: 280,
      y: 380,
      path: "M255,355 L275,350 L300,360 L315,380 L315,405 L300,420 L275,425 L255,415 L245,390 Z",
      silhouette: "M22,28 L35,25 L50,32 L60,45 L60,62 L50,72 L35,76 L22,68 L18,50 Z"
    }
  ],
  oceania: [
    {
      name: { ro: "Australia", en: "Australia", de: "Australien", fr: "Australie", es: "Australia", it: "Australia", hu: "Ausztrália", cs: "Austrálie", pl: "Australia", bg: "Австралия", ru: "Австралия", ar: "أستراليا", pt: "Austrália", tr: "Avustralya", el: "Αυστραλία", ja: "オーストラリア" },
      capital: { ro: "Canberra", en: "Canberra", de: "Canberra", fr: "Canberra", es: "Canberra", it: "Canberra", hu: "Canberra", cs: "Canberra", pl: "Canberra", bg: "Канбера", ru: "Канберра", ar: "كانبرا", pt: "Canberra", tr: "Canberra", el: "Καμπέρα", ja: "キャンベラ" },
      language: { ro: "Engleză", en: "English", de: "Englisch", fr: "Anglais", es: "Inglés", it: "Inglese", hu: "Angol", cs: "Angličtina", pl: "Angielski", bg: "Английски", ru: "Английский", ar: "الإنجليزية", pt: "Inglês", tr: "İngilizce", el: "Αγγλικά", ja: "英語" },
      relief: { ro: "Deșertul Mare, Marele Bazin Artezian", en: "Great Desert, Great Artesian Basin", de: "Große Wüste, Großes Artesisches Becken", fr: "Grand Désert, Grand Bassin Artésien", es: "Gran Desierto, Gran Cuenca Artesiana", it: "Grande Deserto, Grande Bacino Artesiano", hu: "Nagy-sivatag, Nagy-artézi-medence", cs: "Velká poušť, Velká artézská pánev", pl: "Wielka Pustynia, Wielki Basen Artezyjski", bg: "Голяма пустиня, Голям артезиански басейн", ru: "Большая пустыня, Большой артезианский бассейн", ar: "الصحراء الكبرى، الحوض الأرتوازي الكبير", pt: "Grande Deserto, Grande Bacia Artesiana", tr: "Büyük Çöl, Büyük Artezyen Havzası", el: "Μεγάλη Έρημος, Μεγάλη Αρτεσιανή Λεκάνη", ja: "大砂漠、大鑚井盆地" },
      neighbors: { ro: ["fără vecini continentali"], en: ["no continental neighbors"], de: ["keine Festlandnachbarn"], fr: ["pas de voisins continentaux"], es: ["sin vecinos continentales"], it: ["senza vicini continentali"], hu: ["kontinentális szomszédok nélkül"], cs: ["žádní kontinentální sousedé"], pl: ["bez sąsiadów kontynentalnych"], bg: ["без континентални съседи"], ru: ["нет континентальных соседей"], ar: ["لا يوجد جيران قاريون"], pt: ["sem vizinhos continentais"], tr: ["kıtasal komşusu yok"], el: ["χωρίς ηπειρωτικούς γείτονες"], ja: ["大陸の隣国なし"] },
      flag: "🇦🇺",
      population: "25M",
      x: 680,
      y: 400,
      path: "M640,380 L670,375 L700,385 L720,405 L720,425 L700,440 L670,445 L640,435 L625,415 Z",
      silhouette: "M20,30 L38,26 L58,32 L70,45 L70,60 L58,70 L38,74 L20,66 L12,50 Z"
    }
  ]
};

export default function TariCapitale() {
  const navigate = useNavigate();
  const [lang, setLang] = useState<string>('ro');
  const [selectedLevel, setSelectedLevel] = useState<string>('1');
  const [selectedContinent, setSelectedContinent] = useState<Continent>('europe');
  const [gameMode, setGameMode] = useState<GameMode>('normal');
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [revealedCountries, setRevealedCountries] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [countriesRemaining, setCountriesRemaining] = useState(10);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState<string>('');

  // Auto-start game on mount
  useEffect(() => {
    startGame();
  }, []);

  const getRandomCountry = () => {
    const countries = countriesData[selectedContinent];
    const unrevealedCountries = countries.filter(
      c => !revealedCountries.includes(c.name[lang])
    );
    if (unrevealedCountries.length === 0) return null;
    return unrevealedCountries[Math.floor(Math.random() * unrevealedCountries.length)];
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setRevealedCountries([]);
    setCurrentHintIndex(0);
    setUserAnswer('');
    setFeedback('');
    setLives(3);
    
    if (gameMode === 'normal') {
      setTimeRemaining(300);
      setCountriesRemaining(10);
    } else if (gameMode === 'boss') {
      setTimeRemaining(90);
      setCountriesRemaining(20);
    } else {
      setTimeRemaining(300);
      setCountriesRemaining(10);
    }
    
    const country = getRandomCountry();
    setCurrentCountry(country);
  };

  useEffect(() => {
    if (!isPlaying || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsPlaying(false);
          toast.error(translations.encouragements.wrong[lang as keyof typeof translations.encouragements.wrong]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isPlaying, timeRemaining, lang]);

  const checkAnswer = () => {
    if (!currentCountry) return;
    
    const correctName = currentCountry.name[lang].toLowerCase();
    const userAnswerNormalized = userAnswer.trim().toLowerCase();
    
    if (correctName === userAnswerNormalized) {
      // Correct answer
      const bonusPoints = Math.max(50 - (currentHintIndex * 10), 10);
      setScore(prev => prev + bonusPoints);
      setRevealedCountries(prev => [...prev, currentCountry.name[lang]]);
      
      const encouragementKeys = ['correct1', 'correct2', 'correct3'] as const;
      const randomKey = encouragementKeys[Math.floor(Math.random() * encouragementKeys.length)];
      const encouragement = translations.encouragements[randomKey][lang as keyof typeof translations.encouragements.correct1];
      
      toast.success(encouragement);
      setFeedback(encouragement);
      
      // Next country
      setTimeout(() => {
        const newCountriesRemaining = countriesRemaining - 1;
        setCountriesRemaining(newCountriesRemaining);
        
        if (newCountriesRemaining <= 0) {
          setIsPlaying(false);
          toast.success(`🏆 ${translations.congratulations[lang as keyof typeof translations.congratulations]} ${score + bonusPoints}`);
          return;
        }
        
        const nextCountry = getRandomCountry();
        setCurrentCountry(nextCountry);
        setCurrentHintIndex(0);
        setUserAnswer('');
        setFeedback('');
      }, 2000);
    } else {
      // Wrong answer
      setLives(prev => Math.max(0, prev - 1));
      toast.error(translations.encouragements.wrong[lang as keyof typeof translations.encouragements.wrong]);
      setFeedback(translations.encouragements.wrong[lang as keyof typeof translations.encouragements.wrong]);
      
      if (lives <= 1) {
        setIsPlaying(false);
      }
    }
  };

  const nextHint = () => {
    if (currentHintIndex < 4) {
      setCurrentHintIndex(prev => prev + 1);
    }
  };

  const renderClues = () => {
    if (!currentCountry) return null;
    
    const clues = [
      { icon: <MapPin className="w-4 h-4" />, label: translations.capital[lang as keyof typeof translations.capital], value: currentCountry.capital[lang] },
      { icon: <Languages className="w-4 h-4" />, label: translations.language_label[lang as keyof typeof translations.language_label], value: currentCountry.language[lang] },
      { icon: <Mountain className="w-4 h-4" />, label: translations.relief[lang as keyof typeof translations.relief], value: currentCountry.relief[lang] },
      { icon: <Users className="w-4 h-4" />, label: translations.neighbors[lang as keyof typeof translations.neighbors], value: currentCountry.neighbors[lang].join(', ') }
    ];
    
    return (
      <div className="space-y-2">
        {clues.slice(0, currentHintIndex + 1).map((clue, idx) => (
          <Card key={idx} className={cn(
            "border-2 transition-all duration-500 animate-fade-in",
            idx === currentHintIndex ? "border-primary bg-primary/5 shadow-lg scale-105" : "border-muted"
          )}>
            <CardContent className="p-3 flex items-start gap-2">
              <div className="text-primary mt-0.5">{clue.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary">{clue.label}</p>
                <p className="text-base font-medium">{clue.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {currentHintIndex >= 4 && (
          <Card className="border-2 border-amber-300 bg-amber-50/50 animate-fade-in">
            <CardContent className="p-3 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <p className="text-sm font-semibold text-amber-700">
                  {currentCountry.flag} {currentCountry.population}
                </p>
              </div>
              <svg viewBox="0 0 100 80" className="w-32 h-24">
                <path 
                  d={currentCountry.silhouette} 
                  className="fill-amber-200 stroke-amber-500 stroke-2"
                  style={{ 
                    filter: `blur(${Math.max(0, 5 - (currentHintIndex - 3))}px)`,
                    transition: 'filter 0.5s ease-out'
                  }}
                />
              </svg>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderMap = () => {
    return (
      <svg viewBox="0 0 800 600" className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
        {countriesData[selectedContinent].map((country, idx) => {
          const isRevealed = revealedCountries.includes(country.name[lang]);
          return (
            <g key={idx}>
              <path
                d={country.path}
                className={cn(
                  "transition-all duration-1000 stroke-2",
                  isRevealed 
                    ? "fill-green-400 stroke-green-600 opacity-100 drop-shadow-lg animate-scale-in" 
                    : "fill-gray-400 stroke-gray-500 opacity-30 blur-md"
                )}
              />
              {isRevealed && (
                <text
                  x={country.x}
                  y={country.y + 45}
                  className="text-xs font-bold fill-green-700 text-center animate-fade-in"
                  textAnchor="middle"
                >
                  {country.flag} {country.name[lang]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="w-32">
          <SidebarContent>
            <SidebarGroup className="mt-4">
              <SidebarGroupContent>
                <div className="space-y-1">
                  <div className="bg-green-50 border-2 border-green-300 rounded-lg p-1">
                    <div className="bg-white border-2 border-green-400 rounded-lg p-1 mb-1">
                      <div className="text-xs font-bold text-green-600 text-center">
                        {translations.language[lang as keyof typeof translations.language]}
                      </div>
                    </div>
                    <Select value={lang} onValueChange={setLang}>
                      <SelectTrigger className="w-full h-6 text-xs border-green-300 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50 max-h-60 overflow-y-auto">
                        {Object.entries(languages).map(([code, { flag, name }]) => (
                          <SelectItem key={code} value={code} className="text-xs">
                            {flag} {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-violet-50 border-2 border-violet-300 rounded-lg p-1">
                    <div className="bg-white border-2 border-violet-400 rounded-lg p-1 mb-1">
                      <div className="text-xs font-bold text-violet-600 text-center">
                        {translations.continent[lang as keyof typeof translations.continent]}
                      </div>
                    </div>
                    <Select value={selectedContinent} onValueChange={(v) => setSelectedContinent(v as Continent)}>
                      <SelectTrigger className="w-full h-6 text-xs border-violet-300 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        {Object.keys(countriesData).map((cont) => (
                          <SelectItem key={cont} value={cont} className="text-xs">
                            {translations.continents[cont as Continent][lang as keyof typeof translations.continents.europe]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-1">
                    <div className="bg-white border-2 border-amber-400 rounded-lg p-1 mb-1">
                      <div className="text-xs font-bold text-amber-600 text-center">
                        {translations.gameMode[lang as keyof typeof translations.gameMode]}
                      </div>
                    </div>
                    <Select value={gameMode} onValueChange={(v) => setGameMode(v as GameMode)}>
                      <SelectTrigger className="w-full h-6 text-xs border-amber-300 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="normal" className="text-xs">Normal</SelectItem>
                        <SelectItem value="boss" className="text-xs">Boss</SelectItem>
                        <SelectItem value="quiz" className="text-xs">Quiz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-auto p-2">
              <ShopPromoBox language={lang} />
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 bg-white border-b shadow-sm h-14 px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate('/')}
                className="h-9 w-9"
              >
                <Home className="h-4 w-4 text-amber-600" />
              </Button>
              <img src={numLitLogo} alt="NumLit" className="h-8" />
              <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Globe className="h-6 w-6 text-amber-600" />
                {translations.gameTitle[lang as keyof typeof translations.gameTitle]}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <LifeSystem totalLives={3} currentLives={lives} />
              <Badge variant="secondary" className="text-sm px-3 py-1">
                🏆 {score}
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                ⏱️ {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </Badge>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Info className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{translations.howToPlay[lang as keyof typeof translations.howToPlay]}</DialogTitle>
                    <DialogDescription className="space-y-4 text-left">
                      <div>
                        <h3 className="font-semibold text-base text-foreground mb-2">
                          {translations.objective[lang as keyof typeof translations.objective]}
                        </h3>
                        <p className="text-sm">
                          {translations.objectiveText[lang as keyof typeof translations.objectiveText]}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-base text-foreground mb-2">
                          {translations.modes[lang as keyof typeof translations.modes]}
                        </h3>
                        <ul className="text-sm space-y-1 list-disc list-inside">
                          <li>{translations.normalMode[lang as keyof typeof translations.normalMode]}</li>
                          <li>{translations.bossMode[lang as keyof typeof translations.bossMode]}</li>
                          <li>{translations.quizMode[lang as keyof typeof translations.quizMode]}</li>
                        </ul>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          <main className="flex-1 bg-gradient-to-br from-amber-50 to-orange-50 p-4 overflow-y-auto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Card className="border-2 border-blue-300">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Globe className="h-5 w-5 text-blue-600" />
                        Harta - {translations.continents[selectedContinent][lang as keyof typeof translations.continents.europe]}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-[4/3]">
                        {renderMap()}
                      </div>
                      <ProgressBar 
                        current={10 - countriesRemaining + revealedCountries.length} 
                        total={gameMode === 'boss' ? 20 : 10}
                        className="mt-3"
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Card className="border-2 border-purple-300">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        {translations.clues[lang as keyof typeof translations.clues]}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {renderClues()}
                      
                      {currentHintIndex < 4 && (
                        <Button
                          onClick={nextHint}
                          variant="outline"
                          className="w-full"
                        >
                          {translations.nextClue[lang as keyof typeof translations.nextClue]} ({currentHintIndex + 1}/5)
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-300">
                    <CardContent className="p-4 space-y-3">
                      <label className="text-sm font-semibold text-green-700">
                        {translations.yourAnswer[lang as keyof typeof translations.yourAnswer]}
                      </label>
                      <Input
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                        placeholder="..."
                        className="border-2 border-green-300 focus:border-green-500"
                      />
                      <Button
                        onClick={checkAnswer}
                        className="w-full bg-green-500 hover:bg-green-600"
                        disabled={!userAnswer.trim()}
                      >
                        {translations.submit[lang as keyof typeof translations.submit]}
                      </Button>
                      {feedback && (
                        <div className="text-center text-sm font-medium animate-fade-in">
                          {feedback}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}