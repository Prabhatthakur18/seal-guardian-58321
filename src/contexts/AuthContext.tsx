import React, { createContext, useContext, useState, useEffect } from "react";

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
  login: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  sendOTP: (email: string) => Promise<{ exists: boolean }>;
  register: (data: RegisterData) => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const sendOTP = async (email: string): Promise<{ exists: boolean }> => {
    // TODO: Implement with backend API
    // Check if user exists in database
    // If exists, send OTP to email
    // Return whether user exists
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate checking database
    const exists = Math.random() > 0.5; // Replace with actual API call
    
    if (exists) {
      console.log(`OTP sent to ${email}`);
    }
    
    return { exists };
  };

  const login = async (email: string, otp: string): Promise<void> => {
    // TODO: Implement with backend API
    // Verify OTP
    // Get user data from database
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: "123",
      email,
      name: "Test User",
      role: "customer",
      phoneNumber: "+91 98765 43210",
    };
    
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
  };

  const register = async (data: RegisterData): Promise<void> => {
    // TODO: Implement with backend API
    // Create user in database
    // Send OTP to email
    // If vendor, send validation email to representative
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (data.role === "vendor") {
      console.log("Vendor registration requires validation from representative");
      // Send email to representative for validation
    }
    
    console.log("Registration successful, OTP sent to email");
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, sendOTP, register }}>
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
