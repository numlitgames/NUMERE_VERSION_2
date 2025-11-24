import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Mapare automată între rute și nume de jocuri
 * Când adaugi un joc nou, adaugă-l aici și trackuirea va fi automată!
 */
const GAME_ROUTES: Record<string, string> = {
  '/calculeaza': 'Calculează',
  '/calculeaza-vizual': 'Calculează Vizual',
  '/balanta-magica': 'Balanța Magică',
  '/vecinii-numerelor': 'Vecinii Numerelor',
  '/magia-inmultirii': 'Magia Înmulțirii',
  '/masurarea-timpului': 'Măsurarea Timpului',
  '/majoc-cu-fractii': 'Mă Joc cu Fracții',
  '/bazele-calculului-matematic': 'Bazele Calculului Matematic',
  '/literatie': 'Literație',
  '/litera-silaba': 'Litera & Silaba',
  '/unitati-de-masura': 'Unități de Măsură',
  '/tari-capitale': 'Țări și Capitale',
  '/continente-oceane': 'Continente și Oceane',
  '/puzzle-harta': 'Puzzle Hartă',
  '/joc-steaguri': 'Joc Steaguri',
  '/aventura-busolei': 'Aventura Busolei',
  '/orientare-naturala': 'Orientare Naturală',
  '/culori': 'Culori',
  '/ce-fac-astazi': 'Ce Fac Astăzi',
  '/demo': 'Demo',
};

/**
 * Component care trackuiește automat accesările jocuri
 * Se montează o singură dată în App.tsx și monitorizează toate schimbările de rută
 */
export function GameTracker() {
  const location = useLocation();
  const { user } = useAuth();
  const lastTrackedRef = useRef<{ path: string; timestamp: number } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Trackuim doar dacă user-ul este autentificat
    if (!user) return;

    const currentPath = location.pathname;
    const gameName = GAME_ROUTES[currentPath];

    // Trackuim doar dacă ruta este un joc (există în mapare)
    if (!gameName) {
      console.log(`⏭️ Skipping non-game route: ${currentPath}`);
      return;
    }

    // Verificăm dacă am trackuit deja această rută recent (în ultimele 2 secunde)
    // Asta previne duplicate cauzate de React Strict Mode sau re-render-uri rapide
    const now = Date.now();
    if (
      lastTrackedRef.current &&
      lastTrackedRef.current.path === currentPath &&
      now - lastTrackedRef.current.timestamp < 2000
    ) {
      console.log(`⏸️ Skipping duplicate tracking for ${currentPath} (tracked ${now - lastTrackedRef.current.timestamp}ms ago)`);
      return;
    }

    // Cleanup timeout anterior dacă există
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce: așteptăm 100ms înainte de a trackui
    // Asta previne tracking multiplu dacă user-ul navighează rapid
    timeoutRef.current = setTimeout(async () => {
      try {
        console.log(`📊 Auto-tracking game access: ${gameName} at ${currentPath}`);
        
        // Inserăm în tabelul game_accesses
        // Trigger-ul din SQL va incrementa automat users.total_game_accesses
        const { error } = await supabase
          .from('game_accesses')
          .insert({
            user_id: user.id,
            game_name: gameName,
            game_path: currentPath,
            accessed_at: new Date().toISOString(),
          });

        if (error) {
          console.error('❌ Error tracking game access:', error);
        } else {
          console.log(`✅ Game access tracked: ${gameName}`);
          
          // Salvăm ultima trackuire pentru a preveni duplicate
          lastTrackedRef.current = {
            path: currentPath,
            timestamp: Date.now(),
          };
        }
      } catch (error) {
        console.error('❌ Error in GameTracker:', error);
      }
    }, 100); // Debounce de 100ms

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [location.pathname, user?.id]); // Folosim user.id în loc de user pentru a evita re-render-uri inutile

  // Component nu renderează nimic, doar trackuiește în background
  return null;
}

