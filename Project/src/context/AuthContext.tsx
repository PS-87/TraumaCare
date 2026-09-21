import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface Profile {
  full_name: string;
  case_id: string;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, caseId: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, case_id')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Profile load error:', error.message);
      setProfile(null);
      return;
    }

    if (data) {
      setProfile(data as Profile);
    } else {
      // Create a default profile row if it doesn't exist yet
      const { data: created } = await supabase
        .from('profiles')
        .insert({ id: userId, full_name: 'Protected Witness', case_id: 'CR-2026-WB-092' })
        .select('full_name, case_id')
        .maybeSingle();

      setProfile((created as Profile | null) ?? { full_name: 'Protected Witness', case_id: 'CR-2026-WB-092' });
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        loadProfile(data.session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        (async () => {
          await loadProfile(newSession.user.id);
        })();
      } else {
        setProfile(null);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  async function refreshProfile() {
    if (session?.user) await loadProfile(session.user.id);
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? error.message : null };
  }

  async function signUp(email: string, password: string, fullName: string, caseId: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };

    if (data.user) {
      const { error: profileErr } = await supabase
        .from('profiles')
        .insert({ id: data.user.id, full_name: fullName, case_id: caseId });

      if (profileErr) {
        return { error: 'Account created but profile save failed: ' + profileErr.message };
      }
    }

    return { error: null };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null);
  }

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
