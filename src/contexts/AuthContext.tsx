
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User } from '@/types';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthState | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('family-directory-user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call - in real app this would be a backend call
      const mockUsers = JSON.parse(localStorage.getItem('family-directory-users') || '[]');
      const foundUser = mockUsers.find((u: any) => u.email === email && u.password === password);
      
      if (foundUser) {
        const userWithoutPassword = { ...foundUser };
        delete userWithoutPassword.password;
        
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        localStorage.setItem('family-directory-user', JSON.stringify(userWithoutPassword));
        
        toast({
          title: "Welcome back!",
          description: `Hello ${foundUser.fullName}, you're successfully logged in.`,
        });
        
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (email: string, password: string, fullName: string): Promise<boolean> => {
    try {
      // Check if user already exists
      const mockUsers = JSON.parse(localStorage.getItem('family-directory-users') || '[]');
      const existingUser = mockUsers.find((u: any) => u.email === email);
      
      if (existingUser) {
        toast({
          title: "Registration failed",
          description: "An account with this email already exists.",
          variant: "destructive",
        });
        return false;
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        fullName,
        familyRole: mockUsers.length === 0 ? 'admin' : 'member', // First user becomes admin
        createdAt: new Date(),
      };

      mockUsers.push(newUser);
      localStorage.setItem('family-directory-users', JSON.stringify(mockUsers));

      const userWithoutPassword = { ...newUser };
      delete userWithoutPassword.password;
      
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('family-directory-user', JSON.stringify(userWithoutPassword));

      toast({
        title: "Welcome to Family Directory!",
        description: `Account created successfully for ${fullName}.`,
      });

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration error",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('family-directory-user');
    
    toast({
      title: "Goodbye!",
      description: "You've been successfully logged out.",
    });
  };

  const value: AuthState = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
