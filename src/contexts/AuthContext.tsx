
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "sonner";

interface AuthUser {
  id: string;
  email: string | undefined;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for development when Supabase is not configured
const mockUser: AuthUser = {
  id: "mock-user-id",
  email: "mock@example.com"
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth
  useEffect(() => {
    // If Supabase is not configured, use mock user in development
    if (!isSupabaseConfigured()) {
      setUser(mockUser);
      setIsLoading(false);
      return;
    }

    // Set initial session from Supabase
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email
          });
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email
          });
        } else {
          setUser(null);
        }

        setIsLoading(false);
      }
    );

    // Clean up auth listener on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Authentication methods
  const signUp = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      toast.success("Mock signup successful!");
      setUser(mockUser);
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        toast.error(error.message);
        return { error };
      }
      
      toast.success("Signup successful! Please check your email to verify your account.");
      return { error: null };
    } catch (error) {
      toast.error("An unexpected error occurred during signup");
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      toast.success("Mock login successful!");
      setUser(mockUser);
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast.error(error.message);
        return { error };
      }
      
      toast.success("Login successful!");
      return { error: null };
    } catch (error) {
      toast.error("An unexpected error occurred during login");
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      setUser(null);
      toast.success("Mock logout successful!");
      return;
    }

    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error signing out");
      console.error(error);
    }
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured()) {
      toast.success("Mock password reset email sent!");
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        toast.error(error.message);
        return { error };
      }
      
      toast.success("Password reset email sent. Please check your inbox.");
      return { error: null };
    } catch (error) {
      toast.error("An unexpected error occurred");
      return { error: error as Error };
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
