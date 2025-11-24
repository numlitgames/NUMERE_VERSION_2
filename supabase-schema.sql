-- =============================================
-- SUPABASE DATABASE SCHEMA FOR NUMLIT PLATFORM
-- Trackuiește logări, timp petrecut și ACCESĂRI JOCURI
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS TABLE - Profiluri utilizatori
-- =============================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    total_logins INTEGER DEFAULT 0, -- număr de logări (autentificări)
    total_game_accesses INTEGER DEFAULT 0, -- număr TOTAL de accesări jocuri (ce vrea profesorul)
    total_time_spent INTEGER DEFAULT 0, -- timp total petrecut (secunde)
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexuri pentru performanță
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON public.users(is_admin);
CREATE INDEX IF NOT EXISTS idx_users_total_game_accesses ON public.users(total_game_accesses DESC);
CREATE INDEX IF NOT EXISTS idx_users_total_time_spent ON public.users(total_time_spent DESC);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON public.users(last_login DESC);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policies pentru users
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

CREATE POLICY "Admins can update all users" ON public.users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

CREATE POLICY "System can insert users" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- =============================================
-- ACTIVITY LOGS TABLE - Sesiuni de timp
-- =============================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    session_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    time_spent INTEGER DEFAULT 0, -- secunde
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexuri
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_session_start ON public.activity_logs(session_start DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_date ON public.activity_logs(user_id, session_start);

-- Enable Row Level Security
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own activity" ON public.activity_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity" ON public.activity_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity" ON public.activity_logs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity" ON public.activity_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- =============================================
-- GAME ACCESSES TABLE - Trackuiește fiecare click pe joc
-- =============================================
CREATE TABLE IF NOT EXISTS public.game_accesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    game_name TEXT NOT NULL, -- ex: "Calculeaza", "Balanta Magica"
    game_path TEXT NOT NULL, -- ex: "/calculeaza", "/balanta-magica"
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexuri pentru query-uri rapide
CREATE INDEX IF NOT EXISTS idx_game_accesses_user_id ON public.game_accesses(user_id);
CREATE INDEX IF NOT EXISTS idx_game_accesses_game_name ON public.game_accesses(game_name);
CREATE INDEX IF NOT EXISTS idx_game_accesses_accessed_at ON public.game_accesses(accessed_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_accesses_user_game ON public.game_accesses(user_id, game_name);

-- Enable Row Level Security
ALTER TABLE public.game_accesses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can insert their own game accesses" ON public.game_accesses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own game accesses" ON public.game_accesses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all game accesses" ON public.game_accesses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function: Incrementează numărul de logări
CREATE OR REPLACE FUNCTION increment_user_logins(user_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.users
    SET total_logins = total_logins + 1,
        last_login = NOW()
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Actualizează updated_at la modificări
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Actualizează timpul total la update activity log
-- IMPORTANT: Recalculează timpul total din toate sesiunile user-ului
CREATE OR REPLACE FUNCTION update_user_time_on_activity_log()
RETURNS TRIGGER AS $$
BEGIN
    -- Recalculăm timpul total din toate activity_logs pentru acest user
    UPDATE public.users
    SET total_time_spent = (
        SELECT COALESCE(SUM(time_spent), 0)
        FROM public.activity_logs
        WHERE user_id = NEW.user_id
    )
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Incrementează numărul de accesări jocuri (AUTOMAT la INSERT)
CREATE OR REPLACE FUNCTION increment_game_accesses()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.users
    SET total_game_accesses = total_game_accesses + 1
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger: Actualizează users.updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Actualizează timpul total când activity log se modifică (UPDATE)
CREATE TRIGGER trigger_update_user_time
    AFTER UPDATE ON public.activity_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_user_time_on_activity_log();

-- Trigger: Actualizează timpul total când se creează activity log nou (INSERT)
CREATE TRIGGER trigger_insert_user_time
    AFTER INSERT ON public.activity_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_user_time_on_activity_log();

-- Trigger: Incrementează automat total_game_accesses când se adaugă o accesare
CREATE TRIGGER trigger_increment_game_accesses
    AFTER INSERT ON public.game_accesses
    FOR EACH ROW
    EXECUTE FUNCTION increment_game_accesses();

-- =============================================
-- NOTES FOR SETUP
-- =============================================

/*
📋 PAȘI DE CONFIGURARE:

1. Șterge toate tabelele existente din Supabase (dacă există)
2. Rulează acest SQL în Supabase SQL Editor
3. Configurează Google OAuth în Supabase Authentication
4. Adaugă environment variables în .env.local:
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key

5. După prima logare, setează manual admin:
   
   UPDATE public.users 
   SET is_admin = TRUE 
   WHERE email = 'your-admin-email@gmail.com';

6. Gata! Aplicația va trackui automat:
   ✅ Numărul de logări (total_logins)
   ✅ Numărul de accesări jocuri (total_game_accesses) - CE VREA PROFESORUL
   ✅ Timpul petrecut (total_time_spent)
   ✅ Detalii despre fiecare joc accesat (game_accesses table)

📊 CE VEDE PROFESORUL ÎN ADMIN:
- Total accesări jocuri (numărul de clickuri pe jocuri)
- Top jocuri preferate per elev
- Când a accesat fiecare joc
- Timp petrecut total
- Ultima vizită
*/
