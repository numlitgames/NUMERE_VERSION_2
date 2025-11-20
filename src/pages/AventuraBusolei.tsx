import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { Compass, Play, Pause, Home, RotateCw, Info, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "@/components/educational/ProgressBar";
import Timer from "@/components/educational/Timer";
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
  gameTitle: { ro: "Aventura Busolei", en: "Compass Adventure", de: "Kompass-Abenteuer", fr: "Aventure de la Boussole", es: "Aventura de la Brújula", it: "Avventura della Bussola", hu: "Iránytű Kaland", cs: "Dobrodružství s Kompasem", pl: "Przygoda z Kompasem", bg: "Приключение с Компас", ru: "Приключение с Компасом", ar: "مغامرة البوصلة", pt: "Aventura da Bússola", tr: "Pusula Macerası", el: "Περιπέτεια Πυξίδας", ja: "コンパスの冒険" },
  backToModules: { ro: "Înapoi la Module Educaționale", en: "Back to Educational Modules", de: "Zurück zu Bildungsmodulen", fr: "Retour aux modules éducatifs", es: "Volver a módulos educativos", it: "Torna ai moduli educativi", hu: "Vissza az oktatási modulokhoz", cs: "Zpět na vzdělávací moduly", pl: "Powrót do modułów edukacyjnych", bg: "Обратно към образователните модули", ru: "Вернуться к образовательным модулям", ar: "العودة إلى الوحدات التعليمية", pt: "Voltar aos módulos educacionais", tr: "Eğitim modüllerine geri dön", el: "Επιστροφή στις εκπαιδευτικές ενότητες", ja: "教育モジュールに戻る" },
  targetDirection: { ro: "Direcția țintă:", en: "Target direction:", de: "Zielrichtung:", fr: "Direction cible:", es: "Dirección objetivo:", it: "Direzione obiettivo:", hu: "Célirány:", cs: "Cílový směr:", pl: "Kierunek docelowy:", bg: "Целева посока:", ru: "Целевое направление:", ar: "الاتجاه المستهدف:", pt: "Direção alvo:", tr: "Hedef yön:", el: "Κατεύθυνση στόχου:", ja: "ターゲット方向:" },
  currentHeading: { ro: "Aliniere:", en: "Heading:", de: "Ausrichtung:", fr: "Cap:", es: "Rumbo:", it: "Direzione:", hu: "Irány:", cs: "Směr:", pl: "Kurs:", bg: "Курс:", ru: "Курс:", ar: "العنوان:", pt: "Rumo:", tr: "Yön:", el: "Πορεία:", ja: "方位:" },
  targetsRemaining: { ro: "Ținte rămase:", en: "Targets remaining:", de: "Verbleibende Ziele:", fr: "Cibles restantes:", es: "Objetivos restantes:", it: "Obiettivi rimanenti:", hu: "Hátralevő célok:", cs: "Zbývající cíle:", pl: "Pozostałe cele:", bg: "Останали цели:", ru: "Осталось целей:", ar: "الأهداف المتبقية:", pt: "Alvos restantes:", tr: "Kalan hedefler:", el: "Εναπομείναντες στόχοι:", ja: "残りターゲット:" },
  confirm: { ro: "Confirmă", en: "Confirm", de: "Bestätigen", fr: "Confirmer", es: "Confirmar", it: "Conferma", hu: "Megerősít", cs: "Potvrdit", pl: "Potwierdź", bg: "Потвърди", ru: "Подтвердить", ar: "تأكيد", pt: "Confirmar", tr: "Onayla", el: "Επιβεβαίωση", ja: "確認" },
  instructions: { ro: "Instrucțiuni", en: "Instructions", de: "Anleitung", fr: "Instructions", es: "Instrucciones", it: "Istruzioni", hu: "Utasítások", cs: "Instrukce", pl: "Instrukcje", bg: "Инструкции", ru: "Инструкции", ar: "تعليمات", pt: "Instruções", tr: "Talimatlar", el: "Οδηγίες", ja: "説明" },
  howToPlay: { ro: "Cum se joacă", en: "How to play", de: "Spielanleitung", fr: "Comment jouer", es: "Cómo jugar", it: "Come giocare", hu: "Hogyan kell játszani", cs: "Jak hrát", pl: "Jak grać", bg: "Как да играя", ru: "Как играть", ar: "كيف تلعب", pt: "Como jogar", tr: "Nasıl oynanır", el: "Πώς να παίξετε", ja: "遊び方" },
  learnCompass: { ro: "Învață să te orientezi cu busola!", en: "Learn to navigate with a compass!", de: "Lerne mit dem Kompass zu navigieren!", fr: "Apprenez à naviguer avec une boussole!", es: "¡Aprende a navegar con una brújula!", it: "Impara a navigare con una bussola!", hu: "Tanulj meg iránytűvel navigálni!", cs: "Naučte se navigovat s kompasem!", pl: "Naucz się nawigować kompasem!", bg: "Научете се да навигирате с компас!", ru: "Научитесь ориентироваться с компасом!", ar: "تعلم التنقل باستخدام البوصلة!", pt: "Aprenda a navegar com uma bússola!", tr: "Pusula ile gezinmeyi öğrenin!", el: "Μάθετε να πλοηγείστε με πυξίδα!", ja: "コンパスでナビゲートすることを学びましょう!" },
  objective: { ro: "🎯 Obiectiv", en: "🎯 Objective", de: "🎯 Ziel", fr: "🎯 Objectif", es: "🎯 Objetivo", it: "🎯 Obiettivo", hu: "🎯 Cél", cs: "🎯 Cíl", pl: "🎯 Cel", bg: "🎯 Цел", ru: "🎯 Цель", ar: "🎯 الهدف", pt: "🎯 Objetivo", tr: "🎯 Hedef", el: "🎯 Στόχος", ja: "🎯 目標" },
  objectiveText: { ro: "Rotește acul busolei spre direcția cerută. Ai un unghi de toleranță. Confirmă când ești aliniat corect.", en: "Rotate the compass needle to the required direction. You have a tolerance angle. Confirm when aligned correctly.", de: "Drehen Sie die Kompassnadel in die erforderliche Richtung. Sie haben einen Toleranzwinkel. Bestätigen Sie, wenn korrekt ausgerichtet.", fr: "Faites pivoter l'aiguille de la boussole vers la direction requise. Vous avez un angle de tolérance. Confirmez lorsque aligné correctement.", es: "Gira la aguja de la brújula hacia la dirección requerida. Tienes un ángulo de tolerancia. Confirma cuando esté alineado correctamente.", it: "Ruota l'ago della bussola nella direzione richiesta. Hai un angolo di tolleranza. Conferma quando allineato correttamente.", hu: "Forgassa el iránytű tűjét a kívánt irányba. Van egy toleranciaszöge. Erősítse meg, ha megfelelően van igazítva.", cs: "Otočte kompasovou jehlu do požadovaného směru. Máte toleranční úhel. Potvrďte, když je správně zarovnáno.", pl: "Obróć igłę kompasu w wymaganym kierunku. Masz kąt tolerancji. Potwierdź, gdy jest prawidłowo wyrównany.", bg: "Завъртете стрелката на компаса в посоката. Имате толерантен ъгъл. Потвърдете, когато е правилно подравнено.", ru: "Поверните стрелку компаса в нужном направлении. У вас есть угол допуска. Подтвердите, когда правильно выровнено.", ar: "قم بتدوير إبرة البوصلة إلى الاتجاه المطلوب. لديك زاوية تسامح. أكد عندما تكون محاذاة بشكل صحيح.", pt: "Gire a agulha da bússola para a direção necessária. Você tem um ângulo de tolerância. Confirme quando alinhado corretamente.", tr: "Pusula iğnesini gerekli yöne döndürün. Bir tolerans açınız var. Doğru hizalandığında onaylayın.", el: "Περιστρέψτε τη βελόνα της πυξίδας προς την απαιτούμενη κατεύθυνση. Έχετε γωνία ανοχής. Επιβεβαιώστε όταν ευθυγραμμιστεί σωστά.", ja: "コンパスの針を必要な方向に回転させます。許容角度があります。正しく整列したら確認してください。" },
  levels: { ro: "📊 Niveluri", en: "📊 Levels", de: "📊 Stufen", fr: "📊 Niveaux", es: "📊 Niveles", it: "📊 Livelli", hu: "📊 Szintek", cs: "📊 Úrovně", pl: "📊 Poziomy", bg: "📊 Нива", ru: "📊 Уровни", ar: "📊 المستويات", pt: "📊 Níveis", tr: "📊 Seviyeler", el: "📊 Επίπεδα", ja: "📊 レベル" },
  level1: { ro: "Nivel 1: 5 ținte, toleranță ±20°, doar N/E/S/V", en: "Level 1: 5 targets, tolerance ±20°, only N/E/S/W", de: "Stufe 1: 5 Ziele, Toleranz ±20°, nur N/O/S/W", fr: "Niveau 1: 5 cibles, tolérance ±20°, seulement N/E/S/O", es: "Nivel 1: 5 objetivos, tolerancia ±20°, solo N/E/S/O", it: "Livello 1: 5 obiettivi, tolleranza ±20°, solo N/E/S/O", hu: "1. szint: 5 cél, tolerancia ±20°, csak É/K/D/Ny", cs: "Úroveň 1: 5 cílů, tolerance ±20°, pouze S/V/J/Z", pl: "Poziom 1: 5 celów, tolerancja ±20°, tylko N/E/S/W", bg: "Ниво 1: 5 цели, толеранс ±20°, само С/И/Ю/З", ru: "Уровень 1: 5 целей, допуск ±20°, только С/В/Ю/З", ar: "المستوى 1: 5 أهداف، تسامح ±20°، فقط ش/ج/ق/غ", pt: "Nível 1: 5 alvos, tolerância ±20°, apenas N/E/S/O", tr: "Seviye 1: 5 hedef, tolerans ±20°, sadece K/D/G/B", el: "Επίπεδο 1: 5 στόχοι, ανοχή ±20°, μόνο Β/Α/Ν/Δ", ja: "レベル1: 5ターゲット、許容度±20°、N/E/S/Wのみ" },
  level2: { ro: "Nivel 2: 6 ținte, toleranță ±15°, toate direcțiile", en: "Level 2: 6 targets, tolerance ±15°, all directions", de: "Stufe 2: 6 Ziele, Toleranz ±15°, alle Richtungen", fr: "Niveau 2: 6 cibles, tolérance ±15°, toutes les directions", es: "Nivel 2: 6 objetivos, tolerancia ±15°, todas las direcciones", it: "Livello 2: 6 obiettivi, tolleranza ±15°, tutte le direzioni", hu: "2. szint: 6 cél, tolerancia ±15°, minden irány", cs: "Úroveň 2: 6 cílů, tolerance ±15°, všechny směry", pl: "Poziom 2: 6 celów, tolerancja ±15°, wszystkie kierunki", bg: "Ниво 2: 6 цели, толеранс ±15°, всички посоки", ru: "Уровень 2: 6 целей, допуск ±15°, все направления", ar: "المستوى 2: 6 أهداف، تسامح ±15°، جميع الاتجاهات", pt: "Nível 2: 6 alvos, tolerância ±15°, todas as direções", tr: "Seviye 2: 6 hedef, tolerans ±15°, tüm yönler", el: "Επίπεδο 2: 6 στόχοι, ανοχή ±15°, όλες οι κατευθύνσεις", ja: "レベル2: 6ターゲット、許容度±15°、すべての方向" },
  level3: { ro: "Nivel 3: 8 ținte, toleranță ±10°, toate direcțiile", en: "Level 3: 8 targets, tolerance ±10°, all directions", de: "Stufe 3: 8 Ziele, Toleranz ±10°, alle Richtungen", fr: "Niveau 3: 8 cibles, tolérance ±10°, toutes les directions", es: "Nivel 3: 8 objetivos, tolerancia ±10°, todas las direcciones", it: "Livello 3: 8 obiettivi, tolleranza ±10°, tutte le direzioni", hu: "3. szint: 8 cél, tolerancia ±10°, minden irány", cs: "Úroveň 3: 8 cílů, tolerance ±10°, všechny směry", pl: "Poziom 3: 8 celów, tolerancja ±10°, wszystkie kierunki", bg: "Ниво 3: 8 цели, толеранс ±10°, всички посоки", ru: "Уровень 3: 8 целей, допуск ±10°, все направления", ar: "المستوى 3: 8 أهداف، تسامح ±10°، جميع الاتجاهات", pt: "Nível 3: 8 alvos, tolerância ±10°, todas as direções", tr: "Seviye 3: 8 hedef, tolerans ±10°, tüm yönler", el: "Επίπεδο 3: 8 στόχοι, ανοχή ±10°, όλες οι κατευθύνσεις", ja: "レベル3: 8ターゲット、許容度±10°、すべての方向" },
  controls: { ro: "🎮 Control", en: "🎮 Controls", de: "🎮 Steuerung", fr: "🎮 Contrôles", es: "🎮 Controles", it: "🎮 Controlli", hu: "🎮 Vezérlés", cs: "🎮 Ovládání", pl: "🎮 Sterowanie", bg: "🎮 Контроли", ru: "🎮 Управление", ar: "🎮 التحكم", pt: "🎮 Controlos", tr: "🎮 Kontroller", el: "🎮 Χειριστήρια", ja: "🎮 コントロール" },
  controlsText: { ro: "Trage cu mouse-ul pe busolă pentru a roti acul, sau folosește butoanele +/-5° și +/-1°.", en: "Drag with the mouse on the compass to rotate the needle, or use the +/-5° and +/-1° buttons.", de: "Ziehen Sie mit der Maus auf dem Kompass, um die Nadel zu drehen, oder verwenden Sie die Schaltflächen +/-5° und +/-1°.", fr: "Faites glisser avec la souris sur la boussole pour faire pivoter l'aiguille, ou utilisez les boutons +/-5° et +/-1°.", es: "Arrastra con el ratón sobre la brújula para girar la aguja, o usa los botones +/-5° y +/-1°.", it: "Trascina con il mouse sulla bussola per ruotare l'ago, o usa i pulsanti +/-5° e +/-1°.", hu: "Húzza az egeret a iránytűn a tű elforgatásához, vagy használja a +/-5° és +/-1° gombokat.", cs: "Táhněte myší na kompasu, abyste otočili jehlu, nebo použijte tlačítka +/-5° a +/-1°.", pl: "Przeciągnij myszą na kompasie, aby obrócić igłę, lub użyj przycisków +/-5° i +/-1°.", bg: "Плъзнете с мишката върху компаса, за да завъртите стрелката, или използвайте бутоните +/-5° и +/-1°.", ru: "Перетащите мышью на компасе, чтобы повернуть стрелку, или используйте кнопки +/-5° и +/-1°.", ar: "اسحب بالماوس على البوصلة لتدوير الإبرة، أو استخدم أزرار +/-5° و +/-1°.", pt: "Arraste com o mouse na bússola para girar a agulha, ou use os botões +/-5° e +/-1°.", tr: "İğneyi döndürmek için fare ile pusula üzerinde sürükleyin veya +/-5° ve +/-1° düğmelerini kullanın.", el: "Σύρετε με το ποντίκι στην πυξίδα για να περιστρέψετε τη βελόνα ή χρησιμοποιήστε τα κουμπιά +/-5° και +/-1°.", ja: "マウスでコンパスをドラッグして針を回転させるか、+/-5°および+/-1°ボタンを使用してください。" },
  correct: { ro: "Corect! +10 puncte", en: "Correct! +10 points", de: "Richtig! +10 Punkte", fr: "Correct! +10 points", es: "¡Correcto! +10 puntos", it: "Corretto! +10 punti", hu: "Helyes! +10 pont", cs: "Správně! +10 bodů", pl: "Poprawnie! +10 punktów", bg: "Правилно! +10 точки", ru: "Правильно! +10 очков", ar: "صحيح! +10 نقاط", pt: "Correto! +10 pontos", tr: "Doğru! +10 puan", el: "Σωστό! +10 πόντοι", ja: "正解！+10ポイント" },
  tryAgain: { ro: "Aproape! Încearcă din nou.", en: "Close! Try again.", de: "Fast! Versuche es nochmal.", fr: "Presque! Réessayez.", es: "¡Casi! Inténtalo de nuevo.", it: "Quasi! Riprova.", hu: "Majdnem! Próbáld újra.", cs: "Skoro! Zkus to znovu.", pl: "Prawie! Spróbuj ponownie.", bg: "Близо! Опитай отново.", ru: "Почти! Попробуйте снова.", ar: "قريب! حاول مرة أخرى.", pt: "Quase! Tente novamente.", tr: "Yakın! Tekrar deneyin.", el: "Σχεδόν! Δοκιμάστε ξανά.", ja: "惜しい！もう一度試してください。" },
  nextLevel: { ro: "Nivel", en: "Level", de: "Stufe", fr: "Niveau", es: "Nivel", it: "Livello", hu: "Szint", cs: "Úroveň", pl: "Poziom", bg: "Ниво", ru: "Уровень", ar: "مستوى", pt: "Nível", tr: "Seviye", el: "Επίπεδο", ja: "レベル" },
  timeUp: { ro: "Timpul a expirat!", en: "Time's up!", de: "Zeit ist um!", fr: "Temps écoulé!", es: "¡Se acabó el tiempo!", it: "Tempo scaduto!", hu: "Lejárt az idő!", cs: "Čas vypršel!", pl: "Czas minął!", bg: "Времето изтече!", ru: "Время вышло!", ar: "انتهى الوقت!", pt: "Tempo esgotado!", tr: "Süre doldu!", el: "Ο χρόνος τελείωσε!", ja: "時間切れ！" },
  congratulations: { ro: "Felicitări, Explorator!", en: "Congratulations, Explorer!", de: "Herzlichen Glückwunsch, Entdecker!", fr: "Félicitations, Explorateur!", es: "¡Felicitaciones, Explorador!", it: "Congratulazioni, Esploratore!", hu: "Gratulálok, Felfedező!", cs: "Gratulujeme, Průzkumníku!", pl: "Gratulacje, Odkrywco!", bg: "Поздравления, Изследовател!", ru: "Поздравляем, Исследователь!", ar: "تهانينا، مستكشف!", pt: "Parabéns, Explorador!", tr: "Tebrikler, Kaşif!", el: "Συγχαρητήρια, Εξερευνητή!", ja: "おめでとう、探検家！" },
  congratsSpoken: { ro: "Felicitări! Corect!", en: "Congratulations! Correct!", de: "Herzlichen Glückwunsch! Richtig!", fr: "Félicitations! Correct!", es: "¡Felicitaciones! ¡Correcto!", it: "Congratulazioni! Corretto!", hu: "Gratulálok! Helyes!", cs: "Gratulujeme! Správně!", pl: "Gratulacje! Poprawnie!", bg: "Поздравления! Правилно!", ru: "Поздравляем! Правильно!", ar: "تهانينا! صحيح!", pt: "Parabéns! Correto!", tr: "Tebrikler! Doğru!", el: "Συγχαρητήρια! Σωστό!", ja: "おめでとう！正解！" },
  finalScore: { ro: "Scor final", en: "Final score", de: "Endpunktzahl", fr: "Score final", es: "Puntuación final", it: "Punteggio finale", hu: "Végső pontszám", cs: "Konečné skóre", pl: "Wynik końcowy", bg: "Краен резултат", ru: "Финальный счет", ar: "النتيجة النهائية", pt: "Pontuação final", tr: "Final skoru", el: "Τελική βαθμολογία", ja: "最終スコア" },
  disableSound: { ro: "Dezactivează sunetul", en: "Disable sound", de: "Ton deaktivieren", fr: "Désactiver le son", es: "Desactivar sonido", it: "Disattiva audio", hu: "Hang kikapcsolása", cs: "Vypnout zvuk", pl: "Wyłącz dźwięk", bg: "Изключи звук", ru: "Отключить звук", ar: "تعطيل الصوت", pt: "Desativar som", tr: "Sesi kapat", el: "Απενεργοποίηση ήχου", ja: "音を無効にする" },
  enableSound: { ro: "Activează sunetul", en: "Enable sound", de: "Ton aktivieren", fr: "Activer le son", es: "Activar sonido", it: "Attiva audio", hu: "Hang bekapcsolása", cs: "Zapnout zvuk", pl: "Włącz dźwięk", bg: "Включи звук", ru: "Включить звук", ar: "تمكين الصوت", pt: "Ativar som", tr: "Sesi aç", el: "Ενεργοποίηση ήχου", ja: "音を有効にする" },
  north: { ro: "Nord", en: "North", de: "Nord", fr: "Nord", es: "Norte", it: "Nord", hu: "Észak", cs: "Sever", pl: "Północ", bg: "Север", ru: "Север", ar: "شمال", pt: "Norte", tr: "Kuzey", el: "Βορράς", ja: "北" },
  east: { ro: "Est", en: "East", de: "Ost", fr: "Est", es: "Este", it: "Est", hu: "Kelet", cs: "Východ", pl: "Wschód", bg: "Изток", ru: "Восток", ar: "شرق", pt: "Leste", tr: "Doğu", el: "Ανατολή", ja: "東" },
  south: { ro: "Sud", en: "South", de: "Süd", fr: "Sud", es: "Sur", it: "Sud", hu: "Dél", cs: "Jih", pl: "Południe", bg: "Юг", ru: "Юг", ar: "جنوب", pt: "Sul", tr: "Güney", el: "Νότος", ja: "南" },
  west: { ro: "Vest", en: "West", de: "West", fr: "Ouest", es: "Oeste", it: "Ovest", hu: "Nyugat", cs: "Západ", pl: "Zachód", bg: "Запад", ru: "Запад", ar: "غرب", pt: "Oeste", tr: "Batı", el: "Δύση", ja: "西" },
  northeast: { ro: "Nord-Est", en: "Northeast", de: "Nordost", fr: "Nord-Est", es: "Noreste", it: "Nordest", hu: "Északkelet", cs: "Severovýchod", pl: "Północny Wschód", bg: "Североизток", ru: "Северо-восток", ar: "شمال شرق", pt: "Nordeste", tr: "Kuzeydoğu", el: "Βορειοανατολικά", ja: "北東" },
  southeast: { ro: "Sud-Est", en: "Southeast", de: "Südost", fr: "Sud-Est", es: "Sureste", it: "Sudest", hu: "Délkelet", cs: "Jihovýchod", pl: "Południowy Wschód", bg: "Югоизток", ru: "Юго-восток", ar: "جنوب شرق", pt: "Sudeste", tr: "Güneydoğu", el: "Νοτιοανατολικά", ja: "南東" },
  southwest: { ro: "Sud-Vest", en: "Southwest", de: "Südwest", fr: "Sud-Ouest", es: "Suroeste", it: "Sudovest", hu: "Délnyugat", cs: "Jihozápad", pl: "Południowy Zachód", bg: "Югозапад", ru: "Юго-запад", ar: "جنوب غرب", pt: "Sudoeste", tr: "Güneybatı", el: "Νοτιοδυτικά", ja: "南西" },
  northwest: { ro: "Nord-Vest", en: "Northwest", de: "Nordwest", fr: "Nord-Ouest", es: "Noroeste", it: "Nordovest", hu: "Északnyugat", cs: "Severozápad", pl: "Północny Zachód", bg: "Северозапад", ru: "Северо-запад", ar: "شمال غرب", pt: "Noroeste", tr: "Kuzeybatı", el: "Βορειοδυτικά", ja: "北西" }
};

interface Level {
  tolerance: number;
  targets: number;
  allowedDirections: string[];
}

const levels: Level[] = [
  { tolerance: 20, targets: 5, allowedDirections: ['N', 'E', 'S', 'V'] },
  { tolerance: 15, targets: 6, allowedDirections: ['N', 'NE', 'E', 'SE', 'S', 'SV', 'V', 'NV'] },
  { tolerance: 10, targets: 8, allowedDirections: ['N', 'NE', 'E', 'SE', 'S', 'SV', 'V', 'NV'] }
];

const directionAngles: Record<string, number> = {
  'N': 0, 'NE': 45, 'E': 90, 'SE': 135,
  'S': 180, 'SV': 225, 'V': 270, 'NV': 315
};

const getDirectionName = (direction: string, lang: string): string => {
  const directionMap: Record<string, keyof typeof translations> = {
    'N': 'north',
    'E': 'east',
    'S': 'south',
    'V': 'west',
    'NE': 'northeast',
    'SE': 'southeast',
    'SV': 'southwest',
    'NV': 'northwest'
  };
  
  const translationKey = directionMap[direction];
  if (!translationKey) return direction;
  
  return translations[translationKey][lang as keyof typeof translations.north] || direction;
};

const AventuraBusolei = () => {
  const [lang, setLang] = useState('ro');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [targetDirection, setTargetDirection] = useState(() => {
    const directions = levels[0].allowedDirections;
    return directions[Math.floor(Math.random() * directions.length)];
  });
  const [heading, setHeading] = useState(0);
  const [status, setStatus] = useState<'play' | 'pause'>('play');
  const [time, setTime] = useState(180);
  const [targetsRemaining, setTargetsRemaining] = useState(levels[0].targets);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isCorrectAlignment, setIsCorrectAlignment] = useState(false);
  const compassRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const speakMessage = (text: string, langCode: string) => {
    if (!soundEnabled) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap: Record<string, string> = {
      ro: 'ro-RO', en: 'en-US', de: 'de-DE', fr: 'fr-FR', es: 'es-ES', it: 'it-IT',
      hu: 'hu-HU', cs: 'cs-CZ', pl: 'pl-PL', bg: 'bg-BG', ru: 'ru-RU', ar: 'ar-SA',
      pt: 'pt-PT', tr: 'tr-TR', el: 'el-GR', ja: 'ja-JP'
    };
    
    utterance.lang = langMap[langCode] || 'ro-RO';
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setTargetsRemaining(levels[0].targets);
    setTime(180);
    setStatus('play');
    setIsCorrectAlignment(false);
    const randomDir = levels[0].allowedDirections[Math.floor(Math.random() * levels[0].allowedDirections.length)];
    setTargetDirection(randomDir);
    setHeading(0);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'play' && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }
    if (time === 0 && status === 'play') {
      toast.error(translations.timeUp[lang as keyof typeof translations.timeUp]);
      setTimeout(() => {
        startGame();
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [status, time, lang]);

  const checkAlignment = (currentHeading: number) => {
    const targetAngle = directionAngles[targetDirection];
    const tolerance = levels[level - 1].tolerance;
    const diff = Math.abs(((currentHeading - targetAngle + 540) % 360) - 180);
    setIsCorrectAlignment(diff <= tolerance);
  };

  const adjustHeading = (delta: number) => {
    const newHeading = (heading + delta + 360) % 360;
    setHeading(newHeading);
    checkAlignment(newHeading);
  };

  const confirmHeading = () => {
    const targetAngle = directionAngles[targetDirection];
    const tolerance = levels[level - 1].tolerance;
    const diff = Math.abs(((heading - targetAngle + 540) % 360) - 180);

    if (diff <= tolerance) {
      const spokenMsg = translations.congratsSpoken[lang as keyof typeof translations.congratsSpoken];
      speakMessage(spokenMsg, lang);
      
      toast.success(translations.correct[lang as keyof typeof translations.correct]);
      const newScore = score + 10;
      setScore(newScore);
      const newTargets = targetsRemaining - 1;

      if (newTargets <= 0) {
        if (level >= 3) {
          toast.success(translations.congratulations[lang as keyof typeof translations.congratulations] + " " + translations.finalScore[lang as keyof typeof translations.finalScore] + ": " + (newScore));
          setTimeout(() => {
            startGame();
          }, 2000);
        } else {
          const nextLevel = level + 1;
          setLevel(nextLevel);
          setTargetsRemaining(levels[nextLevel - 1].targets);
          toast.info(`${translations.nextLevel[lang as keyof typeof translations.nextLevel]} ${nextLevel}!`);
        }
      }

      setTargetsRemaining(newTargets);
      setIsCorrectAlignment(false);
      const randomDir = levels[level - 1].allowedDirections[Math.floor(Math.random() * levels[level - 1].allowedDirections.length)];
      setTargetDirection(randomDir);
      setHeading(0);
    } else {
      toast.warning(translations.tryAgain[lang as keyof typeof translations.tryAgain]);
    }
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !compassRef.current) return;
    const rect = compassRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const degrees = ((angle * 180 / Math.PI) + 90 + 360) % 360;
    const newHeading = Math.round(degrees);
    setHeading(newHeading);
    checkAlignment(newHeading);
  };


  if (status === 'pause') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-6">
        <Card className="p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-6">Pauză</h2>
          <div className="space-y-4">
            <Button onClick={() => setStatus('play')} className="w-full" size="lg">
              <Play className="mr-2" />
              Continuă
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" size="icon">
              <Home className="h-5 w-5 text-blue-600" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100">
        <Sidebar className="w-32 border-r bg-white/80 backdrop-blur-sm">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-2 mb-6">
                    <img src={numLitLogo} alt="NumLit" className="h-12" />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">{translations.language[lang as keyof typeof translations.language]}</label>
                    <Select value={lang} onValueChange={setLang}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(languages).map(([code, { flag, name }]) => (
                          <SelectItem key={code} value={code}>
                            {flag} {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">{translations.level[lang as keyof typeof translations.level]}</label>
                    <Select value={level.toString()} onValueChange={(val) => setLevel(parseInt(val))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {gameLevels.map((lvl) => (
                          <SelectItem key={lvl} value={lvl}>
                            {translations.level[lang as keyof typeof translations.level]} {lvl}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="outline" size="icon" onClick={() => navigate('/')}>
                    <Home className="h-5 w-5 text-blue-600" />
                  </Button>

                  <ShopPromoBox language={lang} />
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header bar - Compact și sticky */}
          <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4 justify-between">
              
              {/* STÂNGA: Sidebar Trigger + Logo */}
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <img 
                  src={numLitLogo}
                  alt="NumLit Logo" 
                  className="h-10 w-auto object-contain"
                  draggable={false}
                />
              </div>

              {/* CENTRU: Scor + Bara de progres + Ținte rămase */}
              <div className="flex items-center gap-4">
                {/* Score */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Score:</span>
                  <span className="text-lg font-bold text-blue-600">{score}</span>
                </div>
                
                {/* Progress Bar */}
                <ProgressBar 
                  current={levels[level - 1].targets - targetsRemaining} 
                  total={levels[level - 1].targets} 
                  className="w-40" 
                />
                
                {/* Targets Remaining */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {translations.targetsRemaining[lang as keyof typeof translations.targetsRemaining]}:
                  </span>
                  <span className="text-lg font-bold text-orange-600">{targetsRemaining}</span>
                </div>
                
                {/* Instructions Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Info className="w-4 h-4" />
                      {translations.instructions[lang as keyof typeof translations.instructions]}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{translations.howToPlay[lang as keyof typeof translations.howToPlay]}</DialogTitle>
                      <DialogDescription>
                        {translations.learnCompass[lang as keyof typeof translations.learnCompass]}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="bg-emerald-50 p-4 rounded-lg">
                        <h4 className="font-bold text-emerald-800 mb-2">
                          {translations.objective[lang as keyof typeof translations.objective]}
                        </h4>
                        <p className="text-emerald-700">
                          {translations.objectiveText[lang as keyof typeof translations.objectiveText]}
                        </p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-bold text-blue-800 mb-2">
                          {translations.levels[lang as keyof typeof translations.levels]}
                        </h4>
                        <ul className="text-blue-700 space-y-1 list-disc list-inside">
                          <li><strong>{translations.level[lang as keyof typeof translations.level]} 1:</strong> {translations.level1[lang as keyof typeof translations.level1]}</li>
                          <li><strong>{translations.level[lang as keyof typeof translations.level]} 2:</strong> {translations.level2[lang as keyof typeof translations.level2]}</li>
                          <li><strong>{translations.level[lang as keyof typeof translations.level]} 3:</strong> {translations.level3[lang as keyof typeof translations.level3]}</li>
                        </ul>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-bold text-orange-800 mb-2">
                          {translations.controls[lang as keyof typeof translations.controls]}
                        </h4>
                        <p className="text-orange-700">
                          {translations.controlsText[lang as keyof typeof translations.controlsText]}
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* DREAPTA: Timer + Game Controls + Sound */}
              <div className="flex items-center gap-2">
                <Timer displayValue={time} isRunning={status === 'play'} />
                
                {status === 'play' ? (
                  <Button variant="outline" size="sm" onClick={() => setStatus('pause')}>
                    <Pause className="w-4 h-4" />
                  </Button>
                ) : status === 'pause' ? (
                  <Button variant="outline" size="sm" onClick={() => setStatus('play')}>
                    <Play className="w-4 h-4" />
                  </Button>
                ) : null}
                
                <Button variant="outline" size="sm" onClick={startGame}>
                  <RotateCw className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={cn(soundEnabled && "bg-green-100")}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
                
                <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                  <Home className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main game content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-6xl mx-auto">

          <div className="mt-12 md:mt-16 flex justify-center items-start gap-12 max-w-6xl mx-auto min-h-[600px]">
            {/* Busola în stânga */}
            <div className="flex flex-col items-center gap-3">
              <div 
                ref={compassRef}
                className="relative w-[512px] h-[512px] mx-auto bg-white rounded-full shadow-2xl cursor-pointer select-none border-8 border-gray-300"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {['N', 'E', 'S', 'V'].map((dir, idx) => (
                  <div 
                    key={dir}
                    className="absolute text-9xl font-bold z-50"
                    style={{
                      top: idx === 0 ? '-120px' : idx === 2 ? 'auto' : '50%',
                      bottom: idx === 2 ? '-130px' : 'auto',
                      left: idx === 1 ? 'auto' : idx === 3 ? '-120px' : '50%',
                      right: idx === 1 ? '-120px' : 'auto',
                      transform: `translate(${idx === 1 || idx === 3 ? '0' : '-50%'}, ${idx === 0 || idx === 2 ? '0' : '-50%'})`,
                      color: dir === 'N' ? '#ef4444' : '#334155',
                      textShadow: '0 0 8px rgba(255,255,255,0.9), 0 0 16px rgba(255,255,255,0.7), 0 2px 4px rgba(0,0,0,0.3)',
                      WebkitTextStroke: '2px white',
                      paintOrder: 'stroke fill'
                    }}
                  >
                    {dir}
                  </div>
                ))}

                {/* Direcții inter-cardinale tangente la cerc (doar pentru nivel 2 și 3) */}
                {level >= 2 && ['NE', 'SE', 'SV', 'NV'].map((dir, idx) => {
                  // Calculăm poziționarea tangentă corectă la 45°
                  // Pentru cerc cu rază 256px, punctul la 45° este la 181px de centru
                  // Distanța de la marginea cercului (512px) = 256 - 181 = 75px
                  // Adăugăm offset pentru a poziționa eticheta ÎN AFARA cercului
                  
                  const tangentOffset = 75; // distanța de la marginea div-ului până la tangenta cercului
                  const labelOffset = 40;   // spațiul între cerc și etichetă
                  
                  // Calculăm poziția finală: tangentOffset - labelOffset pentru a fi în afara cercului
                  const position = tangentOffset - labelOffset; // = 35px
                  
                  return (
                    <div 
                      key={dir}
                      className="absolute text-6xl font-bold z-40"
                      style={{
                        // Pentru fiecare direcție inter-cardinală, poziționăm la distanța corectă de marginile cercului
                        top: idx === 0 || idx === 3 ? `${position}px` : 'auto',
                        bottom: idx === 1 || idx === 2 ? `${position}px` : 'auto',
                        left: idx === 2 || idx === 3 ? `${position}px` : 'auto',
                        right: idx === 0 || idx === 1 ? `${position}px` : 'auto',
                        transform: 'translate(-50%, -50%)',
                        color: '#334155',
                        textShadow: '0 0 8px rgba(255,255,255,0.9), 0 0 16px rgba(255,255,255,0.7), 0 2px 4px rgba(0,0,0,0.3)',
                        WebkitTextStroke: '1.5px white',
                        paintOrder: 'stroke fill'
                      }}
                    >
                      {dir}
                    </div>
                  );
                })}

                <div className="absolute w-full h-0.5 bg-gray-400" style={{ top: '50%' }} />
                <div className="absolute h-full w-0.5 bg-gray-400" style={{ left: '50%' }} />

                <div 
                  className="absolute origin-center transition-transform duration-100"
                  style={{ 
                    transform: `rotate(${heading}deg)`,
                    width: '12px',
                    height: '360px',
                    top: '50%',
                    left: '50%',
                    marginLeft: '-6px',
                    marginTop: '-180px'
                  }}
                >
                  <svg 
                    className="absolute top-0 left-1/2 -translate-x-1/2" 
                    width="40" 
                    height="190" 
                    viewBox="0 0 40 190"
                  >
                    <defs>
                      <linearGradient id="northGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{stopColor: '#ef4444', stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: '#dc2626', stopOpacity: 1}} />
                      </linearGradient>
                      <filter id="needleShadow">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.4"/>
                      </filter>
                    </defs>
                    <path 
                      d="M20 0 L30 180 L20 170 L10 180 Z" 
                      fill="url(#northGradient)"
                      filter="url(#needleShadow)"
                      stroke="#b91c1c"
                      strokeWidth="1"
                    />
                  </svg>
                  
                  <svg 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2" 
                    width="40" 
                    height="190" 
                    viewBox="0 0 40 190"
                  >
                    <defs>
                      <linearGradient id="southGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{stopColor: '#64748b', stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: '#475569', stopOpacity: 1}} />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M20 190 L30 10 L20 20 L10 10 Z" 
                      fill="url(#southGradient)"
                      filter="url(#needleShadow)"
                      stroke="#334155"
                      strokeWidth="1"
                    />
                  </svg>
                </div>

                <div className="absolute w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full shadow-xl border-4 border-gray-600" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
              </div>

                {level === 3 && (
                  <p className="text-xs text-gray-500 text-center">
                    {translations.currentHeading[lang as keyof typeof translations.currentHeading]} {heading}°
                  </p>
                )}

            </div>

            {/* Controale în dreapta - vertical cu spațiere custom */}
            <div className="flex flex-col items-center" style={{ marginTop: '40px' }}>
              {/* Container Direcția țintă - poziționat sus */}
              <div className="bg-blue-50 p-6 rounded-lg w-64 text-center shadow-lg">
                <p className="text-sm text-gray-600 mb-2">
                  {translations.targetDirection[lang as keyof typeof translations.targetDirection]}
                </p>
                <p className="text-5xl font-bold text-blue-600 my-3">
                  {getDirectionName(targetDirection, lang)}
                </p>
                <p className="text-xl text-gray-500">{directionAngles[targetDirection]}°</p>
              </div>

              {/* Spațiu flexibil pentru a împinge butonul Confirmă și gradele jos */}
              <div className="flex-1 min-h-[180px]" />

              {/* Buton Confirmă - poziționat jos */}
              <Button 
                onClick={confirmHeading} 
                size="default"
                className={cn(
                  "bg-green-600 hover:bg-green-700 text-white px-12 py-8 text-2xl font-bold shadow-lg transition-all duration-300",
                  isCorrectAlignment && "bg-green-500 hover:bg-green-600 scale-110 shadow-xl"
                )}
              >
                {translations.confirm[lang as keyof typeof translations.confirm]}
              </Button>

              {/* Butoane grade - sub butonul Confirmă */}
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button variant="outline" size="sm" onClick={() => adjustHeading(-5)}>
                  -5{level > 1 && '°'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => adjustHeading(-1)}>
                  -1{level > 1 && '°'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => adjustHeading(1)}>
                  +1{level > 1 && '°'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => adjustHeading(5)}>
                  +5{level > 1 && '°'}
                </Button>
              </div>
            </div>
          </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AventuraBusolei;
