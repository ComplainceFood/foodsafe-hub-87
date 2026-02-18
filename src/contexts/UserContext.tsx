
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { UserProfile } from '@/types/user';

interface UserContextType {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  isAuthenticated: false,
  loading: true,
  signOut: async () => {},
  updateProfile: async () => {},
  signIn: async () => {},
  updateUser: async () => {}
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const session = supabase.auth.getSession();

    const setupAuthListener = async () => {
      const { data } = await session;
      
      if (data?.session?.user) {
        setUser(data.session.user);
        setIsAuthenticated(true);
        await fetchProfile(data.session.user.id);
      } else {
        setLoading(false);
      }
      
      const { data: listener } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setUser(session?.user || null);
          setIsAuthenticated(!!session?.user);
          
          if (session?.user) {
            await fetchProfile(session.user.id);
          } else {
            setProfile(null);
            setLoading(false);
          }
        }
      );

      return () => {
        listener.subscription.unsubscribe();
      };
    };
    
    setupAuthListener();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user);
      setIsAuthenticated(true);
      if (data.user) {
        await fetchProfile(data.user.id);
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      if (error) {
        console.error('Error updating profile:', error);
      } else if (data) {
        setProfile(data as unknown as UserProfile);
      }
    } catch (error) {
      console.error('Unexpected error updating profile:', error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else if (data) {
        const userProfile: UserProfile = {
          id: data.id,
          full_name: data.full_name,
          email: data.email,
          role: data.role,
          department: data.department,
          organization_id: data.organization_id,
          status: data.status,
          avatar_url: data.avatar_url,
          preferences: (data.preferences as Record<string, any>) || {}
        };
        setProfile(userProfile);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoading(false);
    }
  };

  const value = {
    user, profile, isAuthenticated, loading,
    signOut, updateProfile, signIn, updateUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
