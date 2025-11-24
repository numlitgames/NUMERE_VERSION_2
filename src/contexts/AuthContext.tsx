import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log('Session loaded:', session ? 'YES' : 'NO');
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false); // SETĂM LOADING FALSE IMEDIAT!
        
        // Verificăm admin și trackăm DUPĂ ce am setat loading
        if (session?.user) {
          console.log('User found, tracking and checking admin in background...');
          
          // Track user login (nu blochează UI-ul)
          trackUserLogin(session.user).catch(err => {
            console.error('Tracking failed:', err);
          });
          
          // Check admin status (nu blochează UI-ul)
          checkAdminStatus(session.user.id).catch(err => {
            console.error('Admin check failed:', err);
            setIsAdmin(false);
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      if (!mounted) return;
      
      console.log('Auth event:', event);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user && event === 'SIGNED_IN') {
        // Track și check în background
        trackUserLogin(session.user).catch(() => {});
        checkAdminStatus(session.user.id).catch(() => setIsAdmin(false));
      } else if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Track user activity time
  useEffect(() => {
    if (!user) return;

    let sessionStart = Date.now();
    let currentActivityLogId: string | null = null;

    // Create activity log on mount
    const createActivityLog = async () => {
      const { data, error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          session_start: new Date().toISOString(),
          time_spent: 0,
        })
        .select()
        .single();

      if (data && !error) {
        currentActivityLogId = data.id;
        console.log('✅ Activity log created:', data.id);
      } else {
        console.error('❌ Error creating activity log:', error);
      }
    };

    createActivityLog();

    // Update activity log every 30 seconds
    const interval = setInterval(async () => {
      if (!currentActivityLogId) return;

      const timeSpent = Math.floor((Date.now() - sessionStart) / 1000);
      
      console.log(`⏱️ Updating time spent: ${timeSpent}s`);
      
      const { error } = await supabase
        .from('activity_logs')
        .update({
          time_spent: timeSpent,
          session_end: new Date().toISOString(),
        })
        .eq('id', currentActivityLogId);
      
      if (error) {
        console.error('❌ Error updating activity log:', error);
      } else {
        console.log(`✅ Time updated: ${timeSpent}s`);
      }
    }, 30000); // Update every 30 seconds

    // Track page visits
    const handlePageVisit = () => {
      const currentPage = window.location.pathname;
      // This will be updated in the interval above
    };

    window.addEventListener('popstate', handlePageVisit);
    handlePageVisit();

    // Cleanup on unmount or user change
    return () => {
      clearInterval(interval);
      window.removeEventListener('popstate', handlePageVisit);

      // Final update on cleanup
      if (currentActivityLogId) {
        const timeSpent = Math.floor((Date.now() - sessionStart) / 1000);
        console.log(`🏁 Final time update on cleanup: ${timeSpent}s`);
        
        supabase
          .from('activity_logs')
          .update({
            time_spent: timeSpent,
            session_end: new Date().toISOString(),
          })
          .eq('id', currentActivityLogId)
          .then(({ error }) => {
            if (error) {
              console.error('❌ Error in final update:', error);
            } else {
              console.log('✅ Final time saved:', timeSpent, 's');
            }
          });
      }
    };
  }, [user]);

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for:', userId);
      
      // Timeout pentru a nu bloca forever
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 3000)
      );
      
      const queryPromise = supabase
        .from('users')
        .select('is_admin')
        .eq('id', userId)
        .maybeSingle();

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

      console.log('Admin check result:', { data, error });

      if (data && !error) {
        setIsAdmin(data.is_admin || false);
        console.log('Is admin:', data.is_admin);
      } else {
        setIsAdmin(false);
        console.log('Not admin or error');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const trackUserLogin = async (user: User) => {
    try {
      console.log('Tracking user login...', user.id);
      
      // Upsert user data
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata.full_name || user.user_metadata.name || 'User',
          avatar_url: user.user_metadata.avatar_url || null,
          last_login: new Date().toISOString(),
        }, {
          onConflict: 'id',
          ignoreDuplicates: false,
        });

      if (upsertError) {
        console.error('Upsert error:', upsertError);
        return; // Don't proceed if upsert fails
      }

      // Increment login count
      const { error: rpcError } = await supabase.rpc('increment_user_logins', { user_id: user.id });
      
      if (rpcError) {
        console.error('RPC error:', rpcError);
      }
      
      console.log('User login tracked successfully');
    } catch (error) {
      console.error('Error tracking user login:', error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      toast({
        title: 'Eroare autentificare',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: 'Deconectare reușită',
        description: 'Te-ai deconectat cu succes!',
      });
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: 'Eroare',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        loading,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

