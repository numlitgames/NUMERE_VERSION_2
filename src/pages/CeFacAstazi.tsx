import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Clock, CheckCircle2, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Definim activitățile disponibile
type Activity = {
  id: string;
  name: { ro: string; en: string; de: string; fr: string; es: string; it: string; hu: string; cs: string; pl: string; bg: string; ru: string; pt: string; tr: string; ar: string; el: string; };
  emoji: string;
  duration: number;
  color: string;
  mandatory: boolean;
  category: 'essential' | 'school' | 'leisure' | 'meals';
};

const activities: Activity[] = [
  {
    id: 'sleep',
    name: { ro: 'Somn', en: 'Sleep', de: 'Schlaf', fr: 'Sommeil', es: 'Dormir', it: 'Sonno', hu: 'Alvás', cs: 'Spánek', pl: 'Sen', bg: 'Сън', ru: 'Сон', pt: 'Sono', tr: 'Uyku', ar: 'نوم', el: 'Ύπνος' },
    emoji: '😴',
    duration: 8,
    color: 'bg-indigo-500',
    mandatory: true,
    category: 'essential'
  },
  {
    id: 'breakfast',
    name: { ro: 'Micul Dejun', en: 'Breakfast', de: 'Frühstück', fr: 'Petit Déjeuner', es: 'Desayuno', it: 'Colazione', hu: 'Reggeli', cs: 'Snídaně', pl: 'Śniadanie', bg: 'Закуска', ru: 'Завтрак', pt: 'Café da Manhã', tr: 'Kahvaltı', ar: 'فطور', el: 'Πρωινό' },
    emoji: '🍳',
    duration: 1,
    color: 'bg-orange-500',
    mandatory: true,
    category: 'meals'
  },
  {
    id: 'school',
    name: { ro: 'Școală', en: 'School', de: 'Schule', fr: 'École', es: 'Escuela', it: 'Scuola', hu: 'Iskola', cs: 'Škola', pl: 'Szkoła', bg: 'Училище', ru: 'Школа', pt: 'Escola', tr: 'Okul', ar: 'مدرسة', el: 'Σχολείο' },
    emoji: '📚',
    duration: 5,
    color: 'bg-blue-600',
    mandatory: true,
    category: 'school'
  },
  {
    id: 'lunch',
    name: { ro: 'Prânz', en: 'Lunch', de: 'Mittagessen', fr: 'Déjeuner', es: 'Almuerzo', it: 'Pranzo', hu: 'Ebéd', cs: 'Oběd', pl: 'Obiad', bg: 'Обяд', ru: 'Обед', pt: 'Almoço', tr: 'Öğle Yemeği', ar: 'غداء', el: 'Μεσημεριανό' },
    emoji: '🍱',
    duration: 1,
    color: 'bg-green-500',
    mandatory: true,
    category: 'meals'
  },
  {
    id: 'homework',
    name: { ro: 'Teme', en: 'Homework', de: 'Hausaufgaben', fr: 'Devoirs', es: 'Tareas', it: 'Compiti', hu: 'Házi feladat', cs: 'Domácí úkoly', pl: 'Zadanie domowe', bg: 'Домашна работа', ru: 'Домашняя работа', pt: 'Dever de casa', tr: 'Ödev', ar: 'واجب منزلي', el: 'Εργασίες' },
    emoji: '✏️',
    duration: 2,
    color: 'bg-purple-500',
    mandatory: true,
    category: 'school'
  },
  {
    id: 'play',
    name: { ro: 'Joacă', en: 'Play', de: 'Spielen', fr: 'Jouer', es: 'Jugar', it: 'Giocare', hu: 'Játék', cs: 'Hrát', pl: 'Zabawa', bg: 'Игра', ru: 'Игра', pt: 'Brincar', tr: 'Oynamak', ar: 'لعب', el: 'Παιχνίδι' },
    emoji: '⚽',
    duration: 2,
    color: 'bg-pink-500',
    mandatory: false,
    category: 'leisure'
  },
  {
    id: 'sport',
    name: { ro: 'Sport', en: 'Sports', de: 'Sport', fr: 'Sport', es: 'Deporte', it: 'Sport', hu: 'Sport', cs: 'Sport', pl: 'Sport', bg: 'Спорт', ru: 'Спорт', pt: 'Esporte', tr: 'Spor', ar: 'رياضة', el: 'Αθλητισμός' },
    emoji: '🏃',
    duration: 1,
    color: 'bg-cyan-500',
    mandatory: false,
    category: 'leisure'
  },
  {
    id: 'dinner',
    name: { ro: 'Cină', en: 'Dinner', de: 'Abendessen', fr: 'Dîner', es: 'Cena', it: 'Cena', hu: 'Vacsora', cs: 'Večeře', pl: 'Kolacja', bg: 'Вечеря', ru: 'Ужин', pt: 'Jantar', tr: 'Akşam Yemeği', ar: 'عشاء', el: 'Δείπνο' },
    emoji: '🍝',
    duration: 1,
    color: 'bg-red-500',
    mandatory: true,
    category: 'meals'
  },
  {
    id: 'reading',
    name: { ro: 'Citit', en: 'Reading', de: 'Lesen', fr: 'Lecture', es: 'Lectura', it: 'Lettura', hu: 'Olvasás', cs: 'Čtení', pl: 'Czytanie', bg: 'Четене', ru: 'Чтение', pt: 'Leitura', tr: 'Okuma', ar: 'قراءة', el: 'Ανάγνωση' },
    emoji: '📖',
    duration: 1,
    color: 'bg-amber-500',
    mandatory: false,
    category: 'leisure'
  },
  {
    id: 'tv',
    name: { ro: 'TV/Tabletă', en: 'TV/Tablet', de: 'TV/Tablet', fr: 'TV/Tablette', es: 'TV/Tableta', it: 'TV/Tablet', hu: 'TV/Tablet', cs: 'TV/Tablet', pl: 'TV/Tablet', bg: 'ТВ/Таблет', ru: 'ТВ/Планшет', pt: 'TV/Tablet', tr: 'TV/Tablet', ar: 'تلفزيون/جهاز لوحي', el: 'TV/Tablet' },
    emoji: '📺',
    duration: 1,
    color: 'bg-violet-500',
    mandatory: false,
    category: 'leisure'
  }
];

type TimeSlot = {
  hour: number;
  activity: Activity | null;
};

type Language = 'ro' | 'en' | 'de' | 'fr' | 'es' | 'it' | 'hu' | 'cs' | 'pl' | 'bg' | 'ru' | 'pt' | 'tr' | 'ar' | 'el';

const translations = {
  ro: {
    title: 'Ce fac astăzi',
    subtitle: 'Organizează-ți ziua prin tragerea activităților în intervalele orare!',
    availableActivities: 'Activități Disponibile',
    yourSchedule: 'Programul Tău (24 ore)',
    checkSchedule: 'Verifică Programul',
    reset: 'Resetează',
    dragInstruction: 'Trage o activitate în intervalul orar dorit',
    mandatory: 'Obligatoriu',
    optional: 'Opțional',
    success: 'Felicitări! Programul tău este complet și echilibrat! 🎉',
    missingActivities: 'Lipsesc activități obligatorii:',
    invalidTime: 'Nu ai organizat toate cele 24 de ore!',
    noSpace: 'Nu este suficient spațiu pentru această activitate!',
    added: 'adăugată!',
    removed: 'eliminată',
    scheduleReset: 'Program resetat',
    totalHours: 'Total ore alocate:',
    hours: 'ore'
  },
  en: {
    title: 'What I Do Today',
    subtitle: 'Organize your day by dragging activities into time slots!',
    availableActivities: 'Available Activities',
    yourSchedule: 'Your Schedule (24 hours)',
    checkSchedule: 'Check Schedule',
    reset: 'Reset',
    dragInstruction: 'Drag an activity to the desired time slot',
    mandatory: 'Mandatory',
    optional: 'Optional',
    success: 'Congratulations! Your schedule is complete and balanced! 🎉',
    missingActivities: 'Missing mandatory activities:',
    invalidTime: 'You haven\'t organized all 24 hours!',
    noSpace: 'Not enough space for this activity!',
    added: 'added!',
    removed: 'removed',
    scheduleReset: 'Schedule reset',
    totalHours: 'Total hours allocated:',
    hours: 'hours'
  },
  de: {
    title: 'Was mache ich heute',
    subtitle: 'Organisiere deinen Tag, indem du Aktivitäten in Zeitfenster ziehst!',
    availableActivities: 'Verfügbare Aktivitäten',
    yourSchedule: 'Dein Zeitplan (24 Stunden)',
    checkSchedule: 'Zeitplan prüfen',
    reset: 'Zurücksetzen',
    dragInstruction: 'Ziehe eine Aktivität in das gewünschte Zeitfenster',
    mandatory: 'Pflicht',
    optional: 'Optional',
    success: 'Glückwunsch! Dein Zeitplan ist vollständig und ausgewogen! 🎉',
    missingActivities: 'Fehlende Pflichtaktivitäten:',
    invalidTime: 'Du hast nicht alle 24 Stunden organisiert!',
    noSpace: 'Nicht genug Platz für diese Aktivität!',
    added: 'hinzugefügt!',
    removed: 'entfernt',
    scheduleReset: 'Zeitplan zurückgesetzt',
    totalHours: 'Gesamt zugewiesene Stunden:',
    hours: 'Stunden'
  },
  fr: {
    title: 'Ce que je fais aujourd\'hui',
    subtitle: 'Organisez votre journée en faisant glisser les activités dans les créneaux horaires!',
    availableActivities: 'Activités Disponibles',
    yourSchedule: 'Votre Emploi du Temps (24 heures)',
    checkSchedule: 'Vérifier l\'emploi du temps',
    reset: 'Réinitialiser',
    dragInstruction: 'Faites glisser une activité dans le créneau horaire souhaité',
    mandatory: 'Obligatoire',
    optional: 'Facultatif',
    success: 'Félicitations! Votre emploi du temps est complet et équilibré! 🎉',
    missingActivities: 'Activités obligatoires manquantes:',
    invalidTime: 'Vous n\'avez pas organisé toutes les 24 heures!',
    noSpace: 'Pas assez d\'espace pour cette activité!',
    added: 'ajoutée!',
    removed: 'supprimée',
    scheduleReset: 'Emploi du temps réinitialisé',
    totalHours: 'Total des heures allouées:',
    hours: 'heures'
  },
  es: {
    title: 'Qué hago hoy',
    subtitle: '¡Organiza tu día arrastrando actividades a los intervalos horarios!',
    availableActivities: 'Actividades Disponibles',
    yourSchedule: 'Tu Horario (24 horas)',
    checkSchedule: 'Verificar Horario',
    reset: 'Reiniciar',
    dragInstruction: 'Arrastra una actividad al intervalo horario deseado',
    mandatory: 'Obligatorio',
    optional: 'Opcional',
    success: '¡Felicidades! ¡Tu horario está completo y equilibrado! 🎉',
    missingActivities: 'Faltan actividades obligatorias:',
    invalidTime: '¡No has organizado todas las 24 horas!',
    noSpace: '¡No hay suficiente espacio para esta actividad!',
    added: '¡añadida!',
    removed: 'eliminada',
    scheduleReset: 'Horario reiniciado',
    totalHours: 'Total de horas asignadas:',
    hours: 'horas'
  },
  it: {
    title: 'Cosa faccio oggi',
    subtitle: 'Organizza la tua giornata trascinando le attività negli slot temporali!',
    availableActivities: 'Attività Disponibili',
    yourSchedule: 'Il Tuo Programma (24 ore)',
    checkSchedule: 'Verifica Programma',
    reset: 'Ripristina',
    dragInstruction: 'Trascina un\'attività nello slot temporale desiderato',
    mandatory: 'Obbligatorio',
    optional: 'Facoltativo',
    success: 'Congratulazioni! Il tuo programma è completo ed equilibrato! 🎉',
    missingActivities: 'Attività obbligatorie mancanti:',
    invalidTime: 'Non hai organizzato tutte le 24 ore!',
    noSpace: 'Non c\'è abbastanza spazio per questa attività!',
    added: 'aggiunta!',
    removed: 'rimossa',
    scheduleReset: 'Programma ripristinato',
    totalHours: 'Totale ore assegnate:',
    hours: 'ore'
  },
  hu: {
    title: 'Mit csinálok ma',
    subtitle: 'Szervezd meg a napodat a tevékenységek időszakokba húzásával!',
    availableActivities: 'Elérhető Tevékenységek',
    yourSchedule: 'A Te Időbeosztásod (24 óra)',
    checkSchedule: 'Időbeosztás Ellenőrzése',
    reset: 'Visszaállítás',
    dragInstruction: 'Húzz egy tevékenységet a kívánt időintervallumba',
    mandatory: 'Kötelező',
    optional: 'Opcionális',
    success: 'Gratulálunk! Az időbeosztásod teljes és kiegyensúlyozott! 🎉',
    missingActivities: 'Hiányzó kötelező tevékenységek:',
    invalidTime: 'Nem szervezted meg mind a 24 órát!',
    noSpace: 'Nincs elég hely ehhez a tevékenységhez!',
    added: 'hozzáadva!',
    removed: 'eltávolítva',
    scheduleReset: 'Időbeosztás visszaállítva',
    totalHours: 'Összesen kiosztott órák:',
    hours: 'óra'
  },
  cs: {
    title: 'Co dělám dnes',
    subtitle: 'Organizujte svůj den přetažením aktivit do časových úseků!',
    availableActivities: 'Dostupné Aktivity',
    yourSchedule: 'Váš Rozvrh (24 hodin)',
    checkSchedule: 'Zkontrolovat Rozvrh',
    reset: 'Obnovit',
    dragInstruction: 'Přetáhněte aktivitu do požadovaného časového úseku',
    mandatory: 'Povinné',
    optional: 'Volitelné',
    success: 'Gratulujeme! Váš rozvrh je kompletní a vyvážený! 🎉',
    missingActivities: 'Chybějící povinné aktivity:',
    invalidTime: 'Neorganizovali jste všech 24 hodin!',
    noSpace: 'Není dostatek místa pro tuto aktivitu!',
    added: 'přidáno!',
    removed: 'odstraněno',
    scheduleReset: 'Rozvrh obnoven',
    totalHours: 'Celkový počet přidělených hodin:',
    hours: 'hodin'
  },
  pl: {
    title: 'Co robię dzisiaj',
    subtitle: 'Zorganizuj swój dzień przeciągając aktywności do przedziałów czasowych!',
    availableActivities: 'Dostępne Aktywności',
    yourSchedule: 'Twój Harmonogram (24 godziny)',
    checkSchedule: 'Sprawdź Harmonogram',
    reset: 'Resetuj',
    dragInstruction: 'Przeciągnij aktywność do wybranego przedziału czasowego',
    mandatory: 'Obowiązkowe',
    optional: 'Opcjonalne',
    success: 'Gratulacje! Twój harmonogram jest kompletny i zrównoważony! 🎉',
    missingActivities: 'Brakujące obowiązkowe aktywności:',
    invalidTime: 'Nie zorganizowałeś wszystkich 24 godzin!',
    noSpace: 'Za mało miejsca na tę aktywność!',
    added: 'dodano!',
    removed: 'usunięto',
    scheduleReset: 'Harmonogram zresetowany',
    totalHours: 'Łącznie przydzielonych godzin:',
    hours: 'godzin'
  },
  bg: {
    title: 'Какво правя днес',
    subtitle: 'Организирайте деня си, като плъзнете дейности в съответните времеви интервали!',
    availableActivities: 'Налични Дейности',
    yourSchedule: 'Вашият График (24 часа)',
    checkSchedule: 'Проверете Графика',
    reset: 'Нулиране',
    dragInstruction: 'Плъзнете дейност в желания времеви интервал',
    mandatory: 'Задължително',
    optional: 'Незадължително',
    success: 'Поздравления! Вашият график е пълен и балансиран! 🎉',
    missingActivities: 'Липсващи задължителни дейности:',
    invalidTime: 'Не сте организирали всичките 24 часа!',
    noSpace: 'Няма достатъчно място за тази дейност!',
    added: 'добавена!',
    removed: 'премахната',
    scheduleReset: 'Графикът е нулиран',
    totalHours: 'Общо разпределени часове:',
    hours: 'часа'
  },
  ru: {
    title: 'Что я делаю сегодня',
    subtitle: 'Организуй свой день, перетаскивая активности в соответствующие временные интервалы!',
    availableActivities: 'Доступные Активности',
    yourSchedule: 'Твое Расписание (24 часа)',
    checkSchedule: 'Проверить Расписание',
    reset: 'Сбросить',
    dragInstruction: 'Перетащи активность в нужный временной интервал',
    mandatory: 'Обязательно',
    optional: 'Необязательно',
    success: 'Поздравляем! Твое расписание полное и сбалансированное! 🎉',
    missingActivities: 'Отсутствуют обязательные активности:',
    invalidTime: 'Ты не организовал все 24 часа!',
    noSpace: 'Недостаточно места для этой активности!',
    added: 'добавлена!',
    removed: 'удалена',
    scheduleReset: 'Расписание сброшено',
    totalHours: 'Всего выделенных часов:',
    hours: 'часов'
  },
  pt: {
    title: 'O que faço hoje',
    subtitle: 'Organize seu dia arrastando atividades para os intervalos de tempo!',
    availableActivities: 'Atividades Disponíveis',
    yourSchedule: 'Sua Agenda (24 horas)',
    checkSchedule: 'Verificar Agenda',
    reset: 'Redefinir',
    dragInstruction: 'Arraste uma atividade para o intervalo de tempo desejado',
    mandatory: 'Obrigatório',
    optional: 'Opcional',
    success: 'Parabéns! Sua agenda está completa e equilibrada! 🎉',
    missingActivities: 'Atividades obrigatórias ausentes:',
    invalidTime: 'Você não organizou todas as 24 horas!',
    noSpace: 'Não há espaço suficiente para esta atividade!',
    added: 'adicionada!',
    removed: 'removida',
    scheduleReset: 'Agenda redefinida',
    totalHours: 'Total de horas alocadas:',
    hours: 'horas'
  },
  tr: {
    title: 'Bugün ne yapıyorum',
    subtitle: 'Aktiviteleri zaman dilimlerine sürükleyerek gününüzü organize edin!',
    availableActivities: 'Mevcut Aktiviteler',
    yourSchedule: 'Programınız (24 saat)',
    checkSchedule: 'Programı Kontrol Et',
    reset: 'Sıfırla',
    dragInstruction: 'Bir aktiviteyi istenen zaman dilimine sürükleyin',
    mandatory: 'Zorunlu',
    optional: 'İsteğe Bağlı',
    success: 'Tebrikler! Programınız eksiksiz ve dengeli! 🎉',
    missingActivities: 'Eksik zorunlu aktiviteler:',
    invalidTime: 'Tüm 24 saati organize etmediniz!',
    noSpace: 'Bu aktivite için yeterli alan yok!',
    added: 'eklendi!',
    removed: 'kaldırıldı',
    scheduleReset: 'Program sıfırlandı',
    totalHours: 'Toplam tahsis edilen saat:',
    hours: 'saat'
  },
  ar: {
    title: 'ماذا أفعل اليوم',
    subtitle: 'نظم يومك عن طريق سحب الأنشطة إلى الفترات الزمنية!',
    availableActivities: 'الأنشطة المتاحة',
    yourSchedule: 'جدولك (24 ساعة)',
    checkSchedule: 'تحقق من الجدول',
    reset: 'إعادة تعيين',
    dragInstruction: 'اسحب نشاطًا إلى الفترة الزمنية المرغوبة',
    mandatory: 'إلزامي',
    optional: 'اختياري',
    success: 'تهانينا! جدولك مكتمل ومتوازن! 🎉',
    missingActivities: 'أنشطة إلزامية مفقودة:',
    invalidTime: 'لم تنظم كل 24 ساعة!',
    noSpace: 'لا يوجد مساحة كافية لهذا النشاط!',
    added: 'مضاف!',
    removed: 'تمت الإزالة',
    scheduleReset: 'تم إعادة تعيين الجدول',
    totalHours: 'إجمالي الساعات المخصصة:',
    hours: 'ساعات'
  },
  el: {
    title: 'Τι κάνω σήμερα',
    subtitle: 'Οργανώστε τη μέρα σας σύροντας δραστηριότητες στις χρονικές θέσεις!',
    availableActivities: 'Διαθέσιμες Δραστηριότητες',
    yourSchedule: 'Το Πρόγραμμά σας (24 ώρες)',
    checkSchedule: 'Έλεγχος Προγράμματος',
    reset: 'Επαναφορά',
    dragInstruction: 'Σύρετε μια δραστηριότητα στην επιθυμητή χρονική θέση',
    mandatory: 'Υποχρεωτικό',
    optional: 'Προαιρετικό',
    success: 'Συγχαρητήρια! Το πρόγραμμά σας είναι πλήρες και ισορροπημένο! 🎉',
    missingActivities: 'Λείπουν υποχρεωτικές δραστηριότητες:',
    invalidTime: 'Δεν έχετε οργανώσει όλες τις 24 ώρες!',
    noSpace: 'Δεν υπάρχει αρκετός χώρος για αυτήν τη δραστηριότητα!',
    added: 'προστέθηκε!',
    removed: 'αφαιρέθηκε',
    scheduleReset: 'Το πρόγραμμα επαναφέρθηκε',
    totalHours: 'Σύνολο ανατεθειμένων ωρών:',
    hours: 'ώρες'
  }
};

export default function CeFacAstazi() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>('ro');
  const [schedule, setSchedule] = useState<TimeSlot[]>(() =>
    Array.from({ length: 24 }, (_, i) => ({ hour: i, activity: null }))
  );
  const [draggedActivity, setDraggedActivity] = useState<Activity | null>(null);

  const t = translations[language] || translations.ro;

  const handleDragStart = (activity: Activity) => {
    setDraggedActivity(activity);
  };

  const handleDrop = (hourIndex: number) => {
    if (!draggedActivity) return;

    const newSchedule = [...schedule];
    const duration = draggedActivity.duration;

    // Verificăm dacă avem loc pentru toată durata
    let canPlace = true;
    for (let i = 0; i < duration; i++) {
      if (hourIndex + i >= 24 || schedule[hourIndex + i].activity !== null) {
        canPlace = false;
        break;
      }
    }

    if (!canPlace) {
      toast.error(t.noSpace, { duration: 2000 });
      return;
    }

    // Plasăm activitatea
    for (let i = 0; i < duration; i++) {
      newSchedule[hourIndex + i].activity = draggedActivity;
    }

    setSchedule(newSchedule);
    setDraggedActivity(null);
    toast.success(`${draggedActivity.name[language]} ${t.added}`, { duration: 1500 });
  };

  const handleRemoveActivity = (hourIndex: number) => {
    const activityToRemove = schedule[hourIndex].activity;
    if (!activityToRemove) return;

    const newSchedule = schedule.map(slot =>
      slot.activity?.id === activityToRemove.id ? { ...slot, activity: null } : slot
    );

    setSchedule(newSchedule);
    toast.info(`${activityToRemove.name[language]} ${t.removed}`, { duration: 1500 });
  };

  const validateSchedule = () => {
    // Verificăm dacă toate cele 24 de ore sunt ocupate
    const emptySlots = schedule.filter(slot => slot.activity === null);
    if (emptySlots.length > 0) {
      toast.error(`${t.invalidTime} ${24 - emptySlots.length}/24 ${t.hours}`, { duration: 3000 });
      return;
    }

    // Verificăm activitățile obligatorii
    const mandatoryActivities = activities.filter(a => a.mandatory);
    const scheduledActivityIds = new Set(
      schedule.filter(s => s.activity !== null).map(s => s.activity!.id)
    );

    const missingMandatory = mandatoryActivities.filter(
      a => !scheduledActivityIds.has(a.id)
    );

    if (missingMandatory.length > 0) {
      toast.error(
        `${t.missingActivities} ${missingMandatory.map(a => a.name[language]).join(', ')}`,
        { duration: 4000 }
      );
      return;
    }

    // Succes!
    toast.success(t.success, { duration: 5000 });
  };

  const resetSchedule = () => {
    setSchedule(Array.from({ length: 24 }, (_, i) => ({ hour: i, activity: null })));
    toast.info(t.scheduleReset, { duration: 2000 });
  };

  const allocatedHours = schedule.filter(s => s.activity !== null).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => navigate('/')}>
          <Home className="h-5 w-5 mr-2" />
          Acasă
        </Button>
        <Select value={language} onValueChange={(val) => setLanguage(val as Language)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ro">🇷🇴 RO</SelectItem>
            <SelectItem value="en">🇬🇧 EN</SelectItem>
            <SelectItem value="de">🇩🇪 DE</SelectItem>
            <SelectItem value="fr">🇫🇷 FR</SelectItem>
            <SelectItem value="es">🇪🇸 ES</SelectItem>
            <SelectItem value="it">🇮🇹 IT</SelectItem>
            <SelectItem value="hu">🇭🇺 HU</SelectItem>
            <SelectItem value="cs">🇨🇿 CS</SelectItem>
            <SelectItem value="pl">🇵🇱 PL</SelectItem>
            <SelectItem value="bg">🇧🇬 BG</SelectItem>
            <SelectItem value="ru">🇷🇺 RU</SelectItem>
            <SelectItem value="pt">🇵🇹 PT</SelectItem>
            <SelectItem value="tr">🇹🇷 TR</SelectItem>
            <SelectItem value="ar">🇸🇦 AR</SelectItem>
            <SelectItem value="el">🇬🇷 EL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
          {t.title}
        </h1>
        <p className="text-lg text-gray-600">{t.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Activități Disponibile */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-purple-600" />
              {t.availableActivities}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activities.map(activity => (
              <div
                key={activity.id}
                draggable
                onDragStart={() => handleDragStart(activity)}
                className={`${activity.color} text-white p-3 rounded-lg cursor-move hover:scale-105 transition-transform shadow-md`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{activity.emoji}</span>
                  <div className="flex-1 mx-2">
                    <p className="font-bold">{activity.name[language]}</p>
                    <p className="text-xs opacity-90">{activity.duration}h</p>
                  </div>
                  {activity.mandatory && (
                    <span className="text-xs bg-white/30 px-2 py-1 rounded">
                      {t.mandatory}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Timeline 24h */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{t.yourSchedule}</CardTitle>
              <div className="flex gap-2">
                <span className="text-sm font-bold">
                  {t.totalHours}: {allocatedHours}/24 {t.hours}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-[600px] overflow-y-auto">
              {schedule.map((slot, index) => (
                <div
                  key={index}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(index)}
                  onClick={() => slot.activity && handleRemoveActivity(index)}
                  className={`
                    border-2 border-dashed p-2 rounded-lg min-h-[50px] flex items-center
                    ${slot.activity ? `${slot.activity.color} text-white cursor-pointer hover:opacity-80` : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
                    transition-all
                  `}
                >
                  <span className="font-bold mr-3 text-sm">
                    {String(slot.hour).padStart(2, '0')}:00
                  </span>
                  {slot.activity ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{slot.activity.emoji}</span>
                      <span className="font-bold">{slot.activity.name[language]}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm italic">{t.dragInstruction}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Butoane Control */}
            <div className="flex gap-3 mt-6">
              <Button
                onClick={validateSchedule}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                {t.checkSchedule}
              </Button>
              <Button
                onClick={resetSchedule}
                variant="outline"
                size="lg"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                {t.reset}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
