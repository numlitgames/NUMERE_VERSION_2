-- =============================================
-- SUPABASE DATABASE SCHEMA FOR NUMLIT PLATFORM
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    total_sessions INTEGER DEFAULT 0,
    total_time_spent INTEGER DEFAULT 0, -- in seconds
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON public.users(is_admin);
CREATE INDEX IF NOT EXISTS idx_users_total_sessions ON public.users(total_sessions DESC);
CREATE INDEX IF NOT EXISTS idx_users_total_time_spent ON public.users(total_time_spent DESC);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policies for users table
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
-- ACTIVITY LOGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    session_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    time_spent INTEGER DEFAULT 0, -- in seconds
    page_visits JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_session_start ON public.activity_logs(session_start DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_date ON public.activity_logs(user_id, session_start);

-- Enable Row Level Security
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies for activity_logs
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
-- DAILY STATS TABLE (Aggregated statistics)
-- =============================================
CREATE TABLE IF NOT EXISTS public.daily_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    users_count INTEGER DEFAULT 0,
    sessions_count INTEGER DEFAULT 0,
    total_time INTEGER DEFAULT 0, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON public.daily_stats(date DESC);

-- Enable Row Level Security
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;

-- Policies for daily_stats
CREATE POLICY "Admins can view daily stats" ON public.daily_stats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to increment user sessions
CREATE OR REPLACE FUNCTION increment_user_sessions(user_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.users
    SET total_sessions = total_sessions + 1
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user total time
CREATE OR REPLACE FUNCTION update_user_total_time(user_id UUID, time_to_add INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE public.users
    SET total_time_spent = total_time_spent + time_to_add
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to aggregate daily stats (run via cron job or trigger)
CREATE OR REPLACE FUNCTION aggregate_daily_stats()
RETURNS VOID AS $$
DECLARE
    today DATE := CURRENT_DATE;
BEGIN
    INSERT INTO public.daily_stats (date, users_count, sessions_count, total_time)
    SELECT 
        today,
        COUNT(DISTINCT user_id),
        COUNT(*),
        COALESCE(SUM(time_spent), 0)
    FROM public.activity_logs
    WHERE DATE(session_start) = today
    ON CONFLICT (date) 
    DO UPDATE SET
        users_count = EXCLUDED.users_count,
        sessions_count = EXCLUDED.sessions_count,
        total_time = EXCLUDED.total_time;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger to update users.updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update user total time when activity log is updated
CREATE OR REPLACE FUNCTION update_user_time_on_activity_log()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.session_end IS NOT NULL AND NEW.time_spent > 0 THEN
        -- Only update if this is a new completion (session_end was NULL before)
        IF OLD.session_end IS NULL OR OLD.time_spent != NEW.time_spent THEN
            UPDATE public.users
            SET total_time_spent = total_time_spent + (NEW.time_spent - COALESCE(OLD.time_spent, 0))
            WHERE id = NEW.user_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_user_time
    AFTER UPDATE ON public.activity_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_user_time_on_activity_log();

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================

-- Note: You'll need to manually set is_admin = TRUE for your admin user
-- Example:
-- UPDATE public.users SET is_admin = TRUE WHERE email = 'your-admin@email.com';

-- =============================================
-- CRON JOB (Supabase pg_cron extension)
-- =============================================

-- To run daily stats aggregation every day at midnight:
-- SELECT cron.schedule(
--     'aggregate-daily-stats',
--     '0 0 * * *',
--     $$ SELECT aggregate_daily_stats(); $$
-- );

-- =============================================
-- NOTES FOR SETUP
-- =============================================

/*
1. Run this SQL script in your Supabase SQL Editor
2. Configure Google OAuth in Supabase Authentication settings
3. Add your domain to the allowed redirect URLs
4. Set up environment variables in your app (.env.local)
5. After first login, manually set is_admin = TRUE for your admin account:
   
   UPDATE public.users 
   SET is_admin = TRUE 
   WHERE email = 'your-admin-email@gmail.com';

6. (Optional) Enable pg_cron extension for automated daily stats
*/

