import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

export type UserRole = "customer" | "vendor";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phoneNumber: string;
  isValidated?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session?.user) {
          setTimeout(() => {
            fetchUserData(session.user);
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserData(session.user).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (authUser: SupabaseUser) => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      const { data: userRole } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", authUser.id)
        .single();

      const { data: verification } = await supabase
        .from("vendor_verification")
        .select("is_verified")
        .eq("user_id", authUser.id)
        .maybeSingle();

      if (profile && userRole) {
        setUser({
          id: authUser.id,
          email: profile.email,
          name: profile.name,
          role: userRole.role as UserRole,
          phoneNumber: profile.phone_number,
          isValidated: verification?.is_verified || userRole.role === "customer",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          name: data.name,
          phone_number: data.phoneNumber,
          role: data.role,
        },
      },
    });

    if (error) throw error;

    // If vendor, trigger verification email (will be functional when email service is configured)
    if (data.role === "vendor") {
      try {
        await supabase.functions.invoke("send-vendor-verification", {
          body: { email: data.email, name: data.name },
        });
      } catch (err) {
        console.log("Vendor verification email pending email service configuration");
      }
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
